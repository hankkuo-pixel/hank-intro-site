/* =========================================================
   WebGL 圖層
   架構跟 haoqi.design 實測結果一致：
   - 全站只有一張 fixed 全螢幕 canvas，壓在 DOM 底下 (z:-1)
   - DOM 裡沒有 <img>，只有空的 .gl-image 佔位框
   - 每一幀讀佔位框的 getBoundingClientRect()，把貼圖平面對到同一個位置
   - Lenis 的 scroll velocity 餵進 shader → 點陣 dither + 拖影 + 邊緣延遲
   ========================================================= */

import * as THREE from "three"

/* 這裡是全部可調參數，要調手感改這一組就好 */
export const glConfig = {

  /* 生活頁色彩統一（霧面膠片）：來源照片反差與色溫差很大，
     壓對比 + 抬黑位是關鍵，色偏只是輔助。只套用在 .life 區塊的圖 */
  gradeContrast: 0.86, // 對比倍率
  gradeLift: 0.07, // 黑位抬起（0–1，約等於 +18/255）
  gradeSaturation: 0.8, // 飽和倍率
  gradeWarm: 0.045, // 暖偏：R 加、B 減
  // true = 全部畫成標尺寸的色塊（還沒有正式素材時用）
  // false = 讀 data-gl-src 的真圖
  placeholderMode: true,
  velocityScale: 0.012, // 速度 → 效果強度的換算（越大越容易破圖）
  velocityMax: 1.0, // 效果上限
  velocityEase: 0.16, // 速度追蹤的平滑度（越小越黏、拖得越久）

  // 幾何變形：實測 haoqi.design 滾動中卡片上緣 300px 只差 1px（等於完全是直的），
  // 所以這兩個預設 0 —— 效果全部留在貼圖裡。要實驗再往上加。
  bendPx: 0, // 邊緣延遲的最大位移（px）
  stretch: 0, // 拖動時的縱向拉伸

  // 切頁進場（一頁一畫面用）：該頁成為目前頁時，圖片從「暗一點＋略放大」收回正常。
  // 註：參考站是連續滾動、圖片沒有進場動畫（實測結果見 HANDOFF），
  //     這是本站改成一頁一畫面之後刻意加的，不是照抄。
  enterFade: 0.45, // 進場起始亮度（1 = 不淡入）
  enterZoom: 0.93, // 進場起始貼圖縮放（1 = 不縮放）
  enterEase: 0.055, // 進場收斂速度（越小越慢，0.055 ≈ 1 秒）
  smearTaps: 5, // 拖影取樣次數
  smearPx: 26, // 拖影最大長度（px）
  ditherAmount: 1.2, // 點陣強度
  ditherMinLevels: 6.0, // 速度最快時的色階數（越小越破）
  rgbSplitPx: 2.4, // 色差位移
  hoverRadius: 0.34, // hover 液態變形半徑
  hoverStrength: 0.055, // hover 液態變形強度
  baseBrightness: 0.86, // 靜止亮度
  hoverBrightness: 1.06, // hover 亮度

  // ---- 毛玻璃（Hello 這種 data-gl-glass 的物件）----
  glassBlurPx: 14, // 透過玻璃看到的後方模糊半徑
  glassRefract: 62, // 折射位移強度（px）
  glassMix: 0.62, // 0 = 全部看穿，1 = 完全不透
  glassTaps: 8, // 模糊取樣次數

  // ---- 滑鼠水波（第一頁的背景與 Hello）----
  rippleRadius: 26, // 波紋密度（越大越密）
  rippleStrength: 0.02, // 位移強度
  rippleSpeed: 2.6, // 擴散速度
  rippleFalloff: 3.4, // 隨距離衰減
  rippleDecay: 0.965, // 停手後衰減速度（越接近 1 拖越久）
  fallGhostFloor: 0.2, // 貼紙離開首頁後保留的可見度（壓在所有照片與文字底下當背景）
}

