const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const {OPENID} = cloud.getWXContext()
  const userCollection = 'user'
  const classCollection = 'class'
  // 查询用户已经加入的班级
  const { data } = await db.collection(userCollection).where({
    openId: OPENID
  }).get()

  // 如果数据存在
  if (data.length) {
    const classIds = data[0].joinClasses
    const createClasses = data[0].createClasses
    // 查询班级集合，找出符合的班级
    const { data: joinClasses } = await db.collection(classCollection).where({
      _id: _.in(classIds)
    }).get()
    return { joinClasses, createClasses }
  }

  return {joinClasses: [], createClasses: []}

}