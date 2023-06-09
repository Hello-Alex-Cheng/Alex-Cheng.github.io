
<img src="https://cn.redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif" />

# Redux

Redux 是一个管理全局应用状态的库

Redux 通常与 React-Redux 库一起使用，把 Redux 和 React 集成在一起

`Redux Toolkit` 是编写 Redux 逻辑的推荐方式

- 单向数据流

- state

- action

- reducer

整个应用只有一个单一的 reducer 函数：这个函数是传给 createStore 的第一个参数。

工作流

```js
用户操作页面 => dispatch action => reducer => subscribe => 更改 state

新的 state => --- 更新DOM ---- ===> view
```

# react-redux

- connect：连接容器组件和傻瓜组件

```js
const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

- Provider：提供包含store的context。

```js
<Provider store={store}>
  <App />
</Provider>,
```

# createStore

- 第一个参数是 reducer

- 第二个参数是初始化 store 的状态

第二个参数的应用场景：比如我们想保留用户的操作，可以将最新的 state 保存起来，刷新页面后，用户的操作不会丢失。

```js
const cacheState = localStorage.getItem('cacheState')

const store = createStore(todoApp, cacheState ? JSON.parse(cacheState) : initialState)

store.subscribe(() => {
  localStorage.setItem('cacheState', JSON.stringify(store.getState()))
})
```

# 极简版 Redux 实现

Redux Store 必须包含的几个模块

- state

- dispatch

- listeners

- subscribe

- getState

```js
const createStore = function(reducer, initialState = {}) {
  const store = {}

  store.state = initialState
  store.listeners = []

  store.subscribe = function(listener) {
    store.listeners.push(listener)
  }

  store.dispatch = function(action) {
    store.state = reducer(store.state, action)
    store.listeners.forEach(listener => listener())
  }

  store.getState = function() {
    return store.state
  }

  return store
}

// reducer
function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

const store = createStore(counter, 0)

store.subscribe(() => {
  console.log('监听 ', store.getState())
})

console.log('初始 state', store.getState())

store.dispatch({
  type: 'INCREMENT',
})

store.dispatch({
  type: 'INCREMENT',
})

console.log('get state', store.getState())

store.dispatch({
  type: 'DECREMENT',
})
```

# redux-toolkit

> https://cn.redux.js.org/tutorials/quick-start

安装

`npm install @reduxjs/toolkit react-redux`

创建 store，`自动配置了 Redux DevTools 扩展`

```js
import { configureStore } from '@reduxjs/toolkit'

export default configureStore({
  reducer: {}
})
```

为 React 提供 Redux Store


```js
import store from './app/store'
import { Provider } from 'react-redux'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

创建 Redux State Slice

创建 slice 需要一个字符串名称来标识切片、一个初始 state 以及一个或多个定义了该如何更新 state 的 reducer 函数。slice 创建后 ，我们可以导出 slice 中生成的 Redux action creators 和 reducer 函数。

不过 Redux Toolkit createSlice 和 createReducer 在内部使用 `Immer` 允许我们编写“可变”的更新逻辑，变成正确的不可变更新。

createSlice 的函数，它负责生成 action 类型字符串、action creator 函数和 action 对象的工作

```js
// counter/counterSlice.js

import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      // Redux Toolkit 允许我们在 reducers 写 "可变" 逻辑。它
      // 并不是真正的改变状态值，因为它使用了 Immer 库
      // 可以检测到“草稿状态“ 的变化并且基于这些变化生产全新的
      // 不可变的状态
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// 导出生成的 reducer
export default counterSlice.reducer
```

这样我们就生成了 counter reducer，我们不需要手动去创建 actions，createSlice 自动帮我们生成 actions。也可以在 reducers 中直接处理 state 了，因为 createReducer 内部使用了 immer 库处理 state

接下来，就是将生成的 counter reducer 放到 `configureStore` 配置中

```js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export default configureStore({
  reducer: {
    counter: counterReducer
  }
})
```

最后，我们可以在 React 组件中去使用了

```js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'
import styles from './Counter.module.css'

export function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
```

## 用 Thunk 编写异步逻辑

thunk 是一种特定类型的 Redux 函数，可以包含异步逻辑。Thunk 是使用两个函数编写的：

- 一个内部 thunk 函数，它以 dispatch 和 getState 作为参数
- 外部创建者函数，它创建并返回 thunk 函数

在原 Redux 中使用 thunk 需要在创建时将 redux-thunk middleware（一种 Redux 插件）添加到 Redux store 中。

不过，Redux Toolkit 的 configureStore 函数已经自动为我们配置好了，所以我们可以继续在这里使用 thunk。

```js
// thunk 函数
export const incrementAsync = (amount) => (dispatch) => {
  setTimeout(() => {
    dispatch(incrementByAmount(amount))
  }, 1000)
}

// 从 store 的 state 中取出特定的 state value
// 比如我们想要取 counter 的值
export const selectCount = (state) => state.counter.value
```

```html
import { useSelector, useDispatch } from 'react-redux';

const count = useSelector(selectCount);

const dispatch = useDispatch();


<button
  className={styles.asyncButton}
  onClick={() => dispatch(incrementAsync(10))}
>
  Add Async
</button>
```

# react-redux 中的 hooks

React-Redux 库有一组自定义 hooks，允许你的 React 组件与Redux store交互。[连接](https://react-redux.js.org/api/hooks)

- 使用 useSelector 提取数据

- 使用 useDispatch 来 dispatch action

这两个钩子能访问 redux store，前提是通过  `Provider` 组件包裹了根组件，并提供了 `store` 属性。

# 参考
【1】[新版Redux 中文官网](https://cn.redux.js.org/)

【2】[极精简的 Redux Tutorial 教程](https://github.com/react-guide/redux-tutorial-cn/blob/master/01_simple-action-creator.js)

【3】[老版 Redux](https://www.redux.org.cn/)


