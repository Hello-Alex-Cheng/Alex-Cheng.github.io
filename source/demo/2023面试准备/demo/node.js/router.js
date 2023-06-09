const router = require('koa-router')()
const HomeController = require('./controller/home')

module.exports = app => {
  router.get('/', HomeController.index)
  router.patch('/', HomeController.updatePassword)
  router.get('/home', HomeController.home)
  router.get('/home/:id/:name', HomeController.homeParams)
  router.post('/login', HomeController.login)

  app.use(router.routes()).use(router.allowedMethods())
}