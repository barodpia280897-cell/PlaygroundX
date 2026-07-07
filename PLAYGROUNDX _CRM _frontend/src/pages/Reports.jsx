import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, Users, UserPlus, Heart, MessageSquare, DollarSign, CheckSquare, Percent, Eye, MoreVertical, Calendar, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f111a] border border-gray-700 rounded-xl p-3 shadow-xl z-50">
      <p className="text-[10px] font-bold text-gray-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] font-bold flex items-center gap-2" style={{ color: p.color }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}: {p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

// --- MOCK DATA ---
const performanceData = [
  { date: 'May 14', leads: 400, creators: 120, fans: 200, conversations: 800 },
  { date: 'May 15', leads: 450, creators: 130, fans: 250, conversations: 950 },
  { date: 'May 16', leads: 500, creators: 140, fans: 280, conversations: 1100 },
  { date: 'May 17', leads: 550, creators: 145, fans: 300, conversations: 1200 },
  { date: 'May 18', leads: 600, creators: 155, fans: 350, conversations: 1350 },
  { date: 'May 19', leads: 700, creators: 170, fans: 400, conversations: 1500 },
  { date: 'May 20', leads: 850, creators: 190, fans: 500, conversations: 1800 },
];

const sourcesData = [
  { name: 'Website', value: 723, pct: '35.2%', color: '#3b82f6' },
  { name: 'Instagram', value: 495, pct: '24.1%', color: '#ec4899' },
  { name: 'TikTok', value: 384, pct: '18.7%', color: '#00f0ff' },
  { name: 'Referral', value: 259, pct: '12.6%', color: '#f59e0b' },
  { name: 'YouTube', value: 111, pct: '5.4%', color: '#ef4444' },
  { name: 'Others', value: 82, pct: '4.0%', color: '#8b5cf6' },
];

const leadsGrowthData = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${21 + i > 30 ? (21 + i - 30) : 21 + i}`,
  val: Math.floor(Math.random() * 500) + 100 + (i * 10)
}));

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${21 + i > 30 ? (21 + i - 30) : 21 + i}`,
  revenue: Math.floor(Math.random() * 5000) + 10000 + (i * 500)
}));

const topAgents = [
  { name: 'Mike Agent', avatar: 'https://i.pravatar.cc/150?img=11', convos: 350, leads: 128, rate: '22.1%' },
  { name: 'Sarah Agent', avatar: 'https://i.pravatar.cc/150?img=5', convos: 298, leads: 112, rate: '20.4%' },
  { name: 'Emma Agent', avatar: 'https://i.pravatar.cc/150?img=9', convos: 245, leads: 98, rate: '18.9%' },
  { name: 'Omar Agent', avatar: 'https://i.pravatar.cc/150?img=12', convos: 212, leads: 76, rate: '16.2%' },
  { name: 'Lily Agent', avatar: 'https://i.pravatar.cc/150?img=16', convos: 178, leads: 62, rate: '14.8%' },
];

const conversationsOverview = [
  { channel: 'WhatsApp', value: 924, pct: '49.6%', color: '#39ff14' },
  { channel: 'Instagram', value: 523, pct: '28.1%', color: '#ec4899' },
  { channel: 'Email', value: 218, pct: '11.7%', color: '#3b82f6' },
  { channel: 'Web Chat', value: 142, pct: '7.6%', color: '#00f0ff' },
  { channel: 'SMS', value: 58, pct: '3.1%', color: '#8b5cf6' },
];

const revenueByPipeline = [
  { name: 'Creator Pipeline', value: '$22,450', pct: 46.6, color: '#00f0ff' },
  { name: 'Fan Pipeline', value: '$15,230', pct: 31.6, color: '#8a2be2' },
  { name: 'VIP Pipeline', value: '$7,850', pct: 16.3, color: '#39ff14' },
  { name: 'Other Pipeline', value: '$2,720', pct: 5.6, color: '#f59e0b' },
];

