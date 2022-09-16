---
title: React Hooks
date: 2022-03-26 18:41:01
tags: React，Hooks
banner_img: /img/home.jpg
index_img: /img/home.jpg
excerpt: 什么是React Hooks，为什么需要它？如何高效的使用React Hooks？如何自定义 Hooks ？如何通过 Hooks 做性能优化？
comment: true
---

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。


# 动机

# Hook 规则
1. 只在最顶层使用 Hook
2. 只在 React 函数中调用 Hook。（或：在自定义 Hook 中调用其他 Hook）


# 使用 useCallback、useMemo、memo 做性能优化

尽可能的保证组件不去发生变化，发生变化的因素有：`state、props、context`。

那么 `React` 是如何比较这三者的呢？ 答案是 `内存地址`。

比如说，对比一个 `function`，对比的就是这个函数在内存中的地址，通过地址的判断，从而判断 props 是否发生了改变。

## React.memo
> https://react.docschina.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate

React.memo 包裹一个组件，来对它的 props 进行浅比较。等效于 PureComponent，但它只比较 props。（也可以通过第二个参数指定一个`自定义的比较函数`来比较新旧 props。如果函数返回 true，就会跳过更新。）

```js
// 不使用 memo，每一次 setCount，都会造成 Child 组件重新 render
const Child = () => {
  console.log('Child')
  return (
    <>Child component</>
  )
}
const Demo = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <button onClick={() => setCount(count => count + 1)}>+</button>
      <Child />
    </>
  )
}

// 通过 memo 包裹后，Child 组件不会再重新 render了。
const Child = memo(() => {
  console.log('Child')
  return (
    <>Child component</>
  )
})
```

当 memo 感知 props 没有发生改变时，不会重新 render 组件。如果传入 count 进来，Child组件就会重新 render。

总结：

1. 如果我们将 setCount 当做 prop 传入进来，Child 不会重新render（`因为 setCount 在内存中的地址没有发生改变`）
2. 如果传入我们自己定义的方法 (fn)进来，Child会重新 render，因为 Demo 组件每次更新 count 后，重新生成了 fn 函数。
3. 只是传了个 fn ，不想让 Child 组件更新怎么办？那就要用到 `useCallback` 钩子了

## useMemo

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算。

```js
  // 只有当 count 发生变化时，才会重新计算
  const computedCount = useMemo(() => {
    return count * 2
  }, [count])
```

`useMemo` 也允许你跳过一次子节点的昂贵的重新渲染，比如组件初始化时，需要一次大量的计算，后续就不会再改变了：

```js
function Parent({ a, b }) {
  // Only re-rendered if `a` changes:
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // Only re-rendered if `b` changes:
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

## useCallback

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。

下面这个例子，即使我们用 `memo` 包裹了组件，因为 `setCount` 每次会引起 Demo 组件重新 render，`生成了新的 fn 函数`(内存地址发生了变化)，导致 Child 也会重新 render。

```js
interface IChild {
  fn: React.Dispatch<React.SetStateAction<number>>
}
const Child = memo((props: IChild) => {
  console.log('Child')
  return (
    <>Child component</>
  )
})

const Demo = () => {
  const [count, setCount] = useState(0)
  const fn = () => console.log('is fn')

  return (
    <>
      <button onClick={() => setCount(count => count + 1)}>+</button>
      <Child fn={fn} />
    </>
  )
}
```

我们不想让 fn 函数的 `内存地址` 发生变化，怎么办呢？使用 `useCallback` 钩子将其包裹起来即可。

`注意：useMemo 也可以这样用，缓存 fn，从而使得 Child 组件不会重复 render。`

```js
// 省略...

const fn = useCallback(() => {
  console.log('is fn')
}, [])

// 省略...
```

这样 `fn` 函数就是一个缓存函数了，即使 count 不停的发生变化，也不会造成 Child 组件重复 render。

*总结:*

1. 当 Demo 组件内部 state 发生了改变引起 Demo 和 Child 组件重新 render
2. 并且 Child 组件接受了一个来自 Demo 组件自定义的方法（fn）
3. 如果不希望 Child 组件重新 render，那么就需要用 useCallback 钩子将自定义方法 `fn` 包裹起来
4. 因为 Child 组件 props 里面的 fn 和 useCallback 返回的 fn 指向的是内存中的同一个地址，那么 Child 组件就不会更新
5. useCallback 返回新函数的条件是：依赖项（第二个参数）发生了改变。
6. 如果说我们的 Child 组件，本身就是需要根据 count 变化而变化，那么就不需要加这个缓存 API了，反而增加其计算负担。

## 设计组件

不要为了使用钩子，过渡的使用钩子，好的页面设计，也许用不上这些钩子。

`把不变的组件和变化的组件抽离出来！`

比如可以把 count 相关部分抽离成一个 Count 组件，使其和 Child 组件同层级排列，Count 组件和 Child 组件分开了，也不会引起 Child 组件做多余的 render。

```js
<Count />
<Child prop={fn} />
```

或者是通过 props.children 渲染 Child，也不会造成 Child 重新 render。

```js
const Count = (props: any) => {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count => count + 1)}>+</button>
      {/* children 不会重新 render */}
      {props.children}
    </>
  )
}
const Demo = () => {
  // fn 永远不会变化
  const fn = () => {}
  return (
    <>
      <Count>
        <Child fn={fn} />
      </Count>
    </>
  )
}
```

## useRef / createRef

> 访问 DOM 节点

```js

const inputEle = useRef(null)
const inputEle = React.createRef()

inputEle.current.focus()

```

### 测量 DOM节点？

```js

const getHeight = useMemo(() => {
  return (node: HTMLObjectElement) => {
    if (node) {
      setHeight(node.getBoundingClientRect().height)
    }
  }
}, [])

// 或者

const getHeight = useCallback((node: HTMLObjectElement) => {
  if (node) {
    setHeight(node.getBoundingClientRect().height)
  }
}, [])

```

`将 ref 逻辑抽离成一个 Hook`

```js
// hook
const useClientRect = () => {
  const [rect, setRect] = useState(null)
  const ref = useCallback(node => {
    if (node) {
      setRect(node.getBoundingClientRect())
    }
  }, [])

  return [rect, ref]
}

// 使用

const [rect, ref] = useClientRect()

<h1 ref={ref}>是 H1 标签 {count}</h1>
{
  rect && <span>{rect.height}</span>
}
```

### React.forwardRef

> React.forwardRef 会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。

```js

const FancyInput = forwardRef((props, ref) => (
  <input ref={inputRef} {...props} />
))

// 这样可以拿到 input 元素了
const inputEle = React.createRef()
<FancyInput ref={inputEle} />

```

### useImperativeHandle

> useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。

```js

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    alert () {
      alert(1)
    }
  }));
  return <input ref={inputRef} {...props} />;
})


const inputEle = React.createRef()
<FancyInput ref={inputEle} />


// 通过 inputEle 获取到 useImperativeHandle 定义的方法
inputEle.current.focus()

inputEle.current.alert()

```

# 参考资料
[^1]: [ahooks 官网](https://ahooks.js.org/zh-CN/)
