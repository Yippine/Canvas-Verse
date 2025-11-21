# Canvas-Verse 開發指南

> **最後更新**: 2025-11-21
> **預計開發時間**: 4-6 週（業餘）/ 2-3 週（全職）
> **難度**: ⭐⭐⭐⭐ (中高)

---

## 📋 目錄

- [開發前準備](#開發前準備)
- [Phase 0: 專案設定](#phase-0-專案設定)
- [Phase 1: 後端基礎建設](#phase-1-後端基礎建設)
- [Phase 2: 前端整合](#phase-2-前端整合)
- [Phase 3: Canvas Runner](#phase-3-canvas-runner)
- [Phase 4: UI/UX 美化](#phase-4-uiux-美化)
- [Phase 5: 範例系統](#phase-5-範例系統)
- [Phase 6: 部署](#phase-6-部署)
- [常見問題](#常見問題)

---

## 開發前準備

### 必要工具

```bash
# 1. 安裝 Node.js 20+
node -v  # 應該 >= 20.0.0

# 2. 安裝 PNPM
npm install -g pnpm
pnpm -v  # 應該 >= 8.0.0

# 3. 安裝 Git
git --version

# 4. （選配）安裝 Docker（用於本地 PostgreSQL）
docker --version
```

### 環境檢查

```bash
# Clone 專案
git clone https://github.com/your-username/Canvas-Verse.git
cd Canvas-Verse

# 檢查參考專案
ls -la _reference/
# 應該看到：sandpack, express-prisma-trpc-starter, monaco-react 等

# 檢查文件
ls -la docs/
# 應該看到：ARCHITECTURE.md, DEVELOPMENT.md 等
```

### 建議閱讀

在開始前，建議先閱讀以下參考專案的 README：

1. **`_reference/pnpm-monorepo-example/README.md`** - 了解 Monorepo 架構
2. **`_reference/express-prisma-trpc-starter/README.md`** - 了解後端架構
3. **`_reference/sandpack/README.md`** - 了解 Canvas 執行機制

---

## Phase 0: 專案設定

**⏱ 預計時間**: 2-3 天
**🎯 目標**: 建立 Monorepo 架構 + 基礎設定

### 📚 主要參考專案

- 🔗 **`_reference/pnpm-monorepo-example/`** - Monorepo 結構參考
- 🔗 **`_reference/express-prisma-trpc-starter/`** - 後端專案設定

### 任務清單

#### 0.1 初始化 Monorepo

```bash
# 1. 建立 pnpm workspace 設定
cat > pnpm-workspace.yaml << EOF
packages:
  - 'apps/*'
  - 'packages/*'
EOF

# 2. 建立 root package.json
cat > package.json << EOF
{
  "name": "canvas-verse",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.56.0"
  }
}
EOF

# 3. 建立目錄結構
mkdir -p apps/web apps/server packages/types packages/validation
```

**📖 參考檔案**:
- `_reference/pnpm-monorepo-example/pnpm-workspace.yaml`
- `_reference/pnpm-monorepo-example/package.json`

#### 0.2 設定 Frontend（apps/web）

```bash
cd apps/web

# 1. 初始化 Vite React 專案（已有則跳過）
pnpm create vite . --template react-ts

# 2. 安裝依賴
pnpm add \
  react@19.2.0 \
  react-dom@19.2.0 \
  @tanstack/react-router \
  @tanstack/react-query \
  zustand \
  zod \
  framer-motion \
  lucide-react \
  tailwindcss \
  @tailwindcss/postcss

# 3. 安裝開發依賴
pnpm add -D \
  @types/react \
  @types/react-dom \
  @vitejs/plugin-react \
  autoprefixer \
  postcss \
  vite

# 4. 設定 Tailwind CSS（已有則跳過）
pnpm dlx tailwindcss init -p
```

**📖 參考檔案**:
- 現有的 `apps/web/package.json`
- `_reference/pnpm-monorepo-example/apps/react-app/`

#### 0.3 設定 Backend（apps/server）

```bash
cd apps/server

# 1. 初始化 package.json
pnpm init

# 2. 安裝核心依賴
pnpm add \
  express \
  @prisma/client \
  lucia \
  @lucia-auth/adapter-prisma \
  zod \
  cors \
  dotenv

# 3. 安裝開發依賴
pnpm add -D \
  @types/express \
  @types/cors \
  @types/node \
  prisma \
  tsx \
  nodemon \
  typescript

# 4. 初始化 TypeScript
pnpm tsc --init

# 5. 初始化 Prisma
pnpm prisma init
```

**📖 參考檔案**:
- `_reference/express-prisma-trpc-starter/package.json`
- `_reference/express-prisma-trpc-starter/tsconfig.json`

#### 0.4 設定 Prisma Schema

建立 `apps/server/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"  // 開發環境用 SQLite
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  canvases  Canvas[]
  sessions  Session[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}

model Canvas {
  id          String   @id @default(cuid())
  title       String
  type        String
  code        String
  description String?
  tags        String   @default("[]")
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([createdAt])
  @@map("canvases")
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("sessions")
}
```

**📖 參考檔案**:
- `_reference/express-prisma-trpc-starter/prisma/schema.prisma`
- `docs/ARCHITECTURE.md` - 資料庫設計章節

```bash
# 執行 migration
pnpm prisma migrate dev --name init

# 生成 Prisma Client
pnpm prisma generate
```

#### 0.5 設定共用套件（packages）

**packages/types/package.json**:
```json
{
  "name": "@canvas-verse/types",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {}
}
```

**packages/validation/package.json**:
```json
{
  "name": "@canvas-verse/validation",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

**📖 參考檔案**:
- `_reference/pnpm-monorepo-example/packages/`

#### 0.6 設定環境變數

**apps/server/.env**:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

**apps/web/.env**:
```env
VITE_API_URL=http://localhost:3000
```

### ✅ Phase 0 驗收標準

- [ ] `pnpm dev` 可以同時啟動前後端
- [ ] TypeScript 編譯無錯誤
- [ ] Prisma schema 可以正常 migrate
- [ ] 可以存取 `http://localhost:5173`（前端）
- [ ] 可以存取 `http://localhost:3000`（後端）

---

## Phase 1: 後端基礎建設

**⏱ 預計時間**: 1 週
**🎯 目標**: 建立 API + 認證系統

### 📚 主要參考專案

- 🔗 **`_reference/express-prisma-trpc-starter/`** - 完整後端架構
- 🔗 Lucia Auth 官方範例 - 認證系統

### 任務清單

#### 1.1 設定 Express 伺服器

建立 `apps/server/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 測試路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**📖 參考檔案**:
- `_reference/express-prisma-trpc-starter/src/index.ts`

```bash
# 測試
cd apps/server
pnpm tsx src/index.ts
# 訪問 http://localhost:3000/health 應該看到 {"status":"ok"}
```

#### 1.2 設定 Lucia Auth

建立 `apps/server/src/lib/lucia.ts`:

```typescript
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      name: attributes.name
    };
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      name: string | null;
    };
  }
}
```

**📖 參考資源**:
- [Lucia Auth Express 指南](https://lucia-auth.com/getting-started/express/)
- Lucia Auth GitHub 範例

建立 `apps/server/src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

#### 1.3 實作認證 API

建立 `apps/server/src/routes/auth.ts`:

```typescript
import { Router } from 'express';
import { lucia } from '../lib/lucia';
import { prisma } from '../lib/prisma';
import { hash, verify } from '@node-rs/argon2';
import { z } from 'zod';

const router = Router();

// 註冊
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional()
    }).parse(req.body);

    // 檢查使用者是否已存在
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // 建立使用者
    const passwordHash = await hash(password);
    const user = await prisma.user.create({
      data: { email, name }
    });

    // 建立 session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    res
      .setHeader('Set-Cookie', sessionCookie.serialize())
      .json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// 登入
router.post('/login', async (req, res) => {
  try {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string()
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 驗證密碼（這裡需要儲存 passwordHash）
    // const validPassword = await verify(user.passwordHash, password);
    // if (!validPassword) {
    //   return res.status(401).json({ error: 'Invalid credentials' });
    // }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    res
      .setHeader('Set-Cookie', sessionCookie.serialize())
      .json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// 登出
router.post('/logout', async (req, res) => {
  // 實作登出邏輯
  res.json({ success: true });
});

export default router;
```

**📖 參考檔案**:
- `_reference/express-prisma-trpc-starter/src/routes/` - 路由設計
- Lucia Auth 官方範例

**注意**: 上面的程式碼簡化了密碼處理，實際需要在 User model 新增 `passwordHash` 欄位。

#### 1.4 實作 Canvas API

建立 `apps/server/src/routes/canvases.ts`:

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

// 所有路由都需要認證
router.use(authMiddleware);

// 列出使用者的 Canvas
router.get('/', async (req, res) => {
  const canvases = await prisma.canvas.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' }
  });
  res.json(canvases);
});

// 取得單一 Canvas
router.get('/:id', async (req, res) => {
  const canvas = await prisma.canvas.findUnique({
    where: { id: req.params.id }
  });

  if (!canvas || canvas.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Canvas not found' });
  }

  res.json(canvas);
});

// 新增 Canvas
router.post('/', async (req, res) => {
  const { title, type, code, description, tags } = z.object({
    title: z.string().min(1).max(100),
    type: z.enum(['html', 'jsx', 'tsx']),
    code: z.string().min(1).max(1000000), // 限制 1MB
    description: z.string().optional(),
    tags: z.array(z.string()).default([])
  }).parse(req.body);

  const canvas = await prisma.canvas.create({
    data: {
      title,
      type,
      code,
      description,
      tags: JSON.stringify(tags),
      userId: req.user!.id
    }
  });

  res.status(201).json(canvas);
});

// 更新 Canvas
router.put('/:id', async (req, res) => {
  const { title, type, code, description, tags } = z.object({
    title: z.string().min(1).max(100).optional(),
    type: z.enum(['html', 'jsx', 'tsx']).optional(),
    code: z.string().min(1).max(1000000).optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional()
  }).parse(req.body);

  const canvas = await prisma.canvas.findUnique({
    where: { id: req.params.id }
  });

  if (!canvas || canvas.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Canvas not found' });
  }

  const updated = await prisma.canvas.update({
    where: { id: req.params.id },
    data: {
      ...(title && { title }),
      ...(type && { type }),
      ...(code && { code }),
      ...(description !== undefined && { description }),
      ...(tags && { tags: JSON.stringify(tags) })
    }
  });

  res.json(updated);
});

// 刪除 Canvas
router.delete('/:id', async (req, res) => {
  const canvas = await prisma.canvas.findUnique({
    where: { id: req.params.id }
  });

  if (!canvas || canvas.userId !== req.user!.id) {
    return res.status(404).json({ error: 'Canvas not found' });
  }

  await prisma.canvas.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
```

**📖 參考檔案**:
- `_reference/express-prisma-trpc-starter/src/router.ts` - API 設計

#### 1.5 建立認證中介軟體

建立 `apps/server/src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { lucia } from '../lib/lucia';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? '');

  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  req.user = user;
  next();
}
```

#### 1.6 整合路由到 Express

修改 `apps/server/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import canvasRoutes from './routes/canvases';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/canvases', canvasRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### ✅ Phase 1 驗收標準

使用 Postman 或 curl 測試：

```bash
# 1. 註冊
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 2. 登入
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. 新增 Canvas（需要帶 session cookie）
curl -X POST http://localhost:3000/api/canvases \
  -H "Content-Type: application/json" \
  -H "Cookie: auth_session=..." \
  -d '{"title":"My Canvas","type":"jsx","code":"function App() { return <div>Hello</div>; }"}'

# 4. 列出 Canvas
curl http://localhost:3000/api/canvases \
  -H "Cookie: auth_session=..."
```

- [ ] 所有 API 端點正常運作
- [ ] 認證系統正確保護路由
- [ ] 資料正確儲存到資料庫

---

## Phase 2: 前端整合

**⏱ 預計時間**: 1 週
**🎯 目標**: 前端串接後端 API

### 📚 主要參考專案

- 🔗 現有的 `apps/web/src/` - 既有元件參考
- 🔗 `canvas_index.jsx` - UI/UX 參考

### 任務清單

#### 2.1 設定 API 客戶端

建立 `apps/web/src/lib/api-client.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL;

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // 重要：帶上 cookie
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name?: string }) =>
      request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () =>
      request('/api/auth/logout', { method: 'POST' }),
  },
  canvases: {
    list: () => request<Canvas[]>('/api/canvases'),
    get: (id: string) => request<Canvas>(`/api/canvases/${id}`),
    create: (data: CreateCanvasData) =>
      request<Canvas>('/api/canvases', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CreateCanvasData>) =>
      request<Canvas>(`/api/canvases/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request(`/api/canvases/${id}`, { method: 'DELETE' }),
  },
};
```

#### 2.2 設定 TanStack Query

建立 `apps/web/src/lib/query-client.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分鐘
      retry: 1,
    },
  },
});
```

修改 `apps/web/src/main.tsx`:

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
```

