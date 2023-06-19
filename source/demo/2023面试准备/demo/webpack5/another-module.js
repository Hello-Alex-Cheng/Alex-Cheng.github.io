import _ from 'lodash'
import obj from './test1.js'
obj.count++

console.log('another module lodash', _.join(['Another', 'module', 'loaded!'], ' '));
console.log('another obj', obj);
