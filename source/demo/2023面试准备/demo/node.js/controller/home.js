const HomeService = require('../service/home')
const jwt = require('jsonwebtoken')

module.exports = {
  updatePassword: async (ctx, next) => {

    const { authorization } = ctx.request.header

    if (authorization) {
      const token = authorization.replace('Bearer ', '')

      const decoded = jwt.verify(token, 'shhhh')
      console.log(decoded)

      if (decoded.username === 'alex.cheng') {
        ctx.body = '可以修改密码'
      }
    } else {
      ctx.body = 'token失效或者用户未登录'
    }
  },
  index: async (ctx, next) => {
    ctx.response.body = `
      <h1>Index</h1>
      <form action='/login' method='post'>
        <p>Name <input name='name' /></p>
        <p>Password <input name='password' type='password' /></p>
        <p><input type='submit' value='提交' /></p>
      </form>
    `
  },
  home: async (ctx, next) => {

    console.log('accepts==== ', ctx.accepts('json', 'html', 'text/plain'))
    // ctx.status = 404
    console.log(ctx.request.query)
    console.log(ctx.request.querystring)
    // ctx.response.body = `
    //   <h1>Home Page</h1>
    //   <p>JSON.stringify(query): ${JSON.stringify(ctx.request.query)}</p>
    //   <p>querystring: ${ctx.request.querystring}</p>
    // `

    ctx.body = {
      query: ctx.request.query,
      querystring: ctx.request.querystring,
      a: {
        name: 1
      }
    }
  },
  homeParams: async (ctx, next) => {
    console.log('home params ', ctx.params)
    const { id, name } = ctx.params
    ctx.response.body = `
      <h1>Home Params Page </h1>
      <p>id: ${id}</p>
      <p>name: ${name}</p>
    `
  },
  login: async (ctx, next) => {
    console.log('post 数据', ctx.request.body)
  
    const name = ctx.request.body.name || ''
    const password = ctx.request.body.password || ''

    const data = await HomeService.login(name, password)
    ctx.body = data
  }
}