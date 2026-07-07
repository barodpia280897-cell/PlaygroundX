import { useState, useMemo } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { usePlatformData } from '../../contexts/DataContext';
import { MessageSquare, Search, AlertCircle, CheckCircle2, Clock, Star, Plus } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportCSV } from '../../utils/csvExport';

const PRI_STYLE = {
  High:   { bg:'#ef444415', text:'#f87171', border:'#ef444430', dot:'#f87171' },
  Medium: { bg:'#f59e0b15', text:'#fbbf24', border:'#f59e0b30', dot:'#fbbf24' },
  Low:    { bg:'#6b728015', text:'#9ca3af', border:'#6b728030', dot:'#9ca3af' },
};
const STA_STYLE = {
  Open:          { bg:'#ec489915', text:'#f472b6', border:'#ec489930', dot:'#f472b6' },
  'In Progress': { bg:'#3b82f615', text:'#60a5fa', border:'#3b82f630', dot:'#60a5fa' },
  Resolved:      { bg:'#10b98115', text:'#34d399', border:'#10b98130', dot:'#34d399' },
};

const BY_CAT = [
  {cat:'API',count:3},{cat:'Billing',count:2},{cat:'Auth',count:1},
  {cat:'Data',count:1},{cat:'Onboard',count:1},{cat:'Docs',count:1},
];
const BY_PRI = [
  {name:'High',value:3,color:'#ef4444'},
  {name:'Medium',value:3,color:'#f59e0b'},
  {name:'Low',value:2,color:'#6b7280'},
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

const Dot = ({ styleMap, label }) => {
  const s = styleMap[label];
  if (!s) return <span className="text-xs text-gray-500">{label}</span>;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
      style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
      <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.dot}}/>{label}
    </span>
  );
};

export default function PlatformSupport() {
  const [tickets] = usePlatformData('supportTickets');
  const [q, setQ]      = useState('');
  const [priF, setPri] = useState('All');
  const { addToast } = useToast();

  const [staF, setSta] = useState('All');

  const filtered = useMemo(() => (tickets||[]).filter(t =>
    (!q || t.subject.toLowerCase().includes(q.toLowerCase()) || t.tenant.toLowerCase().includes(q.toLowerCase())) &&
    (priF==='All' || t.priority===priF) &&
    (staF==='All' || t.status===staF)
  ), [tickets, q, priF, staF]);

  const open     = (tickets||[]).filter(t=>t.status==='Open').length;
  const inProg   = (tickets||[]).filter(t=>t.status==='In Progress').length;
  const resolved = (tickets||[]).filter(t=>t.status==='Resolved').length;
  const csats    = (tickets||[]).filter(t=>t.csat);
  const avgCsat  = csats.length ? (csats.reduce((a,b)=>a+b.csat,0)/csats.length).toFixed(1) : '—';

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <MessageSquare size={22} className="text-blue-400"/>Support Center
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Platform-wide support tickets, SLA tracking, and CSAT.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(filtered, `support_tickets_${new Date().toISOString().slice(0,10)}.csv`, ['id','tenant','subject','category','priority','status','sla','elapsed','csat'])}
            className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold hover:border-gray-500 transition-colors">
            Export CSV
          </button>
          <button
            onClick={() => addToast('info', 'Coming Soon', 'New ticket creation form — coming in next release')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Plus size={14}/>New Ticket
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 shrink-0">
        <KPI label="Open"        value={open}              icon={AlertCircle}   color="#ec4899"/>
        <KPI label="In Progress" value={inProg}            icon={Clock}         color="#3b82f6"/>
        <KPI label="Resolved"    value={resolved}          icon={CheckCircle2}  color="#10b981"/>
        <KPI label="SLA Breach"  value="1"                 icon={AlertCircle}   color="#ef4444"/>
        <KPI label="Avg CSAT"    value={`${avgCsat}/5`}    icon={Star}          color="#f59e0b"/>
        <KPI label="Total"       value={(tickets||[]).length} icon={MessageSquare} color="#8a2be2"/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tickets by Category</div>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BY_CAT} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" horizontal={false}/>
                <XAxis type="number" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis dataKey="cat" type="category" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={52}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}}/>
                <Bar dataKey="count" fill="#3b82f6" radius={[0,3,3,0]} fillOpacity={0.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 flex flex-col">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">By Priority</div>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={BY_PRI} innerRadius={28} outerRadius={44} paddingAngle={3} dataKey="value" stroke="none">
                  {BY_PRI.map((p,i)=><Cell key={i} fill={p.color}/>)}
                </Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {BY_PRI.map((p,i)=>(
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor:p.color}}/><span className="text-gray-400">{p.name}</span></div>
                  <span className="text-white font-bold">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[#21262d]">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search tickets..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"/>
          </div>
          <div className="flex gap-1">
            {['All','High','Medium','Low'].map(p=>(
              <button key={p} onClick={()=>setPri(p)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${priF===p?'bg-blue-500 text-white':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>{p}</button>
            ))}
          </div>
          <div className="flex gap-1">
            {['All','Open','In Progress','Resolved'].map(s=>(
              <button key={s} onClick={()=>setSta(s)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${staF===s?'bg-purple-500 text-white':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto" style={{maxHeight:'420px'}}>
          <table className="w-full text-sm min-w-[760px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left w-[9%]">Ticket</th>
                <th className="table-th text-left w-[14%]">Tenant</th>
                <th className="table-th text-left w-[22%]">Subject</th>
                <th className="table-th text-left w-[8%]">Category</th>
                <th className="table-th text-left w-[10%]">Priority</th>
                <th className="table-th text-left w-[12%]">Status</th>
                <th className="table-th text-left w-[7%]">SLA</th>
                <th className="table-th text-left w-[9%]">Elapsed</th>
                <th className="table-th text-left w-[9%]">CSAT</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors cursor-pointer ${i%2!==0?'bg-[#0b0f14]':''}`}>
                  <td className="px-4 py-2.5 font-mono text-blue-400 text-xs font-semibold">{t.id}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-white truncate">{t.tenant}</td>
                  <td className="px-3 py-2.5 text-xs text-gray-300 truncate">{t.subject}</td>
                  <td className="px-3 py-2.5 text-[11px] text-gray-400">{t.category}</td>
                  <td className="px-3 py-2.5"><Dot styleMap={PRI_STYLE} label={t.priority}/></td>
                  <td className="px-3 py-2.5"><Dot styleMap={STA_STYLE} label={t.status}/></td>
                  <td className="px-3 py-2.5 text-[11px] text-gray-400">{t.sla}</td>
                  <td className="px-3 py-2.5 text-[11px] font-mono text-amber-400">{t.elapsed}</td>
                  <td className="px-3 py-2.5">
                    {t.csat
                      ? <div className="flex items-center gap-1"><Star size={11} className="text-amber-400" fill="#f59e0b"/><span className="text-xs font-bold text-amber-400">{t.csat}</span></div>
                      : <span className="text-xs text-gray-600">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-[#21262d] text-xs text-gray-500">
          Showing <b className="text-white">{filtered.length}</b> of <b className="text-white">{(tickets||[]).length}</b> tickets
        </div>
      </div>
    </div>
  );
}
