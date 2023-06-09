---
layout: HTTP
title: 温故知新HTTP
date: 2023-05-28 16:37:15
tags: HTTP
banner_img: /img/tcp-connect.jpg
index_img: /img/tcp-connect.jpg
excerpt: HTTP
---

# URI & URL
URI（Uniform Resource Identifier）和URL（Uniform Resource Locator）是互联网上标识和定位资源的两个概念，它们在某些方面有区别，但通常人们使用它们来表示相同的内容。

URI是一个更通用的概念，用于标识任何资源的唯一标识符。它可以用来标识不仅仅是网络资源，还包括本地文件、数据库条目等。URI由两部分组成：标识符和定位器。

URL是URI的一种常见形式，它提供了定位和访问网络资源的方式。URL描述了一个资源在网络上的具体位置和访问方式。它包含了协议（如HTTP、HTTPS、FTP等）、主机名、路径、查询参数等信息，用于定位和访问特定的网络资源。

下面是一个示例：

URI: `urn:isbn:9780345534491`
这是一个URI，用于标识一本书的ISBN号。它以"urn"作为标识符，后面是具体的标识信息。

URL: `https://www.example.com/images/pic.jpg`
这是一个URL，用于访问位于`www.example.com`服务器上的`pic.jpg`图片文件。它包含了协议（https）、主机名（www.example.com）和路径（/images/pic.jpg）等信息，用于定位和访问资源。

总结来说，URI是一种通用的资源标识符，而URL是一种具体的网络资源定位器。URL是URI的一种特殊形式，用于定位和访问网络资源。

# HTTP0.9 / HTTP 1.1 / HTTP2 这三者有什么区别？共同点又是什么？

HTTP 0.9、HTTP 1.1和HTTP/2（也称为HTTP2）是HTTP协议的不同版本，它们在功能和性能方面有一些区别，同时也有一些共同点。

HTTP 0.9是最早的HTTP版本，于1991年发布。它是一种非常简单的协议，`只支持GET方法，没有请求头和响应头，也不支持持久连接等高级功能`。它主要用于通过URL获取HTML文档。

HTTP 1.1是1997年发布的HTTP协议的主要版本，它引入了许多新特性和改进。HTTP 1.1支持多种请求方法（GET、POST、PUT、DELETE等），引入了请求头和响应头，支持`持久连接`、`管线化`、缓存控制、虚拟主机等功能。HTTP 1.1通过复用连接、请求头压缩等优化，提高了性能和效率。

HTTP/2是HTTP协议的最新版本，于2015年发布。它是在HTTP 1.1的基础上进行的重大改进。HTTP/2`所有数据采用二进制协议`而非文本协议，通过`二进制帧`进行数据传输，`引入了多路复用（Multiplexing）机制，允许在单个连接上**同时**发送多个请求和响应，减少了连接建立和关闭的开销`。此外，HTTP/2还支持头部压缩、服务器推送、优先级等功能，进一步提高了性能和效率。

区别：
1. 功能支持：HTTP 0.9仅支持GET方法，而HTTP 1.1和HTTP/2支持更多的请求方法和功能。
2. 协议形式：HTTP 0.9、HTTP 1.1是纯文本协议，HTTP/2采用了二进制协议。
3. 连接复用：HTTP 0.9每次请求都需要建立新的连接，HTTP 1.1引入了持久连接，允许复用连接，而HTTP/2通过多路复用在单个连接上同时处理多个请求和响应。
4. 性能优化：HTTP 1.1通过管线化和请求头压缩等方式提高性能，而HTTP/2在此基础上引入了更高级的优化机制，如二进制分帧、头部压缩等。

共同点：
1. 均为应用层协议，用于在客户端和服务器之间传输数据。
2. 均基于请求-响应模型，客户端发送请求，服务器返回响应。
3. 均使用URL作为资源定位标识符。
4. 均使用HTTP状态码来表示请求和响应的结果。

总体而言，HTTP 1.1和HTTP/2是HTTP协议的重要演化版本，提供了更多的功能和性能优化，以适应互联网发展的需求。

# 三次握手

三次握手是建立 TCP 连接时使用的一种协议，用于确保双方的通信能够正常进行。下面是三次握手的详细步骤：

刚开始时，客户端的状态是`关闭的（CLOSED）`，服务器状态处于`监听中（LISTEN）`

1. 第一次握手（SYN）：
   - 客户端（浏览器）向服务器发送一个 `SYN（同步）标志`的 TCP 数据包，该数据包的序列号表示客户端要发送数据的`初始序列号（Seq=x）`。
   - 客户端进入 `SYN_SENT` 状态，等待服务器的响应。

2. 第二次握手（SYN-ACK）：
   - 服务器收到客户端发送的 SYN 数据包后，会确认收到，并发送一个带有 SYN 和 ACK（确认序列号）标志的 TCP 数据包作为回应。（ACK）
   - 该数据包中包含服务器自己分配的`初始序列号（Seq=y）`和`确认号（ACK= x + 1）`，确认号为`客户端的初始序列号(Seq=x)`加1。
   - 服务器进入 `SYN_RCIVED` 状态。

3. 第三次握手（ACK）：
   - 客户端收到服务器发送的 `SYN / ACK` 数据包后，会确认收到，并发送一个带有 `ACK= y + 1` 标志的 TCP 数据包给服务器。
   - 该数据包中的确认号为`服务器的初始序列号(Seq=y)`加1。
   - 服务器收到客户端发送的 ACK 数据包后，确认号也加1。
   - 客户端和服务器都进入 `ESTABLISHED` 状态，TCP 连接建立成功。

<img src='/img/tcp-connect.jpg' />

通过三次握手，客户端和服务器都能够确认彼此的收发能力正常，可以开始进行数据的传输。在握手过程中，初始序列号（ISN）是为了保证每个连接都有唯一的序列号起始值，以增强连接的安全性。

需要注意的是，三次握手只是建立 TCP 连接的过程，并不代表数据的传输。数据的传输是在连接建立完成后进行的，双方可以通过已建立的连接进行数据的发送和接收。

在关闭 TCP 连接时，也需要进行类似的四次挥手（四次握手）过程，以保证双方都完成了数据传输并愿意关闭连接。

# 半连接队列

服务器第一次收到客户端的 SYN 之后，就会处于 SYN_RCVD 状态，此时双方还 `没有完全建立其连接`，服务器会把此种状态下请求连接放在一个队列里，我们把这种队列称之为`半连接队列`。

