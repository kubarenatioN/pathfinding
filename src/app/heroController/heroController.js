import * as THREE from 'three'

export class HeroController {
  constructor(grid) {
    this.grid = grid
  }

  setPosition(pos) {
    this.start = pos
    this.grid.setStart()
  }

  
}