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


const o = {
  name: '对象',
  age: 19,
  favor: ['sing', 'dance']
}

const proxy = new Proxy(o, {
  get(target, key, receiver) {
    console.log('有人来获取属性啦：', target, key)

    return target[key]
  },
  set(target, key, value) {
    target[key] = value
  }
})

// console.log(proxy.name)

// proxy.name = '123'

// console.log(proxy.name)

proxy.favor.push('hahahahahah')

console.log(proxy.favor)


