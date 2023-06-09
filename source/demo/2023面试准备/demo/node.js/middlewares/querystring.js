const queryString = require('querystring')

module.exports = async function(ctx, next) {
  console.log('---------- queryString start ---------------')

  const rawstring = ctx.request.querystring

  // queryString.escape(params) 编码
  // queryString.unescape(escapeValue) 解码
  // parse 将 raw string 解析成对象形式
  // stringify 将对象形式的参数字符串化

  console.log(queryString.parse(rawstring))

  await next()
}