const VERT = /* glsl */ `
  uniform vec2 uPlaneSize;
  uniform vec2 uVel;
  uniform float uStrength;
  uniform float uBendPx;
  uniform float uStretch;
  uniform float uTurnY; // 弧度，切頁時沿 Y 軸翻轉
  uniform float uTurnX;
  varying vec2 vUv;
  varying float vEdge;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float v = uVel.y * uStrength;
    float edge = abs(pos.x * 2.0);
    vEdge = edge;

    // 幾何預設不動（uBendPx = 0），跟參考站一樣維持矩形。
    // 真要彎的話：中央領先、兩側落後（往行進方向外凸），不是中央下沉。
    if (uBendPx > 0.0) {
      pos.y -= (v * uBendPx * (0.22 + 0.78 * edge * edge)) / max(uPlaneSize.y, 1.0);
      pos.y *= 1.0 + abs(v) * uStretch;
    }

    // 真正的 3D 翻轉：在平面自身座標系旋轉後做透視除法。
    // 只靠 CSS rotateY 沒有用——正交投影下平面只會被水平壓扁，沒有透視。
    if (abs(uTurnY) > 0.0001 || abs(uTurnX) > 0.0001) {
      vec3 q = vec3(pos.x * uPlaneSize.x, pos.y * uPlaneSize.y, 0.0);

      float cy = cos(uTurnY), sy = sin(uTurnY);
      q = vec3(q.x * cy, q.y, -q.x * sy);

      float cx = cos(uTurnX), sx = sin(uTurnX);
      q = vec3(q.x, q.y * cx - q.z * sx, q.y * sx + q.z * cx);

      float focal = max(uPlaneSize.x, uPlaneSize.y) * 1.35;
      float persp = focal / max(focal - q.z, 1.0);
      pos.x = (q.x * persp) / max(uPlaneSize.x, 1.0);
      pos.y = (q.y * persp) / max(uPlaneSize.y, 1.0);
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uTex;
  uniform vec2 uTexSize;
  uniform vec2 uPlaneSize;
  uniform vec2 uVel;
  uniform float uStrength;
  uniform float uOpacity;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uTime;

  uniform float uSmearPx;
  uniform float uRgbSplitPx;
  uniform float uDitherAmount;
  uniform float uDitherMinLevels;
  uniform float uHoverRadius;
  uniform float uHoverStrength;
  uniform float uBaseBrightness;
  uniform vec4 uGrade; // x:對比 y:黑位 z:飽和 w:暖偏（w<0 表示不套用）
  uniform float uHoverBrightness;
  uniform float uEnter; // 0 = 剛切到這一頁，1 = 定位完成
  uniform float uEnterFade;
  uniform float uEnterZoom;
  uniform float uGray; // 1 = 全灰階
  uniform float uAlphaMul; // 整體透明度倍率

  varying vec2 vUv;
  varying float vEdge;

  // ---- 滑鼠水波（共用）----
  uniform vec2 uRes;
  uniform vec2 uMouseN; // 0~1 螢幕座標
  uniform float uRippleAmp; // 停手後衰減到 0
  uniform float uRippleRadius;
  uniform float uRippleStrength;
  uniform float uRippleSpeed;
  uniform float uRippleFalloff;

  vec2 rippleOffset(vec2 p, float t) {
    vec2 d = p - uMouseN;
    d.x *= uRes.x / max(uRes.y, 1.0);
    float r = length(d);
    float w = sin(r * uRippleRadius - t * uRippleSpeed) * exp(-r * uRippleFalloff) * uRippleStrength * uRippleAmp;
    return normalize(d + vec2(1e-5)) * w;
  }

  const int SMEAR_TAPS = ${glConfig.smearTaps};

  // 4x4 ordered dither (Bayer)
  float bayer(vec2 p) {
    int x = int(mod(p.x, 4.0));
    int y = int(mod(p.y, 4.0));
    int i = x + y * 4;
    float m[16];
    m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
    m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
    m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
    m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
    float v = 0.0;
    for (int k = 0; k < 16; k++) {
      if (k == i) v = m[k];
    }
    return v / 16.0;
  }

  // 貼圖標成 sRGB，GPU 取樣時會轉成 linear；自訂 ShaderMaterial 不會幫你轉回去，
  // 少了這步中間調會整片被壓暗（白色不受影響，所以只有色塊會看起來黑黑的）。
  vec3 linearToSrgb(vec3 c) {
    vec3 lo = c * 12.92;
    vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
    return mix(lo, hi, step(vec3(0.0031308), c));
  }

  // cover fit：不管圖多長多寬都填滿佔位框、不變形
  vec2 coverUv(vec2 uv) {
    float planeRatio = uPlaneSize.x / max(uPlaneSize.y, 1.0);
    float texRatio = uTexSize.x / max(uTexSize.y, 1.0);
    vec2 scale = vec2(1.0);
    if (planeRatio > texRatio) {
      scale.y = texRatio / planeRatio;
    } else {
      scale.x = planeRatio / texRatio;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    // uVel.y = 垂直切頁速度、uVel.x = 作品橫推速度
    vec2 v2 = uVel * uStrength;
    float amt = clamp(length(v2), 0.0, 1.0);
    vec2 planeSize = max(uPlaneSize, vec2(1.0));

    vec2 uv = coverUv(vUv);

    // 切頁進場：貼圖先略放大，再收回原尺寸
    uv = (uv - 0.5) * mix(uEnterZoom, 1.0, uEnter) + 0.5;

    // hover：游標附近的液態位移
    float d = distance(vUv, uMouse);
    float ripple = smoothstep(uHoverRadius, 0.0, d) * uHover;
    uv += normalize(vUv - uMouse + 0.0001) * ripple * uHoverStrength * (0.7 + 0.3 * sin(uTime * 2.0 + d * 18.0));

    // 拖影：沿著滾動方向多取幾次樣
    vec3 col = vec3(0.0);
    float total = 0.0;
    for (int i = 0; i < SMEAR_TAPS; i++) {
      float t = float(i) / float(SMEAR_TAPS - 1);
      float w = 1.0 - t * 0.72;
      vec2 off = v2 * (uSmearPx / planeSize) * t;
      col += texture2D(uTex, uv + off).rgb * w;
      total += w;
    }
    col /= max(total, 0.0001);

    // 色差：速度越快越明顯
    if (amt > 0.001) {
      vec2 sp = v2 * (uRgbSplitPx / planeSize);
      col.r = texture2D(uTex, uv + sp).r;
      col.b = texture2D(uTex, uv - sp).b;
    }

    col *= mix(uBaseBrightness, uHoverBrightness, uHover);

    // 進場／退場：進畫面時暗，定位後提亮
    col *= mix(uEnterFade, 1.0, uEnter);

    // linear → sRGB，之後的 dither 才是在顯示空間做量化
    col = linearToSrgb(col);

    // 色彩統一（霧面膠片）：壓對比 → 抬黑位 → 收飽和 → 輕微暖偏
    if (uGrade.w >= 0.0) {
      col = (col - 0.5) * uGrade.x + 0.5;
      col = col * (1.0 - uGrade.y) + uGrade.y;
      float g = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(g), col, uGrade.z);
      col.r *= 1.0 + uGrade.w;
      col.b *= 1.0 - uGrade.w * 1.22;
      col = clamp(col, 0.0, 1.0);
    }

    // 點陣 dither：靜止時 256 階（看不出來），滾動時掉到 4 階（明顯點陣）
    float levels = mix(255.0, uDitherMinLevels, clamp(amt * uDitherAmount, 0.0, 1.0));
    float th = bayer(gl_FragCoord.xy) - 0.5;
    col = floor(col * levels + th * clamp(amt * uDitherAmount, 0.0, 1.0) * 1.6 + 0.5) / levels;

    // 灰階（離開第一頁後的掉落物）
    if (uGray > 0.001) {
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(col, vec3(luma), uGray);
    }

    float alpha = texture2D(uTex, uv).a * uOpacity * uAlphaMul;
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col, alpha);
  }
`


