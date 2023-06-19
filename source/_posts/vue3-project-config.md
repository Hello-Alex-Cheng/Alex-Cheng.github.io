---
layout: Vue3
title: Vue3项目实战(一)：工程化配置
date: 2022-12-21 12:16:55
tags: 工程化,Vue3
banner_img: /img/login.png
index_img: /img/login.png
excerpt: 工程化/编程规范/项目基础配置/...
---

# 编程规范

编程规范的重要作用：

- 规范的代码可以促进团队合作
- 规范的代码可以减少bug处理，规范不是对开发的制约，而确实是有助于提高开发效率的
- 规范的代码可以降低维护成本
- 规范的代码有助于代码审查
- 养成代码规范的习惯，有助于自身的成长

## ESLint + Prettier 自动格式化代码

1. VSCode 安装 ESLint 插件，在根目录创建 `.eslintrc` 配置文件

```json
module.exports = {
  root: true, // 表示当前目录为根目录
  env: {
    node: true,
  },
  // ESLint 中基础配置需要继承的配置
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  // 错误规则：off(0) warn(1) error(2)
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 关闭 no-used 检查
    "@typescript-eslint/no-unused-vars": "off",
  },
  overrides: [{
    files: [
      "**/__tests__/*.{j,t}s?(x)",
      "**/tests/unit/**/*.spec.{j,t}s?(x)",
    ],
    env: {
      jest: true,
    },
  }, ],
};
```

2. VSCode 安装 `Prettier` 插件，在根目录创建 `.prettierrc` 配置文件
```json
{
  "semi": false, // 是否加分号
  "singleQuote": true, // 单引号
  "arrowParens": "avoid", // (x) => {} 箭头函数参数只有一个时，是否要小括号， avoid: 省略小括号
  "trailingComma": "none" // 以多个逗号相隔的，最后是否加逗号
}
```

3. 我们打开 `VSCode` 设置，切换到 `工作区`，找到 `Code Action on Save`，修改配置：
```json
"editor.codeActionsOnSave": {
  "source.fixAll": true,
  "source.fixAll.eslint": true,
  "source.fixAll.stylelint": true,
  "source.fixAll.tslint": true,
},
```

4. 注意项

- 对 VSCode 而言，默认一个 tab 等于 4 个空格，而 ESlint 默认为两个空格，我们在 VSCode 设置中，找到 `tab size` 改为 2 就行。

- 可能安装了多个代码格式化工具，我们右键文件，找到 `使用...格式化文档`，设置默认的为 `Prettier` 即可。

- 有可能 Prettier 和 eslint 规则存在冲突，比如 eslint 希望方法名和括号之间有空格，而 Prettier 不希望有空格，控制台就会报出 ESlint 错误，我们就可以找到 ESlint 配置文件，找到 `rules`，将 `space-before-function-paren` 设置为 `0` 或者 `off` 即可。

5. 手动格式化

```js
Shift + Alt + F
```

## Git 提交规范

```md
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

### Commitizen

Github: cz-cli

当你使用 commitizen 进行代码提交时，commitizen 会提交你在提交时填写所有必须得提交字段

1. 全局安装
```js
npm install -g commitizen@4.2.4
```

2. 项目配置

- 安装 cz-customizable

```js
npm install cz-customizable@6.3.0 --save-dev
```

- 在 package.json 中配置

表示 commitizen 的配置在 node_modules 中的第三方包之中。
```json
...
"config": {
  "commitizen": {
    "path": "node_modules/cz-customizable"
  }
}
...
```

3.项目根目录下创建 `.cz-config.js`，配置自定义提示文件

```js
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:     修复' },
    { value: 'docs', name: 'docs:     文档变更' },
    { value: 'style', name: 'style:     代码格式（不影响代码运行的变动）' },
    { value: 'refactor', name: 'refactor:     重构（既不是增加 feature，也不是修复 bug）' },
    { value: 'perf', name: 'perf:     性能优化' },
    { value: 'test', name: 'test:     增加测试' },
    { value: 'chore', name: 'chore:     构建过程或辅助工具的变动' },
    { value: 'revert', name: 'revert:     回退' },
    { value: 'build', name: 'build:     打包' },
  ],
  // 步骤
  messages: {
    type: '请选择提交的类型',
    customScope: '请输入修改的范围（可选）',
    subject: '请简要描述提交内容（必填）',
    body: '请输入详细的描述（可选）',
    footer: '请输入要关闭的 issue（可选）',
    confirmCommit: '确认要使用以上信息提交?(y/n)',
  },
  // 需要跳过的问题
  skipQuestions: ['body', 'footer'],
  subjectLimit: 72, // 描述内容的限制
}
```

4. 使用 `git cz` 代替 `git commit`

5. 最后

我们可以通过 `git cz` 规范化了 git 提交，那么存在一个问题，我们必须通过 `git cz` 提交，才能规范化，如果我们忘记了使用 `git cz`，依然使用的 `git commit` 直接提交了怎么办呢？

那么，有没有办法限制这种错误的出现？

使用 `git hooks`

### Git Hooks

当《提交描述信息》不符合 `约定式提交规范` 的时候，阻止当前的提交，并抛出相应的错误提示。

通过 `git hooks` 在执行某个事件之前或者之后进行一些额外的操作。

git hooks 非常多，实际用的比较多的就两个：

- pre-commit：git commit 执行前，在获取提交日志信息并进行提交之前调用
- commit-msg：git commit 执行前，可用于将消息规范化为某种项目标准格式


### 使用 husky + commitlint 检查提交信息

使用 `git hooks`去检验我们的提交信息，需要使用两个工具：

- commitlint: 用于检查提交信息
- husky: git hooks 工具

主要: **npm 版本需要在 7.x 以上**


1. 安装依赖:
```js
npm install @commitlint/config-conventional@12.1.4 @commitlint/cli@12.1.4 --save-dev
```

2. 创建 `commitlint-config.js`
```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

