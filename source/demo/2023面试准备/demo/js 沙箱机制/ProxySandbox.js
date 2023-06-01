

class ProxySandbox {

  constructor() {
    // 沙箱是否是激活状态
    this.isRunning = false

    const fakeWindow = Object.create(null)

    const _this = this

    this.proxyWindow = new Proxy(fakeWindow, {
      set(target, prop, value) {
        // 只有激活状态下，才做处理
        if (_this.isRunning) {
          target[prop] = value
          return true
        }
      },
      get(target, prop, reciver) {
        // 如果fakeWindow里面有，就从fakeWindow里面取，否则，就从外部的window里面取
        return prop in target ? target[prop] : window[prop]
      }
    })
  }

  active() {
    this.isRunning = true
  }

  inactive() {
    this.isRunning = false
  }
}

window.city = '北京'

const p1 = new ProxySandbox()
const p2 = new ProxySandbox()

p1.active()
p2.active()

p1.proxyWindow.city = '上海'
p2.proxyWindow.city = '杭州'

console.log(p1.proxyWindow.city)
console.log(p2.proxyWindow.city)
console.log(window.city)
p1.inactive()
p2.inactive()

console.log(p1.proxyWindow.city)
console.log(p2.proxyWindow.city)
console.log(window.city)

