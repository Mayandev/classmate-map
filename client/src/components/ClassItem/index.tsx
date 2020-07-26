import { View, Image } from '@tarojs/components'

import Tag from '@/components/Tag'
import './index.scss'

interface IClassItemProps {
  classname: string     // 班级名称
  joinNum: number       // 已加入
  totalNum: number      // 总人数
  coverImage: string    // 封面图片
  isJoin: boolean       // 是否已加入
  onClick?: Function     // 点击事件
  onLongPress?: Function  // 长按事件
}

function ClassItem(props: IClassItemProps) {
  const {classname, joinNum, totalNum, coverImage, isJoin, onClick, onLongPress} = props;
  return (
    <View className='join_item'
      hoverClass='join_item_hover'
      onClick={() => {onClick ? onClick() : null}}
      onLongPress = { () => {onLongPress ? onLongPress() : null} }>
      <View className="image_container">
        <View className='mask'></View>
        <Image className='image' mode="aspectFill" src={coverImage} />
      </View>
      <View className='join_txt'>
        <View className='member'>已加入：{joinNum}/{totalNum}人</View>
        <View className='title'>
          <View className='classname'>{classname}</View>
          {
            isJoin ? <Tag label={'已加入'} /> : <Tag label={'未加入'} bgColor={'#ffe7ba'} labelColor={'#fa8c16'}/>
          }
        </View>
      </View>
    </View>
  )
}

export default ClassItem