import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Crown, ShieldAlert, UploadCloud, Clock, Search, Filter, Download, MoreHorizontal, Eye, MessageSquare, Phone, ChevronRight, ChevronDown, CheckCircle, Target, TrendingUp, AlertTriangle, Video } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, XAxis, Tooltip as RechartsTooltip } from 'recharts';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { filterDataByRole } from '../utils/rbac';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/Skeleton';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import CallModal from '../components/modals/CallModal';
import { getAppPath } from '../utils/routing';

const pipelineData = [
  { name: 'Lead', value: 120, color: '#64748b' },
  { name: 'Onboarding', value: 85, color: '#f59e0b' },
  { name: 'Active', value: 276, color: '#10b981' },
  { name: 'VIP', value: 15, color: '#8a2be2' },
  { name: 'Churned', value: 18, color: '#ef4444' },
];

export default function Creators() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All Creators');
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);
  const [callLead, setCallLead] = useState(null);
  
  const [leads] = useDataStore('leads');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const filteredLeads = filterDataByRole(leads, user, 'creators');
  const creatorsList = filteredLeads.filter(l => l.type === 'Creator').map(c => ({
    ...c,
    scoreData: [{name:'Engagement', value:92}, {name:'Earnings', value:95}, {name:'Consistency', value:85}, {name:'Profile', value:90}, {name:'Growth', value:80}],
    earningsData: [{d:'W1', v:10},{d:'W2', v:15},{d:'W3', v:25},{d:'W4', v:45}],
    earnings: c.earnings || '$45,200',
    followers: c.followers || '1.2M',
    score: c.healthScore || 850,
    isVip: c.vipScore > 80,
    agentAvatar: 'https://i.pravatar.cc/150?img=47'
  }));

  const selectedCreator = creatorsList.find(c => c.id === selectedCreatorId) || creatorsList[0];

  const handleAction = (action, e) => {
    e.stopPropagation(); // prevent row selection
    addToast('info', 'Action Triggered', `${action} functionality will be available shortly.`);
  };

  return (
    <div className="space-y-4 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Creators <span className="text-sm font-normal text-muted sm:ml-2">PlayGroundX Command & Operations Center</span>
          </h2>
        </motion.div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { label: 'Total Creators', value: '514', icon: Users, color: '#3b82f6', trend: '↑ 12' },
          { label: 'Active Creators', value: '276', icon: UserCheck, color: '#10b981', sub: '53.6% of total' },
          { label: 'VIP Creators', value: '15', icon: Crown, color: '#8a2be2' },
          { label: 'Pending KYC', value: '84', icon: ShieldAlert, color: '#f59e0b' },
          { label: 'No Content', value: '112', icon: UploadCloud, color: '#ef4444' },
          { label: 'Inactive 7+ Days', value: '51', icon: Clock, color: '#64748b' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-3 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="text-[10px] text-gray-400 font-bold">{kpi.label}</div>
              <kpi.icon size={14} style={{ color: kpi.color }} />
            </div>
            <div>
              <div className="text-xl font-black text-white">{kpi.value}</div>
              {kpi.trend && <div className="text-[9px] font-bold text-neon-blue mt-0.5">{kpi.trend} vs last month</div>}
              {kpi.sub && <div className="text-[9px] text-gray-500 mt-0.5">{kpi.sub}</div>}
            </div>
          </motion.div>
        ))}
        {/* Activation Rate Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-3 flex items-center justify-between">
           <div>
            <div className="text-[10px] text-gray-400 font-bold mb-1">Activation Rate</div>
            <div className="text-xl font-black text-white">42%</div>
            <div className="text-[9px] font-bold text-neon-green mt-0.5">↑ 5.2% vs last 30d</div>
          </div>
          <div className="w-12 h-12 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{value:42, color:'#10b981'}, {value:58, color:'#1f2937'}]} innerRadius={15} outerRadius={22} dataKey="value" stroke="none">
                  {[{color:'#10b981'}, {color:'#1f2937'}].map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Main Split Layout: Left Table, Right Profile */}
      <div className="flex flex-col xl:flex-row gap-4 h-auto xl:h-[600px]">
        
        {/* Left Table Area */}
        <div className="flex-1 glass-panel flex flex-col min-h-[480px] xl:min-h-0 min-w-0">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar px-2">
            {['All Creators', 'Active', 'New', 'KYC Pending', 'KYC Approved', 'VIP', 'Inactive', 'At Risk'].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-[11px] font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${activeTab === t ? 'text-neon-blue border-neon-blue bg-white/5' : 'text-gray-500 border-transparent hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="p-3 border-b border-gray-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="relative shrink-0 mr-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Search creators..." className="bg-black/50 border border-gray-800 rounded-lg pl-8 pr-4 py-1.5 text-[11px] text-white focus:outline-none focus:border-neon-blue w-48" />
            </div>
            {['All Pipelines', 'All Languages', 'All Countries', 'All Agents', 'More Filters'].map((f, i) => (
              <button key={i} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900/50 border border-gray-800 text-[10px] text-gray-400 hover:text-white transition-colors">
                {f} <ChevronDown size={12} />
              </button>
            ))}
            <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-800 text-[10px] text-neon-blue hover:bg-neon-blue/10 ml-auto transition-colors">
              <Download size={12} /> Export
            </button>
          </div>

          {/* Table */}
          <div className="hidden md:block flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30 sticky top-0 z-10 backdrop-blur-sm">
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500"><input type="checkbox" className="accent-neon-blue bg-gray-800 rounded" /></th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500">Creator</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500">Status / Stage</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 text-center">Score</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500">Language</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500">Followers</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500">Earnings (30D)</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500">Assigned Agent</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-gray-500 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {creatorsList.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12">
                      <EmptyState
                        icon={Users}
                        title="No creators found"
                        description="Try adjusting your search or filters to find creators."
                      />
                    </td>
                  </tr>
                ) : creatorsList.map((creator) => (
                  <tr 
                    key={creator.id} 
                    onClick={() => setSelectedCreatorId(creator.id)}
                    className={`transition-colors cursor-pointer group ${selectedCreator?.id === creator.id ? 'bg-neon-blue/5 border-l-2 border-l-neon-blue' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'}`}
                  >
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="accent-neon-blue bg-gray-800 rounded" /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <div className="relative">
                          <img src={creator.avatar} className="w-8 h-8 rounded-full border border-gray-700 object-cover" alt="" />
                          {creator.isVip && <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-0.5"><Crown size={8} className="text-white" /></div>}
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white flex items-center gap-1">{creator.name} <span>{creator.flag}</span></div>
                          <div className="text-[9px] text-gray-500">{creator.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[10px] font-bold text-white">{creator.status}</div>
                      <div className="text-[8px] text-gray-500 mt-0.5">{creator.stage}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${creator.score > 80 ? 'text-green-400 border-green-500/30 bg-green-500/10' : creator.score > 50 ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                        {creator.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-gray-400">{creator.language}</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-white">{creator.followers}</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-neon-green">{creator.earnings}</td>
                    <td className="px-4 py-3">
                       <div className="flex items-center gap-1.5">
                        <img src={creator.agentAvatar} className="w-5 h-5 rounded-full border border-gray-700 object-cover" alt="" />
                        <div className="text-[9px] font-bold text-gray-300">{creator.agent}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setCallLead(creator); }} className="p-1 text-gray-400 hover:text-neon-green hover:bg-gray-800 rounded" title="Call Creator"><Phone size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); navigate(getAppPath(`/leads/${creator.id}`)); }} className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded" title="View 360 Profile"><Eye size={14} /></button>
                        {user?.role !== 'VIEWER' && (
                          <button onClick={(e) => handleAction('Chat', e)} className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded"><MessageSquare size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (<768px) */}
          <div className="md:hidden divide-y divide-gray-800/60 flex-1 overflow-y-auto">
            {creatorsList.length === 0 ? (
              <div className="py-12">
                <EmptyState icon={Users} title="No creators found" description="Adjust filters to find creators" />
              </div>
            ) : creatorsList.map((creator) => (
              <div 
                key={creator.id} 
                onClick={() => setSelectedCreatorId(creator.id)}
                className={`p-4 space-y-3 transition-colors cursor-pointer ${selectedCreator?.id === creator.id ? 'bg-neon-blue/10 border-l-2 border-l-neon-blue' : 'hover:bg-white/[0.02]'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={creator.avatar} className="w-10 h-10 rounded-full border border-gray-700 object-cover shrink-0" alt="" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                        {creator.name} <span>{creator.flag}</span>
                        {creator.isVip && <span className="bg-purple-500 rounded-full p-0.5"><Crown size={8} className="text-white" /></span>}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{creator.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-gray-800 px-2.5 py-1 rounded text-white border border-gray-700 shrink-0">
                    {creator.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-900/50 p-2.5 rounded-xl border border-gray-800/60">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-semibold">Followers</span>
                    <span className="font-bold text-white">{creator.followers}</span> <span className="text-gray-400">({creator.language})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-semibold">Earnings (30D)</span>
                    <span className="font-bold text-neon-green">{creator.earnings}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-gray-400">Agent: <strong className="text-white">{creator.agent || 'Unassigned'}</strong></span>
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setCallLead(creator)} className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-yellow-400 rounded-lg border border-gray-700/50" title="Call">
                      <Phone size={13} />
                    </button>
                    <button onClick={() => navigate(getAppPath(`/leads/${creator.id}`))} className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-blue-400 rounded-lg border border-gray-700/50" title="View Profile">
                      <Eye size={13} />
                    </button>
                    {user?.role !== 'VIEWER' && (
                      <button onClick={(e) => handleAction('Chat', e)} className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-neon-blue rounded-lg border border-gray-700/50" title="Chat">
                        <MessageSquare size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-800 flex justify-between items-center text-[10px] text-gray-500 bg-gray-900/50">
            <span>Showing 1 to {creatorsList.length} of {creatorsList.length} creators</span>
            <div className="flex items-center gap-1">
              <button className="w-6 h-6 rounded flex items-center justify-center bg-gray-900 border border-gray-700">&lt;</button>
              <button className="w-6 h-6 rounded flex items-center justify-center bg-neon-blue text-black font-bold">1</button>
              <button className="w-6 h-6 rounded flex items-center justify-center bg-gray-900 border border-gray-700">&gt;</button>
            </div>
            <span>10 per page <ChevronDown size={10} className="inline"/></span>
          </div>

        </div>

        {/* Right Sidebar: Creator Profile Panel */}
        <AnimatePresence mode="wait">
          {selectedCreator && (
            <motion.div 
              key={selectedCreator.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full xl:w-[320px] shrink-0 glass-panel flex flex-col min-h-[400px] xl:min-h-0 overflow-y-auto no-scrollbar"
            >
              {/* Profile Header */}
              <div className="p-5 border-b border-gray-800 bg-gray-900/30 text-center relative">
                {selectedCreator.isVip && (
                  <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-400 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Crown size={10} /> VIP
                  </div>
                )}
                <img src={selectedCreator.avatar} className="w-20 h-20 rounded-full border-2 border-gray-700 mx-auto mb-3 object-cover" alt="" />
                <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">{selectedCreator.name} <span className="text-sm">{selectedCreator.flag}</span></h3>
                <p className="text-[11px] text-gray-500 mb-3">{selectedCreator.email}</p>
                
                <div className="flex justify-center gap-2 mb-4">
                  <span className="text-[9px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded uppercase">{selectedCreator.status}</span>
                  <span className="text-[9px] font-bold bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded uppercase">{selectedCreator.stage}</span>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => navigate(getAppPath(`/leads/${selectedCreator.id}`))} className="flex-1 bg-neon-blue text-black text-[10px] font-bold py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors flex items-center justify-center gap-1.5"><Eye size={12} /> View Profile</button>
                  {user?.role !== 'VIEWER' && (
                    <button onClick={(e) => handleAction('Message', e)} className="flex-1 bg-gray-800 text-white border border-gray-700 text-[10px] font-bold py-2 rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-1.5"><MessageSquare size={12} /> Message</button>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-6 flex-1">
                
                {/* Creator Score Donut & Breakdown */}
                <div>
                  <h4 className="text-[11px] font-bold text-white mb-4">Creator Health Score</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 relative shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{value:selectedCreator.score, color:'#8a2be2'}, {value:100-selectedCreator.score, color:'#1f2937'}]} innerRadius={28} outerRadius={38} dataKey="value" stroke="none">
                            {[{color:selectedCreator.score>80?'#10b981':selectedCreator.score>50?'#f59e0b':'#ef4444'}, {color:'#1f2937'}].map((e, i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-black text-white">{selectedCreator.score}</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {selectedCreator.scoreData.slice(0,3).map((s,i) => (
                        <div key={i} className="flex justify-between items-center text-[9px]">
                          <span className="text-gray-400">{s.name}</span>
                          <span className="text-white font-bold">{s.value}/100</span>
                        </div>
                      ))}
                      <button className="text-[9px] text-neon-blue pt-1 w-full text-left">View full breakdown <ChevronRight size={10} className="inline"/></button>
                    </div>
                  </div>
                </div>

                {/* Earnings Line Chart */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[11px] font-bold text-white">Earnings (30 Days)</h4>
                    <span className="text-[11px] font-black text-neon-green">{selectedCreator.earnings}</span>
                  </div>
                  <div className="h-16 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedCreator.earningsData}>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', fontSize: '9px' }} />
                        <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase block mb-0.5">Primary Channel</span>
                    <span className="text-[10px] font-bold text-white flex items-center gap-1"><Video size={10}/> PlayGroundX</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase block mb-0.5">Language</span>
                    <span className="text-[10px] font-bold text-white">{selectedCreator.language}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase block mb-0.5">Followers</span>
                    <span className="text-[10px] font-bold text-white">{selectedCreator.followers}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-gray-500 uppercase block mb-0.5">Phone</span>
                    <span className="text-[10px] font-bold text-white">{selectedCreator.phone}</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Bottom Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        
        {/* Top Earners List */}
        <div className="glass-panel p-4">
          <h3 className="text-[11px] font-bold text-white mb-4 flex items-center gap-2"><Target size={14} className="text-neon-blue"/> Top Earners</h3>
          <div className="space-y-3">
            {[
              { name: 'Luna Starr', rev: '$45.2K', rank: 1 },
              { name: 'Chloe Kim', rev: '$35.8K', rank: 2 },
              { name: 'Mateo Rico', rev: '$28.4K', rank: 3 }
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-gray-300"><span className="text-gray-600 w-3">{e.rank}.</span> {e.name}</div>
                <div className="text-[10px] font-bold text-neon-green">{e.rev}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Donut */}
        <div className="glass-panel p-4 flex items-center justify-between">
          <div className="w-20 h-20 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pipelineData} innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                  {pipelineData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-black text-white">514</span>
            </div>
          </div>
          <div className="flex-1 pl-4 space-y-1.5">
            <h3 className="text-[10px] font-bold text-white mb-2">Creators by Pipeline</h3>
            {pipelineData.slice(1,4).map((p, i) => (
              <div key={i} className="flex justify-between items-center text-[9px]">
                <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} /> <span className="text-gray-400">{p.name}</span></div>
                <span className="text-white font-bold">{p.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Performance */}
        <div className="glass-panel p-4">
          <h3 className="text-[11px] font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-purple-400"/> Content Performance</h3>
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
               <div className="text-[9px] text-gray-500 mb-1">Total Content</div>
               <div className="text-sm font-black text-white">12,450</div>
               <div className="text-[8px] text-neon-green mt-0.5">↑ 8%</div>
             </div>
             <div className="bg-gray-900/50 p-2 rounded border border-gray-800">
               <div className="text-[9px] text-gray-500 mb-1">Total Views</div>
               <div className="text-sm font-black text-white">45.2M</div>
               <div className="text-[8px] text-neon-green mt-0.5">↑ 12%</div>
             </div>
          </div>
        </div>

        {/* At Risk List */}
        <div className="glass-panel p-4">
          <h3 className="text-[11px] font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-red-500"/> At Risk</h3>
          <div className="space-y-3">
            {[
              { name: 'Anna Petrova', issue: 'Inactive 14 days', color: 'text-red-400' },
              { name: 'Yuki Tanaka', issue: 'Stuck in onboarding', color: 'text-yellow-400' },
              { name: 'Bella Rose', issue: 'Incomplete KYC', color: 'text-orange-400' }
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="text-[10px] text-gray-300 truncate w-24">{e.name}</div>
                <div className={`text-[9px] font-bold truncate ${e.color}`}>{e.issue}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <CallModal open={!!callLead} lead={callLead} onClose={() => setCallLead(null)} />
    </div>
  );
}
