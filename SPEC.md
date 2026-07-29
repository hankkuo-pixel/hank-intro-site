# SPEC.md — Hank 自我介紹網站 完整規格

版本：v1.0（2026-07-28 由 Claude 起草，交接給 Codex）

---

## 0. 專案定位

| 項目 | 內容 |
|---|---|
| 是什麼 | 郭翰廷（Hank Kuo）的個人自我介紹網站 |
| 不是什麼 | 不是作品集案例站（案例站已存在：<https://www.hank-kuo.com/>，原始碼在 `../hank-portfolio-wp/`） |
| 內容三軸 | 經歷（Experience）／作品（Work）／興趣（Interests） |
| 參考站 | <https://haoqi.design/> — 復刻其視覺語言與互動，**素材全部自己重做** |
| 捲動方式 | 一頁一畫面（full-page snap），滾一次切一頁 |
| 語言 | 標題與 UI 標註英文，內文中文 |
| 聯絡資訊 | **不放**（無 email、無電話、無表單） |

---

## 1. 技術棧

| 層 | 選擇 | 理由 |
|---|---|---|
| 建置 | Vite | 純靜態輸出，之後可直接沿用 `../hank-portfolio-wp/deploy.sh` 的 A2 Hosting 流程 |
| 框架 | Vue 3（Composition API、`<script setup>`） | 與使用者現有作品集同一套，他自己改內容不用重學 |
| 3D／粒子 | Three.js | 第 09 頁的粒子場景 |
| 動效 | 原生 `requestAnimationFrame` + CSS transition | 不引入 GSAP，減少依賴 |
| 分頁引擎 | 自己寫（見 §4） | 不用 fullpage.js（商用要授權） |
| 樣式 | 原生 CSS + CSS 變數 | 不用 Tailwind，token 直接寫在 `styles/tokens.css` |

**不使用 Next.js**：此站無 SSR 需求，且要輸出純靜態上傳既有虛擬主機。

### 專案結構（預期）

```
hank-intro-site/
├── AGENTS.md            # 代理入口
├── SPEC.md              # 本檔
├── HANDOFF.md           # 進度紀錄
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── images/          # codex 生成的圖片資產
├── reference/           # 參考資料（唯讀，不進 build）
│   ├── screenshots/     # 參考站截圖 5 張
│   ├── haoqi-styles.css # 參考站 CSS
│   └── 初版規劃_claude.md
└── src/
    ├── main.js
    ├── App.vue
    ├── styles/
    │   ├── tokens.css   # design tokens
    │   └── base.css     # reset + 全域
    ├── data/
    │   ├── works.js       # 11 件作品
    │   ├── experiences.js # 5 段經歷（含學歷）
    │   └── interests.js   # 5 個興趣
    ├── composables/
    │   ├── usePageScroll.js   # 分頁引擎
    │   ├── useScramble.js     # 亂碼解碼動畫
    │   └── useCursor.js       # 自訂游標
    ├── components/
    │   ├── ThePreloader.vue
    │   ├── TheNav.vue
    │   ├── TheCursor.vue
    │   ├── TheGridOverlay.vue
    │   ├── ThePageIndicator.vue
    │   ├── ScrambleText.vue
    │   └── WorkCard.vue
    └── sections/
        ├── S01Hero.vue
        ├── S02Statement.vue
        ├── S03About.vue
        ├── S04Experience.vue
        ├── S05Work1.vue
        ├── S06Work2.vue
        ├── S07Work3.vue
        ├── S08Interests.vue
        └── S09Ending.vue
```

---

## 2. Design Tokens

以下數值**部分實測自 `reference/haoqi-styles.css`**，部分為截圖目測近似值，已標明。

### 色彩

