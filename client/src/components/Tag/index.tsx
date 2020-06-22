import { View } from "@tarojs/components"

import './index.scss'

interface ITagProps {
  label: string           // 传入标签文字
  bgColor?: string         // 标签背景色#
  labelColor?: string      // 标签字体颜色， 默认为主题色
}

function Tag (props: ITagProps) {
  const { label, bgColor = '#D6E4FF', labelColor='#2F54EB' } = props
  return (
    <View className='tag_container' style={{background: bgColor}}>
      <View className="label" style={{color: labelColor}}>{label}</View>
    </View>
  )
}

export default Tag