---
layout: Vue3
title: Vue3项目实战(三)：登录/请求模块/鉴权
date: 2022-12-23 23:34:24
tags: 工程化,Vue3,Config
banner_img: /img/login.png
index_img: /img/login.png
excerpt: axios模块/接口请求模块/登录请求动作/Token缓存/鉴权
---

# 配置环境变量 / 封装 axios

封装的 axios 模块，至少具备一种能力，**根据当前环境的不同，设定不同的 baseUrl**

`@vue/cli` 模式

> 官网：https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F

请注意，只有 NODE_ENV，BASE_URL 和以 VUE_APP_ 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。

除了 VUE_APP_* 变量之外，在你的应用代码中始终可用的还有两个特殊的变量：

- NODE_ENV - 会是 "development"、"production" 或 "test" 中的一个。具体的值取决于应用运行的模式。
- BASE_URL - 会和 vue.config.js 中的 publicPath 选项相符，即你的应用会部署到的基础路径。

```js
// .env.development

username=chenghaolun // 不会暴露出来

VUE_APP_BASE_API=/api // 暴露出来，可以通过 process.env 获取
```

所有解析出来的环境变量都可以在 public/index.html 中以 HTML 插值中介绍的方式使用。

```js
<title>网站标题 <%= VUE_APP_BASE_API %></title>
```

我们可以打印 `process.env` 看看：

```js
{
  BASE_URL: "/",
  NODE_ENV: "development",
  VUE_APP_BASE_API: "/api",
}
```

# 根据环境变量切换 baseUrl

```js
import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

export default service
```

# 封装接口请求模块

在 `src` 下创建 `api` 文件夹，并创建 `sys.ts` 文件，用于处理系统的一些接口请求：

```js
import request from '@/utils/request'

export const login = data => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
```

# 封装登录请求动作

我们不希望在点击登录按钮时，就立马调用登录接口，而是将其封装到 `vuex` 中，当然也可以使用 `pinia`。

在 store 下创建 modules 文件夹，并创建 `user.ts` 模块，用于处理所有的 `用户相关` 的内容（token获取、用户信息获取、退出登录...）

**注意**

当我们创建好了 store 时，在 vue template 里面使用 `$store.state.globalName` 可能会爆红，原因是没有声明 `$store`

```js
// src/vuex.d.ts
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // 声明自己的 store state
  interface State {
    globalName: string
  }

  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}

```

**创建 user.ts** 模块

```js
// store/index.js

import { createStore } from 'vuex'
import user from './modules/user'

export default createStore({
  state() {
    return {
      globalName: 'Hello_AlexCc'
    }
  },
  modules: {
    user
  }
})
```

**创建 `modules` 文件夹**
```js
import md5 from 'md5'
import { login } from '@/api/sys'

export default {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {
    login(context: any, userInfo: any) {
      const { username, password } = userInfo
      return new Promise((resolve, reject) => {
        login({
          username,
          password: md5(password)
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
```

到这里，我们的登录请求动作就完成了，我们只需要在点击登录按钮时，获取到 store 并 dispatch login 方法即可：

```js
// 获取到 store 实例
const store = useStore()

// user.value 是登录表单的 ref

store
  .dispatch('user/login', user.value)
  .then(res => {
    console.log('login res', res)
  })
  .catch(err => {
    console.log('err ', err)
  })
```

# 写一个简单的 node 服务器
```js
const express = require('express');
const app = express()

app.get('/user', (req, res) => {
  res.json({
    code: 0,
    msg: "hello server 9999"
  })
})

app.listen(9999, () => {
  console.log('server site an port 9999 ...')
})
```

# 配置 devServer

我们将 项目 和 node 服务跑起来之后，点击登录，发现报错了 404，是因为请求 `http://localhost:8080/#/api/user` 并不存在，接口请求地址资源找不到，我们的接口写在 node 端，那么 node 服务跑起来后，我们怎么去访问呢，这里就要用到 webpack 的 `devServer` 了。

```js
// vue.config.js

devServer: {
  // 配置代理
  proxy: {
    // 当地址中有/api的时候会触发代理机制，因为我们配置了 axios baseURL，所以每个请求中，都会以 `/api` 开头
    '/api': {
      // 要代理的服务器地址  这里不用写 api
      // node 服务
      target: 'http://localhost:9999',
      changeOrigin: true, // 是否跨域
      pathRewrite: {
        // 必须得带上,否则，真正的请求中就会带上 '/api'，'http://localhost:9999/api/user'
        '^/api': ''
      }
    }
  }
},
```

最后，我们再重启项目，点击登录，就会拿到 `user` 接口返回的的结果了。

![](/img/api-user.png)


# 本地缓存处理方案

存储 token 分为两种：

- 本地缓存：localstorage
- 全局状态管理：vuex

保存在 `localstorage` 中，是为了在 token 没过期的情况下，让用户自动登录。保存在 vuex 中，是为了方便在其他位置使用。

那么我们来定义 `localstorage` 的相关方法吧！

