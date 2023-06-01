
// alert('test.js: 文档开始解析了!');
const say = function(...args) {
  console.log(this.name, args)
}

// say.call({name: 'alex'})

Function.prototype.myCall = function(context, ...args) {
  // context 就是 call 第一个参数，上下文环境
  context = context || window

  const s = Symbol('fn')
  context[s] = this // 将方法 say 赋值给 context 对象,

  const result = context[s](...args)

  delete context[s]
  
  return result
}

Function.prototype.myBind = function(context, ...args) {
  // context 就是 call 第一个参数，上下文环境
  context = context || window
  const s = Symbol('fn')

  context[s] = this

  return function(..._args) {
    args = args.concat(_args)
    const r = context[s](...args)

    delete context[s]

    return r
  }
}


// say.myBind({name: 'alex'}, 1, 2, 3, 4)()


function pipe(...fns) {
  return function(value) {
    return fns.reduce((pre, cur) => {

      return cur(pre)
    }, value)
  }
}

// addOne(double(square(value)))

const square = v => v * v
const double = v => v * 2
const addOne = v => v + 1

const res = pipe(square, double, addOne)

// console.log(res(3))







// const froms = [{ age: 1}, {age: 2}]

// const froms1 = Array.from(froms)

// froms1.map(i => {
//   i.age = i.age + 1
// })

// console.log(froms)
// console.log(froms1)






// const arr = [1, [2, 3, [4, [ 5 ]]]]

// function flatten(arr) {
//   const result = []

//   for (let i = 0; i < arr.length; i++) {
//     if (Array.isArray(arr[i])) {
//       result.push(...flatten(arr[i]))
//     } else {
//       result.push(arr[i])
//     }
//   }

//   return result
// }

// console.log(flatten(arr))








// 排序

const arr = [3, 1, 2, 6, 1, 99, 0, -1, 5]

// 冒泡
function bubbleSort(arr) {
  let length = arr.length

  for (let i = 0; i < length; i++) {
    for (let j = 1; j < length - i; j++) {
      if (arr[j] < arr[j - 1]) {
        // const temp = arr[j]
        // arr[j] = arr[j - 1]
        // arr[j - 1] = temp

        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]]
      }
    }
  }

  return arr
}

// 选择排序: 找到最小的值，排到第一位，再找到最小的值，排到第二位

function selectSort(arr) {
  let minIndex
  for (let i = 0; i < arr.length; i++) {
    // 假设一个最小的值
    minIndex = i

    // 让 j = i，表示前面已经排序了的，就不需要再排了
    for (let j = i; j < arr.length; j ++) {
      // 一轮下来，肯定能找到一个最小值 index
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }

    // 如果 minIndex !== i，表示存在比arr[minIndex]还小的值 arr[i]，和 i 进行交换
    if (minIndex !== i) {
      [arr[minIndex], arr[i]] = [arr[i], arr[minIndex]]
    }
  }

  return arr
}

// 插入排序
// [3, 2, 1, 6, 1, 99, 0, -1, 5]
function insertSort(arr) {
  // 1. 默认第一项是排序了的，所以遍历时从数组下标为 1 的位置开始

  // 2. 用 for 循环将当前遍历的项存储起来，current，并记录当前项的下标currentIndex

  // 3. 通过 while 循环，current 前面的项 和 current 比较
  
  // arr: [3, 2, 1, 6, 1, 99, 0, -1, 5]
  // 第一轮：current = 2, currentIndex = 1
  // current 前一项`arr[currentIndex - 1] = 3`比 current = 2 大，那就让当前项 arr[currentIndex] 等于前一项，相当于大数字往后挪了一位，[3, 3, 1, 6 ...]
  // 然后 currentIndex-- = 0，currentIndex > 0 不成立，结束 while，此时前两项是 [3, 3]
  // 最后，currentIndex = 0，需要让当前项（小值）插入到正确✅的位置
  // arr[currentIndex] = current，前两项就排好序了 [2,3]

  // arr: [2, 3, 1, 6, 1, 99, 0, -1, 5]
  // 第二轮：current = 1, currentIndex = 2
  // current 的前一项 `arr[currentIndex - 1] = 3` 比 current = 1 大，需要将大的往后挪一位，arr[currentIndex: 2] = arr[currentIndex - 1]，[2, 3, 1] => [2, 3, 3]
  // 然后 currentIndex-- = 1，还要判断前面的项，是不是有比 current 大的数值，arr[currentIndex-1] > current （2 > 1）成立，所以将大的数值往后挪一位 [2, 3, 3] => [2, 2, 3]
  // currentIndex-- = 0，此时 currentIndex 等于 0，不符合 while 循环的条件了，退出
  // 最后，我们需要将小的值插入到正确✅的位置：arr[currentIndex: 0] = current(1)  => [1, 2, 3 ...]


  let current, currentIndex // 当前项, 当前项下标

  for (let i = 1; i < arr.length; i++) {

    current = arr[i] 
    currentIndex = i

    // 让当前项的前面的每一项和当前项 current 比较，
    while (currentIndex > 0 && arr[currentIndex - 1] > current) {
      arr[currentIndex] = arr[currentIndex - 1]
      currentIndex--
    }

    // currentIndex = 0
    arr[currentIndex] = current
  }

  return arr
}


console.log(insertSort(arr))
