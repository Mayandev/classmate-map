import {
  EMPTY_CREATOR,
  EMPTY_CLASSNAME,
  ILLEGAL_TOKEN,
  ILLEGAL_COUNT,
  EMPTY_IMAGE,
  OCCUPY_TOKEN,
  CHECK_TOKEN_LOADING
} from '@/constants/toast'
import Taro  from '@tarojs/taro';


const checkFormEmpty = (formItem: string) => {
  return formItem.length === 0
}

const checkToken = (token: string) => {
  return token.length === 0 || !/^(?=.*\d)(?=.*[a-zA-z]).{6,}$/.test(token)
}

const checkCount = (count: string) => {
  const num = Number(count)
  return num > 100 || num <= 0
}
const checkAddForm = async (data) => {
  const { creator, className, count, token, imagePath } = data;
  console.log('12312');
  
  if (checkFormEmpty(creator)) {
    Taro.showToast({ title: EMPTY_CREATOR, icon: 'none' })
    return false
  } else if (checkToken(token)) {
    Taro.showToast({ title: ILLEGAL_TOKEN, icon: 'none' })
    return false
  } else if (checkFormEmpty(className)) {
    Taro.showToast({ title: EMPTY_CLASSNAME, icon: 'none' })
    return false
  } else if (checkCount(count)) {
    Taro.showToast({ title: ILLEGAL_COUNT, icon: 'none' })
    return false
  } else if (checkFormEmpty(imagePath)) {
    Taro.showToast({ title: EMPTY_IMAGE, icon: 'none' })
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
    Taro.showToast({ title: OCCUPY_TOKEN, icon: 'none' })
    return false
  }
  return true

}

export { checkAddForm }