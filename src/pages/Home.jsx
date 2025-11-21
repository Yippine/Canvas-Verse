import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import CanvasCard from '../components/CanvasCard';
import { CANVASES } from '../lib/registry';

export default function Home({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCanvases = useMemo(() => {
    if (!searchQuery) return CANVASES;
    const query = searchQuery.toLowerCase();
    return CANVASES.filter(canvas =>
      canvas.title.toLowerCase().includes(query) ||
      canvas.description.toLowerCase().includes(query) ||
      canvas.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-500">Explore your collection of creative canvases.</p>
        </div>

        {filteredCanvases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <p className="text-lg">No canvases found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCanvases.map(canvas => (
              <CanvasCard
                key={canvas.id}
                canvas={canvas}
                onClick={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
