/* 參考站 hero 的掉落貼紙：等久一點、連續截圖看它們出現 */
const puppeteer = require("puppeteer-core")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/stickers"
const fs = require("fs")
;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await pg.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await pg.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }

  for (let t = 0; t < 8; t++) {
    await new Promise(r=>setTimeout(r, 4000))
    await pg.screenshot({ path: `${OUT}/t${t}.jpg`, type: "jpeg", quality: 88 })
    const info = await pg.evaluate(() => ({
      imgs: document.querySelectorAll("img").length,
      svgs: document.querySelectorAll("svg").length,
      canvases: document.querySelectorAll("canvas").length,
      bgEls: [...document.querySelectorAll("*")].filter(e=>getComputedStyle(e).backgroundImage!=="none").length,
    }))
    console.log(`t${t} (${(t+1)*4}s)`, JSON.stringify(info))
  }
  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