```css
:root {
  /* 實測自參考站 CSS */
  --accent:            #c0fe04;   /* 螢光綠，標籤／關鍵字／hover 反白 */
  --bg-dark:           #191b1b;   /* 深色底 */

  /* 目測近似值，實作時比對 reference/screenshots/01-hero-statement.jpg 微調 */
  --hero-blue:         #172a9e;   /* Hero 深藍底 */
  --hero-blue-glow:    #2a3fd0;   /* Hero 斜向光暈 */

  /* 語意層（參考站用 label-1/2/3 三階，照抄這個結構） */
  --label-1: #ffffff;             /* 主文字 */
  --label-2: rgba(255,255,255,.55); /* 次文字（About 第二段灰字） */
  --label-3: rgba(255,255,255,.28); /* 弱化文字、未 hover 的表格列 */
  --line:    rgba(255,255,255,.10); /* 格線 */
  --bg-1:    var(--bg-dark);
  --bg-elevated: #202323;
}
```

**明亮主題**（THEME 切換用）：把 label 系列與 bg 對調，accent 不變。參考站有這功能，照做。

### 字體

參考站用 `--font-sans: "tiktok"`（variable font，可調 `wght` 與 `wdth`）與 `--font-mono: "mono"`。這兩支是自訂字體，我們用可取得的替代：

```css
--font-sans:  'Inter Variable', 'Inter', sans-serif;   /* 英文標題，用 wght 軸 */
--font-mono:  'JetBrains Mono', ui-monospace, monospace; /* UI 標註、數字 */
--font-zh:    'Noto Sans TC', 'PingFang TC', sans-serif; /* 中文內文 */
```

字級（實測參考站 Tailwind 尺度）：

| Token | 值 | 用途 |
|---|---|---|
| `--text-xs` | 0.75rem | mono 角落標註 |
| `--text-sm` | 0.875rem | mono 說明 |
| `--text-base` | 1rem | 內文 |
| `--text-hero` | clamp(2.5rem, 6vw, 5.5rem) | S02 巨型宣言 |
| `--text-lead` | clamp(1.5rem, 3vw, 2.75rem) | S03 自述大字 |

### 動效曲線（實測自參考站 CSS）

```css
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);   /* 主要進場 */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);    /* 淡入淡出 */
--dur-page:  900ms;   /* 切頁 */
--dur-enter: 620ms;   /* 元件進場 */
--dur-hover: 200ms;
```

### 版面格線

- 全站 4 欄，欄寬等分，欄線用 `--line`
- 水平線 2 條，位於視窗高 33% 與 67%
- 每個交叉點畫一個 `+`（10×10px，`--line` 色）
- 格線是 `position: fixed` 的 overlay，`pointer-events: none`，浮在內容下層、背景之上
- 左右留白：`padding: 0 clamp(1rem, 3.5vw, 3.5rem)`

---

## 3. 全域常駐元件

四角常駐，`position: fixed`，`z-index` 高於頁面內容：

| 位置 | 內容 | 行為 |
|---|---|---|
| 左上 | `HANK-KUO.COM` | mono、粗體、大寫 |
| 右上 | `WORK` `EXPERIENCE` `INTERESTS` `THEME[A]` `SOUND[·]` | 點擊跳對應頁；THEME 切明暗；SOUND 切音效開關 |
| 左下 | `GMT+8 TPE 20:40` | 每秒更新的即時時間 |
| 中下 | `1280 X 0586 Y` | 即時滑鼠座標 |
| 右下 | 地球圖示 | 語言切換（**本期不做功能，只放圖示佔位**） |
| 右側中 | 頁碼指示 `01 / 09` + 直排刻度 | 目前頁高亮，點擊可跳頁 |

### 自訂游標

- 隱藏系統游標（`cursor: none`）
- 一顆 3D 藍色箭頭圖（`public/images/cursor-arrow.png`，codex 生），跟隨滑鼠但有延遲（lerp 係數 0.12）
- hover 可點元素時放大 1.15 倍
- **手機與觸控裝置不啟用**，恢復系統行為

### ScrambleText 元件

亂碼解碼動畫。**只用於英文、數字、mono 標註**。

```
props: { text: String, duration: 800, charset: '!<>-_\\/[]{}—=+*^?#________' }
行為：每個字元先隨機跳動，依序由左至右定位成正確字元
```

**中文絕對不用這個效果** — 中文字寬不一，亂碼跳動會讓整行寬度抖動。中文改用「遮罩上滑 + 逐行淡入」：外層 `overflow: hidden`，內層 `transform: translateY(100%) → 0`，行與行間隔 80ms。

