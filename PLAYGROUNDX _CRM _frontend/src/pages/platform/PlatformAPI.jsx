import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { usePlatformData } from '../../contexts/DataContext';
import { Globe, Copy, Eye, EyeOff, RefreshCw, Plus, Activity, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { exportCSV } from '../../utils/csvExport';

const KEY_STATUS = {
  Active:  { bg:'#10b98115', text:'#34d399', border:'#10b98130', dot:'#34d399' },
  Revoked: { bg:'#7f1d1d20', text:'#9b2c2c', border:'#7f1d1d30', dot:'#9b2c2c' },
};

const API_LOAD = [
  {t:'00',req:12200,err:82},{t:'04',req:15400,err:62},{t:'08',req:45000,err:220},
  {t:'12',req:85200,err:480},{t:'16',req:62000,err:310},{t:'20',req:28000,err:140},{t:'24',req:14000,err:70},
];

const KPI = ({ label, value, icon: Icon, color }) => (
  <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor:`${color}15`, border:`1px solid ${color}30`, color }}><Icon size={18}/></div>
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{label}</div>
      <div className="text-xl font-black text-white">{value}</div>
    </div>
  </div>
);

export default function PlatformAPI() {
  const [keys, { addItem: addKey }]     = usePlatformData('apiKeys');
  const [webhooks] = usePlatformData('apiWebhooks');
  const [shown, setShown] = useState({});
  const { addToast } = useToast();
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const toggleShow = id => setShown(p => ({...p,[id]:!p[id]}));

  const activeKeys = (keys||[]).filter(k=>k.status==='Active').length;
  const activeWH   = (webhooks||[]).filter(w=>w.status==='Active').length;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Globe size={22} className="text-pink-400"/>API Keys
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage platform and tenant API keys, scopes, and rate limits.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(keys||[], `api_keys_${new Date().toISOString().slice(0,10)}.csv`, ['id','name','env','scope','createdBy','requests','rateLimit','status'])}
            className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold hover:border-gray-500 transition-colors">
            Export CSV
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2 bg-pink-500/10 text-pink-400 border border-pink-500/30 hover:bg-pink-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Plus size={14}/>Generate Key
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 shrink-0">
        <KPI label="Requests Today" value="4.2M"       icon={Activity}      color="#3b82f6"/>
        <KPI label="Success Rate"   value="99.8%"      icon={CheckCircle2}  color="#10b981"/>
        <KPI label="Failed Reqs"    value="8,400"      icon={AlertTriangle} color="#ef4444"/>
        <KPI label="Avg Response"   value="2.4ms"      icon={Activity}      color="#8a2be2"/>
        <KPI label="Active Keys"    value={activeKeys} icon={Globe}         color="#ec4899"/>
        <KPI label="Active WHooks"  value={activeWH}   icon={Globe}         color="#f59e0b"/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">API Load — Today</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={API_LOAD}>
                <defs>
                  <linearGradient id="apiG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false}/>
                <XAxis dataKey="t" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}} formatter={v=>v.toLocaleString()}/>
                <Area type="monotone" dataKey="req" name="Requests" stroke="#3b82f6" strokeWidth={2} fill="url(#apiG)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Error Rate — Today</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={API_LOAD} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false}/>
                <XAxis dataKey="t" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}}/>
                <Bar dataKey="err" name="Errors" fill="#ef4444" radius={[2,2,0,0]} fillOpacity={0.7}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-[#21262d]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">API Keys</span>
        </div>

        <div className="overflow-auto" style={{maxHeight:'420px'}}>
          <table className="w-full text-sm min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left w-[22%]">Key Name</th>
                <th className="table-th text-left w-[11%]">Environment</th>
                <th className="table-th text-left w-[10%]">Scope</th>
                <th className="table-th text-left w-[20%]">Secret Key</th>
                <th className="table-th text-left w-[11%]">Created By</th>
                <th className="table-th text-left w-[8%]">Requests</th>
                <th className="table-th text-left w-[9%]">Rate Limit</th>
                <th className="table-th text-left w-[7%]">Status</th>
                <th className="table-th text-right w-[8%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(keys||[]).map((k, i) => {
                const s = KEY_STATUS[k.status] || KEY_STATUS.Active;
                return (
                  <tr key={k.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors group ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-2.5 text-xs font-semibold text-white">{k.name}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${k.env==='Production'?'bg-purple-500/15 text-purple-400 border border-purple-500/30':'bg-blue-500/15 text-blue-400 border border-blue-500/30'}`}>
                        {k.env}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-gray-400">{k.scope}</td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-gray-400">{shown[k.id] ? k.key : '•'.repeat(20)}</td>
                    <td className="px-3 py-2.5 text-[11px] text-gray-400">{k.createdBy}</td>
                    <td className="px-3 py-2.5 text-[11px] text-blue-400 font-mono">{k.requests}</td>
                    <td className="px-3 py-2.5 text-[11px] text-gray-400">{k.rateLimit}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.dot}}/>{k.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>toggleShow(k.id)} className="p-1 bg-[#21262d] hover:bg-[#30363d] text-gray-400 rounded" title="Show/Hide key">{shown[k.id]?<EyeOff size={12}/>:<Eye size={12}/>}</button>
                        <button
                          onClick={() => { navigator.clipboard.writeText(k.key); addToast('success', 'Key Copied', `API key "${k.name}" copied to clipboard.`); }}
                          className="p-1 bg-[#21262d] hover:bg-[#30363d] text-gray-400 hover:text-blue-400 rounded" title="Copy to clipboard">
                          <Copy size={12}/>
                        </button>
                        <button
                          onClick={() => addToast('warning', 'Key Rotated', `A new key has been generated for "${k.name}". Update your integrations.`)}
                          className="p-1 bg-[#21262d] hover:bg-[#30363d] text-gray-400 hover:text-amber-400 rounded" title="Rotate key">
                          <RefreshCw size={12}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-[#21262d] text-xs text-gray-500">
          <b className="text-white">{(keys||[]).length}</b> API keys · <b className="text-white">{activeKeys}</b> active
        </div>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {showGenerateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Generate New API Key</h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Key Name</label>
                  <input id="newKeyName" type="text" placeholder="e.g. Mobile App Integration" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Environment</label>
                  <select id="newKeyEnv" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500">
                    <option value="production">Production</option>
                    <option value="sandbox">Sandbox / Staging</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Permissions Scope</label>
                  <select id="newKeyScope" className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500">
                    <option value="full">Full Access (Admin)</option>
                    <option value="read_write">Read + Write</option>
                    <option value="read_only">Read Only</option>
                  </select>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-[#30363d] flex justify-end gap-2 bg-[#161b22]">
                <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={() => {
                  const name = document.getElementById('newKeyName')?.value || 'New Integration Key';
                  const env = document.getElementById('newKeyEnv')?.value || 'production';
                  const scope = document.getElementById('newKeyScope')?.value || 'full';
                  
                  const newKey = {
                    id: 'pgx_' + Math.random().toString(36).substring(2, 10),
                    name,
                    env,
                    scope,
                    status: 'Active',
                    createdBy: 'Super Admin',
                    createdAt: 'Just now',
                    requests: '0',
                    rateLimit: '1k/min'
                  };
                  
                  addKey(newKey);
                  addToast('success', 'Key Generated', 'A new API key has been created successfully.');
                  setShowGenerateModal(false);
                }} className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-xs font-bold transition-colors">
                  Generate Key
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
