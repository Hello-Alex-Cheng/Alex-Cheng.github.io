---
layout: Vue3
title: Vue3项目实战(六)：通用功能开发(二)
date: 2023-01-01 14:53:36
tags: 工程化,Vue3,通用功能
banner_img: /img/general2.png
index_img: /img/general2.png
excerpt: screenfull/headerSearch/tagView/guide
---

# screenfull

对于 `screenfull ` 和之前一样 ，我们还是先分析它的原理，然后在制定对应的方案实现

**原理：**

对于 `screenfull ` 而言，浏览器本身已经提供了对用的 `API`，[点击这里即可查看](https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API)，这个 `API` 中，主要提供了两个方法：

1. [`Document.exitFullscreen()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/exitFullscreen)：该方法用于请求从全屏模式切换到窗口模式
2. [`Element.requestFullscreen()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/requestFullScreen)：该方法用于请求浏览器（user agent）将特定元素（甚至延伸到它的后代元素）置为全屏模式
  1. 比如我们可以通过 `document.getElementById('app').requestFullscreen()` 在获取 `id=app` 的 `DOM` 之后，把该区域置为全屏

但是该方法存在一定的小问题，兼容性也不是那么好。

所以通常情况下我们不会直接使用该 `API` 来去实现全屏效果，而是会使用它的包装库 [screenfull](https://www.npmjs.com/package/screenfull)


整体的方案实现分为两步：

1. 封装 `screenfull` 组件
  1. 展示切换按钮
  2. 基于 [screenfull](https://www.npmjs.com/package/screenfull) 实现切换功能
2. 在 `navbar` 中引入该组件

明确好了方案之后，接下来我们就落地该方案

**封装 `screenfull` 组件：**

1. 下来依赖包  [screenfull](https://www.npmjs.com/package/screenfull) 

```
npm i screenfull@5.1.0 -S
```

2. 创建 `components/Screenfull/index`

```js
<template>
  <div>
    <svg-icon
      :icon="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="onToggle"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import screenfull from 'screenfull'

// 是否全屏
const isFullscreen = ref(false)

// 切换事件
const onToggle = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle()
  }
}

// 监听变化
const change = () => {
  if (screenfull.isEnabled) {
    isFullscreen.value = screenfull.isFullscreen
  }
}

// 设置侦听器
onMounted(() => {
  if (screenfull.isEnabled) {
    screenfull.on('change', change)
  }
})

// 删除侦听器
onUnmounted(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', change)
  }
})
</script>

<style lang="scss" scoped></style>

```

**在 `navbar` 中引入该组件：**

```
<screenfull class="right-menu-item hover-effect" />

...

import Screenfull from '@/components/Screenfull'
```

# headerSeach

> 所谓 `headerSearch` 一般是指 **页面搜索**

**原理：**

`headerSearch` 是复杂后台系统中非常常见的一个功能，它可以：**在指定搜索框中对当前应用中所有页面进行检索，以 `select` 的形式展示出被检索的页面，以达到快速进入的目的**

那么明确好了 `headerSearch`  的作用之后，接下来我们来看一下对应的实现原理

根据前面的目的我们可以发现，整个 `headerSearch` 其实可以分为三个核心的功能点：

1. 根据指定内容对所有页面进行检索
2. 以 `select` 形式展示检索出的页面
3. 通过检索页面可快速进入对应页面

那么围绕着这三个核心的功能点，我们想要分析它的原理就非常简单了：**根据指定内容检索所有页面，把检索出的页面以 `select` 展示，点击对应 `option` 可进入到指定页面**

**方案：**

对照着三个核心功能点和原理，想要指定对应的实现方案是非常简单的一件事情了

1. 创建 `headerSearch` 组件，用作样式展示和用户输入内容获取
2. 获取所有的页面数据，用作被检索的数据源
3. 根据用户输入内容在数据源中进行模糊搜索(https://fusejs.io/) 
4. 把搜索到的内容以 `select` 进行展示
5. 监听 `select` 的 `change` 事件，完成对应跳转

## headerSearch 组件

创建 `components/headerSearch/index` 组件，当点击搜索图标时，通过 `transition` 动画，将其长度展示出来，并且自动聚焦 `focus()`:

```js
<template>
  <div :class="{ show: isShow }" class="header-search">
    <svg-icon
      class-name="search-icon"
      icon="search"
      @click.stop="onShowClick"
    />
    <el-select
      ref="headerSearchSelectRef"
      class="header-search-select"
      v-model="search"
      filterable
      default-first-option
      remote
      placeholder="Search"
      :remote-method="querySearch"
      @change="onSelectChange"
    >
      <el-option
        v-for="option in 5"
        :key="option"
        :label="option"
        :value="option"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制 search 显示
const isShow = ref(false)
// el-select 实例
const headerSearchSelectRef = ref(null)
const onShowClick = () => {
  isShow.value = !isShow.value
  headerSearchSelectRef.value.focus()
}

// search 相关
const search = ref('')
// 搜索方法
const querySearch = () => {
  console.log('querySearch')
}
// 选中回调
const onSelectChange = () => {
  console.log('onSelectChange')
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }
  .header-search-select {
    font-size: 18px;
    transition: width 0.2s; // width 动画
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }
  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>

```

在 `navbar` 中导入该组件

```js
<header-search class="right-menu-item hover-effect"></header-search>

...

import HeaderSearch from '@/components/HeaderSearch/index.vue'
```

## 获取数据源

在有了 `headerSearch` 之后，接下来就可以来处理对应的 **检索数据源了**

**检索数据源** 表示：**有哪些页面希望检索**

那么对于我们当前的业务而言，我们希望被检索的页面其实就是左侧菜单中的页面，那么我们检索数据源即为：**左侧菜单对应的数据源**

根据以上原理，我们可以得出以下代码：

```js
<script setup>
import { ref, computed } from 'vue'
import { filterRouters, generateMenus } from '@/utils/route'
import { useRouter } from 'vue-router'
...
// 检索数据源
const router = useRouter()
const searchPool = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())
  console.log(generateMenus(filterRoutes))
  return generateMenus(filterRoutes)
})
console.log(searchPool)
</script>
```

## 模糊搜索Fuse.js
> Fuse.js is a powerful, lightweight fuzzy-search library, with zero dependencies.

如果我们想要进行  [模糊搜索](https://fusejs.io/)  的话，那么需要依赖一个第三方的库  [fuse.js](https://fusejs.io/) 

它是0️⃣依赖的，专门处理模糊搜索的库。

**Why should I use it?**

- 使用 Fuse.js，您不需要仅仅为了处理搜索而设置专用的后端。
- 简单性和性能是开发这个库的主要标准。


1. 安装 [fuse.js](https://fusejs.io/)

```js
npm install --save fuse.js@6.4.6
```

2. 初始化 `Fuse`，更多初始化配置项 [可点击这里](https://fusejs.io/api/options.html)

```js
import Fuse from 'fuse.js'

/**
* 搜索库相关
*/
const fuse = new Fuse(list, {
    // 是否按优先级进行排序
    shouldSort: true,
    // 匹配长度超过这个值的才会被认为是匹配的
    minMatchCharLength: 1,
    // 将被搜索的键列表。 这支持嵌套路径、加权搜索、在字符串和对象数组中搜索。
    // name：搜索的键
    // weight：对应的权重
    // 表示我们将用户输入的值，与 title 和 path 进行匹配
    keys: [
      {
        name: 'title',
        weight: 0.7
      },
      {
        name: 'path',
        weight: 0.3
      }
    ]
  })
```

3. 参考 [Fuse Demo](https://fusejs.io/demo.html) 与 最终效果，可以得出，我们最终期望得到如下的检索数据源结构

```json
[
    {
        "path":"/my",
        "title":[
            "个人中心"
        ]
    },
    {
        "path":"/user",
        "title":[
            "用户"
        ]
    },
    {
        "path":"/user/manage",
        "title":[
            "用户",
            "用户管理"
        ]
    },
    {
        "path":"/user/info",
        "title":[
            "用户",
            "用户信息"
        ]
    },
    {
        "path":"/article",
        "title":[
            "文章"
        ]
    },
    {
        "path":"/article/ranking",
        "title":[
            "文章",
            "文章排名"
        ]
    },
    {
        "path":"/article/create",
        "title":[
            "文章",
            "创建文章"
        ]
    }
]
```

4. 所以我们之前处理了的数据源并不符合我们的需要，所以我们需要对数据源进行重新处理

## 数据源重处理，生成 searchPool

我们明确了最终我们期望得到数据源结构，那么接下来我们就对重新计算数据源，生成对应的 `searchPoll`

创建 `components/HeaderSearch/FuseData.js`

```js
import path from 'path'
import i18n from '@/i18n'
/**
 * 筛选出可供搜索的路由对象
 * @param routes 路由表
 * @param basePath 基础路径，默认为 /
 * @param prefixTitle 父级title，子集title集合 [文章，文章排名]
 */
export const generateRoutes = (routes, basePath = '/', prefixTitle = []) => {
  // 创建 result 数据
  let res = []
  // 循环 routes 路由
  for (const route of routes) {
    // 创建包含 path 和 title 的 item
    const data = {
      path: path.resolve(basePath, route.path),
      title: [...prefixTitle]
    }
    // 当前存在 meta 时，使用 i18n 解析国际化数据，组合成新的 title 内容
    // 动态路由不允许被搜索（类似：user/:id 这种）
    // 匹配动态路由的正则
    const re = /.*\/:.*/
    if (route.meta && route.meta.title && !re.exec(route.path)) {
      const i18ntitle = i18n.global.t(`msg.route.${route.meta.title}`)
      data.title = [...data.title, i18ntitle]
      res.push(data)
    }

    // 存在 children 时，迭代调用
    if (route.children) {
      const tempRoutes = generateRoutes(route.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

```

这样，我们就通过 `generateRoutes` 方法，根据咱们的路由表，生成了符合 `fuse.js` 的数据。

在 `headerSearch` 中导入 `generateRoutes`

```vue
<script setup>
import { computed, ref } from 'vue'
import { generateRoutes } from './FuseData'
import Fuse from 'fuse.js'
import { filterRouters } from '@/utils/route'
import { useRouter } from 'vue-router'

...

// 检索数据源
const router = useRouter()
const searchPool = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())
  return generateRoutes(filterRoutes)
})
/**
 * 搜索库相关
 */
const fuse = new Fuse(searchPool.value, {
  ...
})
</script>
```

通过 `querySearch` 测试搜索结果

```js
// 搜索方法
const querySearch = query => {
  console.log(fuse.search(query))
}
```

## 渲染检索数据

数据源处理完成之后，最后我们就只需要完成:

1. 渲染检索出的数据
2. 完成对应跳转

那么下面我们按照步骤进行实现：

1. 渲染检索出的数据

```js
<template>
  <el-option
      v-for="option in searchOptions"
      :key="option.item.path"
      :label="option.item.title.join(' > ')"
      :value="option.item"
  ></el-option>
</template>

<script setup>
...
// 搜索结果
const searchOptions = ref([])
// 搜索方法
const querySearch = query => {
  if (query !== '') {
    searchOptions.value = fuse.search(query)
  } else {
    searchOptions.value = []
  }
}
...
</script>

```

2. 完成对应跳转

```js
const onSelectChange = val => {
  router.push(val.path)
}
```

## 剩余问题处理

这里我们的 `headerSearch` 功能基本上就已经处理完成了，但是还存在一些小 `bug` ，那么最后这一小节我们就处理下这些剩余的 `bug`

1. 在 `search` 打开时，点击 `body` 关闭 `search`
2. 在 `search` 关闭时，清理 `searchOptions`
3. `headerSearch` 应该具备国际化能力

明确好问题之后，接下来我们进行处理

首先我们先处理前前面两个问题：

```js
/**
 * 关闭 search 的处理事件
 */
const onClose = () => {
  headerSearchSelectRef.value.blur()
  isShow.value = false
  searchOptions.value = []
}
/**
 * 监听 search 打开，处理 close 事件
 */
watch(isShow, val => {
  if (val) {
    document.body.addEventListener('click', onClose)
  } else {
    document.body.removeEventListener('click', onClose)
  }
})
```

接下来是国际化的问题，想要处理这个问题非常简单，我们只需要：**监听语言变化，重新计算数据源初始化 `fuse` 即可**

1. 在 `utils/i18n` 下，新建方法 `watchSwitchLang`

```js
import { watch } from 'vue'
import store from '@/store'

type IProps = ((lang: string) => void)[]

export default function watchSwitchLang(...cbs: IProps) {
  watch(
    () => store.getters.language,
    () => {
      cbs.forEach(cb => cbs.forEach(cb => cb(store.getters.language)))
    }
  )
}
```

2. 在 `headerSearch` 监听变化，重新赋值

```js
<script setup>
...
import { watchSwitchLang } from '@/utils/i18n'

...

// 检索数据源
const router = useRouter()
let searchPool = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())
  return generateRoutes(filterRoutes)
})
/**
* 搜索库相关
*/
let fuse
const initFuse = searchPool => {
  fuse = new Fuse(searchPool, {
    ...
}
initFuse(searchPool.value)

...

// 处理国际化
watchSwitchLang(() => {
  searchPool = computed(() => {
    const filterRoutes = filterRouters(router.getRoutes())
    return generateRoutes(filterRoutes)
  })
  initFuse(searchPool.value)
})
</script>
```

## headerSearch 方案总结

那么到这里整个的 `headerSearch` 我们就已经全部处理完成了，整个 `headerSearch` 我们只需要把握住三个核心的关键点

1. 根据指定内容对所有页面进行检索
2. 以 `select` 形式展示检索出的页面
3. 通过检索页面可快速进入对应页面

保证大方向没有错误，那么具体的细节处理我们具体分析就可以了。

关于细节的处理，可能比较复杂的地方有两个：

1. 模糊搜索
2. 检索数据源

对于这两块，我们依赖于 `fuse.js` 进行了实现，大大简化了我们的业务处理流程。

# tagsView 原理及方案分析

所谓 `tagsView` 可以分成两部分来去看：

1. tags
2. view

好像和废话一样是吧。那怎么分开看呢？

首先我们先来看 `tags`：

所谓 `tgas` 指的是：**位于 `appmain` 之上的标签**

那么现在我们忽略掉 `view`，现在只有一个要求：

> 在 `view` 之上渲染这个 `tag` 

仅看这一个要求，很简单吧。

**views：**

明确好了 `tags` 之后，我们来看 `views`。

脱离了 `tags` 只看 `views` 就更简单了，所谓 `views` ：**指的就是一个用来渲染组件的位置**，就像我们之前的 `Appmain` 一样，只不过这里的 `views` 可能稍微复杂一点，因为它需要在渲染的基础上增加：

1. 动画
2. 缓存

这两个额外的功能。

加上这两个功能之后可能会略显复杂，但是 [官网已经帮助我们处理了这个问题](https://next.router.vuejs.org/zh/guide/advanced/transitions.html#%E5%9F%BA%E4%BA%8E%E8%B7%AF%E7%94%B1%E7%9A%84%E5%8A%A8%E6%80%81%E8%BF%87%E6%B8%A1) 

所以 单看 `views` 也是一个很简单的功能。

那么接下来我们需要做的就是把 `tags` 和 `view` 合并起来而已。

那么明确好了原理之后，我们就来看 **实现方案：**

1. 创建 `tagsView` 组件：用来处理 `tags` 的展示
2. 处理基于路由的动态过渡，在 `AppMain` 中进行：用于处理 `view` 的部分

整个的方案就是这么两大部，但是其中我们还需要处理一些细节相关的，**完整的方案为**：

1. 监听路由变化，组成用于渲染 `tags` 的数据源
2. 创建 `tags` 组件，根据数据源渲染 `tag`，渲染出来的 `tags` 需要同时具备
   1. 国际化 `title`
   2. 路由跳转
3. 处理鼠标右键效果，根据右键处理对应数据源
4. 处理基于路由的动态过渡

那么明确好了方案之后，接下来我们根据方案进行处理即可。

## 创建 tags 数据源

`tags` 的数据源分为两部分：

1. 保存数据：`appmain` 组件中进行
2. 展示数据：`tags` 组件中进行

所以 `tags` 的数据我们最好把它保存到 `vuex` 中。

1. 在 `constant` 中新建常量

   ```js
   // tags
   export const TAGS_VIEW = 'tagsView'
   ```

2. 在 `store/app` 中创建 `tagsViewList`

   ```js
   import { LANG, TAGS_VIEW } from '@/constant'
   import { getItem, setItem } from '@/utils/storage'
   export default {
     namespaced: true,
     state: () => ({
       ...
       tagsViewList: getItem(TAGS_VIEW) || []
     }),
     mutations: {
       ...
       /**
        * 添加 tags
        */
       addTagsViewList(state, tag) {
         const isFind = state.tagsViewList.find(item => {
           return item.path === tag.path
         })
       // 处理重复
         if (!isFind) {
           state.tagsViewList.push(tag)
           setItem(TAGS_VIEW, state.tagsViewList)
         }
       }
     },
     actions: {}
   }
   
   ```

3. 在 `appmain` 中监听路由的变化

   ```js
   <script setup>
   import { watch } from 'vue'
   import { isTags } from '@/utils/tags'
   import { generateTitle } from '@/utils/i18n'
   import { useRoute } from 'vue-router'
   import { useStore } from 'vuex'
   
   const route = useRoute()
   
   /**
    * 生成 title
    */
   const getTitle = route => {
     let title = ''
     if (!route.meta) {
       // 处理无 meta 的路由
       const pathArr = route.path.split('/')
       title = pathArr[pathArr.length - 1]
     } else {
       title = generateTitle(route.meta.title)
     }
     return title
   }
   
   /**
    * 监听路由变化
    */
   const store = useStore()
   watch(
     route,
     (to, from) => {
       if (!isTags(to.path)) return
       const { fullPath, meta, name, params, path, query } = to
       store.commit('app/addTagsViewList', {
         fullPath,
         meta,
         name,
         params,
         path,
         query,
         title: getTitle(to)
       })
     },
     {
       immediate: true
     }
   )
   </script>
   
   
   ```

4. 创建 `utils/tags`

   ```js
   const whiteList = ['/login', '/import', '/404', '/401']
   
   /**
    * path 是否需要被缓存
    * @param {*} path
    * @returns
    */
   export function isTags(path) {
     return !whiteList.includes(path)
   }
   
   ```

   

## 生成 tagsView

目前数据已经被保存到 `store` 中，那么接下来我们就依赖数据渲染 `tags`

1. 创建 `store/app` 中 `tagsViewList` 的快捷访问

   ```js
     tagsViewList: state => state.app.tagsViewList
   ```

2. 创建 `components/tagsview`

   ```js
   <template>
     <div class="tags-view-container">
         <router-link
           class="tags-view-item"
           :class="isActive(tag) ? 'active' : ''"
           :style="{
             backgroundColor: isActive(tag) ? $store.getters.cssVar.menuBg : '',
             borderColor: isActive(tag) ? $store.getters.cssVar.menuBg : ''
           }"
           v-for="(tag, index) in $store.getters.tagsViewList"
           :key="tag.fullPath"
           :to="{ path: tag.fullPath }"
         >
           {{ tag.title }}
           <i
             v-show="!isActive(tag)"
             class="el-icon-close"
             @click.prevent.stop="onCloseClick(index)"
           />
         </router-link>
     </div>
   </template>
   
   <script setup>
   import { useRoute } from 'vue-router'
   const route = useRoute()
   
   /**
    * 是否被选中
    */
   const isActive = tag => {
     return tag.path === route.path
   }
   
   /**
    * 关闭 tag 的点击事件
    */
   const onCloseClick = index => {}
   </script>
   
   <style lang="scss" scoped>
   .tags-view-container {
     height: 34px;
     width: 100%;
     background: #fff;
     border-bottom: 1px solid #d8dce5;
     box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
       .tags-view-item {
         display: inline-block;
         position: relative;
         cursor: pointer;
         height: 26px;
         line-height: 26px;
         border: 1px solid #d8dce5;
         color: #495060;
         background: #fff;
         padding: 0 8px;
         font-size: 12px;
         margin-left: 5px;
         margin-top: 4px;
         &:first-of-type {
           margin-left: 15px;
         }
         &:last-of-type {
           margin-right: 15px;
         }
         &.active {
           color: #fff;
           &::before {
             content: '';
             background: #fff;
             display: inline-block;
             width: 8px;
             height: 8px;
             border-radius: 50%;
             position: relative;
             margin-right: 4px;
           }
         }
         // close 按钮
         .el-icon-close {
           width: 16px;
           height: 16px;
           line-height: 10px;
           vertical-align: 2px;
           border-radius: 50%;
           text-align: center;
           transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
           transform-origin: 100% 50%;
           &:before {
             transform: scale(0.6);
             display: inline-block;
             vertical-align: -3px;
           }
           &:hover {
             background-color: #b4bccc;
             color: #fff;
           }
         }
       
     }
   }
   </style>
   ```
   
3. 在 `layout/index` 中导入

   ```js
   <div class="fixed-header">
       <!-- 顶部的 navbar -->
       <navbar />
       <!-- tags -->
       <tags-view></tags-view>
   </div>
   
   import TagsView from '@/components/TagsView'
   
   ```



## tagsView 国际化处理

`tagsView` 的国际化处理可以理解为修改现有 `tags` 的 `title`。

所以我们只需要：

1. 监听到语言变化
2. 国际化对应的 `title` 即可

根据方案，可生成如下代码：

1. 在 `store/app` 中，创建修改 `ttile` 的 `mutations`

   ```js
   /**
   * 为指定的 tag 修改 title
   */
   changeTagsView(state, { index, tag }) {
       state.tagsViewList[index] = tag
       setItem(TAGS_VIEW, state.tagsViewList)
   }
   ```

   

2. 在 `appmain` 中监听语言变化

   ```js
   import { generateTitle, watchSwitchLang } from '@/utils/i18n'
   
   /**
    * 国际化 tags
    */
   watchSwitchLang(() => {
     store.getters.tagsViewList.forEach((route, index) => {
       store.commit('app/changeTagsView', {
         index,
         tag: {
           ...route,
           title: getTitle(route)
         }
       })
     })
   })
   ```

   

## contextMenu 展示处理

> [contextMenu](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/contextmenu_event) 为 鼠标右键事件

[contextMenu](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/contextmenu_event) 事件的处理分为两部分：

1. `contextMenu` 的展示
2. 右键项对应逻辑处理

那么这一小节我们先处理第一部分：`contextMenu` 的展示：

1. 创建 `components/TagsView/ContextMenu` 组件，作为右键展示部分

   ```js
   <template>
     <ul class="context-menu-container">
       <li @click="onRefreshClick">
         {{ $t('msg.tagsView.refresh') }}
       </li>
       <li @click="onCloseRightClick">
         {{ $t('msg.tagsView.closeRight') }}
       </li>
       <li @click="onCloseOtherClick">
         {{ $t('msg.tagsView.closeOther') }}
       </li>
     </ul>
   </template>
   
   <script setup>
   import { defineProps } from 'vue'
   defineProps({
     index: {
       type: Number,
       required: true
     }
   })
   
   const onRefreshClick = () => {}
   
   const onCloseRightClick = () => {}
   
   const onCloseOtherClick = () => {}
   </script>
   
   <style lang="scss" scoped>
   .context-menu-container {
     position: fixed;
     background: #fff;
     z-index: 3000;
     list-style-type: none;
     padding: 5px 0;
     border-radius: 4px;
     font-size: 12px;
     font-weight: 400;
     color: #333;
     box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
     li {
       margin: 0;
       padding: 7px 16px;
       cursor: pointer;
       &:hover {
         background: #eee;
       }
     }
   }
   </style>
   
   ```

2. 在 `tagsview ` 中控制 `contextMenu` 的展示

   ```js
   <template>
     <div class="tags-view-container">
       <el-scrollbar class="tags-view-wrapper">
         <router-link
           ...
           @contextmenu.prevent="openMenu($event, index)"
         >
           ...
       </el-scrollbar>
       <context-menu
         v-show="visible"
         :style="menuStyle"
         :index="selectIndex"
       ></context-menu>
     </div>
   </template>
   
   <script setup>
   import ContextMenu from './ContextMenu.vue'
   import { ref, reactive, watch } from 'vue'
   import { useRoute } from 'vue-router'
   ...
   
   // contextMenu 相关
   const selectIndex = ref(0)
   const visible = ref(false)
   const menuStyle = reactive({
     left: 0,
     top: 0
   })
   /**
    * 展示 menu
    */
   const openMenu = (e, index) => {
     const { x, y } = e
     menuStyle.left = x + 'px'
     menuStyle.top = y + 'px'
     selectIndex.value = index
     visible.value = true
   }
   
   
   </script>
   ```
   
   

## contextMenu 事件处理

对于 `contextMenu` 的事件一共分为三个：

1. 刷新
2. 关闭右侧
3. 关闭所有

但是不要忘记，我们之前 **关闭单个 `tags`** 的事件还没有进行处理，所以这一小节我们一共需要处理 4 个对应的事件

1. 刷新事件

   ```js
   const router = useRouter()
   const onRefreshClick = () => {
     router.go(0)
   }
   ```

2. 在 `store/app` 中，创建删除 `tags` 的 `mutations`，该 `mutations` 需要同时具备以下三个能力：

   1. 删除 “右侧”
   2. 删除 “其他”
   3. 删除 “当前”

3. 根据以上理论得出以下代码：

  ```js
  /**
  * 删除 tag
  * @param {type: 'other'||'right'||'index', index: index} payload
  */
  removeTagsView(state, payload) {
    if (payload.type === 'index') {
      state.tagsViewList.splice(payload.index, 1)
      return
    } else if (payload.type === 'other') {
      state.tagsViewList.splice(
        payload.index + 1,
        state.tagsViewList.length - payload.index + 1
      )
      state.tagsViewList.splice(0, payload.index)
    } else if (payload.type === 'right') {
      state.tagsViewList.splice(
        payload.index + 1,
        state.tagsViewList.length - payload.index + 1
      )
    }
    setItem(TAGS_VIEW, state.tagsViewList)
  },
  ```

4. 关闭右侧事件

   ```js
   const store = useStore()
   const onCloseRightClick = () => {
     store.commit('app/removeTagsView', {
       type: 'right',
       index: props.index
     })
   }
   ```

5. 关闭其他

   ```js
   const onCloseOtherClick = () => {
     store.commit('app/removeTagsView', {
       type: 'other',
       index: props.index
     })
   }
   ```

6. 关闭当前（`tagsview`）

   ```js
   /**
    * 关闭 tag 的点击事件
    */
   const store = useStore()
   const onCloseClick = index => {
     store.commit('app/removeTagsView', {
       type: 'index',
       index: index
     })
   }
   ```

   

## 处理 contextMenu 的关闭行为

```js
/**
 * 关闭 menu
 */
const closeMenu = () => {
  visible.value = false
}

/**
 * 监听变化
 */
watch(visible, val => {
  if (val) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})
```


## 处理基于路由的动态过渡

[处理基于路由的动态过渡](https://next.router.vuejs.org/zh/guide/advanced/transitions.html#%E5%9F%BA%E4%BA%8E%E8%B7%AF%E7%94%B1%E7%9A%84%E5%8A%A8%E6%80%81%E8%BF%87%E6%B8%A1)  官方已经给出了示例代码，结合 `router-view` 和 `transition` 我们可以非常方便的实现这个功能

1. 在 `appmain` 中处理对应代码逻辑

   ```js
   <template>
     <div class="app-main">
       <router-view v-slot="{ Component, route }">
         <transition name="fade-transform" mode="out-in">
           <keep-alive>
             <component :is="Component" :key="route.path" />
           </keep-alive>
         </transition>
       </router-view>
     </div>
   </template>
   ```

2. 增加了 `tags` 之后，`app-main` 的位置需要进行以下处理

   ```js
   <style lang="scss" scoped>
   .app-main {
     min-height: calc(100vh - 50px - 43px);
     ...
     padding: 104px 20px 20px 20px;
     ...
   }
   </style>
   ```

3. 在 `styles/transition` 中增加动画渲染

  ```scss
  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }
  
  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-30px);
  }
  
  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  ```



## tagsView 方案总结

那么到这里关于 `tagsView` 的内容我们就已经处理完成了。

整个 `tagsView` 就像我们之前说的，拆开来看之后，会显得明确很多。

整个 `tagsView` 整体来看就是三块大的内容：

1. `tags`：`tagsView` 组件
2. `contextMenu`：`contextMenu` 组件
3. `view`：`appmain` 组件

再加上一部分的数据处理即可。

最后关于 `tags` 的国际化部分，其实处理的方案有非常多，大家也可以在后面的 **讨论题** 中探讨一下关于 **此处国家化** 的实现，相信会有很多新的思路被打开的。