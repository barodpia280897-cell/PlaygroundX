import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, AlertTriangle, PhoneCall, Headphones, ArrowUpRight, ArrowDownRight, PhoneOff, UserCheck, ShieldAlert, Shuffle, Plus, Search, Filter, CheckCircle, RefreshCw, X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const initialQueues = [
  { id: 1, name: 'VIP Creators', waiting: 3, longestWait: '4m 12s', agents: 4, sla: '95%', status: 'Warning', statusColor: 'yellow-500' },
  { id: 2, name: 'General Fans', waiting: 18, longestWait: '12m 40s', agents: 12, sla: '78%', status: 'Critical', statusColor: 'neon-pink' },
  { id: 3, name: 'Billing Support', waiting: 5, longestWait: '2m 10s', agents: 6, sla: '98%', status: 'Healthy', statusColor: 'neon-green' },
  { id: 4, name: 'KYC Verification', waiting: 12, longestWait: '8m 05s', agents: 8, sla: '85%', status: 'Warning', statusColor: 'yellow-500' }
];

const initialAgents = [
  { id: 101, name: 'Sarah Jenkins', status: 'On Call', timeInState: '05:22', queue: 'VIP Creators', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 102, name: 'David Chen', status: 'Available', timeInState: '12:05', queue: 'Billing Support', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 103, name: 'Elena Vasquez', status: 'Wrap-up', timeInState: '01:15', queue: 'General Fans', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 104, name: 'Michael Ross', status: 'On Break', timeInState: '14:30', queue: '-', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 105, name: 'Priya Sharma', status: 'On Call', timeInState: '18:45', queue: 'General Fans', avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 106, name: 'James Wilson', status: 'Available', timeInState: '02:10', queue: 'KYC Verification', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 107, name: 'Omar Agent', status: 'Available', timeInState: '08:14', queue: 'Billing Support', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 108, name: 'Lily Agent', status: 'On Call', timeInState: '11:02', queue: 'VIP Creators', avatar: 'https://i.pravatar.cc/150?img=21' }
];

