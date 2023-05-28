const http = require('http');
const fs = require('fs')

const html = fs.readFileSync('./index.html', 'utf8')

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // 设置响应头部字段
    res.setHeader('Cache-Control', 'max-age=3600, public');
    // 表示3600秒之后，就重新从服务器拉取资源，接着缓存起来，客户端又可以使用缓存资源了。以此循环...
    
    // 其他响应设置，响应头字段也可以在这设置
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(html);
  }

  
  if (req.url === '/script.js') {
    if (req.headers['if-none-match'] === '123456789' && req.headers['if-modified-since'] === '2023-05-27 21:30') {
      res.writeHead(304)

      // 这段代码不会生效了，因为浏览器会从缓存获取资源，控制台还是会打印 Javascript loaded!!!
      res.end('console.log("服务器验证完毕，同意客户端获取缓存资源!!")')
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=10, no-cache',
        // 'ETag': '123456789',
        // 'Last-Modified': '2023-05-27 21:30',
        'Set-Cookie': ['age=18; max-age=5', 'name=alex.cheng']
      })
      res.end('console.log("Javascript loaded!!!")')
    }

  }
});

// 监听端口
const port = 8888;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
