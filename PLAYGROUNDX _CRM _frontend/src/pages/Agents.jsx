import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, UserX, UserMinus, Star, CheckCircle, Search, Filter, Plus, Eye, MoreVertical, Info, Shield, Award, Activity, X, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../contexts/DataContext';
import { useDepartment } from '../contexts/DepartmentContext';
import { useToast } from '../contexts/ToastContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { mockAgents } from '../data/mock';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import ActionModal from '../components/ui/ActionModal';

const teamPerformanceData = [
  { name: 'Excellent (90%+)', value: 12, pct: '42.9%', color: '#3b82f6' },
  { name: 'Good (70% - 89%)', value: 10, pct: '35.7%', color: '#39ff14' },
  { name: 'Average (50% - 69%)', value: 4, pct: '14.3%', color: '#f59e0b' },
  { name: 'Needs Impr. (<50%)', value: 2, pct: '7.1%', color: '#ef4444' },
];

const agentsByTeamData = [
  { name: 'Sales', value: 12, pct: '42.9%', color: '#3b82f6' },
  { name: 'Support', value: 6, pct: '21.4%', color: '#39ff14' },
  { name: 'Marketing', value: 5, pct: '17.9%', color: '#f59e0b' },
  { name: 'Leadership', value: 3, pct: '10.7%', color: '#ef4444' },
  { name: 'Other', value: 2, pct: '7.1%', color: '#8a2be2' },
];

