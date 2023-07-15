---
title: React Native
date: 2022-06-09 14:26:40
tags: RN H5
banner_img: /img/chicken.jpg
index_img: /img/chicken.jpg
excerpt: React Native 、H5移动端开发实践
---

# react-native-cli

方便在命令行执行一些命令

`npm install -g react-native-cli`

> react-native run-ios

# 初始化项目

1. react-native init project-name

2. npx

```js
1. npx react-native@latest init AwesomeProject

2. npx react-native@X.XX.X init AwesomeProject --version X.XX.X
```

# Andriod studio
启动 andriod
# Xcode

启动 ios
# 调试 APP

`Command + D` 打开调试模式，如果无效，也可以通过 `Device + Shake` 弹出，需要开启的功能如下：

1. remote js debugge
2. enable hot reloading

# 处理 ios 和 android 兼容性

方式一，创建指定平台的 `入口文件`

```js
index.ios.js

index.android.js
```

方式二，适用于细粒度控制兼容性

```js
import { Platform } from 'react-native';

Platform.OS === 'ios' ? ...
```


也可以安装 `react native debugger.app` 来调试

# WebView
现在 Android App大多嵌入了 Android Webview 组件进行 Hybrid 开发，它具备开发周期短、灵活性好的优点，但是缺点也很明显，加载速度慢 & 消耗流量。引起缺点的主要原因如下：

  1. js解析效率，以及手机硬件设备的性能
  2. 页面资源的下载（图片、js文件、css文件）

## 安装 react-native-webview

`npm install --save react-native-webview`

> https://github.com/react-native-webview/react-native-webview/blob/master/docs/Getting-Started.md






## 参考资料
[^1]: [Android Webview H5 秒开方案实现](https://juejin.cn/post/6844903673697402887)

