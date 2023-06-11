const Router = require('koa-router')
const UploadController = require('../controller/upload')
const { auth, hasAdminPermission } = require('../middlewares/auth')


const router = new Router({
  prefix: '/upload'
})

router.post('/img', UploadController.uploadImg)

module.exports = router


