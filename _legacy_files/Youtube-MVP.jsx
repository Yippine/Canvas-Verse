import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, Search, Mic, Video, Bell, User, Home, Compass,
  PlaySquare, Clock, ThumbsUp, ThumbsDown, Share2,
  MoreHorizontal, Download, Scissors, MessageSquare,
  MonitorPlay, ListVideo, History, Flame, Music, Gamepad2,
  Trophy, Film, X, Maximize, Minimize, Volume2, VolumeX,
  Play, Pause, SkipForward
} from 'lucide-react';

// --- 模擬數據 (Mock Data) ---

const CURRENT_USER = {
  name: "測試使用者",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
};

const CATEGORIES = [
  "全部", "遊戲", "音樂", "直播", "合輯", "動作冒險遊戲", "寵物", "烹飪", "近期上傳", "已觀看"
];

const MOCK_VIDEOS = [
  {
    id: '1',
    title: "Big Buck Bunny - 開源動畫電影 (4K 60fps)",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    channelName: "Blender Foundation",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Blender",
    views: "120萬",
    postedAt: "2年前",
    duration: "9:56",
    description: "Big Buck Bunny 是一部由 Blender 基金會製作的短篇動畫電影。這部電影是使用開源軟體 Blender 製作的，展示了開源圖形軟體的強大功能。\n\n立即訂閱以獲得更多開源動畫內容！"
  },
  {
    id: '2',
    title: "Sintel - 尋龍之旅 (完整版)",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    channelName: "Blender Studio",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Sintel",
    views: "89萬",
    postedAt: "4年前",
    duration: "14:48",
    description: "Sintel 是一部史詩般的奇幻短片。這是一個關於孤獨、友誼和失去的故事。"
  },
  {
    id: '3',
    title: "Tears of Steel - 科幻特效展示",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    channelName: "Mango Project",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Mango",
    views: "230萬",
    postedAt: "5年前",
    duration: "12:14",
    description: "Tears of Steel 是 Blender 基金會的第四部開放電影專案。影片設定在未來的阿姆斯特丹。"
  },
  {
    id: '4',
    title: "Elephant Dream - 全球首部開源電影",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    channelName: "Orange Open Movie",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Orange",
    views: "56萬",
    postedAt: "10年前",
    duration: "10:53",
    description: "這是一個關於機器與人類共存的超現實故事。"
  },
  {
    id: '5',
    title: "For Bigger Blazes - 演示影片",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    channelName: "Tech Demo",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Tech",
    views: "1.2萬",
    postedAt: "3天前",
    duration: "0:15",
    description: "Chromecast 演示影片樣本。"
  },
  {
    id: '6',
    title: "For Bigger Escapes - 旅遊 vlog",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    channelName: "Travel Life",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Travel",
    views: "45萬",
    postedAt: "1週前",
    duration: "0:15",
    description: "帶你逃離城市的喧囂，享受大自然。"
  },
  {
    id: '7',
    title: "For Bigger Fun - 歡樂時刻",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    channelName: "Daily Dose",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Fun",
    views: "300萬",
    postedAt: "1個月前",
    duration: "1:00",
    description: "每天一笑，煩惱全消。"
  },
  {
    id: '8',
    title: "For Bigger Joy - 感動瞬間",
    thumbnail: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoy.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoy.mp4",
    channelName: "Heartwarming",
    channelAvatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Joy",
    views: "15萬",
    postedAt: "2天前",
    duration: "0:15",
    description: "紀錄生活中微小但美好的時刻。"
  }
];

