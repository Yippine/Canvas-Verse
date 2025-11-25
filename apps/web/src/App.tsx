import { useState, useEffect } from 'react';
import { api, User, Canvas, Team, TeamMember, InviteCode } from './lib/api';
import { Code, Play, Trash2, Search, Plus, LogOut, Globe, Save, X, Layout, Copy, Users, UserPlus, Crown, Shield, Trash, Share2, Link, Lock } from 'lucide-react';

// Helper: Generate Iframe Content for React
const generateReactPreview = (code: string) => {
  let processedCode = code
    // Remove single-line imports: import X from 'y';
    .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '')
    // Remove multi-line imports: import { X, Y, Z } from 'y';
    .replace(/import\s*\{[\s\S]*?\}\s*from\s*['"].*?['"];?/g, '')
    // Remove side-effect imports: import 'style.css';
    .replace(/import\s+['"].*?['"];?/g, '')
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
            // Destructure React hooks from global React object
            const { useState, useEffect, useRef, useCallback, useMemo, useContext, useReducer, createContext } = React;

            // Create a generic Icon component factory for lucide-style icons
            const createIcon = (pathD, opts = {}) => {
              const { fill = 'none', viewBox = '0 0 24 24' } = opts;
              return ({ size = 24, className = '', ...props }) => (
                React.createElement('svg', {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: size,
                  height: size,
                  viewBox,
                  fill,
                  stroke: 'currentColor',
                  strokeWidth: 2,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                  className,
                  ...props
                }, React.createElement('path', { d: pathD }))
              );
            };

            // Common lucide-react icon implementations (SVG paths from lucide.dev)
            const LayoutDashboard = createIcon('M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z');
            const MessageSquare = createIcon('M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z');
            const Send = createIcon('m22 2-7 20-4-9-9-4ZM22 2 11 13');
            const Menu = createIcon('M4 12h16M4 6h16M4 18h16');
            const Settings = createIcon('M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z');
            const Users = createIcon('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75');
            const BarChart3 = createIcon('M3 3v18h18M7 16v-4M11 16v-8M15 16v-5M19 16v-7');
            const Bell = createIcon('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0');
            const ChevronDown = createIcon('m6 9 6 6 6-6');
            const Search = createIcon('m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z');
            const Image = createIcon('M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm.5 11-5-5 3-3 5 5 4-4 5 5');
            const Smile = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01');
            const Paperclip = createIcon('m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48');
            const MoreHorizontal = createIcon('M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z');
            const CheckCircle2 = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9 12l2 2 4-4');
            const Plus = createIcon('M12 5v14M5 12h14');
            const Code = createIcon('m16 18 6-6-6-6M8 6l-6 6 6 6');
            const Play = createIcon('m6 3 14 9-14 9V3z');
            const Trash2 = createIcon('M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6');
            const LogOut = createIcon('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9');
            const Globe = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10');
            const Save = createIcon('M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8');
            const X = createIcon('M18 6 6 18M6 6l12 12');
            const Layout = createIcon('M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM3 9h18M9 21V9');
            const Copy = createIcon('M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2');
            const UserPlus = createIcon('M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM19 8v6M22 11h-6');
            const Crown = createIcon('m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18');
            const Shield = createIcon('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10');
            const Trash = createIcon('M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z');
            const Share2 = createIcon('M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98');
            const Link = createIcon('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71');
            const Lock = createIcon('M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4');
            const Home = createIcon('m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z');
            const Mail = createIcon('M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6');
            const Phone = createIcon('M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z');
            const Calendar = createIcon('M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18');
            const Clock = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2');
            const Heart = createIcon('M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z');
            const Star = createIcon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
            const ArrowLeft = createIcon('m12 19-7-7 7-7M19 12H5');
            const ArrowRight = createIcon('m12 5 7 7-7 7M5 12h14');
            const ArrowUp = createIcon('m5 12 7-7 7 7M12 19V5');
            const ArrowDown = createIcon('m19 12-7 7-7-7M12 5v14');
            const User = createIcon('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z');
            const MessageCircle = createIcon('M7.9 20A9 9 0 1 0 4 16.1L2 22Z');
            const Repeat = createIcon('m17 2 4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3');
            const PlusSquare = createIcon('M3 3h18v18H3zM12 8v8M8 12h8');
            const AtSign = createIcon('M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-5.5 8.28');
            const Hash = createIcon('M4 9h16M4 15h16M10 3 8 21M16 3l-2 18');
            const Bookmark = createIcon('m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z');
            const ThumbsUp = createIcon('M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z');
            const ThumbsDown = createIcon('M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z');
            const AlertTriangle = createIcon('m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4M12 17h.01');
            const Verified = createIcon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
            const VerifiedIcon = Verified;
            const BadgeCheck = createIcon('M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76ZM9 12l2 2 4-4');

            // Additional icons
            const ArrowUpRight = createIcon('M7 17 17 7M7 7h10v10');
            const ArrowDownLeft = createIcon('M17 7 7 17M17 17H7V7');
            const MapPin = createIcon('M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z');
            const Zap = createIcon('M13 2 3 14h9l-1 8 10-12h-9l1-8z');
            const Activity = createIcon('M22 12h-4l-3 9L9 3l-3 9H2');
            const TrendingUp = createIcon('m23 6-9.5 9.5-5-5L1 18');
            const Eye = createIcon('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z');
            const EyeOff = createIcon('M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20');
            const Edit2 = createIcon('M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5ZM15 5l4 4');
            const Edit3 = createIcon('M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z');
            const Camera = createIcon('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z');
            const Gift = createIcon('M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z');
            const ShoppingCart = createIcon('M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2z');
            const ShoppingBag = createIcon('M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0');
            const Tag = createIcon('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01');
            const RotateCcw = createIcon('M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15');
            const RefreshCw = createIcon('M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16');
            const Loader2 = createIcon('M21 12a9 9 0 1 1-6.219-8.56');
            const CheckCheck = createIcon('M18 6 7 17l-5-5M22 10l-7.5 7.5L13 16');
            const XCircle = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6');
            const MinusCircle = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 12h8');
            const PlusCircle = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v8M8 12h8');
            const Info = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01');
            const HelpCircle = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01');
            const ExternalLink = createIcon('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3');

            // YouTube MVP icons
            const Video = createIcon('m22 8-6 4 6 4V8zM14 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z');
            const VideoOff = createIcon('M10.66 6H14a2 2 0 0 1 2 2v2.34l1 1L22 8v8M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2M2 2l20 20');
            const Mic = createIcon('M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3');
            const MicOff = createIcon('M2 2l20 20M18.89 13.23A7.12 7.12 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 12 5M15 9.34V5a3 3 0 0 0-5.68-1.33M9 9v3a3 3 0 0 0 5.12 2.12M12 19v3');
            const Compass = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z');
            const PlaySquare = createIcon('M3 3h18v18H3zM10 8l6 4-6 4V8z');
            const Scissors = createIcon('M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12');
            const MonitorPlay = createIcon('M10 12l4-2.5v5L10 12zM2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zM8 21h8M12 17v4');
            const ListVideo = createIcon('M12 12H3M16 6H3M12 18H3M16 12l5 3-5 3v-6z');
            const History = createIcon('M12 8v4l3 3M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5');
            const Flame = createIcon('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z');
            const Music = createIcon('M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z');
            const Gamepad2 = createIcon('M6 11h4M8 9v4M15 12h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z');
            const Trophy = createIcon('M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z');
            const Film = createIcon('M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5M2 2h20v20H2z');
            const Maximize = createIcon('M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3');
            const Minimize = createIcon('M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7');
            const Volume2 = createIcon('M11 5 6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14');
            const VolumeX = createIcon('M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6');
            const Pause = createIcon('M6 4h4v16H6zM14 4h4v16h-4z');
            const SkipForward = createIcon('m5 4 10 8-10 8V4zM19 5v14');
            const SkipBack = createIcon('M19 20 9 12l10-8v16zM5 19V5');
            const Volume1 = createIcon('M11 5 6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07');
            const Download = createIcon('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3');
            const Upload = createIcon('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12');
            const Share = createIcon('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13');
            const Flag = createIcon('M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7');

            // Instagram MVP icons
            const Clapperboard = createIcon('M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3ZM6.2 5.3l3.1 3.9M12.4 3.4l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z');
            const Grid = createIcon('M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z');
            const Tv = createIcon('M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM17 2l-5 5-5-5');

            // Eagle MVP icons
            const Filter = createIcon('M22 3H2l8 9.46V19l4 2v-8.54L22 3z');
            const List = createIcon('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01');
            const Maximize2 = createIcon('M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7');
            const CheckCircle = createIcon('M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9 12l2 2 4-4');
            const ChevronRight = createIcon('m9 18 6-6-6-6');
            const ChevronLeft = createIcon('m15 18-6-6 6-6');
            const Command = createIcon('M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z');
            const Folder = createIcon('M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z');
            const FolderOpen = createIcon('M6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2');
            const FolderPlus = createIcon('M12 10v6M9 13h6M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z');
            const SlidersHorizontal = createIcon('M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4');
            const Layers = createIcon('M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5');

            // Aliases for common naming patterns
            const MenuIcon = Menu;
            const ImageIcon = Image;
            const LinkIcon = Link;

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
  featuredExamples: { en: "Featured Examples", zh: "精選範例" },
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
  copyToCollection: { en: "Copy to Collection", zh: "複製到收藏" },
  loginToCopy: { en: "Login to Copy", zh: "登入以複製" },
  // Teams
  teams: { en: "Teams", zh: "團隊" },
  myTeams: { en: "My Teams", zh: "我的團隊" },
  createTeam: { en: "Create Team", zh: "創建團隊" },
  teamName: { en: "Team Name", zh: "團隊名稱" },
  members: { en: "Members", zh: "成員" },
  inviteMembers: { en: "Invite Members", zh: "邀請成員" },
  generateInvite: { en: "Generate Invite", zh: "生成邀請" },
  inviteLink: { en: "Invite Link", zh: "邀請連結" },
  copyLink: { en: "Copy Link", zh: "複製連結" },
  linkCopied: { en: "Link copied!", zh: "連結已複製！" },
  expiresAt: { en: "Expires At", zh: "過期時間" },
  maxUses: { en: "Max Uses", zh: "最大使用次數" },
  usedCount: { en: "Used", zh: "已使用" },
  owner: { en: "Owner", zh: "擁有者" },
  admin: { en: "Admin", zh: "管理員" },
  member: { en: "Member", zh: "成員" },
  removeMember: { en: "Remove", zh: "移除" },
  deleteTeam: { en: "Delete Team", zh: "刪除團隊" },
  deleteTeamConfirm: { en: "Delete this team?", zh: "確定刪除此團隊？" },
  joinTeam: { en: "Join Team", zh: "加入團隊" },
  joining: { en: "Joining...", zh: "加入中..." },
  noTeams: { en: "No teams yet. Create one!", zh: "還沒有團隊。創建一個吧！" },
  teamDetails: { en: "Team Details", zh: "團隊詳情" },
  activeInvites: { en: "Active Invites", zh: "有效邀請" },
  viewTeam: { en: "View", zh: "查看" },
  canvases: { en: "Canvases", zh: "Canvas" },
  // Sharing
  share: { en: "Share", zh: "分享" },
  shareCanvas: { en: "Share Canvas", zh: "分享 Canvas" },
  visibility: { en: "Visibility", zh: "可見性" },
  private: { en: "Private", zh: "私人" },
  team: { en: "Team", zh: "團隊" },
  public: { en: "Public", zh: "公開" },
  privateDesc: { en: "Only you can see this canvas", zh: "僅你可以看到此 Canvas" },
  teamDesc: { en: "Team members can see this canvas", zh: "團隊成員可以看到此 Canvas" },
  publicDesc: { en: "Anyone with the link can view", zh: "任何擁有連結的人都可以查看" },
  selectTeam: { en: "Select Team", zh: "選擇團隊" },
  generateLink: { en: "Generate Share Link", zh: "生成分享連結" },
  shareLink: { en: "Share Link", zh: "分享連結" },
  shareLinkGenerated: { en: "Share link generated!", zh: "分享連結已生成！" },
  teamCanvases: { en: "Team Canvases", zh: "團隊 Canvas" },
  createdBy: { en: "Created by", zh: "創建者" },
  noTeamCanvases: { en: "No team canvases yet", zh: "還沒有團隊 Canvas" },
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [canvases, setCanvases] = useState<Canvas[]>([]);
  const [examples, setExamples] = useState<Canvas[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentCanvas, setCurrentCanvas] = useState<Partial<Canvas>>({ type: 'react', title: '', code: '' });
  const [activePreviewCanvas, setActivePreviewCanvas] = useState<Canvas | null>(null);

  // Teams state
  const [activeTab, setActiveTab] = useState<'canvases' | 'teams'>('canvases');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamInvites, setTeamInvites] = useState<InviteCode[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [joiningCode, setJoiningCode] = useState<string | null>(null);
  const [teamCanvases, setTeamCanvases] = useState<Canvas[]>([]);

  // Sharing state (Phase 6)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareCanvas, setShareCanvas] = useState<Canvas | null>(null);
  const [shareVisibility, setShareVisibility] = useState<'private' | 'team' | 'public'>('private');
  const [shareTeamId, setShareTeamId] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');

  // Auth Init
  useEffect(() => {
    const checkAuth = async () => {
      const user = await api.getMe();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch Examples (Phase 4 - always load, even when not logged in)
  useEffect(() => {
    const fetchExamples = async () => {
      try {
        const data = await api.getExamples();
        setExamples(data);
      } catch (error) {
        console.error('Error fetching examples:', error);
      }
    };
    fetchExamples();
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

  const handleCopy = async (id: string) => {
    if (!user) {
      alert(t.loginToCopy[lang]);
      return;
    }
    try {
      await api.copyCanvas(id);
      const updated = await api.getCanvases();
      setCanvases(updated);
      alert(lang === 'en' ? 'Canvas copied to your collection!' : 'Canvas 已複製到你的收藏！');
    } catch (e) {
      console.error('Copy failed', e);
      alert(lang === 'en' ? 'Failed to copy canvas' : '複製失敗');
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
    setTeams([]);
  };

  // Fetch Teams
  useEffect(() => {
    if (!user) {
      setTeams([]);
      return;
    }

    const fetchTeams = async () => {
      try {
        const data = await api.getTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    fetchTeams();
  }, [user]);

  // Check for invite code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('invite');
    if (code && user) {
      setJoiningCode(code);
    }
  }, [user]);

  // Team: Create
  const handleCreateTeam = async () => {
    if (!user || !newTeamName.trim()) return;

    try {
      await api.createTeam(newTeamName.trim());
      const updated = await api.getTeams();
      setTeams(updated);
      setIsCreateTeamOpen(false);
      setNewTeamName('');
    } catch (e) {
      console.error('Create team failed', e);
      alert(lang === 'en' ? 'Failed to create team' : '創建團隊失敗');
    }
  };

  // Team: Delete
  const handleDeleteTeam = async (teamId: string) => {
    if (!user) return;
    if (window.confirm(t.deleteTeamConfirm[lang])) {
      try {
        await api.deleteTeam(teamId);
        const updated = await api.getTeams();
        setTeams(updated);
        if (selectedTeam?.id === teamId) {
          setSelectedTeam(null);
        }
      } catch (e) {
        console.error('Delete team failed', e);
        alert(lang === 'en' ? 'Failed to delete team' : '刪除團隊失敗');
      }
    }
  };

  // Team: View Details
  const handleViewTeam = async (team: Team) => {
    setSelectedTeam(team);
    try {
      const [members, invites] = await Promise.all([
        api.getTeamMembers(team.id),
        (team.myRole === 'owner' || team.myRole === 'admin') ? api.getTeamInvites(team.id) : Promise.resolve([]),
      ]);
      setTeamMembers(members);
      setTeamInvites(invites);
    } catch (e) {
      console.error('Error loading team details', e);
    }
  };

  // Team: Generate Invite
  const handleGenerateInvite = async (teamId: string) => {
    try {
      const result = await api.generateInvite(teamId);
      setInviteUrl(result.inviteUrl);
      const updated = await api.getTeamInvites(teamId);
      setTeamInvites(updated);
    } catch (e) {
      console.error('Generate invite failed', e);
      alert(lang === 'en' ? 'Failed to generate invite' : '生成邀請失敗');
    }
  };

  // Team: Copy Invite Link
  const handleCopyInviteLink = (url: string) => {
    navigator.clipboard.writeText(url);
    alert(t.linkCopied[lang]);
  };

  // Team: Join via Code
  const handleJoinTeam = async (code: string) => {
    if (!user) return;

    try {
      const result = await api.joinTeam(code);
      alert(result.message || (lang === 'en' ? 'Successfully joined team!' : '成功加入團隊！'));
      const updated = await api.getTeams();
      setTeams(updated);
      setJoiningCode(null);
      window.history.replaceState({}, '', window.location.pathname);
    } catch (e) {
      console.error('Join team failed', e);
      alert(lang === 'en' ? 'Failed to join team. Invalid or expired code.' : '加入團隊失敗。邀請碼無效或已過期。');
      setJoiningCode(null);
    }
  };

  // Team: Remove Member
  const handleRemoveMember = async (teamId: string, userId: string) => {
    if (!user) return;

    try {
      await api.removeTeamMember(teamId, userId);
      const updated = await api.getTeamMembers(teamId);
      setTeamMembers(updated);
    } catch (e) {
      console.error('Remove member failed', e);
      alert(lang === 'en' ? 'Failed to remove member' : '移除成員失敗');
    }
  };

  // Canvas Sharing (Phase 6)
  const handleOpenShareModal = (canvas: Canvas) => {
    setShareCanvas(canvas);
    setShareVisibility(canvas.visibility || 'private');
    setShareTeamId(canvas.teamId || '');
    setShareUrl(canvas.shareToken ? `${window.location.origin}/shared/${canvas.shareToken}` : '');
    setIsShareModalOpen(true);
  };

  const handleSaveVisibility = async () => {
    if (!shareCanvas) return;

    try {
      await api.setCanvasVisibility(shareCanvas.id, shareVisibility, shareVisibility === 'team' ? shareTeamId : undefined);
      const updated = await api.getCanvases();
      setCanvases(updated);
      alert(lang === 'en' ? 'Visibility updated!' : '可見性已更新！');
    } catch (e) {
      console.error('Update visibility failed', e);
      alert(lang === 'en' ? 'Failed to update visibility' : '更新可見性失敗');
    }
  };

  const handleGenerateShareLink = async () => {
    if (!shareCanvas) return;

    try {
      const result = await api.generateShareLink(shareCanvas.id);
      setShareUrl(result.shareUrl);
      setShareVisibility('public');
      const updated = await api.getCanvases();
      setCanvases(updated);
      alert(t.shareLinkGenerated[lang]);
    } catch (e) {
      console.error('Generate share link failed', e);
      alert(lang === 'en' ? 'Failed to generate share link' : '生成分享連結失敗');
    }
  };

  const handleCopyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert(t.linkCopied[lang]);
    }
  };

  // Fetch team canvases when viewing team details
  const handleViewTeamWithCanvases = async (team: Team) => {
    await handleViewTeam(team);
    try {
      const canvases = await api.getTeamCanvases(team.id);
      setTeamCanvases(canvases);
    } catch (e) {
      console.error('Error loading team canvases', e);
    }
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
            href="/api/auth/google"
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('canvases')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  activeTab === 'canvases'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Code size={18} />
                <span className="hidden sm:inline">{t.canvases[lang]}</span>
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  activeTab === 'teams'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users size={18} />
                <span className="hidden sm:inline">{t.teams[lang]}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <Globe size={20} />
              </button>
              {activeTab === 'canvases' && (
                <button onClick={() => openEditor()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm">
                  <Plus size={18} />
                  <span className="hidden sm:inline">{t.newCanvas[lang]}</span>
                </button>
              )}
              {activeTab === 'teams' && (
                <button onClick={() => setIsCreateTeamOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm">
                  <Plus size={18} />
                  <span className="hidden sm:inline">{t.createTeam[lang]}</span>
                </button>
              )}
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Canvases Tab */}
        {activeTab === 'canvases' && (
          <>
            {/* Featured Examples Section - Phase 4 */}
            {examples.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t.featuredExamples[lang]}</h2>
              <span className="text-sm text-gray-500">{examples.length} Examples</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examples.map((item) => (
                <div key={item.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border-2 border-indigo-100 overflow-hidden hover:shadow-md transition group flex flex-col h-56">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.type === 'react' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                        {item.type === 'react' ? 'React' : 'HTML'}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Example</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm font-mono bg-white p-2 rounded border border-indigo-100 line-clamp-3 text-xs">
                      {item.code.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="bg-white px-5 py-3 border-t border-indigo-100 flex justify-between items-center">
                    <button
                      onClick={() => handleCopy(item.id)}
                      className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      <Copy size={16} />
                      {user ? t.copyToCollection[lang] : t.loginToCopy[lang]}
                    </button>
                    <button
                      onClick={() => openPreview(item)}
                      className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      <Play size={16} className="fill-current" />
                      {t.view[lang]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Collection Section */}
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
                    {!item.isExample && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => handleOpenShareModal(item)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md" title={t.share[lang]}>
                          <Share2 size={16} />
                        </button>
                        <button onClick={() => openEditor(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md">
                          <Code size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
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
          </>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t.myTeams[lang]}</h2>
              <span className="text-sm text-gray-500">{teams.length} Teams</span>
            </div>

            {teams.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                  <Users className="h-full w-full" />
                </div>
                <p className="text-gray-500 text-lg">{t.noTeams[lang]}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group flex flex-col">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Users size={20} className="text-indigo-600" />
                          {team.myRole === 'owner' && <Crown size={16} className="text-yellow-500" />}
                          {team.myRole === 'admin' && <Shield size={16} className="text-blue-500" />}
                        </div>
                        {team.myRole === 'owner' && (
                          <button
                            onClick={() => handleDeleteTeam(team.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash size={16} />
                          </button>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{team.name}</h3>
                      <div className="text-sm text-gray-500">
                        <p>{team.memberCount || 0} {t.members[lang]}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {t[team.myRole || 'member'][lang]}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        {new Date(team.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleViewTeamWithCanvases(team)}
                        className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        <Users size={16} />
                        {t.viewTeam[lang]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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

      {/* Create Team Modal */}
      {isCreateTeamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">{t.createTeam[lang]}</h3>
              <button onClick={() => setIsCreateTeamOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.teamName[lang]}</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="My Awesome Team"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
              />
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsCreateTeamOpen(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                {t.cancel[lang]}
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeamName.trim()}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus size={18} />
                {t.createTeam[lang]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Users className="text-indigo-600" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedTeam.name}</h3>
                  <p className="text-sm text-gray-500">{selectedTeam.memberCount || 0} {t.members[lang]}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTeam(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Members Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">{t.members[lang]}</h4>
                  {(selectedTeam.myRole === 'owner' || selectedTeam.myRole === 'admin') && (
                    <button
                      onClick={() => { setIsInviteModalOpen(true); handleGenerateInvite(selectedTeam.id); }}
                      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      <UserPlus size={16} />
                      {t.inviteMembers[lang]}
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {member.user?.avatar ? (
                          <img src={member.user.avatar} alt={member.user.name || ''} className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Users size={20} className="text-indigo-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{member.user?.name || member.user?.email}</p>
                          <p className="text-xs text-gray-500">{member.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          member.role === 'owner' ? 'bg-yellow-100 text-yellow-700' :
                          member.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {t[member.role][lang]}
                        </span>
                        {(selectedTeam.myRole === 'owner' || selectedTeam.myRole === 'admin') &&
                         member.role !== 'owner' &&
                         member.userId !== user?.id && (
                          <button
                            onClick={() => handleRemoveMember(selectedTeam.id, member.userId)}
                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                          >
                            {t.removeMember[lang]}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Canvases Section (Phase 6) */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">{t.teamCanvases[lang]}</h4>
                {teamCanvases.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">{t.noTeamCanvases[lang]}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {teamCanvases.map((canvas) => (
                      <div key={canvas.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{canvas.title}</h5>
                          <p className="text-xs text-gray-500 mt-1">
                            {t.createdBy[lang]}: {canvas.user?.name || canvas.user?.email}
                          </p>
                        </div>
                        <button
                          onClick={() => openPreview(canvas)}
                          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          <Play size={16} className="fill-current" />
                          {t.view[lang]}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Invites Section (Owner/Admin only) */}
              {(selectedTeam.myRole === 'owner' || selectedTeam.myRole === 'admin') && teamInvites.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">{t.activeInvites[lang]}</h4>
                  <div className="space-y-2">
                    {teamInvites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                        <div className="flex-1">
                          <p className="text-sm font-mono text-gray-700">{invite.code}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {t.usedCount[lang]}: {invite.usedCount}/{invite.maxUses} • {t.expiresAt[lang]}: {new Date(invite.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyInviteLink(`${window.location.origin}?invite=${invite.code}`)}
                          className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-100 rounded-lg transition"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isInviteModalOpen && inviteUrl && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">{t.inviteLink[lang]}</h3>
              <button onClick={() => { setIsInviteModalOpen(false); setInviteUrl(''); }} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                {lang === 'en' ? 'Share this link to invite members to your team:' : '分享此連結以邀請成員加入您的團隊：'}
              </p>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-mono"
                />
                <button
                  onClick={() => handleCopyInviteLink(inviteUrl)}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                >
                  <Copy size={14} />
                  {t.copyLink[lang]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Team Modal (Triggered by URL invite code) */}
      {joiningCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">{t.joinTeam[lang]}</h3>
              <button onClick={() => setJoiningCode(null)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                {lang === 'en' ? 'You have been invited to join a team. Click below to accept the invitation.' : '您已被邀請加入團隊。點擊下方接受邀請。'}
              </p>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded text-gray-700 mb-4">{joiningCode}</p>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setJoiningCode(null)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                {t.cancel[lang]}
              </button>
              <button
                onClick={() => handleJoinTeam(joiningCode)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <UserPlus size={18} />
                {t.joinTeam[lang]}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Canvas Modal (Phase 6) */}
      {isShareModalOpen && shareCanvas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Share2 className="text-green-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">{t.shareCanvas[lang]}</h3>
              </div>
              <button onClick={() => setIsShareModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4 font-medium">{shareCanvas.title}</p>

              {/* Visibility Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.visibility[lang]}</label>
                <div className="space-y-2">
                  <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={shareVisibility === 'private'}
                      onChange={() => setShareVisibility('private')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Lock size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{t.private[lang]}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.privateDesc[lang]}</p>
                    </div>
                  </label>

                  <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="visibility"
                      value="team"
                      checked={shareVisibility === 'team'}
                      onChange={() => setShareVisibility('team')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{t.team[lang]}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.teamDesc[lang]}</p>
                    </div>
                  </label>

                  <label className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={shareVisibility === 'public'}
                      onChange={() => setShareVisibility('public')}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-900">{t.public[lang]}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t.publicDesc[lang]}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Team Selector (when team is selected) */}
              {shareVisibility === 'team' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.selectTeam[lang]}</label>
                  <select
                    value={shareTeamId}
                    onChange={(e) => setShareTeamId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">{lang === 'en' ? 'Select a team...' : '選擇團隊...'}</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Share Link Section (when public or has shareToken) */}
              {(shareVisibility === 'public' || shareUrl) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.shareLink[lang]}</label>
                  {shareUrl ? (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-mono"
                      />
                      <button
                        onClick={handleCopyShareLink}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                      >
                        <Copy size={14} />
                        {t.copyLink[lang]}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleGenerateShareLink}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Link size={16} />
                      {t.generateLink[lang]}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                {t.cancel[lang]}
              </button>
              <button
                onClick={handleSaveVisibility}
                disabled={shareVisibility === 'team' && !shareTeamId}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save size={18} />
                {t.save[lang]}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
