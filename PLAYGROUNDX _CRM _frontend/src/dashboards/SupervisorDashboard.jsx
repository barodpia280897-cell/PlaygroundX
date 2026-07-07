import { getAppPath } from '../utils/routing';
// src/dashboards/SupervisorDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/ui/StatCard';
import AgentAlerts from '../components/dashboard/AgentAlerts';
import TasksPanel from '../components/dashboard/TasksPanel';
import LanguageDistributionChart from '../components/dashboard/LanguageDistributionChart';
import QuickAccessPanel from '../components/dashboard/QuickAccessPanel';
import { useDataStore } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import {
  Users, AlertTriangle, CheckSquare, Clock, Phone, MessageCircle,
  Activity, Globe, Target, TrendingUp, UserX, Coffee,
  ClipboardList, AlertOctagon, UserCheck, BarChart2,
  ShieldCheck, CalendarIcon, ChevronRight, Bell, Zap
} from 'lucide-react';

const priorityConfig = {
  High:   { color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30',    dot: 'bg-red-500' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-500' },
  Low:    { color: 'text-gray-400',   bg: 'bg-gray-700/50 border-gray-700',     dot: 'bg-gray-500' },
};

function AssistanceRequestWidget({ navigate }) {
  const [requests] = useDataStore('supervisorAssistanceRequests');
  const pending = (requests || []).filter(r => r.status === 'Pending');

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
          <Bell size={15} className="text-orange-400 animate-pulse" />
          Supervisor Assistance Requests
          {pending.length > 0 && (
            <span className="ml-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300">
              {pending.length} PENDING
            </span>
          )}
        </h3>
        <button
          onClick={() => navigate(getAppPath('/escalations'))}
          className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
        >
          View All <ChevronRight size={12} />
        </button>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          <ShieldCheck size={28} className="mx-auto mb-2 text-neon-green opacity-50" />
          No pending assistance requests
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((req, i) => {
            const p = priorityConfig[req.priority] || priorityConfig.Low;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 bg-gray-950/60 border border-gray-800/80 hover:border-orange-500/30 rounded-xl p-3.5 group cursor-pointer transition-all"
              >
                {/* Agent Avatar */}
                <div className="relative shrink-0">
                  <img src={req.agentAvatar} alt={req.agentName} className="w-9 h-9 rounded-full border-2 border-gray-700 object-cover" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950 ${p.dot}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white truncate">{req.agentName}</span>
                    <span className="text-[10px] text-gray-500 font-mono shrink-0">{req.timeAgo}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-orange-300">{req.requestType}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${p.bg} ${p.color}`}>
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate">{req.context}</p>
                </div>

                {/* Review CTA */}
                <button
                  onClick={() => navigate(getAppPath('/escalations'))}
                  className="shrink-0 px-2.5 py-1.5 bg-orange-500/10 border border-orange-500/30 text-orange-300 text-[10px] font-black rounded-lg hover:bg-orange-500/20 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                >
                  Review <ChevronRight size={10} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const supervisorStats = [
  { label: 'Agents Online',    value: '8/10',   change: '2 offline', trend: 'down', icon: Users,          color: '#39ff14' },
  { label: 'Active Escalations', value: '4',    change: '+1',        trend: 'up',   icon: AlertTriangle,  color: '#ff0055' },
  { label: 'Avg Reply Time',   value: '1m 45s', change: '-12s',      trend: 'down', icon: Clock,          color: '#00f0ff' },
  { label: 'Team Tasks Due',   value: '12',     change: '-3',        trend: 'down', icon: CheckSquare,    color: '#ffd700' },
  { label: 'Active Calls',     value: '3',      change: 'stable',    trend: 'up',   icon: Phone,          color: '#8a2be2' },
  { label: 'Open Chats',       value: '45',     change: '+12',       trend: 'up',   icon: MessageCircle,  color: '#00f0ff' },
];

const deptPulseItems = [
  { label: 'SLA Compliance',      val: '96.2%',     sub: '+1.4% today',      color: 'text-neon-green bg-neon-green/10 border-neon-green/30' },
  { label: 'Dept Performance',    val: '94.2%',     sub: 'Top Quartile',     color: 'text-neon-blue bg-neon-blue/10 border-neon-blue/30' },
  { label: 'Conversion Rate',     val: '32.4%',     sub: '+3.1% this week',  color: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30' },
  { label: 'Open Opportunities',  val: '18 Deals',  sub: '$45.2K potential', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  { label: 'Offline Agents',      val: '2 Offline', sub: 'End of shift',     color: 'text-gray-400 bg-gray-800 border-gray-700' },
  { label: 'Break Status',        val: '1 On Break',sub: 'Next at 1:00 PM',  color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
];

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState('All Teams');
  const teams = ['All Teams', 'Spanish Team', 'English Team', 'Arabic Team', 'French Team'];

  return (
    <div className="space-y-5 pb-10">

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green/20 to-neon-blue/20 border border-neon-green/30 flex items-center justify-center">
              <Globe size={16} className="text-neon-green" />
            </div>
            Team Supervisor Dashboard
          </h2>
          <p className="text-sm text-muted mt-1">Oversee language department queues, agent SLA, and escalations.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Language Team Selector Pills */}
          <div className="flex bg-gray-900/80 border border-gray-800 p-1 rounded-xl overflow-x-auto custom-scrollbar max-w-full">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setActiveTeam(team)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                  activeTeam === team
                    ? 'bg-neon-green text-black shadow-lg shadow-neon-green/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {team}
              </button>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => navigate(getAppPath('/supervisor'))} className="px-3.5 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-xl text-xs font-bold text-white transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <Activity size={14} className="text-neon-green" /> Monitor Floor
            </button>
            <button onClick={() => navigate(getAppPath('/escalations'))} className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-lg shadow-red-500/20 whitespace-nowrap">
              <AlertTriangle size={14} /> Escalations
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── KPI STATS ─────────────────────────────────────────────── */}
      <div className="kpi-grid-auto">
        {supervisorStats.map((stat, i) => <StatCard key={i} stat={stat} index={i} />)}
      </div>

      {/* ── SUPERVISOR ASSISTANCE REQUESTS ────────────────────────── */}
      <AssistanceRequestWidget navigate={navigate} />

      {/* ── DEPARTMENT PERFORMANCE PULSE ──────────────────────────── */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3 border-b border-gray-800/80 pb-2">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} className="text-neon-blue" /> {activeTeam} — Operational Performance Pulse
          </h3>
          <span className="text-[10px] bg-neon-blue/10 border border-neon-blue/30 text-neon-blue px-2 py-0.5 rounded font-bold">DEPARTMENT VIEW</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {deptPulseItems.map((item, idx) => (
            <div key={idx} className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-gray-700 transition-all">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">{item.label}</div>
              <div className="text-lg font-black text-white mt-1 leading-tight">{item.val}</div>
              <div className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded w-fit border ${item.color}`}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROW 2: Agent Alerts | Tasks | Language Distribution ───── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-5">
          <AgentAlerts />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <TasksPanel />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <LanguageDistributionChart />
        </div>
      </div>

      {/* ── SUPERVISOR QUICK ACCESS ────────────────────────────────── */}
      <QuickAccessPanel title="Supervisor Quick Access" cards={[
        { icon: Activity,     title: 'Floor Monitor',    description: 'Live queue status and agent floor view',    color: '#10b981', onClick: () => navigate(getAppPath('/supervisor')) },
        { icon: AlertOctagon, title: 'Escalation Queue', description: 'Review and resolve critical escalations',   color: '#ef4444', onClick: () => navigate(getAppPath('/escalations')) },
        { icon: Users,        title: 'Live Operations',  description: 'Monitor live operational queues',           color: '#3b82f6', onClick: () => navigate(getAppPath('/operations')) },
        { icon: Clock,        title: 'Queue Monitor',    description: 'Real-time wait times and SLA timers',       color: '#f59e0b', onClick: () => navigate(getAppPath('/queue-monitor')) },
        { icon: CheckSquare,  title: 'Team Tasks',       description: 'Assign and monitor team task queue',        color: '#ec4899', onClick: () => navigate(getAppPath('/tasks')) },
        { icon: ClipboardList,title: 'Quality Assurance',description: 'Evaluate agent calls and chat quality',     color: '#8a2be2', onClick: () => navigate(getAppPath('/quality')) },
        { icon: CalendarIcon, title: 'Team Calendar',    description: 'View team appointments and schedules',      color: '#f97316', onClick: () => navigate(getAppPath('/calendar')) },
        { icon: Zap,          title: 'Activity Feed',    description: 'Live stream of team activities and events', color: '#06b6d4', onClick: () => navigate(getAppPath('/activity-feed')) },
      ]} />

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center pt-4">
        <p className="text-xs text-gray-700 tracking-[0.3em] uppercase font-semibold">PlayGroundX · Supervisor View</p>
      </motion.div>
    </div>
  );
}
