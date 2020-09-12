import { View, Image, Button, Text } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useState, useDidShow, memo, useEffect, useShareAppMessage, usePageScroll } from '@tarojs/taro'

import Tag from "@/components/Tag"
import Avatar from "@/components/Avatar"

import { JOIN_INFO, CLASS_MAP, CLASS_DETAIL } from '@/constants/page'
import { LOADING, EXPECTION, JOIN_SUCCESS } from "@/constants/toast"
import { CLASSSTORAGE, JOININFO, JOINUSERS, USERSTORAGE, CLASS_SHARE_TOOLTIP_STORAGE, LIMITSTORAGE } from '@/constants/storage'

import empty from '../../assets/illustration_empty.png'
import imagePlaceholder from '../../assets/image_placeholder.png'

import './class-detail.scss'
import AuthModal from "@/components/AuthModal"
import TokenModal from "@/components/TokenModal"
import { showToast, showLimitModal } from '@/utils/utils';
import { isClassFull, getLevel } from "@/utils/callcloudfunction"
import Tooltip from "@/components/Tooltip"
import { get } from "@/utils/globaldata"
import { AD_HIDDEN } from "@/constants/data"


interface IClassDetailProps {
  className: string,
  creator: string,
  joinUsers: [],
  classImage: string,
  count: number
}