---

## 4. 分頁引擎（`usePageScroll.js`）

### 行為

- 9 個頁面，每頁高 `100dvh`
- 外層 wrapper 用 `transform: translateY(calc(var(--index) * -100dvh))`，`transition: transform var(--dur-page) var(--ease-out-quint)`
- 切頁完成後，該頁 `isActive = true`，觸發頁內進場動畫
- 離開的頁面 `isActive = false`，重置動畫狀態（**回滾時要能重播**）
- URL hash 同步（`#hero` `#statement` `#about` `#experience` `#work-1` `#work-2` `#work-3` `#interests` `#ending`），可直接開啟指定頁

### 輸入處理（四種，逐一處理）

**這是最容易做壞的部分，不要偷懶。**

1. **滑鼠滾輪 / 觸控板 `wheel`**
   - 觸控板慣性捲動會連續送出數十個事件，不鎖會一口氣飛過三四頁
   - 切頁後上鎖 `--dur-page + 150ms`（約 1050ms），期間所有 wheel 事件直接 `return`
   - 解鎖後還要等「事件停止 120ms」才接受下一次（避免慣性尾巴立刻觸發）
   - 閾值：`Math.abs(deltaY) > 25` 才算一次有效意圖
   - `preventDefault()` 阻止原生捲動（監聽器要 `{ passive: false }`）

2. **觸控 `touchstart` / `touchend`**
   - 垂直位移 > 50px 才算一次切頁
   - 水平位移 > 垂直位移時忽略（讓給頁內橫向元件）

3. **鍵盤**
   - `ArrowDown` `PageDown` `Space` → 下一頁
   - `ArrowUp` `PageUp` → 上一頁
   - `Home` → 第 1 頁，`End` → 第 9 頁

4. **導覽點擊 / 頁碼點擊** → 直接跳，同樣上鎖

### 邊界

- 第 1 頁往上：不動（或加一個 8px 的回彈提示）
- 第 9 頁往下：**回到第 1 頁**（循環），切換時整頁淡出淡入而非滑動

### 無障礙

- `prefers-reduced-motion: reduce` 時：關閉所有進場動畫與粒子，切頁改為瞬間切換

---

## 5. 逐頁規格

> 所有中文文案已定稿，可直接使用。英文標題已定稿。

---

### S00 — PRELOADER（不算頁）

**設計**：全黑，畫面正中一條 140×6px 圓角進度條，底 `--label-3`，填充白色。
**行為**：載入字體與 Hero 3D 圖，進度到 100% 後進度條淡出 250ms，接著 S01 的元素依序解碼進場。
**文案**：無。

---

### S01 — HERO

**版面**：深藍底（`--hero-blue`）+ 斜向光暈 + 格線。中央偏左一顆 3D 液態膨脹字 `Hello`（圖片，見 §6 資產 A1）。右下角有一顆放大的 3D 箭頭裝飾（與游標同款）。

**文字配置**：

| 位置 | 內容 | 動畫 |
|---|---|---|
| 左側大標 | `Design &`<br>`AI Workflow` | 遮罩上滑 |
| 中欄 mono 兩行 | 用系統思考設計，<br>用數據證明價值。 | 逐行淡入 |
| 右上區塊 | 我是郭翰廷，EY 資深體驗設計顧問，正在把 AI 變成設計流程的一部分。 | 逐行淡入，「AI」為 `--accent` 色 |

**注意**：中欄與右上是中文，**不用 scramble**。四角的 mono 英文標註（logo、導覽、時間、座標）才用 scramble。

---

### S02 — STATEMENT

**版面**：`--bg-dark` 底，超大英文字靠左撐滿，佔畫面 60% 高。

**主文案**：
```
I TURN COMPLEXITY
INTO CLEAR EXPERIENCE
```
- 三行斷行：`I TURN COMPLEXITY` / `INTO CLEAR` / `EXPERIENCE`
- 白字為主，`CLEAR` 一詞用 `--accent`
- 逐字 scramble 解碼，字與字間隔 35ms

**中文副標**（mono 小字，置於大字下方）：
> 把千萬人每天在用的複雜系統，變成一次就會用的介面。

---

