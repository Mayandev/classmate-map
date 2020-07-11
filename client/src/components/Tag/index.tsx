import { View } from "@tarojs/components"

import './index.scss'
import { PRIMARY_BG_COLOR, PRIMARY_COLOR } from "@/constants/theme"

interface ITagProps {
  label: string           // 传入标签文字
  bgColor?: string         // 标签背景色#
  labelColor?: string      // 标签字体颜色， 默认为主题色
  width?: number
  height?: number
}


function Tag (props: ITagProps) {
  const { label, bgColor = PRIMARY_BG_COLOR, labelColor=PRIMARY_COLOR, width = 110, height = 48 } = props
  return (
    <View className='tag_container' style={{background: bgColor, width: `${width}rpx`, height: `${height}rpx`}}>
      <View className="label" style={{color: labelColor}}>{label}</View>
    </View>
  )
}

export default Tag