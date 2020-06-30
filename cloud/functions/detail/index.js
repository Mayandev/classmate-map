const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database({})


exports.main = async (event) => {
	const collection = 'class' //数据库的名称
  const { _id } = event
  const { OPENID } = cloud.getWXContext()
  const { data } = await db.collection(collection).doc(_id).get()
  
  return {
    data
  }
}