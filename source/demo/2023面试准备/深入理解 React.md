# 源码阅读

> https://react.jokcy.me/book/api/react-element.html

react-class-source-code

# React.createElement

# Component & PureComponent

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === 'object' ||
      typeof partialState === 'function' ||
      partialState == null,
    'setState(...): takes an object of state variables to update or a ' +
      'function which returns an object of state variables.',
  );
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
```


PureComponent

原型式继承。

```js
function ComponentDummy() {}
ComponentDummy.prototype = Component.prototype;

/**
 * Convenience component with default shallow equality check for sCU.
 */
function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  // If a component has string refs, we will assign a different object later.
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

const pureComponentPrototype = (PureComponent.prototype = new ComponentDummy());
pureComponentPrototype.constructor = PureComponent;
// Avoid an extra prototype jump for these methods.
// 避免为这些方法进行额外的原型跳转。
Object.assign(pureComponentPrototype, Component.prototype);

// isPureReactComponent 标识当前组件是不是 pureComponent
pureComponentPrototype.isPureReactComponent = true;

export {Component, PureComponent};
```

# ref 的三种使用方式

- string

  this.refs.stringRef.textContent

- ref callback

  ref={ele => (this.methodRef = ele)}

- React.createRef()

this.refs 已弃用。

```js
import React from 'react'

export default class RefDemo extends React.Component {
  constructor() {
    super()
    this.objRef = React.createRef()

    // { current: null }
  }

  componentDidMount() {
    // console.log(`span1: ${this.refs.ref1.textContent}`)
    // console.log(`span2: ${this.ref2.textContent}`)
    // console.log(`span3: ${this.ref3.current.textContent}`)

    setTimeout(() => {
      this.refs.stringRef.textContent = 'string ref got'
      this.methodRef.textContent = 'method ref got'
      this.objRef.current.textContent = 'obj ref got'
    }, 1000)
  }

  render() {
    return (
      <>
        <p ref="stringRef">span1</p>
        <p ref={ele => (this.methodRef = ele)}>span3</p>
        <p ref={this.objRef}>span3</p>
      </>
    )
  }
}
```

## createRef

```js
export function createRef() {
  const refObject = {
    current: null,
  };

  return refObject;
}
```

# forwardRef

> https://zh-hans.legacy.reactjs.org/docs/react-api.html#reactforwardref

React.forwardRef 会创建一个React组件，这个组件能够将其接受的 ref 属性转发到其组件树下的另一个组件中。

主要用途：

- 转发 refs 到 DOM 组件

  比如我们想要在自定义React 组件上获取 ref，就需要这种方式。

- 在高阶组件中转发 refs


在自定义组件上定义 ref，如下代码没有使用 forwardRef，会报错，因为 this.ref 是 null

```js
import React from 'react'

const TargetComponent = (props, ref) => (
  <input type="text" ref={ref} />
)

export default class Comp extends React.Component {
  constructor() {
    super()
    this.ref = React.createRef()
  }

  componentDidMount() {
    this.ref.current.value = 'ref get input'
  }

  render() {
    return <TargetComponent ref={this.ref} />
  }
}
```

更正如下：

```js
const TargetComponent = React.forwardRef((props, ref) => (
  <input type="text" ref={ref} />
))
```
