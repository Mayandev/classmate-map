// components
import Taro, { useState, useEffect, usePullDownRefresh, useDidShow, showActionSheet, useShareAppMessage, showLoading } from '@tarojs/taro'
import { View, Text, Image, Ad } from '@tarojs/components'
import AuthModal from '@/components/AuthModal'
import Avatar from '@/components/Avatar'
import ClassItem from '@/components/ClassItem'
import NavBar from 'taro-navigationbar'
import Tag from '@/components/Tag'
import Tooltip from '@/components/Tooltip'
// utils
import { showToast, showLimitModal, showModal } from '@/utils/utils';
import { getLevel, quitClass } from '@/utils/callcloudfunction'
// constans
import { INDEX_ACTION_SHEET, IndexActionSheet, AD_HIDDEN, ActionType } from '@/constants/data';
import { SEARCH_CLASS, CREATE_CLASS, CLASS_DETAIL, JOIN_INFO, INDEX, CHARGE, CLASS_MANAGE } from '@/constants/page'
import { LIMITSTORAGE, COLLECT_TOOLTIP_STORAGE, USERSTORAGE } from '@/constants/storage'
import { PRO_TEXT_COLOR, PRO_BG_COLOR, WARING_COLOR, PRIMARY_COLOR } from '@/constants/theme'
import { LOADING, EXPECTION, QUIT_SUCCESS } from '@/constants/toast'
// resources
import './index.scss'
import defaulAvatar from '../../assets/default_avatar.png'
import joinClass from '../../assets/illustration_join_class.png'
import createClass from '../../assets/illustration_create_class.png'
import empty from '../../assets/illustration_empty.png'
import shareImage from '../../assets/illustration_share.png'
import { get } from '@/utils/globaldata';

