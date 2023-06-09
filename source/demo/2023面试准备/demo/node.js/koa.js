const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const staticServe = require('koa-static') // 静态文件服务
const log = require('./middlewares/querystring')

// 连接数据库
require('./db')

const app = new Koa()

// log query middleware
app.use(log)
app.use(bodyParser())

// extensions 表示访问时，可以省略的后缀
app.use(
  staticServe(
    __dirname + '/static/',
    { extensions: ['html'], defer: true }
  )
)

// 路由
router(app)

app.listen(3000)
