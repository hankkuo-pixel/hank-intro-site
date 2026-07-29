/* 參考站的自訂游標：第一頁 vs 之後的頁 */
const puppeteer = require("puppeteer-core")
const sharp = require("sharp")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/cursor"
const fs = require("fs")
;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await pg.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await pg.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }
  await new Promise(r=>setTimeout(r,5000))

  const probe = async (tag) => {
    // 先把游標放到定點並停一下
    await pg.mouse.move(700, 450, { steps: 20 })
    await new Promise(r=>setTimeout(r, 1200))
    const shot = await pg.screenshot({ type: "png", clip: { x: 520, y: 280, width: 360, height: 340 } })
    await sharp(shot).resize({ width: 720, kernel: "nearest" }).jpeg({ quality: 92 }).toFile(`${OUT}/${tag}.jpg`)

    const state = await pg.evaluate(() => {
      const cs = getComputedStyle
      const out = { bodyCursor: cs(document.body).cursor, htmlCursor: cs(document.documentElement).cursor }
      out.fixedTop = [...document.querySelectorAll("*")]
        .filter((e) => cs(e).position === "fixed" && cs(e).pointerEvents === "none")
        .slice(0, 10)
        .map((e) => {
          const r = e.getBoundingClientRect()
          const s = cs(e)
          return {
            tag: e.tagName,
            cls: (e.className.baseVal ?? e.className ?? "").toString().slice(0, 90),
            rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
            op: s.opacity, z: s.zIndex, blend: s.mixBlendMode,
            bg: s.backgroundImage.slice(0, 60),
            border: s.borderColor + " " + s.borderWidth,
            filter: s.filter.slice(0, 60),
          }
        })
      return out
    })
    console.log(`--- ${tag} ---`)
    console.log(JSON.stringify(state, null, 1))
  }

  await probe("p1-hero")

  // 往下捲兩三頁
  await pg.mouse.move(700, 450)
  for (let i = 0; i < 6; i++) { await pg.mouse.wheel({ deltaY: 320 }); await new Promise(r=>setTimeout(r, 400)) }
  await new Promise(r=>setTimeout(r, 2500))
  await probe("p2-dark")

  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
