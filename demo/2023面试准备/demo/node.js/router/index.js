const fs = require('fs')
const Router = require('koa-router')
const router = new Router()

fs.readdirSync(__dirname).forEach(filename => {
  if (filename !== 'index.js') {
    const currentRouter = require('./' + filename)
    router.use(currentRouter.routes())
  }
})

module.exports = router
