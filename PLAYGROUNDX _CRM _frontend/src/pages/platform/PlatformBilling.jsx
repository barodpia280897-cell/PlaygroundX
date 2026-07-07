import { usePlatformData } from '../../contexts/DataContext';
import { CreditCard, DollarSign, AlertTriangle, TrendingUp, Download, Search, RotateCcw } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportCSV } from '../../utils/csvExport';

const STATUS_STYLE = {
  Paid:    { bg: '#10b98115', text: '#34d399', border: '#10b98130', dot: '#34d399' },
  Pending: { bg: '#f59e0b15', text: '#fbbf24', border: '#f59e0b30', dot: '#fbbf24' },
  Overdue: { bg: '#ef444415', text: '#f87171', border: '#ef444430', dot: '#f87171' },
};

const PAYMENT_METHODS = [
  { name:'Credit Card',   value:62, color:'#8a2be2' },
  { name:'Bank Transfer', value:24, color:'#3b82f6' },
  { name:'PayPal',        value:10, color:'#f59e0b' },
  { name:'Other',         value:4,  color:'#475569' },
];

const KPI = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor:`${color}15`, border:`1px solid ${color}30`, color }}><Icon size={18}/></div>
    <div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{label}</div>
      <div className="text-xl font-black text-white">{value}</div>
      {sub && <div className="text-[10px] text-gray-500">{sub}</div>}
    </div>
  </div>
);

export default function PlatformBilling() {
  const [invoices] = usePlatformData('billingInvoices');
  const [revenue]  = usePlatformData('platformRevenue');

  const paid    = (invoices||[]).filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0);
  const pending = (invoices||[]).filter(i=>i.status==='Pending').reduce((s,i)=>s+i.amount,0);
  const overdue = (invoices||[]).filter(i=>i.status==='Overdue').reduce((s,i)=>s+i.amount,0);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3"><CreditCard size={22} className="text-pink-400"/>Billing Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Revenue summary and subscription plan breakdown.</p>
        </div>
        <button
          onClick={() => exportCSV(invoices||[], `billing_invoices_${new Date().toISOString().slice(0,10)}.csv`, ['id','tenant','plan','date','amount','status'])}
          className="px-4 py-2 bg-[#161b22] border border-[#30363d] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:border-gray-500 transition-colors">
          <Download size={14}/>Export CSV
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 shrink-0">
        <KPI label="MRR"       value={`$${((revenue?.totalMrr)||72200).toLocaleString()}`}  icon={DollarSign}    color="#10b981" sub="Monthly Recurring"/>
        <KPI label="ARR"       value={`$${((revenue?.totalArr)||866400).toLocaleString()}`} icon={TrendingUp}    color="#3b82f6" sub="Annual Recurring"/>
        <KPI label="Collected" value={`$${paid.toLocaleString()}`}                          icon={CreditCard}    color="#8a2be2" sub="This billing cycle"/>
        <KPI label="Pending"   value={`$${pending.toLocaleString()}`}                       icon={AlertTriangle} color="#f59e0b" sub="Awaiting payment"/>
        <KPI label="Overdue"   value={`$${overdue.toLocaleString()}`}                       icon={AlertTriangle} color="#ef4444" sub="Past due"/>
        <KPI label="Growth"    value={revenue?.growth||'+18.4%'}                            icon={TrendingUp}    color="#ec4899" sub="vs last month"/>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <div className="lg:col-span-2 bg-[#0d1117] border border-[#21262d] rounded-xl p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Revenue Trend (6 Months)</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue?.history||[]}>
                <defs>
                  <linearGradient id="rvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false}/>
                <XAxis dataKey="month" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                <Tooltip contentStyle={{backgroundColor:'#161b22',border:'1px solid #21262d',borderRadius:'8px',fontSize:11}} formatter={v=>`$${v.toLocaleString()}`}/>
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#rvGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#0d1117] border border-[#21262d] rounded-xl p-4 flex flex-col">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Methods</div>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-24 h-24 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={PAYMENT_METHODS} innerRadius={28} outerRadius={44} paddingAngle={3} dataKey="value" stroke="none">
                  {PAYMENT_METHODS.map((m,i)=><Cell key={i} fill={m.color}/>)}
                </Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {PAYMENT_METHODS.map((m,i)=>(
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{backgroundColor:m.color}}/><span className="text-gray-400">{m.name}</span></div>
                  <span className="text-white font-bold">{m.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices table — quick view, full list via Invoices sidebar */}
      <div className="bg-[#0d1117] border border-[#21262d] rounded-xl flex flex-col shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#21262d]">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Invoices</span>
          <a href="/platform/invoices" className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">View All →</a>
        </div>
        <div className="overflow-auto" style={{maxHeight:'320px'}}>
          <table className="w-full text-sm min-w-[560px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#161b22] border-b border-[#30363d]">
                <th className="table-th text-left">Invoice</th>
                <th className="table-th text-left">Tenant</th>
                <th className="table-th text-left">Date</th>
                <th className="table-th text-left">Amount</th>
                <th className="table-th text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(invoices||[]).slice(0,6).map((inv,i) => {
                const s = STATUS_STYLE[inv.status]||STATUS_STYLE.Pending;
                return (
                  <tr key={inv.id} className={`border-b border-[#21262d] hover:bg-[#161b22] transition-colors ${i%2!==0?'bg-[#0b0f14]':''}`}>
                    <td className="px-4 py-2.5 font-mono text-blue-400 text-xs font-semibold">{inv.id}</td>
                    <td className="px-3 py-2.5 text-sm font-semibold text-white">{inv.tenant}</td>
                    <td className="px-3 py-2.5 text-xs text-gray-400">{inv.date}</td>
                    <td className="px-3 py-2.5 text-sm font-bold text-emerald-400">${inv.amount.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                        style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:s.dot}}/>{inv.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
