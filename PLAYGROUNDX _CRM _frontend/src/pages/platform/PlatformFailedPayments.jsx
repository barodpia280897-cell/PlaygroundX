import { useState, useMemo } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { usePlatformData } from '../../contexts/DataContext';
import { AlertTriangle, Search, RotateCcw, Mail, DollarSign, RefreshCw } from 'lucide-react';
import { exportCSV } from '../../utils/csvExport';

const REASON_COLOR = {
  'Card Expired':      { bg: '#ef444415', text: '#f87171', border: '#ef444430' },
  'Insufficient Funds':{ bg: '#f59e0b15', text: '#fbbf24', border: '#f59e0b30' },
  'Card Declined':     { bg: '#ef444415', text: '#f87171', border: '#ef444430' },
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

export default function PlatformFailedPayments() {
  const [failed] = usePlatformData('failedPayments');
  const [q, setQ] = useState('');
  const { addToast } = useToast();

  const filtered = useMemo(() =>
    (failed||[]).filter(f =>
      !q || f.tenant.toLowerCase().includes(q.toLowerCase()) || f.id.toLowerCase().includes(q.toLowerCase())
    ), [failed, q]);

  const totalAmt    = (failed||[]).reduce((s,f) => s+f.amount, 0);
  const maxAttempts = (failed||[]).filter(f => f.attempts >= 3).length;

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <AlertTriangle size={22} className="text-red-400"/>Failed Payments
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">Transactions that failed — review and retry.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(filtered, `failed_payments_${new Date().toISOString().slice(0,10)}.csv`, ['id','tenant','amount','reason','method','attempts','date','nextRetry','contact'])}
            className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold hover:border-gray-500 transition-colors">
            Export CSV
          </button>
          <button
            onClick={() => addToast('info', 'Retry Queued', `Retry queued for all ${filtered.length} failed transaction(s).`)}
            className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
            <RefreshCw size={14}/>Retry All
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KPI label="Failed Transactions" value={(failed||[]).length}          icon={AlertTriangle} color="#ef4444"/>
        <KPI label="Total At Risk"        value={`$${totalAmt.toLocaleString()}`} icon={DollarSign}    color="#ec4899" sub="Unpaid amount"/>
        <KPI label="Max Attempts Reached" value={maxAttempts}                 icon={RotateCcw}    color="#f59e0b" sub="Needs manual action"/>
        <KPI label="Pending Retries"      value={(failed||[]).filter(f=>f.attempts<3).length} icon={RefreshCw} color="#3b82f6" sub="Will auto-retry"/>
      </div>

      {/* Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">

        {/* Toolbar */}
        <div className="flex gap-2 px-4 py-3 border-b border-[#21262d]">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by tenant or ID..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-red-500 focus:outline-none"/>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto" style={{maxHeight:'500px'}}>
          <table className="w-full text-sm min-w-[640px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left">ID</th>
                <th className="table-th text-left">Tenant</th>
                <th className="table-th text-left">Amount</th>
                <th className="table-th text-left">Reason</th>
                <th className="table-th text-left">Method</th>
                <th className="table-th text-left">Attempts</th>
                <th className="table-th text-left">Failed On</th>
                <th className="table-th text-left">Next Retry</th>
                <th className="table-th text-left">Contact</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fp, i) => {
                const rc = REASON_COLOR[fp.reason] || REASON_COLOR['Card Declined'];
                const atMax = fp.attempts >= 3;
                return (
                  <tr key={fp.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors group ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-3 font-mono text-red-400 text-xs font-semibold">{fp.id}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-white">{fp.tenant}</td>
                    <td className="px-3 py-3 text-sm font-bold text-pink-400">${fp.amount}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border"
                        style={{backgroundColor:rc.bg,color:rc.text,borderColor:rc.border}}>
                        {fp.reason}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-400">{fp.method}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${atMax?'bg-red-500/15 text-red-400 border-red-500/30':'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
                        {fp.attempts}x {atMax && '⚠ Max'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-400">{fp.date}</td>
                    <td className="px-3 py-3 text-xs text-gray-400">{fp.nextRetry}</td>
                    <td className="px-3 py-3 text-xs text-gray-400 font-mono">{fp.contact}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => addToast('info', 'Retry Queued', `Retry scheduled for ${fp.tenant} — ${fp.id}. Next attempt in 5 minutes.`)}
                          className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-bold rounded hover:bg-red-500/20 flex items-center gap-1 transition-colors">
                          <RotateCcw size={10}/>Retry
                        </button>
                        <button
                          onClick={() => addToast('info', 'Email Sent', `Payment failure notification sent to ${fp.contact}.`)}
                          className="p-1.5 bg-[#21262d] hover:bg-[#30363d] text-gray-400 hover:text-blue-400 rounded transition-colors" title="Email tenant">
                          <Mail size={12}/>
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
          <b className="text-white">{filtered.length}</b> failed transactions · Total at risk: <b className="text-pink-400">${totalAmt.toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
}
