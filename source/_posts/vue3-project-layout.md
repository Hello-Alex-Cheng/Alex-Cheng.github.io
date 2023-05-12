---
layout: Vue3
title: Vue3项目实战(四)：Layout架构实现
date: 2022-12-24 15:00:48
tags: 工程化,Vue3
banner_img: /img/layout.png
index_img: /img/layout.png
excerpt: layout架构实现，包括动态菜单栏、动态的面包屑等方案、侧边栏伸缩动画、退出的通用逻辑封装以及Vue3.2版本中的组件状态驱动的动态 CSS 值等等。
---

# 实现 layout 布局

首先，我们要改造 `layout/index.vue`，先定义好结构，然后写样式即可。

```html
<div class="app-wrapper">
  <!-- 左侧 menu -->
  <siderbar class="sidebar-container"></siderbar>

  <div class="main-container">
    <div class="fixed-header">
      <!-- 顶部 -->
      <nav-bar></nav-bar>
    </div>

    <!-- 主要内容 -->
    <app-main></app-main>
  </div>
</div>
```

结构定义好了，我再定义样式以及样式文件。在 `src` 下创建 `styles` 文件夹，主要存放 `scss` 的一些样式文件，其中就包括通用的 `reset.scss` 文件，处理基础的 html 元素样式。`mixin.scss` 编写通用的样式表，定义通用的样式变量 `variables.scss`。

```scss
// styles/index.scss

@import './reset.scss';
@import './variables.scss';
@import './mixin.scss';
@import './sidebar.scss';
```

## scss 的使用技巧

这里我们主要看下 `mixin.scss` 和 `variables.scss` 的一些技巧和用法：

- mixin.scss

```css
/* 清除浮动，在 .vue 文件中使用的时候直接引用即可：@include clearfix; */
@mixin clearfix {
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

/* 滚动条的设置 */
@mixin scrollBar {
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}

@mixin relative {
  position: relative;
  width: 100%;
  height: 100%;
}


```
- variables.scss

```scss
// sidebar
$menuText: #bfcbd9;
$menuActiveText: #ffffff;
$subMenuActiveText: #f4f4f5;

$menuBg: #304156;
$menuHover: #263445;

$subMenuBg: #1f2d3d;
$subMenuHover: #001528;

$sideBarWidth: 210px;
$hideSideBarWidth: 54px;
$sideBarDuration: 0.28s;

// https://www.bluematador.com/blog/how-to-share-variables-between-js-and-sass
// JS 与 scss 共享变量，在 scss 中通过 :export 进行导出，在 js 中可通过 ESM 进行导入
:export {
  menuText: $menuText;
  menuActiveText: $menuActiveText;
  subMenuActiveText: $subMenuActiveText;
  menuBg: $menuBg;
  menuHover: $menuHover;
  subMenuBg: $subMenuBg;
  subMenuHover: $subMenuHover;
  sideBarWidth: $sideBarWidth;
}

```

关于 `:export` 的使用方式，我们可以查阅一些文档：

> https://www.bluematador.com/blog/how-to-share-variables-between-js-and-sass

## 编写 `layout/index.vue` 样式
```scss
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix; // 使用 mixin 中的样式
  position: relative;
  height: 100%;
  width: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
}
</style>
```

## 给 SideBar 赋予动态的背景色
```js
<template>
...
  <!-- 左侧 menu -->
  <sidebar
    class="sidebar-container"
    :style="{ backgroundColor: variables.menuBg }"
  />
...
</template>

<script setup>
// scss 通过 :export 导出了变量
import variables from '@/styles/variables.scss'
</script>
```

## script导入scss文件报错

在 vue 项目里引用.scss文件，vscode编辑器会有红色波浪线，提示找不到模块

![](/img/import-scss-error.png)

找到 `shims-vue.d.ts` 声明文件，添加如下代码:

```js
declare module '*.scss' {
  const css: {
    // 定义的变量，通过 `variables.menuBg` 取值时，就不会报错了
    menuBg: string;
  }
  export default css
}
```

将来，新增了新的样式变量，我们在 css 下添加即可。

## 设置NavBar样式和头像布局

```js
<template>
  <div class="navbar">
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar
            shape="square"
            :size="40"
            :src="'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
          ></el-avatar>
          <el-icon><Tools /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item> 主页 </el-dropdown-item>
            </router-link>
            <a target="_blank" href="">
              <el-dropdown-item>Vue3</el-dropdown-item>
            </a>
            <el-dropdown-item divided> 退出 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Tools } from '@element-plus/icons-vue'
</script>
<style scoped lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .right-menu {
    display: flex;
    align-items: center;
    float: right;
    padding-right: 16px;

    ::v-deep .right-menu-item {
      display: inline-block;
      padding: 0 18px 0 0;
      font-size: 24px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    ::v-deep .avatar-container {
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .el-avatar {
          --el-avatar-background-color: none;
          margin-right: 12px;
        }
      }
    }
  }
}
</style>
```

## 效果图

![](/img/layout-base.png)

# 获取用户信息

到目前为止，头像是静态的，也没有实现登出的逻辑，现在来实现一下。

## 设置请求头

我们不希望每次调接口时，都去设置 `token`，那么我们可以在 `请求拦截器` 中去设置:

