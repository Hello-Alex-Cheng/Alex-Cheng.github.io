async function onerror(err, ctx) {
  console.log('全局响应错误', err)
  ctx.status = err.status || 500
  ctx.body = {
    code: 1,
    status: ctx.status,
    message: err.message
  }
}

module.exports = onerror