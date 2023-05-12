---
layout: Vue3
title: Vue3的响应式系统
date: 2022-12-22 21:34:30
tags: Reactive,Vue3
banner_img: /img/vue3.jpg
index_img: /img/vue3.jpg
excerpt: 响应式系统的作用与实现
---

# 响应式系统实现

## 响应式基础
1. 通过 proxy 代理对象，读取属性时触发 get 方法，设置属性时触发 set 方法
2. 在 get 方法中收集副作用函数，在 set 方法中触发副作用函数

3. 假设有这么一个对象：`{ ok: true, text: 'hello world' }`，注册副作用函数
```js
  effect(() => {
    document.body.innerHTML = obj.ok ? obj.text : 'ok not'
  })
```

当 ok 为 true，我们会走 obj.text 的读取逻辑，触发 get 拦截方法。这个时候页面上会显示 `hello world`，当我们将 obj.ok 设置为 false 后，我们会有副作用遗留函数（text的），因为 ok 为 false，永远不会再读取 obj.text 了。

但是，当我们修改 obj.text 时， effect 副作用函数依然会触发，虽然页面上永远是 `ok not`。


## 清除不必要的副作用函数
4. 这时，我们就需要进行 `分支切换和 cleanup` 函数了，通过 cleanup 函数，我们将只收集使用到的 key 的副作用函数，也就是说，当 ok 为false 时，我们不再对 obj.text 进行依赖手机，无论我们如何修改 obj.text，都不会触发 effect 方法。

5. 我们对注册副作用函数，做一些改变，在注册函数内部，定义了一个新的副作用函数方法，这个方法内部执行 删除副作用函数的方法 和真正的副作用函数（设置 document.body 内容）

同时，我们还在 副作用函数 上定义了一个 deps 属性，用来存储与该副作用函数相关联的依赖集合，将来在 `cleanup` 中通过 activeEffect.deps[i] delete effectFn 时，其实，就是将 某个 key 的 deps 中的副作用函数删除了

```js
function effect(fn) {

  function effectFn() {
    activeEffect = effectFn

    cleanup(effectFn) // 删除所有key 收集到的依赖

    fn() // 重新执行副作用函数，重新收集依赖
  }

  effectFn.deps = [] 

  effectFn()
}
```

6. 定义 cleanup 函数，每一次触发 set 方法时，都会先删除所有 key 对应的依赖，然后重新执行 `effectFn` 内部的 `fn` 函数，重新收集依赖

因为 obj.ok = false 了，不会再读取 `obj.text`，所以也就不会再对 obj.text 收集依赖了。

```js
function cleanup(effectFn) {

  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i] // Set 集合

    deps.delete(effectFn)
  }

  effectFn.deps.length = []
}
```


**注意**

我们删除 effectFn.deps[i] 中的 effectFn，其实就是删除了 'ok、text' 中对应的依赖集合（Set）的副作用函数，因为 effectFn.deps 中存放的集合 和 Map key 对应的 Value 的集合，是同一个集合

删除后，Map 中的所有 value 都是空的 Set

然后执行 `fn` 函数，重新进行读取 obj 属性，进行依赖收集。


## 竟然无限循环？
7. 最后一步，我们还需要改造一下 trigger 函数，否则会造成 `无限循环`

```js
function trigger(target, key) {
  const depsMap = bucket.get(target)

  if (!depsMap) return

  const effects = depsMap.get(key)
  const effectsToRun = new Set(effects)

  // effects && effects.forEach(fn => fn())
  effectsToRun && effectsToRun.forEach(fn => fn())
}
```

为什么新建一个 `Set` 集合呢?  `const effectsToRun = new Set(effects)`

因为，我们遍历 effects 时，执行了每一个 `副作用` 函数，当副作用函数执行时，会调用 cleanup 进行清除，实际上就是从 effects 集合中奖当前执行的副作用函数剔除

但是，副作用函数的执行 `fn()` 会触发属性的读取操作，执行 `track`，导致副作用函数重新被收集到依赖中，而对于 effects集合的遍历仍然在执行，从而造成 `无限循环`。


**解决办法**就是：根据 effects 重新建立一个集合，进行遍历。


## 完整代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>收集 key 的依赖</title>
</head>
<body>
  
  <script>
    // 存储被注册的副作用函数
    let activeEffect;

    const data = {
      ok: true,
      text: 'hello world'
    }

    const bucket = new WeakMap() // target => Map

    const obj = new Proxy(data, {
      get(target, key) {
        // 追踪依赖
        track(target, key)
        return target[key]
      },
      set(target, key, value) {
        target[key] = value
        // 触发依赖
        trigger(target, key)
      }
    })


    function track(target, key) {
      if (!activeEffect) return target[key]
      let depsMap = bucket.get(target)

      if (!depsMap) {
        bucket.set(target, depsMap = new Map())
      }

      let deps = depsMap.get(key)

      if (!deps) {
        depsMap.set(key, deps = new Set())
      }

      // 添加副作用函数
      deps.add(activeEffect)

      // deps 存储与该副作用函数相关联的依赖集合
      // 将来在 cleanup 中通过 activeEffect.deps[i] delete effectFn 时，其实，就是将 deps 中的副作用函数删除了
      activeEffect.deps.push(deps)
    }

    function trigger(target, key) {
      const depsMap = bucket.get(target)

      if (!depsMap) return

      const effects = depsMap.get(key)
      const effectsToRun = new Set(effects)

      // effects && effects.forEach(fn => fn())
      effectsToRun && effectsToRun.forEach(fn => fn())
    }

    function effect(fn) {
      function effectFn() {
        activeEffect = effectFn

        cleanup(effectFn)
        fn()
      }

      effectFn.deps = [] // 存储所有包含当前副作用函数的依赖 集合，在 get 拦截函数中处理 deps

      effectFn()
    }

    function cleanup(effectFn) {

      console.log('effectFn ', effectFn.deps)
      // 我们删除 effectFn.deps[i] 中的 effectFn，其实就是删除了 'xxx'(key) 中对应的依赖集合的副作用函数
      // effectFn.deps[i] 中，存放的依赖集合，和 Map key 对应的依赖集合，是同一个集合，删除某一项，自然会影响到另一个
      // 当我们在 trigger 中执行 effects 时，就是执行副作用函数
      // 这个时候，会执行 cleanup，删除所有的 key 对应的副作用函数，最后执行 fn，重新走 属性的读取逻辑，触发 get 方法，重新收集依赖
      // 当我们设置 obj.ok = false 后，不会再读取 obj.text 了，从而不会对其 key 收集依赖。
      for(let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]

        deps.delete(effectFn)
      }

      effectFn.deps.length = 0
    }

    effect(() => {
      console.log(' obj.ok',  obj.ok)
      // obj.ok = true 会触发 obj 的 get拦截方法，并且通过 track 函数收集到了副作用函数，并且将其存储在 deps 中
      document.body.innerHTML = obj.ok ? obj.text : 'ok not'
    })


    setTimeout(() => {
      // obj.text = 'Vue3 Reactive'
      obj.ok = false

      console.log('bucket ', bucket)
    }, 1000)

    // setTimeout(() => {
    //   console.log('执行了')
    //   obj.text = 'Vue3 Reactive'
    // }, 3000)


  </script>
</body>
</html>
```


