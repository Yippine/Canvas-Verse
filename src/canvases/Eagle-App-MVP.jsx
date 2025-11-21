import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Folder,
  Image as ImageIcon,
  Tag,
  Filter,
  MoreHorizontal,
  Grid,
  List,
  Maximize2,
  Info,
  Clock,
  Star,
  Hash,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Settings,
  Command,
  X
} from 'lucide-react';

// --- Mock Data Generator ---
const MOCK_TAGS = ['UI Design', 'Mobile', 'Web', 'Minimal', 'Dark Mode', 'Inspiration', 'Banner', 'Icon Set'];
const MOCK_FOLDERS = [
  { id: 'all', name: '全部圖片', icon: <Grid size={16} />, count: 12 },
  { id: 'uncategorized', name: '未分類', icon: <Info size={16} />, count: 3 },
  { id: 'f1', name: '靈感蒐集', icon: <Folder size={16} />, count: 5 },
  { id: 'f2', name: '介面設計', icon: <Folder size={16} />, count: 4 },
  { id: 'f3', name: '素材資源', icon: <Folder size={16} />, count: 0 },
];

const INITIAL_ASSETS = [
  {
    id: 1,
    name: 'Dashboard_Concept_Dark.png',
    type: 'PNG',
    width: 1920,
    height: 1080,
    size: '2.4 MB',
    createdAt: '2023-10-24 14:30',
    rating: 5,
    tags: ['UI Design', 'Dark Mode', 'Web'],
    folderId: 'f2',
    color: '#1e293b', // Slate 800
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    notes: '很好的數據儀表板配色參考，注意陰影的運用。'
  },
  {
    id: 2,
    name: 'Mobile_App_Onboarding.jpg',
    type: 'JPG',
    width: 1125,
    height: 2436,
    size: '1.1 MB',
    createdAt: '2023-10-25 09:15',
    rating: 4,
    tags: ['Mobile', 'UI Design', 'Inspiration'],
    folderId: 'f2',
    color: '#f472b6', // Pink 400
    url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    notes: ''
  },
  {
    id: 3,
    name: 'Abstract_Geometric_Shapes.svg',
    type: 'SVG',
    width: 800,
    height: 800,
    size: '45 KB',
    createdAt: '2023-10-26 16:45',
    rating: 3,
    tags: ['Minimal', 'Icon Set'],
    folderId: 'f1',
    color: '#6366f1', // Indigo 500
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    notes: '向量圖形，可以用在背景。'
  },
  {
    id: 4,
    name: 'Mountain_Travel_Banner.jpg',
    type: 'JPG',
    width: 1200,
    height: 630,
    size: '890 KB',
    createdAt: '2023-10-27 11:20',
    rating: 0,
    tags: ['Banner', 'Web'],
    folderId: 'uncategorized',
    color: '#0ea5e9', // Sky 500
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    notes: ''
  },
  {
    id: 5,
    name: 'Minimalist_Chair_Product.png',
    type: 'PNG',
    width: 1000,
    height: 1000,
    size: '1.8 MB',
    createdAt: '2023-10-28 13:00',
    rating: 4,
    tags: ['Minimal', 'Inspiration'],
    folderId: 'f1',
    color: '#d4d4d8', // Zinc 300
    url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
    notes: '乾淨的背景處理方式。'
  },
  {
    id: 6,
    name: 'Neon_City_Night.jpg',
    type: 'JPG',
    width: 3840,
    height: 2160,
    size: '4.5 MB',
    createdAt: '2023-10-29 20:10',
    rating: 5,
    tags: ['Dark Mode', 'Inspiration'],
    folderId: 'f1',
    color: '#a855f7', // Purple 500
    url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    notes: '賽博龐克風格配色。'
  },
  {
    id: 7,
    name: 'Coffee_Shop_Menu.pdf',
    type: 'PDF',
    width: 595,
    height: 842,
    size: '3.2 MB',
    createdAt: '2023-10-30 10:05',
    rating: 2,
    tags: ['Print', 'Typography'],
    folderId: 'uncategorized',
    color: '#78350f', // Amber 900
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    notes: '排版有點亂，需要重新設計。'
  },
  {
    id: 8,
    name: 'Tech_Conference_Landing.png',
    type: 'PNG',
    width: 1440,
    height: 3200,
    size: '5.1 MB',
    createdAt: '2023-10-31 15:30',
    rating: 4,
    tags: ['Web', 'UI Design'],
    folderId: 'f2',
    color: '#2563eb', // Blue 600
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    notes: ''
  },
];

