/* =========================================================
   進入點
   - 一頁一畫面：Lenis 停用自由滾動，滾輪／滑動／方向鍵一次切一頁
   - 切頁時該頁動畫重播（.is-active）
   - 單一 rAF 迴圈：Lenis → CSS 變數 → WebGL 圖層
   ========================================================= */

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { createGlLayer, glConfig } from "./gl.js"
import { createFallPile, fallConfig } from "./fall.js"

/* ---------- Lenis：只當作切頁的動畫引擎，不接受滾輪自由滾動 ---------- */
/* 導覽模式總開關
   true  = 一頁一畫面：滾輪被攔截，一次跳一頁（原本的行為）
   false = 一般連續捲動：滾輪照常，整份文件平順地捲，區塊進場改由「捲進視窗」觸發
   兩種模式的進場動畫都會播，差別只在有沒有整頁吸附。 */
const PAGED = false

const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo out
  smoothWheel: !PAGED, // 連續模式下讓 lenis 接管滾輪，捲起來才平順
  autoRaf: false,
})
if (PAGED) lenis.stop()
document.body.classList.toggle("mode-flow", !PAGED)

/* ---------- WebGL 圖層 ---------- */
const canvas = document.getElementById("glCanvas")
const gl = createGlLayer(canvas)

/* ---------- DOM ---------- */
const sections = [...document.querySelectorAll(".section")]
const bgLayer = document.getElementById("bgLayer")
const pageRail = document.getElementById("pageRail")
const pageCount = document.getElementById("pageCount")
const cursorLayer = document.getElementById("cursorLayer")

const navButtons = [...document.querySelectorAll("[data-go]")]
const clockEl = document.getElementById("clock")

/* ---------- hero 掉落貼紙 ----------
   清單改這裡就好，檔案放 public/images/fall/<name>-cut.png（去背後的檔）。
   位置、大小、時間、飄移、旋轉全部隨機，而且每跑完一輪重新隨機一次。 */
const STICKERS = ["star", "nib", "smiley", "rod", "shoe", "fin", "bottle", "palm", "beer", "cat"]
const heroFalling = document.getElementById("heroFalling")
const fallPile = createFallPile(
  heroFalling,
  STICKERS.map((n) => `images/fall/${n}-cut.png`),
  () => gl && gl.scan(),
  (el) => gl && gl.removeItem(el)
)

/* ---------- 作品頁：頁內橫向推 ---------- */
/* 生活頁已改成縱向時間軸，不再有橫向 slide。
   下面這組變數保留是因為 rAF 與切頁邏輯還參照它們，全部給 null 就整段不執行 */
const workSection = null
const workTrack = null
const workCountEl = null
const workDots = null
const workSlides = workTrack ? [...workTrack.children] : []
const lifeViewport = workTrack ? workTrack.parentElement : null

/* 卡片寬度不一（橫的直的混排），所以用「一個視窗寬」當一步，
   而不是一張一步 —— 免得 19 張要按 18 次 */
function lifeStep() {
  return lifeViewport ? lifeViewport.clientWidth : 1
}
function lifeMax() {
  if (!workTrack || !lifeViewport) return 0
  const over = workTrack.scrollWidth - lifeViewport.clientWidth
  return Math.max(0, Math.ceil(over / lifeStep()))
}
const workPage = sections.indexOf(workSection)

let workIndex = 0
let workX = 0 // 目前橫向位置（單位：張）
let prevWorkX = 0

function buildLifeDots() {
  if (!workDots) return
  workDots.textContent = ""
  for (let i = 0; i <= lifeMax(); i++) {
    const dot = document.createElement("button")
    dot.setAttribute("aria-label", `life ${i + 1}`)
    dot.addEventListener("click", () => setWork(i))
    workDots.appendChild(dot)
  }
}
buildLifeDots()
let workDotEls = workDots ? [...workDots.children] : []

function setWork(i, opts = {}) {
  const n = Math.max(0, Math.min(lifeMax(), i))
  if (locked && !opts.force) return
  workIndex = n
  if (opts.immediate) {
    workX = n
    prevWorkX = n
  }
  workDotEls.forEach((d, k) => d.classList.toggle("is-active", k === n))
  if (workCountEl) workCountEl.textContent = `${String(n + 1).padStart(2, "0")} / ${String(lifeMax() + 1).padStart(2, "0")}`
  if (gl) gl.setActive(workSection, null)
  if (!opts.immediate) {
    locked = true
    clearTimeout(unlockTimer)
    unlockTimer = setTimeout(() => (locked = false), 900)
  }
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))
let endRise = 0  // 0→1：越接近結尾越大，驅動藍色回歸
let fallRise = 0 // 0→1：貼紙從底部往上浮散（結尾的收尾）

