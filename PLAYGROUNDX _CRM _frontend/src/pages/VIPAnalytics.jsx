import { motion } from 'framer-motion';
import { Crown, DollarSign, Star, Award } from 'lucide-react';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

const vipUsers = [
  { id:1, name:'Sophie Dubois', flag:'🇫🇷', avatar:'https://i.pravatar.cc/150?img=9', type:'Fan', tier:'Diamond', score:98, spent:'$4,200', status:'Active', followers:'—', earnings:'—', color:'#00f0ff' },
  { id:2, name:'Jenna Smith', flag:'🇺🇸', avatar:'https://i.pravatar.cc/150?img=13', type:'Creator', tier:'Platinum', score:95, spent:'—', status:'Active', followers:'128K', earnings:'$4,800', color:'#8a2be2' },
  { id:3, name:'Maria Gonzalez', flag:'🇪🇸', avatar:'https://i.pravatar.cc/150?img=1', type:'Creator', tier:'Gold', score:92, spent:'—', status:'Active', followers:'42K', earnings:'$3,100', color:'#ffd700' },
  { id:4, name:'Jin Woo', flag:'🇰🇷', avatar:'https://i.pravatar.cc/150?img=3', type:'Fan', tier:'Platinum', score:88, spent:'$2,800', status:'Active', followers:'—', earnings:'—', color:'#8a2be2' },
  { id:5, name:'Carlos Ramirez', flag:'🇲🇽', avatar:'https://i.pravatar.cc/150?img=11', type:'Fan', tier:'Gold', score:75, spent:'$1,900', status:'Active', followers:'—', earnings:'—', color:'#ffd700' },
  { id:6, name:'Rania Hassan', flag:'🇪🇬', avatar:'https://i.pravatar.cc/150?img=20', type:'Fan', tier:'Prospect', score:60, spent:'$980', status:'Monitoring', followers:'—', earnings:'—', color:'#ff7f00' },
];

const tierColors = { Diamond:'#00f0ff', Platinum:'#8a2be2', Gold:'#ffd700', Prospect:'#ff7f00' };

export default function VIPAnalytics() {
  return (
    <div className="space-y-6 pb-10">
      <ReportHeaderBanner
        title="VIP Concierge & Retention Report"
        subtitle="Monitor high-value account revenue, dedicated queue wait times, and tier retention"
        measures="Measures VIP creator retention, dedicated queue SLA resolution speeds, and Diamond/Platinum fan spend."
        audience="VIP Concierge Directors & Executive Relationship Managers"
      />

      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2"><Crown size={22} className="text-yellow-400" /> VIP Analytics</h2>
          <p className="text-sm text-muted mt-0.5">High-value account revenue and retention</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:'Total VIPs', value:'48', color:'#ffd700', icon:Crown },
          { label:'VIP Creators', value:'15', color:'#8a2be2', icon:Star },
          { label:'VIP Fans', value:'33', color:'#00f0ff', icon:Award },
          { label:'VIP Revenue', value:'$45K', color:'#39ff14', icon:DollarSign },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1*i}} className="glass-panel p-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:s.color+'15', border:`1px solid ${s.color}30` }}>
                <s.icon size={18} style={{ color:s.color }} />
              </div>
              <div><div className="text-2xl font-black text-white">{s.value}</div><div className="text-xs text-muted">{s.label}</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3">
        {vipUsers.map((v,i) => (
          <motion.div key={v.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.06*i}}
            className="glass-panel p-5 hover:border-gray-700 transition-colors" style={{ borderLeft:`3px solid ${tierColors[v.tier]}` }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img src={v.avatar} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2" style={{ borderColor:tierColors[v.tier]+'80' }} />
                  <span className="absolute -bottom-0.5 -right-0.5 text-sm sm:text-base">{v.flag}</span>
                </div>
                <div className="w-auto sm:w-36 shrink-0 flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{v.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:tierColors[v.tier]+'20', color:tierColors[v.tier] }}>{v.tier}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-secondary">{v.type}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2 sm:gap-4 text-center mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-800/50">
                <div><div className="text-sm font-black text-white">{v.type==='Fan'?v.spent:v.earnings}</div><div className="text-[9px] sm:text-[10px] text-muted">{v.type==='Fan'?'Total Spent':'Earnings'}</div></div>
                <div><div className="text-sm font-black" style={{ color:tierColors[v.tier] }}>{v.score}</div><div className="text-[9px] sm:text-[10px] text-muted">VIP Score</div></div>
                <div><div className="text-sm font-bold text-primary truncate">{v.type==='Creator'?v.followers:'—'}</div><div className="text-[9px] sm:text-[10px] text-muted">Followers</div></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
