// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
// 云函数入口函数
exports.main = async(event, context) => {
  return sendTemplateMessage(event)
}

//小程序模版消息推送
async function sendTemplateMessage(event) {
  const {
    OPENID
  } = cloud.getWXContext()

  const {classInfo, classId} = event
  const templateId = 'Nrkkwc0gHjg52ccBvVLjDo0rUMvH0wPltrsDkME1OHQ'
  const {className, token, creator, count} = classInfo
  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    templateId,
    page: `pages/class-detail/class-detail?_id=${classId}`,
    data: {
      thing1: {
        value: className,
      },
      thing2: {
        value: creator,
      },
      thing5: {
        value: token,
      },
    }
  })
  return sendResult
}