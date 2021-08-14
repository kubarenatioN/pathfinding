import * as THREE from 'three'
import Component from '../../component/component'
import './cameraTrigger.css'

export class CameraTrigger {

  constructor(camera) {
    this.camera = camera
    this.pos = camera.position
    const vFOV = THREE.MathUtils.degToRad(this.camera.fov)
    this.screenHeight = 2 * Math.tan(vFOV / 2) * this.camera.position.y // visible height
    this.screenWidth = this.screenHeight * this.camera.aspect
  }

  SHIFT = 1

  sidesParent = document.body
  left = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--left'])
  right = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--right'])
  top = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--top'])
  bottom = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--bottom'])
  topLeft = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--top-left'])
  topRight = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--top-right'])
  bottomLeft = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--bottom-left'])
  bottomRight = new Component(this.sidesParent, 'div', ['camera-trigger', 'camera-trigger--bottom-right'])



  setSideTrigger(trigger, coord, isPositive = true, speed = 0.2) {
    let intervalId
    trigger.addEventListener('mouseover', (e) => {
      intervalId = setInterval(() => {
        const value = (isPositive ? -this.SHIFT : this.SHIFT) * speed
        const screenOffset = coord === 'z' ? this.screenHeight / 2 : this.screenWidth / 2
        if (this.pos[coord] + screenOffset > 50 && !isPositive) return
        if (this.pos[coord] - screenOffset < -50 && isPositive) return
        this.pos[coord] += value
        // console.log(this.camera)
      }, 10)
    })
    trigger.addEventListener('mouseleave', (e) => {
      clearInterval(intervalId)
    })
  }

  setCornerTrigger(trigger, isLeft = true, isTop = true, speed = 0.2) {
    let intervalId
    trigger.addEventListener('mouseover', (e) => {
      intervalId = setInterval(() => {
        const heightOffset = this.screenHeight / 2
        const widthOffset = this.screenWidth / 2
        const valueX = isLeft ? -this.SHIFT : this.SHIFT
        const valueY = isTop ? -this.SHIFT : this.SHIFT
        if (this.pos.x + widthOffset > 50 && !isLeft) this.pos.x = 50 - widthOffset
        if (this.pos.x - widthOffset < -50 && isLeft) this.pos.x = -50 + widthOffset
        if (this.pos.z - heightOffset < -50 && isTop) this.pos.z = -50 + heightOffset
        if (this.pos.z + heightOffset > 50 && !isTop) this.pos.z = 50 - heightOffset
        this.pos.x += valueX * speed
        this.pos.z += valueY * speed
        // console.log(this.pos)
      }, 10)
    })
    trigger.addEventListener('mouseleave', (e) => {
      clearInterval(intervalId)
    })
  }
}