#### 2.3 實作認證功能

建立 `apps/web/src/features/auth/hooks/useAuth.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: api.auth.login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: api.auth.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: api.auth.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
}
```

建立 `apps/web/src/features/auth/components/LoginForm.tsx`:

```typescript
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full px-4 py-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

**📖 參考檔案**:
- `canvas_index.jsx` - 登入 UI 設計參考

#### 2.4 實作 Canvas 管理

建立 `apps/web/src/features/canvases/hooks/useCanvases.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useCanvases() {
  return useQuery({
    queryKey: ['canvases'],
    queryFn: api.canvases.list,
  });
}

export function useCanvasOperations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: api.canvases.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.canvases.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: api.canvases.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['canvases'] });
    },
  });

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
  };
}
```

### ✅ Phase 2 驗收標準

- [ ] 使用者可以註冊和登入
- [ ] 登入後可以看到自己的 Canvas 列表
- [ ] 可以新增、編輯、刪除 Canvas
- [ ] Session 管理正常（重新整理頁面仍保持登入）
- [ ] 錯誤處理友善（顯示錯誤訊息）

---

## Phase 3: Canvas Runner

**⏱ 預計時間**: 1 週
**🎯 目標**: 實現動態執行 HTML/JSX/TSX + 程式碼編輯器

### 📚 主要參考專案

- 🔗 **`_reference/sandpack/`** - Canvas 執行引擎
- 🔗 **`_reference/monaco-react/`** - Monaco Editor
- 🔗 **`_reference/react-codemirror/`** - CodeMirror（備選）
- 🔗 **`_reference/playground-sandbox/`** - 安全性
- 🔗 **`canvas_index.jsx`** - generateReactPreview 參考

### 任務清單

#### 3.1 安裝程式碼編輯器

**選項 A: Monaco Editor**（推薦，VSCode 同款）

```bash
cd apps/web
pnpm add @monaco-editor/react
```

**選項 B: CodeMirror 6**（輕量替代）

```bash
cd apps/web
pnpm add @uiw/react-codemirror \
  @codemirror/lang-javascript \
  @codemirror/lang-html \
  @codemirror/theme-one-dark