3. 增加配置项

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // type 的类型定义，表示 git 提交的 type 必须在以下范围内
    'type-enum': [
      // 当前验证的错误级别
      2,
      // 在什么情况下验证
      'always',
      // 枚举的内容
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build'],
    ],
    // subject 大小写不做校验
    'subject-case': [0]
  }
}
```

**注意**: 必须确保我们的配置文件保存为 `utf-8` 的编码格式，否则可能会报错。

打开配置文件，查看 `vscode` 右下角，是否显示了 `utf-8`，如果不是就要将其切换为正确的编码格式。


4. 安装 husky

检测 git hooks 的工具

1. 安装

```js
npm install husky@7.0.1 --save-dev
```

2. 启动 hooks，在根目录下生成 `.husky` 文件夹

```js
npx husky install
```

3. 在 package.json 中生成 `prepare` 指令（npm > 7）

```js
// 执行指令，会在 npm scripts 中生成配置
npm set-script prepare "husky install"
```

4. 执行 prepare 指令

```js
npm run prepare
```

5. 添加 `commitlint` 的 hook 到 husky 中，并在 commit-msg 的 hooks 下，执行 `npx --no-install commitlint --edit "$1"`

```js
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

6. 打开 .husky，就可以看到 commit-msg 文件了。

```js
// commit-msg

#!/bin/sh
. "${dirname "${0}"}/_/husky.sh"

npx --no-install commitlint --edit $1
```

7. 最后，我们就可以愉快的提交了。

## pre-commit 检测代码提交规范

虽然我们使用了 eslint + prettier 在本地自动格式化代码，但是，有可能有的小伙伴，忘记将 vscode 的自动保存格式化打开了，并且写的代码格式不符合规范，也是可以提交上去的。

那么我们就得加一些配置，来检测小伙伴们提交的代码是否符合规范了。

要完成这一操作，就需要使用 husky 配合 eslint 来实现了。

我们期望通过 `husky` 检测 `pre-commit` 钩子，在该钩子下执行 `npx eslint --ext .js,.vue, src` 指令去进行相关的检测。

1. 执行 `npx husky add .husky/pre-commit "npx eslint --ext .js,.vue, src"` 命令

会在 .husky 文件夹下面，生成 `pre-commit` 文件

```js
// pre-commit

#!/bin/sh
. "${dirname "${0}"}/_/husky.sh"

npx eslint --ext .js,.vue, src
```

每次我们提交代码，都会触发 pre-commit 钩子，从而使用 eslint 去检测我们的代码文件。

2. 关闭自动保存，修改代码提交试试吧


## lint staged 自动修复错误

我们通过 `pre-commit` + husky 处理了代码提交时的规范化问题，当我们进行代码提交时，会检测所有的代码格式规范。

但是这样就有两个问题：

1. 我们只修改了个别文件，没有必要检测所有的文件代码格式
2. 它只能给我们提示出对应的错误，竟然还需要我们手动进行修复？不合理

我们使用 `lint-staged` 插件，来帮助我们解决这两个问题。


lint-staged 可以 `只检测本次更新的代码，并在错误出现的时候，自动修复并且推送`

**安装**

使用 `vue-cli` 生成项目时，lint-staged 不需要安装了，项目已经有了。如果没有的话，就需要单独安装

1. 修改 `package.json`：

```json
"lint-staged": {
  "src/**/*.{js,jsx,vue}": {
    "eslint --fix",
    "git add"
  }
}
```

2. 修改 .husky/pre-commit 文件

```js
// pre-commit

#!/bin/sh
. "${dirname "${0}"}/_/husky.sh"

// npx eslint --ext .js,.vue, src // 删除

npx lint-staged // 新增
```

3. 尝试将代码修改为不符合规范的，通过 `git cz` 再次提交试试！

- lint-staged 会尝试自动修复错误

- 错误修复完成，继续执行，并将代码提交