还有一个全连接队列，就是已经完成三次握手，建立起连接的就会放在全连接队列中。如果队列满了就有可能会出现丢包现象。

# 四次挥手

<img src="/img/四次挥手.jpg" />

首先要明白，客户端和服务端都可以发起关闭连接的请求。

这里以客户端发起关闭请求为例。

刚开始，客户端和服务器都处于 `established` 的状态，客户端主动发起 `关闭连接` 的请求。

- 第一次挥手

客户端发送一个 FIN (finish) 报文，报文中会指定一个序列号。此时客户端处于 `FIN_WAIT1 状态`。

- 第二次挥手

服务端收到 FIN 之后，会发送 ACK 报文，且把客户端的序列号值 +1 作为 ACK 报文的序列号值，表明已经收到客户端的报文了，此时服务端处于 `CLOSE_WAIT 状态`。

客户端收到服务端的确认后，进入`FIN_WAIT2（终止等待2）状态`，`等待服务端发出的连接释放报文段`。


此时，服务端还可以发送未发送完的数据，客户端也可以接收数据。

- 第三次挥手

如果服务端也想断开连接了，和客户端的第一次挥手一样，发给 FIN 报文，且指定一个序列号。此时服务端进入最后确认状态（`LAST_ACK 的状态`）

- 第四次挥手

客户端收到 FIN 之后，一样发送一个 ACK 报文作为应答，且把服务端的序列号值 +1 作为自己 ACK 报文的序列号值，此时客户端处于`超时等待 TIME_WAIT 状态`，经过超时时间后关闭连接。`服务端收到 ACK 报文之后 立即 关闭连接了，处于 CLOSED 状态。`

## 为什么客户端需要进入超时等待状态

确保服务端能收到自己的 ACK 报文。 

假设客户端发送完 ack 包，就立刻关闭了连接，一旦 ack 包在网络传输中丢失，服务器将一直处于 `最后确认状态（LAST_ACK）`。服务端因为没有收到 ACK 包会重发 FIN 包，此时客户端关闭了链接，那么就无法关闭连接。

服务端因为没有收到 ACK 包会重发 FIN 包，客户端收到 FIN 包后，就会重发 ACK 包并`刷新超时时间`。

最后，客户端再也没有收到服务器发送过来的 FIN，等待一段时间后，客户端也进入了关闭状态(Closed)。


