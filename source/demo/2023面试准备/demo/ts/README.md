# tsc

tsc -v 查看版本

tsc index.ts 将 ts 文件转化为 js 文件

tsc -w 监视文件

# 初始化配置文件

tsc --init

# vscode

> 终端：运行任务

前提是生成了 tsconfig.json

可以选择tsc 监视，也可以选择 tsc 构建

选择监视之后，每次改动文件，都能够实时的更新 `.js` 文件

# 调试

通过 nodemon 启动 index.js 文件

每次修改了 .ts 文件，会生成新的 .js 文件，nodemon监视到了文件的改动，自动执行 .js 文件。
