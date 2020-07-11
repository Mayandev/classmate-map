import Taro  from '@tarojs/taro'
import { PRIMARY_COLOR } from '@/constants/theme'
import { CHARGE } from '@/constants/page'

const showToast = (title = '') => {
  Taro.showToast({title, icon: 'none'})
}

const showLimitModal = (title, content, confirmText) =>{
  Taro.showModal({
    title: title,
    content: content,
    confirmColor: PRIMARY_COLOR,
    confirmText: confirmText,
    success: (res) => {
      if (res.confirm) {
        Taro.navigateTo({url: CHARGE})
      }
    }
  })
}

export { showToast, showLimitModal }