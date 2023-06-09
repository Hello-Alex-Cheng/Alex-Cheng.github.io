// const cat = {
//   name: '喵喵喵',
//   sayName(params) {
//     console.log('params ', params)
//     setTimeout(() => {
//       console.log(this) // cat
//       console.log(this.name) // 喵喵喵
//     })
//   }
// }

// const dog = {
//   name: '汪汪汪'
// }

// cat.sayName.call(dog, 1,2,3)







// setImmediate(() => {
//   console.log('setImmediate')
// })

// process.nextTick(() => {
//   console.log(1)
// })

// console.log(2)

// setTimeout(() => {
//   console.log(3)
// }, 0);








// setImmediate(() => {
//   console.log('setImmediate')
// })

// process.nextTick(() => {
//   console.log(1)
// })

// console.log(2)

// new Promise(r => {
//   console.log(7)
//   r()
// }).then(() => {
//   console.log(8)
// })

// setTimeout(() => {
//   console.log(3)
// }, 0);
// setTimeout(() => {
//   console.log(4)
// }, 1000);
// setTimeout(() => {
//   console.log(5)
// }, 0);

// console.log(6)

// // 2 7 6 1 8 3 5 setImmediate 4









const obj = {
  name: 'is obj',
  girlfriend: {
    name: '小红'
  },
  list: [1,2,3],
  u: undefined,
  n: null,
  f: function() {
    console.log('func')
  },
  arrow: () => {},
  error: new Error('错误啦')
}

// // 属于浅拷贝
// const o = Object.assign({}, obj)

// obj.name = 'is o'
// obj.girlfriend.name = '小花'

// console.log(o)


// // 深拷贝
// function deepClone(obj) {
//   const o = {}

//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
      
//       if(typeof obj[key] === 'object') {
//         o[key] = deepClone(obj[key])
//       } else {
//         o[key] = obj[key];
//       }
//     }
//   }

//   return o
// }


// const o = deepClone(obj)

// obj.girlfriend.name = '小花'
// obj.list[1] = 99

// console.log('??', o)
// console.log('??', obj)





// // JSON.stringify实现深克隆
// // JSON.stringify存在的问题
// // 如果属性值是 undefined 或者是方法（含箭头函数），克隆出来后，undefined 和函数会丢失

// const o = JSON.stringify(obj)

// console.log(o)



// class User {
//   constructor(name) {
//     this.name = name
//   }
// }

// class Admin extends User {
//   constructor() {
//     // 子类继承父类，写了 constructor 函数，必须手动调用 super()
//     // super 指的是父类(User)
//     super()

//     this.age = 28
//   }
// }

// const a = new Admin()

// console.log(a)






// // async 将函数包装成 Promise
// // 相当于 function say() { return new Promise() }

// async function say() {
//   return 'say hello'
// }

// const s = say()

// s.then(value => {
//   console.log('value ', value)
// })










// // 可缓存的纯函数

// function add(a, b) {
//   console.log('计算中...')

//   return a + b
// }

// const resolver = (...args) => JSON.stringify(args)

// function memoize(func, resolver) {
//   const cache = {}

//   return function(...args) {
//     const key = resolver(...args) // "[a, b]"

//     if (cache[key]) {
//       return cache[key]
//     } else {
//       return cache[key] = func(...args)
//     }
//   }
// }

// const memoized = memoize(add, resolver)

// console.log(memoized(9, 9))
// console.log(memoized(9, 9))
// console.log(memoized(9, 9))








// // 函数柯里化
// function curry(func) {
//   const curried = function(...args) {
//     // 函数的length 表示它有几个参数
//     if (args.length < func.length) {
//       // 累加参数
//       return (...rest) => curried(...args, ...rest)
//     } else {
//       // 传入的参数和方法接收的参数相同，直接执行 func 函数
//       return func(...args)
//     }
//   }

//   return curried
// }

// function add(a, b, c) {
//   return a + b + c
// }

// const curried = curry(add)
// const fn = curried(1)

// console.log(fn(2)(3))











// const str = 'hello - '

// function add1(str) {
//   return str + 'wor'
// }

// function add2(str) {
//   return str + 'l'
// }

// function add3(str) {
//   return str + 'd'
// }

// // console.log(add3(add2(add1(str))))

// function flow(...fns) {
//   if (fns.length === 1) {
//     return fns[0]
//   }

//   return fns.reduceRight((a, b) => {
//     // 从右往左
//     // 第一步 a === add3, b === add2
//     // 第二步 a === (...args) => add3(add2(...args)), b === add1
//     // 第二步的 a 显示为 (...args) => a(b(...args))
//     // 返回 a(add1(...args))

//     // 当我们最后调用 f 时，会先计算 add1(...args)，拿到结果后，执行 a "add3(add2(add1(...args)))"
//     return (...args) => a(b(...args))
//   })
// }

// const f = flow(add1, add2, add3)





