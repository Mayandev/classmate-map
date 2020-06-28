import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import NavBar from 'taro-navigationbar'

import Avatar from '@/components/Avatar'
import ClassItem from '@/components/ClassItem'
import { SEARCH_CLASS, CREATE_CLASS, CLASS_DETAIL } from '@/constants/page'
// import AuthModal from '@/components/AuthModal'

import './index.scss'
import defaulAvatar from '../../assets/default_avatar.png'
import joinClass from '../../assets/illustration_join_class.png'
import createClass from '../../assets/illustration_create_class.png'
import empty from '../../assets/illustration_empty.png'
import AuthModal from '@/components/AuthModal'

function Index () {
  const [navHeight, setNavHeight] = useState(0)
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(defaulAvatar)
  const [nickname, setNickname] = useState('未授权')
  const [isAuth, setIsAuth] = useState(false)

  const navigateTo = (url: string) => {
    Taro.navigateTo({url});
  }

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

  return (
    <View className='index'>
      <NavBar />
      { showAuthModal ? <AuthModal onClose={() => {setShowAuthModal(false)}}/> : null }
      <View 
        className='user_info' 
        style={{height: `${navHeight}px`, top: `${statusBarHeight}px`}}
        onClick={() => {isAuth ? null : setShowAuthModal(true)}}
        >
        <Avatar radius={64} image={avatarUrl}></Avatar>
        <Text className='nickname'>{nickname}</Text>
      </View>
      <View className="page">
        <View className='action_container'>
          <View 
            onClick={() => {navigateTo(SEARCH_CLASS)}} 
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
            onClick={() => {navigateTo(CREATE_CLASS)}}
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
          <ClassItem
            onClick={() => {navigateTo(CLASS_DETAIL)}}
            classname={'麻豆幼稚园小（2）班'} 
            totalNum={30}
            joinNum={17}
            coverImage={'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/join_item.jpg'}
            isJoin={true}/>
        </View>
      </View>
    </View>
  )
}

export default Index