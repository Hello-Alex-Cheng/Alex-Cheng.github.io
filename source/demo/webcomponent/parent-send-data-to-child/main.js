
class ParentWc extends HTMLElement {
  constructor() {
    super()

    this.data = {
      value: 'Parent instance value'
    }

    const template = document.getElementById('parent').content
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.cloneNode(true))
  }

  sayHello(msg) {
    console.log(msg, this.data)
  }

  connectedCallback() {
    const child = this.shadowRoot.querySelector('child-wc')

    // 1. 通过 DOM 属性传参
    // child.setAttribute('text', 'Parent changed the Text')

    // 2. 通过组件实例直接修改内部数据（目前主流的形式）
    // console.log('??', child)

    // 3. 事件监听
    child.addEventListener('custom-event', ({ detail }) => {
      console.log('事件触发 ', detail.value);
   })
  }
}

window.customElements.define('parent-wc', ParentWc)

// childWc
class ChildWc extends HTMLElement {
  constructor() {
    super()

    this.data = {
      value: 'Child instance value'
    }

    Object.defineProperty(this.data, 'text', {
      set: value => {
        console.log('data text changed: ', value)
      }
    })

    const template = document.getElementById('child').content
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.cloneNode(true))
  }

  // 必须先申明需要监听的属性
  static get observedAttributes() {
    return ['text'];
  }

  connectedCallback() {
    const event = new CustomEvent('custom-event', {
      detail: {
        value: 'child web component'
      }
    })
    this.dispatchEvent(event)

    const btn = this.shadowRoot.querySelector('button')

    btn.addEventListener('click', () => {
      // 获取父组件
      this.getRootNode().host.sayHello('Hello :')
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('name', name)
    console.log('oldValue', oldValue)
    console.log('newValue', newValue)
  }
}
window.customElements.define('child-wc', ChildWc);
