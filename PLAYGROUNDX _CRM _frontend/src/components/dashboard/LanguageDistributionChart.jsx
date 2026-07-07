// src/components/dashboard/LanguageDistributionChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="glass-panel border-gray-700 p-3 rounded-lg text-xs shadow-lg">
        <p className="font-bold text-white">{d.name}</p>
        <p style={{ color: d.payload.color }}>{d.value}%</p>
      </div>
    );
  }
  return null;
};

export default function LanguageDistributionChart({ multiplier = 1 }) {
  const [baseData] = useDataStore('languageDistribution');
  const languageDistribution = baseData.map(d => ({...d, value: Math.max(1, Math.round(d.value * multiplier))}));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-5 h-full">
      <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Language Distribution</h3>
      <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4">
        <div className="w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
            <PieChart>
              <Pie data={languageDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {languageDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {languageDistribution.map((lang, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: lang.color }} />
                <span className="text-primary">{lang.name}</span>
              </div>
              <span className="font-bold text-gray-200">{lang.value}%</span>
            </div>
          ))}
          <div className="border-t border-gray-800 pt-2 mt-2 flex items-center justify-between text-xs">
            <span className="text-secondary">TOTAL</span>
            <span className="font-black text-neon-blue text-base">{Math.round(1284 * multiplier).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
