import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowUpRight, Crown, CreditCard, Filter, Download, User, ShoppingCart, Users, Activity, X, ChevronRight, Eye } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f111a] border border-gray-700 rounded-xl p-3 shadow-xl z-50">
      <p className="text-[10px] font-bold text-gray-400 mb-2">{label || payload[0]?.name}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] font-bold flex items-center gap-2" style={{ color: p.color || p.payload?.fill }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.payload?.fill }} />
          {p.name}: {p.value.toLocaleString(undefined, {style: p.name.toLowerCase().includes('revenue') ? 'currency' : 'decimal', currency: 'USD'})}
        </p>
      ))}
    </div>
  );
};

// --- MOCK DATA ---
const revenueTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${21 + i > 30 ? (21 + i - 30) : 21 + i}`,
  revenue: Math.floor(Math.random() * 20000) + 30000 + (i * 1000)
}));

const products = [
  { name: 'Tips', revenue: 312450, pct: '24.3%', tx: 45231, fans: 12456, arppu: 25.11, change: '+24.5%', color: '#3b82f6', icon: '💰' },
  { name: 'Subscriptions', revenue: 242320, pct: '18.8%', tx: 18736, fans: 6842, arppu: 35.42, change: '+18.3%', color: '#ec4899', icon: '⭐' },
  { name: 'PPV', revenue: 186320, pct: '14.5%', tx: 12843, fans: 4921, arppu: 37.84, change: '+12.1%', color: '#f59e0b', icon: '🔒' },
  { name: 'Truth or Dare', revenue: 124680, pct: '9.7%', tx: 9231, fans: 3842, arppu: 32.45, change: '+15.6%', color: '#00f0ff', icon: '🎲' },
  { name: 'Suga 4 U', revenue: 98760, pct: '7.7%', tx: 6432, fans: 2987, arppu: 33.06, change: '+8.9%', color: '#8a2be2', icon: '🍬' },
  { name: 'Bar Lounge', revenue: 86540, pct: '6.7%', tx: 5643, fans: 2123, arppu: 40.73, change: '+9.1%', color: '#39ff14', icon: '🍸' },
  { name: 'Confessions', revenue: 76230, pct: '5.9%', tx: 4987, fans: 2123, arppu: 35.91, change: '+6.2%', color: '#ef4444', icon: '🤫' },
  { name: 'Flash Drops', revenue: 63210, pct: '4.9%', tx: 3876, fans: 1876, arppu: 33.66, change: '+10.7%', color: '#facc15', icon: '⚡' },
  { name: 'Movie Night', revenue: 51420, pct: '4.0%', tx: 3210, fans: 1432, arppu: 35.91, change: '+7.3%', color: '#6366f1', icon: '🍿' },
  { name: 'Casino Rooms', revenue: 43720, pct: '3.4%', tx: 2345, fans: 1123, arppu: 38.94, change: '+9.8%', color: '#ff0055', icon: '🎰' },
];

const languageData = [
  { name: 'English', value: 426730, pct: '33.2%', color: '#3b82f6' },
  { name: 'Spanish', value: 312450, pct: '24.3%', color: '#39ff14' },
  { name: 'Portuguese', value: 186320, pct: '14.5%', color: '#f59e0b' },
  { name: 'French', value: 124680, pct: '9.7%', color: '#ec4899' },
  { name: 'Arabic', value: 98760, pct: '7.7%', color: '#8a2be2' },
  { name: 'Hindi', value: 61540, pct: '4.8%', color: '#00f0ff' },
  { name: 'Bengali', value: 43210, pct: '3.4%', color: '#facc15' },
  { name: 'Chinese', value: 27840, pct: '2.1%', color: '#ef4444' },
  { name: 'Korean', value: 3700, pct: '0.3%', color: '#555555' },
];

const leadSourceData = [
  { name: 'Instagram Ads', value: 426730, pct: '33.2%', color: '#ec4899' },
  { name: 'Facebook Ads', value: 312450, pct: '24.3%', color: '#3b82f6' },
  { name: 'TikTok Ads', value: 186320, pct: '14.5%', color: '#00f0ff' },
  { name: 'Google Ads', value: 124680, pct: '9.7%', color: '#facc15' },
  { name: 'AlexStar (Affiliate)', value: 86540, pct: '6.7%', color: '#8a2be2' },
  { name: 'Organic', value: 76170, pct: '5.8%', color: '#39ff14' },
];

const topCreators = [
  { name: 'Luna Starr', avatar: 'https://i.pravatar.cc/150?img=5', revenue: '$68,450', change: '+24.5%' },
  { name: 'Mia Luxe', avatar: 'https://i.pravatar.cc/150?img=9', revenue: '$47,890', change: '+18.3%' },
  { name: 'Chloe Vibes', avatar: 'https://i.pravatar.cc/150?img=1', revenue: '$43,210', change: '+12.1%' },
  { name: 'Zara Wild', avatar: 'https://i.pravatar.cc/150?img=12', revenue: '$38,750', change: '+9.8%' },
  { name: 'Ava Monroe', avatar: 'https://i.pravatar.cc/150?img=20', revenue: '$34,560', change: '+8.7%' },
];

const topFans = [
  { name: 'ChrisDiamond', avatar: 'https://i.pravatar.cc/150?img=11', revenue: '$12,450' },
  { name: 'KingJames', avatar: 'https://i.pravatar.cc/150?img=8', revenue: '$9,870' },
  { name: 'AlexStar', avatar: 'https://i.pravatar.cc/150?img=15', revenue: '$8,230' },
  { name: 'LoyalFan88', avatar: 'https://i.pravatar.cc/150?img=3', revenue: '$7,560' },
  { name: 'MrExclusive', avatar: 'https://i.pravatar.cc/150?img=60', revenue: '$6,840' },
];

// Generate heatmap data: 7 days x 24 hours
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const heatmapData = days.map(day => {
  return Array.from({ length: 24 }, () => Math.floor(Math.random() * 100));
});

// Function to calculate color based on value (0-100) -> returns a color from dark blue to neon green to yellow
const getHeatmapColor = (value) => {
  if (value < 20) return '#1e3a8a'; // dark blue
  if (value < 40) return '#0ea5e9'; // light blue
  if (value < 60) return '#10b981'; // green
  if (value < 80) return '#eab308'; // yellow
  return '#ef4444'; // red for peak
};


export default function Revenue() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showTxModal, setShowTxModal] = useState(false);
  const { addToast } = useToast();

  const tabs = ['Overview', 'By Product', 'By Language', 'By Creator', 'By Fan', 'Transactions', 'Payouts', 'Analytics'];

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Revenue Center <span className="text-sm font-normal text-muted sm:ml-2">Track all revenue streams and performance in real-time</span>
          </h2>
        </motion.div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => addToast('info', 'Revenue Filters', 'Filter by date range, product, or currency coming soon.')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            <Filter size={14} /> Filters
          </button>
          <button onClick={() => addToast('success', 'Report Exported', 'Revenue data exported to CSV successfully.')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto custom-scrollbar w-full">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t ? 'text-neon-blue border-neon-blue' : 'text-gray-500 border-transparent hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>


      {activeTab !== 'Overview' && (
        <div className="glass-panel p-20 flex flex-col items-center justify-center text-center mt-4 border-dashed border-gray-700/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <DollarSign size={24} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{activeTab} Details</h3>
          <p className="text-sm text-gray-500 max-w-md">Detailed data, metrics, and reports for {activeTab.toLowerCase()} are generated dynamically based on active selection. Real-time implementation is ready.</p>
        </div>
      )}

      {activeTab === 'Overview' && (
        <>
      {/* KPI Cards (6 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Revenue (MTD)', value: '$1,286,650', change: '↑ 21.8%', color: 'text-neon-green', icon: DollarSign, bg: '#39ff14' },
          { label: 'Creator Earnings (MTD)', value: '$843,230', change: '↑ 22.4%', color: 'text-neon-purple', icon: User, bg: '#8a2be2' },
          { label: 'Platform Revenue (MTD)', value: '$443,420', change: '↑ 20.6%', color: 'text-neon-blue', icon: Crown, bg: '#00f0ff' },
          { label: 'Total Transactions', value: '128,942', change: '↑ 18.7%', color: 'text-yellow-400', icon: ShoppingCart, bg: '#facc15' },
          { label: 'Paying Fans', value: '18,736', change: '↑ 16.3%', color: 'text-neon-blue', icon: Users, bg: '#3b82f6' },
          { label: 'ARPPU (MTD)', value: '$52.14', change: '↑ 13.6%', color: 'text-neon-green', icon: Activity, bg: '#10b981' },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[100px]">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-opacity-20" style={{ backgroundColor: `${k.bg}30` }}>
                <k.icon size={14} className={k.color} />
              </div>
              <span className="text-[9px] font-bold text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded border border-neon-green/30">{k.change}</span>
            </div>
            <div className="relative z-10">
              <div className="text-[10px] text-gray-400 font-bold leading-tight mb-0.5">{k.label}</div>
              <div className="text-xl font-black text-white">{k.value}</div>
            </div>
            {/* Subtle glow behind card */}
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ backgroundColor: k.bg }} />
          </motion.div>
        ))}
      </div>

      {/* Row 1: Charts Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Revenue by Product */}
        <div className="xl:col-span-4 glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-white">Revenue by Product (MTD)</h3>
          </div>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 relative">
            <div className="w-full lg:w-1/2 h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={products} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="revenue" stroke="none">
                    {products.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-lg font-black text-white">$1.29M</span>
                 <span className="text-[8px] text-gray-500 uppercase tracking-wider">Total Revenue</span>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-1.5 max-h-[180px] overflow-y-auto no-scrollbar">
               {/* Custom Legend */}
               <div className="flex justify-between text-[8px] text-gray-500 uppercase border-b border-gray-800 pb-1 mb-1">
                 <span>Product</span>
                 <div className="flex gap-4"><span>Revenue</span><span>%</span></div>
               </div>
               {products.map((d, i) => (
                 <div key={i} className="flex justify-between items-center text-[9px]">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} /> <span className="text-gray-300 truncate w-16">{d.name}</span></span>
                   <div className="flex gap-4 items-center">
                     <span className="text-white">${(d.revenue/1000).toFixed(1)}k</span>
                     <span className="text-gray-500 w-6 text-right">{d.pct}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          <button className="text-[9px] text-neon-blue mt-2 hover:underline w-full text-center">View full report →</button>
        </div>

        {/* Revenue Trend */}
        <div className="xl:col-span-4 glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-bold text-white">Revenue Trend</h3>
            <span className="text-[9px] text-gray-500 border border-gray-700 rounded px-2 py-1">Last 30 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <div className="text-xl font-black text-white">$1,286,650</div>
            <div className="text-[9px] text-neon-green font-bold mb-1">↑ 21.8% vs last 30 days</div>
          </div>
          <div className="flex-1 w-full min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#trendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Language */}
        <div className="xl:col-span-4 glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-white">Revenue by Language (MTD)</h3>
          </div>
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 relative">
            <div className="w-full lg:w-1/2 h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={languageData} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                    {languageData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-lg font-black text-white">$1.29M</span>
                 <span className="text-[8px] text-gray-500 uppercase tracking-wider">Total Revenue</span>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-1.5 max-h-[180px] overflow-y-auto no-scrollbar">
               <div className="flex justify-between text-[8px] text-gray-500 uppercase border-b border-gray-800 pb-1 mb-1">
                 <span>Language</span>
                 <div className="flex gap-4"><span>Revenue</span><span>%</span></div>
               </div>
               {languageData.map((d, i) => (
                 <div key={i} className="flex justify-between items-center text-[9px]">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} /> <span className="text-gray-300 truncate w-16">{d.name}</span></span>
                   <div className="flex gap-4 items-center">
                     <span className="text-white">${(d.value/1000).toFixed(1)}k</span>
                     <span className="text-gray-500 w-6 text-right">{d.pct}</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          <button className="text-[9px] text-neon-blue mt-2 hover:underline w-full text-center">View full report →</button>
        </div>
      </div>

      {/* Row 2: Grid Complex */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Main Left: Table & Heatmap */}
        <div className="xl:col-span-9 space-y-4">
          
          {/* Breakdown Table */}
          <div className="glass-panel flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-white">Revenue Breakdown by Product</h3>
            </div>
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">Revenue (MTD)</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">% of Total</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">Transactions</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">Paying Fans</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">ARPPU</th>
                    <th className="px-4 py-3 text-[9px] font-bold text-gray-500 uppercase tracking-wider text-right">vs Last 30 Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {products.map((p, i) => (
                    <tr key={i} onClick={() => setShowTxModal(true)} className="hover:bg-white/[0.02] cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-6 h-6 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px]">{p.icon}</span>
                          <span className="text-[10px] font-bold text-white" style={{ color: p.color }}>{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[10px] font-bold text-white text-right">${p.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[10px] text-gray-400 text-right">{p.pct}</td>
                      <td className="px-4 py-3 text-[10px] text-gray-300 text-right">{p.tx.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[10px] text-gray-300 text-right">{p.fans.toLocaleString()}</td>
                      <td className="px-4 py-3 text-[10px] text-white text-right">${p.arppu}</td>
                      <td className="px-4 py-3 text-[10px] font-bold text-right text-neon-green">{p.change}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-gray-900/50 border-t-2 border-gray-700">
                    <td className="px-4 py-3 text-[10px] font-bold text-white">Total</td>
                    <td className="px-4 py-3 text-[11px] font-black text-white text-right">$1,286,650</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-gray-400 text-right">100%</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-gray-300 text-right">112,524</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-gray-300 text-right">39,055</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-white text-right">$32.95</td>
                    <td className="px-4 py-3 text-[10px] font-black text-neon-green text-right">↑ 21.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Heatmap */}
          <div className="glass-panel p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold text-white">Revenue Heatmap (By Hour & Day)</h3>
              <span className="text-[9px] text-gray-500 border border-gray-700 rounded px-2 py-1">MTD <ChevronDownIcon className="inline" /></span>
            </div>
            
            <div className="flex w-full">
              {/* Y Axis: Days */}
              <div className="flex flex-col gap-1 pr-2 pt-[20px] justify-between text-[8px] text-gray-500 font-bold">
                {days.map(d => <div key={d} className="h-6 flex items-center">{d}</div>)}
              </div>
              
              {/* Heatmap Grid */}
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col gap-1 flex-1">
                  {heatmapData.map((row, dayIdx) => (
                    <div key={dayIdx} className="flex gap-1 flex-1 h-6">
                      {row.map((val, hrIdx) => (
                        <div key={hrIdx} className="flex-1 rounded-sm border border-black/20 hover:border-white transition-colors cursor-pointer relative group" style={{ backgroundColor: getHeatmapColor(val) }}>
                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-[8px] px-2 py-1 rounded pointer-events-none z-10 whitespace-nowrap shadow-xl border border-gray-700">
                            {days[dayIdx]} {hrIdx}:00 - Intensity: {val}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {/* X Axis: Hours */}
                <div className="flex justify-between mt-2 text-[8px] text-gray-500 font-bold px-1">
                  <span>12 AM</span>
                  <span>4 AM</span>
                  <span>8 AM</span>
                  <span>12 PM</span>
                  <span>4 PM</span>
                  <span>8 PM</span>
                  <span>11 PM</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-4 text-[8px] text-gray-500 font-bold">
              <span>Low</span>
              <div className="flex gap-0.5 h-2 w-20 rounded overflow-hidden">
                <div className="flex-1 bg-[#1e3a8a]"></div>
                <div className="flex-1 bg-[#0ea5e9]"></div>
                <div className="flex-1 bg-[#10b981]"></div>
                <div className="flex-1 bg-[#eab308]"></div>
                <div className="flex-1 bg-[#ef4444]"></div>
              </div>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Right Column: Lists & Donut */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* Top Creators */}
          <div className="glass-panel p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold text-white">Top Creators (MTD)</h3>
              <button className="text-[9px] text-neon-blue hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {topCreators.map((c, i) => (
                <div key={i} onClick={() => setShowTxModal(true)} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors -mx-1">
                  <span className="text-[10px] text-gray-500 font-bold w-2">{i+1}</span>
                  <img src={c.avatar} className="w-6 h-6 rounded-full border border-gray-700" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-white truncate">{c.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-white">{c.revenue}</div>
                    <div className="text-[8px] text-neon-green">{c.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Spending Fans */}
          <div className="glass-panel p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold text-white">Top Spending Fans (MTD)</h3>
            </div>
            <div className="space-y-3">
              {topFans.map((f, i) => (
                <div key={i} onClick={() => setShowTxModal(true)} className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1 rounded transition-colors -mx-1">
                  <span className="text-[10px] text-gray-500 font-bold w-2">{i+1}</span>
                  <img src={f.avatar} className="w-6 h-6 rounded-full border border-gray-700" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-white truncate">{f.name}</div>
                  </div>
                  <div className="text-[10px] font-bold text-white">{f.revenue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue by Lead Source */}
          <div className="glass-panel p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold text-white">Revenue by Lead Source</h3>
            </div>
            <div className="relative w-full h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={leadSourceData} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                    {leadSourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-lg font-black text-white">$1.29M</span>
                 <span className="text-[8px] text-gray-500 uppercase tracking-wider">Total Revenue</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1.5 max-h-[140px] overflow-y-auto no-scrollbar">
               {leadSourceData.map((d, i) => (
                 <div key={i} className="flex justify-between items-center text-[9px]">
                   <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} /> <span className="text-gray-300">{d.name}</span></span>
                   <div className="flex gap-4 items-center">
                     <span className="text-white">${(d.value/1000).toFixed(1)}k</span>
                     <span className="text-gray-500 w-6 text-right">{d.pct}</span>
                   </div>
                 </div>
               ))}
            </div>
            <button className="text-[9px] text-neon-blue mt-4 hover:underline w-full text-center">View full report →</button>
          </div>
          
        </div>
      </div>
      </>
      )}

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {showTxModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTxModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-4xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={18} className="text-neon-blue" /> Transaction History</h3>
                <button onClick={() => setShowTxModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-4 overflow-y-auto no-scrollbar flex-1 bg-[#0f111a]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-800 text-[10px] text-gray-500 uppercase">
                      <th className="py-2">Transaction ID</th>
                      <th className="py-2">Date & Time</th>
                      <th className="py-2">Product</th>
                      <th className="py-2">User</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {Array.from({length: 12}).map((_, i) => (
                      <tr key={i} className="text-[11px] text-gray-300 hover:bg-white/5 transition-colors">
                        <td className="py-3 text-neon-blue font-mono">TXN-984{i}3{Math.floor(Math.random()*9)}</td>
                        <td className="py-3 text-gray-400">May 20, 2025 10:{i*4 + 10} AM</td>
                        <td className="py-3">Tips</td>
                        <td className="py-3 flex items-center gap-2"><img src={`https://i.pravatar.cc/150?img=${i+1}`} className="w-5 h-5 rounded-full" alt="" /> User_{i}</td>
                        <td className="py-3"><span className="text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/30 text-[9px]">Completed</span></td>
                        <td className="py-3 text-right font-bold text-white">${(Math.random()*150 + 10).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function ChevronDownIcon({ className = "w-3 h-3" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
