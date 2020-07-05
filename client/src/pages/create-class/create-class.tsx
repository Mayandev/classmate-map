
import { useState, memo } from '@tarojs/taro';
import { View, Image, Input, Form, Button } from '@tarojs/components';
import { NavBar } from 'taro-navigationbar'

import './create-class.scss'
import illustrate from '../../assets/illustration_create_class_form.png'
import selectArrow from '../../assets/icon_select_arrow.png'
import { EXPECTION, AUTH_SUCCESS, CREATE_SUCCESS, CREATING } from '@/constants/toast'
import { checkAddForm } from '@/utils/checkform';
import { CREATE_SUCCESS_PAGE } from '@/constants/page';

function CreateClass() {

  const [imagePath, setImagePath] = useState('')
  const [imageName, setImageName] = useState('default')
  const onCreateSubmit = async (e) => {
    const formData = e.detail.value

    try {
      // 校验数据
      if (!await checkAddForm({ ...formData, imagePath })) {
        return
      }
      Taro.showLoading({ title: CREATING })

      // 先上传图片
      const { fileID } = await Taro.cloud.uploadFile({
        cloudPath: `class-image/${imageName}`,
        filePath: imagePath, // 文件路径
      })
      const { creator, className, count, token } = formData;

      // 调用创建班级的云函数
      const { result } = await Taro.cloud.callFunction({
        name: 'class',
        data: {
          $url: 'create',
          createData: {
            creator,
            className,
            token,
            count: Number(count),
            classImage: fileID,
            createTime: Date.now(),
          }
        }
      })
      Taro.hideLoading()
      if (result) {
        Taro.showToast({ title: CREATE_SUCCESS })
        Taro.redirectTo({
          url: `${CREATE_SUCCESS_PAGE}?className=${className}&token=${token}&_id=${result['data']['_id']}`
        })
      }

    } catch (e) {
      console.log(e)
      Taro.hideLoading()
      Taro.showToast({ title: EXPECTION, icon: 'none' })
    }

  }
  const chooseImage = async () => {
    try {
      const image = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album']
      })
      setImagePath(image.tempFilePaths[0])
      setImageName(image.tempFilePaths[0].split('_')[1])
    } catch (error) {
      Taro.showToast({ title: '取消选择', icon: 'none' })
    }
  }

  return (
    <View className='create_page'>
      <NavBar title={'创建班级'} back />
      <Image className='image' src={illustrate} />
      <Form onSubmit={onCreateSubmit} className='form_container'>
        <View className='form_item'>
          <View className='form_label'>创建人</View>
          <Input cursor-spacing={5}
            name='creator'
            className='form_input'
            placeholder='您的姓名或昵称'
            placeholderClass='placeholder' />
        </View>
        <View className='form_item'>
          <View className='form_label'>创建口令</View>
          <Input cursor-spacing={5}
            name='token'
            className='form_input'
            placeholder='至少6位字母和数字'
            placeholderClass='placeholder' />
        </View>
        <View className='form_item'>
          <View className='form_label'>班级名称</View>
          <Input cursor-spacing={5}
            name='className'
            className='form_input'
            placeholder='请输入班级名称'
            placeholderClass='placeholder' />
        </View>
        <View className='form_item'>
          <View className='form_label'>班级人数</View>
          <Input cursor-spacing={5}
            name='count'
            type='number'
            className='form_input'
            placeholder='班级人数需≤100'
            placeholderClass='placeholder' />
        </View>
        <View className='form_item' onClick={chooseImage}>
          <View className='form_label'>班级照片</View>
          {imagePath.length !== 0
            ? <Image mode='aspectFill' className='selected_image' src={imagePath} />
            : <View className='placeholder'>选择一张班级合照</View>
          }
          <Image className='select_arrow' src={selectArrow} />
        </View>
        <Button formType='submit' className='form_btn' hoverClass='form_btn_hover'>创建班级</Button>
      </Form>
      <View className='notice'>* 请记住创建的加入口令</View>
    </View>
  )
}

export default memo(CreateClass)