import React from 'react';
import { ArrowLeft, Maximize2, RefreshCw, Code } from 'lucide-react';

export default function Viewer({ canvas, onBack }) {
  const Component = canvas.component;

  return (
    <div className="h-screen flex flex-col bg-[#0f0f0f]">
      {/* Toolbar */}
      <div className="h-14 border-b border-[#333] bg-[#1a1a1a] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#333] rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-white text-sm">{canvas.title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#333] text-gray-400 border border-[#444] uppercase">
                {canvas.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#333] rounded-lg text-gray-400 hover:text-white" title="View Source">
            <Code size={18} />
          </button>
          <button
            className="p-2 hover:bg-[#333] rounded-lg text-gray-400 hover:text-white"
            title="Reload"
            onClick={() => window.location.reload()}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-[#000] relative overflow-hidden">
        {canvas.type === 'html' ? (
          <iframe
            src={canvas.file}
            className="w-full h-full border-0 bg-white"
            title={canvas.title}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        ) : (
          <div className="w-full h-full overflow-auto">
            <Component />
          </div>
        )}
      </div>
    </div>
  );
}
