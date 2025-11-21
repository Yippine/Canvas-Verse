# Canvas-Verse 技術架構文件

> **最後更新**: 2025-11-21
> **狀態**: 規劃階段
> **版本**: v1.0

---

## 📋 目錄

- [專案概述](#專案概述)
- [技術棧選型](#技術棧選型)
- [系統架構](#系統架構)
- [資料庫設計](#資料庫設計)
- [目錄結構](#目錄結構)
- [Canvas 格式支援](#canvas-格式支援)
- [安全性設計](#安全性設計)
- [效能優化策略](#效能優化策略)

---

## 專案概述

### 專案定位
Canvas-Verse 是一個開源的程式碼收藏平台，讓使用者可以：
- 收藏和管理 Gemini 生成的 Canvas（HTML/JSX/TSX）
- 動態執行和預覽程式碼
- 分享和複製範例
- 本地優先，完全掌控資料

### 核心特色
✅ **完全開源** - 無第三方鎖定
✅ **會員系統** - 獨立帳號和資料隔離
✅ **動態執行** - 瀏覽器中即時執行程式碼
✅ **安全沙盒** - iframe 隔離保護
✅ **美觀 UI** - 現代化設計風格

---

## 技術棧選型

### 原則
1. **完全開源免費** - 不依賴收費平台服務
2. **型別安全** - TypeScript 全棧
3. **現代化** - 使用最新穩定版本
4. **可擴展** - Monorepo 架構便於擴展

### 前端技術棧

| 技術 | 版本 | 用途 | 替代方案 |
|------|------|------|---------|
| **React** | 19.2.0 | UI 框架 | - |
| **Vite** | 7.2.4 | 建置工具 | - |
| **Tailwind CSS** | 4.1.17 | 樣式框架 | - |
| **Framer Motion** | 12.23.24 | 動畫庫 | - |
| **TanStack Router** | ^1.0.0 | 路由管理 | React Router |
| **Zustand** | ^5.0.0 | 狀態管理（輕量 3KB） | Jotai, Valtio |
| **TanStack Query** | ^5.0.0 | 資料快取和同步 | SWR |
| **Monaco Editor** | ^4.7.0 | 程式碼編輯器（VSCode 同款） | CodeMirror 6 |
| **Zod** | ^3.22.0 | 資料驗證 | - |

**參考專案**:
- 🔗 `_reference/monaco-react/` - Monaco Editor 整合
- 🔗 `_reference/react-codemirror/` - CodeMirror 備選方案

### 後端技術棧

| 技術 | 版本 | 用途 | 替代方案 |
|------|------|------|---------|
| **Node.js** | 20+ | 執行環境 | - |
| **Express.js** | ^4.18.0 | Web 框架 | Fastify, Hono |
| **Prisma** | ^5.0.0 | ORM | Drizzle, TypeORM |
| **Lucia Auth** | ^3.0.0 | 認證系統 | NextAuth, Passport |
| **tRPC** | ^11.0.0 | 型別安全 API（選配） | 傳統 REST |
| **Zod** | ^3.22.0 | 資料驗證 | Yup, Joi |

**參考專案**:
- 🔗 `_reference/express-prisma-trpc-starter/` - 完整後端架構
- 🔗 Lucia Auth 官方範例

### 資料庫選項

| 方案 | 適用階段 | 優點 | 缺點 |
|------|---------|------|------|
| **SQLite** | MVP | 無需安裝，檔案型 | 並發限制 |
| **PostgreSQL** | 生產環境 | 功能強大，可擴展 | 需要伺服器 |
| **MySQL** | 生產環境 | 成熟穩定 | 功能略少 |

**推薦**: 開發用 SQLite，生產用 PostgreSQL

### 開發工具

| 工具 | 用途 |
|------|------|
| **PNPM** | 套件管理（比 npm 快 2-3 倍） |
| **Turborepo** | Monorepo 建置工具（選配） |
| **ESLint + Prettier** | 程式碼格式化和檢查 |
| **Vitest** | 單元測試 |
| **Playwright** | E2E 測試（選配） |

**參考專案**:
- 🔗 `_reference/pnpm-monorepo-example/` - PNPM Workspaces 範例

---

## 系統架構

### 整體架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (使用者端)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  React App   │  │ Code Editor  │  │Canvas Runner │     │
│  │  (Vite)      │  │ (Monaco)     │  │(iframe/Babel)│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           ↓                                 │
│                   TanStack Query                            │
│                   (快取層)                                    │
│                           ↓                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                    API Server (Node.js)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Express.js   │  │  Lucia Auth  │  │tRPC (選配)   │     │
│  │ (REST API)   │  │  (認證)      │  │(型別安全)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                  │              │
│         └─────────────────┴──────────────────┘              │
│                           ↓                                 │
│                      Prisma ORM                             │
│                           ↓                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                Database (PostgreSQL/SQLite)                 │
├─────────────────────────────────────────────────────────────┤
│  Tables: User, Session, Canvas, Tag (optional)              │
└─────────────────────────────────────────────────────────────┘
```

**參考專案**:
- 🔗 `_reference/express-prisma-trpc-starter/` - API 伺服器架構
- 🔗 `_reference/pnpm-monorepo-example/` - 前後端分離架構

### Monorepo 結構

```
Canvas-Verse/
├── apps/
│   ├── web/          # Frontend React 應用
│   └── server/       # Backend Node.js 伺服器
├── packages/
│   ├── types/        # 共用 TypeScript 類型
│   ├── validation/   # Zod schemas
│   └── trpc/         # tRPC 路由定義（選配）
├── _reference/       # 參考專案（不納入 Git）
└── docs/             # 文件
```

**參考專案**:
- 🔗 `_reference/pnpm-monorepo-example/pnpm-workspace.yaml`

---

## 資料庫設計

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // 或 "sqlite"
  url      = env("DATABASE_URL")
}

// 使用者表
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?

  // 關聯
  canvases  Canvas[]
  sessions  Session[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}

// Canvas 表（核心）
model Canvas {
  id          String   @id @default(cuid())
  title       String   // Canvas 標題
  type        String   // "html" | "jsx" | "tsx"
  code        String   @db.Text // 程式碼內容
  description String?  // 描述（選配）
  tags        String[] // 標籤陣列

  // 外鍵
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // 元數據
  isPublic    Boolean  @default(false) // 是否公開（未來功能）
  views       Int      @default(0)     // 瀏覽次數（未來功能）

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([createdAt])
  @@index([type])
  @@map("canvases")
}

// Session 表（Lucia Auth 需要）
model Session {
  id        String   @id
  userId    String
  expiresAt DateTime

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}
```

**參考專案**:
- 🔗 `_reference/express-prisma-trpc-starter/prisma/schema.prisma`

### 資料關係圖

```
User (使用者)
 │
 ├──< Canvas (一對多)
 │     ├── id
 │     ├── title
 │     ├── type
 │     ├── code
 │     └── tags[]
 │
 └──< Session (一對多)
       ├── id
       ├── expiresAt
       └── userId
```

---

## 目錄結構

### 完整目錄樹

```
Canvas-Verse/
├── apps/
│   ├── web/                          # Frontend
│   │   ├── src/
│   │   │   ├── features/             # Feature-based 架構
│   │   │   │   ├── auth/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   │   ├── RegisterForm.tsx
│   │   │   │   │   │   └── UserProfile.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   ├── useAuth.ts
│   │   │   │   │   │   └── useSession.ts
│   │   │   │   │   └── api.ts
│   │   │   │   │
│   │   │   │   ├── canvases/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CanvasCard.tsx
│   │   │   │   │   │   ├── CanvasEditor.tsx
│   │   │   │   │   │   ├── CanvasViewer.tsx
│   │   │   │   │   │   ├── CanvasList.tsx
│   │   │   │   │   │   └── CodeRunner/
│   │   │   │   │   │       ├── HtmlRunner.tsx
│   │   │   │   │   │       ├── JsxRunner.tsx
│   │   │   │   │   │       └── TsxRunner.tsx
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   ├── useCanvases.ts
│   │   │   │   │   │   ├── useCanvasOperations.ts
│   │   │   │   │   │   └── useCodeRunner.ts
│   │   │   │   │   └── api.ts
│   │   │   │   │
│   │   │   │   └── examples/
│   │   │   │       ├── components/
│   │   │   │       │   ├── ExampleGallery.tsx
│   │   │   │       │   └── ExampleCard.tsx
│   │   │   │       └── templates/
│   │   │   │           ├── html/
│   │   │   │           ├── jsx/
│   │   │   │           └── manifest.json
│   │   │   │
│   │   │   ├── shared/               # 共用元件
│   │   │   │   ├── components/
│   │   │   │   │   ├── Layout.tsx
│   │   │   │   │   ├── SearchBar.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   └── Button.tsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useI18n.ts
│   │   │   │   │   └── useDebounce.ts
│   │   │   │   └── utils/
│   │   │   │       ├── codeRunner.ts
│   │   │   │       └── validation.ts
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── trpc.ts           # tRPC 客戶端
│   │   │   │   └── constants.ts
│   │   │   │
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   │
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── server/                       # Backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── canvases.ts
│       │   │   └── users.ts
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.ts
│       │   │   ├── validate.ts
│       │   │   ├── error.ts
│       │   │   └── cors.ts
│       │   │
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── canvas.service.ts
│       │   │   └── user.service.ts
│       │   │
│       │   ├── lib/
│       │   │   ├── lucia.ts          # Lucia Auth 設定
│       │   │   ├── prisma.ts         # Prisma Client
│       │   │   └── trpc.ts           # tRPC 設定
│       │   │
│       │   └── index.ts
│       │
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       │
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                         # 共用套件
│   ├── types/
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   ├── canvas.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validation/
│   │   ├── src/
│   │   │   ├── auth.ts
│   │   │   ├── canvas.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── trpc/                         # tRPC 共用（選配）
│       ├── src/
│       │   ├── router.ts
│       │   └── index.ts
│       └── package.json
│
├── _reference/                       # 參考專案（已 gitignore）
│   ├── sandpack/
│   ├── express-prisma-trpc-starter/
│   ├── pnpm-monorepo-example/
│   ├── monaco-react/
│   ├── react-codemirror/
│   ├── playground-sandbox/
│   ├── react-safe-src-doc-iframe/
│   └── README.md
│
├── docs/                             # 文件
│   ├── ARCHITECTURE.md               # 本文件
│   ├── DEVELOPMENT.md                # 開發指南
│   ├── API.md                        # API 文件
│   ├── DEPLOYMENT.md                 # 部署指南
│   └── CANVAS_FORMATS.md             # Canvas 格式規範
│
├── .gitignore
├── pnpm-workspace.yaml
├── package.json                      # Root package.json
├── tsconfig.json                     # 共用 TS 設定
├── README.md
└── LICENSE
```

**參考專案**:
- 🔗 `_reference/pnpm-monorepo-example/` - 完整 Monorepo 結構

---

## Canvas 格式支援

### 支援的格式

| 格式 | 優先級 | 執行方式 | 相依套件大小 |
|------|-------|---------|-------------|
| **HTML/CSS/JS** | P0（必須） | iframe 直接載入 | 0 KB |
| **JSX** | P0（必須） | Babel Standalone | ~500 KB |
| **TSX** | P1（建議） | Babel Standalone + TS | ~600 KB |
| **純 JavaScript** | P1（建議） | 直接執行 | 0 KB |
| **純 TypeScript** | P2（未來） | Babel Standalone | ~600 KB |
| **Vue SFC** | P3（未來） | Vue Runtime Compiler | ~300 KB |
| **Svelte** | P3（未來） | Svelte Compiler | ~2 MB |

### 執行機制

#### HTML/CSS/JS
```typescript
// 最簡單：直接用 iframe
<iframe
  srcdoc={htmlCode}
  sandbox="allow-scripts allow-modals"
  className="w-full h-full"
/>
```

#### JSX/TSX
```typescript
// 使用 Babel Standalone
const generateJsxPreview = (code: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        ${processedCode}
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      </script>
    </body>
  </html>
`;
```

**參考專案**:
- 🔗 `_reference/sandpack/` - 完整的程式碼執行引擎
- 🔗 `canvas_index.jsx` - generateReactPreview 函數

---

## 安全性設計

### iframe Sandbox 策略

```typescript
// 推薦的 sandbox 屬性組合
<iframe
  sandbox="
    allow-scripts          // 允許執行 JavaScript
    allow-modals           // 允許彈窗（alert, confirm）
    allow-forms            // 允許表單提交（如果需要）
  "
  // ⚠️ 絕對不要同時使用 allow-scripts 和 allow-same-origin！
/>
```

### 安全性檢查清單

- ✅ 使用 `sandbox` 屬性限制 iframe 權限
- ✅ 避免 `allow-same-origin` + `allow-scripts` 組合
- ✅ 設定 CSP（Content Security Policy）headers
- ✅ 驗證和過濾使用者輸入
- ✅ 使用 `srcdoc` 而非 `src`（避免跨域問題）
- ✅ 限制 Canvas 程式碼大小（例如 1MB）
- ✅ 實作執行時間限制（防止無窮迴圈）

**參考專案**:
- 🔗 `_reference/playground-sandbox/` - 安全執行環境
- 🔗 `_reference/react-safe-src-doc-iframe/` - iframe 安全最佳實踐

### XSS 防護

```typescript
// 使用 DOMPurify 清理 HTML（選配）
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ['div', 'span', 'p', ...],
  ALLOWED_ATTR: ['class', 'id', ...],
});
```

---

## 效能優化策略

### 前端優化

1. **程式碼分割**
   ```typescript
   // 使用 React.lazy 延遲載入
   const CanvasEditor = lazy(() => import('./CanvasEditor'));
   const CanvasViewer = lazy(() => import('./CanvasViewer'));
   ```

2. **Monaco Editor 延遲載入**
   ```typescript
   // 只在需要時載入 Monaco
   import { loader } from '@monaco-editor/react';
   loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor/...' } });
   ```

3. **TanStack Query 快取**
   ```typescript
   const { data } = useQuery({
     queryKey: ['canvases'],
     queryFn: fetchCanvases,
     staleTime: 5 * 60 * 1000, // 5 分鐘
   });
   ```

4. **虛擬化列表**（當 Canvas 數量 > 100）
   ```typescript
   import { useVirtualizer } from '@tanstack/react-virtual';
   ```

### 後端優化

1. **資料庫索引**
   ```prisma
   @@index([userId])
   @@index([createdAt])
   @@index([type])
   ```

2. **查詢優化**
   ```typescript
   // 使用 select 限制欄位
   const canvases = await prisma.canvas.findMany({
     select: { id: true, title: true, type: true, createdAt: true },
     where: { userId },
   });
   ```

3. **分頁**
   ```typescript
   const canvases = await prisma.canvas.findMany({
     take: 20,
     skip: page * 20,
   });
   ```

---

## 部署架構

### 開發環境
```
Frontend: http://localhost:5173 (Vite dev server)
Backend:  http://localhost:3000 (Express)
Database: SQLite (./prisma/dev.db)
```

### 生產環境（免費方案）
```
Frontend: Vercel / Netlify / Cloudflare Pages
Backend:  Railway / Render / Fly.io
Database: Railway PostgreSQL / Supabase (免費層)
```

---

## 下一步

1. ✅ 閱讀 [開發指南](./DEVELOPMENT.md)
2. ✅ 查看 [API 文件](./API.md)
3. ✅ 參考 [部署指南](./DEPLOYMENT.md)

---

## 參考資源

### 官方文件
- [React 19 文件](https://react.dev/)
- [Vite 文件](https://vitejs.dev/)
- [Prisma 文件](https://www.prisma.io/docs/)
- [Lucia Auth 文件](https://lucia-auth.com/)
- [tRPC 文件](https://trpc.io/)
- [PNPM Workspaces](https://pnpm.io/workspaces)

### 參考專案（`_reference/` 目錄）
1. **Sandpack** - Canvas 執行引擎
2. **Express + Prisma + tRPC Starter** - 後端架構
3. **PNPM Monorepo** - 專案結構
4. **Monaco React** - 程式碼編輯器
5. **Playground Sandbox** - 安全性

詳見：[_reference/README.md](../_reference/README.md)

---

**文件維護者**: Canvas-Verse 開發團隊
**問題回報**: GitHub Issues
