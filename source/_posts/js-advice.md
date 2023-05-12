---
title: 如何编写高标准的 JavaScript 代码
date: 2022-03-31 10:12:23
tags: JavaScript, ES6
banner_img: /img/god.jpg
index_img: /img/god.jpg
excerpt: 代码量少，运行速度不一定快；代码量多，运行速度也不一定慢。
comment: true
---

# 概述

你是否曾经为了提供一个简单的应用解决方案而彻夜地查看源代码？
你是否曾经为了理解某个框架而冥思苦想、阅览群书？
你是否曾经为了提升0.1s的DOM性能而对多种实现方案进行严格测试和对比？
你是否曾经为了避免兼容问题而遍寻高手共同“诊治”？

跟我一起，专注高质量 `JavaScript` 代码，少出 `Bug🐛`，早下班 !

> 期望为读者带来如下帮助 📚：

  ❑ 能写出简单、清晰、高效的代码。
  ❑ 能搭建一个稳定、健壮、快捷的应用框架。
  ❑ 能回答一个困扰很多人的技术问题。
  ❑ 能修复一个应用开发中遇到的大的Bug。
  ❑ 能非常熟悉某个开源产品。
  ❑ 能提升客户端应用性能。

## JavaScript 基础

代码量少，运行速度不一定快；代码量多，运行速度也不一定慢。

### 减少全局变量
1. 多个全局变量都追加在一个名称空间下，将显著降低与其他应用程序产生冲突的概率
    ```js
      const namespace = {}

      namespace.name = 'my namespace'
    ```
2. 使用闭包体将信息隐藏，它是另一种有效减少“全局污染”的方法。
    ```js
      const sayName = function() {
        const name = 'closure'

        return function() {
          alert(name)
        }
      }()
    ```
3. 作用域控制着变量与参数的可见性及生命周期。

    JavaScript支持函数作用域，定义在函数中的参数和变量在函数外部是不可见的，并且在一个函数中的任何位置定义的变量在该函数中的任何地方都可见。它不仅减少了名称冲突，并且提供了自动内存管理。
4. ES6 模块化编程中每个 js 文件内部定义的变量，外部无法获取。如果外部需要模块内部变量，通过 export 导出。
    ```js
      <script>
        var windowA = 'window a'

        console.log(window.windowA) // 输出 'window a'
      </script>

      <script type="module">
        var moduleA = 'module a'

        console.log(window.moduleA) // 输出 undefined
      </script>
    ```

    

### 谨慎JS数据类型

在自动转换数据类型时，JavaScript一般遵循：如果某个类型的值被用于需要其他类型的值的环境中，JavaScript就自动将这个值转换成所需要的类型。

#### 类型转换

慎用JavaScript类型自动转换，注意`自动转换规则`:

1. 如果把非空对象用在逻辑运算环境中，则对象被转换为true。此时的对象包括所有类型的对象，即使是值为false的包装对象也被转换为true。
2. 果把对象用在数值运算环境中，则对象会被自动转换为数字，如果转换失败，则返回值为NaN。
3. 当数组被用在数值运算环境中时，数组将根据包含的元素来决定转换的值。如果数组为空数组，则被转换为数值0。如果数组仅包含一个数字元素，则被转换为该数字的数值。如果数组包含多个元素，或者仅包含一个非数字元素，则返回NaN。

  🌰
  ```js
  // 对象
  const obj = {}
  obj && 1 >> 1
  obj + 1 >> '[object Object]1'

  obj.valueOf = function() { return 99 }
  obj + 1 >> 100

  // 数组自动转换规则
  +[] >> 0
  +[1] >> 1
  +[1,2] >> NaN
  ```

#### 类型判断
1. `typeof`
对于任何变量来说，使用typeof运算符总是以字符串的形式返回以下6种类型之一：
  ❑ "number"
  ❑ "string"
  ❑ "boolean"
  ❑ "object"
  ❑ "function"
  ❑ "undefined"

  令人疑惑的是，在使用 `typeof` 检测null值时，返回的是“object”，而不是“null”。
  ```js
  typeof null >> 'object'

  typeof [] >> 'object'

  typeof {} >> 'object'
  ```

2. `instanceof`

  instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的`原型链`上。

  这个在判断对象时存在一些不确定性，来看下例子：

  🌰

  ```js
  function Person(name) {
    this.name = name
  }
  const p = new Person('hello')
  p instanceof Person >> true
  p instanceof Object >> true
  ```

  再看一个🌰:
  ```js
  function Person(name) {
    this.name = name
  }

  function Child(name) {
    this.name = name
  }

  Child.prototype = Person.prototype
  Child.prototype.constructor = Child

  const p = new Child('hello child')

  p instanceof Person >> true
  p instanceof Object >> true
  ```

  如果是判断数组呢?
  ```js
  [] instanceof Array >> true

  [] instanceof Object >> true

  // 当然这种方式存在不确定性，我们可以使用 Array.isArray() 方法来判断
  Array.isArray([]) >> true
  Array.isArray({}) >> false
  ```

  从上面例子可以看出，使用 `instanceof` 来判断时存在种种不确定性，只要出现在原型链上的对象都会返回 `true`，使用的时候还需要着重注意！

  为什么会这样，想必大家应该想起来了！

  **Object类是所有对象类型的的父类!**

