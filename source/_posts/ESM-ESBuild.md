---
layout: build
title: ESM/ESBuild
date: 2022-09-13 17:11:35
tags: ESM ESModule ESBuild
banner_img: /img/modules.jpg
index_img: /img/modules.jpg
excerpt: 继 CommonJS、AMD、CMD 几种模块化规范由社区提出后，ES 2015（ES6）在语言层面上实现了模块功能，且实现简单，可以替代CommonJS和AMD规范，成为在服务器和浏览器通用的解决方案。
---


# ESModule

继 CommonJS、AMD、CMD 几种模块化规范由社区提出后，ES 2015（ES6）在语言层面上实现了模块功能，且实现简单，可以替代CommonJS和AMD规范，成为在服务器和浏览器通用的解决方案。

在浏览器中通过 `<script type="module">` 原生支持 ESM。

> https://www.cnblogs.com/zhaojian-08/p/14385312.html

## 导入/导出

```js
// esm_index.js
export const hello_world = 1
export default function() {}


<script type="module">
  import fn, { hello_world } from './esm_index.js'
</script>
```

## 动态加载
```js
// dynamic-m.js
export const dynamic_value = '动态加载'
export default function() {
  console.log('default')
}


mport('./dynamic-m.js')
  .then(module => {
    // module: { default: fn, dynamic_value: '动态加载' }
    console.log('动态', module)
  })
```

# ESBuild
> https://esbuild.github.io/api/

> 介绍: https://juejin.cn/post/6918927987056312327
