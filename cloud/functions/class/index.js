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
	const { createData, token, queryData, classId } = event
	const { OPENID } = cloud.getWXContext()

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});

	app.router('checkToken', async (ctx, next) => {
		const data = await db.collection(collection).where({ token }).get()
		ctx.body = { data }
	})

	app.router('create', async (ctx, next) => {
		let joinUsers = [];
		// 首先判断创建者是否填写了信息
		const { data: infoData } = await db.collection('info').where({
			openId: OPENID
		}).get()
		// 如果已经填写过信息，则直接加入
		if (infoData.length) {
			joinUsers.push(infoData[0]['_id'])
		}
		const data = await db.collection(collection).add({
			data: { ...createData, creatorID: OPENID, joinUsers, usersId: [] }
		})

		if (data['_id']) {
			// 创建班级成功
			// 自动加入
			if (infoData.length) {
				await db.collection('user').where({ openId: OPENID }).update({
					data: {
						createClasses: _.push(data['_id']),
						joinClasses: _.push(data['_id'])
					}
				})
			} else {
				// 更新 User 数据库中的 createClasses 字段
				await db.collection('user').where({ openId: OPENID }).update({
					data: {
						createClasses: _.push(data['_id'])
					}
				})
			}
		}
		ctx.body = { data }
	})

	app.router('search', async (ctx, next) => {
		let isJoin = false
		const { data } = await db.collection(collection).where({
			...queryData,
			canSearch: true
		}).get()
		if (data.length) {
			// 查询到班级
			const classId = data[0]._id
			// 查询user表，看是否加入
			const userData = await db.collection('user').where({
				openId: OPENID
			}).get()

			const joinClasses = userData['data'][0]['joinClasses']
			const [id] = joinClasses.filter(id => id === classId)
			if (id) {
				isJoin = true
			}
		}
		ctx.body = { data, isJoin }
	})

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