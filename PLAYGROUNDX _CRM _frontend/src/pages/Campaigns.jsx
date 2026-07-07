import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Users, MousePointerClick, TrendingUp, Plus, Play, Pause, MoreVertical, Search, Filter, Eye, Edit2, Trash2, Gift, Video, Smartphone, Crown, RefreshCw, ShoppingBag, ClipboardList, CheckCircle, X, Send, BarChart2, Calendar as CalendarIcon, ShieldAlert } from 'lucide-react';
import ActionModal from '../components/ui/ActionModal';
import { useToast } from '../contexts/ToastContext';
import { useDataStore } from '../contexts/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { INITIAL_DATABASE } from '../mock/database';
import EmptyState from '../components/ui/EmptyState';

const campaignPerformanceData = [
  { day: 'Apr 21', reach: 20, engagement: 10, conversion: 5 },
  { day: 'Apr 28', reach: 40, engagement: 20, conversion: 10 },
  { day: 'May 5', reach: 35, engagement: 25, conversion: 15 },
  { day: 'May 12', reach: 60, engagement: 40, conversion: 20 },
  { day: 'May 20', reach: 80, engagement: 60, conversion: 35 },
];

const channelData = [
  { name: 'Email', value: 138250, pct: '39.2%', color: '#3b82f6' },
  { name: 'WhatsApp', value: 96850, pct: '27.5%', color: '#25D366' },
  { name: 'SMS', value: 58420, pct: '16.6%', color: '#f59e0b' },
  { name: 'Push', value: 34630, pct: '9.8%', color: '#ef4444' },
  { name: 'Others', value: 24300, pct: '6.9%', color: '#8a2be2' },
];

const iconMap = {
  Gift: Gift, Video: Video, Smartphone: Smartphone, Crown: Crown, RefreshCw: RefreshCw, ShoppingBag: ShoppingBag, ClipboardList: ClipboardList
};

