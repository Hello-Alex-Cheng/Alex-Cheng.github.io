---
title: 监听浏览器 Tab 切换
date: 2023-07-16 09:42:33
tags: visibilityChange document.visibilityState
banner_img: /img/visibility-change.png
index_img: /img/visibility-change.png
excerpt: 切换浏览器 tab 时，通过监听 visibilityChange 事件，可以通过 document.visibilityState 判断当前tab页是否是显示的
---

# visibilityChange

当其选项卡的内容变得可见或被隐藏时，会在文档上触发 visibilitychange (能见度更改) 事件。

# visibilityState

该事件`不包括`文档的更新的可见性状态，但是您可以从文档的 visibilityState 属性中获取该信息。

`document.visibilityState`

# 注意

出于兼容性原因，请确保使用 `document.addEventListener` 而不是 window.addEventListener 来注册回调。`Safari <14.0 仅支持前者。`

# 用法

比如某个页面有动画，当我们的页面处于 `hidden` 状态时，动画是没有必要在后台一直运行的（节省资源、节省电量），我们可以将其暂停。

```js
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'visible') { // or 'hidden'
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});
```

# 兼容性问题 (Safari)

当 visibleStateState 属性的值转换为 hidden 时，Safari 不会按预期触发 visibilitychange；因此，在这种情况下，您还需要包含代码以侦听 `pagehide` 事件。

## Window: 页面隐藏事件 (pagehide event)

当浏览器在显示与会话历史记录不同的页面的过程中隐藏当前页面时，pagehide(页面隐藏) 事件会被发送到一个Window 。例如，当用户单击浏览器的“后退”按钮时，当前页面在显示上一页之前会收到一个pagehide(页面隐藏) 事件。

```js
window.addEventListener("pagehide", event => {
  if (event.persisted) {
    /* the page isn't being discarded, so it can be reused later */
  }
}, false);
```

或者 `使用 Window 上的 onpagehide 事件处理程序属性来编写：`

```js
window.onpagehide = event => {
  if (event.persisted) {
    /* the page isn't being discarded, so it can be reused later */
  }
}
```


