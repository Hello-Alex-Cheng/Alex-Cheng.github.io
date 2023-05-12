// Create a class for the element
class Square extends HTMLElement {
  // Specify observed attributes so that
  // attributeChangedCallback will work
  static get observedAttributes() {
    return ['c', 'l'];
  }

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({mode: 'open'});

    const div = document.createElement('div');
    const style = document.createElement('style');
    shadow.appendChild(style);
    shadow.appendChild(div);
  }

  connectedCallback() {
    console.log('connectedCallback 当 custom element 首次被插入文档 DOM 时，被调用。');
    updateStyle(this);
  }

  disconnectedCallback() {
    console.log('Custom square element 从页面上被删除！');
  }

  adoptedCallback() {
    console.log('Custom square element 移动到了一个新的页面？');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element 属性发生了改变');
    updateStyle(this);
  }
}

customElements.define('custom-square', Square);

function updateStyle(elem) {
  const shadow = elem.shadowRoot;
  shadow.querySelector('style').textContent = `
    div {
      width: ${elem.getAttribute('l')}px;
      height: ${elem.getAttribute('l')}px;
      background-color: ${elem.getAttribute('c')};
    }
  `;
}

const add = document.querySelector('.add');
const update = document.querySelector('.update');
const remove = document.querySelector('.remove');
const move = document.querySelector('.move');
const other = document.querySelector('.other');
let square;

update.disabled = true;
remove.disabled = true;
move.disabled = true;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

add.onclick = function() {
  // Create a custom square element
  square = document.createElement('custom-square');
  square.setAttribute('l', '100');
  square.setAttribute('c', 'red');
  document.body.appendChild(square);

  update.disabled = false;
  remove.disabled = false;
  move.disabled = false;
  add.disabled = true;
};

update.onclick = function() {
  // Randomly update square's attributes
  square.setAttribute('l', random(50, 200));
  square.setAttribute('c', `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`);
};

remove.onclick = function() {
  // Remove the square
  document.body.removeChild(square);

  update.disabled = true;
  remove.disabled = true;
  add.disabled = false;
};

move.onclick = function() {

  const square1 = document.querySelector('custom-square')

  // move，我以为的移动到新文档
  other.appendChild(square1)

  /**
   * @result 生命周期执行顺序: disconnectedCallback > connectedCallback
   * @desc 很尴尬，这不叫移动到新的文档么？
   */
  
  // 那我们来试试 iframe
  setTimeout(() => {
    const iframe = document.querySelector('iframe')
    iframe.contentDocument.querySelector('body').appendChild(square1)
    move.disabled = true
  }, 1500);

  // 这下就对了，生命周期执行顺序 disconnectedCallback > adoptedCallback > connectedCallback
};