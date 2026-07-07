import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, DollarSign, Activity, Server, AlertTriangle, ShieldCheck, 
  Users, Crown, Headset, CheckCircle, Clock, MapPin, Search, Plus,
  CreditCard, Globe, LifeBuoy, BarChart2, Settings, Megaphone
} from 'lucide-react';
import { usePlatformData } from '../contexts/DataContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '../contexts/ToastContext';
const KPICard = ({ title, value, subtitle, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4 shadow-lg flex items-center justify-between group hover:border-gray-700 transition-colors relative overflow-hidden">
    <div className={`absolute -right-4 -top-4 w-16 h-16 bg-${color}/10 rounded-full blur-xl group-hover:bg-${color}/20 transition-colors`} />
    <div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</div>
      <div className="text-2xl font-black text-white mt-1">{value}</div>
      {subtitle && <div className={`text-[10px] mt-1 font-bold ${subtitle.includes('+') ? 'text-neon-green' : subtitle.includes('-') ? 'text-red-500' : 'text-gray-500'}`}>{subtitle}</div>}
    </div>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}/10 border border-${color}/20 text-${color}`}>
      <Icon size={20} />
    </div>
  </motion.div>
);

export default function PlatformDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [tenants] = usePlatformData('tenants');
  const [revenueData] = usePlatformData('platformRevenue');
  const [health] = usePlatformData('platformHealth');
  const [tiers] = usePlatformData('subscriptionTiers');
  const [logs] = usePlatformData('auditLogs');
  const [failedPayments] = usePlatformData('failedPayments');
  const [supportTickets] = usePlatformData('supportTickets');
  const [funnel] = usePlatformData('conversionFunnel');
  const [regions] = usePlatformData('topRegions');
  const [summary] = usePlatformData('todaySummary');
  const [enterprisePipe] = usePlatformData('enterprisePipeline');
  const [smbPipe] = usePlatformData('smbPipeline');
  const [infra] = usePlatformData('infrastructureHealth');

  const totalMrr = revenueData?.totalMrr?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) || '$0';
  
  return (
    <div className="h-full flex flex-col overflow-y-auto custom-scrollbar pr-2 pb-6 bg-[#050505]">
      
      {/* Top Navigation / Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 bg-[#050505] py-4 border-b border-gray-900/50">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Server size={16} className="text-white" />
            </div>
            PGX Operations Center
          </h1>
          <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">Global Command & Control</div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px] max-w-xs sm:flex-initial">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search tenants, tickets..." 
              className="bg-gray-900/50 border border-gray-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-neon-blue w-full sm:w-48 md:w-64 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
            <Clock size={12} className="text-gray-500" />
            <span>Tuesday, Jun 30, 2026</span>
          </div>
        </div>
      </div>

      {/* Row 1: Mega KPIs */}
      <div className="kpi-grid-auto mb-4">
        <KPICard title="New Tenants Today" value="14" subtitle="+18.6% vs yesterday" icon={Users} color="neon-purple" delay={0.1} />
        <KPICard title="Active Tenants" value={health?.activeTenants || 0} subtitle="+16.4%" icon={Building2} color="neon-blue" delay={0.15} />
        <KPICard title="Global MRR" value={totalMrr} subtitle="+20.1%" icon={DollarSign} color="neon-pink" delay={0.2} />
        <KPICard title="Server Uptime" value={health?.serverUptime || '100%'} subtitle="+19.3%" icon={Activity} color="orange-500" delay={0.25} />
        <KPICard title="Enterprise Deals" value="18" subtitle="+15.7%" icon={Crown} color="yellow-500" delay={0.3} />
        <KPICard title="Support Alerts" value={health?.supportTickets || 0} subtitle="-8.2%" icon={Headset} color="red-500" delay={0.35} />
      </div>

      {/* Row 2: Charts and Funnels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
        
        {/* Tier Distribution */}
        <div className="col-span-1 lg:col-span-3 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4 flex flex-col">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Subscription Distribution</div>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={tiers || []} innerRadius={45} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                  {(tiers || []).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-white">{health?.activeTenants}</span>
              <span className="text-[8px] text-gray-500 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(tiers || []).map((tier, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tier.color }} />
                <span className="text-gray-300">{tier.name}</span>
                <span className="text-white font-bold ml-auto">{tier.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="col-span-1 lg:col-span-6 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4 flex flex-col min-w-0">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Platform Conversion Funnel</div>
          <div className="flex-1 w-full overflow-x-auto custom-scrollbar pb-2">
            <div className="flex items-center justify-between px-2 min-w-[500px] py-1">
              {(funnel || []).map((stage, i) => {
                const colors = [
                  { from: 'from-blue-600', to: 'to-cyan-400', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]', text: 'text-cyan-400', border: 'border-cyan-500/50' },
                  { from: 'from-purple-600', to: 'to-pink-500', shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]', text: 'text-pink-400', border: 'border-pink-500/50' },
                  { from: 'from-yellow-600', to: 'to-orange-500', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]', text: 'text-orange-400', border: 'border-orange-500/50' },
                  { from: 'from-emerald-600', to: 'to-green-400', shadow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]', text: 'text-green-400', border: 'border-green-500/50' },
                  { from: 'from-rose-600', to: 'to-red-500', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]', text: 'text-rose-400', border: 'border-rose-500/50' },
                ];
                const c = colors[i % colors.length];

                return (
                  <Fragment key={i}>
                    <div className="flex flex-col items-center text-center group shrink-0 transform transition-transform hover:-translate-y-1">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.from} ${c.to} ${c.shadow} flex items-center justify-center mb-3 transition-all relative overflow-hidden group-hover:scale-110`}>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Users size={24} className="text-white drop-shadow-md" />
                      </div>
                      <div className={`text-[11px] font-black uppercase tracking-widest ${c.text}`}>{stage.stage}</div>
                      <div className="text-2xl font-black text-white my-1 drop-shadow-sm">{stage.count}</div>
                      <div className="text-[10px] font-bold text-gray-400 bg-gray-900/50 px-2 py-0.5 rounded-full border border-gray-700/50">{stage.rate}</div>
                    </div>
                    {i < (funnel?.length || 0) - 1 && (
                      <div className="flex-1 h-[3px] bg-gradient-to-r from-gray-800 to-gray-700 mx-3 relative top-[-15px] min-w-[20px] rounded-full overflow-visible group">
                        <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border-t-3 border-r-3 ${colors[i+1]?.border || 'border-gray-500'} rotate-45 transform translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.1)]`} style={{ borderWidth: '3px 3px 0 0' }} />
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Infra Performance */}
        <div className="col-span-1 lg:col-span-3 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4 relative overflow-hidden group flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-bl-[100px] -z-10" />
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4 flex justify-between">
            <span>Infra Performance (Today)</span>
            <Activity size={12} className="text-neon-blue" />
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative my-2">
             <div className="w-24 h-24 rounded-full border-4 border-gray-800 flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                <div className="absolute inset-0 border-4 border-neon-blue rounded-full border-t-transparent border-l-transparent -rotate-45" />
                <Server size={32} className="text-neon-blue" />
             </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div className="text-[9px] text-gray-500">API Queries</div>
              <div className="text-sm font-bold text-white">{infra?.queries}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">Uptime</div>
              <div className="text-sm font-bold text-neon-green">{infra?.uptime}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">Errors</div>
              <div className="text-sm font-bold text-red-500">{infra?.errors}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">Success Rate</div>
              <div className="text-sm font-bold text-neon-blue">{infra?.successRate}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Pipelines and Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        
        {/* Enterprise Pipeline */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-neon-purple font-bold uppercase tracking-widest">Enterprise Pipeline</div>
            <button className="text-[9px] text-gray-400 hover:text-white transition-colors">View Pipeline &rarr;</button>
          </div>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center relative">
               <div className="absolute inset-0 border-4 border-neon-purple rounded-full border-t-transparent -rotate-12" />
               <span className="text-sm font-bold text-white">58%</span>
             </div>
             <div className="text-[9px] text-gray-500">Overall Win Rate</div>
          </div>
          <div className="space-y-2">
            {(enterprisePipe || []).map((stage, i) => (
              <div key={i} className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center text-[8px] text-gray-400">{i+1}</span>
                  <span className="text-gray-300">{stage.stage}</span>
                </div>
                <span className="text-white font-bold">{stage.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SMB Pipeline */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-neon-pink font-bold uppercase tracking-widest">SMB Pipeline</div>
            <button className="text-[9px] text-gray-400 hover:text-white transition-colors">View Pipeline &rarr;</button>
          </div>
          <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-full border-4 border-gray-800 flex items-center justify-center relative">
               <div className="absolute inset-0 border-4 border-neon-pink rounded-full border-r-transparent rotate-45" />
               <span className="text-sm font-bold text-white">37%</span>
             </div>
             <div className="text-[9px] text-gray-500">Overall Win Rate</div>
          </div>
          <div className="space-y-2">
            {(smbPipe || []).map((stage, i) => (
              <div key={i} className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center text-[8px] text-gray-400">{i+1}</span>
                  <span className="text-gray-300">{stage.stage}</span>
                </div>
                <span className="text-white font-bold">{stage.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Alerts</div>
            <button className="text-[9px] text-neon-blue hover:underline">View All &rarr;</button>
          </div>
          <div className="space-y-3">
            {/* Mock Alerts blending failed payments and tickets */}
            <div className="flex items-start gap-3">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-white">Payment Failed ($450)</div>
                <div className="text-[9px] text-gray-400">ABC Travels</div>
              </div>
              <div className="text-[9px] text-gray-500">2m ago</div>
            </div>
            
            <div className="flex items-start gap-3">
              <Headset size={14} className="text-yellow-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-white">API Rate Limit Hit</div>
                <div className="text-[9px] text-gray-400">Acme Digital Ltd.</div>
              </div>
              <div className="text-[9px] text-gray-500">5m ago</div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={14} className="text-orange-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-white">Suspicious Login</div>
                <div className="text-[9px] text-gray-400">System Admin • IP Flagged</div>
              </div>
              <div className="text-[9px] text-gray-500">8m ago</div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] font-bold text-white">Webhook Delivery Failed</div>
                <div className="text-[9px] text-gray-400">XYZ Creators</div>
              </div>
              <div className="text-[9px] text-gray-500">12m ago</div>
            </div>
          </div>
        </div>

        {/* Global Tasks */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
           <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Platform Tasks (7)</div>
            <button className="text-[9px] text-neon-blue hover:underline">View All &rarr;</button>
          </div>
          <div className="space-y-3">
            {[
              { t: 'Review Enterprise SLA Upgrade', by: 'Sarah Mitchell', due: 'Due in 5m' },
              { t: 'Approve manual invoice', by: 'Finance Team', due: 'Due in 15m' },
              { t: 'System Patch Deployment', by: 'DevOps', due: 'Due in 30m' },
              { t: 'Follow up payment failure', by: 'ABC Travels', due: 'Due in 45m' }
            ].map((task, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-3 h-3 rounded border border-gray-600 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[10px] text-white font-bold">{task.t}</div>
                  <div className="text-[9px] text-gray-500">{task.by}</div>
                </div>
                <div className="text-[8px] text-red-500 font-bold">{task.due}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 4: Activity, Regions, Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Live Activity Feed */}
        <div className="col-span-1 lg:col-span-4 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Live Audit Stream</div>
            <button className="text-[9px] text-neon-blue hover:underline">View All &rarr;</button>
          </div>
          <div className="space-y-4">
            {(logs || []).map((log, i) => (
              <div key={i} className="flex gap-3">
                <ShieldCheck size={14} className="text-neon-blue mt-0.5" />
                <div className="flex-1">
                  <div className="text-[10px] text-gray-300">{log.action} for <span className="text-white font-bold">{log.tenant}</span></div>
                </div>
                <div className="text-[9px] text-gray-500">10:{42-i} AM</div>
              </div>
            ))}
            <div className="flex gap-3">
              <Plus size={14} className="text-neon-green mt-0.5" />
              <div className="flex-1">
                <div className="text-[10px] text-gray-300">New Tenant Provisioned: <span className="text-white font-bold">Zenith Corp</span></div>
              </div>
              <div className="text-[9px] text-gray-500">10:38 AM</div>
            </div>
            <div className="flex gap-3">
              <Server size={14} className="text-neon-purple mt-0.5" />
              <div className="flex-1">
                <div className="text-[10px] text-gray-300">API Keys rotated for <span className="text-white font-bold">XYZ Creators</span></div>
              </div>
              <div className="text-[9px] text-gray-500">10:37 AM</div>
            </div>
          </div>
        </div>

        {/* Top Regions */}
        <div className="col-span-1 lg:col-span-4 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Top Regions</div>
          <div className="space-y-4">
            {(regions || []).map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-300 flex items-center gap-1"><MapPin size={10} className="text-neon-blue"/> {r.name}</span>
                  <span className="text-gray-500">{r.percentage} ({r.value})</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1">
                  <div className="bg-neon-blue h-1 rounded-full" style={{ width: r.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        <div className="col-span-1 lg:col-span-4 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-4">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Today's Summary</div>
          <div className="space-y-1">
            {(summary || []).map((s, i) => (
              <div key={i} className="flex justify-between items-center p-2 hover:bg-white/5 rounded transition-colors">
                <span className="text-[10px] text-gray-400">{s.label}</span>
                <span className="text-xs font-black text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
