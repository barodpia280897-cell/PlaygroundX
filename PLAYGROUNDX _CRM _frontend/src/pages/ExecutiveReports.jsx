// src/pages/ExecutiveReports.jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Star, ArrowUpRight, ArrowDownRight, Crown, Target } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel border-gray-700 p-3 rounded-xl text-xs shadow-lg">
        <p className="text-secondary mb-1">{label}</p>
        <p className="font-black text-neon-blue text-base">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function ExecutiveReports() {
  const [revenueByMonth] = useDataStore('revenueByMonth');
  const [revenueByCountry] = useDataStore('revenueByCountry');
  const totalRevenue = revenueByMonth.reduce((s, m) => s + m.revenue, 0);

  return (
    <div className="space-y-5 pb-10">
      <ReportHeaderBanner
        title="Executive C-Suite Scorecard"
        subtitle="High-level financial run-rate, top creator portfolio, and quarterly growth"
        measures="Measures overall YTD revenue, Year-over-Year growth velocity, and target completion rate."
        audience="CEO, Managing Directors & C-Suite Executives"
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue YTD', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-neon-green', border: 'border-neon-green/20' },
          { label: 'YoY Growth', value: '+34.2%', icon: TrendingUp, color: 'text-neon-blue', border: 'border-neon-blue/20' },
          { label: 'Top Tier Creators', value: '128', icon: Crown, color: 'text-neon-purple', border: 'border-neon-purple/20' },
          { label: 'Quarterly Targets', value: '92%', icon: Target, color: 'text-neon-pink', border: 'border-neon-pink/20' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`glass-panel p-5 border ${s.border}`}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Icon size={20} className={s.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted truncate">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color} drop-shadow-[0_0_8px_currentColor]`}>{s.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-6">Financial Growth Trajectory</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="execRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#00f0ff" strokeWidth={3} fill="url(#execRevenueGrad)"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.6))' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue by Country */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-6">Global Market Share</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCountry} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
                <XAxis dataKey="country" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                  {revenueByCountry.map((entry, i) => (
                    <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 6px ${entry.color}80)` }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
