---
layout: JavaScript
title: 高性能渲染十万条数据(虚拟列表)
date: 2022-11-23 20:43:13
tags: JS
banner_img: /img/render-10w-data.jpg
index_img: /img/render-10w-data.jpg
excerpt: 使用虚拟列表的方式，来同时加载大量数据。
---

# 前言

在工作中，有时会遇到需要一些不能使用分页方式来加载列表数据的业务情况，对于此，我们称这种列表叫做长列表。比如，在一些外汇交易系统中，前端会实时的展示用户的持仓情况(收益、亏损、手数等)，此时对于用户的持仓列表一般是不能分页的。

`时间分片` 提到了可以使用时间分片的方式来对长列表进行渲染，但这种方式更适用于列表项的DOM结构十分简单的情况。本文会介绍使用虚拟列表的方式，来同时加载大量数据。

当我们渲染10w条数据时，其实主要是的时间花费在 `Recalculate Style` 和 `Layout` 上

- Recalculate Style：样式计算，浏览器根据css选择器计算哪些元素应该应用哪些规则，确定每个元素具体的样式。
- Layout：布局，知道元素应用哪些规则之后，浏览器开始计算它要占据的空间大小及其在屏幕的位置。

![](/img/render-10w-data.jpg)

在实际的工作中，列表项必然不会像例子中仅仅只由一个li标签组成，必然是由复杂DOM节点组成的。

那么可以想象的是，当列表项数过多并且列表项结构复杂的时候，同时渲染时，会在`Recalculate Style`和`Layout`阶段消耗大量的时间。

而`虚拟列表`就是解决这一问题的一种实现。

# 什么是虚拟列表
虚拟列表其实是按需显示的一种实现，即只对可见区域进行渲染，对非可见区域中的数据不渲染或部分渲染的技术，从而达到极高的渲染性能。

假设有1万条记录需要同时渲染，我们屏幕的可见区域的高度为1000px,而列表项的高度为50px，则此时我们在屏幕中最多只能看到20个列表项，那么在首次渲染的时候，我们只需加载20条即可。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e15195cf16a558~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

说完首次加载，再分析一下当滚动发生时，我们可以通过计算当前滚动值得知此时在屏幕可见区域应该显示的列表项。

假设滚动发生，滚动条距顶部的位置为150px,则我们可得知在可见区域内的列表项为第4项至`第13项。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e15197c273cbd9~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)


# 实现
虚拟列表的实现，实际上是在首屏加载的时候，只加载 `可视区域` 内需要的列表项，当滚动发生时，通过计算动态获得可视区域内的列表项，并将非可视区域内存在的列表项删除。

- 计算当前可视区域`起始数据`索引（startIndex）
- 计算当前可视区域`结束数据`索引（endIndex）
- 计算当前可视区域的数据，并渲染到页面中
- 计算startIndex对应的数据在整个列表中的偏移位置startOffset并设置到列表上

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e1519a393dee2c~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

由于只是对可视区域内的列表项进行渲染，所以为了保持列表容器的高度并可正常的触发滚动，将Html结构设计成如下结构：

```html
<div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">

    <!-- 所有数据的总高度 -->
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>

    <!-- 可视区区域，可以当做滑块看待 -->
    <div class="infinite-list" :style="{ transform: getTransform }">

      <!-- 每一项数据 -->
      <div
        ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
```

接着，监听infinite-list-container的 `scroll事件`，获取滚动位置 `scrollTop`。

- 列表总高度 `listHeight = listData.length * itemSize`
- 可显示的列表项数 `visibleCount = Math.ceil(screenHeight / itemSize)`
- 数据的起始索引 `startIndex = Math.floor(scrollTop / itemSize)`
- 数据的结束索引 `endIndex = startIndex + visibleCount`
- 列表显示数据为 `visibleData = listData.slice(startIndex,endIndex)`

```js
scrollEvent() {
  //当前滚动位置
  let scrollTop = this.$refs.list.scrollTop;

  //此时的开始索引（向下取整），itemSize 是 100
  this.start = Math.floor(scrollTop / this.itemSize);

  //此时的结束索引
  this.end = this.start + this.visibleCount;

  //此时的偏移量
  this.startOffset = scrollTop - (scrollTop % this.itemSize);
},
```

当滚动后，由于 `渲染区域` 相对于 `可视区域` 已经发生了偏移，此时我需要获取一个 `偏移量startOffset`，通过样式控制将渲染区域偏移至可视区域中，当用户在滑动时，渲染区域就会根据 `startOffset` 计算出偏移量，渲染区域就会一直在可视区域内呈现。

```js
this.startOffset = scrollTop - (scrollTop % this.itemSize);

