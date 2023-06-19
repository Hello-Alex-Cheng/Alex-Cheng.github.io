---
title: React Hooks
date: 2022-03-26 18:41:01
tags: React，Hooks
banner_img: /img/home.jpg
index_img: /img/home.jpg
excerpt: 什么是React Hooks，为什么需要它？如何高效的使用React Hooks？如何自定义 Hooks ？如何通过 Hooks 做性能优化？
comment: true
---

https://zh-hans.react.dev/reference/react/useCallback

> Hook 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

# Hook 规则
1. 只在最顶层使用 Hook
2. 只在 React 函数中调用 Hook。（或：在自定义 Hook 中调用其他 Hook）

# useEffect

useEffect接收一个方法作为第一个参数，该方法会在每次渲染完成之后被调用。

它还会接收一个数组作为第二个参数，这个数组里的每一项内容都会被用来进行渲染前后的对比，如果没有变化，则不会调用该副作用。

useEffect 的依赖如果是个空数组，只会在 DOM 渲染后触发一次，以后都不会触发，相当于 `componentDidMount`。可以看做是 `componentDidMount、componentDidUpdate、componentWillUnmount` 三个钩子的组合。

useEffect可以返回一个函数，用于清除副作用的回调。`每当组件卸载，或者组件重新render，都会触发这个函数。`而且是先执行 `return 函数`，再执行 `useEffect` 内部逻辑。

## 注意事项

1. 对于传入的对象类型，React只会判断引用是否改变，不会判断对象的属性是否改变，所以建议依赖数组中传入的变量都采用基本类型。

2. useEffect的清除函数在每次重新渲染时都会执行，而不是只在卸载组件的时候执行。

# useLayoutEffect

在使用方式上，和 `useEffect` 一样。大部分情况只使用 `useEffect` 即可，当 useEffect 处理 DOM 相关逻辑时，出现问题了，再使用 `useLayoutEffect`。

至于出现什么问题，我们先来看一下它俩的执行时机。

## 组件更新过程

浏览器中 JS 线程和渲染线程是互斥的，渲染线程必须等待 JS 线程执行完毕，才开始渲染组件。

而我们的组件从 state 变化到渲染，大概可以分为如下几步：

1. 改变 state，触发更新 state 变量的方法

2. React 根据组件返回的 vDOM 进行 diff 对比，得到新的 Virtual DOM

3. 将新的 VDom 交给渲染线程处理，绘制到浏览器上

4. 用户看到新的内容

而 `useEffect` 是在第 3 步之后执行的，也就是在浏览器绘制之后才调用。`而且 useEffect 还是异步执行的，所谓异步就是被 requestIdleCallback 封装，只在浏览器空闲时候才会执行，保证了不会阻塞浏览器的渲染过程。`

`useLayoutEffect` 就不一样，它会在`第二步`之后（`diff 出新的 vDOM 之后`），第三步之前执行，也就是渲染之前同步执行的，所以会等它执行完再渲染页面到浏览器上。

如果我们要操作 DOM，或者不想出现 `内容闪烁` 的问题，我们就是用 `useLayoutEffect`

`明显的闪烁问题`

```js
useEffect(() => {
  async function fn() {
    if (num === 1) {
      let count = 0;
      console.time();
      for (let i = 0; i < 99999999; i++) {
        count++;
      }
      console.timeEnd();
      setNum(Math.random());
    }
  }
  fn();
  return () => {
    console.log("useEffect tail function");
  };
}, [num]);
```

`没有闪烁问题`

```js
useLayoutEffect(() => {
  async function fn() {
    if (num === 1) {
      let count = 0;
      console.time();
      for (let i = 0; i < 99999999; i++) {
        count++;
      }
      console.timeEnd();
      setNum(Math.random());
    }
  }
  fn();
  return () => {
    console.log("useLayoutEffect tail function");
  };
}, [num]);
```

## 总结

1. 优先使用 useEffect，因为它是异步执行的，不会阻塞渲染
2. 会影响到渲染的操作尽量放到 useLayoutEffect中去，避免出现闪烁问题
3. useLayoutEffect和componentDidMount是等价的，会同步调用，阻塞渲染
4. 在服务端渲染的时候 useLayoutEffect 无效，使用 useEffect

# 性能优化—— useCallback、useMemo、memo

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

# 设计组件

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

# useRef / createRef

> https://zh-hans.react.dev/reference/react/useRef

