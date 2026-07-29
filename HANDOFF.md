# HANDOFF.md — Hank intro site

Updated: 2026-07-29 04:30 Asia/Taipei

## 現在的狀態

效果層已經整個換掉，改成跟 haoqi.design 同一套架構（Lenis + Three.js 圖層）。
版面從「絕對定位 + 固定高度」改成正常流排版（grid），hero 剛好一個畫面。

## 怎麼跑

```bash
cd ~/Desktop/claude-ai/作品網站/hank-intro-site
npm run dev        # http://127.0.0.1:8091
npm run verify     # headless Chrome 實測，截圖存 verify-shots/
```

`npm run verify` 會回報：WebGL 有沒有起來、幾張貼圖載到、貼圖平面跟 DOM 佔位框的對位誤差、
滾動中的 velocity 峰值、console 有沒有錯，並產出 7 張截圖。

## 檔案

| 檔案 | 用途 |
|------|------|
| `index.html` | 全站 markup（5 個 section） |
| `src/app/styles.css` | 全部樣式 |
| `src/app/gl.js` | WebGL 圖層 + shader + **所有可調參數 `glConfig`** |
| `src/app/main.js` | Lenis、rAF 迴圈、進場動畫、導覽、游標、時鐘 |
| `scripts/verify.cjs` | headless 驗證腳本 |
| `verify-shots/` | 驗證截圖 |
| `simple-preview.html` | **舊版原型，已被取代**，留著備查，沒有被引用 |
| `src/main.js` / `src/App.vue` / `src/sections/` | 更早的 Vue 版本，沒有被引用 |

## 架構（對照 haoqi.design 實測結果）

1. **一頁一畫面（full-page）**。`lenis.stop()` 關掉自由滾動，Lenis 只當切頁的動畫引擎，
   `main.js` 自己接 wheel / touch / 鍵盤，一個手勢切一頁：
   - 滾輪：`preventDefault` 擋掉原生滾動，`|deltaY| > 6` 就切一頁
   - 觸控：`touchend` 位移 > 40px 切頁
   - 鍵盤：↑↓ / PageUp / PageDown / Space / Home / End
   - 切頁動畫 1.15s，結束後再鎖 260ms（`COOLDOWN`），避免觸控板慣性連跳好幾頁
   - 換頁時寫 `history.replaceState` 更新 hash，重新整理會回到同一頁
   - **作品頁是「頁內橫向」**：滾到 `#work` 之後，同樣的手勢先橫推三個作品（`.work-track` 位移 -100% × index），
     推到第三個才會往下一頁；往回也對稱。從下方回到作品頁會停在第三張。
     橫推是 JS 自己 ease（lerp 0.085），順便把橫向速度餵進 shader，所以橫推一樣有拖影。
   ⚠️ 這跟參考站不一樣。haoqi.design 實測是**連續滾動、沒有 snap**；一頁一畫面是使用者指定的方向。
2. **一張 fixed 全螢幕 canvas**（`.gl-layer`，`z-index: -1`）壓在 DOM 底下。
3. **DOM 裡沒有 `<img>`**。所有圖片位置都是空的 `.gl-image` 佔位框，帶 `data-gl-src`。
   `gl.js` 每一幀讀佔位框的 `getBoundingClientRect()`，把貼圖平面對到同一個座標。
   驗證過對位誤差 = 0px。
4. **`.bg-layer`（`z-index: -2`）** 放藍→黑的底色，用 `--blue-mix` 隨 hero 離開淡出。
   ⚠️ `body` 必須保持 `background: transparent`，否則會蓋掉這兩個負 z 的層。
5. **滾動速度餵進 shader**：Lenis velocity → `uVelocity` → 點陣 dither + 拖影 + 色差 + 邊緣延遲彎折。
   靜止時歸零，圖片乾淨。

## 色塊模式（目前開著）

`glConfig.placeholderMode = true` → 所有圖片位置都畫成「色塊 + 尺寸標示」，
標的數字是**該版位當下的實際 CSS 尺寸**，改視窗寬度會即時重畫。
色塊走的是同一套 shader，所以滾動時一樣會 dither / 拖影 / 彎折。

要換回真圖：把 `placeholderMode` 改成 `false`（`data-gl-src` 都還留在 HTML 裡）。

每個佔位框的屬性：`data-gl-label`（標籤）、`data-gl-color`（色塊顏色）、`data-gl-ratio`（比例）。

### 版位尺寸（CSS px，實測）

