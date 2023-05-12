---
layout: Vue,JavaScript
title: Vue Router 4+
date: 2022-12-16 12:22:00
tags: JS,Vue-Router,Vue3,
banner_img: /img/vue-logo.png
index_img: /img/vue-logo.png
excerpt: 富有表现力的路由语法、细致的导航控制、基于组件的配置方法、支持历史模式、 支持滚动控制、支持自动编码
---

# Vue Router

## history

```js
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(), // hash 模式
  routes,
})
```

hash 模式底层是通过 `hashchange` 监听的：

```js
window.addEventListener('hashchange', () => { ... })
```

history 模式 (`createWebHistory`)，底层是通过 `popstate` 监听的:

```js
window.addEventListener('popstate', () => { ... })
```

# 在 setup 中访问路由和当前路由
因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。

```js
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()

    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
        },
      })
    }
  },
}
```

route 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该避免监听整个 route 对象。在大多数情况下，你应该直接`监听你期望改变的参数`。

请注意，在模板中我们仍然可以访问 $router 和 $route，所以不需要在 setup 中返回 router 或 route。

