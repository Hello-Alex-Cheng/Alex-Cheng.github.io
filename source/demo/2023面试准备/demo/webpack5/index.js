import './hrm.js'

import './test.css'
import './test.scss'

import imgSrc from '../../img/babel.jpg'

import('./test').then(module => {
  module.default()  
})

import('./test1.js')


window.onload = function() {
  const imgDom = `<img src="${imgSrc}"/>`
  const img = document.getElementById('img')

  console.log(document.getElementById('img'))
  img.innerHTML = imgDom
}

console.log('------ index.js console-🔥-------', isMe, env)

if (module.hot) {
  module.hot.accept()
}