| 版位 | 比例 | 1920 | 1440 | 390 | 建議出圖 |
|------|------|------|------|-----|----------|
| HERO / MAIN GRAPHIC | 1693:929 | 1376×755 | 1066×585 | 585×321 | **2800 × 1536** PNG 去背 |
| HERO / CURSOR | 1:1 | 122×122 | 107×107 | 72×72 | **500 × 500** PNG 去背 |
| ABOUT / PORTRAIT | 4:5 | 597×670 | 443×554 | 203×253 | **1200 × 1500** |
| WORK 01 MyFamiPort | 16:9 | 1114×626 | 928×522 | 328×184 | **2400 × 1350** |
| WORK 02 甜心卡 | 16:9 | 1114×626 | 928×522 | 328×184 | **2400 × 1350** |
| WORK 03 遊戲中心 | 4:5 | 501×626 | 418×522 | 328×409 | **1200 × 1500** |

作品頁的圖是「吃高度」：`.work-media { height: min(58dvh, 660px); aspect-ratio: var(--ar) }`，
比例寫在每個 `.work-slide` 的 `style="--ar: 16 / 9"`，改那裡就換比例，色塊上的標示會跟著變。
HERO 主視覺比例綁在 `.hero-hello { aspect-ratio: 1693 / 929 }`。

## 看效果：按 D

在頁面上按 `D` 會把滾動速度釘在 velocity=45（等於快速滾動），靜止也看得到破圖／拖影／彎折，
再按一次關掉。主控台也可以 `__hank.pin(60)` 自己給數值、`__hank.pin(null)` 還原。
對照截圖：`verify-shots/fx-off.jpg`（關）、`fx-on.jpg`（開）。

## 調效果：改 `src/app/gl.js` 的 `glConfig`

| 參數 | 現值 | 意思 |
|------|------|------|
| `velocityScale` | 0.012 | 速度 → 效果強度。**調大 = 更容易破圖**（一般滾動現在峰值約 0.5） |
| `velocityEase` | 0.16 | 越小越黏、拖越久 |
| `bendPx` | **0** | 幾何彎折。實測參考站 = 不彎，所以關掉（見下方實測） |
| `stretch` | **0** | 拖動時縱向拉伸，同上 |
| `enterFade` | 0.45 | 切到這頁時圖片的起始亮度，收到 1 |
| `enterZoom` | 0.93 | 切到這頁時貼圖的起始縮放，收到 1 |
| `enterEase` | 0.055 | 進場收斂速度（越小越慢，0.055 ≈ 1 秒） |
| `smearPx` | 26 | 拖影長度 |
| `ditherAmount` | 1.2 | 點陣強度 |
| `ditherMinLevels` | 6 | 最快時的色階數，越小越破 |
| `rgbSplitPx` | 2.4 | 色差位移 |
| `baseBrightness` / `hoverBrightness` | 0.86 / 1.06 | 靜止 / hover 亮度 |

改完存檔，Vite 會熱更新，直接看。要留證據就跑 `npm run verify`。

第一版的參數（velocityScale 0.055 / smearPx 90 / rgbSplitPx 7）**太強**，滾動時整張圖變彩虹糊掉。
現在這組是收斂過的。

### 實測 haoqi.design 的滾動行為（2026-07-29，CDP screencast 逐格量像素）

工具：`scripts/ref-screencast.cjs`、`ref-enter-measure.cjs`、`ref-capture3.cjs`。影格存 `verify-shots/cast`、`enter`、`ref3`。

| 項目 | 實測結果 | 信心 |
|------|----------|------|
| 幾何彎折 | **沒有**。滾動途中卡片上緣 300px 只差 1px，等於直線 | 高（量到數字） |
| 圖片 vs DOM 版位位移 | **0～1px**，圖片完全貼著版位，沒有 lag / 視差 | 高 |
| 滾動中的變形 | 貼圖內容垂直重影／拖糊；hero 3D 物件另外帶點陣 | 高（`cast/zoom-enter.jpg`） |
| 進場 | **沒有特效**。鎖同一張卡片（寬 868 全程一致）逐格量：框內貼圖縮放 0.98~1.02、位移 ±2px、外框寬高不變 → 沒縮放、沒遮罩、沒視差 | 高 |
| 進場亮度 | 191→212 只發生在卡片還在移動時，一停就鎖死 → 是拖影把上緣暗背景混進來，**不是設計的淡入** | 高 |

