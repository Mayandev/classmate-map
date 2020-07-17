import Taro from '@tarojs/taro'
import { PRIMARY_COLOR } from '@/constants/theme'
import { CHARGE } from '@/constants/page'
import { set } from './globaldata'
import { GLOBAL_KEY_COMPRESS_CLASS_IMAGE } from '@/constants/data'

const showToast = (title = '') => {
  Taro.showToast({ title, icon: 'none' })
}

const showLimitModal = (title, content, confirmText) => {
  Taro.showModal({
    title: title,
    content: content,
    confirmColor: PRIMARY_COLOR,
    confirmText: confirmText,
    success: (res) => {
      if (res.confirm) {
        Taro.navigateTo({ url: CHARGE })
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

const compressImage = async (path: string, drawWidth: number, canvasId: string) => {
  if (!path) return
  const info = await Taro.getImageInfo({
    src: path
  })
  const { width, height } = info
  const maxSide = Math.max(width, height)
  let scale = 1
  if (maxSide > drawWidth) {
    scale = drawWidth / maxSide;
  }
  const imageW = Math.floor(width * scale * 0.5);
  const imageH = Math.floor(height * scale * 0.5)
  const canvasCtx = Taro.createCanvasContext(canvasId)
  canvasCtx.drawImage(path, 0, 0, imageW, imageH)
  canvasCtx.draw(false, async () => {
    const { tempFilePath } = await Taro.canvasToTempFilePath({
      canvasId: canvasId,
      x: 0,
      y: 0,
      width: imageW,
      height: imageH,
      quality: 1,
    });
    const inf = await Taro.getImageInfo({
      src: tempFilePath
    })
    console.log(inf);
    
    
    set(GLOBAL_KEY_COMPRESS_CLASS_IMAGE, tempFilePath)
  })

  console.log(info);
  
}

const getFileName = () => {
  return `${Date.now()}${getRandomNumber()}`
}

const getRandomNumber = (minNum = 100000, maxNum = 999999) => {
   return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
}

export { showToast, showLimitModal, showSecurityModal, getFileName, compressImage }