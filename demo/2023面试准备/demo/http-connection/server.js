const http = require('http')

const fs = require('fs')

let count = 1

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
      // 'Content-Security-Policy': "default-src \'self\'; report-uri /report"
    })
    const html = fs.readFileSync('index.html')
    res.end(html)
  } else {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=5, stale-while-revalidate=10'
    })
    setTimeout(() => {
      res.end({
        count
      })

      console.log('count  ---- ', count)

      count = count + 1
    }, 2000);
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
