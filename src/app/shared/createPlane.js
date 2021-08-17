export function createPlane(width, height, size, y = 0) {
  const TILES_IN_WIDTH = width / size
  const TILES_IN_HEIGHT = height / size
  const arr = new Float32Array(TILES_IN_WIDTH * TILES_IN_HEIGHT * 3 * 6)
  let top = -height / 2
  let p = 0
  for (let i = 0; i < TILES_IN_HEIGHT; i++) {
    let left = -width / 2
    for (let j = 0; j < TILES_IN_WIDTH; j++) {
      arr[p] = left
      arr[p + 1] = y
      arr[p + 2] = top + size

      arr[p + 3] = left + size
      arr[p + 4] = y
      arr[p + 5] = top + size

      arr[p + 6] = left + size
      arr[p + 7] = y
      arr[p + 8] = top

      arr[p + 9] = left + size
      arr[p + 10] = y
      arr[p + 11] = top

      arr[p + 12] = left
      arr[p + 13] = y
      arr[p + 14] = top

      arr[p + 15] = left
      arr[p + 16] = y
      arr[p + 17] = top + size

      left += size
      p += 18
    }
    top += size
  }
  return arr
}