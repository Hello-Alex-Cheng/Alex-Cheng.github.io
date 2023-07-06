---
layout: vite
title: 深入浅出 Vite
date: 2023-07-02 22:25:44
tags: Vite
banner_img: /img/vite.png
index_img: /img/vite.png
excerpt: Vite
---

# vite 官网

> https://cn.vitejs.dev/

由两部分组成：

1. 一个开发服务器，以项目最外层的 `index.html` 为入口文件

2. 一套针对生产环境的 Rollup 构建命令。

## 浏览器支持

`默认的构建目标`是能支持 `原生 ESM 语法的 script 标签`、`原生 ESM 动态导入` 和 `import.meta` 的浏览器。

## 在线体验

> https://stackblitz.com/edit/vitejs-vite-p476hg?file=index.html&terminal=dev

## 本地体验

直接安装 `vite` 即可。

`npm init -y`、`npm install vite -D`，然后配置 `vite 启动命令` 即可。

```json
// package.json
{
  "name": "vite-starter",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  },
  "devDependencies": {
    "vite": "^4.3.9"
  }
}
```

也可以通过 `npm create vite@latest` 或者 `yarn create vite` 创建项目

## 兼容性

Vite 需要 Node.js 版本 14.18+，16+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。

## vite 指定根目录启动项目

`vite` 以当前工作目录作为根目录启动开发服务器。你也可以通过 `vite serve some/sub/dir` 来指定一个替代的根目录。

注意 Vite 同时会解析项目根目录下的`配置文件（即 vite.config.js）`，因此如果根目录被改变了，你需要将配置文件移动到新的根目录下。

## 冷启动/预构建依赖

冷启动是指项目启动开发服务器时, `node_module/.vite` 下没有任何之前的预构建文件, 这一般是项目第一次启动, 或项目通过`vite server --force`启动, 也可能是你手动删除了`node_module/.vite`之后启动, 此时Vite需要扫描项目的依赖并使用esbuild对这些依赖进行预构建

`依赖预构建`：构建的包存放在 `node_modules/.vite/deps` 目录下，目的有如下几点：

1. 不同的包有不同的导出格式（commonjs，umd，esmodule），通过预构建整合包的导出格式

2. 引用包的路径可以直接使用 `.vite/deps`，方便路径重写（浏览器默认是不会去 node_modules 下寻找包的）

3. 解决网络多包传输的性能问题（以 lodash 为例，它有几千个模块，如果不做处理，在导入后浏览器会发几千个 HTTP 请求）

可以通过安装 `lodash-es` 这个包来做个实验，在项目中导入 `lodash-es`，你会发现 vite 对它进行了修改，将所有导出的模块整合成了一个 `js` 文件，浏览器也只会发送一次 HTTP 请求。

`lodash-es` 导出的所有定义好的模块方法

<img src='/img/lodash-es-export.png' />

启动项目，Vite 已经整合所有 `lodash-es` 导出的模块

HTTP请求：`/node_modules/.vite/deps/lodash-es.js?v=4db083fa`

```js
...

// node_modules/lodash-es/add.js
var add = createMathOperation_default(function(augend, addend) {
  return augend + addend;
}, 0);
var add_default = add;

...

var math_default_default = {
  add: add_default,
  ...
}

...

export {
  add_default as add,
  ...
}
```

我们可以通过 `vite.config.js` 来配置一下，不对 `lodash-es` 预构建：

```js
// vite.config.js

export default {
  optimizeDeps: {
    exclude: ['lodash-es']
  }
}
```

重启服务后，你会发现浏览器发送了很多个 HTTP 请求去加载 `lodash-es` 导出的每个模块方法。

<img src='/img/vite-optimizeDeps-exclude.png' />

# vite为什么快？

1. 开发环境不打包(`Vite 以 原生 ESM 方式提供源码`)，目前主流的浏览器已经支持模块化了。`<script type="module" src="...">`

2. 按需加载模块，不像webpack那样构建所有源码，vite是根据路由拆分的代码模块，只会处理当前屏幕上实际使用到的模块

3. vite 使用 esbuild 预构建依赖（不经常改动的依赖包）

4. 利用 HTTP 头来加速整个页面的重新加载。（`源码模块`的请求会根据 304 Not Modified 进行`协商缓存`，而`依赖模块`请求则会通过 Cache-Control: max-age=31536000,immutable 进行`强缓存`，因此一旦被缓存它们将不需要再次请求。）

# vite.config.js

如果项目添加了 `vite.config.js`，启动项目或者打包项目时，vite 会自动读取这个配置文件

## defineConfig

写配置文件时，为了有更好的语法提示，我们可以使用 `defineConfig` 方法来包裹配置对象

```js
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['lodash-es'],
  },
});
```

或者这样写：

```js
/** @type import("vite").UserConfig */
const viteConfig = {
  optimizeDeps: {
    exclude: ['lodash-es'],
  },
}

export default viteConfig
```

`defineConfig` 也可以接收一个函数作为参数，这个函数也有一个参数：

```js
{
  command: "serve", // "build" or "serve"
  mode: "development",
  ssrBuild: false,
}
```

我们可以通过 `command` 或者 `mode` 来执行不同环境的配置。

