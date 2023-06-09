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