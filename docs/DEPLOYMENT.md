# Canvas-Verse 部署指南

> **最後更新**: 2025-11-21
> **難度**: ⭐⭐⭐ (中等)
> **預計時間**: 2-3 天

---

## 📋 目錄

- [部署概覽](#部署概覽)
- [前端部署 (Vercel)](#前端部署-vercel)
- [後端部署 (Railway)](#後端部署-railway)
- [資料庫設定](#資料庫設定)
- [環境變數](#環境變數)
- [自訂網域](#自訂網域)
- [監控與除錯](#監控與除錯)

---

## 部署概覽

### 推薦架構（完全免費）

```
Frontend: Vercel (免費版)
Backend:  Railway (免費 $5 credit/月)
Database: Railway PostgreSQL (包含在 $5 內)
```

### 成本預估

| 階段 | 使用者數 | 月費用 |
|------|---------|--------|
| **MVP** | 0 - 1,000 | **$0** |
| **成長期** | 1,000 - 10,000 | **$5** |
| **擴展期** | 10,000 - 100,000 | **$20-50** |

---

## 前端部署 (Vercel)

### 方法一：GitHub 整合（推薦）

1. **推送專案到 GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **連結 Vercel**

- 訪問 [vercel.com](https://vercel.com/)
- 使用 GitHub 登入
- 點擊 "Import Project"
- 選擇 `Canvas-Verse` 專案

3. **設定專案**

```
Framework Preset: Vite
Root Directory: apps/web
Build Command: pnpm build
Output Directory: dist
Install Command: pnpm install
```

4. **設定環境變數**

在 Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.railway.app
```

5. **部署**

點擊 "Deploy"，等待建置完成。

### 方法二：Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
cd apps/web
vercel

# 生產部署
vercel --prod
```

---

## 後端部署 (Railway)

### 1. 準備專案

**建立 `apps/server/Procfile`**（告訴 Railway 如何啟動）:
```
web: pnpm start
```

**修改 `apps/server/package.json`**:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "tsx watch src/index.ts"
  }
}
```

### 2. 部署到 Railway

1. **訪問 [railway.app](https://railway.app/)**
2. 使用 GitHub 登入
3. 點擊 "New Project"
4. 選擇 "Deploy from GitHub repo"
5. 選擇 `Canvas-Verse` 專案

### 3. 設定專案

**Root Directory**:
```
apps/server
```

**Build Command**:
```bash
pnpm install && pnpm build
```

**Start Command**:
```bash
pnpm start
```

### 4. 設定環境變數

在 Railway Dashboard → Variables:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
CORS_ORIGIN=https://your-frontend.vercel.app
```

**DATABASE_URL** 會在下一步建立資料庫後自動設定。

---

## 資料庫設定

### Railway PostgreSQL

1. **在 Railway 專案中**:
   - 點擊 "+ New"
   - 選擇 "Database"
   - 選擇 "PostgreSQL"

2. **連結資料庫**:
   - Railway 會自動設定 `DATABASE_URL` 環境變數
   - 格式：`postgresql://user:password@host:5432/database`

3. **執行 Migration**:

在本地連接生產資料庫執行 migration:

```bash
cd apps/server

# 設定生產資料庫 URL
export DATABASE_URL="postgresql://..."

# 執行 migration
pnpm prisma migrate deploy

# 生成 Prisma Client
pnpm prisma generate
```

**⚠️ 安全提醒**: 不要在程式碼中提交 `DATABASE_URL`！

### 修改 Prisma Schema（生產環境）

修改 `apps/server/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // 改為 postgresql
  url      = env("DATABASE_URL")
}
```

---

## 環境變數

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend.railway.app
```

### Backend (.env.production)

```env
# Node
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# CORS
CORS_ORIGIN=https://your-frontend.vercel.app

# Lucia Auth
SESSION_SECRET=your-random-secret-here
```

**生成隨機 secret**:
```bash
openssl rand -base64 32
```

---

## 自訂網域

### Vercel 自訂網域

1. 在 Vercel Dashboard → Settings → Domains
2. 新增網域（例如：`canvas-verse.com`）
3. 依照指示設定 DNS（通常是新增 A 記錄或 CNAME）

### Railway 自訂網域

1. 在 Railway Dashboard → Settings → Domains
2. 新增自訂網域
3. 設定 DNS CNAME 指向 Railway 提供的網址

### DNS 設定（Cloudflare 範例）

```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: Enabled (橘色雲朵)
```

---

## CI/CD 自動部署

### GitHub Actions（選配）

建立 `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build frontend
        run: cd apps/web && pnpm build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./apps/web

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## 監控與除錯

### 日誌查看

**Vercel**:
- Dashboard → Deployments → 選擇部署 → Runtime Logs

**Railway**:
- Dashboard → Deployments → 選擇部署 → Logs

### 錯誤追蹤（選配）

#### Sentry（免費版）

1. 註冊 [sentry.io](https://sentry.io/)
2. 建立專案
3. 安裝 SDK:

```bash
pnpm add @sentry/react @sentry/node
```

4. **前端設定** (`apps/web/src/main.tsx`):

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

5. **後端設定** (`apps/server/src/index.ts`):

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

---

## 效能優化

### 前端優化

1. **啟用 Vercel Edge Network**（自動）
2. **圖片優化**（使用 Vercel Image Optimization）
3. **程式碼分割**（React.lazy）
4. **壓縮**（Vite 自動處理）

### 後端優化

1. **啟用 GZIP 壓縮**:

```typescript
import compression from 'compression';
app.use(compression());
```

2. **快取 API 回應**（選配）:

```typescript
import apicache from 'apicache';
let cache = apicache.middleware;

app.get('/api/canvases', cache('5 minutes'), canvasesHandler);
```

3. **資料庫連線池**（Prisma 自動處理）

---

## 安全性檢查清單

- [ ] 使用 HTTPS（Vercel/Railway 自動）
- [ ] 設定 CORS 僅允許前端網域
- [ ] 使用環境變數儲存敏感資訊
- [ ] 啟用 Helmet.js（HTTP headers 安全）
- [ ] 設定 Rate Limiting（防止 API 濫用）
- [ ] 定期更新依賴套件

```bash
# 安裝安全相關套件
pnpm add helmet express-rate-limit
```

```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 限制 100 次請求
});

app.use('/api/', limiter);
```

---

## 部署檢查清單

### 部署前

- [ ] 所有測試通過
- [ ] 環境變數已設定
- [ ] Prisma migrations 已同步
- [ ] 移除 console.log 和除錯程式碼
- [ ] 檢查 .gitignore（確保敏感資訊未提交）

### 部署後

- [ ] 前端可以正常存取
- [ ] 後端 API 正常回應
- [ ] 認證功能正常
- [ ] Canvas CRUD 功能正常
- [ ] 檢查錯誤日誌

---

## 回滾策略

### Vercel 回滾

1. Dashboard → Deployments
2. 選擇之前的成功部署
3. 點擊 "Promote to Production"

### Railway 回滾

1. Dashboard → Deployments
2. 選擇之前的成功部署
3. 點擊 "Redeploy"

---

## 常見問題

### Q: 部署後前端無法連接後端？
A: 檢查 CORS 設定和 `VITE_API_URL` 環境變數。

### Q: 資料庫連線失敗？
A: 確認 `DATABASE_URL` 格式正確，並檢查 Railway 資料庫是否正常運行。

### Q: Build 失敗？
A: 檢查 Node.js 版本、依賴是否完整安裝、TypeScript 錯誤。

---

## 進階部署選項

### 自架 VPS（進階）

如果需要完全控制，可以考慮：

1. **Hetzner VPS** ($5-20/月)
2. **DigitalOcean Droplet** ($6-12/月)
3. **Linode** ($5-10/月)

使用 Docker + Docker Compose 部署。

---

**部署愉快！** 🚀

有問題請參考 [GitHub Issues](https://github.com/your-username/Canvas-Verse/issues) 或官方文件。
