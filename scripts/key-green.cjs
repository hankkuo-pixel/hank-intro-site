/* 綠幕去背：codex imagegen 產的是 #00E000 綠底，這支把它去掉並修綠邊
   用法：node scripts/key-green.cjs public/images/fall/star.png [輸出檔]
        node scripts/key-green.cjs public/images/fall   ← 整個資料夾 */
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

const T0 = 30 // 幕色度低於這個 → 完全不透明
const T1 = 95 // 幕色度高於這個 → 完全透明

/* 讀四角像素判斷幕色是綠幕還是洋紅幕。
   螢光綠的貼紙不能用綠幕（會連物件一起被去掉），那種改用洋紅幕。 */
function detectKey(data, width, height, channels) {
  const px = (x, y) => {
    const i = (y * width + x) * channels
    return [data[i], data[i + 1], data[i + 2]]
  }
  const corners = [px(4, 4), px(width - 5, 4), px(4, height - 5), px(width - 5, height - 5)]
  let green = 0
  for (const [r, g, b] of corners) {
    if (g - Math.max(r, b) > 40) green++
  }
  return green >= 3 ? "green" : "magenta"
}

async function key(src, dst) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.from(data)
  const mode = detectKey(data, width, height, channels)

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // 綠幕看綠色突出程度；洋紅幕看紅藍同時突出、綠色凹陷的程度
    const greenness = mode === "green" ? g - Math.max(r, b) : Math.min(r, b) - g

    let alpha = 255
    if (greenness > T0) {
      const t = Math.min(1, (greenness - T0) / (T1 - T0))
      alpha = Math.round(255 * (1 - t))
    }

    // 去幕色殘留（despill）
    if (alpha > 0 && greenness > 0) {
      const k = Math.min(1, greenness / T1)
      if (mode === "green") {
        const cap = Math.max(r, b)
        out[i + 1] = Math.round(g - (g - cap) * k)
      } else {
        const cap = g
        out[i] = Math.round(r - (r - cap) * k)
        out[i + 2] = Math.round(b - (b - cap) * k)
      }
    }
    out[i + 3] = alpha
  }

  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(dst)

  // 回報去掉多少、剩下的邊界框
  let minX = width, minY = height, maxX = 0, maxY = 0, opaque = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (out[(y * width + x) * channels + 3] > 8) {
        opaque++
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  return {
    file: path.basename(dst),
    key: mode,
    size: `${width}×${height}`,
    keptPct: ((opaque / (width * height)) * 100).toFixed(1) + "%",
    bbox: `${minX},${minY} → ${maxX},${maxY}`,
  }
}

;(async () => {
  const target = process.argv[2]
  if (!target) return console.error("要給檔案或資料夾路徑")

  const files = fs.statSync(target).isDirectory()
    ? fs.readdirSync(target).filter((f) => f.endsWith(".png") && !f.endsWith("-cut.png")).map((f) => path.join(target, f))
    : [target]

  for (const f of files) {
    const dst = process.argv[3] && files.length === 1 ? process.argv[3] : f.replace(/\.png$/, "-cut.png")
    console.log(JSON.stringify(await key(f, dst)))
  }
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
