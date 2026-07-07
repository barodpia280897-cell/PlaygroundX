// src/dashboards/AgentDashboard.jsx
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, CheckSquare, Target, Clock, Zap, Users,
  PhoneCall, Inbox, StickyNote, CalendarPlus, CheckCircle2,
  FileText, Search, BrainCircuit, Headphones,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import ConversationsPanel from '../components/dashboard/ConversationsPanel';
import TasksPanel from '../components/dashboard/TasksPanel';
import TodaySummary from '../components/dashboard/TodaySummary';
import QuickAccessPanel from '../components/dashboard/QuickAccessPanel';
import ShiftStatusCard from '../components/dashboard/ShiftStatusCard';
import PriorityLeadsQueue from '../components/dashboard/PriorityLeadsQueue';
import { getAppPath } from '../utils/routing';

const KPI = ({ label, value, change, trend, icon: Icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 flex items-center gap-3 hover:border-gray-700 transition-colors">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30`, color }}>
      <Icon size={18} />
    </div>
    <div className="min-w-0">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold truncate">{label}</div>
      <div className="text-xl font-black text-white mt-0.5">{value}</div>
      {change && (
        <div className={`flex items-center gap-0.5 text-[10px] font-bold mt-0.5 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
          {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {change}
        </div>
      )}
    </div>
  </motion.div>
);

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [leads]         = useDataStore('leads');
  const [conversations] = useDataStore('conversations');
  const [tasks]         = useDataStore('tasks');
  const [agents]        = useDataStore('agents');

  const stats = useMemo(() => {
    const myLeads    = (leads || []).length;
    const unreadChats= (conversations || []).filter(c => c.status === 'open').length;
    const tasksDue   = (tasks || []).filter(t => t.status !== 'Completed').length;
    const myAgent    = (agents || [])[0];
    const aiAssists  = myAgent?.aiAssistUsage || 145;
    const convRate   = myAgent?.conversionRate || '18%';
    return [
      { label: 'My Active Leads',    value: myLeads,   change: '+5',  trend: 'up',   icon: Users,         color: '#39ff14' },
      { label: 'Open Conversations', value: unreadChats,change: '+2',  trend: 'up',   icon: MessageSquare, color: '#00f0ff' },
      { label: 'Tasks Due Today',    value: tasksDue,   change: '-2',  trend: 'down', icon: CheckSquare,   color: '#ffd700' },
      { label: 'Avg Response Time',  value: '2m 15s',   change: '-30s',trend: 'down', icon: Clock,         color: '#ff0055' },
      { label: 'Conversion Rate',    value: convRate,   change: '+2%', trend: 'up',   icon: Target,        color: '#8a2be2' },
      { label: 'AI Assists Used',    value: aiAssists,  change: '+12', trend: 'up',   icon: Zap,           color: '#00f0ff' },
    ];
  }, [leads, conversations, tasks, agents]);

  return (
    <div className="space-y-5 pb-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Headphones size={22} className="text-neon-blue" /> My Workspace
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">Manage your daily leads, conversations, and tasks.</p>
      </motion.div>

      {/* Shift Readiness Workflow Card */}
      <ShiftStatusCard />

      {/* KPI Stats Row */}
      <div className="kpi-grid-auto">
        {stats.map((stat, i) => <KPI key={i} {...stat} />)}
      </div>

      {/* Quick Access */}
      <QuickAccessPanel title="Agent Quick Access" cards={[
        { icon: PhoneCall,    title: 'Start Call',          description: 'Dial a lead or contact now',             color: '#10b981', onClick: () => navigate(getAppPath('/leads')) },
        { icon: Inbox,        title: 'Open Inbox',          description: 'View all conversations',                 color: '#3b82f6', onClick: () => navigate(getAppPath('/conversations')) },
        { icon: StickyNote,   title: 'Add Note',            description: 'Log a note to a lead profile',           color: '#f59e0b', onClick: () => navigate(getAppPath('/leads')) },
        { icon: CalendarPlus, title: 'Schedule Follow-up',  description: 'Book a follow-up appointment',            color: '#8a2be2', onClick: () => navigate(getAppPath('/workspace')) },
        { icon: CheckCircle2, title: 'Complete Task',       description: 'Mark pending tasks as done',             color: '#ec4899', onClick: () => navigate(getAppPath('/tasks')) },
        { icon: FileText,     title: 'Send Template',       description: 'Send a pre-built message template',      color: '#f97316', onClick: () => navigate(getAppPath('/conversations')) },
        { icon: Search,       title: 'Search Lead',         description: 'Find any lead by name, email or phone',  color: '#06b6d4', onClick: () => navigate(getAppPath('/leads')) },
        { icon: BrainCircuit, title: 'AI Suggestions',      description: 'Get AI-powered next best actions',       color: '#a855f7', onClick: () => navigate(getAppPath('/workspace')) },
      ]} />

      {/* Panels Row: Priority Queue | Conversations | Tasks */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4">
          <PriorityLeadsQueue />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <ConversationsPanel />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <TasksPanel />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center pt-4">
        <p className="text-xs text-gray-700 tracking-[0.3em] uppercase font-semibold">PlayGroundX · Agent Workspace</p>
      </motion.div>
    </div>
  );
}
