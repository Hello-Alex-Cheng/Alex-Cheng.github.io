const Router = require('koa-router')
const HomeController = require('../controller/home')

const { auth } = require('../middlewares/auth')

const router = new Router()

router.get('/', HomeController.index)
router.patch('/', auth, HomeController.updatePassword)
router.get('/home', HomeController.home)
router.get('/home/:id/:name', HomeController.homeParams)
router.post('/login', HomeController.login)

module.exports = router

