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
		const data = await db.collection(collection).add({
			data: { ...createData, creatorID: OPENID, joinUsers: [], usersId: [] }
		})
		ctx.body = { data }
	})

	app.router('search', async (ctx, next) => {
		let isJoin = false
		const { data } = await db.collection(collection).where(queryData).get()
		if (data.length) {
			// 查询到班级
			const classId = data[0]._id
			// 查询user表，看是否加入
			const userData  = await db.collection('user').where({
				openId: OPENID
			}).get()

			const joinClasses = userData['data'][0]['joinClasses']
			const [id] = joinClasses.filter(id => id === classId)
			if (id) {
				isJoin  = true
			}
		}
		ctx.body = { data, isJoin }
	})
	return app.serve();
}