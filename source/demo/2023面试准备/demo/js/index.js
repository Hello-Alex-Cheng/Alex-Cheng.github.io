// const obj = {}
// let name = ''

// Object.defineProperty(obj, 'name', {
//   get: function() {
//     console.log('触发 get')

//     return name
//   },
//   set: function(value) {
//     console.log('触发 set')
//     name = value
//   }
// })

// console.log('打印： ', obj.name)

// obj.name = '你好，世界'

// console.log('打印： ', obj.name)


// const o = {
//   name: '对象',
//   age: 19,
//   favor: ['sing', 'dance']
// }

// const proxy = new Proxy(o, {
//   get(target, key, receiver) {
//     console.log('有人来获取属性啦：', target, key)

//     return target[key]
//   },
//   set(target, key, value) {
//     target[key] = value
//   }
// })

// // console.log(proxy.name)

// // proxy.name = '123'

// // console.log(proxy.name)

// proxy.favor.push('hahahahahah')

// console.log(proxy.favor)









// console.log([] instanceof Array)

// function instance_of(instance, obj) {
//   let prototype = Object.getPrototypeOf(instance)

//   while(true) {
//     if (prototype === null) return false

//     if (prototype === obj.prototype) {
//       return true
//     }

//     prototype = Object.getPrototypeOf(prototype)
//   }
// }


// new

// 1. 创建一个全新的对象
// 2. 这个对象的 __proto__ 指向构造函数的 prototype
// 3. 执行构造函数内部的内容
// 4. 返回这个新对象

// function myNew(fn, ...args) {
//   const instance = Object.create(fn.prototype)

//   const res = fn.apply(this, args)

//   // 以防万一 fn 函数返回值不是对象
//   return typeof instance === 'object' ? res : instance
// }






// React Fiber 也称协程、或者纤程。 
// Ruby就将协程称为 Fiber。后来发现很多语言都有类似的机制
// 例如Lua 的Coroutine,
// 还有前端开发者比较熟悉的 ES6 新增的Generator。

// function calculate() {

//   console.log('先计算')

//   return 3 * 3
// }

// function *myGenerator() {
//   if (true) {
//     yield calculate()
//   }

//   console.log('再执行。')
// }

// const g = myGenerator()

// console.log(g.next())
// console.log(g.next())





// async function async1 () {
//   console.log('async1 start')
//   await async2()
//   console.log('async1 end')
// }

// async function async2 () {
//   console.log('async2')
// }

// console.log('script start')
// async1()
// console.log('script end')

// async function sayName() {
//   // return 'name' // 相当于 return Promise.resolve('name')
//   return Promise.resolve('name')
// }

// console.log(sayName()) // Promise { 'name' }

// sayName().then(res => console.log(res)) // name










const o = {
  fn: function (params) { // 方法会丢失
      console.log('is fn')
  },
  reg: /\.js$/ig, // 空对象: {}
  date: new Date(), // 时间会被计算出来: "2023-05-24T03:07:23.547Z"
  n: null, // null
  u: undefined, // 丢失
  name: 'hello alexCc', // 'hello alexCc'
  s: new Set([1,1,2,2,3,3]), // 空对象: {}
  m: new Map() // 空对象: {}
}


structuredClone(o)


