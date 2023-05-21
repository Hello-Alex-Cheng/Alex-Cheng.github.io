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

function myNew(fn, ...args) {
  const instance = Object.create(fn.prototype)

  const res = fn.apply(this, args)

  // 以防万一 fn 函数返回值不是对象
  return typeof instance === 'object' ? res : instance
}


