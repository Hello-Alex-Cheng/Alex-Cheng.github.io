---
layout: HTTP
title: 取消请求(axios、fetch)
date: 2023-07-16 23:29:19
tags: axios、fetch、AbortController
banner_img: /img/memory-leak.png
index_img: /img/memory-leak.png
excerpt: AbortController 接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。
---

# 取消请求

作用于频繁发送请求的场景，上一个请求还没完成，现在需要发送新的请求，那就需要将前面的请求取消掉。

# [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)

AbortController 接口表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。


# fetch

> [示例](https://mdn.github.io/dom-examples/abort-api/)

给 fetch 传递第二个参数，配置 `signal` 属性，它的值就是 AbortController 实例的 `signal` 属性。

```js
let controller;

function fetchVideo() {
  controller = new AbortController();
  const signal = controller.signal;
  fetch('xxx', { signal })
    .then((response) => {
      console.log('下载完成', response);
    })
    .catch((err) => {
      console.error(`下载错误：${err.message}`);
    });
}
```

我们可以创建一个按钮，用来取消请求。调用 `AbortController 实例` 上的 `abort()` 方法即可。

```js
abortBtn.addEventListener('click', () => {
  if (controller) {
    controller.abort();
    console.log('中止下载');
  }
});
```

` 当 abort() 被调用时，这个 fetch() promise 将 reject 一个名为 AbortError 的 DOMException。`

取消之后，你会发现控制台报错了，因为 fetch promise 已经 reject 了 AbortError。

如果不想看到这个错误，可以通过 `try-catch` 将 `fetch` 包裹起来，在 catch 中打印错误即可。

# axios

> https://www.axios-http.cn/docs/cancellation

在低版本中的 axios `v0.22.0` 中，可以通过它本身提供的 `cancelToken` 来控制请求取消。`高版本中已废弃`

同理 fetch，使用 `AbortController` 控制请求取消。

```js
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
});

// 取消请求
controller.abort()
```

## 过渡 CancelToken `deprecated`

此 API 从 v0.22.0 开始已被弃用，不应在新项目中使用。

可以使用 CancelToken.source 工厂方法创建一个 cancel token ，如下所示：

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get('/user/12345', { cancelToken: source.token })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message);
    } else {
      // 处理错误
    }
  });

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

`在过渡期间，您可以使用这两种取消 API，即使是针对同一个请求：`

```js
const controller = new AbortController();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token,
  signal: controller.signal
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求 (message 参数是可选的)
source.cancel('Operation canceled by the user.');
// 或
controller.abort();
```