// --- Components ---

const SidebarItem = ({ icon, label, count, active, onClick, isHeader = false }) => (
  <div
    onClick={onClick}
    className={`
      flex items-center justify-between px-3 py-1.5 mx-2 rounded-md cursor-pointer text-sm transition-colors select-none
      ${active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
      ${isHeader ? 'font-semibold mt-4 mb-1 px-4 hover:bg-transparent text-gray-500 cursor-default' : ''}
    `}
  >
    <div className="flex items-center gap-2 overflow-hidden">
      {icon}
      <span className="truncate">{label}</span>
    </div>
    {count !== undefined && (
      <span className={`text-xs ${active ? 'text-blue-200' : 'text-gray-600'}`}>{count}</span>
    )}
  </div>
);

const ColorDot = ({ color, selected, onClick }) => (
  <div
    onClick={() => onClick(color)}
    className={`w-5 h-5 rounded-full cursor-pointer border-2 transition-all ${selected ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
    style={{ backgroundColor: color }}
    title={color}
  />
);

const AssetCard = ({ asset, selected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(asset.id)}
      className={`
        group relative flex flex-col break-inside-avoid mb-4 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200
        ${selected ? 'border-blue-500 ring-2 ring-blue-500/30 bg-gray-800' : 'border-transparent hover:bg-gray-800 hover:-translate-y-1'}
      `}
    >
      {/* Image Area */}
      <div className="relative w-full overflow-hidden bg-gray-900 aspect-auto" style={{ minHeight: '120px' }}>
        <img
          src={asset.url}
          alt={asset.name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
        {/* Overlay Controls (Visible on Hover/Selected) */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity ${selected || 'group-hover:opacity-100 opacity-0'}`}>
          <div className="absolute top-2 right-2">
             <div className={`w-5 h-5 rounded-full border border-white flex items-center justify-center ${selected ? 'bg-blue-500 border-blue-500' : 'bg-black/50'}`}>
               {selected && <CheckCircle size={12} className="text-white" />}
             </div>
          </div>
        </div>

        {/* File Type Badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-300 uppercase backdrop-blur-sm">
          {asset.type}
        </div>
      </div>

      {/* Meta Area */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-200 truncate mb-1" title={asset.name}>
          {asset.name}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{asset.width} x {asset.height}</span>
          <span className="flex items-center gap-1">
             {asset.rating > 0 && <Star size={10} className="fill-yellow-500 text-yellow-500" />}
             {asset.size}
          </span>
        </div>
      </div>
    </div>
  );
};

