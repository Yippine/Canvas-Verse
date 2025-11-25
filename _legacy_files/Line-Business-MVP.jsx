import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Send,
  Menu as MenuIcon,
  Settings,
  Users,
  BarChart3,
  Bell,
  ChevronDown,
  Search,
  Image as ImageIcon,
  Smile,
  Paperclip,
  MoreHorizontal,
  CheckCircle2,
  Plus
} from 'lucide-react';

// --- Mock Data & Constants ---
const LINE_GREEN = "bg-[#06C755]";
const LINE_TEXT_GREEN = "text-[#06C755]";
const LINE_BORDER_GREEN = "border-[#06C755]";

const MOCK_FRIENDS = 12580;
const MOCK_TARGET_REACH = 8430;
const MOCK_CHATS = [
  { id: 1, name: "陳小明", lastMsg: "請問這個還有貨嗎？", time: "10:30", unread: 2, tags: ["VIP", "待回覆"] },
  { id: 2, name: "王美美", lastMsg: "謝謝，我收到了！", time: "昨天", unread: 0, tags: ["已完成"] },
  { id: 3, name: "李大華", lastMsg: "[貼圖]", time: "昨天", unread: 0, tags: [] },
];

// --- Components ---

// 1. Sidebar Navigation
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: '主頁', icon: <LayoutDashboard size={20} /> },
    { id: 'notification', label: '通知', icon: <Bell size={20} /> },
    { id: 'insight', label: '分析', icon: <BarChart3 size={20} /> },
    { id: 'broadcast', label: '群發訊息', icon: <Send size={20} /> },
    { id: 'chat', label: '聊天', icon: <MessageSquare size={20} /> },
    { id: 'richmenu', label: '圖文選單', icon: <MenuIcon size={20} /> },
    { id: 'friends', label: '好友', icon: <Users size={20} /> },
    { id: 'settings', label: '設定', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#2E3338] text-white flex flex-col h-screen flex-shrink-0 font-sans">
      <div className="p-4 flex items-center border-b border-gray-700">
        <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-[#06C755] font-bold text-xl mr-3">
          L
        </div>
        <div>
          <h1 className="font-bold text-sm">LINE Business</h1>
          <span className="text-xs text-gray-400">管理後台</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-sm transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#06C755] text-white font-bold'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
        &copy; LY Corporation
      </div>
    </div>
  );
};

// 2. Top Header
const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-10">
      <div className="flex items-center">
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-lg">我的示範商店</span>
          <span className="text-xs text-gray-500">@example_id • 輕用量方案</span>
        </div>
        <span className="ml-3 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-300">未認證帳號</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-sm text-gray-600 hover:text-[#06C755]">使用指南</button>
        <button className="text-sm text-gray-600 hover:text-[#06C755]">常見問題</button>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
          A
        </div>
      </div>
    </header>
  );
};