```

**📖 參考檔案**:
- `_reference/monaco-react/demo/` - Monaco 使用範例
- `_reference/react-codemirror/core/src/` - CodeMirror 使用範例

#### 3.2 建立程式碼編輯器元件

**使用 Monaco Editor**:

建立 `apps/web/src/features/canvases/components/CodeEditor.tsx`:

```typescript
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'html' | 'javascript' | 'typescript';
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  return (
    <Editor
      height="600px"
      language={language}
      value={value}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        automaticLayout: true,
      }}
    />
  );
}
```

**📖 參考檔案**:
- `_reference/monaco-react/src/Editor/Editor.tsx`

#### 3.3 實作 HTML Runner

建立 `apps/web/src/features/canvases/components/CodeRunner/HtmlRunner.tsx`:

```typescript
import { useEffect, useRef } from 'react';

interface HtmlRunnerProps {
  code: string;
}

export function HtmlRunner({ code }: HtmlRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-none"
      sandbox="allow-scripts allow-modals"
      title="HTML Preview"
    />
  );
}
```

**📖 參考檔案**:
- `_reference/react-safe-src-doc-iframe/src/SafeSrcdocIframe.js`

#### 3.4 實作 JSX/TSX Runner

建立 `apps/web/src/features/canvases/components/CodeRunner/JsxRunner.tsx`:

```typescript
import { useEffect, useRef } from 'react';

