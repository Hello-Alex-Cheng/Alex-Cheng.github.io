---
title: 在Linux上部署 Node 接口
date: 2022-12-16 14:00:00
tags: Nodejs
banner_img: /img/nodejs.png
index_img: /img/nodejs.png
excerpt: Never too old to learn.
---

# 连接远程服务器

打开 mac 终端:

```js
ssh root@124.221.230.105 (公网IP)

// 接着输入密码，即可登录远程服务器
```

登录进去，输入 pwd，会输出 `/root`，这时我们切到 '/' 目录下: `cd ..`

# 在远程安装 nodejs

```js
wget https://cdn.npmmirror.com/binaries/node/v14.19.1/node-v14.19.1-linux-x64.tar.xz
```

# 解压压缩包

使用 tar 命令

- -c 压缩
- -x 解压
- -t 查看内容
- -r 想压缩归档文件末尾追加文件
- -v 显示所有过程
- -f 使用档案名字，切记，这是最后一个参数，最后只能接档案名

```js
tar -xvf node-v14.19.1-linux-x64.tar.xz
```

# 配置环境变量

找到根目录 '/' 下的 etc文件夹，进去里面，打开 profile 文件，打开，执行命令：

```js
// '/'

cd etc

vim profile
```

在最后一行加上如下这句：
```js
export PATH=$PATH:/node-v14.19.1-linux-x64/bin
```

最后，使文件生效

```js
// /etc
source profile
```

查看 node 版本
```
node -v

npm -v
```

# 安装 pm2

```
npm install -g pm2
```

# 部署 node 接口

在根目录下 `/`，创建 `node-server` 文件夹

可以通过 express 建立一个 node 服务

```js
const express = require("express");

const app = express()

app.get('/list', (req, res) => {
  console.log('current IP', req.ip)
  res.json({
    code: 200,
    msg: 'linux node server'
  })
})

app.listen(9999, () => {
  console.log('node server at port 9999...')
})
```

# 通过 pm2 启动node服务

```js
// node-server
pm2 start index.js --watch
```

通过 `pm2 monit` 查看 node 服务的打印日志

# 注意

访问接口，如果打不开，大概率是因为没有放开防火墙。

> http://124.221.230.105:9999/list

1. 找到服务器地址，放开 node 服务对应的端口号

![](/img/firewall.png)

此时依然无法打开对应的接口

2. 登录服务器，查看防火墙所有的端口

> firewall-cmd --zone=public --list-ports

3. 添加新的端口

> firewall-cmd --zone=public --add-port=9999/tcp --permanent

--permanent 表示永久有效

4. 重启防火墙

> firewall-cmd --reload

至此，就可以访问服务器上 node 服务的接口了。

![](/img/node-res.png)



