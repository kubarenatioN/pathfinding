import PF from 'pathfinding'
import {Grid} from './grid/grid'

const rootEl = document.body

const searchBtn = document.createElement('button')
searchBtn.innerHTML = 'Search'
rootEl.append(searchBtn)


const start = [0, 8]
const end = [7, 8]

const matrix = [
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0]
]
let grid = new PF.Grid(matrix);

console.log('pf:', PF)
console.log('grid:', grid)

const gridNodes = new Grid(rootEl, grid, new PF.AStarFinder(), start, end)
gridNodes.setStart()
gridNodes.setEnd()
gridNodes.onUpdate = () => {
  gridNodes.createGrid()
}

searchBtn.addEventListener('click', () => {
  const nodes = gridNodes.findPath(start, end)
  gridNodes.colorNodes(nodes)
})





// const path = gridNodes.findPath(start, end)
// console.log('path: ', path);