interface JsxRunnerProps {
  code: string;
  type: 'jsx' | 'tsx';
}

export function JsxRunner({ code, type }: JsxRunnerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    // 處理程式碼：移除 import/export
    const processedCode = code
      .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
      .replace(/export\s+default\s+(\w+);?/, '');

    // 找出主元件名稱
    const match = code.match(/function\s+(\w+)/);
    const componentName = match ? match[1] : 'App';

    // 生成 iframe 內容
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; font-family: sans-serif; }
            #root { min-height: 100vh; }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${processedCode}

              const root = ReactDOM.createRoot(document.getElementById('root'));
              if (typeof ${componentName} !== 'undefined') {
                root.render(<${componentName} />);
              } else {
                document.getElementById('root').innerHTML =
                  '<div style="padding: 20px; color: red;">Error: Could not find component ${componentName}</div>';
              }
            } catch (err) {
              document.getElementById('root').innerHTML =
                '<div style="padding: 20px; color: red;"><h3>Runtime Error:</h3><pre>' + err.message + '</pre></div>';
            }
          </script>
        </body>
      </html>
    `;

    iframeRef.current.srcdoc = html;
  }, [code, type]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-none"
      sandbox="allow-scripts allow-same-origin allow-modals"
      title="JSX Preview"
    />
  );
}
```