3. `toString() 方法`

  > 每个对象都有一个 toString() 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。默认情况下，toString() 方法被每个 Object 对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 "[object type]"，其中 type 是对象的类型。

  toString() 方法，它定义在 Object 的原型对象上，对象在调用时会返回一个表示该对象的字符串。

  使用 `toString()` 方法检测对象类型是最安全、最准确的。调用toString()方法把对象转换为字符串，然后通过检测字符串中是否包含数组所特有的标志字符可以确定对象的类型。

  为什么说 `toString` 方法用来检测对象类型是最安全、最准确的，我们慢慢来看吧~

  先看看在对象上直接使用 `toString`会是什么结果：

  ```js
  const obj = { a: 1 }
  const arr = [1, 2]

  obj.toString() >> '[object Object]'

  // 如果是数组的话，则输出字符串
  arr.toString() >> '1,2'


  // 当然我们可以重写/覆盖原型链上的 toString 方法
  obj.toString = function() {
    return 'overwrite'
  }
  obj.toString() >> 'overwrite'
  ```

  既然 toString 方法定义在原型对象上，我们看看如果单独调用它，会是什么结果呢?
  ```js
  Object.prototype.toString() >> '[object Object]'
  ```

  如果通过 `call/apply` 方法，改变 `toString` 方法内部的 `this` 执行，又会是什么结果呢?

  看到如下结果，我相信这绝对可以完美 cover 住项目里面所有的类型判断了！所以说它是最安全、最准确的类型判断，没有异议吧😏
  ```js
  Object.prototype.toString.call({}) >> '[object Object]'
  
  Object.prototype.toString.call([]) >> '[object Array]'
  
  Object.prototype.toString.call(function(){}) >> '[object Function]'
  
  Object.prototype.toString.call('') >> '[object String]'
  
  Object.prototype.toString.call(1) >> '[object Number]'
  
  Object.prototype.toString.call(true) >> '[object Boolean]'
  
  Object.prototype.toString.call(null) >> '[object Null]'
  
  Object.prototype.toString.call(undefined) >> '[object Undefined]'
  
  Object.prototype.toString.call() >> '[object Undefined]'
  
  Object.prototype.toString.call(new Date()) >> '[object Date]'
  
  Object.prototype.toString.call(/at/) >> '[object RegExp]'
  
  ```

  那么它是如何做到的呢，我们来扒一扒它的原理！在 `toString` 方法被调用时，会执行以下几个操作步骤:

  1. 获取this指向的那个对象的`[[Class]]`属性的值。（`call/apply` 改变 this 指向）
  2. 计算出三个字符串"[object "、 第一步的操作结果、 以及 "]" 连接后的新字符串。
  3. 返回第二步的操作结果，也就是类似 `'[object Type]'` 这种格式字符串。

  需要注意的是，对象的`[[Class]]`属性是无法直接访问的，它一个内部属性，所有的对象(原生对象和宿主对象)都拥有该属性，且不能被任何人修改。在规范中，`[[Class]]`是这么定义的：`内部属性`描述。

  如果要单独或者对象的 `[[Class]]`，我们可以这样做:
  ```js
  const targetObj = []
  Object.prototype.toString.call(targetObj).slice(8, -1) >> 'Array'
  ```

  既然它如此好用，难道就没有缺点吗？

  答案是当然有的，毕竟凡事都不可能那么绝对的嘛！

  那么缺点是什么呢？
  第一，`toString()` 会进行装箱操作，产生很多临时对象。（装箱就是将基本类型的数据，通过引用类型包装起来，从而可以使用引用类上的方法）
```js
// 你肯定不能这样用
1.toString() >> SyntaxError: Invalid or unexpected token

// 你必须这样用
(1).toString() >> '1'
```
  第二，无法区分自定义对象类型，用来判断这类对象时，返回的都是`Object`，这样我们就需要通过 `instanceof` 来判断了。
  ```js
  function Person(){}
  const p = new Person()

  Object.prototype.toString.call(p) >> '[object Object]'
  ```



### 字符串
JavaScript解释器强制约定字符串在堆区存储的数据是不可变的，也就是说，JavaScript解释器强制约定字符串在堆区存储的数据是不可变的。




## 参考资料
[^1]: 参考资料
[^2]: 参考资料2
