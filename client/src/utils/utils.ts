import Taro  from '@tarojs/taro'

const showToast = (title = '') => {
  Taro.showToast({title, icon: 'none'})
}

export { showToast }