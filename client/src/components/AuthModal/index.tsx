import { View, Image, Button } from "@tarojs/components"

import './index.scss'
import rocket from '../../assets/illustration_login.png'
import close from '../../assets/icon_close.png'

function AuthModal() {
  // 防止滚动穿透
  const handleTouchMove = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  return (
    <View className='auth_modal' onTouchMove={handleTouchMove}>
      <View className='modal_container'>
        <View className='modal_title-container'>
          <View className='modal_title'>您还未授权</View>
          <View className='modal_desc'>请先授权登录进行操作</View>
        </View>
        <Image className="rocket" src={rocket} />
        <Button className='auth_btn'>确认授权</Button>
        <View className='modal_close'>
          <Image className='close_icon' src={close}></Image>
        </View>
      </View>
      <View className='modal_mask'></View>
    </View>
  );
}

export default AuthModal

