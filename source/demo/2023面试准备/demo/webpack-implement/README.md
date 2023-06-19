实现一个简易的 webpack

# webpack 原理

1. 配置 entry，打包的入口模块

2. 使用 `fs.readFileSync` 读取 `entry` 的文件内容 `content`

3. 使用 `@babel/parser` 对 `content` 进行解析，生成 AST

  由于内部使用 `esmodule` 导入的文件，所以需要给 `@babel/parser` 配置 `sourceType` 参数

  `sourceType: 'module'`

4. 使用 `@babel/traverse` 遍历 `AST`，获取依赖模块

  如果内部存在 `import`，意味着依赖了其它模块，就会触发 `ImportDeclaration` 方法，从而拿到依赖模块的 `相对路径`

5. 使用 `@babel/core` 将 `AST` 转化为 ES5 的代码，并且可以配置预设 `@babel/preset-evn`，从而拿到 ast 转化过后的代码

```js
const { code } = babel.transformFromAst(AST, null, {
  presets: ['@babel/preset-env']
})
```

6. 到此，就拿到了当前入口文件的信息

- filepath: `entry`

- dependencise: 入口文件依赖了哪些模块

- code: 通过 babel/core 转化后的 es5 代码

7. 根据 `dependencise` 继续上面的操作，又能拿到依赖模块的内容，以及以来模块的依赖，还有依赖模块转化后的 ES5 代码。