const PAGE_DURATION = 0.9 // 切頁動畫秒數（1.15 太長，推的力道會被拖掉）
const COOLDOWN = 260 // 動畫結束後再擋一下，避免觸控板慣性連跳

let index = 0
let locked = false
let unlockTimer = null

/* ---------- 右側頁碼 ---------- */
pageRail.style.setProperty("--section-count", String(sections.length))
sections.forEach((section, i) => {
  const dot = document.createElement("button")
  dot.style.top = `calc(${i} * 100% / ${sections.length})`
  dot.setAttribute("aria-label", section.id || `page ${i + 1}`)
  dot.addEventListener("click", () => goTo(i))
  pageRail.appendChild(dot)
})
const railDots = [...pageRail.children]

/* ---------- 切頁 ---------- */
/* dir：+1 往下（新頁由下往上推進來）、-1 往回（新頁由上往下落）
   舊頁標 .is-leaving，樣式讓它先加速走；新頁晚 120ms 才減速卡位，
   這個時間差就是「被下面推上來」的來源（見 styles.css 切頁三層）。 */
function setActive(i, dir = 1) {
  const prev = sections.findIndex((s) => s.classList.contains("is-active"))
  document.body.classList.toggle("nav-up", dir < 0)
  document.body.classList.toggle("nav-down", dir >= 0)
  sections.forEach((s, n) => {
    s.classList.toggle("is-active", n === i)
    s.classList.toggle("is-leaving", n === prev && prev !== i)
  })
  railDots.forEach((d, n) => d.classList.toggle("is-active", n === i))
  navButtons.forEach((b) => b.classList.toggle("is-active", parseInt(b.dataset.go, 10) === i))
  if (pageCount) pageCount.textContent = `${String(i + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`
  // hero 的藍底只在第一頁

  // 游標：第一頁光暈，之後綠色線條十字
  document.body.classList.toggle("cursor-glow-on", i === 0)
  // 掉落貼紙：切走時整層淡出，切回第一頁就整組重來
  const wasHero = document.body.classList.contains("hero-active")
  document.body.classList.toggle("hero-active", i === 0 && document.body.classList.contains("intro-done"))
  if (gl) {
    gl.setFallGhost(i === 0 ? 0 : 1 - fallRise)
    // hero 主視覺：在第一頁時轉正且不透明，離開時轉開並淡出
    if (document.body.classList.contains("intro-done")) {
      if (i === 0) {
        // 回到第一頁不走原路倒帶：趁還全透明時瞬間擺到 -80°，再轉回 0，
        // 看起來像它繼續往同方向轉了一圈回來，比倒帶有實體感。
        if (prev > 0) gl.setTurnNow(-1)
        gl.setTurn(0)
        gl.setHeroFade(1)
      } else {
        gl.setTurn(1)
        gl.setHeroFade(0)
      }
    }
  }
  if (i === 0 && !wasHero && fallPile) fallPile.reset()
  if (document.body.classList.contains("intro-done")) {
    if (i === 0) playType()
    else if (sections[i].id === "ending") playType(sections[i])
  }
  // 這一頁的圖片重播進場（作品頁要連目前這張一起指定）
  if (gl) gl.setActive(sections[i], i === workPage ? workSlides[workIndex] : null)
  if (sections[i].id) history.replaceState(null, "", `#${sections[i].id}`)
}

function goTo(target, opts = {}) {
  const i = Math.max(0, Math.min(sections.length - 1, target))
  if (locked && !opts.force) return
  if (i === index && !opts.force) return

  const fromBelow = i < index
  index = i
  freeTarget = null // 換頁後自由捲動的目標要重新起算
  subStep = fromBelow ? pageSteps(i) : 0
  if (i === workPage && workSlides.length) setWork(fromBelow ? lifeMax() : 0, { force: true, immediate: true })
  if (i === tlPage) setTl(fromBelow ? tlMax() : 0, { force: true, immediate: true })
  setActive(i, fromBelow ? -1 : 1)

  locked = PAGED // 連續模式不上鎖，否則點導覽跳頁後會有一秒不能捲
  clearTimeout(unlockTimer)
  lenis.scrollTo(sections[i].offsetTop + subOffset(i, subStep), {
    force: true,
    duration: opts.immediate ? 0 : PAGE_DURATION,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  })
  unlockTimer = setTimeout(() => (locked = false), (opts.immediate ? 0 : PAGE_DURATION * 1000) + COOLDOWN)
}

