import { memo } from "@tarojs/taro"
import { View, Image } from "@tarojs/components"

import toolTipClose from '../../assets/icon_tooltip_close.png'
import './index.scss'

interface ITooltipProps {
  content: string,
  top: number   // 距离上方的距离
  onClose: Function
}

function Tooltiop(props: ITooltipProps) {
  const { content, top, onClose } = props

  return (
    <View className='tooltip-container' style = {{top: `${top}px`}}>
      <View className='tooltip'>
        {content}
      </View>
      <View onClick={()=>{onClose()}} className='tooltip-close'>
        <Image src={toolTipClose} className='close-icon'/>
      </View>
    </View>
  )
}

export default memo(Tooltiop)