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

const showSecurityModal = (content: string) => {
  Taro.showModal({
    title: '警告',
    content: `禁止上传违法违规${content}，请阅读《创建规范》，并重新填写信息。本次违规已记录，多次违规将冻结账号。`,
    showCancel: false,
    confirmColor: PRIMARY_COLOR,
    confirmText: '我知道了'
  })
}

export { showToast, showLimitModal, showSecurityModal }