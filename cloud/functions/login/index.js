const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const userCollection = db.collection('user')

exports.main = async (event) => {
  const { userInfo } = event
  const {OPENID} = cloud.getWXContext()

  const users = (await userCollection.where({openId: OPENID}).get()).data
  // 如果用户没有注册，新增一条记录
  if (users.length === 0) {
    await userCollection.add({
      data: {
        openId: OPENID,
        createdTime: db.serverDate(),
        userInfo,
        joinClasses: [],
        createClasses: [],
        level: 'normal',
        state: 1        // 1 正常  0 冻结
      },
    })
  } else {
    // 否则更新信息
    const {_id} = users[0];
    await userCollection.doc(_id).update({
      data: {
        // 将userInfo 字段更新
        userInfo
      }
    })
  }

  return {
    openid: OPENID
  }
}