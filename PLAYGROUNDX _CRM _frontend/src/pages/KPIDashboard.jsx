// src/pages/KPIDashboard.jsx
import { motion } from 'framer-motion';
import { Activity, Target, TrendingUp, Users, DollarSign } from 'lucide-react';
import TodaySummary from '../components/dashboard/TodaySummary';

export default function KPIDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-2 mb-6">
        <Target size={22} className="text-neon-green" />
        <div>
          <h2 className="text-2xl font-black text-white">KPI Dashboard</h2>
          <p className="text-sm text-muted mt-0.5">High-level executive key performance indicators</p>
        </div>
      </motion.div>

      <TodaySummary />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {[
          { title: 'Customer Acquisition Cost (CAC)', value: '$12.50', trend: '-2.1%', icon: Users, color: '#00f0ff' },
          { title: 'Lifetime Value (LTV)', value: '$340.00', trend: '+5.4%', icon: DollarSign, color: '#39ff14' },
          { label: 'LTV:CAC Ratio', value: '27.2', trend: '+7.5%', icon: TrendingUp, color: '#8a2be2' },
        ].map((kpi, i) => (
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1*i}}
            className="glass-panel p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:kpi.color+'15', border:`1px solid ${kpi.color}30` }}>
                <kpi.icon size={18} style={{ color:kpi.color }} />
              </div>
              <span className="text-xs font-bold text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full border border-neon-green/20">
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{kpi.value}</div>
            <div className="text-xs text-muted mt-1 uppercase tracking-wider">{kpi.title || kpi.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}} className="glass-panel p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-neon-pink" /> Operational Efficiency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted">Agent Utilization Rate</span><span className="text-white font-bold">88%</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-neon-pink h-1.5 rounded-full" style={{width:'88%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted">First Contact Resolution</span><span className="text-white font-bold">76%</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-neon-blue h-1.5 rounded-full" style={{width:'76%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted">Average Handle Time</span><span className="text-white font-bold">4m 12s</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-neon-green h-1.5 rounded-full" style={{width:'65%'}}></div></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.4}} className="glass-panel p-6">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={16} className="text-yellow-400" /> Quarterly OKRs</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted">Q3 Revenue Target ($1.2M)</span><span className="text-white font-bold">92%</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-yellow-400 h-1.5 rounded-full" style={{width:'92%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted">New Creator Onboarding (500)</span><span className="text-white font-bold">64%</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-neon-blue h-1.5 rounded-full" style={{width:'64%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted">Churn Reduction (&lt; 5%)</span><span className="text-white font-bold">81%</span></div>
              <div className="w-full bg-gray-800 rounded-full h-1.5"><div className="bg-neon-purple h-1.5 rounded-full" style={{width:'81%'}}></div></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
