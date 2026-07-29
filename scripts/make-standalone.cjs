/* 產生「單一 HTML 檔」：不用伺服器、不用網路，滑鼠雙擊就能開。
 *
 * 做法：把 dist/ 的 CSS、JS、所有圖片全部轉成內嵌資料塞進同一個檔案。
 * 幾個必要的取捨（都會在最後印出來）：
 *   - 影片 21MB 太大，改成擷取一張畫面當靜態圖
 *   - 貼紙與大圖會縮小，否則檔案會膨脹到 50MB 以上
 *   - 標題字型內嵌，中文字型交給系統（Mac 上會用蘋方，視覺差異很小）
 *
 * 用法：node scripts/make-standalone.cjs
 * 產出：自我介紹（單機版）.html
 */
const fs = require("node:fs")
const path = require("node:path")
const { execFileSync } = require("node:child_process")
const sharp = require("sharp")

const root = path.resolve(__dirname, "..")
const dist = path.join(root, "dist")
const OUT = path.join(root, "自我介紹（單機版）.html")
const TMP = path.join(root, ".standalone-tmp")

const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" }

// 縮圖上限：貼紙用不到 1024，大圖 1800 已足夠全螢幕看
const MAX = { sticker: 560, full: 1800, other: 1600 }

const report = { inlined: 0, bytesBefore: 0, bytesAfter: 0, skipped: [] }

function budget(rel) {
  if (rel.includes("images/fall/")) return MAX.sticker
  if (rel.includes("uploads/full/")) return MAX.full
  return MAX.other
}

async function toDataUri(rel) {
  const file = path.join(dist, rel)
  if (!fs.existsSync(file)) {
    report.skipped.push(rel)
    return null
  }
  const ext = path.extname(file).toLowerCase()
  const mime = MIME[ext]
  if (!mime) {
    report.skipped.push(rel)
    return null
  }
  const before = fs.statSync(file).size
  let buf
  if (ext === ".svg") {
    buf = fs.readFileSync(file)
  } else {
    const img = sharp(file)
    const meta = await img.metadata()
    const cap = budget(rel)
    const resized = Math.max(meta.width, meta.height) > cap ? img.resize(cap, cap, { fit: "inside" }) : img
    buf = ext === ".png" ? await resized.png({ compressionLevel: 9 }).toBuffer() : await resized.jpeg({ quality: 80 }).toBuffer()
  }
  report.inlined++
  report.bytesBefore += before
  report.bytesAfter += buf.length
  return `data:${mime};base64,${buf.toString("base64")}`
}

