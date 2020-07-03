const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()


exports.main = async (event) => {
	const collection = 'class' //数据库的名称
  const { _id } = event
  const { OPENID } = cloud.getWXContext()
  const { data } = await db.collection(collection).doc(_id).get()
  let isJoin = false
  // 判断用户是否加入此班级
  const [user] = data.joinUsers.filter(v => v.openId === OPENID)
	// 如果用户加入，返回标志位
	if (user) isJoin = true
  
  return {
    data, isJoin
  }
}