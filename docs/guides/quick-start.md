# Quick Start - Phase 1 MVP

## Prerequisites

Before starting, you MUST set up Google OAuth:

### 1. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3004/api/auth/google/callback`
5. Copy the Client ID and Client Secret

### 2. Update Environment Variables

Edit `apps/server/.env`:

```env
GOOGLE_CLIENT_ID="your-actual-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-google-client-secret-here"
```

## Start the Application

### Terminal 1 - Backend Server

```bash
cd apps/server
pnpm dev
```

Expected output:

```
Canvas-Verse Server Started Successfully
Environment:  development
Port:         3004
Health Check: http://localhost:3004/health
```

### Terminal 2 - Frontend Web App

```bash
cd apps/web
pnpm dev
```

Expected output:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Test the Application

1. Open browser: `http://localhost:5173`
2. Click "Sign in with Google"
3. Complete Google OAuth login
4. You should see the Canvas Collector dashboard
5. Click "New Canvas" to create your first canvas
6. Test the features:
   - Create a React canvas
   - Create an HTML canvas
   - Preview/Run a canvas
   - Edit a canvas
   - Delete a canvas
   - Search canvases
   - Switch language (EN/ZH)

## Sample React Canvas Code

```jsx
function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Counter App</h1>
        <p className="text-6xl font-bold text-purple-600 mb-6">{count}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCount(count - 1)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
          >
            Decrease
          </button>
          <button
            onClick={() => setCount(0)}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Increase
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Sample HTML Canvas Code

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body
    class="bg-gradient-to-br from-blue-500 to-purple-600 min-h-screen flex items-center justify-center"
  >
    <div class="bg-white p-8 rounded-2xl shadow-2xl text-center">
      <h1 class="text-4xl font-bold mb-4">Hello Canvas!</h1>
      <p class="text-gray-600 mb-4">This is a simple HTML canvas.</p>
      <button
        onclick="alert('Hello World!')"
        class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        Click Me
      </button>
    </div>
  </body>
</html>
```

## API Endpoints (for reference)

### Auth

- `GET /api/auth/google` - Start Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout

### Canvases

- `GET /api/canvases` - Get all user canvases
- `GET /api/canvases/:id` - Get single canvas
- `POST /api/canvases` - Create canvas
- `PUT /api/canvases/:id` - Update canvas
- `DELETE /api/canvases/:id` - Delete canvas

## Troubleshooting

### Issue: Google OAuth redirect error

**Solution:** Make sure the redirect URI in Google Console exactly matches:

```
http://localhost:3004/api/auth/google/callback
```

### Issue: "Not authenticated" error

**Solution:** Click "Sign in with Google" again to authenticate.

### Issue: Canvas preview not working

**Solution:**

- For React: Make sure you have a function named `App` in your code
- For HTML: Make sure you have complete `<html>` tags

### Issue: Port already in use

**Solution:**

```bash
# Kill process on port 3004
lsof -ti:3004 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

## Next Steps

After testing the MVP:

1. Customize the UI colors and branding
2. Add more canvas examples
3. Implement canvas sharing (public links)
4. Add code editor with syntax highlighting (Monaco Editor)
5. Add canvas categories/tags
6. Add canvas import/export functionality

Happy coding! 🚀