### S03 — ABOUT

**版面**：左 1/3 直式人像（比例 3:4，暗調側光），右 2/3 兩段大字（`--text-lead`）。

**人像**：見 §6 資產 A2。

**文案**：

第一段（`--label-1`）：
> 我做設計 8 年，現在在 EY 安永擔任資深體驗設計顧問。工作是把複雜的商業需求，變成一看就懂的數位體驗 —— 從問題定義一路做到介面交付。

第二段（`--label-2` 灰字，關鍵字加底線）：
> 經手過 <u>麥當勞</u>、<u>全家便利商店</u>、<u>南山人壽</u>、<u>美廉社</u>。現在正在把 <u>Claude Code</u> 和 <u>Gemini CLI</u> 變成一條從研究、設計到前端的完整生產線。

**互動**：底線關鍵字 hover 變 `--accent`；點擊「麥當勞」「全家便利商店」「美廉社」跳到對應作品頁。「南山人壽」「Claude Code」「Gemini CLI」無對應頁，只做 hover 效果不可點。

**動畫**：人像遮罩由下往上揭開（600ms），文字逐行淡入，行距 80ms。

---

### S04 — EXPERIENCE

**版面**：mono 等寬表格，滿版寬。5 列，每列 `年份 │ 公司 │ 職稱`，列高約 12dvh。

**預設狀態**：全部 `--label-3` 灰字，底線 `--line`。

**hover 狀態**：整列背景轉 `--accent`、文字轉黑，右側從右邊滑入該段的成果條目（2–4 條，mono 小字）。同時列高微幅撐開 8px。

**行動版**：改成手風琴，點擊展開。

**內容**：

| 年份 | 公司 | 職稱 |
|---|---|---|
| 2023 — NOW | EY 安永諮詢服務 | Senior Design Consultant |
| 2020 — 2023 | EY Mtel 台灣八達 | UIUX Designer |
| 2018 — 2020 | 振作國際 | Web Designer |
| 2018 | 鴻緯科技 | Web Designer |
| 2026 — NOW | 國立臺灣科技大學 設計系碩士 | 在職進修 |

**hover 展開內容**（全部出自 `../hank-portfolio-wp/src/data/experiences.js`，不得增刪數字）：

**EY 安永**
- 主導全家 My FamiPort App 重構，服務超過 1,450 萬會員
- 規劃全家記帳本功能，上線後電子發票載具綁定率 +25%、新用戶註冊率 +10%
- 主持 27 人 / 8 小時跨部門工作坊，一天凝聚八大商流共識
- 與 Google 合作主持南山人壽「AI 智慧保單流程」策略工作坊

**EY Mtel**
- 麥當勞行動點點卡、Studio A、美廉社 App 從 0 到 1 的介面設計
- 質化訪談加上 A/B 測試優化介面，關鍵功能使用率 +20%
- 從零建立跨平台 Design System

**振作國際**
- 獨立完成 8 個大型品牌官網（吉美建設、振宇五金、新美齊、GMC 捷美運通）
- 電商平台改版後流量 +30%、購物轉換率 +15%

**鴻緯科技**
- 電子商城整體視覺規劃，重新設計結帳流程與會員中心

**台科大**
- 設計系碩士班在職進修中

**區塊標題**（左上角 mono）：`EXPERIENCE — 8 YEARS`

---

### S05 / S06 / S07 — WORK（三頁）

11 件作品拆三頁。卡片行為三頁共用：

- **預設**：`filter: grayscale(1)`，亮度壓到 0.75
- **hover**：600ms 內轉為全彩、亮度回 1，卡片標題 scramble 重跑一次
- 右上角 `--accent` 底色小標籤（黑字 mono）：`CLIENT PROJECT` 或 `AI PROJECT`
- 卡片下方一行：`作品名 ──────── 年份 類型↗`（mono，`--label-2`）
- 進場：卡片由下位移 40px + 淡入，卡與卡間隔 90ms

#### S05 — WORK 1（全寬大卡）

**版面**：一張佔畫面 70% 的大卡，帶輕微 3D 斜角傾斜（`rotateY(-8deg) rotateX(4deg)`），內容是 App 畫面拼貼。

