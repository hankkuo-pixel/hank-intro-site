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
  /* rise：0 = 正常堆在底部；1 = 完全升到畫面上方散開（結尾的收尾動作）。
     不能把重力反轉來做——那樣它們會撞到畫面頂端彈回來很難看，
     所以物理照樣凍住，改成每張各自速度不同的位移。 */
  /* active   ：要不要推進物理（第一幕與結尾幕才推，中間凍住）
     allowSpawn：要不要繼續生新的貼紙（只有第一幕生，結尾幕只讓既有的落完） */
  function update(dtMs, active, now, rise = 0, allowSpawn = true) {
    if (active) {
      if (allowSpawn && items.length < fallConfig.maxAlive && now - lastSpawn > fallConfig.spawnEvery) {
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
      // 收尾：每張的上升距離與橫向飄移都跟自己的 seed 綁，才不會整批一起平移
      // seed 是遞增編號（0,1,2…），不是 0~1 的小數，直接乘會讓後面的貼紙
      // 被抬到好幾個畫面高之外。先換算成 0~1 再用。
      // 升幅刻意壓小：全部飛出畫面的話，結尾那一頁反而看不到貼紙。
      const r01 = Math.abs(Math.sin(it.seed * 12.9898) * 43758.5453) % 1
      // 幅度刻意很小：浮太多會把原本緊實的一堆拉散、看起來像卡在半空沒落完。
      // 結尾要的是「同一堆貼紙、恢復顏色」，不是重新灑一次。
      const lift = rise > 0 ? rise * vh * (r01 * 0.04) : 0
      const drift = rise > 0 ? Math.sin(it.seed * 5.3) * rise * 22 : 0
      const spin = rise > 0 ? Math.sin(it.seed * 3.1) * rise * 7 : 0
      const px = x - it.size / 2 + drift
      const py = y - it.size / 2 - lift
      const deg = (it.body.angle * 180) / Math.PI + spin
      it.el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) rotate(${deg.toFixed(1)}deg)`

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
