---
layout: Vue3
title: Vue3项目实战(五)：通用功能开发（一）
date: 2022-12-29 11:00:23
tags: 工程化,Vue3,通用功能
banner_img: /img/theme.png
index_img: /img/theme.png
excerpt: 国际化/换肤
---

# 通用功能

1. 国际化
2. 动态换肤
3. `screenfull`
4. `headerSearch`
5. `tagView`
6. `guide`

# 国际化实现原理

先来看一个需求：

> 我们有一个变量 `msg` ，但是这个 `msg` 有且只能有两个值：
>
> 1. hello world
> 2. 你好世界
>
> 要求：根据需要切换 `msg` 的值

这样的一个需求就是 国际化 的需求，那么我们可以通过以下代码来实现这个需求

```js
<script>
  // 1. 定义 msg 值的数据源
  const messages = {
    en: {
      msg: 'hello world'
    },
    zh: {
      msg: '你好世界'
    }
  }
  // 2. 定义切换变量
  let locale = 'en'
  // 3. 定义赋值函数
  function t(key) {
    return messages[locale][key]
  }
  // 4. 为 msg 赋值 
  let msg = t('msg')
  console.log(msg);
  // 修改 locale， 重新执行 t 方法，获取不同语言环境下的值

</script>
```

总结：

1. 通过一个变量来 **控制** 语言环境
2. 所有语言环境下的数据源要 **预先** 定义好
3. 通过一个方法来获取 **当前语言** 下 **指定属性** 的值
4. 该值即为国际化下展示值

## 基于 vue-i18n V9  的国际化实现方案分析

