import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, PhoneCall, Users, AlertTriangle, CheckCircle, Clock, ShieldAlert, ArrowUpRight, ArrowDownRight, Headphones, BarChart2, Filter, X, RefreshCw, Layers, Search, FileText, CheckCircle2, User, Tag } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useDataStore } from '../contexts/DataContext';
import Customer360Modal from '../components/modals/Customer360Modal';
import { getAppPath } from '../utils/routing';

const departmentData = {
  'All Departments': {
    activeCalls: 12,
    waitingQueue: 38,
    longestWait: '12m 40s',
    agentAvail: '65%',
    slaOverall: '84%',
    queues: [
      { name: 'VIP Creators', val: 85, color: 'bg-neon-pink' },
      { name: 'General Fans', val: 40, color: 'bg-neon-blue' },
      { name: 'Billing Support', val: 95, color: 'bg-neon-green' },
      { name: 'KYC & Legal', val: 60, color: 'bg-yellow-500' }
    ],
    activities: [
      { time: 'Just now', user: 'System', text: 'Queue "VIP Creators" wait time alert cleared.', type: 'sys' },
      { time: '2m ago', user: 'James Wilson', text: 'Transferred call to Billing Department.', type: 'action' },
      { time: '5m ago', user: 'Priya Sharma', text: 'Status changed to "On Break".', type: 'status' },
      { time: '12m ago', user: 'AI Assistant', text: 'Auto-resolved 5 fan inquiries.', type: 'ai' },
      { time: '15m ago', user: 'System', text: 'New campaign "Summer Promo" started.', type: 'sys' }
    ]
  },
  'VIP Sales': {
    activeCalls: 4,
    waitingQueue: 3,
    longestWait: '4m 12s',
    agentAvail: '88%',
    slaOverall: '95%',
    queues: [
      { name: 'VIP Creators Tier 1', val: 96, color: 'bg-neon-pink' },
      { name: 'Agency Inbound', val: 88, color: 'bg-neon-blue' },
      { name: 'High Value Leads', val: 92, color: 'bg-neon-green' }
    ],
    activities: [
      { time: '1m ago', user: 'Priya Sharma', text: 'Closed contract consultation with Maria G.', type: 'action' },
      { time: '6m ago', user: 'AI Assistant', text: 'Routed VIP lead to Sarah Jenkins.', type: 'ai' },
      { time: '14m ago', user: 'System', text: 'SLA threshold maintained above 95%.', type: 'sys' }
    ]
  },
  'Support': {
    activeCalls: 6,
    waitingQueue: 28,
    longestWait: '12m 40s',
    agentAvail: '45%',
    slaOverall: '78%',
    queues: [
      { name: 'General Fans', val: 40, color: 'bg-red-500' },
      { name: 'Token Purchases', val: 82, color: 'bg-neon-blue' },
      { name: 'Live Stream Help', val: 75, color: 'bg-yellow-500' }
    ],
    activities: [
      { time: 'Just now', user: 'System', text: '⚠ Alert: General Fans wait time exceeds 10m.', type: 'sys' },
      { time: '4m ago', user: 'Omar Agent', text: 'Resolved live stream video stutter ticket.', type: 'action' },
      { time: '9m ago', user: 'Mike Agent', text: 'Took over chat from AI bot.', type: 'action' }
    ]
  },
  'KYC & Legal': {
    activeCalls: 2,
    waitingQueue: 7,
    longestWait: '8m 05s',
    agentAvail: '75%',
    slaOverall: '85%',
    queues: [
      { name: 'ID Scans Review', val: 80, color: 'bg-neon-green' },
      { name: 'Tax W-8BEN Form', val: 90, color: 'bg-neon-blue' },
      { name: 'Age Verification', val: 70, color: 'bg-yellow-500' }
    ],
    activities: [
      { time: '3m ago', user: 'Emma Agent', text: 'Approved passport for Creator #1084.', type: 'action' },
      { time: '11m ago', user: 'System', text: 'Flagged duplicate KYC document upload.', type: 'sys' }
    ]
  }
};