let isInfoSaved = false
let token
let classId
let classImage
let classCreator
function ClassDetail() {
  const defaultProps: IClassDetailProps = {
    classImage: imagePlaceholder,
    creator: '',
    joinUsers: [],
    className: '',
    count: 0
  }
  const [classState, setClassState] = useState<IClassDetailProps>(defaultProps)
  const [isJoin, setIsJoin] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [joinUsers, setJoinUsers] = useState([])
  const [navOpacity, setNavOpacity] = useState(0)
  const [navIconTheme, setNavIconTheme] = useState('white')
  const [showTooltip, setShowTooltip] = useState(false)
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [navHeight, setNavHeight] = useState(0)


  const bindBtnClick = () => {
    // 首先判断是否授权
    if (!isAuth) {
      setShowAuthModal(true)
      return
    }
    console.log(isInfoSaved);

    // 判断是否填写了信息
    if (!isInfoSaved) {
      Taro.navigateTo({ url: JOIN_INFO })
      return
    }

    // 弹出口令填写弹窗
    if (!isJoin) {
      setShowTokenModal(true)
      return;
    }

    // TODO: 跳转到地图页面
    Taro.navigateTo({ url: CLASS_MAP })

  }
  const fetchDetail = async (_id: string) => {
    try {
      Taro.showLoading({ title: LOADING })
      // 请求班级详情数据
      const { result } = await Taro.cloud.callFunction({
        name: 'detail',
        data: {
          _id
        }
      });
      if (result) {
        setClassState(result['classData'])
        setIsJoin(result['isJoin'])
        setJoinUsers(result['infoData'])
        // 缓存班级信息
        Taro.setStorage({ key: CLASSSTORAGE, data: result['classData'] })
        // 缓存加入用户的信息
        Taro.setStorage({ key: JOINUSERS, data: result['infoData'] })
        token = result['classData']['token']
        classImage = result['classData']['classImage']
        classCreator = result['classData']['creator']
        setLoaded(true)
      }
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: EXPECTION, icon: 'none' })
    }

  }

  const fetchSavedInfo = async () => {
    const { result } = await Taro.cloud.callFunction({
      name: 'info',
      data: {
        $url: 'get'
      }
    })
    if (result && result['data'].length > 0) {
      const info = result['data'][0]
      Taro.setStorage({
        key: JOININFO,
        data: info
      })
      isInfoSaved = true
    }
  }


  const checkToken = async (e) => {
    console.log(e);
    const value = e.detail.value['token']
    if (value !== token) {
      showToast('口令错误')
      return
    }

    // TODO: 插入数据，跳转到地图页面
    try {
      Taro.showLoading({ title: LOADING })
      // 判断是否已经加满
      const fullData = await isClassFull(classId);
      console.log('isFull', fullData);
      if (fullData && fullData['isFull'] == true) {
        showToast('班级人数已满')
        setShowTokenModal(false)
        return
      }
      
      // 获取 infoId
      const info = Taro.getStorageSync(JOININFO)
      // 调用加入接口
      const { result } = await Taro.cloud.callFunction({
        name: 'join',
        data: {
          infoId: info['_id'],
          classId: classId
        }
      })
      console.log(result)
      if (result && result['code'] == 500) {
        showLimitModal('提示', '您加入的班级数已满，升级为 pro 账户可以加入此的班级', '了解一下')
        setShowTokenModal(false)
        Taro.hideLoading()
        return
      }
      if (result && result['code'] == 200 && result['data']['classRes']['stats']['updated']) {
        setShowTokenModal(false)
        await fetchDetail(classId)
        Taro.showToast({ title: JOIN_SUCCESS })
        setTimeout(() => {
          // 关闭弹窗
          Taro.navigateTo({url: CLASS_MAP})
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      showToast(EXPECTION)
    }
  }

  const onAuthSuccess = () => {

    if (!isInfoSaved) {
      setTimeout(() => {
        Taro.navigateTo({ url: JOIN_INFO })
      }, 1500)
    }
  }

  const handleTooltip = async () => {
    // 获取是否关闭过 Tooltip 的缓存
    try {
      await Taro.getStorage({
        key: CLASS_SHARE_TOOLTIP_STORAGE,
        success: (res) => {
          setShowTooltip(res.data)
        },
        fail: () => {
          Taro.setStorageSync(CLASS_SHARE_TOOLTIP_STORAGE, true)
          setShowTooltip(true)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const closeTooltip = () => {
    setShowTooltip(false)
    // 缓存设置w为false
    Taro.setStorage({
      key: CLASS_SHARE_TOOLTIP_STORAGE,
      data: false
    })
  }

  usePageScroll(res => {
    const { scrollTop } = res
    if (scrollTop < 20 && scrollTop >= 0) {
      Taro.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff',
      })
      setNavIconTheme('white')
      setNavOpacity(0)
      return
    } else if (scrollTop >= 20 && scrollTop < 40) {
      Taro.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#000000',
      })
      setNavIconTheme('dark')
      setNavOpacity(0.2)
    } else if (scrollTop >= 40 && scrollTop < 60) {
      setNavOpacity(0.4)
    } else if (scrollTop >= 60 && scrollTop < 80) {
      setNavOpacity(0.6)
    } else if (scrollTop >= 80 && scrollTop < 100) {
      setNavOpacity(0.8)
    } else if (scrollTop > 100 && scrollTop <= 120) {
      setNavOpacity(1)
    }
  })

  useEffect(() => {
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    const systemInfo = Taro.getSystemInfoSync()
    const { statusBarHeight } = systemInfo
    const isiOS = systemInfo.system.indexOf('iOS') > -1
    let navHeight = 0
    if (isiOS) {
      navHeight = 44
    } else {
      navHeight = 48
    }
    setStatusBarHeight(statusBarHeight)
    setNavHeight(navHeight)
    const { _id } = this.$router.params
    classId = _id
    fetchDetail(_id)
    handleTooltip()
  }, [])

  useDidShow(() => {
    // 判断是否缓存了 infoId，如果缓存了直接用，否则取数据库
    const info = Taro.getStorageSync(JOININFO)
    if (!info) {
      fetchSavedInfo()
      return
    }
    isInfoSaved = true
  })

  useEffect(() => {
    // 获取用户信息
    Taro.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          setIsAuth(true)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框

        }
      }
    })
  }, [showAuthModal])

  useShareAppMessage(() => {
    console.log(classId, classImage);
    let shareName
    // 获取用户昵称
    const userInfo = Taro.getStorageSync(USERSTORAGE)
    if (!userInfo) {
      shareName = classCreator
    } else {
      shareName = userInfo['nickName']
    }
    return {
      title: `${shareName}邀请你加入${classState.className}，一起查看班级同学分布地图，多联(蹭)系(饭)。`,
      path: `${CLASS_DETAIL}?_id=${classId}`,
      imageUrl: classImage
    }
  })

  const avatarDom = joinUsers.map(item => {
    return (
      <View className='avatar_item'>
        <Avatar image={item['avatarUrl']} radius={80} border={0} />
      </View>
    )
  })

  return (
    <View className='page_detail'>
      {showTooltip
        ? <Tooltip
          content={'分享小程序，邀请同学'}
          top={statusBarHeight + navHeight}
          onClose={closeTooltip} />
        : null}
      <View className='navbar'>
        <NavBar
          home
          back
          iconTheme={navIconTheme}
          background={`rgba(255,255,255,${navOpacity})`}
          onHome={() => {
            Taro.redirectTo({ url: '/pages/index/index' });
          }} />
      </View>
      {showAuthModal
        ? <AuthModal
          onClose={() => { setShowAuthModal(false) }}
          onSuccess={onAuthSuccess}
        /> : null}
      {showTokenModal ? <TokenModal
        onClose={() => { setShowTokenModal(false) }}
        onCheck={checkToken} /> : null}

      <View className='header'>
        <Image mode="aspectFill" className='head-img' src={classState.classImage} />
        <View className='mask'></View>
      </View>
      <View className='detail_container'>
        <View className='classname_container'>
          <View className='classname'>{classState.className}</View>
          {
            isJoin ? <Tag label={'已加入'} /> : <Tag label={'未加入'} bgColor={'#ffe7ba'} labelColor={'#fa8c16'} />
          }
        </View>
        <View className='class_info'>
          <View className='info_item'>创建人：{classState.creator}</View>
          <View className='info_item'>总人数：{classState.count}人</View>
          <View className='info_item'>已加入：{classState.joinUsers.length}人</View>
        </View>
        {
          loaded &&
          (classState.joinUsers.length === 0
            ? (<View className='empty_container'>
              <Image className='image' src={empty} />
              <View className='empty_hint'>
                <Text>还没有同学加入，快去召唤大家~</Text>
              </View>
            </View>)
            : (
              <View className='avatars'>
                {avatarDom}
              </View>
            )
          )
        }
        <View className='action_btn_container'>
          <Button hoverClass='btn_hover'
            className='action_btn'
            onClick={bindBtnClick}>
            {isJoin ? '查看同学分布地图' : '加入班级'}
          </Button>
        </View>
      </View>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-1ea99652e18ed037"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(ClassDetail)