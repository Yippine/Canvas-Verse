import EagleApp from '../canvases/Eagle-App-MVP';
import PinterestApp from '../canvases/Pinterest-MVP';
import YoutubeApp from '../canvases/Youtube-MVP';

export const CANVASES = [
  {
    id: 'eagle-app',
    title: 'Eagle App MVP',
    type: 'jsx',
    component: EagleApp,
    description: 'A high-fidelity clone of the Eagle App interface for organizing design assets.',
    tags: ['React', 'Dashboard', 'Dark Mode'],
    thumbnail: '🦅'
  },
  {
    id: 'pinterest-mvp',
    title: 'Pinterest MVP',
    type: 'jsx',
    component: PinterestApp,
    description: 'A masonry layout image sharing platform inspired by Pinterest.',
    tags: ['React', 'Social', 'Masonry'],
    thumbnail: '📌'
  },
  {
    id: 'youtube-mvp',
    title: 'Youtube MVP',
    type: 'jsx',
    component: YoutubeApp,
    description: 'A video streaming platform interface clone with dark mode.',
    tags: ['React', 'Video', 'Streaming'],
    thumbnail: '▶️'
  },
  {
    id: 'boruto',
    title: 'Boruto SVG',
    type: 'html',
    file: '/canvases/Boruto.html',
    description: 'Pure SVG illustration of Boruto Uzumaki.',
    tags: ['HTML', 'SVG', 'Art'],
    thumbnail: '🍥'
  },
  {
    id: 'dot-hunter',
    title: 'Dot Hunter (Pac-Man)',
    type: 'html',
    file: '/canvases/Dot-Hunter.html',
    description: 'A classic Pac-Man style game implemented in HTML5 Canvas.',
    tags: ['HTML', 'Game', 'Canvas'],
    thumbnail: '👻'
  },
  {
    id: 'cube-play',
    title: 'Cube Play',
    type: 'html',
    file: '/canvases/Cube-Play.html',
    description: 'Interactive 3D Rubik\'s Cube simulator using Three.js.',
    tags: ['HTML', '3D', 'Three.js'],
    thumbnail: '🎲'
  }
];
