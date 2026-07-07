import { useState, useMemo } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { usePlatformData } from '../../contexts/DataContext';
import { Building2, Search, Users, TrendingUp, ShieldAlert, Play, Pause, Edit, Eye, Crown, BarChart2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportCSV } from '../../utils/csvExport';
import EmptyState from '../../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

const PLAN_COLORS = { Enterprise: '#8a2be2', Pro: '#3b82f6', Basic: '#10b981', Trial: '#f59e0b' };
const STATUS_STYLE = {
  Active:    { bg: '#10b98115', text: '#34d399', border: '#10b98130' },
  Trial:     { bg: '#f59e0b15', text: '#fbbf24', border: '#f59e0b30' },
  Suspended: { bg: '#ef444415', text: '#f87171', border: '#ef444430' },
};

const KPI = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 flex items-center gap-3 shrink-0">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30`, color }}>
      <Icon size={18} />
    </div>
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{label}</div>
      <div className="text-xl font-black text-white">{value}</div>
      {sub && <div className="text-[10px] text-emerald-400 font-semibold">{sub}</div>}
    </div>
  </div>
);

export default function PlatformTenants() {
  const { addToast } = useToast();
  const [tenants, { updateItem: updateTenant }] = usePlatformData('tenants');
  const [tiers]   = usePlatformData('subscriptionTiers');
  const [revenue] = usePlatformData('platformRevenue');

  const [q, setQ]         = useState('');
  const [planF, setPlanF] = useState('All');
  const [staF, setStaF]   = useState('All');
  const [sortKey, setSort]= useState('mrr');
  const [sortDir, setDir] = useState('desc');
  const [page, setPage]   = useState(1);
  const PER_PAGE = 8;
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'suspend', 'upgrade'
  const [showProvisionModal, setShowProvisionModal] = useState(false);


  const sorted = useMemo(() => {
    let r = (tenants || []).filter(t =>
      (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase())) &&
      (planF === 'All' || t.plan === planF) &&
      (staF  === 'All' || t.status === staF)
    );
    r.sort((a, b) => sortDir === 'asc' ? (a[sortKey] > b[sortKey] ? 1 : -1) : (a[sortKey] < b[sortKey] ? 1 : -1));
    return r;
  }, [tenants, q, planF, staF, sortKey, sortDir]);

  const pages    = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pageData = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const toggleSort = key => { if (sortKey === key) setDir(d => d==='asc'?'desc':'asc'); else { setSort(key); setDir('desc'); }};
  const renderSorter = (k) => <span className="ml-1 opacity-50">{sortKey===k ? (sortDir==='asc'?'↑':'↓') : '↕'}</span>;

  const active    = (tenants||[]).filter(t=>t.status==='Active').length;
  const trial     = (tenants||[]).filter(t=>t.status==='Trial').length;
  const suspended = (tenants||[]).filter(t=>t.status==='Suspended').length;
  const enterprise= (tenants||[]).filter(t=>t.plan==='Enterprise').length;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3"><Building2 size={22} className="text-blue-400"/>Tenant Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all platform tenants, plans and lifecycle.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(sorted, `tenants_${new Date().toISOString().slice(0,10)}.csv`, ['id','name','plan','status','users','mrr','renewal','region','industry'])}
            className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold hover:border-gray-500 transition-colors">
            Export CSV
          </button>
          <button
            onClick={() => setShowProvisionModal(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-bold transition-colors">
            + Provision Tenant
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 shrink-0">
        <KPI label="Total Tenants"  value={(tenants||[]).length}   icon={Building2}   color="#3b82f6" />
        <KPI label="Active"         value={active}   sub="+3 month" icon={Play}        color="#10b981" />
        <KPI label="Trial"          value={trial}                   icon={TrendingUp}  color="#f59e0b" />
        <KPI label="Enterprise"     value={enterprise}              icon={Crown}       color="#8a2be2" />
        <KPI label="Suspended"      value={suspended}               icon={ShieldAlert} color="#ef4444" />
        <KPI label="MoM Growth"     value="+18.4%"                  icon={BarChart2}   color="#ec4899" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <div className="lg:col-span-2 bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Revenue by Plan (Monthly)</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue?.history||[]} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false}/>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}} formatter={v=>`$${v.toLocaleString()}`}/>
                <Bar dataKey="enterprise" name="Enterprise" stackId="a" fill="#8a2be2"/>
                <Bar dataKey="pro"        name="Pro"        stackId="a" fill="#3b82f6"/>
                <Bar dataKey="basic"      name="Basic"      stackId="a" fill="#10b981" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Subscription Mix</div>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart><Pie data={tiers||[]} innerRadius={30} outerRadius={44} paddingAngle={3} dataKey="value" stroke="none">
                  {(tiers||[]).map((t,i)=><Cell key={i} fill={t.color}/>)}
                </Pie></PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white">{(tenants||[]).length}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {(tiers||[]).map((t,i)=>(
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor:t.color}}/><span className="text-gray-400">{t.name}</span></div>
                  <span className="text-white font-bold">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Card — sticky header, scrollable body */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[#21262d]">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>{setQ(e.target.value);setPage(1);}} placeholder="Search tenants..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"/>
          </div>
          <div className="flex flex-wrap gap-1">
            {['All','Enterprise','Pro','Basic','Trial'].map(p=>(
              <button key={p} onClick={()=>{setPlanF(p);setPage(1);}}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${planF===p?'bg-blue-500 text-white':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>{p}</button>
            ))}
          </div>
          <select value={staF} onChange={e=>{setStaF(e.target.value);setPage(1);}}
            className="bg-[#161b22] border border-[#30363d] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none">
            {['All','Active','Trial','Suspended'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Scrollable table — thead is sticky inside the scroll container */}
        <div className="overflow-auto" style={{maxHeight:'420px'}}>
          <table className="w-full text-sm min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left">Company</th>
                <th className="table-th text-left cursor-pointer hover:text-white" onClick={()=>toggleSort('plan')}>Plan{renderSorter('plan')}</th>
                <th className="table-th text-left">Status</th>
                <th className="table-th text-left cursor-pointer hover:text-white" onClick={()=>toggleSort('users')}>Users{renderSorter('users')}</th>
                <th className="table-th text-left cursor-pointer hover:text-white" onClick={()=>toggleSort('mrr')}>MRR{renderSorter('mrr')}</th>
                <th className="table-th text-left">Renewal</th>
                <th className="table-th text-left">Region</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12">
                    <EmptyState
                      icon={Building2}
                      title="No tenants found"
                      description="Try adjusting your search or filters."
                    />
                  </td>
                </tr>
              ) : pageData.map((t, i) => {
                const s = STATUS_STYLE[t.status] || STATUS_STYLE.Active;
                const pc = PLAN_COLORS[t.plan] || '#6b7280';
                return (
                  <tr key={t.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors group ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0"
                          style={{backgroundColor:`${pc}20`,border:`1px solid ${pc}30`}}>{t.name.charAt(0)}</div>
                        <div>
                          <div className="font-semibold text-white text-xs group-hover:text-blue-400 transition-colors">{t.name}</div>
                          <div className="text-[10px] text-gray-500">{t.industry}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{backgroundColor:`${pc}15`,color:pc,border:`1px solid ${pc}25`}}>{t.plan}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.text}}/>{t.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-300 font-medium">{t.users}</td>
                    <td className="px-3 py-3 text-xs font-bold" style={{color:t.mrr>0?'#34d399':'#6b7280'}}>{t.mrr>0?`$${t.mrr.toLocaleString()}`:'—'}</td>
                    <td className="px-3 py-3 text-[11px] text-gray-400">{t.renewal}</td>
                    <td className="px-3 py-3 text-[11px] text-gray-400">{t.region}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedTenant(t); setModalType('view'); }} className="p-1 bg-[#21262d] hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 rounded transition-colors"><Eye size={13}/></button>
                        <button onClick={() => { setSelectedTenant(t); setModalType('edit'); }} className="p-1 bg-[#21262d] hover:bg-[#30363d] text-gray-400 rounded"><Edit size={13}/></button>
                        {t.status==='Active'
                          ? <button onClick={() => { setSelectedTenant(t); setModalType('suspend'); }} className="p-1 bg-[#21262d] hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded transition-colors"><Pause size={13}/></button>
                          : <button onClick={() => { setSelectedTenant(t); setModalType('reactivate'); }} className="p-1 bg-[#21262d] hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-400 rounded transition-colors"><Play size={13}/></button>}
                        <button onClick={() => { setSelectedTenant(t); setModalType('upgrade'); }} className="p-1 bg-[#21262d] hover:bg-purple-500/20 hover:text-purple-400 text-gray-400 rounded transition-colors"><Crown size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#21262d] bg-[#0d1117]">
          <span className="text-xs text-gray-500">Showing <b className="text-white">{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,sorted.length)}</b> of <b className="text-white">{sorted.length}</b></span>
          <div className="flex gap-1">
            {Array.from({length:pages},(_,i)=>(
              <button key={i} onClick={()=>setPage(i+1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${page===i+1?'bg-blue-500 text-white':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>{i+1}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {selectedTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                  {modalType === 'view' && 'Tenant Details'}
                  {modalType === 'edit' && 'Edit Tenant'}
                  {modalType === 'suspend' && 'Suspend Tenant'}
                  {modalType === 'reactivate' && 'Reactivate Tenant'}
                  {modalType === 'upgrade' && 'Upgrade Tenant'}
                </h3>
                <button onClick={() => setSelectedTenant(null)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 text-sm text-gray-300">
                {modalType === 'view' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-[#30363d] pb-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl font-black text-white shrink-0">
                        {selectedTenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{selectedTenant.name}</div>
                        <div className="text-xs text-gray-400">{selectedTenant.industry} • {selectedTenant.region}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Plan</div>
                        <div className="font-medium text-white">{selectedTenant.plan}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</div>
                        <div className="font-medium text-white">{selectedTenant.status}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">MRR</div>
                        <div className="font-medium text-emerald-400">${selectedTenant.mrr?.toLocaleString() || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Users</div>
                        <div className="font-medium text-white">{selectedTenant.users}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Renewal Date</div>
                        <div className="font-medium text-white">{selectedTenant.renewal}</div>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'edit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Company Name</label>
                      <input type="text" defaultValue={selectedTenant.name} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Plan Tier</label>
                      <select defaultValue={selectedTenant.plan} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="Enterprise">Enterprise</option>
                        <option value="Pro">Pro</option>
                        <option value="Basic">Basic</option>
                        <option value="Trial">Trial</option>
                      </select>
                    </div>
                  </div>
                )}

                {(modalType === 'suspend' || modalType === 'reactivate') && (
                  <div className="text-center py-4">
                    <ShieldAlert size={48} className={`mx-auto mb-4 ${modalType === 'suspend' ? 'text-red-500' : 'text-emerald-500'}`} />
                    <p className="text-base text-white font-bold mb-2">Are you sure?</p>
                    <p className="text-xs text-gray-400">
                      You are about to {modalType} the tenant <b>{selectedTenant.name}</b>.
                      {modalType === 'suspend' && ' All user access will be revoked immediately.'}
                    </p>
                  </div>
                )}

                {modalType === 'upgrade' && (
                  <div className="text-center py-4">
                    <Crown size={48} className="mx-auto mb-4 text-purple-500" />
                    <p className="text-base text-white font-bold mb-2">VIP Upgrade Flow</p>
                    <p className="text-xs text-gray-400">
                      Initiate enterprise upgrade configuration for <b>{selectedTenant.name}</b>.
                    </p>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-[#30363d] flex justify-end gap-2 bg-[#161b22]">
                <button onClick={() => setSelectedTenant(null)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  {modalType === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalType !== 'view' && (
                  <button onClick={() => {
                    if(modalType === 'edit') {
                      // Note: form inputs aren't controlled here, but we can simulate edit success
                      addToast('success', 'Updated', 'Tenant updated successfully');
                    }
                    if(modalType === 'suspend') {
                      updateTenant(selectedTenant.id, { status: 'Suspended' });
                      addToast('warning', 'Suspended', 'Tenant suspended');
                    }
                    if(modalType === 'reactivate') {
                      updateTenant(selectedTenant.id, { status: 'Active' });
                      addToast('success', 'Reactivated', 'Tenant reactivated');
                    }
                    if(modalType === 'upgrade') {
                      updateTenant(selectedTenant.id, { plan: 'Enterprise' });
                      addToast('success', 'Upgrade Initiated', 'VIP flow started');
                    }
                    setSelectedTenant(null);
                  }} className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${
                    modalType === 'suspend' ? 'bg-red-500 hover:bg-red-600' : 
                    modalType === 'upgrade' ? 'bg-purple-500 hover:bg-purple-600' :
                    'bg-blue-500 hover:bg-blue-600'
                  }`}>
                    Confirm Action
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showProvisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Provision New Tenant Environment</h3>
                <button onClick={() => setShowProvisionModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
                
                {/* Section: Organization Details */}
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Organization Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Company Name</label>
                      <input type="text" placeholder="e.g. Acme Corporation" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Tenant Subdomain</label>
                      <div className="flex bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden focus-within:border-blue-500">
                        <input type="text" placeholder="acme" className="w-full bg-transparent px-3 py-2 text-sm text-white focus:outline-none" />
                        <div className="px-3 py-2 text-sm text-gray-500 bg-[#0d1117] border-l border-[#30363d]">.playgroundx.com</div>
                      </div>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Industry</label>
                      <select className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="tech">Technology</option>
                        <option value="retail">Retail</option>
                        <option value="finance">Finance</option>
                        <option value="health">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Base Language</label>
                      <select className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="en">English (US)</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Contact & Billing */}
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Contact & Billing</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Owner Email</label>
                      <input type="email" placeholder="ceo@acme.com" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Billing Email (Optional)</label>
                      <input type="email" placeholder="billing@acme.com" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone Number</label>
                      <input type="tel" placeholder="+1 (555) 000-0000" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Country</label>
                      <select className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="us">United States</option>
                        <option value="ca">Canada</option>
                        <option value="uk">United Kingdom</option>
                        <option value="in">India</option>
                        <option value="au">Australia</option>
                        <option value="ae">United Arab Emirates</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section: Infrastructure & Subscription */}
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Infrastructure & Plan</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Cloud Region</label>
                      <select className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="us-east">US East (N. Virginia)</option>
                        <option value="eu-central">EU Central (Frankfurt)</option>
                        <option value="ap-south">AP South (Mumbai)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Subscription Tier</label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="flex flex-col items-center p-3 border border-[#30363d] rounded-lg cursor-pointer hover:border-blue-500 bg-[#161b22] transition-colors group">
                          <input type="radio" name="plan" value="Basic" className="hidden" />
                          <span className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Basic</span>
                          <span className="text-[10px] text-gray-500">$99/mo</span>
                        </label>
                        <label className="flex flex-col items-center p-3 border border-blue-500 rounded-lg cursor-pointer bg-blue-500/10">
                          <input type="radio" name="plan" value="Pro" defaultChecked className="hidden" />
                          <span className="font-bold text-blue-400 mb-1">Pro</span>
                          <span className="text-[10px] text-blue-400/70">$299/mo</span>
                        </label>
                        <label className="flex flex-col items-center p-3 border border-[#30363d] rounded-lg cursor-pointer hover:border-purple-500 bg-[#161b22] transition-colors group">
                          <input type="radio" name="plan" value="Enterprise" className="hidden" />
                          <span className="font-bold text-purple-400 mb-1">Enterprise</span>
                          <span className="text-[10px] text-purple-400/70">Custom SLA</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Add-ons */}
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-3">Add-ons</h4>
                  <label className="flex items-start gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input type="checkbox" defaultChecked className="mt-1 shrink-0 accent-blue-500" />
                    <div>
                      <div className="text-sm font-bold text-white">Enable AI Operations Suite</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">Automatically provisions AI Receptionists, Support Bots, and predictive analytics for this tenant.</div>
                    </div>
                  </label>
                </div>

              </div>

              <div className="px-5 py-4 border-t border-[#30363d] flex justify-end gap-3 bg-[#161b22]">
                <button onClick={() => setShowProvisionModal(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={() => {
                  addToast('success', 'Tenant Provisioned', 'Environment deployment started. Emails dispatched.');
                  setShowProvisionModal(false);
                }} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40">
                  Deploy Tenant Environment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
