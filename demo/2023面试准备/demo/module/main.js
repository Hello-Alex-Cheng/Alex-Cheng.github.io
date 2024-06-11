// import { count, incCount } from './lib.js'

// incCount()

// console.log(count)

const o = {
  // fn: function (params) { // 会报错
  //     console.log('is fn')
  // },
  reg: /\.js$/ig, // /\.js$/gi
  date: new Date(), // Wed May 24 2023 11:23:31 GMT+0800 (中国标准时间) {}
  n: null, // null
  u: undefined, // undefined
  name: 'hello alexCc', // 'hello alexCc'
  s: new Set([1,1,2,2,3,3]), // Set(3) {1, 2, 3}
  m: new Map() // Map(0) {size: 0}
}

console.log(structuredClone(o))