```js
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `Baerer ${store.getters.token}`
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```

## 编写 userInfo 接口

简单实现一下 `/userinfo` 接口，主要是模拟前后端联调的流程。

```js
const express = require('express');
const app = express()

app.get('/userinfo', (req, res) => {
  // 存在 token，可以返回用户信息
  if (req.headers['authorization']) {

    res.json({
      code: 0,
      data: {
        avatar: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        name: 'Hello_AlexCc',
        id: 1,
        role: 'super_admin'
      },
      message: '获取用户信息成功',
      success: true,
    })
  }
})

app.listen(9999, () => {
  console.log('server site an port 9999 ...')
})
```

## 调用 userInfo 接口时机

我们的 `userInfo` 接口已经编写好了，那么我们在什么时候调用呢？

很显然，我们需要在 `permission.ts` 中去调用，当用户登录才有 `token`，也就是说，我们可以在 `token` 存在时，并且 `to.path` 不等于 `/login` 的时候去调用用户信息接口。

```js
if (store.getters.token) {
  if (to.path === '/login') {
    next('/')
  } else {
    // 调用用户信息接口
    await store.dispatch('user/getUserInfo')

    next()
  }
}
```

我们获取用户信息接口的动作，放在了 `module user` 的 `actions` 中：

```js
// module/user.ts

// state
state: () => ({
  token: getItem('token') || '',
  userinfo: {}
}),

// actions
async getUserInfo(context) {
  const info = await getUserInfo()
  context.commit('setUserInfo', info)
  return info
},
```

方便使用 `userInfo`，我们可以将其放到 `getters` 中：

```js
const getters = {
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userinfo
}
```

最后，我们就能在 `NavBar` 使用获取到的用户信息了。

```html
<el-avatar
  shape="square"
  :size="40"
  :src="$store.getters.userInfo.avatar"
></el-avatar>
```

**避免重复调用 userInfo 接口**

我们发现，每次切换路由时，都会触发路由的前置守卫，从而多次触发 `getUserInfo` 接口，我们把这个问题解决一下

1. 在 store 中定义 `hasUserInfo`，用来判断是否已经有用户信息了，如果有用户信息，我们就不要再触发 `getUserInfo` 接口了

```js
// getters.ts

hasUserInfo: (state) => {
  // 如果用户信息存在，return true
  return JSON.stringify(state.user.userinfo) !== '{}'
}
```

2. 修改 `permission.ts` 文件，只有 `hasUserInfo` 为 `false` 时，我们才调用用户信息接口

```js
if (store.getters.token) {
  if (to.path === '/login') {
    next('/')
  } else {
    if (!store.getters.hasUserInfo) {
      await store.dispatch('user/getUserInfo')
    }

    next()
  }
}
```

# 登出逻辑

登出分为两种形式：

- 用户主动退出
- 用户被动登录（token 过去 | 账号被挤）

不管以何种形式退出，登出的逻辑都是相同的。

- 清理掉用户的缓存数据
- 清理掉权限相关的配置
- 返回到登录页

登出的逻辑，我们也可以写在 `module user` 中去处理。

主要执行 3 个步骤：

- 清空 store token
- 清除浏览器本地存储
- 跳转到 login 页

```js
logout(context: any) {
  context.commit('setToken', '')
  removeAllItem()
  router.push('/login')
}
```

## 主动退出

用户点击登录按钮，通过 store dispatch 触发 action 的 logout 即可。

## 被动退出

被动退出大概分为两种：

- token 失效
- 账号被挤下去

那么这两种场景下，在前端对应的处理方案一共也分为两种，共分为 主动处理 、被动处理 两种 ：

- 主动处理：主要应对 token 失效
- 被动处理：同时应对 token 失效 与 单点登录（账号被挤）

### 用户被动退出解决方案之主动处理
为了保证用户的信息安全，那么对于 token 而言就被制定了很多的安全策略，比如：

- 动态 token（可变 token）
- 刷新 token
- 时效 token
...

我们这里采用 `时效 token`。

那么对应到我们代码中的实现方案为：

- 在用户登陆时，记录当前 登录时间
- 制定一个 失效时长
- 在接口调用时，根据 `当前时间` 对比 `登录时间` ，看是否超过了 `时效时长`
  - 如果未超过，则正常进行后续操作
  - 如果超过，则进行 退出登录 操作

### 代码实现

创建 `utils/auth.js` 文件，并写入以下代码：

```js
import { TIME_STAMP, TOKEN_TIMEOUT_VALUE } from '@/constant'
import { setItem, getItem } from '@/utils/storage'
/**
 * 获取时间戳
 */
export function getTimeStamp() {
  return getItem(TIME_STAMP)
}
/**
 * 设置时间戳
 */
export function setTimeStamp() {
  setItem(TIME_STAMP, Date.now())
}
/**
 * 是否超时
 */
export function isCheckTimeout() {
  // 当前时间戳
  var currentTime = Date.now()
  // 缓存时间戳
  var timeStamp = getTimeStamp()
  return currentTime - timeStamp > TOKEN_TIMEOUT_VALUE
}
```

在 `constant` 中声明对应常量：

```js
// token 时间戳
export const TIME_STAMP = 'timeStamp'
// 超时时长(毫秒) 两小时
export const TOKEN_TIMEOUT_VALUE = 2 * 60 * 60 * 1000
```

