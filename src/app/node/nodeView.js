export class NodeView {


  constructor(node) {
    this.node = node
    this.el = document.createElement('div')
    this.el.classList.add(...this.classes)
    this.el.addEventListener('click', () => {
      this.toggleWalkability()
    })
    this.redrawPath = undefined
  }

  toggleWalkability() {
    if (this.isStart || this.isEnd) return
    this.node.walkable = !this.node.walkable
    this.redrawPath && this.redrawPath()
    this.updateClasses()
  }

  set setIsStart(val) {
    this.isStart = val
    this.updateClasses()
  }

  set setIsEnd(val) {
    this.isEnd = val
    this.isVisited = false
    this.updateClasses()
  }

  get classes() {
    const classes = ['cell']
    if (!this.node.walkable) classes.push('non-walkable')
    if (this.isStart) classes.push('start')
    if (this.isEnd) classes.push('end')
    if (this.isVisited) classes.push('visited')
    return classes
  }

  updateClasses() {
    this.el.setAttribute('class', '')
    this.el.classList.add(...this.classes)
  }

  set setVisited(val) {
    if (this.isStart || this.isEnd) return
    this.isVisited = val
    this.updateClasses()
  }
}