/* =========================================================
   掉落貼紙的物理堆疊（matter.js）

   行為：從畫面上方落下 → 撞到第一畫面底部停住 → 後面的疊上去 →
        有角度的會翻滾、順著坡滑下來卡進縫隙。
   離開第一頁時整個引擎停住（凍結），回來再繼續。

   注意：貼紙 PNG 四周有透明留白，碰撞體要比元素小一圈，
        不然看起來會「浮在半空中不接觸」。
   ========================================================= */

import { Engine, Composite, Bodies, Body } from "matter-js"

export const fallConfig = {
  maxAlive: 22, // 堆到這個數量就停止再生（此時底部已經鋪滿）。切走再回來會整個重來
  sizeMin: 130,
  sizeMax: 240,
  bodyScale: 0.72, // 碰撞體相對元素的比例（PNG 有透明留白）

  // 飄落感：重力小、空氣阻力大 → 終端速度低，慢慢飄下來
  // 約 1 秒落到底：重力拉高、空氣阻力壓低。範圍大 → 有的快有的慢
  gravity: 2.4,
  frictionAirMin: 0.004,
  frictionAirMax: 0.045,
  swayForce: 0.000018, // 空中左右搖擺的力（像葉子）
  swaySpeed: 0.0011, // 搖擺頻率

  restitution: 0.22, // 彈性：碰到地板會彈一下
  friction: 0.45,
  frictionStatic: 0.55,
  spawnEvery: 90, // 一次灑落：間隔很短，一兩秒內全部下來
  spinMin: 0.012, // 初始自轉（每個不一樣，方向也隨機）
  spinMax: 0.075,
  floorInset: 6, // 地板比視窗底部高幾 px
}

export function createFallPile(layer, sources, glScan, glRemove) {
  if (!layer || !sources.length) return null

  const engine = Engine.create()
  engine.gravity.y = fallConfig.gravity
  engine.positionIterations = 8
  engine.velocityIterations = 8

  const items = []
  let walls = []
  let seed = 0
  let vw = layer.clientWidth || window.innerWidth
  let vh = window.innerHeight
  let lastSpawn = 0
  let spawned = 0

  function buildWalls() {
    walls.forEach((w) => Composite.remove(engine.world, w))
    const t = 200
    walls = [
      // 地板：第一畫面底部
      Bodies.rectangle(vw / 2, vh - fallConfig.floorInset + t / 2, vw * 3, t, { isStatic: true, friction: 0.6 }),
      Bodies.rectangle(-t / 2, vh / 2, t, vh * 3, { isStatic: true, friction: 0.4 }),
      Bodies.rectangle(vw + t / 2, vh / 2, t, vh * 3, { isStatic: true, friction: 0.4 }),
    ]
    Composite.add(engine.world, walls)
  }
  buildWalls()

  const rand = (a, b) => a + Math.random() * (b - a)

  function spawnOne() {
    const size = Math.round(rand(fallConfig.sizeMin, fallConfig.sizeMax))
    const el = document.createElement("span")
    el.className = "fall-img gl-image"
    el.dataset.glSrc = sources[Math.floor(rand(0, sources.length))]
    el.dataset.glReal = ""
    el.style.setProperty("--size", `${size}px`)
    layer.appendChild(el)

    const r = (size * fallConfig.bodyScale) / 2
    const body = Bodies.rectangle(rand(size, vw - size), -size - rand(0, 260), r * 2, r * 2, {
      chamfer: { radius: r * 0.42 }, // 圓角一點，堆疊時比較會滾
      restitution: fallConfig.restitution,
      friction: fallConfig.friction,
      frictionStatic: fallConfig.frictionStatic,
      frictionAir: rand(fallConfig.frictionAirMin, fallConfig.frictionAirMax),
      angle: rand(-Math.PI, Math.PI), // 初始角度整圈隨機
    })
    // 自轉速度與方向各自隨機
    // 一半會轉、一半不轉
    const spin = Math.random() < 0.5 ? 0 : rand(fallConfig.spinMin, fallConfig.spinMax) * (Math.random() < 0.5 ? -1 : 1)
    Body.setAngularVelocity(body, spin)
    Composite.add(engine.world, body)

    items.push({ el, body, size, seed: seed++, born: performance.now(), fadeStart: 0 })
    if (glScan) glScan()
  }

  function resize() {
    // 貼紙層已被限寬在舞台內，牆壁要跟著舞台走，不是整個視窗
    vw = layer.clientWidth || window.innerWidth
    vh = window.innerHeight
    buildWalls()
  }
  window.addEventListener("resize", resize)

  /* 每幀：只有在第一頁才推進物理，離開就凍住 */
  function update(dtMs, active, now) {
    if (active) {
      if (items.length < fallConfig.maxAlive && now - lastSpawn > fallConfig.spawnEvery) {
        spawnOne()
        spawned++
        lastSpawn = now
      }

      // 空中的貼紙左右搖擺，像葉子飄
      for (const it of items) {
        if (it.body.position.y < vh - fallConfig.floorInset - it.size * 0.6) {
          Body.applyForce(it.body, it.body.position, {
            x: Math.sin(now * fallConfig.swaySpeed + it.seed * 1.7) * fallConfig.swayForce * it.body.mass,
            y: 0,
          })
        }
      }

      Engine.update(engine, Math.min(dtMs, 32))
    }

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i]
      const { x, y } = it.body.position
      it.el.style.transform = `translate3d(${(x - it.size / 2).toFixed(1)}px, ${(y - it.size / 2).toFixed(1)}px, 0) rotate(${(
        (it.body.angle * 180) /
        Math.PI
      ).toFixed(1)}deg)`

      // 從上方進來時淡入，之後就一直留著不消失
      it.el.style.opacity = Math.max(0, Math.min(1, (y + it.size) / 200)).toFixed(3)
    }
  }

  /* 切回第一頁時整組重來：清掉現有的，重新從上面下 */
  function reset() {
    for (const it of items) {
      Composite.remove(engine.world, it.body)
      it.el.remove()
      if (glRemove) glRemove(it.el)
    }
    items.length = 0
    spawned = 0
    lastSpawn = 0
  }

  return {
    update,
    reset,
    get count() {
      return items.length
    },
    get settled() {
      return items.filter((i) => Math.abs(i.body.velocity.y) < 0.12 && i.body.position.y > 0).length
    },
    items,
  }
}
