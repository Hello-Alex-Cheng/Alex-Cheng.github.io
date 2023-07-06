---
layout: Vue,JavaScript
title: 深入浅出Vue3
date: 2022-12-01 18:09:04
tags: JS,Vue3
banner_img: /img/vue3.jpg
index_img: /img/vue3.jpg
excerpt: 渐进式 JavaScript 框架。易学易用，性能出色，适用场景丰富的 Web 前端框架
---

# ref 和 reactive 使用上有什么区别?

1. ref 支持所有的类型，reactive 只接收引用类型（Array/Object/Map/Set）
2. ref 取值和赋值都需要加 .value，reactive 不需要 .value
3. reactive 不能直接赋值，否则会破坏响应式（proxy）

如果要改变数组，可以通过 push 方法，将要 push 的数组结构 (xx.push(...arr))


## 如何抉择呢？

因为社区大佬 `basvanmeurs`提出了一个新的 PR，大概就是重构了响应式的部分内容，由于重构内容过于庞大，所以一直等到 2021 年 8 月 5 号，伴随着 Vue3.2 的发布，尤大大才合并对应的代码。

`ref` 被重构之后，有了更高效的实现（提升了 约 260% 的读取速度 / 约 50% 的写入速度），依赖跟踪速度提高了约 40%，内存使用量减少了约 17%，毫无疑问这是一个伟大的变化。

那么，在以后的使用过程当中，能使用 `ref` 就用 `ref`吧，毕竟它的性能得到了如此大的提升。


# defineProps 如何定义默认值？

> 针对类型的 defineProps 声明的不足之处在于，它没有可以给 props 提供默认值的方式。

使用TS 特有的默认值方式 `withDefaults` 函数，无须引入开箱即用，接受一个props函数第二个参数是一个对象设置默认值。

```js
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

**注意**

如果使用 withDefaults 报错 `'withDefaults' is not defined`，我们修改 `.eslintrc` 文件

添加如下配置代码：

```js
globals: {
    withDefaults: 'readonly'
},
```

# 动态组件
> component

当我们要渲染的组件不确定时，可以使用 `<component is="'component-name'" />` 来处理，要渲染的实际组件由 is 属性决定。

- 当 is 是字符串，它既可以是 HTML 标签名也可以是组件的注册名。
- 或者，is 也可以直接绑定组件。


按注册名渲染组件
```js
<script>
import Foo from './Foo.vue'
import Bar from './Bar.vue'

export default {
  components: { Foo, Bar },
  data() {
    return {
      view: 'Foo'
    }
  }
}
</script>

<template>
  <component :is="view" />
</template>
```

按定义渲染组件 `<script setup> 组合式 API`：

```js
<component :is="Math.random() > 0.5 ? Foo : Bar" />
```

渲染 HTML 元素
```js
<component :is="href ? 'a' : 'span'"></component>
```

# 插槽 slot

默认插槽、具名插槽。

作用域插槽：`:headerName="'我是头部'"`，父组件可以通过 `v-slot="{ headerName }"` 拿到组件内部暴露出来的数据

```js
// SlotComp.vue
<template>
  <div class="slot-wrapper">
    <header class="header">
      <slot name="header" :headerName="'我是头部'"></slot>
    </header>
    <main class="content">
      <slot></slot>
    </main>
    <footer class="footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

使用具有插槽的组件，`headerName` 是作用域插槽从内部提供的
```js
<SlotComp>
  <template v-slot:header="{ headerName }">{{ headerName }}</template>
  <template v-slot>default slot</template>
  <template v-slot:footer>footer</template>
</SlotComp>
```

**插槽简写方式 #**
```js
<SlotComp>
  <template #header="{ headerName }">{{ headerName }}</template>
  <template #default>default slot</template>
  <template #footer>footer</template>
</SlotComp>
```

**动态插槽**
```js
<SlotComp>
  <template #[slotName]>动态插槽</template>
</SlotComp>


// js
const slotName = ref('header')
```

# 异步组件

