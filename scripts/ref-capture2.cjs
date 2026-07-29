/* 近拍 haoqi.design 圖片進場（畫面底部）與退場（畫面頂部）的邊緣形狀 */
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/ref2"
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

  // 先滾到卡片快要進場的位置
  while ((await top()) < 620) {
    await page.mouse.wheel({ deltaY: 200 })
    await new Promise((r) => setTimeout(r, 320))
  }

  // 進場：近拍畫面下半部
  let n = 0
  for (let step = 0; step < 10; step++) {
    await page.mouse.wheel({ deltaY: 200 })
    for (let f = 0; f < 2; f++) {
      await page.screenshot({
        path: `${OUT}/enter-${String(n).padStart(2, "0")}_top${await top()}.jpg`,
        type: "jpeg",
        quality: 90,
        clip: { x: 460, y: 460, width: 960, height: 440 },
      })
      n++
      await new Promise((r) => setTimeout(r, 110))
    }
    await new Promise((r) => setTimeout(r, 300))
  }

  // 退場：讓同一張卡片往畫面上方離開，近拍上半部
  n = 0
  for (let step = 0; step < 12; step++) {
    await page.mouse.wheel({ deltaY: 260 })
    for (let f = 0; f < 2; f++) {
      await page.screenshot({
        path: `${OUT}/exit-${String(n).padStart(2, "0")}_top${await top()}.jpg`,
        type: "jpeg",
        quality: 90,
        clip: { x: 460, y: 0, width: 960, height: 440 },
      })
      n++
      await new Promise((r) => setTimeout(r, 110))
    }
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log("done, top =", await top())
  await browser.close()
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
