# Xuqing Portfolio

一個基於 Vue 3 + Vite + Tailwind CSS 的個人作品集網站，專注於**自動化內容管理**。

![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)

## ✨ 特色功能

| 功能              | 說明                               |
|-----------------|----------------------------------|
| 📁 **文件夾即路由**   | 新增作品只需添加文件夾，無需修改任何代碼             |
| 🖼️ **智能封面選擇**  | 自動使用 `cover.*` 或第一張圖片作為封面        |
| 🔗 **SVG 交互支持** | SVG 內部的鏈接可正常點擊                   |
| 📱 **響應式設計**    | 完美適配桌面、平板、手機                     |
| 🌙 **晝夜模式**      | 頂部按鈕切換並記住選擇，首次訪問跟隨系統設定      |
| 🚀 **自動部署**     | Push 到 main 分支自動部署到 GitHub Pages |

## 📂 目錄結構

```
src/
├── assets/
│   ├── hero.png              # 首頁大圖
│   └── works/                # 作品目錄（自動讀取）
│       ├── 01_Brand_Identity/
│       │   ├── cover.png     # 封面圖（可選）
│       │   ├── image1.png
│       │   └── image2.svg    # 支持 SVG 內部鏈接
│       ├── 02_Web_Design/
│       └── 03_App_Design/
├── components/
│   ├── TheHeader.vue         # 頂部導航（動態生成）
│   └── TheFooter.vue         # 頁腳
├── composables/
│   └── usePortfolio.js       # 核心：import.meta.glob 邏輯
├── views/
│   ├── HomeView.vue          # 首頁
│   └── DetailView.vue        # 作品詳情頁
└── router/
    └── index.js
```

## 🚀 快速開始

### 安裝與運行

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

### 添加新作品

只需 3 步，無需修改代碼：

```bash
# 1. 創建文件夾（格式：序號_名稱）
mkdir src/assets/works/04_New_Project

# 2. 添加圖片
cp your-images/*.png src/assets/works/04_New_Project/

# 3. 完成！重新運行即可看到
```

### 文件夾命名規則

```
XX_Project_Name
│   │
│   └── 顯示名稱（下劃線轉空格）→ "Project Name"
└── 排序編號（用於導航順序）
```

**示例：**

文件夾序號控制作品排序並保留原有詳情頁鏈接；頁面顯示編號按排序從 `01` 連續生成。

- `01_Brand_Identity` → 導航顯示 "Brand Identity"
- `02_Web_Design` → 導航顯示 "Web Design"
- `10_Logo_Collection` → 導航顯示 "Logo Collection"

### 圖片規則

| 文件名       | 用途         |
|-----------|------------|
| `cover.*` | 作為首頁封面（可選） |
| 其他圖片      | 詳情頁垂直展示    |

> 💡 如果沒有 `cover.*`，會自動使用第一張圖片作為封面

### SVG 內部鏈接

支持在 SVG 中添加可點擊的鏈接：

```svg

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
   <a href="https://example.com" target="_blank">
      <rect x="100" y="100" width="200" height="100" fill="#333"/>
      <text x="200" y="160" fill="white" text-anchor="middle">點擊我</text>
   </a>
</svg>
```

## 🌐 GitHub Pages 部署

### 自動部署（推薦）

1. 推送代碼到 GitHub：
   ```bash
   git add .
   git commit -m "Update portfolio"
   git push origin main
   ```

2. 啟用 GitHub Pages：
   - 進入倉庫 → **Settings** → **Pages**
   - **Source** 選擇 `GitHub Actions`

3. 完成！每次 push 會自動部署

### 自定義域名

如果使用自定義域名，修改 `vite.config.js`：

```js
export default defineConfig({
   base: '/',  // 改為 '/'
   // ...
})
```

## 🎨 自定義配置

### 修改個人信息

**頁腳 Email：** `src/components/TheFooter.vue`

```vue
const email = 'your-email@example.com'
```

**Logo 名稱：** `src/components/TheHeader.vue`

```vue

<RouterLink to="/">Your Name</RouterLink>
```

### 修改樣式

**顏色配置：** `tailwind.config.js`

```js
colors: {
   primary: '#000000',
           secondary
:
   '#888888',
   // ...
}
```

**字體配置：** `tailwind.config.js`

```js
fontFamily: {
   sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
}
```

## 🛠️ 技術棧

- **框架：** Vue 3 (Composition API)
- **構建工具：** Vite 7
- **路由：** Vue Router 4
- **樣式：** Tailwind CSS 3
- **部署：** GitHub Actions + GitHub Pages

## 📄 License

MIT License

---

Made with ❤️ by Xuqing Yan
