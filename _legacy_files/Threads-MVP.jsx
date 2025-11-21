import React, { useState, useEffect, useRef } from 'react';
import { Home, Search, PlusSquare, Heart, User, MoreHorizontal, MessageCircle, Repeat, Send, X, Image as ImageIcon, ArrowLeft, Globe, Menu } from 'lucide-react';

// --- Mock Data ---
const MOCK_USER = {
  id: 'current_user',
  username: 'mvp_builder',
  name: 'MVP Designer',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  bio: 'Building the future, one line of code at a time. 🚀',
  followers: '3.2k'
};

const INITIAL_POSTS = [
  {
    id: 1,
    user: {
      username: 'zuck',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zuck',
      verified: true
    },
    content: 'Building new features for 2025. The focus is on speed and simplicity. thoughts?',
    time: '2h',
    likes: 1240,
    replies: 350,
    image: null
  },
  {
    id: 2,
    user: {
      username: 'mosseri',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adam',
      verified: true
    },
    content: 'Happy Friday! We just shipped a few small polish updates to the UI. Let me know if you notice them.',
    time: '5h',
    likes: 892,
    replies: 120,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'
  },
  {
    id: 3,
    user: {
      username: 'design_daily',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
      verified: false
    },
    content: 'Minimalism is not about lack of something. It’s about the perfect amount of something.',
    time: '8h',
    likes: 4500,
    replies: 89,
    image: null
  }
];

// --- Components ---

// 1. Icons & UI Elements
const VerifiedBadge = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-500 fill-current ml-1">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.93 14.13L5.79 11.85c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.87 2.87 6.17-6.17c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.88 6.88c-.39.39-1.02.39-1.41-.29z" />
  </svg>
);

const ThreadsLogo = () => (
  <svg viewBox="0 0 32 32" className="w-8 h-8 text-white fill-current" aria-label="Threads">
    <path d="M16.8 8.65c-4.8 0-7.9 3.2-7.9 7.45 0 4 2.9 7.15 7.65 7.15 2.45 0 4.45-.9 5.7-2.3.05.45.1.9.1 1.35 0 3.05-2.05 4.9-5.7 4.9-2.15 0-3.7-1.05-4.25-2.55-.2-.55-1-1.15-1.6-.9-.55.2-.85.65-.75 1.2.75 2.3 3.15 4.1 6.55 4.1 5.15 0 8.15-2.9 8.15-6.75 0-1.2-.15-2.35-.5-3.45 1.6-1.6 2.4-3.8 2.4-6 0-4.65-3.8-8.55-9.85-8.55-6.25 0-10.8 4.4-10.8 10.65 0 5.85 4.25 10.35 10.4 10.35 2.6 0 5.05-.9 6.95-2.45.5-.4.6-1.15.25-1.65-.35-.5-1.05-.6-1.55-.2-1.55 1.25-3.5 1.95-5.65 1.95-4.95 0-8.05-3.55-8.05-8 0-4.8 3.35-8.3 8.45-8.3 4.75 0 7.55 3.05 7.55 6.4 0 1.95-.75 3.8-2.15 5.1-.45-1.1-.65-2.25-.65-3.45 0-3.15-2-5.45-4.95-5.45zm0 2.2c1.75 0 2.8 1.4 2.8 3.25 0 1.9-1.05 3.35-2.8 3.35-1.7 0-2.75-1.5-2.75-3.35 0-1.8 1.1-3.25 2.75-3.25z" />
  </svg>
);

