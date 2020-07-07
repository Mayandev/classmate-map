const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100
exports.main = async (event) => {
  const classCollection = 'class'
  const infoCollection = 'info'
  const { _id } = event
  const { OPENID } = cloud.getWXContext()
  const { data } = await db.collection(classCollection).doc(_id).get()
  const { joinUsers } = data
  const batchTimes = Math.ceil(joinUsers.length / 100)
  // 承载所有读操作的 promise 的数组
  const infoData = []
  for (let i = 0; i < batchTimes; i++) {
    const {data} = await db.collection(infoCollection).skip(i * MAX_LIMIT).limit(MAX_LIMIT).where({
      _id: _.in(joinUsers)
    }).get()
    infoData.push(...data)
  }

  let isJoin = false
  // 判断用户是否加入此班级
  const [user] = infoData.filter(v => v.openId === OPENID)
	// 如果用户加入，返回标志位
	if (user) isJoin = true
  
  return {
    classData: data, infoData: infoData, isJoin
  }
}