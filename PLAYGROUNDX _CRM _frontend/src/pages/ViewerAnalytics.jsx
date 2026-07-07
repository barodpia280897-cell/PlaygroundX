// src/pages/ViewerAnalytics.jsx
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Users, Star, TrendingUp } from 'lucide-react';

const analyticsData = [
  { name: 'Jan', users: 4000, active: 2400 },
  { name: 'Feb', users: 3000, active: 1398 },
  { name: 'Mar', users: 2000, active: 9800 },
  { name: 'Apr', users: 2780, active: 3908 },
  { name: 'May', users: 1890, active: 4800 },
  { name: 'Jun', users: 2390, active: 3800 },
  { name: 'Jul', users: 3490, active: 4300 },
];

export default function ViewerAnalytics() {
  return (
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2"><Activity size={22} className="text-neon-blue" /> System Analytics</h2>
        <p className="text-sm text-muted mt-0.5">Read-only view of core platform metrics</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Users', value:'42.5K', icon:Users, color:'#00f0ff' },
          { label:'Active Creators', value:'3.2K', icon:Star, color:'#39ff14' },
          { label:'Monthly Growth', value:'+12.4%', icon:TrendingUp, color:'#ffd700' },
          { label:'Platform Health', value:'99.9%', icon:Activity, color:'#ff0055' },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1*i}} className="glass-panel p-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:s.color+'15', border:`1px solid ${s.color}30` }}>
                <s.icon size={18} style={{ color:s.color }} />
              </div>
              <div><div className="text-xl font-black text-white">{s.value}</div><div className="text-xs text-muted">{s.label}</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass-panel p-6">
        <h3 className="font-bold text-white mb-5">User Growth (YTD)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
            <XAxis dataKey="name" tick={{ fill:'#666', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#666', fontSize:11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor:'#111', borderColor:'#333', borderRadius:'8px' }} />
            <Bar dataKey="users" fill="#00f0ff" radius={[4,4,0,0]} />
            <Bar dataKey="active" fill="#39ff14" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
