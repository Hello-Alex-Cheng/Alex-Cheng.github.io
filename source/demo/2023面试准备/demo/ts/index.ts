const tankDecorator: ClassDecorator = (target: Function): void => {
  target.prototype.getPosition = (): {x: number, y: number} => {
    return {
      x: 1200,
      y: 200
    }
  }
}

@tankDecorator
class Tank {
  private name = 11 // 属性“name”为私有属性，只能在类“Tank”中访问
  public getPosition() {
    console.log(this.name)
  }
}

const t = new Tank()
// console.log(t.name);
console.log(t.getPosition());




const PlayMusicDecorator: Function = (type: string): ClassDecorator => {
  return function (target: Function): void {
    target.prototype.play = function() {
      console.log(`开始播放 ${type} 音乐`);
    }
  }
}

// 修饰方法
// 1. args[0] 是 Player 的原型对象
const showDecorator = (...args: Array<any>) => {
  console.log('args ', args, args[0]);
  args[0].getName = function() {}
}

// 修饰静态方法
// 1. args[0] 是 Player 类
const sayNameDecorator = (...args: Array<any>) => {
  console.log('static args ', args, args[0] === Player);
}

@PlayMusicDecorator('喜洋洋')
class Player {
  @showDecorator
  public show() {
    console.log('show method');
  }

  @sayNameDecorator
  static sayName() {}
}

const p = new Player()
;(<any>p).play()

console.log(p.__proto__);