**📖 參考檔案**:
- `canvas_index.jsx` - generateReactPreview 函數
- `_reference/sandpack/sandpack-client/src/` - 執行引擎參考
- `_reference/playground-sandbox/src/` - 安全執行環境

#### 3.5 建立統一的 Canvas Runner

建立 `apps/web/src/features/canvases/components/CanvasRunner.tsx`:

```typescript
import { HtmlRunner } from './CodeRunner/HtmlRunner';
import { JsxRunner } from './CodeRunner/JsxRunner';

interface CanvasRunnerProps {
  code: string;
  type: 'html' | 'jsx' | 'tsx';
}

export function CanvasRunner({ code, type }: CanvasRunnerProps) {
  if (type === 'html') {
    return <HtmlRunner code={code} />;
  }

  return <JsxRunner code={code} type={type} />;
}
```

#### 3.6 建立 Canvas 編輯器頁面

建立 `apps/web/src/features/canvases/components/CanvasEditor.tsx`:

```typescript
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CanvasRunner } from './CanvasRunner';

export function CanvasEditor() {
  const [code, setCode] = useState('function App() {\n  return <div>Hello World</div>;\n}');
  const [type, setType] = useState<'html' | 'jsx' | 'tsx'>('jsx');

  return (
    <div className="flex h-screen">
      {/* 左側：編輯器 */}
      <div className="w-1/2 border-r">
        <div className="p-4 border-b">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option value="html">HTML</option>
            <option value="jsx">JSX</option>
            <option value="tsx">TSX</option>
          </select>
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          language={type === 'html' ? 'html' : type === 'tsx' ? 'typescript' : 'javascript'}
        />
      </div>

      {/* 右側：預覽 */}
      <div className="w-1/2">
        <div className="p-4 border-b bg-gray-100">
          <span className="font-semibold">Preview</span>
        </div>
        <CanvasRunner code={code} type={type} />
      </div>
    </div>
  );
}
```

### ✅ Phase 3 驗收標準

- [ ] Monaco Editor 可以正常編輯程式碼
- [ ] HTML Canvas 可以正常執行和預覽
- [ ] JSX Canvas 可以正常執行（包含 React hooks）
- [ ] TSX Canvas 可以正常執行
- [ ] 程式碼錯誤可以正確顯示
- [ ] iframe 沙盒安全機制正常運作

---

## Phase 4: UI/UX 美化

**⏱ 預計時間**: 3-5 天
**🎯 目標**: 套用美觀的 UI 設計

### 📚 主要參考專案

- 🔗 **`canvas_index.jsx`** - UI/UX 設計參考
- 🔗 現有的 `apps/web/src/components/` - 既有元件

### 任務清單

#### 4.1 套用 canvas_index.jsx 的設計風格

參考 `canvas_index.jsx` 的以下設計元素：

1. **漸層背景**
   ```css
   bg-gradient-to-br from-indigo-500 to-purple-600
   ```

2. **圓潤卡片**
   ```css
   rounded-2xl shadow-2xl
   ```

3. **模糊效果**
   ```css
   backdrop-blur-sm
   ```

4. **動畫**
   ```typescript
   // 使用 Framer Motion
   import { motion } from 'framer-motion';

   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3 }}
   >
     ...
   </motion.div>
   ```

#### 4.2 實作多語言支援

建立 `apps/web/src/locales/`:

