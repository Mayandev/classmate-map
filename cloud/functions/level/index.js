const cloud = require('wx-server-sdk')
cloud.init({
	env: cloud.DYNAMIC_CURRENT_ENV,
})
const TcbRouter = require('tcb-router')
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

exports.main = async (event, context) => {
	const app = new TcbRouter({ event })
	const { createData, token, queryData } = event
	const { OPENID } = cloud.getWXContext()

	app.use(async (ctx, next) => {
		ctx.data = {}
		await next();
	});

	app.router('get', async (ctx, next) => {
    // 首选获取用户等级，在根据等级获取限制
    const levelData = await db.collection('user').where({
      openId: OPENID,
    }).field({
      level: true
    }).get()
    if (levelData['data'][0]) {
      const level = levelData['data'][0]['level']
      const {data} = await db.collection('level').where({
        name: level
      }).get()
      ctx.body = {level, limitData: data[0]}
    } else {
      ctx.body =  {level: '', limitData: {}}
    }
  })

  app.router('account-level-res', async (ctx, next) => {
    // 首选获取用户等级，在根据等级获取限制
    const {data: resource} = await db.collection('resource').doc('0d06a2fd5f244b1e002a77964590dec1').get()
    ctx.body = {resource}
  })

  // 查询价格
  app.router('prize', async (ctx, next) => {
    // 首选获取用户等级，在根据等级获取限制
    const {data} = await db.collection('level').field({
      prize: true
    }).where({
      name: 'pro',
    }).get()
    ctx.body = {prize: data[0]['prize']}
  })
  

	return app.serve();
}