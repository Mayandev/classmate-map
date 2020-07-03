import { View, Image, Button, Text } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useState, useDidShow, memo } from '@tarojs/taro'

import Tag from "@/components/Tag"
import Avatar from "@/components/Avatar"

import { JOIN_CLASS } from '@/constants/page'
import { LOADING, EXPECTION } from "@/constants/toast"
import { CLASSSTORAGE, JOINDSTORAGE } from '@/constants/storage'

import empty from '../../assets/illustration_empty.png'
import imagePlaceholder from '../../assets/image_placeholder.png'
import './class-detail.scss'


interface IClassDetailProps {
  className: string,
  creator: string,
  joinUsers: [],
  classImage: string,
  count: number
}

function ClassDetail() {
  const defaultProps: IClassDetailProps = {
    classImage: imagePlaceholder,
    creator: '',
    joinUsers: [],
    className: '',
    count: 0
  }
  const [classState, setClassState] = useState<IClassDetailProps>(defaultProps)
  const [isJoin, setIsJoin] = useState(false)
  const [loaded, setLoaded] = useState(false)
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
        setIsJoin(result['isJoin'])
        // 缓存班级信息
        Taro.setStorageSync(CLASSSTORAGE, result['data'])
        setLoaded(true)
      }
      Taro.hideLoading()
    } catch (e) {
      Taro.hideLoading()
      Taro.showToast({ title: EXPECTION, icon: 'none' })
    }

  }

  // 判断是否已加入
  useDidShow(() => {
    const { _id } = this.$router.params
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    fetchDetail(_id)
  })

  const avatarDom = classState.joinUsers.map(item => {
    return (
      <View className='avatar_item'>
        <Avatar image={item['avatarUrl']} radius={60} />
      </View>
    )
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
        <Image mode="aspectFill" className='head-img' src={classState.classImage} />
        <View className='mask'></View>
      </View>
      <View className='detail_container'>
        <View className='classname_container'>
          <View className='classname'>{classState.className}</View>
          {
            isJoin ? <Tag label={'已加入'} /> : <Tag label={'未加入'} bgColor={'#ffe7ba'} labelColor={'#fa8c16'} />
          }
        </View>
        <View className='class_info'>
          <View className='info_item'>创建人：{classState.creator}</View>
          <View className='info_item'>总人数：{classState.count}人</View>
          <View className='info_item'>已加入：{classState.joinUsers.length}人</View>
        </View>
        {
         loaded &&  
         (classState.joinUsers.length === 0
            ? (<View className='empty_container'>
              <Image className='image' src={empty} />
              <View className='empty_hint'>
                <Text>还没有同学加入，快去召唤大家~</Text>
              </View>
            </View>)
            : (
              <View className='avatars'>
                {avatarDom}
              </View>
            )
         )
        }
        <View className='action_btn_container'>
          <Button hoverClass='btn_hover' 
            className='action_btn' 
            onClick={() => { Taro.navigateTo({ url: JOIN_CLASS }) }}>
            {isJoin ? '查看地图' : '加入班级'}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default memo(ClassDetail)