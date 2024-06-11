class SanpshotSandbox {
  constructor() {
      this.proxy = window; //window属性
      this.modifyPropsMap = {} //记录在window上的修改
      this.active();
  }

  // 激活沙箱
  active() {
      this.windowSnapshot = {}; //拍照，将 window 的每个属性都记录到 windowSnapshot
      for (const prop in window) {
          if (window.hasOwnProperty(prop)) {
              this.windowSnapshot[prop] = window[prop];
          }
      }
      // 将上次的修改进行一个应用 到 当前的window上
      Object.keys(this.modifyPropsMap).forEach(p => {
          // 将上次修改过得赋到window上
          window[p] = this.modifyPropsMap[p];
      })
  }

  // 丢弃沙箱
  inactve() {
      for (const prop in window) {
          if (window.hasOwnProperty(prop)) {
              if (window[prop] !== this.windowSnapshot[prop]) {
                  // 拿现在的和一年前的作比较 如果他俩不一样了 说明换这个属性有变化 有变化就把变化记录在变化表里
                  this.modifyPropsMap[prop] = window[prop]
                  // 最后在将window变回一年前
                  window[prop] = this.windowSnapshot[prop]
              }
          }
      }
  }
}

let sandbox = new SanpshotSandbox();

//通过沙箱返回一个代理
((window) => {
  window.a = 1;
  window.b = 2;
  console.log(window.a, window.b); // 1  2
  sandbox.inactve(); //失去激活后
  console.log(window.a, window.b); // undefined  undefined
  sandbox.active(); //激活
  console.log(window.a, window.b);  // 1  2
})(sandbox.proxy); //sandbox.proxy就是window