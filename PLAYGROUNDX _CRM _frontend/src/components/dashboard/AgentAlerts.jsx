import { motion } from 'framer-motion';
import { Crown, Shield, CreditCard, Phone, Flame, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataContext';

const iconMap = { Crown, Shield, CreditCard, Phone, Flame };
const priorityStyles = {
  vip:    { border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', text: 'text-yellow-300', dot: 'bg-yellow-400' },
  high:   { border: 'border-neon-pink/30',  bg: 'bg-neon-pink/10',  text: 'text-neon-pink',  dot: 'bg-neon-pink' },
  medium: { border: 'border-neon-blue/20',  bg: 'bg-neon-blue/10',  text: 'text-neon-blue',  dot: 'bg-neon-blue' },
  hot:    { border: 'border-orange-500/30', bg: 'bg-orange-500/10', text: 'text-orange-400', dot: 'bg-orange-400' },
};

export default function AgentAlerts() {
  const [agentAlerts] = useDataStore('agentAlerts');
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = user ? `/${ROLE_CONFIG[user.role].prefix}` : '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-panel p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Agent Alerts</h3>
        <button onClick={() => navigate(`${prefix}/escalations`)} className="text-xs text-neon-blue flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></button>
      </div>
      <div className="space-y-2 flex-1">
        {agentAlerts.map((alert, i) => {
          const Icon = iconMap[alert.icon] || Flame;
          const p = priorityStyles[alert.priority] || priorityStyles.medium;
          return (
            <div key={i} onClick={() => navigate(`${prefix}/escalations`)} className={`flex items-center gap-3 p-3 rounded-xl border ${p.border} ${p.bg} group hover:scale-[1.01] transition-transform cursor-pointer`}>
              <div className={`w-8 h-8 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className={p.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold ${p.text}`}>{alert.type}</p>
                <p className="text-xs text-secondary truncate">{alert.name}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${p.dot} animate-pulse`} />
                <span className="text-[10px] text-muted">{alert.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
