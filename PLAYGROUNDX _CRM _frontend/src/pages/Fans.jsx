import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Crown, UserMinus, AlertTriangle, Search, Filter, Download, Plus, Eye, CheckCircle, MessageCircle, Phone, ChevronRight, Heart, Wallet, MoreHorizontal, MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import CallModal from '../components/modals/CallModal';
import { getAppPath } from '../utils/routing';

const exactMockData = [
  { id: 1, avatar: 'https://i.pravatar.cc/150?u=sarah', name: 'Sarah Thompson', username: '@sarah.t', phone: '+1 202 555 0145', stage: 'VIP Fan', stageNum: 8, healthScore: 850, scoreLabel: 'Very High', language: 'English', flag: '🇺🇸', totalDeposits: 2450, totalSpend: 3890, lastActivityText: '10 min ago', lastActivityAction: 'Joined Room', agent: 'Mike Agent', agentAvatar: 'https://i.pravatar.cc/150?u=mike', status: 'Active Fan', country: 'United States', channel: 'WhatsApp', memberSince: 'Apr 15, 2025' },
  { id: 2, avatar: 'https://i.pravatar.cc/150?u=carlos', name: 'Carlos Ramirez', phone: '+52 55 1234 5678', stage: 'Active Fan', stageNum: 7, healthScore: 620, scoreLabel: 'High', language: 'Spanish', flag: '🇲🇽', totalDeposits: 1200, totalSpend: 2050, lastActivityText: '25 min ago', lastActivityAction: 'Watched Live', agent: 'Luis Agent', agentAvatar: 'https://i.pravatar.cc/150?u=luis', status: 'Active Fan' },
  { id: 3, avatar: 'https://i.pravatar.cc/150?u=sophie', name: 'Sophie Martin', phone: '+33 6 12 34 56 78', stage: 'First Purchase', stageNum: 5, healthScore: 310, scoreLabel: 'Medium', language: 'French', flag: '🇫🇷', totalDeposits: 150, totalSpend: 420, lastActivityText: '45 min ago', lastActivityAction: 'Purchased', agent: 'Emma Agent', agentAvatar: 'https://i.pravatar.cc/150?u=emma', status: 'Active Fan' },
  { id: 4, avatar: 'https://i.pravatar.cc/150?u=ahmed', name: 'Ahmed Al Zayani', phone: '+971 50 123 4567', stage: 'Deposit Pending', stageNum: 4, healthScore: 280, scoreLabel: 'Medium', language: 'Arabic', flag: '🇦🇪', totalDeposits: 0, totalSpend: 0, lastActivityText: '1 hour ago', lastActivityAction: 'Viewed Rooms', agent: 'Omar Agent', agentAvatar: 'https://i.pravatar.cc/150?u=omar', status: 'Pending' },
  { id: 5, avatar: 'https://i.pravatar.cc/150?u=priya', name: 'Priya Patel', phone: '+91 98765 43210', stage: 'Active Fan', stageNum: 6, healthScore: 540, scoreLabel: 'High', language: 'Hindi', flag: '🇮🇳', totalDeposits: 650, totalSpend: 980, lastActivityText: '2 hours ago', lastActivityAction: 'Live Chat', agent: 'Riya Agent', agentAvatar: 'https://i.pravatar.cc/150?u=riya', status: 'Active Fan' },
  { id: 6, avatar: 'https://i.pravatar.cc/150?u=liwei', name: 'Li Wei', phone: '+86 138 1234 5678', stage: 'New Fan', stageNum: 2, healthScore: 120, scoreLabel: 'Low', language: 'Chinese', flag: '🇨🇳', totalDeposits: 0, totalSpend: 0, lastActivityText: '3 hours ago', lastActivityAction: 'Registered', agent: 'Jason Agent', agentAvatar: 'https://i.pravatar.cc/150?u=jason', status: 'New' },
  { id: 7, avatar: 'https://i.pravatar.cc/150?u=kim', name: 'Kim Ji Eun', phone: '+82 10 9876 5432', stage: 'First Deposit', stageNum: 4, healthScore: 360, scoreLabel: 'Medium', language: 'Korean', flag: '🇰🇷', totalDeposits: 100, totalSpend: 180, lastActivityText: '4 hours ago', lastActivityAction: 'First Deposit', agent: 'Hana Agent', agentAvatar: 'https://i.pravatar.cc/150?u=hana', status: 'Active Fan' },
  { id: 8, avatar: 'https://i.pravatar.cc/150?u=joao', name: 'Joao Silva', phone: '+55 11 91234 5678', stage: 'VIP Fan', stageNum: 8, healthScore: 760, scoreLabel: 'High', language: 'Portuguese', flag: '🇧🇷', totalDeposits: 3100, totalSpend: 4250, lastActivityText: '5 hours ago', lastActivityAction: 'Live Room', agent: 'Lucas Agent', agentAvatar: 'https://i.pravatar.cc/150?u=lucas', status: 'Active Fan' }
];

