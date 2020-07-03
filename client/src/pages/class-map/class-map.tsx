import { View, Map, Image, Button } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'

import Search from "@/components/Search"
import Avatar from "@/components/Avatar"
import './class-map.scss'
import avatar1 from '../../assets/icon_avatar1.png'
import iconCompass from '../../assets/icon_compass.png'
import iconPhone from '../../assets/icon_phone.png'
import iconLocation from '../../assets/icon_location.png'
import { useState, memo } from "@tarojs/taro"

const MARKERS = [
  {
    id: 1,
    longitude: 116.397128,
    latitude: 39.916527,
    iconPath: 'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/default_avatar.png',
    width: 30,
    height: 30,
    alpha: 1,
    callout: {
      content: 'xxx在地址地址',
      color: '#FFFFFF',
      borderRadius: 3,
      bgColor: '#2F54EB',
      padding: 5,
      /** 文本对齐方式。有效值: left, right, center */
      textAlign: 'center'
    }
  },
  {
    id: 2,
    longitude: 115.48251618359373,
    latitude: 38.8637141343722,
    iconPath: 'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/default_avatar.png',
    width: 30,
    height: 30,
    alpha: 1,
    callout: {
      content: 'xxx在地址地址',
      color: '#FFFFFF',
      borderRadius: 3,
      bgColor: '#2F54EB',
      padding: 5,
      /** 文本对齐方式。有效值: left, right, center */
      textAlign: 'center'
    }
  },
  {
    id: 3,
    longitude: 117.13046540234373,
    latitude: 36.66670811719837,
    iconPath: 'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/default_avatar.png',
    width: 30,
    height: 30,
    alpha: 1,
    callout: {
      content: 'xxx在地址地址',
      color: '#FFFFFF',
      borderRadius: 3,
      bgColor: '#2F54EB',
      padding: 5,
      /** 文本对齐方式。有效值: left, right, center */
      textAlign: 'center'
    }
  },
  {
    id: 4,
    longitude: 118.81137360546873,
    latitude: 32.05283697809085,
    iconPath: 'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/default_avatar.png',
    width: 30,
    height: 30,
    alpha: 1,
    callout: {
      content: 'xxx在地址地址',
      color: '#FFFFFF',
      borderRadius: 3,
      bgColor: '#2F54EB',
      padding: 5,
      /** 文本对齐方式。有效值: left, right, center */
      textAlign: 'center'
    }
  },
  {
    id: 5,
    longitude: 121.48105133984373,
    latitude: 32.05283697809085,
    iconPath: 'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/default_avatar.png',
    width: 30,
    height: 30,
    alpha: 1,
    callout: {
      content: 'xxx在地址地址',
      color: '#FFFFFF',
      borderRadius: 3,
      bgColor: '#2F54EB',
      padding: 5,
      /** 文本对齐方式。有效值: left, right, center */
      textAlign: 'center'
    }
  },
];

function ClassMap() {
  const [callOutOpen, setCallOutOpen] = useState('')
  const onRegionChange = () => {
    if (callOutOpen.length === 0) {
      return
    } else {
      setCallOutOpen('close')
    }
  }
  return (
    <View className='map_page'>
      <NavBar title='同学分布地图' back />
      <Map 
        onMarkerTap={() => {setCallOutOpen('open')}} 
        onRegionChange={onRegionChange}
        className='map' 
        markers={MARKERS} 
        scale={4}>
        <View className='search_container'>
          <View className='search_opacity'>
            <Search hint={'输入同学姓名或者地区搜索'} />
          </View>
        </View>
        <View className={`people_info ${callOutOpen}`}>
          <View className='info_avatar'>
            <Avatar image={avatar1} radius={128} border={4} />
            <View className='name'>麻花藤</View>
          </View>
          <View className='info_detail'>
            <View className='info_item'>
              <Image className='info_icon' src={iconCompass} />
              <View className='info_txt'>去向：升学 / 五道口男子技工学校</View>
            </View>
            <View className='info_item'>
              <Image className='info_icon' src={iconPhone} />
              <View className='info_txt'>电话：13412344321</View>
            </View>
            <View className='info_item'>
              <Image className='info_icon' src={iconLocation} />
              <View className='info_txt'>地址：北京市五道口男子技工学校</View>
            </View>
          </View>
          <Button onClick={() => {
          }} className='contact_btn'>一键联系</Button>
        </View>
      </Map>


    </View>
  )
}

export default memo(ClassMap)