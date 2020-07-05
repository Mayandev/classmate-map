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
  const { infoId, classId } = event

  // 更新 class 数据库中的 joinUsers 字段
  const classRes = await db.collection(classCollection).doc(classId).update({
    data: {
      joinUsers: _.push(infoId)
    }
  })

  // 更新 User 数据库中的 joinClasses 字段
  const userRes = await db.collection(userCollection).where({openId: OPENID}).update({
    data: {
      joinClasses: _.push(classId)
    }
  })

  return {classRes, userRes}
  
}