const minValue = 3;
const maxValue = 10;

// 生成一个0到1之间的随机小数
const randomFraction = Math.random();

// 将随机小数映射到指定范围内
const randomNumber = Math.floor(randomFraction * (maxValue - minValue + 1)) + minValue;

console.log(randomNumber);