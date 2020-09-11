import Taro from '@tarojs/taro'
// import { showToast } from './utils'

export const manageList = async () => {
  const { result } = await Taro.cloud.callFunction({
    name: 'manage',
    data: {
      $url: 'manageList'
    }
  })
  return result
}

export const classDetail = async (classId) => {
  // 请求班级详情数据
  const { result } = await Taro.cloud.callFunction({
    name: 'manage',
    data: {
      $url: 'classInfo',
      _id: classId
    }
  });
  return result
} 

export const updateClass = async (classId, updateData) => {
  const { result } = await Taro.cloud.callFunction({
    name: 'manage',
    data: {
      $url: 'update',
      _id: classId,
      updateData,
    }
  })
  return result
}