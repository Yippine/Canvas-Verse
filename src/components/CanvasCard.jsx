import React from 'react';
import { Play, Code, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CanvasCard({ canvas, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => onClick(canvas)}
      className="group bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden cursor-pointer hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
    >
      {/* Preview Area */}
      <div className="aspect-video bg-[#222] relative flex items-center justify-center overflow-hidden group-hover:bg-[#252525] transition-colors">
        <div className="text-6xl select-none transform group-hover:scale-110 transition-transform duration-300">
          {canvas.thumbnail}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300">
            <Play className="text-black fill-black ml-1" size={20} />
          </div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
          {canvas.type}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-white truncate group-hover:text-blue-400 transition-colors">
            {canvas.title}
          </h3>
          {canvas.type === 'jsx' ? (
            <Code size={16} className="text-blue-400 flex-shrink-0" />
          ) : (
            <FileCode size={16} className="text-orange-400 flex-shrink-0" />
          )}
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
          {canvas.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {canvas.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400 border border-[#333]">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