let createClasses
function Index() {
  const [navHeight, setNavHeight] = useState(0)
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(defaulAvatar)
  const [nickname, setNickname] = useState('未授权')
  const [isAuth, setIsAuth] = useState(false)
  const [joinClasses, setJoinClasses] = useState([])
  const [userLevel, setUserLevel] = useState('normal')


  const navigateTo = (url: string) => {
    Taro.navigateTo({ url });
  }

  const bindCreateClass = async () => {
    if (!isAuth) {
      setShowAuthModal(true)
      return
    }
    const limitInfo = Taro.getStorageSync(LIMITSTORAGE) || {}
    if (!limitInfo['createLimit']) {
      showToast(EXPECTION)
      return
    }

    if (limitInfo['createLimit'] > createClasses.length) {
      navigateTo(`${CREATE_CLASS}?action=${ActionType.CREATE}`)
    } else {
      showLimitModal('提示', '创建班级数已满，您需要升级账户', '升级 Pro')
    }

  }

  const fetchLimitInfo = async () => {
    const limitInfo = await getLevel()
    if (limitInfo && limitInfo['level']) {
      Taro.setStorageSync(
        LIMITSTORAGE,
        limitInfo['limitData']
      )
      setUserLevel(limitInfo['level'])
    }
  }

  const fetchIndexData = async () => {
    try {
      Taro.showLoading({ title: LOADING })
      const { result } = await Taro.cloud.callFunction({
        name: 'index'
      })

      if (result) {
        const data = result['joinClasses']
        setJoinClasses(data)
        createClasses = result['createClasses']
      }
      Taro.hideLoading()
    } catch (error) {
      showToast(EXPECTION)
    }
  }

  const closeTooltip = () => {
    setShowTooltip(false)
    // 缓存设置w为false
    Taro.setStorage({
      key: COLLECT_TOOLTIP_STORAGE,
      data: false
    })
  }

  const handleTooltip = async () => {
    // 获取是否关闭过 Tooltip 的缓存
    try {
      await Taro.getStorage({
        key: COLLECT_TOOLTIP_STORAGE,
        success: (res) => {
          setShowTooltip(res.data)
        },
        fail: () => {
          Taro.setStorageSync(COLLECT_TOOLTIP_STORAGE, true)
          setShowTooltip(true)
        }
      })
    } catch (error) {
      console.log(error);
    }
  }

  const setUserInfo = () => {
    const userInfo = Taro.getStorageSync(USERSTORAGE)
    if (!userInfo) {
      Taro.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            setIsAuth(true)
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            Taro.getUserInfo({
              success: res => {
                setAvatarUrl(res.userInfo.avatarUrl)
                setNickname(res.userInfo.nickName)
                console.log(res);
              }
            })
          }
        }
      })
      return
    }
    setIsAuth(true)
    setAvatarUrl(userInfo.avatarUrl)
    setNickname(userInfo.nickName)
  }

  const onAuthSuccess = () => {
    // 获取用户信息
    setUserInfo()
    // fetchLimitInfo()
  }

  const handleActionSheetClick = async () => {
    try {
      const { tapIndex } = await showActionSheet({
        itemList: INDEX_ACTION_SHEET,
      })
      console.log('tapindex。。。。。。', tapIndex);
      switch (tapIndex) {
        case IndexActionSheet.CLASS:
          navigateTo(CLASS_MANAGE)
          break;
        case IndexActionSheet.INFO:
          navigateTo(JOIN_INFO)
          break;
        case IndexActionSheet.ACCOUNT:
          navigateTo(CHARGE)
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleQuitClass = async (classId: string) => {
    try {
      const { tapIndex } = await showActionSheet({
        itemList: ['退出班级'],
        itemColor: WARING_COLOR,
      })
      if (tapIndex === 0) {
        const confirm = await showModal('是否确认退出班级', PRIMARY_COLOR)
        if (!confirm) {
          return
        }
        Taro.showLoading({ title: LOADING })
        const result = await quitClass(classId)
        
        if (result && result['code'] === 200) {
          Taro.showToast({ title: QUIT_SUCCESS })
          fetchIndexData()
        } else {
          showToast(EXPECTION)
        }
      }
    } catch (error) {
      console.log(error);
      // showToast(EXPECTION)
    }
  }

  useShareAppMessage(() => {
    return {
      title: `查看班级同学分布地图，多联(蹭)系(饭)。`,
      path: INDEX,
      imageUrl: shareImage
    }
  })

  useDidShow(() => {
    setUserInfo()
  })


  usePullDownRefresh(() => {
    fetchIndexData()
  })


  useEffect(() => {
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
    handleTooltip()
    fetchIndexData()
    fetchLimitInfo()
    
  }, [])

  const classItemsDom = joinClasses.map((item, index) => {
    if (index === 0) {
      return (
        <View>
          <ClassItem
            onClick={() => { navigateTo(`${CLASS_DETAIL}?_id=${item['_id']}`) }}
            onLongPress={() => { handleQuitClass(item['_id']) }}
            classname={item['className']}
            totalNum={item['count']}
            joinNum={item['joinUsers']['length']}
            coverImage={item['classImage']}
            isJoin={true} />
          <View className="ad_unit" hidden={get(AD_HIDDEN)}>{/*<ad-custom unit-id="adunit-96e9336972ac1da2"></ad-custom>*/}</View>
        </View>
      )
    }
    return (<ClassItem
      onClick={() => { navigateTo(`${CLASS_DETAIL}?_id=${item['_id']}`) }}
      onLongPress={() => { handleQuitClass(item['_id']) }}
      classname={item['className']}
      totalNum={item['count']}
      joinNum={item['joinUsers']['length']}
      coverImage={item['classImage']}
      isJoin={true} />)

  })

  return (
    <View className='index'>
      <NavBar />
      {showTooltip
        ? <Tooltip
          content={'添加到我的小程序'}
          top={navHeight + statusBarHeight}
          onClose={closeTooltip} />
        : null}
      {showAuthModal ? <AuthModal onSuccess={onAuthSuccess} onClose={() => { setShowAuthModal(false) }} /> : null}
      <View
        className='user_info'
        style={{ height: `${navHeight}px`, top: `${statusBarHeight}px` }}
        onClick={() => { isAuth ? handleActionSheetClick() : setShowAuthModal(true) }}
      >
        <Avatar radius={64} image={avatarUrl} border={2}></Avatar>
        <Text className='nickname'>{nickname}</Text>
        {
          userLevel == 'normal' ? null : <View style={{ marginLeft: '15rpx' }}>
            <Tag
              label={userLevel}
              labelColor={PRO_TEXT_COLOR}
              bgColor={PRO_BG_COLOR}
              height={40}
              width={60} />
          </View>
        }
      </View>
      <View className="page">
        <View className='action_container'>
          <View
            onClick={() => { navigateTo(SEARCH_CLASS) }}
            className='action_item'>
            <View className='action_txt'>
              <View className='action_title'>
                加入班级
              </View>
              <View className='action_hint'>
                查看同学去向
              </View>
            </View>
            <Image className="aciton_image" src={joinClass} />
          </View>
          <View
            onClick={bindCreateClass}
            className='action_item'>
            <Image className='aciton_image' src={createClass} />
            <View className='action_txt txt_right'>
              <View className='action_title'>
                创建班级
              </View>
              <View className='action_hint'>
                邀请同学加入
              </View>
            </View>
          </View>
        </View>
        <View className='join_container'>
          <Text className='title'>我加入的</Text>
          {
            joinClasses.length === 0
              ? (
                <View className='empty_container'>
                  <Image className='image' src={empty} />
                  <View className='empty_hint'>
                    <Text>您还没加入任何班级</Text>
                    <View>
                      <Text>你可以选择</Text>
                      <Text className='action'>加入班级</Text>
                      <Text>或者</Text>
                      <Text className='action'>创建班级</Text>
                    </View>
                  </View>
                </View>
              )
              : classItemsDom
          }
        </View>
      </View>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-ca65da0dfdc0931c"></ad-custom>*/}
      </View>
    </View>
  )
}
Index.config = {
  enablePullDownRefresh: true,
  backgroundTextStyle: 'dark'
}
export default Index