依據以上：`bendPx` / `stretch` / `enterFade` 全部關掉，效果只留 fragment shader 的拖影＋點陣＋色差。

「一張紙貼入」的感覺來源＝ Lenis expo-out 減速 ＋ 滑行中前緣的拖影，不是逐張圖的進場動畫。

⚠️ 更正紀錄：2026-07-29 稍早曾寫「進場有亮度淡入 148→207（信心中）」，那是量錯——
那幾格的卡片寬度從 1375 跳到 1410，等於跨到了另一張卡片。鎖定同一張後重量，結論改成上表。
量測腳本：`scripts/ref-inner-measure.cjs`。

### 已修掉的坑：色彩空間

貼圖標成 `SRGBColorSpace`，GPU 取樣時會轉成 linear，**自訂 ShaderMaterial 不會幫你轉回 sRGB**。
少了這步，白色沒事、中間調會整片被壓暗（色塊會黑到看不見）。
`gl.js` 的 fragment shader 裡有 `linearToSrgb()`，在 dither 之前套用，不要拿掉。

## DOM 動效

- easing 一律 `cubic-bezier(.66,0,.01,1)`（參考站的 `--cubic-66`），duration `.66s` / `1.2s` / `.3s`。
- 進場：`.mask > span`（遮罩上推，1.2s）、`.reveal`（淡入上移，0.66s）。
- 觸發是 **`.is-active`**：切到某頁時加上、離開時移除 → **每次切回來都會重播**（不是 IntersectionObserver）。
- 作品頁再多一層：非目前那張 `.work-slide:not(.is-active)` 的文字保持在起始狀態，橫推到才播。
- 要錯開就在 HTML 直接寫 `style="transition-delay: 140ms"`。

## 內容來源

文案與作品資料取自 `../hank-portfolio-wp/src/data/`（projects.js / experiences.js / profile.js）與
`src/data/interests.js`，**沒有自己造數字**。依 AGENTS.md **不放任何聯絡方式**。

**5 頁**，一頁一畫面：

| # | id | 內容 |
|---|----|------|
| 01 | `#hero` | CRAFTING / INTUITIVE / DIGITAL EXPERIENCES |
| 02 | `#about` | 人像 + 自我介紹 + 技能列 |
| 03 | `#experience` | 經歷條列：**一段經歷一條、不並排**，編號 / 期間 / 公司 / 職稱 / 一句成果 |
| 04 | `#work` | **三個作品，頁內橫向切換**，每張滿版大圖 + 標題 + 一句話 + 年份／客戶／類型 |
| 05 | `#offwork` | 5 個興趣 + INNOVATE WITH PURPOSE |

作品三張：MyFamiPort（2024）／麥當勞甜心卡（2026）／全家遊戲中心（2025）。
要換作品就改 `index.html` 裡 `.work-track` 內的 `.work-slide`，數量不限，程式會自動算 `01 / N`。
經歷數字全部出自 `experiences.js`（1,450 萬會員、+25%、+10%、+20%、8 個官網、+30%、+15%）。

## ⚠️ 還沒解決的事

1. ~~`hero-hello.png` / `cursor-arrow.png` 疑似從參考站抓的~~ **← 這條是錯的，已查證**
   兩張都是 **codex `imagegen` 產出的原創圖**，不是抓來的。證據：
   `~/.codex/generated_images/019fa8c7-.../call_Df1ee5*.png`（綠幕版 Hello，7/28 21:25）
   與 `call_XMEh*.png`（綠幕版箭頭，7/28 21:28），時間對得上
   `public/images/hero-hello.png`（21:25）與 `cursor-arrow.png`（21:29），去背後才存進專案。
   → 檔案本身是原創產出。只是**設計上高度模仿參考站**（同樣的字、同樣的膨脹光澤藍），
   要不要換成你自己的字（例如 `hank`）是設計判斷，不是版權問題。
2. 人像用的是 `avatar_29d8161807.png`（白底大頭照，肩線是圓弧收邊），不是編輯式照片，建議換。
3. dither shader 是依照滾動截圖的觀察重做的，**沒有參考站的原始 shader 原始碼**，不會 100% 一樣。
4. hero 標題文案取自 `profile.js` 的 `title`，還沒跟你確認過要不要換句子。

## 驗證紀錄（2026-07-29）

`npm run verify`（headless Chrome 1440×900）：

