import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Search,
  PlusSquare,
  Clapperboard,
  User,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Grid,
  Play,
  Tv,
  Users,
  Menu,
  ArrowLeft
} from 'lucide-react';

// --- 模擬數據 (Mock Data) ---

const CURRENT_USER = {
  id: 'me',
  username: 'design_daily_2025',
  name: 'UI/UX Design Trends',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  bio: 'Exploring the future of interface design.\n📍 Taipei, Taiwan\n🔗 design2025.com',
  posts: 125,
  followers: '12.5K',
  following: 450
};

const STORIES = [
  { id: 1, username: 'alex_create', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', viewed: false },
  { id: 2, username: 'sarah_vlog', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', viewed: false },
  { id: 3, username: 'mike_photo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', viewed: true },
  { id: 4, username: 'luna_art', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna', viewed: false },
  { id: 5, username: 'travel_jim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jim', viewed: false },
  { id: 6, username: 'foodie_jen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jen', viewed: true },
];

const POSTS = [
  {
    id: 101,
    user: { username: 'minimalist_life', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80', // 4:5 aspect ratio content ideally
    likes: 1243,
    caption: 'Simplicity is the ultimate sophistication. ✨ #minimalism #design',
    time: '2 HOURS AGO',
    liked: false,
    saved: false
  },
  {
    id: 102,
    user: { username: 'coffee_addict', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee' },
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80',
    likes: 856,
    caption: 'Morning brew ☕️ starting the day right.',
    time: '5 HOURS AGO',
    liked: true,
    saved: true
  },
  {
    id: 103,
    user: { username: 'urban_shots', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Urban' },
    image: 'https://images.unsplash.com/photo-1449824913929-2b3a6e54746c?w=800&q=80',
    likes: 2341,
    caption: 'City lights and rainy nights. 🌧️🏙️',
    time: '8 HOURS AGO',
    liked: false,
    saved: false
  }
];

const PROFILE_POSTS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  'https://images.unsplash.com/photo-1519052537078-e6302a4968ef?w=500&q=80',
  'https://images.unsplash.com/photo-1481487484168-9b9301cd2766?w=500&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80',
  'https://images.unsplash.com/photo-1439853949127-fa528d305a69?w=500&q=80',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=500&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&q=80',
];

// --- Components ---

const IconButton = ({ icon: Icon, onClick, className = "", fill = false, size = 26 }) => (
  <button onClick={onClick} className={`active:scale-90 transition-transform ${className}`}>
    <Icon size={size} strokeWidth={fill ? 0 : 2} fill={fill ? "currentColor" : "none"} className={fill ? "text-red-500" : "text-black dark:text-white"} />
  </button>
);

const Avatar = ({ src, size = "md", hasStory = false, viewed = false }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20",
    xl: "w-24 h-24"
  };

  // Instagram gradient ring
  const ringClass = hasStory
    ? (viewed ? "bg-gray-300 p-[2px]" : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2.5px]")
    : "";

  return (
    <div className={`${ringClass} rounded-full inline-block cursor-pointer`}>
      <div className="bg-white p-[2px] rounded-full">
        <img src={src} alt="avatar" className={`${sizeClasses[size]} rounded-full object-cover border border-gray-100`} />
      </div>
    </div>
  );
};

const StoryCircle = ({ username, avatar, viewed }) => (
  <div className="flex flex-col items-center space-y-1 min-w-[72px]">
    <Avatar src={avatar} hasStory={true} viewed={viewed} size="md" />
    <span className="text-xs text-gray-900 dark:text-white truncate w-16 text-center font-normal">{username}</span>
  </div>
);

const Post = ({ data }) => {
  const [liked, setLiked] = useState(data.liked);
  const [saved, setSaved] = useState(data.saved);
  const [likeCount, setLikeCount] = useState(data.likes);

  const toggleLike = () => {
    if (liked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="pb-4 mb-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar src={data.user.avatar} size="sm" hasStory={true} viewed={true} />
          <span className="font-semibold text-sm text-black dark:text-white">{data.user.username}</span>
        </div>
        <MoreHorizontal size={20} className="text-gray-600 dark:text-gray-400 cursor-pointer" />
      </div>

      {/* Post Image (4:5 Ratio enforced by object-cover and aspect style if needed, here flexible) */}
      <div
        className="w-full bg-gray-100 overflow-hidden relative"
        onDoubleClick={toggleLike}
      >
         {/* Simulating 4:5 Aspect Ratio container */}
        <div className="relative w-full pt-[125%]">
           <img
            src={data.image}
            alt="post"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        {/* Heart Animation Overlay could go here */}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center space-x-4">
          <IconButton icon={Heart} size={26} fill={liked} onClick={toggleLike} className={liked ? "text-red-500" : ""} />
          <IconButton icon={MessageCircle} size={26} />
          <IconButton icon={Send} size={26} />
        </div>
        <IconButton icon={Bookmark} size={26} fill={saved} onClick={() => setSaved(!saved)} className={saved ? "text-black dark:text-white" : ""} />
      </div>

      {/* Likes & Caption */}
      <div className="px-3 space-y-1">
        <div className="font-semibold text-sm text-black dark:text-white">{likeCount.toLocaleString()} likes</div>
        <div className="text-sm text-black dark:text-white">
          <span className="font-semibold mr-2">{data.user.username}</span>
          {data.caption}
        </div>
        <div className="text-gray-500 text-xs pt-1 cursor-pointer">View all 14 comments</div>
        <div className="text-[10px] text-gray-400 uppercase mt-1">{data.time}</div>
      </div>
    </div>
  );
};

const ProfileGrid = () => {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {PROFILE_POSTS.map((src, index) => (
        <div key={index} className="relative pt-[125%] bg-gray-100 cursor-pointer overflow-hidden">
          <img src={src} alt="post" className="absolute top-0 left-0 w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
};

const BottomNavItem = ({ icon: Icon, label, active, onClick, isProfile }) => {
  if (isProfile) {
    return (
      <div onClick={onClick} className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
        <div className={`rounded-full p-[1px] ${active ? 'border-2 border-black dark:border-white' : 'border border-transparent'}`}>
           <img src={CURRENT_USER.avatar} className="w-6 h-6 rounded-full" alt="profile" />
        </div>
      </div>
    );
  }
  return (
    <div onClick={onClick} className="cursor-pointer flex flex-col items-center justify-center w-full h-full active:scale-90 transition-transform">
      <Icon
        size={26}
        strokeWidth={active ? 3 : 2}
        className={active ? "text-black dark:text-white" : "text-black dark:text-white"}
      />
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, search, add, reels, profile
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Simulate loading splash
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center">
           {/* Instagram Logo Placeholder */}
           <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png" className="w-20 h-20 mb-4" alt="logo"/>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center w-full min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>

      {/* Mobile Container Constraint */}
      <div className="w-full max-w-md bg-white dark:bg-black h-screen md:h-[90vh] md:my-auto md:rounded-3xl md:shadow-2xl md:border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative">

        {/* TOP BAR (Header) */}
        {activeTab === 'home' && (
          <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-white dark:bg-black z-10 sticky top-0">
            {/* Instagram Text Logo (Using font imitation) */}
            <h1 className="text-2xl font-bold tracking-tighter italic cursor-pointer font-serif select-none" style={{ fontFamily: 'cursive' }}>
              Instagram
            </h1>
            <div className="flex items-center space-x-5">
              <div className="relative cursor-pointer">
                 <Heart size={26} className="text-black dark:text-white" />
                 <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-black"></span>
              </div>
              <div className="relative cursor-pointer">
                 <MessageCircle size={26} className="text-black dark:text-white" />
                 <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full border-2 border-white dark:border-black">3</span>
              </div>
            </div>
          </header>
        )}

        {activeTab === 'profile' && (
          <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-1 cursor-pointer">
               <h2 className="text-xl font-bold text-black dark:text-white">{CURRENT_USER.id}</h2>
               <span className="bg-red-500 w-2 h-2 rounded-full ml-1"></span>
            </div>
            <div className="flex items-center space-x-5">
               <PlusSquare size={26} className="text-black dark:text-white cursor-pointer"/>
               <Menu size={26} className="text-black dark:text-white cursor-pointer"/>
            </div>
          </header>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">

          {/* HOME VIEW */}
          {activeTab === 'home' && (
            <>
              {/* Stories Rail */}
              <div className="pt-2 pb-2 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 px-4 min-w-max">
                  {/* Your Story */}
                  <div className="flex flex-col items-center space-y-1 relative">
                     <Avatar src={CURRENT_USER.avatar} size="md" hasStory={false} />
                     <div className="absolute bottom-5 right-0 bg-blue-500 border-2 border-white dark:border-black rounded-full w-5 h-5 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">+</span>
                     </div>
                     <span className="text-xs text-gray-500 dark:text-gray-400">Your story</span>
                  </div>
                  {STORIES.map(story => (
                    <StoryCircle key={story.id} {...story} />
                  ))}
                </div>
              </div>

              {/* Feed */}
              <div className="pb-20">
                {POSTS.map(post => (
                  <Post key={post.id} data={post} />
                ))}
              </div>
            </>
          )}

          {/* SEARCH VIEW (Placeholder) */}
          {activeTab === 'search' && (
             <div className="p-2">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2 flex items-center text-gray-500 mb-4">
                   <Search size={18} className="mr-2"/>
                   <span className="text-sm">Search</span>
                </div>
                <div className="grid grid-cols-3 gap-1 auto-rows-[120px]">
                   {Array.from({length: 15}).map((_,i) => (
                      <div key={i} className={`bg-gray-200 dark:bg-gray-800 relative overflow-hidden ${i % 7 === 0 ? 'row-span-2 col-span-2' : ''}`}>
                         <img src={`https://source.unsplash.com/random/300x300?sig=${i}`} className="absolute w-full h-full object-cover" alt="explore"/>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* REELS VIEW (Placeholder) */}
          {activeTab === 'reels' && (
             <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80" className="absolute w-full h-full object-cover opacity-80" alt="reel"/>
                <div className="z-10 text-white text-center">
                   <Play size={64} fill="white" className="opacity-80"/>
                   <p className="mt-4 font-bold text-lg">Reels Interface</p>
                </div>
                {/* Reel Overlay UI */}
                <div className="absolute bottom-4 left-4 right-16 text-white z-20">
                   <div className="flex items-center space-x-2 mb-2">
                      <Avatar src={CURRENT_USER.avatar} size="sm" />
                      <span className="font-semibold text-sm">{CURRENT_USER.username}</span>
                      <span className="border border-white/50 rounded px-2 text-[10px]">Follow</span>
                   </div>
                   <p className="text-sm mb-2">Late night vibes... 🎵 Original Audio</p>
                </div>
                <div className="absolute bottom-4 right-2 flex flex-col items-center space-y-4 text-white z-20">
                   <div className="flex flex-col items-center"><Heart size={28} /><span className="text-xs mt-1">12K</span></div>
                   <div className="flex flex-col items-center"><MessageCircle size={28} /><span className="text-xs mt-1">234</span></div>
                   <div className="flex flex-col items-center"><Send size={28} /></div>
                   <div className="flex flex-col items-center"><MoreHorizontal size={28} /></div>
                   <div className="w-8 h-8 border-2 border-white rounded-md overflow-hidden"><img src={CURRENT_USER.avatar} className="w-full h-full object-cover"/></div>
                </div>
             </div>
          )}

          {/* PROFILE VIEW */}
          {activeTab === 'profile' && (
            <div className="pb-20">
              {/* Profile Header */}
              <div className="px-4 pt-2 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <Avatar src={CURRENT_USER.avatar} size="xl" hasStory={true} viewed={false} />
                  <div className="flex flex-1 justify-around ml-4 text-black dark:text-white">
                    <div className="flex flex-col items-center">
                       <span className="font-bold text-lg">{CURRENT_USER.posts}</span>
                       <span className="text-xs">Posts</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="font-bold text-lg">{CURRENT_USER.followers}</span>
                       <span className="text-xs">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                       <span className="font-bold text-lg">{CURRENT_USER.following}</span>
                       <span className="text-xs">Following</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-bold text-sm text-black dark:text-white">{CURRENT_USER.name}</div>
                  <div className="text-sm whitespace-pre-wrap text-black dark:text-white">{CURRENT_USER.bio}</div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mb-6">
                  <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white py-1.5 rounded-lg text-sm font-semibold active:bg-gray-200 transition-colors">Edit profile</button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white py-1.5 rounded-lg text-sm font-semibold active:bg-gray-200 transition-colors">Share profile</button>
                  <button className="p-1.5 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-lg"><User size={20}/></button>
                </div>

                {/* Highlights Placeholder */}
                <div className="flex space-x-4 mb-6 overflow-x-auto scrollbar-hide">
                   {[1,2,3].map(i => (
                      <div key={i} className="flex flex-col items-center space-y-1 min-w-[64px]">
                         <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <Heart size={20} className="text-gray-300"/>
                         </div>
                         <span className="text-xs text-black dark:text-white">Highlight</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-800">
                <div className="flex-1 flex justify-center pb-3 border-b-2 border-black dark:border-white cursor-pointer">
                   <Grid size={24} className="text-black dark:text-white" />
                </div>
                <div className="flex-1 flex justify-center pb-3 text-gray-400 cursor-pointer">
                   <Clapperboard size={24} />
                </div>
                <div className="flex-1 flex justify-center pb-3 text-gray-400 cursor-pointer">
                   <Users size={24} />
                </div>
              </div>

              {/* Grid Content */}
              <ProfileGrid />
            </div>
          )}

        </main>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-20 sticky bottom-0">
          <BottomNavItem
            icon={Home}
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <BottomNavItem
            icon={Search}
            active={activeTab === 'search'}
            onClick={() => setActiveTab('search')}
          />
          <BottomNavItem
            icon={PlusSquare}
            active={activeTab === 'add'}
            onClick={() => setActiveTab('add')}
          />
          <BottomNavItem
            icon={Clapperboard}
            active={activeTab === 'reels'}
            onClick={() => setActiveTab('reels')}
          />
          <BottomNavItem
            icon={User}
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            isProfile={true}
          />
        </nav>

      </div>
    </div>
  );
}
