import { useState } from 'react';
import { 
  DollarSign, ArrowUpRight, Filter, Download, ChevronDown, 
  CreditCard, TrendingUp, Users, Activity, Crown 
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// Import our new mock data
import {
  revKpis, revTrendData, revByProduct, revByLanguage,
  topCreators, topFans, breakdownTableData, leadSourceData,
  heatmapHours, heatmapDays, heatmapData
} from '../data/mock/revenueAnalytics';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0E14] border border-gray-700/80 p-3 rounded-lg shadow-xl shadow-black/50 text-[10px] z-50">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-300 font-medium">{entry.name}:</span>
            <span className="text-white font-bold">
              {typeof entry.value === 'number' && entry.value > 1000 ? `$${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Heatmap Helper
const getHeatmapColor = (val) => {
  if (val < 0.2) return 'bg-[#1e3a8a]'; // Dark blue
  if (val < 0.4) return 'bg-[#3b82f6]'; // Blue
  if (val < 0.6) return 'bg-[#10b981]'; // Green
  if (val < 0.8) return 'bg-[#f59e0b]'; // Yellow/Orange
  return 'bg-[#ef4444]'; // Red
};

export default function RevenueAnalytics() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen bg-[#05070D] font-sans pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Revenue Center <span className="text-[11px] font-normal text-gray-400 mt-1">Track all revenue streams and performance in real-time</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
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
        {['Overview', 'By Product', 'By Language', 'By Creator', 'By Fan', 'Transactions', 'Payouts', 'Analytics'].map(tab => (
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
        {revKpis.map((kpi, i) => {
          const icons = [<DollarSign size={16}/>, <UserBadge />, <Users size={16}/>, <CreditCard size={16}/>, <Users size={16}/>, <TrendingUp size={16}/>];
          return (
            <div key={i} className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col transition-all hover:-translate-y-0.5"
                 style={{ boxShadow: `0 0 15px ${kpi.color}15` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border"
                     style={{ backgroundColor: `${kpi.color}20`, borderColor: `${kpi.color}40`, color: kpi.color }}>
                  {icons[i]}
                </div>
                <div className="text-[10px] font-semibold text-gray-400 truncate">{kpi.label}</div>
              </div>
              <div className="text-xl font-bold text-white leading-tight">{kpi.val}</div>
              <div className="text-[9px] font-semibold text-green-500 mt-1">{kpi.grw}</div>
            </div>
          );
        })}
      </div>

      {/* ROW 2: PRIMARY ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        
        {/* Revenue by Product (Donut) */}
        <div className="lg:col-span-3 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[320px]">
          <h3 className="text-[11px] font-bold text-white mb-4 flex justify-between">
            Revenue by Product (MTD)
            <span className="text-[9px] font-normal text-gray-500 flex gap-2"><span>Revenue</span><span>% of Total</span></span>
          </h3>
          <div className="flex flex-col xl:flex-row items-center gap-2 flex-1">
             <div className="relative w-[130px] h-[130px] shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={revByProduct} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                     {revByProduct.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[14px] font-bold text-white leading-tight">$1.29M</div>
                  <div className="text-[8px] text-gray-500 font-semibold">Total Revenue</div>
               </div>
             </div>
             <div className="flex-1 w-full space-y-1.5 overflow-y-auto custom-scrollbar pr-1 max-h-[220px]">
                {revByProduct.map((r, i) => (
                  <div key={i} className="flex items-center text-[9px] gap-2">
                    <div className="w-1.5 h-1.5 rounded-[2px] shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-gray-400 flex-1 truncate">{r.name}</span>
                    <span className="text-white font-semibold">${(r.value/1000).toLocaleString()}K</span>
                    <span className="text-gray-500 w-8 text-right">{r.pct}</span>
                  </div>
                ))}
             </div>
          </div>
          <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400 mt-2 text-left">View full report →</button>
        </div>

        {/* Revenue Trend (Area Chart) */}
        <div className="lg:col-span-4 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[320px]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-[11px] font-bold text-white mb-1">Revenue Trend</h3>
              <div className="text-2xl font-bold text-white">$1,286,650</div>
              <div className="text-[9px] font-semibold text-green-500 mt-1">↑ 21.8% vs last 30 days</div>
            </div>
            <select className="bg-transparent border border-gray-800 rounded px-2 py-1 text-[9px] font-semibold text-gray-400 focus:outline-none appearance-none cursor-pointer">
              <option>Last 30 Days ▾</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-0 -ml-3 -mb-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revTrendData}>
                <defs>
                  <linearGradient id="colorRevBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1B2332" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} dy={10} minTickGap={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6b7280' }} tickFormatter={(val) => `$${val/1000}K`} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevBlue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Language (Donut) */}
        <div className="lg:col-span-3 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[320px]">
          <h3 className="text-[11px] font-bold text-white mb-4 flex justify-between">
            Revenue by Language (MTD)
            <span className="text-[9px] font-normal text-gray-500 flex gap-2"><span>Revenue</span><span>% Total</span></span>
          </h3>
          <div className="flex flex-col xl:flex-row items-center gap-2 flex-1">
             <div className="relative w-[130px] h-[130px] shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={revByLanguage} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                     {revByLanguage.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[14px] font-bold text-white leading-tight">$1.29M</div>
                  <div className="text-[8px] text-gray-500 font-semibold">Total Revenue</div>
               </div>
             </div>
             <div className="flex-1 w-full space-y-1.5 overflow-y-auto custom-scrollbar pr-1 max-h-[220px]">
                {revByLanguage.map((r, i) => (
                  <div key={i} className="flex items-center text-[9px] gap-2">
                    <div className="w-1.5 h-1.5 rounded-[2px] shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-gray-400 flex-1 truncate">{r.name}</span>
                    <span className="text-white font-semibold">${(r.value/1000).toLocaleString()}K</span>
                    <span className="text-gray-500 w-8 text-right">{r.pct}</span>
                  </div>
                ))}
             </div>
          </div>
          <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400 mt-2 text-left">View full report →</button>
        </div>

        {/* Sidebar Lists (Creators & Fans) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* Top Creators */}
          <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-3 flex flex-col h-[152px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold text-white">Top Creators (MTD)</h3>
              <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
              {topCreators.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[8px] text-gray-500 font-bold w-2">{c.id}</span>
                    <img src={c.avatar} className="w-4 h-4 rounded-full" />
                    <span className="text-[9px] text-gray-300 font-semibold truncate max-w-[50px]">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-300">{c.rev}</span>
                    <span className="text-[8px] text-green-500 font-bold w-8 text-right">{c.grw}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Spending Fans */}
          <div className="bg-[#0D111B] border border-[#1B2332] rounded-xl p-3 flex flex-col h-[152px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold text-white">Top Spending Fans (MTD)</h3>
              <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400">View All</button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
              {topFans.map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[8px] text-gray-500 font-bold w-2">{f.id}</span>
                    <img src={f.avatar} className="w-4 h-4 rounded-full" />
                    <span className="text-[9px] text-gray-300 font-semibold truncate max-w-[65px]">{f.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[9px] text-gray-300">{f.spent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ROW 3: LOWER ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Breakdown Table */}
        <div className="lg:col-span-6 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[320px]">
          <h3 className="text-[11px] font-bold text-white mb-3">Revenue Breakdown by Product</h3>
          <div className="flex-1 overflow-auto custom-scrollbar -mx-2">
             <table className="w-full text-left border-collapse min-w-[500px]">
               <thead>
                 <tr className="text-[9px] font-semibold text-gray-500 border-b border-gray-800/80">
                   <th className="pb-2 pl-2">Product</th>
                   <th className="pb-2">Revenue (MTD)</th>
                   <th className="pb-2">% of Total</th>
                   <th className="pb-2">Transactions</th>
                   <th className="pb-2">Paying Fans</th>
                   <th className="pb-2">ARPPU</th>
                   <th className="pb-2 pr-2 text-right">vs Last 30 Days</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-800/50">
                 {breakdownTableData.map((r, i) => (
                   <tr key={i} className={`hover:bg-white/[0.02] transition-colors ${r.isTotal ? 'bg-gray-800/20 font-bold border-t-2 border-t-gray-700/50' : ''}`}>
                     <td className="py-2 pl-2 flex items-center gap-1.5">
                       {!r.isTotal && <div className={`w-3 h-3 rounded flex items-center justify-center text-white ${r.iconColor}`}><LayoutGrid size={8}/></div>}
                       <span className={`text-[10px] ${r.isTotal ? 'text-white' : 'text-gray-300'}`}>{r.product}</span>
                     </td>
                     <td className={`py-2 text-[10px] ${r.isTotal ? 'text-white' : 'text-gray-300'}`}>{r.rev}</td>
                     <td className="py-2 text-[10px] text-gray-400">{r.pct}</td>
                     <td className="py-2 text-[10px] text-gray-400">{r.trans}</td>
                     <td className="py-2 text-[10px] text-gray-400">{r.fans}</td>
                     <td className="py-2 text-[10px] text-gray-400">{r.arppu}</td>
                     <td className="py-2 pr-2 text-[10px] font-bold text-green-500 text-right">{r.grw}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Heatmap */}
        <div className="lg:col-span-3 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-[11px] font-bold text-white">Revenue Heatmap <span className="text-gray-500 font-normal">(By Hour & Day)</span></h3>
             <select className="bg-transparent border border-gray-800 rounded px-1.5 py-1 text-[9px] font-semibold text-gray-400 focus:outline-none appearance-none cursor-pointer">
                <option>MTD ▾</option>
             </select>
          </div>
          <div className="flex-1 flex flex-col justify-center">
             <div className="flex mb-1">
                <div className="w-6 shrink-0"></div>
                <div className="flex-1 grid grid-cols-7 gap-0.5 px-0.5">
                   {heatmapData[0].map((_, i) => (
                      <div key={i} className="h-6" /> // Placeholder for grid alignment
                   ))}
                </div>
             </div>
             
             <div className="space-y-0.5">
               {heatmapDays.map((day, dIdx) => (
                 <div key={day} className="flex items-center">
                   <div className="w-6 shrink-0 text-[8px] font-semibold text-gray-500 pr-1">{day}</div>
                   <div className="flex-1 grid grid-cols-7 gap-0.5">
                     {heatmapData[dIdx].map((val, hIdx) => (
                       <div key={hIdx} className={`h-6 rounded-sm ${getHeatmapColor(val)} hover:opacity-80 transition-opacity cursor-pointer`} title={`Revenue Index: ${val}`} />
                     ))}
                   </div>
                 </div>
               ))}
             </div>

             <div className="flex mt-1">
                <div className="w-6 shrink-0"></div>
                <div className="flex-1 grid grid-cols-7 gap-0.5 text-[7px] text-gray-500 font-semibold px-0.5 text-center">
                   {heatmapHours.map((h, i) => <div key={i} className="-ml-2 whitespace-nowrap">{h}</div>)}
                </div>
             </div>

             {/* Heatmap Legend */}
             <div className="mt-6 flex items-center justify-between text-[8px] font-semibold text-gray-500 px-6">
                <span>Low</span>
                <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-[#1e3a8a] via-[#10b981] to-[#ef4444]" />
                <span>High</span>
             </div>
          </div>
        </div>

        {/* Lead Source Donut */}
        <div className="lg:col-span-3 bg-[#0D111B] border border-[#1B2332] rounded-xl p-4 flex flex-col h-[320px]">
          <h3 className="text-[11px] font-bold text-white mb-4 flex justify-between">
            Revenue by Lead Source <span className="text-gray-500 font-normal">(MTD)</span>
          </h3>
          <div className="flex flex-col items-center gap-6 flex-1 justify-center">
             <div className="relative w-[140px] h-[140px] shrink-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={leadSourceData} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                     {leadSourceData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <Tooltip content={<CustomTooltip />} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-[15px] font-bold text-white leading-tight">$1.29M</div>
                  <div className="text-[9px] text-gray-500 font-semibold">Total Revenue</div>
               </div>
             </div>
             <div className="w-full space-y-1.5 max-w-[200px]">
                {leadSourceData.slice(0,6).map((r, i) => (
                  <div key={i} className="flex items-center text-[9px] gap-2">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-gray-400 flex-1 truncate">{r.name}</span>
                    <span className="text-white font-semibold">${(r.value/1000).toLocaleString()}K</span>
                    <span className="text-gray-500 w-8 text-right">{r.pct}</span>
                  </div>
                ))}
             </div>
          </div>
          <button className="text-[9px] font-semibold text-blue-500 hover:text-blue-400 mt-2 text-center">View full report →</button>
        </div>

      </div>

    </div>
  );
}

// Inline Icon Components
function UserBadge() {
  return (
    <div className="relative">
      <Users size={16} />
      <div className="absolute -bottom-1 -right-1 bg-[#1B2332] rounded-full p-[1px]">
        <Crown size={8} className="text-purple-500" />
      </div>
    </div>
  );
}

function LayoutGrid(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}