// 在作品頁時，先橫向推完三張再換頁
/* 內容比一個畫面高的頁（例如照設計稿原尺寸的 ABOUT），
   先在頁內一段一段往下捲，捲到底才換下一頁。 */
let subStep = 0
/* 內容比一屏長的頁面改成一般捲動 —— 分頁式在這種頁會一滾就衝過一大段。
   其他頁維持「一頁一畫面」，Hello 的進退場與背景漸變都還是綁在切頁事件上 */
const FREE_SCROLL = new Set(["about"])
function isFree(i) {
  return !!sections[i] && FREE_SCROLL.has(sections[i].id) && pageSteps(i) > 0
}

/* 在自由捲動頁：捲到頂/底才換頁，中間就照捲動距離走。
   目標要用 freeTarget 累加，不能每次都從「目前位置」重算——
   連續滾的時候上一格還在動，cur 永遠落後，累積不起來就會覺得超級慢。 */
let freeTarget = null
const FREE_SPEED = 0.8 // 比一般網頁略慢一點（1.15 的七成），配合這個站的節奏

function freeScroll(dy) {
  const sec = sections[index]
  if (!sec) return
  const top = sec.offsetTop
  const bottom = top + Math.max(0, sec.scrollHeight - window.innerHeight)
  const cur = typeof lenis.scroll === "number" ? lenis.scroll : window.scrollY
  // 目標還在這一頁的範圍內就沿用，否則以目前位置重新起算
  const base = freeTarget !== null && freeTarget >= top - 40 && freeTarget <= bottom + 40 ? freeTarget : cur
  const target = base + dy * FREE_SPEED
  if (target < top - 6) {
    freeTarget = null
    return prev()
  }
  if (target > bottom + 6) {
    freeTarget = null
    return next()
  }
  freeTarget = Math.min(bottom, Math.max(top, target))
  lenis.scrollTo(freeTarget, {
    force: true, // lenis 平常是 stop 狀態（只當動畫引擎），沒有 force 不會動
    duration: 0.28,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  })
}

function pageSteps(i) {
  const sec = sections[i]
  if (!sec) return 0
  return Math.max(0, Math.ceil((sec.scrollHeight - window.innerHeight) / window.innerHeight))
}
function subOffset(i, n) {
  const sec = sections[i]
  if (!sec) return 0
  // 最後一段夾到剛好對齊區塊底部，不要捲過頭（過頭會把 sticky 的左欄推出畫面）
  const max = Math.max(0, sec.scrollHeight - window.innerHeight)
  return Math.min(n * window.innerHeight, max)
}

function scrollSub(n) {
  subStep = n
  locked = true
  clearTimeout(unlockTimer)
  lenis.scrollTo(sections[index].offsetTop + subOffset(index, n), {
    force: true,
    duration: PAGE_DURATION,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  })
  unlockTimer = setTimeout(() => (locked = false), PAGE_DURATION * 1000 + COOLDOWN)
}

function next() {
  if (!isFree(index) && subStep < pageSteps(index)) return scrollSub(subStep + 1)
  if (index === workPage && workIndex < lifeMax()) return setWork(workIndex + 1)
  if (index === tlPage && tlIndex < tlMax()) return setTl(tlIndex + 1)
  goTo(index + 1)
}

function prev() {
  if (!isFree(index) && subStep > 0) return scrollSub(subStep - 1)
  if (index === workPage && workIndex > 0) return setWork(workIndex - 1)
  if (index === tlPage && tlIndex > 0) return setTl(tlIndex - 1)
  goTo(index - 1)
}

/* ---------- 時間軸：頁內橫向推 ----------
   跟作品頁同一套，但一次推一「站」，推到軸的盡頭才換頁。 */
const tlTrack = document.getElementById("tlTrack")
const tlCountEl = document.getElementById("tlCount")
const tlStops = tlTrack ? [...tlTrack.children] : []
const tlPage = sections.findIndex((s) => s.querySelector && s.querySelector("#tlTrack"))
let tlIndex = 0
let tlX = 0
let prevTlX = 0

/* 垂直軸：一「站」的間距 = 一列的高度 */
function tlPitch() {
  if (tlStops.length < 2) return tlStops[0] ? tlStops[0].offsetHeight : 1
  return Math.abs(tlStops[1].offsetTop - tlStops[0].offsetTop) || tlStops[0].offsetHeight
}

