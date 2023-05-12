---
layout: ts
title: 深入浅出TypeScript
date: 2022-09-09 10:35:36
tags: TypeScript TS
banner_img: /img/ts.jpg
index_img: /img/ts.jpg
excerpt: TypeScript
---

# TypeScript

## .d.ts 和 declare 是干嘛用的

如果一个文件有扩展名 `.d.ts`，则表示它是一个声明文件，可以用来声明全局的类型定义和接口，或者是其它模块。比如：
```js
// global.d.ts

// 声明接口
declare interface Person {
  name: string;
  age: number;
}

// 声明类型 (别名)
declare type TName = string;

// 声明模块
declare module '*.css';
declare module '*.less';
declare module '*.png';

// 拓展 window 属性，在 window 对象上显式设置属性
declare interface Window {
  MyNameSpace: any
}
```

但是也不是说创建了.d.ts文件，里面声明的东西就能生效了，毕竟归根到底也是.ts文件，需要预编译，所以需要在tsconfig.json文件里面的include数组里面添加 `global.d.ts` 文件。
```json
"include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
```

`.d.ts` 文件中的顶级声明必须以 "declare" 或 "export" 修饰符开头。通过`declare`声明的类型或者变量或者模块，在`include`包含的文件范围内，都可以直接引用。
```js
// .vue setup / .ts
const me: Person = {
  name: 'alex.cheng',
  age: 18
}
```

**注意**
`.d.ts`文件顶级声明`declare`最好不要跟`export`同级使用，不然在其他`ts`文件引用这个`.d.ts`的内容的时候，就需要手动import导入了。
```js
// global.d.ts
export type TName = string;

// 这个时候，外部 ts 就无法直接使用 Person 了，需要引入 import { Person } from '../global.d.ts'
export declare interface Person {
  name: string;
  age: number;
}
```

## 给对象分配动态（未知）属性
```js
const o: { [key: string]: any } = {}

// 使用 ts 内置工具 Record，效果同上
const o: Record<string, any> = {}

interface IPerson extends Record<string, any> {
  name: string;
  age?: number;
}

const me1: IPerson = {
  name: 'alex',
  hair: 'black'
}
```

## interface 和 type 有什么区别
1. `接口`和`类型别名`都可以用来描述对象的形状或函数签名。

2. 与`接口类型`不一样的是，`类型别名`可以用于一些其他类型，比如原始类型、联合类型（`|`）和元组。

3. 接口和类型别名都能够被扩展，但语法有所不同。此外，接口和类型别名不是互斥的。接口可以扩展类型别名，而反过来是不行的。

  `interface` 扩展（接口、类型）使用 `extends` 关键字，类型别名扩展（接口、类型）使用的是 `交叉类型（&）`:

  ```js
  // 接口扩展
  interface IPerson {
    name: string;
  }
  interface IMe extends IPerson {
    age: number;
  }

  // 类型扩展
  type TPerson = {
    name: string;
  }
  type TMe = TPerson & {
    age: number;
  }
  ```
4. 类可以以相同的方式实现(`implements`)接口或类型别名，但类不能实现使用类型别名定义的联合类型
  ```js
  // Error:
  type PartialPoint = { x: number; } | { y: number; };
  class SomePartialPoint implements PartialPoint { // 类只能实现具有静态已知成员的对象类型或对象类型的交集。ts(2422)
    x = 1;
    y = 2;
  }

  // Success
  type PartialPoint = { x: number; } & { y: number; };
  class SomePartialPoint implements PartialPoint {
    x = 1;
    y = 2;
  }
  ```

5. 与类型别名不同，接口可以定义多次，会被自动合并为单个接口。
  ```js
  interface IMerge {
    a: 1;
  }
  interface IMerge {
    b: 2
  }
  const ab: IMerge = {}; // 类型“{}”缺少类型“IMerge”中的以下属性: a, bts(2739)


  // Error: 标识符“TOne”重复。ts(2300)
  type TOne = string;
  type TOne = number;
  ```

## 类型保护

  1. typeof
  2. instanceof
  3. in

## 参考资料
[^1]: [TS 学习指南](https://juejin.cn/post/6872111128135073806)
[^2]: [深入理解TypeScript](https://jkchao.github.io/typescript-book-chinese/)


