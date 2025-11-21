import React, { useState, useEffect, useMemo } from 'react';
import { Search, Bell, MessageCircle, User, ChevronDown, Share2, MoreHorizontal, ArrowUpRight, Heart, MapPin, Link as LinkIcon, Plus } from 'lucide-react';

// --- Mock Data Generator ---
const generatePins = (count) => {
  const categories = [
    { key: 'interior', query: 'interior design', title: '現代極簡客廳設計', user: '家居生活誌' },
    { key: 'food', query: 'dessert', title: '草莓千層蛋糕食譜', user: '甜點實驗室' },
    { key: 'fashion', query: 'street style', title: '2025 春夏穿搭指南', user: 'FashionWeek' },
    { key: 'travel', query: 'kyoto', title: '京都隱藏版景點', user: '背包客日記' },
    { key: 'art', query: 'abstract art', title: '當代藝術展覽資訊', user: 'ArtDaily' },
    { key: 'tech', query: 'workspace setup', title: '高效能工作桌配置', user: 'TechSetup' },
    { key: 'nature', query: 'forest', title: '迷霧森林攝影集', user: 'NatureLens' },
    { key: 'cat', query: 'cat', title: '橘貓的午後時光', user: '喵星人總部' },
  ];

  return Array.from({ length: count }).map((_, i) => {
    const category = categories[i % categories.length];
    // Random aspect ratio simulation
    const height = [300, 400, 500, 250, 450][i % 5];
    return {
      id: i,
      imageUrl: `https://source.unsplash.com/random/600x${height}?${category.query}&sig=${i}`,
      // Fallback for Unsplash source deprecation/instability - using a reliable placeholder service if needed,
      // but for 'source.unsplash' specifically, we keep the structure.
      // Better Mock: use a predictable image service to ensure loading.
      // Switching to specific IDs or keywords for robustness.
      fallbackImage: `https://picsum.photos/seed/${i}/400/${Math.floor(height * 0.8)}`,
      title: `${category.title} #${i + 1}`,
      description: `這是一個關於 ${category.title} 的精彩靈感。探索更多關於 ${category.query} 的細節。`,
      author: category.user,
      link: 'example.com',
      height: height, // Used for masonry calculation hints
    };
  });
};

// --- Components ---

const Button = ({ children, variant = 'primary', className = '', onClick, icon: Icon }) => {
  const baseStyle = "px-4 py-2 rounded-full font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200",
    icon: "p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 aspect-square",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
      {Icon && <Icon size={20} />}
    </button>
  );
};

const Header = ({ searchQuery, setSearchQuery }) => (
  <div className="sticky top-0 z-50 bg-white dark:bg-black py-4 px-4 flex items-center gap-4 shadow-sm transition-colors">
    {/* Logo */}
    <div className="flex-shrink-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full">
      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">P</div>
    </div>

    {/* Navigation (Desktop) */}
    <div className="hidden md:flex gap-2">
      <Button variant="secondary" className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black">首頁</Button>
      <Button variant="ghost">探索</Button>
      <Button variant="ghost">建立</Button>
    </div>

    {/* Search Bar */}
    <div className="flex-1 relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="搜尋靈感..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-black focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 rounded-full py-3 pl-10 pr-4 outline-none transition-all dark:text-white"
      />
    </div>

    {/* Icons */}
    <div className="flex items-center gap-1 flex-shrink-0 text-gray-600 dark:text-gray-300">
      <Button variant="icon"><Bell size={24} /></Button>
      <Button variant="icon"><MessageCircle size={24} /></Button>
      <Button variant="icon"><User size={24} /></Button>
      <Button variant="icon"><ChevronDown size={20} /></Button>
    </div>
  </div>
);

const PinCard = ({ pin, onClick, isSaved, onToggleSave }) => {
  const [hover, setHover] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative mb-4 break-inside-avoid rounded-2xl overflow-hidden cursor-zoom-in group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onClick(pin)}
    >
      {/* Image Layer */}
      <div className={`relative w-full bg-gray-200 dark:bg-gray-800 min-h-[150px] ${!loaded ? 'animate-pulse' : ''}`}>
        <img
          src={pin.fallbackImage} // Using reliable fallback for demo stability
          alt={pin.title}
          className={`w-full h-auto object-cover transition-transform duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />

        {/* Dark Overlay on Hover */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`} />

        {/* Hover Controls */}
        <div className={`absolute inset-0 p-4 flex flex-col justify-between transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`}>

          {/* Top Right Save Button */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(pin.id);
              }}
              className={`px-4 py-3 rounded-full font-bold text-white transition-colors ${isSaved ? 'bg-black hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {isSaved ? '已儲存' : '儲存'}
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center">
            <a
              href={`https://${pin.link}`}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/80 hover:bg-white text-black px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-1 backdrop-blur-sm truncate max-w-[120px]"
            >
              <ArrowUpRight size={14} />
              {pin.link}
            </a>
            <div className="flex gap-2">
              <button className="p-2 bg-white/80 hover:bg-white rounded-full text-black backdrop-blur-sm">
                <Share2 size={16} />
              </button>
              <button className="p-2 bg-white/80 hover:bg-white rounded-full text-black backdrop-blur-sm">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Title (Optional per design, usually hidden in grid but good for MVP clarity) */}
      <h3 className="text-sm font-medium mt-2 text-gray-900 dark:text-white truncate px-1">{pin.title}</h3>
      <div className="flex items-center gap-2 px-1 mt-1">
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] overflow-hidden">
            {pin.author[0]}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{pin.author}</span>
      </div>
    </div>
  );
};

