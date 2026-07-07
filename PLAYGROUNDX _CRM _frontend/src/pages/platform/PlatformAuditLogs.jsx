import { useState, useMemo } from 'react';
import { usePlatformData } from '../../contexts/DataContext';
import { ShieldCheck, Search, AlertTriangle, CheckCircle2, LogIn, Settings, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportCSV } from '../../utils/csvExport';

const STATUS_STYLE = {
  Success: { bg: '#10b98115', text: '#34d399', border: '#10b98130', dot: '#34d399' },
  Failed:  { bg: '#ef444415', text: '#f87171', border: '#ef444430', dot: '#f87171' },
};
const MODULE_COLOR = {
  'Auth':        '#8a2be2',
  'API Mgmt':    '#3b82f6',
  'Billing':     '#10b981',
  'Tenant Mgmt': '#ec4899',
  'Support':     '#f59e0b',
  'Settings':    '#f97316',
  'System':      '#6b7280',
};

const ACTIVITY_DATA = [
  {t:'00',e:4},{t:'04',e:2},{t:'08',e:18},{t:'10',e:32},
  {t:'12',e:28},{t:'14',e:22},{t:'16',e:30},{t:'18',e:15},
  {t:'20',e:8},{t:'22',e:5},{t:'24',e:3},
];
const EVENT_TYPES = [
  {type:'Admin Actions',count:6},{type:'API Events',count:4},
  {type:'Auth Events',count:3},{type:'Billing',count:3},
  {type:'System',count:2},{type:'Failed',count:2},
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

export default function PlatformAuditLogs() {
  const [logs] = usePlatformData('auditLogs');
  const [q, setQ]           = useState('');
  const [moduleF, setModF]  = useState('All');
  const [statusF, setStaF]  = useState('All');

  const allModules = ['All', ...new Set((logs||[]).map(l=>l.module))];

  const filtered = useMemo(() => (logs||[]).filter(l =>
    (!q || l.action.toLowerCase().includes(q.toLowerCase()) ||
      l.user.toLowerCase().includes(q.toLowerCase()) ||
      l.tenant.toLowerCase().includes(q.toLowerCase()) ||
      l.ip.includes(q)) &&
    (moduleF==='All' || l.module===moduleF) &&
    (statusF==='All' || l.status===statusF)
  ), [logs, q, moduleF, statusF]);

  const successes = (logs||[]).filter(l=>l.status==='Success').length;
  const failures  = (logs||[]).filter(l=>l.status==='Failed').length;
  const adminActs = (logs||[]).filter(l=>l.role!=='System').length;
  const authEvts  = (logs||[]).filter(l=>l.module==='Auth').length;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <ShieldCheck size={22} className="text-purple-400"/>Global Audit Logs
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform-wide security events, admin actions, and API activity.</p>
        </div>
        <button
          onClick={() => exportCSV(filtered, `audit_logs_${new Date().toISOString().slice(0,10)}.csv`, ['id','date','action','module','user','role','tenant','ip','status'])}
          className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold hover:border-gray-500 transition-colors">
          Export Logs
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 shrink-0">
        <KPI label="Total Events"    value={(logs||[]).length} icon={Activity}      color="#3b82f6"/>
        <KPI label="Successful"      value={successes}         icon={CheckCircle2}  color="#10b981"/>
        <KPI label="Failed Events"   value={failures}          icon={AlertTriangle} color="#ef4444"/>
        <KPI label="Security Alerts" value={failures}          icon={ShieldCheck}   color="#8a2be2"/>
        <KPI label="Admin Actions"   value={adminActs}         icon={Settings}      color="#ec4899"/>
        <KPI label="Auth Events"     value={authEvts}          icon={LogIn}         color="#f59e0b"/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Activity Timeline — Today</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ACTIVITY_DATA}>
                <defs>
                  <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false}/>
                <XAxis dataKey="t" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}}/>
                <Area type="monotone" dataKey="e" name="Events" stroke="#8a2be2" strokeWidth={2} fill="url(#aGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Events by Type</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EVENT_TYPES} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" horizontal={false}/>
                <XAxis type="number" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis dataKey="type" type="category" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={85}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}}/>
                <Bar dataKey="count" fill="#8a2be2" radius={[0,3,3,0]} fillOpacity={0.8}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[#21262d]">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by action, user, IP, tenant..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"/>
          </div>
          <select value={moduleF} onChange={e=>setModF(e.target.value)}
            className="bg-[#161b22] border border-[#30363d] rounded-md px-2.5 py-1.5 text-xs text-white focus:outline-none">
            {allModules.map(m=><option key={m}>{m}</option>)}
          </select>
          <div className="flex gap-1">
            {['All','Success','Failed'].map(s=>(
              <button key={s} onClick={()=>setStaF(s)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${statusF===s?'bg-purple-500 text-white':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Scrollable table — header sticky */}
        <div className="overflow-auto" style={{maxHeight:'420px'}}>
          <table className="w-full text-sm min-w-[820px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left w-[13%]">Timestamp</th>
                <th className="table-th text-left w-[18%]">Action</th>
                <th className="table-th text-left w-[10%]">Module</th>
                <th className="table-th text-left w-[11%]">User</th>
                <th className="table-th text-left w-[11%]">Role</th>
                <th className="table-th text-left w-[14%]">Tenant</th>
                <th className="table-th text-left w-[10%]">IP</th>
                <th className="table-th text-left w-[7%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log, i) => {
                const s  = STATUS_STYLE[log.status] || STATUS_STYLE.Success;
                const mc = MODULE_COLOR[log.module] || '#6b7280';
                return (
                  <tr key={log.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors cursor-pointer ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-gray-400">
                      {new Date(log.date).toLocaleString('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-bold text-white">{log.action}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{backgroundColor:`${mc}18`,color:mc}}>{log.module}</span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-300">{log.user}</td>
                    <td className="px-3 py-2.5 text-[11px] text-gray-500">{log.role}</td>
                    <td className="px-3 py-2.5 text-xs text-blue-400 truncate">{log.tenant==='—'?<span className="text-gray-600">—</span>:log.tenant}</td>
                    <td className="px-3 py-2.5 text-[11px] font-mono text-gray-400">{log.ip}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.dot}}/>{log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-[#21262d] text-xs text-gray-500">
          Showing <b className="text-white">{filtered.length}</b> of <b className="text-white">{(logs||[]).length}</b> events
        </div>
      </div>
    </div>
  );
}