在 `vue` 的项目中，我们不需要手写这么复杂的一些基础代码，可以直接使用 [vue-i18n](https://vue-i18n.intlify.dev/) 进行实现（注意：**`vue3` 下需要使用 `V 9.x` 的 `i18n`**）

[vue-i18n](https://vue-i18n.intlify.dev/guide/) 的使用可以分为四个部分：

1. 创建 `messages` 数据源
2. 创建 `locale` 语言变量
3. 初始化 `i18n` 实例
4. 注册 `i18n` 实例

那么接下来我们就去实现以下：

1. 安装 `vue-i18n`
```js
  npm install vue-i18n@next
```


2. 创建 `i18n/index.js` 文件

3. 创建 `messages` 数据源

   ```js
   const messages = {
     en: {
       msg: {
         test: 'hello world'
       }
     },
     zh: {
       msg: {
         test: '你好世界'
       }
     }
   }
   ```

4. 创建 `locale` 语言变量

   ```js
   const locale = 'en'
   ```

5. 初始化 `i18n` 实例

   ```js
   import { createI18n } from 'vue-i18n'
   
   const i18n = createI18n({
     // 使用 Composition API 模式，则需要将其设置为false
     legacy: false,
     // 全局注入 $t 函数
     globalInjection: true,
     locale,
     messages
   })
   ```

6. 把 `i18n` 注册到 `vue` 实例

   ```js
   export default i18n
   ```

7. 在 `main.js` 中导入

   ```js
   // i18n （PS：导入放到 APP.vue 导入之前，因为后面我们会在 app.vue 中使用国际化内容）
   import i18n from '@/i18n'
   ...
   app.use(i18n)
   ```

8. 在 `layout/components/Sidebar/index.vue` 中使用 `i18n`

   ```html
   <h1 class="logo-title" v-if="$store.getters.sidebarOpened">
           {{ $t('msg.test') }}
   </h1>
   ```

9. 修改 `locale` 的值，即可改变展示的内容

截止到现在我们已经实现了 `i18n` 的最基础用法，那么解下来我们就可以在项目中使用 `i18n` 完成国际化。

项目中完成国际化分成以下几步进行:

1. 封装 `langSelect` 组件用于修改 `locale`
2. 导入 `el-locale` 语言包
3. 创建自定义语言包

## 封装  langSelect  组件

1. 定义 `store/app.js`

   ```js
   import { LANG } from '@/constant'
   import { getItem, setItem } from '@/utils/storage'
   export default {
     namespaced: true,
     state: () => ({
       ...
       language: getItem(LANG) || 'zh'
     }),
     mutations: {
       ...
       /**
        * 设置国际化
        */
       setLanguage(state, lang) {
         setItem(LANG, lang)
         state.language = lang
       }
     },
     actions: {}
   }
   
   ```

   

2. 在 `constant` 中定义常量

   ```js
   // 国际化
   export const LANG = 'language'
   ```


3. 创建 `components/LangSelect/index` 

   ```js
   <template>
     <el-dropdown
       trigger="click"
       class="international"
       @command="handleSetLanguage"
     >
       <div>
         <el-tooltip content="国际化" :effect="effect">
           <svg-icon icon="language" />
         </el-tooltip>
       </div>
       <template #dropdown>
         <el-dropdown-menu>
           <el-dropdown-item :disabled="language === 'zh'" command="zh">
             中文
           </el-dropdown-item>
           <el-dropdown-item :disabled="language === 'en'" command="en">
             English
           </el-dropdown-item>
         </el-dropdown-menu>
       </template>
     </el-dropdown>
   </template>
   
   <script setup>
   import { useI18n } from 'vue-i18n'
   import { defineProps, computed } from 'vue'
   import { useStore } from 'vuex'
   import { ElMessage } from 'element-plus'
   
   defineProps({
     effect: {
       type: String,
       default: 'dark',
       validator: function(value) {
         // 这个值必须匹配下列字符串中的一个
         return ['dark', 'light'].indexOf(value) !== -1
       }
     }
   })
   
   const store = useStore()
   const language = computed(() => store.getters.language)
   
   // 切换语言的方法
   const i18n = useI18n()
   const handleSetLanguage = lang => {
     i18n.locale.value = lang
     store.commit('app/setLanguage', lang)
     ElMessage.success('更新成功')
   }
   </script>
   ```

4. 在 `navbar` 中导入 `LangSelect`

   ```js
   <template>
     <div class="navbar">
       ...
       <div class="right-menu">
         <lang-select class="right-menu-item hover-effect" />
         <!-- 头像 -->
         ...
       </div>
     </div>
   </template>
   
   <script setup>
   import LangSelect from '@/components/LangSelect'
   ...
   </script>
   
   <style lang="scss" scoped>
   .navbar {
     ...
   
     .right-menu {
       ...
   
       ::v-deep .right-menu-item {
         display: inline-block;
         padding: 0 18px 0 0;
         font-size: 24px;
         color: #5a5e66;
         vertical-align: text-bottom;
   
         &.hover-effect {
           cursor: pointer;
         }
       }
   
       ...
   }
   </style>
   
   ```

## element-plus 国际化处理

截止到目前，我们的国际化内容已经基本功能已经处理完成了。接下来需要处理的就是对应的语言包，有了语言包就可以实现整个项目中的所有国际化处理了。

那么对于语言包来说，我们整个项目中会分成两部分：

1. `element-plus` 语言包：用来处理 `element` 组件的国际化功能
2. 自定义语言包：用来处理 **非**`element` 组件的国际化功能

那么首先我们先来处理 `element-plus` 语言包：

3. 在 `plugins/index` 中导入 `element` 的中文、英文语言包：

```js
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
```

4. 注册 `element` 时，根据当前语言选择使用哪种语言包

   ```js
   import store from '@/store'
   
   export default app => {
     app.use(ElementPlus, {
       locale: store.getters.language === 'en' ? en : zhCn
     })
   }
   ```

   



## 自定义语言包国际化处理

处理完 `element` 的国际化内容之后，接下来我们来处理 **自定义语言包**。

1.  在本地创建 `lang` 文件夹，里面创建好本地需要的语言包，由于比较多，就放一部分来看看：

```js
// en.ts
export default {
  login: {
    title: 'User Login',
    loginBtn: 'Login',
    usernameRule: 'Username is required',
    passwordRule: 'Password cannot be less than 6 digits',
  },
  // other....
}

// zh.ts
export default {
  login: {
    title: '用户登录',
    loginBtn: '登录',
    usernameRule: '用户名为必填项',
    passwordRule: '密码不能少于6位',
  },
  // other...
}
```

2. 在 `lang/index` 中，导入语言包

  ```js
  import mZhLocale from './lang/zh'
  import mEnLocale from './lang/en'
  ```

3. 在 `messages` 中注册到语言包

   ```js
   const messages = {
     en: {
       msg: {
         ...mEnLocale
       }
     },
     zh: {
       msg: {
         ...mZhLocale
       }
     }
   }
   ```

## 处理项目国际化内容

在处理好了国际化的语言包之后，接下来我们就可以应用国际化功能到我们的项目中

对于我们目前的项目而言，需要进行国际化处理的地方主要分为：

1. 登录页面
2. `navbar` 区域
3. `sidebar` 区域
4. 面包屑区域

那么这一小节，我们先来处理前两个

**登录页面：**

`login/index`

```js
<template>
  <div class="login-container">
    ...
      <div class="title-container">
        <h3 class="title">{{ $t('msg.login.title') }}</h3>
          <lang-select class="lang-select" effect="light"></lang-select>
      </div>

      ...

      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        :loading="loading"
        @click="handleLogin"
        >{{ $t('msg.login.loginBtn') }}</el-button
      >
      
      <div class="tips" v-html="$t('msg.login.desc')"></div>
    </el-form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
...
// 验证规则
const i18n = useI18n()
const loginRules = ref({
  username: [
    {
      ...
      message: i18n.t('msg.login.usernameRule')
    }
  ],
  ...
})
...
</script>


```

`login/rules`

```js
import i18n from '@/i18n'
export const validatePassword = () => {
  return (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error(i18n.global.t('msg.login.passwordRule')))
    } else {
      callback()
    }
  }
}

```

 **`navbar` 区域**

`layout/components/navbar`

```js
<template>
  <div class="navbar">
    ...
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item> {{ $t('msg.navBar.home') }} </el-dropdown-item>
            </router-link>
            <a target="_blank" href="">
              <el-dropdown-item>{{ $t('msg.navBar.course') }}</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              {{ $t('msg.navBar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
```

`components/LangSelect/index`

```js
<el-tooltip :content="$t('msg.navBar.lang')" :effect="effect">

const handleSetLanguage = lang => {
  ...
  ElMessage.success(i18n.t('msg.toast.switchLangSuccess'))
}
```

## sidebar 与 面包屑 区域的国际化处理

**sidebar 区域**

目前对于 `sidebar` 而言，显示的文本是我们在定义路由表时的 `title`

```html
<span>{{ title }}</span>
```

我们可以 **把 `title` 作为语言包内容的 `key` 进行处理**

创建 `utils/i18n` 工具模块，用于 **将 `title` 转化为国际化内容**

```js
import i18n from '@/i18n'
export function generateTitle(title) {
  return i18n.global.t('msg.route.' + title)
}

```

在 `layout/components/Sidebar/MenuItem.vue` 中导入该方法：

```js
<template>
  ...
  <span>{{ generateTitle(title) }}</span>
</template>

<script setup>
import { generateTitle } from '@/utils/i18n'
...
</script>

```

最后修改下 `sidebarHeader` 的内容

```js
<h1 class="logo-title" v-if="$store.getters.sidebarOpened">
  {{ $t('msg.logo') }}
</h1>
```

**面包屑区域：**

在 `components/Breadcrumb/index`

```js
<template>
...
    <!-- 不可点击项 -->
    <span v-if="index === breadcrumbData.length - 1" class="no-redirect">{{
        generateTitle(item.meta.title)
        }}</span>
    <!-- 可点击项 -->
    <a v-else class="redirect" @click.prevent="onLinkClick(item)">{{
        generateTitle(item.meta.title)
        }}</a>
...
</template>

<script setup>
import { generateTitle } from '@/utils/i18n'
...
</script>

```

## 国际化缓存处理

我们希望在 **刷新页面后，当前的国际化选择可以被保留**，所以想要实现这个功能，那么就需要进行 **国际化的缓存处理**

此处的缓存，我们依然通过两个方面进行：

1. `vuex` 缓存
2. `LocalStorage` 缓存

只不过这里的缓存，我们已经在处理 **`langSelect` 组件时** 处理完成了，所以此时我们只需要使用缓存下来的数据即可。

在 `i18n/index` 中，创建 `getLanguage` 方法：

```js
import store from '@/store'
/**
 * 返回当前 lang
 */
function getLanguage() {
  return store && store.getters && store.getters.language
}
```

修改 `createI18n` 的 `locale` 为 `getLanguage()` 

```js
const i18n = createI18n({
  ...
  locale: getLanguage()
})
```

## 国际化方案总结

国际化是前端项目中的一个非常常见的功能，那么在前端项目中实现国际化主要依靠的就是 `vue-i18n` 这个第三方的包。

关于国际化的实现原理大家可以参照 **国际化实现原理** 这一小节，这里我们就不再赘述了。

而  `i18n` 的使用，整体来说就分为这么四步：

1. 创建 `messages` 数据源
2. 创建 `locale` 语言变量
3. 初始化 `i18n` 实例
4. 注册 `i18n` 实例

核心的内容其实就是 数据源的部分，但是大家需要注意，如果你的项目中使用了 **第三方组件库** ，那么不要忘记 **第三方组件库的数据源** 需要 **单独** 进行处理！

# 动态换肤原理分析

想要实现 **动态换肤** 的一个前置条件就是：**色值不可以写死！**

首先我们先来说一下动态换肤的实现方式。

在 `scss` 中，我们可以通过 `$变量名:变量值` 的方式定义 `css 变量` ，然后通过该 `css` 来去指定某一块 `DOM` 对应的颜色。

那么大家可以想一下，如果我此时改变了该 `css` 变量的值，那么对应的 `DOM` 颜色是不是也会同步发生变化。

当大量的 `DOM` 都依赖这个 `css 变量` 设置颜色时，我们是不是只需要改变这个 `css 变量` ，那么所有 `DOM` 的颜色是不是都会发生变化，所谓的 **动态换肤** 是不是就可以实现了！

这个就是 **动态换肤** 的实现原理!

实现换肤和主题大致有两种方案:

1. 使用原生支持的 css var
2. 通过一些手段覆盖 element plus 样式

我们先看来看看 css var 的实现吧。

## css变量

> https://developer.mozilla.org/zh-CN/docs/Web/CSS/:root

变量 与 color、font-size 等正式属性没有什么不同，只是没有默认含义。

所以 CSS 变量（CSS variable）又叫做"CSS 自定义属性"（CSS custom properties）。因为变量与自定义的 CSS 属性其实是一回事。


变量可以分为

- 全局变量
- 局部变量

**全局变量**
通过 `:root` 去定义，其他所有的元素都可以通过 `var(--xxx)` 的形式去使用`全局变量`，我们来看下面这个例子:

> var()函数还可以使用第二个参数，表示变量的默认值。如果该变量不存在，就会使用这个默认值。

```js
<style>
  :root {
    --color: skyblue;
  }

  .use-global {
    color: var(--color)
  }
</style>

// body
<div class="use-global">使用了全局变量</div>
```
**:root**
> :root 这个 CSS 伪类匹配文档树的根元素。对于 HTML 来说，:root 表示 <html> 元素，除了优先级更高之外，与 html 选择器相同。

**自定义属性 (--*)：CSS 变量**

> 带有前缀--的属性名，比如--example--name，表示的是带有值的自定义属性，其可以通过 var 函数在全文档范围内复用的。

**局部变量**

我们可以在某个选择器下去定义变量，或者在元素的 `style` 属性上定义变量：

```js
// style
:root {
  --color: skyblue;
}

.parent {
  --color: pink; // 优先级更高
}

h3 {
  color: var(--color)
}

// html
<div class="parent">
  <h3>child title</h3>
</div>
```

这里 `h3` 标签会显示红色。虽然我们在 `:root` 上也定义了 `--color` 变量，但是根据就近原则，`h3` 会取父级定义的变量。

我们还可以在 `style` 属性上定义变量，这里我们定义了一个 `--bg` 变量，其子元素可以访问到这个变量。

```js
.parent {
  --color: pink;
}

h3 {
  color: var(--color);
  background-color: var(--bg);
}

<div class="parent" style="--bg: black;">
  <h3>child title</h3>
</div>
```

## 修改 css 变量

这里定义了两个按钮，一个修改全局的（根组件）的变量，一个用来修改特定元素上的定义的变量：

```js
<button class="btn">change root</button>
<button class="variable">change local variable</button>
```

**修改全局变量**
```js
const btn = document.querySelector('.btn')

btn.addEventListener('click', () => {
  const html = document.documentElement

  html.style.setProperty('--color', 'red')
})
```

**修改局部变量**

```js
const variableBtn = document.querySelector('.variable')

variableBtn.addEventListener('click', () => {
  const parent = document.querySelector('.parent')

  parent.style.setProperty('--color', 'green')
})
```

# 暗黑模式原理分析

> prefers-color-scheme
>
> prefers-color-scheme CSS 媒体特性: 用于检测用户是否有将系统的主题色设置为亮色或者暗色。

## 主题色实现原理

通过 `媒体查询` 去监听系统主题色的变化。

```js
// style
@media (prefers-color-scheme: dark) {
  .day.dark-scheme   { background:  #333; color: white; }
  .night.dark-scheme { background: black; color:  red; }
}

@media (prefers-color-scheme: light) {
  .day.light-scheme   { background: skyblue; color:  #333; }
  .night.light-scheme { background:  pink; color: #333; }
}

.day, .night {
  display: inline-block;
  padding: 1em;
  width: 7em;
  height: 7em;
  vertical-align: middle;
}

// html
<div class="day light-scheme">Day (changes in light scheme)</div>
<div class="day dark-scheme">Day (changes in dark scheme)</div> <br>

<div class="night light-scheme">Night (changes in light scheme)</div>
<div class="night dark-scheme">Night (changes in dark scheme)</div>
```

现在，我们可以去切换系统的主题色，就会发现页面上的颜色跟着变化了，这是因为我们通过 `@media` 监听 `prefers-color-scheme` 起作用了。

## window.matchMedia

虽然我们通过 css @media 能够应对系统的主题色切换，但是我们如何在 `js` 中去监听呢？

答案是通过 `window.matchMedia` 方法：

```js
// 如果匹配成功，scheme.matches === true
// 也就是说，如果我们的系统是暗黑色，那么这个 matches 就是true，否则是 false
const scheme = window.matchMedia('(prefers-color-scheme: dark)')

scheme.addEventListener('change', e => {
  if (e.matches) {
    // 暗黑色
  } else {
    // 亮色
  }
})
```

## 修改主题色

到此，我们知道了主题色的实现原理，我们如何在项目里去实现主题色的切换呢？

我们来看一个小例子

首先，我们先定义好 `全局变量`，里面包含了一些 `亮色模式` 下的变量：

```js
:root {
  --color: #333;
  --background-color: pink;
}

<h1 style="background-color: var(--background-color); color: var(--color)">
  我是一个标题。！！！
</h1>

<button class="dark-btn">dark mode</button>
```

在页面初始时，我们的背景色是粉色，颜色是浅黑色。

现在我们创建一个按钮，来修改主题颜色，这个之前实现过了很简单对吧。

```js
const darkBtn = document.querySelector('.dark-btn')

darkBtn.addEventListener('click', () => {
  // 修改变量
  document.documentElement.style.setProperty('--color', '#fff')
  document.documentElement.style.setProperty('--background-color', '#000')
})
```

好无疑问这样是可以实现的，但是，如果变量多起来了，几十上百个，我们也要一个个去修改吗？

既然我们的变量都定义在根元素上，那么我们可以采取 **属性覆盖** 的形式。

我们定义一个 `[data-theme="dark"]` 样式表，专门用来处理 `暗黑模式` 下的变量，这里是黑色背景白色字体。

```js
[data-theme="dark"] {
  --color: #fff;
  --background-color: #000;
}
```

或者属性选择器：

```js
/* 浅色模式 */
html[data-theme="light"]:root {
  --body-background: #efefef;
  --text-color: #333;
}

/* 深色模式 */
html[data-theme="dark"]:root {
  --body-background: #000;
  --text-color: #ededed;
}
```

一开始，这个样式表并不会生效，因为根标签上根本没有 `data-theme="dark"` 属性，我们通过按钮来修改：

```js
darkBtn.addEventListener('click', () => {
  document.documentElement.setAttribute('data-theme', 'dark')
})
```

我们给根标签设置了 `data-theme="dark"` 属性，同时内部定了暗黑相关的变量，这时，`data-theme="dark"` 内部的变量就会覆盖 `:root` 中的变量了，从而达到切换主题色的效果。

同时，我们需要根据系统的主题色，来设置项目的主题色，这里就要用到 `window.matchMedia` 方法了。

如果在 `Vue` 项目中，我们可以这样去实现:

```js
const theme = computed(() => store.state.settings.theme);

// 查看当前是否是 暗黑模式
const mediaQueryListDark = window.matchMedia('(prefers-color-scheme: dark)');

const changeTheme = (theme) => {
  // 批量覆盖全局的变量
	document.documentElement.setAttribute('data-theme', theme);
};

const handleColorSchemeChange = evt => {
  if (evt.matches) {
    changeTheme('dark');
  } else {
    changeTheme('light');
  }
};

watchEffect(() => {
  if (theme.value === 'Follow System') {
    // 初始值：跟随系统设置
    handleColorSchemeChange(mediaQueryListDark);

    // 监听系统主题的变化
    mediaQueryListDark.addEventListener('change', handleColorSchemeChange);
  } else if (theme.value) {
    changeTheme(theme.value.toLowerCase());

    // 如果不是跟随系统设置主题了，用户自己设置的主题色，我们就不需要监听系统的主题色切换了
    mediaQueryListDark.removeEventListener('change', handleColorSchemeChange);
  }
});
```

## 总结

到这里，我们花了大量的时间和实例对换肤和主题的原理进行了研究，那么接下来就要进入正式的项目开发环节了。


# 官方换肤方案
> 官方样式路径：/node_modules/element-plus/theme-chalk/src/common/var.scss

定义自己的 scss 文件，然后在 main.ts 导入。

```css
$--colors: (
  "primary": (
    "base": pink,
  ),
  "success": (
    "base": blue,
  ),
  "warning": (
    "base": #f2711c,
  ),
  "danger": (
    "base": #db2828,
  ),
  "error": (
    "base": #db2828,
  ),
  "info": (
    "base": #42b8dd,
  ),
);

@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: $--colors,
);

/* 导入所有的样式变量 */
@use "element-plus/theme-chalk/src/index.scss" as *;
```

修改 `main.ts`

```css
// 注释原导入的 element-plus 样式
// import 'element-plus/dist/index.css'


// 导入我们自己的定义的样式
import '@/styles/cover-element-plus.scss'
```

## 通过 CSS 变量设置
如果不通过上面那种方案，我们还可以定义全局的变量，来覆盖官方的样式。

在自己的样式文件中写入需要覆盖的样式变量：

```css
:root {
  --el-color-primary: green;
}
```

如果你只想自定义一个特定的组件，只需为某些组件单独添加内联样式。

```css
<el-tag style="--el-tag-bg-color: red">Tag</el-tag>
```

出于性能原因，更加推荐你在类名下添加自定义 css 变量，而不是在全局的 :root 下。

```css
.custom-class {
  --el-tag-bg-color: red;
}
```

如果您想要通过 js 控制 css 变量，可以这样做：

```css
// document.documentElement 是全局变量时
const el = document.documentElement
// const el = document.getElementById('xxx')

// 获取 css 变量
getComputedStyle(el).getPropertyValue(`--el-color-primary`)

// 设置 css 变量
el.style.setProperty('--el-color-primary', 'red')
```

## 总结。
相当于我们重新定义了变量，覆盖了官方自己定义的变量，如果我们项目只需要一种颜色，那么这种方案是可行的，但是我们项目需要支持用户选择主题来替换，那么这种方案就不适用了。

那么我来用另一种方案来实现吧。

# 换肤方案落地

在我们的项目中想要实现动态换肤，需要同时处理两个方面的内容：

1. `element-plus` 主题
2. 非 `element-plus` 主题

明确好了原理之后，接下来我们就来理一下咱们的实现思路。

从原理中我们可以得到以下两个关键信息：

1. 动态换肤的关键是修改 `css 变量` 的值
2. 换肤需要同时兼顾
  1. `element-plus` 
  2. 非 `element-plus` 

那么根据以上关键信息，我们就可以得出对应的实现方案:

1. 创建一个组件 `ThemeSelect` 用来处理修改之后的 `css 变量` 的值
2. 根据新值修改 `element-plus`  主题色
3. 根据新值修改非 `element-plus`  主题色

## 创建 ThemeSelect 组件

`ThemeSelect` 组件将由两部分组成：

1. `navbar` 中的展示图标
2. 选择颜色的弹出层

这是效果图：

![](/img/theme-select.png)

**创建 `components/ThemeSelect/index` 组件**

```js
<template>
  <!-- 主题图标 v-bind：https://v3.cn.vuejs.org/api/instance-properties.html#attrs -->
  <el-dropdown
    v-bind="$attrs"
    trigger="click"
    class="theme"
    @command="handleSetTheme"
  >
    <div>
      <el-tooltip :content="$t('msg.navBar.themeChange')">
        <svg-icon icon="change-theme" />
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="color">
          {{ $t('msg.theme.themeColorChange') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- 展示弹出层 -->
  <div>
    ...
  </div>
</template>

<script setup>
const handleSetTheme = command => {}
</script>

<style lang="scss" scoped></style>
```

在 `layout/components/navbar` 中进行引用

```js
<div class="right-menu">
  <theme-picker class="right-menu-item hover-effect"></theme-picker>
</div>

... 

import ThemePicker from '@/components/ThemeSelect/index'
```

**创建 `SelectColor` 组件**

在有了 `ThemeSelect ` 之后，接下来我们来去处理颜色选择的组件 `SelectColor`，在这里我们会用到 `element` 中的 `el-color-picker` 组件

对于 `SelectColor` 的处理，我们需要分成两步进行：

1. 完成 `SelectColor` 弹窗展示的双向数据绑定
2. 把选中的色值进行本地缓存

那么下面咱们先来看第一步：**完成 `SelectColor` 弹窗展示的双向数据绑定**

创建 `components/ThemePicker/components/SelectColor.vue` 

```js
<template>
  <el-dialog title="提示" :model-value="modelValue" @close="closed" width="22%">
    <div class="center">
      <p class="title">{{ $t('msg.theme.themeColorChange') }}</p>
      <el-color-picker
        v-model="mColor"
        :predefine="predefineColors"
      ></el-color-picker>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closed">{{ $t('msg.universal.cancel') }}</el-button>
        <el-button type="primary" @click="comfirm">{{
          $t('msg.universal.confirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

// 预定义色值
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
]
// 默认色值
const mColor = ref('#00ff00')

/**
 * 关闭
 */
const closed = () => {
  emits('update:modelValue', false)
}
/**
 * 确定
 * 1. 修改主题色
 * 2. 保存最新的主题色
 * 3. 关闭 dialog
 */
const comfirm = async () => {
  closed()
}
</script>

<style lang="scss" scoped>
.center {
  text-align: center;
  .title {
    margin-bottom: 12px;
  }
}
</style>

```

在 `ThemePicker/index` 中使用该组件


```js
<template>
  ...
  <!-- 展示弹出层 -->
  <div>
    <select-color v-model="selectColorVisible"></select-color>
  </div>
</template>

<script setup>
import SelectColor from './components/SelectColor.vue'
import { ref } from 'vue'

const selectColorVisible = ref(false)
const handleSetTheme = command => {
  selectColorVisible.value = true
}
</script>

```

完成双向数据绑定之后，我们来处理第二步：**把选中的色值进行本地缓存**

缓存的方式分为两种：

1. `vuex`
2. 本地存储

在 `constants/index` 下新建常量值

```js
// 主题色保存的 key
export const MAIN_COLOR = 'mainColor'
// 默认色值
export const DEFAULT_COLOR = '#409eff'
```

创建 `store/modules/theme` 模块，用来处理 **主题色** 相关内容

```js
import { getItem, setItem } from '@/utils/storage'
import { MAIN_COLOR, DEFAULT_COLOR } from '@/constant'
export default {
  namespaced: true,
  state: () => ({
    mainColor: getItem(MAIN_COLOR) || DEFAULT_COLOR
  }),
  mutations: {
    /**
     * 设置主题色
     */
    setMainColor(state, newColor) {
      state.mainColor = newColor
      setItem(MAIN_COLOR, newColor)
    }
  }
}
```

在 `store/getters` 下指定快捷访问

```js
mainColor: state => state.theme.mainColor
```

在 `store/index` 中导入 `theme`

```js
...
import theme from './modules/theme.js'

export default createStore({
  getters,
  modules: {
    ...
    theme
  }
})
```

在 `selectColor` 中，设置初始色值 和  缓存色值

```js
...

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'
...
const store = useStore()

// 默认色值
const mColor = ref(store.getters.mainColor)

...

/**
 * 确定按钮
 *
 * 1. 修改主题色
 * 2. 保存最新的主题色
 * 3. 关闭 dialog
 *
 */
const comfirm = async () => {
  // 2. 保存最新的主题色
  store.commit('theme/setMainColor', mColor.value)
  // 3. 关闭 dialog
  closed()
}
</script>
```

## scss mix方法
```css
// 给当前的颜色值，添加上 50% 的白色
.white {
  color: mix(white, $color, 50%);
}

// 给当前的颜色值，添加上 50% 的黑色
.black {
  color: mix(black, $color, 50%);
}
```

## 处理 element-plus 主题色变更原理与步骤分析

对于 `element-plus` 的主题变更，相对比较复杂，所以说整个过程我们会分为三部分：

1. 实现原理
2. 实现步骤
3. 实现过程

**实现原理：**

在之前我们分析主题变更的实现原理时，我们说过，核心的原理是：**通过修改 `scss` 变量 ** 的形式修改主题色完成主题变更

但是对于 `element-plus` 而言，我们怎么去修改这样的主题色呢？

其实整体的原理非常简单，分为三步：

1. 获取当前 `element-plus` 的所有样式
2. 找到我们想要替换的样式部分，通过正则完成替换
3. 把替换后的样式写入到 `style` 标签中，利用样式优先级的特性，替代固有样式

**实现步骤：**

那么明确了原理之后，我们的实现步骤也就呼之欲出了，对应原理总体可分为四步：

1. 获取当前 `element-plus` 的所有样式
2. 定义我们要替换之后的样式
3. 在原样式中，利用正则替换新样式
4. 把替换后的样式写入到 `style` 标签中


**创建 `utils/theme` 工具类，写入两个方法**

```js
/**
 * 写入新样式到 style
 * @param {*} elNewStyle  element-plus 的新样式
 * @param {*} isNewStyleTag 是否生成新的 style 标签
 */
export const writeNewStyle = elNewStyle => {
  
}

/**
 * 根据主色值，生成最新的样式表
 */
export const generateNewStyle =  primaryColor => {
 
}
```

那么接下来我们先实现第一个方法 `generateNewStyle`，在实现的过程中，我们需要安装两个工具类：

1. [rgb-hex](https://www.npmjs.com/package/rgb-hex)：转换RGB(A)颜色为十六进制
2. [css-color-function](https://www.npmjs.com/package/css-color-function)：在 CSS 中 Tab Atkins 提出的颜色函数的解析器和转换器。

**示例**
```js
import rgbHex from 'rgb-hex'

rgbHex(65, 131, 196);
//=> '4183c4'

rgbHex('rgb(40, 42, 54)');
//=> '282a36'

rgbHex(65, 131, 196, 0.2);
//=> '4183c433'

rgbHex(40, 42, 54, '75%');
//=> '282a36bf'

rgbHex('rgba(40, 42, 54, 75%)');
//=> '282a36bf'

------------------------------------------------

import color from 'css-color-function'
 
color.convert('color(red tint(50%))');
// "rgb(255, 128, 128)"
```

然后还需要写入一个 **颜色转化计算器  `formula.json`**，这里主要是以 `primary` 色值为例

创建 `constants/formula.json` 

```json
{
  "shade-1": "color(primary shade(10%))",
  "light-1": "color(primary tint(10%))",
  "light-2": "color(primary tint(20%))",
  "light-3": "color(primary tint(30%))",
  "light-4": "color(primary tint(40%))",
  "light-5": "color(primary tint(50%))",
  "light-6": "color(primary tint(60%))",
  "light-7": "color(primary tint(70%))",
  "light-8": "color(primary tint(80%))",
  "light-9": "color(primary tint(90%))",
  "subMenuHover": "color(primary tint(70%))",
  "subMenuBg": "color(primary tint(80%))",
  "menuHover": "color(primary tint(90%))",
  "menuBg": "color(primary)"
}
```

我们来看下 element plus 定义的 `primary` 变量，`light-i` 表示颜色的深浅。

![](/img/primary.png)

如果我们想要定义其它颜色，比如`--el-color-success`，已同样的方法，添加到 `formula.json` 中即可。

同时我们还定义了自己变量在 `formula` 颜色转换器中，因为我们的 `菜单` 部分，也是需要跟着主题色变化的。

**shade tint 方法其实就是利用了 scss 的 mix 方法**，css-color-function 库内部调用进行解析，对某个颜色加深或者淡化！！

```css
// scss

// 给当前的颜色值，添加上 50% 的白色
.white {
  color: mix(white, $color, 50%);
}

// 给当前的颜色值，添加上 50% 的黑色
.black {
  color: mix(black, $color, 50%);
}

@function tint($color, $parcent) {
  @return mix(white, $color, $parcent)
}
@function shade($color, $parcent) {
  @return mix(black, $color, $parcent)
}
```

准备就绪后，我们来实现 `generateNewStyle` 方法：

```js
// https://www.npmjs.com/package/css-color-function
import color from 'css-color-function'

// https://www.npmjs.com/package/rgb-hex
import rgbHex from 'rgb-hex'
import axios from 'axios'
import formula from '@/constants/formula.json'
/**
 * 写入新样式到 style
 * @param {*} cssText  element-plus 的新样式
 * @param {*} isNewStyleTag 是否生成新的 style 标签
 */
export const writeNewStyle = (cssText: string) => {
  const style = document.createElement('style')
  style.innerText = cssText
  document.head.appendChild(style)
}

/**
 * 根据主色值，生成最新的样式表
 */
type TObject = { [key: string]: string }
export const generateNewStyle = async (primaryColor: string) => {
  // colors ===> { primary: 'rgba(8, 12, 132, 0.68)', shade-1: '#070b77ad', light-1: '#212490ad', ...... }
  const colors: TObject = generateColors(primaryColor) as TObject

  // 拿到整个 element plus 样式表，并对需要修改的变量打上了标记
  let cssText = await getOriginalStyle()

  // 遍历生成的样式表，在 CSS 的原样式中进行全局替换
  Object.keys(colors).forEach(key => {
    // reg pattern
    // /(:|\s+)primary/g
    // /(:|\s+)shade-1/g
    // /(:|\s+)menuBg/g
    // ...

    // 这个模式中的 (:|\\s+) 表示一个冒号或一个或多个空白字符（包括空格、制表符和换行符）。
    // \\s+ 的第一个 \ 是转义字符
    // key 是一个变量，代表一个需要匹配的字符串，比如匹配 `primary`

    // '$1' + colors[key]
    // 关于为什么要在色值前面加上 $1，我们需要查看 replace 方法的第二个参数。
    // 在这里，第二个参数是一个字符串，字符串中的 $1 会被替换成第一个括号捕获组（即 (:|\\s+)）匹配到的文本。
    // 所以加上 $1 就是为了在【替换的文本】中【保留原本匹配到的文本】。
    cssText = cssText.replace(
      new RegExp('(:|\\s+)' + key, 'g'),
      '$1' + colors[key]
    )
  })

  // 最终，新的样式表中，含有我们自定义的颜色主题
  return cssText
}

/**
 * 根据主色生成色值表
 */
type TFormulaKey = keyof typeof formula
export const generateColors = (primary: string) => {
  if (!primary) return
  const colors: { [key: string]: string } = {
    primary
  }

  ;(Object.keys(formula) as Array<TFormulaKey>).forEach(
    <K extends TFormulaKey>(key: K) => {
      // 将所有的主色，替换成我们选中的主题色，形式如 >>> color(rgba(255, 69, 0, 1) shade(10%))
      const value = formula[key].replace(/primary/g, primary)

      // 通过 color 的 conver 方法，计算出 rgba 色值
      // color.convert(value)  ===>>>  rgba(0, 12, 230, 0.68)

      // 最终将转为每个颜色，转为十六进制：#030420ad，写入到 colors 对象中，并返回
      colors[key] = '#' + rgbHex(color.convert(value))
    }
  )
  return colors
}

/**
 * 获取当前 element-plus 的默认样式表
 */
const getOriginalStyle = async () => {
  const version = require('element-plus/package.json').version
  const url = `https://unpkg.com/element-plus@${version}/dist/index.css`
  const { data } = await axios(url)

  // 把获取到的数据筛选为原样式模板
  return getStyleTemplate(data)
}

/**
 * 返回 style 的 template
 */
const getStyleTemplate = (data: string) => {
  // element-plus 默认色值
  const colorMap: { [key: string]: string } = {
    '#3a8ee6': 'shade-1',
    '#409eff': 'primary', // element-plus 中含有变量 `--el-color-primary: #409eff`
    '#53a8ff': 'light-1',
    '#66b1ff': 'light-2',
    '#79bbff': 'light-3',
    '#8cc5ff': 'light-4',
    '#a0cfff': 'light-5',
    '#b3d8ff': 'light-6',
    '#c6e2ff': 'light-7',
    '#d9ecff': 'light-8',
    '#ecf5ff': 'light-9'
  }
  // 根据默认色值为要替换的色值打上标记
  Object.keys(colorMap).forEach(key => {
    const value = colorMap[key]
    data = data.replace(new RegExp(key, 'ig'), value)
  })

  // 替换完之后
  // `--el-color-primary: #409eff` 就变成了 `--el-color-primary: primary`
  // --el-color-primary-light-3: #79bbff;  变成了  --el-color-primary-light-3: light-3
  // ...
  // ...
  // `--el-color-primary-light-9: #ecf5ff` 变成了 `--el-color-primary-light-9: light-9`

  return data
}
```

**我们来分析一下 theme.ts 中函数的执行流程**

1. 首先，外部调用 `generateNewStyle` 方法，传入 primaryColor，我们通过 el-color-picker 选中后的值，就是 `primaryColor`，它的色值长这样 `rgba(8, 12, 132, 0.68)`。

2. 通过 `generateColors` 方法生成色值表
  1. 通过 `css-color-function` 处理我们的颜色转化计算器`formula.json`
  ```js
  color(rgba(255, 69, 0, 1) shade(10%)) >>> color.convert(value) >>> rgba(0, 12, 230, 0.68)
  ```
  
  2. 使用 `rgbHex` 方法将 rgba 转化为十六进制格式
  ```js
  rgbHex(color.convert(value))  ===>>>  '#030420ad'
  ```
  3. 返回处理过后的色值表 `colors`

  ```js
  {
    primary: 'rgba(8, 12, 132, 0.68)', // 保留了原始的rgba格式
    shade-1: '#070b77ad',
    light-1: '#212490ad',
    light-2: '#393d9dad',
    ......
  }
  ```
3. 通过 `getOriginalStyle` 方法，获取 element plus 样式表
4. 拿到 element plus 样式数据后，通过 `getStyleTemplate` 方法，根据默认色值 `colorMap` 为要替换的色值打上标记
  1. element-plus 中含有变量 `--el-color-primary: #409eff`，而我们定义的 colorMap 默认值 `'#409eff': 'primary'` 就是与 element plus 中的十六进制值是对应。
  2. 我们就是要将 element plus 中的 primary 十六进制值替换成我们的标记，`primary、shade-*`。因为我们已经处理过 `formula.json` 了，处理过后得到的是 **`{ primary: 'rgba(8, 12, 132, 0.68)', shade-1: '#070b77ad', light-1: '#212490ad', ...}`** 这种形式，这里面的色值，就是我们需要应用到页面上的颜色。
  3. 替换完之后，element plus 中的颜色变量就被标记上了记号，表示将来需要替换成真正的色值。
  ```js
  `--el-color-primary: #409eff` 就变成了 `--el-color-primary: primary`
  `--el-color-primary-light-9: #ecf5ff` 变成了 `--el-color-primary-light-9: light-9`
  ```
  4. 返回处理过后的 element plus 样式表 `cssText`

5. 接着，我们通过正则以及第二步 `generateColors` 方法返回的 colors，将 `cssText` 中每个打了标记的变量值替换
  ```js
  cssText = cssText.replace(new RegExp('(:|\\s+)' + key, 'g'), '$1' + colors[key])
  ```

  1. 这个模式中的 (:|\\s+) 表示一个冒号或一个【或】多个空白字符(\s+)（包括空格、制表符和换行符）
  2. \\s+ 的第一个 \ 是转义字符
  3. key 是一个变量，代表一个需要匹配的字符串，比如匹配 `primary`
  4. `'$1' + colors[key]`: replace 第二个参数是一个字符串，字符串中的 $1 会被替换成第一个括号捕获组（即 (:|\\s+)）匹配到的文本。所以加上 $1 就是为了在【替换的文本】中【保留原本匹配到的文本】。
  5. 最后返回 cssText，新的样式表中，含有我们自定义的颜色主题

6. 最后，通过 `writeNewStyle` 将新的样式表 `cssText` 插入到文档中。
  ```js
  const style = document.createElement('style')
  style.innerText = cssText
  document.head.appendChild(style)
  ```

**总结**

到这里，我们对 `element plus` 的主题换肤就完成了。

原理就是：拿到用户选中的颜色值(rgba)，通过 formula 颜色转换器转换成十六进制表 colors，然后拿到 `element plus` 的样式表，将其中需要修改的变量打上标记并返回含有标记的新样式表 cssText，最后，遍历 colors，通过正则将所有标记替换成 colors 中的值。完成样式的替换。

## element-plus 新主题的立即生效

到目前我们已经完成了 `element-plus` 的主题变更，但是当前的主题变更还有一个小问题，那就是：**在刷新页面后，新主题会失效**

那么出现这个问题的原因，非常简单：**因为没有写入新的 `style`**

所以我们只需要在 **应用加载后，写入 `style` 即可**

那么写入的时机，我们可以放入到 `app.vue` 中

```js
<script setup>
import { useStore } from 'vuex'
import { generateNewStyle, writeNewStyle } from '@/utils/theme'

const store = useStore()
generateNewStyle(store.getters.mainColor).then(newStyleText => {
  writeNewStyle(newStyleText)
})
</script>
```

## 自定义主题变更

自定义主题变更相对来说比较简单，因为 **自己的代码更加可控**。

目前在我们的代码中，需要进行 **自定义主题变更** 为  **`menu` 菜单背景色**

而目前指定 `menu` 菜单背景色的位置在 `layout/components/sidebar/SidebarMenu.vue` 中

```js
  <el-menu
    :default-active="activeMenu"
    :collapse="!$store.getters.sidebarOpened"
    :background-color="$store.getters.cssVar.menuBg"
    :text-color="$store.getters.cssVar.menuText"
    :active-text-color="$store.getters.cssVar.menuActiveText"
    :unique-opened="true"
    router
  >
```

此处的 背景色是通过 `getters` 进行指定的，该 `cssVar` 的 `getters` 为：

```js
cssVar: state => variables,
```

所以，我们想要修改 **自定义主题** ，只需要从这里入手即可。

**根据当前保存的 `mainColor` 覆盖原有的默认色值**

```js
import variables from '@/styles/variables.scss'
import { MAIN_COLOR } from '@/constant'
import { getItem } from '@/utils/storage'
import { generateColors } from '@/utils/theme'

const getters = {
  ...
  cssVar: state => {
    return {
      ...variables,
      ...generateColors(getItem(MAIN_COLOR))
    }
  },
  ...
}
export default getters

```

但是我们这样设定之后，整个自定义主题变更，还存在两个问题：

1. `menuBg` 背景颜色没有变化

这个问题是因为咱们的 `sidebar` 的背景色未被替换，所以我们可以在 `layout/index` 中设置 `sidebar` 的 `backgroundColor`

```html
<sidebar
  id="guide-sidebar"
  class="sidebar-container"
  :style="{ backgroundColor: $store.getters.cssVar.menuBg }"
/>
```

2. 主题色替换之后，需要刷新页面才可响应

这个是因为 `getters` 中没有监听到 **依赖值的响应变化**，所以我们希望修改依赖值

在 `store/modules/theme` 中

```js
...
import variables from '@/styles/variables.scss'
export default {
  namespaced: true,
  state: () => ({
    ...
    variables
  }),
  mutations: {
    /**
     * 设置主题色
     */
    setMainColor(state, newColor) {
      ...
      state.variables.menuBg = newColor
      ...
    }
  }
}

```

在 `getters` 中

```js
....

const getters = {
 ...
  cssVar: state => {
    return {
      ...state.theme.variables,
      ...generateColors(getItem(MAIN_COLOR))
    }
  },
  ...
}
export default getters

```

那么到这里整个自定义主题我们就处理完成了。

对于 **自定义主题而言**，核心的原理其实就是 **修改`scss`变量来进行实现主题色变化** 

明确好了原理之后，对后续实现的步骤就具体情况具体分析了。

1. 对于 `element-plus`：因为 `element-plus` 是第三方的包，所以它 **不是完全可控** 的，那么对于这种最简单直白的方案，就是直接拿到它编译后的 `css` 进行色值替换，利用 `style` **内部样式表** 优先级高于 **外部样式表** 的特性，来进行主题替换
2. 对于自定义主题：因为自定义主题是 **完全可控** 的，所以我们实现起来就轻松很多，只需要修改对应的 `scss`变量即可

那么在之后大家遇到 **自定义主题** 的处理时，就可以按照这里所梳理的方案进行处理了。

# 结束语

这一章我们花了大量的篇幅来介绍换肤的原理以及业务场景如何实现换肤，篇幅有点长，就不在此添加其他功能的描述了。

如下功能我们放到下一章节去实现：

- screenfull
- headerSearch
- tagView
- guide

# 参考链接

- [CSS变量教程](https://www.ruanyifeng.com/blog/2017/05/css-variables.html)

