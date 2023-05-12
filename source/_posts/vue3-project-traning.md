---
layout: Vue3
title: Vue3项目实战(二)：Icon图标（SVG）
date: 2022-12-23 12:16:55
tags: 工程化,Vue3
banner_img: /img/icon.png
index_img: /img/icon.png
excerpt: 自定义 SvgIcon 组件，支持外部链接显示以及本地 svg 图片显示
---

# 使用 Element plus Icon

> https://element-plus.gitee.io/zh-CN/component/icon.html

# 自定义 SVG 图标

对于 element plus 的图标，我们可以直接通过 el-icon 来显示。

```js
<template>
  <div>
    <el-icon :size="size" :color="color">
      <Edit />
    </el-icon>

    <!-- 或者独立使用它，不从父级获取属性 -->
    <!-- 由于SVG图标默认不携带任何属性，你需要直接提供它们 -->
    <Edit />
    <Edit style="width: 1em; height: 1em; margin-right: 8px" />
    <Share style="width: 1em; height: 1em; margin-right: 8px" />
  </div>
</template>
```

但是自定义的图标，我们却没有显示的方式，那么我们就需要一个自定义的组件，来展示自定义的 `svg` 图标。

对于这个自定义的组件，它需要拥有两种能力：

- 显示外部的 svg 图标（链接的方式）
- 显示项目内的 svg 图标

接下来，我们就来实现自定义组件。

## 显示外部的 svg 图标

css mask:
mask 属性允许使用者通过遮罩或者裁切特定区域的图片的方式来 `隐藏一个元素的部分` 或者 `全部可见区域`。

> css mask: https://juejin.cn/post/6846687594693001223

接下来，我们定义组件 `SvgIcon`:

```js
<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    :class="className"
  />
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const props = withDefaults(defineProps<{
  icon: string
  className?: string
}>(), {
  className: '',
  icon: ''
})

// 判断是否为外部图标
const isExternal = computed(() => /^(https?:|mailto:|tel:)/.test(props.icon))

// 外部图标样式
const styleExternalIcon = computed(() => ({
  mask: `url(${props.icon}) no-repeat 50% 50%`,
  '-webkit-mask': `url(${props.icon}) no-repeat 50% 50%`
}))

</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
```

这样，我们就可以通过 `链接` 的形式，来使用 `svg` 图标了：

```js
<svg-icon icon="https://res.lgdsunday.club/user.svg"></svg-icon>
```

## 展示内部图标

如果不是外部链接的话，我们就展示项目内部的 `svg` 图标。

通过 use 的 `xlink href` 属性，找到 body 下已经处理的过的 svg sprite 元素内容，它其中就包含了 `symbol` 元素，每个 `symbol` 元素上都有一个 `id`，这个 id 就是和 `xlink:href` 与之对应的。

```js
// ...
<svg v-else class="svg-icon" :class="className" aria-hidden="true">
  <use :xlink:href="iconName" />
</svg>

const iconName = computed(() => `#icon-${props.icon}`) // 
```

当我们定义好了组件之后，那么就需要在项目中，导入所有的 svg 图标了。

```js
// icons/index.ts

require('./svg/user.svg')
require('./svg/password.svg')
```

假设我们有几百上千个 svg 图标，我们都要这样子引入吗？会不会太难受了 ~~

这里，我们可以使用 webpack 提供的 require.context 方法，来 `批量` 导入 svg 图标:

```js
// https://webpack.docschina.org/guides/dependency-management/#requirecontext
// 通过 require.context() 函数来创建自己的 context
const svgRequire = require.context('./svg', false, /\.svg$/)
// 此时返回一个 require 的函数，可以接受一个 request 的参数，用于 require 的导入。
// 该函数提供了三个属性，可以通过 require.keys() 获取到所有的 svg 图标 ['./xxx1.svg', './xxx2.svg']
// 遍历图标，把图标作为 request 传入到 require 导入函数中，完成本地 svg 图标的导入

svgRequire.keys().forEach(svgIcon => svgRequire(svgIcon))
```

这样，就完成了所有的本地 `svg` 图片导入。

然后我们注册全局的 `SvgIcon` 组件，方便使用。

```js
// icons/index.ts

