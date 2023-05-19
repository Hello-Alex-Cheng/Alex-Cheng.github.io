import mixins from "./mixins.js"

// 定义全局组件
Vue.component('global-component')

// 创建 Vue 子类
const MyCompnent = Vue.extend({
  mixins: [mixins],
  template: `
    <h1>mixin</h1>
  `
})

// new MyCompnent().$mount('#my-component')

