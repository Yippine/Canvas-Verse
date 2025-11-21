# Canvas-Verse 文件中心

> **版本**: v1.0
> **最後更新**: 2025-11-21

歡迎來到 Canvas-Verse 技術文件中心！這裡包含了完整的開發和部署指南。

---

## 📚 文件導航

### 🏗️ [技術架構 (ARCHITECTURE.md)](./ARCHITECTURE.md)
**閱讀時間**: 30 分鐘

了解 Canvas-Verse 的整體技術架構：
- 技術棧選型與原因
- 系統架構圖
- 資料庫設計
- Monorepo 目錄結構
- Canvas 格式支援機制
- 安全性設計
- 效能優化策略

**適合對象**: 所有開發者（必讀）

---

### 👨‍💻 [開發指南 (DEVELOPMENT.md)](./DEVELOPMENT.md)
**閱讀時間**: 1-2 小時

詳細的分階段開發指南：
- ✅ Phase 0: 專案設定（Monorepo + 基礎）
- ✅ Phase 1: 後端基礎建設（API + 認證）
- ✅ Phase 2: 前端整合（串接 API）
- ✅ Phase 3: Canvas Runner（動態執行）
- ✅ Phase 4: UI/UX 美化
- ✅ Phase 5: 範例系統
- ✅ Phase 6: 部署

**每個階段都標註了需要參考的開源專案！**

**適合對象**: 實作開發者（核心文件）

---

### 🔌 [API 文件 (API.md)](./API.md)
**閱讀時間**: 20 分鐘

完整的 API 端點說明：
- 認證 API（註冊、登入、登出）
- Canvas CRUD API
- 錯誤處理規範
- 資料模型定義
- 範例請求（cURL + JavaScript）

**適合對象**: 前端開發者、API 整合

---

### 🚀 [部署指南 (DEPLOYMENT.md)](./DEPLOYMENT.md)
**閱讀時間**: 30 分鐘

從本地到生產環境的完整部署流程：
- 免費部署方案（Vercel + Railway）
- 前端部署步驟
- 後端部署步驟
- 資料庫設定（PostgreSQL）
- 環境變數配置
- 自訂網域設定
- 監控與除錯
- 安全性檢查清單

**適合對象**: DevOps、部署負責人

---

### 🎨 [Canvas 格式規範 (CANVAS_FORMATS.md)](./CANVAS_FORMATS.md)
**閱讀時間**: 15 分鐘

Canvas 支援的格式和執行機制：
- HTML/CSS/JS 格式
- JSX 格式
- TSX 格式
- 程式碼限制和規範
- 安全性考量

**適合對象**: 使用者、開發者

---

## 🔗 參考資源

### 開源專案參考（`_reference/` 目錄）

我們 clone 了多個成熟的開源專案作為參考：

1. **Sandpack** - Canvas 執行引擎參考
2. **Express + Prisma + tRPC Starter** - 後端架構參考
3. **PNPM Monorepo 範例** - 專案結構參考
4. **Monaco React** - 程式碼編輯器
5. **React CodeMirror** - 輕量編輯器
6. **Playground Sandbox** - 安全執行環境
7. **React Safe Srcdoc Iframe** - iframe 安全性

詳見：[`_reference/README.md`](../_reference/README.md)

---

## 📖 閱讀順序建議

### 對於新手開發者：

1. 📖 先讀 [ARCHITECTURE.md](./ARCHITECTURE.md) 了解整體架構
2. 📖 再讀 [DEVELOPMENT.md](./DEVELOPMENT.md) 跟著實作
3. 📖 開發時參考 [API.md](./API.md)
4. 📖 最後參考 [DEPLOYMENT.md](./DEPLOYMENT.md) 部署

### 對於前端開發者：

1. 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - 前端技術棧章節
2. 📖 [API.md](./API.md) - 了解 API 接口
3. 📖 [DEVELOPMENT.md](./DEVELOPMENT.md) - Phase 2-4 章節

### 對於後端開發者：

1. 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - 後端技術棧、資料庫設計
2. 📖 [DEVELOPMENT.md](./DEVELOPMENT.md) - Phase 1 章節
3. 📖 [API.md](./API.md) - API 設計

### 對於 DevOps：

1. 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - 完整部署流程
2. 📖 [ARCHITECTURE.md](./ARCHITECTURE.md) - 系統架構章節

---

## 🎯 快速查找

### 需要了解...

- **如何設定 Monorepo？** → [DEVELOPMENT.md - Phase 0](./DEVELOPMENT.md#phase-0-專案設定)
- **如何實作認證？** → [DEVELOPMENT.md - Phase 1](./DEVELOPMENT.md#phase-1-後端基礎建設)
- **如何執行 JSX？** → [DEVELOPMENT.md - Phase 3](./DEVELOPMENT.md#phase-3-canvas-runner)
- **如何部署到生產？** → [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API 端點有哪些？** → [API.md](./API.md)
- **資料庫怎麼設計？** → [ARCHITECTURE.md - 資料庫設計](./ARCHITECTURE.md#資料庫設計)
- **有哪些參考專案？** → [_reference/README.md](../_reference/README.md)

---

## 🤝 貢獻文件

如果您發現文件有錯誤或需要補充：

1. 在 GitHub 開 Issue
2. 或直接發 Pull Request 修正
3. 遵循現有的文件格式和風格

---

## 📝 文件版本記錄

| 版本 | 日期 | 變更內容 |
|------|------|---------|
| v1.0 | 2025-11-21 | 初始版本，包含完整的技術文件 |

---

## ⚖️ 授權

本文件與 Canvas-Verse 專案使用相同的開源授權。

---

**有疑問？** 歡迎在 [GitHub Discussions](https://github.com/your-username/Canvas-Verse/discussions) 提問！