// function Person(name) {
//   this.name = name
//   this.colors = ['red', 'blue']
// }

// Person.prototype.sayName = function() {
//   console.log(this.name)
// }

// function User() {
//   Person.call(this, 'xiaoming')

//   this.age = 19
// }

// User.prototype = new Person()
// User.prototype.constructor = User

// const u = new User()

// console.log(u instanceof User)
// console.log(u instanceof Person)
// console.log(User.prototype.isPrototypeOf(u))
// console.log(Person.prototype.isPrototypeOf(u))











// let person = {
//   name: "Nicholas",
//   friends: ["Shelby", "Court", "Van"]
// };
// let anotherPerson = object(person);
// anotherPerson.name = "Greg";
// anotherPerson.friends.push("Rob");
// let yetAnotherPerson = object(person);
// yetAnotherPerson.name = "Linda";
// yetAnotherPerson.friends.push("Barbie");
// console.log(person.friends);   // "Shelby, Court, Van, Rob, Barbie"











// const proxy = new Proxy({
//   name: 'hello'
// }, {
//   get(target, property) {
//     console.log(target, property)
//     return 11
//   }
// })

// console.log(proxy.name)







// function timeout(ms) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms, 'done') // 第三个参数，是传递给 resolve 方法的
//   })
// }
// console.log(1)
// timeout(1000).then(res => {
//   console.log(res)
// })

// console.log(2)





// const p1 = new Promise((r, reject) => {
//   setTimeout(() => {
//     reject(new Error('fail'))
//   }, 3000);
// })

// const p2 = new Promise((r, reject) => {
//   r(p1)
// })

// p2.then(result => {
//   console.log('result ', result)
// }, error => {
//   console.log('error ', error)
// })







// new Promise(r => {
//   r(x + 2)
// }).then(res => {
//   console.log('结果 ', res)
// }).catch(err => {
//   console.log('错误 ', err)
// }).then(() => {
//   console.log('随便打印')
// }).finally(() => {
//   console.log('最后打印')
// })



// const p3 = function() {
//   return new Promise(r => {
//     setTimeout(() => {
//       r('p3 success')
//     }, 3000);
//   })
// }

// const allP = Promise.all([1, 2, p3()])

// allP.then(r => {
//   console.log(r)
// })



// console.log(Promise.resolve('helo') instanceof Promise)

// const sleep = function(ms) {
//   return new Promise(r => {
//     console.log(xxxxx + 3)

//     setTimeout(() => {
//       r()
//     }, ms)
//   })
// }

// async function sayName() {
//   console.log(1)

//   try {
//     await sleep(3000)
//   } catch (error) {
//     console.log(' - - - ', error)
//   }


//   console.log(2)

//   return 'name'
// }

// sayName().then(res => console.log(res))


// const m = new Map()

// const o = {
//   name: '1'
// }

// m.set(o, '这是一个对象')
// m.set('hello world', '这是字符串')

// console.log(m.size)
// console.log(m.has(o))
// console.log(m.get(o))

















// var resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)];

// var p = Promise.race(resolvedPromisesArray);
// // immediately logging the value of p

// console.log(p)

// // p.then(res => {
// //   console.log(res)
// // })
// setTimeout(function(){
//   console.log('the stack is now empty')
//   console.log(p)
// });



class PromiseQueue {
  constructor(concurrency) {
    this.concurrency = concurrency; // 并发执行的数量
    this.running = 0; // 当前正在执行的 Promise 数量
    this.queue = []; // 存储待执行的 Promise 的队列
  }

  add(promiseFn) {
    return new Promise((resolve, reject) => {
      // 创建一个包装过的 Promise，用于处理执行结果
      const wrapperFn = () => promiseFn().then(resolve).catch(reject);
      
      // 将包装过的 Promise 加入队列
      this.queue.push(wrapperFn);
      
      // 如果当前正在执行的 Promise 数量小于并发执行的数量，开始执行队列中的下一个 Promise
      if (this.running < this.concurrency) {
        this.runNext();
      }
    });
  }

  runNext() {
    if (this.queue.length > 0 && this.running < this.concurrency) {
      const promiseFn = this.queue.shift();
      this.running++;
      promiseFn()
        .then(() => {
          // Promise 执行完成后，继续执行队列中的下一个 Promise
          this.running--;
          this.runNext();
        })
        .catch(() => {
          this.running--;
          this.runNext();
        });
    }
  }
}

// 创建一个最多并发执行 2 个 Promise 的队列
const queue = new PromiseQueue(2);

// 添加多个 Promise 到队列中
queue.add(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Promise 1');
      resolve();
    }, 1000);
  });
});

queue.add(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Promise 2');
      resolve();
    }, 500);
  });
});

queue.add(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Promise 3');
      resolve();
    }, 300);
  });
});

queue.add(() => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Promise 4');
      resolve();
    }, 400);
  });
});


queue.runNext()