;(async () => {
  let html = fs.readFileSync(path.join(dist, "index.html"), "utf8")

  // --- 1) 影片換成擷取的畫面（21MB 內嵌會讓檔案大到打不開）---
  fs.mkdirSync(TMP, { recursive: true })
  const mp4 = path.join(dist, "uploads/life-dive-clip.mp4")
  let poster = null
  if (fs.existsSync(mp4)) {
    const shot = path.join(TMP, "dive-poster.jpg")
    try {
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "6", "-i", mp4, "-frames:v", "1", "-vf", "scale=1200:-1", shot])
      poster = `data:image/jpeg;base64,${fs.readFileSync(shot).toString("base64")}`
    } catch (e) {
      console.warn("影片畫面擷取失敗，該格會留空：", e.message)
    }
  }
  if (poster) {
    // 把 <video ...> 換成同樣位置的圖片佔位，維持版面不跑掉
    html = html.replace(
      /<video class="tl-media life-video"[^>]*><\/video>/g,
      `<span class="tl-media gl-image" data-gl-src="__POSTER__" data-gl-real style="aspect-ratio: 960 / 540" data-full="__POSTER__" role="button" tabindex="0"></span>`
    )
    html = html.split("__POSTER__").join(poster)
  }

  // --- 2) 收集所有還沒處理的圖片路徑並轉成內嵌資料 ---
  const re = /(?:\.\/)?(?:images|uploads)\/[A-Za-z0-9_./@()-]+\.(?:jpg|jpeg|png|webp|svg)/g
  const paths = [...new Set(html.match(re) || [])].map((p) => p.replace(/^\.\//, ""))
  const map = {}
  for (const rel of paths) map[rel] = await toDataUri(rel)
  // 由長到短取代，避免短路徑先吃掉長路徑的一部分
  for (const rel of paths.sort((a, b) => b.length - a.length)) {
    if (!map[rel]) continue
    html = html.split(`./${rel}`).join(map[rel]).split(rel).join(map[rel])
  }

  // --- 2.5) 掉落貼紙的路徑是程式執行時才組出來的，不在 HTML 裡，要另外處理 ---
  // 先把每張貼紙轉成內嵌資料，再在打包好的程式碼裡把「組路徑」換成「查表」
  const fallDir = path.join(dist, "images/fall")
  const fallMap = {}
  if (fs.existsSync(fallDir)) {
    for (const f of fs.readdirSync(fallDir).filter((n) => n.endsWith("-cut.png"))) {
      const uri = await toDataUri("images/fall/" + f)
      if (uri) fallMap[f.replace("-cut.png", "")] = uri
    }
  }

  // --- 3) CSS 與 JS 內嵌 ---
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+)"[^>]*>/g, (_, f) =>
    `<style>${fs.readFileSync(path.join(dist, f), "utf8")}</style>`
  )
  html = html.replace(/<script type="module"[^>]*src="\.\/(assets\/[^"]+)"[^>]*><\/script>/g, (_, f) =>
    // 內嵌的 module script 不需要網路請求，file:// 下可以正常執行
    {
      let js = fs.readFileSync(path.join(dist, f), "utf8")
      // 把 `images/fall/${i}-cut.png` 換成查表，貼紙才不會去讀本機檔案
      const before = js
      js = js.replace(/`images\/fall\/\$\{(\w+)\}-cut\.png`/g, (_, v) => `(window.__FALL__[${v}])`)
      if (js === before) console.warn("警告：找不到貼紙路徑的組法，貼紙可能無法顯示")
      return `<script>window.__FALL__=${JSON.stringify(fallMap)}<\/script><script type="module">${js}<\/script>`
    }
  )

  // --- 4) 標題字型內嵌（中文交給系統字型）---
  // 把 Google Fonts 的 CSS 原封不動搬過來，只把裡面的字型網址換成內嵌資料，
  // 這樣 font-weight 與 unicode-range 的宣告都會保留（只抓一個檔會掉粗體）
  html = html.replace(/<link[^>]*fonts\.(googleapis|gstatic)\.com[^>]*>/g, "")
  const cssFile = path.join(TMP, "fonts.css")
  if (fs.existsSync(cssFile)) {
    let css = fs.readFileSync(cssFile, "utf8")
    const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/g) || [])]
    let n = 0
    for (const u of urls) {
      const files = fs.readdirSync(TMP).filter((f) => f.endsWith(".woff2"))
      const local = path.join(TMP, files[n] || "")
      if (!files[n] || !fs.existsSync(local)) continue
      css = css.split(u).join(`data:font/woff2;base64,${fs.readFileSync(local).toString("base64")}`)
      n++
    }
    html = html.replace("</head>", `<style>${css}</style></head>`)
    console.log(`字型內嵌 ${n} / ${urls.length} 個切片`)
  } else {
    console.warn("沒有字型檔，標題會改用系統字型")
  }

  fs.writeFileSync(OUT, html)
  fs.rmSync(TMP, { recursive: true, force: true })

  const mb = (n) => (n / 1048576).toFixed(1) + " MB"
  console.log(`產出：${path.basename(OUT)}  ${mb(fs.statSync(OUT).size)}`)
  console.log(`內嵌圖片 ${report.inlined} 張：原始 ${mb(report.bytesBefore)} → 壓縮後 ${mb(report.bytesAfter)}`)
  if (poster) console.log("影片已換成擷取的靜態畫面")
  if (report.skipped.length) console.log("略過：", report.skipped.join(", "))
})()
