import { View, Form, Input, Button, Image, Picker } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useEffect, useState } from '@tarojs/taro'
import Avatar from "@/components/Avatar"

import avatar1 from '../../assets/icon_avatar1.png'
import selectArrow from '../../assets/icon_select_arrow.png'

import './join-class.scss'


function JoinClass() {
  const whereOptions = ['升学', '就业']
  const [goWhereIdx, setGoWhereIdx] = useState(0)
  const [addressSelect, setAddressSelect] = useState('')
  const goWhereChange = (e) => {
    const value = Number(e.detail.value);
    setGoWhereIdx(value);
  }
  const openChooseAddress = async () => {
    const location = await Taro.chooseLocation({});
    console.log(location);
    const { address, longitude, latitude } = location;
    setAddressSelect(address);
  }
  useEffect(() => {
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
  })
  return (
    <View className='join_page'>
      <NavBar
        title='加入班级'
        back
        iconTheme={'white'}
        background={'#2F54EB'}
        color={'#FFFFFF'}
      />
      <View className='form_bg'>
        <Avatar image={avatar1} radius={148} border={4}/>
      </View>
      <Form className='form_container'>
        <View className='form_item'>
          <View className='form_label'>姓名：</View>
          <Input
            className='form_input'
            placeholder='请输入'
            placeholderClass='placeholder' />
        </View>
        <View className='form_item'>
          <View className='form_label'>去向：</View>
          <Picker value={goWhereIdx} mode='selector' range={whereOptions} onChange={goWhereChange}>
            <View className='picker'>{whereOptions[goWhereIdx]}</View>
          </Picker>
          <Image className='select_arrow' src={selectArrow}/>
        </View>
        <View className='form_item'>
          <View className='form_label'>学校：</View>
          <Input
            className='form_input'
            placeholder='请输入'
            placeholderClass='placeholder' />
        </View>
        <View className='form_item'>
          <View className='form_label'>电话</View>
          <Input
            className='form_input'
            placeholder='请输入'
            placeholderClass='placeholder' />
        </View>
        <View onClick={openChooseAddress} className='form_item'>
          <View className='form_label'>地址</View>
          {addressSelect.length === 0 
          ? <View className='placeholder'>请选择</View>
          : <View>{addressSelect}</View>
          }
          <Image className='select_arrow' src={selectArrow}/>
        </View>
        <View className='form_item'>
          <View className='form_label'>口令</View>
          <Input
            className='form_input'
            placeholder='请输入'
            placeholderClass='placeholder' />
        </View>
        <Button className='create_btn'>创建班级</Button>
      </Form>
      <View className='notice'>* 信息只能被同一班级的同学查看</View>
    </View>
  )
}

export default JoinClass