> [!!!](https://zhuanlan.zhihu.com/p/86426969)

# 请求报文

HTTP请求报文由请求行（Request Line）、请求头部（Headers）和请求主体（Body）三部分组成。以下是一个示例HTTP请求报文的结构：

```js
GET /path/to/resource HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Referer: https://www.example.com/referer-page
Connection: keep-alive

请求主体（如果存在）//比如：Hello，World!!
```

解释每个部分的含义：

1. 请求行（Request Line）：包含了HTTP方法、请求的路径和协议版本。
   - HTTP方法（例如GET、POST、PUT等）指定了客户端对资源的操作类型。
   - 请求的路径指定了服务器上要访问的资源的路径。
   - 协议版本（例如HTTP/1.1）指定了客户端所使用的HTTP协议版本。

2. 请求头部（Headers）：包含了与请求相关的各种元数据信息，以键值对的形式表示。每个键值对占据一行。
   - Host：指定了服务器的主机名或IP地址。
   - User-Agent：发送请求的客户端的用户代理标识。
   - Accept：指定了客户端能够接受的响应内容类型。
   - Referer：指定了请求的来源页面的URL。
   - Connection：指定了客户端与服务器之间的连接是否保持持久连接。

3. 请求主体（Body）：可选部分，用于发送附加的请求数据，例如表单数据、JSON数据等。在GET请求中通常为空，而在POST请求中会包含要发送的数据。

# 响应报文

HTTP响应报文由状态行（Status Line）、响应头部（Headers）和响应主体（Body）三部分组成。以下是一个示例HTTP响应报文的结构：

```js
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1234
Server: Apache/2.4.29 (Unix)

响应主体（如果存在）(注意：响应主体不仅仅是换行，而是真正空了一样，才开始显示主体部分)
```

解释每个部分的含义：

1. 状态行（Status Line）：包含了协议版本、状态码和状态消息。
   - 协议版本（例如HTTP/1.1）指定了服务器使用的HTTP协议版本。
   - 状态码是一个三位数，用于表示服务器对请求的处理结果。例如，状态码200表示成功，404表示资源未找到。
   - 状态消息是对状态码的简要描述，提供了更详细的说明。

2. 响应头部（Headers）：包含了与响应相关的各种元数据信息，以键值对的形式表示。每个键值对占据一行。
   - Content-Type：指定了响应主体的媒体类型和字符集。
   - Content-Length：指定了响应主体的长度（以字节为单位）。
   - Server：指定了响应的服务器软件名称和版本。

3. 响应主体（Body）：可选部分，包含了服务器返回的实际响应内容。例如，对于HTML页面，响应主体可能包含HTML标记和文本内容。


# 跨域

> 什么是跨域？
>
> CORS 全称是 Cross-Origin Resource Sharing，意为跨域资源共享。当一个资源去访问另一个不同域名或者不同端口的资源时，就会发出跨域请求。如果另一个资源不允许其进行跨域资源访问，就会造成跨域。 

**跨域不是问题，是浏览器的安全机制**

`跨域不会阻止请求的发出，也不会阻止请求的接收`，跨域是浏览器为了保护当前页面，你的请求得到了响应，但是浏览器不会将请求到的数据提交给当前页面上的回调，取而代之的是去提示你这是一个跨域数据。

**同源策略**导致。

所谓同源策略，就是`协议、域名、端口号`都要相同，有一个不相同，那么就是非同源，就会出现跨域。

```js
// 跨域(端口不同)

http://localhost:8080
http://localhost:3000


// 跨域(协议不同)
https://localhost:8080
http://localhost:8080

// 跨域(域名)
https://localhost:8080
https://192.168.1.2:8080


// 跨域(协议不同，端口也不同)
// http 默认端口是 80，https 默认端口是 443
http://localhost/bbb
https://localhost/aaa
```

## 解决跨域

1. 纯后端方式

假设我们有个后端服务 3000，提供了 `/user` 接口，我们可以直接在 `.html` 文件中访问，如果后端不设置跨域，那么肯定会出现跨域提示的。

```js
// server
const express = require('express')
const app = express()

app.get('/user', (req, res) => {
  res.json({
    code: 0,
    msg: '请求user成功'
  })
})

app.listen('3000', () => {
  console.log('server running at port 3000...')
})


// client
<script>
  const xhr = new XMLHttpRequest()
  xhr.open('get', 'http://localhost:3000/user')
  xhr.onload = function() {
    consolelog(xhr.response)
  }
  xhr.send()


  // fetch
  fetch('http://localhost:3000/user')
    .then(res => res.text())
    .then(res => {
      console.log(res)
    })
</script>
```

**后端设置跨域访问**

```js
// CORS
app.all('*', function(req, res, next) {
  // 允许所有请求源
  res.header("Access-Control-Allow-Origin", "*") // 域名地址
  res.header("Access-Control-Allow-Headers", "*") // 允许自定义 headers
  res.header("Access-Control-Allow-Methods", "*") // 默认允许的方法：GET,HEAD,POST

  next()
})
```

2. 前端处理
主要是通过 `webpack devServer` 的 `proxy` 来处理。

```js
...
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000/' // http://localhost:8080/api/user => http://localhost:3000/api/user
    }
  },
  proxy: {
    '/no-api': {
      target: 'http://localhost:3000/', // http://localhost:8080/no-api/user => http://localhost:3000/user
      pathRewrite: {
        '/no-api': '', // 后端接口中一般不会含有 api 标识符，我们可以去掉
      }
    }
  },
}
...
```

3. Nginx

要注意的是，devServer 配置 proxy 只是存在于我们开发项目时有用，如果项目要上线，devServer 就没有了，这时可以考虑采用 `Nginx` 来代理。

4. 前后端合并方式

我们可以不采用 `devServer proxy` 方式，而是在后端配置 `webpack-dev-middleware`，将前后端进行合并。

```js
const express = require('express')
const webpack = require('webpack')
const middle = require('webpack-dev-middleware')
const compile = require('./webpack.config.js')


const app = express()

app.use(middle(compile))


app.get('/user', (req, res) => {
  res.json({
    code: 0,
    msg: '请求user成功'
  })
})

app.listen('3000', () => {
  console.log('server running at port 3000...')
})
```

5. jsonp

比较老、兼容性好的方式。

利用标签没有跨域限制的漏洞，在 script 标签上我们可以引用其他服务上的脚本。

最常见的场景就是 CDN.

```js
<script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
```

使用方式：

```js
function callback(res) {
  console.log(JSON.stringify(res, null, 2))
}

// 动态创建 script 标签，设置好 scr 属性，主要参数是 cb=callback

const script = document.createElement('script')
script.src = 'http://127.0.0.1:3000/info/jsonp?cb=callback'

document.getElementByTagsName('head')[0].appendChild(script)
```

# 预请求(OPTIONS)

OPTIONS 请求和 GET 请求的区别在于它们的目的和作用不同。

- OPTIONS 请求用于探测服务器的支持能力和实施安全机制，以便在进行实际请求之前进行 `预检`

- 其它请求方法，比如 GET 请求则是用于获取实际的资源数据。

需要注意的是，出现两个相同URL但请求方法不同的请求可能是因为浏览器进行了请求优化或其他原因。例如，某些浏览器可能会在发送实际的 GET 请求之前，`先发送一个 OPTIONS 请求以验证是否允许跨域请求`。这是浏览器的行为，并非所有请求都会出现这种情况，具体取决于浏览器的实现和配置。

如果我们不想要 `预检`，那么在服务端设置 `Access-Control-Max-Age`，表示在 `1000秒` 内，都不需要`预请求验证`。


```js
res.writeHead(200, {
  'Access-Control-Max-Age': '1000', // 秒
})
```

服务端设置好之后，客户端发起的第一次请求，还是会有预检（OPTIONS）和实际请求，再次刷新页面就只会发起实际的请求了。

# 强缓存 & 协商缓存

HTTP 缓存机制中的强缓存和协商缓存是两种不同的策略，用于控制缓存的行为，以提高网页的加载性能和减少网络资源的使用。

1. 强缓存（Strong Cache）：
   强缓存是通过在响应头中设置特定的缓存标识来实现的。当客户端发起请求时，会先检查缓存标识，如果缓存标识命中并且缓存尚未过期，则客户端可以直接从缓存中获取响应，而不必发送请求到服务器。常见的缓存标识有两个：
   - Expires：通过设置一个具体的过期时间来表示缓存的有效期。
   - Cache-Control：通过设置 max-age 或 s-maxage 来表示缓存的最大有效时间。

2. 协商缓存（Conditional Cache）：
   协商缓存是在客户端发送请求时，服务器根据请求头中的条件信息来判断是否需要返回新的响应数据。如果缓存仍然有效，则服务器返回一个特殊的响应码，通知客户端直接使用缓存中的数据，而不必返回完整的响应。常见的条件信息有两个：
   - Last-Modified 和 If-Modified-Since：服务器在响应头中返回资源的最后修改时间，客户端在后续请求中通过 If-Modified-Since 头将最后修改时间发送给服务器，如果最后修改时间相同，则说明缓存仍然有效。
   - ETag 和 If-None-Match：服务器在响应头中返回资源的唯一标识符（通常是哈希值），客户端在后续请求中通过 If-None-Match 头将标识符发送给服务器，如果标识符相同，则说明缓存仍然有效。

如果强缓存和协商缓存同时存在，浏览器会先检查强缓存是否过期，如果强缓存有效，则直接使用缓存数据；如果强缓存失效，则发送带有协商缓存条件的请求到服务器，由服务器根据条件判断是否返回新的数据或通知客户端使用缓存。这样可以有效减少对服务器的请求，加快页面加载速度。

# Cache-Control

HTTP头部字段`Cache-Control`用于控制缓存的行为，它可以指示浏览器或代理服务器是否缓存响应以及如何缓存。

`Cache-Control`头部字段有多个可选的指令，可以单独使用或组合使用。下面是一些常见的指令及其作用：

- `no-cache`：指示浏览器和代理服务器`不应直接使用`缓存的响应，而应发送请求到`服务器进行验证`。服务器可以通过校验请求头（Etag/Last-Modified）来确定是否需要返回新的响应或使用缓存的响应。

- `no-store`：指示浏览器和代理服务器`不应存储任何关于请求和响应的内容`。每次都必须从原始服务器获取完整的响应。

- `public`：指示响应可以被任何节点缓存（包括客户端和代理服务器）缓存。

- `private`：指示响应只能被客户端缓存，不允许代理服务器缓存。

- `max-age=<seconds>`：指示响应在指定的秒数内可以被缓存。例如，`Cache-Control: max-age=3600`表示响应可以在一个小时内被缓存。

- `s-maxage=<seconds>`：类似于`max-age`，但仅适用于共享缓存（例如代理服务器）。它覆盖`max-age`指令。

这些指令可以通过逗号分隔的方式组合使用，以满足特定的缓存需求。

通过使用`Cache-Control`头部字段，服务器可以控制缓存的行为，包括缓存有效期、是否需要验证等。而浏览器和代理服务器会根据这些指令来决定是否缓存响应以及如何使用缓存。这有助于提高性能和减少网络流量，同时保证及时获取最新的资源。

比如:

`res.setHeader('Cache-Control', 'max-age=3600, public');` 表示所有节点都能缓存（客户端、代理服务器等）3600秒之后，就重新从服务器拉取资源，接着缓存起来，客户端又可以使用缓存资源了。以此循环...

看如下例子：

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
  <h1>Hello Http!你好啊</h1>

  <script>
    // 请求另一个服务器资源
    fetch('http://localhost:9999/', {
      method: 'get'
    })
    .then(res => console.log('??? ', res))
  </script>

  <!-- 加载 js 脚本 -->
  <script src="/script.js"></script>
</body>
</html>
```

```js
// server.js
const http = require('http');
const fs = require('fs')

const html = fs.readFileSync('./index.html', 'utf8')

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // 设置响应头部字段
    res.setHeader('Cache-Control', 'max-age=10, public');
    
    // 其他响应设置，响应头字段也可以在这设置
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(html);
  }

  if (req.url === '/script.js') {
    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Cache-Control': 'max-age=10, private' // 只能客户端缓存，并且 10 秒后缓存失效
    })

    res.end('console.log("Javascript loaded!!!")') // 控制台打印 ..
  }
});

