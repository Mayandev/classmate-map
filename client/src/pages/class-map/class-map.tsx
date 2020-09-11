import { View, Map, Image, Button } from "@tarojs/components"
import { useState, memo, useEffect, MapContext, requirePlugin } from "@tarojs/taro"

import Search from "@/components/Search"
import Avatar from "@/components/Avatar"
import { showToast } from "@/utils/utils"
import { NavBar } from 'taro-navigationbar'
// constants
import { LOADING } from '@/constants/toast'
import { JOINUSERS } from '@/constants/storage'
import { WHEREOPTION, MAP_INFO_ACTION_SHEET, MapInfoActionSheet, MAP_REFERER, PLACEOPTION } from "@/constants/data"
// css
import './class-map.scss'
// assets
import defaulAvatar from '../../assets/default_avatar.png'
import iconCompass from '../../assets/icon_compass.png'
import iconBuilding from '../../assets/icon_building.png'
// import iconInfo from '../../assets/icon_info.png'
// import iconPhone from '../../assets/icon_phone.png'
import iconLocation from '../../assets/icon_location.png'
import { MAP_KEY } from '../../constants/data';

interface ILocationProps {
  latitude: string
  longitude: string
}
interface IUserProps {
  avatarUrl: string
  name: string,
  place: string,
  state: number,
  address: string,
  phone: string,
  updateTime: string,
  location: ILocationProps
}

let joinUsers
let mapCtx: MapContext
let routePlugin = requirePlugin('routePlan')
function ClassMap() {
  const [callOutOpen, setCallOutOpen] = useState('')
  const [marks, setMarks] = useState(new Array())
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 39.92,
    longitude: 116.46
  })
  const [scale, setScale] = useState(4)
  const defaultUserProps: IUserProps = {
    avatarUrl: defaulAvatar,
    name: '',
    place: '',
    state: 0,
    address: '',
    phone: '',
    updateTime: '',
    location: { latitude: '', longitude: '' }
  }
  const [currentUser, setCurrentUser] = useState<IUserProps>(defaultUserProps)

  const fetchCurLocation = async () => {
    console.log('fetch...current');

    const { longitude, latitude } = await Taro.getLocation({ type: 'wgs84' })
    setCurrentLocation({ longitude, latitude })
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
        iconPath: user['locationAvatar'],
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
          textAlign: 'center',
          display: 'BYCLICK'
        }
      }
      markArray.push(mark)
    })
    console.log(markArray);

    fetchCurLocation()
    setMarks(markArray)
    Taro.hideLoading()
    mapCtx = Taro.createMapContext('classmate-map')
  }, [])

  const onRegionChange = async (e) => {
    console.log(e);
    const { type, causedBy } = e;
    if (type === 'end' && causedBy === 'drag') {
      if (callOutOpen.length === 0) {
        return
      } else {
        setCallOutOpen('close')
      }
    }
  }

  const onMarkerTap = (e) => {
    const { markerId } = e
    const [user] = joinUsers.filter(user => user.openId === markerId)
    marks.map((item) => {
      if (item['id'] === markerId) {
        item['width'] = 40
        item['height'] = 40
        item['zIndex'] = 2
      } else {
        item['width'] = 30
        item['height'] = 30
        item['zIndex'] = 1
      }
    })
    setMarks(marks)
    setCurrentUser(user)
    setCallOutOpen('open')
  }

  const onNameSearch = (e) => {
    const name = e.detail.value
    const [user] = joinUsers.filter(user => user.name === name)
    // TODO: 如果有名字相同的用户怎么办
    if (!user) {
      showToast('未找到该同学')
      return
    }
    const { latitude, longitude } = user['location']
    mapCtx.moveToLocation({
      latitude,
      longitude,
    })
    setCurrentUser(user)
    setCallOutOpen('open')
  }

  const onMoreAction = async (currentUser: IUserProps) => {
    const endPoint = JSON.stringify({
      'name': currentUser.address,
      'latitude': currentUser.location.latitude,
      'longitude': currentUser.location.longitude
    })
    try {
      const { tapIndex } = await Taro.showActionSheet({
        itemList: MAP_INFO_ACTION_SHEET,
      })
      switch (tapIndex) {
        case MapInfoActionSheet.PHONE:
          Taro.makePhoneCall({ phoneNumber: currentUser.phone })
          break
        case MapInfoActionSheet.NAV:
          Taro.navigateTo({
            url: `plugin://routePlan/index?key=${MAP_KEY}&referer=${MAP_REFERER}&endPoint=${endPoint}`
          })
          break
        default:
          break
      }
    } catch (error) {
      console.log(error);
      // showToast(EXPECTION)
    }
  }



  const formatTime = (millseconds) => {
    const date = new Date(millseconds)
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`
  }
  return (
    <View className='map_page'>
      <NavBar title='同学分布地图' back />
      <Map
        id="classmate-map"
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        onMarkerTap={onMarkerTap}
        onRegionChange={onRegionChange}
        className='map'
        markers={marks}
        scale={scale}
      >
        <View className='search_container'>
          <View className='search_opacity'>
          </View>
          <Search autoFocus={false} hint={'输入同学姓名搜索'} onSearch={onNameSearch} />
        </View>
        <View className={`people_info ${callOutOpen}`}>
          <View className='info_avatar'>
            <Avatar image={currentUser.avatarUrl} radius={150} border={0} />
            <View className='name'>{currentUser.name}</View>
            <View className='time_info'>{`(信息更新于 ${formatTime(currentUser.updateTime)})`}</View>
          </View>
          <View className='info_detail'>
            <View className='info_item' onClick={() => { Taro.setClipboardData({ data: currentUser.place }) }}>
              <Image className='info_icon' src={iconCompass} />
              <View className='info_txt'>去向：{WHEREOPTION[currentUser.state]} / {currentUser.place}</View>
            </View>
            {/**
              <View className='info_item' onClick={() => { Taro.setClipboardData({ data: currentUser.place }) }}>
              <Image className='info_icon' src={iconBuilding} />
              <View className='info_txt'>{PLACEOPTION[currentUser.state]}：{currentUser.place}</View>
            </View>
            */}

            {/*<View onClick={() => {Taro.setClipboardData({data: currentUser.phone})}} className='info_item'>
              <Image className='info_icon' src={iconPhone} />
              <View className='info_txt'>电话：{currentUser.phone}</View>
            </View>*/}
            <View onClick={() => { Taro.setClipboardData({ data: currentUser.address }) }} className='info_item'>
              <Image className='info_icon' src={iconLocation} />
              <View className='info_txt'>地址：{currentUser.address}</View>
            </View>
            {/**
            <View className='info_item'>
              <Image className='info_icon' src={iconInfo} />
              <View className='info_txt'>信息：{`更新于 ${formatTime(currentUser.updateTime)}`}</View>
            </View> */}

          </View>
          <Button onClick={() => { onMoreAction(currentUser) }} className='contact_btn'>一键导航</Button>
        </View>
      </Map>

    </View>
  )
}

export default memo(ClassMap)