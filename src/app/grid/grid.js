import { NodeView } from '../node/nodeView'
import './grid.scss'

export class Grid {

  onUpdate = undefined

  constructor(root, PFgrid, finder, start, end) {
    this.root = root
    this.pfgrid = PFgrid
    this.sizex = this.pfgrid.width
    this.sizey = this.pfgrid.height
    this.finder = finder
    this.start = start
    this.end = end
    this.grid = []
    this.visitedNodes = []
    this.createGrid()
  }

  createGrid() {
    console.log('draw grid');
    this.grid = []
    this.gridView && this.gridView.remove()

    this.gridView = document.createElement('div')
    this.gridView.classList.add('grid')
    for (let i = 0; i < this.sizey; i++) {
      const gridRow = []
      const row = document.createElement('div')
      row.classList.add(['row'])
      for (let j = 0; j < this.sizex; j++) {
        const pfnode = this.pfgrid.nodes[i][j]
        const node = new NodeView(pfnode)
        node.redrawPath = () => {
          this.redrawPath()
        }
        gridRow.push(node)
        row.append(node.el)
      }
      this.grid.push(gridRow)
      this.gridView.append(row)
    }
    this.root.append(this.gridView)
    // this.onUpdate && this.onUpdate()
    this.setListeners()
    this.setStart()
    this.setEnd()
    this.redrawPath()
  }

  findPath() {
    let gridCopy = this.pfgrid.clone()
    return this.finder.findPath(...this.start, ...this.end, gridCopy)
  }

  setStart() {
    const [x, y] = this.start
    this.grid[y][x].setIsStart = true
  }

  setEnd() {
    const [x, y] = this.end
    this.grid[y][x].setIsEnd = true
  }

  colorNodes(nodes) {
    nodes.forEach(el => {
      const [x, y] = el
      this.grid[y][x].setVisited = true
    })
  }

  clearVisited() {
    this.visitedNodes.forEach(([x, y]) => {
      this.grid[y][x].setVisited = false
    })
  }

  clearEnd() {
    const [x, y] = this.end
    this.grid[y][x].setIsEnd = false
  }

  setListeners() {
    this.gridView.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      if (e.button !== 2) return
      this.lastClickPos = this.getNodePosition(e.clientX - this.gridView.offsetLeft, e.clientY - this.gridView.offsetTop)
      this.clearEnd()
      this.end = this.lastClickPos
      this.setEnd()
      this.redrawPath()
    })
  }

  redrawPath() {
    this.clearVisited()
    this.visitedNodes = this.findPath(this.start, this.end)
    this.colorNodes(this.visitedNodes)
  }

  getNodePosition(x, y) {
    const gridW = this.gridView.clientWidth
    const gridH = this.gridView.clientHeight
    return [
      Math.floor(x / gridW * this.sizex),
      Math.floor(y / gridH * this.sizey)
    ]
  }
}