// 监听端口
const port = 8888;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
```

加了 cache-control 之后，第一次访问到了资源，再次访问时，就会读取浏览器缓存的资源了，看请求时间是非常短的。

<img src="/img/cache-control.jpg" />


# Disk cache 和 Memory cache

`Disk cache`和`Memory cache`是浏览器中常见的两种缓存机制，它们在缓存资源时有一些区别。

1. **Disk Cache（磁盘缓存）**：Disk cache是指将请求的资源存储在硬盘上的缓存机制。当浏览器收到服务器的响应后，会将响应的资源保存在硬盘的特定位置。当下次请求相同的资源时，浏览器会首先检查硬盘上的缓存，如果缓存存在且有效，则直接从硬盘中读取资源，避免了再次发送网络请求。`Disk cache`相对于Memory cache来说，`存储容量较大，可以缓存更多的资源，但访问速度相对较慢。`

2. **Memory Cache（内存缓存）**：Memory cache是指将请求的资源存储在内存中的缓存机制。当浏览器收到服务器的响应后，会将响应的资源保存在内存中。内存缓存的访问速度非常快，因为内存的读取速度比硬盘快得多。当下次请求相同的资源时，浏览器会首先检查内存中的缓存，如果缓存存在且有效，则直接从内存中读取资源，无需进行网络请求。`Memory cache`相对于Disk cache来说，`存储容量较小，只能缓存较少的资源，但访问速度非常快。`

通常情况下，浏览器在接收到资源后会首先将资源存储在内存缓存中，这样可以提供更快的访问速度。如果内存缓存已满或资源需要长期保存，浏览器会将资源存储在磁盘缓存中，以便长期使用。当浏览器再次请求相同的资源时，会根据缓存策略首先检查内存缓存，然后再检查磁盘缓存，以提供更快的访问速度和节省网络带宽。

# 什么时候浏览器会使用 disk cache，什么情况下使用 memory cache 呢？

浏览器在缓存资源时，会根据一些因素来决定是使用`Disk cache`还是`Memory cache`。

1. **Memory Cache（内存缓存）的使用场景**：
   - 静态资源：通常情况下，浏览器会优先将静态资源（如CSS、JavaScript、图片等）存储在内存缓存中，以提供更快的访问速度。这是因为内存的读取速度比硬盘快得多，可以快速响应资源请求。
   - 常用资源：经常被访问的资源会被存储在内存缓存中，以减少对网络的依赖，提高用户体验。
   - 短期缓存：一些具有短期有效性的资源，比如通过Ajax动态获取的数据，通常会被存储在内存缓存中，以便快速获取最新的数据。

2. **Disk Cache（磁盘缓存）的使用场景**：
   - 大型资源：较大的资源文件（如视频、音频等）通常会被存储在磁盘缓存中。由于内存容量有限，内存缓存不适合存储大型资源，因此浏览器会将这些资源保存在磁盘上，以便长期使用。
   - 持久缓存：一些具有长期有效性的资源，如页面的静态资源文件（如CSS、JavaScript、图片等），通常会被存储在磁盘缓存中。这样可以避免每次都重新下载资源，减少网络请求和加快页面加载速度。

浏览器也可以根据用户的配置和缓存策略来决定是否使用缓存以及缓存的存储位置（内存缓存或磁盘缓存）。

# 缓存是否失效，如何验证？

缓存是否已经失效是由浏览器根据一些规则和策略进行判断的。以下是一些常见的判断依据：

1. **缓存标识符**：浏览器通过检查请求中的缓存标识符来判断缓存是否有效。常见的缓存标识符有`ETag`和`Last-Modified`。当服务器返回响应时，会包含一个或多个缓存标识符，浏览器会将这些标识符存储起来。下次请求相同资源时，浏览器会将缓存标识符带上，服务器根据这些标识符判断资源是否发生了变化。如果资源没有变化，服务器可以返回一个`304 Not Modified`的响应，告知浏览器使用缓存副本。

2. **缓存控制指令**：响应头部中的缓存控制指令，如`Cache-Control`和`Expires`，提供了关于缓存的策略和过期时间。浏览器会根据这些指令来判断缓存是否过期。如果缓存的过期时间尚未到达，且缓存控制指令允许使用缓存，浏览器将使用缓存的副本。

3. **重新验证机制**：浏览器可以通过发送一个条件请求来验证缓存是否仍然有效。这种验证通常使用`If-None-Match`和`If-Modified-Since`等条件头部字段。服务器可以根据这些条件字段判断资源是否发生了变化，如果没有变化，可以返回一个`304 Not Modified`的响应，浏览器继续使用缓存副本。

请注意，浏览器对缓存的处理是基于一系列规范和策略的，具体的判断依据可能会因浏览器的实现和配置而有所不同。如果您想要详细了解特定浏览器的缓存机制和行为，可以参考相关浏览器的文档和规范。

# ETag & Last-Modified 验证头

虽然我们设置了 cache-control 的 max-age 值，但是我想要每次发送请求都想要去服务器验证，应该怎么做？

那就再设置 `no-cache`。

```js
res.writeHead(200, {
  'Content-Type': 'text/javascript',
  'Cache-Control': 'max-age=360000, no-cache',
})
```

为了验证是否继续使用缓存，我们在响应头中加上 Etag 和 Last-Modified 这两个属性

```js
res.writeHead(200, {
  'Content-Type': 'text/javascript',
  'Cache-Control': 'max-age=10, no-cache',
  'ETag': '123456789', // 下一次请求时，客户端会在请求头加上 If-None-Match: 123456789
  'Last-Modified': '2023-05-27 21:30' // 下一次请求时，客户端会在请求头加上 If-Modified-Since: 2023-05-27 21:30
})
```

<img src='/img/Etag:Last-modified.jpg' />

还是以上面的例子做示范，虽然加了 Etag 和 Last-Modified 这两个属性，还没完，还需要在 `服务端做校验判断`：

```js
// server.js
if (req.url === '/script.js') {
  if (req.headers['if-none-match'] === '123456789' && req.headers['if-modified-since'] === '2023-05-27 21:30') {
    res.writeHead(304)

    // 这段代码不会生效了，因为浏览器会从缓存获取资源，控制台还是会打印 Javascript loaded!!!
    res.end('console.log("服务器验证完毕，同意客户端获取缓存资源!!")')
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/javascript',
      'Cache-Control': 'max-age=10, no-cache',
      'ETag': '123456789',
      'Last-Modified': '2023-05-27 21:30'
    })
    res.end('console.log("Javascript loaded!!!")')
  }

}
```

效果如下，第一次发起 请求时，会从服务器获取资源，接下来如果再发起请求，因为设置了 no-cache 和 ETag 和 Last-Modified，所以会在服务器进行资源是否失效的校验。

如果资源未失效，则服务器返回状态码 304，表示资源未被修改，可以使用缓存资源。

<img src='/img/304.jpg' />

**注意：如果再 Chrome 浏览器重，勾选了 `Disable cache`，表示不使用缓存，那么 HTTP 请求头是不会携带 if-none-match 或 if-modified-since 这些具有缓存意义的信息了**

# Cookie

Cookie是一种在Web浏览器和Web服务器之间传递的小型文本文件，用于存储和传递用户的相关信息。它由`服务器`在HTTP`响应`的`Set-Cookie`首部字段中发送给浏览器，并由浏览器在后续的请求中通过Cookie首部字段将该信息发送回服务器。

Cookie主要用于实现会话管理和用户跟踪，以提供个性化的Web体验。

Cookie的工作流程如下：

1. 当浏览器向服务器发送请求时，服务器可以在HTTP响应中通过Set-Cookie首部字段将一个或多个Cookie发送给浏览器。

2. 浏览器收到Cookie后，将其存储在本地的Cookie存储中。

3. 当浏览器向同一服务器发送后续请求时，会在HTTP请求的Cookie首部字段中携带相应的Cookie数据。

4. 服务器收到请求后，可以解析Cookie数据并根据其中的信息来执行相应的操作，如识别用户、保持会话状态等。

当服务器通过HTTP响应的Set-Cookie首部字段发送Cookie时，可以设置多个Cookie项，每个项使用键值对的形式表示。下面是一个示例：

```
HTTP/1.1 200 OK
Set-Cookie: username=johndoe; Expires=Wed, 21 Oct 2023 07:28:00 GMT; Path=/; Secure; HttpOnly
Set-Cookie: language=en-US; Path=/
Set-Cookie: theme=dark; Expires=Wed, 21 Oct 2023 07:28:00 GMT; Path=/
```

在上面的示例中，服务器发送了三个Cookie项：

1. `username=johndoe`：设置了一个名为`username`的Cookie，其值为`johndoe`。

2. `language=en-US`：设置了一个名为`language`的Cookie，其值为`en-US`。

3. `theme=dark`：设置了一个名为`theme`的Cookie，其值为`dark`。

每个Cookie项可以附带一些可选的属性，如`Expires`、`Path`、`Secure`和`HttpOnly`等。

- `Expires`属性指定了Cookie的过期时间，浏览器将在过期时间之后删除该Cookie。在上面的示例中，`username`和`theme`的Cookie都设置了过期时间为`Wed, 21 Oct 2023 07:28:00 GMT`。

- `Max-Age` 属性指定了Cookie的最大存活时间，以秒为单位。它表示从当前时间开始，Cookie将在多少秒后过期。

- `Path`属性指定了Cookie的有效路径，即只有在指定路径下的请求才会携带该Cookie。在上面的示例中，`username`和`language`的Cookie的路径分别为根路径`/`和默认路径`/`。

- `Secure`属性指示浏览器仅在通过安全连接（如HTTPS）发送请求时才会携带该Cookie。

- `HttpOnly`属性指定了该Cookie是否只能通过HTTP协议访问，而`不能通过JavaScript代码访问(document.cookie)`。这可以提高安全性，防止跨站脚本攻击（XSS）。

注意，浏览器在后续的请求中会自动在Cookie首部字段中携带相应的Cookie数据，无需手动添加。服务器可以通过解析Cookie首部字段来获取客户端发送的Cookie信息。

```js
res.writeHead(200, {
  'Content-Type': 'text/javascript',
  'Set-Cookie': 'age=18'
})
```

查看 network:

```js
// 第一次响应头

