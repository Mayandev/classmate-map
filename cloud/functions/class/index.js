const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const TcbRouter = require('tcb-router')
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
	const collection = 'class' //数据库的名称
	const app = new TcbRouter({ event })
	const { createData, token, queryData } = event
	const { OPENID } = cloud.getWXContext()

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});

	app.router('checkToken', async (ctx, next) => {
		const data  = await db.collection(collection).where({token}).get()
		ctx.body = { data }
	})

	app.router('create', async (ctx, next) => {
		const addresult = await db.collection(collection).add({
			data: { ...createData, creatorID: OPENID, joinUsers: [] }
		})
		ctx.data.addresult = addresult
		ctx.body = { "添加记录的返回结果": ctx.data.addresult }
	})

	app.router('search', async (ctx, next) => {
		let isJoin = false;
		const { data } = await db.collection(collection).where(queryData).get()
		if (data.length) {
			// 查询到班级
			const [user] = data[0].joinUsers.filter(v => v.openId === OPENID)
			// 如果用户加入，返回标志位
			if (user) isJoin = true
		}
		ctx.body = { data, isJoin }
	})
	return app.serve();
}