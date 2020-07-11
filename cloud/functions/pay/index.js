const cloud = require('wx-server-sdk')
const md5 = require('md5')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
let secret = ''
const getRandomNumber = (minNum = 100000, maxNum = 999999) => parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)

function getSign(obj) {
  let keys = Object.keys(obj)
  keys.sort()
  let params = []
  keys.forEach(e => {
    if (obj[e] != null) {
      params.push(e + '=' + obj[e])
    }
  })
  params.push('key=' + secret)
  let paramStr = params.join('&')
  let signResult = md5(paramStr).toUpperCase()
  return signResult
}

exports.main = async (event) => {
  const mchid = '1600935066'
  const {
    prize
  } = event
  const nonce = getRandomNumber()
  const timestamp = Date.now()
  const body = '升级 pro'
  const out_trade_no = 'TEST-WXA-' + timestamp + '-' + nonce // 商户端订单号
  const attach = ''
  const notify_url = ''
  const sign = getSign({
    prize,
    nonce,
    timestamp,
    mchid,
    body,
    attach,
    notify_url
  })
  return {nonce,
    mchid,
    body,
    attach,
    notify_url,
    total_fee: prize,
    sign,
    nonce,
    out_trade_no}
}