Set-Cookie: age=18

// 第二次请求头
Cookie: age=18
```

`设置多个 Cookie'Set-Cookie': ['age=18', 'name=alex.cheng']`

查看 network:

```js
// 第一次响应头

Set-Cookie: age=18
Set-Cookie: name=alex.cheng

// 第二次请求头
Cookie: name=alex.cheng; age=18
```

我们可以在控制台的 `Applicatioin` 中查看 cookie，服务端通过 `req.headers.cookie` 获取请求头中的 cookie。

## cookie 过期时间

Expires 和 max-age 都可以设置过期时间，只是 max-age 设置起来更简单方便。 

如果没有设置过期时间，表示 cookie 存在于 `回话` 中(`在 application 中显示 session`)，表示关闭当前窗口，再发送请求，是不会带上 cookie 的。

以下 cookie中，age 会在 5s 后过期，也就是说过了 5s 再发请求，请求头中不会携带 age 信息了。

```js
res.writeHead(200, {
  'Content-Type': 'text/javascript',
  'Set-Cookie': ['age=18; max-age=5', 'name=alex.cheng']
})
res.end('console.log("Javascript loaded!!!")')
```

# Session

Session（会话）是指在客户端与服务器之间建立的一种状态管理机制。

它用于跟踪和存储特定用户在一段时间内的相关信息。在Web应用程序中，会话通常用于在用户访问不同页面或发送请求时保持用户的身份验证状态和其他会话数据。

`也就是说，我们只要能在服务器定位到特定的用户，然后拿到对应的 cookie 信息，那就是 session 的实现方案。`

Session的优点包括：

- 可以存储和管理用户的状态和相关数据。
- 提供了身份验证和用户跟踪的机制。
- 可以用于共享数据和上下文信息，使得多个请求之间可以共享数据。

需要注意的是，Session机制依赖于会话ID的传递和存储。常见的方式是使用Cookie来存储会话ID，但也可以通过其他方式（例如URL参数或隐藏表单字段）传递会话ID。此外，为了确保会话的安全性，需要采取一些安全措施，例如使用加密算法对会话ID进行加密，限制会话ID的有效期限等。

```js
const express = require('express');
const session = require('express-session');

