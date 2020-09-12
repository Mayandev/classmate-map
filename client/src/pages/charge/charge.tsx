import { memo, useEffect, useState, useDidShow, showLoading } from '@tarojs/taro'
import { View, Button, Image } from "@tarojs/components"
import { getAccountRes, getProPrize, payRequest, createOrder, getLevel } from '@/utils/callcloudfunction'
import NavBar from 'taro-navigationbar'

import './charge.scss'

import placeholder from '../../assets/image_placeholder.png'
import { LOADING, THIRD_PARTY, PAY_SUCCESS, EXPECTION } from '@/constants/toast'
import { PRIMARY_COLOR } from '@/constants/theme'
import { get as getGlobalData, get } from '@/utils/globaldata'
import { GLOBAL_KEY_PAYSUCCESS, GLOBAL_KEY_MSG, GLOBAL_KEY_PAYJSORDERID, AD_HIDDEN } from '@/constants/data'
import { showToast } from '@/utils/utils'
import { INDEX } from '@/constants/page'
import { LIMITSTORAGE } from '@/constants/storage'

let payData
function Charge() {
  const [accountRes, setAccountRes] = useState(null)
  const [isPayPress, setIsPayPress] = useState(false)
  const [isPullMPSuccess, setIsPullMPSuccess] = useState(false)
  const [level, setLevel] = useState('normal')
  const fetchAccountRes = async () => {
    try {
      Taro.showLoading({ title: LOADING })
      const result = await getAccountRes()
      console.log(result);
      if (result) {
        setAccountRes(result['resource']['fileId'])
      }
      // 
      let level = Taro.getStorageSync(LIMITSTORAGE)
      if (!level) {
        let levelData = await getLevel()
        if (levelData) level = levelData
      }
      setLevel(level['name'])
      Taro.hideLoading()
    } catch (error) {
      showToast(EXPECTION)
    }

  }

  const bindCharge = async () => {
    // 先判断是否已经是pro
    if (level === 'pro' || level === 'pro+') {
      showToast('您已经是 pro 账户了')
      return
    }
    // 首先查询价格
    Taro.showLoading({ title: LOADING })
    const prizeData = await getProPrize()
    if (prizeData) {
      const prize = prizeData['prize']
      // 请求支付
      payData = await payRequest(prize)
      Taro.hideLoading()
      if (payData) {
        setIsPayPress(true)
        Taro.showModal({
          title: '提示',
          content: THIRD_PARTY,
          confirmColor: PRIMARY_COLOR,
          success: (res) => {
            if (res.confirm) {
              Taro.navigateToMiniProgram({
                appId: 'wx959c8c1fb2d877b5',
                path: 'pages/pay',
                extraData: {
                  'mchid': payData['mchid'], // 商户号
                  'total_fee': payData['total_fee'],
                  'out_trade_no': payData['out_trade_no'],
                  'body': payData['body'],
                  'notify_url': payData['notify_url'],
                  'attach': payData['attach'],
                  'nonce': payData['nonce'],
                  'sign': payData['sign']
                },
                success: (res) => {
                  setIsPullMPSuccess(true)
                },
                fail: (res) => {
                  setIsPullMPSuccess(false)
                }
              })
            } else if (res.cancel) {
              return
            }
          }
        })
      }
    }
  }

  useDidShow(() => {
    if (isPayPress && isPullMPSuccess) {
      try {
        setTimeout(async () => {
          const payjsOrderId = getGlobalData(GLOBAL_KEY_PAYJSORDERID)
          const paySuccess = getGlobalData(GLOBAL_KEY_PAYSUCCESS)
          const errMsg = getGlobalData(GLOBAL_KEY_MSG)
          if (paySuccess) {
            showLoading({ title: LOADING })
            const orderData = await createOrder(payData, payjsOrderId)
            console.log(orderData);
            // 将订单号插入订单表，并将用户状态变为 pro
            Taro.showToast({ title: PAY_SUCCESS })
            const limitInfo = await getLevel()
            if (limitInfo && limitInfo['level']) {
              Taro.setStorageSync(
                LIMITSTORAGE,
                limitInfo['limitData']
              )
              // setUserLevel(limitInfo['level'])
            }
            setTimeout(() => {
              // Taro.redirectTo({ url: INDEX })
              Taro.navigateBack()
            }, 1500);
          } else {
            showToast(errMsg)
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500);
          }
        }, 1000);
      } catch (error) {
        showToast(EXPECTION)
      }

    }
  })
  useEffect(() => {
    fetchAccountRes()
  }, [])
  return (
    <View className="charge_page">
      <NavBar back title={'关于 Pro'} />
      <Image mode='widthFix' className='account_info' src={accountRes ? accountRes : placeholder} />
      <Button onClick={bindCharge} className='charge_btn' hoverClass='charge_btn_hover'>升级 Pro</Button>
      <Button openType='contact' className='contact_btn'>联系客服</Button>
      <View className="custom_small_ad" hidden={get(AD_HIDDEN)}>
        {/*<ad-custom unit-id="adunit-ca65da0dfdc0931c"></ad-custom>*/}
      </View>
    </View>
  )
}

export default memo(Charge)