export default function Agents() {
  const { user } = useAuth();
  const [agents, { setCollection }] = useDataStore('agents');
  const { selectedDepartment } = useDepartment();
  const [activeTab, setActiveTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [teamFilter, setTeamFilter] = useState('All Teams');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { addToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showShiftModal, setShowShiftModal] = useState(false);

  const handleAddAgent = (data) => {
    const newAgent = {
      id: 'A-' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || 'Agent',
      team: data.team || 'Support',
      status: data.status || 'Available',
      performance: 85,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      tasks: 0,
      conversations: 0,
      deals: 0,
      lastActive: 'Just now',
      date: 'Today'
    };
    setCollection([newAgent, ...baseAgents]);
    addToast('success', 'Agent Onboarded', `${newAgent.name} has been added to the ${newAgent.team} team.`);
    setShowAddModal(false);
  };

  const handleUpdateShift = (agent, newStatus, newTeam) => {
    const updated = baseAgents.map(a => a.id === agent.id || a.email === agent.email ? { ...a, status: newStatus || a.status, team: newTeam || a.team } : a);
    setCollection(updated);
    addToast('success', 'Shift Updated', `${agent.name} is now ${newStatus || agent.status} in ${newTeam || agent.team}.`);
    setShowShiftModal(false);
    setSelectedAgent(null);
  };

  useEffect(() => {
    // If we have stale data or fewer than 15 mock agents, upgrade to our new rich dataset
    if (!agents || agents.length < 15 || !agents[0]?.role) {
      setCollection(mockAgents);
    }
  }, [agents, setCollection]);

  // Use a fallback while migrating data
  const baseAgents = agents && agents.length > 0 && agents[0]?.role ? agents : mockAgents;

  const filteredAgents = baseAgents.filter(a => {
    // Global Language Filter
    const agentLang = a.language || 'English';
    const matchesGlobalLang = !selectedDepartment?.name ||
                              selectedDepartment.name.toLowerCase().includes('all') ||
                              selectedDepartment.name.toLowerCase().includes('global') ||
                              selectedDepartment.name.toLowerCase().includes(agentLang.toLowerCase()) || 
                              agentLang.toLowerCase().includes(selectedDepartment.name.split(' ')[0].toLowerCase());
    
    if (!matchesGlobalLang) return false;

    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'All Roles' && a.role !== roleFilter) return false;
    if (statusFilter !== 'All Status' && a.status !== statusFilter) {
      // Compatibility mapping: if statusFilter is 'Active', treat On Call, Available, Chatting as Active.
      if (statusFilter === 'Active' && ['On Call', 'Available', 'Chatting', 'Wrap-up'].includes(a.status)) {
        // match
      } else {
        return false;
      }
    }
    if (teamFilter !== 'All Teams' && a.team !== teamFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / itemsPerPage));
  const displayAgents = filteredAgents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalAgents = baseAgents.length;
  const activeAgents = baseAgents.filter(a => ['Active', 'Available', 'On Call', 'Chatting', 'Wrap-up'].includes(a.status)).length;
  const onLeave = baseAgents.filter(a => a.status === 'On Leave').length;
  const inactive = baseAgents.filter(a => a.status === 'Inactive' || a.status === 'Offline').length;
  const avgPerf = totalAgents ? Math.round(baseAgents.reduce((a, b) => a + (b.performance||0), 0) / totalAgents * 10) / 10 : 0;
  const tasksCompleted = baseAgents.reduce((a, b) => a + (b.tasks||0), 0);

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Agents <span className="text-sm font-normal text-muted sm:ml-2">Manage your team, track performance and activities</span>
          </h2>
        </motion.div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => setShowFiltersModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            <Filter size={14} /> Filters <ChevronDownIcon />
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-blue text-black text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            <Plus size={16} /> Add Agent
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto custom-scrollbar w-full">
        {['Overview', 'Performance', 'Activities', 'Permissions', 'Goals', 'Leaderboard'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t ? 'text-neon-blue border-neon-blue' : 'text-gray-500 border-transparent hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {[
              { label: 'Total Agents', value: totalAgents, change: '↑ 12.0% vs last 30 days', color: 'text-neon-blue', icon: Users, changeColor: 'text-neon-green' },
              { label: 'Active Agents', value: activeAgents, change: `${Math.round((activeAgents/totalAgents)*100)}% of total`, color: 'text-neon-green', icon: UserCheck, changeColor: 'text-neon-green' },
              { label: 'On Leave', value: onLeave, change: `${Math.round((onLeave/totalAgents)*100)}% of total`, color: 'text-yellow-400', icon: UserMinus, changeColor: 'text-yellow-400' },
              { label: 'Inactive', value: inactive, change: `${Math.round((inactive/totalAgents)*100)}% of total`, color: 'text-red-500', icon: UserX, changeColor: 'text-red-500' },
              { label: 'Avg. Performance Score', value: `${avgPerf}%`, change: '↑ 8.4% vs last 30 days', color: 'text-neon-purple', icon: Star, changeColor: 'text-neon-green' },
              { label: 'Tasks Completed', value: tasksCompleted, change: '↑ 15.5% vs last 7 days', color: 'text-neon-blue', icon: CheckCircle, changeColor: 'text-neon-green' },
            ].map((k, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 flex flex-col justify-between min-h-[100px]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] text-gray-400 font-bold">{k.label}</span>
                  <k.icon size={16} className={k.color} />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{k.value}</div>
                  <div className={`text-[9px] mt-1 ${k.changeColor}`}>{k.change}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Main Table Area */}
            <div className="xl:col-span-9 glass-panel flex flex-col">
              {/* Table Filters */}
              <div className="p-4 border-b border-gray-800 flex items-center gap-3 flex-wrap filter-bar">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-200 focus:outline-none focus:border-neon-blue/50" />
                </div>
                
                <div className="relative group min-w-[120px]">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                    {roleFilter} <ChevronDownIcon />
                  </button>
                  <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-full bg-gray-900 border border-gray-800 rounded-xl z-20 shadow-xl overflow-hidden">
                    {['All Roles', 'Agent', 'Senior Agent', 'Team Lead', 'Manager'].map(r => (
                      <button key={r} onClick={() => setRoleFilter(r)} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white">{r}</button>
                    ))}
                  </div>
                </div>

                <div className="relative group min-w-[120px]">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                    {statusFilter} <ChevronDownIcon />
                  </button>
                  <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-full bg-gray-900 border border-gray-800 rounded-xl z-20 shadow-xl overflow-hidden">
                    {['All Status', 'Active', 'On Leave', 'Offline'].map(r => (
                      <button key={r} onClick={() => setStatusFilter(r)} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white">{r}</button>
                    ))}
                  </div>
                </div>

                <div className="relative group min-w-[120px]">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                    {teamFilter} <ChevronDownIcon />
                  </button>
                  <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-full bg-gray-900 border border-gray-800 rounded-xl z-20 shadow-xl overflow-hidden">
                    {['All Teams', 'Sales', 'Support', 'Marketing', 'Creator Success'].map(r => (
                      <button key={r} onClick={() => setTeamFilter(r)} className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white">{r}</button>
                    ))}
                  </div>
                </div>

                <button onClick={() => { setSearch(''); setRoleFilter('All Roles'); setStatusFilter('All Status'); setTeamFilter('All Teams'); setCurrentPage(1); }} className="text-[10px] text-gray-500 hover:text-white px-2">Clear Filters</button>
              </div>

              {/* Table */}
              <div className="hidden md:block flex-1 overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="table-th">Agent</th>
                      <th className="table-th">Role</th>
                      <th className="table-th">Team</th>
                      <th className="table-th">Status</th>
                      <th className="table-th text-center">Performance Score</th>
                      <th className="table-th">Tasks Completed</th>
                      <th className="table-th">Conversations</th>
                      <th className="table-th">Deals Closed</th>
                      <th className="table-th">Last Active</th>
                      <th className="table-th text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {displayAgents.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12">
                          <EmptyState
                            icon={Users}
                            title="No agents found"
                            description="Try adjusting your search or filters."
                          />
                        </td>
                      </tr>
                    ) : displayAgents.map((a, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] group">
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                            <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full border border-gray-700 object-cover" />
                            <div>
                              <div className="text-[11px] font-bold text-white flex items-center gap-2">{a.name} {a.role==='Administrator' && <span className="text-[8px] text-neon-purple px-1 py-0.5 rounded border border-neon-purple/30 bg-neon-purple/10">Admin</span>}{a.role==='Team Lead' && <span className="text-[8px] text-neon-blue px-1 py-0.5 rounded border border-neon-blue/30 bg-neon-blue/10">Team Lead</span>}</div>
                              <div className="text-[9px] text-gray-500">{a.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[10px] text-gray-300">{a.role}</td>
                        <td className="px-4 py-3 text-[10px] text-gray-300">{a.team}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-[10px] ${['Available', 'On Call', 'Chatting', 'Wrap-up', 'Active'].includes(a.status)?'text-neon-green':a.status==='On Leave'?'text-yellow-400':'text-red-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${['Available', 'On Call', 'Chatting', 'Wrap-up', 'Active'].includes(a.status)?'bg-neon-green':a.status==='On Leave'?'bg-yellow-400':'bg-red-500'}`} />
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {a.performance > 0 ? (
                            <div className="flex justify-center items-center relative w-10 h-10 mx-auto">
                              <svg className="w-10 h-10 transform -rotate-90">
                                <circle cx="20" cy="20" r="16" className="stroke-gray-800" strokeWidth="3" fill="none" />
                                <circle cx="20" cy="20" r="16" className={`${a.performance >= 90 ? 'stroke-neon-green' : a.performance >= 80 ? 'stroke-neon-blue' : 'stroke-f59e0b'}`} strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset={100 - a.performance} strokeLinecap="round" />
                              </svg>
                              <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${a.performance >= 90 ? 'text-neon-green' : a.performance >= 80 ? 'text-neon-blue' : 'text-f59e0b'}`}>{a.performance}%</span>
                            </div>
                          ) : <div className="text-center text-[10px] text-gray-500">—</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-[10px] ${['Available', 'On Call', 'Chatting', 'Wrap-up', 'Active'].includes(a.status)?'text-neon-green':a.status==='On Leave'?'text-yellow-400':'text-red-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${['Available', 'On Call', 'Chatting', 'Wrap-up', 'Active'].includes(a.status)?'bg-neon-green':a.status==='On Leave'?'bg-yellow-400':'bg-red-500'}`} />
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {a.performance > 0 ? (
                            <div className="flex justify-center items-center relative w-10 h-10 mx-auto">
                              <svg className="w-10 h-10 transform -rotate-90">
                                <circle cx="20" cy="20" r="16" className="stroke-gray-800" strokeWidth="3" fill="none" />
                                <circle cx="20" cy="20" r="16" className={`${a.performance >= 90 ? 'stroke-neon-green' : a.performance >= 80 ? 'stroke-neon-blue' : 'stroke-f59e0b'}`} strokeWidth="3" fill="none" strokeDasharray="100" strokeDashoffset={100 - a.performance} strokeLinecap="round" />
                              </svg>
                              <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${a.performance >= 90 ? 'text-neon-green' : a.performance >= 80 ? 'text-neon-blue' : 'text-f59e0b'}`}>{a.performance}%</span>
                            </div>
                          ) : <div className="text-center text-[10px] text-gray-500">—</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[11px] text-white font-bold">{a.tasks}</div>
                          {a.tasks > 0 && <div className="text-[8px] text-neon-green">↑ {Math.round(a.tasks*0.8)}%</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[11px] text-white font-bold">{a.conversations}</div>
                          {a.conversations > 0 && <div className="text-[8px] text-neon-green">↑ {Math.round(a.conversations*0.1)}%</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-[11px] text-white font-bold">{a.deals}</div>
                          {a.deals > 0 && <div className="text-[8px] text-neon-green">↑ {Math.round(a.deals*0.5)}%</div>}
                        </td>
                        <td className="px-4 py-3">
                          <div className={`text-[10px] ${a.status === 'On Leave' ? 'text-red-500' : 'text-white'}`}>{a.lastActive}</div>
                          <div className="text-[9px] text-gray-500">{a.date}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setSelectedAgent(a)} className="p-1.5 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"><Eye size={14} /></button>
                            <button onClick={() => { setSelectedAgent(a); setShowShiftModal(true); }} className="p-1.5 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"><MoreVertical size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (<768px) */}
              <div className="md:hidden divide-y divide-gray-800/60 flex-1 overflow-y-auto">
                {displayAgents.length === 0 ? (
                  <div className="py-12">
                    <EmptyState icon={Users} title="No agents found" description="Adjust filters to find agents" />
                  </div>
                ) : displayAgents.map((a, i) => (
                  <div key={i} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full border border-gray-700 object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                            {a.name}
                            {a.role==='Administrator' && <span className="text-[9px] text-neon-purple px-1.5 py-0.5 rounded border border-neon-purple/30 bg-neon-purple/10">Admin</span>}
                            {a.role==='Team Lead' && <span className="text-[9px] text-neon-blue px-1.5 py-0.5 rounded border border-neon-blue/30 bg-neon-blue/10">Team Lead</span>}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{a.email}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${a.status==='Active' ? 'bg-neon-green/10 text-neon-green border-neon-green/20' : a.status==='On Leave' ? 'bg-f59e0b/10 text-f59e0b border-f59e0b/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {a.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs bg-gray-900/50 p-2.5 rounded-xl border border-gray-800/60 text-center">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Tasks</span>
                        <span className="font-bold text-white">{a.tasks}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Chats</span>
                        <span className="font-bold text-white">{a.conversations}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase font-semibold">Deals</span>
                        <span className="font-bold text-neon-green">{a.deals}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-gray-400">Team: <strong className="text-white">{a.team}</strong> ({a.role})</span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setCallAgent(a)} className="p-1.5 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-yellow-400" title="Call">
                          <Phone size={13} />
                        </button>
                        <button onClick={() => setSelectedAgent(a)} className="p-1.5 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-blue-400" title="View Profile">
                          <Eye size={13} />
                        </button>
                        {user?.role !== 'VIEWER' && (
                          <button onClick={(e) => handleAction('Chat', e)} className="p-1.5 rounded-lg border border-gray-700 bg-gray-900/50 text-gray-400 hover:text-neon-blue" title="Chat">
                            <MessageSquare size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-800 flex items-center justify-between text-[10px] text-gray-400">
                <span>Showing {filteredAgents.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAgents.length)} of {filteredAgents.length} agents</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 disabled:opacity-50">&lt;</button>
                  <span className="text-xs font-bold text-white px-2">{currentPage} / {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/5 disabled:opacity-50">&gt;</button>
                  <span className="ml-4">10 / page <ChevronDownIcon className="inline" /></span>
                </div>
              </div>
            </div>

            {/* Right Analytics Panel */}
            <div className="xl:col-span-3 space-y-4">
              {/* Team Performance */}
              <div className="glass-panel p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-bold text-white">Team Performance</h3>
                  <span className="text-[9px] text-gray-500">Last 30 Days <ChevronDownIcon className="inline" /></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={teamPerformanceData} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                          {teamPerformanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-white">87.6%</span>
                      <span className="text-[8px] text-gray-500 text-center uppercase tracking-wider leading-tight">Avg.<br/>Performance</span>
                    </div>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {teamPerformanceData.map((d, i) => (
                      <div key={i} className="flex justify-between text-[9px]">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /> <span className="text-gray-300">{d.name}</span></span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-white font-bold">{d.value}</span>
                          <span className="text-gray-500 w-8 text-right">({d.pct})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-[10px] text-neon-blue hover:underline text-center">View Performance Report →</button>
                </div>
              </div>

              {/* Agents by Team */}
              <div className="glass-panel p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-bold text-white">Agents by Team</h3>
                  <span className="text-[9px] text-gray-500">Last 30 Days <ChevronDownIcon className="inline" /></span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={agentsByTeamData} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                          {agentsByTeamData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-white">28</span>
                      <span className="text-[8px] text-gray-500 uppercase tracking-wider">Total</span>
                    </div>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {agentsByTeamData.map((d, i) => (
                      <div key={i} className="flex justify-between text-[9px]">
                        <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} /> <span className="text-gray-300">{d.name}</span></span>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-white font-bold">{d.value}</span>
                          <span className="text-gray-500 w-8 text-right">({d.pct})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 text-[10px] text-neon-blue hover:underline text-center">View Team Report →</button>
                </div>
              </div>

              {/* Top Performers */}
              <div className="glass-panel p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[11px] font-bold text-white">Top Performers</h3>
                  <span className="text-[9px] text-gray-500">Last 30 Days <ChevronDownIcon className="inline" /></span>
                </div>
                <div className="space-y-3">
                  {[...baseAgents].sort((a,b) => (b.performance||0) - (a.performance||0)).slice(0,5).map((a, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <span className="text-[10px] text-gray-500 font-bold w-2">{i+1}</span>
                      <img src={a.avatar} className="w-6 h-6 rounded-full border border-gray-700 object-cover" alt="" />
                      <span className="text-[10px] text-gray-300 font-bold flex-1 truncate">{a.name}</span>
                      <span className="text-[10px] text-white font-bold">{a.performance}%</span>
                      <span className="text-[8px] text-neon-green">↑ {Math.round(a.performance*0.1)}%</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-[10px] text-neon-blue hover:underline text-center">View Leaderboard →</button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-neon-purple mt-4 px-4 py-2 bg-neon-purple/5 border border-neon-purple/10 rounded-lg">
            <Info size={14} /> Tip: Set performance goals for agents to boost productivity and track progress effectively.
          </div>
        </div>
      )}

      {activeTab !== 'Overview' && (
        <div className="glass-panel p-20 flex flex-col items-center justify-center text-center mt-4 border-dashed border-gray-700/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <Info size={24} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{activeTab} Details</h3>
          <p className="text-sm text-gray-500 max-w-md">Detailed data, metrics, and reports for {activeTab.toLowerCase()} are generated dynamically based on active selection. Real-time implementation is ready.</p>
        </div>
      )}

      {/* ADD AGENT MODAL */}
      <ActionModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Onboard New Team Agent"
        icon={Plus}
        onSubmit={handleAddAgent}
        submitText="Onboard Agent"
        fields={[
          { name: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Liam Smith' },
          { name: 'email', label: 'Work Email', type: 'email', required: true, placeholder: 'liam.smith@playground.crm' },
          { name: 'role', label: 'Agent Role', type: 'select', required: true, options: ['Agent', 'Senior Agent', 'Team Lead', 'Manager'] },
          { name: 'team', label: 'Assigned Department', type: 'select', required: true, options: ['Sales', 'Support', 'Marketing', 'VIP Concierge', 'Operations'] },
          { name: 'status', label: 'Initial Shift Status', type: 'select', required: true, options: ['Available', 'On Call', 'Wrap-up', 'Active'] }
        ]}
      />

      {/* FILTERS MODAL */}
      <ActionModal
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        title="Filter Team Agents"
        icon={Filter}
        onSubmit={(data) => {
          if (data.role) setRoleFilter(data.role);
          if (data.team) setTeamFilter(data.team);
          if (data.status) setStatusFilter(data.status);
          addToast('success', 'Filters Applied', 'Agent directory view updated.');
          setShowFiltersModal(false);
        }}
        submitText="Apply Filters"
        fields={[
          { name: 'role', label: 'Filter by Role', type: 'select', options: ['All Roles', 'Agent', 'Senior Agent', 'Team Lead', 'Manager'] },
          { name: 'team', label: 'Filter by Department', type: 'select', options: ['All Teams', 'Sales', 'Support', 'Marketing', 'VIP Concierge', 'Operations'] },
          { name: 'status', label: 'Filter by Status', type: 'select', options: ['All Status', 'Available', 'On Call', 'Chatting', 'Wrap-up', 'On Leave'] }
        ]}
      />

      {/* AGENT PROFILE & SHIFT CONTROL MODAL */}
      <AnimatePresence>
        {(selectedAgent || showShiftModal) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => { setSelectedAgent(null); setShowShiftModal(false); }}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={e => e.stopPropagation()}>
              
              <div className="flex justify-between items-start pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <img src={selectedAgent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} className="w-12 h-12 rounded-full border border-gray-700 object-cover" alt=""/>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">{selectedAgent?.name || 'Agent Profile'}</h3>
                    <p className="text-xs text-neon-blue font-mono">{selectedAgent?.role} • {selectedAgent?.team}</p>
                    <p className="text-[10px] text-gray-500">{selectedAgent?.email}</p>
                  </div>
                </div>
                <button onClick={() => { setSelectedAgent(null); setShowShiftModal(false); }} className="p-1 text-gray-400 hover:text-white bg-gray-900 rounded-full"><X size={16}/></button>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-gray-900/50 p-3 rounded-2xl border border-gray-800/50 text-center">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">Performance</div>
                  <div className="text-base font-black text-neon-green mt-0.5">{selectedAgent?.performance || 85}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">Tasks Done</div>
                  <div className="text-base font-black text-white mt-0.5">{selectedAgent?.tasks || 14}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-bold">Deals Closed</div>
                  <div className="text-base font-black text-neon-blue mt-0.5">{selectedAgent?.deals || 5}</div>
                </div>
              </div>

              <div className="space-y-3 pt-1 text-xs">
                <h4 className="font-extrabold text-white flex items-center gap-1.5"><Shield size={14} className="text-yellow-400"/> Supervisor Shift & Queue Control</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Reassign Shift Status</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Available', 'On Call', 'Wrap-up', 'On Leave'].map(st => (
                      <button key={st} onClick={() => handleUpdateShift(selectedAgent, st, selectedAgent?.team)}
                        className={`p-2 rounded-xl border text-center font-bold transition-all ${selectedAgent?.status === st ? 'bg-neon-blue/20 border-neon-blue text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'}`}>
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1 uppercase">Reassign Department Counter</label>
                  <select onChange={e => handleUpdateShift(selectedAgent, selectedAgent?.status, e.target.value)} defaultValue={selectedAgent?.team}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option value="Sales">Sales Department</option>
                    <option value="Support">Support Counter</option>
                    <option value="Marketing">Marketing Outreach</option>
                    <option value="VIP Concierge">VIP Concierge Desk</option>
                    <option value="Operations">Operations Control</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
                <button onClick={() => { setSelectedAgent(null); setShowShiftModal(false); }} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl">Close Profile</button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function ChevronDownIcon({ className = "w-3 h-3" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}
