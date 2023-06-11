const jwt = require('jsonwebtoken')

const auth = async (ctx, next) => {
  // 1. 获取、解析token
  const { authorization } = ctx.request.header
  const token = authorization.replace('Bearer ', '')
  const user = jwt.verify(token, 'shhhh')

  // 2. 保存用户信息
  ctx.state.user = user

  await next()
}

const hasAdminPermission = async (ctx, next) => {
  // 1. 判断是否有管理员权限
  const { isAdmin } = ctx.state.user

  if (!isAdmin) {
    return ctx.body = '没有管理员权限'
  }

  await next()
}


module.exports = {
  auth,
  hasAdminPermission
}
