// src/pages/ViewerRevenue.jsx
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

export default function ViewerRevenue() {
  return (
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <DollarSign size={22} className="text-neon-green" /> Revenue Overview
          </h2>
          <p className="text-sm text-muted mt-0.5">Read-only view of platform revenue metrics</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total Revenue (6M)',  value:'$423,000', change:'+24.3%', up:true,  color:'#39ff14', icon:DollarSign },
          { label:'Subscriptions',       value:'$181,000', change:'+18%',   up:true,  color:'#00f0ff', icon:CreditCard },
          { label:'Tips & Donations',    value:'$101,000', change:'+31%',   up:true,  color:'#ffd700', icon:TrendingUp },
          { label:'Deposits',           value:'$141,000', change:'+12%',   up:true,  color:'#8a2be2', icon:ArrowUpRight },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1*i}}
            className="glass-panel p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:s.color+'15', border:`1px solid ${s.color}30` }}>
                <s.icon size={18} style={{ color:s.color }} />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1 ${s.up?'text-neon-green':'text-neon-pink'}`}>
                {s.up?<ArrowUpRight size={12}/>:<ArrowDownRight size={12}/>}{s.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-xs text-muted mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass-panel p-6 flex flex-col items-center justify-center h-64">
        <DollarSign size={48} className="text-neon-green/20 mb-4" />
        <h3 className="font-bold text-white mb-2">Historical Data Access Restricted</h3>
        <p className="text-sm text-muted text-center max-w-sm">
          Detailed historical revenue charts and individual creator earnings are restricted in the Viewer role.
        </p>
      </motion.div>
    </div>
  );
}