在用户登录成功之后去设置时间，到 `store/user.js` 的 `login` 中：

```js
import { setTimeStamp } from '@/utils/auth'

login(context, userInfo) {
  ...
  return new Promise((resolve, reject) => {
    ...
      .then(data => {
        ...
        // 保存登录时间
        setTimeStamp()
        resolve()
      })
  })
},
```

在 `utils/request` 对应的请求拦截器中进行 **主动介入**

```js
import { isCheckTimeout } from '@/utils/auth'

if (store.getters.token) {
  if (isCheckTimeout()) {
    // 登出操作
    store.dispatch('user/logout')

    // 失败的话，会走到 interceptors.response 的 error 方法。
    return Promise.reject(new Error('token 失效'))
  }
  ...
}
```

那么至此我们就完成了 **主动处理** 对应的业务逻辑。

### 用户被动退出解决方案之被动处理

**背景：**

首先我们需要先明确 **被动处理** 需要应对两种业务场景：

1. `token` 过期
2.  单点登录

然后我们一个一个来去看，首先是 `token` 过期

> 我们知道对于 `token` 而言，本身就是具备时效的，这个是在服务端生成 `token` 时就已经确定的。
>
> 而此时我们所谓的 `token` 过期指的就是：
>
> **服务端生成的 `token` 超过 服务端指定时效** 的过程，就像我们前端项目指定 token 的失效性一样。

而对于 单点登录 而言，指的是： 

> 当用户 A 登录之后，`token` 过期之前。
>
>  用户 A 的账号在其他的设备中进行了二次登录，导致第一次登录的 A 账号被 “顶下来” 的过程。
>
> 即：**同一账户仅可以在一个设备中保持在线状态**

那么明确好了对应的背景之后，接下来我们来看对应的业务处理场景：

从背景中我们知道，以上的两种情况，都是在 **服务端进行判断的**，而对于前端而言其实是 **服务端通知前端的一个过程。**

所以说对于其业务处理，将遵循以下逻辑：

1. 服务端返回数据时，会通过特定的状态码通知前端
2. 当前端接收到特定状态码时，表示遇到了特定状态：**`token` 时效** 或 **单点登录**
3. 此时进行 **退出登录** 处理

这里只做了 token 的过期处理，如果需要到 **单点登录** 时，只需要增加一个状态码判断即可。

**服务端超时间逻辑**
我们来简单实现一下后端的超时逻辑。

我们通过 `app.use` 添加了一个中间件，每一次前端触发了接口请求，都会先走这个中间件逻辑。

服务器启动时，我们把 `now` 和 `current` 设置当前时间戳，当有一个接口触发了，会将 `current` 设置新的时间戳。



```js
const express = require('express');
const app = express()

// token 超时 2h
const TOKEN_TIMEOUT_VALUE = 2 * 60 * 60 * 1000
let now = Date.now()
let current = Date.now()

app.use(function(req, res, next) {
  // 每次有接口调用，触发中间件，将 current 更新
  current = Date.now()

  // 如果是登录逻辑，我们将 now 设置为 current，这样就不会触发超时逻辑
  // 重新登录，继续走此判断，将 now 设置为 current
  if (req.path === '/login') {
    now = current
  }

  // 每次中间件都会将 current 更新为当前时间戳，一旦时间戳的差值，大于了 2h，就会触发 超时逻辑
  if (current - now > TOKEN_TIMEOUT_VALUE) {
    // 超时
    res.status(401).send({
      code: 401,
      message: '服务端message: token 失效啦',
      success: false,
    })
  } else {

    // 没有超时，将执行权交给下一个路由
    next()
  }
})
```


**那么明确好了业务之后，接下来我们来实现前端对应代码：**

在 `utils/request` 的响应拦截器中，增加以下逻辑：

```js
// 响应拦截器
service.interceptors.response.use(
  response => {
    ...
  },
  error => {
    // 处理 token 超时问题
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 401
    ) {
      store.dispatch('user/logout')
    }

    if (error.response && error.response.data && error.response.data.message) {
      ElMessage.error(error.response.data.message) // 提示服务端抛出的错误信息
    } else {
      ElMessage.error(error.message)
    }
    return Promise.reject(error)
  }
)
```

那么至此，我们就已经完成了 **整个用户退出** 方案。

# Sidebar 动态菜单

接下来我们来处理 动态menu菜单。

临时的 menu 菜单，创建 `layout/Sidebar/SidebarMenu` 文件

```js
<template>
  <!-- 一级 menu 菜单 -->
  <el-menu
    {/* 只允许一个菜单展开 */}
    :uniqueOpened="true"
    default-active="1"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!-- 子集 menu 菜单 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><location /></el-icon>
        <span>导航一</span>
      </template>
      <el-menu-item index="1-1">选项1</el-menu-item>
      <el-menu-item index="1-2">选项2</el-menu-item>
    </el-sub-menu>
    <!-- 具体菜单项 -->
    <el-menu-item index="4">
      <el-icon><setting /></el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Location, Setting } from '@element-plus/icons-vue'
</script>
<style scoped></style>
```

在 `layout/Sidebar/index` 中导入该组件

