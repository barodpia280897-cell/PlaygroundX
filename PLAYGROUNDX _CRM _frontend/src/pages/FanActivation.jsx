import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Download, Users, UserPlus, Heart, TrendingUp, DollarSign, Activity, Play, CheckCircle, AlertCircle, Clock, ChevronRight, ChevronDown, Send, Gift, Sparkles, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { 
  stages, stagePerformanceData, conversionAnalytics, 
  revenueByStageData, recommendedActions 
} from '../data/mock/fanActivationData';
import { useAuth } from '../contexts/AuthContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f111a] border border-gray-700 rounded-xl p-3 shadow-xl z-50">
      <p className="text-[10px] font-bold text-gray-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] font-bold flex items-center gap-2" style={{ color: p.color || p.payload?.fill }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color || p.payload?.fill }} />
          {p.name}: {p.value.toLocaleString(undefined, {style: p.name.includes('Revenue') ? 'currency' : 'decimal', currency: 'USD'})}{p.name.includes('Rate') ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

const mockVipCandidates = [
  { name: 'Marcus Vance', spent: '$850', tips: 14, lastActive: '10m ago', potential: 'High', avatar: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Sophia Taylor', spent: '$920', tips: 19, lastActive: '1h ago', potential: 'Very High', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Liam Hemsworth', spent: '$780', tips: 11, lastActive: '3h ago', potential: 'Medium', avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Olivia Benson', spent: '$940', tips: 22, lastActive: '30m ago', potential: 'Very High', avatar: 'https://i.pravatar.cc/150?img=9' },
  { name: 'Noah Kahan', spent: '$810', tips: 15, lastActive: '5h ago', potential: 'High', avatar: 'https://i.pravatar.cc/150?img=15' }
];

export default function FanActivation() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Activation Stages');
  const [selectedStage, setSelectedStage] = useState(null);
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const { addToast } = useToast();

  // Interactive state
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [candidates, setCandidates] = useState(mockVipCandidates);

  const tabs = ['Overview', 'Activation Stages', 'Engagement', 'Conversion', 'Retention', 'VIP Candidates', 'Analytics'];

  const handleExecuteWorkflow = (action) => {
    addToast('success', 'Workflow Triggered ⚡', `Executed ${action.title} automated journey sequence.`);
    setSelectedWorkflow(null);
  };

  const handleUpgradeToVip = (name) => {
    setCandidates(prev => prev.filter(c => c.name !== name));
    addToast('success', 'VIP Status Granted 👑', `${name} has been upgraded to VIP Spender status!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Fan Activation Center <span className="text-sm font-normal text-muted sm:ml-2">Monitor and optimize the fan journey funnel</span>
          </h2>
        </motion.div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
              {timeframe} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-36 bg-gray-950 border border-gray-800 rounded-xl z-30 shadow-2xl overflow-hidden">
              {['Last 7 Days', 'Last 30 Days', 'This Quarter'].map(tf => (
                <button key={tf} onClick={() => { setTimeframe(tf); addToast('info', 'Timeframe Updated', `Synced fan activation funnel metrics for ${tf}.`); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{tf}</button>
              ))}
            </div>
          </div>

          <button onClick={() => setShowFiltersModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors shadow-sm">
            <Filter size={14} /> Filters
          </button>
          
          <button onClick={() => setShowExportModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors shadow-sm">
            <Download size={14} /> Export Funnel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto custom-scrollbar w-full">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t ? 'text-neon-pink border-neon-pink bg-white/[0.02]' : 'text-gray-500 border-transparent hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* KPI Cards (6 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Fans', value: '18,452', change: '↑ 12.4%', color: 'text-neon-blue', icon: Users, bg: '#3b82f6' },
          { label: 'New Fans (MTD)', value: '+1,245', change: '↑ 8.2%', color: 'text-neon-purple', icon: UserPlus, bg: '#8a2be2' },
          { label: 'Activated Fans', value: '5,166', change: '↑ 14.1%', color: 'text-neon-green', icon: Heart, bg: '#39ff14' },
          { label: 'Overall Conversion', value: '28.3%', change: '↑ 4.5%', color: 'text-yellow-400', icon: TrendingUp, bg: '#facc15' },
          { label: 'Activation Revenue', value: '$145,200', change: '↑ 18.2%', color: 'text-neon-blue', icon: DollarSign, bg: '#0ea5e9' },
          { label: 'Average ARPU', value: '$28.12', change: '↑ 6.3%', color: 'text-neon-green', icon: Activity, bg: '#10b981' },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 relative overflow-hidden flex flex-col justify-between min-h-[100px] hover:border-gray-700 transition-colors">
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
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ backgroundColor: k.bg }} />
          </motion.div>
        ))}
      </div>

      {activeTab === 'Activation Stages' || activeTab === 'Overview' ? (
        <div className="space-y-6">
          {/* 6-Stage Activation Funnel */}
          <div className="glass-panel p-6 overflow-x-auto no-scrollbar shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5"><Sparkles size={16} className="text-yellow-400"/> 6-Stage Fan Activation Funnel ({timeframe})</h3>
              <span className="text-[10px] text-gray-400 font-bold bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800">Click a stage card to filter table below</span>
            </div>
            <div className="flex items-start min-w-[900px]">
              {stages.map((s, i) => (
                <Fragment key={s.id}>
                  {/* Funnel Stage Card */}
                  <div 
                    onClick={() => setSelectedStage(selectedStage === s.id ? null : s.id)}
                    className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer relative ${selectedStage === s.id ? 'bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-105' : 'bg-gray-900/50 hover:bg-gray-800'}`}
                    style={{ borderColor: selectedStage === s.id ? s.color : '#374151' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-lg" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                      <s.icon size={18} />
                    </div>
                    <div className="text-[10px] text-gray-300 font-extrabold uppercase tracking-wider mb-1 text-center">{s.name}</div>
                    <div className="text-xl font-black text-white mb-1">{s.fans.toLocaleString()}</div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                    </div>
                    <div className="text-[10px] font-extrabold" style={{ color: s.color }}>{s.pct}% of total</div>
                  </div>
                  
                  {/* Drop-off Indicator */}
                  {i < stages.length - 1 && (
                    <div className="flex flex-col items-center justify-center w-12 pt-10 shrink-0">
                      <ChevronRight size={20} className="text-gray-600 mb-1" />
                      <div className="text-[9px] text-red-400 font-bold bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">-{stages[i].dropoff}</div>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Split Row: Table & Recommended Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Stage Performance Table */}
            <div className="xl:col-span-8 glass-panel flex flex-col shadow-xl">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
                <h3 className="text-xs font-extrabold text-white">Stage Performance Metrics</h3>
                {selectedStage && (
                  <button onClick={() => setSelectedStage(null)} className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">Clear Stage Filter ({selectedStage})</button>
                )}
              </div>
              <div className="flex-1 overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/40 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-4 py-3.5">Activation Stage</th>
                      <th className="px-4 py-3.5 text-right">Total Fans</th>
                      <th className="px-4 py-3.5 text-right">% of Total</th>
                      <th className="px-4 py-3.5 text-right">Conversion Rate</th>
                      <th className="px-4 py-3.5 text-right">Avg Spend</th>
                      <th className="px-4 py-3.5 text-right">30D Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50 text-xs">
                    {stagePerformanceData.filter(s => !selectedStage || s.id === selectedStage).map((s, i) => (
                      <tr key={i} className={`transition-colors cursor-pointer ${selectedStage === s.id ? 'bg-white/10' : 'hover:bg-white/[0.03]'}`} onClick={() => setSelectedStage(selectedStage === s.id ? null : s.id)}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: s.color }} />
                            <span className="text-xs font-extrabold text-white">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs font-black text-white text-right font-mono">{s.fans.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-xs font-bold text-gray-400 text-right">{s.pct}%</td>
                        <td className="px-4 py-3.5 text-xs font-extrabold text-gray-200 text-right">{s.convRate}</td>
                        <td className="px-4 py-3.5 text-xs font-black text-white text-right font-mono">{s.avgSpend}</td>
                        <td className="px-4 py-3.5 text-xs font-black text-right text-neon-green">{s.trend}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="xl:col-span-4 glass-panel flex flex-col shadow-xl">
              <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
                <h3 className="text-xs font-extrabold text-white flex items-center gap-1.5"><Sparkles size={14} className="text-neon-pink"/> AI Recommended Triggers</h3>
                <span className="text-[10px] bg-neon-pink/10 text-neon-pink px-2.5 py-0.5 rounded-full border border-neon-pink/30 font-extrabold">Active AI</span>
              </div>
              <div className="p-4 space-y-3.5 flex-1 overflow-y-auto no-scrollbar max-h-[320px]">
                {recommendedActions.map((action, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3.5 rounded-2xl border border-gray-800 bg-gray-900/40 hover:border-gray-700 transition-all shadow-sm">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={15} style={{ color: action.color }} />
                        <span className="text-xs font-black text-white">{action.title}</span>
                      </div>
                      <span className="text-[9px] font-extrabold text-black px-2 py-0.5 rounded-md shrink-0 uppercase" style={{ backgroundColor: action.color }}>{action.impact} Impact</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{action.desc}</p>
                    <div className="flex justify-between items-center mt-2 pt-2.5 border-t border-gray-800/80">
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Play size={10} className="text-neon-blue"/> {action.type} Sequence</span>
                      {user?.role !== 'VIEWER' && (
                        <button onClick={() => setSelectedWorkflow(action)} className="text-[10px] font-black text-white px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-neon-pink hover:text-white transition-all border border-gray-700 shadow-sm flex items-center gap-1">Execute Trigger <ArrowRight size={12}/></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Conversion Analytics */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-extrabold text-white">Conversion Velocity (Registration to First Purchase)</h3>
                <span className="text-[10px] text-gray-400 font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">{timeframe}</span>
              </div>
              <div className="flex items-end gap-2 mb-4">
                <div className="text-3xl font-black text-white">28.3%</div>
                <div className="text-[10px] text-neon-green font-bold mb-1.5">↑ 4.5% vs previous period</div>
              </div>
              <div className="flex-1 w-full min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="rate" name="Conversion Rate" stroke="#facc15" fillOpacity={1} fill="url(#convGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by Stage */}
            <div className="glass-panel p-5 flex flex-col shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-white">Revenue Generation by Lifecycle Stage</h3>
                <span className="text-[10px] text-neon-blue font-bold">Total MTD Attribution</span>
              </div>
              <div className="flex-1 w-full min-h-[200px] mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByStageData} layout="vertical" margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} width={110} />
                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1f2937' }} />
                    <Bar dataKey="Revenue" radius={[0, 6, 6, 0]} barSize={26}>
                      {revenueByStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'VIP Candidates' ? (
        /* INTERACTIVE VIP CANDIDATES TAB */
        <div className="glass-panel p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-800">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2"><Gift size={18} className="text-yellow-400"/> High-Potential VIP Spenders Directory</h3>
              <p className="text-xs text-gray-400">These active fans have spent $750+ this month and are primed for direct VIP Concierge upgrade.</p>
            </div>
            <span className="text-xs font-black text-neon-green bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">{candidates.length} Ready Candidates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((c, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between space-y-3 hover:border-yellow-400/40 transition-all">
                <div className="flex items-center gap-3">
                  <img src={c.avatar} className="w-12 h-12 rounded-full border border-gray-700" alt=""/>
                  <div>
                    <h4 className="text-sm font-black text-white">{c.name}</h4>
                    <p className="text-xs text-neon-green font-mono font-bold">MTD Spent: {c.spent}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex justify-between border-t border-gray-800 pt-2.5">
                  <span>Tips Given: <strong className="text-white">{c.tips} tips</strong></span>
                  <span>Active: <strong className="text-gray-300">{c.lastActive}</strong></span>
                </div>
                <button 
                  onClick={() => handleUpgradeToVip(c.name)}
                  className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  👑 Grant VIP Spender Status
                </button>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="col-span-3 py-12 text-center text-gray-500 font-bold">All VIP candidates have been processed and upgraded!</div>
            )}
          </div>
        </div>
      ) : (
        /* OTHER TABS WITH LIVE DATA METRICS */
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-center mt-4 border border-gray-800 rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 text-neon-pink shadow-inner">
            <Activity size={28} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">{activeTab} Lifecycle Analytics & Funnel Velocity</h3>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed mb-6">Automated monitoring and performance telemetry for fan {activeTab.toLowerCase()} rate. You are currently tracking <strong className="text-white">18,452 active fans</strong> within this cohort.</p>
          <button onClick={() => { setActiveTab('Activation Stages'); addToast('info', 'Switched View', 'Returned to full funnel view.'); }} className="px-6 py-3 bg-neon-pink text-white font-black text-xs rounded-xl hover:bg-pink-600 transition-all shadow-[0_0_20px_rgba(255,0,85,0.3)]">
            Inspect Full Funnel Stages →
          </button>
        </div>
      )}

      {/* WORKFLOW EXECUTION MODAL */}
      <AnimatePresence>
        {selectedWorkflow && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedWorkflow(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Play size={16} className="text-neon-blue"/>
                  <h3 className="text-base font-black text-white">Execute Automated Workflow</h3>
                </div>
                <button onClick={() => setSelectedWorkflow(null)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>

              <div className="p-3.5 rounded-2xl bg-gray-900 border border-gray-800 space-y-1">
                <h4 className="text-sm font-black text-white">{selectedWorkflow.title}</h4>
                <p className="text-xs text-gray-400">{selectedWorkflow.desc}</p>
                <div className="text-[10px] text-neon-green font-extrabold pt-1">Estimated Conversion Boost: {selectedWorkflow.impact}</div>
              </div>

              <div className="space-y-2 text-xs">
                <label className="font-extrabold text-gray-300 block">Select Incentive Trigger</label>
                {[
                  "🎟️ Attach 20% First-Tip Discount Voucher",
                  "💌 Send Personal VIP Greeting from Top Creator",
                  "⚡ Queue WhatsApp Flash Sale Notification (Next 24 Hours)"
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleExecuteWorkflow(selectedWorkflow)}
                    className="w-full p-3 rounded-xl bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-neon-blue text-left font-bold text-gray-200 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>{opt}</span>
                    <Send size={12} className="text-neon-blue" />
                  </button>
                ))}
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
                <h3 className="text-base font-black text-white flex items-center gap-2"><Filter size={16} className="text-neon-pink"/> Fan Funnel Filters</h3>
                <button onClick={() => setShowFiltersModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-400">Configure segment criteria to filter the 6-stage fan activation tables.</p>
              
              <div className="space-y-3 text-xs pt-1">
                <div>
                  <label className="font-bold text-gray-400 block mb-1">Spend Cohort</label>
                  <select className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-neon-pink">
                    <option>All Spend Tiers ($0 - $1,000+)</option>
                    <option>Free Registered Only ($0)</option>
                    <option>Active Tippers ($1 - $50)</option>
                    <option>Subscribers ($20 - $100)</option>
                    <option>VIP Spenders ($100+)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowFiltersModal(false)} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Reset</button>
                <button onClick={() => { addToast('success', 'Filters Applied', 'Filtered funnel stages by selected cohort.'); setShowFiltersModal(false); }} className="flex-1 py-2.5 bg-neon-pink text-white font-black text-xs rounded-xl shadow-md">Apply Segment</button>
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
                <h3 className="text-base font-black text-white flex items-center gap-2"><Download size={16} className="text-neon-blue"/> Export Funnel Data</h3>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-300">Download comprehensive activation stage conversion data and drop-off analytics for <strong className="text-white font-bold">{timeframe}</strong>.</p>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => { addToast('success', 'CSV Generated', 'Fan_Funnel_Analytics.csv downloaded.'); setShowExportModal(false); }} className="py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-md">Download CSV</button>
                <button onClick={() => { addToast('success', 'PDF Generated', 'Funnel_Conversion_Audit.pdf downloaded.'); setShowExportModal(false); }} className="py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl border border-gray-700">Download PDF</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
