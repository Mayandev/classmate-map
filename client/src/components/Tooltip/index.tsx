import { memo } from "@tarojs/taro"
import { View, Image } from "@tarojs/components"

import toolTipClose from '../../assets/icon_tooltip_close.png'
import menuMore from '../../assets/icon_menu_more.png'
import './index.scss'

interface ITooltipProps {
  content: string,
  top: number   // 距离上方的距离
  onClose: Function
}

function Tooltiop(props: ITooltipProps) {
  const { content, top, onClose } = props

  return (
    <View className='tooltip-container' style={{ top: `${top}px` }}>
      <View className='tooltip'>
        <View>点击</View>
        <Image src={menuMore} className='icon_menu_more' />
        <View>{content}</View>
      </View>
      <View onClick={() => { onClose() }} className='tooltip-close'>
        <Image src={toolTipClose} className='close-icon' />
      </View>
    </View>
  )
}

export default memo(Tooltiop)