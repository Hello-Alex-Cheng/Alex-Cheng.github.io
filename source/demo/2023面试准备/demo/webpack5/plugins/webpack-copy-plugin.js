
class Copy {
  constructor(options) {
    console.log('options', options)
  }

  apply(compiler) {
    // compiler.hooks
    // hooks 上有许多 webpack 的生命钩子
    // 1. done // 编译完成钩子
    // 2. afterEmit // 打包完成钩子
    // console.log('🔥', compiler.hooks)
  }
}

module.exports = Copy