// 2. Thread Post Component
const ThreadPost = ({ post, isLast }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="flex w-full px-4 py-3 border-b border-gray-800/50">
      {/* Left Column: Avatar & Thread Line */}
      <div className="flex flex-col items-center mr-3">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 cursor-pointer">
           <img src={post.user.avatar} alt={post.user.username} className="w-full h-full object-cover" />
        </div>
        {/* The Thread Line - Distinctive UI Element */}
        {!isLast && <div className="flex-1 w-0.5 bg-gray-800 my-2 rounded-full"></div>}
      </div>

      {/* Right Column: Content */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-0.5">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[15px] text-white">{post.user.username}</span>
            {post.user.verified && <VerifiedBadge />}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">{post.time}</span>
            <MoreHorizontal size={18} className="text-gray-500 cursor-pointer" />
          </div>
        </div>

        <div className="text-[15px] text-gray-100 leading-snug mb-2 whitespace-pre-wrap">
          {post.content}
        </div>

        {post.image && (
          <div className="mb-3 rounded-xl overflow-hidden border border-gray-800">
            <img src={post.image} alt="Post attachment" className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex items-center gap-1 -ml-2 mb-1">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors hover:bg-white/5 ${liked ? 'text-red-500' : 'text-white'}`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
          </button>
          <button className="p-2 rounded-full text-white hover:bg-white/5 transition-colors">
            <MessageCircle size={20} />
          </button>
          <button className="p-2 rounded-full text-white hover:bg-white/5 transition-colors">
            <Repeat size={20} />
          </button>
          <button className="p-2 rounded-full text-white hover:bg-white/5 transition-colors">
            <Send size={20} />
          </button>
        </div>

        <div className="text-gray-500 text-sm">
          {likeCount > 0 && <span>{likeCount} likes</span>}
          {likeCount > 0 && post.replies > 0 && <span className="mx-1">·</span>}
          {post.replies > 0 && <span>{post.replies} replies</span>}
        </div>
      </div>
    </div>
  );
};

// 3. Create Post Modal
const CreatePostModal = ({ onClose, onPost }) => {
  const [content, setContent] = useState('');

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#181818] w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <button onClick={onClose} className="text-gray-100 font-medium">Cancel</button>
          <span className="font-bold text-white">New Thread</span>
          <button
            disabled={!content.trim()}
            onClick={() => onPost(content)}
            className={`font-semibold ${content.trim() ? 'text-blue-500' : 'text-gray-600 cursor-not-allowed'}`}
          >
            Post
          </button>
        </div>
        <div className="p-4 flex gap-3">
           <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 shrink-0">
             <img src={MOCK_USER.avatar} alt="Me" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1">
             <span className="font-semibold text-white text-[15px] block mb-1">{MOCK_USER.username}</span>
             <textarea
               className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-[15px]"
               placeholder="Start a thread..."
               rows={5}
               value={content}
               onChange={(e) => setContent(e.target.value)}
               autoFocus
             />
             <div className="flex gap-4 mt-2 text-gray-500">
                <ImageIcon size={20} className="cursor-pointer hover:text-white" />
                <div className="text-xs text-gray-600 mt-1">Any user can reply</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// 4. Profile View
const ProfileView = () => {
  return (
    <div className="text-white pt-4 px-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold">{MOCK_USER.name}</h2>
          <div className="flex items-center gap-1">
            <span className="text-[15px]">{MOCK_USER.username}</span>
            <div className="bg-[#1e1e1e] text-gray-400 text-xs px-2 py-1 rounded-full">threads.net</div>
          </div>
        </div>
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800">
          <img src={MOCK_USER.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      <p className="text-[15px] mb-4 whitespace-pre-wrap">{MOCK_USER.bio}</p>

      <div className="flex items-center justify-between mb-6 text-gray-500 text-[15px]">
         <div className="flex items-center gap-2">
           <div className="flex -space-x-1">
             <div className="w-4 h-4 rounded-full bg-gray-700 border border-black"></div>
             <div className="w-4 h-4 rounded-full bg-gray-600 border border-black"></div>
           </div>
           <span>{MOCK_USER.followers} followers</span>
         </div>
         <div className="flex gap-3">
           <Globe size={22} />
           <div className="w-6 h-6 rounded-full border-2 border-gray-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-500 rounded-[1px]"></div>
           </div>
         </div>
      </div>

      <div className="flex gap-3 mb-8">
        <button className="flex-1 border border-gray-700 rounded-lg py-1.5 font-semibold text-[15px]">Edit Profile</button>
        <button className="flex-1 border border-gray-700 rounded-lg py-1.5 font-semibold text-[15px]">Share Profile</button>
      </div>

      <div className="flex border-b border-gray-800">
        <button className="flex-1 pb-3 border-b border-white font-semibold text-[15px]">Threads</button>
        <button className="flex-1 pb-3 border-b border-transparent text-gray-500 font-semibold text-[15px]">Replies</button>
        <button className="flex-1 pb-3 border-b border-transparent text-gray-500 font-semibold text-[15px]">Reposts</button>
      </div>

      {/* Mock User Posts */}
      <div className="py-4 text-center text-gray-500">
        No threads yet.
      </div>
    </div>
  );
}

// 5. Main Layout & Logic
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewPost = (content) => {
    const newPost = {
      id: Date.now(),
      user: { ...MOCK_USER, verified: false },
      content: content,
      time: 'Just now',
      likes: 0,
      replies: 0,
      image: null
    };
    setPosts([newPost, ...posts]);
    setCreateModalOpen(false);
    setActiveTab('home');
  };

  // Tab Button Helper
  const NavButton = ({ tabName, icon: Icon }) => (
    <button
      onClick={() => tabName === 'create' ? setCreateModalOpen(true) : setActiveTab(tabName)}
      className={`flex-1 flex justify-center items-center py-4 transition-colors ${activeTab === tabName && tabName !== 'create' ? 'text-white' : 'text-[#5c5c5c] hover:text-gray-300'}`}
    >
      <Icon size={26} strokeWidth={activeTab === tabName ? 3 : 2.5} />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#101010] text-white font-sans selection:bg-blue-500/30">

      {/* Top Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 flex justify-center items-center h-16 ${hasScrolled ? 'bg-[#101010]/80 backdrop-blur-md' : 'bg-[#101010]'}`}>
        <div onClick={() => setActiveTab('home')} className="cursor-pointer hover:scale-105 transition-transform">
          <ThreadsLogo />
        </div>
        {activeTab === 'profile' && (
           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-4 text-white">
             <Globe size={24} />
             <Menu size={24} />
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-20 max-w-[620px] mx-auto min-h-screen">

        {activeTab === 'home' && (
          <div className="animate-fade-in">
            <div className="hidden md:flex justify-between px-4 py-2 mb-2 text-gray-500 border-b border-gray-800/50">
              <span className="text-white font-medium">For you</span>
              <span className="hover:text-gray-300 cursor-pointer">Following</span>
            </div>

            {posts.map((post, index) => (
              <ThreadPost key={post.id} post={post} isLast={index === posts.length - 1} />
            ))}

            <div className="py-8 text-center">
              <div className="w-6 h-6 border-2 border-gray-700 border-t-white rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="px-4 pt-2 animate-fade-in">
             <h1 className="text-3xl font-bold mb-4">Search</h1>
             <div className="relative mb-6">
               <input
                 type="text"
                 placeholder="Search"
                 className="w-full bg-[#1e1e1e] border border-transparent focus:border-gray-700 rounded-xl py-3 pl-10 pr-4 text-[15px] outline-none transition-all placeholder-gray-500"
               />
               <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
             </div>
             <div className="text-sm font-semibold text-gray-500 mb-2">Trending Suggestions</div>
             {[...Array(5)].map((_, i) => (
               <div key={i} className="py-3 border-b border-gray-800 flex justify-between items-center">
                 <div>
                   <div className="font-semibold">Design Trends 2025</div>
                   <div className="text-xs text-gray-500">{12 + i}K threads</div>
                 </div>
                 <MoreHorizontal size={16} className="text-gray-600" />
               </div>
             ))}
          </div>
        )}

        {activeTab === 'activity' && (
           <div className="px-4 pt-2 animate-fade-in">
             <h1 className="text-3xl font-bold mb-6">Activity</h1>
             <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
               {['All', 'Replies', 'Mentions', 'Quotes', 'Reposts'].map((filter, i) => (
                 <button key={filter} className={`px-5 py-1.5 rounded-lg font-semibold text-[14px] border ${i===0 ? 'bg-white text-black border-white' : 'border-gray-700 text-white'}`}>
                   {filter}
                 </button>
               ))}
             </div>
             {/* Mock Activity Items */}
             {[1,2,3].map((_, i) => (
               <div key={i} className="flex items-start gap-3 mb-5">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} /></div>
                    <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-0.5 border-2 border-black">
                      <User size={10} fill="white" />
                    </div>
                  </div>
                  <div className="flex-1 border-b border-gray-800 pb-4">
                    <div className="text-[15px]">
                      <span className="font-semibold mr-1">user_{i+10}</span>
                      <span className="text-gray-500">followed you</span>
                    </div>
                  </div>
                  <button className="px-4 py-1.5 border border-gray-700 rounded-lg text-[14px] font-semibold hover:bg-gray-900">Follow</button>
               </div>
             ))}
           </div>
        )}

        {activeTab === 'profile' && <ProfileView />}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#101010]/95 backdrop-blur-lg border-t border-gray-800/50 pb-safe">
        <div className="flex max-w-[620px] mx-auto justify-between items-center h-16 px-2">
          <NavButton tabName="home" icon={Home} />
          <NavButton tabName="search" icon={Search} />
          <NavButton tabName="create" icon={PlusSquare} />
          <NavButton tabName="activity" icon={Heart} />
          <NavButton tabName="profile" icon={User} />
        </div>
      </nav>

      {/* Create Post Modal Overlay */}
      {isCreateModalOpen && <CreatePostModal onClose={() => setCreateModalOpen(false)} onPost={handleNewPost} />}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom);
        }
        /* Hide scrollbar for horizontal lists */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
