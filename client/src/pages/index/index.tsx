import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import NavBar from 'taro-navigationbar'

import Avatar from '@/components/Avatar'
import ClassItem from '@/components/ClassItem'
import { SEARCH_CLASS } from '@/constants/page'
// import AuthModal from '@/components/AuthModal'

import './index.scss'
import defaulAvatar from '../../assets/default_avatar.png'
import joinClass from '../../assets/illustration_join_class.png'
import createClass from '../../assets/illustration_create_class.png'
import empty from '../../assets/illustration_empty.png'

export default class Index extends Component {

  state = {
    navHeight: 0,
    statusBarHeight: 0
  }

  componentWillMount() { }

  componentDidMount() {
    const systemInfo = Taro.getSystemInfoSync()
    const { statusBarHeight } = systemInfo
    const isiOS = systemInfo.system.indexOf('iOS') > -1 
    let navHeight = 0
    if (isiOS) {
      navHeight = 44
    } else {
      navHeight = 48
    }
    this.setState({navHeight, statusBarHeight})
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  navigateTo(url: string) {
    Taro.navigateTo({url});
  }

  render() {
    const { navHeight, statusBarHeight } = this.state;
    return (
      <View className='index'>
        <NavBar />
        <View className='user_info' style={{height: `${navHeight}px`, top: `${statusBarHeight}px`}}>
          <Avatar radius={64} image={defaulAvatar}></Avatar>
          <Text className='nickname'>未授权</Text>
        </View>
        <View className="page">
          <View className='action_container'>
            <View 
              onClick={() => {this.navigateTo(SEARCH_CLASS)}} 
              className='action_item'>
              <View className='action_txt'>
                <View className='action_title'>
                  加入班级
                </View>
                <View className='action_hint'>
                  查看同学去向
                </View>
              </View>
              <Image className="aciton_image" src={joinClass} />
            </View>
            <View className='action_item'>
              <Image className="aciton_image" src={createClass} />
              <View className='action_txt txt_right'>
                <View className='action_title'>
                  创建班级
                </View>
                <View className='action_hint'>
                  邀请同学加入
                </View>
              </View>
            </View>
          </View>
          <View className='join_container'>
            <Text className='title'>我加入的</Text>
            <View className='empty_container'>
              <Image className='image' src={empty} />
              <View className='empty_hint'>
                <Text>您还没加入任何班级</Text>
                <View>
                  <Text>你可以选择</Text>
                  <Text className='action'>加入班级</Text>
                  <Text>或者</Text>
                  <Text className='action'>创建班级</Text>
                </View>
              </View>
            </View>
            <ClassItem 
              classname={'麻豆幼稚园小（2）班'} 
              totalNum={30}
              joinNum={17}
              coverImage={'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/join_item.jpg'}/>
          </View>
        </View>
      </View>
    )
  }
}