const recentReports = [
  { name: 'Leads Performance Report', type: 'Leads', range: 'May 14 - May 20, 2025', genBy: 'Sarah Agent', avatar: 'https://i.pravatar.cc/150?img=5', genOn: 'May 20, 2025 10:30 AM' },
  { name: 'Creators Summary Report', type: 'Creators', range: 'May 1 - May 20, 2025', genBy: 'Mike Agent', avatar: 'https://i.pravatar.cc/150?img=11', genOn: 'May 20, 2025 09:15 AM' },
  { name: 'Revenue Analysis Report', type: 'Revenue', range: 'Apr 21 - May 20, 2025', genBy: 'Emma Agent', avatar: 'https://i.pravatar.cc/150?img=9', genOn: 'May 20, 2025 08:45 AM' },
  { name: 'Agent Performance Report', type: 'Agents', range: 'May 14 - May 20, 2025', genBy: 'Sarah Agent', avatar: 'https://i.pravatar.cc/150?img=5', genOn: 'May 20, 2025 08:30 AM' },
];

const scheduledReports = [
  { name: 'Weekly Performance Report', freq: 'Every Monday at 9:00 AM', active: true },
  { name: 'Leads Summary Report', freq: 'Every Wednesday at 10:00 AM', active: true },
  { name: 'Revenue Report', freq: 'Every Friday at 9:30 AM', active: true },
  { name: 'Agent Activity Report', freq: 'Every Sunday at 8:00 PM', active: false },
];


