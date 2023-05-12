
// 单独使用
// window.onload = function() {
//   let template = document.getElementById('my-paragraph');
//   let templateContent = template.content;
//   document.body.appendChild(templateContent);
// }

// 在 Web Components 中使用模板

class MyParagraph extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    let template = document.getElementById('my-paragraph');
    let templateContent = template.content;

    this.attachShadow({ mode: 'open' })
      .appendChild(templateContent.cloneNode(true))
  }
}

customElements.define('my-paragraph', MyParagraph)