const PinDetailModal = ({ pin, onClose, isSaved, onToggleSave }) => {
  if (!pin) return null;

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto cursor-zoom-out" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-[32px] w-full max-w-5xl min-h-[600px] shadow-2xl flex flex-col md:flex-row overflow-hidden cursor-auto animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="w-full md:w-1/2 bg-gray-100 dark:bg-black flex items-center justify-center p-4">
          <img
            src={pin.fallbackImage}
            alt={pin.title}
            className="rounded-2xl w-full h-auto max-h-[80vh] object-contain shadow-sm"
          />
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col h-full max-h-[90vh] overflow-y-auto custom-scrollbar">

          {/* Actions Header */}
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-white dark:bg-gray-900 z-10 py-2">
            <div className="flex gap-3">
               <Button variant="icon"><MoreHorizontal /></Button>
               <Button variant="icon"><Share2 /></Button>
               <Button variant="icon"><LinkIcon /></Button>
            </div>
            <button
              onClick={() => onToggleSave(pin.id)}
              className={`px-6 py-3 rounded-full font-bold text-lg transition-colors ${isSaved ? 'bg-black text-white dark:bg-gray-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
            >
              {isSaved ? '已儲存' : '儲存'}
            </button>
          </div>

          {/* Link Info */}
          <a href="#" className="underline text-sm font-medium mb-4 truncate">{pin.link}</a>

          {/* Title & Desc */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{pin.title}</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">{pin.description}</p>

          {/* Author Profile */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold">
               {pin.author[0]}
            </div>
            <div>
               <p className="font-bold text-gray-900 dark:text-white">{pin.author}</p>
               <p className="text-sm text-gray-500">1.2萬 追蹤者</p>
            </div>
            <Button variant="secondary" className="ml-auto">追蹤</Button>
          </div>

          {/* Comments Section (Static) */}
          <div className="mt-auto pt-6 border-t dark:border-gray-800">
            <h3 className="font-bold text-xl mb-4">評論</h3>
            <div className="flex items-start gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0"></div>
               <div>
                 <p className="font-bold text-sm">User123 <span className="font-normal text-gray-500">3週前</span></p>
                 <p className="text-gray-700 dark:text-gray-300">這個設計真的很棒！我很喜歡這種色調。</p>
               </div>
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-3 mt-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    <User size={20}/>
                </div>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="新增評論"
                        className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-3 px-4 outline-none focus:ring-2 focus:ring-gray-300"
                    />
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const SavedToast = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-[70] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <span className="font-bold">已儲存到您的看板</span>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [pins, setPins] = useState([]);
  const [filteredPins, setFilteredPins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPin, setSelectedPin] = useState(null);
  const [savedPinIds, setSavedPinIds] = useState(new Set());
  const [showToast, setShowToast] = useState(false);

  // Initialize Mock Data
  useEffect(() => {
    const data = generatePins(30);
    setPins(data);
    setFilteredPins(data);
  }, []);

  // Filter Logic
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = pins.filter(pin =>
      pin.title.toLowerCase().includes(lowerQuery) ||
      pin.author.toLowerCase().includes(lowerQuery)
    );
    setFilteredPins(filtered);
  }, [searchQuery, pins]);

  // Save Logic
  const toggleSave = (id) => {
    const newSet = new Set(savedPinIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    setSavedPinIds(newSet);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans">

      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <main className="p-2 md:p-4">
        {/* Masonry Layout Implementation using CSS Columns */}
        {filteredPins.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 mx-auto max-w-[1800px]">
            {filteredPins.map((pin) => (
              <PinCard
                key={pin.id}
                pin={pin}
                onClick={setSelectedPin}
                isSaved={savedPinIds.has(pin.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">找不到相關靈感，試試其他關鍵字？</p>
          </div>
        )}

        {/* Load More Trigger (Visual Only) */}
        {filteredPins.length > 0 && (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
        )}
      </main>

      {/* Modals & Overlays */}
      {selectedPin && (
        <PinDetailModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          isSaved={savedPinIds.has(selectedPin.id)}
          onToggleSave={toggleSave}
        />
      )}

      <SavedToast show={showToast} />

      {/* Mobile Floating Action Button (Create) */}
      <button className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl rounded-full flex items-center justify-center z-40">
         <Plus size={28} />
      </button>
    </div>
  );
};

export default App;
