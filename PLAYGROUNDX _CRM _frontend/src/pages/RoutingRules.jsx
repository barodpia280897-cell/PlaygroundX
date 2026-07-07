import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitMerge, Plus, Search, Filter, Play, Copy, Power, Trash2, Edit2, CheckCircle2, Zap, LayoutDashboard, Shuffle } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/ui/Badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { deptData, actionData } from '../data/mock/rules';



export default function RoutingRules() {
  const [rules, { addItem, updateItem, deleteItem }] = useDataStore('routingRules');
  const [isEditing, setIsEditing] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const handleEdit = (rule) => {
    setCurrentRule(rule);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentRule({
      id: Date.now(),
      name: 'New Routing Rule',
      description: '',
      priority: rules.length + 1,
      status: 'Active',
      condition: '',
      action: 'Assign to Queue',
      queue: '',
      department: '',
      lastModified: new Date().toISOString(),
      createdBy: 'Admin User',
      executions: 0,
      successRate: '0%',
      lastTriggered: 'Never'
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const isNew = !rules.find(r => r.id === currentRule.id);
    if (!isNew) {
      updateItem(currentRule);
      addToast('success', 'Rule Updated', `"${currentRule.name}" has been saved.`);
    } else {
      addItem(currentRule);
      addToast('success', 'Rule Created', `"${currentRule.name}" is now active.`);
    }
    setIsEditing(false);
  };

  const toggleStatus = (rule) => {
    const newStatus = rule.status === 'Active' ? 'Inactive' : 'Active';
    updateItem({ ...rule, status: newStatus });
    addToast('info', `Rule ${newStatus}`, `"${rule.name}" has been ${newStatus === 'Active' ? 'enabled' : 'disabled'}.`);
  };

  const handleDelete = (rule) => {
    deleteItem(rule.id);
    addToast('success', 'Rule Deleted', `"${rule.name}" has been removed.`);
  };

  if (isEditing) {
    return (
      <div className="space-y-6 pb-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><GitMerge size={20} className="text-neon-blue"/> {currentRule.id > 10000 ? 'Create Rule' : 'Edit Rule'}</h2>
            <p className="text-sm text-gray-400">Configure visual routing conditions and actions.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save Rule</button>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Rule Name</label>
              <input value={currentRule.name} onChange={e => setCurrentRule({...currentRule, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Priority (Lower is processed first)</label>
              <input type="number" value={currentRule.priority} onChange={e => setCurrentRule({...currentRule, priority: Number(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Description</label>
            <input value={currentRule.description} onChange={e => setCurrentRule({...currentRule, description: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Shuffle size={16} className="text-neon-purple"/> Conditions (IF)</h3>
          <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg flex items-center gap-4">
            <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none">
              <option>Lead Type</option>
              <option>Language</option>
              <option>VIP Score</option>
              <option>Tags</option>
            </select>
            <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none">
              <option>Equals</option>
              <option>Contains</option>
              <option>Greater Than</option>
            </select>
            <input type="text" placeholder="Value..." value={currentRule.condition} onChange={e => setCurrentRule({...currentRule, condition: e.target.value})} className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none" />
            <button className="p-1.5 text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
          </div>
          <button className="mt-3 text-xs text-neon-blue font-bold flex items-center gap-1"><Plus size={12}/> Add AND Condition</button>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><CheckCircle2 size={16} className="text-neon-green"/> Actions (THEN)</h3>
          <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <select className="w-1/3 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none" value={currentRule.action} onChange={e => setCurrentRule({...currentRule, action: e.target.value})}>
                <option>Assign to Queue</option>
                <option>Assign to Agent</option>
                <option>Tag as VIP</option>
              </select>
            </div>
            {currentRule.action === 'Assign to Queue' && (
              <div className="flex items-center gap-4">
                 <select className="w-1/3 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none" value={currentRule.department} onChange={e => setCurrentRule({...currentRule, department: e.target.value})}>
                  <option value="">Select Department...</option>
                  <option>English Department</option>
                  <option>Spanish Department</option>
                  <option>VIP Team</option>
                  <option>Creator Success</option>
                </select>
                <select className="w-1/3 bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none" value={currentRule.queue} onChange={e => setCurrentRule({...currentRule, queue: e.target.value})}>
                  <option value="">Select Queue...</option>
                  <option>VIP Support</option>
                  <option>General Support</option>
                  <option>Creator Escalations</option>
                  <option>Finance Reviews</option>
                </select>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Routing Rules
            <Badge text={`${rules.filter(r => r.status === 'Active').length} Active`} color="green" />
          </h2>
          <p className="text-sm font-normal text-muted mt-1">Configure intelligent omnichannel routing for incoming leads.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            <Play size={14} /> Test Rule
          </button>
          <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-blue text-black text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            <Plus size={16} /> Create Rule
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard size={16} className="text-neon-blue" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Total Rules</h4>
          </div>
          <span className="text-2xl font-black text-white">{rules.length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Power size={16} className="text-neon-green" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Active Rules</h4>
          </div>
          <span className="text-2xl font-black text-white">{rules.filter(r => r.status === 'Active').length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-neon-purple" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Executions (24h)</h4>
          </div>
          <span className="text-2xl font-black text-white">42,850</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-yellow-400" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Avg Success Rate</h4>
          </div>
          <span className="text-2xl font-black text-white">99.8%</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Rule Distribution by Department</h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {deptData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Routing Actions</h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={actionData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {actionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="glass-panel flex flex-col">
        <div className="p-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search rules..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
          <div className="flex gap-2">
             <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                <option>All Departments</option>
                <option>English Department</option>
                <option>Spanish Department</option>
             </select>
             <button className="p-2 rounded bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"><Filter size={14} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 table-th bg-gray-900/30">
                <th className="px-4 py-3 w-16 text-center">Priority</th>
                <th className="px-4 py-3">Rule Name & Condition</th>
                <th className="px-4 py-3">Assigned Queue / Dept</th>
                <th className="px-4 py-3 text-center">Stats</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {rules.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a,b) => a.priority - b.priority).map((r) => (
                <tr key={r.id} className={`hover:bg-white/[0.02] ${r.status !== 'Active' ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 text-center">
                    <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-300 font-mono mx-auto">{r.priority}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-white mb-1">{r.name}</div>
                    <span className="text-[10px] font-mono text-neon-purple bg-neon-purple/10 border border-neon-purple/20 px-2 py-0.5 rounded inline-block">
                      IF {r.condition || 'No Condition'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-bold text-neon-blue">{r.queue || r.action}</div>
                    <div className="text-[10px] text-gray-500">{r.department}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-xs font-bold text-gray-300">{r.executions || Math.floor(Math.random() * 10000)} runs</div>
                    <div className="text-[10px] text-gray-500">Rate: {r.successRate || '99%'}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleStatus(r)}>
                      <Badge text={r.status} color={r.status === 'Active' ? 'green' : 'gray'} />
                    </button>
                    <div className="text-[9px] text-gray-500 mt-1">Trig: {r.lastTriggered || '2m ago'}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-gray-400 hover:text-white p-1" title="Duplicate"><Copy size={14} /></button>
                      <button onClick={() => handleEdit(r)} className="text-gray-400 hover:text-neon-blue p-1" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => deleteItem(r.id)} className="text-gray-400 hover:text-red-500 p-1" title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
