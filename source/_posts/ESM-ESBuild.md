---
layout: build
title: ESM/ESBuild
date: 2022-09-13 17:11:35
tags: ESM ESModule ESBuild
banner_img: /img/modules.jpg
index_img: /img/modules.jpg
excerpt: 继 CommonJS、AMD、CMD 几种模块化规范由社区提出后，ES 2015（ES6）在语言层面上实现了模块功能，且实现简单，可以替代CommonJS和AMD规范，成为在服务器和浏览器通用的解决方案。
---

# Module

在ES6之前，社区制定了一些模块加载方案，最主要的有CommonJS和AMD两种。前者用于服务器，后者用于浏览器。

ES6在语言规格的层面上实现了模块功能，而且实现得相当简单，完全可以取代现有的CommonJS和AMD规范，成为浏览器和服务器通用的模块解决方案。


## stage1

> 文件划分方式，约定每一个 js 文件就是一个独立的模块

```html
<script src="./lib.js"></script>
<script src="./main.js"></script>

<script>
  // 直接使用导入文件中的变量与方法
  method1()

  // 模块成员可以被修改
  count = 2
</script>
```

缺点：
1. 污染全局作用域
2. 命名冲突
3. 无法管理模块间的依赖关系
4. 模块成员可以在外部直接修改

## stage2

> 命名空间，减少命名冲突

每个文件中，通过一个命名对象来包裹所有的变量和方法

```js
// module a 相关的数据和方法

const moduleA = {
  name: 'module a',
  count: 1,
  incCount() {
    this.count ++
  }
}
```

缺点：
1. 污染全局作用域
2. 无法管理模块间的依赖关系
3. 模块成员可以在外部直接修改


## stage3

> IIFE（立即执行函数）

```js
;(function($){
  const name = 'moduleA'
  let count = 1
  function incCount() {
    count++
  }

  window.moduleA = {
    incCount
  }
})(jQuery)
```

通过闭包的方式，模块内部的变量只能被模块内部修改，外部无法修改。

通过 IIFE 的传参，我们可以传递一些依赖包给模块使用。

# 模块化规范

- CommonJS（NodeJS）

  1. 一个文件就是一个模块
  2. 每个模块都有单独的作用域
  3. 通过 module.exports 导出成员
  4. 通过 require 函数加载成员

以同步的方式加载模块，如果放在浏览器中，那么会出现大量的文件请求，有时候并不是立马就需要的文件也会被加载，从而造成性能问题，不适合在浏览器中使用。

- AMD（Asyncronous module definition）

  异步的模块定义

```js
// 定义一个模块
// 第二个参数表示当前模块的依赖项
define('module1', ['lodash', './module2'], function('lodash', 'module2') {
  
  // 导出成员，外部可以方法 start 方法
  return {
    start:function() {
      // lodash

      module2()
    }
  }
})

  // 加载模块

  require('./module1', function(module1) {
    module1.start()
  })
  ```

- CMD规范（类似 CommonJS）

- ES Modules（浏览器）

# ES6 模块化

```html
<script src="./main.js" type="module"></script>

<script type="module">
  console.log(1)
</script>
```

特性：

- ES6的模块自动采用严格模式，不管有没有在模块头部加上＂use strict＂。
- 每个 ES Module 都运行在私有作用域中
- ESM 是通过 CORS(跨域) 的方式去请求外部的 JS 资源的。（原 script 标签默认支持跨域）
- ESM 的 script 标签会延迟执行脚本（类似标签的 defer 属性），等待网页渲染完成后，再执行。
  ```js
  // 会比有 type="module" 的script 先执行
  <script>
    alert('hello')
  </script>

  // 延迟执行
  <script type="module"> // 等同于加了 defer 属性
    console.log(1)
  </script>
  ```

严格模式主要有以下限制：

- 变量必须声明后再使用。
- 函数的参数不能有同名属性，否则报错。
- 不能使用with语句。
- 不能对只读属性赋值，否则报错。
- 不能使用前缀0表示八进制数，否则报错。
- 不能删除不可删除的属性，否则报错。
- 不能删除变量(delete prop)，会报错，只能删除属性(delete global[prop])。
- eval不会在其外层作用域引入变量。
- eval和arguments不能被重新赋值。
- arguments不会自动反映函数参数的变化。
- 不能使用arguments.callee。
- 不能使用arguments.caller。
- 禁止this指向全局对象。
- 不能使用fn.caller和fn.arguments获取函数调用的堆栈。
- 增加了保留字（比如protected、static和interface）。

## export & import

模块功能主要由两个命令构成：export和import。