```js
<template>
  <div class="">
    <h1>占位</h1>
    <el-scrollbar>
      <sidebar-menu></sidebar-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import SidebarMenu from './SidebarMenu'
import {} from 'vue'
</script>
```

那么至此我们生成了一个临时的 `menu` 菜单，从这个临时的 `menu` 菜单出可以看到，`el-menu` 其实分成了三个部分：

1. `el-menu`：整个 `menu` 菜单
2. `el-submenu`：子集 `menu` 菜单
3. `el-menu-item`：具体菜单项

那么明确好了这些内容之后，接下来我们就可以来去分析一下 **动态 `menu` 菜单如何生成了**

## 动态menu菜单处理方案解析

**动态`menu`菜单** 其实主要是和 **动态路由表**  配合来去实现 **用户权限** 的。

但是 **用户权限处理** 目前还未涉及到，因为咱们想要处理 **用户权限** 还需要先去处理很多的业务场景，所以暂时先只处理 **动态`menu`菜单** 。

所谓 **动态`menu`菜单** 指的是：

> 根据路由表的配置，自动生成对应的 `menu` 菜单。
>
> 当路由表发生变化时，`menu` 菜单自动发生变化

那么明确了 **动态`menu`菜单** 的含义之后，接下来咱们就需要来明确 **动态`menu`菜单** 的实现方案：

1. 定义 **路由表** 对应 **`menu` 菜单规则**
2. 根据规则制定 **路由表**
3. 根据规则，依据 **路由表** ，生成 **`menu` 菜单**

那么根据我们的实现方案可以发现，实现 **动态`menu`菜单** 最核心的关键点其实就在步骤一，也就是 

> 定义 **路由表** 对应 **`menu` 菜单规则**

那么下面我们就来看一下，这个规则如何制定：

1. 对于单个路由规则而言（循环）：
   1. 如果存在 `meta && meta.title && meta.icon` ：则显示在 `menu` 菜单中，其中 `title` 为显示的内容，`icon` 为显示的图标
      1. 如果存在 `children` ：则以 `el-sub-menu（子菜单）` 展示
      2. 否则：则以 `el-menu-item（菜单项）` 展示
   2. 否则：不显示在 `menu` 菜单中

那么明确好了对应的规则之后，接下来我们就可以来去看一下如何进行实现啦！

## 生成项目页面组件

明确了对应的方案之后，那么下面咱们就来实现对应的代码逻辑。

根据我们的分析，想要完成动态的 `menu`，那么我们需要按照以下的步骤来去实现：

1. 创建页面组件
2. 生成路由表
3. 解析路由表
4. 生成 `menu` 菜单

那么明确好了步骤之后，接下来我们就先来实现第一步

**创建页面组件**

在 `views` 文件夹下，创建如下页面：

1. 创建文章：`article-create`
2. 文章详情：`article-detail`
3. 文章排名：`article-ranking`
4. 错误页面：`error-page`
   1. `404`
   2. `401`
5. 导入：`import`
6. 权限列表：`permission-list`
7. 个人中心：`profile`
8. 角色列表：`role-list`
9. 用户信息：`user-info`
10. 用户管理：`user-manage`

## 创建结构路由表

想要实现结构路由表，那么我们需要先知道最终我们要实现的结构是什么样子的，大家来看下面的截图：

<img src="/img/menu.png" />

这是我们最终要实现的 `menu` 截图。

根据此截图，我们可以知道两点内容：

1. 我们创建的页面并没有全部进行展示
   1. 不显示页面表示 **不满足** 该条件 `meta && meta.title && meta.icon`

2. `menu` 菜单将具备父子级的结构
  1. 按照此结构规划数据，则数据应为
    ```json
    [
        {
            "title": "个人中心",
            "path": ""
        },
        {
            "title": "用户",
            "children": [
                {
                    "title": "员工管理",
                    "path": ""
                },
                {
                    "title": "角色列表",
                    "path": ""
                },
                {
                    "title": "权限列表",
                    "path": ""
                }
            ]
        },
        {
            "title": "文章",
            "children": [
                {
                    "title": "文章排名",
                    "path": ""
                },
                {
                    "title": "创建文章",
                    "path": ""
                }
            ]
        }
    ]
    ```

又因为将来我们需要进行 **用户权限处理**，所以此时我们需要先对路由表进行一个划分：

1. 私有路由表 `privateRoutes` ：权限路由
2. 公有路由表 `publicRoutes`：无权限路由

根据以上理论，生成以下路由表结构：