```js
// utils/storage.ts

/**
 * 存储数据
 */
export const setItem = (key: string, value: unknown): void => {
  // 将数组、对象类型的数据转化为 JSON 字符串进行存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value as string)
}

/**
 * 获取数据
 */
export const getItem = (key: string): unknown => {
  const data = window.localStorage.getItem(key) as string
  try {
    return JSON.parse(data)
  } catch (err) {
    // 如果报错了，直接将数据发送给使用端
    return data
  }
}

/**
 * 删除数据
 */
export const removeItem = (key: string): void => {
  window.localStorage.removeItem(key)
}

/**
 * 删除所有数据
 */
export const removeAllItem = (key: string): void => {
  window.localStorage.clear()
}
```

然后，我们来处理 vuex user 模块，在 state 中定义 `token`，以及设置 token 的 mutations 方法。

```js
import { setItem, getItem } from '@/utils/storage'

// 我们可以定义一个常量文件夹，用来设置 TOKEN 常量，或者各种其他常量值
const TOKEN = 'token'

{
  state: () => ({
    token: getItem(TOKEN) || ''
  }),
  mutations: {
    setToken(state: IState, token: string): void {
      state.token = token

      // 本地存储 token
      setItem(TOKEN, token)
    }
  },
}
```

在 actions login 方法中，请求成功后我们需要 commit 一个 mutation，来触发 setToken 方法:

```js
context.commit('setToken', res.data.data.token)
```

到这，我们的 token 存储就完成了，我们可以在页面上将其显示出来看看。

```js
<p>token: {{ $store.state.user.token || '暂无Token' }}</p>
```

# 接口响应数据统一处理

我们在 `vuex user` 模块中通过 login 接口获取到了 `token`，当我们处理数据时，会发现需要通过好几个 `.` 的方式去拿到token，层级太深了，不太方便。

那么我们可以通过 `axios` 的响应拦截器来处理这种情况。

```js
import { ElMessage } from 'element-plus'

// 响应拦截器
service.interceptors.response.use(
  response => {
    const { success, message, data } = response.data

    if (success) {
      return data
    } else {
      ElMessage.error(message)
      return Promise.reject(new Error(message))
    }
  },
  error => {
    ElMessage.error(error.message) // 提示错误信息
    return Promise.reject(error)
  }
)
```

修改好 axios 响应拦截器之后，我们就可以改写一下 `vuex user` 下的 `actions login` 方法了。

```js
.then(res => {
  context.commit('setToken', res.token) // 这样获取 token 是不是就方便很多了
  resolve(res)
})
```

# 登录后操作

我们可以创建一个 `src/layout` 文件夹，登录成功后，用来显示的主容器，将 `layout/index.vue` 配置在 router 路由表中

```js
{
  path: '/',
  component: () => import('@/layout/index.vue')
}
```

登录成功后，跳转到 `layout` 页面

```js
// login/index.vue

store
  .dispatch('user/login', user.value)
  .then(() => {
    router.replace('/')
  })
  .catch(err => {
    console.log('err ', err)
  })
```

# 登录鉴权

到这里，我们点击登录，就可以跳转到 `layout` 页面了，但是我们如果在地址栏手动输入 `/login`，我们依然可以回到 `login` 页面，明明我们登录成功，有了 token 还会跳到 login 页面，这是为什么呢？

因为我们到这里，还未做登录鉴权，即使存在token，我们并未做任何的权限控制和处理。

那么我们要做什么处理呢？

- 当用户未登录时，不允许进入除 `login` 之外的任何页面

- 用户登录成功之后，token 未过期之前，不让用户进入 `login` 页面

实现这个功能的核心就是使用 `vue-router` 的 **路由守卫**

> 传送门：https://router.vuejs.org/zh/guide/advanced/navigation-guards.html

那么我们创建 `permission.ts` 来处理路由守卫吧：

因为我们的 token 定义在 `modules user` 中，每次获取 token，需要使用 `store.state.user.token`，这样显得太长了，我们可以定义 `store getters`，来方便获取 `token`：

```js
// getters.ts
const getters = {
  token: (state: any) => state.user.token
}
export default getters
```

然后将其放入 store 的 getters 中
```js
import getters from './getters'

export default createStore({
  state() {
    return {
      globalName: 'Hello_AlexCc'
    }
  },
  getters,
  modules: {
    user
  }
})
```

然后创建 permissions.ts 文件，定义路由前置守卫。

判断 token 是否存在，如果存在 token，并且 `to.path` 等于 `/login`，那么不让跳转到登录页，而是去 `layout` 页面。

如果 `to.path` 不是 `/login`，直接执行 `next` 方法即可。

如果 token 不存在，并且 `to.path` 是 `/login`，直接跳转 `next()`

如果 token 不存在并且 `to.path` 不是 `/login`，我们让其跳转到登录页 `next('/login')`

```js
// permissions.ts

import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  // 判断token是否存在
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})
```

到这里，我们点击登录，就会去到根路径下 '/'，也就是 `layout` 页面。这时我们在地址栏输入 `/login`，就不会再去登录页面了。

我们还可以改进一下，当 `token` 不存在时，我们判断了 `to.path === '/login'`，这样限制死了，将来我们还有 `/404` 以及 `/401` 等页面，这些页面也是不需要 `token` 就能访问的，我们不希望在 `if` 语句里面加太多的判断逻辑，这时，我们可以定义一个 `白名单`，专门处理不需要 `token` 的路径:

```js
const whiteList = ['/login']

if (whiteList.indexOf(to.path) > -1) {
  next()
} else {
  next('/login')
}
```