[官方描述](https://cn.vuejs.org/guide/components/async.html#basic-usage)

> 在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从加载相关组件。

## Vue2 用法
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app">
    <h3>异步组件测试</h3>

    <button @click="toggle">toggle</button>
    <async-component v-if="showAsync" />
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>

  <script type="module">

    import './main.js'

    const app = new Vue({
      el: '#app',
      components: {
        AsyncComponent: () => import('./async.js') // 异步加载组件，页面需要时才加载 async.js 资源
      },
      data() {
        return {
          showAsync: false,
        }
      },
      methods: {
        toggle() {
          this.showAsync = !this.showAsync
        }
      }
    })
  </script>
</body>
</html>
```

接着我们创建一个组件 `async.js`

```js
export default {
  template: `
    <h3>我是局部注册的 异步组件</h3>
  `
}
```

我们回到页面上，因为 `showAsync` 刚开始是 false，所以 `AsyncComponent` 不会显示出来。

打开控制台，会发现并没有加载 `async.js` 资源。

这时，我们点击 `toggle` 按钮，此时 network 显示加载了 `async.js` 资源，并且 `AsyncComponent` 组件的内容也显示出来了。


## Vue3 提供了 `defineAsyncComponent` 方法来实现异步加载组件：

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
```

`ES 模块动态导入` 也会返回一个 Promise，所以多数情况下我们会将它和 defineAsyncComponent 搭配使用。类似 Vite 和 Webpack 这样的构建工具也支持此语法 (并且会将它们作为打包时的代码分割点  `分包、性能优化`)

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

最后得到的 AsyncComp 是一个外层包装过的组件，`仅在页面需要它渲染时` 才会调用加载内部实际组件的函数。

## 顶层 await

`<script setup>` 中可以使用顶层 await。结果代码会被编译成 `async setup()`：

```js
<script setup>
const post = await fetch(`/api/post/1`).then((r) => r.json())
</script>
```

## 搭配 Suspense 组件使用

1. 定义异步组件 Sync.vue

```js
<template>
  <div>
    Name: {{ name }}
  </div>
</template>

<script setup lang='ts'>
import {ref, reactive} from 'vue'
import iTools from '@/utils/Tools'

const name = ref('')
const { data } = await iTools.Axios.get('./sync-data.json') // 定义在 public 下的json文件
name.value = data.name

</script>
```

2. 通过 `defineAsyncComponent` 动态导入 `Sync.vue` 组件

```js
const Sync = defineAsyncComponent(() => import('@/components/Sync.vue'))
```

3. 使用 `Suspense` 内置组件

在请求过程中，会一直显示 loading... 状态，真实项目中我们可以替换成骨架屏。当接口请求成功，才会显示 `Sync.vue` 的内容。
```js
<Suspense>
  <template #default>
    <Sync />
  </template>

  <template #fallback>
    Loading...
  </template>
</Suspense>
```

## 性能优化
当我们使用了 defineAsyncComponent 动态导入组件，build 项目时，会单独将 Sync.vue 的 js 包拎出来，不会将其打包到index.js 中，通过拆包的方式，减少入口文件的大小，从而减少白屏的时间。


# Teleport 传送门

将其插槽内容渲染到 DOM 中的另一个位置。

```js
interface TeleportProps {
  /**
   * 必填项。指定目标容器。
   * 可以是选择器或实际元素。
   */
  to: string | HTMLElement
  /**
   * 当值为 `true` 时，内容将保留在其原始位置
   * 而不是移动到目标容器中。
   * 可以动态更改。
   */
  disabled?: boolean
}

// examples
<teleport to="#some-id" />
<teleport to=".some-class" />
<teleport to="[data-teleport]" />
<teleport to="body" />
```

# Mitt

Vue 2可以支持$on，$off来实现event bus，但是 Vue3 已经不支持这些属性，不过Vue 3可以支持第三方event bus来实现事件通信，

这里使用 `mitt`，官方地址：https://github.com/developit/mitt

```js
import mitt from 'mitt'

// vue3挂载到全局
app.config.globalProperties.$mitt = mitt()
```

# tsx

> 安装插件 npm install @vitejs/plugin-vue-jsx -D

安装如果失败，将 node 版本切换至 v14.16.0


使用插件
```js
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [vue(), vueJsx()],
  // ...
})
```

但是导入 .tsx 文件，TypeScript 会报错：

```js
// 找不到模块“@/components/Foo”或其相应的类型声明。
import Foo from '@/components/Foo' // 省略了 .tsx 后缀

// 导入路径不能以“.tsx”扩展名结束。考虑改为导入“@/components/Bar.js”。
import Bar from '@/components/Bar.tsx'
```

配置 `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
  }
}
```

之后我们导入 tsx 类型的组件，就不要带上后缀了。

**编写 tsx 组件的3中方式**

1. 函数模式
```js
export default function() {
  return (
    <h1>TSX componen111t</h1>
  )
}
```

2. options API 模式
```js
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      compname: 'jsx comp'
    }
  },
  render() {
    return (
      <div>{this.compname}</div>
    )
  }
})
```

3. setup 函数模式
```js

interface IProps {
  name?: string;
}

export default defineComponent({
  props: {
    name: String,
  },
  emits: ['on-click'],
  setup(props: IProps) {
    const is = true
    // 返回渲染函数
    return () => {
      return (
        <h1 v-show={is}>setup 渲染函数 {props?.name}</h1>
      )
    }
  }
})
```

## tsx slot 使用

```js
const Foo = (_, { slots }) => {
  
  return (<>
    <p>{ slots?.header?.()}</p>
    <h3>slot comp</h3>
    <p>{ slots.default ? slots.default() : '默认插槽' }</p>
  </>)
}


<Foo v-slots={{
  default() {
    return 'setup default slot'
  },
  header() {
    return 'header'
  }
}} />

```

# 自动引入
> 安装插件 unplugin-auto-import/vite  https://github.com/antfu/unplugin-auto-import

注册完 plugin 之后，不再引入 `ref, reactive` 等等方法了，直接使用即可。


# v-model
> 官网：https://cn.vuejs.org/guide/components/events.html

## v-model 在原生元素上的用法：

```js
<input v-model="searchText" />

// 等价于

<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

## 在自定义组件上使用（Vue2）

```js
Vue.component('Comp', {
  model: {
    prop: 'compValue',
    event: 'change' // event值必须要和 $emit 中的第一个参数相同，不一定非得是 `chagne`，可以随便填
  },
  props: {
    compValue: {
      text: String,
      default: ''
    }
  },
  template: `
    <input :value="compValue" @input="$emit('change', $event.target.value)" />  
  `
})

// 使用
<Comp v-model="compValue" />
```

在 Vue2 中，`v-model` 默认只能双向绑定一个值，如果我们想要绑定多个值，那么就需要使用 `.sync` 修饰符（Vue3 移除了）

```js
<comp :value.sync="value" :value1.sync="value1" />
```

`comp` 组件内部通过 `this.$emit('update:value', 'xxx')` 和 `this.$emit('update:value1', 'xxx')` 来修改 value 的值。

`.sync` 也只是一个语法糖，我们来看看编译后的结果：

```js
function render() {
  with(this) {
    return _c('comp', {
      attrs: {
        "value": value,
        "value1": value1
      },
      on: {
        "update:value": function ($event) {
          value = $event
        },
        "update:value1": function ($event) {
          value1 = $event
        }
      }
    })
  }
}
```

相当于给 `comp` 组件传递了两个属性 `value、value1`，并且传递了两个事件方法 `update:value、update:value1`，这也是为什么我们可以直接在 `comp` 组件内部通过 `this.$emit('update:xxx')` 来更新属性了。
## 在自定义组件上使用（Vue3）

而当 v-model 使用在一个自定义组件上时，v-model 会被展开为如下的形式：

```js
// vue3
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>


// 内部定义 props 和 方法
const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits(['update:modelValue'])

// 调用
emits('update:modelValue', !props.modelValue)
```

当然，我们也可以给 `v-model` 指定一个参数，不使用默认的 `modelValue`:

```js
<MyComponent v-model:title="bookTitle" />

// 定义 props
defineProps(['title'])
defineEmits(['update:title'])
```

我们还可以绑定多个 v-model（`Vue2中通过 .sync 修饰符绑定多个属性`）

```js
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

# $nextTick

Vue 是异步渲染，data 改变之后，DOM不会立刻渲染

`$nextTick` 表示在 DOM 渲染之后触发，以获取最新的 DOM 节点。

```js
this.$nextTick(() => {
  // ...
})
```


# 自定义指令

> https://cn.vuejs.org/guide/reusability/custom-directives.html

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {},
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}
```

```js
<div v-example:foo.bar="baz">

