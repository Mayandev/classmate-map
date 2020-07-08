import { View, Map, Image, Button } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'

import Search from "@/components/Search"
import Avatar from "@/components/Avatar"
import './class-map.scss'
import defaulAvatar from '../../assets/default_avatar.png'
import iconCompass from '../../assets/icon_compass.png'
import iconPhone from '../../assets/icon_phone.png'
import iconLocation from '../../assets/icon_location.png'
import { useState, memo, useEffect } from "@tarojs/taro"
import { LOADING } from '@/constants/toast'
import { JOINUSERS } from '@/constants/storage'

interface IUserProps {
  avatarUrl: string
  name: string,
  place: string,
  state: string,
  address: string,
  phone: string
}

let joinUsers
function ClassMap() {
  const [callOutOpen, setCallOutOpen] = useState('')
  const [marks, setMarks] = useState(new Array())
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 39.92,
    longitude: 116.46
  })
  const defaultUserProps: IUserProps = {
    avatarUrl: defaulAvatar,
    name: '',
    place: '',
    state: '',
    address: '',
    phone: ''
  }
  const [currentUser, setCurrentUser] = useState<IUserProps>(defaultUserProps)
  const fetchCurLocation = async () => {
    const { longitude, latitude } = await Taro.getLocation({type: 'wgs84'})
    setCurrentLocation({longitude, latitude})
  }

  useEffect(() => {
    Taro.showLoading({ title: LOADING })
    // 从缓存获取 joinUser 的信息
    joinUsers = Taro.getStorageSync(JOINUSERS) || []
    let markArray = Array()
    joinUsers.map(user => {
      const mark = {
        id: user['openId'],
        longitude: user['location']['longitude'],
        latitude: user['location']['latitude'],
        iconPath: user['avatarUrl'],
        width: 30,
        height: 30,
        alpha: 1,
        callout: {
          content: `我在${user['address']}`,
          color: '#FFFFFF',
          borderRadius: 3,
          bgColor: '#2F54EB',
          padding: 5,
          /** 文本对齐方式。有效值: left, right, center */
          textAlign: 'center'
        }
      }
      markArray.push(mark)
    })
    console.log(markArray);
    
    fetchCurLocation()
    setMarks(markArray)
    Taro.hideLoading()
  }, [])

  const onRegionChange = () => {
    if (callOutOpen.length === 0) {
      return
    } else {
      setCallOutOpen('close')
    }
  }

  const onMarkerTap = (e) => {
    const { markerId } = e
    const [user] = joinUsers.filter(user => user.openId === markerId)
    setCurrentUser(user)
    setCallOutOpen('open')
  }
  return (
    <View className='map_page'>
      <NavBar title='同学分布地图' back />
      <Map
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        onMarkerTap={onMarkerTap}
        onRegionChange={onRegionChange}
        className='map'
        markers={marks}
        scale={4}>
        <View className='search_container'>
          <View className='search_opacity'>
            <Search hint={'输入同学姓名或者地区搜索'} />
          </View>
        </View>
        <View className={`people_info ${callOutOpen}`}>
          <View className='info_avatar'>
            <Avatar image={currentUser.avatarUrl} radius={128} border={4} />
            <View className='name'>{currentUser.name}</View>
          </View>
          <View className='info_detail'>
            <View className='info_item' onClick={() => {Taro.setClipboardData({data: currentUser.place})}}>
              <Image className='info_icon' src={iconCompass} />
              <View className='info_txt'>去向：{currentUser.state} / {currentUser.place}</View>
            </View>
            <View onClick={() => {Taro.setClipboardData({data: currentUser.phone})}} className='info_item'>
              <Image className='info_icon' src={iconPhone} />
              <View className='info_txt'>电话：{currentUser.phone}</View>
            </View>
            <View onClick={() => {Taro.setClipboardData({data: currentUser.address})}} className='info_item'>
              <Image className='info_icon' src={iconLocation} />
              <View className='info_txt'>地址：{currentUser.address}</View>
            </View>
          </View>
          <Button onClick={() => {
            Taro.makePhoneCall({phoneNumber: currentUser.phone})
          }} className='contact_btn'>一键联系</Button>
        </View>
      </Map>


    </View>
  )
}

export default memo(ClassMap)