function tlMax() {
  if (!tlTrack) return 0
  const over = tlTrack.scrollHeight - tlTrack.parentElement.clientHeight
  return Math.max(0, Math.ceil(over / tlPitch()))
}

function setTl(i, opts = {}) {
  const n = Math.max(0, Math.min(tlMax(), i))
  if (locked && !opts.force) return
  tlIndex = n
  if (opts.immediate) {
    tlX = n
    prevTlX = n
  }
  if (tlCountEl) {
    tlCountEl.textContent = `${String(n + 1).padStart(2, "0")} / ${String(tlMax() + 1).padStart(2, "0")}`
  }
  if (!opts.immediate) {
    locked = true
    clearTimeout(unlockTimer)
    unlockTimer = setTimeout(() => (locked = false), 800)
  }
}

/* ---------- 捲到定位點才播 ----------
   ABOUT 與 LIFE 比一個畫面長（見 FREE_SCROLL），整頁綁 .is-active 的話，
   下半部的動畫在你還沒捲到就播完了。這兩頁的區塊改成各自進入視窗中段才觸發，
   離開再拿掉 → 捲回去會重播，跟切頁的行為一致。 */
const aboutSection = document.getElementById("about")
const inViewObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      e.target.classList.toggle("in-view", e.isIntersecting)
      // 捲進「生活」之後把左欄（頭像＋自介）讓開，版面整個給照片
      if (aboutSection && e.target.classList.contains("rs-block--life")) {
        aboutSection.classList.toggle("life-open", e.isIntersecting)
      }
    }
  },
  { threshold: 0.12, rootMargin: "-8% 0px -12% 0px" }
)
document
  .querySelectorAll(".tl-stop, .about .rs-block, .line-art, .section")
  .forEach((el) => inViewObserver.observe(el))

/* 潛水影片：捲進視窗才播、捲出去就暫停（21MB，不在看不到的地方空轉）。
   原本綁的是「目前頁等於作品頁」，但作品頁那個變數是空的，所以影片從來沒被播放過。
   自動播放必須靜音，瀏覽器才不會擋。 */
const videoObserver = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      const v = e.target
      v.muted = true
      v.playsInline = true
      v.playbackRate = 1 / 1.3 // 放慢成 1.3 倍長：35.5 秒 → 46.2 秒
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }
  },
  { threshold: 0.3 }
)
document.querySelectorAll(".life-video").forEach((v) => videoObserver.observe(v))

/* 連續模式：目前是第幾頁改由「哪一個區塊佔住畫面中央」決定，
   右側頁碼、Hello 的轉正淡入、掉落貼紙都還是靠這個 index 在運作。 */
let flowIndex = -1
function syncFlowIndex() {
  if (PAGED) return
  const mid = window.scrollY + window.innerHeight / 2
  let best = 0
  for (let i = 0; i < sections.length; i++) {
    const s = sections[i]
    if (mid >= s.offsetTop && mid < s.offsetTop + s.offsetHeight) {
      best = i
      break
    }
    if (mid >= s.offsetTop) best = i
  }
  if (best === flowIndex) return
  const dir = flowIndex === -1 || best > flowIndex ? 1 : -1
  flowIndex = best
  index = best
  setActive(best, dir)
}

/* ---------- 輸入：滾輪 / 觸控 / 鍵盤 ---------- */
window.addEventListener(
  "wheel",
  (e) => {
    if (!PAGED) return // 連續模式：不攔截，交給 lenis
    e.preventDefault()
    if (lb && !lb.hidden) return
    if (locked) return
    if (Math.abs(e.deltaY) < 6) return
    if (isFree(index)) return freeScroll(e.deltaY)
    e.deltaY > 0 ? next() : prev()
  },
  { passive: false }
)

let touchStartY = null
window.addEventListener("touchstart", (e) => (touchStartY = e.touches[0].clientY), { passive: true })
window.addEventListener("touchmove", (e) => PAGED && e.preventDefault(), { passive: false })
window.addEventListener(
  "touchend",
  (e) => {
    if (!PAGED) return
    if (touchStartY === null || locked) return
    const dy = touchStartY - (e.changedTouches[0]?.clientY ?? touchStartY)
    if (isFree(index)) {
      if (Math.abs(dy) > 12) freeScroll(dy * 1.6)
    } else if (Math.abs(dy) > 40) {
      ;(dy > 0 ? next : prev)()
    }
    touchStartY = null
  },
  { passive: true }
)

