import { View, Image, Button } from "@tarojs/components"

import './index.scss'
import rocket from '../../assets/illustration_login.png'
import close from '../../assets/icon_close.png'
import { AUTH_SUCCESS } from "@/constants/toast"

interface IAuthModalProps {
  onClose: Function   // 关闭事件
  onSuccess?: Function // 授权成功事件
}

function AuthModal(props: IAuthModalProps) {

  const { onClose, onSuccess } = props

  // 防止滚动穿透
  const handleTouchMove = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const bindGetUserInfo = async (e) => {
    // 将用户信息进行缓存
    const data = Taro.getStorageSync('userInfo');
    if (!data && e.detail.userInfo) {
      const { userInfo } = e.detail;
      Taro.setStorage({ key: 'userInfo', data: userInfo })
      // 并请求登录云函数，获取openid
      const { result } = await Taro.cloud.callFunction({
        name: 'login',
        data: { userInfo }
      })
      if (result && result['openid']) {
        Taro.setStorage({ key: 'openid', data: result['openid'] })
        // 提示授权成功
        Taro.showToast({ title: AUTH_SUCCESS })
        // 关闭弹窗
        onClose()
        if (onSuccess) {
          onSuccess()
        }
      }

    }
  }

  return (
    <View className='auth_modal' onTouchMove={handleTouchMove}>
      <View className='modal_container'>
        <View className='modal_title-container'>
          <View className='modal_title'>您还未授权</View>
          <View className='modal_desc'>请先授权登录进行操作</View>
        </View>
        <Image className="rocket" src={rocket} />
        <Button
          hoverClass='auth_btn_hover'
          className='auth_btn'
          openType='getUserInfo'
          onGetUserInfo={bindGetUserInfo}>确认授权</Button>
        <View className='modal_close' onClick={() => { onClose() }}>
          <Image className='close_icon' src={close}></Image>
        </View>
      </View>
      <View className='modal_mask'></View>
    </View>
  )
}

export default AuthModal

