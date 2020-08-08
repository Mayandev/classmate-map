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
	const { classId } = event

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});


	app.router('check_full', async (ctx, next) => {
		let isFull = false
		const { data } = await db.collection(collection).doc(classId).get()
		if (data['count'] == data['joinUsers']['length']) {
			isFull = true
		}
		ctx.body = { isFull }
	})
	return app.serve();
}