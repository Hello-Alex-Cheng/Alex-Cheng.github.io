const http = require('http');

// 创建HTTP服务器
const server = http.createServer((req, res) => {

  res.writeHead(200, {
    'Content-Type': 'text/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    // 'Cache-Control': 'max-age=5, private',
  })
  res.end('请求 server2 的资源成功'); // 发送响应数据
});

// 监听端口
const port = 9999;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
