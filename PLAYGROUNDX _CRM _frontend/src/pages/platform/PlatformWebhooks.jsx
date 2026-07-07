import { useState, useMemo } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { motion } from 'framer-motion';
import { usePlatformData } from '../../contexts/DataContext';
import { Link2, Search, RefreshCw, Pause, AlertTriangle, CheckCircle2, Activity, Plus } from 'lucide-react';
import { exportCSV } from '../../utils/csvExport';

const WH_STATUS = {
  Active:  { bg: '#10b98115', text: '#34d399', border: '#10b98130', dot: '#34d399' },
  Failing: { bg: '#ef444415', text: '#f87171', border: '#ef444430', dot: '#f87171' },
  Paused:  { bg: '#6b728015', text: '#9ca3af', border: '#6b728030', dot: '#9ca3af' },
};

const KPI = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30`, color }}><Icon size={18}/></div>
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{label}</div>
      <div className="text-xl font-black text-white">{value}</div>
      {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
    </div>
  </div>
);

export default function PlatformWebhooks() {
  const [webhooks] = usePlatformData('apiWebhooks');
  const [q, setQ]  = useState('');
  const [statusF, setF] = useState('All');
  const { addToast } = useToast();


  const filtered = useMemo(() =>
    (webhooks||[]).filter(w =>
      (!q || w.tenant.toLowerCase().includes(q.toLowerCase()) || w.endpoint.toLowerCase().includes(q.toLowerCase())) &&
      (statusF === 'All' || w.status === statusF)
    ), [webhooks, q, statusF]);

  const active  = (webhooks||[]).filter(w=>w.status==='Active').length;
  const failing = (webhooks||[]).filter(w=>w.status==='Failing').length;
  const paused  = (webhooks||[]).filter(w=>w.status==='Paused').length;
  const totalDelivered = (webhooks||[]).reduce((s,w)=>s+(w.totalDelivered||0),0);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Link2 size={22} className="text-amber-400"/>Webhook Endpoints
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage all tenant webhook subscriptions and delivery status.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(filtered, `webhooks_${statusF}_${new Date().toISOString().slice(0,10)}.csv`, ['id','tenant','endpoint','status','deliveryRate','totalDelivered','failed','lastPing'])}
            className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold hover:border-gray-500 transition-colors">
            Export CSV
          </button>
          <button
            onClick={() => addToast('info', 'Coming Soon', 'Webhook registration form — coming in next release')}
            className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <Plus size={14}/>Add Webhook
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KPI label="Active Webhooks"  value={active}                          icon={CheckCircle2} color="#10b981"/>
        <KPI label="Failing"          value={failing}   sub="Needs attention" icon={AlertTriangle} color="#ef4444"/>
        <KPI label="Paused"           value={paused}                           icon={Pause}        color="#6b7280"/>
        <KPI label="Total Delivered"  value={totalDelivered.toLocaleString()} icon={Activity}     color="#3b82f6" sub="All time"/>
      </div>

      {/* Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[#21262d]">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by tenant or endpoint..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"/>
          </div>
          <div className="flex gap-1">
            {['All','Active','Failing','Paused'].map(s=>(
              <button key={s} onClick={()=>setF(s)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${statusF===s?'bg-amber-500 text-black':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto" style={{maxHeight:'500px'}}>
          <table className="w-full text-sm min-w-[700px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left">Endpoint URL</th>
                <th className="table-th text-left">Tenant</th>
                <th className="table-th text-left">Subscribed Events</th>
                <th className="table-th text-left">Delivery Rate</th>
                <th className="table-th text-left">Delivered</th>
                <th className="table-th text-left">Failed</th>
                <th className="table-th text-left">Last Ping</th>
                <th className="table-th text-left">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wh, i) => {
                const s = WH_STATUS[wh.status] || WH_STATUS.Paused;
                return (
                  <motion.tr key={wh.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors group ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-3">
                      <div className="font-mono text-xs text-white max-w-[220px] truncate">{wh.endpoint}</div>
                      <div className="text-[10px] text-blue-400 mt-0.5 font-mono">{wh.id}</div>
                    </td>
                    <td className="px-3 py-3 text-sm font-semibold text-gray-200">{wh.tenant}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {wh.events.map((e, j) => (
                          <span key={j} className="text-[9px] px-1.5 py-0.5 bg-[#21262d] text-gray-400 rounded font-mono border border-[#30363d]">{e}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-sm font-bold ${wh.deliveryRate==='100%'?'text-emerald-400':wh.deliveryRate==='—'?'text-gray-600':'text-amber-400'}`}>
                        {wh.deliveryRate}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-300">{(wh.totalDelivered||0).toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <span className={`text-sm font-bold ${wh.failed>0?'text-red-400':'text-gray-600'}`}>
                        {(wh.failed||0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">{wh.lastPing}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.dot}}/>{wh.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => addToast('info', 'Retry Scheduled', `Retrying failed deliveries for: ${wh.endpoint}`)}
                          className="p-1.5 bg-[#21262d] hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-400 rounded transition-colors" title="Retry failed">
                          <RefreshCw size={13}/>
                        </button>
                        <button
                          onClick={() => addToast('info', wh.status === 'Paused' ? 'Webhook Resumed' : 'Webhook Paused', `${wh.status === 'Paused' ? 'Resuming' : 'Pausing'} webhook: ${wh.endpoint}`)}
                          className="p-1.5 bg-[#21262d] hover:bg-amber-500/20 hover:text-amber-400 text-gray-400 rounded transition-colors" title="Pause/Resume">
                          <Pause size={13}/>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-2.5 border-t border-[#21262d] text-xs text-gray-500">
          Showing <b className="text-white">{filtered.length}</b> of <b className="text-white">{(webhooks||[]).length}</b> webhooks
          {failing > 0 && <span className="ml-3 text-red-400 font-bold">⚠ {failing} failing — action required</span>}
        </div>
      </div>
    </div>
  );
}
