import { useState } from 'react';
import { Star, Crown, Diamond, User, DollarSign, Heart, ChevronDown, Filter, Download, ArrowRight, Zap, Target, Send, Calendar, Gift, AlertTriangle, ShieldCheck, PlayCircle, Lock, LayoutGrid, Layers, Activity, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- EXACT MOCK DATA MATCHING REFERENCE ---
const overviewData = [
  { name: 'Apr 21', creators: 1200, fans: 1800, rollers: 2500, prospects: 3000 },
  { name: 'Apr 28', creators: 1350, fans: 1950, rollers: 2600, prospects: 3200 },
  { name: 'May 5',  creators: 1300, fans: 2100, rollers: 2750, prospects: 3100 },
  { name: 'May 12', creators: 1450, fans: 2200, rollers: 2900, prospects: 3300 },
  { name: 'May 19', creators: 1560, fans: 2341, rollers: 3100, prospects: 3500 },
];

const revenueTrendData = [
  { name: 'Apr 21', rev: 120000 }, { name: 'Apr 23', rev: 150000 }, { name: 'Apr 25', rev: 220000 },
  { name: 'Apr 28', rev: 180000 }, { name: 'Apr 30', rev: 280000 }, { name: 'May 3', rev: 350000 },
  { name: 'May 5', rev: 450000 }, { name: 'May 8', rev: 420000 }, { name: 'May 10', rev: 480000 },
  { name: 'May 12', rev: 520000 }, { name: 'May 15', rev: 590000 }, { name: 'May 17', rev: 610000 },
  { name: 'May 19', rev: 683420 }
];

const highRollerActivity = [
  { name: 'ChrisDiamond', amount: '$12,450', time: '2m ago', avatar: 'https://i.pravatar.cc/150?u=c' },
  { name: 'KingJames', amount: '$9,870', time: '5m ago', avatar: 'https://i.pravatar.cc/150?u=k' },
  { name: 'AlexStar', amount: '$8,230', time: '12m ago', avatar: 'https://i.pravatar.cc/150?u=a' },
  { name: 'LoyalFan88', amount: '$7,560', time: '15m ago', avatar: 'https://i.pravatar.cc/150?u=l' },
  { name: 'MrExclusive', amount: '$6,840', time: '18m ago', avatar: 'https://i.pravatar.cc/150?u=m' }
];

const topCreators = [
  { id: 1, name: 'Luna Starr', rev: '$68,450', fans: '1.2K', growth: '+ 24.5%', avatar: 'https://i.pravatar.cc/150?u=luna' },
  { id: 2, name: 'Mia Luxe', rev: '$47,890', fans: '987', growth: '+ 18.3%', avatar: 'https://i.pravatar.cc/150?u=mia' },
  { id: 3, name: 'Chloe Vibes', rev: '$43,210', fans: '876', growth: '+ 12.1%', avatar: 'https://i.pravatar.cc/150?u=chloe' },
  { id: 4, name: 'Ava Monroe', rev: '$34,550', fans: '654', growth: '+ 9.8%', avatar: 'https://i.pravatar.cc/150?u=ava' },
  { id: 5, name: 'Zara Wild', rev: '$28,760', fans: '543', growth: '+ 7.6%', avatar: 'https://i.pravatar.cc/150?u=zara' }
];

const topFans = [
  { id: 1, name: 'ChrisDiamond', spent: '$12,450', trans: '89', eng: '95%', avatar: 'https://i.pravatar.cc/150?u=c' },
  { id: 2, name: 'KingJames', spent: '$9,870', trans: '58', eng: '92%', avatar: 'https://i.pravatar.cc/150?u=k' },
  { id: 3, name: 'AlexStar', spent: '$8,230', trans: '42', eng: '91%', avatar: 'https://i.pravatar.cc/150?u=a' },
  { id: 4, name: 'LoyalFan88', spent: '$7,560', trans: '36', eng: '89%', avatar: 'https://i.pravatar.cc/150?u=l' },
  { id: 5, name: 'MrExclusive', spent: '$6,840', trans: '31', eng: '87%', avatar: 'https://i.pravatar.cc/150?u=m' }
];

const highRollersList = [
  { id: 1, name: 'ChrisDiamond', spent: '$12,450', freq: '24', seen: '2m ago', avatar: 'https://i.pravatar.cc/150?u=c' },
  { id: 2, name: 'KingJames', spent: '$9,870', freq: '18', seen: '5m ago', avatar: 'https://i.pravatar.cc/150?u=k' },
  { id: 3, name: 'AlexStar', spent: '$8,230', freq: '15', seen: '12m ago', avatar: 'https://i.pravatar.cc/150?u=a' },
  { id: 4, name: 'LoyalFan88', spent: '$7,560', freq: '12', seen: '15m ago', avatar: 'https://i.pravatar.cc/150?u=l' },
  { id: 5, name: 'MrExclusive', spent: '$6,840', freq: '10', seen: '18m ago', avatar: 'https://i.pravatar.cc/150?u=m' }
];

const alerts = [
  { icon: <AlertTriangle size={12} className="text-red-500" />, title: 'High Roller Inactive', desc: 'KingJames inactive for 3 days', time: '10m ago', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { icon: <AlertTriangle size={12} className="text-yellow-500" />, title: 'VIP Creator Inactive', desc: 'Zara Wild inactive for 2 days', time: '25m ago', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { icon: <AlertTriangle size={12} className="text-yellow-500" />, title: 'VIP Fan At Risk', desc: 'AlexStar engagement dropping', time: '35m ago', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { icon: <CheckCircle size={12} className="text-green-500" />, title: 'Big Spender Alert', desc: 'ChrisDiamond spent $5K+ today', time: '45m ago', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { icon: <Zap size={12} className="text-blue-500" />, title: 'VIP Prospect Hot', desc: 'New VIP prospect showing high potential', time: '1h ago', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
];

const revSourceData = [
  { name: 'Tips', value: 194230, pct: '28.4%', color: '#ec4899' },
  { name: 'Subscriptions', value: 156780, pct: '22.9%', color: '#3b82f6' },
  { name: 'PPV', value: 98450, pct: '14.4%', color: '#10b981' },
  { name: 'Truth or Dare', value: 87320, pct: '12.8%', color: '#f59e0b' },
  { name: 'Suga 4 U', value: 65410, pct: '9.6%', color: '#eab308' },
  { name: 'Bar Lounge', value: 45230, pct: '6.6%', color: '#ef4444' },
  { name: 'Others', value: 36000, pct: '5.3%', color: '#8b5cf6' }
];

const engTierData = [
  { name: 'Diamond', val: '89.2%', grw: '↑ 8.1%', color: '#3b82f6' },
  { name: 'Platinum', val: '82.1%', grw: '↑ 6.7%', color: '#00f0ff' },
  { name: 'Gold', val: '75.3%', grw: '↑ 5.4%', color: '#f59e0b' },
  { name: 'Silver', val: '69.8%', grw: '↑ 4.2%', color: '#9ca3af' },
  { name: 'Bronze', val: '62.4%', grw: '↑ 3.1%', color: '#d97706' },
];

const engDonut = [
  { name: 'Diamond', value: 35, color: '#3b82f6' },
  { name: 'Platinum', value: 25, color: '#00f0ff' },
  { name: 'Gold', value: 20, color: '#f59e0b' },
  { name: 'Silver', value: 10, color: '#9ca3af' },
  { name: 'Bronze', value: 10, color: '#d97706' },
];

const actions = [
  { icon: <User size={14} className="text-red-500" />, title: 'Engage inactive high rollers', btn: 'View', color: 'bg-red-500/10 border-red-500/30' },
  { icon: <Heart size={14} className="text-blue-500" />, title: 'Follow up with VIP prospects', btn: 'View', color: 'bg-blue-500/10 border-blue-500/30' },
  { icon: <Gift size={14} className="text-yellow-500" />, title: 'Send VIP creator incentives', btn: 'Create Campaign', color: 'bg-yellow-500/10 border-yellow-500/30' },
  { icon: <Calendar size={14} className="text-green-500" />, title: 'Schedule VIP check-ins', btn: 'View', color: 'bg-green-500/10 border-green-500/30' },
  { icon: <Star size={14} className="text-purple-500" />, title: 'Personalized offers for top spenders', btn: 'Create Offer', color: 'bg-purple-500/10 border-purple-500/30' }
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0E14] border border-gray-700/80 p-3 rounded-lg shadow-xl shadow-black/50 text-[10px]">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300 font-medium">{entry.name}:</span>
            <span className="text-white font-bold">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function VIPCenter() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-[#05070D] font-sans pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            VIP Center <span className="text-[11px] font-normal text-gray-400 mt-1">Manage and engage VIP creators, fans, and high value prospects</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-[#0D111B] border border-gray-800 rounded-md py-1.5 pl-3 pr-8 text-[11px] font-semibold text-gray-300 focus:outline-none cursor-pointer">
              <option>All Departments</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none bg-[#0D111B] border border-gray-800 rounded-md py-1.5 pl-3 pr-8 text-[11px] font-semibold text-gray-300 focus:outline-none cursor-pointer">
              <option>Last 30 Days</option>
            </select>
            <Calendar size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D111B] border border-gray-800 rounded-md text-[11px] font-semibold text-gray-300 hover:text-white transition-colors">
            <Filter size={12} /> Filters
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0D111B] border border-gray-800 rounded-md text-[11px] font-semibold text-gray-300 hover:text-white transition-colors">
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-6 border-b border-gray-800/80 mb-6 overflow-x-auto no-scrollbar">
        {['Overview', 'VIP Creators', 'VIP Fans', 'VIP Prospects', 'High Rollers', 'Top Earners', 'Watchlist', 'Engagement', 'Analytics'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[11px] font-bold whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />}
          </button>
        ))}
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {[
          { label: 'VIP Creators', val: '156', grw: '↑ 12.4% vs last 30 days', icon: <Star size={16} />, color: 'text-purple-500', bg: 'bg-purple-500/10', glow: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]', border: 'border-purple-500/30' },
          { label: 'VIP Fans', val: '2,341', grw: '↑ 18.7% vs last 30 days', icon: <Crown size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10', glow: 'hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]', border: 'border-blue-500/30' },
          { label: 'High Rollers', val: '587', grw: '↑ 15.6% vs last 30 days', icon: <Diamond size={16} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', glow: 'hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]', border: 'border-yellow-500/30' },
          { label: 'VIP Prospects', val: '1,247', grw: '↑ 20.1% vs last 30 days', icon: <User size={16} />, color: 'text-[#00f0ff]', bg: 'bg-[#00f0ff]/10', glow: 'hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]', border: 'border-[#00f0ff]/30' },
          { label: 'Total VIP Revenue (MTD)', val: '$683,420', grw: '↑ 21.8% vs last 30 days', icon: <DollarSign size={16} />, color: 'text-green-500', bg: 'bg-green-500/10', glow: 'hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]', border: 'border-green-500/30' },
          { label: 'VIP Engagement Rate', val: '78.6%', grw: '↑ 6.3% vs last 30 days', icon: <Heart size={16} />, color: 'text-pink-500', bg: 'bg-pink-500/10', glow: 'hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]', border: 'border-pink-500/30' }
        ].map((k, i) => (
          <div key={i} className={`bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 ${k.glow}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${k.bg} ${k.border} ${k.color}`}>
              {k.icon}
            </div>
            <div>
              <div className="text-[10px] font-semibold text-gray-400">{k.label}</div>
              <div className="text-lg font-bold text-white mt-0.5 leading-tight">{k.val}</div>
              <div className="text-[8px] font-semibold text-green-500 mt-1">{k.grw}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 2: CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        {/* Overview Chart */}
        <div className="lg:col-span-5 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <h3 className="text-[11px] font-bold text-white mb-4">VIP Overview</h3>
          <div className="flex items-center gap-4 mb-4 text-[9px] font-semibold justify-center">
            <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-purple-500" /> VIP Creators</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-blue-500" /> VIP Fans</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-yellow-500" /> High Rollers</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-[#00f0ff]" /> VIP Prospects</span>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1B2332" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} tickFormatter={(val) => `${val/1000}K`} dx={-10} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="creators" stroke="#a855f7" strokeWidth={2} dot={{ r: 3, fill: '#0D111B', stroke: '#a855f7', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="fans" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#0D111B', stroke: '#3b82f6', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="rollers" stroke="#eab308" strokeWidth={2} dot={{ r: 3, fill: '#0D111B', stroke: '#eab308', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="prospects" stroke="#00f0ff" strokeWidth={2} dot={{ r: 3, fill: '#0D111B', stroke: '#00f0ff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-4 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-[11px] font-bold text-white mb-1">VIP Revenue Trend</h3>
              <div className="text-xl font-bold text-white">$683,420</div>
              <div className="text-[9px] font-semibold text-green-500 mt-1">↑ 21.8% vs last 30 days</div>
            </div>
            <select className="bg-transparent text-[10px] font-semibold text-gray-500 focus:outline-none appearance-none cursor-pointer">
              <option>Last 30 Days ▾</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0 -ml-2 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1B2332" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} dy={10} minTickGap={20} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} tickFormatter={(val) => `$${val/1000}K`} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rev" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Roller Activity */}
        <div className="lg:col-span-3 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold text-white">High Roller Activity</h3>
            <button className="text-[10px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
            {highRollerActivity.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={a.avatar} alt={a.name} className="w-7 h-7 rounded-full border border-gray-700/80" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-white truncate">{a.name}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">{a.time}</div>
                </div>
                <div className="text-[11px] font-bold text-green-500">{a.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 3: TABLES & ALERTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Top VIP Creators */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[260px]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-[11px] font-bold text-white">Top VIP Creators <span className="text-gray-500 font-normal">(MTD)</span></h3>
             <button className="text-[10px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
           </div>
           <div className="flex-1 overflow-auto custom-scrollbar -mx-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] font-semibold text-gray-500 border-b border-gray-800/80">
                    <th className="pb-2 pl-2">Creator</th>
                    <th className="pb-2">Revenue</th>
                    <th className="pb-2">Fans</th>
                    <th className="pb-2 pr-2 text-right">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {topCreators.map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 pl-2 flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-bold w-3">{c.id}</span>
                        <img src={c.avatar} className="w-5 h-5 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-300 truncate max-w-[60px]">{c.name}</span>
                      </td>
                      <td className="py-2 text-[10px] text-gray-300 font-semibold">{c.rev}</td>
                      <td className="py-2 text-[10px] text-gray-400">{c.fans}</td>
                      <td className="py-2 pr-2 text-[10px] font-bold text-green-500 text-right">{c.growth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Top VIP Fans */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[260px]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-[11px] font-bold text-white">Top VIP Fans <span className="text-gray-500 font-normal">(MTD)</span></h3>
             <button className="text-[10px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
           </div>
           <div className="flex-1 overflow-auto custom-scrollbar -mx-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] font-semibold text-gray-500 border-b border-gray-800/80">
                    <th className="pb-2 pl-2">Fan</th>
                    <th className="pb-2">Spent</th>
                    <th className="pb-2">Transactions</th>
                    <th className="pb-2 pr-2 text-right">Engagement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {topFans.map(f => (
                    <tr key={f.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 pl-2 flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-bold w-3">{f.id}</span>
                        <img src={f.avatar} className="w-5 h-5 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-300 truncate max-w-[60px]">{f.name}</span>
                      </td>
                      <td className="py-2 text-[10px] text-gray-300 font-semibold">{f.spent}</td>
                      <td className="py-2 text-[10px] text-gray-400 text-center">{f.trans}</td>
                      <td className="py-2 pr-2 text-[10px] font-bold text-green-500 text-right">{f.eng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* High Rollers List */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[260px]">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-[11px] font-bold text-white">High Rollers <span className="text-gray-500 font-normal">(MTD)</span></h3>
             <button className="text-[10px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
           </div>
           <div className="flex-1 overflow-auto custom-scrollbar -mx-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[9px] font-semibold text-gray-500 border-b border-gray-800/80">
                    <th className="pb-2 pl-2">High Roller</th>
                    <th className="pb-2">Spent</th>
                    <th className="pb-2">Frequency</th>
                    <th className="pb-2 pr-2 text-right">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {highRollersList.map(h => (
                    <tr key={h.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2 pl-2 flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-bold w-3">{h.id}</span>
                        <img src={h.avatar} className="w-5 h-5 rounded-full" />
                        <span className="text-[10px] font-bold text-gray-300 truncate max-w-[60px]">{h.name}</span>
                      </td>
                      <td className="py-2 text-[10px] text-gray-300 font-semibold">{h.spent}</td>
                      <td className="py-2 text-[10px] text-gray-400 text-center">{h.freq}</td>
                      <td className="py-2 pr-2 text-[9px] text-gray-400 text-right">{h.seen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* VIP Alerts */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[260px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold text-white">VIP Alerts</h3>
            <button className="text-[10px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${a.bg} ${a.border}`}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-[10px] font-bold text-gray-300 truncate">{a.title}</h4>
                    <span className="text-[8px] text-gray-500 whitespace-nowrap pt-0.5">{a.time}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 line-clamp-1 mt-0.5">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4: BOTTOM CHARTS & ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* VIP Revenue by Source */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <h3 className="text-[11px] font-bold text-white mb-4">VIP Revenue by Source <span className="text-gray-500 font-normal">(MTD)</span></h3>
          <div className="flex flex-col xl:flex-row items-center gap-4 flex-1">
             <div className="relative w-[120px] h-[120px] shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={revSourceData} innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                     {revSourceData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[13px] font-bold text-white leading-tight">$683,420</div>
                  <div className="text-[8px] text-gray-500 font-semibold">Total Revenue</div>
               </div>
             </div>
             <div className="flex-1 w-full space-y-1.5 overflow-y-auto custom-scrollbar max-h-[140px] pr-1">
                {revSourceData.map((r, i) => (
                  <div key={i} className="flex items-center text-[9px] gap-2">
                    <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: r.color }} />
                    <span className="text-gray-400 flex-1 truncate">{r.name}</span>
                    <span className="text-white font-semibold">${(r.value/1000).toFixed(1)}K</span>
                    <span className="text-gray-500 w-8 text-right">{r.pct}</span>
                  </div>
                ))}
             </div>
          </div>
          <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400 mt-2 text-center w-full">View full report →</button>
        </div>

        {/* VIP Engagement by Tier */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold text-white">VIP Engagement by Tier</h3>
            <button className="text-[10px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
          </div>
          <div className="flex flex-col xl:flex-row items-center gap-4 flex-1">
             <div className="relative w-[120px] h-[120px] shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={engDonut} innerRadius={40} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                     {engDonut.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[16px] font-bold text-white leading-tight">78.6%</div>
                  <div className="text-[8px] text-gray-500 font-semibold text-center leading-tight">Engagement Rate</div>
               </div>
             </div>
             <div className="flex-1 w-full space-y-2 overflow-y-auto custom-scrollbar max-h-[140px] pr-1">
                {engTierData.map((e, i) => (
                  <div key={i} className="flex items-center text-[9px] gap-2">
                    <div className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: e.color }} />
                    <span className="text-gray-400 flex-1 truncate">{e.name}</span>
                    <span className="text-white font-semibold">{e.val}</span>
                    <span className="text-green-500 font-semibold text-right">{e.grw}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* VIP Pipeline */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <h3 className="text-[11px] font-bold text-white mb-4">VIP Pipeline</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-2">
            
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500"><Star size={14} /></div>
              <div className="flex-1"><h4 className="text-[10px] font-bold text-gray-300">New VIP Prospects</h4></div>
              <div className="text-[11px] font-bold text-white">1,247</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500"><ShieldCheck size={14} /></div>
              <div className="flex-1"><h4 className="text-[10px] font-bold text-gray-300">Engaged Prospects</h4></div>
              <div className="text-[11px] font-bold text-white">487</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500"><Crown size={14} /></div>
              <div className="flex-1"><h4 className="text-[10px] font-bold text-gray-300">VIP Candidates</h4></div>
              <div className="text-[11px] font-bold text-white">189</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500"><Lock size={14} /></div>
              <div className="flex-1"><h4 className="text-[10px] font-bold text-gray-300">VIP Onboarding</h4></div>
              <div className="text-[11px] font-bold text-white">76</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500"><CheckCircle size={14} /></div>
              <div className="flex-1"><h4 className="text-[10px] font-bold text-gray-300">Active VIPs</h4></div>
              <div className="text-[11px] font-bold text-white">2,497</div>
            </div>

          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[280px]">
          <h3 className="text-[11px] font-bold text-white mb-4">Recommended Actions</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {actions.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/30 transition-colors border border-transparent hover:border-gray-800">
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${act.color}`}>
                    {act.icon}
                  </div>
                  <span className="text-[10px] font-semibold text-gray-300 truncate">{act.title}</span>
                </div>
                <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400 whitespace-nowrap shrink-0">{act.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}