window.addEventListener("keydown", (e) => {
  const k = e.key
  // 幻燈片開著的時候，鍵盤歸它用
  if (lb && !lb.hidden) {
    if (k === "Escape") lbClose()
    else if (k === "ArrowRight" || k === "ArrowDown") lbShow(lbIndex + 1)
    else if (k === "ArrowLeft" || k === "ArrowUp") lbShow(lbIndex - 1)
    e.preventDefault()
    return
  }
  if (!PAGED && ["ArrowDown", "PageDown", " ", "ArrowUp", "PageUp"].includes(k)) {
    return // 連續模式：方向鍵交給瀏覽器原生捲動
  }
  if (["ArrowDown", "PageDown", " "].includes(k)) {
    e.preventDefault()
    isFree(index) ? freeScroll(window.innerHeight * 0.82) : next()
  } else if (["ArrowUp", "PageUp"].includes(k)) {
    e.preventDefault()
    isFree(index) ? freeScroll(-window.innerHeight * 0.82) : prev()
  } else if (k === "Home") {
    e.preventDefault()
    goTo(0)
  } else if (k === "End") {
    e.preventDefault()
    goTo(sections.length - 1)
  } else if (k === "d" || k === "D") {
    console.log(pin(pinnedVelocity === null ? 45 : null))
  }
})

/* ---------- 導覽 ---------- */
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => goTo(parseInt(btn.dataset.go, 10)))
})

/* ---------- 首頁文字 scramble ----------
   每個字先跳一陣亂碼（螢光綠），再定住成真正的字（回到該元素原本的顏色）。
   標題與其他文字用同一套，差別只在 data-scramble 給的起始延遲。 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|<>*#@%&+=-_■□▚▞"
const scrambleGroups = []
let typeRaf = 0

/* 把元素內的文字切成一個個 span，<br> 保留 */
function splitScramble(root) {
  const chars = []
  const walk = (node) => {
    ;[...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const txt = n.textContent.replace(/\s+/g, " ")
        if (!txt.trim()) return n.remove()
        const frag = document.createDocumentFragment()
        for (const ch of txt) {
          const sp = document.createElement("span")
          sp.className = "type-char"
          sp.dataset.ch = ch
          sp.textContent = ch === " " ? " " : ""
          frag.appendChild(sp)
          chars.push(sp)
        }
        n.replaceWith(frag)
      } else if (n.nodeType === 1 && n.tagName !== "BR") {
        walk(n)
      }
    })
  }
  walk(root)
  return chars
}

document.querySelectorAll("[data-scramble]").forEach((el) => {
  scrambleGroups.push({ el, offset: parseInt(el.dataset.scramble, 10) || 0, chars: splitScramble(el) })
})
const heroTitle = document.getElementById("heroTitle")
if (heroTitle) {
  heroTitle.querySelectorAll(".type-line").forEach((line, i) => {
    scrambleGroups.push({ el: line, offset: 380 + i * 120, chars: splitScramble(line) })
  })
}
// 結語大標也走同一套逐字動畫
const endingTitle = document.getElementById("endingTitle")
if (endingTitle) {
  endingTitle.querySelectorAll(".type-line").forEach((line, i) => {
    scrambleGroups.push({ el: line, offset: 260 + i * 120, chars: splitScramble(line) })
  })
}

/* scope 給定時只重播該區塊內的字（結語頁用），不給就是整站（首頁用，維持原行為） */
function playType(scope = null) {
  const pool = scope ? scrambleGroups.filter((g) => scope.contains(g.el)) : scrambleGroups
  if (!pool.length) return
  cancelAnimationFrame(typeRaf)

  const plan = []
  const groups = []
  for (const g of pool) {
    if (g.el) g.el.classList.remove("is-lit")
    const mine = []
    groups.push({ el: g.el, items: mine })
    g.chars.forEach((el, i) => {
      el.classList.remove("is-in", "is-done")
      if (el.dataset.ch !== " ") el.textContent = ""
      const it = {
        el,
        ch: el.dataset.ch,
        start: g.offset + i * 26, // 由左至右
        dur: 240 + Math.random() * 300,
        last: 0,
        done: false,
      }
      plan.push(it)
      mine.push(it)
    })
  }

  const t0 = performance.now()
  const step = (now) => {
    const t = now - t0
    let done = 0
    for (const p of plan) {
      if (p.ch === " ") {
        p.done = true
        done++
        continue
      }
      if (t < p.start) continue
      if (t < p.start + p.dur) {
        p.el.classList.add("is-in")
        if (now - p.last > 45) {
          p.el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          p.last = now
        }
      } else {
        p.el.textContent = p.ch
        p.el.classList.add("is-in", "is-done")
        p.done = true
        done++
      }
    }

    // 該群組的字全部定住了，才把邊框點亮
    for (const g of groups) {
      if (g.el && !g.el.classList.contains("is-lit") && g.items.every((it) => it.done)) {
        g.el.classList.add("is-lit")
      }
    }

    if (done < plan.length) typeRaf = requestAnimationFrame(step)
  }
  typeRaf = requestAnimationFrame(step)
}

