const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const classCollection = 'class'
  const infoCollection = 'info'
  const { _id } = event
  const { OPENID } = cloud.getWXContext()
  const { data } = await db.collection(classCollection).doc(_id).get()
  const { joinUsers } = data
  const infoData = await db.collection(infoCollection).where({
    _id: _.in(joinUsers)
  }).get()

  let isJoin = false
  // 判断用户是否加入此班级
  const [user] = infoData['data'].filter(v => v.openId === OPENID)
	// 如果用户加入，返回标志位
	if (user) isJoin = true
  
  return {
    classData: data, infoData: infoData['data'], isJoin
  }
}