const app = express();

// 配置会话中间件
app.use(session({
  secret: 'my-secret-key', // 用于加密会话数据的密钥
  resave: false,
  saveUninitialized: true
}));

app.get('/login', (req, res) => {
  // 在会话中存储用户信息
  req.session.username = 'john_doe';
  req.session.isLoggedIn = true;
  res.send('Login successful!');
});

app.get('/dashboard', (req, res) => {
  // 检查会话中的用户信息
  if (req.session.isLoggedIn) {
    const username = req.session.username;
    const sessionId = req.sessionID; // 获取会话ID
    res.send(`Welcome to the dashboard, ${username}! Session ID: ${sessionId}`);
  } else {
    res.send('You need to login first!');
  }
});

app.get('/logout', (req, res) => {
  // 销毁会话
  req.session.destroy();
  res.send('Logout successful!');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

在上述示例中，每当用户登录时，会将用户信息存储在会话中。在访问/dashboard路由时，可以通过req.sessionID获取当前会话的唯一ID，并与用户信息一起返回给用户。这样，不同用户将具有不同的会话ID，从而区分不同的用户。

请注意，会话ID的生成和管理通常是由会话中间件自动处理的，无需手动操作。

# HTTP 长连接

HTTP长连接（HTTP connection `keep-alive`）是一种机制，用于在单个TCP连接上发送多个HTTP请求和响应(`有先后顺序`)，而不是为每个请求和响应都建立一个新的TCP连接。在传统的HTTP请求-响应模型中，每个请求都需要建立一个新的TCP连接，完成请求后立即关闭连接。而使用长连接，可以在同一个TCP连接上发送多个请求，并在一段时间内保持连接处于打开状态，以便在需要时发送更多的请求。

使用HTTP长连接可以带来以下好处：

1. 减少连接建立和断开的开销：TCP连接的建立和断开需要消耗一定的时间和资源。使用长连接可以减少这些开销，提高性能。

2. 减少网络拥塞：长连接可以减少网络中的连接数，减轻网络拥塞的程度。

3. 提高响应速度：由于不需要为每个请求建立新的连接，可以更快地发送请求并接收响应。

4. 节省带宽：在长连接上发送多个请求时，可以减少额外的TCP握手和首部信息的传输，节省带宽。

请注意，HTTP长连接并不是永久的连接，而是在一定的时间内保持打开状态。具体的`连接时间可以由服务器或客户端进行配置`。如果长时间没有活动，连接可能会被服务器或客户端关闭。

# Chrome 浏览器允许并发多少个 TCP 连接？

在现代的 Chrome 浏览器中，默认情况下，每个域名允许同时建立的持久 TCP 连接数是有限的，具体取决于浏览器版本和操作系统。在过去的版本中，该限制通常为 `6` 个 TCP 连接。然而，随着时间的推移和浏览器的更新，这个限制已经有所改变。

我们来做个简单的演示:

我们准备一张图片，还有个 html 文件，html 中请求了 7 张图片

```html
// index.html

<body>
  <h1>HTTP 长连接 connection keep-alive</h1>

  <img src="test.jpg1" alt="" />
  <img src="test.jpg2" alt="" />
  <img src="test.jpg3" alt="" />
  <img src="test.jpg4" alt="" />
  <img src="test.jpg5" alt="" />
  <img src="test.jpg6" alt="" />
  <img src="test.jpg7" alt="" />
</body>
```

再创建一个 http 服务，用来加载 `index.html` 文件，并处理`图片相关的请求`:

```js
const http = require('http')

const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    const html = fs.readFileSync('index.html')

    res.writeHead(200, {
      'Content-Type': 'text/html'
    })

    res.end(html)
  } else {
    // 读取图片，并返回给页面
    const img = fs.readFileSync('tcp-connect.jpg')

    res.writeHead(200, {
      'Content-Type': 'iamge/jpg'
    })

    res.end(img)
  }
})

server.listen(8888, () => {
  console.log('server running at port 8888...')
})
```

然后我们将网速调慢一点，刷新浏览器查看结果，我们会发现，network 中有 7 个关于图片的 http 请求，其中有一个属于 `pendding` 状态，当有 TCP 连接有空出来的了（`连接数量 < 6`），才会加载处于 pendding 状态的请求。

<img src="/img/tcp-connection.jpg" />

`Connection ID` 表示当前 TCP 连接的 ID，每个 ID 不一样，表示创建了 不一样的 TCP 连接。由于使用的是默认的 HTTP/1.1 协议，服务器会 `自动启用长连接`，可以在同一个连接上处理多个请求（`TCP连接复用`）。

当我们将网速调回来，再次刷新页面，你会发现有多个相同的 `Connection ID`，表示 tcp 连接被复用了。

如果想要关闭长连接，设置 `Connection: close` 即可：

```js
res.writeHead(200, {
  'Content-Type': 'iamge/jpg',
  'Connection': 'close'
})
```

## HTTP2 单个 TCP 连接

`HTTP/2` 不再使用多个 TCP 连接来并发传输数据，而是通过单个 TCP 连接进行多路复用。这意味着在 HTTP/2 中，可以 `在单个连接上同时进行多个请求和响应`。

HTTP/2 使用了二进制协议，将请求和响应分解为更小的帧（frames），并在一个连接上交错地发送这些帧。每个帧都有一个唯一的标识符，用于将其与相应的请求或响应关联起来。这种多路复用的机制允许同时发送多个帧，从而实现了并发传输。`提高了性能和效率，并减少了延迟。`

# 数据协商

HTTP 数据协商（HTTP Content Negotiation）是指客户端和服务器之间就请求或响应中的内容进行协商，以`确定最合适的内容格式、语言、编码等`。

在 HTTP 数据协商中，客户端发送请求时，可以通过请求头字段来提供一些关于期望的内容特性的信息，例如 Accept、Accept-Language、Accept-Encoding 等。服务器接收到请求后，可以根据这些请求头字段的值，选择最适合客户端的内容进行响应。

HTTP 数据协商可以分为两种类型：

- `服务器驱动的协商（Server-driven Negotiation）`：服务器根据客户端的请求头信息，从提供的可选项中选择最合适的响应内容。服务器可以根据请求头中的 Accept、Accept-Language、Accept-Encoding 等字段进行协商，并在响应中使用 Content-Type、Content-Language、Content-Encoding 等字段来指示所选内容的特性。

- `客户端驱动的协商（Client-driven Negotiation）`：客户端通过向服务器发送一系列可选项，如请求头中的 Accept、Accept-Language、Accept-Encoding 等字段，告知服务器自己的首选项。服务器根据这些首选项来选择合适的响应内容，并在响应中使用 Content-Type、Content-Language、Content-Encoding 等字段来指示所选内容的特性。

通过 HTTP 数据协商，客户端和服务器可以在请求和响应中进行内容的灵活协商，以提供最适合的内容给客户端，从而提升用户体验和网络效率。这使得客户端和服务器可以根据各自的特性和需求进行交互，并在可选项中选择最佳的内容格式、语言、编码等。

# 重定向

在 HTTP 中，可以通过设置响应状态码和响应头来实现重定向。

常见的重定向状态码包括：

- `301` Moved Permanently：永久重定向，表示请求的资源已被永久移动到新的位置。浏览器会自动将请求的地址更新为新的地址，`不会再发送原来的请求了（这是和 302 的区别）`。
- `302` Found / 307 Temporary Redirect：临时重定向，表示请求的资源临时移动到新的位置。浏览器会继续保持原始请求的方法和请求体，并重定向到新的地址。`这个资源只是暂时不能被访问了，但是之后过一段时间还是可以继续访问`
- `303` See Other：表示请求已被处理，应该跳转到另一个地址。GET 方法用于获取重定向后的资源。

具体的重定向步骤如下：

1. 服务器收到请求后，根据需要进行处理，并决定是否需要重定向。
2. 如果需要重定向，服务器设置响应状态码为适当的重定向状态码（如 301、302、307 或 303）。（关键）
3. 服务器`在响应头中设置 Location 字段，指定重定向的目标 URL。`（关键）
4. 客户端（通常是浏览器）收到响应后，会根据响应状态码进行相应处理。
   - 对于永久重定向（301），客户端会将请求的地址更新为新的地址，并将之后的请求发送到新的地址。
   - 对于临时重定向（302、307）和查看其他（303），客户端会根据响应头中的 Location 字段重新发送请求到新的地址。
   - 对于其他状态码，客户端会根据具体情况进行处理。

以下是一个示例，使用 Node.js 中的 `http` 模块实现重定向：

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // 重定向到新的资源 http://localhost:8000/new
  if (req.url === '/') {
    res.writeHead(302, { 'Location': '/new' });
    res.end();
  }

  if (req.url === '/new') {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end('<h1>New Page</h1>');
  }
});