export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。

如果希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。

```js
// test.js
export const myName = 'Hello_AlexCC'

// 组合导出
const myAge = 18
const sayMe = function() {
  console.log(`my name is ${myName}, and I'm ${myAge} years old!`)
}

export {
  myAge,
  sayMe
}
```

如果在一个模块中先输入后输出同一个模块，import语句可以与export语句写在一起。

```js
export { sayName as default} from './someModule'

// 等价于

import { sayName } from './someModule'
export default sayName
```

另外，ES7有一个提案(https://github.com/leebyron/ecmascript-more-export-from)，简化先输入后输出的写法，拿掉了输出时的大括号。

```js
// 提案
export v from 'mod'

// 现在
export { v } from 'mod'
```

import语句会执行所加载的模块

```js
import 'lodash'
```

## 模块整体加载
```js
import * as myModule from './myModule'
```

## module 命令
module命令可以取代import语句，达到整体输入模块的作用。

```js
module myModule from './myModule'

myModule.sayName()
```

## 动态加载模块

返回的是 Promise

```js
import('./moduleA.js').then(module => {
  ...
})
```

## ES6模块加载的实质

ES6模块加载的机制与CommonJS模块完全不同。

CommonJS模块输出的是一个值的拷贝，而ES6模块输出的是 `值的引用`。

```js
// lib.js
export let count = 1
export function incCount() {
  count++
}

// main.js
import { count, incCount } from './lib.js'

console.log(count) // 1

incCount()

console.log(count) // 2
```


注意加上 type="module"

```html
<script src="./main.js" type="module"></script>
```

## ES Module in NodeJS

如何在 Nodejs 中使用 ES module!

有两个步骤：

1. `.js` 后缀都改为 `.mjs`
2. 执行脚本时，加上 `node --experimental-modules main.mjs`

```js
// node

// main.mjs
import fs from 'fs'
import _ from 'lodash'
```

注意事项：

1. 在 node 环境中，我们可以使用 ES Module 导入 CommonJS 导出的成员

```js
// commonjs.js
module.exports = {
  foo: 'commonjs exports foo'
}

// esmodule.js
import mod from './commonjs.js'

console.log(mod.foo)
```

2. 在 node 环境中，CommonJS 中`不能`导入 ES Module 导出的成员

```js
const mod = require('./esmodule.js') // 报错
```

## CommonJS 与 ES Module 差异

```js
// CommonJS

require // 加载模块函数

module // 模块对象

exports // 导出对象别名 exports.name = 'hello world'

__filename // 当前文件的绝对路径

__dirname // 当前文件所在目录
```

```js
// ES Module

import.meta.url // 文件路径信息

// 可以通过内置模块 url 和 path 处理，拿到 __filename 和 __dirname
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

## 高版本 NodeJS 已支持 ESM (Version > 12.10.0)

不需要再写 `.mjs` 结尾了，直接 `.js`

```js
// package.json
{
  "type": "module"
}

// 执行
node --experimental-modules main.js 
```

加上 type module 配置之后，如果我们还想用 `CommonJS` 规范，发现会报错了。因为我们已经使用了 ESM。

如果继续使用 `CommonJS` 规范，那么就需要将 `.js` 改为 `.cjs`。

## ESM in NodeJS （babel 兼容方案）

> yarn add @babel/node @babel/preset-env --save-dev

```js
// 通过 babel-node 命令执行脚本
yarn babel-node main.js
```

要注意的是，`babel/core` 并不会转换我们的代码，转换代码的工作交给 babel 内置的插件去实现的。也就是说，我们需要一个插件，去转换 ES6 中的一个新特性。

<img src="/img/babel.jpg" />

而 `@bable/preset-env` 是插件的集合，所以不需要每个插件都安装一遍。

```js
// 命令行使用
yarn babel-node main.js --presets=@bable/preset-env
```

结合 babel 配置文件使用
```js
// .babelrc
{
  "presets": ["@babel/presets-env"]
}

yarn babel-node main.js
```

既然 `@babel/preset-env` 是插件的集合，而我不想要那么多，只是想处理 `ESM` 怎么办呢？

我们卸载掉 `@babel/preset-env`，安装 `@babel/plugin-transform-modules-commonjs`

```js
// .babelrc
{
  "presets": ["@babel/plugin-transform-modules-commonjs"]
}

yarn babel-node main.js
```

# babel

> 编译器

主要用于将ES6版本的JS代码转换为ES5等向后兼容的JS代码，从而使代码可以运行在低版本浏览器或其他环境中。

