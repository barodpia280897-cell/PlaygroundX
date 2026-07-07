import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, MessageSquare, CheckCircle, XCircle, AlertTriangle, TrendingUp, ChevronDown, Filter, Download, Phone, Mail, Eye, Info, User, Clock, FileText, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import QAReviewModal from '../components/modals/QAReviewModal';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';
import { 
  kpiData, deptPerformance, leaderboard, trendData, 
  reviewQueues, complianceData, topIssues, failedEvals, bottomAgents 
} from '../data/mock/qaData';
import { useAuth } from '../contexts/AuthContext';

export default function QualityAssurance() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [openDropdown, setOpenDropdown] = useState(null);
  const { addToast } = useToast();
  
  const [qaConversations, setQaConversations] = useDataStore('qaConversations');
  const [qaCalls, setQaCalls] = useDataStore('qaCalls');
  const [qaEmails, setQaEmails] = useDataStore('qaEmails');
  const [qaHandovers, setQaHandovers] = useDataStore('qaHandovers');
  const [qaEscalations, setQaEscalations] = useDataStore('qaEscalations');
  const [qaScorecards, setQaScorecards] = useDataStore('qaScorecards');
  const [qaCoaching, setQaCoaching] = useDataStore('qaCoaching');

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const openReview = (item) => {
    setSelectedReview(item);
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (updatedReview) => {
    // Basic mock update logic: find which array it belongs to and update
    // For now we just close to simulate save
    setIsReviewModalOpen(false);
  };

  const goToReviewQueue = (title) => {
    const map = {
      'Call Reviews': 'Calls',
      'WhatsApp Reviews': 'Conversations',
      'Email Reviews': 'Emails',
      'AI Handovers': 'AI Handovers',
      'Escalation Audits': 'Escalations'
    };
    setActiveTab(map[title] || 'Overview');
  };

  const toggle = (id) => setOpenDropdown(prev => prev === id ? null : id);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    const handleClick = () => setOpenDropdown(null);
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const typeIcons = { WhatsApp: MessageSquare, Call: Phone, Email: Mail, 'AI Handoff': MessageSquare, Escalation: ShieldCheck };
  const typeColors = { WhatsApp: 'text-neon-green', Call: 'text-blue-500', Email: 'text-purple-500', 'AI Handoff': 'text-cyan-400', Escalation: 'text-amber-500' };

  return (
    <div className="space-y-6 pb-10">
      <ReportHeaderBanner
        title="Quality Assurance (QA) & Compliance Report"
        subtitle="Monitor service quality, script adherence, KYC verification, and negative sentiment flags"
        measures="Measures call/chat audit scores, SLA compliance, negative feedback spikes, and agent script fidelity."
        audience="QA Auditors, Legal Compliance Officers & Team Leads"
      />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
              <ShieldCheck size={26} className="text-neon-blue" />
              Quality Assurance Center
            </h2>
          </div>
          <p className="text-sm text-muted mt-0.5">Monitor quality, ensure compliance and improve performance</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap" onClick={e => e.stopPropagation()}>
          <div className="flex items-center bg-gray-900/50 border border-gray-700 rounded-xl px-1 overflow-hidden">
            {['Overview', 'Conversations', 'Calls', 'Emails', 'AI Handovers', 'Escalations', 'Scorecards', 'Coaching', 'Reports'].map((t, i) => (
              <button key={i} onClick={() => setActiveTab(t)} className={`px-3 py-2 text-xs font-bold transition-all whitespace-nowrap ${activeTab === t ? 'text-neon-blue bg-white/5 border-b-2 border-neon-blue' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{t}</button>
            ))}
          </div>
          
          <div className="relative">
            <button onClick={() => toggle('dept')} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-colors whitespace-nowrap">
              All Departments <ChevronDown size={14} className="text-gray-500" />
            </button>
            {openDropdown === 'dept' && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl p-2 z-20 shadow-xl" onClick={e=>e.stopPropagation()}>
                {['All Departments', 'English Team', 'Spanish Team', 'French Team', 'Arabic Team'].map(o => (
                  <button key={o} onClick={() => toggle(null)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs text-gray-300 hover:text-white">{o}</button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <button onClick={() => toggle('date')} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-colors whitespace-nowrap">
              Last 30 Days <ChevronDown size={14} className="text-gray-500" />
            </button>
            {openDropdown === 'date' && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl p-2 z-20 shadow-xl" onClick={e=>e.stopPropagation()}>
                {['Last 7 Days', 'Last 30 Days', 'This Quarter', 'This Year'].map(o => (
                  <button key={o} onClick={() => toggle(null)} className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg text-xs text-gray-300 hover:text-white">{o}</button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => addToast('info', 'QA Filters', 'Advanced filter panel: filter by agent, score range, or issue type.')} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-colors whitespace-nowrap">
            <Filter size={14} /> Filters
          </button>
          <button onClick={() => addToast('success', 'QA Report Exported', 'Quality Assurance report has been exported to CSV.')} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-colors whitespace-nowrap">
            <Download size={14} /> Export
          </button>
        </div>
      </motion.div>

      {activeTab === 'Overview' && (
        <>
          {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            className={`glass-panel p-4 border-t-2 ${kpi.border} flex flex-col justify-between`}>
            <div className="flex justify-between items-start mb-2">
              <div className={`w-8 h-8 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                <kpi.icon size={16} className={kpi.color} />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
                {kpi.sub && <span className="text-xs text-gray-400 font-medium">{kpi.sub}</span>}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px]">
              <span className={`font-bold ${kpi.isNeg ? 'text-red-500' : 'text-neon-green'}`}>{kpi.change}</span>
              <span className="text-gray-500">vs last 30 days</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Tables & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* QA Score by Department */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">QA Score by Department</h3>
          </div>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Department', 'QA Score', 'vs Last 30 Days', 'Evaluated', 'Trend (30D)'].map(h => (
                    <th key={h} className="pb-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {deptPerformance.map((dept, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-[11px] font-medium text-gray-300">
                      <span className="mr-1.5 text-[14px]">{dept.flag}</span> {dept.name}
                    </td>
                    <td className="py-2 text-[11px] font-bold text-neon-green">{dept.score}</td>
                    <td className="py-2 text-[10px] font-medium text-neon-green">{dept.vs}</td>
                    <td className="py-2 text-[11px] text-gray-400">{dept.eval}</td>
                    <td className="py-2">
                      <svg width="30" height="10" viewBox="0 0 30 10" fill="none">
                        <path d="M1 8L8 4L15 6L22 2L29 3" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="29" cy="3" r="1.5" fill="#39ff14"/>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => setActiveTab('Reports')} className="w-full mt-2 text-[10px] text-neon-blue font-bold hover:underline">View full department report →</button>
        </div>

        {/* Agent QA Leaderboard */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Agent QA Leaderboard</h3>
            <button onClick={() => setActiveTab('Scorecards')} className="text-[10px] text-neon-blue hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[300px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Rank', 'Agent', 'QA Score', 'Evaluated', 'Trend (30D)'].map(h => (
                    <th key={h} className="pb-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {leaderboard.map((agent, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-[10px] text-gray-500 font-bold">{agent.rank}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <img src={agent.avatar} className="w-5 h-5 rounded-full border border-gray-700" alt="" />
                        <span className="text-[11px] font-bold text-gray-200">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-[11px] font-bold text-neon-green">{agent.score}</td>
                    <td className="py-2 text-[11px] text-gray-400">{agent.eval}</td>
                    <td className="py-2">
                      <svg width="30" height="10" viewBox="0 0 30 10" fill="none">
                        <path d="M1 8L8 4L15 6L22 2L29 3" stroke="#39ff14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="29" cy="3" r="1.5" fill="#39ff14"/>
                      </svg>
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-gray-800/80">
                  <td colSpan="5" className="py-2 text-center text-[10px] text-gray-600 font-bold tracking-widest">...</td>
                </tr>
                <tr>
                  <td className="py-2 text-[10px] text-gray-500 font-bold">48</td>
                  <td className="py-2 text-[11px] font-bold text-gray-200">Johnny Blaze</td>
                  <td className="py-2 text-[11px] font-bold text-amber-500">86.1%</td>
                  <td className="py-2 text-[11px] text-gray-400">89</td>
                  <td className="py-2">
                    <svg width="30" height="10" viewBox="0 0 30 10" fill="none">
                      <path d="M1 2L8 6L15 4L22 8L29 7" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button className="w-full mt-2 text-[10px] text-neon-blue font-bold hover:underline">View full leaderboard →</button>
        </div>

        {/* QA Score Trend */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">QA Score Trend</h3>
            <span className="text-[10px] text-gray-400">Last 30 Days <ChevronDown size={10} className="inline" /></span>
          </div>
          <div className="flex-1 w-full min-h-[150px] -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2, fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} />
                <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 2, fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Overall QA Score</div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded-full bg-neon-green"></span> Passed</div>
            <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase"><span className="w-2 h-2 rounded-full bg-red-500"></span> Failed</div>
          </div>
        </div>

      </div>

      {/* Row 3: Review Queues & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        {/* Review Queues */}
        <div className="lg:col-span-3 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Review Queues</h3>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
            {reviewQueues.map((q, i) => (
              <div key={i} className={`p-3 rounded-xl border border-gray-800 ${q.bg} flex flex-col`}>
                <div className="flex items-center gap-2 mb-2">
                  <q.icon size={12} className={q.color} />
                  <span className="text-[10px] font-bold text-white truncate">{q.title}</span>
                </div>
                <div className="text-2xl font-black text-white">{q.count}</div>
                <div className="text-[9px] text-gray-400 mb-2">Pending Reviews</div>
                
                <div className="flex flex-col gap-1 text-[9px] mt-auto">
                  <div className="flex justify-between text-gray-300"><span>Critical</span><span className="text-white font-bold">{q.critical}</span></div>
                  <div className="flex justify-between text-gray-300"><span>High</span><span className="text-white font-bold">{q.high}</span></div>
                  <div className="flex justify-between text-gray-300"><span>Medium</span><span className="text-white font-bold">{q.medium}</span></div>
                </div>
                
                {user?.role !== 'VIEWER' && (
                  <button onClick={() => goToReviewQueue(q.title)} className={`mt-3 w-full py-1.5 rounded-lg border text-[10px] font-bold bg-gray-900/50 hover:bg-white/10 transition-colors ${q.border} ${q.color}`}>
                    Review {q.title.split(' ')[0]}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="lg:col-span-1 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Compliance Overview</h3>
            <button onClick={() => setActiveTab('Reports')} className="text-[10px] text-neon-blue hover:underline">View All</button>
          </div>
          <div className="flex items-center justify-center relative w-full h-32 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complianceData} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                  {complianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-white">96.1%</span>
              <span className="text-[8px] text-gray-400 font-bold uppercase text-center leading-tight">Compliance</span>
            </div>
          </div>
          <div className="space-y-2 text-[10px] flex-1">
            {complianceData.map((d,i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                  {d.name}
                </div>
                <div className="font-bold text-white">{d.value}%</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[9px] text-gray-500 text-center border-t border-gray-800 pt-2">
            Total Evaluated: <span className="text-white">3,842</span>
          </div>
        </div>

        {/* Top QA Issues */}
        <div className="lg:col-span-1 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Top QA Issues</h3>
            <span className="text-[10px] text-gray-400">Last 30 Days</span>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">
            {topIssues.map((issue, i) => (
              <div key={i} className="flex items-center text-[10px]">
                <div className="flex-1 text-gray-300 truncate pr-2" title={issue.label}>{issue.label}</div>
                <div className="w-6 text-right font-bold text-white">{issue.count}</div>
                <div className="w-10 text-right text-gray-500">({issue.pct}%)</div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-[10px] font-bold">
              <span className="text-gray-400">Total Issues</span>
              <span className="text-white">295</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Failed Evaluations & Coaching */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Recent Failed Evaluations */}
        <div className="lg:col-span-2 glass-panel p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Failed Evaluations</h3>
            <button onClick={() => setActiveTab('Coaching')} className="text-[10px] text-neon-blue hover:underline">View all failed evaluations →</button>
          </div>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Interaction ID', 'Type', 'Agent', 'Issue', 'Score', 'Date/Time', 'Actions'].map(h => (
                    <th key={h} className="pb-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {failedEvals.map((evalItem, i) => {
                  const Icon = typeIcons[evalItem.type];
                  return (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-2 text-[10px] font-medium text-gray-300">{evalItem.id}</td>
                      <td className="py-2">
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <Icon size={10} className={typeColors[evalItem.type]} />
                          <span className="text-gray-300">{evalItem.type}</span>
                        </div>
                      </td>
                      <td className="py-2 text-[11px] font-bold text-gray-200">{evalItem.agent}</td>
                      <td className="py-2 text-[10px] text-gray-400">{evalItem.issue}</td>
                      <td className="py-2 text-[10px] font-black text-red-500">{evalItem.score}</td>
                      <td className="py-2 text-[9px] text-gray-500">{evalItem.date}</td>
                      <td className="py-2 text-[10px]">
                        <button className="text-gray-400 hover:text-white transition-colors" title="View details"><Eye size={14}/></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coaching & Training */}
        <div className="lg:col-span-1 glass-panel p-4 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4">Coaching & Training</h3>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-gray-300"><div className="w-4 h-4 bg-purple-500/20 text-purple-400 rounded flex items-center justify-center font-black">A</div> Agents with Coaching</div>
              <span className="font-bold text-white">128</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-gray-300"><div className="w-4 h-4 bg-red-500/20 text-red-500 rounded flex items-center justify-center font-black">O</div> Overdue Coaching</div>
              <span className="font-bold text-white">28</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-gray-300"><div className="w-4 h-4 bg-amber-500/20 text-amber-500 rounded flex items-center justify-center font-black">D</div> Due This Week</div>
              <span className="font-bold text-white">37</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2 text-gray-300"><div className="w-4 h-4 bg-neon-green/20 text-neon-green rounded flex items-center justify-center font-black">C</div> Completed (This 30 Days)</div>
              <span className="font-bold text-white">96</span>
            </div>
          </div>
          {user?.role !== 'VIEWER' && (
            <button onClick={() => setActiveTab('Coaching')} className="w-full mt-4 py-2 border border-neon-blue/30 rounded-lg text-[10px] text-neon-blue font-bold hover:bg-neon-blue/10 transition-colors flex items-center justify-center gap-2">
              Manage Coaching <span className="text-[14px]">↗</span>
            </button>
          )}
        </div>

        {/* Bottom Performing Agents */}
        <div className="lg:col-span-1 glass-panel p-4 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4">Bottom Performing Agents</h3>
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[200px]">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Agent', 'QA Score', 'Trend'].map(h => (
                    <th key={h} className="pb-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {bottomAgents.map((agent, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] text-gray-600">{agent.rank}</span>
                        <img src={agent.avatar} className="w-4 h-4 rounded-full border border-gray-700" alt="" />
                        <span className="text-[10px] font-bold text-gray-200 truncate max-w-[80px] block" title={agent.name}>{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-2 text-[10px] font-bold text-gray-300">{agent.score}</td>
                    <td className="py-2">
                      <svg width="25" height="10" viewBox="0 0 25 10" fill="none">
                        <path d="M1 2L7 6L13 4L19 8L24 7" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      </>
      )}

      {/* Tab Contents */}
      {activeTab === 'Conversations' && (
        <div className="glass-panel p-4 flex flex-col mt-4">
          <h3 className="text-sm font-bold text-white mb-4">Chat Transcripts</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Interaction ID</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Agent</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Lead</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Score</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {qaConversations?.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-[11px] text-gray-300">{item.id}</td>
                    <td className="py-3 text-[11px] font-bold text-white">{item.agent}</td>
                    <td className="py-3 text-[11px] text-gray-400">{item.lead}</td>
                    <td className="py-3 text-[11px] font-bold text-neon-green">{item.score || '-'}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 border border-gray-700 text-gray-300">{item.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      {user?.role !== 'VIEWER' && (
                        <button onClick={() => openReview(item)} className="px-3 py-1.5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 text-[10px] font-bold text-neon-blue hover:bg-neon-blue hover:text-black transition-colors">Review Chat</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Calls' && (
        <div className="glass-panel p-4 flex flex-col mt-4">
          <h3 className="text-sm font-bold text-white mb-4">Recorded Calls</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Interaction ID</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Agent</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Duration</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Score</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Sentiment</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {qaCalls?.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-[11px] text-gray-300">{item.id}</td>
                    <td className="py-3 text-[11px] font-bold text-white">{item.agent}</td>
                    <td className="py-3 text-[11px] text-gray-400">{item.duration}</td>
                    <td className="py-3 text-[11px] font-bold text-neon-green">{item.score || '-'}</td>
                    <td className="py-3 text-[11px] text-gray-300">{item.sentiment}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 border border-gray-700 text-gray-300">{item.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      {user?.role !== 'VIEWER' && (
                        <button onClick={() => openReview(item)} className="px-3 py-1.5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 text-[10px] font-bold text-neon-blue hover:bg-neon-blue hover:text-black transition-colors">Review Call</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Emails' && (
        <div className="glass-panel p-4 flex flex-col mt-4">
          <h3 className="text-sm font-bold text-white mb-4">Emails</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Interaction ID</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Agent</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Subject</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Response Time</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {qaEmails?.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-[11px] text-gray-300">{item.id}</td>
                    <td className="py-3 text-[11px] font-bold text-white">{item.agent}</td>
                    <td className="py-3 text-[11px] text-gray-400 max-w-[200px] truncate">{item.subject}</td>
                    <td className="py-3 text-[11px] font-bold text-gray-300">{item.responseTime}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 border border-gray-700 text-gray-300">{item.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      {user?.role !== 'VIEWER' && (
                        <button onClick={() => openReview(item)} className="px-3 py-1.5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 text-[10px] font-bold text-neon-blue hover:bg-neon-blue hover:text-black transition-colors">Review Email</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'AI Handovers' && (
        <div className="glass-panel p-4 flex flex-col mt-4">
          <h3 className="text-sm font-bold text-white mb-4">AI Handovers</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Interaction ID</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Agent</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Reason</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Outcome</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {qaHandovers?.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-[11px] text-gray-300">{item.id}</td>
                    <td className="py-3 text-[11px] font-bold text-white">{item.agent}</td>
                    <td className="py-3 text-[11px] text-gray-400">{item.reason}</td>
                    <td className="py-3 text-[11px] font-bold text-neon-green">{item.outcome}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 border border-gray-700 text-gray-300">{item.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      {user?.role !== 'VIEWER' && (
                        <button onClick={() => openReview(item)} className="px-3 py-1.5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 text-[10px] font-bold text-neon-blue hover:bg-neon-blue hover:text-black transition-colors">Review AI</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Escalations' && (
        <div className="glass-panel p-4 flex flex-col mt-4">
          <h3 className="text-sm font-bold text-white mb-4">Escalations</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Interaction ID</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Agent</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Supervisor</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Priority</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Status</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {qaEscalations?.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-[11px] text-gray-300">{item.id}</td>
                    <td className="py-3 text-[11px] font-bold text-white">{item.agent}</td>
                    <td className="py-3 text-[11px] text-gray-400">{item.supervisor}</td>
                    <td className="py-3 text-[11px] font-bold text-red-500">{item.priority}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 border border-gray-700 text-gray-300">{item.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      {user?.role !== 'VIEWER' && (
                        <button onClick={() => openReview(item)} className="px-3 py-1.5 rounded-lg border border-neon-blue/30 bg-neon-blue/10 text-[10px] font-bold text-neon-blue hover:bg-neon-blue hover:text-black transition-colors">Review Escalation</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Scorecards' && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {qaScorecards?.map((item, i) => (
            <div key={i} className="glass-panel p-4 flex flex-col hover:border-neon-blue/50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center"><User size={14}/></div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.agent}</h4>
                    <span className="text-[10px] text-gray-500">Scorecard ID: {item.id}</span>
                  </div>
                </div>
                <div className="text-xl font-black text-neon-green">{item.finalScore}%</div>
              </div>
              <div className="space-y-2 flex-1 border-t border-gray-800 pt-3">
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">Communication</span><span className="font-bold text-white">{item.communication}%</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">Product Knowledge</span><span className="font-bold text-white">{item.productKnowledge}%</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">Compliance</span><span className="font-bold text-white">{item.compliance}%</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">Tone</span><span className="font-bold text-white">{item.tone}%</span></div>
                <div className="flex justify-between text-[11px]"><span className="text-gray-400">Resolution</span><span className="font-bold text-white">{item.resolution}%</span></div>
              </div>
              <button className="mt-4 w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white transition-colors">
                View Full Scorecard
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Coaching' && (
        <div className="glass-panel p-4 flex flex-col mt-4">
          <h3 className="text-sm font-bold text-white mb-4">Coaching Sessions</h3>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Agent</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Coach</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Topic</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Progress</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase">Due Date</th>
                  <th className="pb-3 text-[10px] font-bold text-gray-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {qaCoaching?.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-[11px] font-bold text-white">{item.agent}</td>
                    <td className="py-3 text-[11px] text-gray-400">{item.coach}</td>
                    <td className="py-3 text-[11px] text-gray-300">{item.topic}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${item.progress === 100 ? 'bg-neon-green' : 'bg-neon-blue'}`} style={{ width: `${item.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] text-gray-400">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-[11px] text-gray-400">{item.dueDate}</td>
                    <td className="py-3 text-right">
                      <button className="px-3 py-1.5 rounded-lg border border-gray-700 bg-gray-900/50 text-[10px] font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">Coaching Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-panel p-5 flex flex-col min-h-[300px]">
            <h3 className="text-sm font-bold text-white mb-4">Department QA Performance</h3>
            <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '10px' }} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-panel p-5 flex flex-col min-h-[300px]">
             <h3 className="text-sm font-bold text-white mb-4">Pass vs Fail Trend</h3>
             <div className="flex-1 w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '10px' }} />
                  <Line type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981' }} />
                  <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 2, fill: '#ef4444' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <QAReviewModal open={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} review={selectedReview} onSave={handleSaveReview} />
    </div>
  );
}