const BG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const BG_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uBlueMix;
  varying vec2 vUv;

  // ---- 滑鼠水波（共用）----
  uniform vec2 uRes;
  uniform vec2 uMouseN; // 0~1 螢幕座標
  uniform float uRippleAmp; // 停手後衰減到 0
  uniform float uRippleRadius;
  uniform float uRippleStrength;
  uniform float uRippleSpeed;
  uniform float uRippleFalloff;

  vec2 rippleOffset(vec2 p, float t) {
    vec2 d = p - uMouseN;
    d.x *= uRes.x / max(uRes.y, 1.0);
    float r = length(d);
    float w = sin(r * uRippleRadius - t * uRippleSpeed) * exp(-r * uRippleFalloff) * uRippleStrength * uRippleAmp;
    return normalize(d + vec2(1e-5)) * w;
  }

  // ---- value noise / fbm：光帶要寬窄不一才像光，正弦波永遠等距 ----
  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  vec2 rot(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c) * p;
  }

  void main() {
    vec2 uv = vUv + rippleOffset(vUv, uTime);
    vec2 p = uv * vec2(uRes.x / max(uRes.y, 1.0), 1.0);

    // 取樣自參考站截圖：底 rgb(6,20,74)、最亮處 rgb(7,22,97)
    vec3 deep = vec3(0.024, 0.078, 0.290);
    vec3 lit = vec3(0.035, 0.105, 0.520);

    // 主層光帶：轉 28°、沿光線方向拉長 1:8，極慢平移
    vec2 q1 = rot(p, 0.4887) * vec2(1.0, 8.0);
    float shaft1 = fbm(q1 * 2.4 + vec2(uTime * 0.010, 0.0));

    // 副層：15°、更細，權重較低
    vec2 q2 = rot(p, 0.2618) * vec2(1.0, 5.0);
    float shaft2 = fbm(q2 * 4.6 - vec2(uTime * 0.006, 0.0));

    float shafts = clamp(shaft1 * 0.75 + shaft2 * 0.40, 0.0, 1.0);
    shafts = pow(shafts, 1.6); // 拉開對比，光帶之間要有暗的地方

    vec3 col = mix(deep, lit, shafts * 0.42);

    // 左上較亮，往右下衰減
    float dir = clamp(1.0 - (uv.x * 0.5 + (1.0 - uv.y) * 0.5), 0.0, 1.0);
    col += lit * dir * 0.05;

    // 暗角：四角壓暗約 12%
    float vig = 1.0 - 0.12 * pow(clamp(length((uv - 0.5) * vec2(1.1, 1.0)) * 1.6, 0.0, 1.0), 2.0);
    col *= vig;

    // 細噪點：蓋掉大面積漸層的色帶，順便呼應貼紙的印刷顆粒
    float g = hash21(gl_FragCoord.xy + fract(uTime) * 13.0);
    col += (g - 0.5) * 0.008;

    // 藍→黑直接混色，不用 alpha 淡出。
    // 走 alpha 的話會經過離屏貼圖再合成，0.18 的藍會被吃掉（實測畫面仍是純黑）
    vec3 ink = vec3(0.031, 0.035, 0.035);
    gl_FragColor = vec4(mix(ink, col, uBlueMix), 1.0);
  }
