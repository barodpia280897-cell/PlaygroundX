import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Clock, Filter, Search, MoreHorizontal, Eye, ChevronDown, Calendar as CalendarIcon, X, CheckCircle, AlertCircle, Clock as ClockIcon, Activity, Trash2, CheckSquare as TaskIcon, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ActionModal from '../components/ui/ActionModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { useAuth } from '../contexts/AuthContext';
import { filterDataByRole } from '../utils/rbac';
import { useToast } from '../contexts/ToastContext';

const initialTaskList = [
  { id: 1, title: 'Follow up with VIP prospect', desc: 'High value lead showing interest in 80/20 split', type: 'Follow Up', typeColor: '#8a2be2', relatedName: 'Maria Gonzalez', relatedType: 'VIP Lead', relatedAvatar: 'https://i.pravatar.cc/150?img=1', assignedName: 'Priya Sharma', assignedAvatar: 'https://i.pravatar.cc/150?img=47', priority: 'High', due: 'Today, 10:00 AM', dateNum: 20, isOverdue: true, status: 'Overdue', statusColor: '#ef4444' },
  { id: 2, title: 'Inbound VIP Call requested', desc: 'Inbound call request via creator studio website', type: 'Call', typeColor: '#3b82f6', relatedName: 'Carlos Ramirez', relatedType: 'Fan', relatedAvatar: 'https://i.pravatar.cc/150?img=11', assignedName: 'Mike Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=12', priority: 'High', due: 'Today, 11:00 AM', dateNum: 20, isOverdue: false, status: 'In Progress', statusColor: '#3b82f6' },
  { id: 3, title: 'KYC Government ID review', desc: 'Review and verify passport photo scans', type: 'KYC', typeColor: '#10b981', relatedName: 'Ahmed Al Mansour', relatedType: 'Creator', relatedAvatar: 'https://i.pravatar.cc/150?img=7', assignedName: 'Omar Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=8', priority: 'Medium', due: 'Today, 02:00 PM', dateNum: 20, isOverdue: false, status: 'In Progress', statusColor: '#3b82f6' },
  { id: 4, title: 'Stripe wire transfer failure check', desc: 'Payment declined $200, follow up for alternate routing', type: 'Payment', typeColor: '#f59e0b', relatedName: 'Jenna Smith', relatedType: 'Creator', relatedAvatar: 'https://i.pravatar.cc/150?img=5', assignedName: 'Emma Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=9', priority: 'Medium', due: 'Tomorrow, 09:00 AM', dateNum: 21, isOverdue: false, status: 'Pending', statusColor: '#f59e0b' },
  { id: 5, title: 'Welcome new creator Tier 1', desc: 'Send welcome email and custom branding guidelines', type: 'Onboarding', typeColor: '#0ea5e9', relatedName: 'Priya Patel', relatedType: 'Creator', relatedAvatar: 'https://i.pravatar.cc/150?img=20', assignedName: 'Lily Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=21', priority: 'Low', due: 'Tomorrow, 11:00 AM', dateNum: 21, isOverdue: false, status: 'Pending', statusColor: '#f59e0b' },
  { id: 6, title: 'Review custom portfolio video', desc: 'New studio promo reel submitted for approval', type: 'Review', typeColor: '#8a2be2', relatedName: 'Joao Silva', relatedType: 'Creator', relatedAvatar: 'https://i.pravatar.cc/150?img=15', assignedName: 'Arjun Agent', assignedAvatar: 'https://i.pravatar.cc/16', priority: 'Medium', due: 'May 22, 10:00 AM', dateNum: 22, isOverdue: false, status: 'Pending', statusColor: '#f59e0b' },
  { id: 7, title: 'Send tax invoice to studio', desc: 'Monthly 80/20 payout invoice breakdown', type: 'Finance', typeColor: '#10b981', relatedName: 'Lucas Moreau', relatedType: 'Creator', relatedAvatar: 'https://i.pravatar.cc/150?img=33', assignedName: 'Priya Sharma', assignedAvatar: 'https://i.pravatar.cc/150?img=47', priority: 'Low', due: 'May 22, 03:00 PM', dateNum: 22, isOverdue: false, status: 'Completed', statusColor: '#10b981' },
  { id: 8, title: 'Check bank account verification deposit', desc: 'Verify micro-deposits for direct ACH withdrawal', type: 'Payment', typeColor: '#f59e0b', relatedName: 'Sarah Johnson', relatedType: 'Fan', relatedAvatar: 'https://i.pravatar.cc/150?img=42', assignedName: 'Mike Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=12', priority: 'High', due: 'May 18, 01:00 PM', dateNum: 18, isOverdue: false, status: 'Completed', statusColor: '#10b981' },
  { id: 9, title: 'Update creator contract tags', desc: 'Add VIP badge from phone consultation notes', type: 'Admin', typeColor: '#64748b', relatedName: 'Jin Woo', relatedType: 'Lead', relatedAvatar: 'https://i.pravatar.cc/150?img=55', assignedName: 'Lily Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=21', priority: 'Low', due: 'May 17, 04:00 PM', dateNum: 17, isOverdue: false, status: 'Completed', statusColor: '#10b981' },
  { id: 10, title: 'Resolve AI chat escalation', desc: 'Escalated chat support regarding live token balance', type: 'Support', typeColor: '#3b82f6', relatedName: 'Sophie Dubois', relatedType: 'Fan', relatedAvatar: 'https://i.pravatar.cc/150?img=9', assignedName: 'Omar Agent', assignedAvatar: 'https://i.pravatar.cc/150?img=8', priority: 'High', due: 'May 16, 12:00 PM', dateNum: 16, isOverdue: false, status: 'Completed', statusColor: '#10b981' }
];