| 作品 | 年份 | 標籤 |
|---|---|---|
| 全家 MyFamiPort App 重構 | 2024 | CLIENT PROJECT |

**卡片說明文字**：從 1,500 則真實回饋出發，為 1,450 萬會員重塑行動門市體驗。

**區塊標題**：`SELECTED WORK — 11 PROJECTS`

#### S06 — WORK 2（2 欄 ×4）

| 作品 | 年份 | 標籤 |
|---|---|---|
| 麥當勞 甜心卡 | 2026 | CLIENT PROJECT |
| 麥當勞 點數中心 | 2026 | CLIENT PROJECT |
| 全家 遊戲中心 | 2025 | CLIENT PROJECT |
| SCCG 供應鏈資安平台 | 2026 | AI PROJECT |

#### S07 — WORK 3（3 欄 ×6）

| 作品 | 年份 | 標籤 |
|---|---|---|
| 美廉社 補貨系統 App | 2023 | CLIENT PROJECT |
| 美廉社 行動 App | 2023 | CLIENT PROJECT |
| Vendor Portal 訂單管理 | 2020 | CLIENT PROJECT |
| Three Macau 官網 | 2021 | CLIENT PROJECT |
| 八方雲集 形象官網 | 2020 | CLIENT PROJECT |
| 聖保羅烘焙花園 電商 | 2019 | CLIENT PROJECT |

> 各作品的 subtitle 直接取用 `../hank-portfolio-wp/src/data/projects.js`。

---

### S08 — INTERESTS

**版面**：一條水平軸線貫穿畫面中央，5 個節點等距分布。左＝最早，右＝現在。軸線兩端有箭頭與 mono 標註 `EARLIER` / `NOW`。

每個節點：
- 上方一張正方形圖（見 §6 資產 A4，預設灰階、hover 轉彩）
- 節點本身是一個 8px 圓點，hover 時放大並轉 `--accent`
- 下方 mono 英文標籤 + 中文一句話

**動畫**：進場時軸線由左往右畫出（900ms），節點依序彈出（間隔 120ms），圖片同時淡入。

**不標年份**（使用者未提供實際年份，不編造）。

**內容**：

| 順序 | 標籤 | 中文 |
|---|---|---|
| 1 | `WATER SPORTS` | 最早是被水吸引，整個夏天都泡在上面。 |
| 2 | `HIKING` | 後來想往高處走，把海拔當成進度條。 |
| 3 | `DIVING` | 再回到水裡，這次是往下看。 |
| 4 | `STAGHORN FERN` | 唯一不用移動的興趣，鹿角蕨長得慢，剛好練耐性。 |
| 5 | `FISHING` | 現在最常做的事，一半在釣魚，一半在放空。 |

**區塊標題**：`OUTSIDE WORK`

---

### S09 — ENDING

**版面**：全黑，Three.js 粒子場景 —— 青／藍／紫線段由畫面中心向外放射（星際穿越效果），中央疊一行大字。

**粒子規格**：
- 約 800 條線段，`THREE.LineSegments`
- 顏色從 `#00e5ff` `#3b6bff` `#8b3bff` 三色隨機取
- 由中心向外加速噴射，抵達邊界後重置回中心
- 捲動輸入會短暫加速（使用者嘗試往下滾時給回饋，表示已到底）

**文案**：
```
THANKS FOR SCROLLING
```
- 逐字浮現（不是 scramble，是逐字淡入 + 些微上移）

中文小字（下方，`--label-2`）：
> 看到這裡，大概就認識我了。再滾一次回到開頭。

**行為**：在此頁再往下滾 → 淡出後回到 S01（循環）。

---

## 6. 圖片資產清單

**全部用 codex `$imagegen`（gpt-image-2）生成，禁止取用參考站素材。**

Codex 內建 `$imagegen` 走 ChatGPT 訂閱、不需 API key。使用者機器上 `~/.codex/generated_images/` 已有既往生成紀錄，代表功能可用。
若要包成 skill，GitHub 上可參考 `JunSeo99/claude-skill-codex-imagegen` 或 `oakplank/claude-gpt-image-bridge`（**兩者皆未安裝、未測試**）。

