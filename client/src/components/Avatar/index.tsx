import { View, Image } from "@tarojs/components"

import './index.scss'

interface IAvatarProps {
  image: string   // 传入头像 url
  radius: number    // 半径
}

function Avatar (props: IAvatarProps) {
  const { image, radius } = props
  return (
    <View className='avatar_container' style={{width: `${radius}rpx`, height: `${radius}rpx`}}>
      <Image 
        mode='aspectFill' 
        src={image} 
        className='avatar_image'  
        style={{width: `${radius}rpx`, height: `${radius}rpx`}}/>
    </View>
  )
}

export default Avatar