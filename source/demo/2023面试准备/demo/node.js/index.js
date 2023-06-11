const fs = require('fs')
const http = require('http')

// require("@babel/core").transformSync("code", {
//   plugins: [
//     ["@babel/plugin-proposal-decorators", { version: "2023-01" }],
//   ]
// });


// require('./test-module')
// require('./test-module')


// console.log('cache ', require.cache)
// console.log('this ', this)


// const timeStart = Date.now()

// process.nextTick((args) => {
//   console.log('nextTick', args)
// }, 123)

// setTimeout(() => {
//   const delay = Date.now() - timeStart

//   console.log(`多久后才执行了呢？ ${delay}`) // 大于 1000ms
// }, 100);

// fs.readFile('./index.html',(err, data) => {
//   const startCallback = Date.now()

//   console.log('readFile callback', data)

//   while(Date.now() - startCallback < 1000) {
//     ; // do nothing
//   }
// })



// function recurse(i, end) {
//   if (i > end) {
//     console.log('Done!')
//   } else {
//     console.log(`i: ${i}`)
//     setImmediate(recurse, i+1, end)
//   }
// }

// recurse(0, 99)

// console.log('?????? 这里呢')





// fs.readFile('./index.html', () => {
//   setTimeout(() => {
//     console.log('set timeout1')
    
//   }, 0);
  
//   setImmediate(() => {
//     console.log('setImmediate2!')
//   })
// })

// setTimeout(() => {
//   console.log('set timeout3')
// }, 0);

// setImmediate(() => {
//   console.log('setImmediate4!')
// })

// fs.readFile('./index.html', (err, data) => {
//   console.log('data', data)
// })

// console.log(Buffer.from('Hello world').toString('utf-8', 0, 3))

// fs.readFile('./doc.txt', (err, data) => {
//   if (err) return

//   console.log(data.toString())
// })


// const fileInfo = fs.stat('./doc.txt', (err, result) => {
//   if (err) return

//   console.log(result)
// })

// fs.writeFile('./doc.txt', 'hello world', {
//   flag: 'w', // 默认
//   encoding: 'utf-8'
// }, err => {
//   if (err) {
//     console.log('write file err', err)
//     return
//   }

//   console.log('write file success ...')

//   const res = fs.readFileSync('./doc.txt', { encoding: 'utf-8' })

//   console.log('--', res)
// })



// fs.open('./doc.txt', 'a', (err, fd) => {
//   if (err) return

//   console.log(fd)

//   fs.fstat(fd, (err, data) => {
//     console.log(data)
//   })
// })


// fs.readdir(__dirname, (err, res) => {
//   console.log(res)

//   for(let subPath of res) {
//     // console.log(subPath)

//     // 同步
//     const statObj = fs.statSync(`${__dirname}/${subPath}`)

//     if (statObj.isDirectory()) {
//       // 文件夹
//       console.log(statObj.isFile())
//     } else {
//       // 文件
//       console.log(statObj.isFile())
//     }
//   }
// })


// const server = http.createServer((req, res) => {


//   if (req.url === '/') {
//     // 查看服务器目录信息
//     res.setHeader('Content-Type', 'text/plain')
//     res.writeHead(200)
//     const fileInfo = fs.readdirSync(__dirname)
//     res.end(fileInfo.toString())
//   }

//   if (req.url === '/getUser') {
//     res.end('hello world, this is http get method!')
//   }

//   if (req.url === '/api') {
//     console.log('api 接口')
//     console.log(req.method)

//     res.writeHead(200, {
//       'Content-Type': 'text/json'
//     })

//     const data = []

//     res.on('data', (chunk) => {
//       data.push(chunk)
//     })

//     res.on('end', () => {
//       // const buf = Buffer.concat(data)

//       console.log('????', Buffer.concat(data).toString())
//     })

//     res.end(JSON.stringify({
//       code: 0,
//       msg: 'success',
//       data: {
//         id: 1,
//         age: 18,
//         name: 'alex.cheng'
//       }
//     }))
//   }

// })

// server.on('connection', () => {
//   console.log('http connect')
// })

// server.on('request', () => {
//   console.log('http request')
// })

// server.listen(3000, () => {
//   console.log('server running at port 3000...')
// })


// http.get('http://localhost:3000/getUser', res => {
//   if (res.statusCode === 200) {
//     let result = ''

//     res.on('data', chunk => {
//       result+= chunk
//     })

//     res.on('end', () => {
//       console.log('get 数据', result)
//     })

//   }
// })


// const eventEmitter = require("events")

// const emitter = new eventEmitter()

// emitter.on('login', (a, b) => {
//   console.log(a, b)
// })

// emitter.emit('login', 1, 2)

// console.log(process.env)


// function timeoutFn() {
//   setTimeout(() => {
//     console.log('执行了')
//     console.log('打印：', a)
//   }, 1000);
// }

// async function fn() {
//   try {
//     const res = await timeoutFn()


//   } catch (error) {
//     console.log('捕获错误: ', error)
//   }
// }

// fn()





// function test(target) {
//   target.isStatic = true
  
//   // 原型上添加方法
//   target.prototype.sayName = function() {
//     console.log(this.name)
//   }
// }


// function readonly(target, name, descriptor) {
//   console.log(name, descriptor)

//   descriptor.writable = false
//   return descriptor
// }
// @test
// class Person {

//   name = 1

//   @readonly
//   sayName() {
//     console.log(this.name)
//   }
// }

// console.log('Person.isStatic', Person.isStatic)

// const p = new Person()
// p.sayName()


function privateDecorator(value, { kind, name }) {
  if (kind === 'accessor') {
    let { get, set } = value

    return {
      get() {
        console.log('getting name ')
        return get.call(this)
      },
      set(val) {
        console.log('??? ', val)

        return set.call(this, val)
      }
    }
  }
}
class Person {
  @privateDecorator accessor name = 'alex.cheng'
  static accessor age = 18
}


const p = new Person()

p.name = 'hello world'

// console.log(Person.age)