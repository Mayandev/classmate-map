import { useState, memo, useEffect, useShareAppMessage } from '@tarojs/taro';
import { View, Image, Text, Button } from "@tarojs/components";
import { NavBar } from 'taro-navigationbar'

import './create-success.scss'
import successIcon from '../../../assets/icon_create_success.png'
import copyIcon from '../../../assets/icon_copy.png'
import shareImg from '../../../assets/illustration_share.png'
import { CLASS_DETAIL } from '@/constants/page'
import { get } from '@/utils/globaldata';
import { AD_HIDDEN } from '@/constants/data';

function CreateSuccess() {
  const [token, setToken] = useState<string>('')
  const [classId, setClassId] = useState(null)
  const [className, setClassName] = useState('')
  const [creatorName, setCreatorName] = useState('')

  const copyToken = (token: string) => {
    Taro.setClipboardData({ data: token })
  }


  useEffect(() => {
    const { _id, token, className, creator } = this.$router.params
    Taro.setClipboardData({
      data: token,
      success: () => {
        Taro.showToast({title: '口令已复制'})
      }
    })
    setToken(token)
    setClassId(_id)
    setClassName(className)
    setCreatorName(creator)
  }, [])

  useShareAppMessage(() => {
    return {
      title: `${creatorName}邀请你加入${className}，一起查看班级同学分布地图，多联(蹭)系(饭)。`,
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
      <View className="ad_unit" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-407a89d2d5fda077"></ad-custom>*/}
      </View>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-ca65da0dfdc0931c"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(CreateSuccess)