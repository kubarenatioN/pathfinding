export function convertCoordsFromLeftTopToCenter(x, y, width, height) {
  const centerW = width / 2
  const centerH = height / 2
  const newX = -centerW + x
  const newY = -centerH + y
  return [newX, newY]
}

export function convertCoordsFromCenterToLeftTop(x, y, width, height) {
  const centerW = width / 2
  const centerH = height / 2
  const newX = centerW + x
  const newY = centerH + y
  return [newX, newY]
}