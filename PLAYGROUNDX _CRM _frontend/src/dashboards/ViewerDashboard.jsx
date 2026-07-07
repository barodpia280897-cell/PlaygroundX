// src/dashboards/ViewerDashboard.jsx
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Crown, DollarSign, Users, Bot, Activity, TrendingUp, Globe, Heart, Star } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border-gray-700 p-2.5 rounded-lg text-xs shadow-lg">
        <p className="text-secondary mb-0.5">{label}</p>
        <p className="font-black text-neon-blue">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function ViewerDashboard() {
  const [leads] = useDataStore('leads');
  const [vips] = useDataStore('vips');
  const [liveActivityFeed] = useDataStore('liveActivityFeed');
  const [revenueByMonth] = useDataStore('revenueByMonth');
  const [topCountries] = useDataStore('topCountries');
  const [languageDistribution] = useDataStore('languageDistribution');
  const [aiPerformance] = useDataStore('aiPerformance');
  const [conversionFunnel] = useDataStore('conversionFunnel');

  // Derive counts & metrics safely
  const totalLeads = leads?.length || 0;
  const creatorCount = leads?.filter(l => l.type === 'Creator').length || 0;
  const fanCount = leads?.filter(l => l.type === 'Fan').length || 0;
  
  const totalRevenueVal = revenueByMonth?.reduce((sum, m) => sum + m.revenue, 0) || 423000;
  const resolutionRateVal = aiPerformance?.resolutionRate || 98.3;
  const averageHealthScore = Math.round(leads?.reduce((sum, l) => sum + (l.healthScore || 80), 0) / (leads?.length || 1)) || 78;

  // Recent lists derived from leads
  const recentLeads = [...(leads || [])].sort((a, b) => b.id - a.id).slice(0, 5);
  const recentCreators = [...(leads || [])].filter(l => l.type === 'Creator').slice(0, 5);
  const recentFans = [...(leads || [])].filter(l => l.type === 'Fan').slice(0, 5);

  const kpis = [
    { label: 'Today\'s Leads', value: '1,284', change: `+${totalLeads} active in database`, positive: true, icon: Users, color: '#00f0ff' },
    { label: 'Active Creators', value: '514', change: `${creatorCount} monitored`, positive: true, icon: Star, color: '#a855f7' },
    { label: 'Active Fans', value: '770', change: `${fanCount} monitored`, positive: true, icon: Heart, color: '#ec4899' },
    { label: 'Revenue Overview', value: `$${(totalRevenueVal / 1000).toFixed(0)}K YTD`, change: '+12.4% vs last qtr', positive: true, icon: DollarSign, color: '#eab308' },
    { label: 'AI Resolution', value: `${resolutionRateVal}%`, change: '2,451 questions resolved', positive: true, icon: Bot, color: '#25d366' },
    { label: 'Avg Health Score', value: `${averageHealthScore}/100`, change: 'Overall compliance', positive: true, icon: Activity, color: '#ff0055' },
  ];

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            Executive Auditor Control Board
          </h2>
          <p className="text-sm text-muted mt-0.5">Strictly observational compliance audit & analytics view</p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          Live Observation Feed Active
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 flex flex-col justify-between border-gray-800/80">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: kpi.color + '15', border: `1px solid ${kpi.color}30` }}>
                  <Icon size={14} style={{ color: kpi.color }} />
                </div>
                <span className="table-th">Metrics</span>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{kpi.value}</p>
                <p className="text-[10px] text-gray-300 font-bold mt-1 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">{kpi.change}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Row 2: Charts (Revenue trajectory & Conversion Funnel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Trajectory */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-5">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
            <DollarSign size={14} className="text-neon-green" /> Financial Trajectory Trend
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="viewRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#00f0ff" strokeWidth={2} fill="url(#viewRevGrad)" style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.4))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-neon-purple" /> Conversion Funnel Analysis
            </h3>
            <div className="space-y-3">
              {conversionFunnel?.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-24 text-xs font-bold text-gray-400 truncate">{stage.stage}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-900 rounded-full h-2">
                      <div className="h-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" style={{ width: `${stage.percent}%` }} />
                    </div>
                  </div>
                  <div className="w-16 text-right text-xs font-black text-white">{stage.percent}% <span className="text-gray-500 font-medium">({stage.value})</span></div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Demographics & VIP summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Country Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-5">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Globe size={14} className="text-neon-blue" /> Country Performance
          </h3>
          <div className="space-y-3.5">
            {topCountries?.map((country, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg shrink-0">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-gray-300 truncate">{country.country}</span>
                    <span className="text-gray-400 font-bold">{country.percent}% ({country.count})</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" style={{ width: `${country.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Language Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-panel p-5">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Globe size={14} className="text-neon-pink" /> Language Performance
          </h3>
          <div className="space-y-3.5">
            {languageDistribution?.slice(0, 5).map((lang, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color || '#39ff14' }} />
                  <span className="text-gray-300 font-medium">{lang.name}</span>
                </div>
                <span className="text-gray-400 font-black">{lang.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* VIP Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-5">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Crown size={14} className="text-yellow-500" /> VIP Prospects Summary
          </h3>
          <div className="space-y-3">
            {vips?.slice(0, 4).map((vip, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/60 border border-gray-800/80">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={vip.avatar} alt={vip.name} className="w-7 h-7 rounded-full object-cover border border-gray-700" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{vip.name}</p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span>{vip.flag}</span> · <span className="font-semibold text-neon-blue">{vip.type}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-yellow-500">{vip.vipScore || 90}/100</p>
                  <p className="text-[8px] text-gray-600 uppercase font-bold tracking-wider">VIP Score</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Row 4: Lists (Recent Activity & Data Streams) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }} className="glass-panel p-5 lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={14} className="text-neon-purple" /> Recent Activity
            </h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {liveActivityFeed?.slice(0, 7).map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-purple mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium leading-relaxed">{item.text}</p>
                    <span className="text-[9px] text-gray-500 font-bold block mt-0.5">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Categories Details lists */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="glass-panel p-5 lg:col-span-8">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest mb-4">
            Monitored Data Streams
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Recent Leads */}
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider border-b border-gray-800 pb-1">Recent Leads</div>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                {recentLeads.map(lead => (
                  <div key={lead.id} className="p-2 rounded-lg bg-gray-900/40 border border-gray-800/50 flex items-center gap-2">
                    <img src={lead.avatar} className="w-6 h-6 rounded-full object-cover border border-gray-700" alt="" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{lead.name}</p>
                      <p className="text-[9px] text-gray-500 truncate">{lead.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Creators */}
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider border-b border-gray-800 pb-1">Recent Creators</div>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                {recentCreators.map(creator => (
                  <div key={creator.id} className="p-2 rounded-lg bg-gray-900/40 border border-gray-800/50 flex items-center gap-2">
                    <img src={creator.avatar} className="w-6 h-6 rounded-full object-cover border border-gray-700" alt="" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{creator.name}</p>
                      <p className="text-[9px] text-neon-purple font-medium">{creator.stage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Fans */}
            <div className="space-y-2">
              <div className="text-[10px] text-gray-500 font-black uppercase tracking-wider border-b border-gray-800 pb-1">Recent Fans</div>
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                {recentFans.map(fan => (
                  <div key={fan.id} className="p-2 rounded-lg bg-gray-900/40 border border-gray-800/50 flex items-center gap-2">
                    <img src={fan.avatar} className="w-6 h-6 rounded-full object-cover border border-gray-700" alt="" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{fan.name}</p>
                      <p className="text-[9px] text-neon-blue font-medium">{fan.stage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="text-center pt-4 border-t border-gray-900">
        <p className="text-xs text-gray-700 tracking-[0.3em] uppercase font-bold">PlayGroundX · Viewer Compliance Mode</p>
      </motion.div>
    </div>
  );
}
