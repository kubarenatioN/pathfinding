export default class Component {
  constructor(parent = null, tag = 'div', classes = [], content = '') {
    this.parent = parent
    this.el = document.createElement(tag)
    this.el.classList.add(...classes)
    this.el.innerHTML = content
    parent.append(this.el)
  }
}