获取 DOM 元素。

当 React 创建 DOM 节点并将其渲染到屏幕时，React 将会把 DOM 节点设置为你的 ref 对象的 current 属性。

当节点从屏幕上移除时，React 将把 current 属性设回 null。

```js
const inputRef = useRef(null) // const inputRef = React.createRef()

inputRef.current.focus()

// ...
return <input ref={inputRef} />;
```

通过使用 ref，你可以确保：

- 可以在重新渲染之间 存储信息（不像是普通对象，每次渲染都会重置）。
- 改变它 不会触发重新渲染（不像是 state 变量，会触发重新渲染）。
- 对于你的组件的每个副本来说，这些信息都是本地的（不像是外面的变量，是共享的）。


注意：

- 不要在渲染期间写入 或者读取 ref.current。

```js
function MyComponent() {
  // ...
  // 🚩 不要在渲染期间写入 ref
  myRef.current = 123;
  // ...
  // 🚩 不要在渲染期间读取 ref
  return <h1>{myOtherRef.current}</h1>;
}
```

- 可以在 事件处理程序或者 effects 中读取和写入 ref。

```js
function MyComponent() {
  // ...
  useEffect(() => {
    // ✅ 你可以在 effects 中读取和写入 ref
    myRef.current = 123;
  });
  // ...
  function handleClick() {
    // ✅ 你可以在事件处理程序中读取和写入 ref
    doSomething(myOtherRef.current);
  }
  // ...
}
```

# 编写一个获取 DOM信息的 hook

假如我们想要获取一个 dom 的 `getBoundingClientRect` 信息，我可能这样做：

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

但是，获取 DOM 信息的逻辑其实很通用，所以考虑下，`将 ref 逻辑抽离成一个 Hook`。

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
```

使用

```js
const [rect, ref] = useClientRect()

<h1 ref={ref}>是 H1 标签 {count}</h1>
{
  rect && <span>{rect.height}</span>
}
```

# React.forwardRef

> https://zh-hans.react.dev/reference/react/forwardRef

React.forwardRef 会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。

```js

const FancyInput = forwardRef((props, ref) => (
  <input ref={inputRef} {...props} />
))

// 这样可以拿到 input 元素了
const inputEle = React.createRef() // const inputEle = useRef(null)
<FancyInput ref={inputEle} />

```

# useImperativeHandle(ref, createHandle, [deps])

> useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。

对上述代码中所涉参数说明如下。
- ref：定义current对象的ref属性。
- createHandle：这是一个函数，返回值是一个对象，即这个ref的current对象。
- [deps]：依赖列表。当监听的依赖发生变化时，useImperativeHandle才会重新将子组件的实例属性输出到父组件ref的current属性上；如果为空数组，则不会重新输出。

```js
// 注意：该组件接收到的 ref 已不再被转发到 <input> 中。
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
  }));
  return <input ref={inputRef} {...props} />;
})


const ref = React.createRef()
<FancyInput ref={ref} />


// 通过 ref 获取到 useImperativeHandle 暴露的方法
ref.current.focus()
ref.current.scrollIntoView()
```

# useReducer & useContext(组件级的状态管理)

```js
// reducers/app-reducer.js

import { createContext } from "react";

// 创建上下文
export const AppContext = createContext(null);

// 定义 app reducer
export const appReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_AGE":
      return {
        ...state,
        user: {
          ...state.user,
          age: action.payload
        }
      };
    case "UPDATE_NAME":
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload
        }
      };
    default:
      return state;
  }
};
```

使用上下文，可以使用 `AppContext.consumer`，但是有了 `useContext` 了就没必要了。

根组件使用 `AppContext.Provider` 提供状态 `initState`

```js
import { appReducer, AppContext } from "./reducers/app-reducer.js";

function App() {
  const initState = {
    type: "person",
    user: {
      age: 18,
      name: "alex.cheng"
    }
  };
  const [state, dispatch] = useReducer(appReducer, initState);

  return (
    <AppContext.Provider value={state}>
      <Child1 />
    </AppContext.Provider>
  );
}
```

子孙子组件通过 `useContext(AppContext)` 获取上下文提供的状态。

```js
const Child = () => {
  const context = useContext(AppContext);
  return (
    <>
      <p>{JSON.stringify(context)}</p>
    </>
  );
};
```

# 参考资料
[^1]: [ahooks 官网](https://ahooks.js.org/zh-CN/)
