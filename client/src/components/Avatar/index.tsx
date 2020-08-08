import { View, Image } from "@tarojs/components"

import './index.scss'

interface IAvatarProps {
  image: string   // 传入头像 url
  radius: number    // 半径
  border?: number  // 边框宽度
}

function Avatar (props: IAvatarProps) {
  const { image, radius, border = 1} = props
  return (
    <View className='avatar_container' 
      style={{width: `${radius}rpx`, height: `${radius}rpx`}}>
      <Image
        mode='scaleToFill' 
        src={image} 
        className='avatar_image'  
        style={{width: `${radius}rpx`, height: `${radius}rpx`, border:`${border}px solid #FFFFFF`}}/>
    </View>
  )
}

export default Avatar