import type { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default (app: App): void => {
  app.component('svg-icon', SvgIcon)
}
```

到这里，我们去页面上使用 `<svg-icon icon="user" />`，发现没有效果，图标展示不出来。

这是因为，我们虽然在 `icons/index.ts` 中，通过 `require.context` 导入了所有的 svg 图片，但是并没有做处理，`svg-icon` 内部的 `<use :xlink:href="#icon-user" />` 找不到任何跟 `#icon-user` 有关的 svg 图标。

这里，我们就需要用到 `svg-sprite-loader` 了。

## svg-sprite-loader

svg-sprite-loader 的官方解释是：一个用于创建 svg 雪碧图的 Webpack 加载器。这个加载器现在已经被 JetBrains 公司收录和维护了。

通俗的讲：svg-sprite-loader 会把你引入的 svg 塞到一个个 symbol 中，合成一个大的 svg，最后将这个大的 svg 放入 body 中。symbol 的 id 如果不特别指定，就是你的文件名。在页面上形成这样的元素，下面是导入了本地的 `user.svg` 和 `password.svg`：

![](/img/svg-sprite.png)

我们可以看到，每个 `symbol` 上，都有一个 `id` 属性，因为我们在 `SvgIcon` 中指定了 `use` 的 `:xlink:href`，使用时，就能找到页面上对应的图标了。

接着，我们来配置 `svg-sprite-loader`，打开 `vue.config.js`:

```js
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack(config) {
    // 使用了 config.module.rule('svg') 方法来获取对 SVG 文件的处理规则。
    // 然后，它使用了 exclude 属性来添加一个排除规则，这个规则会排除 resolve('src/icons') 目录中的所有文件。
    // 最后，它使用了 end 方法来结束这个链式调用。
    // 这段代码的作用是在 Webpack 构建流程中排除 src/icons 目录中的所有 SVG 文件。这意味着 Webpack 在构建时不会处理这些文件。
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()

    // 使用了 config.module.rule('icons') 方法来获取对图标文件的处理规则。
    // 然后，它使用了 test 属性来设置这个规则应用于哪些文件，这里使用的是一个正则表达式，表示只有以 .svg 结尾的文件才会被处理。
    // 接着，它使用了 include 属性来添加一个包含规则，这个规则只会包含 resolve('src/icons') 目录中的文件。
    // 最后，它使用了 use 方法来添加一个新的规则，这个规则使用了 svg-sprite-loader 来处理 SVG 文件。
    // 这段代码的作用是在 Webpack 构建流程中处理 src/icons 目录中的 SVG 文件。
    // 它会使用 svg-sprite-loader 加载器来将这些 SVG 文件转换为可以在浏览器中使用的精灵图（Sprite）。

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]' // 指定精灵的符号 ID 应为 icon-[name]。
      })
      .end()
  }
}

```

这两条规则在 webpack 配置中设置了两种不同的方法来处理 SVG 文件：一种用于排除位于 src/icons 目录中的 SVG 文件，另一种用于使用 svg-sprite-loader 处理位于 src/icons 目录中的 SVG 文件。


到这里，我们就完成了 `svg-sprite-loader` 的配置，然后重新启动项目，就可以愉快的使用本地的 `svg` 了。

```js

<svg-icon icon="user"></svg-icon>

<svg-icon icon="password"></svg-icon>

```

![](/img/svg-sprite-result.png)

页面上的效果是这样的

![](/img/login.png)

## 总结

经过 `svg-sprite-loader` 加载之后，不仅可以通过指定 id 的方式引入 icon，而且相比图片引入的方式，最大的优点就在于可以通过给 svg 标签添加 fill 属性来调整 icon 的颜色。

除此之外，还可以通过给 svg 添加 class 来调整 icon 的样式，虽然说图片引入的方式也能做到，但是如果图片指定宽高与原图的宽高不成比例，就会导致图片的失真，而 svg 不会。即使随意调整 svg 的宽高样式，它也是按照原尺寸进行缩放，达到高保真的效果。

而且通过`svg-sprite-loader`的处理后，生成了精灵图，它是一种将多个图标放在一张图片中的技术，可以减少 HTTP 请求数，从而提升网站性能。



