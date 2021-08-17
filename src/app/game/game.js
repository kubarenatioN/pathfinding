import { CONSTANTS } from '../shared/constants'
import { convertCoordsFromCenterToLeftTop, convertCoordsFromLeftTopToCenter } from '../shared/convertCoords'
import { setInTileCenter, setTileLeftTop } from '../shared/setInTileCenter'

export class Game {
  constructor(scene, controller) {
    this.scene = scene
    scene.onMove = this.startMove
    this.controller = controller
    this.speed = 0.04
  }

  addHeroMesh(mesh) {
    this.heroMesh = mesh
    this.scene.add(this.heroMesh)
  }

  setHeroPosition(pos) {
    this.controller.setPosition(pos)
    const [oldX, oldY] = pos
    const [x, y] = convertCoordsFromLeftTopToCenter(oldX, oldY, this.controller.grid.sizex, this.controller.grid.sizey)
    this.startPos = setInTileCenter(x, y, CONSTANTS.TILE_SIZE)
    const [xc, yc] = this.startPos
    this.startX = xc
    this.startY = yc
    this.heroMesh.position.x = xc
    this.heroMesh.position.z = yc
    console.log(this.heroMesh.position)
  }

  startMove = (endPos, endCoords) => {
    this.setEnd(endPos)
    let path = this.controller.grid.findPath(
      this.startPos[0],
      this.startPos[1],
      endPos[0],
      endPos[1]
    )
    path = path.filter((p, i) => i > 0).map(step => setInTileCenter(step[0], step[1], CONSTANTS.TILE_SIZE)).map(step => convertCoordsFromLeftTopToCenter(step[0], step[1], CONSTANTS.MAP_WIDTH, CONSTANTS.MAP_HEIGHT))
    path[path.length - 1] = [endCoords.x, endCoords.z]
    console.log(endCoords)
    this.movePath = path
    this.moveStep = 0
    this.isMoving = true
    console.log(path)
  }

  setEnd(endPos) {
    this.controller.grid.end = endPos
    // console.log('set end')
    this.endX = endPos[0]
    this.endY = endPos[1]
  }

  start() {
    this.animate()
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.scene.render()
    if (this.isMoving && this.movePath.length > 0) {
      this.move()
    }
  }

  move() {
    if (this.moveStep === this.movePath.length) {
      this.isMoving = false
      this.moveStep = 0
      return
    }
    const [curEndX, curEndY] = this.movePath[this.moveStep]
    // let deltaX = (curEndX - this.startX) * this.speed
    // let deltaY = (curEndY - this.startY) * this.speed
    let deltaX = Math.sign(curEndX - this.startX) * this.speed
    let deltaY = Math.sign(curEndY - this.startY) * this.speed
    this.heroMesh.position.x += deltaX
    this.heroMesh.position.z += deltaY
    this.startX += deltaX
    this.startY += deltaY
    if (Math.abs(curEndX - this.startX) < 0.05
      && Math.abs(curEndY - this.startY) < 0.05) {
      this.startX = curEndX
      this.startY = curEndY
      this.heroMesh.position.x = this.startX
      this.heroMesh.position.z = this.startY
      if (this.moveStep < this.movePath.length - 1) {
        let coordsLeftTop = convertCoordsFromCenterToLeftTop(this.startX, this.startY, 10, 10)
        coordsLeftTop = setTileLeftTop(
          coordsLeftTop[0],
          coordsLeftTop[1],
          CONSTANTS.TILE_SIZE
        )
        console.log(coordsLeftTop)
        this.controller.grid.start = coordsLeftTop
      }
      this.moveStep++
    }

  }
}