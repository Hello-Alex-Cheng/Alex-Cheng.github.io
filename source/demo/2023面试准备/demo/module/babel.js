async function async1 () {
  console.log('async1 start') // 2
  await async2()
  console.log('async1 end') // 5 关键在这一步，它相当于放在 then callback 中，最后执行
}

async function async2 () {
  console.log('async2') // 3
}

console.log('script start') // 1
async1()
console.log('script end') // 4