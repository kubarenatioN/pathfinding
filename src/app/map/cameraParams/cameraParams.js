export class CameraParams {
  constructor(camera, x = 0, y = 40, z = 0) {
    this.camera = camera
    this.coords = {
      x,
      y,
      z
    }
    this.lookAt = {
      x: this.coords.x,
      y: 0,
      z: this.coords.z + this.coords.y / 5
    }
  }

  setCameraPosition() {
    const cameraCoords = Object.values(this.coords)
    this.camera.position.set(...cameraCoords)
  }
}