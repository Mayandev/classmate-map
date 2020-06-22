import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import NavBar from 'taro-navigationbar'

import Avatar from '@/components/Avatar'
import Tag from '@/components/Tag'
import AuthModal from '@/components/AuthModal'

import './index.scss'
import defaulAvatar from '../../assets/default_avatar.png'
import joinClass from '../../assets/illustration_join_class.png'
import createClass from '../../assets/illustration_create_class.png'
import empty from '../../assets/illustration_empty.png'

export default class Index extends Component {

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className='index'>
        <NavBar title='导航栏标题' />
        <View className="page">
          <View className='user_info'>
            <Avatar image={defaulAvatar}></Avatar>
            <Text className='nickname'>未授权</Text>
          </View>
          <View className='action_container'>
            <View className='action_item'>
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
              <Image className='image' src={empty}/>
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
            <View className='join_item'>
              <View className="image_container">
                <View className='mask'></View>
                <Image className='image' mode="aspectFill" src={'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/join_item.jpg'}/>
              </View>
              <View className='join_txt'>
                <View className='member'>已加入：16/37人</View>
                <View className='title'>
                  <View className='classname'>麻豆幼稚园小（2）班</View>
                  <Tag label={'已加入'}/>
                </View>
              </View>
            </View>
            <View className='join_item'>
              <View className="image_container">
                <View className='mask'></View>
                <Image className='image' mode="aspectFill" src={'https://mayandev.oss-cn-hangzhou.aliyuncs.com/blog/join_item.jpg'}/>
              </View>
              <View className='join_txt'>
                <View className='member'>已加入：16/37人</View>
                <View className='title'>
                  <View className='classname'>麻豆幼稚园小（2）班</View>
                  <Tag label={'已加入'}/>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