// binding 参数会是一个这样的对象：
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```

# 全局函数或变量

在 Vue2 中，我们经常将全局用到的函数定义在 Vue 的 prototype 上，在 Vue3 中已经不这样使用了:

```js
const app = createApp(App)


app.config.globalProperties.$env = 'dev'
app.config.globalProperties.$filters = {
  format<T>(str: T): string {
    return str.trim()
  }
}
```

我们使用的时候，不需要导入什么，直接在 .vue 文件使用即可:

```js
<div>env {{$env}}</div>


<script setup lang="ts">
  const app = getCurrentInstance()

  console.log(app?.proxy?.$filters.format('getCurrentInstance'))
</script>
```


在组件中使用全局的变量或者函数时，会出现 ts 报错，这时我们需要去声明它的类型:

```js
declare module 'vue' {
  export interface ComponentCustomProperties {
    $filters: {
      format<T>(str: T): string,
    },
    $env: string,
  }
}
```

# 自定义插件

> 一个插件可以是一个拥有 install() 方法的对象，也可以直接是一个安装函数本身。

插件没有严格定义的使用范围，但是插件发挥作用的常见场景主要包括以下几种：

1. 通过 app.component() 和 app.directive() 注册一到多个全局组件或自定义指令。

2. 通过 app.provide() 使一个资源可被注入进整个应用。

3. 向 app.config.globalProperties 中添加一些全局实例属性或方法

以一个全局的 `Loading` 组件为例：

```js
// Loading/index.ts

