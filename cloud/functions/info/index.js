const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const TcbRouter = require('tcb-router')
const db = cloud.database()


exports.main = async (event) => {
  const {OPENID} = cloud.getWXContext()
	const app = new TcbRouter({ event })
  const collection = 'info'
  const { info } = event


  app.use(async (ctx, next) => {
		ctx.data = {}
		await next()
  });

  app.router('add', async (ctx, next) => {
    const data = await db.collection(collection).add({
      data: {...info, openId: OPENID}
    })
		ctx.body = { data }
  })

  app.router('update', async (ctx, next) => {
    const data = await db.collection(collection).where({
      openId: OPENID
    }).update({
      data: {
        ...info
      }
    })
		ctx.body = { data }
  })
  
  app.router('get', async (ctx, next) => {
    const { data } = await db.collection(collection).where({
      openId: OPENID
    }).get()
		ctx.body = { data }
  })

	return app.serve()
  
}