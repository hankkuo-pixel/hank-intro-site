/* 看 haoqi.design hero 的裝飾／墜落元素是什麼做的 */
const puppeteer = require("puppeteer-core")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
;(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await pg.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await pg.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }
  await new Promise(r=>setTimeout(r,5000))

  const info = await pg.evaluate(() => {
    const svgs = [...document.querySelectorAll("svg")].map((s) => {
      const r = s.getBoundingClientRect()
      const kids = {}
      s.querySelectorAll("*").forEach((k) => (kids[k.tagName] = (kids[k.tagName] || 0) + 1))
      const p = s.querySelector("path")
      return {
        cls: (s.getAttribute("class") || "").slice(0, 80),
        viewBox: s.getAttribute("viewBox"),
        w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left),
        kids,
        fill: p ? getComputedStyle(p).fill : null,
        stroke: p ? getComputedStyle(p).stroke : null,
        strokeW: p ? getComputedStyle(p).strokeWidth : null,
        pathLen: p && p.getAttribute("d") ? p.getAttribute("d").length : 0,
        anim: s.getAnimations ? s.getAnimations({ subtree: true }).length : 0,
      }
    })
    return { svgCount: svgs.length, svgs, canvasCount: document.querySelectorAll("canvas").length }
  })
  console.log(JSON.stringify(info, null, 1))
  await pg.screenshot({ path: "/Users/hankkuo/Desktop/claude-ai/作品網站/hank-intro-site/verify-shots/ref-hero.jpg", type: "jpeg", quality: 92 })
  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
