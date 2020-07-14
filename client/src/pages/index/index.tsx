import Taro, { useState, useEffect, usePullDownRefresh, useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import NavBar from 'taro-navigationbar'

import Avatar from '@/components/Avatar'
import ClassItem from '@/components/ClassItem'
import { SEARCH_CLASS, CREATE_CLASS, CLASS_DETAIL, JOIN_INFO } from '@/constants/page'
// import AuthModal from '@/components/AuthModal'

import './index.scss'
import defaulAvatar from '../../assets/default_avatar.png'
import joinClass from '../../assets/illustration_join_class.png'
import createClass from '../../assets/illustration_create_class.png'
import empty from '../../assets/illustration_empty.png'
import AuthModal from '@/components/AuthModal'
import { LOADING, EXPECTION } from '@/constants/toast'
import { showToast, showLimitModal } from '@/utils/utils';
import { getLevel } from '@/utils/callcloudfunction'
import { LIMITSTORAGE } from '@/constants/storage'
import Tag from '@/components/Tag'
import { PRO_TEXT_COLOR, PRO_BG_COLOR } from '@/constants/theme'

let createClasses
function Index() {
  const [navHeight, setNavHeight] = useState(0)
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(defaulAvatar)
  const [nickname, setNickname] = useState('未授权')
  const [isAuth, setIsAuth] = useState(false)
  const [joinClasses, setJoinClasses] = useState([])
  const [userLevel, setUserLevel] = useState('normal')

  const navigateTo = (url: string) => {
    Taro.navigateTo({ url });
  }

  const bindCreateClass = () => {
    if (!isAuth) {
      setShowAuthModal(true)
      return
    }
    const limitInfo = Taro.getStorageSync(LIMITSTORAGE) || []
    if (!limitInfo['createLimit']) {
      showToast(EXPECTION)
      return
    }

    if (limitInfo['createLimit'] > createClasses.length) {
      navigateTo(CREATE_CLASS)
    } else {
      showLimitModal('提示', '创建班级数已满，您需要升级账户', '升级 Pro')
    }

  }

  const fetchLimitInfo = async () => {
  console.log('fetch limitinfo');
  
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
      fetchLimitInfo()
      Taro.hideLoading()
    } catch (error) {
      showToast(EXPECTION)
    }
  }

  useDidShow(() => {
    fetchLimitInfo()
  })


  usePullDownRefresh(() => {
    fetchIndexData()
  })

  useEffect(() => {
    fetchIndexData()
  }, [])

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
  }, [])

  useEffect(() => {
    // 获取用户信息
    Taro.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          setIsAuth(true)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          Taro.getUserInfo({
            success: res => {
              setAvatarUrl(res.userInfo.avatarUrl)
              setNickname(res.userInfo.nickName)
            }
          })
        }
      }
    })
  })

  const classItemsDom = joinClasses.map(item => {
    return (<ClassItem
      onClick={() => { navigateTo(`${CLASS_DETAIL}?_id=${item['_id']}`) }}
      classname={item['className']}
      totalNum={item['count']}
      joinNum={item['joinUsers']['length']}
      coverImage={item['classImage']}
      isJoin={true} />)
  })

  return (
    <View className='index'>
      <NavBar />
      {showAuthModal ? <AuthModal onSuccess={() => {fetchLimitInfo()}} onClose={() => { setShowAuthModal(false) }} /> : null}
      <View
        className='user_info'
        style={{ height: `${navHeight}px`, top: `${statusBarHeight}px` }}
        onClick={() => { isAuth ? navigateTo(JOIN_INFO) : setShowAuthModal(true) }}
      >
        <Avatar radius={64} image={avatarUrl}></Avatar>
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
    </View>
  )
}
Index.config = {
  enablePullDownRefresh: true,
  backgroundTextStyle: 'dark'
}
export default Index