export default function Campaigns() {
  const [campaigns, { setCollection, addItem }] = useDataStore('campaigns');
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const { addToast } = useToast();

  // New state for interactivity
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  useEffect(() => {
    // Migrate stale data that lacks the new 'channel' property
    if (campaigns && campaigns.length > 0 && !campaigns[0].channel) {
      setCollection(INITIAL_DATABASE.campaigns);
    }
  }, [campaigns, setCollection]);

  // Fallback while migrating
  const rawCampaigns = campaigns && campaigns.length > 0 && campaigns[0].channel ? campaigns : [];

  // Filter campaigns
  const displayCampaigns = rawCampaigns.filter(c => {
    if (activeTab !== 'Overview' && activeTab !== 'All Campaigns') {
      if (activeTab === 'Email' && !c.channel.includes('Email')) return false;
      if (activeTab === 'SMS' && !c.channel.includes('SMS')) return false;
      if (activeTab === 'WhatsApp' && !c.channel.includes('WhatsApp')) return false;
      if (activeTab === 'Push Notifications' && !c.channel.includes('Push')) return false;
    }
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.desc.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (typeFilter !== 'All Types' && c.type !== typeFilter) return false;
    if (statusFilter !== 'All Status' && c.status !== statusFilter) return false;
    if (channelFilter !== 'All Channels' && !c.channel.includes(channelFilter)) return false;
    return true;
  });

  const handleCreate = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCamp = {
          id: Date.now(),
          name: data.name,
          desc: data.message || 'Newly created broadcast campaign',
          status: 'Active',
          audience: data.target || 'All Users',
          audienceCount: 1240,
          type: 'Promotional',
          channel: data.channel || 'Email',
          reach: 1240, engagement: 42, conversion: 15,
          reachPct: '100%', engPct: '42%', convPct: '15%',
          date: data.schedule || 'Just now', color: '#00f0ff', icon: 'Megaphone'
        };
        addItem(newCamp);
        addToast('success', 'Broadcast Launched 🚀', `Campaign "${newCamp.name}" scheduled & dispatched!`);
        resolve();
      }, 500);
    });
  };

  const handleEditSubmit = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCollection(prev => prev.map(c => c.id === selectedEdit.id ? { ...c, name: data.name, status: data.status, channel: data.channel } : c));
        addToast('success', 'Campaign Updated', `Modified settings for "${data.name}".`);
        setSelectedEdit(null);
        resolve();
      }, 400);
    });
  };

  const handleDelete = (id, name) => {
    setCollection(prev => prev.filter(c => c.id !== id));
    addToast('info', 'Campaign Deleted', `Removed broadcast "${name}".`);
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Campaigns <span className="text-sm font-normal text-muted sm:ml-2">Create, manage and analyze your marketing campaigns</span>
          </h2>
        </motion.div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button onClick={() => setShowFiltersModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors shadow-sm">
            <Filter size={14} /> Filters {(typeFilter !== 'All Types' || statusFilter !== 'All Status' || channelFilter !== 'All Channels') && <span className="w-2 h-2 rounded-full bg-neon-blue" />} <ChevronDownIcon />
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-blue text-black text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            <Plus size={16} /> + New Bulk Broadcast / Campaign
          </button>
        </div>
      </div>

      {/* Bulk Broadcast Notice Banner */}
      <div className="bg-gradient-to-r from-neon-blue/10 via-purple-500/10 to-transparent border border-neon-blue/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue font-black shrink-0 shadow-inner">
            <Megaphone size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Need to send a message to multiple people at once?</h4>
            <p className="text-xs text-gray-400">Use Bulk Broadcasts! Select an audience filter (e.g. All VIP Leads), choose your channel (WhatsApp, Email, SMS), and use <code className="text-neon-blue bg-gray-900 px-1 py-0.5 rounded font-mono">{"{{name}}"}</code> for automatic personalization.</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-xl text-xs font-bold hover:border-neon-blue transition-colors shrink-0 shadow-sm">
          Launch Blast Now →
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto custom-scrollbar w-full">
        {['Overview', 'All Campaigns', 'Email', 'SMS', 'WhatsApp', 'Push Notifications', 'Automations', 'Templates'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t ? 'text-neon-blue border-neon-blue bg-white/[0.02]' : 'text-gray-500 border-transparent hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' || activeTab === 'All Campaigns' || activeTab === 'Email' || activeTab === 'SMS' || activeTab === 'WhatsApp' || activeTab === 'Push Notifications' ? (
        <div className="space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { label: 'Total Campaigns', value: rawCampaigns.length.toString(), change: '↑ 14.3% vs last 30 days', color: 'text-neon-blue', icon: Megaphone, changeColor: 'text-neon-green' },
              { label: 'Active Campaigns', value: rawCampaigns.filter(c => c.status === 'Active').length.toString(), change: '↑ 9.1% of total', color: 'text-neon-green', icon: Users, changeColor: 'text-neon-green' },
              { label: 'Completed Campaigns', value: rawCampaigns.filter(c => c.status === 'Completed').length.toString(), change: '↑ 18.8% vs last 30 days', color: 'text-neon-purple', icon: CheckCircle, changeColor: 'text-neon-green' },
              { label: 'Total Reach', value: '352,450', change: '↑ 22.6% vs last 30 days', color: 'text-yellow-400', icon: Users, changeColor: 'text-neon-green' },
              { label: 'Engagement Rate', value: '24.7%', change: '↑ 6.3% vs last 30 days', color: 'text-red-500', icon: TrendingUp, changeColor: 'text-neon-green' },
            ].map((k, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 flex flex-col justify-between min-h-[100px] hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] text-gray-400 font-bold">{k.label}</span>
                  <k.icon size={16} className={k.color} />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{k.value}</div>
                  <div className={`text-[9px] mt-1 font-semibold ${k.changeColor}`}>{k.change}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Main Table Area */}
            <div className="xl:col-span-9 glass-panel flex flex-col shadow-xl">
              {/* Table Filters */}
              <div className="p-4 border-b border-gray-800 flex items-center gap-3 flex-wrap bg-gray-950/60 filter-bar">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search campaigns by name or description..." className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-200 focus:outline-none focus:border-neon-blue font-medium" />
                </div>
                
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 font-bold focus:outline-none focus:border-neon-blue cursor-pointer">
                  <option value="All Types">All Types</option>
                  <option value="Promotional">Promotional</option>
                  <option value="Educational">Educational</option>
                  <option value="Retention">Retention</option>
                </select>

                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 font-bold focus:outline-none focus:border-neon-blue cursor-pointer">
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>

                <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 font-bold focus:outline-none focus:border-neon-blue cursor-pointer">
                  <option value="All Channels">All Channels</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="Push">Push</option>
                </select>

                {(typeFilter !== 'All Types' || statusFilter !== 'All Status' || channelFilter !== 'All Channels' || searchQuery) && (
                  <button onClick={() => { setTypeFilter('All Types'); setStatusFilter('All Status'); setChannelFilter('All Channels'); setSearchQuery(''); }} className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20">Reset</button>
                )}
              </div>

              {/* Table */}
              <div className="hidden md:block flex-1 overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-900/40">
                      <th className="table-th w-8"><input type="checkbox" className="rounded border-gray-700 bg-gray-900" /></th>
                      <th className="table-th">Campaign</th>
                      <th className="table-th">Type</th>
                      <th className="table-th">Channel</th>
                      <th className="table-th">Audience</th>
                      <th className="table-th">Status</th>
                      <th className="table-th">Reach</th>
                      <th className="table-th">Engagement</th>
                      <th className="table-th">Conversion</th>
                      <th className="table-th">Start Date</th>
                      <th className="table-th text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {displayCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12">
                          <EmptyState
                            icon={Megaphone}
                            title="No campaigns match filters"
                            description="Try adjusting your search criteria or reset filters above."
                          />
                        </td>
                      </tr>
                    ) : displayCampaigns.map((c, i) => {
                      const Icon = iconMap[c.icon] || Megaphone;
                      return (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-700 bg-gray-900" /></td>
                        <td className="px-4 py-3" onClick={() => setSelectedPreview(c)}>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto cursor-pointer">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm" style={{ backgroundColor: c.color+'15', borderColor: c.color+'30', color: c.color }}>
                              <Icon size={18} />
                            </div>
                            <div>
                              <div className="text-xs font-black text-white group-hover:text-neon-blue transition-colors">{c.name}</div>
                              <div className="text-[10px] text-gray-400 w-48 truncate" title={c.desc}>{c.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${c.type==='Promotional'?'bg-purple-500/10 text-purple-400 border-purple-500/20':c.type==='Educational'?'bg-blue-500/10 text-neon-blue border-blue-500/20':'bg-green-500/10 text-neon-green border-green-500/20'}`}>{c.type}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {c.channel.includes('Email') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-blue-400" title="Email">✉</span>}
                            {c.channel.includes('WhatsApp') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-green-500 font-bold" title="WhatsApp">💬</span>}
                            {c.channel.includes('SMS') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-purple-400 font-bold" title="SMS">📱</span>}
                            {c.channel.includes('Push') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-red-400 font-bold" title="Push">🔔</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs font-black text-white">{c.audienceCount?.toLocaleString() || '1,240'}</div>
                          <div className="text-[10px] text-gray-400 font-medium">{c.audience}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${c.status==='Active'?'text-neon-green':c.status==='Scheduled'?'text-yellow-400':c.status==='Completed'?'text-neon-blue':'text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${c.status==='Active'?'bg-neon-green animate-pulse':c.status==='Scheduled'?'bg-yellow-400':c.status==='Completed'?'bg-neon-blue':'bg-gray-500'}`} />
                            {c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.reach > 0 ? (
                            <>
                              <div className="text-xs text-white font-black">{c.reach.toLocaleString()}</div>
                              <div className="text-[9px] text-neon-green font-bold">↑ {c.reachPct}</div>
                            </>
                          ) : <div className="text-xs text-gray-500 font-bold">—</div>}
                        </td>
                        <td className="px-4 py-3">
                          {c.engagement > 0 ? (
                            <>
                              <div className="text-xs text-white font-black">{c.engagement}%</div>
                              <div className="text-[9px] text-neon-green font-bold">↑ {c.engPct}</div>
                            </>
                          ) : <div className="text-xs text-gray-500 font-bold">—</div>}
                        </td>
                        <td className="px-4 py-3">
                          {c.conversion > 0 ? (
                            <>
                              <div className="text-xs text-white font-black">{c.conversion}%</div>
                              <div className="text-[9px] text-neon-green font-bold">↑ {c.convPct}</div>
                            </>
                          ) : <div className="text-xs text-gray-500 font-bold">—</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 font-mono">{c.date}</td>
                        
                        {/* INTERACTIVE ROW ACTION BUTTONS */}
                        <td className="px-4 py-3 text-right pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedPreview(c); }}
                              className="p-2 rounded-xl border border-gray-700 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all shadow-sm"
                              title="View Campaign Details & Analytics"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedEdit(c); }}
                              className="p-2 rounded-xl border border-gray-700 bg-gray-800 text-neon-blue hover:text-white hover:bg-neon-blue/20 transition-all shadow-sm"
                              title="Edit Campaign Settings"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.name); }}
                              className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:text-white hover:bg-red-600 transition-all shadow-sm"
                              title="Delete Campaign"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (<768px) */}
              <div className="md:hidden divide-y divide-gray-800/60 flex-1 overflow-y-auto">
                {displayCampaigns.length === 0 ? (
                  <div className="py-12">
                    <EmptyState icon={Megaphone} title="No campaigns found" description="Adjust filters to find campaigns" />
                  </div>
                ) : displayCampaigns.map((c, i) => {
                  const Icon = iconMap[c.icon] || Megaphone;
                  return (
                    <div key={i} onClick={() => setSelectedPreview(c)} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm shrink-0" style={{ backgroundColor: c.color+'15', borderColor: c.color+'30', color: c.color }}>
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-black text-white truncate">{c.name}</div>
                            <div className="text-xs text-gray-400 truncate">{c.desc}</div>
                          </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border shrink-0 ${c.type==='Promotional'?'bg-purple-500/10 text-purple-400 border-purple-500/20':c.type==='Educational'?'bg-blue-500/10 text-neon-blue border-blue-500/20':'bg-green-500/10 text-neon-green border-green-500/20'}`}>{c.type}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-gray-900/50 p-2.5 rounded-xl border border-gray-800/60">
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-semibold">Audience</span>
                          <span className="font-bold text-white">{c.audienceCount?.toLocaleString() || '1,240'}</span> <span className="text-gray-400">({c.audience})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-semibold">Status</span>
                          <span className={`font-bold ${c.status==='Active'?'text-neon-green':c.status==='Scheduled'?'text-yellow-400':c.status==='Completed'?'text-neon-blue':'text-gray-400'}`}>{c.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1.5">
                          {c.channel.includes('Email') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-blue-400" title="Email">✉</span>}
                          {c.channel.includes('WhatsApp') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-green-500 font-bold" title="WhatsApp">💬</span>}
                          {c.channel.includes('SMS') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-purple-400 font-bold" title="SMS">📱</span>}
                          {c.channel.includes('Push') && <span className="w-6 h-6 rounded-lg flex items-center justify-center bg-gray-800 border border-gray-700 text-red-400 font-bold" title="Push">🔔</span>}
                        </div>
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button onClick={() => setSelectedPreview(c)} className="p-1.5 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 hover:text-white" title="View">
                            <Eye size={13} />
                          </button>
                          <button onClick={() => setSelectedEdit(c)} className="p-1.5 rounded-lg border border-gray-700 bg-gray-800 text-neon-blue hover:text-white" title="Edit">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:text-white" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400 font-bold bg-gray-950/40">
                <span>Showing 1 to {displayCampaigns.length} of {rawCampaigns.length} campaigns</span>
                <div className="flex items-center gap-1.5">
                  <button className="px-2.5 py-1 rounded border border-gray-800 hover:bg-white/5 text-gray-400">&lt;</button>
                  <button className="px-3 py-1 rounded bg-neon-blue text-black font-black">1</button>
                  <button className="px-2.5 py-1 rounded border border-gray-800 hover:bg-white/5 text-gray-400">&gt;</button>
                  <span className="ml-3 text-gray-500">10 / page <ChevronDownIcon className="inline" /></span>
                </div>
              </div>
            </div>

            {/* Right Analytics Panel */}
            <div className="xl:col-span-3 space-y-4">
              {/* Campaign Performance */}
              <div className="glass-panel p-4 flex flex-col shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5"><BarChart2 size={14} className="text-neon-blue"/> Performance Summary</h3>
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">30 Days</span>
                </div>
                <div className="flex-1 w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={campaignPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="day" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="reach" stroke="#00f0ff" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="engagement" stroke="#39ff14" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="conversion" stroke="#a855f7" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-[10px] font-extrabold text-gray-400 mt-3 pt-3 border-t border-gray-800/80">
                  <span className="flex items-center gap-1 text-neon-blue"><div className="w-2 h-2 rounded-full bg-neon-blue" /> Reach</span>
                  <span className="flex items-center gap-1 text-neon-green"><div className="w-2 h-2 rounded-full bg-neon-green" /> Engaged</span>
                  <span className="flex items-center gap-1 text-neon-purple"><div className="w-2 h-2 rounded-full bg-neon-purple" /> Convert</span>
                </div>
              </div>

              {/* Campaign by Channel */}
              <div className="glass-panel p-4 flex flex-col shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-white">Channel Distribution</h3>
                  <span className="text-[10px] text-gray-400 font-bold bg-gray-900 px-2 py-0.5 rounded border border-gray-800">Total</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-36 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={channelData} innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                          {channelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-white">352.4K</span>
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Reach</span>
                    </div>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {channelData.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs font-bold">
                        <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} /> <span className="text-gray-300">{d.name}</span></span>
                        <div className="flex items-center gap-2">
                          <span className="text-white">{d.value.toLocaleString()} <span className="text-gray-500 font-mono text-[10px]">({d.pct})</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performing Campaigns */}
              <div className="glass-panel p-4 flex flex-col shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-white">Top Converting Blasts</h3>
                  <span className="text-[10px] text-neon-green font-black">Leaders</span>
                </div>
                <div className="space-y-3">
                  {displayCampaigns.filter(c => c.conversion > 0).sort((a,b) => b.conversion - a.conversion).slice(0,3).map((c, i) => (
                    <div key={i} onClick={() => setSelectedPreview(c)} className="flex items-center gap-3 p-2 rounded-xl bg-gray-950/60 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all">
                      <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-xs text-neon-blue font-black border border-gray-700">#{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-white truncate">{c.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium">Reach: {c.reach.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-neon-green">{c.conversion}%</div>
                        <div className="text-[9px] text-gray-500 uppercase font-bold">Conv.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-16 flex flex-col items-center justify-center text-center mt-4 border border-gray-800 rounded-3xl shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 text-neon-blue shadow-inner">
            <Megaphone size={28} />
          </div>
          <h3 className="text-xl font-black text-white mb-2">{activeTab} Workflows & Automation</h3>
          <p className="text-xs text-gray-400 max-w-md leading-relaxed mb-6">Create automated lifecycle triggers, WhatsApp drip series, and dynamic multi-channel broadcasts specifically tailored for {activeTab.toLowerCase()}.</p>
          <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            + Create New {activeTab} Template
          </button>
        </div>
      )}

      {/* NEW: CAMPAIGN PREVIEW MODAL */}
      <AnimatePresence>
        {selectedPreview && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedPreview(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl text-left space-y-5 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
              
              <div className="flex justify-between items-center pb-4 border-b border-gray-800 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center text-neon-blue font-black">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">{selectedPreview.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-neon-green border border-green-500/20 text-[10px] font-extrabold uppercase">{selectedPreview.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-bold mt-0.5">{selectedPreview.type} Broadcast • Dispatched via {selectedPreview.channel}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPreview(null)} className="text-gray-400 hover:text-white p-2 bg-gray-900 rounded-full"><X size={18}/></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {/* Telemetry Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-2xl text-center">
                    <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Total Reach</div>
                    <div className="text-xl font-black text-white">{selectedPreview.reach?.toLocaleString() || '1,240'}</div>
                    <div className="text-[10px] text-neon-green font-bold mt-0.5">↑ {selectedPreview.reachPct} Delivered</div>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-2xl text-center">
                    <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Engagement</div>
                    <div className="text-xl font-black text-white">{selectedPreview.engagement || 42}%</div>
                    <div className="text-[10px] text-neon-blue font-bold mt-0.5">↑ {selectedPreview.engPct} Opened/Clicked</div>
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 p-3.5 rounded-2xl text-center">
                    <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Conversions</div>
                    <div className="text-xl font-black text-neon-green">{selectedPreview.conversion || 15}%</div>
                    <div className="text-[10px] text-purple-400 font-bold mt-0.5">↑ {selectedPreview.convPct} Action Taken</div>
                  </div>
                </div>

                {/* Audience Target Details */}
                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400"><span className="font-bold">Target Audience Filter:</span> <strong className="text-white font-black">{selectedPreview.audience}</strong></div>
                  <div className="flex justify-between text-gray-400"><span className="font-bold">Total Recipients:</span> <strong className="text-neon-blue font-mono">{selectedPreview.audienceCount?.toLocaleString() || '1,240'} Contacts</strong></div>
                  <div className="flex justify-between text-gray-400"><span className="font-bold">Dispatch Schedule:</span> <strong className="text-gray-200 font-mono">{selectedPreview.date}</strong></div>
                </div>

                {/* Rendered Template Preview */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Live Broadcast Message Preview (Rendered variables)</label>
                  <div className="p-4 rounded-2xl bg-gray-950 border border-gray-800/80 text-xs text-gray-200 leading-relaxed font-mono relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-neon-blue" />
                    {selectedPreview.desc ? selectedPreview.desc : "Hi Sarah Jenkins, our new VIP onboarding tools and analytics dashboard are now live for your account! Check them out today to boost your earnings."}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-800 shrink-0 flex justify-end gap-2">
                <button onClick={() => { setSelectedEdit(selectedPreview); setSelectedPreview(null); }} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-black text-xs rounded-xl transition-all flex items-center gap-1.5"><Edit2 size={14}/> Edit Campaign</button>
                <button onClick={() => setSelectedPreview(null)} className="px-6 py-2.5 bg-neon-blue text-black font-black text-xs rounded-xl shadow-md">Close Preview</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: ADVANCED FILTERS MODAL */}
      <AnimatePresence>
        {showFiltersModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowFiltersModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Filter size={16} className="text-neon-blue"/> Advanced Campaign Filters</h3>
                <button onClick={() => setShowFiltersModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-400 block mb-1">Campaign Type</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option value="All Types">All Campaign Types</option>
                    <option value="Promotional">Promotional Blasts</option>
                    <option value="Educational">Educational Guides</option>
                    <option value="Retention">Retention & Churn Prevention</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-400 block mb-1">Execution Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option value="All Status">All Execution Status</option>
                    <option value="Active">Active & Sending</option>
                    <option value="Completed">Completed Blasts</option>
                    <option value="Scheduled">Scheduled for Later</option>
                    <option value="Draft">Drafts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-400 block mb-1">Dispatch Channel</label>
                  <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option value="All Channels">All Communication Channels</option>
                    <option value="Email">Email Newsletter</option>
                    <option value="WhatsApp">WhatsApp Broadcast</option>
                    <option value="SMS">SMS Text</option>
                    <option value="Push">Push Notification</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-800">
                <button onClick={() => { setTypeFilter('All Types'); setStatusFilter('All Status'); setChannelFilter('All Channels'); setSearchQuery(''); setShowFiltersModal(false); }} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Reset All</button>
                <button onClick={() => setShowFiltersModal(false)} className="flex-1 py-2.5 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-md">Apply Filters ({displayCampaigns.length} Results)</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT CAMPAIGN MODAL */}
      <ActionModal
        open={!!selectedEdit}
        onClose={() => setSelectedEdit(null)}
        title="Edit Campaign Settings"
        icon={Edit2}
        submitText="Save Campaign Changes ✓"
        onSubmit={handleEditSubmit}
        fields={[
          { name: 'name', label: 'Campaign Name', defaultValue: selectedEdit?.name || '', required: true },
          { name: 'channel', label: 'Broadcast Channel', type: 'select', defaultValue: selectedEdit?.channel || 'Email', options: ['WhatsApp Blast', 'Bulk SMS Text', 'Email Newsletter', 'Push Notification'], required: true },
          { name: 'status', label: 'Execution Status', type: 'select', defaultValue: selectedEdit?.status || 'Active', options: ['Active', 'Completed', 'Scheduled', 'Draft'], required: true }
        ]}
      />

      {/* NEW CAMPAIGN BLAST MODAL */}
      <ActionModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Create Bulk Broadcast / Campaign"
        icon={Megaphone}
        submitText="Schedule & Send Blast 🚀"
        onSubmit={handleCreate}
        fields={[
          { name: 'name', label: 'Broadcast Campaign Name', placeholder: 'e.g., Summer VIP Broadcast', required: true },
          { name: 'channel', label: 'Broadcast Channel', type: 'select', options: ['WhatsApp Blast', 'Bulk SMS Text', 'Email Newsletter', 'Push Notification'], required: true },
          { name: 'target', label: 'Target Audience / Filter', type: 'select', options: ['All Creators (1,240 Contacts)', 'VIP Leads Only (420 Contacts)', 'Active Fans (8,500 Contacts)', 'Pending Onboarding (310 Contacts)'], required: true },
          { name: 'schedule', label: 'Schedule Date & Time', placeholder: 'Immediate / YYYY-MM-DD HH:MM', required: false },
          { name: 'message', label: 'Bulk Message Template (Use {{name}} for dynamic variables)', type: 'textarea', placeholder: 'Hi {{name}}, we have an exciting special offer just for you! Click below to claim your rewards...', required: true }
        ]}
      />
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
