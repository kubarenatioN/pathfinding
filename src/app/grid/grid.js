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
    this.createGrid()
  }

  createGrid() {
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

        node.redrawGrid = () => {
          this.createGrid()
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
    const nodes = this.findPath(this.start, this.end)
    this.colorNodes(nodes)
  }

  colorNodes(nodes) {
    nodes.forEach(el => {
      const [x, y] = el
      this.grid[y][x].setVisited = true
    })
  }

  setListeners() {
    this.gridView.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      if (e.button !== 2) return
      const pos = this.getNodePosition(e.clientX - this.gridView.offsetLeft, e.clientY - this.gridView.offsetTop)
      this.end = pos
      this.onUpdate && this.onUpdate()
    })
  }

  getNodePosition(x, y) {
    const gridW = this.gridView.clientWidth
    const gridH = this.gridView.clientHeight
    const nodeW = gridW / this.sizex
    const nodeH = gridH / this.sizey
    return [
      Math.floor(x / gridW * this.sizex),
      Math.floor(y / gridH * this.sizey)
    ]
  }
}