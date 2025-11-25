import { useState, useEffect } from 'react';
import { api, User, Canvas } from './lib/api';
import { Code, Play, Trash2, Search, Plus, LogOut, Globe, Save, X, Layout } from 'lucide-react';

// Helper: Generate Iframe Content for React
const generateReactPreview = (code: string) => {
  let processedCode = code
    .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '')
    .replace(/export\s+default\s+function\s+(\w+)/, 'function $1')
    .replace(/export\s+default\s+(\w+);?/, '');

  const match = code.match(/function\s+(\w+)/);
  const componentName = match ? match[1] : 'App';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body { background-color: #f3f4f6; margin: 0; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; }
          #root { flex: 1; height: 100%; overflow: auto; }
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
                document.getElementById('root').innerHTML = '<div class="p-4 text-red-500">Error: Could not find main component (e.g., App). Ensure your code has a function named App.</div>';
            }
          } catch (err) {
            document.getElementById('root').innerHTML = '<div class="p-4 text-red-500"><h3 class="font-bold">Runtime Error:</h3><pre>' + err.message + '</pre></div>';
          }
        </script>
      </body>
    </html>
  `;
};

const generateHtmlPreview = (code: string) => code;

// Localization
const t = {
  appTitle: { en: "Canvas Collector", zh: "Canvas 收藏家" },
  login: { en: "Login to Start", zh: "登入以開始" },
  googleLogin: { en: "Sign in with Google", zh: "使用 Google 登入" },
  searchPlaceholder: { en: "Search canvases...", zh: "搜尋 Canvas..." },
  newCanvas: { en: "New Canvas", zh: "新增 Canvas" },
  myCollection: { en: "My Collection", zh: "我的收藏" },
  noCanvases: { en: "No canvases found. Create one!", zh: "沒有找到 Canvas。建立一個吧！" },
  editorTitle: { en: "Canvas Editor", zh: "Canvas 編輯器" },
  canvasTitle: { en: "Title", zh: "標題" },
  canvasType: { en: "Type", zh: "類型" },
  pasteCode: { en: "Paste your code here...", zh: "在此貼上程式碼..." },
  save: { en: "Save", zh: "儲存" },
  cancel: { en: "Cancel", zh: "取消" },
  preview: { en: "Preview", zh: "預覽" },
  deleteConfirm: { en: "Delete this canvas?", zh: "確定刪除此 Canvas？" },
  welcome: { en: "Welcome", zh: "歡迎" },
  logout: { en: "Logout", zh: "登出" },
  edit: { en: "Edit", zh: "編輯" },
  view: { en: "Run", zh: "執行" },
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState<Partial<Canvas>>({ type: 'react', title: '', code: '' });
  const [activePreviewCanvas, setActivePreviewCanvas] = useState<Canvas | null>(null);

  // Auth Init
  useEffect(() => {
    const checkAuth = async () => {
      const user = await api.getMe();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Data Fetching
  useEffect(() => {
    if (!user) {
      setCanvases([]);
      return;
    }

    const fetchCanvases = async () => {
      try {
        const data = await api.getCanvases();
        setCanvases(data);
      } catch (error) {
        console.error('Error fetching canvases:', error);
      }
    };
    fetchCanvases();
  }, [user]);

  const handleSave = async () => {
    if (!user || !currentCanvas.title || !currentCanvas.code) return;

    try {
      if (currentCanvas.id) {
        await api.updateCanvas(currentCanvas.id, {
          title: currentCanvas.title,
          code: currentCanvas.code,
          type: currentCanvas.type,
        });
      } else {
        await api.createCanvas({
          title: currentCanvas.title,
          code: currentCanvas.code,
          type: currentCanvas.type as 'react' | 'html',
        });
      }

      const updated = await api.getCanvases();
      setCanvases(updated);
      setIsEditorOpen(false);
      setCurrentCanvas({ type: 'react', title: '', code: '' });
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (window.confirm(t.deleteConfirm[lang])) {
      await api.deleteCanvas(id);
      const updated = await api.getCanvases();
      setCanvases(updated);
    }
  };

  const openEditor = (item?: Canvas) => {
    if (item) {
      setCurrentCanvas({ ...item });
    } else {
      setCurrentCanvas({ type: 'react', title: '', code: '' });
    }
    setIsEditorOpen(true);
  };

  const openPreview = (item: Canvas) => {
    setActivePreviewCanvas(item);
    setIsPreviewOpen(true);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setCanvases([]);
  };

  const filteredCanvases = canvases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <div className="bg-indigo-100 p-4 rounded-full inline-flex mb-6">
            <Layout size={48} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.appTitle[lang]}</h1>
          <p className="text-gray-500 mb-8">Store, run, and share your HTML & React masterpieces.</p>
          <a
            href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/auth/google`}
            className="w-full block bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {t.googleLogin[lang]}
          </a>
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="mt-6 text-sm text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 w-full"
          >
            <Globe size={14} />
            {lang === 'en' ? 'Switch to Traditional Chinese' : '切換至英文'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Layout className="text-white h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">{t.appTitle[lang]}</span>
            </div>

            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 sm:text-sm transition"
                  placeholder={t.searchPlaceholder[lang]}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Globe size={20} />
              </button>
              <button onClick={() => openEditor()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm">
                <Plus size={18} />
                <span className="hidden sm:inline">{t.newCanvas[lang]}</span>
              </button>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.myCollection[lang]}</h2>
          <span className="text-sm text-gray-500">{filteredCanvases.length} Items</span>
        </div>

        {filteredCanvases.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
              <Code className="h-full w-full" />
            </div>
            <p className="text-gray-500 text-lg">{t.noCanvases[lang]}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCanvases.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col h-56">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'react' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                      {item.type === 'react' ? 'React' : 'HTML'}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEditor(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">
                        <Code size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm font-mono bg-gray-50 p-2 rounded border border-gray-100 line-clamp-3 text-xs">
                    {item.code.substring(0, 150)}...
                  </p>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => openPreview(item)}
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    <Play size={16} className="fill-current" />
                    {t.view[lang]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">{currentCanvas.id ? t.edit[lang] : t.newCanvas[lang]}</h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.canvasTitle[lang]}</label>
                  <input
                    type="text"
                    value={currentCanvas.title}
                    onChange={(e) => setCurrentCanvas({ ...currentCanvas, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="My Awesome Game"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.canvasType[lang]}</label>
                  <select
                    value={currentCanvas.type}
                    onChange={(e) => setCurrentCanvas({ ...currentCanvas, type: e.target.value as 'react' | 'html' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="react">React (JSX)</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
              </div>

              <div className="mb-2 flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <span className="text-xs text-gray-500 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                  {currentCanvas.type === 'react' ? 'Tips: Remove imports, ensure function App() exists.' : 'Tips: Paste full <html>...</html>'}
                </span>
              </div>
              <textarea
                value={currentCanvas.code}
                onChange={(e) => setCurrentCanvas({ ...currentCanvas, code: e.target.value })}
                className="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder={t.pasteCode[lang]}
                spellCheck={false}
              />
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsEditorOpen(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                {t.cancel[lang]}
              </button>
              <button
                onClick={handleSave}
                disabled={!currentCanvas.title || !currentCanvas.code}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                {t.save[lang]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview/Runner Modal */}
      {isPreviewOpen && activePreviewCanvas && (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900">
          <div className="flex justify-between items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-bold truncate max-w-md">{activePreviewCanvas.title}</h3>
              <span className="text-xs text-gray-400 px-2 py-0.5 border border-gray-600 rounded">
                {activePreviewCanvas.type === 'react' ? 'Running via Babel' : 'Running Iframe'}
              </span>
            </div>
            <button
              onClick={() => { setIsPreviewOpen(false); setActivePreviewCanvas(null); }}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-full transition"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 bg-white relative">
            <iframe
              title="Runner"
              srcDoc={
                activePreviewCanvas.type === 'react'
                  ? generateReactPreview(activePreviewCanvas.code)
                  : generateHtmlPreview(activePreviewCanvas.code)
              }
              className="absolute inset-0 w-full h-full border-none"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}
