# Canvas-Verse 參考專案資料夾

本資料夾包含用於開發參考的開源專案，**不會被 Git 追蹤**（已加入 .gitignore）。

> ⚠️ **重要原則**：這些專案僅供學習參考，不要直接複製貼上程式碼。專注於理解架構和實作原理。

---

## 📦 已 Clone 的開源專案

### 1. **Sandpack**（CodeSandbox 開源版）⭐⭐⭐⭐⭐

- **路徑**: `./sandpack/`
- **GitHub**: https://github.com/codesandbox/sandpack
- **NPM**: `@codesandbox/sandpack-react`
- **用途**:
  - 學習如何在瀏覽器中動態執行 React/JSX 程式碼
  - 參考 Canvas Runner 的實作方式
  - 研究 iframe sandboxing 安全機制
  - 了解多檔案專案的執行邏輯
- **關鍵檔案**:
  - `sandpack-react/src/components/` - React 元件實作
  - `sandpack-client/src/clients/runtime/` - 瀏覽器執行引擎
  - `sandpack-client/src/clients/iframe-protocol.ts` - iframe 通訊機制
- **適用階段**: Phase 3 (Canvas Runner)

---

### 2. **Express + Prisma + tRPC Starter**（後端架構參考）⭐⭐⭐⭐⭐

- **路徑**: `./express-prisma-trpc-starter/`
- **GitHub**: https://github.com/ansh/express-prisma-trpc-starter
- **用途**:
  - 學習如何整合 Express + Prisma + tRPC
  - 參考 API 路由設計
  - 了解型別安全的 API 實作
  - 學習資料庫 schema 設計
- **關鍵檔案**:
  - `src/index.ts` - Express 伺服器設定
  - `src/router.ts` - tRPC 路由定義
  - `prisma/schema.prisma` - 資料庫 schema
- **適用階段**: Phase 0-1 (專案設定、後端基礎)

---

### 3. **PNPM Monorepo 範例**（專案結構參考）⭐⭐⭐⭐⭐

- **路徑**: `./pnpm-monorepo-example/`
- **GitHub**: https://github.com/mohitkumartoshniwal/monorepo
- **用途**:
  - 學習 pnpm workspaces 設定
  - 參考 Monorepo 目錄結構
  - 了解共用套件（shared packages）架構
  - 學習 TypeScript 跨專案配置
- **關鍵檔案**:
  - `pnpm-workspace.yaml` - workspace 設定
  - `package.json` - root package.json
  - `apps/` - 應用程式目錄
  - `packages/` - 共用套件目錄
- **適用階段**: Phase 0 (專案設定)

---

### 4. **Monaco React**（程式碼編輯器）⭐⭐⭐⭐

- **路徑**: `./monaco-react/`
- **GitHub**: https://github.com/suren-atoyan/monaco-react
- **NPM**: `@monaco-editor/react`
- **用途**:
  - 學習如何整合 Monaco Editor（VSCode 編輯器）
  - 參考程式碼編輯器元件實作
  - 了解語法高亮和自動補全設定
  - 學習效能優化技巧
- **關鍵檔案**:
  - `src/Editor/Editor.tsx` - 編輯器元件
  - `src/hooks/` - 自訂 hooks
  - `demo/` - 使用範例
- **適用階段**: Phase 3 (程式碼編輯器)

---

### 5. **React CodeMirror**（輕量編輯器替代方案）⭐⭐⭐⭐

- **路徑**: `./react-codemirror/`
- **GitHub**: https://github.com/uiwjs/react-codemirror
- **NPM**: `@uiw/react-codemirror`
- **用途**:
  - Monaco Editor 的輕量替代方案
  - 學習 CodeMirror 6 整合
  - 參考擴展功能（extensions）設定
  - 了解主題客製化
- **關鍵檔案**:
  - `core/src/` - 核心元件
  - `extensions/` - 語言擴展
  - `themes/` - 主題實作
- **適用階段**: Phase 3 (程式碼編輯器，備選方案)

---

### 6. **Playground Sandbox**（安全執行環境）⭐⭐⭐⭐

- **路徑**: `./playground-sandbox/`
- **GitHub**: https://github.com/live-codes/playground-sandbox
- **用途**:
  - 學習如何安全執行不受信任的程式碼
  - 參考沙盒隔離機制
  - 了解 iframe 安全策略
  - 學習錯誤捕捉和處理
- **關鍵檔案**:
  - `src/sandbox.ts` - 沙盒實作
  - `src/types.ts` - 型別定義
- **適用階段**: Phase 3 (Canvas Runner 安全性)

---

### 7. **React Safe Srcdoc Iframe**（iframe 安全性）⭐⭐⭐

