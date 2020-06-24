
import { View, Image, Input, Form, Button } from '@tarojs/components';
import { NavBar } from 'taro-navigationbar'

import './create-class.scss'
import illustrate from '../../assets/illustration_create_class_form.png'
import selectArrow from '../../assets/icon_select_arrow.png'

function CreateClass() {
  return (
    <View className='create_page'>
      <NavBar title={'创建班级'} back/>
      <Image className='image' src={illustrate}/>
      <Form className='form_container'>
        <View className='form_item'>
          <View className='form_label'>创建人：</View>
          <Input 
            className='form_input' 
            placeholder='请输入'
            placeholderClass='placeholder'/>
        </View>
        <View className='form_item'>
          <View className='form_label'>创建口令：</View>
          <Input 
            className='form_input' 
            placeholder='请输入'
            placeholderClass='placeholder'/>
        </View>
        <View className='form_item'>
          <View className='form_label'>班级名称：</View>
          <Input 
            className='form_input' 
            placeholder='请输入'
            placeholderClass='placeholder'/>
        </View>
        <View className='form_item'>
          <View className='form_label'>班级人数：</View>
          <Input 
            className='form_input' 
            placeholder='请输入'
            placeholderClass='placeholder'/>
        </View>
        <View className='form_item'>
          <View className='form_label'>班级照片：</View>
          <Input 
            className='form_input' 
            placeholder='请选择'
            placeholderClass='placeholder'/>
          <Image className='select_arrow' src={selectArrow}/>
        </View>
        <Button className='create_btn'>创建班级</Button>

      </Form>
      <View className='notice'>* 请记住创建的加入口令</View>
    </View>
  )
}

export default CreateClass