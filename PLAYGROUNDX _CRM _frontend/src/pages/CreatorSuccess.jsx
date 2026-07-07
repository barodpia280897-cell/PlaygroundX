import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, ShieldAlert, Video, UploadCloud, ChevronDown, Filter, Download, Zap, MessageSquare, Mail, MoreHorizontal, CheckCircle, Send, X, UserCheck, DollarSign, Activity, Star, Users, PhoneCall, Gift, HeartHandshake } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { 
  topKpis, healthDonutData, healthTrendData, topIssues, 
  alerts, atRiskCreators 
} from '../data/mock/creatorSuccessData';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

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

export default function CreatorSuccess() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All Risks');
  const [issueFilter, setIssueFilter] = useState('All Issues');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // New interactive states
  const [creatorsList, setCreatorsList] = useState(atRiskCreators);
  const [selectedChatCreator, setSelectedChatCreator] = useState(null);
  const [selectedActionCreator, setSelectedActionCreator] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const filteredCreators = creatorsList.filter(c => {
    if (activeTab === 'At Risk' && c.risk !== 'High') return false;
    if (activeTab === 'Compliance' && !c.issue.includes('KYC') && !c.issue.includes('Verification')) return false;
    if (activeTab === 'Performance' && !c.issue.includes('Revenue') && !c.issue.includes('Engagement')) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.handle.toLowerCase().includes(search.toLowerCase())) return false;
    if (riskFilter !== 'All Risks' && c.risk !== riskFilter) return false;
    if (issueFilter !== 'All Issues' && c.issue !== issueFilter) return false;
    if (deptFilter !== 'All Departments' && c.dept !== deptFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCreators.length / itemsPerPage));
  const displayCreators = filteredCreators.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSendRetentionMessage = (creator, templateText) => {
    addToast('success', 'Retention Offer Sent 🚀', `Dispatched "${templateText}" to ${creator.name} (${creator.handle}).`);
    setSelectedChatCreator(null);
    setChatMessage('');
  };

  const handleResolveRisk = (creatorId, name) => {
    setCreatorsList(prev => prev.map(c => c.name === name ? { ...c, risk: 'Low', score: Math.min(100, c.score + 25), issue: 'Resolved • Healthy' } : c));
    addToast('success', 'Creator Status Restored ⭐', `${name} has been marked healthy and assigned a VIP Account Manager.`);
    setSelectedActionCreator(null);
  };

  return (
    <div className="space-y-4 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Creator Success Center <span className="text-sm font-normal text-muted sm:ml-2">Monitor creator health, engagement and retention</span>
          </h2>
        </motion.div>
        
        <div className="flex items-center gap-3 flex-wrap filter-bar">
          <div className="flex bg-gray-900/80 border border-gray-700 rounded-xl overflow-x-auto no-scrollbar shrink-0 p-1">
            {['Overview', 'At Risk', 'Compliance', 'Performance', 'Growth', 'Retention'].map((t) => (
              <button 
                key={t} 
                onClick={() => { setActiveTab(t); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeTab === t ? 'text-black bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white transition-colors">
              {deptFilter} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-40 bg-gray-950 border border-gray-800 rounded-xl z-30 shadow-2xl overflow-hidden">
              {['All Departments', 'Gaming', 'Music & Arts', 'Lifestyle', 'Tech & Crypto', 'Fitness'].map(d => (
                <button key={d} onClick={() => setDeptFilter(d)} className="w-full text-left px-3.5 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{d}</button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white transition-colors">
              {timeframe} <ChevronDown size={14} />
            </button>
            <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-36 bg-gray-950 border border-gray-800 rounded-xl z-30 shadow-2xl overflow-hidden">
              {['Last 7 Days', 'Last 30 Days', 'This Quarter'].map(tf => (
                <button key={tf} onClick={() => { setTimeframe(tf); addToast('info', 'Timeframe Synced', `Recalculated health trends for ${tf}.`); }} className="w-full text-left px-3.5 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{tf}</button>
              ))}
            </div>
          </div>

          <button onClick={() => setShowFiltersModal(true)} className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-700 bg-gray-900/80 text-xs font-bold text-gray-300 hover:text-white transition-colors shadow-sm">
            <Filter size={14} /> Filters {(riskFilter !== 'All Risks' || issueFilter !== 'All Issues') && <span className="w-2 h-2 rounded-full bg-neon-blue" />}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {topKpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden group hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                <kpi.icon size={16} style={{ color: kpi.color }} />
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400 font-bold mb-0.5">{kpi.label}</div>
              <div className="text-2xl font-black text-white">{kpi.value}</div>
              <div className={`text-[10px] font-bold mt-1`} style={{ color: kpi.color }}>{kpi.change} vs {timeframe.toLowerCase()}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-[300px]">
          {/* Creator Health Score Donut */}
          <div className="glass-panel p-4 w-full xl:w-1/4 flex flex-col shadow-xl">
            <h3 className="text-xs font-bold text-white mb-2">Creator Health Score</h3>
            <div className="flex-1 relative flex items-center justify-center min-h-[150px]">
              <div className="w-full h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={healthDonutData} innerRadius={45} outerRadius={60} dataKey="value" stroke="none" startAngle={180} endAngle={-180}>
                      {healthDonutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                <span className="text-3xl font-black text-white">72</span>
                <span className="text-[10px] text-neon-green font-extrabold uppercase">Healthy Avg</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-bold text-center mt-2 border-t border-gray-800 pt-2">
              Total Monitored Creators: <strong className="text-white">2,184</strong>
            </div>
          </div>

          {/* Creator Health Trend Line */}
          <div className="glass-panel p-4 flex-1 flex flex-col min-w-0 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white">Creator Health Velocity Trend</h3>
              <span className="text-[10px] text-gray-400 font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">{timeframe}</span>
            </div>
            <div className="flex-1 w-full min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={healthTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#00f0ff" strokeWidth={2.5} dot={{ r: 4, fill: '#00f0ff', strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Issues */}
          <div className="glass-panel p-4 w-full xl:w-1/4 flex flex-col min-w-0 overflow-hidden shadow-xl">
            <h3 className="text-xs font-bold text-white mb-4">Top Issues Affecting Creators</h3>
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
              {topIssues.map((issue, i) => (
                <div key={i} onClick={() => { setIssueFilter(issue.issue); setActiveTab('At Risk'); }} className="flex items-center justify-between group cursor-pointer p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: issue.color }} />
                    <span className="text-xs text-gray-300 truncate group-hover:text-white font-medium">{issue.issue}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-bold shrink-0 ml-2">
                    <span className="text-white mr-1 font-black">{issue.count}</span>
                    <span className="text-[10px] font-normal">({issue.pct}%)</span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs text-gray-400 font-bold pt-2 border-t border-gray-800 mt-2">
                <span>Total Active Issues</span>
                <span className="text-neon-pink font-black">238 flagged</span>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="glass-panel p-4 w-full xl:w-1/4 flex flex-col min-w-0 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white">Alerts & Notifications</h3>
              <button onClick={() => addToast('info', 'All Alerts', 'Showing all 14 active retention notifications.')} className="text-[10px] text-neon-blue hover:underline font-bold">View All</button>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {alerts.map((a, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-xl bg-gray-950/40 border border-gray-800/60">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.bg}`}>
                    <AlertTriangle size={14} className={a.color} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white">{a.title}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{a.desc}</div>
                  </div>
                  <div className="text-[9px] text-gray-500 ml-auto font-mono">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Row 3 Table & Sidebars */}
      <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-[420px]">
        {/* At Risk Creators Table */}
        <div className="flex-1 glass-panel flex flex-col min-h-[350px] xl:min-h-0 overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-gray-800 flex items-center justify-between flex-wrap gap-3 bg-gray-950/60">
            <h3 className="text-xs font-extrabold text-white flex items-center gap-2"><AlertTriangle size={15} className="text-red-500" /> Monitored Creators Directory <span className="text-gray-500 font-normal text-[11px]">({filteredCreators.length} results)</span></h3>
            <div className="flex flex-wrap items-center gap-2">
              <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search creators..." className="bg-gray-900 border border-gray-800 rounded-xl py-1.5 px-3 text-xs text-gray-200 focus:outline-none focus:border-neon-blue w-36 font-medium" />
              
              <div className="relative group">
                <button className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition-colors">
                  {riskFilter} <ChevronDown size={12} />
                </button>
                <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-32 bg-gray-950 border border-gray-800 rounded-xl z-20 shadow-2xl overflow-hidden">
                  {['All Risks', 'High', 'Medium', 'Low'].map(r => (
                    <button key={r} onClick={() => { setRiskFilter(r); setCurrentPage(1); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{r}</button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <button className="flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-xs font-bold text-gray-300 hover:text-white transition-colors">
                  {issueFilter} <ChevronDown size={12} />
                </button>
                <div className="absolute top-full right-0 mt-1 hidden group-hover:block w-44 bg-gray-950 border border-gray-800 rounded-xl z-20 shadow-2xl overflow-hidden">
                  {['All Issues', 'No Live Hosted', 'Revenue Dropping', 'Incomplete KYC', 'Low Engagement', 'No Content Uploaded'].map(r => (
                    <button key={r} onClick={() => { setIssueFilter(r); setCurrentPage(1); }} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white">{r}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/40 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3 text-center">Health Score</th>
                  <th className="px-4 py-3 text-center">Risk Level</th>
                  <th className="px-4 py-3">Issue</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Revenue (30D)</th>
                  <th className="px-4 py-3">Trend (30D)</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3 text-center pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50 text-xs">
                {displayCreators.map((c, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <img src={c.avatar} className="w-9 h-9 rounded-full border border-gray-700 shrink-0" alt="" />
                        <div>
                          <div className="text-xs font-extrabold text-white mb-0.5">{c.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{c.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`w-8 h-8 rounded-full border-2 text-xs font-black text-white flex items-center justify-center mx-auto ${c.score < 50 ? 'border-red-500 bg-red-500/10 text-red-400' : c.score < 75 ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400' : 'border-neon-green bg-green-500/10 text-neon-green'}`}>{c.score}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border inline-block ${c.risk === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/30' : c.risk === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 'bg-green-500/10 text-neon-green border-green-500/30'}`}>{c.risk} Risk</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.issueColor || '#ff0055' }} />
                        <span className="text-xs font-bold text-gray-200">{c.issue}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-bold text-gray-300">{c.dept}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-black text-white font-mono">{c.rev}</div>
                      <div className={`text-[10px] font-extrabold mt-0.5 ${c.revTrend?.includes('-') ? 'text-red-400' : 'text-neon-green'}`}>{c.revTrend}</div>
                    </td>
                    <td className="px-4 py-3.5 w-24">
                      <div className="w-full h-5 flex items-end gap-0.5">
                        {(c.sparkline || [40,60,30,80,50,70]).map((val, idx) => (
                          <div key={idx} className="w-2 bg-gradient-to-t from-neon-blue to-purple-500 rounded-t-sm" style={{ height: `${val}%` }} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 font-mono">{c.active}</td>
                    
                    {/* INTERACTIVE TABLE ACTION BUTTONS */}
                    <td className="px-4 py-3.5 text-center pr-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {user?.role !== 'VIEWER' && (
                          <>
                            <button 
                              onClick={() => setSelectedChatCreator(c)}
                              className="p-2 bg-gray-800 hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue rounded-xl border border-gray-700 transition-all shadow-sm"
                              title="Live Chat & Retention Assistance"
                            >
                              <MessageSquare size={14} />
                            </button>
                            <button 
                              onClick={() => addToast('success', 'Email Notice Sent ✉️', `Dispatched VIP check-in email to ${c.name}.`)}
                              className="p-2 bg-gray-800 hover:bg-purple-500/20 text-gray-300 hover:text-purple-400 rounded-xl border border-gray-700 transition-all shadow-sm"
                              title="Send Email Notice"
                            >
                              <Mail size={14} />
                            </button>
                            <button 
                              onClick={() => setSelectedActionCreator(c)}
                              className="p-2 bg-gray-800 hover:bg-green-500/20 text-gray-300 hover:text-neon-green rounded-xl border border-gray-700 transition-all shadow-sm"
                              title="More Action Options"
                            >
                              <MoreHorizontal size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 border-t border-gray-800 flex justify-between items-center text-xs font-bold text-gray-400 bg-gray-950/40">
            <span>Showing {filteredCreators.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCreators.length)} of {filteredCreators.length} creators</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-900 border border-gray-800 hover:bg-gray-800 disabled:opacity-50 font-black">&lt;</button>
              <span className="text-xs font-black text-white px-2.5 py-1 bg-gray-800 rounded-lg">{currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-900 border border-gray-800 hover:bg-gray-800 disabled:opacity-50 font-black">&gt;</button>
            </div>
            <span>5 per page <ChevronDown size={12} className="inline"/></span>
          </div>
        </div>

        {/* Right Sidebar: Recent Activity & Quick Actions */}
        <div className="w-full xl:w-72 shrink-0 flex flex-col gap-4 min-h-0">
          <div className="glass-panel p-4 flex-1 flex flex-col min-h-0 shadow-xl">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
              <h3 className="text-xs font-extrabold text-white">Live Activity Stream</h3>
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            </div>
            <div className="space-y-3.5 flex-1 overflow-y-auto no-scrollbar pr-1">
              {[
                { name: 'Mia Luxe', act: 'uploaded new video content', time: '2m ago', avatar: 'https://i.pravatar.cc/150?img=9' },
                { name: 'Alex Star', act: 'started live stream', time: '15m ago', avatar: 'https://i.pravatar.cc/150?img=11' },
                { name: 'Bella Rose', act: 'completed KYC verification', time: '45m ago', avatar: 'https://i.pravatar.cc/150?img=5' },
                { name: 'Johnny Blaze', act: 'reached $10k MTD milestone', time: '1h ago', avatar: 'https://i.pravatar.cc/150?img=12' },
                { name: 'Luna Starr', act: 'resolved billing hold', time: '2h ago', avatar: 'https://i.pravatar.cc/150?img=1' },
              ].map((r, i) => (
                <div key={i} className="flex gap-2.5">
                  <img src={r.avatar} className="w-7 h-7 rounded-full border border-gray-700 shrink-0" alt="" />
                  <div>
                    <div className="text-xs text-gray-300 leading-snug"><span className="font-extrabold text-white">{r.name}</span> {r.act}</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">{r.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {user?.role !== 'VIEWER' && (
            <div className="glass-panel p-4 flex flex-col shrink-0 shadow-xl">
              <h3 className="text-xs font-extrabold text-white mb-3">Quick Retention Triggers</h3>
              <div className="space-y-2">
                {[
                  { label: 'Send Announcement Blast', icon: Mail, color: 'text-blue-400', bg: 'bg-blue-400/10', action: () => addToast('success', 'Announcement Sent', 'Broadcasted VIP tips & guides to all active creators.') },
                  { label: 'Trigger KYC Reminder', icon: ShieldAlert, color: 'text-yellow-400', bg: 'bg-yellow-400/10', action: () => addToast('info', 'KYC Reminders Queued', 'Sent verification reminders to 14 pending accounts.') },
                  { label: 'Content Upload Reminder', icon: UploadCloud, color: 'text-amber-500', bg: 'bg-amber-500/10', action: () => addToast('success', 'Upload Reminders Sent', 'Notified 32 creators with no uploads in last 7 days.') },
                  { label: 'Schedule Live Strategy Session', icon: Video, color: 'text-purple-400', bg: 'bg-purple-400/10', action: () => addToast('info', 'Strategy Sessions Open', 'Invited Top 50 Creators to 1-on-1 strategy call.') },
                  { label: 'Creator Feedback Survey', icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-400/10', action: () => addToast('success', 'Survey Dispatched', 'Sent quarterly satisfaction survey via SMS & WhatsApp.') },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} className="w-full flex items-center gap-3 p-2 bg-gray-900 border border-gray-800 hover:border-neon-blue/40 rounded-xl transition-all text-xs font-bold text-gray-200 hover:text-white text-left shadow-sm group">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${btn.bg}`}>
                      <btn.icon size={14} className={btn.color} />
                    </div>
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW: LIVE CREATOR ASSISTANCE & RETENTION CHAT MODAL */}
      <AnimatePresence>
        {selectedChatCreator && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedChatCreator(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <img src={selectedChatCreator.avatar} className="w-10 h-10 rounded-full border border-gray-700" alt=""/>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedChatCreator.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">{selectedChatCreator.handle} • {selectedChatCreator.risk} Risk ({selectedChatCreator.score} Health)</p>
                  </div>
                </div>
                <button onClick={() => setSelectedChatCreator(null)} className="text-gray-400 hover:text-white p-1.5 bg-gray-900 rounded-full"><X size={16}/></button>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-2xl text-xs text-red-300 font-medium">
                ⚠️ <strong className="text-white font-bold">Primary Retention Flag:</strong> {selectedChatCreator.issue}. Revenue trend: {selectedChatCreator.revTrend}.
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-gray-300 block">Quick Retention Offer Templates</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "🎁 Offer +5% Revenue Share Bonus for next 30 days if they host 3 live streams.",
                    "🛡️ Send Priority KYC & Stripe Account Verification link to resolve hold.",
                    "📞 Schedule 1-on-1 Strategy Call with VIP Creator Success Manager.",
                    "💬 Send personal WhatsApp check-in: 'Hi, noticed drop in engagement, how can we help?'"
                  ].map((tpl, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendRetentionMessage(selectedChatCreator, tpl)}
                      className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-neon-blue text-xs text-gray-300 hover:text-white text-left font-medium transition-all flex items-center justify-between group"
                    >
                      <span>{tpl}</span>
                      <Send size={12} className="text-neon-blue opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-gray-400 block mb-1">Or Type Custom Message / Offer</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type custom message for creator..." 
                    value={chatMessage}
                    onChange={e => setChatMessage(e.target.value)}
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-neon-blue"
                  />
                  <button 
                    onClick={() => handleSendRetentionMessage(selectedChatCreator, chatMessage || "Personal check-in")}
                    disabled={!chatMessage}
                    className="px-5 py-2.5 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50"
                  >
                    Send 🚀
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: MORE ACTION OPTIONS MODAL */}
      <AnimatePresence>
        {selectedActionCreator && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedActionCreator(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><UserCheck size={16} className="text-neon-green"/> Creator Action Menu</h3>
                <button onClick={() => setSelectedActionCreator(null)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-300">Choose management action for <strong className="text-white font-bold">{selectedActionCreator.name}</strong> ({selectedActionCreator.dept}).</p>

              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => handleResolveRisk(selectedActionCreator.id, selectedActionCreator.name)}
                  className="w-full py-3 bg-green-500/20 hover:bg-green-500/30 text-neon-green border border-green-500/40 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={14}/> Mark Risk Resolved & Restore Health
                </button>
                <button 
                  onClick={() => { addToast('info', 'Manager Assigned', `Assigned Senior VIP Concierge agent to ${selectedActionCreator.name}.`); setSelectedActionCreator(null); }}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold border border-gray-700 flex items-center justify-center gap-2"
                >
                  <Users size={14}/> Assign Dedicated Account Manager
                </button>
                <button 
                  onClick={() => { addToast('success', 'Strategy Call Scheduled 📅', `Booked strategy call with ${selectedActionCreator.name} for tomorrow 2 PM.`); setSelectedActionCreator(null); }}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-purple-400 rounded-xl text-xs font-bold border border-gray-700 flex items-center justify-center gap-2"
                >
                  <PhoneCall size={14}/> Schedule 1-on-1 Strategy Call
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: FILTERS MODAL */}
      <AnimatePresence>
        {showFiltersModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowFiltersModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Filter size={16} className="text-neon-blue"/> Creator Filters</h3>
                <button onClick={() => setShowFiltersModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-400 block mb-1">Risk Severity</label>
                  <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option value="All Risks">All Risk Severities</option>
                    <option value="High">High Risk Only</option>
                    <option value="Medium">Medium Risk Only</option>
                    <option value="Low">Low Risk / Healthy</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-400 block mb-1">Primary Flagged Issue</label>
                  <select value={issueFilter} onChange={e => setIssueFilter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option value="All Issues">All Flagged Issues</option>
                    <option value="No Live Hosted">No Live Hosted</option>
                    <option value="Revenue Dropping">Revenue Dropping</option>
                    <option value="Incomplete KYC">Incomplete KYC</option>
                    <option value="Low Engagement">Low Engagement</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => { setRiskFilter('All Risks'); setIssueFilter('All Issues'); setDeptFilter('All Departments'); setSearch(''); setShowFiltersModal(false); }} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Reset</button>
                <button onClick={() => setShowFiltersModal(false)} className="flex-1 py-2.5 bg-neon-blue text-black font-black text-xs rounded-xl shadow-md">Apply Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
