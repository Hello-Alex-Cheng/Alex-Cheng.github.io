"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const tankDecorator = (target) => {
    target.prototype.getPosition = () => {
        return {
            x: 1200,
            y: 200
        };
    };
};
let Tank = class Tank {
    constructor() {
        this.name = 11; // 属性“name”为私有属性，只能在类“Tank”中访问
    }
    getPosition() {
        console.log(this.name);
    }
};
Tank = __decorate([
    tankDecorator
], Tank);
const t = new Tank();
// console.log(t.name);
console.log(t.getPosition());
const PlayMusicDecorator = (type) => {
    return function (target) {
        target.prototype.play = function () {
            console.log(`开始播放 ${type} 音乐`);
        };
    };
};
// 修饰方法
// 1. args[0] 是 Player 的原型对象
const showDecorator = (...args) => {
    console.log('args ', args, args[0]);
    args[0].getName = function () { };
};
// 修饰静态方法
// 1. args[0] 是 Player 类
const sayNameDecorator = (...args) => {
    console.log('static args ', args, args[0] === Player);
};
let Player = class Player {
    show() {
        console.log('show method');
    }
    static sayName() { }
};
__decorate([
    showDecorator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Player.prototype, "show", null);
__decorate([
    sayNameDecorator,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Player, "sayName", null);
Player = __decorate([
    PlayMusicDecorator('喜洋洋')
], Player);
const p = new Player();
p.play();
console.log(p.__proto__);
