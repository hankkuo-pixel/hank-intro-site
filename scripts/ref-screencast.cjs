/* 用 CDP screencast 錄 haoqi.design 滾動中的每一影格 */
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/cast"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const URL = process.argv[2] || "https://haoqi.design/"
const SCROLL_TO = Number(process.argv[3] || 1500)

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
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 })

  const isRef = URL.includes("haoqi.design")
  for (let i = 0; i < 40; i++) {
    const ready = await page.evaluate(
      (isRef) => (isRef ? !!document.querySelector(".lenis") && document.querySelector(".lenis").scrollHeight > 3000 : true),
      isRef
    )
    if (ready) break
    await new Promise((r) => setTimeout(r, 1000))
  }
  await new Promise((r) => setTimeout(r, 4000))
  await page.mouse.move(720, 450)

  const top = () =>
    page.evaluate((isRef) => Math.round(isRef ? document.querySelector(".lenis").scrollTop : window.scrollY), isRef)

  while ((await top()) < SCROLL_TO) {
    await page.mouse.wheel({ deltaY: 240 })
    await new Promise((r) => setTimeout(r, 300))
  }
  await new Promise((r) => setTimeout(r, 2500))
  console.log("start top =", await top())

  const client = await page.createCDPSession()
  const frames = []
  client.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
    frames.push({ data, t: metadata.timestamp })
    try {
      await client.send("Page.screencastFrameAck", { sessionId })
    } catch {}
  })
  await client.send("Page.startScreencast", { format: "jpeg", quality: 85, everyNthFrame: 1 })

  await new Promise((r) => setTimeout(r, 300))
  await page.mouse.wheel({ deltaY: 600 })
  await new Promise((r) => setTimeout(r, 1800))
  await client.send("Page.stopScreencast")

  frames.forEach((f, i) => {
    fs.writeFileSync(`${OUT}/f${String(i).padStart(3, "0")}.jpg`, Buffer.from(f.data, "base64"))
  })
  console.log("frames =", frames.length, "end top =", await top())
  await browser.close()
})().catch((e) => {
  console.error("FAILED", e.message)
  process.exit(1)
})
