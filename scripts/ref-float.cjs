/* 參考站的 hello 靜止時會不會漂浮？同一塊區域隔一段時間比對像素 */
const puppeteer = require("puppeteer-core")
const sharp = require("sharp")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
;(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await pg.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await pg.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }
  await new Promise(r=>setTimeout(r,8000)) // 完全靜止

  const clip = { x: 380, y: 300, width: 700, height: 320 }
  const shots = []
  for (let i = 0; i < 5; i++) {
    shots.push(await pg.screenshot({ type: "png", clip }))
    await new Promise((r) => setTimeout(r, 1400))
  }

  // 逐張跟第一張比：算平均絕對差 + 找出最大位移
  const base = (await sharp(shots[0]).greyscale().raw().toBuffer({ resolveWithObject: true }))
  for (let i = 1; i < shots.length; i++) {
    const cur = await sharp(shots[i]).greyscale().raw().toBuffer({ resolveWithObject: true })
    let diff = 0
    for (let k = 0; k < base.data.length; k++) diff += Math.abs(base.data[k] - cur.data[k])
    console.log(`第 ${i} 張（+${i * 1.4}s）平均像素差 = ${(diff / base.data.length).toFixed(2)}`)
  }
  await sharp(shots[0]).jpeg({quality:90}).toFile("/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/ref-float-0.jpg")
  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
