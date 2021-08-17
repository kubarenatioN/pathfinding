import * as THREE from 'three'
import { CubeTextureLoader } from 'three'
import { CameraTrigger } from './cameraTriggers/cameraTrigger'
import { CameraParams } from './cameraParams/cameraParams'
import { CONSTANTS } from '../shared/constants'
import { convertCoordsFromCenterToLeftTop } from '../shared/convertCoords'

export class GameScene {

  onMove

  constructor() {
    this.refreshViewportSize()
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color('#eee')

    this.setUpCamera()

    this.setUpLight()

    this.renderer = new THREE.WebGL1Renderer()
    this.renderer.setSize(...this.viewportSizes)
    document.body.append(this.renderer.domElement)

    // this.createModel()
    this.setResizeHandler()
    this.setRaycasting()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  setRaycasting() {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.renderer.domElement.addEventListener('contextmenu', this.walk)
  }

  walk = (e) => {
    e.preventDefault()
    let coords
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersects = this.raycaster.intersectObjects(this.scene.children)
    if (!intersects.map(i => i.object.name).includes('map')) return
    coords = this.getCoordsUnderMouse(e)
    let gridCoords = convertCoordsFromCenterToLeftTop(coords.x, coords.z, CONSTANTS.MAP_WIDTH, CONSTANTS.MAP_HEIGHT)
    gridCoords = gridCoords.map(c => Math.floor(c))
    console.log('coords:', gridCoords, coords);
    this.onMove(gridCoords, coords)
  }

  getCoordsUnderMouse(event) {
    let vec = new THREE.Vector3() // create once and reuse
    let pos = new THREE.Vector3() // create once and reuse

    vec.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      - (event.clientY / window.innerHeight) * 2 + 1,
      0.5)

    vec.unproject(this.camera)

    vec.sub(this.camera.position).normalize()

    const distance = -this.camera.position.y / vec.y

    pos.copy(this.camera.position).add(vec.multiplyScalar(distance))
    return pos
  }

  setResizeHandler() {
    window.addEventListener('resize', () => {
      this.refreshViewportSize()
      this.camera.aspect = this.calcCameraAspect()
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(...this.viewportSizes)
    }, false)
  }

  refreshViewportSize() {
    this.w = window.innerWidth
    this.h = window.innerHeight
  }

  calcCameraAspect() {
    return this.w / this.h
  }

  get viewportSizes() {
    return [this.w, this.h]
  }

  setUpLight() {
    this.light = new THREE.SpotLight('#fff')
    this.light.position.set(0, 100, 1)
    this.scene.add(this.light)
  }

  setUpCamera() {
    this.screenAspect = this.calcCameraAspect()
    this.camera = new THREE.PerspectiveCamera(65, this.screenAspect, 0.1, 1000)
    this.camera.position.set(0, 10, 3)
    this.camera.lookAt(0, 0, 0)
    this.setCameraControlls()
  }

  add(object) {
    this.scene.add(object)
  }

  setCameraControlls() {
    this.cameraOptions = new CameraParams(this.camera)
    this.cameraTrigger = new CameraTrigger(this.camera)
    this.cameraTrigger.setSideTrigger(
      this.cameraTrigger.left.el,
      'x',
      true)
    this.cameraTrigger.setSideTrigger(
      this.cameraTrigger.right.el,
      'x',
      false)
    this.cameraTrigger.setSideTrigger(
      this.cameraTrigger.top.el,
      'z',
      true)
    this.cameraTrigger.setSideTrigger(
      this.cameraTrigger.bottom.el,
      'z',
      false)
    this.cameraTrigger.setCornerTrigger(
      this.cameraTrigger.topLeft.el,
      true,
      true
    )
    this.cameraTrigger.setCornerTrigger(
      this.cameraTrigger.topRight.el,
      false,
      true
    )
    this.cameraTrigger.setCornerTrigger(
      this.cameraTrigger.bottomLeft.el,
      true,
      false
    )
    this.cameraTrigger.setCornerTrigger(
      this.cameraTrigger.bottomRight.el,
      false,
      false
    )
  }
}