const MOCK_COMMENTS = [
  { user: "User123", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", text: "這部影片太棒了！畫質超清晰。", time: "2小時前", likes: 24 },
  { user: "AnimeLover", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2", text: "Blender 真的是開源之光，期待下一部作品。", time: "5小時前", likes: 156 },
  { user: "TechGeek", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", text: "這個光影渲染效果在當年真的很強。", time: "1天前", likes: 8 },
];

// --- 元件 Components ---

// 1. Header 元件
const Header = ({ toggleSidebar }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-[#0f0f0f] sticky top-0 z-50 w-full h-14">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-full">
          <Menu className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white text-xl font-semibold tracking-tighter font-sans">YouTube <sup className="text-xs text-gray-400 font-normal">TW</sup></span>
        </div>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex items-center flex-1 max-w-[720px] ml-10">
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-0.5 focus-within:border-blue-500 ml-8">
            <input
              type="text"
              placeholder="搜尋"
              className="w-full bg-transparent text-white outline-none py-2 placeholder-gray-500"
            />
            <div className="hidden group-focus-within:block">
                <div className="w-[1px] h-6 bg-transparent"></div>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-[#222222] border border-l-0 border-[#303030] rounded-r-full hover:bg-[#303030] tooltip">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
        <button className="ml-4 p-2.5 bg-[#181818] hover:bg-[#303030] rounded-full">
          <Mic className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="hidden md:block p-2 hover:bg-white/10 rounded-full">
          <Video className="w-6 h-6 text-white" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full relative">
          <Bell className="w-6 h-6 text-white" />
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1 border-2 border-[#0f0f0f]">9+</span>
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
            <img src={CURRENT_USER.avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

// 2. Sidebar 元件
const Sidebar = ({ isOpen, setCategory }) => {
  const mainItems = [
    { icon: Home, label: "首頁", active: true },
    { icon: Compass, label: "Shorts" },
    { icon: ListVideo, label: "訂閱內容" },
  ];

  const userItems = [
    { icon: User, label: "您的頻道" },
    { icon: History, label: "觀看紀錄" },
    { icon: PlaySquare, label: "您的影片" },
    { icon: Clock, label: "稍後觀看" },
    { icon: ThumbsUp, label: "喜歡的影片" },
  ];

  const exploreItems = [
    { icon: Flame, label: "發燒影片" },
    { icon: Music, label: "音樂" },
    { icon: Gamepad2, label: "遊戲" },
    { icon: Trophy, label: "體育" },
  ];

  if (!isOpen) {
    // Mini Sidebar for collapsed state
    return (
      <div className="hidden md:flex flex-col items-center w-[72px] h-[calc(100vh-56px)] sticky top-14 bg-[#0f0f0f] pt-2">
        {mainItems.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 py-4 w-16 rounded-lg hover:bg-white/10 cursor-pointer mb-1">
            <item.icon className="w-6 h-6 text-white" />
            <span className="text-[10px] text-white truncate">{item.label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1 py-4 w-16 rounded-lg hover:bg-white/10 cursor-pointer mb-1">
            <User className="w-6 h-6 text-white" />
            <span className="text-[10px] text-white">您</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-60 h-[calc(100vh-56px)] bg-[#0f0f0f] overflow-y-auto sticky top-14 scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500 hidden md:block pb-10">
      <div className="p-3 border-b border-white/10">
        {mainItems.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer ${item.active ? 'bg-white/10' : 'hover:bg-white/10'}`}>
            {item.active ? <item.icon className="w-6 h-6 text-white fill-white" /> : <item.icon className="w-6 h-6 text-white" />}
            <span className={`text-sm ${item.active ? 'font-medium' : ''} text-white`}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
            <span className="text-base font-semibold text-white">您</span>
            <code className="text-xs text-gray-400">&gt;</code>
        </div>
        {userItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10">
            <item.icon className="w-6 h-6 text-white" />
            <span className="text-sm text-white">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="p-3">
        <div className="px-3 py-2 mb-1 text-base font-semibold text-white">探索</div>
        {exploreItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-5 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10">
            <item.icon className="w-6 h-6 text-white" />
            <span className="text-sm text-white">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Video Card 元件
const VideoCard = ({ video, onClick }) => {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group" onClick={() => onClick(video)}>
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
          {video.duration}
        </span>
      </div>
      {/* Info */}
      <div className="flex gap-3 mt-1">
        <div className="flex-shrink-0">
            <img src={video.channelAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-white font-semibold text-base line-clamp-2 leading-snug group-hover:text-white">
            {video.title}
          </h3>
          <div className="text-gray-400 text-sm mt-1">
            <div className="hover:text-white">{video.channelName}</div>
            <div className="flex items-center">
              <span>{video.views}次觀看</span>
              <span className="mx-1">•</span>
              <span>{video.postedAt}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto">
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full">
                <MoreHorizontal className="w-5 h-5 text-white" />
            </button>
        </div>
      </div>
    </div>
  );
};

// 4. Video Player 元件 (重點)
const VideoPlayerPage = ({ video, relatedVideos, onVideoSelect }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const videoRef = useRef(null);

  // Auto-play when video changes
  useEffect(() => {
      if(videoRef.current) {
          videoRef.current.load();
          videoRef.current.play().catch(e => console.log("Autoplay prevented"));
          setIsPlaying(true);
      }
      window.scrollTo(0,0);
  }, [video]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
      if(videoRef.current) {
          const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          setProgress(progress);
      }
  };

  const handleVolumeChange = (e) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if(videoRef.current) videoRef.current.volume = val;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-12 py-6 bg-[#0f0f0f] min-h-screen w-full justify-center">

      {/* Left Column: Player & Info */}
      <div className="w-full lg:w-[850px] xl:w-[950px] flex-shrink-0">

        {/* Player Container with Ambient Mode */}
        <div className="relative w-full aspect-video bg-black rounded-xl shadow-2xl group mb-4 select-none">
            {/* Ambient Glow Background */}
            <div
                className="absolute -inset-1 bg-gradient-to-b from-purple-900/30 to-blue-900/30 blur-3xl opacity-50 -z-10"
                style={{ backgroundImage: `url(${video.thumbnail})`, backgroundSize: 'cover', filter: 'blur(60px) brightness(0.6)' }}
            ></div>

            <video
                ref={videoRef}
                className="w-full h-full rounded-xl object-contain"
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                poster={video.thumbnail}
                src={video.videoUrl}
            />

            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer relative group/progress">
                    <div className="absolute top-0 left-0 h-full bg-red-600 rounded-full" style={{width: `${progress}%`}}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 -ml-1.5 w-3 h-3 bg-red-600 rounded-full scale-0 group-hover/progress:scale-100 transition-transform" style={{left: `${progress}%`}}></div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-gray-200">
                            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                        </button>
                        <button className="text-white hover:text-gray-200">
                            <SkipForward className="w-6 h-6 fill-white" />
                        </button>
                        <div className="flex items-center gap-2 group/volume">
                            <button className="text-white">
                                {volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <input
                                type="range" min="0" max="1" step="0.1" value={volume}
                                onChange={handleVolumeChange}
                                className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 accent-white rounded-full"
                            />
                        </div>
                        <span className="text-white text-sm font-medium">0:00 / {video.duration}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-white hover:text-gray-200"><Maximize className="w-6 h-6" /></button>
                    </div>
                </div>
            </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-xl font-bold mb-3">{video.title}</h1>

        {/* Channel Info & Actions Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 min-w-fit">
                <img src={video.channelAvatar} alt="" className="w-10 h-10 rounded-full cursor-pointer" />
                <div className="flex flex-col">
                    <span className="text-white font-bold text-base cursor-pointer">{video.channelName}</span>
                    <span className="text-gray-400 text-xs">125萬位訂閱者</span>
                </div>
                <button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`ml-4 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isSubscribed ? 'bg-[#272727] text-white hover:bg-[#3f3f3f]' : 'bg-white text-black hover:bg-gray-200'}`}
                >
                    {isSubscribed ? '已訂閱' : '訂閱'}
                </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                {/* Like / Dislike Pill */}
                <div className="flex items-center bg-[#272727] rounded-full h-9">
                    <button className="flex items-center gap-2 px-3 hover:bg-[#3f3f3f] rounded-l-full h-full border-r border-white/10 transition-colors">
                        <ThumbsUp className="w-5 h-5 text-white" />
                        <span className="text-white text-sm font-medium">1.5萬</span>
                    </button>
                    <button className="px-3 hover:bg-[#3f3f3f] rounded-r-full h-full transition-colors">
                        <ThumbsDown className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Share Pill */}
                <button className="flex items-center gap-2 px-4 h-9 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-white text-sm font-medium transition-colors whitespace-nowrap">
                    <Share2 className="w-5 h-5" />
                    分享
                </button>

                {/* Download Pill (Hidden on small screens) */}
                <button className="hidden sm:flex items-center gap-2 px-4 h-9 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-white text-sm font-medium transition-colors whitespace-nowrap">
                    <Download className="w-5 h-5" />
                    下載
                </button>

                <button className="flex items-center justify-center w-9 h-9 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Description Box */}
        <div className="bg-[#272727] rounded-xl p-3 text-white text-sm mb-6 hover:bg-[#3f3f3f] transition-colors cursor-pointer group">
            <div className="font-bold mb-1">{video.views}次觀看 • {video.postedAt}</div>
            <p className="whitespace-pre-line line-clamp-2 group-hover:line-clamp-none">
                {video.description}
            </p>
            <span className="font-bold mt-2 block text-gray-300">...更多內容</span>
        </div>

        {/* Comments Section */}
        <div className="hidden md:block">
            <div className="flex items-center gap-8 mb-6">
                <h3 className="text-white text-xl font-bold">3 則留言</h3>
                <div className="flex items-center gap-2 text-white font-medium cursor-pointer">
                    <ListVideo className="w-5 h-5" />
                    排序依據
                </div>
            </div>

            {/* Add Comment Input */}
            <div className="flex gap-4 mb-8">
                <img src={CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="新增留言..."
                        className="w-full bg-transparent border-b border-white/20 text-white pb-1 outline-none focus:border-white transition-colors"
                    />
                </div>
            </div>

            {/* Comment List */}
            <div className="flex flex-col gap-6">
                {MOCK_COMMENTS.map((comment, idx) => (
                    <div key={idx} className="flex gap-4">
                        <img src={comment.avatar} alt="" className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-semibold">{comment.user}</span>
                                <span className="text-gray-400 text-xs">{comment.time}</span>
                            </div>
                            <p className="text-white text-sm">{comment.text}</p>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 cursor-pointer">
                                    <ThumbsUp className="w-4 h-4 text-white hover:text-gray-300" />
                                    <span className="text-gray-400 text-xs">{comment.likes}</span>
                                </div>
                                <ThumbsDown className="w-4 h-4 text-white hover:text-gray-300 cursor-pointer" />
                                <span className="text-white text-xs font-medium hover:bg-[#3f3f3f] px-2 py-1 rounded-full cursor-pointer">回覆</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Column: Up Next */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0">
        {/* Filter chips for related videos */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
            {["全部", "相關內容", "最近上傳"].map((filter, idx) => (
                <button key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${idx === 0 ? 'bg-white text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}>
                    {filter}
                </button>
            ))}
        </div>

        <div className="flex flex-col gap-2">
            {relatedVideos.map((vid) => (
                <div key={vid.id} className="flex gap-2 cursor-pointer group" onClick={() => onVideoSelect(vid)}>
                    <div className="relative w-40 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                        <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{vid.duration}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h4 className="text-white text-sm font-semibold line-clamp-2 leading-tight">{vid.title}</h4>
                        <div className="text-gray-400 text-xs">
                            <div>{vid.channelName}</div>
                            <div>{vid.views}次觀看 • {vid.postedAt}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

// --- 主要 App 元件 ---

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'watch'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState("全部");

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setCurrentView('watch');
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedVideo(null);
    window.scrollTo(0, 0);
  };

  // 根據當前選擇的影片過濾推薦列表（不顯示當前影片）
  const relatedVideos = selectedVideo
    ? MOCK_VIDEOS.filter(v => v.id !== selectedVideo.id)
    : [];

  return (
    <div className="bg-[#0f0f0f] min-h-screen font-sans text-white">
      {/* 固定 Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        {/* 側邊欄 (在 Watch 模式下通常是隱藏或覆蓋式的，這裡為了 MVP 簡化，Home 模式下顯示) */}
        {currentView === 'home' && (
            <Sidebar isOpen={isSidebarOpen} setCategory={setActiveCategory} />
        )}

        {/* Watch 模式下也可能需要一個 mini sidebar 或者完全隱藏，這裡我們在 watch 模式隱藏側邊欄以獲得更大空間 */}
        {currentView === 'watch' && (
             <div className="hidden xl:block fixed left-0 top-14 bottom-0 z-20 bg-[#0f0f0f]">
                 {/* 可以在這裡放一個 Mini Sidebar 如果需要 */}
             </div>
        )}

        {/* 主內容區域 */}
        <main className={`flex-1 bg-[#0f0f0f] w-full ${currentView === 'home' ? 'p-4 md:p-6' : ''}`}>

          {currentView === 'home' && (
            <>
              {/* Categories Filter Bar */}
              <div className="sticky top-14 z-10 bg-[#0f0f0f]/95 backdrop-blur-sm pb-4 -mt-2 mb-4 flex gap-3 overflow-x-auto no-scrollbar w-full">
                {CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-white text-black' : 'bg-[#272727] text-white hover:bg-[#3f3f3f]'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Video Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8">
                {MOCK_VIDEOS.map((video) => (
                  <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
                ))}
                {/* 重複一些數據以填滿網格 */}
                {MOCK_VIDEOS.map((video) => (
                   <VideoCard key={`${video.id}_dup`} video={{...video, id: `${video.id}_dup`}} onClick={handleVideoClick} />
                ))}
              </div>
            </>
          )}

          {currentView === 'watch' && selectedVideo && (
            <div className="w-full h-full">
                 {/* Back button for mobile comfort only usually, but YouTube web uses logo to go back */}
                 <VideoPlayerPage
                    video={selectedVideo}
                    relatedVideos={relatedVideos}
                    onVideoSelect={handleVideoClick}
                 />
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
