import { View, Form, Input, Button, Image, Picker, Canvas } from "@tarojs/components"
import { NavBar } from 'taro-navigationbar'
import { useEffect, useState, memo } from '@tarojs/taro'

import Avatar from "@/components/Avatar"
import { USERSTORAGE, JOININFO } from "@/constants/storage"
import { checkJoinForm } from "@/utils/checkform"
import { showToast, cropAvatar, getFileName, showSecurityModal } from "@/utils/utils"

import defaulAvatar from '../../assets/default_avatar.png'
import selectArrow from '../../assets/icon_select_arrow.png'

import './join-info.scss'
import { CANCEL_SELECT, LOADING, EXPECTION, SAVE_SUCCESS, UPDATE_SUCCESS, CHECK_CONTENT } from "@/constants/toast"
import { PRIMARY_COLOR } from "@/constants/theme"
import { WHEREOPTION, PLACEOPTION, CROP_AVATAR_CANVAS_ID, GLOBAL_KEY_CROP_AVATAR_IMAGE, AD_HIDDEN } from "@/constants/data"
import { get } from "@/utils/globaldata"
import { checkContentSecurity } from "@/utils/callcloudfunction"

enum ActionType {
  Add,
  Update
}
let avatarName = ''
let geo
let addressClickCount = 0
let avatarUploadName = ''
function JoinClass() {
  const [goWhereIdx, setGoWhereIdx] = useState(0)
  const [addressSelect, setAddressSelect] = useState('')
  const [avatar, setAvatar] = useState(defaulAvatar)
  const [formAction, setFormAction] = useState(ActionType.Add)
  const [updateValue, setUpdateValue] = useState({})
  const [canvasWidth, setCanvasWidth] = useState(100)

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
      let { address, longitude, latitude } = location
      const randomAppendix = Number(Number(Math.random() / 200).toFixed(6))
      const randomPlus = Math.floor(Math.random() * 2)
      if (randomPlus) {
        longitude += randomAppendix
        latitude += randomAppendix
      } else {
        longitude = String(Number(longitude) - randomAppendix)
        latitude = String(Number(latitude) - randomAppendix)
      }
      geo = { longitude, latitude }
      setAddressSelect(address)
    } catch (error) {
      console.log(error);
      showToast(CANCEL_SELECT)
    }
  }
  // 表单提交
  const onJoinSubmit = async (e) => {
    const formData = e.detail.value
    let avatarUrl = avatar
    let locationAvatar = 'cloud://class-map-6sie2.636c-class-map-6sie2-1302773560/resource/icon_avatar_location.png'
    // 如果有输入值不合法，返回
    if (!checkJoinForm({ ...formData, addressSelect })) {
      return
    }

    try {
      Taro.showLoading({ title: CHECK_CONTENT })
      const check_content_res = await checkContentSecurity(`${formData['name']}${formData['place']}`)

      if (check_content_res && check_content_res['code'] == 300) {
        Taro.hideLoading()
        showSecurityModal('内容')
        return
      }
      // TODO: 压缩图片
      // 上传头像
      // 先上传图片，如果用户选择了自己的头像，则需要上传，否则使用用户的微信头像
      Taro.showLoading({ title: LOADING })
      switch (formAction) {
        case ActionType.Add:
          const addFileName = getFileName()
          const { fileID } = await Taro.cloud.uploadFile({
            cloudPath: `avatar/${addFileName}.png`,
            filePath: get(GLOBAL_KEY_CROP_AVATAR_IMAGE), // 文件路径
          })
          locationAvatar = fileID
          // 调用加入云函数，将用户信息插入班级表，将班级信息插入到用户集合
          const { result } = await Taro.cloud.callFunction({
            name: 'info',
            data: {
              $url: 'add',
              info: { ...formData, avatarUrl, address: addressSelect, location: geo, state: goWhereIdx, locationAvatar, avatarName: addFileName },
            }
          })
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
          const { fileID: updateFileID } = await Taro.cloud.uploadFile({
            cloudPath: `avatar/${avatarUploadName}.png`,
            filePath: get(GLOBAL_KEY_CROP_AVATAR_IMAGE), // 文件路径
          })
          locationAvatar = updateFileID
          const updateResult = await Taro.cloud.callFunction({
            name: 'info',
            data: {
              $url: 'update',
              info: { ...formData, avatarUrl, address: addressSelect, location: geo, state: goWhereIdx, locationAvatar, avatarName: avatarUploadName },
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
    console.log(avatarUrl);

    // TODO: cropImage 裁剪图片
    cropAvatar(avatarUrl, canvasWidth, CROP_AVATAR_CANVAS_ID)
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
        avatarUploadName = data['avatarName'] === '' ? getFileName() : data['avatarName']
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
    // 获取 windowsWidth
    const systemInfo = Taro.getSystemInfoSync()
    const { windowWidth } = systemInfo
    setCanvasWidth(windowWidth)
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
      <Canvas
        canvasId={CROP_AVATAR_CANVAS_ID}
        className='crop-canvas'
        style={{ width: `${canvasWidth}px`, height: `${canvasWidth}px` }} />
      <View className='form_bg'>
        <Avatar image={avatar} radius={148} border={4} />
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
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-906053a3e8508c69"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(JoinClass)