`

/* 毛玻璃版：在一般 shader 之後，加上「取樣後方畫面 → 折射 + 模糊 → 混色」 */
const GLASS_FRAG = FRAG.replace(
  "uniform float uEnterZoom;",
  `uniform float uEnterZoom;
  uniform sampler2D uScene;
  uniform float uGlassBlurPx;
  uniform float uGlassRefract;
  uniform float uGlassMix;
  uniform float uIntroGlass;`
).replace(
  "gl_FragColor = vec4(col, alpha);",
  `
    // 毛玻璃：用自身亮度梯度當法線做折射，再對後方畫面做環形模糊
    vec2 sUv = gl_FragCoord.xy / uRes;
    sUv += rippleOffset(sUv, uTime) * 0.6;

    float stepPx = 2.0 / max(uTexSize.x, 1.0);
    vec4 c0 = texture2D(uTex, uv);
    vec4 cx = texture2D(uTex, uv + vec2(stepPx, 0.0));
    vec4 cy = texture2D(uTex, uv + vec2(0.0, stepPx));
    float l0 = dot(c0.rgb, vec3(0.299, 0.587, 0.114)) * c0.a;
    float lx = dot(cx.rgb, vec3(0.299, 0.587, 0.114)) * cx.a;
    float ly = dot(cy.rgb, vec3(0.299, 0.587, 0.114)) * cy.a;
    vec2 refr = vec2(lx - l0, ly - l0) * uGlassRefract / uRes;

    vec3 back = vec3(0.0);
    for (int i = 0; i < 8; i++) {
      float ang = float(i) * 0.7853981634;
      vec2 off = vec2(cos(ang), sin(ang)) * (uGlassBlurPx / uRes);
      back += texture2D(uScene, sUv + refr + off).rgb;
    }
    back /= 8.0;

    // 高光保留不透，其餘讓後面透出來
    float hi = smoothstep(0.52, 0.95, dot(col, vec3(0.299, 0.587, 0.114)));
    float m = mix(uGlassMix, 1.0, hi);
    vec3 outCol = mix(back, col, m);
    float ik = clamp(uIntroGlass, 0.0, 1.0);
    outCol *= mix(0.22, 1.0, ik);
    float ilev = mix(2.0, 255.0, ik * ik);
    float ith = bayer(gl_FragCoord.xy) - 0.5;
    outCol = floor(outCol * ilev + ith * (1.0 - ik) * 1.8 + 0.5) / ilev;
    gl_FragColor = vec4(outCol, alpha * mix(0.35, 1.0, ik));
  `
)

/* ---------------------------------------------------------
   色塊佔位圖：用 canvas 2D 畫「色塊 + 尺寸標示」當貼圖。
   走的還是同一套 shader，所以滾動時一樣會破圖／拖影，
   而且上面有文字跟格線，效果比純色塊明顯得多。
   --------------------------------------------------------- */
function drawPlaceholder(el, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const cw = Math.max(2, Math.round(w))
  const ch = Math.max(2, Math.round(h))
  const c = document.createElement("canvas")
  c.width = Math.round(cw * dpr)
  c.height = Math.round(ch * dpr)
  const ctx = c.getContext("2d")
  ctx.scale(dpr, dpr)

  const color = el.dataset.glColor || "#16305e"
  const label = el.dataset.glLabel || "IMAGE"
  const ratio = el.dataset.glRatio || ""

  // 底色
  ctx.fillStyle = color
  ctx.fillRect(0, 0, cw, ch)

  // 斜線紋理（給 dither / 拖影一點可看的細節）
  ctx.save()
  ctx.strokeStyle = "rgba(255,255,255,0.05)"
  ctx.lineWidth = 1
  for (let x = -ch; x < cw; x += 16) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + ch, ch)
    ctx.stroke()
  }
  ctx.restore()

  // 外框 + 四角記號
  ctx.strokeStyle = "rgba(255,255,255,0.28)"
  ctx.lineWidth = 1
  ctx.strokeRect(0.5, 0.5, cw - 1, ch - 1)
  const t = Math.min(22, cw * 0.08)
  ctx.strokeStyle = "rgba(255,255,255,0.55)"
  ctx.lineWidth = 1.5
  ;[
    [0, 0, 1, 1],
    [cw, 0, -1, 1],
    [0, ch, 1, -1],
    [cw, ch, -1, -1],
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath()
    ctx.moveTo(x + sx * 2, y + sy * 2)
    ctx.lineTo(x + sx * t, y + sy * 2)
    ctx.moveTo(x + sx * 2, y + sy * 2)
    ctx.lineTo(x + sx * 2, y + sy * t)
    ctx.stroke()
  })

  // 對角線
  ctx.strokeStyle = "rgba(255,255,255,0.12)"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(cw, ch)
  ctx.moveTo(cw, 0)
  ctx.lineTo(0, ch)
  ctx.stroke()

  // 文字：標籤 / 版位尺寸 / 建議出圖尺寸 / 比例
  const base = Math.max(11, Math.min(26, cw * 0.032))
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  const mono = '"SFMono-Regular", ui-monospace, Consolas, monospace'
  const cx = cw / 2
  const cy = ch / 2

  ctx.fillStyle = "rgba(255,255,255,0.62)"
  ctx.font = `${base * 0.78}px ${mono}`
  ctx.fillText(label, cx, cy - base * 1.9)

  ctx.fillStyle = "#fff"
  ctx.font = `700 ${base * 1.7}px ${mono}`
  ctx.fillText(`${cw} × ${ch}`, cx, cy)

  ctx.fillStyle = "rgba(255,255,255,0.58)"
  ctx.font = `${base * 0.78}px ${mono}`
  ctx.fillText(`@2x  ${cw * 2} × ${ch * 2}`, cx, cy + base * 1.6)

  if (ratio) {
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.font = `${base * 0.72}px ${mono}`
    ctx.fillText(`RATIO ${ratio.replace("/", ":")}`, cx, cy + base * 2.9)
  }

  const texture = new THREE.CanvasTexture(c)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  return texture
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (t) => t * t * (3 - 2 * t)

export function createGlLayer(canvas) {
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" })
  } catch (err) {
    console.warn("[gl] WebGL 建立失敗，退回 DOM 佔位框", err)
    document.documentElement.classList.add("gl-fallback")
    return null
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)

  renderer.autoClear = false

  // 兩階段：先把「背景 + 一般圖 + 掉落貼紙」畫進離屏貼圖，
  // 再把它貼回畫面，最後畫毛玻璃物件（它會去採樣那張離屏貼圖）。
  const scene = new THREE.Scene() // back pass
  const sceneGlass = new THREE.Scene()
  const sceneScreen = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000)
  const loader = new THREE.TextureLoader()
  const geometry = new THREE.PlaneGeometry(1, 1, 40, 40)
  const quadGeo = new THREE.PlaneGeometry(1, 1)

  let rt = null
  const rippleUniforms = () => ({
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouseN: { value: new THREE.Vector2(0.5, 0.5) },
    uRippleAmp: { value: 0 },
    uRippleRadius: { value: glConfig.rippleRadius },
    uRippleStrength: { value: glConfig.rippleStrength },
    uRippleSpeed: { value: glConfig.rippleSpeed },
    uRippleFalloff: { value: glConfig.rippleFalloff },
  })

  // 背景（藍色緞面 + 水波），畫在最底層
  const bgMat = new THREE.ShaderMaterial({
    vertexShader: BG_VERT,
    fragmentShader: BG_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uBlueMix: { value: 1 }, ...rippleUniforms() },
  })
  const bgMesh = new THREE.Mesh(quadGeo, bgMat)
  bgMesh.frustumCulled = false
  bgMesh.renderOrder = -1000
  scene.add(bgMesh)

  // 把離屏貼圖貼回畫面。
  // 用純複製的 shader，不能用 MeshBasicMaterial —— 內建材質會對貼圖做
  // linear→sRGB 轉換，整片背景會被提亮（實測深藍 7,23,89 變成 50,87,165）。
  const screenMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    // 離屏貼圖是預乘 alpha，貼回畫面要用 (ONE, 1-SRC_ALPHA)。
    // 用預設混色會再乘一次 alpha，半透明的背景藍會直接消失（實測 0.18 → 0.03）
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: { uTex: { value: null }, uIntro: { value: 0 } },
    vertexShader: BG_VERT,
    fragmentShader: `
      precision highp float;
      uniform sampler2D uTex;
      uniform float uIntro; // 0 = 全點陣、暗；1 = 正常
      varying vec2 vUv;

      float bayer(vec2 p) {
        int x = int(mod(p.x, 4.0));
        int y = int(mod(p.y, 4.0));
        int i = x + y * 4;
        float m[16];
        m[0]=0.0;  m[1]=8.0;  m[2]=2.0;  m[3]=10.0;
        m[4]=12.0; m[5]=4.0;  m[6]=14.0; m[7]=6.0;
        m[8]=3.0;  m[9]=11.0; m[10]=1.0; m[11]=9.0;
        m[12]=15.0;m[13]=7.0; m[14]=13.0;m[15]=5.0;
        float v = 0.0;
        for (int k = 0; k < 16; k++) { if (k == i) v = m[k]; }
        return v / 16.0;
      }

      void main() {
        vec4 c = texture2D(uTex, vUv);
        // 開場：從粗點陣 + 壓暗，溶解成正常畫面
        float k = clamp(uIntro, 0.0, 1.0);
        c.rgb *= mix(0.22, 1.0, k);
        float levels = mix(2.0, 255.0, k * k);
        float th = bayer(gl_FragCoord.xy) - 0.5;
        c.rgb = floor(c.rgb * levels + th * (1.0 - k) * 1.8 + 0.5) / levels;
        c.a *= mix(0.35, 1.0, k);
        gl_FragColor = c;
      }
    `,
  })
  const screenMesh = new THREE.Mesh(quadGeo, screenMat)
  screenMesh.frustumCulled = false
  sceneScreen.add(screenMesh)

  const items = []
  let vw = 0
  let vh = 0
  const mouseN = new THREE.Vector2(0.5, 0.5)
  let rippleAmp = 0
  let blueMix = 1
  let blueMixTarget = 1
  let lastFrameTime = 0

  window.addEventListener("pointermove", (e) => {
    mouseN.set((e.clientX - gx) / Math.max(vw, 1), 1 - e.clientY / Math.max(vh, 1))
    rippleAmp = 1
  })
  const STAGE = 1920 // 與 styles.css 的 --stage 一致
  let gx = 0 // 舞台左邊界（畫面比 1920 寬時的留白）
  const smoothVelocity = { x: 0, y: 0 }

  function resize() {
    // 整站限寬 1920：canvas 只佔舞台範圍，兩側留給頁面底色
    gx = Math.max(0, (window.innerWidth - STAGE) / 2)
    vw = Math.min(window.innerWidth, STAGE)
    vh = window.innerHeight
    renderer.setSize(vw, vh, false)

    const dpr = renderer.getPixelRatio()
    if (rt) rt.dispose()
    rt = new THREE.WebGLRenderTarget(Math.max(1, Math.round(vw * dpr)), Math.max(1, Math.round(vh * dpr)), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    })
    screenMat.uniforms.uTex.value = rt.texture

    bgMesh.scale.set(vw, vh, 1)
    screenMesh.scale.set(vw, vh, 1)
    bgMat.uniforms.uRes.value.set(vw, vh)
    for (const it of items) {
      if (it.material.uniforms.uRes) it.material.uniforms.uRes.value.set(vw, vh)
    }

    camera.left = -vw / 2
    camera.right = vw / 2
    camera.top = vh / 2
    camera.bottom = -vh / 2
    camera.updateProjectionMatrix()
  }

  function addItem(el) {
    const src = el.dataset.glSrc
    if (!src) return
    const clipEl = el.closest("[data-gl-clip]")

    const isGlass = "glGlass" in el.dataset
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: isGlass ? GLASS_FRAG : FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTex: { value: null },
        uTexSize: { value: new THREE.Vector2(1, 1) },
        uPlaneSize: { value: new THREE.Vector2(1, 1) },
        uVel: { value: new THREE.Vector2(0, 0) },
        uStrength: { value: parseFloat(el.dataset.glStrength || "1") },
        uOpacity: { value: 0 },
        uHover: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uBendPx: { value: glConfig.bendPx },
        uTurnY: { value: 0 },
        uTurnX: { value: 0 },
        uStretch: { value: glConfig.stretch },
        uSmearPx: { value: glConfig.smearPx },
        uRgbSplitPx: { value: glConfig.rgbSplitPx },
        uDitherAmount: { value: glConfig.ditherAmount },
        uDitherMinLevels: { value: glConfig.ditherMinLevels },
        uHoverRadius: { value: glConfig.hoverRadius },
        uHoverStrength: { value: glConfig.hoverStrength },
        uBaseBrightness: { value: glConfig.baseBrightness },
        uGrade: { value: new THREE.Vector4(1, 0, 1, -1) },
        uHoverBrightness: { value: glConfig.hoverBrightness },
        uEnter: { value: 0 },
        uEnterFade: { value: glConfig.enterFade },
        uEnterZoom: { value: glConfig.enterZoom },
        uGray: { value: 0 },
        uAlphaMul: { value: 1 },
        uScene: { value: null },
        uGlassBlurPx: { value: glConfig.glassBlurPx },
        uGlassRefract: { value: glConfig.glassRefract },
        uGlassMix: { value: glConfig.glassMix },
        uIntroGlass: { value: 0 },
        ...rippleUniforms(),
      },
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.frustumCulled = false
    mesh.visible = false
    // 疊放順序：data-gl-order 大的畫在上面。hero 的 Hello 設 100。
    // 掉落貼紙一律壓到最底（只比背景高），才不會蓋住頁面上的照片；
    // 沒特別指定的話它們會照生成順序排到照片前面去。
    mesh.renderOrder = el.classList.contains("fall-img")
      ? -500 + items.length
      : parseInt(el.dataset.glOrder || "0", 10) * 1000 + items.length
    ;(isGlass ? sceneGlass : scene).add(mesh)

    const item = {
      el,
      section: el.closest(".section"),
      slide: el.closest(".life-slide"),
      clipEl,
      isFall: el.classList.contains("fall-img"),
      isGlass,
      gray: 0,
      mesh,
      material,
      loaded: false,
      hover: 0,
      hoverTarget: 0,
      enter: 0,
      enterTarget: 0,
      mouse: new THREE.Vector2(0.5, 0.5),
      placeholder: glConfig.placeholderMode && !("glReal" in el.dataset),
      graded: !!el.closest(".life"),
      phW: 0,
      phH: 0,
    }
    items.push(item)

    if (item.placeholder) {
      // 色塊模式：貼圖在 update() 依實際版位尺寸即時畫，resize 會重畫
      bindHover(el, item)
      return
    }
    // 帶 data-gl-real 的元素即使在色塊模式也讀真圖

    loader.load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.generateMipmaps = true
        material.uniforms.uTex.value = texture
        material.uniforms.uTexSize.value.set(texture.image.width, texture.image.height)
        item.loaded = true
      },
      undefined,
      (err) => {
        console.warn("[gl] 圖片載入失敗：" + src, err)
        el.classList.add("gl-missing")
      }
    )

    bindHover(el, item)
  }

  // hover：游標進出佔位框
  function bindHover(el, item) {
    el.addEventListener("pointerenter", () => {
      item.hoverTarget = 1
    })
    el.addEventListener("pointerleave", () => {
      item.hoverTarget = 0
    })
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect()
      item.mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
    })
  }

  function scan() {
    document.querySelectorAll(".gl-image[data-gl-src]").forEach((el) => {
      if (items.some((it) => it.el === el)) return
      addItem(el)
    })
  }

  /* 每一幀：讀 DOM 佔位框 → 對位貼圖平面 */
  function update(velocityY, time, velocityX = 0) {
    const clampV = (v) => {
      const raw = v * glConfig.velocityScale
      return Math.max(-glConfig.velocityMax, Math.min(glConfig.velocityMax, raw))
    }
    smoothVelocity.y += (clampV(velocityY) - smoothVelocity.y) * glConfig.velocityEase
    smoothVelocity.x += (clampV(velocityX) - smoothVelocity.x) * glConfig.velocityEase

    for (const item of items) {
      const r = item.el.getBoundingClientRect()
      let onScreen = r.bottom > -vh * 0.35 && r.top < vh * 1.35 && r.width > 0 && r.height > 0

      // 被 overflow 容器裁切的圖（例如輪播）：DOM 的 overflow 管不到 WebGL 平面，
      // 這裡自己判斷有沒有整個滑出容器，滑出去就不畫
      if (onScreen && item.clipEl) {
        const c = item.clipEl.getBoundingClientRect()
        if (r.right <= c.left + 1 || r.left >= c.right - 1) onScreen = false
      }

      // 色塊模式：版位尺寸變了就重畫貼圖（標的數字要跟著版位走）
      if (item.placeholder && onScreen) {
        const w = Math.round(item.el.offsetWidth || r.width)
        const h = Math.round(item.el.offsetHeight || r.height)
        if (w !== item.phW || h !== item.phH) {
          const old = item.material.uniforms.uTex.value
          if (old) old.dispose()
          const tex = drawPlaceholder(item.el, w, h)
          item.material.uniforms.uTex.value = tex
          item.material.uniforms.uTexSize.value.set(w, h)
          item.phW = w
          item.phH = h
          item.loaded = true
        }
      }

      if (!onScreen || !item.loaded) {
        item.mesh.visible = false
        continue
      }

      item.mesh.visible = true

      // 元素自己有 rotate/scale 時（例如掉落物），rect 是外接矩形，不能直接當尺寸用。
      // 從 computed transform 取出旋轉與縮放，尺寸改用未變形的 offsetWidth/Height。
      const m = new DOMMatrixReadOnly(getComputedStyle(item.el).transform)
      const scl = Math.hypot(m.a, m.b) || 1
      const rot = Math.atan2(m.b, m.a)
      const w = (item.el.offsetWidth || r.width) * scl
      const h = (item.el.offsetHeight || r.height) * scl

      item.mesh.scale.set(w, h, 1)
      item.mesh.rotation.z = -rot
      item.mesh.position.set(r.left - gx + r.width / 2 - vw / 2, -(r.top + r.height / 2) + vh / 2, 0)

      const u = item.material.uniforms
      if (item.graded) {
        u.uGrade.value.set(glConfig.gradeContrast, glConfig.gradeLift, glConfig.gradeSaturation, glConfig.gradeWarm)
      }
      u.uPlaneSize.value.set(r.width, r.height)
      u.uVel.value.set(smoothVelocity.x, smoothVelocity.y)
      u.uTime.value = time
      u.uOpacity.value = Math.min(1, u.uOpacity.value + 0.06)

      // 切頁進場：目前頁的圖從 0 收到 1，離開的頁直接歸零（下次切回來會重播）
      item.enter += (item.enterTarget - item.enter) * glConfig.enterEase
      u.uEnter.value = smoothstep(clamp01(item.enter))

      // 掉落物只在第一頁看得到。離開時要在 WebGL 這層淡出——
      // DOM 的 opacity 管不到貼圖平面（實測貼紙會跟著出現在其他頁）
      if (item.isFall) {
        // fallGhost 現在是 0~1 的連續值：0 = 原色，1 = 灰階底紋。
        // 淡出留一條 GHOST_FLOOR 的底線不歸零 —— 完全消失的話，
        // 結尾再出現會像憑空冒出來，留一點點才叫前後呼應。
        item.gray += (fallGhost - item.gray) * 0.12
        u.uGray.value = item.gray
        u.uAlphaMul.value = 1 - item.gray * (1 - glConfig.fallGhostFloor)
      }

      item.hover += (item.hoverTarget - item.hover) * 0.12
      u.uHover.value = item.hover
      u.uMouse.value.lerp(item.mouse, 0.16)
    }

    // hero 主視覺的 3D 翻轉量
    const dtT = lastFrameTime ? Math.min(0.05, time - lastFrameTime) : 0.016
    turn += (turnTarget - turn) * (1 - Math.exp(-dtT * 4.2))
    heroFade += (heroFadeTarget - heroFade) * (1 - Math.exp(-dtT * 4.0))

    // 水波：停手後慢慢衰減
    rippleAmp *= glConfig.rippleDecay
    const t = time
    bgMat.uniforms.uTime.value = t
    // 藍→黑用 ease 過渡，不是瞬間切換。背景本身固定不動，只有顏色在變。
    // 用時間算而不是每幀固定比例，否則幀率一低整個動畫就跟著變慢。
    const dt = lastFrameTime ? Math.min(0.05, time - lastFrameTime) : 0.016
    lastFrameTime = time
    blueMix += (blueMixTarget - blueMix) * (1 - Math.exp(-dt * 14.0)) // 位置驅動，只做輕微平滑
    if (Math.abs(blueMixTarget - blueMix) < 0.002) blueMix = blueMixTarget
    bgMat.uniforms.uBlueMix.value = blueMix
    bgMat.uniforms.uMouseN.value.copy(mouseN)
    bgMat.uniforms.uRippleAmp.value = rippleAmp
    bgMesh.visible = true

    for (const item of items) {
      const u = item.material.uniforms
      if (u.uMouseN) {
        u.uMouseN.value.copy(mouseN)
        u.uRippleAmp.value = item.isGlass ? rippleAmp : 0 // 只有毛玻璃物件吃水波
        u.uRes.value.set(vw, vh)
      }
      if (item.isGlass && rt) u.uScene.value = rt.texture
      if (u.uTurnY && item.el.classList.contains("hero-hello")) {
        u.uTurnY.value = turn * 1.4 // ±80°，負值代表從另一側轉進來
        u.uTurnX.value = turn * -0.04 // 幾乎純 Y 軸自轉，只留一點點傾斜避免太平面
        u.uAlphaMul.value = heroFade
      }
    }

    // 第一階段：背景 + 一般圖 + 掉落貼紙 → 離屏貼圖
    renderer.setRenderTarget(rt)
    renderer.clear(true, true, true)
    renderer.render(scene, camera)

    // 第二階段：貼回畫面，再畫毛玻璃物件
    renderer.setRenderTarget(null)
    renderer.clear(true, true, true)
    renderer.render(sceneScreen, camera)
    renderer.render(sceneGlass, camera)
  }

  resize()
  scan()
  window.addEventListener("resize", resize)

  /* 切頁 / 換作品時呼叫：目前這張的圖重播進場，其他歸零 */
  let activeSection = null
  let activeSlide = null
  let fallGhost = 0 // 0 = 原色，1 = 灰階底紋（連續值，結尾要用它做漸變）
  let turn = 0
  let turnTarget = 0
  let heroFade = 0
  let heroFadeTarget = 1
  function setFallGhost(v) {
    fallGhost = Math.max(0, Math.min(1, typeof v === "number" ? v : v ? 1 : 0))
  }
  function setActive(section, slide = null) {
    if (activeSection === section && activeSlide === slide) return
    activeSection = section
    activeSlide = slide
    for (const item of items) {
      // 掉落物不屬於任何 section，永遠當作已進場
      const isActive = item.isFall || (item.section === section && (!item.slide || item.slide === slide))
      if (isActive && item.enterTarget !== 1) item.enter = 0 // 重播
      item.enterTarget = isActive ? 1 : 0
      if (!isActive) item.enter = 0
    }
  }

  /* 回收：把某個元素對應的平面從場景移除並釋放資源 */
  function removeItem(el) {
    const i = items.findIndex((it) => it.el === el)
    if (i < 0) return
    const item = items[i]
    ;(item.isGlass ? sceneGlass : scene).remove(item.mesh)
    const tex = item.material.uniforms.uTex.value
    if (tex) tex.dispose()
    item.material.dispose()
    items.splice(i, 1)
  }

  return {
    update,
    resize,
    scan,
    removeItem,
    setActive,
    setFallGhost,
    setTurn(v) {
      turnTarget = v
    },
    setTurnNow(v) {
      turn = v
      turnTarget = v
    },
    setHeroFade(v) {
      heroFadeTarget = v
    },
    setHeroFadeNow(v) {
      heroFade = v
      heroFadeTarget = v
    },
    setBlueMix(v) {
      blueMixTarget = v
    },
    get blueMix() {
      return blueMix
    },
    setIntro(v) {
      screenMat.uniforms.uIntro.value = v
      for (const it of items) if (it.isGlass) it.material.uniforms.uIntroGlass.value = v
    },
    get velocity() {
      return smoothVelocity.y
    },
    get velocity2() {
      return smoothVelocity
    },
    items,
  }
}
