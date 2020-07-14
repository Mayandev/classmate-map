import { View, Form, Input, Button, Image, Picker } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useEffect, useState, memo, useDidHide } from '@tarojs/taro'

import Avatar from "@/components/Avatar"
import { USERSTORAGE, JOININFO } from "@/constants/storage"
import { checkJoinForm } from "@/utils/checkform"
import { showToast } from "@/utils/utils"

import defaulAvatar from '../../assets/default_avatar.png'
import selectArrow from '../../assets/icon_select_arrow.png'

import './join-info.scss'
import { CANCEL_SELECT, LOADING, EXPECTION, SAVE_SUCCESS, UPDATE_SUCCESS } from "@/constants/toast"
import { PRIMARY_COLOR } from "@/constants/theme"
import { WHEREOPTION, PLACEOPTION } from "@/constants/data"

enum ActionType {
  Add,
  Update
}
let avatarSelected = false
let avatarName = ''
let geo
let addressClickCount = 0
function JoinClass() {
  const [goWhereIdx, setGoWhereIdx] = useState(0)
  const [addressSelect, setAddressSelect] = useState('')
  const [avatar, setAvatar] = useState(defaulAvatar)
  const [formAction, setFormAction] = useState(ActionType.Add)
  const [updateValue, setUpdateValue] = useState({})
  const goWhereChange = (e) => {
    const value = Number(e.detail.value);
    setGoWhereIdx(value);
  }
  const openChooseAddress = async () => {
    if (addressClickCount) {
      const settings = await Taro.getSetting()
      if (!settings.authSetting['scope.userLocation']) {
        Taro.showModal({
          title: '提示',
          content: '您需要重新授权地理位置信息',
          confirmText: '去授权',
          confirmColor: PRIMARY_COLOR,
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting()
            }
          }
        })
        return
      }
    }
    addressClickCount++
    try {
      const location = await Taro.chooseLocation({});
      console.log(location)
      const { address, longitude, latitude } = location
      geo = { longitude, latitude }
      setAddressSelect(address)
    } catch (error) {
      console.log(error);
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
    if (!checkJoinForm({ ...formData, addressSelect })) {
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

      switch (formAction) {
        case ActionType.Add:
          // 调用加入云函数，将用户信息插入班级表，将班级信息插入到用户集合
          const { result } = await Taro.cloud.callFunction({
            name: 'info',
            data: {
              $url: 'add',
              info: { ...formData, avatarUrl, address: addressSelect, location: geo, state: goWhereIdx },
            }
          })
          console.log(result);

          if (result && result['data']) {
            Taro.hideLoading()
            Taro.setStorageSync(JOININFO, result['data'])
            // 返回页面
            Taro.showModal({
              title: SAVE_SUCCESS,
              content: '您可以在首页-点击头像，对信息进行修改',
              showCancel: false,
              confirmText: '我知道了',
              confirmColor: PRIMARY_COLOR,
              success: (res) => {
                if (res.confirm) {
                  Taro.navigateBack()
                }
              }
            })
          }
          break;
        case ActionType.Update:
          const updateResult = await Taro.cloud.callFunction({
            name: 'info',
            data: {
              $url: 'update',
              info: { ...formData, avatarUrl, address: addressSelect, location: geo, state: goWhereIdx },
            }
          })
          console.log(updateResult);
          if (updateResult && updateResult['result']) {
            Taro.showToast({ title: UPDATE_SUCCESS })
            // 返回页面
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500)
          }
          break;
      }

    } catch (error) {
      console.log(error);

      showToast(EXPECTION)
    }

  }
  const fetchStorage = () => {
    const { avatarUrl } = Taro.getStorageSync(USERSTORAGE)
    setAvatar(avatarUrl)
  }

  // 查询用户信息
  const fetchInfo = async () => {
    try {
      Taro.showLoading({ title: LOADING })
      const { result } = await Taro.cloud.callFunction({
        name: 'info',
        data: {
          $url: 'get'
        }
      })
      console.log(result);
      if (result && result['data'].length > 0) {
        const data = result['data'][0]
        setFormAction(ActionType.Update)
        setUpdateValue(data)
        setAddressSelect(data['address'])
        setGoWhereIdx(data['state'])
        // const infoStorage = Taro.getStorageSync(JOIN_INFO)

        // TODO: 设置缓存
      }
      Taro.hideLoading()
    } catch (error) {
      showToast(EXPECTION)
    }
  }
  useEffect(() => {
    // 设置状态栏的颜色以及背景色
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff',
    })
    fetchStorage()
    fetchInfo()
  }, [])
 
  return (
    <View className='join_page'>
      <NavBar
        title='完善信息'
        back
        iconTheme={'white'}
        background={'#2F54EB'}
        color={'#FFFFFF'}
      />
      <View className='form_bg' onClick={selectAvatar}>
        <Avatar image={formAction === ActionType.Update ? updateValue['userAvatar'] : avatar} radius={148} border={4} />
      </View>
      <Form onSubmit={onJoinSubmit} className='form_container'>
        <View className='form_item'>
          <View className='form_label'>姓名：</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder='输入您的姓名或昵称'
            placeholderClass='placeholder'
            name='name'
            value={formAction === ActionType.Update ? updateValue['name'] : ''} />
        </View>
        <View className='form_item'>
          <View className='form_label'>去向：</View>
          <Picker value={goWhereIdx} mode='selector' range={WHEREOPTION} onChange={goWhereChange}>
            <View className='picker'>{WHEREOPTION[goWhereIdx]}</View>
          </Picker>
          <Image className='select_arrow' src={selectArrow} />
        </View>
        <View className='form_item'>
          <View className='form_label'>{PLACEOPTION[goWhereIdx]}：</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder={`输入${PLACEOPTION[goWhereIdx]}名称`}
            placeholderClass='placeholder'
            name='place'
            value={formAction === ActionType.Update ? updateValue['place'] : ''} />
        </View>
        <View className='form_item'>
          <View className='form_label'>电话：</View>
          <Input cursor-spacing={5}
            className='form_input'
            placeholder='输入您的电话'
            placeholderClass='placeholder'
            name='phone'
            type='number'
            value={formAction === ActionType.Update ? updateValue['phone'] : ''} />
        </View>
        <View onClick={openChooseAddress} className='form_item'>
          <View className='form_label'>地址：</View>
          {addressSelect.length === 0
            ? <View className='placeholder'>选择一个地址</View>
            : <View className='select_address'>{addressSelect}</View>
          }
          <Image className='select_arrow' src={selectArrow} />
        </View>
        <Button formType='submit' className='form_btn' hoverClass='form_btn_hover' >保存信息</Button>
      </Form>
      <View className='notice'>* 信息只能被同一班级的同学查看</View>
    </View>
  )
}

export default memo(JoinClass)