// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate


exports.main = async (event, context) => {
	const collection = 'order' //数据库的名称
	const app = new TcbRouter({ event })
	const { orderData } = event
	const { OPENID } = cloud.getWXContext()

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});

	app.router('create', async (ctx, next) => {
		const data = await db.collection(collection).add({
			data: {
				...orderData,
				openId: OPENID
			}
    })
    // 将user设置为pro
    await db.collection('user').where({
			openId: OPENID
		}).update({
      data: {
        level: 'pro'
      }
    })
    ctx.body = { data }
	})

	return app.serve();
}