server.listen(8000, () => {
  console.log('Server running at http://localhost:8000/');
});
```

上述示例中，当客户端访问服务器时，服务器会返回 302 状态码和 `Location` 头字段，将客户端重定向到 `http://localhost:8000/new` 地址。

## 301 和 302 在浏览器上表现出来的区别

最大的区别就是：是否保留原来的HTTP请求

我们在服务端打印 `req.url`，同时观察 network 中的 http 请求:

```js
// server.js
// 302
// console.log(req.url)

/
/new
/favicon.ico
```

302 保留了 `根路径` 的请求，没一次访问 `http://localhost:8888/`，服务端都会打印出 `/` 和 `/new`

```js
// server.js
// 301
// console.log(req.url)

/new
/favicon.ico
```

301 不会保留根路径的请求了，从 network 可以看出，`http://localhost:8888/` 请求是从 `disk cache` 获取的，表示永久性重定向，所以 `req.url = '/'`不会再走到服务端。

**注意**，如果我们设置了 `301` 永久重定向，后续再修改服务器的状态，此时浏览器这边是无法知道的，依然会使用 `301` 永久重定向，也就是说，如果用户不手动清理浏览器缓存，那么就无法拿到最新的服务器资源。`所以使用 `301` 状态码要非常谨慎！`

# HTTP Content Security Policy (CSP) 

> https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP

一种用于增强网页安全性的 HTTP 头部字段。

它允许网站管理员 `控制网页上能够执行的内容源和操作`，以减少恶意脚本注入、跨站点脚本攻击（XSS）等安全威胁。

Content Security Policy 通过定义一系列的策略规则，`限制网页中可加载的资源和可执行的操作`。这些规则可以包括允许的域名、允许的脚本来源、允许的样式来源、允许的图像来源等。通过限制这些资源的来源，CSP 可以有效防止恶意代码注入和其他安全漏洞。

CSP 的规则可以通过 HTTP 头部字段 `Content-Security-Policy` 或 `Content-Security-Policy-Report-Only` 来设置。其中，`Content-Security-Policy` 是指定实际执行的策略，而 `Content-Security-Policy-Report-Only` 则`只用于报告违规情况，不会阻止资源加载和执行。`

以下是一个示例，展示如何使用 CSP 头部字段：

```js
Content-Security-Policy: default-src 'self'; script-src 'self' https://example.com; style-src 'self' 'unsafe-inline'
```

