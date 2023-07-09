const fn = (res = 0) => {
  return new Promise(r => {
    setTimeout(() => {
      console.log(1)
      r(11 + res)
    }, 1000)
  })
}

function run(list) {
  // 递归
  // const f = list.shift()
  // if (f) {
  //   f().then(res => {
  //     console.log(res)
  //     run(list)
  //   })
  // }
  
  // 循环
  // 首先创建一个初始值为 resolved 状态的 Promise 对象 promise，
  // 每次将当前 Promise 对象和下一个函数 fn 组合成一个新的 Promise 对象，
  // 并将其赋值给 promise。
  // 这样，每次循环都会生成一个新的 Promise 对象
  // 它的状态取决于上一个 Promise 对象和当前函数的执行结果。
  // 最后返回的是最后一个 Promise 对象，它的状态取决于所有函数的执行结果。
  // 这个函数的作用是实现 Promise 链式调用
  // 可以方便地处理多个异步操作的依赖关系。
  let promise = Promise.resolve(0)
  console.log(promise)
  for(const fn of list) {
    promise = promise.then(fn)
  }
  return promise
}
// run([fn, fn, fn, fn])



// let obj = {}
// let obj1 = obj
// const wm = new WeakMap()
// wm.set(obj1, '123123')
// obj = null
// console.log(wm.get(obj1))

function asyncFn (timeout) {
  return new Promise(r => {
    setTimeout(r, timeout, timeout);
  })
}

const tasks = [
  () => asyncFn(1000),
  () => asyncFn(4000),
  () => asyncFn(2000),
  () => asyncFn(3000),
]
// async function limitRequest(tasks, limit = 2) {
//   const taskPool = new Set()
//   for (const task of tasks) {
//     const promise = task()
//     taskPool.add(promise)
//     promise.then(res => {
//       console.log(res)
//       taskPool.delete(promise)
//     })
//     if (taskPool.size >= limit) {
//       await Promise.race(taskPool)
//     }
//   }
// }
// limitRequest(tasks)



// function * oneByOne(tasks) {
//   yield console.log(1)
//   for (let fn of tasks) {
//     yield fn().then(res => {
//       console.log(res)
//     })
//   }
//   yield console.log(2)
// }
// const res = oneByOne(tasks)
// console.log(res)
// res.next()
// res.next()
// res.next()
// res.next()
// res.next()
// const done = res.next()
// console.log(done)

function debounce(fn, timeout, immediate = false) {
  let timer = null
  let count = 0
  let callnow = true
  let originImmediate = immediate

  return function(...args) {
    count++
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      if (callnow) {
        fn.apply(this, [count])
        callnow = false
        immediate = false
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, [count])
        callnow = true
        immediate = originImmediate
      }, timeout);
    }
  }
}

function throttle(fn, delay) {
  let now = Date.now()
  return function(...args) {
    if (Date.now() - now > delay) {
      now = Date.now()
      fn.apply(this, args)
    }
  }
}

// const handleWindowResize = (...args) => {
//   console.log(this, args);
// }
// window.addEventListener('resize', debounce(handleWindowResize, 1000))

const container = document.querySelector('.container')
container.onmousemove = debounce(function(value) {
  this.innerHTML = value
}, 300, true)