const InspectorPanel = ({ asset, onClose, onUpdate }) => {
  if (!asset) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
        <ImageIcon size={48} className="mb-4 opacity-20" />
        <p className="text-sm">選擇一個項目以查看詳細資訊</p>
      </div>
    );
  }

  const handleRating = (r) => {
    onUpdate(asset.id, { rating: r });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-300 overflow-y-auto custom-scrollbar">
      {/* Preview Header */}
      <div className="p-4 border-b border-gray-800 flex items-start gap-4 bg-gray-850">
        <div className="w-20 h-20 rounded bg-gray-950 flex-shrink-0 overflow-hidden border border-gray-700">
          <img src={asset.url} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <h2 className="text-base font-bold text-gray-100 truncate break-all leading-tight mb-1" title={asset.name}>
            {asset.name}
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">{asset.type}</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={14}
                className={`cursor-pointer transition-colors ${star <= asset.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700 hover:text-gray-500'}`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Color Palette Section */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
          主要色系
        </h3>
        <div className="flex gap-2">
            {/* Mock Palette Generation based on main color */}
            {[asset.color, '#334155', '#94a3b8', '#e2e8f0', '#ffffff'].map((c, i) => (
              <div key={i} className="group relative">
                 <div className="w-8 h-8 rounded-md border border-gray-700 cursor-pointer shadow-sm" style={{ backgroundColor: c }}></div>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                   {c}
                 </div>
              </div>
            ))}
        </div>
      </div>

      {/* Information Grid */}
      <div className="p-4 border-b border-gray-800 grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
        <div>
          <span className="block text-gray-500 mb-1">尺寸</span>
          <span className="font-mono text-gray-300">{asset.width} × {asset.height}</span>
        </div>
        <div>
          <span className="block text-gray-500 mb-1">檔案大小</span>
          <span className="font-mono text-gray-300">{asset.size}</span>
        </div>
        <div>
          <span className="block text-gray-500 mb-1">建立時間</span>
          <span className="text-gray-300">{asset.createdAt}</span>
        </div>
        <div>
          <span className="block text-gray-500 mb-1">格式</span>
          <span className="uppercase text-gray-300">{asset.type}</span>
        </div>
      </div>

      {/* Tags Section */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">標籤</h3>
        <div className="flex flex-wrap gap-2">
          {asset.tags.map(tag => (
            <span key={tag} className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20 hover:bg-blue-500/20 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
          <button className="px-2 py-1 rounded bg-gray-800 text-gray-500 text-xs border border-gray-700 border-dashed hover:text-gray-300 hover:border-gray-500 transition-colors flex items-center gap-1">
            <Plus size={10} /> 新增標籤
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="p-4 border-b border-gray-800 flex-1">
         <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">備註</h3>
         <textarea
           className="w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 resize-none placeholder-gray-600"
           placeholder="輸入備註..."
           value={asset.notes || ''}
           onChange={(e) => onUpdate(asset.id, { notes: e.target.value })}
         />
      </div>

      {/* URL Section */}
      <div className="p-4 bg-gray-850 text-xs text-gray-500 truncate border-t border-gray-800">
        <div className="flex items-center gap-2 mb-1">
           <Command size={12} /> 來源連結
        </div>
        <a href="#" className="text-blue-400 hover:underline truncate block">{asset.url}</a>
      </div>
    </div>
  );
};

export default function EagleMVP() {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [selectedId, setSelectedId] = useState(null);
  const [activeFolder, setActiveFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [scale, setScale] = useState(1); // View scale for grid
  const [colorFilter, setColorFilter] = useState(null);

  // Filter Logic
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Folder Filter
      if (activeFolder === 'uncategorized') {
         if (asset.folderId !== 'uncategorized') return false;
      } else if (activeFolder !== 'all') {
         if (asset.folderId !== activeFolder) return false;
      }

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchName = asset.name.toLowerCase().includes(query);
        const matchTags = asset.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchName && !matchTags) return false;
      }

      // Color Filter (Simple simulation)
      if (colorFilter) {
        // In a real app, this would use deltaE or similar color distance algorithms
        // Here we just check if the asset color string matches for MVP simplicity
        // Or we can clear it if user clicks same color
      }

      return true;
    });
  }, [assets, activeFolder, searchQuery, colorFilter]);

  // Actions
  const handleAssetUpdate = (id, updates) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setSelectedId(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedAsset = assets.find(a => a.id === selectedId);

  return (
    <div className="flex h-screen w-full bg-gray-950 text-gray-200 font-sans overflow-hidden selection:bg-blue-500 selection:text-white">
      {/* --- Left Sidebar --- */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-gray-900 border-r border-gray-800">
        {/* App Header/Logo Area */}
        <div className="h-12 flex items-center px-4 border-b border-gray-800 gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Grid size={14} className="text-white" />
          </div>
          <span className="font-bold tracking-wide text-gray-100">Eagle <span className="text-[10px] font-normal text-gray-500 bg-gray-800 px-1 rounded ml-1">MVP</span></span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar space-y-0.5">
          <SidebarItem
            icon={<Grid size={16} />}
            label="全部圖片"
            count={assets.length}
            active={activeFolder === 'all'}
            onClick={() => setActiveFolder('all')}
          />
          <SidebarItem
            icon={<Info size={16} />}
            label="未分類"
            count={assets.filter(a => a.folderId === 'uncategorized').length}
            active={activeFolder === 'uncategorized'}
            onClick={() => setActiveFolder('uncategorized')}
          />

          <div className="mt-6 mb-2 px-4 flex items-center justify-between group">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">資料夾</span>
            <Plus size={14} className="text-gray-600 hover:text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {MOCK_FOLDERS.slice(2).map(folder => (
            <SidebarItem
              key={folder.id}
              icon={<Folder size={16} className={activeFolder === folder.id ? 'text-blue-200' : 'text-blue-400'} />}
              label={folder.name}
              count={assets.filter(a => a.folderId === folder.id).length}
              active={activeFolder === folder.id}
              onClick={() => setActiveFolder(folder.id)}
            />
          ))}

          <div className="mt-6 mb-2 px-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">智慧分類</span>
          </div>
          <SidebarItem icon={<Tag size={16} />} label="標籤管理" />
          <SidebarItem icon={<Star size={16} />} label="已評分" />
          <SidebarItem icon={<Clock size={16} />} label="最近新增" />
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-gray-800 text-xs text-gray-600 flex justify-between items-center hover:bg-gray-800 transition-colors cursor-pointer">
           <span>資源庫：Default Library</span>
           <Settings size={14} />
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-900">

        {/* Toolbar */}
        <div className="h-14 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur z-10">
          {/* Left: Search & Filter */}
          <div className="flex items-center gap-4 flex-1 max-w-2xl">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="搜尋名稱、標籤、備註..."
                className="w-full bg-gray-800 text-sm text-gray-200 pl-10 pr-4 py-1.5 rounded-md border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="h-6 w-px bg-gray-700 mx-2"></div>

            {/* Color Filter Simulation */}
            <div className="flex items-center gap-2">
               <div className="w-4 h-4 rounded-full bg-red-500 cursor-pointer hover:scale-110 border border-transparent hover:border-white transition-all" onClick={() => alert('MVP 模式：點擊顏色過濾功能 (模擬)')}></div>
               <div className="w-4 h-4 rounded-full bg-blue-500 cursor-pointer hover:scale-110 border border-transparent hover:border-white transition-all"></div>
               <div className="w-4 h-4 rounded-full bg-green-500 cursor-pointer hover:scale-110 border border-transparent hover:border-white transition-all"></div>
               <div className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-700">
                 <Filter size={8} className="text-gray-400" />
               </div>
            </div>
          </div>

          {/* Right: Layout & Scale */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-md p-0.5 border border-gray-700">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-24 h-1 mx-2 accent-blue-500 bg-gray-600 rounded-lg cursor-pointer"
              />
            </div>
            <button
              onClick={() => setInspectorOpen(!inspectorOpen)}
              className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${inspectorOpen ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400'}`}
              title="切換屬性面板"
            >
              <List size={18} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative" onClick={() => setSelectedId(null)}>

          {/* Stats Header */}
          <div className="mb-6 flex items-end justify-between">
            <div>
               <h1 className="text-xl font-bold text-white mb-1">
                  {activeFolder === 'all' ? '全部圖片' : MOCK_FOLDERS.find(f => f.id === activeFolder)?.name || '資料夾'}
               </h1>
               <p className="text-xs text-gray-500">{filteredAssets.length} 個項目</p>
            </div>
          </div>

          {filteredAssets.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <Search size={64} className="mb-4 text-gray-600" />
                <p className="text-lg text-gray-400">沒有找到符合的項目</p>
             </div>
          ) : (
            <div
              className="grid gap-6 transition-all duration-300 ease-out"
              style={{
                gridTemplateColumns: `repeat(auto-fill, minmax(${200 * scale}px, 1fr))`,
              }}
            >
              {filteredAssets.map(asset => (
                <div key={asset.id} onClick={(e) => e.stopPropagation()}>
                  <AssetCard
                    asset={asset}
                    selected={selectedId === asset.id}
                    onSelect={setSelectedId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Right Inspector Panel --- */}
      <div
        className={`
          flex-shrink-0 border-l border-gray-800 bg-gray-900 transition-all duration-300 ease-in-out overflow-hidden
          ${inspectorOpen ? 'w-80 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <InspectorPanel
          asset={selectedAsset}
          onClose={() => setInspectorOpen(false)}
          onUpdate={handleAssetUpdate}
        />
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}
