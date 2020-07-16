// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
const TcbRouter = require('tcb-router')
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })
  const { content, image } = event
  app.use(async (ctx, next) => {
    ctx.data = {}
    await next();
  });

  app.router('content', async (ctx, next) => {
    try {
      let result = await cloud.openapi.security.msgSecCheck({
        content: content
      })
      if (result && result.errCode.toString() === '87014') {
        ctx.body = {
          code: 300,
          msg: '内容含有违法违规内容',
          data: result
        }
      } else {
        ctx.body = {
          code: 200,
          msg: 'ok',
          data: result
        }
      }
    } catch (err) {
      if (err.errCode.toString() === '87014') {
        ctx.body = {
          code: 300,
          msg: '内容含有违法违规内容',
          data: err
        }
      } else {
        ctx.body = {
          code: 400,
          msg: '调用security接口异常',
          data: err
        }
      }
    }
  })

  app.router('image', async (ctx, next) => {
    try {
      const result = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/png',
          value: Buffer.from(image) // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
        }
      })

      if (result && result.errCode.toString() === '87014') {
        ctx.body =  { code: 300, msg: '内容含有违法违规内容', data: result }
      } else {
        ctx.body =  { code: 200, msg: '内容ok', data: result }
      }
    } catch (err) {
      // 错误处理
      if (err.errCode.toString() === '87014') {
        ctx.body =  { code: 300, msg: '内容含有违法违规内容', data: err }
      } else {
        ctx.body = { code: 502, msg: '调用imgSecCheck接口异常', data: err }
      }
    }
  })

  return app.serve();
}