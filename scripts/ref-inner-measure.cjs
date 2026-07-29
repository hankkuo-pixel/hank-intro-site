/* 量 haoqi.design 卡片「框內貼圖」在進場時有沒有縮放 / 位移
   方法：把每一格的卡片內部裁成同一個相對範圍，取欄向與列向的亮度剖面，
        再跟「定位後」那格做 1D 比對，找最合的縮放與位移量。 */
const puppeteer = require("puppeteer-core")
const sharp = require("sharp")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/inner"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

const NB = 240 // 剖面取樣點數

function profileFromRaw(data, W, C, x0, x1, y0, y1, axis) {
  const n = NB
  const out = new Array(n).fill(0)
  for (let k = 0; k < n; k++) {
    let s = 0,
      c = 0
    if (axis === "col") {
      const x = Math.round(x0 + ((x1 - x0) * k) / (n - 1))
      for (let y = y0; y < y1; y += 3) {
        const j = (y * W + x) * C
        s += 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]
        c++
      }
    } else {
      const y = Math.round(y0 + ((y1 - y0) * k) / (n - 1))
      for (let x = x0; x < x1; x += 3) {
        const j = (y * W + x) * C
        s += 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]
        c++
      }
    }
    out[k] = c ? s / c : 0
  }
  // 正規化，排除整體亮度差異的干擾
  const mean = out.reduce((a, b) => a + b, 0) / n
  const sd = Math.sqrt(out.reduce((a, b) => a + (b - mean) ** 2, 0) / n) || 1
  return out.map((v) => (v - mean) / sd)
}

// 在 scale / shift 兩個維度找最小差異
function bestFit(p, ref) {
  let best = { scale: 1, shift: 0, err: Infinity }
  const n = p.length
  for (let s = 0.8; s <= 1.25001; s += 0.01) {
    for (let sh = -30; sh <= 30; sh += 1) {
      let e = 0,
        c = 0
      for (let k = 0; k < n; k++) {
        // 把 ref 依 scale 對中心縮放、再位移，取樣比對
        const src = (k - n / 2) * s + n / 2 + sh
        const i = Math.round(src)
        if (i < 0 || i >= n) continue
        e += (p[k] - ref[i]) ** 2
        c++
      }
      if (c > n * 0.7) {
        e /= c
        if (e < best.err) best = { scale: +s.toFixed(2), shift: sh, err: +e.toFixed(4) }
      }
    }
  }
  return best
}

;(async () => {
  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i = 0; i < 40; i++) {
    const ok = await page.evaluate(() => !!document.querySelector(".lenis") && document.querySelector(".lenis").scrollHeight > 3000)
    if (ok) break
    await new Promise((r) => setTimeout(r, 1000))
  }
  await new Promise((r) => setTimeout(r, 4000))
  await page.mouse.move(720, 450)
  const top = () => page.evaluate(() => Math.round(document.querySelector(".lenis").scrollTop))

  // 停在第一張大卡片還沒進畫面的位置
  while ((await top()) < 400) {
    await page.mouse.wheel({ deltaY: 200 })
    await new Promise((r) => setTimeout(r, 320))
  }
  await new Promise((r) => setTimeout(r, 2500))
  console.log("start top =", await top())

  const client = await page.createCDPSession()
  const frames = []
  client.on("Page.screencastFrame", async ({ data, sessionId }) => {
    frames.push(data)
    try {
      await client.send("Page.screencastFrameAck", { sessionId })
    } catch {}
  })
  await client.send("Page.startScreencast", { format: "png", everyNthFrame: 1 })
  await new Promise((r) => setTimeout(r, 200))
  await page.mouse.wheel({ deltaY: 700 })
  await new Promise((r) => setTimeout(r, 3200))
  await client.send("Page.stopScreencast")
  await browser.close()
  console.log("frames =", frames.length)

  // 逐格找卡片（淺色大矩形）的上下左右，裁出「相對於卡片」的內部剖面
  const recs = []
  for (let i = 0; i < frames.length; i++) {
    const buf = Buffer.from(frames[i], "base64")
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    const W = info.width,
      H = info.height,
      C = info.channels
    const lum = (x, y) => {
      const j = (y * W + x) * C
      return 0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]
    }
    // 卡片左右邊界固定在版位上：掃中央一列找淺色區塊
    let cardTop = null
    for (let y = 60; y < H - 5; y++) {
      if (lum(900, y) > 120 && lum(700, y) > 120 && lum(1100, y) > 120) {
        cardTop = y
        break
      }
    }
    if (cardTop === null) {
      recs.push(null)
      continue
    }
    let left = null,
      right = null
    const probeY = Math.min(H - 3, cardTop + 12)
    for (let x = 20; x < W - 20; x++) if (lum(x, probeY) > 120) { left = x; break }
    for (let x = W - 20; x > 20; x--) if (lum(x, probeY) > 120) { right = x; break }
    if (!left || !right || right - left < 400) { recs.push(null); continue }

    // 只鎖定目標卡片（定位後寬 868），避免混到別的元素
    if (right - left < 850 || right - left > 890) { recs.push(null); continue }

    // 薄帶：相對卡片上緣往下 5~45px。卡片才露出 45px 就能量，
    // 抓得到「剛冒出來」那幾格（上一版要 315px 才能量，等於錯過整個進場）。
    const y0 = cardTop + 5
    const y1 = cardTop + 45
    if (y1 > H - 3) { recs.push(null); continue }

    recs.push({
      i,
      cardTop,
      left,
      right,
      width: right - left,
      visibleH: y1 - y0,
      col: profileFromRaw(data, W, C, left + 20, right - 20, y0, y1, "col"),
      row: profileFromRaw(data, W, C, left + 20, right - 20, y0, y1, "row"),
      lumMean: (() => { let s2 = 0, c2 = 0; for (let y = y0; y < y1; y += 2) for (let x = left + 20; x < right - 20; x += 6) { s2 += lum(x, y); c2++ } return +(s2 / c2).toFixed(1) })(),
    })
    fs.writeFileSync(`${OUT}/f${String(i).padStart(2, "0")}.png`, buf)
  }

  const valid = recs.filter(Boolean)
  if (!valid.length) return console.log("沒抓到卡片")
  const settled = valid[valid.length - 1]

  // 存出「最早可比較的一格」與「定位後」的同一塊區域，肉眼對照
  for (const r of [valid[0], settled]) {
    const buf = Buffer.from(frames[r.i], "base64")
    await sharp(buf)
      .extract({ left: r.left, top: r.cardTop + 5, width: r.width, height: 40 })
      .jpeg({ quality: 92 })
      .toFile(`${OUT}/band-f${String(r.i).padStart(2, "0")}.jpg`)
  }
  console.log(`\n基準（定位後）f${settled.i}: 卡片寬=${settled.width} 上緣=${settled.cardTop}\n`)
  console.log("frame  卡片上緣  卡片寬  可見高   欄向(縮放/位移)      列向(縮放/位移)")
  for (const r of valid) {
    const c = bestFit(r.col, settled.col)
    const w = bestFit(r.row, settled.row)
    console.log(
      `f${String(r.i).padStart(2, "0")}    ${String(r.cardTop).padStart(5)}   ${String(r.width).padStart(5)}   ${String(
        r.visibleH
      ).padStart(5)}    scale=${c.scale} shift=${String(c.shift).padStart(3)}     scale=${w.scale} shift=${String(w.shift).padStart(3)}   亮度=${r.lumMean}`
    )
  }
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
