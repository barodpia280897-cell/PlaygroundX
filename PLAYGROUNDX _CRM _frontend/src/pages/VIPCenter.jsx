import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Heart, TrendingUp, DollarSign, Activity, ChevronDown, Filter, Download, Zap, AlertTriangle, MessageSquare, Gift, ArrowRight, ChevronRight, X, PhoneCall, Send, Sparkles, UserCheck, CheckCircle } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { useDataStore } from '../contexts/DataContext';
import { getVIPsByCategory, getVIPLeads } from '../utils/leadHelpers';
import LeadTable from '../components/leads/LeadTable';
import CallModal from '../components/modals/CallModal';

// --- MOCK DATA ---
const overviewData = [
  { day: 'W1', creators: 120, fans: 1800, rollers: 400, prospects: 800 },
  { day: 'W2', creators: 135, fans: 2000, rollers: 450, prospects: 950 },
  { day: 'W3', creators: 142, fans: 2150, rollers: 520, prospects: 1100 },
  { day: 'W4', creators: 156, fans: 2341, rollers: 587, prospects: 1247 },
];

const revenueTrendData = [
  { day: 'May 1', rev: 12000 }, { day: 'May 5', rev: 15000 }, { day: 'May 10', rev: 22000 },
  { day: 'May 15', rev: 18000 }, { day: 'May 20', rev: 28000 }, { day: 'May 25', rev: 35000 },
  { day: 'May 30', rev: 45000 },
];

const revenueSourceData = [
  { name: 'Tips', value: 35, color: '#10b981' },
  { name: 'Subscriptions', value: 25, color: '#3b82f6' },
  { name: 'PPV', value: 15, color: '#8a2be2' },
  { name: 'Suga 4 U', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 15, color: '#ef4444' },
];