const KPICard = ({ title, value, subValue, trend, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
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

export default function QueueMonitor() {
  const { addToast } = useToast();
  const [queues, setQueues] = useState(initialQueues);
  const [agents, setAgents] = useState(initialAgents);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [reassigningAgent, setReassigningAgent] = useState(null);
  const [targetQueue, setTargetQueue] = useState('VIP Creators');

  // Derive summary metrics
  const totalWaiting = queues.reduce((sum, q) => sum + q.waiting, 0);
  const totalAgents = agents.length;
  const availAgentsCount = agents.filter(a => a.status === 'Available').length;
  const onCallCount = agents.filter(a => a.status === 'On Call').length;
  const wrapCount = agents.filter(a => a.status === 'Wrap-up').length;
  const breakCount = agents.filter(a => a.status === 'On Break').length;

  const handleEmergencySupport = (queueId) => {
    setQueues(prev => prev.map(q => {
      if (q.id === queueId) {
        const newAgents = q.agents + 3;
        const newWaiting = Math.max(0, q.waiting - 6);
        addToast('success', '⚡ Emergency SLA Support Assigned', `Added +3 backup agents to ${q.name}. SLA boosted to Normal!`);
        return {
          ...q,
          agents: newAgents,
          waiting: newWaiting,
          status: newWaiting > 10 ? 'Warning' : 'Healthy',
          sla: '94%',
          longestWait: '03m 15s'
        };
      }
      return q;
    }));
  };

  const handleShiftAgentQueue = () => {
    if (!reassigningAgent) return;
    setAgents(prev => prev.map(a => {
      if (a.id === reassigningAgent.id) {
        return { ...a, queue: targetQueue, status: a.status === 'On Break' ? 'Available' : a.status };
      }
      return a;
    }));
    
    // Also update queue agent count representation
    setQueues(prev => prev.map(q => {
      if (q.name === targetQueue) return { ...q, agents: q.agents + 1 };
      if (q.name === reassigningAgent.queue) return { ...q, agents: Math.max(1, q.agents - 1) };
      return q;
    }));

    addToast('info', 'Agent Reassigned', `${reassigningAgent.name} shifted to ${targetQueue} queue.`);
    setReassigningAgent(null);
  };

  const filteredAgents = agents.filter(a => {
    if (statusFilter !== 'All Status' && a.status !== statusFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.queue.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <AlertTriangle size={20} className="text-neon-blue" />
            </div>
            Live Queue Monitor
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Real-time call center queue telemetry, longest wait timers, and agent floor reassignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-black text-neon-green uppercase tracking-wider">Live System Sync</span>
          </div>
          <button 
            onClick={() => {
              setQueues(initialQueues);
              setAgents(initialAgents);
              addToast('info', 'Simulation Reset', 'Restored initial call center load.');
            }}
            className="p-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all"
            title="Reset Simulation"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Waiting Calls" value={totalWaiting} trend={12} icon={PhoneCall} color="neon-pink" delay={0.1} />
        <KPICard title="Longest Wait Time" value="12m 40s" trend={-5} icon={Clock} color="yellow-500" delay={0.2} />
        <KPICard title="Global SLA Target" value="88%" trend={-2} icon={ShieldAlert} color="neon-blue" delay={0.3} />
        <KPICard title="Active Staff Agents" value={availAgentsCount + onCallCount} subValue={`/ ${totalAgents}`} trend={0} icon={Headphones} color="neon-green" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Queues Table (2 cols) */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/80">
            <h2 className="font-bold text-white flex items-center gap-2"><Users size={16} className="text-neon-blue" /> Live Department Queues</h2>
            <span className="text-xs text-gray-400">Click actions to rebalance floor SLA</span>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-4">
            <div className="table-wrapper min-w-0">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 bg-gray-950/40">
                  <th className="pb-3 pt-2 pl-3">Queue Name</th>
                  <th className="pb-3 pt-2 text-center">Waiting</th>
                  <th className="pb-3 pt-2 text-center">Longest Wait</th>
                  <th className="pb-3 pt-2 text-center">Agents Assigned</th>
                  <th className="pb-3 pt-2 text-center">SLA %</th>
                  <th className="pb-3 pt-2 text-center">Status</th>
                  <th className="pb-3 pt-2 text-right pr-3">Supervisor Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {queues.map((q) => (
                  <tr key={q.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="py-4 pl-3 font-extrabold text-white text-sm">{q.name}</td>
                    <td className="py-4 text-center">
                      <span className={`text-sm font-black px-2.5 py-1 rounded-lg ${q.waiting > 10 ? 'bg-red-500/20 text-red-400 font-black animate-pulse border border-red-500/40' : 'text-neon-blue'}`}>{q.waiting}</span>
                    </td>
                    <td className="py-4 text-center text-gray-300 font-mono text-xs">{q.longestWait}</td>
                    <td className="py-4 text-center text-neon-blue font-black text-sm">{q.agents}</td>
                    <td className="py-4 text-center text-gray-200 font-bold">{q.sla}</td>
                    <td className="py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                        ${q.status === 'Healthy' ? 'bg-green-500/15 text-green-400 border border-green-500/30' : 
                          q.status === 'Warning' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' : 
                          'bg-red-500/15 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}
                      `}>
                        {q.status}
                      </span>
                    </td>
                    
                    {/* INTERACTIVE ACTION BUTTON */}
                    <td className="py-4 text-right pr-3">
                      {q.status !== 'Healthy' ? (
                        <button 
                          onClick={() => handleEmergencySupport(q.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-neon-pink to-red-600 hover:from-pink-500 hover:to-red-500 text-white font-black text-[10px] rounded-xl shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all flex items-center gap-1.5 ml-auto uppercase tracking-wide"
                        >
                          <Plus size={12} /> Assign Emergency Support (+3)
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 font-bold px-2 py-1 bg-gray-800/40 rounded-lg inline-block">
                          ✓ Optimal SLA
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        {/* Agent States & Reassignment Panel (1 col) */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-950/80">
            <h2 className="font-bold text-white flex items-center gap-2"><Headphones size={16} className="text-neon-purple" /> Agent Staff Roster</h2>
            <span className="text-xs text-neon-purple font-black">{agents.length} Online</span>
          </div>
          
          {/* Status Breakdown Bar */}
          <div className="p-3 border-b border-gray-800/80 bg-gray-950/40 grid grid-cols-4 gap-2 text-center">
            <button onClick={() => setStatusFilter('Available')} className={`rounded-xl p-2 border transition-all ${statusFilter === 'Available' ? 'bg-neon-green/20 border-neon-green shadow' : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'}`}>
              <div className="text-neon-green font-black text-base">{availAgentsCount}</div>
              <div className="text-[9px] text-gray-400 uppercase font-bold">Avail</div>
            </button>
            <button onClick={() => setStatusFilter('On Call')} className={`rounded-xl p-2 border transition-all ${statusFilter === 'On Call' ? 'bg-neon-blue/20 border-neon-blue shadow' : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'}`}>
              <div className="text-neon-blue font-black text-base">{onCallCount}</div>
              <div className="text-[9px] text-gray-400 uppercase font-bold">On Call</div>
            </button>
            <button onClick={() => setStatusFilter('Wrap-up')} className={`rounded-xl p-2 border transition-all ${statusFilter === 'Wrap-up' ? 'bg-yellow-500/20 border-yellow-500 shadow' : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'}`}>
              <div className="text-yellow-500 font-black text-base">{wrapCount}</div>
              <div className="text-[9px] text-gray-400 uppercase font-bold">Wrap</div>
            </button>
            <button onClick={() => setStatusFilter('On Break')} className={`rounded-xl p-2 border transition-all ${statusFilter === 'On Break' ? 'bg-gray-700 border-gray-500 shadow' : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800'}`}>
              <div className="text-gray-400 font-black text-base">{breakCount}</div>
              <div className="text-[9px] text-gray-400 uppercase font-bold">Break</div>
            </button>
          </div>

          {/* Search bar inside agent panel */}
          <div className="p-3 border-b border-gray-800 bg-gray-950/60 flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search agent or queue..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-blue" 
              />
            </div>
            {statusFilter !== 'All Status' && (
              <button onClick={() => setStatusFilter('All Status')} className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-1.5 rounded-xl border border-red-500/30">Clear</button>
            )}
          </div>

          {/* Live Agent Roster List with Shift Queue Button */}
          <div className="flex-1 overflow-auto custom-scrollbar p-3 space-y-2">
            {filteredAgents.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-950/60 border border-gray-800/80 hover:border-gray-700 transition-all group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img src={a.avatar} alt={a.name} className="w-10 h-10 rounded-full border border-gray-700 object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-gray-900 
                      ${a.status === 'Available' ? 'bg-neon-green' : 
                        a.status === 'On Call' ? 'bg-neon-blue' : 
                        a.status === 'Wrap-up' ? 'bg-yellow-500' : 'bg-gray-500'}`} 
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-white truncate">{a.name}</div>
                    <div className="text-[10px] text-neon-blue font-bold truncate">{a.queue} • <span className="text-gray-400 font-mono">{a.timeInState}</span></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded
                    ${a.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      a.status === 'On Call' ? 'bg-blue-500/10 text-neon-blue border border-blue-500/20' : 
                      a.status === 'Wrap-up' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-gray-800 text-gray-400'}`}
                  >
                    {a.status}
                  </span>

                  {/* INTERACTIVE SHIFT BUTTON */}
                  <button
                    onClick={() => {
                      setReassigningAgent(a);
                      setTargetQueue(a.queue === '-' ? 'VIP Creators' : a.queue);
                    }}
                    className="p-1.5 bg-gray-800 hover:bg-neon-blue hover:text-black text-gray-300 rounded-xl transition-all shadow-sm"
                    title="Shift Agent Queue"
                  >
                    <Shuffle size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filteredAgents.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-xs italic">No agents match criteria.</div>
            )}
          </div>
        </div>

      </div>

      {/* Shift Agent Queue Modal */}
      <AnimatePresence>
        {reassigningAgent && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReassigningAgent(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Shuffle size={16} className="text-neon-blue"/> Shift Agent Floor Queue</h3>
                <button onClick={() => setReassigningAgent(null)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-400">Rebalance call center load by moving <strong className="text-white font-bold">{reassigningAgent.name}</strong> to a different operational department.</p>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Target Department Queue</label>
                <select value={targetQueue} onChange={e => setTargetQueue(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
                  <option value="VIP Creators">VIP Creators (High Priority)</option>
                  <option value="General Fans">General Fans Support</option>
                  <option value="Billing Support">Billing & Payment Gateway</option>
                  <option value="KYC Verification">KYC & Legal Document Review</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleShiftAgentQueue} className="flex-1 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]">Confirm Queue Shift</button>
                <button onClick={() => setReassigningAgent(null)} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
