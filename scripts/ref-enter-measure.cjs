/* 錄下卡片從畫面底部進場的過程，逐格量：左右邊界（有沒有縮放）、上緣形狀（有沒有彎）、平均亮度（有沒有淡入） */
const puppeteer = require("puppeteer-core")
const sharp = require("sharp")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/enter"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

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

  while ((await top()) < 1150) {
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
  await new Promise((r) => setTimeout(r, 250))
  await page.mouse.wheel({ deltaY: 400 })
  await new Promise((r) => setTimeout(r, 2600))
  await client.send("Page.stopScreencast")
  await browser.close()

  console.log("frames =", frames.length)

  for (let i = 0; i < frames.length; i++) {
    const buf = Buffer.from(frames[i], "base64")
    fs.writeFileSync(`${OUT}/f${String(i).padStart(2, "0")}.png`, buf)
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    const W = info.width,
      H = info.height,
      C = info.channels
    const px = (x, y) => {
      const j = (y * W + x) * C
      return [data[j], data[j + 1], data[j + 2]]
    }
    const lum = (x, y) => {
      const [r, g, b] = px(x, y)
      return 0.299 * r + 0.587 * g + 0.114 * b
    }

    // 找畫面下半部最上面那個 lime 標籤（進場中的卡片）
    let tagY = null,
      tagX = null
    outer: for (let y = 380; y < H; y++) {
      for (let x = 60; x < W - 60; x++) {
        const [r, g, b] = px(x, y)
        if (r > 170 && g > 210 && b < 130) {
          tagY = y
          tagX = x
          break outer
        }
      }
    }
    if (tagY === null) {
      console.log(`f${i} 找不到進場卡片`)
      continue
    }

    // 卡片上緣（沿著標籤下方 40px 的那一橫排找左右邊界）
    const rowY = Math.min(H - 2, tagY + 40)
    let left = null,
      right = null
    for (let x = 30; x < W - 30; x++) {
      if (lum(x, rowY) > 45) {
        left = x
        break
      }
    }
    for (let x = W - 30; x > 30; x--) {
      if (lum(x, rowY) > 45) {
        right = x
        break
      }
    }

    // 上緣曲線：沿卡片寬度取 5 個點
    let profile = []
    if (left && right) {
      for (let k = 0; k <= 4; k++) {
        const x = Math.round(left + ((right - left) * k) / 4)
        let hit = null
        for (let y = Math.max(0, tagY - 30); y < Math.min(H - 1, tagY + 200); y++) {
          if (lum(x, y) > 45) {
            hit = y
            break
          }
        }
        profile.push(hit)
      }
    }

    // 卡片內部平均亮度
    let sum = 0,
      cnt = 0
    if (left && right) {
      for (let y = rowY; y < Math.min(H - 2, rowY + 80); y += 4) {
        for (let x = left + 10; x < right - 10; x += 8) {
          sum += lum(x, y)
          cnt++
        }
      }
    }

    console.log(
      `f${String(i).padStart(2, "0")} tagY=${tagY} left=${left} right=${right} width=${right - left} 上緣=${JSON.stringify(
        profile
      )} 內部亮度=${cnt ? (sum / cnt).toFixed(1) : "-"}`
    )
  }
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
