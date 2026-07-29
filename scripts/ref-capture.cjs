/* 抓 haoqi.design 圖片「進場 / 退場」的連續格 */
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/ref"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await page.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })

  // 等 loader 跑完
  for (let i = 0; i < 40; i++) {
    const ready = await page.evaluate(() => {
      const sc = document.querySelector(".lenis")
      return !!sc && sc.scrollHeight > 3000
    })
    if (ready) break
    await new Promise((r) => setTimeout(r, 1000))
  }
  await new Promise((r) => setTimeout(r, 4000))

  const state = () =>
    page.evaluate(() => {
      const sc = document.querySelector(".lenis")
      return { top: Math.round(sc.scrollTop), h: sc.scrollHeight }
    })

  console.log("loaded", JSON.stringify(await state()))

  await page.mouse.move(720, 450)

  // 慢慢往下推，每推一次連拍幾格，看圖片跨過畫面底部時發生什麼
  let n = 0
  for (let step = 0; step < 14; step++) {
    await page.mouse.wheel({ deltaY: 260 })
    for (let f = 0; f < 3; f++) {
      await page.screenshot({ path: `${OUT}/s${String(n).padStart(3, "0")}.jpg`, type: "jpeg", quality: 78 })
      n++
      await new Promise((r) => setTimeout(r, 90))
    }
    await new Promise((r) => setTimeout(r, 260))
  }

  console.log("after", JSON.stringify(await state()), "frames", n)
  await browser.close()
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
