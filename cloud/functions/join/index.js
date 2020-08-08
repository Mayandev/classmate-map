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

  // 获取用户的班级数
  const {data: userData} = await db.collection('user').where({
    openId: OPENID
  }).get()
  const joinCount = userData[0]['joinClasses']['length']
  const level = userData[0]['level']
  // 获取用户权限
  const {data: levelData} = await db.collection('level').where({
    name: level
  }).get()
  const joinLimit = levelData[0]['joinLimit']
  if (joinCount >= joinLimit) {
    return {code: 500, data: {msg: '加入的班级数已满'}}
  }

  // 更新 class 数据库中的 joinUsers 字段
  const classRes = await db.collection(classCollection).doc(classId).update({
    data: {
      joinUsers: _.push(infoId),
      usersId: _.push(OPENID)
    }
  })

  // 更新 User 数据库中的 joinClasses 字段
  const userRes = await db.collection(userCollection).where({openId: OPENID}).update({
    data: {
      joinClasses: _.push(classId)
    }
  })
  return {code: 200, data: {classRes, userRes, joinCount, joinLimit}}
  
}