import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Clock, Users, Target, Activity, CheckCircle, BarChart2, MessageSquare, Briefcase, Calendar, ChevronRight, GitBranch, Headphones, ClipboardList, AlertOctagon, UserCheck, DollarSign, Layers, Zap } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import QuickAccessPanel from '../components/dashboard/QuickAccessPanel';
import { getAppPath } from '../utils/routing';

const KPICard = ({ title, value, change, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}/10 border border-${color}/20 text-${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</div>
      <div className="text-2xl font-black text-white mt-1 flex items-center gap-2">
        {value}
        {change && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${change.includes('+') ? 'text-neon-green bg-neon-green/10' : 'text-red-500 bg-red-500/10'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export default function ManagerDashboard() {
  const [agents] = useDataStore('agents');
  const [conversations] = useDataStore('conversations');
  const [tasks] = useDataStore('tasks');
  const [appointments] = useDataStore('appointments');
  const [leads] = useDataStore('leads');
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    // SLA Average
    const validAgents = agents?.filter(a => a.slaPercent) || [];
    const avgSla = validAgents.length ? Math.round(validAgents.reduce((sum, a) => sum + a.slaPercent, 0) / validAgents.length) : 0;
    
    // Total Escalations
    const escalations = validAgents.filter(a => a.critical).length;
    
    // Active Conversations (Open)
    const activeConvos = conversations?.filter(c => c.status === 'open').length || 0;
    
    // Pending Tasks
    const pendingTasks = tasks?.filter(t => t.status === 'Pending' || t.status === 'In Progress').length || 0;
    
    // Open Appointments today
    const openAppointments = appointments?.filter(a => a.date === 'Today').length || 0;
    
    // Agent Productivity Chart Data
    const productivityData = validAgents.slice(0, 5).map(a => ({
      name: a.name.split(' ')[0],
      score: a.performanceScore,
      tasks: a.tasks
    }));

    return { avgSla, escalations, activeConvos, pendingTasks, openAppointments, productivityData };
  }, [agents, conversations, tasks, appointments]);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center">
              <Users size={16} className="text-neon-blue" />
            </div>
            Team Manager Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">Operational team performance, SLA tracking, and queue monitoring.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => navigate(getAppPath('/operations'))} className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2 whitespace-nowrap">
            <Activity size={16} /> Monitor Floor
          </button>
          <button onClick={() => navigate(getAppPath('/leads'))} className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/90 text-black rounded-lg text-sm font-black transition-colors flex items-center gap-2 whitespace-nowrap">
            <Users size={16} /> Assign Leads
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid-auto">
        <KPICard title="Team SLA" value={`${metrics.avgSla}%`} change="+2%" icon={CheckCircle} color="neon-green" delay={0.05} />
        <KPICard title="Escalations" value={metrics.escalations} change={metrics.escalations > 0 ? '+1' : ''} icon={ShieldAlert} color="red-500" delay={0.1} />
        <KPICard title="Avg Response" value="1m 45s" change="-12s" icon={Clock} color="yellow-500" delay={0.15} />
        <KPICard title="Active Chats" value={metrics.activeConvos} icon={MessageSquare} color="neon-blue" delay={0.2} />
        <KPICard title="Pending Tasks" value={metrics.pendingTasks} icon={Briefcase} color="neon-purple" delay={0.25} />
        <KPICard title="Appointments" value={metrics.openAppointments} icon={Calendar} color="neon-pink" delay={0.3} />
      </div>

      {/* Client-Mandatory: Management KPI Section (Financial & Daily Pulse from Spec Part 6) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <DollarSign size={16} className="text-neon-green" /> Management Financial & Operational Pulse
          </h2>
          <span className="text-[10px] bg-gray-800 border border-gray-700 px-2 py-0.5 rounded text-gray-400 font-bold">LIVE METRICS</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Rev Today',     val: '$14.2K', sub: '+18% today',    color: 'text-neon-green bg-neon-green/10 border-neon-green/30' },
            { label: 'Rev Week',      val: '$89.4K', sub: '+12% vs week',  color: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30' },
            { label: 'Rev Month',     val: '$342.1K',sub: '+8% vs month',  color: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30' },
            { label: 'Rev Year',      val: '$3.84M', sub: '+24% YoY',      color: 'text-neon-pink bg-neon-pink/10 border-neon-pink/30' },
            { label: 'Registrations', val: '142',    sub: 'Today',         color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
            { label: 'KYC Approved',  val: '89',     sub: '94% Pass',      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
            { label: 'Deposits',      val: '$28.5K', sub: '45 txns today', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
            { label: 'Purchases',     val: '118',    sub: 'Avg $240',      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-900/60 backdrop-blur-md border border-gray-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-gray-700 transition-all">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">{item.label}</div>
              <div className="text-lg font-black text-white mt-1 leading-tight">{item.val}</div>
              <div className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded w-fit border ${item.color}`}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Client-Mandatory: Real-Time Management Funnel View (from Spec Part 6) */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-gray-800/80 pb-3">
          <div>
            <h2 className="font-extrabold text-white text-base flex items-center gap-2">
              <Layers size={18} className="text-neon-blue" /> Real-Time Management Funnel View
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Live 10-stage conversion funnel across all departments and acquisition channels.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/50">
            <Zap size={14} className="text-yellow-400 animate-pulse" /> Global Conversion Rate: <span className="text-neon-green">28.4%</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { stage: '1. New Leads',          count: '1,420', pct: 100, barColor: 'bg-blue-500' },
            { stage: '2. Registrations',      count: '980',   pct: 69,  barColor: 'bg-cyan-500' },
            { stage: '3. Profile Complete',   count: '840',   pct: 59,  barColor: 'bg-teal-500' },
            { stage: '4. KYC Approvals',      count: '620',   pct: 43,  barColor: 'bg-emerald-500' },
            { stage: '5. Deposits',           count: '480',   pct: 33,  barColor: 'bg-green-500' },
            { stage: '6. Purchases',          count: '410',   pct: 28,  barColor: 'bg-yellow-500' },
            { stage: '7. Subscriptions',      count: '350',   pct: 24,  barColor: 'bg-amber-500' },
            { stage: '8. Creator Active',     count: '125',   pct: 9,   barColor: 'bg-orange-500' },
            { stage: '9. Fan Active',         count: '680',   pct: 47,  barColor: 'bg-purple-500' },
            { stage: '10. VIP Activations',   count: '45',    pct: 3,   barColor: 'bg-pink-500' },
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-gray-300 truncate">
                <span className="truncate">{item.stage}</span>
                <span className="text-[10px] text-gray-500 font-mono">{item.pct}%</span>
              </div>
              <div className="text-base font-black text-white mt-1.5 font-mono">{item.count}</div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${item.barColor} transition-all duration-500`} style={{ width: `${item.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Agent Productivity Chart */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 flex flex-col">
          <h2 className="font-bold text-white mb-6 flex items-center gap-2"><BarChart2 size={16} className="text-neon-blue" /> Agent Productivity</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.productivityData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '8px' }} cursor={{fill: '#1e293b', opacity: 0.4}} />
                <Bar dataKey="score" name="Performance Score" fill="#00f0ff" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="tasks" name="Tasks Completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mini Floor Monitor */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-white flex items-center gap-2"><Activity size={16} className="text-neon-green" /> Mini Floor Monitor</h2>
            <button onClick={() => navigate(getAppPath('/operations'))} className="text-[10px] font-bold text-neon-blue hover:underline">Full View</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
            {(agents || []).slice(0,6).map(agent => (
              <div key={agent.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full border border-gray-700" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-900
                      ${agent.status === 'On Call' || agent.status === 'Chatting' ? 'bg-yellow-500' : 
                        agent.status === 'Available' ? 'bg-neon-green' : 'bg-gray-500'}
                    `} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{agent.name}</div>
                    <div className="text-[10px] text-gray-500 uppercase">{agent.queue}</div>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded
                  ${agent.status === 'On Call' || agent.status === 'Chatting' ? 'bg-yellow-500/10 text-yellow-500' : 
                    agent.status === 'Available' ? 'bg-neon-green/10 text-neon-green' : 'bg-gray-800 text-gray-400'}
                `}>{agent.status}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* High Priority Leads */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/80">
            <h2 className="font-bold text-white">High Priority Follow-ups</h2>
          </div>
          <div className="p-0">
            <div className="divide-y divide-gray-800/50">
              {(leads || []).filter(l => l.tags?.includes('Hot') || l.tags?.includes('VIP')).slice(0, 4).map(lead => (
                <div key={lead.id} onClick={() => navigate(getAppPath(`/leads/${lead.id}`))} className="p-4 hover:bg-gray-800/30 transition-colors flex justify-between items-center group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-gray-300 font-bold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        {lead.name}
                        {lead.tags?.includes('VIP') && <span className="bg-neon-purple/20 text-neon-purple border border-neon-purple/30 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">VIP</span>}
                      </div>
                      <div className="text-[10px] text-gray-500">{lead.email} • {lead.stage}</div>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-neon-blue group-hover:border-neon-blue/50 transition-all">
                    <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Trend */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden p-5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-white flex items-center gap-2"><Target size={16} className="text-neon-pink" /> Daily Resolution Trend</h2>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Last 7 Days</div>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { day: 'Mon', tickets: 120, resolved: 110 },
                { day: 'Tue', tickets: 132, resolved: 125 },
                { day: 'Wed', tickets: 145, resolved: 130 },
                { day: 'Thu', tickets: 115, resolved: 115 },
                { day: 'Fri', tickets: 140, resolved: 135 },
                { day: 'Sat', tickets: 90, resolved: 88 },
                { day: 'Sun', tickets: 85, resolved: 80 },
              ]} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="tickets" name="Incoming" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Quick Access */}
      <QuickAccessPanel title="Manager Quick Access" cards={[
        { icon: BarChart2,    title: 'Team Performance',    description: 'View agent scores and productivity',       color: '#3b82f6', onClick: () => navigate(getAppPath('/agents')) },
        { icon: Activity,     title: 'Queue Monitor',       description: 'Live queue status and wait times',          color: '#10b981', onClick: () => navigate(getAppPath('/queue-monitor')) },
        { icon: GitBranch,    title: 'Routing Rules',       description: 'Configure inbound routing logic',           color: '#f59e0b', onClick: () => navigate(getAppPath('/routing-rules')) },
        { icon: ClipboardList,title: 'QA Review',           description: 'Review call recordings and scores',          color: '#8a2be2', onClick: () => navigate(getAppPath('/quality')) },
        { icon: UserCheck,    title: 'Assign Tasks',        description: 'Assign tasks and leads to agents',           color: '#ec4899', onClick: () => navigate(getAppPath('/tasks')) },
        { icon: Headphones,   title: 'Monitor Calls',       description: 'Live call monitoring and coaching',          color: '#f97316', onClick: () => navigate(getAppPath('/supervisor')) },
        { icon: Briefcase,    title: 'Department Reports',  description: 'Export department-level performance',        color: '#06b6d4', onClick: () => navigate(getAppPath('/department-performance')) },
        { icon: AlertOctagon, title: 'Escalation Queue',    description: 'Handle escalated and critical tickets',      color: '#ef4444', onClick: () => navigate(getAppPath('/escalations')) },
      ]} />

    </div>
  );
}
