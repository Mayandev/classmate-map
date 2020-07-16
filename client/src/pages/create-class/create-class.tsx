
import { useState, memo } from '@tarojs/taro';
import { View, Image, Input, Form, Button, Text } from '@tarojs/components';
import { AtSwitch } from 'taro-ui'
import { NavBar } from 'taro-navigationbar'

import './create-class.scss'
import illustrate from '../../assets/illustration_create_class_form.png'
import selectArrow from '../../assets/icon_select_arrow.png'
import { EXPECTION, CHECK_CONTENT, CHECK_IMAGE, CREATING, CREATE_SUCCESS } from '@/constants/toast'
import { checkAddForm } from '@/utils/checkform';
import { CREATE_ATTENTION, CREATE_SUCCESS_PAGE } from '@/constants/page';
import { CREATE_TEMPLATE_MSG_ID } from '@/constants/template';
import { LIMITSTORAGE } from '@/constants/storage';
import { PRIMARY_COLOR } from '@/constants/theme';
import { checkContentSecurity, checkImageSecurity } from '@/utils/callcloudfunction';
import { showSecurityModal } from '@/utils/utils';

function CreateClass() {

  const [imagePath, setImagePath] = useState('')
  const [imageName, setImageName] = useState('default')
  const [countLimit, setCountLimit] = useState(50)
  const [searchConfirm, setSearchConfirm] = useState(true)
  const onCreateSubmit = async (e) => {
    await Taro.requestSubscribeMessage({
      tmplIds: [CREATE_TEMPLATE_MSG_ID],
      success: (res) => {
        console.log(res);
      }
    })
    const formData = e.detail.value
    try {
      // 校验数据
      if (!await checkAddForm({ ...formData, imagePath, countLimit })) {
        return
      }

      const { creator, className, count, token } = formData;

      // TODO: 对小程序进行内容检测
      Taro.showLoading({title: CHECK_CONTENT})
      const check_content_res = await checkContentSecurity(`${creator}${className}`)
      if (check_content_res && check_content_res['code'] == 300) {
        showSecurityModal('内容')
        return
      }
      Taro.showLoading({title: CHECK_IMAGE})
      const check_image_res = await checkImageSecurity(imagePath)
      if (check_image_res && check_image_res['code'] == 300) {
        showSecurityModal('图片')
        return
      }


      // Taro.showLoading({ title: IMG_UPLOADING })

      // 先上传图片
      const { fileID } = await Taro.cloud.uploadFile({
        cloudPath: `class-image/${imageName}`,
        filePath: imagePath, // 文件路径
      })
      
      Taro.showLoading({ title: CREATING })

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
            canSearch: searchConfirm
          }
        }
      })
      Taro.hideLoading()
      if (result) {
        Taro.showToast({ title: CREATE_SUCCESS })
        Taro.redirectTo({
          url: `${CREATE_SUCCESS_PAGE}?creator=${creator}&className=${className}&token=${token}&_id=${result['data']['_id']}`
        })
        Taro.cloud.callFunction({
          name: 'msg',
          data: {
            $url: 'createMsg',
            classInfo: formData,
            classId: result['data']['_id']
          }
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
  const onSearchConfirm = (e) => {
    console.log(e);
    setSearchConfirm(e)
  }
  useState(() => {
    // 获取加入班级人数限制
    const limitInfo = Taro.getStorageSync(LIMITSTORAGE)
    setCountLimit(limitInfo['countLimit'])
  })

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
            placeholder={`班级人数需≤${countLimit}`}
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
        <View className='form_item'>
          <View className='form_label'>允许被搜索</View>
          <AtSwitch checked={searchConfirm} border={false} onChange={onSearchConfirm} color={PRIMARY_COLOR} />
        </View>
        <Button formType='submit' className='form_btn' hoverClass='form_btn_hover'>创建班级</Button>
      </Form>
      <View className='notice'>
        * 创建前请先阅读
        <Text
          className='attention_txt'
          onClick={() => Taro.navigateTo({ url: CREATE_ATTENTION })}>
          《创建规范》
        </Text>
      </View>
    </View>
  )
}

export default memo(CreateClass)