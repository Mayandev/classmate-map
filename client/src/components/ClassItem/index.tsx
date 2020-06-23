import { View, Image } from '@tarojs/components'

import Tag from '@/components/Tag'
import './index.scss'

interface IClassItemProps {
  classname: string     // 班级名称
  joinNum: number       // 已加入
  totalNum: number      // 总人数
  coverImage: string    // 封面图片
}

function ClassItem(props: IClassItemProps) {
  const {classname, joinNum, totalNum, coverImage} = props;
  return (
    <View className='join_item'>
      <View className="image_container">
        <View className='mask'></View>
        <Image className='image' mode="aspectFill" src={coverImage} />
      </View>
      <View className='join_txt'>
        <View className='member'>已加入：{joinNum}/{totalNum}人</View>
        <View className='title'>
          <View className='classname'>{classname}</View>
          <Tag label={'已加入'} />
        </View>
      </View>
    </View>
  )
}

export default ClassItem