- WebGL 圖層建立成功，6 個版位貼圖全部產生
- 貼圖平面 vs DOM 佔位框對位誤差：dx/dy/dw/dh 全部 0
- 切頁：連滾 8 次得到 `1,2,3(work-01),3(work-02),3(work-03),4,4,4`（到底不再前進），
  倒滾 4 次得到 `work-03, work-02, work-01, experience`，scrollY 每次都整除視窗高
- console 錯誤：0
- 手機版 390×844：無橫向溢出、無錯誤

截圖：`verify-shots/page-*.jpg`（各頁）、`work-01~03.jpg`（三個作品）、
`work-slide-6.jpg`（橫推途中）、`switch-12.jpg`（切頁途中）、`m-work.jpg`（手機）

> 注意：透過 Claude in Chrome 開的分頁是 `document.hidden = true`（視窗被遮住），
> rAF 與 CSS transition 都會凍結，看到的畫面會停在起始狀態。要用眼睛確認動態，
> 請自己開瀏覽器看 http://127.0.0.1:8091 ，或看 `verify-shots/`。

## 2026-07-29 這一輪做完的事

### 檔案新增
| 檔案 | 用途 |
|------|------|
| `src/app/fall.js` | 掉落貼紙的物理堆疊（matter.js），參數在 `fallConfig` |
| `scripts/key-green.cjs` | 綠幕／洋紅幕去背，**自動判斷幕色**（螢光綠物件用洋紅幕） |
| `public/images/fall/*.png` | 八個貼紙的原圖與 `-cut.png` 去背版 |

### Hero 兩階段繪製（毛玻璃 + 水波）
`gl.js` 改成 render-to-texture：
1. 背景（WebGL 畫的藍色緞面 + 水波）＋ 一般圖 ＋ 掉落貼紙 → 離屏貼圖
2. 貼回畫面 → 再畫 `data-gl-glass` 的物件（Hello、箭頭），它們採樣離屏貼圖做**折射 + 環形模糊**

⚠️ 兩個踩過的坑，不要再犯：
- 貼回畫面**不能用 `MeshBasicMaterial`**，內建材質會做 linear→sRGB 轉換，深藍 `7,23,89` 會被提亮成 `50,87,165`。要用純複製的 ShaderMaterial。
- 背景漸層已從 CSS 搬進 WebGL（`BG_FRAG`），`.bg-layer` 只剩純色。改藍底要改 shader 不是改 CSS。

參數：`glassBlurPx` / `glassRefract` / `glassMix` / `ripple*` 都在 `glConfig`。

### 掉落貼紙
- **matter.js 物理**：落到第一畫面底部堆疊、翻滾、順坡滑動
- 尺寸 160–320px，**每個的空氣阻力、自轉、初始角度各自隨機**（速度不一）
- 重力 0.2 + 空氣阻力 0.03–0.085 → 慢慢飄，實測 2 秒下降 33–84px
- 最多 22 個，**不會消失**；切走時整層淡出，切回第一頁整組重來
- ⚠️ **不要用 CSS animation 做**：重新隨機 duration 時瀏覽器會拿已過時間重算進度，實測 600 幀有 92 次單幀位移上千 px（畫面上就是「有東西飛過去」）

### 貼紙色系
第一版做成褪色舊報紙（米白／橄欖），在深藍底上跳不出來。改成**明亮飽和平塗 + 粗黑手繪描邊 + 厚重印刷噪點 + 細米白模切邊**，
對照參考站實際色票：螢光綠 #5CE05C、桃紅 #FF3D8B、亮黃 #FFD23B、天藍、珍珠白。
螢光綠物件（蛙鞋／酒瓶／椰子樹）改用洋紅幕，否則會被綠幕去背一起去掉。

### 文案（依 resume.js / profile.js / experiences.js）
- 第一幕 h1：`I TURN COMPLEX BUSINESS / INTO INTUITIVE / DIGITAL PRODUCTS`
- 第二幕：策略到服務藍圖、客戶清單、AI 工作流、生活（水／山／釣魚／鹿角蕨）
- 第三幕：四段經歷 + 學歷

### 事故紀錄
`styles.css` 被我寫壞過一次（`s.index()` 前後顛倒 → `replace('', x)` 插進每個字元之間，14KB → 9.5MB），
用結構還原（`s.replace(重複區塊,'')`）修回。壞檔殘骸在 `styles.css.corrupt`。
**這個檔案沒進 git，動它之前先 commit。**

### 還沒做
- 轉場時 Hello 3D 旋轉（要把正交相機換成透視相機，會動到所有平面的對位邏輯）
