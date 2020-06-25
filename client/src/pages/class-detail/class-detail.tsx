import { View, Image, Button } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useEffect } from '@tarojs/taro'
import Avatar from "@/components/Avatar"

import { JOIN_CLASS } from '../../constants/page'
import avatar1 from '../../assets/icon_avatar1.png'
import './class-detail.scss'

function ClassDetail() {
  useEffect(() => {
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
  })
  return (
    <View className='page_detail'>
      <View className='navbar'>
        <NavBar
          home
          back
          iconTheme={'white'}
          background={'rgba(0,0,0,0)'}
          onHome={() => {
            Taro.redirectTo({ url: '/pages/index/index' });
          }} />
      </View>
      <View className='header'>
        <Image mode="aspectFill" className='head-img' src={'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/join_item.jpg'} />
        <View className='mask'></View>
      </View>
      <View className='detail_container'>
        <View className='classname'>麻豆幼稚园小（2）班</View>
        <View className='class_info'>
          <View className='info_item'>创建人：麻花藤</View>
          <View className='info_item'>总人数：37人</View>
          <View className='info_item'>已加入：15人</View>
        </View>
        <View className='avatars'>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
          <View className='avatar_item'>
            <Avatar image={avatar1} radius={60} />
          </View>
        </View>
        <Button className='action_btn' onClick={() => {Taro.navigateTo({url: JOIN_CLASS})}}>加入班级</Button>
      </View>
    </View>
  )
}

export default ClassDetail