import * as THREE from 'three'
import PF from 'pathfinding'
import { Grid } from './grid/grid'
import { getHeightData } from './shared/getHeightData'
import pathMap from '../assets/path-map-10x10.png'
import { GameScene } from './map/scene'
import { BufferAttribute, Float16BufferAttribute, Float32BufferAttribute } from 'three'

const rootEl = document.body

const start = [0, 8]
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
  console.log(grid);

  // const gridNodes = new Grid(rootEl, grid, new PF.AStarFinder(), start, end)
  // gridNodes.setStart()
  // gridNodes.setEnd()
  // gridNodes.onUpdate = () => {
  //   gridNodes.createGrid()
  //   console.log('recreate grid');
  // }


  const scene = new GameScene()
  scene.render()

  const geometry = new THREE.BoxGeometry()
  geometry.computeFaceNormals()
  geometry.computeVertexNormals()
  const material = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    color: '#ccf'
  })
  const cube = new THREE.Mesh(geometry, material)
  scene.addObjectToScene(cube)

  const planeGeometry = new THREE.PlaneGeometry(10, 10, 9, 9)
  const planeMaterial = new THREE.MeshLambertMaterial({
    side: THREE.DoubleSide,
    // color: '#cfffcf',
    color: '#000',
    wireframe: true
  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotation.x = -Math.PI / 2
  scene.addObjectToScene(plane)

  const pathMapGeom = new THREE.BufferGeometry()
  console.log(pathMapGeom);

})