const priorityData = [
  { name: 'High', value: 5, color: '#ef4444' },
  { name: 'Medium', value: 3, color: '#f59e0b' },
  { name: 'Low', value: 2, color: '#10b981' }
];

const productivityData = [
  { day: 'Mon', completed: 2, created: 3 },
  { day: 'Tue', completed: 4, created: 2 },
  { day: 'Wed', completed: 3, created: 4 },
  { day: 'Thu', completed: 6, created: 3 },
  { day: 'Fri', completed: 4, created: 5 },
  { day: 'Sat', completed: 1, created: 1 },
  { day: 'Sun', completed: 2, created: 2 }
];

export default function Tasks() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [allTasks, setTasks] = useState(initialTaskList);
  const tasks = filterDataByRole(allTasks, user, 'tasks');
  
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  
  const [showAdd, setShowAdd] = useState(false);
  const [viewTask, setViewTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [openMenuTaskId, setOpenMenuTaskId] = useState(null);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const overdueTasks = tasks.filter(t => t.isOverdue && t.status !== 'Completed').length;
  const myTasks = tasks.filter(t => t.assignedName === user?.name || t.assignedName === 'Priya Sharma').length;

  const tabs = [
    { label: 'All Tasks', count: totalTasks },
    { label: 'My Tasks', count: myTasks },
    { label: 'In Progress', count: inProgressTasks },
    { label: 'Pending', count: pendingTasks },
    { label: 'Completed', count: completedTasks },
    { label: 'Overdue', count: overdueTasks, color: 'text-red-400' }
  ];

  const toggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const isCompleted = t.status === 'Completed';
        const newStatus = isCompleted ? 'Pending' : 'Completed';
        addToast('success', isCompleted ? 'Task Reopened' : 'Task Completed', `"${t.title}" status changed to ${newStatus}.`);
        return { ...t, status: newStatus, statusColor: isCompleted ? '#f59e0b' : '#10b981', isOverdue: isCompleted ? t.isOverdue : false };
      }
      return t;
    }));
  };

  const handleAddTask = (data) => {
    const d = data.due ? parseInt(data.due.split('-')[2], 10) : 20;
    const newTask = {
      id: Date.now(),
      title: data.title || 'New CRM Task',
      desc: data.desc || 'Created manually via task manager',
      type: data.type || 'Follow Up',
      typeColor: '#3b82f6',
      relatedName: data.related || 'VIP Creator Studio',
      relatedType: 'Creator Lead',
      relatedAvatar: 'https://i.pravatar.cc/150?img=25',
      assignedName: data.assignee || user?.name || 'Priya Sharma',
      assignedAvatar: 'https://i.pravatar.cc/150?img=47',
      priority: data.priority || 'Medium',
      due: `May ${isNaN(d) ? 20 : d}, 03:00 PM`,
      dateNum: isNaN(d) ? 20 : d,
      isOverdue: false,
      status: 'Pending',
      statusColor: '#f59e0b'
    };
    setTasks(prev => [newTask, ...prev]);
    setShowAdd(false);
    addToast('success', 'Task Created', `"${newTask.title}" added to queue.`);
  };

  const handleDeleteTask = () => {
    if (deleteTarget) {
      setTasks(prev => prev.filter(t => t.id !== deleteTarget.id));
      addToast('success', 'Task Deleted', `"${deleteTarget.title}" was removed.`);
      if (viewTask?.id === deleteTarget.id) setViewTask(null);
      setDeleteTarget(null);
    }
  };

  const isLoading = useSimulatedLoading(500, [activeTab, search, statusFilter, priorityFilter, selectedDateFilter]);

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'My Tasks' || activeTab === 'Assigned to Me') {
      if (t.assignedName !== user?.name && t.assignedName !== 'Priya Sharma') return false;
    } else if (activeTab === 'In Progress') {
      if (t.status !== 'In Progress') return false;
    } else if (activeTab === 'Pending') {
      if (t.status !== 'Pending') return false;
    } else if (activeTab === 'Completed') {
      if (t.status !== 'Completed') return false;
    } else if (activeTab === 'Overdue') {
      if (!t.isOverdue || t.status === 'Completed') return false;
    }

    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'All Status' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All Priority' && t.priority !== priorityFilter) return false;
    if (selectedDateFilter !== null && t.dateNum !== selectedDateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <CheckSquare className="text-neon-blue" /> Tasks & Team Workflows
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Track creator KYC audits, VIP follow-ups, and financial settlements.</p>
        </motion.div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowAdd(true)} 
            className="bg-neon-blue text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:bg-cyan-400 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus size={16} /> New Workflow Task
          </button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-gray-900/50 p-3 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div className="flex overflow-x-auto custom-scrollbar gap-1.5 w-full lg:w-auto pb-2 lg:pb-0">
          {tabs.map(tab => (
            <button
              key={tab.label}
              onClick={() => { setActiveTab(tab.label); setSelectedDateFilter(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.label ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800/60'}`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === tab.label ? 'bg-black/10 text-black font-black' : 'bg-gray-800 text-gray-400'}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap filter-bar">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search tasks, creators..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-blue" 
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"><X size={12}/></button>}
          </div>

          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)}
            className="bg-gray-950 border border-gray-800 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-300 focus:outline-none focus:border-neon-blue"
          >
            <option value="All Priority">All Priorities</option>
            <option value="High">High Priority 🔥</option>
            <option value="Medium">Medium Priority ⚡</option>
            <option value="Low">Low Priority</option>
          </select>

          {(selectedDateFilter !== null || priorityFilter !== 'All Priority' || statusFilter !== 'All Status' || search) && (
            <button 
              onClick={() => { setSelectedDateFilter(null); setPriorityFilter('All Priority'); setStatusFilter('All Status'); setSearch(''); addToast('info', 'Filters Cleared', 'Reset to default task list.'); }}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/30 transition-all flex items-center gap-1"
            >
              <RefreshCw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Table & Right Sidebar */}
      <div className="flex flex-col xl:flex-row gap-6">
        
        {/* Task Table */}
        <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {selectedDateFilter !== null && (
            <div className="px-5 py-2.5 bg-neon-blue/10 border-b border-neon-blue/30 flex justify-between items-center text-xs">
              <span className="text-neon-blue font-extrabold flex items-center gap-2">
                <CalendarIcon size={14} /> Filtered by Task Calendar: May {selectedDateFilter}, 2025
              </span>
              <button onClick={() => setSelectedDateFilter(null)} className="text-white hover:underline font-bold text-[11px]">Show All Days</button>
            </div>
          )}

          <div className="hidden md:block flex-1 overflow-auto custom-scrollbar">
            {isLoading ? <TableSkeleton rows={8} cols={8} /> : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-950/80">
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Task Details</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 text-center uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Related To</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Assignee</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 text-center uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3.5 text-[10px] font-black text-gray-400 text-center uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredTasks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16">
                        <EmptyState 
                          icon={CheckSquare}
                          title="No matching tasks found"
                          description="Try resetting your filters or create a new task."
                        />
                      </td>
                    </tr>
                  ) : filteredTasks.map((task) => (
                    <tr key={task.id} className={`hover:bg-white/[0.03] transition-all group ${task.status === 'Completed' ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-3">
                          <input 
                            type="checkbox" 
                            onChange={() => toggleTaskStatus(task.id)} 
                            checked={task.status === 'Completed'} 
                            className="mt-1 accent-neon-blue bg-gray-800 border-gray-700 rounded w-4 h-4 cursor-pointer shrink-0" 
                          />
                          <div>
                            <div className={`text-xs font-bold text-white mb-0.5 ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</div>
                            <div className="text-[10px] text-gray-400 line-clamp-1">{task.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border inline-block tracking-wide uppercase" style={{ color: task.typeColor, borderColor: `${task.typeColor}40`, backgroundColor: `${task.typeColor}15` }}>{task.type}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={task.relatedAvatar} className="w-6 h-6 rounded-full border border-gray-700 object-cover shrink-0" alt="" />
                          <div>
                            <div className="text-xs font-bold text-white truncate max-w-[120px]">{task.relatedName}</div>
                            <div className="text-[9px] text-gray-500">{task.relatedType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <img src={task.assignedAvatar} className="w-5 h-5 rounded-full border border-gray-700 shrink-0" alt="" />
                          <div className="text-xs font-bold text-gray-300">{task.assignedName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${task.priority === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>{task.priority}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className={`text-xs font-bold ${task.isOverdue ? 'text-red-400 font-black' : task.due.includes('Today') ? 'text-yellow-400 font-extrabold' : 'text-gray-300'}`}>{task.due.split(',')[0]}</div>
                        <div className={`text-[10px] ${task.isOverdue ? 'text-red-500' : 'text-gray-500'}`}>{task.due.split(',')[1] || ''}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-black flex items-center gap-1.5" style={{ color: task.statusColor }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: task.statusColor }} />
                          {task.status}
                        </span>
                      </td>
                      
                      {/* ALWAYS VISIBLE ACTION BUTTONS */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5 relative">
                          <button 
                            onClick={() => setViewTask(task)} 
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-all shadow-sm" 
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          
                          <button 
                            onClick={() => toggleTaskStatus(task.id)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-neon-green hover:text-white transition-all shadow-sm font-bold text-[10px]"
                            title={task.status === 'Completed' ? 'Reopen' : 'Mark Complete'}
                          >
                            {task.status === 'Completed' ? '↻' : '✓'}
                          </button>

                          <button
                            onClick={() => setOpenMenuTaskId(openMenuTaskId === task.id ? null : task.id)}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-all shadow-sm"
                            title="More Options"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {openMenuTaskId === task.id && (
                            <div className="absolute top-full right-0 mt-1 w-36 bg-gray-900 border border-gray-700 rounded-xl p-1 z-30 shadow-2xl text-left animate-fadeIn" onClick={e => e.stopPropagation()}>
                              <button onClick={() => { setViewTask(task); setOpenMenuTaskId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-xs text-gray-200 hover:text-white flex items-center gap-2"><Eye size={12}/> View Task</button>
                              <button onClick={() => { toggleTaskStatus(task.id); setOpenMenuTaskId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-xs text-neon-green hover:text-green-300 flex items-center gap-2"><CheckCircle size={12}/> {task.status === 'Completed' ? 'Reopen Task' : 'Complete Task'}</button>
                              <button onClick={() => { setDeleteTarget(task); setOpenMenuTaskId(null); }} className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-xs text-red-400 hover:text-red-300 flex items-center gap-2"><Trash2 size={12}/> Delete Task</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Card View (<768px) */}
          <div className="md:hidden divide-y divide-gray-800/60 flex-1 overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <div className="py-12">
                <EmptyState icon={CheckSquare} title="No tasks found" description="Adjust filters or create a task" />
              </div>
            ) : filteredTasks.map((task) => (
              <div key={task.id} className={`p-4 space-y-3 hover:bg-white/[0.02] transition-all ${task.status === 'Completed' ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <input 
                      type="checkbox" 
                      onChange={() => toggleTaskStatus(task.id)} 
                      checked={task.status === 'Completed'} 
                      className="mt-1 accent-neon-blue bg-gray-800 border-gray-700 rounded w-4 h-4 shrink-0" 
                    />
                    <div className="min-w-0" onClick={() => setViewTask(task)}>
                      <div className={`text-sm font-bold text-white ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</div>
                      <div className="text-xs text-gray-400 line-clamp-2 mt-0.5">{task.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border shrink-0 uppercase" style={{ color: task.typeColor, borderColor: `${task.typeColor}40`, backgroundColor: `${task.typeColor}15` }}>{task.type}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-900/50 p-2.5 rounded-xl border border-gray-800/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={task.relatedAvatar} className="w-6 h-6 rounded-full border border-gray-700 object-cover shrink-0" alt="" />
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{task.relatedName}</div>
                      <div className="text-[10px] text-gray-500">{task.relatedType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block uppercase font-semibold">Due Date</span>
                    <span className="font-bold text-white">{task.dueDate}</span>
                    <div className="text-[10px] text-gray-400">{task.dueTime}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <img src={task.assigneeAvatar} className="w-5 h-5 rounded-full object-cover border border-gray-700" alt="" />
                    <span>{task.assignee}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => toggleTaskStatus(task.id)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-neon-green font-bold text-xs" title={task.status === 'Completed' ? 'Reopen' : 'Mark Complete'}>
                      {task.status === 'Completed' ? '↻' : '✓'}
                    </button>
                    <button onClick={() => setViewTask(task)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-blue-400" title="View">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(task)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-red-400" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Interactive Calendar & Analytics */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col gap-5">
          
          {/* Interactive Task Calendar */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon size={14} className="text-neon-blue" /> Task Calendar
              </span>
              <span className="text-xs font-bold text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded">May 2025</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-500 mb-2">
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {Array.from({length: 4}).map((_,i) => <div key={`empty-${i}`} className="text-gray-700 py-1">{27+i}</div>)}
              {Array.from({length: 31}, (_, i) => {
                const day = i + 1;
                const isToday = day === 20;
                const isSelected = selectedDateFilter === day;
                const dayTasks = tasks.filter(t => t.dateNum === day);
                const hasOverdue = dayTasks.some(t => t.isOverdue && t.status !== 'Completed');
                const hasTask = dayTasks.length > 0;
                
                return (
                  <div 
                    key={i} 
                    onClick={() => {
                      if (selectedDateFilter === day) {
                        setSelectedDateFilter(null);
                        addToast('info', 'Filter Cleared', 'Showing all dates.');
                      } else {
                        setSelectedDateFilter(day);
                        addToast('info', `Filtered to May ${day}`, `Showing ${dayTasks.length} tasks scheduled for this day.`);
                      }
                    }}
                    className={`relative p-1.5 rounded-lg cursor-pointer transition-all font-bold ${isSelected ? 'bg-neon-purple text-white font-black shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-110 z-10' : isToday ? 'bg-neon-blue text-black font-black shadow' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    {day}
                    {hasOverdue && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {!hasOverdue && hasTask && <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neon-green" />}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-800 text-[9px] text-gray-400 uppercase font-black">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/> Overdue</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-neon-blue"/> Today (20)</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-neon-green"/> Pending</span>
            </div>
          </div>

          {/* Priority Pie Chart Breakdown */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 flex items-center justify-between shadow-lg">
            <div className="w-24 h-24 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={priorityData} 
                    innerRadius={32} 
                    outerRadius={44} 
                    dataKey="value" 
                    stroke="none"
                    onClick={(data) => {
                      setPriorityFilter(data.name);
                      addToast('info', `Filtered by Priority`, `Showing ${data.name} priority tasks.`);
                    }}
                  >
                    {priorityData.map((e, idx) => <Cell key={idx} fill={e.color} className="cursor-pointer hover:opacity-80 transition-opacity" />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white">{totalTasks}</span>
                <span className="text-[8px] text-gray-500 uppercase font-extrabold">Total</span>
              </div>
            </div>
            <div className="flex-1 pl-4 space-y-2">
              <h3 className="text-xs font-black text-white mb-2 pb-1 border-b border-gray-800">Click to Filter Priority</h3>
              {priorityData.map((p, idx) => (
                <div 
                  key={idx} 
                  onClick={() => { setPriorityFilter(p.name); addToast('info', `Filtered to ${p.name} Priority`, ''); }}
                  className={`flex justify-between items-center text-xs p-1.5 rounded-lg cursor-pointer transition-colors ${priorityFilter === p.name ? 'bg-white/10 font-black text-white' : 'hover:bg-gray-800/60'}`}
                >
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} /> <span className="text-gray-300">{p.name}</span></div>
                  <span className="text-white font-bold">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Overdue / Critical Deadlines */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 flex-1 flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle size={14} className="text-red-400" /> Critical Deadlines
              </h3>
              <button onClick={() => { setActiveTab('Overdue'); addToast('info', 'Switched to Overdue Tab', ''); }} className="text-[10px] text-neon-blue font-bold hover:underline">View All Overdue</button>
            </div>
            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
              {tasks.filter(t => t.isOverdue || t.due.includes('Today')).slice(0, 4).map(t => (
                <div key={t.id} onClick={() => setViewTask(t)} className="p-3 bg-gray-950/80 rounded-2xl border border-gray-800 hover:border-gray-700 cursor-pointer transition-all hover:translate-x-1 group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono font-bold text-red-400">{t.due}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-extrabold uppercase">{t.priority}</span>
                  </div>
                  <div className="text-xs font-extrabold text-white group-hover:text-neon-blue transition-colors truncate">{t.title}</div>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                    <span>Assignee: {t.assignedName}</span>
                    <span className="text-gray-500">{t.relatedName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {viewTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewTask(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider" style={{ backgroundColor: `${viewTask.typeColor}20`, color: viewTask.typeColor, border: `1px solid ${viewTask.typeColor}40` }}>
                  {viewTask.type} Task
                </span>
                <button onClick={() => setViewTask(null)} className="p-1.5 text-gray-400 hover:text-white bg-gray-900 rounded-full"><X size={16} /></button>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{viewTask.title}</h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{viewTask.desc}</p>
              </div>

              <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Status</span>
                  <span className="font-extrabold mt-0.5 block" style={{ color: viewTask.statusColor }}>{viewTask.status}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Due Deadline</span>
                  <span className={`font-extrabold mt-0.5 block ${viewTask.isOverdue ? 'text-red-400' : 'text-white'}`}>{viewTask.due}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Assigned Agent</span>
                  <span className="font-extrabold text-gray-200 mt-0.5 block">{viewTask.assignedName}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Related CRM Lead</span>
                  <span className="font-extrabold text-neon-blue mt-0.5 block">{viewTask.relatedName} ({viewTask.relatedType})</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    toggleTaskStatus(viewTask.id);
                    setViewTask(null);
                  }}
                  className="flex-1 py-3 bg-neon-green text-black font-black text-xs rounded-xl hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} /> {viewTask.status === 'Completed' ? 'Reopen Task' : 'Mark Task as Completed'}
                </button>
                <button 
                  onClick={() => {
                    setDeleteTarget(viewTask);
                    setViewTask(null);
                  }}
                  className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl border border-red-500/30 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Task Modal */}
      <ActionModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onConfirm={handleAddTask}
        title="Create New CRM Workflow Task"
        confirmText="Add Task to Queue"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Task Title</label>
            <input name="title" required placeholder="e.g. Verify Creator Stripe Account Routing" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Description / Instructions</label>
            <textarea name="desc" rows={2} placeholder="Explain steps needed to resolve this task..." className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Task Type</label>
              <select name="type" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue">
                <option value="Follow Up">Follow Up</option>
                <option value="Call">Phone Call</option>
                <option value="KYC">KYC Document Review</option>
                <option value="Payment">Payment Settlement</option>
                <option value="Onboarding">Creator Onboarding</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Priority Level</label>
              <select name="priority" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue">
                <option value="High">High 🔥</option>
                <option value="Medium">Medium ⚡</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Related Lead / Creator</label>
              <input name="related" placeholder="e.g. Maria Gonzalez" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Due Date</label>
              <input name="due" type="date" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Assign To</label>
            <select name="assignee" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue">
              <option value="">-- Select Team Member --</option>
              <option value="Priya Sharma">Priya Sharma (Sales Agent)</option>
              <option value="Mike Agent">Mike Agent (Sales Agent)</option>
              <option value="Elena Vasquez">Elena Vasquez (Sales Agent)</option>
              <option value="Omar Agent">Omar Agent (Sales Agent)</option>
              <option value="Lily Agent">Lily Agent (Sales Agent)</option>
              <option value="Arjun Agent">Arjun Agent (Sales Agent)</option>
              <option value="Kiaan Sharma">Kiaan Sharma (Supervisor)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Manager)</option>
              <option value="Marcus Vance">Marcus Vance (CEO)</option>
              <option value="Emma Watson">Emma Watson (Front Desk)</option>
            </select>
          </div>
        </div>
      </ActionModal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        title="Delete CRM Task?"
        description={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmText="Delete Task"
        isDanger={true}
      />

    </div>
  );
}