> npm install --save-dev babel-core babel-preset-es2015 babel-preset-latest --registry=https://registry.npm.taobao.org

配置文件 `.babelrc`（或者 babel.config.js || .babelrc.js）

```js
{
  "presets": ["es2015", "latest"], // 安装包的别名，用来处理最新的 ES6 语法
  "plugins": []
}
```

安装 `babel-cli`，命令行编译工具，依赖 `babel/core`

```js
npm install --save-dev babel-cli 
```

查看 babel 版本（npx 是新版 NodeJS 附带的命令）

```js
npx babel --version // ===== node_modules/.bin/babel --version 

// ====> 6.26.0 (babel-core 6.26.3)
```

到这里，我们就可以使用 babel 来编译js 文件了。创建一个 babel.js 文件，写入一些 es6 的语法。

```js
// babel.js

const foo = () => {
  return 3 * 3
}

const count = 123
```

打开命令行工具：

```js
npx babel babel.js -o compiled.js // 等效 node_modules/.bin/babel babel.js -o compiled.js 
```

转化后的结果：

```js
"use strict";

var foo = function foo() {
  return 3 * 3;
};

var count = 123;
```

## Polyfill

Babel默认只转换新的JS语法（syntax），而不转换新的API（Promise、Map）。如果只是做语法转换，Promise 是不会被降级的，在低版本的浏览器中可能无法使用。

引入 Polyfill，为当前环境提供一个“垫片”。所谓“垫片”，是指垫平不同浏览器之间差异的东西。polyfill提供了全局的ES6对象及通过修改原型链Array.prototype等来补充对实例的实现。

## babel 版本

Babel版本主要是Babel 6和Babel 7这两个版本。

提到Babel版本的时候，通常指的是@babel/core这个Babel核心包的版本。

Babel 7的npm包都存放在babel域下，即在安装npm包的时候，我们安装的是名称以@babel/开头的npm包，如@babel/cli、@babel/core等。而在Babel 6中，我们安装的包名是babel-cli、babel-core等以babel-开头的npm包。其实它们本质上是一样的，都是Babel官方提供的cli命令行工具和core核心包。在平时开发和学习的过程中，碰到@babel/和babel-时应该认识到它俩是作用相同、内容接近的包，只是版本不一样而已。

## babel 配置文件

> 指定编译的规则。

```js
.babelrc || babel.config.js || .babelrc.js || package.json（配置 babel 属性，配置项都是 一样的）
```

```js
// package.json

{
  ...

  babel: {
    "presets": ["es2015", "react"],
    "plugin": ["transform-class-properties"]
  },

  ...
}
```

推荐使用后缀名是js的配置文件来进行配置，因为可以使用该文件做一些逻辑处理，适用性更强。

## 插件 & 预设

plugin代表插件，preset代表预设。通常每个插件或预设都是一个npm包。

Babel的插件实在太多了，假如只配置插件数组，那我们前端工程要把ES2015、ES2016、ES2017……下的所有插件都写到配置项里，这样的Babel配置文件会非常臃肿。

preset预设就是帮我们解决这个问题的。预设是一组Babel插件的集合，通俗的说法就是插件包，例如babel-preset-es2015就是所有处理ES2015的二十多个Babel插件的集合。这样我们就不用写一大堆插件配置项了，只需要用一个预设代替就可以。另外，预设也可以是插件和其他预设的集合。

Babel官方已经针对常用的环境做了如下这些preset包。

1）@babel/preset-env.

2）@babel/preset-react.

3）@babel/preset-typescript.

4）@babel/preset-stage-0.

5）@babel/preset-stage-1.

## 插件与预设的简称

如果插件的npm包名称的前缀为babel-plugin-，则可以省略其前缀。

如果npm包名称的前缀带有npm作用域@，如@org/babel-plugin-xxx，则短名称可以写成@org/xxx。

```js
{
  "plugins": ["babel-plugin-transform-decorators-legacy"]
}

// =====

{
  "plugins": ["transform-decorators-legacy"]
}
```

预设的短名称规则与插件的类似，预设npm包名称的前缀为babel-preset-或作用域@xxx/babel-preset-xxx的可以省略掉babel-preset-。

## 插件和预设执行顺序

plugins插件数组和presets预设数组是有顺序要求的。如果两个插件或预设都要处理同一个代码片段，那么会根据插件和预设的顺序来执行。规则如下:

1）插件比预设先执行。

2）插件执行顺序是插件数组元素从前向后依次执行。

3）预设执行顺序是预设数组元素从后向前依次执行。

## 预设的选择

