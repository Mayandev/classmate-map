import { useState, memo, useEffect, useShareAppMessage } from '@tarojs/taro';
import { View, Image, Text, Button } from "@tarojs/components";
import { NavBar } from 'taro-navigationbar'

import './create-success.scss'
import successIcon from '../../../assets/icon_create_success.png'
import copyIcon from '../../../assets/icon_copy.png'
import shareImg from '../../../assets/illustration_share.png'
import { CLASS_DETAIL } from '@/constants/page'
import { SHARE_TITLE } from '@/constants/toast';

function CreateSuccess() {
  const [token, setToken] = useState<string>('')
  const [classId, setClassId] = useState(null)

  const copyToken = (token: string) => {
    Taro.setClipboardData({ data: token })
  }

  useEffect(() => {
    const { _id, token } = this.$router.params
    console.log(_id, token);
    
    setToken(token)
    setClassId(_id)
  }, [])

  useShareAppMessage(() => {
    return {
      title: SHARE_TITLE,
      path: `${CLASS_DETAIL}?_id=${classId}`,
      imageUrl: shareImg
    }
  })
  return (
    <View className='success_page'>
      <NavBar back />
      <Image src={successIcon} className='success_icon' />
      <View className='success_title'>创建成功</View>
      <View className='success_info' onClick={() => { copyToken(token) }}>
        <Text>加入口令：</Text>
        <Text className='token'>{token}</Text>
        <Image src={copyIcon} className='copy_icon' />
      </View>
      <Button
        className='class_btn'
        hoverClass='btn_hover'
        onClick={() => { Taro.redirectTo({ url: `${CLASS_DETAIL}?_id=${classId}` }) }}>查看班级</Button>
      <Button
        className='share_btn'
        hoverClass='btn_hover'
        openType='share'>邀请同学</Button>
    </View>
  )
}

export default memo(CreateSuccess)