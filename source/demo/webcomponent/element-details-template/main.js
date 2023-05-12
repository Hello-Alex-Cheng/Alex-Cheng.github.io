
class DetailsElement extends HTMLElement {
  constructor() {
    super()

    const template = document.getElementById('element-details-template').content

    const shadowRoot = this.attachShadow({mode: 'open'})
    
    shadowRoot.appendChild(template.cloneNode(true))

    console.log('host ', shadowRoot.host === this) // ShadowRoot 附加的宿主 DOM 元素。
  }
}

const a = customElements.define('details-element', DetailsElement)

console.log('?? ', customElements.get('details-element'))
console.log('?? a', a)

