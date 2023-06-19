const jwt = require('jsonwebtoken')

const auth = async (ctx, next) => {
  try {
    // 1. 获取、解析token
    const { authorization } = ctx.request.header
    const token = authorization.replace('Bearer ', '')
    const user = jwt.verify(token, 'shhhh')

    // 2. 保存用户信息
    ctx.state.user = user

    await next()
  } catch (err) {
    ctx.app.emit('error', err, ctx);
  }
}

const hasAdminPermission = async (ctx, next) => {
  // 1. 判断是否有管理员权限
  const { isAdmin } = ctx.state.user

  setTimeout(() => {
    console.log('你好', aaaaa)
  }, 3000);

  if (!isAdmin) {
    return ctx.body = '没有管理员权限'
  }

  await next()
}


module.exports = {
  auth,
  hasAdminPermission
}
