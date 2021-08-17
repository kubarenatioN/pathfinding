export function setInTileCenter(x, y, tileSize) {
  return [x + tileSize / 2, y + tileSize / 2]
}

export function setTileLeftTop(x, y, tileSize) {
  return [x - tileSize / 2, y - tileSize / 2]
}