const KPICard = ({ title, value, subValue, trend, icon: Icon, color, delay, onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay }}
    onClick={onClick}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all hover:scale-[1.02]"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</div>
        <div className="text-2xl font-black text-white flex items-baseline gap-2">
          {value}
          {subValue && <span className="text-sm text-gray-500 font-medium">{subValue}</span>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend > 0 ? 'text-neon-green' : trend < 0 ? 'text-neon-pink' : 'text-gray-400'}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : trend < 0 ? <ArrowDownRight size={14} /> : null}
            {Math.abs(trend)}% vs last hr
          </div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}/10 border border-${color}/20 text-${color}`}>
        <Icon size={20} />
      </div>
    </div>
  </motion.div>
);

export default function OperationsDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [conversations] = useDataStore('conversations');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedQueueDetail, setSelectedQueueDetail] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // overview, sales_tracker
  const [trackerSearch, setTrackerSearch] = useState('');
  const [trackerAgentFilter, setTrackerAgentFilter] = useState('All');
  const [customer360Target, setCustomer360Target] = useState(null);

  const mockSalesFollowups = [
    {
      id: 'sf-1',
      agent: 'Priya Sharma',
      agentRole: 'Sales Agent',
      clientName: 'Maria Gonzalez',
      clientType: 'VIP Creator',
      flag: '🇪🇸',
      phone: '+1 (555) 921-8834',
      actionType: '📞 Phone Call Log',
      summary: 'Connected & Interested: Discussed 80/20 revenue share split and fast-tracked passport verification.',
      time: 'Just now',
      status: 'Completed',
      priority: 'High Priority',
      score: 95
    },
    {
      id: 'sf-2',
      agent: 'Priya Sharma',
      agentRole: 'Sales Agent',
      clientName: 'Li Wei',
      clientType: 'Creator',
      flag: '🇨🇳',
      phone: '+1 (555) 382-9102',
      actionType: '📝 Private Staff Note',
      summary: 'KYC & Compliance: Verified uploaded government ID documentation. Ready for supervisor approval.',
      time: '15m ago',
      status: 'Under Review',
      priority: 'High Priority',
      score: 92
    },
    {
      id: 'sf-3',
      agent: 'Carlos Ramirez',
      agentRole: 'Senior Sales Agent',
      clientName: 'Ahmed Al-Fayed',
      clientType: 'VIP Fan',
      flag: '🇦🇪',
      phone: '+1 (555) 491-8821',
      actionType: '📞 Phone Call Log',
      summary: 'Left Voicemail: Explained VIP deposit bonus structure and upcoming high-roller tournament schedule.',
      time: '1h ago',
      status: 'Follow-up Needed',
      priority: 'Medium Priority',
      score: 88
    },
    {
      id: 'sf-4',
      agent: 'Priya Sharma',
      agentRole: 'Sales Agent',
      clientName: 'Sarah Mitchell',
      clientType: 'Lead',
      flag: '🇺🇸',
      phone: '+1 (555) 019-2834',
      actionType: '💬 Live Chat Reachout',
      summary: 'Sent onboarding welcome package and guided through initial crypto wallet connection.',
      time: '2h ago',
      status: 'Completed',
      priority: 'Normal Priority',
      score: 75
    },
    {
      id: 'sf-5',
      agent: 'Carlos Ramirez',
      agentRole: 'Senior Sales Agent',
      clientName: 'Lucas Moreau',
      clientType: 'Creator',
      flag: '🇫🇷',
      phone: '+1 (555) 812-3341',
      actionType: '📞 Phone Call Log',
      summary: 'Converted to VIP Tier: Client agreed to exclusive streaming rights for Q3.',
      time: 'Yesterday',
      status: 'Converted ⭐',
      priority: 'VIP',
      score: 98
    }
  ];

  const realFollowups = [];
  (conversations || []).forEach(conv => {
    if (conv.messages && Array.isArray(conv.messages)) {
      conv.messages.forEach(msg => {
        if (msg.content?.includes('📞') || msg.content?.includes('⚠️') || msg.content?.includes('📝') || msg.type === 'note') {
          realFollowups.push({
            id: msg.id || Date.now() + Math.random(),
            agent: msg.author || conv.lead?.assignedAgent || 'Priya Sharma',
            agentRole: 'Sales Agent',
            clientName: conv.lead?.name || conv.name || 'VIP Client',
            clientType: conv.lead?.type || 'Creator',
            flag: conv.lead?.flag || '🌐',
            phone: conv.lead?.phone || '+1 (555) 019-2834',
            actionType: msg.content.includes('📞') ? '📞 Phone Call Log' : '📝 Private Staff Note',
            summary: msg.content.replace(/^[📞⚠️📝]\s*\[.*?\]\n?/, '').trim() || msg.content,
            time: msg.time || conv.time || 'Just now',
            status: msg.content.includes('Connected') ? 'Completed' : 'Recorded',
            priority: 'High Priority',
            score: conv.lead?.score || 90
          });
        }
      });
    }
  });

  const combinedFollowups = [...realFollowups, ...mockSalesFollowups].filter(f => {
    if (trackerAgentFilter !== 'All' && !f.agent?.includes(trackerAgentFilter)) return false;
    if (trackerSearch && !f.clientName?.toLowerCase().includes(trackerSearch.toLowerCase()) && !f.summary?.toLowerCase().includes(trackerSearch.toLowerCase()) && !f.agent?.toLowerCase().includes(trackerSearch.toLowerCase())) return false;
    return true;
  });

  const currentData = departmentData[selectedDept] || departmentData['All Departments'];

  return (
    <div className="h-full flex flex-col space-y-6 pb-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Activity size={20} className="text-neon-blue" />
            </div>
            Operations Command Center
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Live floor monitoring, queue SLAs, and automated triage distribution.</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap filter-bar">
          <div className="flex items-center gap-2 bg-gray-950 px-3 py-2 rounded-xl border border-gray-800">
            <Filter size={14} className="text-neon-blue" />
            <span className="text-xs font-extrabold text-gray-400">Department:</span>
            <select
              value={selectedDept}
              onChange={e => {
                setSelectedDept(e.target.value);
                addToast('info', 'Department Switched', `Showing real-time telemetry for ${e.target.value}.`);
              }}
              className="bg-transparent text-white font-black text-xs focus:outline-none cursor-pointer"
            >
              <option value="All Departments" className="bg-gray-900">All Departments (Global)</option>
              <option value="VIP Sales" className="bg-gray-900">VIP Sales & Creators</option>
              <option value="Support" className="bg-gray-900">General Support & Chat</option>
              <option value="KYC & Legal" className="bg-gray-900">KYC & Legal Compliance</option>
            </select>
          </div>

          <button
            onClick={() => {
              addToast('success', 'Telemetry Synced', 'Refreshed live call center feeds.');
            }}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all shadow-sm"
            title="Refresh Live Metrics"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between gap-4 bg-gray-900/60 p-2 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveView('overview')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
              activeView === 'overview' ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 size={15} /> Queue SLA & Telemetry Overview
          </button>
          <button
            onClick={() => setActiveView('sales_tracker')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all flex items-center gap-2 ${
              activeView === 'sales_tracker' ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <PhoneCall size={15} /> 📋 Live Sales Follow-up Tracker (CEO / Manager View)
          </button>
        </div>
        {activeView === 'sales_tracker' && (
          <span className="text-xs text-neon-green font-bold flex items-center gap-1.5 px-3 py-1 bg-neon-green/10 rounded-lg border border-neon-green/20 mr-2 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" /> Live Agent Tracking Active
          </span>
        )}
      </div>

      {activeView === 'sales_tracker' ? (
        <div className="bg-[#111116] border border-gray-800 rounded-2xl p-6 flex-1 flex flex-col shadow-2xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Users className="text-neon-green" size={20} /> Sales Team Follow-up & Activity Feed
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Real-time audit of every client call, compliance review, and note recorded by sales agents.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search agent, client, or summary..."
                  value={trackerSearch}
                  onChange={(e) => setTrackerSearch(e.target.value)}
                  className="bg-black/50 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-green w-64"
                />
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
              </div>
              <select
                value={trackerAgentFilter}
                onChange={(e) => setTrackerAgentFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-neon-green cursor-pointer"
              >
                <option value="All">All Sales Agents</option>
                <option value="Priya Sharma">Priya Sharma</option>
                <option value="Carlos Ramirez">Carlos Ramirez</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-900/50">
                  <th className="py-3.5 px-4 rounded-l-xl">Time</th>
                  <th className="py-3.5 px-4">Sales Agent</th>
                  <th className="py-3.5 px-4">Client / VIP Target</th>
                  <th className="py-3.5 px-4">Action & Follow-up Summary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Audit / Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-xs font-medium">
                {combinedFollowups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 font-bold">
                      No sales follow-up activity found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  combinedFollowups.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-4 font-mono text-gray-400 whitespace-nowrap">{item.time}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-green/20 to-neon-blue/20 border border-white/10 flex items-center justify-center font-black text-white text-xs shadow-inner">
                            {item.agent?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{item.agent}</span>
                            <span className="text-[10px] text-gray-400 block">{item.agentRole}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{item.clientName}</span>
                          <span className="text-xs">{item.flag}</span>
                        </div>
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-black mt-1 uppercase tracking-wider border ${
                          item.clientType === 'Creator' ? 'bg-neon-purple/15 text-neon-purple border-neon-purple/30' :
                          item.clientType === 'VIP Fan' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                          'bg-neon-blue/15 text-neon-blue border-neon-blue/30'
                        }`}>
                          {item.clientType} • {item.phone}
                        </span>
                      </td>
                      <td className="py-4 px-4 max-w-md">
                        <span className={`inline-block text-[11px] font-black mb-1 px-2 py-0.5 rounded ${
                          item.actionType?.includes('Call') ? 'bg-neon-green/15 text-neon-green' :
                          item.actionType?.includes('Note') ? 'bg-yellow-400/15 text-yellow-400' :
                          'bg-neon-blue/15 text-neon-blue'
                        }`}>
                          {item.actionType}
                        </span>
                        <p className="text-gray-300 font-normal leading-relaxed line-clamp-2">{item.summary}</p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neon-green/10 text-neon-green text-[11px] font-bold border border-neon-green/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-green" /> {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setCustomer360Target({
                            name: item.clientName,
                            memberType: item.clientType,
                            flag: item.flag,
                            phone: item.phone,
                            score: item.score || 90,
                            assignedAgent: item.agent
                          })}
                          className="px-3.5 py-1.5 rounded-lg bg-neon-purple/15 hover:bg-neon-purple hover:text-black text-neon-purple border border-neon-purple/30 font-black text-xs transition-all inline-flex items-center gap-1.5 shadow-sm"
                          title="Open full Customer 360 profile"
                        >
                          👁️ 360° Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard 
              title="Active Calls / Chats" 
              value={currentData.activeCalls} 
              trend={8} 
              icon={PhoneCall} 
              color="neon-blue" 
              delay={0.05}
              onClick={() => { addToast('info', 'Active Communications', `Monitoring ${currentData.activeCalls} live sessions in ${selectedDept}.`); }}
            />
            <KPICard 
              title="Waiting Queue" 
              value={currentData.waitingQueue} 
              subValue={currentData.waitingQueue > 15 ? 'Critical' : 'Normal'}
              trend={currentData.waitingQueue > 15 ? -12 : 4} 
              icon={Users} 
              color={currentData.waitingQueue > 15 ? "neon-pink" : "neon-green"} 
              delay={0.1}
              onClick={() => navigate(getAppPath('/queue-monitor'))}
            />
            <KPICard 
              title="Longest Wait" 
              value={currentData.longestWait} 
              trend={-5} 
              icon={Clock} 
              color="yellow-500" 
              delay={0.15}
              onClick={() => navigate(getAppPath('/queue-monitor'))}
            />
            <KPICard 
              title="Agent Availability" 
              value={currentData.agentAvail} 
              subValue={`SLA: ${currentData.slaOverall}`}
              trend={2} 
              icon={Headphones} 
              color="neon-green" 
              delay={0.2}
              onClick={() => navigate(getAppPath('/supervisor'))}
            />
          </div>

          {/* Main Charts & Activity Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-6 flex-1 min-h-0">
            
            {/* Live Queue Overview */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-[320px] shadow-xl">
              <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
                <h2 className="font-bold text-white flex items-center gap-2"><BarChart2 size={16} className="text-neon-blue" /> Queue SLA Breakdown ({selectedDept})</h2>
                <button 
                  onClick={() => {
                    addToast('info', 'Redirecting to Monitor', 'Opening deep-dive Queue Monitor.');
                    navigate(getAppPath('/queue-monitor'));
                  }}
                  className="text-xs text-neon-blue hover:underline font-bold flex items-center gap-1 bg-neon-blue/10 px-3 py-1 rounded-lg border border-neon-blue/30"
                >
                  View Full Monitor →
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-center space-y-5">
                {currentData.queues.map(q => (
                  <div 
                    key={q.name}
                    onClick={() => setSelectedQueueDetail(q)}
                    className="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                      <span className="text-white flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${q.color}`} />
                        {q.name}
                      </span>
                      <span className={q.val < 75 ? 'text-red-400 font-black' : 'text-neon-green font-black'}>{q.val}% SLA Target</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div className={`h-full ${q.color} transition-all duration-500`} style={{ width: `${q.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Operational Activity */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-[320px] shadow-xl">
              <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
                <h2 className="font-bold text-white flex items-center gap-2"><Clock size={16} className="text-neon-purple" /> Live Telemetry Feed</h2>
                <button 
                  onClick={() => setShowActivityModal(true)}
                  className="text-xs text-neon-purple hover:underline font-bold bg-neon-purple/10 px-3 py-1 rounded-lg border border-neon-purple/30"
                >
                  View All Activity Log
                </button>
              </div>
              <div className="p-5 flex-1 overflow-auto custom-scrollbar space-y-3.5">
                {currentData.activities.map((act, i) => (
                  <div key={i} className="flex gap-3.5 p-3 rounded-xl bg-gray-950/40 border border-gray-800/60 hover:bg-white/[0.02] transition-colors">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${act.type === 'sys' ? 'bg-yellow-400' : act.type === 'ai' ? 'bg-neon-purple' : 'bg-neon-blue'}`} />
                    <div className="flex-1 text-xs">
                      <div className="text-gray-300 leading-relaxed"><span className="font-black text-white mr-1.5">{act.user}:</span>{act.text}</div>
                      <div className="text-[10px] text-gray-500 mt-1 font-mono">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}

      {/* Activity Log Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowActivityModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl text-left space-y-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800 shrink-0">
                <h3 className="text-lg font-black text-white flex items-center gap-2"><Layers size={18} className="text-neon-purple"/> Complete System Activity Log ({selectedDept})</h3>
                <button onClick={() => setShowActivityModal(false)} className="text-gray-400 hover:text-white p-1.5 bg-gray-900 rounded-full"><X size={16}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {[...currentData.activities, 
                  { time: '25m ago', user: 'Sarah Jenkins', text: 'Completed SLA wrap-up report for morning shift.', type: 'action' },
                  { time: '35m ago', user: 'AI Assistant', text: 'Handled 42 simultaneous fan inquiries with 99.4% CSAT.', type: 'ai' },
                  { time: '45m ago', user: 'System', text: 'Automated Stripe payout queue synchronized.', type: 'sys' },
                  { time: '1h ago', user: 'Priya Sharma', text: 'Added new VIP creator contract tag.', type: 'action' }
                ].map((act, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-xs">
                    <span className="font-mono text-gray-500 shrink-0 w-16">{act.time}</span>
                    <span className="font-black text-white shrink-0 w-28">{act.user}</span>
                    <span className="text-gray-300 flex-1">{act.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-800 shrink-0 flex justify-end">
                <button onClick={() => setShowActivityModal(false)} className="px-6 py-2.5 bg-neon-blue text-black font-black text-xs rounded-xl">Close Activity Log</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queue Detail Modal */}
      <AnimatePresence>
        {selectedQueueDetail && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedQueueDetail(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2">{selectedQueueDetail.name} Telemetry</h3>
                <button onClick={() => setSelectedQueueDetail(null)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <div className="bg-gray-900 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between"><span>Current SLA Performance:</span><strong className="text-white text-sm">{selectedQueueDetail.val}%</strong></div>
                <div className="flex justify-between"><span>Target Threshold:</span><strong className="text-neon-green">90.0%</strong></div>
                <div className="flex justify-between"><span>Active Agents Assigned:</span><strong className="text-neon-blue">8 Agents</strong></div>
                <div className="flex justify-between"><span>Avg Handling Time (AHT):</span><strong className="text-gray-300 font-mono">03m 15s</strong></div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { navigate(getAppPath('/queue-monitor')); setSelectedQueueDetail(null); }} className="flex-1 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all">Go to Live Queue Monitor</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Customer360Modal
        open={!!customer360Target}
        onClose={() => setCustomer360Target(null)}
        member={customer360Target}
      />

    </div>
  );
}