const funnelData = [
  { stage: 'New Fan', value: 344 },
  { stage: 'Contacted', value: 201 },
  { stage: 'Registered', value: 201 },
  { stage: 'First Deposit', value: 146 },
  { stage: 'First Purchase', value: 112 },
  { stage: 'Joined Room', value: 97 },
  { stage: 'Active Fan', value: 88 },
  { stage: 'VIP Fan', value: 48 },
];

const countryData = [
  { name: 'United States', value: 28, count: 216, color: '#8b5cf6' },
  { name: 'India', value: 18, count: 139, color: '#ec4899' },
  { name: 'Brazil', value: 12, count: 92, color: '#3b82f6' },
  { name: 'Mexico', value: 10, count: 77, color: '#eab308' },
  { name: 'Others', value: 32, count: 246, color: '#6b7280' },
];

const depositData = [
  { date: '1', value: 1000 }, { date: '2', value: 1500 }, { date: '3', value: 1200 },
  { date: '4', value: 2000 }, { date: '5', value: 1800 }, { date: '6', value: 2200 }, { date: '7', value: 2450 }
];
const spendData = [
  { date: '1', value: 1200 }, { date: '2', value: 1800 }, { date: '3', value: 1600 },
  { date: '4', value: 2500 }, { date: '5', value: 2100 }, { date: '6', value: 3000 }, { date: '7', value: 3890 }
];

const topSpendingFans = [
  { name: 'Sarah Thompson', avatar: 'https://i.pravatar.cc/150?u=sarah', spent: 3890 },
  { name: 'Joao Silva', avatar: 'https://i.pravatar.cc/150?u=joao', spent: 4250 },
  { name: 'Carlos Ramirez', avatar: 'https://i.pravatar.cc/150?u=carlos', spent: 2050 },
];

