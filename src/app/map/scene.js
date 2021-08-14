import * as THREE from 'three'
import { CubeTextureLoader } from 'three'
import {CameraTrigger} from './cameraTriggers/cameraTrigger'
import {CameraParams} from './cameraParams/cameraParams'

export class GameScene {
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
  }

  render() {
    this.animate()
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.renderer.render(this.scene, this.camera)
  }

  // createModel() {
  //   const geometry = new THREE.BoxGeometry()
  //   geometry.computeFaceNormals()
  //   geometry.computeVertexNormals();
  //   const material = new THREE.MeshLambertMaterial({ 
  //     side: THREE.DoubleSide,
  //     color: '#ccc'
  //   })
  //   const cube = new THREE.Mesh(geometry, material)
  //   this.scene.add(cube)
  // }

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
    this.camera.position.set(0, 10, 0)
    this.camera.lookAt(0, 0, 0)
    this.setCameraControlls()
  }

  addObjectToScene(object) {
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
