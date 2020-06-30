import { View, Image, Button } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useEffect, useState } from '@tarojs/taro'
import Avatar from "@/components/Avatar"

import { JOIN_CLASS } from '../../constants/page'
import avatar1 from '../../assets/icon_avatar1.png'
import imagePlaceholder from '../../assets/image_placeholder.png'
import './class-detail.scss'
import { LOADING, EXPECTION } from "@/constants/toast"

interface IClassDetailProps {
  className: string,
  creator: string,
  joinUsers: [],
  classImage: string,
  count: number
}

function ClassDetail() {

  const [classState, setClassState] = useState<IClassDetailProps>({
    classImage: imagePlaceholder,
    creator: '',
    joinUsers: [],
    className: '',
    count: 0
  })
  const fetchDetail = async (_id: string) => {
    try {
      Taro.showLoading({ title: LOADING })
      // 请求班级详情数据
      const { result } = await Taro.cloud.callFunction({
        name: 'detail',
        data: {
          _id
        }
      });
      if (result) {
        setClassState(result['data'])
      }
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({title: EXPECTION, icon: 'none'})
    }

  }

  useEffect(() => {
    const { _id } = this.$router.params;
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    fetchDetail(_id)
  }, [])
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
        <Image mode="aspectFill" className='head-img' src={classState.classImage} />
        <View className='mask'></View>
      </View>
      <View className='detail_container'>
        <View className='classname'>{classState.className}</View>
        <View className='class_info'>
          <View className='info_item'>创建人：{classState.creator}</View>
          <View className='info_item'>总人数：{classState.count}人</View>
          <View className='info_item'>已加入：{classState.joinUsers.length}人</View>
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
        <Button className='action_btn' onClick={() => { Taro.navigateTo({ url: JOIN_CLASS }) }}>加入班级</Button>
      </View>
    </View>
  )
}

export default ClassDetail