/* ---------- 游標軌跡：綠色劃線 ----------
   記住游標最近 TRAIL_LIFE 毫秒的位置，每幀畫成一條頭粗尾細、逐漸淡掉的線。
   停下來就會自己散掉，不留痕跡。 */
const trailCanvas = document.getElementById("cursorTrail")
const trailCtx = trailCanvas ? trailCanvas.getContext("2d") : null
const trail = []
const TRAIL_LIFE = 520 // 一格活多久（ms）
const TRAIL_SIZE = 14 // 每格幾 px（正方形）
const TRAIL_COLOR = "192, 254, 4" // #C0FE04

// 游標層已被限寬在舞台（1920）內，canvas 要跟著層走而不是整個視窗
function stageW() {
  return cursorLayer ? cursorLayer.clientWidth : window.innerWidth
}

function resizeTrail() {
  if (!trailCanvas) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  trailCanvas.width = Math.round(stageW() * dpr)
  trailCanvas.height = Math.round(window.innerHeight * dpr)
  trailCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
}
resizeTrail()
window.addEventListener("resize", resizeTrail)
window.addEventListener("resize", () => {
  buildLifeDots()
  workDotEls = workDots ? [...workDots.children] : []
  setWork(workIndex, { force: true, immediate: true })
})

function drawTrail(now) {
  if (!trailCtx) return
  trailCtx.clearRect(0, 0, stageW(), window.innerHeight)

  while (trail.length && now - trail[0].t > TRAIL_LIFE) trail.shift()
  if (!trail.length) return

  // 一格一格的正方形色塊，越舊越淡
  for (let i = 0; i < trail.length; i++) {
    const p = trail[i]
    const k = 1 - (now - p.t) / TRAIL_LIFE // 1 = 最新
    trailCtx.fillStyle = `rgba(${TRAIL_COLOR}, ${(k * 0.95).toFixed(3)})`
    trailCtx.fillRect(p.x - TRAIL_SIZE / 2, p.y - TRAIL_SIZE / 2, TRAIL_SIZE, TRAIL_SIZE)
  }
}

/* ---------- 游標 ---------- */
if (cursorLayer) {
  window.addEventListener("pointermove", (e) => {
    // 座標要換算到舞台內（視窗比 1920 寬時左邊有留白）
    const ox = e.clientX - cursorLayer.getBoundingClientRect().left
    cursorLayer.style.setProperty("--cursor-x", ox)
    cursorLayer.style.setProperty("--cursor-y", e.clientY)
    const now = performance.now()
    // 對齊 8px 網格，同一格不重複畫，看起來才是一顆一顆的
    const gx = Math.round(ox / TRAIL_SIZE) * TRAIL_SIZE
    const gy = Math.round(e.clientY / TRAIL_SIZE) * TRAIL_SIZE
    const last = trail[trail.length - 1]
    if (!last || last.x !== gx || last.y !== gy) {
      trail.push({ x: gx, y: gy, t: now })
      if (trail.length > 160) trail.shift()
    }
  })
  // 圖片與線稿 icon 都會讓游標放大；純文字不會
  document.querySelectorAll(".gl-image, .line-art").forEach((el) => {
    el.addEventListener("pointerenter", () => document.body.classList.add("is-hovering-media"))
    el.addEventListener("pointerleave", () => document.body.classList.remove("is-hovering-media"))
  })
}


/* ---------- 照片幻燈片 ---------- */
const lb = document.getElementById("lightbox")
const lbImg = document.getElementById("lbImg")
const lbCount = document.getElementById("lbCount")
const shots = [...document.querySelectorAll("[data-full]")]
let lbIndex = 0

const lbVideo = document.getElementById("lbVideo")

