const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const {OPENID} = cloud.getWXContext()
  const classCollection = 'class'
  const userCollection = 'user'
  const { joinUser, joinClass, location } = event

  // 更新 class 数据库中的 joinUsers 字段
  const classRes = await db.collection(classCollection).doc(joinClass._id).update({
    data: {
      joinUsers: _.push({...joinUser, openId: OPENID})
    }
  })

  // 更新 User 数据库中的 joinClasses 字段
  const userRes = await db.collection(userCollection).where({openId: OPENID}).update({
    data: {
      joinClasses: _.push(joinClass)
    }
  })

  if (userRes && classRes) {
    return {success: true}
  }

  return {success: false}
  
}