| ID | 用途 | 規格 | 生成方向 |
|---|---|---|---|
| A1 | S01 Hero 主視覺 | 2400×1400 PNG 去背 | 小寫手寫連筆的 `Hello`，3D 膨脹管狀造型、光滑塑料材質、藍色漸層、強高光反射、深藍背景 |
| A2 | S03 人像 | 1200×1600 JPG | 亞洲男性半身肖像，暗調側光，青綠色環境光，背景近黑。**優先改用使用者本人照片**（`../hank-portfolio-wp/src/assets/avatar.png`、`header.jpg`），生成僅為備案 |
| A3 | 自訂游標 | 256×256 PNG 去背 | 3D 藍色滑鼠箭頭，圓角、有厚度、白色描邊高光 |
| A4 | S08 興趣圖 ×5 | 各 800×800 JPG | 水上活動／爬山／潛水／鹿角蕨／釣魚，統一風格：低飽和、電影感、單一主體、深色背景 |
| A5 | S05–S07 作品封面 ×11 | 各 1600×1200 JPG | **優先從 `../hank-portfolio-wp/public/uploads/`（86 張既有素材）挑用**，缺的才生成 mockup |
| A6 | favicon | 512×512 SVG／PNG | 極簡 `H` 字母標記 |

**A2 與 A5 先找既有素材，找不到才生成。** 生成前先跟使用者確認一張樣張，通過再批次做。

---

## 7. 資料模型

```js
// src/data/works.js
{
  id: 'myfamiport',
  title: '全家 MyFamiPort App 重構',
  year: '2024',
  tag: 'CLIENT PROJECT',        // 或 'AI PROJECT'
  subtitle: '從 1,500 則真實回饋出發…',
  cover: '/images/work-myfamiport.jpg',
  layout: 'hero',               // 'hero' | 'half' | 'third'
}

// src/data/experiences.js
{
  id: 'ey',
  range: '2023 — NOW',
  company: 'EY 安永諮詢服務',
  role: 'Senior Design Consultant',
  points: ['主導全家 My FamiPort App 重構…', …],
}

// src/data/interests.js
{
  id: 'water-sports',
  label: 'WATER SPORTS',
  text: '最早是被水吸引，整個夏天都泡在上面。',
  image: '/images/interest-water.jpg',
}
```

---

## 8. RWD

| 斷點 | 處理 |
|---|---|
| ≥1280px | 完整版面，4 欄格線 |
| 768–1279px | 格線降為 2 欄；S07 由 3 欄改 2 欄；巨型字降一階 |
| <768px | 格線只留左右兩條；游標特效關閉；S04 改手風琴；S06/S07 改單欄；S08 時間軸改成垂直、可在頁內縱向捲動；粒子數量降到 300 |

**分頁行為在手機保留**（滑動一次切一頁），但切頁時間縮短為 700ms。

---

## 9. 驗收標準

實作完成後必須逐項確認，**不能只確認「看起來對」**：

1. 9 頁都能正常切換，**觸控板連續滑動不會一次飛過多頁**
2. 每頁進場動畫在「離開再回來」時能重播
3. 中文區塊沒有使用 scramble 效果（不會抖動）
4. 卡片灰階 → hover 全彩正常，且在觸控裝置上有替代呈現（直接顯示彩色）
5. THEME 明暗切換兩套顏色都可讀，`--accent` 在兩套下對比度都足夠
6. `prefers-reduced-motion` 開啟時動畫全關、仍可正常瀏覽全部內容
7. 全站無任何聯絡資訊（email／電話）
8. 所有數字與 `../hank-portfolio-wp/src/data/` 一致
9. 使用者可見文字掃過 `~/.claude/forbidden_words.txt` 無命中
10. `npm run build` 輸出純靜態、可用 `npx serve dist` 本機開啟驗證

---

## 10. 明確不做的事（本期範圍外）

- 部署（先做地端，使用者確認後再談）
- 語言切換功能（右下角地球圖示只放佔位）
- SOUND 音效檔本身（先做開關 UI 與狀態，音檔之後補）
- 作品詳細頁（點擊卡片本期只做 hover 效果，不開內頁）