const engagementTierData = [
  { name: 'Diamond', value: 15, color: '#a78bfa' },
  { name: 'Platinum', value: 25, color: '#60a5fa' },
  { name: 'Gold', value: 35, color: '#fbbf24' },
  { name: 'Silver', value: 15, color: '#9ca3af' },
  { name: 'Bronze', value: 10, color: '#d1d5db' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f111a] border border-gray-700 rounded-xl p-3 shadow-xl z-50">
      <p className="text-[10px] font-bold text-gray-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] font-bold flex items-center gap-2" style={{ color: p.color || p.payload?.fill }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function VIPCenter() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [allLeads] = useDataStore('leads');
  const vipLeads = getVIPLeads(allLeads);
  const { addToast } = useToast();

  // Interactive filter states
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // VIP Concierge assistance modal state
  const [selectedConciergeClient, setSelectedConciergeClient] = useState(null);
  const [customGiftMessage, setCustomGiftMessage] = useState('');
  const [callLead, setCallLead] = useState(null);

  const handleSendVipGift = (client, giftType) => {
    addToast('success', 'VIP Concierge Dispatched 🎁', `Sent ${giftType} to ${client.name || client.stage || 'VIP Client'}.`);
    setSelectedConciergeClient(null);
    setCustomGiftMessage('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            VIP Concierge Center <span className="text-sm font-normal text-muted sm:ml-2">Manage and engage VIP creators, high rollers, and top earners</span>
          </h2>
        </motion.div>
        
        <div className="flex items-center gap-3 flex-wrap filter-bar">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white transition-colors">
              {deptFilter} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-44 bg-gray-950 border border-gray-800 rounded-xl z-30 shadow-2xl overflow-hidden">
              {['All Departments', 'VIP Creators Desk', 'High Rollers Desk', 'International Tier 1', 'Crypto & Whale Accounts'].map(d => (
                <button key={d} onClick={() => { setDeptFilter(d); addToast('info', 'Department Filtered', `Showing VIP telemetry for ${d}.`); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{d}</button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white transition-colors">
              {timeframe} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-36 bg-gray-950 border border-gray-800 rounded-xl z-30 shadow-2xl overflow-hidden">
              {['Last 7 Days', 'Last 30 Days', 'This Quarter', 'All-Time High'].map(tf => (
                <button key={tf} onClick={() => { setTimeframe(tf); addToast('info', 'Period Updated', `Recalculated revenue velocity for ${tf}.`); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{tf}</button>
              ))}
            </div>
          </div>

          <button onClick={() => setShowFiltersModal(true)} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white transition-colors shadow-sm">
            <Filter size={14} /> Filters
          </button>

          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-neon-blue hover:bg-neon-blue/10 transition-colors shadow-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-900/60 border border-gray-800 rounded-2xl overflow-x-auto no-scrollbar p-1.5">
        {['Overview', 'VIP Creators', 'VIP Fans', 'VIP Prospects', 'High Rollers', 'Top Earners', 'Watchlist', 'Engagement', 'Analytics'].map((t) => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-xs font-black transition-all whitespace-nowrap rounded-xl ${activeTab === t ? 'text-black bg-neon-blue shadow-[0_0_12px_rgba(0,240,255,0.5)] scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'VIP Creators', value: vipLeads.filter(l=>l.type==='Creator').length.toLocaleString() || '156', trend: '↑ 12%', color: '#a855f7', icon: Crown },
          { label: 'VIP Fans', value: vipLeads.filter(l=>l.type==='Fan').length.toLocaleString() || '2,341', trend: '↑ 8%', color: '#ec4899', icon: Heart },
          { label: 'High Rollers ($1k+)', value: '587', trend: '↑ 15%', color: '#eab308', icon: Star },
          { label: 'VIP Prospects', value: '1,247', trend: '↑ 22%', color: '#3b82f6', icon: Activity },
          { label: 'Total VIP Revenue', value: '$683,420', trend: '↑ 18%', color: '#10b981', icon: DollarSign },
          { label: 'Engagement Rate', value: '78.6%', trend: '↑ 5%', color: '#0ea5e9', icon: TrendingUp },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 flex flex-col justify-between hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{kpi.label}</span>
              <div className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ backgroundColor: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                <kpi.icon size={15} style={{ color: kpi.color }} />
              </div>
            </div>
            <div>
              <div className="text-xl font-black text-white">{kpi.value}</div>
              <div className="text-[10px] font-bold mt-1 text-neon-green">{kpi.trend} vs {timeframe.toLowerCase()}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {activeTab !== 'Overview' && activeTab !== 'Analytics' && activeTab !== 'Engagement' && (
        <div className="glass-panel p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Crown size={18} className="text-yellow-400"/> Directory: {activeTab} ({deptFilter})
            </h3>
            <span className="text-xs font-extrabold text-neon-blue bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/20">Active Telemetry</span>
          </div>
          <LeadTable 
            leads={getVIPsByCategory(allLeads, activeTab)} 
            config={{ showAgent: true, canAct: true }} 
            onView={(lead) => setSelectedConciergeClient(lead)} 
            onDelete={() => {}} 
            onEdit={(lead) => setSelectedConciergeClient(lead)} 
          />
        </div>
      )}

      {(activeTab === 'Analytics' || activeTab === 'Engagement') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-6 shadow-xl flex flex-col">
            <h3 className="text-base font-black text-white mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-neon-blue"/> {activeTab} Velocity Distribution</h3>
            <div className="flex-1 w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="fans" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} strokeWidth={2.5} />
                  <Area type="monotone" dataKey="creators" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-panel p-6 shadow-xl flex flex-col justify-center items-center text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-yellow-400 shadow-inner">
              <Star size={32} />
            </div>
            <h3 className="text-lg font-black text-white">Dedicated {activeTab} Report Audit</h3>
            <p className="text-xs text-gray-400 max-w-sm">All engagement scores, Diamond tier retention percentages, and ARPU breakdown for {timeframe}.</p>
            <button onClick={() => setShowExportModal(true)} className="px-6 py-2.5 bg-yellow-400 text-black font-black text-xs rounded-xl shadow-md hover:bg-yellow-300 transition-all">Download Audit PDF →</button>
          </div>
        </div>
      )}

      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {/* Row 2: Charts & Activity */}
          <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-[340px]">
            {/* VIP Overview Line Chart */}
            <div className="glass-panel p-5 w-full xl:w-2/5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-white">VIP Growth Overview</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Creators</span>
                  <span className="flex items-center gap-1 text-gray-300"><div className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Fans</span>
                </div>
              </div>
              <div className="flex-1 w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overviewData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="fans" name="VIP Fans" stroke="#ec4899" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="creators" name="VIP Creators" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* VIP Revenue Trend */}
            <div className="glass-panel p-5 w-full xl:w-2/5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xs font-extrabold text-white">VIP Revenue Velocity</h3>
                  <div className="text-[10px] text-gray-400 font-bold">{timeframe}</div>
                </div>
                <div className="text-xl font-black text-neon-green">$683.4K</div>
              </div>
              <div className="flex-1 w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="rev" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* High Roller Activity Sidebar */}
            <div className="glass-panel p-5 w-full xl:w-1/5 flex flex-col min-w-0 shadow-xl">
              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <h3 className="text-xs font-extrabold text-white">High Roller Activity</h3>
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pr-1">
                {[
                  { name: 'Alex M.', spent: '$1,200', action: 'tipped @lunastarr', time: 'Just now', avatar: 'https://i.pravatar.cc/150?img=11' },
                  { name: 'John D.', spent: '$500', action: 'subscribed to VIP', time: '5m ago', avatar: 'https://i.pravatar.cc/150?img=12' },
                  { name: 'Sarah K.', spent: '$800', action: 'purchased PPV', time: '12m ago', avatar: 'https://i.pravatar.cc/150?img=9' },
                  { name: 'Mike T.', spent: '$2,500', action: 'tipped @mateo', time: '20m ago', avatar: 'https://i.pravatar.cc/150?img=15' },
                  { name: 'Emma W.', spent: '$400', action: 'gifted sub', time: '1h ago', avatar: 'https://i.pravatar.cc/150?img=5' },
                ].map((a, i) => (
                  <div key={i} onClick={() => setSelectedConciergeClient(a)} className="flex gap-2.5 cursor-pointer group p-1 rounded-xl hover:bg-white/5 transition-colors">
                    <img src={a.avatar} className="w-7 h-7 rounded-full border border-gray-700 shrink-0" alt="" />
                    <div>
                      <div className="text-xs text-gray-300 leading-tight">
                        <span className="font-extrabold text-white group-hover:text-neon-blue transition-colors">{a.name}</span> {a.action} <span className="font-black text-neon-green">{a.spent}</span>
                      </div>
                      <div className="text-[9px] text-gray-500 mt-0.5 font-mono">{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Data Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Top VIP Creators */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><Crown size={15} className="text-purple-400"/> Top VIP Creators</h3>
                <button onClick={() => setActiveTab('VIP Creators')} className="text-[10px] text-neon-blue hover:underline font-bold">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-2.5">Creator</th>
                      <th className="pb-2.5 text-right">Revenue</th>
                      <th className="pb-2.5 text-right">Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-xs">
                    {vipLeads.filter(v => v.type === 'Creator').slice(0, 4).map((c, i) => (
                      <tr key={i} onClick={() => setSelectedConciergeClient(c)} className="hover:bg-white/[0.03] cursor-pointer group">
                        <td className="py-2.5 flex items-center gap-2.5">
                          <img src={c.avatar} className="w-7 h-7 rounded-full border border-gray-700" alt=""/>
                          <span className="text-xs font-extrabold text-white group-hover:text-purple-400 transition-colors">{c.name}</span>
                        </td>
                        <td className="py-2.5 text-xs font-black text-neon-green text-right font-mono">{c.earnings || '$42.5K'}</td>
                        <td className="py-2.5 text-[10px] font-bold text-green-400 text-right">+12%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top VIP Fans */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><Heart size={15} className="text-pink-400"/> Top VIP Fans</h3>
                <button onClick={() => setActiveTab('VIP Fans')} className="text-[10px] text-neon-blue hover:underline font-bold">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-2.5">Fan</th>
                      <th className="pb-2.5 text-right">Spent</th>
                      <th className="pb-2.5 text-right">Trans.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-xs">
                    {vipLeads.filter(v => v.type === 'Fan').slice(0, 4).map((f, i) => (
                      <tr key={i} onClick={() => setSelectedConciergeClient(f)} className="hover:bg-white/[0.03] cursor-pointer group">
                        <td className="py-2.5 flex items-center gap-2.5">
                          <img src={f.avatar} className="w-7 h-7 rounded-full border border-gray-700" alt=""/>
                          <span className="text-xs font-extrabold text-white group-hover:text-pink-400 transition-colors">{f.name}</span>
                        </td>
                        <td className="py-2.5 text-xs font-black text-neon-green text-right font-mono">{f.spent || '$14.2K'}</td>
                        <td className="py-2.5 text-xs text-gray-300 text-right font-bold">{f.score || 45}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* High Rollers (MTD) */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><Star size={15} className="text-yellow-400"/> High Rollers (MTD)</h3>
                <button onClick={() => setActiveTab('High Rollers')} className="text-[10px] text-neon-blue hover:underline font-bold">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-2.5">Roller</th>
                      <th className="pb-2.5 text-right">Spent</th>
                      <th className="pb-2.5 text-right">Last Seen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-xs">
                    {[
                      { name: 'Mike Tyson', avatar: 'https://i.pravatar.cc/150?img=15', spent: '$5.2K', seen: '1h ago' },
                      { name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=11', spent: '$4.8K', seen: '3h ago' },
                      { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=5', spent: '$3.9K', seen: '1d ago' },
                      { name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?img=8', spent: '$3.5K', seen: '2d ago' },
                    ].map((r, i) => (
                      <tr key={i} onClick={() => setSelectedConciergeClient(r)} className="hover:bg-white/[0.03] cursor-pointer group">
                        <td className="py-2.5 flex items-center gap-2.5">
                          <img src={r.avatar} className="w-7 h-7 rounded-full border border-gray-700" alt=""/>
                          <span className="text-xs font-extrabold text-white group-hover:text-yellow-400 transition-colors">{r.name}</span>
                        </td>
                        <td className="py-2.5 text-xs font-black text-yellow-400 text-right font-mono">{r.spent}</td>
                        <td className="py-2.5 text-[10px] text-gray-400 text-right font-mono">{r.seen}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VIP Alerts */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><AlertTriangle size={15} className="text-red-500"/> VIP Alerts</h3>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 font-bold">4 Action Req</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'High Roller Inactive', desc: 'Alex Mercer inactive for 7 days', color: 'text-red-400' },
                  { title: 'VIP Creator At Risk', desc: 'Luna Starr revenue dropped 15%', color: 'text-orange-400' },
                  { title: 'VIP Fan Spending Drop', desc: 'Sarah Kline spending down 30%', color: 'text-yellow-400' },
                  { title: 'Prospect Ready', desc: 'David Chen eligible for VIP', color: 'text-neon-green' },
                ].map((a, i) => (
                  <div key={i} onClick={() => setSelectedConciergeClient(a)} className="flex flex-col gap-1 p-2.5 bg-gray-900/60 rounded-xl border border-gray-800/80 hover:border-gray-700 cursor-pointer transition-colors">
                    <div className={`text-xs font-extrabold ${a.color}`}>{a.title}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{a.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Source & Engagement */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Revenue by Source */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <h3 className="text-xs font-extrabold text-white mb-4">VIP Revenue by Source ({timeframe})</h3>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-24 h-24 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={revenueSourceData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                        {revenueSourceData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {revenueSourceData.map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /> <span className="text-gray-300">{s.name}</span></div>
                      <span className="text-white font-mono">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Engagement by Tier */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <h3 className="text-xs font-extrabold text-white mb-4">VIP Engagement by Tier</h3>
              <div className="flex items-center gap-4 flex-1">
                <div className="w-24 h-24 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={engagementTierData} innerRadius={0} outerRadius={45} dataKey="value" stroke="none">
                        {engagementTierData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {engagementTierData.map((s, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} /> <span className="text-gray-300">{s.name}</span></div>
                      <span className="text-white font-mono">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VIP Pipeline */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <h3 className="text-xs font-extrabold text-white mb-4">VIP Pipeline Breakdown</h3>
              <div className="space-y-3.5 flex-1">
                 {[
                   { stage: 'New VIP Prospects', count: 124, color: 'text-blue-400' },
                   { stage: 'Engaged Prospects', count: 85, color: 'text-purple-400' },
                   { stage: 'VIP Candidates', count: 42, color: 'text-pink-400' },
                   { stage: 'VIP Onboarding', count: 18, color: 'text-yellow-400' },
                   { stage: 'Active VIPs', count: 2743, color: 'text-neon-green' },
                 ].map((p, i) => (
                   <div key={i} className="flex justify-between items-center text-xs">
                     <span className={`font-extrabold ${p.color}`}>{p.stage}</span>
                     <span className="font-black text-white font-mono">{p.count}</span>
                   </div>
                 ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <h3 className="text-xs font-extrabold text-white mb-4 flex items-center gap-1.5"><Sparkles size={14} className="text-yellow-400"/> Recommended Concierge Tasks</h3>
              <div className="space-y-2.5 flex-1">
                 {[
                   { title: 'Create Retention Campaign', desc: 'Target 45 at-risk VIPs', icon: Gift, action: () => addToast('success', 'Campaign Queued', 'Targeted 45 at-risk VIPs with special rewards.') },
                   { title: 'Send Exclusive Offers', desc: 'To 124 new prospects', icon: ArrowRight, action: () => addToast('success', 'Offers Dispatched', 'Sent VIP welcome packages to 124 prospects.') },
                   { title: 'Schedule VIP Calls', desc: 'Follow up with Top 10', icon: PhoneCall, action: () => setCallLead({ name: 'Top 10 VIP Spenders Check-in', phone: '+1 (310) 555-0899', stage: 'Diamond VIP Tier' }) }
                 ].map((r, i) => (
                   <button key={i} onClick={r.action} className="w-full flex items-center justify-between p-2.5 bg-gray-900 border border-gray-800 hover:border-neon-blue rounded-xl text-left transition-all group shadow-sm">
                     <div className="flex items-center gap-2.5">
                       <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                         <r.icon size={14} />
                       </div>
                       <div>
                         <div className="text-xs font-black text-white group-hover:text-neon-blue transition-colors">{r.title}</div>
                         <div className="text-[10px] text-gray-400 font-medium">{r.desc}</div>
                       </div>
                     </div>
                     <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: VIP CONCIERGE EXECUTIVE ASSISTANCE MODAL */}
      <AnimatePresence>
        {selectedConciergeClient && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedConciergeClient(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  {selectedConciergeClient.avatar ? (
                    <img src={selectedConciergeClient.avatar} className="w-10 h-10 rounded-full border border-gray-700" alt=""/>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center font-black">👑</div>
                  )}
                  <div>
                    <h3 className="text-base font-black text-white">{selectedConciergeClient.name || selectedConciergeClient.title || "VIP Client Concierge"}</h3>
                    <p className="text-xs text-gray-400 font-mono">{selectedConciergeClient.spent || selectedConciergeClient.desc || "Priority Diamond Tier Member"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCallLead(selectedConciergeClient)} className="text-neon-green hover:bg-neon-green/20 px-3 py-1.5 bg-gray-900 rounded-xl border border-neon-green/40 flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm"><PhoneCall size={13}/> Call VIP</button>
                  <button onClick={() => setSelectedConciergeClient(null)} className="text-gray-400 hover:text-white p-1.5 bg-gray-900 rounded-full"><X size={16}/></button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 p-3 rounded-2xl text-xs text-yellow-300 font-medium">
                💎 <strong className="text-white font-bold">VIP Concierge Action Desk:</strong> Direct high-value client assistance and rewards distribution.
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-extrabold text-gray-300 block">Select VIP Concierge Reward / Action</label>
                {[
                  "🍾 Send Complimentary Champagne / Luxury Gift Box ($150)",
                  "⚡ Attach +10% Lifetime Revenue Share Loyalty Bonus",
                  "📞 Assign Senior 24/7 Private VIP Concierge Manager",
                  "🎟️ Issue 50 Free Tip Vouchers ($500 Value)"
                ].map((gift, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleSendVipGift(selectedConciergeClient, gift)}
                    className="w-full p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800 hover:border-yellow-400 text-left font-bold text-gray-200 hover:text-white transition-all flex items-center justify-between group shadow-sm"
                  >
                    <span>{gift}</span>
                    <Send size={12} className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-gray-400 block mb-1">Or Send Custom VIP Notice / Gift</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type custom reward note..." 
                    value={customGiftMessage}
                    onChange={e => setCustomGiftMessage(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                  <button 
                    onClick={() => handleSendVipGift(selectedConciergeClient, customGiftMessage || "Custom VIP Gift")}
                    disabled={!customGiftMessage}
                    className="px-5 py-2.5 bg-yellow-400 text-black font-black text-xs rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-50"
                  >
                    Send 🚀
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTERS MODAL */}
      <AnimatePresence>
        {showFiltersModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowFiltersModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Filter size={16} className="text-neon-blue"/> VIP Directory Filters</h3>
                <button onClick={() => setShowFiltersModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <div className="space-y-3 text-xs pt-1">
                <div>
                  <label className="font-bold text-gray-400 block mb-1">Engagement Tier</label>
                  <select className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option>All Tiers (Diamond to Bronze)</option>
                    <option>Diamond ($5k+ spend/mo)</option>
                    <option>Platinum ($2k - $5k/mo)</option>
                    <option>Gold ($1k - $2k/mo)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowFiltersModal(false)} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Reset</button>
                <button onClick={() => { addToast('success', 'Filters Applied', 'Filtered VIP directory by tier.'); setShowFiltersModal(false); }} className="flex-1 py-2.5 bg-neon-blue text-black font-black text-xs rounded-xl shadow-md">Apply Filter</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPORT MODAL */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowExportModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Download size={16} className="text-neon-blue"/> Export VIP Report</h3>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-300">Download comprehensive VIP Concierge directory and spend attribution for <strong className="text-white font-bold">{timeframe}</strong>.</p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => { addToast('success', 'CSV Generated', 'VIP_Directory_Report.csv downloaded.'); setShowExportModal(false); }} className="py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-md">Download CSV</button>
                <button onClick={() => { addToast('success', 'PDF Generated', 'Executive_VIP_Audit.pdf downloaded.'); setShowExportModal(false); }} className="py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl border border-gray-700">Download PDF</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CallModal open={!!callLead} lead={callLead} onClose={() => setCallLead(null)} />
    </div>
  );
}
