/* 同一張卡片：靜止 vs 滾動中，同一個裁切範圍 A/B */
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/ref3"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })

  for (let i = 0; i < 40; i++) {
    const ready = await page.evaluate(() => {
      const sc = document.querySelector(".lenis")
      return !!sc && sc.scrollHeight > 3000
    })
    if (ready) break
    await new Promise((r) => setTimeout(r, 1000))
  }
  await new Promise((r) => setTimeout(r, 4000))
  await page.mouse.move(720, 450)

  const top = () => page.evaluate(() => Math.round(document.querySelector(".lenis").scrollTop))

  // 滾到第一張大卡片大致置中
  while ((await top()) < 1500) {
    await page.mouse.wheel({ deltaY: 240 })
    await new Promise((r) => setTimeout(r, 300))
  }
  await new Promise((r) => setTimeout(r, 2500)) // 完全靜止

  const clip = { x: 400, y: 60, width: 1040, height: 780 }
  await page.screenshot({ path: `${OUT}/A-rest.jpg`, type: "jpeg", quality: 92, clip })

  // 滾動中連拍
  await page.mouse.wheel({ deltaY: 500 })
  for (let i = 0; i < 4; i++) {
    await page.screenshot({ path: `${OUT}/B-moving-${i}.jpg`, type: "jpeg", quality: 92, clip })
    await new Promise((r) => setTimeout(r, 90))
  }

  // 停下來再拍一次確認回正
  await new Promise((r) => setTimeout(r, 2500))
  await page.screenshot({ path: `${OUT}/C-rest-after.jpg`, type: "jpeg", quality: 92, clip })

  console.log("done, top =", await top())
  await browser.close()
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
