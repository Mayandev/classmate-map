import {
  EMPTY_CREATOR,
  EMPTY_CLASSNAME,
  ILLEGAL_TOKEN,
  EMPTY_IMAGE,
  OCCUPY_TOKEN,
  CHECK_TOKEN_LOADING,
  EMPTY_NAME,
  ILLEGAL_PHONE,
  EMPTY_PLAGE,
  EMPTY_ADDRESS,
  WRONG_TOKEN
} from '@/constants/toast'
import Taro from '@tarojs/taro'
import { showToast, showLimitModal } from '@/utils/utils';



const checkFormEmpty = (formItem: string) => {
  return formItem.length === 0
}

const checkToken = (token: string) => {
  return /^(?=.*\d)(?=.*[a-zA-z]).{6,}$/.test(token)
}

const checkPhone = (phone: 'string') => {
  return /^[1]([3-9])[0-9]{9}$/.test(phone)
}

const checkCount = (count: string, countLimit: number) => {
  const num = Number(count)
  return num > countLimit || num <= 0
}

const checkMinCount = (count: string, minLimit: number) => {
  const num = Number(count)
  return num < minLimit
}

const checkUpdateForm = (data) => {
  const { creator, className, count, imagePath, countLimit, minLimit } = data;
  if (checkFormEmpty(creator)) {
    showToast(EMPTY_CREATOR)
    return false
  } else if (checkFormEmpty(className)) {
    showToast(EMPTY_CLASSNAME)
    return false
  } else if (checkCount(count, countLimit)) {
    showLimitModal('提示', `班级人数需≤${countLimit}，升级高级用户可以设置更多人数`, '了解一下')
    return false
  } else if (checkMinCount(count, minLimit)) {
    showToast('需要大于已有班级成员个数')
  } else if (checkFormEmpty(imagePath)) {
    showToast(EMPTY_IMAGE)
    return false
  }
  return true
}

const checkAddForm = async (data) => {
  const { creator, className, count, token, imagePath, countLimit } = data;
  
  if (checkFormEmpty(creator)) {
    showToast(EMPTY_CREATOR)
    return false
  } else if (!checkToken(token)) {
    showToast(ILLEGAL_TOKEN)
    return false
  } else if (checkFormEmpty(className)) {
    showToast(EMPTY_CLASSNAME)
    return false
  } else if (checkCount(count, countLimit)) {
    showLimitModal('提示', `班级人数需≤${countLimit}，升级高级用户可以设置更多人数`, '了解一下')
    return false
  } else if (checkFormEmpty(imagePath)) {
    showToast(EMPTY_IMAGE)
    return false
  }
  Taro.showLoading({title: CHECK_TOKEN_LOADING})
  // 先校验口令是否唯一
  const res = await Taro.cloud.callFunction({
    name: 'class',
    data: {
      $url: 'checkToken',
      token: token
    }
  })
  console.log(res);
  
  Taro.hideLoading()
  if (res.result && res.result['data']['data'].length !== 0) {
    showToast(OCCUPY_TOKEN)
    return false
  }
  return true

}

const checkJoinForm = (data) => {
  const { name, phone, place, addressSelect } = data;
  if (checkFormEmpty(name)) {
    showToast(EMPTY_NAME)
    return false
  } else if (!checkPhone(phone)) {
    showToast(ILLEGAL_PHONE)
    return false
  } else if (checkFormEmpty(place)) {
    showToast(EMPTY_PLAGE)
    return false
  } else if (checkFormEmpty(addressSelect)) {
    showToast(EMPTY_ADDRESS)
    return false
  }
  return true
}

const checkTokenEqual = (inputToken, rightToken) => {
  if (inputToken === rightToken) {
    return true
  }
  showToast(WRONG_TOKEN)
  return false
}

export { checkAddForm, checkJoinForm, checkTokenEqual, checkUpdateForm }