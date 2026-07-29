# AGENTS.md — 代理入口

本專案由 Claude 起草規劃，**現由 Codex 接手實作**。

## 動工前必讀（照順序）

1. `SPEC.md` — 完整規格：技術棧、design tokens、9 頁的設計與文案、動效規格
2. `HANDOFF.md` — 目前進度、已確認決策、待辦、卡點
3. `reference/screenshots/` — 參考站實際截圖（5 張，Codex 可用 `codex -i <檔案>` 讀）
4. `reference/haoqi-styles.css` — 參考站扒下來的完整 CSS
5. `~/.claude/CLAUDE.md` — 使用者的全域工作守則（品質標準、溝通方式）

## 這個專案是什麼

Hank（郭翰廷）的**自我介紹網站**，不是作品集案例站。

- 參考站 <https://haoqi.design/> 的視覺與互動
- 內容三軸：**經歷 / 作品 / 興趣**
- **一頁一畫面**（full-page snap），滾一次切一頁，切頁同時播該頁動畫
- 語言：**標題與 UI 標註用英文，內文用中文**

## 核心原則

- **不放聯絡方式**（電話、email 都不放）。這站純自我介紹
- 所有作品數字（1,450 萬會員、+25%、+10% 等）**出自 `../hank-portfolio-wp/src/data/`，不准自己造數字**
- 先做**地端**，跑得起來、確認過再談部署
- 每完成一個階段**停下來報告**，等使用者說「繼續」才做下一個
- 做完任何一段，把結果寫回 `HANDOFF.md`

## 資料來源（現有作品集，唯讀）

```
../hank-portfolio-wp/src/data/
├── projects.js      # 10 個作品案例（含 subtitle、highlights）
├── experiences.js   # 4 段工作經歷
├── resume.js        # 履歷、學歷、代表作
├── profile.js       # 個人簡介
└── skills.js        # 技能卡片
../hank-portfolio-wp/public/uploads/   # 86 張既有圖片素材，可挑用
```

## 用詞限制

寫任何使用者會看到的文字前，先讀並比對 `~/.claude/forbidden_words.txt`（AI 腔與流行商業術語清單），命中就改寫。