// 3. Dashboard View
const Dashboard = () => {
  return (
    <div className="p-8 space-y-6 bg-[#F5F6F7] min-h-full">
      <h2 className="text-2xl font-bold text-gray-800">主頁</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">好友人數</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-800">{MOCK_FRIENDS.toLocaleString()}</span>
            <span className="text-xs text-green-600 font-bold flex items-center">
              +12 <span className="text-gray-400 ml-1">較昨日</span>
            </span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">目標觸及人數</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-800">{MOCK_TARGET_REACH.toLocaleString()}</span>
            <span className="text-xs text-gray-400">有效好友</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium mb-2">本月訊息額度</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-gray-800">150<span className="text-lg text-gray-400 font-normal"> / 500</span></span>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="bg-[#06C755] h-full w-[30%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">最近的群發訊息</h3>
            <button className="text-[#06C755] text-sm font-medium hover:underline">建立新訊息</button>
          </div>
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3">發送時間</th>
                <th className="px-4 py-3">內容摘要</th>
                <th className="px-4 py-3">發送數</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">已發送</span></td>
                <td className="px-4 py-3">2025/05/20 10:00</td>
                <td className="px-4 py-3">🎉 週末限定優惠開跑！</td>
                <td className="px-4 py-3">8,420</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">草稿</span></td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3">新品上市預告</td>
                <td className="px-4 py-3">-</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4">官方公告</h3>
          <ul className="space-y-4">
            <li className="text-sm border-l-2 border-[#06C755] pl-3">
              <a href="#" className="hover:underline text-gray-700 block mb-1">【重要】系統維護通知</a>
              <span className="text-xs text-gray-400">2025/05/18</span>
            </li>
            <li className="text-sm border-l-2 border-transparent pl-3">
              <a href="#" className="hover:underline text-gray-700 block mb-1">新功能：AI 自動文案生成上線</a>
              <span className="text-xs text-gray-400">2025/05/15</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 4. Broadcast View
const BroadcastPage = () => {
  return (
    <div className="p-8 bg-[#F5F6F7] min-h-full flex flex-col lg:flex-row gap-8">
      {/* Left: Editor */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">建立群發訊息</h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">傳送對象</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 border p-3 rounded cursor-pointer bg-green-50 border-green-500">
                <input type="radio" name="target" defaultChecked className="text-green-600 focus:ring-green-500" />
                <span className="text-sm font-medium">所有好友</span>
              </label>
              <label className="flex items-center space-x-2 border p-3 rounded cursor-pointer hover:bg-gray-50">
                <input type="radio" name="target" className="text-green-600 focus:ring-green-500" />
                <span className="text-sm font-medium">屬性篩選 (分眾)</span>
              </label>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">傳送時間</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="time" defaultChecked className="text-green-600" />
                <span className="text-sm">立即傳送</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="time" className="text-green-600" />
                <span className="text-sm">預約傳送</span>
              </label>
            </div>
          </div>

          {/* Content Editor */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">訊息內容 (1/3)</label>
              <button className="text-red-500 text-xs hover:underline">刪除</button>
            </div>
            <div className="bg-white border border-gray-300 rounded p-3">
              <div className="flex gap-2 mb-2 border-b pb-2">
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><Smile size={18} /></button>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500"><ImageIcon size={18} /></button>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-500 font-bold text-xs border border-gray-300 px-2">暱稱</button>
              </div>
              <textarea
                className="w-full h-32 outline-none resize-none text-sm"
                placeholder="請輸入訊息內容..."
                defaultValue="親愛的顧客您好，感謝您一直以來的支持！我們將於本週末舉辦限時特賣，全館85折起，千萬別錯過！"
              ></textarea>
              <div className="text-right text-xs text-gray-400 mt-1">48 / 500</div>
            </div>
            <button className="mt-4 w-full py-2 border border-dashed border-gray-400 text-gray-500 rounded hover:bg-gray-100 text-sm flex items-center justify-center">
              <Plus size={16} className="mr-1" /> 新增訊息框
            </button>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex justify-center space-x-4">
            <button className="px-6 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">儲存草稿</button>
            <button className="px-8 py-2 bg-[#06C755] text-white rounded font-bold hover:bg-green-600 shadow-md">傳送</button>
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="hidden lg:block w-80 flex-shrink-0">
        <div className="sticky top-8">
          <h3 className="text-sm font-bold text-gray-600 mb-3 text-center">預覽畫面</h3>
          <div className="bg-black rounded-[2.5rem] p-3 shadow-xl border-4 border-gray-800 h-[600px] w-full overflow-hidden relative bg-white">
             {/* Phone Header */}
             <div className="bg-[#242A36] text-white p-3 pt-8 flex items-center justify-between text-sm rounded-t-2xl">
               <span>&lt;</span>
               <span>我的示範商店</span>
               <span>≡</span>
             </div>
             {/* Phone Body */}
             <div className="bg-[#8E99A7] h-full p-3 overflow-y-auto pb-20">
               <div className="flex flex-col space-y-3">
                 <div className="text-xs text-white bg-black/20 self-center px-2 py-0.5 rounded-full mb-2">今天</div>
                 <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex-shrink-0"></div>
                    <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm max-w-[80%]">
                      親愛的顧客您好，感謝您一直以來的支持！我們將於本週末舉辦限時特賣，全館85折起，千萬別錯過！
                    </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Chat Interface
const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(1);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
           <div className="relative">
             <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
             <input type="text" placeholder="搜尋姓名或標籤" className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
           </div>
           <div className="flex mt-3 text-xs space-x-2 overflow-x-auto pb-2">
             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full whitespace-nowrap cursor-pointer">全部</span>
             <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-200">未讀</span>
             <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-200">待回覆</span>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MOCK_CHATS.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${selectedChat === chat.id ? 'bg-[#F0FBF5] border-l-4 border-[#06C755]' : 'border-l-4 border-transparent'}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex-shrink-0 flex items-center justify-center text-gray-500 text-xs">User</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{chat.name}</h4>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.lastMsg}</p>
                <div className="mt-1 flex space-x-1">
                  {chat.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-[10px] rounded">{tag}</span>
                  ))}
                </div>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-[#06C755] rounded-full text-white text-xs flex items-center justify-center ml-2">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#9BBAD6]">
        {/* Chat Header */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">陳小明</h3>
              <div className="flex items-center space-x-1 mt-0.5">
                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                 <span className="text-xs text-gray-500">手動聊天模式</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3 text-gray-500">
            <button title="標記為待處理"><CheckCircle2 size={20} /></button>
            <button title="設定"><Settings size={20} /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {/* System Date */}
           <div className="flex justify-center">
             <span className="bg-black/10 text-white text-xs px-2 py-1 rounded-full">今天</span>
           </div>

           {/* Their Message */}
           <div className="flex items-start">
             <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
             <div className="bg-white p-2 px-3 rounded-xl rounded-tl-none shadow-sm text-sm max-w-[70%] text-gray-800">
               你好，我想請問一下關於上週發布的新產品，目前店內有現貨嗎？我想這週末過去看。
             </div>
             <span className="text-[10px] text-white ml-1 self-end drop-shadow-md">10:28</span>
           </div>

           {/* My Message */}
           <div className="flex items-end justify-end">
             <span className="text-[10px] text-white mr-1 mb-1 drop-shadow-md">已讀 10:30</span>
             <div className="bg-[#85E249] p-2 px-3 rounded-xl rounded-tr-none shadow-sm text-sm max-w-[70%] text-black">
               您好！有的，目前店內還有少量現貨喔。建議您可以先預約時段，我們為您保留商品！
             </div>
           </div>

           {/* Their Message */}
           <div className="flex items-start">
             <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
             <div className="bg-white p-2 px-3 rounded-xl rounded-tl-none shadow-sm text-sm max-w-[70%] text-gray-800">
               好的，請問這個還有貨嗎？
             </div>
             <span className="text-[10px] text-white ml-1 self-end drop-shadow-md">10:30</span>
           </div>
        </div>

        {/* Input Area */}
        <div className="bg-white p-3 border-t border-gray-200">
           <div className="flex items-center space-x-3 mb-2 px-1">
              <button className="text-gray-500 hover:text-gray-700"><Plus size={20} /></button>
              <button className="text-gray-500 hover:text-gray-700"><ImageIcon size={20} /></button>
              <button className="text-gray-500 hover:text-gray-700"><Paperclip size={20} /></button>
              <div className="flex-1"></div>
              <button className="text-gray-500 hover:text-gray-700"><Smile size={20} /></button>
           </div>
           <div className="flex gap-2">
             <textarea className="flex-1 h-10 border border-gray-300 rounded p-2 text-sm resize-none focus:ring-2 focus:ring-green-500 outline-none" placeholder="輸入訊息..."></textarea>
             <button className="bg-[#06C755] text-white px-4 rounded hover:bg-green-600 flex items-center">
               <Send size={18} />
             </button>
           </div>
        </div>
      </div>

      {/* Customer Profile (Right Sidebar) */}
      <div className="w-64 bg-white border-l border-gray-200 p-4 hidden xl:block overflow-y-auto">
         <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <h3 className="font-bold text-gray-800">陳小明</h3>
            <p className="text-xs text-gray-500 mt-1">加入好友：2024/12/01</p>
         </div>

         <div className="space-y-6">
           <div>
             <div className="flex justify-between items-center mb-2">
               <h4 className="text-xs font-bold text-gray-500 uppercase">標籤</h4>
               <button className="text-green-600 text-xs hover:underline">編輯</button>
             </div>
             <div className="flex flex-wrap gap-2">
               <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">VIP</span>
               <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">待回覆</span>
             </div>
           </div>

           <div>
             <div className="flex justify-between items-center mb-2">
               <h4 className="text-xs font-bold text-gray-500 uppercase">記事本</h4>
               <button className="text-green-600 text-xs hover:underline">新增</button>
             </div>
             <div className="bg-yellow-50 p-3 rounded border border-yellow-100 text-xs text-gray-700">
               <p className="mb-1">2025/01/10</p>
               <p>顧客詢問過春季大衣，喜歡卡其色，尺寸 L。</p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

// 6. Rich Menu Page
const RichMenuPage = () => {
  return (
    <div className="p-8 bg-[#F5F6F7] min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">圖文選單</h2>
        <button className="bg-[#06C755] text-white px-4 py-2 rounded font-bold hover:bg-green-600 text-sm">建立新選單</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">使用中</h3>
        <div className="flex items-center p-4 border rounded bg-gray-50">
          <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs mr-4 border">
            [選單圖片預覽]
          </div>
          <div className="flex-1">
             <h4 className="font-bold text-gray-800 mb-1">2025 春季主選單</h4>
             <div className="text-xs text-gray-500 space-y-1">
               <p>期間：2025/03/01 ~ 2025/05/31</p>
               <p>版型：大型 (6格)</p>
             </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">編輯</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 text-red-500">停用</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">選單列表</h3>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">標題</th>
              <th className="px-4 py-3">期間</th>
              <th className="px-4 py-3">狀態</th>
              <th className="px-4 py-3">動作</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
               <td className="px-4 py-3 font-medium text-gray-900">冬季促銷選單</td>
               <td className="px-4 py-3">2024/12/01 ~ 2025/02/28</td>
               <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">已過期</span></td>
               <td className="px-4 py-3"><button className="text-blue-600 hover:underline">複製</button></td>
            </tr>
             <tr className="border-b">
               <td className="px-4 py-3 font-medium text-gray-900">預設一般選單</td>
               <td className="px-4 py-3">無期限</td>
               <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">待機中</span></td>
               <td className="px-4 py-3"><button className="text-blue-600 hover:underline">複製</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. Placeholder Page
const PlaceholderPage = ({ title }) => (
  <div className="p-8 bg-[#F5F6F7] h-full flex flex-col items-center justify-center text-gray-400">
    <Settings size={48} className="mb-4" />
    <h2 className="text-xl font-bold text-gray-600 mb-2">{title}</h2>
    <p>此功能為 MVP 展示範圍外，但已保留架構位置。</p>
  </div>
);

// --- Main App Shell ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard />;
      case 'broadcast': return <BroadcastPage />;
      case 'chat': return <ChatPage />;
      case 'richmenu': return <RichMenuPage />;
      case 'notification': return <PlaceholderPage title="通知中心" />;
      case 'insight': return <PlaceholderPage title="分析報表" />;
      case 'friends': return <PlaceholderPage title="好友管理" />;
      case 'settings': return <PlaceholderPage title="帳號設定" />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6F7] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
