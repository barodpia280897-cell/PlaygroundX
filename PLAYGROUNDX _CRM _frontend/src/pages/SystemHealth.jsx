import { motion } from 'framer-motion';
import { Activity, Server, Database, Globe, Cpu, CheckCircle } from 'lucide-react';

const services = [
  { name:'Main API Gateway', status:'Operational', uptime:'99.99%', latency:'42ms', icon:Globe },
  { name:'PostgreSQL Database', status:'Operational', uptime:'99.95%', latency:'12ms', icon:Database },
  { name:'Redis Cache', status:'Operational', uptime:'100%', latency:'2ms', icon:Cpu },
  { name:'WebSocket Server', status:'Operational', uptime:'99.9%', latency:'85ms', icon:Server },
];

export default function SystemHealth() {
  return (
    <div className="space-y-6 pb-10">
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex flex-wrap items-center gap-2">
        <Activity size={22} className="text-neon-green" />
        <h2 className="text-2xl font-black text-white">System Health</h2>
      </motion.div>

      <div className="glass-panel p-8 text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-neon-green/10 border-4 border-neon-green/30 mx-auto flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-neon-green" />
        </div>
        <h3 className="text-2xl font-black text-white mb-2">All Systems Operational</h3>
        <p className="text-secondary">Last checked: Just now. No active incidents reported.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {services.map((s,i) => (
          <motion.div key={s.name} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1*i}}
            className="glass-panel p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center"><s.icon size={18} className="text-secondary"/></div>
              <div>
                <div className="font-bold text-white text-sm">{s.name}</div>
                <div className="text-[10px] text-muted mt-0.5">Uptime: {s.uptime} · Latency: {s.latency}</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30">
              {s.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
