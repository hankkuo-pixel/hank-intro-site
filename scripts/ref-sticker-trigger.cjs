/* 貼紙是不是滑鼠互動觸發的？在 hero 大量移動游標 + 點擊，看有沒有東西掉出來 */
const puppeteer = require("puppeteer-core")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const OUT = "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/stickers"
const fs = require("fs")
;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await pg.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await pg.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }
  await new Promise(r=>setTimeout(r,5000))
  await pg.screenshot({ path: `${OUT}/x0-before.jpg`, type: "jpeg", quality: 88 })

  // 大幅度來回移動游標
  for (let i = 0; i < 40; i++) {
    const x = 200 + Math.abs(((i * 97) % 1000)) 
    const y = 200 + Math.abs(((i * 53) % 500))
    await pg.mouse.move(x, y, { steps: 6 })
    await new Promise(r=>setTimeout(r, 60))
  }
  await pg.screenshot({ path: `${OUT}/x1-after-move.jpg`, type: "jpeg", quality: 88 })

  // 點擊幾下
  for (let i = 0; i < 6; i++) {
    await pg.mouse.click(400 + i * 120, 300 + (i % 3) * 120)
    await new Promise(r=>setTimeout(r, 350))
  }
  await new Promise(r=>setTimeout(r, 1500))
  await pg.screenshot({ path: `${OUT}/x2-after-click.jpg`, type: "jpeg", quality: 88 })

  // 網路請求裡有沒有貼紙圖檔
  const reqs = []
  pg.on("request", (r) => reqs.push(r.url()))
  await pg.mouse.move(700, 400, { steps: 10 })
  await new Promise(r=>setTimeout(r, 2000))

  console.log(JSON.stringify(await pg.evaluate(() => ({
    imgs: document.querySelectorAll("img").length,
    canvases: document.querySelectorAll("canvas").length,
  }))))
  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