babel-preset-latest，在Babel 6时期，是所有年代preset的集合，在Babel 6最后一个版本中，它是babel-preset-es2015、babel-preset-es2016、babel-preset-es2017的集合。

@babel/preset-env`包含了babel-preset-latest的功能，并对其进行了增强`，现在@babel/preset-env完全可以替代babel-preset-latest。

Babel 6 中是babel-preset-env，Babel 7版本开始，@babel/preset-env。

```js
// babel 6
npm install babel-preset-env --save-dev

// .babelrc
{
  "presets": ["env"]
}

// babel 7
npm install @babel/preset-env --save-dev

// .babelrc
{
  "presets": ["@babel/env"]
}
```

总结起来，Babel官方提供的预设，我们实际会用到的其实就只有四个。

1）@babel/preset-env.

2）@babel/preset-flow.

3）@babel/preset-react.

4）@babel/preset-typescript.


## 插件的选择

Babel 7 官方有九十多个插件，不过其中大多数都已经整合在@babel/preset-env和@babel/preset-react等预设里了，我们在开发的时候直接使用预设就可以。

目前比较常用的插件只有@babel/plugin-transform-runtime。

## browserslist

在 package.json 中经常遇到这个配置项：

```js
// package.json

{
  "browserslist": [
    "> 1%",
    "not ie <= 8"
  ]
}
```
上面配置的含义是，该项目工程的目标环境是市场份额大于1%的浏览器并且不考虑IE 8及以下的IE浏览器。

browserslist叫作目标环境配置表，除了写在package.json文件里，也可以单独写在工程目录下的.browserslistrc文件里。

我们写一个含有箭头函数的 js 文件，如果我们在browserslist里指定目标环境是Chrome 60浏览器，再来看一下转换结果:
```js
// package.json
{
  "browserslist": ["chrome 60"]
}
```
我们发现转换后的代码仍然是箭头函数，因为Chrome 60浏览器已经实现了箭头函数语法，所以不会转换成ES5的函数定义语法。

## @babel/runtime

我们写个 js 文件，里面包含 es6 的 class 语法:
```js
class Person {
  sayName() {
    alert(this.name)
  }
}
```

然后执行 babel 命令，查看转换后的结果 `npx babel babel.js -o compiled.js`
```js
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = function () {
  function Person() {
    _classCallCheck(this, Person);
  }

  _createClass(Person, [{
    key: "sayName",
    value: function sayName() {
      alert(this.name);
    }
  }]);

  return Person;
}();
```

可以看到，转换后的代码上部增加了好几个函数声明，这些函数是Babel转码时注入的，我们称之为辅助函数。@babel/preset-env在做语法转换的时候，注入了这些函数声明，以便语法转换后使用。

但这样做存在一个问题。在我们正常地进行前端工程开发的时候，少则有几十个JS文件，多则有上千个。如果每个文件里都使用了class类语法，那么会导致每个转换后的代码上部都会注入这些相同的函数声明。这会导致我们用构建工具打包出来的包体积非常大。

那么应该怎么办呢？一个思路就是，我们把这些函数声明都放在一个npm包里，需要使用的时候直接从这个包里引入我们的文件。这样即使有上千个文件，也会从相同的包里引入这些函数。使用Webpack这一类的构建工具进行打包时，我们只需要引入一次npm包里的函数，这样就做到了复用，减小了包的体积。

`@babel/runtime` 就是上面说的这个npm包，**@babel/runtime把所有语法转换会用到的辅助函数都集中在了一起。**

```js
// babbel 6
npm install babel-runtime --save-dev // /node_modules/babel-runtime/helpers/createClass.js

// babel 7
npm install @babel/runtime@7.12.5 --save-dev
```

然后到node_modules目录下看一下这个包的结构，找到 _classCallCheck、_defineProperties与_createClass这三个辅助函数的位置，我们直接引入即可。

这时，我们就可以替换转换后自动创建的方法，而是使用 @babel/runtime/helpers 中已有的方法。

不过，这么多辅助函数要一个个记住并手动引入，是很难做到的。这时Babel插件 `@babel/plugin-transform-runtime` 就可以用来帮我们解决这个问题。

## @babel/plugin-transform-runtime

辅助函数的自动引入。

@babel/plugin-transform-runtime有三大作用，其中之一就是自动移除语法转换后内联的辅助函数（inline Babel helpers），而是使用@babel/runtime/helpers里的辅助函数来替代，这样就减少了我们手动引入的麻烦。

```js
// babel6
npm install babel-plugin-transform-runtime --save-dev

// babel 7
npm install @babel/plugin-transform-runtime@7.12.10 --save-dev
```