- **路徑**: `./react-safe-src-doc-iframe/`
- **GitHub**: https://github.com/godaddy/react-safe-src-doc-iframe
- **NPM**: `react-safe-src-doc-iframe`
- **用途**:
  - 學習安全的 iframe 實作
  - 參考 srcdoc 屬性使用
  - 了解 CSP（Content Security Policy）設定
  - 學習 XSS 防護機制
- **關鍵檔案**:
  - `src/SafeSrcdocIframe.js` - 安全 iframe 元件
  - `README.md` - 安全性說明
- **適用階段**: Phase 3 (Canvas Runner 安全性)

---

## 🎯 各開發階段參考專案對照表

| 開發階段                   | 主要參考專案                 | 次要參考專案                |
| -------------------------- | ---------------------------- | --------------------------- |
| **Phase 0: 專案設定**      | pnpm-monorepo-example        | express-prisma-trpc-starter |
| **Phase 1: 後端基礎**      | express-prisma-trpc-starter  | -                           |
| **Phase 2: 前端整合**      | -                            | -                           |
| **Phase 3: Canvas Runner** | sandpack, playground-sandbox | react-safe-src-doc-iframe   |
| **Phase 3: 程式碼編輯器**  | monaco-react                 | react-codemirror            |
| **Phase 4: UI/UX**         | -                            | -                           |
| **Phase 5: 範例系統**      | -                            | -                           |

---

## 📚 學習重點

### Sandpack：

1. **動態程式碼執行**: 如何在瀏覽器中安全執行使用者程式碼
2. **多檔案支援**: 如何處理多個檔案的依賴關係
3. **錯誤處理**: 如何捕捉並顯示執行時錯誤
4. **效能優化**: 如何減少不必要的重新編譯

### Express + Prisma + tRPC：

1. **型別安全**: 前後端共享型別定義
2. **API 設計**: RESTful vs tRPC 比較
3. **資料庫設計**: Prisma schema 最佳實踐
4. **中介軟體**: 認證和錯誤處理

### PNPM Monorepo：

1. **工作區設定**: pnpm-workspace.yaml 配置
2. **依賴管理**: 共用和獨立依賴的區分
3. **建置流程**: 跨專案建置順序
4. **型別共享**: 共用 TypeScript 型別

### Monaco/CodeMirror：

1. **編輯器整合**: React 元件封裝
2. **語法高亮**: 語言支援擴展
3. **自動補全**: IntelliSense 設定
4. **效能優化**: 大型檔案處理

### 安全性（Playground Sandbox + Safe Iframe）：

1. **Sandbox 屬性**: allow-scripts, allow-same-origin 等
2. **CSP 設定**: Content Security Policy 配置
3. **XSS 防護**: 防止跨站腳本攻擊
4. **隔離策略**: iframe vs Web Workers

---

## 🔧 使用建議

### ✅ 應該做的：

1. **閱讀文件**: 先閱讀專案的 README 和文件
2. **理解架構**: 專注於理解整體架構和設計思路
3. **參考模式**: 學習設計模式和最佳實踐
4. **實驗測試**: 在本地環境測試關鍵功能
5. **記錄筆記**: 記錄重要發現和可用的概念

### ❌ 不應該做的：

1. **直接複製**: 不要直接複製貼上大段程式碼
2. **照搬結構**: 不要完全照搬目錄結構（需適應我們的需求）
3. **忽略授權**: 注意各專案的開源授權條款
4. **依賴過深**: 避免過度依賴特定實作細節

---

## 🌐 延伸資源

### 官方文件：

- [Sandpack 官方文件](https://sandpack.codesandbox.io/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)
- [CodeMirror 6 文件](https://codemirror.net/docs/)
- [tRPC 文件](https://trpc.io/)
- [Prisma 文件](https://www.prisma.io/docs/)
- [PNPM Workspaces](https://pnpm.io/workspaces)

### 安全性資源：

- [iframe Sandbox 屬性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

### 教學文章：

- [在瀏覽器中執行 JSX](https://dev.to/devalnor/running-jsx-in-your-browser-without-babel-1agc)
- [建立安全的程式碼沙盒](https://www.joshwcomeau.com/react/next-level-playground/)
- [Monorepo 最佳實踐](https://jsdev.space/complete-monorepo-guide/)

---

## 📝 快速查找指南

**需要了解...**：

- **如何執行 JSX？** → 查看 `sandpack/sandpack-client/src/`
- **如何設定 Monorepo？** → 查看 `pnpm-monorepo-example/pnpm-workspace.yaml`
- **如何整合編輯器？** → 查看 `monaco-react/src/Editor/`
- **如何設計 API？** → 查看 `express-prisma-trpc-starter/src/router.ts`
- **如何確保安全？** → 查看 `playground-sandbox/src/` 和 `react-safe-src-doc-iframe/`

---

最後更新：2025-11-21
