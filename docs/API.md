# Canvas-Verse API 文件

> **最後更新**: 2025-11-21
> **API 版本**: v1.0
> **Base URL**: `http://localhost:3000/api` (開發) / `https://your-domain.com/api` (生產)

---

## 📋 目錄

- [認證](#認證)
- [API 端點](#api-端點)
- [錯誤處理](#錯誤處理)
- [資料模型](#資料模型)
- [範例請求](#範例請求)

---

## 認證

Canvas-Verse 使用 **Session-based Authentication**（Lucia Auth）。

### 認證流程

1. **註冊/登入** → 伺服器設定 session cookie
2. **後續請求** → 帶上 cookie
3. **登出** → 清除 session cookie

### Cookie 設定

```
Name: auth_session
HttpOnly: true
Secure: true (生產環境)
SameSite: Lax
```

---

## API 端點

### 認證 API

#### POST /api/auth/register

註冊新使用者。

**請求體**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"  // 選填
}
```

**回應** (201 Created):
```json
{
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**錯誤**:
- `400` - Email 已存在或驗證失敗

---

#### POST /api/auth/login

使用者登入。

**請求體**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**回應** (200 OK):
```json
{
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**錯誤**:
- `401` - 帳號或密碼錯誤

---

#### POST /api/auth/logout

登出使用者。

**請求**: 無需 body

**回應** (200 OK):
```json
{
  "success": true
}
```

---

### Canvas API

> ⚠️ 所有 Canvas API 都需要認證（帶 session cookie）

#### GET /api/canvases

取得使用者的所有 Canvas。

**查詢參數**:
- `search` (選填) - 搜尋關鍵字
- `type` (選填) - 過濾類型 (`html`, `jsx`, `tsx`)
- `limit` (選填) - 每頁數量（預設 20）
- `offset` (選填) - 分頁偏移（預設 0）

**回應** (200 OK):
```json
[
  {
    "id": "clxxx",
    "title": "My Canvas",
    "type": "jsx",
    "code": "function App() { return <div>Hello</div>; }",
    "description": "A simple canvas",
    "tags": ["React", "Demo"],
    "userId": "clxxx",
    "createdAt": "2025-11-21T00:00:00Z",
    "updatedAt": "2025-11-21T00:00:00Z"
  }
]
```

---

#### GET /api/canvases/:id

取得單一 Canvas。

**回應** (200 OK):
```json
{
  "id": "clxxx",
  "title": "My Canvas",
  "type": "jsx",
  "code": "function App() { return <div>Hello</div>; }",
  "description": "A simple canvas",
  "tags": ["React", "Demo"],
  "userId": "clxxx",
  "createdAt": "2025-11-21T00:00:00Z",
  "updatedAt": "2025-11-21T00:00:00Z"
}
```

**錯誤**:
- `404` - Canvas 不存在或無權限

---

#### POST /api/canvases

新增 Canvas。

**請求體**:
```json
{
  "title": "My Canvas",
  "type": "jsx",  // "html" | "jsx" | "tsx"
  "code": "function App() { return <div>Hello</div>; }",
  "description": "A simple canvas",  // 選填
  "tags": ["React", "Demo"]  // 選填
}
```

**回應** (201 Created):
```json
{
  "id": "clxxx",
  "title": "My Canvas",
  "type": "jsx",
  "code": "function App() { return <div>Hello</div>; }",
  "description": "A simple canvas",
  "tags": ["React", "Demo"],
  "userId": "clxxx",
  "createdAt": "2025-11-21T00:00:00Z",
  "updatedAt": "2025-11-21T00:00:00Z"
}
```

**驗證規則**:
- `title`: 1-100 字元
- `type`: 必須是 `html`, `jsx`, 或 `tsx`
- `code`: 1-1000000 字元（最大 1MB）
- `tags`: 陣列，每個標籤最多 20 字元

---

#### PUT /api/canvases/:id

更新 Canvas。

**請求體**（所有欄位選填）:
```json
{
  "title": "Updated Title",
  "type": "tsx",
  "code": "function App() { return <div>Updated</div>; }",
  "description": "Updated description",
  "tags": ["React", "Updated"]
}
```

**回應** (200 OK):
```json
{
  "id": "clxxx",
  "title": "Updated Title",
  "type": "tsx",
  "code": "function App() { return <div>Updated</div>; }",
  "description": "Updated description",
  "tags": ["React", "Updated"],
  "userId": "clxxx",
  "createdAt": "2025-11-21T00:00:00Z",
  "updatedAt": "2025-11-21T01:00:00Z"
}
```

**錯誤**:
- `404` - Canvas 不存在或無權限

---

#### DELETE /api/canvases/:id

刪除 Canvas。

**回應** (204 No Content)

**錯誤**:
- `404` - Canvas 不存在或無權限

---

## 錯誤處理

### 錯誤格式

所有錯誤回應使用統一格式：

```json
{
  "error": "Error message here"
}
```

### HTTP 狀態碼

| 狀態碼 | 說明 |
|--------|------|
| `200` | 請求成功 |
| `201` | 資源建立成功 |
| `204` | 刪除成功（無內容） |
| `400` | 請求格式錯誤或驗證失敗 |
| `401` | 未認證或認證失敗 |
| `403` | 無權限 |
| `404` | 資源不存在 |
| `500` | 伺服器錯誤 |

---

## 資料模型

### User

```typescript
interface User {
  id: string;          // CUID
  email: string;       // unique
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Canvas

```typescript
interface Canvas {
  id: string;          // CUID
  title: string;       // 1-100 字元
  type: 'html' | 'jsx' | 'tsx';
  code: string;        // 程式碼內容，最大 1MB
  description?: string;
  tags: string[];      // 標籤陣列
  userId: string;      // 擁有者 ID
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 範例請求

### cURL 範例

**註冊**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

**登入並儲存 cookie**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt
```

**新增 Canvas**（使用儲存的 cookie）:
```bash
curl -X POST http://localhost:3000/api/canvases \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My First Canvas",
    "type": "jsx",
    "code": "function App() { return <div>Hello World</div>; }",
    "tags": ["React", "Demo"]
  }'
```

**列出 Canvas**:
```bash
curl http://localhost:3000/api/canvases \
  -b cookies.txt
```

### JavaScript/TypeScript 範例

```typescript
// 使用 fetch
const response = await fetch('http://localhost:3000/api/canvases', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // 重要：帶上 cookie
  body: JSON.stringify({
    title: 'My Canvas',
    type: 'jsx',
    code: 'function App() { return <div>Hello</div>; }',
    tags: ['React']
  })
});

const canvas = await response.json();
console.log(canvas);
```

---

## 開發參考

### 參考專案

- 🔗 `_reference/express-prisma-trpc-starter/src/router.ts` - API 路由設計
- 🔗 `apps/server/src/routes/` - 實作範例

### 工具推薦

- **Postman** - API 測試
- **Insomnia** - API 測試（開源）
- **Bruno** - API 測試（開源、離線優先）

---

**API 文件維護者**: Canvas-Verse 開發團隊
