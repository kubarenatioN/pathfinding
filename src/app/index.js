import * as THREE from 'three'
import PF from 'pathfinding'
import { Grid } from './grid/grid'
import { getHeightData } from './shared/getHeightData'
import pathMap from '../assets/path-map-10x10.png'
import { GameScene } from './map/scene'
import { BufferAttribute, Float16BufferAttribute, Float32BufferAttribute } from 'three'
import { createPlane } from './shared/createPlane'
import { Game } from './game/game'
import { CONSTANTS } from './shared/constants'
import { HeroController } from './heroController/heroController'

const rootEl = document.body

const start = [7, 1]
const end = [7, 8]

async function setMap(imgSrc) {
  const pathMap = new Promise(res => {
    const image = new Image()
    image.onload = () => {
      const matrix = getHeightData(image, 20)
      res(matrix)
    }
    image.src = imgSrc
  })
  return Promise.all([pathMap])
}

setMap(pathMap).then(([matrix]) => {
  let grid = new PF.Grid(matrix)
  console.log(grid)

  const gridNodes = new Grid(rootEl, grid, new PF.AStarFinder({
    allowDiagonal: true
  }), start, end)
  // gridNodes.setStart()
  // gridNodes.setEnd()
  gridNodes.onUpdate = () => {
    gridNodes.createGrid()
    console.log('recreate grid');
  }

  const scene = new GameScene()
  const controller = new HeroController(gridNodes)
  const game = new Game(scene, controller)

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: '#ccf'
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.y = 0
  cube.name = 'cube'
  game.addHeroMesh(cube)
  game.setHeroPosition(start)
  game.start()

  const TILE_SIZE = CONSTANTS.TILE_SIZE
  const MAP_WIDTH = CONSTANTS.MAP_WIDTH
  const MAP_HEIGHT = CONSTANTS.MAP_HEIGHT
  const TILES_IN_WIDTH = MAP_WIDTH / TILE_SIZE
  const TILES_IN_HEIGHT = MAP_HEIGHT / TILE_SIZE

  const frameGeometry = new THREE.PlaneGeometry(MAP_WIDTH, MAP_HEIGHT, MAP_WIDTH / TILE_SIZE, MAP_HEIGHT / TILE_SIZE)
  const frameMaterial = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: '#000',
    wireframe: true
  })
  const frame = new THREE.Mesh(frameGeometry, frameMaterial)
  frame.name = 'frame'
  frame.rotation.x = -Math.PI / 2
  frame.position.y = 0.002
  scene.add(frame)

  const pathMapGeom = new THREE.BufferGeometry()
  const vert = createPlane(MAP_WIDTH, MAP_HEIGHT, TILE_SIZE)
  const defaultColors = new Float32Array((MAP_WIDTH / TILE_SIZE) * (MAP_HEIGHT / TILE_SIZE) * 3 * 6).fill(0.9)

  pathMapGeom.setAttribute('position', new THREE.BufferAttribute(vert, 3))
  const mapColors = new THREE.BufferAttribute(defaultColors, 3)
  pathMapGeom.setAttribute('color', mapColors)

  paintPathTiles(matrix)

  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    // color: '#f0c'
  })
  const mesh = new THREE.Mesh(pathMapGeom, mat)
  mesh.name = 'map'
  scene.add(mesh)
  // setTimeout(() => {
  //   const colors = mesh.geometry.getAttribute('color')
  //   // console.log('before', colors.array[794]);
  //   paintTile(4, 4, 0.1, colors)
  //   console.log('after', colors.array[794])
  //   mesh.geometry.setAttribute('color', colors)
  //   colors.needsUpdate = true
  // }, 3000);
  console.log(mesh)

  function paintPathTiles(data) {
    const h = data.length
    const w = data[0].length
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        if (data[i][j] === 1) {
          paintTile(i, j, 0.3, mapColors)
        }
      }
    }
  }

  function paintTile(row, col, val, buffer) {
    const startIdx = (row * TILES_IN_WIDTH + col * TILE_SIZE) * 18
    for (let i = startIdx; i < startIdx + 18; i++) {
      buffer.array[i] = val
    }
  }

})
