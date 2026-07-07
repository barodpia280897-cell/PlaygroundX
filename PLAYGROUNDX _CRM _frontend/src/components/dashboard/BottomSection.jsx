// src/components/dashboard/PrimaryChannelsChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useDataStore } from '../../contexts/DataContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="glass-panel border-gray-700 p-2 rounded-lg text-xs">
        <p className="font-bold" style={{ color: d.payload.color }}>{d.name}</p>
        <p className="text-primary">{d.payload.value} ({d.payload.percent}%)</p>
      </div>
    );
  }
  return null;
};

export default function BottomSection({ multiplier = 1 }) {
  const [baseChannels] = useDataStore('primaryChannels');
  const [baseCountries] = useDataStore('topCountries');

  const primaryChannels = baseChannels.map(c => ({...c, value: Math.max(1, Math.round(c.value * multiplier))}));
  const topCountries = baseCountries.map(c => ({...c, count: Math.max(1, Math.round(c.count * multiplier))}));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Primary Channels */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-5">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Primary Channels</h3>
        <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4">
          <div className="w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={primaryChannels} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {primaryChannels.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-center mb-2">
              <p className="text-xs text-secondary">TOTAL</p>
              <p className="text-2xl font-black text-neon-blue">{Math.round(1284 * multiplier).toLocaleString()}</p>
            </div>
            {primaryChannels.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-primary">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">{c.percent}%</span>
                  <span className="font-bold text-gray-200">({c.value})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Countries */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-panel p-5">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Top Countries</h3>
        <div className="space-y-3">
          {topCountries.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{c.flag}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-primary">{c.country}</span>
                  <span className="text-secondary">{c.percent}% <span className="text-neon-blue">({c.count})</span></span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" style={{ width: `${c.percent}%`, boxShadow: '0 0 6px rgba(0,240,255,0.4)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
