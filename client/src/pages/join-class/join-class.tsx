import { View, Form, Input, Button, Image, Picker } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useEffect, useState, memo } from '@tarojs/taro'

import Avatar from "@/components/Avatar"
import { USERSTORAGE, CLASSSTORAGE, JOINDSTORAGE } from "@/constants/storage"
import { checkJoinForm, checkTokenEqual } from "@/utils/checkform"
import { showToast } from "@/utils/utils"

import defaulAvatar from '../../assets/default_avatar.png'
import selectArrow from '../../assets/icon_select_arrow.png'

import './join-class.scss'
import { CANCEL_SELECT, LOADING, JOIN_SUCCESS, EXPECTION } from "@/constants/toast"

// 缓存班级信息
let classInfo
let avatarSelected = false
let avatarName = ''
let geo
function JoinClass() {
  const whereOptions = ['升学', '工作']
  const placeOption = ['学校', '单位']
  const [goWhereIdx, setGoWhereIdx] = useState(0)
  const [addressSelect, setAddressSelect] = useState('')
  const [avatar, setAvatar] = useState(defaulAvatar)
  const goWhereChange = (e) => {
    const value = Number(e.detail.value);
    setGoWhereIdx(value);
  }
  const openChooseAddress = async () => {
    try {
      const location = await Taro.chooseLocation({});
      console.log(location);
      const { address, longitude, latitude } = location;
      geo = { longitude, latitude }
      setAddressSelect(address);
    } catch (error) {
      showToast(CANCEL_SELECT)
    }
  }
  const selectAvatar = async () => {
    try {
      const image = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      setAvatar(image.tempFilePaths[0])
      avatarSelected = true
      avatarName = image.tempFilePaths[0].split('_')[1]
    } catch (error) {
      showToast(CANCEL_SELECT)
      avatarSelected = false
    }
  }
  // 表单提交
  const onJoinSubmit = async (e) => {

    const formData = e.detail.value
    let avatarUrl = avatar

    // 如果有输入值不合法，返回
    if (!checkJoinForm({ ...formData, addressSelect })
      || !checkTokenEqual(formData.token, classInfo.token)) {
      return
    }

    Taro.showLoading({ title: LOADING })

    try {
      // 上传头像
      // 先上传图片，如果用户选择了自己的头像，则需要上传，否则使用用户的微信头像
      if (avatarSelected) {
        const { fileID } = await Taro.cloud.uploadFile({
          cloudPath: `user-avatar/${avatarName}`,
          filePath: avatar, // 文件路径
        })
        avatarUrl = fileID
      }


      // 调用加入云函数，将用户信息插入班级表，将班级信息插入到用户集合
      const { result } = await Taro.cloud.callFunction({
        name: 'join',
        data: {
          joinUser: { ...formData, avatarUrl, address: addressSelect, location: geo },
          classId: classInfo['_id']
        }
      })
      console.log(result);
      if (result && result['success']) {
        const joined = Taro.getStorageSync(JOINDSTORAGE) || []
        joined.push(classInfo['_id'])
        Taro.setStorageSync(JOINDSTORAGE, joined)
        Taro.showToast({ title: JOIN_SUCCESS })
        // 返回页面
        setTimeout(() => {
          Taro.navigateBack()

        }, 1500);
      }
    } catch (error) {
      showToast(EXPECTION)
    }

  }
  const fetchStorage = () => {
    // 获取班级的缓存，与表单信息一同提交
    classInfo = Taro.getStorageSync(CLASSSTORAGE)
    const { avatarUrl } = Taro.getStorageSync(USERSTORAGE)
    console.log(classInfo);

    // 设置头像
    setAvatar(avatarUrl)
  }
  useEffect(() => {
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    fetchStorage()
  }, [])
  return (
    <View className='join_page'>
      <NavBar
        title='加入班级'
        back
        iconTheme={'white'}
        background={'#2F54EB'}
        color={'#FFFFFF'}
      />
      <View className='form_bg' onClick={selectAvatar}>
        <Avatar image={avatar} radius={148} border={4} />
      </View>
      <Form onSubmit={onJoinSubmit} className='form_container'>
        <View className='form_item'>
          <View className='form_label'>姓名</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder='输入您的姓名或昵称'
            placeholderClass='placeholder'
            name='name' />
        </View>
        <View className='form_item'>
          <View className='form_label'>去向</View>
          <Picker value={goWhereIdx} mode='selector' range={whereOptions} onChange={goWhereChange}>
            <View className='picker'>{whereOptions[goWhereIdx]}</View>
          </Picker>
          <Image className='select_arrow' src={selectArrow} />
        </View>
        <View className='form_item'>
          <View className='form_label'>{placeOption[goWhereIdx]}：</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder={`输入${placeOption[goWhereIdx]}名称`}
            placeholderClass='placeholder'
            name='place' />
        </View>
        <View className='form_item'>
          <View className='form_label'>电话</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder='输入您的电话'
            placeholderClass='placeholder'
            name='phone'
            type='number' />
        </View>
        <View onClick={openChooseAddress} className='form_item'>
          <View className='form_label'>地址</View>
          {addressSelect.length === 0
            ? <View className='placeholder'>选择一个地址</View>
            : <View className='select_address'>{addressSelect}</View>
          }
          <Image className='select_arrow' src={selectArrow} />
        </View>
        <View className='form_item'>
          <View className='form_label'>口令</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder='输入正确的口令'
            placeholderClass='placeholder'
            name='token' />
        </View>
        <Button formType='submit' className='form_btn' hoverClass='form_btn_hover' >加入班级</Button>
      </Form>
      <View className='notice'>* 信息只能被同一班级的同学查看</View>
    </View>
  )
}

export default memo(JoinClass)