// computed
//偏移量对应的style
getTransform() {
  return `translate3d(0,${this.startOffset}px,0)`;
},
```

# 完整代码

```html
<style>
  html{
    height: 100%;
  }
  body{
    height: 100%;
    margin:0;
  }
  #app{
    height:100%;
  }
</style>

<div id="app">
  <VirtualList :listData="state.data" :itemSize="100" />
</div>
```

VirtualList comp.
```js
<script>
export default {
  name: "VirtualList",
  props: {
    //所有列表数据
    listData: {
      type: Array,
      default: () => [],
    },
    //每项高度
    itemSize: {
      type: Number,
      default: 200,
    },
  },
  computed: {
    //列表总高度
    listHeight() {
      return this.listData.length * this.itemSize;
    },
    //可显示的列表项数
    visibleCount() {
      // 向上取整: Math.ceil(13.06) => 14，表示整个屏幕，可以放 14 条数据
      return Math.ceil(this.screenHeight / this.itemSize);
    },
    //偏移量对应的style
    getTransform() {
      return `translate3d(0,${this.startOffset}px,0)`;
    },
    //获取真实显示列表数据
    visibleData() {
      return this.listData.slice(
        this.start,
        Math.min(this.end, this.listData.length)
      );
    },
  },
  mounted() {
    // this.$el 表示当前组件的根节点，这里是 infinite-list-container
    this.screenHeight = this.$el.clientHeight;
    this.start = 0;
    this.end = this.start + this.visibleCount;
  },
  data() {
    return {
      //可视区域高度
      screenHeight: 0,
      //偏移量
      startOffset: 0,
      //起始索引
      start: 0,
      //结束索引
      end: null,
    };
  },
  methods: {
    scrollEvent() {
      //当前滚动位置
      let scrollTop = this.$refs.list.scrollTop;

      //此时的开始索引（向下取整），itemSize 是 100
      this.start = Math.floor(scrollTop / this.itemSize);
      //此时的结束索引
      this.end = this.start + this.visibleCount;

      //此时的偏移量
      this.startOffset = scrollTop - (scrollTop % this.itemSize);
    },
  },
};
</script>

<template>
  <div ref="list" class="infinite-list-container" @scroll="scrollEvent($event)">

    <!-- 所有数据的总高度 -->
    <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div>

    <!-- 可视区区域，可以当做滑块看待 -->
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        ref="items"
        class="infinite-list-item"
        v-for="item in visibleData"
        :key="item.id"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>

```

# 列表项动态高度

在之前的实现中，列表项的高度是固定的，因为高度固定，所以可以很轻易的获取列表项的整体高度以及滚动时的显示数据与对应的偏移量。

而实际应用的时候，当列表中包含文本之类的可变内容，会导致 `列表项的高度并不相同`。

比如这样：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/10/29/16e1519f1e121be9~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

在虚拟列表中应用动态高度的解决方案一般有如下三种：

> 1.对组件属性itemSize进行扩展，支持传递类型为数字、数组、函数

- 可以是一个固定值，如 100，此时列表项是固高的
- 可以是一个包含所有列表项高度的数据，如 [50, 20, 100, 80, ...]
- 可以是一个根据列表项索引返回其高度的函数：(index: number): number

这种方式虽然有比较好的灵活度，但仅适用于可以预先知道或可以通过计算得知列表项高度的情况，依然无法解决列表项高度由内容撑开的情况。

> 2.将列表项 `渲染到屏幕外`，对其高度进行测量并缓存，然后再将其渲染至可视区域内。

由于 `预先渲染至屏幕外`，再渲染至屏幕内，这导致渲染成本增加一倍，这对于数百万用户在低端移动设备上使用的产品来说是不切实际的。

> 3.以预估高度先行渲染，然后获取真实高度并缓存。

这是可以选择的实现方式，可以避免前两种方案的不足。