```js
/**
 * 私有路由表
 */
const privateRoutes = [
  {
    path: '/user',
    component: layout,
    redirect: '/user/manage',
    meta: {
      title: 'user',
      icon: 'personnel'
    },
    children: [
      {
        path: '/user/manage',
        component: () => import('@/views/user-manage/index'),
        meta: {
          title: 'userManage',
          icon: 'personnel-manage'
        }
      },
      {
        path: '/user/role',
        component: () => import('@/views/role-list/index'),
        meta: {
          title: 'roleList',
          icon: 'role'
        }
      },
      {
        path: '/user/permission',
        component: () => import('@/views/permission-list/index'),
        meta: {
          title: 'permissionList',
          icon: 'permission'
        }
      },
      {
        path: '/user/info/:id',
        name: 'userInfo',
        component: () => import('@/views/user-info/index'),
        meta: {
          title: 'userInfo'
        }
      },
      {
        path: '/user/import',
        name: 'import',
        component: () => import('@/views/import/index'),
        meta: {
          title: 'excelImport'
        }
      }
    ]
  },
  {
    path: '/article',
    component: layout,
    redirect: '/article/ranking',
    meta: {
      title: 'article',
      icon: 'article'
    },
    children: [
      {
        path: '/article/ranking',
        component: () => import('@/views/article-ranking/index'),
        meta: {
          title: 'articleRanking',
          icon: 'article-ranking'
        }
      },
      {
        path: '/article/:id',
        component: () => import('@/views/article-detail/index'),
        meta: {
          title: 'articleDetail'
        }
      },
      {
        path: '/article/create',
        component: () => import('@/views/article-create/index'),
        meta: {
          title: 'articleCreate',
          icon: 'article-create'
        }
      },
      {
        path: '/article/editor/:id',
        component: () => import('@/views/article-create/index'),
        meta: {
          title: 'articleEditor'
        }
      }
    ]
  }
]

/**
 * 公开路由表
 */
const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    path: '/',
    // 注意：带有路径“/”的记录中的组件“默认”是一个不返回 Promise 的函数
    component: layout,
    redirect: '/profile',
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile/index'),
        meta: {
          title: 'profile',
          icon: 'el-icon-user'
        }
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error-page/404')
      },
      {
        path: '/401',
        name: '401',
        component: () => import('@/views/error-page/401')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes, ...privateRoutes]
})
```

最后不要忘记在 `layout/appMain` 下设置路由出口

```js
<template>
  <div class="app-main">
    <router-view></router-view>
  </div>
</template>
```

## 解析路由表，获取结构化数据

想要获取路由表数据，那么有两种方式：


