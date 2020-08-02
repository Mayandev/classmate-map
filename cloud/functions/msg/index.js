// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV
})
const TcbRouter = require('tcb-router')

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({ event })
  const { OPENID } = cloud.getWXContext()
  const {classInfo, classId} = event
  

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});

	app.router('createMsg', async (ctx, next) => {
    const templateId = 'aQWd7THJR2uCIbuRF__6BKT9QHVHXgs5JB6hvMhR69c'
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
        number4: {
          value: count,
        },
        character_string5: {
          value: token
        }
      }
    })
    ctx.body = {sendResult}
  })

  app.router('joinMsg', async (ctx, next) => {
    const templateId = '0fuHpw7TekI10fYBVJ_MKAFqCFoxYS0pcoMs2CttE9A'
    const {className} = classInfo

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
        number4: {
          value: count,
        },
        character_string5: {
          value: token
        }
      }
    })
    ctx.body = {sendResult}
  })
	return app.serve();
}
