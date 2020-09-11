const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const TcbRouter = require('tcb-router')
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
  const classCollection = 'class'
  const userCollection = 'user'
	const app = new TcbRouter({ event })
	const { updateData, _id } = event
	const { OPENID } = cloud.getWXContext()

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});

  app.router('manageList', async (ctx, next) => {
    let classList = []
		const { data } = await db.collection(userCollection).where({ 
      openId: OPENID
    }).field({
      createClasses: true
    }).get()

    if (data.length) {
      const { createClasses } = data[0]
      classList = await db.collection(classCollection).where({
        _id: _.in(createClasses)
      }).get()
    }

		ctx.body = { classList }
  })

  app.router('update', async (ctx, next) => {
    const now = Date.now()
    let resCode = 200
    const data = await db.collection(classCollection).where({
      _id: _id
    }).update({
      data: {
        ...updateData,
        updateTime: now
      }
    })
    if (data && data['stats']['updated'] !== 1) {
      resCode = 500
    }
		ctx.body = { resCode }
  })
  
  app.router('classInfo', async (ctx, next) => {
    const { data } = await db.collection(classCollection).doc(_id).get()
		ctx.body = { classData: data }
  })

	return app.serve();
}