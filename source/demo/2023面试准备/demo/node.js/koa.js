const Koa = require('koa')
// const bodyParser = require('koa-bodyparser')
const { koaBody } = require('koa-body')
const router = require('./router')
const staticServe = require('koa-static') // 静态文件服务
const log = require('./middlewares/querystring')

// 连接数据库
require('./db')

const app = new Koa()

// log query middleware
app.use(log)
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: __dirname + '/static',
    keepExtensions: true,
    onFileBegin(name, file) {
      console.log('formidable file', file)
      if (file && file.originalFilename && file.newFilename) {
        const originalFilename = file.originalFilename.split('.')[0]
        const newFilename = file.newFilename.split('.')[0]

        file.filepath = file.filepath.replace(newFilename, originalFilename)
      }
    },
    onError(err) {
      console.log('上传失败~', err)
    }
  }
}))

// extensions 表示访问时，可以省略的后缀
app.use(
  staticServe(
    __dirname + '/static/',
    { extensions: ['html'], defer: true }
  )
)

// 路由
app.use(router.routes())

app.listen(3000)
