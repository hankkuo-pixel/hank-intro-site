/* 用 headless Chrome 實際跑一次網站，截圖 + 檢查：
   - console 有沒有錯
   - WebGL 圖層有沒有真的建起來、幾張圖載到
   - 貼圖平面有沒有對準 DOM 佔位框
   - 滾動中 / 靜止 的 velocity 值
   用法：node scripts/verify.cjs [url] [outDir]
*/
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const path = require("path")

const URL = process.argv[2] || "http://127.0.0.1:8091/"
const OUT = process.argv[3] || path.join(__dirname, "..", "verify-shots")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "--hide-scrollbars",
      "--no-sandbox",
    ],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

  const logs = []
  page.on("console", (m) => logs.push(`[${m.type()}] ${m.text()}`))
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`))
  page.on("requestfailed", (r) => logs.push(`[requestfailed] ${r.url()} ${r.failure() && r.failure().errorText}`))

  await page.goto(URL, { waitUntil: "networkidle0", timeout: 30000 })
  await new Promise((r) => setTimeout(r, 2500)) // 等貼圖載入 + 進場動畫跑完

  const shot = (name) => page.screenshot({ path: path.join(OUT, name), type: "jpeg", quality: 82 })

  await shot("01-hero-rest.jpg")

  // 靜止時的狀態
  const rest = await page.evaluate(() => {
    const h = window.__hank
    return {
      hasGl: !!h.gl,
      itemCount: h.gl ? h.gl.items.length : 0,
      loaded: h.gl ? h.gl.items.filter((i) => i.loaded).length : 0,
      velocity: h.gl ? +h.gl.velocity.toFixed(4) : null,
      revealDone: getComputedStyle(document.querySelector(".hero-intro")).opacity,
      maskDone: getComputedStyle(document.querySelector(".hero-title .mask > span")).transform,
      docH: document.documentElement.scrollHeight,
      // 貼圖平面 vs 佔位框對位誤差（px）
      align: h.gl
        ? h.gl.items
            .filter((i) => i.mesh.visible)
            .map((i) => {
              const r = i.el.getBoundingClientRect()
              const expectX = r.left + r.width / 2 - innerWidth / 2
              const expectY = -(r.top + r.height / 2) + innerHeight / 2
              return {
                src: i.el.dataset.glSrc.split("/").pop(),
                dx: +(i.mesh.position.x - expectX).toFixed(2),
                dy: +(i.mesh.position.y - expectY).toFixed(2),
                dw: +(i.mesh.scale.x - r.width).toFixed(2),
                dh: +(i.mesh.scale.y - r.height).toFixed(2),
              }
            })
        : [],
    }
  })

  // 滾動中：連續滾 + 立刻截圖，抓破圖那一瞬間
  await page.evaluate(() => {
    window.__peak = 0
    const t = () => {
      window.__peak = Math.max(window.__peak, Math.abs(window.__hank.gl.velocity))
      requestAnimationFrame(t)
    }
    requestAnimationFrame(t)
  })
  await page.mouse.move(720, 450)
  await page.mouse.wheel({ deltaY: 1400 })
  await new Promise((r) => setTimeout(r, 120))
  const moving = await page.evaluate(() => ({
    velocity: +window.__hank.gl.velocity.toFixed(4),
    peak: +window.__peak.toFixed(4),
  }))
  await shot("02-scroll-moving.jpg")

  await new Promise((r) => setTimeout(r, 1600))
  await shot("03-about-rest.jpg")

  const sectionShots = ["work", "index", "offwork"]
  for (let i = 0; i < sectionShots.length; i++) {
    await page.evaluate((id) => window.__hank.lenis.scrollTo("#" + id, { immediate: false }), sectionShots[i])
    await new Promise((r) => setTimeout(r, 2200))
    await shot(`0${4 + i}-${sectionShots[i]}.jpg`)
  }

  // 回到最上面再做一次「滾動中」對照
  await page.evaluate(() => window.__hank.lenis.scrollTo(0, { immediate: true }))
  await new Promise((r) => setTimeout(r, 1200))
  await page.evaluate(() => (window.__peak = 0))
  await page.mouse.wheel({ deltaY: 2200 })
  await new Promise((r) => setTimeout(r, 150))
  const movingFast = await page.evaluate(() => ({
    velocity: +window.__hank.gl.velocity.toFixed(4),
    peak: +window.__peak.toFixed(4),
  }))
  await shot("07-scroll-fast.jpg")

  console.log(
    JSON.stringify(
      {
        rest,
        moving,
        movingFast,
        consoleErrors: logs.filter((l) => /pageerror|\[error\]|requestfailed/.test(l)),
        consoleAll: logs.slice(0, 25),
        shots: fs.readdirSync(OUT),
      },
      null,
      1
    )
  )

  await browser.close()
})().catch((e) => {
  console.error("VERIFY FAILED:", e)
  process.exit(1)
})
