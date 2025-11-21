import React, { useState } from 'react';
import { Search, LayoutGrid, Box, Settings, Menu, X, Github } from 'lucide-react';

export default function Layout({ children, searchQuery, setSearchQuery }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-[#1a1a1a] border-r border-[#333] transition-all duration-300 flex flex-col flex-shrink-0`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-[#333]">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Box className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Canvas Verse
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
            Menu
          </div>
          <NavItem icon={<LayoutGrid size={20} />} label="All Canvases" active />
          <NavItem icon={<Box size={20} />} label="Components" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-[#333]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <Github size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Open Source</p>
              <p className="text-xs text-gray-500">v1.0.0 MVP</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-[#0f0f0f]/80 backdrop-blur-md border-b border-[#333] flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Search Bar */}
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search canvases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                className="bg-[#1a1a1a] border border-[#333] text-sm rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20">
              New Canvas
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-blue-600/10 text-blue-400'
          : 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
