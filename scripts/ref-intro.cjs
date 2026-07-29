/* 從導航開始就錄，抓 haoqi.design 的 loading → 開場轉場 → hero 進場 */
const puppeteer = require("puppeteer-core")
const fs = require("fs")
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/intro"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
;(async () => {
  fs.rmSync(OUT, { recursive: true, force: true })
  fs.mkdirSync(OUT, { recursive: true })
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

  const client = await pg.createCDPSession()
  const frames = []
  client.on("Page.screencastFrame", async ({ data, sessionId, metadata }) => {
    frames.push({ data, t: metadata.timestamp })
    try { await client.send("Page.screencastFrameAck", { sessionId }) } catch {}
  })
  await client.send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1 })

  const t0 = Date.now()
  await pg.goto("https://haoqi.design/", { waitUntil: "domcontentloaded", timeout: 60000 })
  await new Promise((r) => setTimeout(r, 26000))
  await client.send("Page.stopScreencast")

  console.log("frames =", frames.length, " 總時長(s) =", ((Date.now()-t0)/1000).toFixed(1))
  const base = frames[0].t
  frames.forEach((f, i) => {
    if (i % 4 !== 0) return
    const ms = Math.round((f.t - base) * 1000)
    fs.writeFileSync(`${OUT}/${String(i).padStart(3,"0")}_${ms}ms.jpg`, Buffer.from(f.data, "base64"))
  })
  console.log("存出", fs.readdirSync(OUT).length, "格")
  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