```typescript
// locales/en.json
{
  "app": {
    "title": "Canvas Collector"
  },
  "auth": {
    "login": "Login",
    "register": "Register"
  },
  "canvas": {
    "new": "New Canvas",
    "edit": "Edit",
    "delete": "Delete"
  }
}

// locales/zh-TW.json
{
  "app": {
    "title": "Canvas 收藏家"
  },
  "auth": {
    "login": "登入",
    "register": "註冊"
  },
  "canvas": {
    "new": "新增 Canvas",
    "edit": "編輯",
    "delete": "刪除"
  }
}
```

#### 4.3 響應式設計

確保所有頁面在手機、平板、桌面都能正常顯示。

### ✅ Phase 4 驗收標準

- [ ] UI 美觀且符合現代設計風格
- [ ] 動畫流暢自然
- [ ] 多語言切換正常
- [ ] 響應式設計完善

---

## Phase 5: 範例系統

**⏱ 預計時間**: 3-5 天
**🎯 目標**: 將 _legacy_files 改為範例庫

### 任務清單

#### 5.1 移動範例檔案

```bash
# 移動檔案到新位置
mkdir -p apps/web/src/features/examples/templates/html
mkdir -p apps/web/src/features/examples/templates/jsx

mv _legacy_files/*.html apps/web/src/features/examples/templates/html/
mv _legacy_files/*.jsx apps/web/src/features/examples/templates/jsx/
```

#### 5.2 建立範例 manifest

建立 `apps/web/src/features/examples/templates/manifest.json`:

```json
{
  "examples": [
    {
      "id": "boruto",
      "title": "Boruto SVG",
      "type": "html",
      "file": "/templates/html/Boruto.html",
      "description": "純 SVG 繪製的火影角色",
      "tags": ["HTML", "SVG", "Art"],
      "thumbnail": "🍥"
    },
    {
      "id": "eagle-app",
      "title": "Eagle App MVP",
      "type": "jsx",
      "file": "/templates/jsx/Eagle-App-MVP.jsx",
      "description": "設計資產管理工具界面",
      "tags": ["React", "Dashboard", "Dark Mode"],
      "thumbnail": "🦅"
    }
  ]
}
```

#### 5.3 實作範例庫頁面

建立 `apps/web/src/features/examples/components/ExampleGallery.tsx`:

```typescript
import { useState } from 'react';
import manifest from '../templates/manifest.json';

export function ExampleGallery() {
  const copyToMyCollection = async (example: any) => {
    // 讀取範例檔案並複製到使用者收藏
    const response = await fetch(example.file);
    const code = await response.text();

    await api.canvases.create({
      title: example.title,
      type: example.type,
      code,
      description: example.description,
      tags: example.tags
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {manifest.examples.map((example) => (
        <div key={example.id} className="border rounded-lg p-4">
          <div className="text-4xl mb-2">{example.thumbnail}</div>
          <h3 className="font-bold">{example.title}</h3>
          <p className="text-sm text-gray-500">{example.description}</p>
          <button
            onClick={() => copyToMyCollection(example)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            複製到我的收藏
          </button>
        </div>
      ))}
    </div>
  );
}
```

### ✅ Phase 5 驗收標準

- [ ] 範例庫可以正常瀏覽
- [ ] 使用者可以預覽範例
- [ ] 使用者可以複製範例到自己的收藏
- [ ] 範例和個人收藏有明確的 Tab 區分

---

## Phase 6: 部署

**⏱ 預計時間**: 2-3 天
**🎯 目標**: 部署到生產環境

詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 常見問題

### Q: Monorepo 太複雜，可以不用嗎？
A: 可以，初期可以用單一專案。但長期來說 Monorepo 更好維護。

### Q: 一定要用 tRPC 嗎？
A: 不一定，傳統 REST API 也可以。tRPC 主要優勢是型別安全。

### Q: Monaco Editor 太大，有替代方案嗎？
A: 可以用 CodeMirror 6（`@uiw/react-codemirror`），體積較小。

### Q: 如何處理大型 Canvas 程式碼？
A: 設定大小限制（例如 1MB），並考慮使用 Web Workers 執行。

---

## 下一步

1. 開始 Phase 0，建立 Monorepo
2. 定期檢查 `_reference/` 中的參考專案
3. 遇到問題時查閱 [ARCHITECTURE.md](./ARCHITECTURE.md)
4. API 設計參考 [API.md](./API.md)

---

**祝開發順利！** 🚀