import type { App, VNode } from 'vue'
import { createVNode, render } from 'vue'
import Loading from './index.vue'

export default {
  install (app: App) {
    // Loading 需要转成 VNode
    const VNode: VNode = createVNode(Loading)

    // 将组件挂在到某个元素下
    render(VNode, document.body)

    // Loading 组件通过 defineExpose 方法，暴露内部方法会在 exposed 字段上

    app.config.globalProperties.$loading = {
      onShow: VNode.component?.exposed?.onShow,
      onHide: VNode.component?.exposed?.onHide
    }
  }
}
```

Loading 组件内部实现

```js
<template>
  <div class="loading" v-if="show" @click="onHide">
    <img src="../../assets/imgs/loading.gif" alt="" />
  </div>
</template>

<script setup lang='ts'>
import {ref, reactive} from 'vue'

const show = ref(false)

const onShow = () => show.value = true
const onHide = () => show.value = false

// 暴露内部方法供外部调用
defineExpose({
  onShow,
  onHide,
})

</script>
<style scoped lang="less">
.loading {
  width: 100%;
  height: 100%;
  background-color: #1f2123;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
}
</style>
```

这样我们就可以在任何地方使用 全局 Loading 了。

```js
// setup
const instance = getCurrentInstance()

const showLoading = () => {
  instance?.proxy?.$loading.onShow()
}

// or 直接在 template 中使用
<button @click="$loading.onShow">show loading</button>
```

如果调用 $loading 报ts错误，我们可以声明全局类型

```js
declare module 'vue' {
  export interface ComponentCustomProperties {
    $loading: {
      onShow(): void;
      onHide(): void;
    }
  }
}
```

# Scoped原理 & 样式穿透

1. 给 HTML DOM节点加一个不重复的 data 属性（形如: data-v-xxxxx），来表示它的唯一性
2. 在每句 CSS 选择器的末尾，加一个当前组件的 data 属性选择器，来私有化样式
3. 如果组件内部包含其他组件，只会给其他组件的最外层标签加上当前组件的 data 属性.

想要直接修改开源组件的样式，大概率是失败的，解决方案就是要使用样式穿透

```css
/deep/ .input {
  ...
}

// or

:deep(.input) {
  ...
}
```


# css新特性

## 插槽选择器
我们在使用插槽时，如何在子组件中修改插槽内容的样式

```css
  :slotted(.p-footer) {
    color: red;
  }
```

## 定义全局样式
```css
  :global(div) {
    color: red;
  }
```

## 动态 css
```js
// js
const color = ref('red')
const font = ref({
  fontSize: '24px',
  fontWeight: 'bold',
})

// css
.box {
  color: v-bind(color);
  font-size: v-bind('font.fontSize');
}
```

## 模块化 css

给 style 标签加上 module 属性

```css
// template
// 如果有多个，就写成数组形式
<div :class="[$style.box]">
  模块 css
</div>

// css
<style module>
.box {
  color: red
}
</style>
```

`$style` 是固定的写法，如果不想用这个变量，我们可以指定 `module="myStyle"` 。

我们还可以通过 `useCssModule` 获取当前组件下的样式类名

```
// 默认
const class = useCssModule()
const class = useCssModule('$style')

// 如果指定了 module
const class = useCssModule('myStyle')
```

# 集成 Tailwind CSS

> https://blog.csdn.net/qq1195566313/article/details/124951311?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522167109189716782427434983%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fblog.%2522%257D&request_id=167109189716782427434983&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~blog~first_rank_ecpm_v1~rank_v31_ecpm-1-124951311-null-null.nonecase&utm_term=tailwind&spm=1018.2226.3001.4450

安装 vscode 提示插件 `Tailwind CSS IntelliSense`

# h函数

```js
import { h } from 'vue'

const Btn = (props, ctx) => {
  return h('div', {
    class: [...],
    onClick: () => {
      ctx.emit('on-click', 'hello world')
    },
  }, ctx.slots.default())
}

```



# 参考资料
[^1]: [Vue3+Vite+Ts 项目实战 01 Vite 创建项目、ESLint+TS+GitCommit配置、Vue3新特性介绍](https://blog.csdn.net/u012961419/article/details/124299803)

