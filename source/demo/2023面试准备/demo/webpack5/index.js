import './hrm.js'
import './test.css'
import('./test.scss')
import imgSrc from '../../img/babel.jpg'
import './another-module.js'
import _ from 'lodash'
import obj from './test1.js'
import dotMeContent from './custom-file/say.me'

console.log('🔥', dotMeContent)

obj.count++

import(/* webpackChunkName: "dynamic-test" */ './test').then(module => {
  module.default()  
})

import sourceText from './test.txt'

console.log('sourceText ', sourceText)

window.onload = function() {
  const imgDom = `<img src="${imgSrc}"/>`
  const img = document.getElementById('img')

  console.log(document.getElementById('img'))
  img.innerHTML = imgDom
}

if (module.hot) {
  module.hot.accept()
}
