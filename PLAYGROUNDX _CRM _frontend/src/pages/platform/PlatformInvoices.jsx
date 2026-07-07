import { useState, useMemo } from 'react';
import { usePlatformData } from '../../contexts/DataContext';
import { FileText, Search, Download, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { exportCSV } from '../../utils/csvExport';

const STATUS_STYLE = {
  Paid:    { bg: '#10b98115', text: '#34d399', border: '#10b98130', dot: '#34d399' },
  Pending: { bg: '#f59e0b15', text: '#fbbf24', border: '#f59e0b30', dot: '#fbbf24' },
  Overdue: { bg: '#ef444415', text: '#f87171', border: '#ef444430', dot: '#f87171' },
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

export default function PlatformInvoices() {
  const [invoices] = usePlatformData('billingInvoices');
  const [q, setQ] = useState('');
  const [statusF, setF] = useState('All');

  const filtered = useMemo(() =>
    (invoices||[]).filter(i =>
      (!q || i.tenant.toLowerCase().includes(q.toLowerCase()) || i.id.toLowerCase().includes(q.toLowerCase())) &&
      (statusF==='All' || i.status===statusF)
    ), [invoices, q, statusF]);

  const paid    = (invoices||[]).filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0);
  const pending = (invoices||[]).filter(i=>i.status==='Pending').reduce((s,i)=>s+i.amount,0);
  const overdue = (invoices||[]).filter(i=>i.status==='Overdue').reduce((s,i)=>s+i.amount,0);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3"><FileText size={22} className="text-blue-400"/>Invoices</h1>
          <p className="text-sm text-gray-400 mt-0.5">All billing invoices across tenants.</p>
        </div>
        <button
          onClick={() => exportCSV(filtered, `invoices_${statusF}_${new Date().toISOString().slice(0,10)}.csv`, ['id','tenant','plan','date','dueDate','amount','method','status'])}
          className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:border-gray-500 transition-colors">
          <Download size={14}/>Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        <KPI label="Total Invoices" value={(invoices||[]).length} icon={FileText}     color="#3b82f6"/>
        <KPI label="Collected"      value={`$${paid.toLocaleString()}`}   icon={DollarSign}  color="#10b981" sub="Paid this cycle"/>
        <KPI label="Pending"        value={`$${pending.toLocaleString()}`} icon={Clock}      color="#f59e0b" sub="Awaiting payment"/>
        <KPI label="Overdue"        value={`$${overdue.toLocaleString()}`} icon={AlertTriangle} color="#ef4444" sub="Past due date"/>
      </div>

      {/* Table */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-[#21262d]">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by tenant or invoice ID..."
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"/>
          </div>
          <div className="flex gap-1">
            {['All','Paid','Pending','Overdue'].map(s=>(
              <button key={s} onClick={()=>setF(s)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors ${statusF===s?'bg-blue-500 text-white':'bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto" style={{maxHeight:'500px'}}>
          <table className="w-full text-sm min-w-[600px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left">Invoice ID</th>
                <th className="table-th text-left">Tenant</th>
                <th className="table-th text-left">Plan</th>
                <th className="table-th text-left">Invoice Date</th>
                <th className="table-th text-left">Due Date</th>
                <th className="table-th text-left">Amount</th>
                <th className="table-th text-left">Method</th>
                <th className="table-th text-left">Status</th>
                <th className="table-th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv, i) => {
                const s = STATUS_STYLE[inv.status] || STATUS_STYLE.Pending;
                return (
                  <tr key={inv.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors group ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-3 font-mono text-blue-400 text-xs font-semibold">{inv.id}</td>
                    <td className="px-3 py-3 text-sm font-semibold text-white">{inv.tenant}</td>
                    <td className="px-3 py-3 text-xs text-gray-400">{inv.plan}</td>
                    <td className="px-3 py-3 text-xs text-gray-400">{inv.date}</td>
                    <td className="px-3 py-3 text-xs text-gray-400">{inv.dueDate}</td>
                    <td className="px-3 py-3 text-sm font-bold text-emerald-400">${inv.amount.toLocaleString()}</td>
                    <td className="px-3 py-3 text-xs text-gray-400">{inv.method}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.dot}}/>{inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => exportCSV([inv], `invoice_${inv.id}.csv`)}
                        className="p-1.5 bg-[#21262d] hover:bg-[#30363d] text-gray-400 rounded opacity-0 group-hover:opacity-100 transition-all" title="Download invoice">
                        <Download size={13}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-[#21262d] text-xs text-gray-500">
          Showing <b className="text-white">{filtered.length}</b> of <b className="text-white">{(invoices||[]).length}</b> invoices
        </div>
      </div>
    </div>
  );
}