上述示例中，CSP 规则包括：
- `default-src 'self'`：默认策略要求所有资源从`当前域名`加载。
- `script-src 'self' https://example.com`：指定脚本只能从当前域名和 `https://example.com` 加载。
- `style-src 'self' 'unsafe-inline'`：指定样式只能从当前域名加载，但允许内联样式（`'unsafe-inline'`）。

通过配置适当的 CSP 规则，网站管理员可以限制网页上的资源和操作，从而减少潜在的安全风险。

## 示例

我们在 html 中，加载一张外网的图片，同时服务端设置 CSP `default-src self`，看看会有什么效果

随便找张图片

```html
<img src="http://www.fangfa.net/public/uploads/ueditor/images/20141111/14156729795697.png" alt="" />
```

```js
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  if (req.url === '/') {

    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Security-Policy': "default-src self" // 设置 CSP，所有的请求只能加载本域名下的资源
    })

    const html = fs.readFileSync('index.html')
    res.end(html)
  }
})

server.listen(8888, () => {
  console.log('server running at port 8888...')
})

```

刷新页面后，发现图片没出来，控制台还报错了

```
Refused to load the image 'http://www.fangfa.net/public/uploads/ueditor/images/20141111/14156729795697.png' because it violates the following Content Security Policy directive: "default-src self". Note that 'img-src' was not explicitly set, so 'default-src' is used as a fallback.
```

## 出现了 CSP 错误，如何报告错误？

配置 `report-uri /report`

`'Content-Security-Policy': "default-src \'self\'; report-uri /report"`

设置报告错误后，network 中就会出现 `/report` 的 http 请求。

```js
{
	"csp-report": {
		"document-uri": "http://localhost:8888/",
		"referrer": "",
		"violated-directive": "style-src-elem",
		"effective-directive": "style-src-elem",
		"original-policy": "default-src 'self'; report-uri /report",
		"disposition": "enforce",
		"blocked-uri": "inline",
		"line-number": 9,
		"source-file": "http://localhost:8888/",
		"status-code": 200,
		"script-sample": ""
	}
}
```

## meta 标签也可以配置 CSP

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';" />

```

不过 meta 标签不能配置 `report-uri`，所以最好还是通过 http 的响应头来配置 `CSP`。

# HTTP 常用的状态码及使用场景

- 1xx：表示目前是协议的中间状态，还需要后续请求
- 2xx：表示请求成功
- 3xx：表示重定向状态，需要重新请求(304除外)
- 4xx：表示请求报文错误
- 5xx：服务器端错误


常用状态码：

- 101 切换请求协议，从 HTTP 切换到 WebSocket
- 200 请求成功，有响应体
- 301 永久重定向：会缓存
- 302 临时重定向：不会缓存
- 304 协商缓存命中
- 403 服务器禁止访问
- 404 资源未找到
- 400 请求错误
- 500 服务器端错误
- 503 服务器繁忙

# HTTP 常用的请求方式，区别和用途？

HTTP 常用的请求方式有以下几种：

1. GET：
   - 用途：获取资源，向服务器请求指定的资源。
   - 参数传递：通过 URL 的查询字符串传递参数。
   - 幂等性：是幂等的，多次相同的 GET 请求应该返回相同的结果。

2. POST：
   - 用途：提交数据，向服务器提交要被处理的数据。
   - 参数传递：通过请求体传递参数，通常用于传输较大量或敏感数据。
   - 幂等性：不是幂等的，多次相同的 POST 请求可能会产生不同的结果。

3. PUT：
   - 用途：更新资源，用于向服务器传递新的实体来替换指定的资源。
   - 参数传递：通过请求体传递参数，传递要更新的资源信息。
   - 幂等性：是幂等的，多次相同的 PUT 请求应该具有相同的结果。

4. DELETE：
   - 用途：删除资源，用于删除服务器上的指定资源。
   - 参数传递：通过 URL 或请求体传递要删除的资源标识信息。
   - 幂等性：是幂等的，多次相同的 DELETE 请求应该具有相同的结果。

5. PATCH：
   - 用途：更新资源的部分内容，用于向服务器发送部分更新的请求。
   - 参数传递：通过请求体传递要更新的部分内容。
   - 幂等性：不是幂等的，多次相同的 PATCH 请求可能会产生不同的结果。

6. HEAD：
   - 用途：与 GET 类似，但只返回响应头部信息，不返回实际内容，用于获取资源的元数据信息。
   - 参数传递：通过 URL 的查询字符串传递参数。
   - 幂等性：是幂等的，多次相同的 HEAD 请求应该返回相同的结果。

7. OPTIONS：
   - 用途：获取目标资源支持的请求方法、跨域请求中的预检请求等信息。
   - 参数传递：通过 URL 的查询字符串传递参数。
   - 幂等性：是幂等的，多次相同的 OPTIONS 请求应该返回相同的结果。

8. TRACE：
   - 用途：回显服务器收到的请求，主要用于诊断和调试。
   - 参数传递：通过 URL 的查询字符串传递参数。
   - 幂等性：是幂等的，多次相同的 TRACE 请求应该返回相同的结果。

# HTTPS 是什么？具体流程

HTTPS（HyperText Transfer Protocol Secure）是一种通过 `加密和认证` 的方式来保护网络通信安全的协议。它是在HTTP的基础上添加了 `SSL/TLS` 协议进行加密传输，以确保数据在传输过程中的机密性、完整性和身份认证。

HTTPS的具体流程如下：

1. 客户端发送HTTPS请求：客户端向服务器发送HTTPS请求，请求的URL以https://开头。

2. 服务器端证书验证：服务器接收到请求后，会向客户端 `发送证书`，证书中包含了服务器的公钥和其他相关信息。

3. 客户端证书验证：客户端收到服务器的证书后，会对证书进行验证。验证的过程包括检查证书的合法性、有效期等，并且验证证书的颁发机构是否可信。

4. 生成随机密钥：客户端验证通过后，会生成一个随机的对称密钥（也称为会话密钥或对话密钥）。

5. 使用公钥加密：客户端使用服务器的公钥对生成的随机密钥进行加密，并发送给服务器。

6. 使用私钥解密：服务器接收到加密的随机密钥后，使用自己的私钥对其进行解密，得到会话密钥。

7. 加密通信：客户端和服务器使用会话密钥进行对称加密，保证通信过程中的数据机密性和完整性。

通过以上流程，HTTPS实现了对数据的加密和解密，保证了通信过程的安全性。同时，证书的验证机制也确保了服务器的身份可信，防止中间人攻击和数据篡改。


