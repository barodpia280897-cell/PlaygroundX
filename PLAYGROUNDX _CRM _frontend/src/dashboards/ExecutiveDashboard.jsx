import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Crown, Activity, Target, Download, FileText, Calendar, PlusCircle, ArrowUpRight, UserPlus, Wallet, Megaphone, Zap, Star, BarChart2, Radio } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import QuickAccessPanel from '../components/dashboard/QuickAccessPanel';
import { exportCSV } from '../utils/csvExport';
import { getAppPath } from '../utils/routing';
import TeamBroadcastModal from '../components/modals/TeamBroadcastModal';

const KPICard = ({ title, value, change, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110`} />
    <div className="flex justify-between items-start mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}/10 border border-${color}/20 text-${color}`}>
        <Icon size={20} />
      </div>
      {change && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded bg-gray-800 border ${change.includes('+') ? 'text-neon-green border-neon-green/30' : 'text-red-500 border-red-500/30'}`}>
          {change}
        </span>
      )}
    </div>
    <div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</div>
      <div className="text-2xl font-black text-white mt-1">{value}</div>
    </div>
  </motion.div>
);

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [leads] = useDataStore('leads');
  const [revenueByMonth] = useDataStore('revenueByMonth');
  const [agents] = useDataStore('agents');

  // Derive Metrics
  const metrics = useMemo(() => {
    const totalRevenue = revenueByMonth?.reduce((sum, r) => sum + r.revenue, 0) || 0;
    const currentMonthRevenue = revenueByMonth?.[revenueByMonth.length - 1]?.revenue || 0;
    
    const pipelineValue = leads?.filter(l => l.status !== 'Won' && l.status !== 'Lost')
      .reduce((sum, l) => sum + (parseInt(l.value?.replace(/[^0-9]/g, '') || 0)), 0) || 0;
      
    const activeCustomers = leads?.filter(l => l.status === 'Won').length || 0;
    const vipCustomers = leads?.filter(l => l.tags?.includes('VIP')).length || 0;
    
    // Funnel Data
    const funnelCounts = leads?.reduce((acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1;
      return acc;
    }, {});
    
    const funnelData = [
      { name: 'New', value: funnelCounts?.['New'] || 0 },
      { name: 'Contacted', value: funnelCounts?.['Contacted'] || 0 },
      { name: 'Qualified', value: funnelCounts?.['Qualified'] || 0 },
      { name: 'Proposal', value: funnelCounts?.['Proposal'] || 0 },
      { name: 'Won', value: funnelCounts?.['Won'] || 0 },
    ];
    
    // Dept Performance
    const deptPerf = agents?.reduce((acc, a) => {
      if (!acc[a.department]) acc[a.department] = { sum: 0, count: 0 };
      acc[a.department].sum += a.performanceScore || 0;
      acc[a.department].count += 1;
      return acc;
    }, {});
    
    const departmentData = Object.keys(deptPerf || {}).map(dept => ({
      name: dept,
      score: Math.round(deptPerf[dept].sum / deptPerf[dept].count)
    }));

    return { totalRevenue, currentMonthRevenue, pipelineValue, activeCustomers, vipCustomers, funnelData, departmentData };
  }, [leads, revenueByMonth, agents]);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center">
              <Crown size={16} className="text-yellow-500" />
            </div>
            CEO Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">High-level business performance, revenue growth, and pipeline tracking.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportCSV(leads || [], 'leads_report.csv')}
            className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2 whitespace-nowrap">
            <Download size={16} /> Export Report
          </button>
          <button
            onClick={() => navigate(getAppPath('/campaigns'))}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-sm font-black transition-colors flex items-center gap-2 whitespace-nowrap">
            <PlusCircle size={16} /> New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid-auto">
        <KPICard title="Revenue (MTD)" value={`$${metrics.currentMonthRevenue.toLocaleString()}`} change="+12.5%" icon={DollarSign} color="yellow-500" delay={0.05} />
        <KPICard title="Pipeline Value" value={`$${metrics.pipelineValue.toLocaleString()}`} change="+5.2%" icon={Activity} color="neon-blue" delay={0.1} />
        <KPICard title="Active Customers" value={metrics.activeCustomers} change="+18" icon={Users} color="neon-green" delay={0.15} />
        <KPICard title="VIP Clients" value={metrics.vipCustomers} change="+3" icon={Crown} color="neon-purple" delay={0.2} />
        <KPICard title="Overall Conversion" value="14.2%" change="+1.5%" icon={TrendingUp} color="neon-pink" delay={0.25} />
        <KPICard title="Target Hit" value="92%" change="+4%" icon={Target} color="neon-blue" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-white">Revenue Trend</h2>
            <select className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-500">
              <option>Last 6 Months</option>
              <option>YTD</option>
            </select>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#eab308', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorYellow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Funnel */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 flex flex-col">
          <h2 className="font-bold text-white mb-6">Sales Funnel</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.funnelData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0c10', border: '1px solid #1e293b', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#00f0ff" radius={[0, 4, 4, 0]}>
                  {metrics.funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#eab308', '#3b82f6', '#8b5cf6', '#ec4899', '#22c55e'][index % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Performance */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 flex flex-col">
          <h2 className="font-bold text-white mb-6">Department Avg. Score</h2>
          <div className="flex-1 space-y-4">
            {metrics.departmentData.map(dept => (
              <div key={dept.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300 font-bold">{dept.name}</span>
                  <span className="text-neon-green">{dept.score}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-neon-green h-1.5 rounded-full" style={{ width: `${dept.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Widgets */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* VIP Snapshot */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><ArrowUpRight size={16} className="text-neon-pink" /> VIP Snapshot</h2>
            <div className="space-y-3">
              {leads?.filter(l => l.tags?.includes('VIP')).slice(0,3).map(vip => (
                <div key={vip.id} className="flex justify-between items-center p-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple font-bold">{vip.name.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-bold text-white">{vip.name}</div>
                      <div className="text-[10px] text-gray-400">{vip.value} Value</div>
                    </div>
                  </div>
                  <button onClick={() => navigate(getAppPath('/leads'))} className="px-2 py-1 text-[10px] font-bold bg-gray-950 border border-gray-700 rounded hover:border-gray-500 text-gray-300 transition-colors">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
            <div className="text-[10px] text-neon-blue font-bold uppercase tracking-wider mb-2">AI Insight</div>
            <p className="text-xs text-gray-300">Q3 projections show a potential 12% revenue increase if Creator Onboarding SLA improves by 10%.</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <QuickAccessPanel title="CEO Quick Access" cards={[
        // { icon: Radio,      title: 'Team Broadcast',     description: 'Send bulk announcements, messages & emails to teams', color: '#f59e0b', onClick: () => setShowBroadcast(true) },
        { icon: UserPlus,   title: 'Add Employee',       description: 'Onboard a new team member',             color: '#3b82f6', onClick: () => navigate(getAppPath('/agents')) },
        { icon: Users,      title: 'Add Lead',           description: 'Create a new lead in the CRM',          color: '#10b981', onClick: () => navigate(getAppPath('/leads')) },
        { icon: FileText,   title: 'Revenue Report',     description: 'Export current month revenue data',      color: '#f59e0b', onClick: () => exportCSV(revenueByMonth||[], 'revenue_report.csv') },
        { icon: Wallet,     title: 'Wallet & Transactions',description: 'View billing and payments',            color: '#ec4899', onClick: () => navigate(getAppPath('/wallet')) },
        { icon: Megaphone,  title: 'Create Campaign',    description: 'Launch a new marketing campaign',        color: '#8a2be2', onClick: () => navigate(getAppPath('/campaigns')) },
        { icon: Zap,        title: 'AI Center',          description: 'AI insights, assistants, and analytics', color: '#00f0ff', onClick: () => navigate(getAppPath('/ai')) },
        { icon: Star,       title: 'VIP Center',         description: 'View and manage VIP client accounts',    color: '#ffd700', onClick: () => navigate(getAppPath('/vip')) },
        { icon: BarChart2,  title: 'Executive Reports',  description: 'Download board-ready business reports',  color: '#f97316', onClick: () => navigate(getAppPath('/reports')) },
      ]} />

      {/* Team Broadcast Modal for Bulk Msg & Email */}
      <TeamBroadcastModal open={showBroadcast} onClose={() => setShowBroadcast(false)} />
    </div>
  );
}