export default function Reports() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [schedules, setSchedules] = useState(scheduledReports);
  const { addToast } = useToast();

  const tabs = ['Overview', 'Leads', 'Creators', 'Fans', 'Conversations', 'Pipelines', 'Tasks', 'Agents', 'AI Center', 'Custom Reports'];

  return (
    <div className="space-y-4 pb-10">
      {/* Reusable Report Explanatory Banner & Interactive Filters */}
      <ReportHeaderBanner
        title="Standard Operations & Channel Report"
        subtitle="Track daily performance, inbound lead volume, and agent output across channels"
        measures="Measures new lead volume, conversation response times, and channel attribution (Website vs TikTok vs Referrals)."
        audience="Operations Managers & Shift Supervisors"
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto custom-scrollbar w-full">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t ? 'text-neon-blue border-neon-blue' : 'text-gray-500 border-transparent hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>


      {activeTab !== 'Overview' && (
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-xl border border-gray-800">
              <div className="text-xs text-gray-400 font-bold">Total {activeTab} Records</div>
              <div className="text-2xl font-black text-white mt-1">4,820</div>
              <div className="text-[10px] text-neon-green mt-1 font-bold">↑ 14.2% vs last week</div>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-gray-800">
              <div className="text-xs text-gray-400 font-bold">Active Resolution Rate</div>
              <div className="text-2xl font-black text-neon-blue mt-1">94.8%</div>
              <div className="text-[10px] text-gray-400 mt-1 font-bold">Within SLA limits</div>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-gray-800">
              <div className="text-xs text-gray-400 font-bold">Average Response Speed</div>
              <div className="text-2xl font-black text-purple-400 mt-1">1m 42s</div>
              <div className="text-[10px] text-neon-green mt-1 font-bold">↑ 18s faster than goal</div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-white">{activeTab} Performance Breakdown</h3>
              <button onClick={() => addToast('success', 'Table Exported', `Exported ${activeTab} data to CSV`)} className="px-3 py-1.5 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-bold hover:bg-neon-blue hover:text-black transition-colors">
                Export Table CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-[11px] text-gray-400 uppercase">
                    <th className="py-3 px-4 font-bold">Category Name</th>
                    <th className="py-3 px-4 font-bold">Volume Handled</th>
                    <th className="py-3 px-4 font-bold">Conversion Speed</th>
                    <th className="py-3 px-4 font-bold">SLA Adherence</th>
                    <th className="py-3 px-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-gray-300 divide-y divide-gray-800/60">
                  {['North America Queue', 'Europe & UK Support', 'APAC Onboarding', 'LATAM Sales Squad', 'VIP Dedicated Desk'].map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white">{item}</td>
                      <td className="py-3 px-4">{(1200 - idx * 180).toLocaleString()}</td>
                      <td className="py-3 px-4">{1.5 + idx * 0.4} hrs</td>
                      <td className="py-3 px-4"><span className="text-neon-green font-bold">{98 - idx * 2}%</span></td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neon-green/10 text-neon-green border border-neon-green/30">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Overview' && (
        <>
      {/* Top KPI Cards (7 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {[
          { label: 'Total Leads', value: '2,054', change: '↑ 14.3%', color: 'text-neon-blue', icon: Users, spark: '#00f0ff' },
          { label: 'New Creators', value: '148', change: '↑ 12.7%', color: 'text-neon-purple', icon: UserPlus, spark: '#8a2be2' },
          { label: 'Active Fans', value: '770', change: '↑ 20.1%', color: 'text-neon-green', icon: Heart, spark: '#39ff14' },
          { label: 'Conversations', value: '1,865', change: '↑ 16.1%', color: 'text-neon-blue', icon: MessageSquare, spark: '#00f0ff' },
          { label: 'Total Revenue', value: '$48,250', change: '↑ 16.6%', color: 'text-yellow-400', icon: DollarSign, spark: '#facc15' },
          { label: 'Tasks Completed', value: '96', change: '↑ 15.5%', color: 'text-neon-purple', icon: CheckSquare, spark: '#8a2be2' },
          { label: 'Conversion Rate', value: '18.4%', change: '↑ 2.6%', color: 'text-neon-green', icon: Percent, spark: '#39ff14' },
        ].map((k, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="text-[10px] text-gray-400 font-bold leading-tight">{k.label}</span>
              <k.icon size={14} className={k.color} />
            </div>
            <div className="relative z-10">
              <div className="text-xl font-black text-white">{k.value}</div>
              <div className={`text-[9px] mt-1 ${k.change.includes('↑') ? 'text-neon-green' : 'text-red-500'}`}>{k.change} vs last 7 days</div>
            </div>
            {/* Sparkline background effect */}
            <svg className="absolute bottom-0 left-0 w-full h-10 opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 30">
              <path d={`M0 30 L10 ${Math.random()*20} L30 ${Math.random()*20} L50 ${Math.random()*20} L70 ${Math.random()*20} L90 ${Math.random()*20} L100 30 Z`} fill={k.spark} />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Performance Overview */}
        <div className="lg:col-span-6 glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-white">Performance Overview</h3>
            <span className="text-[9px] text-gray-500">Last 7 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="date" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="leads" name="Leads" stroke="#00f0ff" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="creators" name="Creators" stroke="#8a2be2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fans" name="Fans" stroke="#39ff14" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="conversations" name="Conversations" stroke="#ec4899" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources Breakdown */}
        <div className="lg:col-span-3 glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-white">Sources Breakdown</h3>
            <span className="text-[9px] text-gray-500">Last 7 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-full h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sourcesData} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                    {sourcesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-xl font-black text-white">2,054</span>
               <span className="text-[8px] text-gray-500 uppercase tracking-wider">Total Leads</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 mt-4">
            {sourcesData.map((d, i) => (
              <div key={i} className="flex justify-between items-center text-[9px]">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm" style={{ backgroundColor: d.color }} /> <span className="text-gray-300">{d.name}</span></span>
                <span className="text-gray-500 text-right">{d.pct} <span className="text-gray-600">({d.value})</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="lg:col-span-3 glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-white">Conversion Funnel</h3>
            <button className="text-[9px] text-neon-blue hover:underline">View Details</button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center space-y-2 mt-4">
            {/* Custom Funnel Graphic using clip-path */}
            <div className="w-full max-w-[200px] flex flex-col gap-1 relative">
              <div className="w-full h-12 bg-blue-500 flex flex-col items-center justify-center" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)', backgroundColor: '#3b82f6' }}>
                <span className="text-white font-bold text-sm drop-shadow">2,054</span>
                <span className="text-[8px] text-white/80 uppercase">Total Leads</span>
              </div>
              <div className="w-[80%] h-12 mx-auto bg-purple-500 flex flex-col items-center justify-center" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)', backgroundColor: '#8a2be2' }}>
                <span className="text-white font-bold text-sm drop-shadow">1,287</span>
                <span className="text-[8px] text-white/80 uppercase">Contacted</span>
              </div>
              <div className="w-[60%] h-12 mx-auto bg-green-500 flex flex-col items-center justify-center" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)', backgroundColor: '#39ff14' }}>
                <span className="text-black font-bold text-sm drop-shadow">642</span>
                <span className="text-[8px] text-black/80 uppercase">Qualified</span>
              </div>
              <div className="w-[40%] h-12 mx-auto bg-yellow-500 flex flex-col items-center justify-center" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)', backgroundColor: '#facc15' }}>
                <span className="text-black font-bold text-sm drop-shadow">378</span>
                <span className="text-[8px] text-black/80 uppercase">Converted</span>
              </div>
              
              {/* Funnel Metrics Lines */}
              <div className="absolute -right-4 top-4 text-[9px] text-gray-400 border-l border-gray-700 pl-2">62.7%<br/><span className="text-[7px]">Contact Rate</span></div>
              <div className="absolute -right-4 top-16 text-[9px] text-gray-400 border-l border-gray-700 pl-2">49.9%<br/><span className="text-[7px]">Qualification Rate</span></div>
              <div className="absolute -right-4 top-[115px] text-[9px] text-gray-400 border-l border-gray-700 pl-2">58.9%<br/><span className="text-[7px]">Conversion Rate</span></div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-[10px] text-gray-500">Overall Conversion Rate</span>
            <span className="text-sm font-bold text-neon-green">18.4%</span>
          </div>
        </div>
      </div>

      {/* Row 2: Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leads Growth */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-bold text-white">Leads Growth</h3>
            <span className="text-[9px] text-gray-500">Last 30 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <div className="text-2xl font-black text-white">2,054</div>
            <div className="text-[10px] text-gray-500 mb-1">Total Leads</div>
          </div>
          <div className="text-[9px] text-neon-green font-bold mb-4">↑ 18.7% vs previous 30 days</div>
          <div className="flex-1 w-full min-h-[120px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsGrowthData}>
                <XAxis dataKey="day" hide />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#1f2937' }} />
                <Bar dataKey="val" fill="#3b82f6" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between text-[8px] text-gray-500 mt-2">
            <span>Apr 21</span><span>May 5</span><span>May 12</span><span>May 20</span>
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[11px] font-bold text-white">Top Performing Agents</h3>
            <span className="text-[9px] text-gray-500">Last 7 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex-1 space-y-3">
            <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2 text-[9px] font-bold text-gray-500 uppercase pb-2 border-b border-gray-800">
              <div className="col-span-1">Agent</div>
              <div className="text-center">Conversations</div>
              <div className="text-center">Leads</div>
              <div className="text-right">Conversion Rate</div>
            </div>
            {topAgents.map((a, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-2">
                <div className="flex items-center gap-2 min-w-[90px]">
                  <img src={a.avatar} className="w-6 h-6 rounded-full border border-gray-700" alt="" />
                  <span className="text-[10px] font-bold text-white truncate">{a.name}</span>
                </div>
                <div className="text-[10px] text-gray-300 text-center">{a.convos}</div>
                <div className="text-[10px] text-gray-300 text-center">{a.leads}</div>
                <div className="text-[10px] text-neon-green font-bold text-right">{a.rate}</div>
              </div>
            ))}
          </div>
          <button className="text-[10px] text-neon-blue mt-4 text-center hover:underline w-full">View all agents →</button>
        </div>

        {/* Conversations Overview */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-bold text-white">Conversations Overview</h3>
            <span className="text-[9px] text-gray-500">Last 7 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <div className="text-2xl font-black text-white">1,865</div>
            <div className="text-[10px] text-gray-500 mb-1">Total Conversations</div>
          </div>
          <div className="text-[9px] text-neon-green font-bold mb-4">↑ 16.1% vs previous 7 days</div>
          <div className="flex-1 space-y-3">
            {conversationsOverview.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="flex items-center gap-1.5"><div className="w-3 h-3 flex items-center justify-center rounded-sm bg-gray-800 border border-gray-700 text-[8px]">💬</div> <span className="text-gray-300">{c.channel}</span></span>
                  <span className="text-white font-bold">{c.value} <span className="text-gray-500 font-normal">({c.pct})</span></span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: c.pct, backgroundColor: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Overview */}
        <div className="glass-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[11px] font-bold text-white">Revenue Overview</h3>
            <span className="text-[9px] text-gray-500">Last 30 Days <ChevronDownIcon className="inline" /></span>
          </div>
          <div className="flex items-end gap-2 mb-4">
            <div className="text-2xl font-black text-white">$48,250</div>
            <div className="text-[10px] text-gray-500 mb-1">Total Revenue</div>
          </div>
          <div className="text-[9px] text-neon-green font-bold mb-4">↑ 18.6% vs previous 30 days</div>
          <div className="h-[80px] w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#8a2be2" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-gray-400">Revenue by Pipeline</span>
              <span className="text-[8px] text-gray-500">Last 30 Days <ChevronDownIcon className="inline" /></span>
            </div>
            <div className="space-y-2">
              {revenueByPipeline.map((r, i) => (
                <div key={i} className="flex items-center justify-between text-[9px]">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{r.name}</span>
                      <span className="text-white font-bold">{r.value} <span className="text-gray-500 font-normal">({r.pct}%)</span></span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${r.pct}%`, backgroundColor: r.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Tables & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Reports Table */}
        <div className="lg:col-span-2 glass-panel flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-white">Recent Reports</h3>
            <button className="text-[9px] text-neon-blue hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto no-scrollbar p-2">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Report Name</th>
                  <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Type</th>
                  <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Date Range</th>
                  <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Generated By</th>
                  <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase">Generated On</th>
                  <th className="px-3 py-2 text-[9px] font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {recentReports.map((r, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] group">
                    <td className="px-3 py-2 text-[10px] font-bold text-white">{r.name}</td>
                    <td className="px-3 py-2 text-[10px] text-gray-400">{r.type}</td>
                    <td className="px-3 py-2 text-[10px] text-gray-400">{r.range}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <img src={r.avatar} className="w-5 h-5 rounded-full" alt="" />
                        <span className="text-[10px] text-gray-300">{r.genBy}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[10px] text-gray-400">{r.genOn}</td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => addToast('info', 'View Report', `Opening ${r.name}...`)} className="p-1 text-gray-400 hover:text-white transition-colors" title="View"><Eye size={12} /></button>
                        <button onClick={() => addToast('success', 'Report Downloaded', `${r.name} exported to CSV.`)} className="p-1 text-gray-400 hover:text-neon-green transition-colors" title="Download"><Download size={12} /></button>
                        <button onClick={() => addToast('info', 'Report Options', 'Share, duplicate or schedule this report.')} className="p-1 text-gray-400 hover:text-white transition-colors" title="More"><MoreVertical size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-800 flex justify-center">
            <button onClick={() => addToast('info', 'All Reports', 'Full reports archive coming soon.')} className="text-[10px] text-neon-blue hover:underline">View all reports →</button>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="lg:col-span-1 glass-panel flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-white">Scheduled Reports</h3>
            <button onClick={() => addToast('info', 'Scheduled Reports', 'Full scheduling manager coming soon.')} className="text-[9px] text-neon-blue hover:underline">View All</button>
          </div>
          <div className="p-4 space-y-4 flex-1">
            {schedules.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-white truncate">{s.name}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5 flex items-center gap-1"><Calendar size={10} /> {s.freq}</div>
                </div>
                {/* Toggle Switch */}
                <div 
                  onClick={() => user?.role !== 'VIEWER' && setSchedules(schedules.map((sch, idx) => idx === i ? { ...sch, active: !sch.active } : sch))}
                  className={`w-8 h-4 flex items-center rounded-full p-0.5 ${user?.role !== 'VIEWER' ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} transition-colors ${s.active ? 'bg-neon-green/80' : 'bg-gray-700'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${s.active ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}