const recentDeposits = [
  { name: 'Sarah Thompson', avatar: 'https://i.pravatar.cc/150?u=sarah', amount: 100, time: '10m' },
  { name: 'Carlos Ramirez', avatar: 'https://i.pravatar.cc/150?u=carlos', amount: 250, time: '25m' },
  { name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=priya', amount: 50, time: '1h' },
  { name: 'Joao Silva', avatar: 'https://i.pravatar.cc/150?u=joao', amount: 500, time: '2h' },
];

export default function Fans() {
  const [activeTab, setActiveTab] = useState('All Fans');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [callLead, setCallLead] = useState(null);
  const [selectedFan, setSelectedFan] = useState(exactMockData[0]);
  const itemsPerPage = 10;
  
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleAction = (action, e) => {
    e.stopPropagation();
    addToast('info', 'Action Triggered', `${action} functionality will be available shortly.`);
  };

  const tabs = ['All Fans', 'Active', 'New', 'Deposit Pending', 'VIP', 'Inactive', 'At Risk', 'Churned'];

  const filteredFans = exactMockData.filter(f => {
    if (activeTab !== 'All Fans' && !f.stage.toLowerCase().includes(activeTab.toLowerCase()) && !f.status.toLowerCase().includes(activeTab.toLowerCase())) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.phone.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const kpis = [
    { label: 'Total Fans', value: '770', change: '↑ 20.1% vs yesterday', color: 'text-pink-500', icon: Heart, changeColor: 'text-neon-green' },
    { label: 'Active Fans', value: '88', change: '11.4% of total', color: 'text-neon-green', icon: Users, changeColor: 'text-gray-400' },
    { label: 'VIP Fans', value: '48', change: '6.2% of total', color: 'text-yellow-400', icon: Crown, changeColor: 'text-gray-400' },
    { label: 'First Deposit Pending', value: '146', change: '18.9% of total', color: 'text-orange-500', icon: Wallet, changeColor: 'text-gray-400' },
    { label: 'Inactive 7+ Days', value: '643', change: '83.5% of total', color: 'text-red-500', icon: UserMinus, changeColor: 'text-gray-400' },
    { label: 'Churn Risk', value: '85', change: '11.0% of total', color: 'text-purple-500', icon: AlertTriangle, changeColor: 'text-gray-400' },
  ];

  const getBadgeColors = (stage) => {
    if (stage === 'VIP Fan') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    if (stage === 'Active Fan') return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (stage === 'First Purchase' || stage === 'First Deposit') return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    if (stage === 'Deposit Pending') return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
    if (stage === 'New Fan') return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
    return 'text-gray-300 bg-gray-800 border-gray-700';
  };

  const getScoreColor = (score) => {
    if (score >= 800) return 'text-neon-green';
    if (score >= 500) return 'text-neon-blue';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-4 pb-10 relative text-white bg-[#090C13] min-h-screen">
      {/* KPI Cards Row */}
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-1">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-xl p-4 flex flex-col justify-between min-w-[155px] flex-1 border border-gray-800/80 bg-[#0B0E14] shadow-sm hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[11px] font-medium text-gray-300`}>{k.label}</span>
              <k.icon size={16} className={k.color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">{k.value}</div>
              <div className={`text-[10px] mt-1.5 font-medium ${k.changeColor}`}>{k.change}</div>
            </div>
          </div>
        ))}
        {/* Fan Activation Rate Circular KPI */}
        <div className="rounded-xl p-4 flex items-center justify-between min-w-[210px] flex-1 border border-gray-800/80 bg-[#0B0E14] shadow-sm hover:border-gray-700 transition-colors">
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-gray-300">Fan Activation Rate</span>
              <div className="text-[10px] mt-1.5 font-medium text-neon-green">↑ 6.2% vs last 7 days</div>
            </div>
            <div className="relative w-14 h-14 shrink-0 ml-2">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="stroke-gray-800" strokeWidth="3" fill="none" />
                <circle cx="28" cy="28" r="24" className="stroke-[#00f0ff]" strokeWidth="3" fill="none" strokeDasharray="150" strokeDashoffset={150 - (150 * 0.37)} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-white">37%</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-4">
        {/* Left Column (Table Area) */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Tabs & Table Container */}
          <div className="rounded-xl border border-gray-800/80 bg-[#0B0E14] flex flex-col shadow-sm overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-800/80 overflow-x-auto no-scrollbar w-full px-4">
              {tabs.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3.5 text-[11px] font-medium whitespace-nowrap transition-colors border-b-[2px] relative -mb-[1px] ${activeTab === t ? 'text-neon-blue border-neon-blue' : 'text-gray-400 border-transparent hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
            
            {/* Filters Row */}
            <div className="p-4 flex items-center gap-2.5 flex-wrap">
              <div className="relative w-[220px]">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search fans..." className="w-full bg-[#12161f] border border-gray-800/80 rounded-lg py-2 pl-9 pr-3 text-[11px] text-gray-200 focus:outline-none focus:border-neon-blue/50 transition-colors" />
              </div>
              
              <div className="relative group">
                <select className="bg-[#12161f] border border-gray-800/80 rounded-lg px-3 py-2 text-[11px] font-medium text-gray-300 focus:outline-none focus:border-neon-blue/50 cursor-pointer appearance-none pr-8">
                  <option>All Pipelines</option>
                </select>
                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>
              
              <div className="relative group">
                <select className="bg-[#12161f] border border-gray-800/80 rounded-lg px-3 py-2 text-[11px] font-medium text-gray-300 focus:outline-none focus:border-neon-blue/50 cursor-pointer appearance-none pr-8">
                  <option>All Languages</option>
                </select>
                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>

              <div className="relative group">
                <select className="bg-[#12161f] border border-gray-800/80 rounded-lg px-3 py-2 text-[11px] font-medium text-gray-300 focus:outline-none focus:border-neon-blue/50 cursor-pointer appearance-none pr-8">
                  <option>All Countries</option>
                </select>
                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>

              <div className="relative group">
                <select className="bg-[#12161f] border border-gray-800/80 rounded-lg px-3 py-2 text-[11px] font-medium text-gray-300 focus:outline-none focus:border-neon-blue/50 cursor-pointer appearance-none pr-8">
                  <option>All Agents</option>
                </select>
                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>
              
              <button className="text-[11px] text-neon-blue font-medium ml-1 hover:underline">More Filters</button>
              
              <div className="flex-1"></div>
              
              <button onClick={() => addToast('info', 'Export Started', 'Exporting data as CSV...')} className="px-4 py-2 rounded-lg border border-gray-700 bg-transparent text-[11px] font-medium text-gray-300 hover:text-white hover:bg-[#12161f] transition-colors">
                Export
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3b82f6] text-[11px] font-semibold text-white hover:bg-blue-600 transition-colors shadow-sm">
                <Plus size={14} /> Add Fan
              </button>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto no-scrollbar relative min-h-[400px]">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead className="sticky top-0 bg-[#0B0E14] z-10">
                  <tr className="border-b border-gray-800/80 text-[10px] text-gray-500 font-medium">
                    <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded-[4px] border-gray-700 bg-[#12161f] accent-neon-blue w-3.5 h-3.5" /></th>
                    <th className="px-4 py-3 font-medium">Fan</th>
                    <th className="px-4 py-3 font-medium group cursor-pointer hover:text-gray-300">Status / Stage <ChevronRight size={10} className="inline rotate-90 ml-0.5 opacity-50 group-hover:opacity-100" /></th>
                    <th className="px-4 py-3 font-medium group cursor-pointer hover:text-gray-300">Score <ChevronRight size={10} className="inline rotate-90 ml-0.5 opacity-50 group-hover:opacity-100" /></th>
                    <th className="px-4 py-3 font-medium group cursor-pointer hover:text-gray-300">Language <ChevronRight size={10} className="inline rotate-90 ml-0.5 opacity-50 group-hover:opacity-100" /></th>
                    <th className="px-4 py-3 font-medium">Total Deposits</th>
                    <th className="px-4 py-3 font-medium">Total Spent</th>
                    <th className="px-4 py-3 font-medium group cursor-pointer hover:text-gray-300">Last Activity <ChevronRight size={10} className="inline rotate-90 ml-0.5 opacity-50 group-hover:opacity-100" /></th>
                    <th className="px-4 py-3 font-medium">Assigned Agent</th>
                    <th className="px-4 py-3 font-medium text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/40">
                  {filteredFans.map((f, i) => (
                    <tr key={i} onClick={() => setSelectedFan(f)} className={`cursor-pointer group transition-colors ${selectedFan?.id === f.id ? 'bg-[#12161f]' : 'hover:bg-white/[0.02]'}`}>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded-[4px] border-gray-700 bg-[#12161f] accent-neon-blue w-3.5 h-3.5" /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={f.avatar} alt={f.name} className="w-8 h-8 rounded-full object-cover border border-gray-700/50" />
                            <span className="absolute -bottom-1 -right-1 text-[10px] leading-none bg-[#0B0E14] rounded-full">{f.flag}</span>
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <div className="text-[11px] font-semibold text-white flex items-center gap-2">
                               {f.name} 
                               {f.stage === 'VIP Fan' && <span className="text-[8px] font-bold text-[#facc15] px-1.5 py-0.5 rounded-sm bg-[#facc15]/10 border border-[#facc15]/20 tracking-wider">VIP FAN</span>}
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium">{f.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm border ${getBadgeColors(f.stage)}`}>{f.stage}</span>
                          <span className="text-[10px] text-gray-500 font-medium">Stage {f.stageNum} / 8</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                         <div className="flex flex-col gap-0.5">
                          <span className={`text-[12px] font-bold ${getScoreColor(f.healthScore)}`}>{f.healthScore}</span>
                          <span className={`text-[10px] font-medium ${getScoreColor(f.healthScore)}`}>{f.scoreLabel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-gray-300 font-medium">{f.language}</td>
                      <td className="px-4 py-3.5 text-[11px] font-bold text-white">${f.totalDeposits?.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-[11px] font-bold text-neon-green">${f.totalSpend?.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-gray-300 font-medium">{f.lastActivityText}</span>
                          <span className="text-[10px] text-gray-500 font-medium">{f.lastActivityAction}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <img src={f.agentAvatar} className="w-6 h-6 rounded-full object-cover border border-gray-700/50" />
                          <span className="text-[11px] text-gray-300 font-medium">{f.agent}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right pr-6">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); navigate(getAppPath(`/leads/${f.id}`)); }} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><Eye size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"><MoreVertical size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 bg-[#0B0E14] font-medium">
              <span>Showing 1 to 8 of 770 fans</span>
              <div className="flex items-center gap-1.5">
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] disabled:opacity-50 text-gray-500"><ChevronRight size={12} className="rotate-180" /></button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md bg-[#3b82f6] text-white font-semibold">1</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] text-gray-400">2</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] text-gray-400">3</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] text-gray-400">4</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] text-gray-400">5</button>
                <span className="px-1 text-gray-600">...</span>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] text-gray-400">97</button>
                <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#12161f] disabled:opacity-50 text-gray-500"><ChevronRight size={12} /></button>
                
                <div className="ml-4 flex items-center gap-2 bg-[#12161f] border border-gray-800/80 rounded-md px-3 py-1.5 cursor-pointer">
                  <span>10 / page</span>
                  <ChevronRight size={10} className="rotate-90 text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            
            {/* Fan Pipeline Overview */}
            <div className="lg:col-span-2 rounded-xl p-5 flex flex-col border border-gray-800/80 bg-[#0B0E14] shadow-sm">
              <h3 className="text-[12px] font-semibold text-gray-300 mb-8">Fan Pipeline Overview</h3>
              <div className="flex-1 flex flex-col justify-center pb-2">
                <div className="flex items-center justify-between relative mb-4 px-3">
                  <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-gray-800/60 -z-10" />
                  <div className="absolute top-1/2 left-8 right-8 h-[1px] -z-10 flex items-center justify-between px-3 text-gray-700/50">
                     <span className="text-[10px]">→</span><span className="text-[10px]">→</span><span className="text-[10px]">→</span>
                     <span className="text-[10px]">→</span><span className="text-[10px]">→</span><span className="text-[10px]">→</span><span className="text-[10px]">→</span>
                  </div>
                  {funnelData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center bg-[#0B0E14] px-1 relative z-10">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold border-2 bg-[#0B0E14] shadow-[0_0_10px_rgba(0,0,0,0.5)] ${i === funnelData.length -1 ? 'border-[#facc15] text-[#facc15]' : 'border-[#ec4899] text-[#ec4899]'}`}>
                        {d.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-1">
                   {funnelData.map((d, i) => (
                     <div key={i} className={`text-[9px] text-center w-12 font-medium ${i === funnelData.length -1 ? 'text-[#facc15] font-bold' : 'text-gray-500'}`}>
                       {d.stage}
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Top Spending Fans */}
            <div className="lg:col-span-1 rounded-xl p-5 flex flex-col border border-gray-800/80 bg-[#0B0E14] shadow-sm">
               <div className="flex justify-between items-center mb-5">
                 <h3 className="text-[11px] font-semibold text-gray-400">Top Spending Fans</h3>
                 <button className="text-[10px] text-[#3b82f6] font-medium hover:underline">View All</button>
               </div>
               <div className="space-y-4">
                 {topSpendingFans.map((v, i) => (
                   <div key={i} className="flex items-center gap-2.5">
                     <span className="text-[11px] text-gray-500 w-3 font-medium">{i+1}</span>
                     <img src={v.avatar} className="w-7 h-7 rounded-full object-cover border border-gray-700/50" alt="" />
                     <div className="flex-1 min-w-0 text-[11px] font-medium text-gray-300 truncate">{v.name}</div>
                     <div className="text-[11px] font-bold text-white">${v.spent.toLocaleString()}</div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Recent Deposits */}
            <div className="lg:col-span-1 rounded-xl p-5 flex flex-col border border-gray-800/80 bg-[#0B0E14] shadow-sm">
               <div className="flex justify-between items-center mb-5">
                 <h3 className="text-[11px] font-semibold text-gray-400">Recent Deposits</h3>
                 <button className="text-[10px] text-[#3b82f6] font-medium hover:underline">View All</button>
               </div>
               <div className="space-y-4">
                 {recentDeposits.map((v, i) => (
                   <div key={i} className="flex items-center gap-2.5">
                     <img src={v.avatar} className="w-7 h-7 rounded-full object-cover border border-gray-700/50" alt="" />
                     <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                       <span className="text-[11px] font-medium text-gray-300 truncate">{v.name}</span>
                     </div>
                     <div className="flex flex-col items-end gap-0.5">
                       <span className="text-[11px] font-bold text-white">${v.amount}</span>
                       <span className="text-[9px] text-gray-500 font-medium">{v.time} ago</span>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Fans by Country */}
            <div className="lg:col-span-1 rounded-xl p-5 flex flex-col border border-gray-800/80 bg-[#0B0E14] shadow-sm">
              <h3 className="text-[11px] font-semibold text-gray-400 mb-3">Fans by Country</h3>
              <div className="flex items-center gap-3 h-full pb-2">
                <div className="relative w-20 h-20 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={countryData} innerRadius={28} outerRadius={38} paddingAngle={2} dataKey="value" stroke="none">
                        {countryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[12px] font-bold text-white leading-tight">770</span>
                    <span className="text-[9px] text-gray-500 font-medium mt-0.5">Total</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center gap-1.5 pl-1">
                  {countryData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-[9px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} />
                        <span className="text-gray-300">{d.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">{d.value}%</span>
                        <span className="text-gray-600 w-6 text-right">({d.count})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Sidebar */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
          <div className="rounded-xl p-5 flex flex-col border border-gray-800/80 bg-[#0B0E14] shadow-sm sticky top-4">
            
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img src={selectedFan.avatar} className="w-14 h-14 rounded-full border border-gray-700/50 object-cover" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-bold text-white truncate">{selectedFan.name}</h3>
                  {selectedFan.stage === 'VIP Fan' && <span className="text-[9px] font-bold text-[#facc15] px-1.5 py-0.5 rounded-sm bg-[#facc15]/10 border border-[#facc15]/20 tracking-wider">VIP FAN</span>}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span className="text-gray-400">{selectedFan.username}</span>
                  <span className="text-neon-green">{selectedFan.status}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                  <span className="text-[12px]">{selectedFan.flag}</span> {selectedFan.country || 'United States'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e]/20 transition-colors">
                <MessageCircle size={13} /> <span className="text-[11px] font-semibold">Message</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] hover:bg-[#3b82f6]/20 transition-colors">
                <Phone size={13} /> <span className="text-[11px] font-semibold">Call</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[#8b5cf6] hover:bg-[#8b5cf6]/20 transition-colors">
                <span className="text-[11px] font-semibold">More</span> <ChevronRight size={13} className="rotate-90" />
              </button>
            </div>

            {/* Fan Score Section */}
            <div className="flex gap-5 mb-6">
              <div className="flex flex-col items-center justify-center w-[90px]">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-300 mb-2">
                   Fan Score <ChevronRight size={10} className="rotate-90 text-gray-500"/>
                </div>
                <div className="relative w-20 h-20 mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="36" className="stroke-gray-800" strokeWidth="4" fill="none" />
                    <circle cx="40" cy="40" r="36" className="stroke-[#8b5cf6]" strokeWidth="4" fill="none" strokeDasharray="226" strokeDashoffset={226 - (226 * (selectedFan.healthScore/1000))} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">{selectedFan.healthScore}</span>
                </div>
                <span className="text-[11px] font-medium text-gray-400">{selectedFan.scoreLabel}</span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-gray-300 mb-3">Score Breakdown</span>
                <div className="space-y-2 text-[10px] font-medium">
                  <div className="flex justify-between items-center text-gray-400"><span>Engagement</span> <span className="text-white">210</span></div>
                  <div className="flex justify-between items-center text-gray-400"><span>Spending</span> <span className="text-white">250</span></div>
                  <div className="flex justify-between items-center text-gray-400"><span>Consistency</span> <span className="text-white">180</span></div>
                  <div className="flex justify-between items-center text-gray-400"><span>Activity</span> <span className="text-white">120</span></div>
                  <div className="flex justify-between items-center text-gray-400"><span>Loyalty</span> <span className="text-white">90</span></div>
                </div>
              </div>
            </div>

            <hr className="border-gray-800/60 mb-5" />

            {/* Charts Section */}
            <div className="flex gap-5 mb-6">
              <div className="flex-1 flex flex-col">
                <div className="text-[11px] font-medium text-gray-400 mb-1">Total Deposits</div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="text-[15px] font-bold text-white">${selectedFan.totalDeposits?.toLocaleString() || '2,450'}</div>
                  <div className="text-[9px] font-bold text-neon-green">↑ 15.3%</div>
                </div>
                <div className="text-[9px] font-medium text-gray-500 mb-3">vs last 30 days</div>
                <div className="h-12 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={depositData}>
                      <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="w-[1px] bg-gray-800/60" />
              <div className="flex-1 flex flex-col">
                <div className="text-[11px] font-medium text-gray-400 mb-1">Total Spent</div>
                <div className="flex items-center gap-1.5 mb-0.5">
                   <div className="text-[15px] font-bold text-white">${selectedFan.totalSpend?.toLocaleString() || '3,890'}</div>
                   <div className="text-[9px] font-bold text-neon-green">↑ 18.7%</div>
                </div>
                <div className="text-[9px] font-medium text-gray-500 mb-3">vs last 30 days</div>
                <div className="h-12 w-full mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendData}>
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <hr className="border-gray-800/60 mb-5" />

            {/* Milestones & Details Section */}
            <div className="flex gap-5">
              <div className="flex-1">
                 <div className="text-[11px] font-semibold text-gray-300 mb-1.5">Milestones</div>
                 <div className="text-[9px] font-medium text-gray-500 mb-3">7/8 Completed</div>
                 <div className="w-full h-1 bg-gray-800 rounded-full mb-4 overflow-hidden"><div className="h-full bg-[#8b5cf6] rounded-full w-[87%]" /></div>
                 <div className="space-y-2.5 text-[10px] font-medium text-gray-400">
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> Registered</div>
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> Email Verified</div>
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> Phone Verified</div>
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> First Deposit</div>
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> First Purchase</div>
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> Joined Room</div>
                   <div className="flex items-center gap-2.5"><CheckCircle size={12} className="text-neon-green" /> Active Fan</div>
                   <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-[3px] border-[1.5px] border-gray-600" /> VIP Fan</div>
                 </div>
              </div>
              
              <div className="flex-1">
                 <div className="text-[11px] font-semibold text-gray-300 mb-4">Fan Details</div>
                 <div className="space-y-3.5 text-[10px]">
                   <div className="flex flex-col gap-1">
                     <span className="text-gray-500 font-medium">Primary Channel</span>
                     <span className="text-white font-medium flex items-center gap-1.5"><MessageCircle size={12} className="text-[#22c55e]" /> {selectedFan.channel || 'WhatsApp'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-gray-500 font-medium">Language</span>
                     <span className="text-white font-medium">{selectedFan.language}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-gray-500 font-medium">Country</span>
                     <span className="text-white font-medium">{selectedFan.country || 'United States'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-gray-500 font-medium">Member Since</span>
                     <span className="text-white font-medium">{selectedFan.memberSince || 'Apr 15, 2025'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-gray-500 font-medium">Assigned Agent</span>
                     <div className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                       <img src={selectedFan.agentAvatar} className="w-4 h-4 rounded-full object-cover border border-gray-700/50" />
                       {selectedFan.agent}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CallModal open={!!callLead} lead={callLead} onClose={() => setCallLead(null)} />
    </div>
  );
}
