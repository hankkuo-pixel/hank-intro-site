/* 量參考站 hero 的格線間距與背景做法 */
const puppeteer = require("puppeteer-core")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
;(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  await pg.goto("https://haoqi.design/", { waitUntil: "networkidle2", timeout: 60000 })
  for (let i=0;i<40;i++){ const ok=await pg.evaluate(()=>!!document.querySelector(".lenis")&&document.querySelector(".lenis").scrollHeight>3000); if(ok)break; await new Promise(r=>setTimeout(r,1000)) }
  await new Promise(r=>setTimeout(r,5000))

  const out = await pg.evaluate(() => {
    const svg = [...document.querySelectorAll("svg")].find((s) => s.getAttribute("viewBox") === "0 0 1440 900")
    const res = { found: !!svg, lines: [] }
    if (svg) {
      svg.querySelectorAll("path").forEach((p) => {
        const d = p.getAttribute("d") || ""
        // 只抽座標數字，推出線的位置，不複製路徑
        const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) || []
        const xs = new Set(), ys = new Set()
        for (let i = 0; i + 1 < nums.length; i += 2) { xs.add(Math.round(nums[i])); ys.add(Math.round(nums[i + 1])) }
        res.lines.push({
          strokeW: getComputedStyle(p).strokeWidth,
          stroke: getComputedStyle(p).stroke,
          xs: [...xs].sort((a, b) => a - b).slice(0, 12),
          ys: [...ys].sort((a, b) => a - b).slice(0, 12),
        })
      })
    }
    res.rootBg = getComputedStyle(document.documentElement).backgroundColor
    res.bodyBg = getComputedStyle(document.body).backgroundColor
    res.canvasRect = (() => { const c = document.querySelector("canvas"); const r = c.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)] })()
    return res
  })
  console.log(JSON.stringify(out, null, 1))
  await b.close()
})().catch(e=>{console.error("FAILED",e.message);process.exit(1)})