1. [router.options.routes](https://next.router.vuejs.org/zh/api/#routes)：初始路由列表（[新增的路由](https://next.router.vuejs.org/zh/api/#addroute) 无法获取到）

2. [router.getRoutes()](https://next.router.vuejs.org/zh/api/#getroutes)：获取所有 [路由记录](https://next.router.vuejs.org/zh/api/#routerecord) 的完整列表

所以，我们此时使用 `router.getRoutes() ` 方法获取完整的路由列表

在 `layout/components/Sidebar/SidebarMenu` 下写入以下代码：

```js
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
console.log(router.getRoutes())
</script>
```

从返回的数据来看，它与我们想要的数据结构相去甚远。

出现这个问题的原因，是因为它返回的是一个 **完整的路由表**

这个路由表距离我们想要的存在两个问题：

1. 存在重复的路由数据
2. 不满足该条件 `meta && meta.title && meta.icon` 的数据不应该存在

那么接下来我们就应该来处理这两个问题

创建 `utils/route.ts` 文件，创建两个方法分别处理对应的两个问题：

1. `filterRouters`
2. `generateMenus`

写入以下代码：

```js
import path from 'path'

/**
 * 返回所有子路由
 */
const getChildrenRoutes = routes => {
  const result = []
  routes.forEach(route => {
    if (route.children && route.children.length > 0) {
      result.push(...route.children)
    }
  })
  return result
}
/**
 * 处理脱离层级的路由：某个一级路由为其他子路由，则剔除该一级路由，保留路由层级
 * @param {*} routes router.getRoutes()
 */
export const filterRouters = routes => {
  const childrenRoutes = getChildrenRoutes(routes)
  return routes.filter(route => {
    return !childrenRoutes.find(childrenRoute => {
      return childrenRoute.path === route.path
    })
  })
}

/**
 * 判断数据是否为空值
 */
function isNull(data) {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
  return false
}
/**
 * 根据 routes 数据，返回对应 menu 规则数组
 */
export function generateMenus(routes, basePath = '') {
  const result = []
  // 遍历路由表
  routes.forEach(item => {
    // 不存在 children && 不存在 meta 直接 return
    if (isNull(item.meta) && isNull(item.children)) return
    // 存在 children 不存在 meta，进入迭代
    if (isNull(item.meta) && !isNull(item.children)) {
      result.push(...generateMenus(item.children))
      return
    }
    // 合并 path 作为跳转路径
    const routePath = path.resolve(basePath, item.path)
    // 路由分离之后，存在同名父路由的情况，需要单独处理
    let route = result.find(item => item.path === routePath)
    if (!route) {
      route = {
        ...item,
        path: routePath,
        children: []
      }

      // icon 与 title 必须全部存在
      if (route.meta.icon && route.meta.title) {
        // meta 存在生成 route 对象，放入 arr
        result.push(route)
      }
    }

    // 存在 children 进入迭代到children
    if (item.children) {
      route.children.push(...generateMenus(item.children, route.path))
    }
  })
  return result
}

```

在 `SidebarMenu` 中调用该方法

```js
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { filterRouters, generateMenus } from '@/utils/route'

const router = useRouter()
const routes = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())
  return generateMenus(filterRoutes)
})
console.log(JSON.stringify(routes.value))
</script>
```

得到该数据结构

```json
[
    {
        "path":"/profile",
        "name":"profile",
        "meta":{
            "title":"profile",
            "icon":"el-icon-user"
        },
    },
    {
        "path":"/user",
        "redirect":"/user/manage",
        "meta":{
            "title":"user",
            "icon":"personnel"
        },
        "props":{
            "default":false
        },
        "children":[
            {
                "path":"/user/manage",
                "name":"userManage",
                "meta":{
                    "title":"userManage",
                    "icon":"personnel-manage"
                },
                "children":[

                ]
            },
            {
                "path":"/user/role",
                "name":"userRole",
                "meta":{
                    "title":"roleList",
                    "icon":"role"
                },
                "children":[

                ]
            },
            {
                "path":"/user/permission",
                "name":"userPermission",
                "meta":{
                    "title":"permissionList",
                    "icon":"permission"
                },
                "children":[

                ]
            }
        ],
    },
    {
        "path":"/article",
        "redirect":"/article/ranking",
        "meta":{
            "title":"article",
            "icon":"article"
        },
        "props":{
            "default":false
        },
        "children":[
            {
                "path":"/article/ranking",
                "name":"articleRanking",
                "meta":{
                    "title":"articleRanking",
                    "icon":"article-ranking"
                },
                "children":[

                ]
            },
            {
                "path":"/article/create",
                "name":"articleCreate",
                "meta":{
                    "title":"articleCreate",
                    "icon":"article-create"
                },
                "children":[

                ]
            }
        ],
    }
]
```

## 生成动态 menu 菜单

有了数据结构之后，最后的步骤就水到渠成了

整个 `menu` 菜单，我们将分成三个组件来进行处理

1. `SidebarMenu`：处理数据，作为最顶层 `menu` 载体
2. `SidebarItem`：根据数据处理 **当前项为 `el-submenu` || `el-menu-item`** 
3. `MenuItem`：处理 `el-menu-item` 样式

那么下面我们一个个来处理

首先是 `SidebarMenu` 

```js
<template>
  <!-- 一级 menu 菜单 -->
  <el-menu
    ...
  >
    <sidebar-item
      v-for="item in routes"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-menu>
</template>

```



创建 `SidebarItem` 组件，用来根据数据处理 **当前项为 `el-sub-menu` || `el-menu-item`** 

```js
<template>
  <!-- 支持渲染多级 menu 菜单 -->
  <el-sub-menu v-if="route.children.length > 0" :index="route.path">
    <template #title>
      <menu-item :title="route.meta.title" :icon="route.meta.icon"></menu-item>
    </template>
    <!-- 循环渲染 -->
    <sidebar-item
      v-for="item in route.children"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-sub-menu>
  <!-- 渲染 item 项 -->
  <el-menu-item v-else :index="route.path">
    <menu-item :title="route.meta.title" :icon="route.meta.icon"></menu-item>
  </el-menu-item>
</template>

<script setup>
import MenuItem from './MenuItem'
import { defineProps } from 'vue'
// 定义 props
defineProps({
  route: {
    type: Object,
    required: true
  }
})
</script>
```

创建 `MenuItem` 用来处理 `el-menu-item` 样式

```js
<template>
  <i v-if="icon.includes('el-icon')" class="sub-el-icon" :class="icon"></i>
  <svg-icon v-else :icon="icon"></svg-icon>
  <span>{{ title }}</span>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
</style>
```

至此，整个的 `menu` 菜单结构就已经完成了！

## 修复最后残余问题

目前 `menu` 菜单存在三个问题

1. 样式问题
2. 路由跳转问题
3. 默认激活项

**样式问题：**

首先处理样式，因为后面我们需要处理 **主题替换** ，所以此处我们不能把样式写死。因为我们的样式变量都放在 `variables.scss` 文件中，并通过 `:export` 导出了变量以供 js 导入，每次使用都需要导入，比较麻烦，我们可以将其放在 `store getters` 中，以便 **快捷访问**。

```js
import variables from '@/styles/variables.scss'
const getters = {
  cssVar: () => variables
}
export default getters
```

在 `SidebarMenu` 中写入如下样式

```html
<el-menu
  :background-color="$store.getters.cssVar.menuBg"
  :text-color="$store.getters.cssVar.menuText"
  :active-text-color="$store.getters.cssVar.menuActiveText"
  :unique-opened="true"
>
```

**路由跳转问题：**

为 `el-menu` 指定 `router`

```html
<el-menu
  ...
  router
>
```

> 添加 router 属性
>
> 表示是否启用 vue-router 模式。 启用该模式会在激活导航时以 index 作为 path 进行路由跳转 使用 default-active 来设置加载时的激活项。

**默认激活项：**

根据当前 `url` 进行判断即可

```js
<el-menu
  :default-active="activeMenu"
  ...
>

<script setup>
...

// 计算高亮 menu 的方法
const route = useRoute()
const activeMenu = computed(() => {
  const { path } = route
  return path
})
</script>
```

至此整个 **动态`menu`完成**

## 左侧菜单伸缩功能实现

下面我们来实现一个标准化功能 **左侧菜单伸缩** ，对于这个功能核心的点在于动画处理

样式的改变总是由数据进行驱动，所以首先我们去创建对应的数据

创建 `store/app` 模块，写入如下代码

```js
export default {
  namespaced: true,
  state: () => ({
    sidebarOpened: true
  }),
  mutations: {
    triggerSidebarOpened(state) {
      state.sidebarOpened = !state.sidebarOpened
    }
  },
  actions: {}
}

```

在 `store/index` 中进行导入

```js
...
import app from './modules/app'
export default createStore({
  getters,
  modules: {
    ...
    app
  }
})
```

在 `store/getters` 中创建快捷访问

```js
sidebarOpened: state => state.app.sidebarOpened
```


创建 `components/hamburger` 组件，用来控制数据

```js
<template>
  <div class="hamburger-container" @click="toggleClick">
    <svg-icon class="hamburger" :icon="icon"></svg-icon>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const toggleClick = () => {
  store.commit('app/triggerSidebarOpened')
}

const icon = computed(() =>
  store.getters.sidebarOpened ? 'hamburger-opened' : 'hamburger-closed'
)
</script>

<style lang="scss" scoped>
.hamburger-container {
  padding: 0 16px;
  .hamburger {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
  }
}
</style>
```

在 `navbar` 中使用该组件

```js
<template>
  <div class="navbar">
    <hamburger class="hamburger-container" />
    ...
  </div>
</template>

<script setup>
import Hamburger from '@/components/Hamburger'
...
</script>

<style lang="scss" scoped>
.navbar {
  ...

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    // hover 动画
    transition: background 0.5s;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

 ...
}
</style>

```

在 `SidebarMenu` 中，控制 `el-menu` 的 [collapse](https://element-plus.org/#/zh-CN/component/menu) 属性

```js
<el-menu
    :collapse="!$store.getters.sidebarOpened"
    ...
```

在 `layout/index` 中指定 **整个侧边栏的宽度和缩放动画**

```js
<div
    class="app-wrapper"
    :class="[$store.getters.sidebarOpened ? 'openSidebar' : 'hideSidebar']"
  >
  ...
```

在 `layout/index` 中 处理 `navbar` 的宽度

```js
<style lang="scss" scoped>
...

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$hideSideBarWidth});
}
</style>
```

在 `styles/variables.scss` 中指定 `hideSideBarWidth`

```scss
$hideSideBarWidth: 54px;
```



## SidebarHeader 处理

整个左侧的 `menu` 菜单，到现在咱们还剩下最后一个 `header` 没有进行处理

在 `sidebar/index` 中写入如下代码

```js
<template>
  <div class="">
    <div class="logo-container">
      <el-avatar
        size="44"
        shape="square"
        src="https://m.imooc.com/static/wap/static/common/img/logo-small@2x.png"
      />
      <h1 class="logo-title" v-if="$store.getters.sidebarOpened">
       imooc-admin
      </h1>
    </div>
    ...
  </div>
</template>

<style lang="scss" scoped>
.logo-container {
  height: 44px;
  padding: 10px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-title {
    margin-left: 10px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>

```

创建 `styles/element.scss` 文件，统一处理 `el-avatar` 的背景问题

```scss
.el-avatar {
  --el-avatar-background-color: none;
}
```

在 `styles/index.scss` 中导入

```scss
...
@import './element.scss';
```

统一处理下动画时长的问题，在 `styles/variables.scss` 中，加入以下变量

```css
$sideBarDuration: 0.28s;
```

为 `styles/sidebar.scss` 修改时长

```scss
  .main-container {
    transition: margin-left #{$sideBarDuration};
   ...
  }

  .sidebar-container {
    transition: width #{$sideBarDuration};
  	...
  }
```

为 `layout/index` 修改样式

```scss
.fixed-header {
  ...
  transition: width #{$sideBarDuration};
}
```

# Vue3.2：组件状态驱动的动态 CSS 值

在 [vue 3.2](https://blog.vuejs.org/posts/vue-3.2.html) 最新更新中，除了之前我们介绍的 **响应式变化** 之外，还有另外一个很重要的更新，那就是 **组件状态驱动的动态 `CSS` 值** ，对应的文档也已经公布，大家可以 [点击这里](https://v3.vuejs.org/api/sfc-style.html#state-driven-dynamic-css) 查看

那么下面我们就使用下最新的特性，来为 `logo-container` 指定下高度：

```js
<template>
 ...
 <el-avatar
 	:size="logoHeight"
 ...

</template>

<script setup>
...
const logoHeight = 44
</script>

<style lang="scss" scoped>
.logo-container {
  height: v-bind(logoHeight) + 'px';
...
}
</style>

```

# 动态面包屑方案分析

面包屑导航分为：

1. 静态面包屑
2. 动态面包屑

**静态面包屑：**

指的是：**在每个页面中写死对应的面包屑菜单**，缺点也很明显：

1. 每个页面都得写一遍
2. 页面路径结构变化了，得手动更改

简单来说就是 **不好维护，不好扩展** 。

**动态面包屑：**

根据当前的 `url` 自动生成面包屑导航菜单

无论之后路径发生了什么变化，**动态面包屑** 都会正确的进行计算

那么在后面的实现过程中，我们将会分成三大步来实现

1. 创建、渲染基本的面包屑组件
2. 计算面包屑结构数据
3. 根据数据渲染动态面包屑内容

## 渲染基本的面包屑组件

完成第一步，先去创建并渲染出基本的 [面包屑](https://element-plus.org/#/zh-CN/component/breadcrumb) 组件

创建 `components/Breadcrumb/index`，并写入如下代码：

```js
<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    <!-- 面包屑的最后一项 -->
    <el-breadcrumb-item>
      <span class="no-redirect">活动详情</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import {} from 'vue'
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  ::v-deep .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>

```

在 `layout/components/Navbar` 组件下导入

```js
<template>
  <div class="navbar">
    <hamburger class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
	...
  </div>
</template>
...

<style lang="scss" scoped>
.navbar {
 ...

  .breadcrumb-container {
    float: left;
  }
   ...
}
</style>

```

## 动态计算面包屑结构数据

现在我们是完成了一个静态的 面包屑，接下来咱们就需要依托这个静态的菜单来完成动态的。

对于现在的静态面包屑来说，他分成了两个组件：

1. `el-breadcrumb`：包裹性质的容器
2. `el-breadcrumb-item`：每个单独项

如果我们想要完成动态的，那么就需要 **依据动态数据，渲染 `el-breadcrumb-item` **

所以说接下来我们需要做的事情就很简单了

1. 动态数据
2. 渲染 `el-breadcrumb-item`

咱们先来看 **动态数据如何制作**

我们希望可以制作出一个 **数组**，数组中每个 `item` 都表示一个 **路由信息**：

创建一个方法，用来生成数组数据，在这里我们要使用到 [route.match](https://next.router.vuejs.org/zh/api/#matched) 属性来：**获取与给定路由地址匹配的[标准化的路由记录](https://next.router.vuejs.org/zh/api/#routerecord)数组**

如何理解上面这句话呢？其实我们将 `route.matched` 打印出来就可以发现，你每次切换菜单（或者说更换了路由），打印出来的就是当前路由的路由表（包含父级、子集的路由信息）。

```js
<script setup>
import { ref, reactive, watch } from 'vue'
import { useRoute, RouteRecordRaw } from 'vue-router'

const breadcrumbData = ref<RouteRecordRaw[]>([]) // 存放计算出的面包屑数据

const route = useRoute()

const getBreadcrumbData = () => {
  console.log(route.matched)

  // 只有存在 meta 并且 meta.title 的路由，我们才会显示到面包屑中
  // 就像 menu 菜单一样，类似 404 login 的我们不要显示
  breadcrumbData.value = route.matched.filter(r => r.meta && r.meta.title)
}

// 监听路由变化时触发
watch(
  route,
  () => {
    getBreadcrumbData()
  },
  {
    immediate: true
  }
)
</script>
```

## 依据动态数据，渲染面包屑

有了数据之后，根据数据来去渲染面包屑就比较简单了。

```vue
<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbData"
      :key="item.path"
    >
      <!-- 不可点击项 -->
      <span v-if="index === breadcrumbData.length - 1" class="no-redirect">{{
        item.meta.title
      }}</span>
      <!-- 可点击项 -->
      <a v-else class="redirect" @click.prevent="onLinkClick(item)">{{
        item.meta.title
      }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'
import { useStore } from 'vuex'

const breadcrumbData = ref<RouteRecordRaw[]>([]) // 存放计算出的面包屑数据

const store = useStore()
const route = useRoute()
const router = useRouter()
const getBreadcrumbData = () => {
  console.log(route.matched)

  // 只有存在 meta 并且 meta.title 的路由，我们才会显示到面包屑中
  // 就像 menu 菜单一样，类似 404 login 的我们不要显示
  breadcrumbData.value = route.matched.filter(r => r.meta && r.meta.title)
}

watch(
  route,
  () => {
    getBreadcrumbData()
  },
  {
    immediate: true
  }
)

// 跳转路由
const onLinkClick = (item: RouteRecordRaw) => {
  router.push(item.path)
}

// 将来需要进行主题替换，所以这里获取下动态样式
const linkHoverColor = ref(store.getters.cssVars.menuBg)
</script>

<style lang="scss" scoped>
.breadcrumb {
 ...

  .redirect {
    color: #666;
    font-weight: 600;
  }

  .redirect:hover {
    color: v-bind(linkHoverColor); // 应对主题切换
  }
}
</style>

```

## 面包屑动画

vue3对 [动画](https://v3.cn.vuejs.org/guide/transitions-overview.html#%E5%9F%BA%E4%BA%8E-class-%E7%9A%84%E5%8A%A8%E7%94%BB%E5%92%8C%E8%BF%87%E6%B8%A1) 进行了一些修改（[vue 动画迁移文档](https://v3.cn.vuejs.org/guide/migration/transition.html#%E6%A6%82%E8%A7%88)）

主要的修改其实只有两个：

1. 过渡类名 `v-enter` 修改为 `v-enter-from`
2. 过渡类名 `v-leave` 修改为 `v-leave-from`

那么依据修改之后的动画，我们来为面包屑增加一些动画样式：

1. 在 `Breadcrumb/index` 中增加 `transition-group`

```js
  <template>
    <el-breadcrumb class="breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        ...
      </transition-group>
    </el-breadcrumb>
  </template>
```

2. 新建 `styles/transition` 样式文件

```scss
  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all 0.5s;
  }

  .breadcrumb-enter-from,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }

  .breadcrumb-leave-active {
    position: absolute;
  }
```

3. 在 `styles/index` 中导入

```scss
  @import './transition.scss';
```

# 总结

到这里我们的 layout 整体架构就已经做完了，我们来看看效果吧。

![](/img/layout-result.png)