function lbShow(i) {
  if (!shots.length) return
  lbIndex = (i + shots.length) % shots.length
  const el = shots[lbIndex]
  const isVideo = el.dataset.kind === "video"
  // 影片跟照片共用同一組左右切換，只是換不同容器顯示
  lbImg.hidden = isVideo
  lbVideo.hidden = !isVideo
  if (isVideo) {
    lbImg.removeAttribute("src")
    lbVideo.src = el.dataset.full
    lbVideo.play().catch(() => {})
  } else {
    lbVideo.pause()
    lbVideo.removeAttribute("src")
    lbImg.src = el.dataset.full
  }
  lbCount.textContent = `${String(lbIndex + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")}`
}
function lbOpen(i) {
  if (!lb) return
  lbShow(i)
  lb.hidden = false
  requestAnimationFrame(() => lb.classList.add("is-open"))
  document.body.classList.add("lb-on")
}
function lbClose() {
  if (!lb) return
  lbVideo?.pause()
  lb.classList.remove("is-open")
  document.body.classList.remove("lb-on")
  setTimeout(() => (lb.hidden = true), 320)
}
shots.forEach((el, i) => {
  el.addEventListener("click", () => lbOpen(i))
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      lbOpen(i)
    }
  })
})
document.getElementById("lbClose")?.addEventListener("click", lbClose)
document.getElementById("lbPrev")?.addEventListener("click", () => lbShow(lbIndex - 1))
document.getElementById("lbNext")?.addEventListener("click", () => lbShow(lbIndex + 1))
lb?.addEventListener("click", (e) => {
  if (e.target === lb) lbClose()
})

/* ---------- 時鐘 ---------- */
function tickClock() {
  if (!clockEl) return
  if (!document.body.classList.contains("intro-done")) return // 別在 scramble 途中洗掉 span
  const now = new Date()
  const tpe = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000)
  clockEl.textContent = `GMT+8 TPE ${String(tpe.getHours()).padStart(2, "0")}:${String(tpe.getMinutes()).padStart(2, "0")}`
}
tickClock()
setInterval(tickClock, 10000)

/* ---------- ABOUT 頁：整塊等比縮到一個畫面高（設計稿尺寸不變） ---------- */
const figFit = document.getElementById("figFit")
function fitAbout() {
  if (!figFit) return
  const inner = figFit.firstElementChild
  if (!inner) return
  inner.style.transform = "none"
  const avail = figFit.clientHeight
  const need = inner.scrollHeight
  // 不用 transform: scale——縮放後 WebGL 圖片的對位會跑掉（實測圖會浮在錯的位置）。
  // 改成把字級調小讓內容自然塞進一頁，這裡只回報是否還溢出。
  if (need > avail + 4) console.warn("[about] 內容仍溢出", need, ">", avail)
}
window.addEventListener("resize", fitAbout)
setTimeout(fitAbout, 300)
setTimeout(fitAbout, 1500)

/* ---------- 視窗變動：重新對位到目前頁 ---------- */
window.addEventListener("resize", () => goTo(index, { force: true, immediate: true }))

/* ---------- 除錯：把滾動速度釘住，靜止也能看到破圖效果 ----------
   按 D 開關，或在主控台打 __hank.pin(45) / __hank.pin(null) */
let pinnedVelocity = null
function pin(v) {
  pinnedVelocity = v
  return v === null ? "效果跟著切頁走" : `效果釘在 velocity=${v}`
}

