import React, { useState } from 'react';
import Home from './pages/Home';
import Viewer from './pages/Viewer';

function App() {
  const [currentCanvas, setCurrentCanvas] = useState(null);

  if (currentCanvas) {
    return (
      <Viewer
        canvas={currentCanvas}
        onBack={() => setCurrentCanvas(null)}
      />
    );
  }

  return (
    <Home onNavigate={setCurrentCanvas} />
  );
}

export default App;
