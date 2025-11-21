# Canvas 格式規範

> **最後更新**: 2025-11-21
> **版本**: v1.0

本文件說明 Canvas-Verse 支援的程式碼格式和執行機制。

---

## 📋 支援的格式

Canvas-Verse 目前支援以下三種格式：

| 格式 | 描述 | 執行方式 | 檔案大小限制 | 優先級 |
|------|------|---------|-------------|--------|
| **HTML** | 完整的 HTML/CSS/JS 文件 | iframe 直接載入 | 1MB | P0 |
| **JSX** | React JSX 組件 | Babel Standalone 轉譯 | 1MB | P0 |
| **TSX** | TypeScript + JSX 組件 | Babel Standalone 轉譯 | 1MB | P1 |

---

## 1. HTML 格式

### 說明

完整的 HTML 文件，可包含 `<html>`, `<head>`, `<body>` 標籤。

### 範例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Canvas</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .container {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, Canvas!</h1>
    <p>This is an HTML Canvas.</p>
    <button onclick="alert('Button clicked!')">Click Me</button>
  </div>

  <script>
    console.log('Canvas loaded successfully!');
  </script>
</body>
</html>
```

### 執行機制

```typescript
// 使用 iframe 的 srcdoc 屬性
<iframe
  srcdoc={htmlCode}
  sandbox="allow-scripts allow-modals"
  className="w-full h-full border-none"
/>
```

### 限制

- ✅ 可以使用 `<script>` 標籤
- ✅ 可以使用外部 CDN（例如 jQuery, Three.js）
- ❌ 無法存取父頁面的 DOM（sandbox 隔離）
- ❌ 無法存取 localStorage/cookies（除非設定 `allow-same-origin`，但不建議）

---

## 2. JSX 格式

### 說明

React 函數組件，使用 JSX 語法。會在瀏覽器中使用 Babel Standalone 即時轉譯。

### 範例

```jsx
function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">Counter App</h1>
        <p className="text-xl mb-4">Count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
```

### 程式碼規範

**必須**：
- 必須包含主函數組件（預設名稱 `App`）
- 函數必須使用 `function` 關鍵字宣告（不支援箭頭函數作為主組件）

**不需要**：
- ❌ 不需要 `import React from 'react'`（已內建）
- ❌ 不需要 `export default`（會自動處理）
- ❌ 不需要其他 import（僅支援 React 和 ReactDOM）

**支援**：
- ✅ React Hooks（useState, useEffect, etc.）
- ✅ Tailwind CSS（通過 CDN）
- ✅ 巢狀組件
- ✅ 事件處理

### 執行機制

```typescript
// 1. 移除 import/export
const processedCode = code
  .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
  .replace(/export\s+default\s+function\s+(\w+)/, 'function $1');

// 2. 生成 iframe 內容
const html = `
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

### 限制

- ❌ 無法使用 npm 套件（僅支援 CDN）
- ❌ 首次載入較慢（需下載 Babel Standalone ~500KB）
- ❌ 不支援 JSX Fragment 簡寫（`<>...</>`），請用 `<React.Fragment>`
- ✅ 支援多個組件（但需在同一檔案）

---

## 3. TSX 格式

### 說明

TypeScript + JSX，與 JSX 格式類似，但支援 TypeScript 語法。

### 範例

```tsx
interface CounterProps {
  initialCount?: number;
}

function App({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = React.useState<number>(initialCount);

  const handleIncrement = (): void => {
    setCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">Typed Counter</h1>
        <p className="text-xl mb-4">Count: {count}</p>
        <button
          onClick={handleIncrement}
          className="bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
        >
          Increment
        </button>
      </div>
    </div>
  );
}
```

### 與 JSX 的差異

- ✅ 支援 TypeScript 型別註解
- ✅ 支援 interface/type 定義
- ✅ 支援泛型
- ⚠️ 執行時不會進行型別檢查（Babel 只做轉譯）

### 執行機制

與 JSX 相同，Babel Standalone 會自動處理 TypeScript 語法。

---

## 安全性考量

### Sandbox 隔離

所有 Canvas 都在 iframe 中執行，並使用 `sandbox` 屬性隔離：

```typescript
<iframe
  sandbox="allow-scripts allow-modals"
  // 不包含 allow-same-origin，避免存取父頁面
/>
```

### 允許的操作

- ✅ 執行 JavaScript
- ✅ 顯示模態視窗（alert, confirm, prompt）
- ✅ 使用 Canvas API、WebGL
- ✅ 使用 localStorage（但與父頁面隔離）

### 禁止的操作

- ❌ 存取父頁面的 DOM
- ❌ 存取父頁面的 localStorage/cookies
- ❌ 導航父頁面
- ❌ 開啟新視窗（popup）
- ❌ 使用 iframe 內的 iframe

### 程式碼大小限制

- 最大 1MB（1,000,000 字元）
- 超過限制將被拒絕

### XSS 防護

所有使用者輸入都應該經過驗證和清理，但由於使用 iframe sandbox，XSS 風險已大幅降低。

---

## 錯誤處理

### 執行錯誤

Canvas Runner 會捕捉並顯示執行時錯誤：

```jsx
try {
  // 執行使用者程式碼
} catch (err) {
  // 顯示錯誤訊息
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red;">
      <h3>Runtime Error:</h3>
      <pre>${err.message}</pre>
    </div>
  `;
}
```

### 常見錯誤

**1. 找不到主組件**
```
Error: Could not find component App
```
**解決**: 確保程式碼包含 `function App()` 函數

**2. JSX 語法錯誤**
```
SyntaxError: Unexpected token '<'
```
**解決**: 檢查 JSX 語法是否正確，所有標籤都要正確關閉

**3. Babel 轉譯錯誤**
```
Transform Error: ...
```
**解決**: 檢查是否使用了不支援的語法

---

## 最佳實踐

### HTML Canvas

```html
<!-- 好的實踐 -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Canvas</title>
  <style>
    /* 內聯樣式 */
  </style>
</head>
<body>
  <!-- 內容 -->
  <script>
    // 內聯腳本
  </script>
</body>
</html>
```

### JSX Canvas

```jsx
// 好的實踐：清晰的主組件
function App() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

// 輔助組件
function Header() {
  return <header>...</header>;
}

// 避免：沒有明確的主組件
const MyComponent = () => <div>...</div>;  // ❌ 不推薦
```

### TSX Canvas

```tsx
// 好的實踐：明確的型別定義
interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = React.useState<User[]>([]);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

---

## 未來支援的格式

以下格式規劃在未來版本支援：

| 格式 | 優先級 | 預計支援版本 |
|------|-------|------------|
| Vue SFC | P2 | v2.0 |
| Svelte | P3 | v3.0 |
| 純 TypeScript | P2 | v2.0 |
| Markdown | P3 | v3.0 |

---

## 參考資源

- [Babel Standalone 文件](https://babeljs.io/docs/en/babel-standalone)
- [React 18 文件](https://react.dev/)
- [iframe sandbox 屬性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**有問題？** 查看 [開發指南](./DEVELOPMENT.md) 或在 [GitHub Issues](https://github.com/your-username/Canvas-Verse/issues) 提問。
