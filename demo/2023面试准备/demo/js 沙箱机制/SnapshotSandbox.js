// class SnapshotSandbox {
//   constructor() {
//     // 记录激活之前的 window
//     this.windowSnapshot = {}

//     // 记录当前应用修改了的 window 属性
//     this.modifyPropsMap = {}
//   }

//   active() {
//     // 激活时，记录window 快照
//     // 再次激活了，还需要将之前修改了的属性还原回来
//     for (let prop in window) {
//       if (window.hasOwnProperty(prop)) {
//         this.windowSnapshot[prop] = window[prop]
//       }
//     }

//     // 再次激活了，还原之前修改了的属性
//     // 比如上一次 active 设置了 window.city = 'xxx'，再次 active 时，window.city 还是等于 'xxx'
//     Object.keys(this.modifyPropsMap).forEach(prop => {
//       window[prop] = this.modifyPropsMap[prop]
//     })
//   }

//   inactive() {
//     // 记录当前应用修改了那些属性
//     // 失活时，应该将 window 还原

//     for (let prop in window) {
//       if (window.hasOwnProperty(prop)) {
//         if (window[prop] !== this.windowSnapshot[prop]) {
//           this.modifyPropsMap[prop] = window[prop] // 记录被修改的 prop
  
//           window[prop] = this.windowSnapshot[prop] // 还原
//         }
//       }
//     }
//   }
// }


class SnapshotSandbox {

  constructor() {
    this.windowSnapshot = {}

    this.modifyPropsMap = {}
  }

  active() {
    // 1. 保存 window 的快照
    for (let prop in window) {
      if (window.hasOwnProperty(prop)) {
        this.windowSnapshot[prop] = window[prop]
      }
    }

    // 2. 再次激活时，将 window 还原到上次 active 的状态，modifyPropsMap 存储了上次 active 时在 widow 上修改了哪些属性
    Object.keys(this.modifyPropsMap).forEach(prop => {
      window[prop] = this.modifyPropsMap[prop]
    })
  }

  inactive() {

    for(let prop in window) {
      if (window.hasOwnProperty(prop)) {
        // 两者不相同，表示修改了某个 prop 记录当前在 window 上修改了的 prop
        if (window[prop] !== this.windowSnapshot[prop]) {
          this.modifyPropsMap[prop] = window[prop]

          // 还原 window
          window[prop] = this.windowSnapshot[prop]
        }

      }
    }
  }
}

window.city = 'beijing'

const ss = new SnapshotSandbox()
ss.active()
window.city = '上海'

const ss1 = new SnapshotSandbox()
ss1.active()

window.city = 'hello'

console.log(window.city)








