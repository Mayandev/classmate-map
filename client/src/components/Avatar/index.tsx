import { View, Image } from "@tarojs/components"

import './index.scss'

interface IAvatarProps {
  image: string   // 传入头像 url
}

function Avatar (props: IAvatarProps) {
  const { image } = props
  return (
    <View className='avatar_container'>
      <Image mode='aspectFill' src={image} className='avatar_image' />
    </View>
  )
}

export default Avatar