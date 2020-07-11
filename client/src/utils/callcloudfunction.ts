import Taro from '@tarojs/taro'
import { PRIMARY_COLOR } from '@/constants/theme'
const getLevel = async () => {
  const { result } = await Taro.cloud.callFunction({
    name: 'level',
    data: {
      $url: 'get'
    }
  })
  return result
}
const getAccountRes = async () => {
  const { result } = await Taro.cloud.callFunction({
    name: 'level',
    data: {
      $url: 'account-level-res'
    }
  })
  return result
}

const isClassFull = async (classId) => {
  const { result } = await Taro.cloud.callFunction({
    name: 'class',
    data: {
      $url: 'check_full',
      classId
    }
  })
  return result
}

// 获取会员价格
const getProPrize = async () => {
  const { result } = await Taro.cloud.callFunction({
    name: 'level',
    data: {
      $url: 'prize'
    }
  })
  return result
}

/**
 * 
 * @param prize 重置价格
 */
const payRequest = async (prize) => {
  const { result } = await Taro.cloud.callFunction({
    name: 'pay',
    data: {
      prize
    }
  })
  return result
}

const createOrder = async (orderData, payjsOrderId) => {
  const { result } = await Taro.cloud.callFunction({
    name: 'order',
    data: {
      $url: 'create',
      orderData: {...orderData, payjsOrderId}
    }
  })
  return result
}
export { getLevel, getAccountRes, isClassFull, getProPrize, payRequest, createOrder }