// 存储被注册的副作用函数
let activeEffect;

// 副作用函数栈，用来存储当前执行的副作用函数，当副作用函数发生嵌套时，避免函数错误的使用
const effectStack = []


const bucket = new WeakMap() // target => Map

const handleProxy = data => {
  return new Proxy(data, {
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
}


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

  deps.add(activeEffect)

  activeEffect.deps.push(deps)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return

  const effects = depsMap.get(key)

  // 避免无限循环
  // const effectsToRun = new Set(effects)
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })

  effectsToRun && effectsToRun.forEach(fn => {
    if (fn.options.scheduler) {
      fn.options.scheduler(fn)
    } else {
      fn()
    }
  })
}

function effect(fn, options = {}) {
  function effectFn() {
    activeEffect = effectFn

    cleanup(effectFn)

    effectStack.push(effectFn)

    // 执行副作用函数
    fn()

    effectStack.pop()

    activeEffect = effectStack[effectStack.length - 1]
  }

  effectFn.options = options

  effectFn.deps = []

  // 开始执行
  effectFn()
}

function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]

    deps.delete(effectFn)
  }

  effectFn.deps.length = 0
}
