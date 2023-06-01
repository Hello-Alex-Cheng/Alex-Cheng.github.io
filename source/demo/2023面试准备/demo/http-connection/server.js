const http = require('http')

const fs = require('fs')

const server = http.createServer((req, res) => {
  // if (req.url === '/') {
  //   const html = fs.readFileSync('index.html')

  //   res.writeHead(200, {
  //     'Content-Type': 'text/html',
  //     'Connection': 'close'
  //   })

  //   res.end(html)
  // } else {
  //   const img = fs.readFileSync('tcp-connect.jpg')

  //   res.writeHead(200, {
  //     'Content-Type': 'iamge/jpg',
  //     'Connection': 'close'
  //   })

  //   res.end(img)
  // }

  console.log(req.url)

  if (req.url === '/') {

    res.writeHead(200, {
      'Content-Type': 'text/html',
      // 'Location': '/new',
      // 'Content-Security-Policy': "default-src http: https:"
      'Content-Security-Policy': "default-src \'self\'; report-uri /report"
    })
    const html = fs.readFileSync('index.html')
    res.end(html)
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/javascript',
    })
    res.end("console.log('javascript loaded')")
  }

  if (req.url === '/new') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
      'Content-Security-Policy': "default-src http: https:"
    })

    res.end('<h1>HTTP Redirect!!!</h1>')
  }
})

server.listen(8080, () => {
  console.log('server running at port 8888...')
})
