// src/pages/RevenueAnalytics.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Crown, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

const monthlyRevenue = [
  { month:'Jan', subscriptions:18000, tips:8000, deposits:16000 },
  { month:'Feb', subscriptions:22000, tips:11000, deposits:22000 },
  { month:'Mar', subscriptions:27000, tips:14000, deposits:20000 },
  { month:'Apr', subscriptions:31000, tips:18000, deposits:25000 },
  { month:'May', subscriptions:38000, tips:22000, deposits:29000 },
  { month:'Jun', subscriptions:45000, tips:28000, deposits:29000 },
];

const topSpenders = [
  { name:'Sophie Dubois', flag:'🇫🇷', avatar:'https://i.pravatar.cc/150?img=9', spent:'$4,200', type:'Fan', vip:true, change:'+12%' },
  { name:'Jin Woo', flag:'🇰🇷', avatar:'https://i.pravatar.cc/150?img=3', spent:'$2,800', type:'Fan', vip:true, change:'+8%' },
  { name:'Carlos Ramirez', flag:'🇲🇽', avatar:'https://i.pravatar.cc/150?img=11', spent:'$1,900', type:'Fan', vip:false, change:'+22%' },
  { name:'David Park', flag:'🇺🇸', avatar:'https://i.pravatar.cc/150?img=15', spent:'$1,200', type:'Fan', vip:false, change:'+5%' },
  { name:'Rania Hassan', flag:'🇪🇬', avatar:'https://i.pravatar.cc/150?img=20', spent:'$980', type:'Fan', vip:false, change:'+17%' },
];

const topEarners = [
  { name:'Jenna Smith', flag:'🇺🇸', avatar:'https://i.pravatar.cc/150?img=13', earned:'$4,800', type:'Creator', change:'+28%' },
  { name:'Maria Gonzalez', flag:'🇪🇸', avatar:'https://i.pravatar.cc/150?img=1', earned:'$3,100', type:'Creator', change:'+15%' },
  { name:'Sophie Dubois', flag:'🇫🇷', avatar:'https://i.pravatar.cc/150?img=9', earned:'$2,200', type:'Creator', change:'+19%' },
  { name:'Yuna Kim', flag:'🇰🇷', avatar:'https://i.pravatar.cc/150?img=25', earned:'$1,650', type:'Creator', change:'+11%' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl">
      <p className="text-xs font-bold text-primary mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function RevenueAnalytics() {
  const [activeRange, setActiveRange] = useState('Last 6 Months');
  const { addToast } = useToast();

  return (
    <div className="space-y-6 pb-10">
      <ReportHeaderBanner
        title="Revenue & Financial Settlements Report"
        subtitle="Executive view of global revenue streams, subscription settlements, and payouts"
        measures="Measures monthly creator subscription volume, fan tips, Stripe deposits, and wire settlements."
        audience="Finance Directors & Accounting Controllers"
      />

      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <DollarSign size={22} className="text-neon-green" /> Revenue Analytics
          </h2>
          <p className="text-sm text-muted mt-0.5">Executive view of global revenue streams</p>
        </div>
        <div className="flex gap-2">
          {['This Month','Last 6 Months','All Time'].map((t) => (
            <button key={t} onClick={() => { setActiveRange(t); addToast('success', 'Time Range Changed', `Revenue analytics filtered for: ${t}`); }} className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeRange === t ?'bg-neon-green/15 border-neon-green/40 text-neon-green':'border-gray-700 text-muted hover:border-gray-600 hover:text-white'}`}>{t}</button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
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

      {/* Revenue Chart */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass-panel p-6">
        <h3 className="font-bold text-white mb-5">Revenue Breakdown — Last 6 Months</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="gSubAna" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gTipsAna" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffd700" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="gDepAna" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
            <XAxis dataKey="month" tick={{ fill:'#666', fontSize:11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'#666', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#00f0ff" fill="url(#gSubAna)" strokeWidth={2} />
            <Area type="monotone" dataKey="tips"          name="Tips"          stroke="#ffd700" fill="url(#gTipsAna)" strokeWidth={2} />
            <Area type="monotone" dataKey="deposits"      name="Deposits"      stroke="#8a2be2" fill="url(#gDepAna)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Spenders + Top Earners */}
      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.3}} className="glass-panel p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Crown size={16} className="text-yellow-400" /> Top Spending Fans</h3>
          <div className="space-y-3">
            {topSpenders.map((s,i) => (
              <div key={s.name} className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className="text-xs text-gray-600 w-4">{i+1}</span>
                <div className="relative">
                  <img src={s.avatar} className="w-8 h-8 rounded-full" />
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{s.flag}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-200">{s.name}</div>
                </div>
                <span className="text-xs font-black text-neon-green">{s.spent}</span>
                <span className="text-[10px] text-neon-green">{s.change}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.3}} className="glass-panel p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-neon-blue" /> Top Earning Creators</h3>
          <div className="space-y-3">
            {topEarners.map((e,i) => (
              <div key={e.name} className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className="text-xs text-gray-600 w-4">{i+1}</span>
                <div className="relative">
                  <img src={e.avatar} className="w-8 h-8 rounded-full" />
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{e.flag}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-200">{e.name}</div>
                </div>
                <span className="text-xs font-black text-neon-blue">{e.earned}</span>
                <span className="text-[10px] text-neon-green">{e.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