/* ---------- 每幀 ---------- */
let lastTime = 0
function raf(time) {
  lenis.raf(time)
  syncFlowIndex()

  // dt 上限 32ms：分頁切回前景時物理不會一次跳一大段
  const dtMs = lastTime ? Math.min(32, time - lastTime) : 16
  lastTime = time
  /* 貼紙的三段：第一幕邊生邊落 → 第二幕整個凍住 → 結尾幕重新啟動讓它們落完再浮起。
     結尾不再生新的，只把既有的跑完，否則會愈滾愈多。 */
  if (fallPile) {
    const heroOn = document.body.classList.contains("hero-active")
    fallPile.update(dtMs, heroOn || endRise > 0.05, time, fallRise, heroOn)
  }

  // 作品頁橫推：自己 ease，順便算出橫向速度餵進 shader
  let workVel = 0
  if (workTrack) {
    prevWorkX = workX
    workX += (workIndex - workX) * 0.085
    if (Math.abs(workIndex - workX) < 0.0005) workX = workIndex
    workTrack.style.transform = `translate3d(${(-workX * lifeStep()).toFixed(1)}px, 0, 0)`
    workVel = (workX - prevWorkX) * lifeStep()
  }

  drawTrail(time)

  // 時間軸橫推
  let tlVel = 0
  if (tlTrack) {
    prevTlX = tlX
    tlX += (tlIndex - tlX) * 0.085
    if (Math.abs(tlIndex - tlX) < 0.0005) tlX = tlIndex
    tlTrack.style.transform = `translate3d(0, ${(-tlX * tlPitch()).toFixed(1)}px, 0)`
    tlVel = (tlX - prevTlX) * tlPitch()
  }

  /* 一次呼吸：藍 → 黑 → 藍。全部綁捲動位置，不綁「第幾頁」。
     1. 首屏：滿藍 → 0.6（進入關於我）
     2. 第二屏：0.6 → 0（全黑，讓內容當主角）
     3. 距離結尾還有一個畫面高：0 → 滿藍（提早開始升，等到最後一頁才變會很跳）

     貼紙跟在藍色後面走：藍色升到六成才開始恢復顏色並往上浮。
     先環境、再元素、最後才是文字——三件事錯開才順，同時來會亂。
     這裡刻意做成捲動驅動而不是時間排程：連續捲動下節奏是你在控，
     用固定秒數的腳本會跟捲動打架。 */
  if (gl) {
    const vh = window.innerHeight
    const y = window.scrollY
    const P2 = 0.6
    let mix
    if (y <= vh) mix = 1 - (1 - P2) * (y / vh)
    else if (y <= vh * 2) mix = P2 * (1 - (y - vh) / vh)
    else mix = 0

    const endTop = sections[sections.length - 1].offsetTop
    endRise = clamp01((y - (endTop - vh)) / vh)
    gl.setBlueMix(clamp01(Math.max(mix, endRise)))

    // 貼紙：首頁原色；中段轉成暗色底紋；結尾隨 endRise 恢復顏色
    fallRise = clamp01((endRise - 0.6) / 0.4)
    gl.setFallGhost(index === 0 ? 0 : 1 - fallRise)
  }

  const velY = pinnedVelocity !== null ? pinnedVelocity : lenis.velocity || 0
  if (gl) gl.update(velY + (pinnedVelocity !== null ? 0 : tlVel), time * 0.001, pinnedVelocity !== null ? 0 : workVel)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

/* ---------- 開場序列 ----------
   1. 近黑底 + 載入條由左往右填滿（等貼圖真的載完，最少 1.2 秒）
   2. 點陣溶解：畫面從粗網點 + 壓暗，化開成正常的 hero
   3. 載入條收掉 → 標題 scramble + 貼紙開始灑落
   （做法比照 haoqi.design 實測：3.1s 載入條 → 3.5s 點陣掀開 → 5.4s 收斂完成） */
const loaderFill = document.getElementById("loaderFill")
const INTRO_MIN_MS = 1200
const REVEAL_MS = 900

function runIntro() {
  const t0 = performance.now()
  if (gl) {
    gl.setIntro(0)
    gl.setTurnNow(-1) // hero 主視覺先擺在側面
    gl.setHeroFadeNow(0)
  }

  const tick = () => {
    const el = performance.now() - t0
    // 只等 hero 的主視覺（毛玻璃那兩張）載入完，不能等全部——
    // 作品頁的色塊要等它出現在畫面上才會標記 loaded，永遠到不了 100%
    const heroItems = gl ? gl.items.filter((i) => i.isGlass) : []
    const heroReady = heroItems.length > 0 && heroItems.every((i) => i.loaded)
    const p = Math.min(el / INTRO_MIN_MS, heroReady ? 1 : 0.92)
    if (loaderFill) loaderFill.style.width = `${(Math.min(1, p) * 100).toFixed(1)}%`

    if (p < 1) return requestAnimationFrame(tick)

    // --- 點陣溶解 ---
    document.body.classList.add("intro-revealing")
    const r0 = performance.now()
    const reveal = () => {
      const k = Math.min(1, (performance.now() - r0) / REVEAL_MS)
      const eased = k * k * (3 - 2 * k)
      if (gl) gl.setIntro(eased)
      if (k < 1) return requestAnimationFrame(reveal)

      document.body.classList.add("intro-done", "hero-active")
      if (gl) {
        gl.setTurn(0) // 轉正
        gl.setHeroFade(1) // 淡入
      }
      playType()
    }
    requestAnimationFrame(reveal)
  }
  requestAnimationFrame(tick)
}

/* ---------- 起始頁（支援網址 hash） ---------- */
const startIndex = Math.max(
  0,
  sections.findIndex((s) => s.id && `#${s.id}` === location.hash)
)
goTo(startIndex, { force: true, immediate: true })
runIntro()

window.__hank = {
  lenis,
  gl,
  glConfig,
  fallConfig,
  fallPile,
  sections,
  goTo,
  setWork,
  pin,
  get index() {
    return index
  },
  get workIndex() {
    return workIndex
  },
}
