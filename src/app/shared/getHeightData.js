export function getHeightData(img, scale = 1) {
  const canvas = document.createElement('canvas')
  const w = img.width
  const h = img.height
  // const w = 20
  // const h = 20
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  const rowsData = Array.from(Array(h), () => Array(w).fill(0))

  ctx.drawImage(img, 0, 0)

  const imgData = ctx.getImageData(0, 0, w, h)
  const pixels = imgData.data

  let p = 0
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      const pixelRGB = pixels[p] + pixels[p + 1] + pixels[p + 2]
      // console.log(p / 4, pixelRGB)
      p += 4
      if (pixelRGB === 0) rowsData[i][j] = 1
      else rowsData[i][j] = 0
    }    
  }
console.log(rowsData);
  return rowsData
}

// 0 1 0 1
// 1 0 0 0
// 0 0 1 1