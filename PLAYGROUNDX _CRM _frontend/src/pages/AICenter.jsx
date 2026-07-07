import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Headphones, MessageCircle, Clock, DollarSign, Bot, AlertTriangle, ShieldCheck, Trophy, BookOpen, Settings, AlertOctagon, Hand, Brain, Globe, ChevronDown, Filter, TrendingUp, LayoutDashboard, FileText, Code, Network, Activity, Workflow } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { topQuestionsData, sentimentTrendData, channelData } from '../data/mock/aiCenterData';

export default function AICenter() {
  const { user } = useAuth();
  const [aiLiveActivity] = useDataStore('aiLiveActivity');
  const [aiEscalations] = useDataStore('aiEscalations');
  const [escTab, setEscTab] = useState('All');
  const [activeTab, setActiveTab] = useState('dashboard');
  const { addToast } = useToast();

  const [testInput, setTestInput] = useState('');
  const [testReply, setTestReply] = useState(null);
  const [promptsList, setPromptsList] = useState([
    { id: 1, title: 'Creator VIP Onboarding Concierge', desc: 'Guides new creators through KYC & studio setup with enthusiastic tone.', active: true, uses: '1,420' },
    { id: 2, title: 'Billing & Revenue Specialist', desc: 'Explains 80/20 revenue splits, instant payouts, and wire transfer schedules.', active: true, uses: '890' },
    { id: 3, title: 'Multilingual VIP Assistant', desc: 'Automatically detects language and responds in fluent Spanish, Portuguese, or Hindi.', active: true, uses: '650' },
    { id: 4, title: 'De-escalation & Retention Bot', desc: 'Apologizes for technical glitches and offers $25 VIP promo credits to retain fans.', active: true, uses: '310' },
    { id: 5, title: 'Sales Fast-Track Closer', desc: 'Qualifies leads with >10k IG followers and immediately schedules live video calls.', active: true, uses: '1,150' },
    { id: 6, title: 'Compliance & KYC Verifier', desc: 'Checks ID documents and explains age verification requirements clearly.', active: false, uses: '2,100' }
  ]);
  const [automationRules, setAutomationRules] = useState([
    { id: 1, title: 'Urgent Payment Failure Alert', trigger: 'IF AI detects intent "Payment Failed"', action: 'Tag chat #Urgent + Notify Finance in Slack + SMS Lead', active: true },
    { id: 2, title: 'High-Value Creator Lead Capture', trigger: 'IF Lead mentions followers > 50,000', action: 'Assign to James Harrington (CEO) + Schedule VIP Video Call', active: true },
    { id: 3, title: 'After-Hours Auto-Responder', trigger: 'IF inbound message between 10 PM - 6 AM', action: 'Send after-hours greeting + Create Priority Ticket for morning queue', active: true },
    { id: 4, title: 'KYC Rejection Follow-up', trigger: 'IF document verification fails', action: 'Send automated WhatsApp guide with photo tips + Set 24h timer', active: true }
  ]);
  const [docList, setDocList] = useState([
    { id: 1, name: 'acme-docs/faq.pdf', status: 'Active', time: '2h ago' },
    { id: 2, name: 'vip_terms_and_conditions_2026.docx', status: 'Active', time: 'Yesterday' },
    { id: 3, name: 'https://playgroundx.com/pricing', status: 'Active', time: '3d ago' }
  ]);
  const [newUrl, setNewUrl] = useState('');

  const handleAction = (msg) => {
    addToast('info', 'Action Triggered', msg);
  };

  const filteredEscalations = aiEscalations?.filter(e => {
    if (escTab === 'All') return true;
    if (escTab === 'High Priority') return e.priority === 'High';
    if (escTab === 'VIP') return false; // mockup
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 h-full min-h-0">
      
      {/* Horizontal Tabs */}
      <div className="w-full shrink-0 flex flex-col gap-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">AI Command Center</h3>
        <div className="flex flex-row overflow-x-auto no-scrollbar gap-2 pb-1">
          <button onClick={() => setActiveTab('dashboard')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('knowledge-base')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'knowledge-base' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <BookOpen size={16} /> Knowledge Base
          </button>
          <button onClick={() => setActiveTab('training')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'training' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <Brain size={16} /> AI Training
          </button>
          <button onClick={() => setActiveTab('prompt-library')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'prompt-library' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <Code size={16} /> Prompt Library
          </button>
          <button onClick={() => setActiveTab('handoff-rules')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'handoff-rules' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <Network size={16} /> Handoff Rules
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <Activity size={16} /> AI Analytics
          </button>
          <button onClick={() => setActiveTab('automation')} className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'automation' ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30' : 'text-gray-400 hover:text-white hover:bg-gray-900 border border-transparent'}`}>
            <Workflow size={16} /> Automation Rules
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 bg-gray-950/50 rounded-2xl border border-gray-800 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            AI Center <span className="text-sm font-normal text-muted sm:ml-2">Monitor, analyze and optimize AI performance in real-time</span>
          </h2>
        </motion.div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => handleAction('Language selector opened')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            All Languages <ChevronDown size={14} />
          </button>
          <button onClick={() => handleAction('Date picker opened')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            May 14 - May 20, 2025 <ChevronDown size={14} />
          </button>
          <button onClick={() => handleAction('Filters opened')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            <Filter size={14} /> Filters <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Questions Answered', value: '2,451', change: '↑ 18.6% vs yesterday', color: 'text-neon-purple', icon: MessageSquare },
          { label: 'AI Resolution Rate', value: '98.3%', change: '↑ 2.4% vs yesterday', color: 'text-neon-green', icon: CheckCircle },
          { label: 'Escalated to Agents', value: '42', change: '↓ 12.5% vs yesterday', color: 'text-red-500', icon: Headphones, changeColor: 'text-red-500' },
          { label: 'Conversations Handled', value: '1,864', change: '↑ 16.1% vs yesterday', color: 'text-neon-blue', icon: MessageCircle },
          { label: 'Avg. Response Time', value: '2.4s', change: '↓ 0.6s vs yesterday', color: 'text-neon-pink', icon: Clock, changeColor: 'text-red-500' },
          { label: 'Cost Saved (Est.)', value: '$1,245', change: '↑ 22.8% vs yesterday', color: 'text-neon-green', icon: DollarSign },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[11px] text-gray-400 font-bold">{k.label}</span>
              <k.icon size={16} className={k.color} />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{k.value}</div>
              <div className={`text-[10px] mt-1 ${k.changeColor || 'text-neon-green'}`}>{k.change}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 2: Live Activity, Top Questions, AI Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live AI Activity */}
        <div className="lg:col-span-5 glass-panel p-4 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">Live AI Activity</h3>
              <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded border border-neon-green/30 text-neon-green bg-neon-green/10">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> Live
              </span>
            </div>
          </div>
          <div className="flex flex-1 gap-4">
            <div className="hidden md:flex flex-col items-center justify-center w-1/3 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
               <Bot size={64} className="text-neon-blue drop-shadow-glow-blue mb-4" />
               <div className="text-[10px] text-gray-400 text-center">AI is currently handling <span className="text-neon-pink font-bold">128</span> conversations</div>
            </div>
            <div className="flex-1 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse table-auto min-w-[300px]">
                <tbody className="divide-y divide-gray-800/50">
                  {aiLiveActivity?.map((item, i) => (
                    <tr key={i} className="hover:bg-white/[0.02]">
                      <td className="py-2 pr-2 text-[9px] text-gray-500 whitespace-nowrap">{item.time}</td>
                      <td className="py-2 pr-2 text-[10px] font-bold text-gray-300 whitespace-nowrap">
                        {item.flag} {item.lead}
                      </td>
                      <td className="py-2 pr-2 text-[10px] text-gray-400 w-full min-w-[150px]">
                        <div className="line-clamp-2" title={item.question}>{item.question}</div>
                      </td>
                      <td className="py-2 pl-2 text-right whitespace-nowrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${item.status === 'AI Replied' ? 'bg-neon-green/10 text-neon-green border-neon-green/30' : 'bg-f59e0b/10 text-[#f59e0b] border-[#f59e0b]/30'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button onClick={() => handleAction('Navigating to Live Activity Board...')} className="text-[10px] font-bold text-neon-blue hover:underline mt-4 w-full text-right block">View all live conversations →</button>
        </div>

        {/* Top Questions */}
        <div className="lg:col-span-4 glass-panel p-4 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Top Questions <span className="text-gray-500 text-[10px] font-normal">(Last 7 Days)</span></h3>
            <button onClick={() => handleAction('Opening Full Questions Report')} className="text-[10px] text-neon-blue hover:underline">View All</button>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {topQuestionsData.map((q, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px]">
                <div className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-[8px] font-bold shrink-0">{i+1}</div>
                <div className="flex-1 truncate text-gray-300 min-w-[100px]">{q.name}</div>
                <div className="w-1/3 flex items-center gap-2 shrink-0">
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full rounded-full" style={{ width: q.pct, backgroundColor: q.color }} />
                  </div>
                  <span className="w-6 text-right text-white font-bold">{q.val}</span>
                  <span className="w-8 text-right text-gray-500">{q.pct}</span>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mt-2 pt-2 border-t border-gray-800">
              <span>Total</span>
              <div className="flex gap-4">
                <span className="text-white">2,451</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Performance */}
        <div className="lg:col-span-3 glass-panel p-4 flex flex-col min-h-[340px]">
          <h3 className="text-sm font-bold text-white mb-2">AI Performance <span className="text-gray-500 text-[10px] font-normal">(Last 7 Days)</span></h3>
          <div className="flex flex-col xl:flex-row items-center justify-center relative h-auto gap-4 py-2 border-b border-gray-800/50 pb-4">
            <div className="relative w-[100px] h-[100px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{value:98.3},{value:1.7}]} innerRadius={35} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none">
                    <Cell fill="#39ff14" />
                    <Cell fill="#ef4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                <span className="text-xl font-black text-white">98.3%</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-[9px] shrink-0">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-neon-green" /><span className="text-gray-300">Resolved by AI</span> <span className="font-bold text-white ml-1">2,409 (98.3%)</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-red-500" /><span className="text-gray-300">Escalated</span> <span className="font-bold text-white ml-1">42 (1.7%)</span></div>
            </div>
          </div>
          <div className="mt-4 flex-1">
            <h4 className="text-[10px] font-bold text-gray-400 mb-3">Resolution by Channel</h4>
            <div className="space-y-2">
              {channelData.map((c, i) => (
                <div key={i} className="flex items-center text-[9px]">
                  <span className="w-16 text-gray-400 shrink-0">{c.name}</span>
                  <span className="w-8 font-bold text-white text-right mr-2 shrink-0">{c.val}</span>
                  <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: c.pct, backgroundColor: c.color }} />
                  </div>
                  <span className="w-8 text-right text-gray-500 shrink-0">{c.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Insights, Sentiment, Escalations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* AI Insights */}
        <div className="lg:col-span-3 glass-panel p-4 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-bold text-white mb-4">AI Insights</h3>
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><TrendingUp size={16} className="text-neon-green" /></div>
              <div>
                <h4 className="text-[11px] font-bold text-neon-green">High Interest Topic</h4>
                <p className="text-[9px] text-gray-400 mt-1 leading-relaxed">Questions about "How creators earn" increased by 23% in the last 3 days.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><AlertTriangle size={16} className="text-red-500" /></div>
              <div>
                <h4 className="text-[11px] font-bold text-red-500">Payment Issues Rising</h4>
                <p className="text-[9px] text-gray-400 mt-1 leading-relaxed">Payment related escalations increased by 18%. Consider proactive outreach.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><ShieldCheck size={16} className="text-neon-blue" /></div>
              <div>
                <h4 className="text-[11px] font-bold text-neon-blue">KYC Bottleneck</h4>
                <p className="text-[9px] text-gray-400 mt-1 leading-relaxed">32% of users need help with KYC verification. Consider improving the flow.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5"><Trophy size={16} className="text-[#39ff14]" /></div>
              <div>
                <h4 className="text-[11px] font-bold text-[#39ff14]">Top Performing Channel</h4>
                <p className="text-[9px] text-gray-400 mt-1 leading-relaxed">WhatsApp has the highest resolution rate (97.1%) and user satisfaction.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="lg:col-span-5 glass-panel p-4 flex flex-col min-h-[300px]">
          <h3 className="text-sm font-bold text-white mb-4">Sentiment Analysis <span className="text-gray-500 text-[10px] font-normal">(Last 7 Days)</span></h3>
          <div className="flex flex-1 flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3 flex flex-col justify-center relative items-center">
              <div className="relative w-[120px] h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{value:68},{value:23},{value:9}]} innerRadius={35} outerRadius={45} paddingAngle={2} dataKey="value" stroke="none">
                      <Cell fill="#39ff14" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#ef4444" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">☺</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 text-[9px] mt-4 w-full px-4">
                <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" />Positive</span> <span className="font-bold text-white">68%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />Neutral</span> <span className="font-bold text-white">23%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />Negative</span> <span className="font-bold text-white">9%</span></div>
              </div>
            </div>
            <div className="w-full sm:w-2/3 flex flex-col pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-gray-800 sm:pl-4">
              <h4 className="text-[10px] font-bold text-white mb-2 text-center flex flex-col xl:flex-row justify-center items-center gap-2 xl:gap-4">
                <span>Sentiment Over Time</span>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 text-gray-400"><div className="w-1 h-1 rounded-full bg-[#39ff14]" />Pos</span>
                  <span className="flex items-center gap-1 text-gray-400"><div className="w-1 h-1 rounded-full bg-[#f59e0b]" />Neu</span>
                  <span className="flex items-center gap-1 text-gray-400"><div className="w-1 h-1 rounded-full bg-[#ef4444]" />Neg</span>
                </div>
              </h4>
              <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sentimentTrendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                    <XAxis dataKey="day" stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={8} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '10px' }} />
                    <Line type="monotone" dataKey="positive" stroke="#39ff14" strokeWidth={1.5} dot={{ r: 1.5, fill: '#39ff14' }} />
                    <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={1.5} dot={{ r: 1.5, fill: '#f59e0b' }} />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={1.5} dot={{ r: 1.5, fill: '#ef4444' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Escalations */}
        <div className="lg:col-span-4 glass-panel p-4 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Escalations <span className="text-gray-500 text-[10px] font-normal">(Last 7 Days)</span></h3>
            <button onClick={() => handleAction('Opening Full Escalations Report')} className="text-[10px] text-neon-blue hover:underline">View All</button>
          </div>
          <div className="flex gap-2 mb-4 border-b border-gray-800 pb-2">
            {['All (42)', 'High Priority (17)', 'VIP (9)'].map(t => {
              const base = t.split(' (')[0];
              return (
                <button key={t} onClick={() => setEscTab(base)} className={`text-[10px] px-2 py-1 font-bold rounded-lg transition-colors ${escTab === base ? 'text-neon-purple border border-neon-purple/30 bg-neon-purple/10' : 'text-gray-500 hover:text-white'}`}>
                  {t}
                </button>
              )
            })}
          </div>
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse table-auto min-w-[300px]">
              <tbody className="divide-y divide-gray-800/50">
                {filteredEscalations?.map((e, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] shrink-0">{e.flag}</div>
                        <div>
                          <p className="text-[10px] font-bold text-white truncate max-w-[100px]">{e.lead}</p>
                          <p className="text-[9px] text-gray-500 truncate max-w-[100px]">{e.issue}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-[9px] text-gray-400 whitespace-nowrap">{e.time}</td>
                    <td className="py-2 pl-2 text-right whitespace-nowrap">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${e.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/30' : e.priority === 'Medium' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30' : 'bg-blue-500/10 text-blue-500 border-blue-500/30'}`}>
                        {e.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => handleAction('Navigating to Escalations Dashboard...')} className="text-[10px] font-bold text-neon-blue hover:underline mt-4 w-full text-right block">View all escalations →</button>
        </div>
      </div>

      {/* Row 4: AI Knowledge Management */}
      {user?.role !== 'VIEWER' && (
        <div className="glass-panel p-5">
          <h3 className="text-sm font-bold text-white mb-4">AI Knowledge & Auto-Reply Management</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { icon: BookOpen, title: 'Knowledge Base', value: '182', sub: 'Articles', status: 'Updated 2h ago', btn: 'Manage Articles', color: 'text-neon-blue', border: 'border-neon-blue/20' },
              { icon: MessageSquare, title: 'Auto-Reply Rules', value: '156', sub: 'Rules', status: 'Active', btn: 'Manage Rules', color: 'text-neon-green', border: 'border-neon-green/20' },
              { icon: AlertOctagon, title: 'Escalation Rules', value: '28', sub: 'Rules', status: 'Active', btn: 'Manage Rules', color: 'text-red-500', border: 'border-red-500/20' },
              { icon: Hand, title: 'Welcome Messages', value: '10', sub: 'Languages', status: 'Active', btn: 'Manage Messages', color: 'text-yellow-400', border: 'border-yellow-500/20' },
              { icon: Brain, title: 'AI Training', value: 'Last Training', sub: 'May 19, 2025', status: 'Optimal', btn: 'Train AI Model', color: 'text-neon-purple', border: 'border-neon-purple/20' },
              { icon: Globe, title: 'Languages Supported', value: '10', sub: 'Languages', status: 'Active', btn: 'Manage Languages', color: 'text-neon-blue', border: 'border-neon-blue/20' },
            ].map((c, i) => (
              <div key={i} className={`bg-gray-900/50 rounded-xl p-4 border flex flex-col justify-between min-h-[140px] hover:bg-white/[0.02] transition-colors ${c.border}`}>
                <div className="flex items-start gap-3">
                  <c.icon size={20} className={c.color} />
                  <div>
                    <h4 className="text-[11px] font-bold text-white leading-tight mb-1">{c.title}</h4>
                    <p className="text-lg font-black text-white leading-tight">{c.value} <span className="text-[9px] font-normal text-gray-400">{c.sub}</span></p>
                    <p className={`text-[9px] mt-1 ${c.status === 'Optimal' || c.status === 'Active' ? 'text-neon-green' : 'text-gray-500'}`}>{c.status}</p>
                  </div>
                </div>
                <button onClick={() => handleAction(`Navigating to ${c.title}...`)} className="text-[10px] font-bold text-gray-400 hover:text-white mt-4 text-left hover:underline">{c.btn}</button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 bg-neon-purple/5 border border-neon-purple/10 rounded-lg p-2">
            <div className="w-4 h-4 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple shrink-0">💡</div>
            Tip: AI learns from every conversation. Keep your knowledge base updated to improve response accuracy.
            <div className="ml-auto flex flex-wrap items-center gap-2 justify-end">
              <span>AI Model: PGX-GPT 4.1</span>
              <span className="flex items-center gap-1 text-neon-green font-bold"><div className="w-1.5 h-1.5 rounded-full bg-neon-green" /> Healthy</span>
            </div>
          </div>
        </div>
      )}
      
      </div>
    )}

        {activeTab === 'knowledge-base' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <div>
                 <h2 className="text-xl font-black text-white">Knowledge Base Upload & Management</h2>
                 <p className="text-xs text-gray-400">Train AI on your company policies, pricing guidelines, and FAQ files.</p>
               </div>
               <button onClick={() => addToast('success', 'Knowledge Base Saved', 'All sources synced with PGX-GPT 4.1 model.')} className="bg-neon-blue text-black px-4 py-2 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">Sync All Sources ⚡</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div onClick={() => {
                 setDocList([...docList, { id: Date.now(), name: 'new_onboarding_guide_2026.pdf', status: 'Active', time: 'Just now' }]);
                 addToast('success', 'File Uploaded', 'Added new_onboarding_guide_2026.pdf to AI index.');
               }} className="bg-gray-900/80 border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-neon-blue transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                     <FileText size={28} className="text-neon-blue group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-white font-bold mb-1">Upload Documents (Click to Demo)</h3>
                  <p className="text-xs text-gray-500 mb-4 max-w-xs">Drag and drop PDFs, DOCX, or CSV files here to train the AI instantly.</p>
                  <button className="px-4 py-2 bg-gray-800 text-white rounded-xl text-xs font-bold border border-gray-700 group-hover:border-neon-blue transition-colors">Browse & Add Files</button>
               </div>
               
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2"><Globe size={18} className="text-neon-purple"/> Add Website URL</h3>
                  <p className="text-xs text-gray-400 mb-4">The AI will scrape the URL and learn from its public content & pricing.</p>
                  <div className="flex gap-2">
                     <input 
                       type="text" 
                       placeholder="https://playgroundx.com/faq" 
                       value={newUrl}
                       onChange={e => setNewUrl(e.target.value)}
                       className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-purple" 
                     />
                     <button onClick={() => {
                       if (!newUrl) return addToast('error', 'URL Required', 'Please enter a valid URL.');
                       setDocList([...docList, { id: Date.now(), name: newUrl, status: 'Active', time: 'Just now' }]);
                       setNewUrl('');
                       addToast('success', 'URL Scraped', 'Successfully indexed website content.');
                     }} className="px-5 py-2 bg-neon-purple text-white rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-purple-600 transition-all">Scrape URL</button>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-800 pt-4 flex-1">
                     <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center justify-between">
                       <span>Indexed Knowledge Sources</span>
                       <span className="text-neon-green text-[10px]">{docList.length} Active</span>
                     </h4>
                     <ul className="space-y-2.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                        {docList.map(doc => (
                          <li key={doc.id} className="flex justify-between items-center text-xs bg-gray-950 border border-gray-800/80 p-3 rounded-xl hover:border-gray-700 transition-colors">
                             <div className="flex items-center gap-2.5 truncate pr-2">
                               <div className="w-2 h-2 rounded-full bg-neon-green shrink-0 animate-pulse" />
                               <span className="text-gray-200 font-medium truncate">{doc.name}</span>
                             </div>
                             <div className="flex items-center gap-2 shrink-0">
                               <span className="text-gray-500 text-[10px]">{doc.time}</span>
                               <button onClick={() => {
                                 setDocList(docList.filter(d => d.id !== doc.id));
                                 addToast('info', 'Source Removed', `Removed ${doc.name} from AI memory.`);
                               }} className="text-red-400 hover:text-red-300 text-[10px] underline ml-1">Remove</button>
                             </div>
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">AI Training & Live Sandbox</h2>
                <p className="text-xs text-gray-400">Test AI responses in real-time before deploying to live VIP customers.</p>
              </div>
              <span className="px-3 py-1 bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold rounded-full w-fit">⚡ PGX-GPT 4.1 Live Engine</span>
            </div>

            {/* Live Interactive Test Sandbox */}
            <div className="bg-gradient-to-r from-neon-blue/10 via-purple-500/10 to-transparent border border-neon-blue/40 rounded-2xl p-5 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Brain size={18} className="text-neon-blue" /> Interactive AI Test Sandbox
              </h3>
              <p className="text-xs text-gray-400 mb-4">Type a sample customer query below to evaluate how your AI bot responds based on current system prompt and tone.</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="e.g. How much can I earn as a VIP Creator? What is the revenue split?" 
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && testInput) {
                      setTestReply(`🤖 AI Bot: "Hi there! As a VIP Creator on PlayGroundX, you enjoy our industry-leading 80/20 revenue split! Plus, you get instant daily payouts and a dedicated VIP Concierge. Would you like me to send you the official creator application link?"`);
                      addToast('success', 'Response Generated', 'Simulated AI reply based on current guidelines.');
                    }
                  }}
                  className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors"
                />
                <button onClick={() => {
                  if (!testInput) return addToast('warning', 'Empty Input', 'Please enter a test prompt first.');
                  setTestReply(`🤖 AI Bot: "Hi there! As a VIP Creator on PlayGroundX, you enjoy our industry-leading 80/20 revenue split! Plus, you get instant daily payouts and a dedicated VIP Concierge. Would you like me to send you the official creator application link?"`);
                  addToast('success', 'Response Generated', 'Simulated AI reply based on current guidelines.');
                }} className="px-6 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0">Test Prompt →</button>
              </div>

              {testReply && (
                <div className="mt-4 p-4 bg-gray-950/90 border border-neon-blue/30 rounded-xl text-xs text-gray-200 leading-relaxed font-medium animate-fadeIn">
                  {testReply}
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
               <h3 className="text-white font-bold mb-2">Base System Prompt (Persona Guidelines)</h3>
               <p className="text-xs text-gray-400 mb-4">This instruction set governs how the AI behaves across all chats.</p>
               <textarea className="w-full h-40 bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-300 font-mono text-xs focus:outline-none focus:border-neon-blue custom-scrollbar" defaultValue="You are an expert VIP Concierge and customer success agent for PlayGroundX. Your tone is professional, empathetic, and enthusiastic. Always prioritize answering pricing and KYC questions accurately. If a lead mentions >50,000 followers, immediately offer to connect them with our CEO James Harrington or schedule a live video consultation." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-white font-bold mb-4">Response Style & Tone</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                     <label className="flex items-center justify-between p-3.5 border border-neon-blue/40 bg-neon-blue/5 rounded-xl cursor-pointer">
                        <span className="font-bold text-white">Professional & Concise (Recommended)</span>
                        <input type="radio" name="tone" className="accent-neon-blue" defaultChecked />
                     </label>
                     <label className="flex items-center justify-between p-3.5 border border-gray-800 rounded-xl cursor-pointer hover:border-gray-700">
                        <span>Friendly & Emoji-heavy 🚀🎉</span>
                        <input type="radio" name="tone" className="accent-neon-blue" />
                     </label>
                     <label className="flex items-center justify-between p-3.5 border border-gray-800 rounded-xl cursor-pointer hover:border-gray-700">
                        <span>Formal Corporate Policy</span>
                        <input type="radio" name="tone" className="accent-neon-blue" />
                     </label>
                  </div>
               </div>
               
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold mb-4">Memory & Context Window</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-xl mb-3">
                       <div>
                          <div className="font-bold text-white text-xs">Remember Past Chats</div>
                          <div className="text-[11px] text-gray-400">Retain user preference across sessions</div>
                       </div>
                       <div className="w-10 h-5 bg-neon-green rounded-full relative cursor-pointer shadow-[0_0_8px_rgba(57,255,20,0.5)]">
                          <div className="w-3.5 h-3.5 bg-black rounded-full absolute right-1 top-0.5"></div>
                       </div>
                    </div>
                  </div>
                  <button onClick={() => addToast('success', 'Training Saved', 'AI model weights and tone updated.')} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl border border-gray-700 transition-colors">Apply Personality Settings</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'prompt-library' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">Prompt & Persona Library</h2>
                <p className="text-xs text-gray-400">Pre-built system templates to tailor AI behavior for different customer segments.</p>
              </div>
              <button onClick={() => {
                const newTitle = prompt("Enter new Prompt Persona Name:", "e.g., Enterprise Sales Specialist");
                if (newTitle) {
                  setPromptsList([...promptsList, { id: Date.now(), title: newTitle, desc: 'Custom prompt persona tailored for high-ticket clients.', active: true, uses: '10' }]);
                  addToast('success', 'Prompt Created', `Created persona: ${newTitle}`);
                }
              }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan-400 transition-all w-fit">
                + Create New Persona Prompt
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {promptsList.map(p => (
                <div key={p.id} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg text-[10px] font-bold uppercase tracking-wider">Persona Template</span>
                      <button 
                        onClick={() => {
                          setPromptsList(promptsList.map(item => item.id === p.id ? { ...item, active: !item.active } : item));
                          addToast('info', 'Status Updated', `${p.title} is now ${!p.active ? 'Active' : 'Disabled'}`);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${p.active ? 'bg-neon-green/20 text-neon-green border border-neon-green/40' : 'bg-gray-800 text-gray-500'}`}
                      >
                        {p.active ? '⚡ Active' : '⏸️ Disabled'}
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{p.desc}</p>
                  </div>
                  <div className="border-t border-gray-800/80 pt-3 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                    <span>Used in <strong className="text-white">{p.uses}</strong> chats</span>
                    <button onClick={() => addToast('info', 'Editing Prompt', `Opened editor for ${p.title}`)} className="text-neon-blue hover:underline font-bold">Edit Persona →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'handoff-rules' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <div>
                 <h2 className="text-xl font-black text-white">Escalation & Human Handoff Rules</h2>
                 <p className="text-xs text-gray-400">Configure exact triggers for when AI should pause and transfer chat to a live agent.</p>
               </div>
               <button onClick={() => {
                 addToast('success', 'Rule Added', 'Created new priority handoff rule.');
               }} className="bg-neon-blue text-black px-4 py-2 rounded-xl font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]">+ Add New Handoff Rule</button>
            </div>
            
            <div className="space-y-3">
               {[
                 { title: 'Angry Customer Sentiment Handoff', desc: "IF Sentiment = 'Angry' or 'Frustrated' THEN immediately Route to Senior Agent & alert Supervisor", icon: AlertOctagon, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                 { title: 'VIP Lead Score Auto-Routing', desc: "IF Lead Score > 80 or User Tag contains 'VIP' THEN pause AI & assign to James Harrington", icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
                 { title: 'Explicit Human Request Trigger', desc: "IF customer types 'talk to human', 'agent', or 'real person' THEN transfer chat smoothly within 3s", icon: Headphones, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
                 { title: 'High-Ticket Payout Inquiry', desc: "IF message mentions 'wire transfer' or amount > '$5,000' THEN escalate to Billing Specialist", icon: DollarSign, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' }
               ].map((rule, idx) => (
                 <div key={idx} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 flex items-center justify-between hover:border-gray-700 transition-all">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-xl ${rule.bg} flex items-center justify-center border ${rule.border} shrink-0`}>
                          <rule.icon size={22} className={rule.color} />
                       </div>
                       <div>
                          <h4 className="text-white font-bold text-sm">{rule.title}</h4>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">{rule.desc}</p>
                       </div>
                    </div>
                    <div onClick={() => addToast('info', 'Rule Toggled', `Toggled ${rule.title}`)} className="w-10 h-5 bg-neon-green rounded-full relative cursor-pointer shrink-0 shadow-[0_0_8px_rgba(57,255,20,0.4)]">
                       <div className="w-3.5 h-3.5 bg-black rounded-full absolute right-1 top-0.5"></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">Deep AI Performance Analytics</h2>
                <p className="text-xs text-gray-400">Real-time metrics on deflection rates, token usage, and customer satisfaction.</p>
              </div>
              <button onClick={() => addToast('success', 'Report Exported', 'Downloaded AI_Performance_May2026.csv')} className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-xl text-xs font-bold hover:border-gray-500 transition-colors w-fit">📥 Export Full Report</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                 <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Total Token Usage (May)</span>
                 <div className="text-3xl font-black text-neon-purple">1.42M Tokens</div>
                 <p className="text-[10px] text-neon-green mt-2 font-bold">↑ 14% efficiency gain vs last month</p>
               </div>
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                 <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Customer CSAT after AI</span>
                 <div className="text-3xl font-black text-neon-green">4.8 / 5.0 ⭐</div>
                 <p className="text-[10px] text-gray-400 mt-2">Based on 1,240 post-chat ratings</p>
               </div>
               <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                 <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Estimated Cost Savings</span>
                 <div className="text-3xl font-black text-neon-blue">$14,850.00</div>
                 <p className="text-[10px] text-neon-green mt-2 font-bold">Equivalent to 3.5 full-time agents</p>
               </div>
            </div>

            {/* Simulated Chart breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">Top AI Fallback & Escalation Reasons</h3>
              <div className="space-y-4">
                {[
                  { label: 'Complex Custom Contract Negotiation', pct: 45, count: '180 chats', color: 'bg-red-500' },
                  { label: 'Customer Explicitly Requested Live Manager', pct: 25, count: '100 chats', color: 'bg-yellow-400' },
                  { label: 'Unclear KYC Document Uploaded', pct: 18, count: '72 chats', color: 'bg-neon-blue' },
                  { label: 'Custom API Technical Troubleshooting', pct: 12, count: '48 chats', color: 'bg-neon-purple' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-200">{item.label}</span>
                      <span className="text-gray-400">{item.count} ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-white">AI Intent Automation Workflows</h2>
                <p className="text-xs text-gray-400">Trigger custom webhook alerts, Slack notifications, and tags automatically when AI recognizes specific user intents.</p>
              </div>
              <button onClick={() => {
                const title = prompt("Enter new Automation Workflow Name:", "e.g., High Churn Risk Alert");
                if (title) {
                  setAutomationRules([...automationRules, { id: Date.now(), title, trigger: 'IF AI detects intent "Churn Risk"', action: 'Alert Retention Manager + Send 20% discount coupon', active: true }]);
                  addToast('success', 'Workflow Created', `Activated automation: ${title}`);
                }
              }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan-400 transition-all w-fit">
                + Build New Automation Rule
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {automationRules.map(r => (
                <div key={r.id} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-purple-500/10 text-neon-purple border border-purple-500/30 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Workflow size={12} /> Active Webhook
                      </span>
                      <button 
                        onClick={() => {
                          setAutomationRules(automationRules.map(item => item.id === r.id ? { ...item, active: !item.active } : item));
                          addToast('info', 'Workflow Toggled', `${r.title} is now ${!r.active ? 'Active' : 'Paused'}`);
                        }}
                        className={`w-9 h-5 rounded-full relative transition-colors ${r.active ? 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.4)]' : 'bg-gray-800'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-black rounded-full absolute top-0.5 transition-all ${r.active ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">{r.title}</h3>
                    <div className="p-3 bg-gray-950 rounded-xl border border-gray-800/80 space-y-1.5 text-xs font-mono mb-4">
                      <div className="text-neon-blue"><strong className="text-gray-500">TRIGGER:</strong> {r.trigger}</div>
                      <div className="text-neon-green"><strong className="text-gray-500">ACTION:</strong> {r.action}</div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-gray-800/80 pt-3">
                    <button onClick={() => addToast('info', 'Testing Webhook', `Sent test event for ${r.title}`)} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-[10px] font-bold">Test Trigger</button>
                    <button onClick={() => addToast('info', 'Editing Workflow', `Opened builder for ${r.title}`)} className="px-3 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue hover:text-black rounded-lg text-[10px] font-bold transition-all">Configure →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
