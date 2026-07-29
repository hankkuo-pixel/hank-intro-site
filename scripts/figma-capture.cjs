/* 用 puppeteer 驅動 capture.html，確保頁面真的渲染完再上傳到 Figma */
const puppeteer = require("puppeteer-core")
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
const CAPTURE_ID = process.argv[2]
const URL = process.argv[3] || "http://127.0.0.1:8091/capture.html"
;(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new",
    args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--hide-scrollbars"] })
  const pg = await b.newPage()
  await pg.setViewport({ width: 1440, height: 900 })
  pg.on("console", (m) => { if (/figma|capture|error/i.test(m.text())) console.log("  [page]", m.text().slice(0, 160)) })
  await pg.goto(URL, { waitUntil: "networkidle0", timeout: 60000 })
  await new Promise((r) => setTimeout(r, 6000))

  const info = await pg.evaluate(() => ({
    h: document.body.scrollHeight,
    imgs: document.querySelectorAll("img").length,
    sections: document.querySelectorAll(".section").length,
    hasFigma: typeof window.figma !== "undefined",
  }))
  console.log("頁面狀態:", JSON.stringify(info))

  if (!info.hasFigma) {
    const r = await pg.evaluate(() =>
      fetch("https://mcp.figma.com/mcp/html-to-design/capture.js").then((x) => x.text())
    )
    await pg.evaluate((src) => { const el = document.createElement("script"); el.textContent = src; document.head.appendChild(el) }, r)
    await new Promise((x) => setTimeout(x, 2500))
  }
  console.log("figma 物件就緒:", await pg.evaluate(() => typeof window.figma !== "undefined"))

  await pg.evaluate((id) => {
    return window.figma.captureForDesign({
      captureId: id,
      endpoint: `https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true`,
      selector: "body",
    })
  }, CAPTURE_ID)
  console.log("已送出擷取，等待上傳完成…")
  await new Promise((r) => setTimeout(r, 75000))
  await b.close()
  console.log("done")
})().catch((e) => { console.error("FAILED", e.message); process.exit(1) })