```js
{
  "plugins": ["@babel/plugin-transform-runtime"] // babel 6: "babel-plugin-transform-runtime"
}
```

还是上面的例子，我们再看看转换后的结果，会发现插件已经自动帮我们处理了。

```js
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Person = function () {
  function Person() {
    (0, _classCallCheck3.default)(this, Person);
  }

  (0, _createClass3.default)(Person, [{
    key: "sayName",
    value: function sayName() {
      alert(this.name);
    }
  }]);
  return Person;
}();
```

实际进行前端开发时，我们除了安装@babel/runtime包，基本也会安装@babel/plugin-transform-runtime这个Babel插件。


# Babel 原理与插件开发

Babel的转码过程主要由三个阶段组成：解析（parse）、转换（transform）和生成（generate）。这三个阶段分别由@babel/parser、@babel/core和@babel/generator来完成。

1. **解析阶段**

该阶段由Babel读取源码并生成抽象语法树（AST），该阶段由两部分组成：词法分析与语法分析。

词法分析会将字符串形式的代码转换成tokens流，语法分析会将tokens流转换成AST。

```js
const name = "hello AlexCc"
```

AST

```js
-
#1
  type: VariableDeclaration
  declarations
    #1
    type: VariableDeclarator
    id
      type: Identifier
      name: name
    init
      type: Literal
      value: hello AlexCc
      raw: "hello AlexCc"
    kind: const
```

2. **转换阶段**

完成了解析工作，生成了AST，AST是一个树状的JSON结构。接下来就可以通过Babel插件对该树状结构执行修改操作，修改完成后就得到了新的AST。

3. **生成阶段**

通过转换阶段的工作，我们得到了新的AST。在生成阶段，我们对AST的树状JSON结构进行还原操作，生成新的JS代码，通常这就是我们需要的ES5代码。

## Babel 插件开发
> babel-handbook
>
> https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md

开发Babel转码插件的重点是在第二阶段（转换阶段），在这一阶段我们要从AST上找出需要转换的节点，改成我们需要的形式，最后在生成阶段把AST变回JS代码。

插件模板结构:

```js
module.exports = function({ types: t }) {
  return {
    name: 'pluginName',
    visitor: {}
  }
}
```

假设我们有这样一段代码：

```js
const dog = 'is dog'
```

现在我想将 dog 变成喵咪。

```js
module.exports = function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {
        if (path.node.name === 'dog') {
          path.node.name = 'cat'
          path.parent.init.value = 'is cat'
        }
      },
      var
    }
  }
}
```

转换后：

```js
const cat = 'is cat';
```

我们编写Babel插件的主要工作就是修改`visitor`对象，该对象是遍历AST各个节点的方法。

在上面的插件里，要把变量名dog修改为cat，于是我们修改了visitor.Identifier方法，那我们如何知道要修改的是Identifier方法呢？

Babel原理里讲过Babel转码的三个阶段：解析阶段、转换阶段和生成阶段，我们编写的Babel插件实际上是在执行第二个阶段（转换阶段）的工作，该工作需要前一个阶段解析工作先完成。在解析阶段，我们得到了转码前代码的AST树状结构信息，该AST上会有Identifier等节点信息，我们编写插件的时候参考该AST的信息即可。

<img src="/img/ast.jpg" />

接着看Identifier方法，可以看到它有两个参数path和state，visitor中的每个方法都接收这两个参数，path代表路径。最后我们判断path上节点信息name是不是dog，是的话把它修改为cat即可。

同理，我们也可以修改 `const`、`value`：

```js
module.exports = function({ types: t }) {
  return {
    visitor: {
      Identifier(path, state) {
        path.node.name = 'cat'
        path.parent.init.value = 'is cat'
      },
      VariableDeclaration(path, state) {
        if (path.node.kind === 'const') {
          path.node.kind = 'let'
        }
      },
      Literal(path, state) {
        // 修改 value
        path.node.value = 'is caaat...'
      }
    }
  }
}
```

## 插件传参

给插件传递参数，注意第一个成员变成了数组，数组的第二项是参数

```js
// .babelrc
{
  "plugins": [["./plugin.js", {
    "ES5": false
  }]]
}
```

在插件中，我们可以通过 `state.opts` 获取到参数：

```js
// plugin.js

...
VariableDeclaration(path, state) {
  if (state.opts.ES5 === true && ['let', 'const'].includes(path.node.kind)) {
    path.node.kind = 'var'
  }
},
...
```

# ESBuild
> https://esbuild.github.io/api/

> 介绍: https://juejin.cn/post/6918927987056312327
