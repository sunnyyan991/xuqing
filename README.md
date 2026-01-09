# Xuqing Portfolio

一個基於 Vue 3 + Vite + Tailwind CSS 的個人作品集網站。

## 特色

- **自動化內容管理**：自動讀取 `src/assets/works/` 目錄結構生成導航和頁面
- **文件夾即路由**：新增作品只需添加文件夾，無需修改代碼
- **極簡設計**：參考 youbinwang.com 的設計風格
- **響應式佈局**：完美適配各種螢幕尺寸

## 目錄結構

```
src/
├── assets/
│   ├── hero.svg           # 首頁大圖
│   └── works/             # 作品目錄
│       ├── 01_Brand_Identity/
│       │   ├── cover.svg   # 封面圖（必需）
│       │   ├── 01_overview.svg
│       │   └── 02_logo.svg
│       ├── 02_Web_Design/
│       │   ├── cover.svg
│       │   └── 01_homepage.svg
│       └── 03_App_Design/
│           ├── cover.svg
│           └── 01_screens.svg
├── components/
│   ├── TheHeader.vue      # 頂部導航
│   └── TheFooter.vue      # 頁腳
├── composables/
│   └── usePortfolio.js    # 核心邏輯：讀取作品目錄
├── router/
│   └── index.js           # 路由配置
├── views/
│   ├── HomeView.vue       # 首頁
│   └── DetailView.vue     # 作品詳情頁
├── App.vue
├── main.js
└── style.css              # Tailwind 樣式
```

## 如何添加新作品

1. 在 `src/assets/works/` 下創建新文件夾
2. 命名格式：`XX_ProjectName`（如 `04_Poster_Design`）
3. 在文件夾內放置：
    - `cover.png/jpg/svg` - 作為首頁封面（必需）
    - 其他圖片 - 將在詳情頁垂直展示

系統會自動：

- 生成導航按鈕（使用 XX 作為編號）
- 在首頁網格中顯示封面
- 創建詳情頁展示所有圖片

## 開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build
```

## 技術棧

- Vue 3 (Composition API)
- Vite
- Vue Router
- Tailwind CSS
