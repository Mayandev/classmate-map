import { View, Image, Button, Text } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useState, useDidShow, memo, useEffect, useShareAppMessage } from '@tarojs/taro'

import Tag from "@/components/Tag"
import Avatar from "@/components/Avatar"

import { JOIN_CLASS, CLASS_MAP, CLASS_DETAIL } from '@/constants/page'
import { LOADING, EXPECTION } from "@/constants/toast"
import { CLASSSTORAGE, JOINDSTORAGE } from '@/constants/storage'

import empty from '../../assets/illustration_empty.png'
import imagePlaceholder from '../../assets/image_placeholder.png'
import shareImg from '../../assets/illustration_share.png'

import './class-detail.scss'
import AuthModal from "@/components/AuthModal"


interface IClassDetailProps {
  className: string,
  creator: string,
  joinUsers: [],
  classImage: string,
  count: number
}

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
  const [isAuth, setIsAuth] = useState(false)

  const bindBtnClick = () => {
    if (isAuth) {
      isJoin ? Taro.navigateTo({url: CLASS_MAP}) : Taro.navigateTo({ url: JOIN_CLASS })
    } else {
      setShowAuthModal(true)
    }
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
        setClassState(result['data'])
        setIsJoin(result['isJoin'])
        // 缓存班级信息
        Taro.setStorageSync(CLASSSTORAGE, result['data'])
        setLoaded(true)
      }
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: EXPECTION, icon: 'none' })
    }

  }

  // 判断是否已加入
  useDidShow(() => {
    const { _id } = this.$router.params
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    fetchDetail(_id)
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
    return {
      title: `加入${classState.className}，查看同学分布地图。同学们，多联系。`,
      path: `${CLASS_DETAIL}?_id=${this.$router.params['_id']}`,
      imageUrl: shareImg
    }
  })

  const avatarDom = classState.joinUsers.map(item => {
    return (
      <View className='avatar_item'>
        <Avatar image={item['avatarUrl']} radius={60} />
      </View>
    )
  })



  return (
    <View className='page_detail'>
    
      <View className='navbar'>
        <NavBar
          home
          back
          iconTheme={'white'}
          background={'rgba(0,0,0,0)'}
          onHome={() => {
            Taro.redirectTo({ url: '/pages/index/index' });
          }} />
      </View>
      {showAuthModal ? <AuthModal onClose={() => { setShowAuthModal(false) }} /> : null}

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
            {isJoin ? '查看地图' : '加入班级'}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default memo(ClassDetail)