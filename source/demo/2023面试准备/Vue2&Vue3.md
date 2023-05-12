# Vue组件通信

- props 和 $emit

  ```js
  // 触发父组件传递过来的事件
  this.$emit('xxx', params)
  ```

- 组件间通信 - 自定义事件
  ```js
  const eventBus = new Vue()

  export default eventBus
  ```

  用法：

  ```js
  import event from './eventBus.js'

  // 触发事件
  event.$emit('eventName', params)

  // 接收事件
  event.$on('eventName', this.functionName)

  // 卸载事件，一般是放在组件销毁的生命钩子里
  // 防止造成内存泄露
  beforeDestroy() {
    event.$off('eventName')
  }
  ```

# Vue组件生命周期

- beforeCreate

  实例在内存中创建出来，但未初始化 data和 methods

- created

  实例已经在内存中创建完成，此时data和methods已初始化

- beforeMount

  此时已经完成了模版的编译，只是还没有渲染到界面中去

- mouted

  模版已经渲染到了浏览器，创建阶段结束，即将进入运行阶段（最新的dom）

- beforeUpdate

  界面中的数据还是旧的，但是data数据已经更新，页面中和data不会保持同步

- updated

  页面重新渲染完毕，页面中的数据和data保持一致
- beforeDestroy

  执行该方法的时候，Vue的生命周期已经进入销毁阶段，但是实例上的各种数据和方法还处于可用状态

- destroyed

   组件已经全部销毁，Vue实例已经被销毁，Vue中的任何数据都不可用

# 父子组件生命周期的执行过程

Vue官网生命钩子示例图拆解

> https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e06a5ec0d21f4907ba780ae03da4d548~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp

父子组件生命钩子调用过程

创建和挂载过程（子组件挂载完成后，父组件才会挂载完毕）

1. parent created

2. child created

3. child mounted

4. parent mounted

组件更新过程 同上。

1. parent beforeUpdate

2. child beforeUpdate

3. child updated

4. parent updated

组件销毁过程。
