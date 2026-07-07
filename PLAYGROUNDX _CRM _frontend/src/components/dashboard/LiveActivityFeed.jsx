// src/components/dashboard/LiveActivityFeed.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, ShieldCheck, DollarSign, Upload, Radio, Star, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../contexts/DataContext';
import { useAuth, ROLE_CONFIG } from '../../contexts/AuthContext';

const typeConfig = {
  registration: { icon: UserCheck, color: 'text-neon-blue', dot: 'bg-neon-blue' },
  kyc:          { icon: ShieldCheck, color: 'text-neon-green', dot: 'bg-neon-green' },
  deposit:      { icon: DollarSign, color: 'text-yellow-400', dot: 'bg-yellow-400' },
  content:      { icon: Upload, color: 'text-neon-purple', dot: 'bg-neon-purple' },
  room:         { icon: Radio, color: 'text-neon-blue', dot: 'bg-neon-blue' },
  subscription: { icon: Star, color: 'text-neon-pink', dot: 'bg-neon-pink' },
  vip:          { icon: Crown, color: 'text-yellow-400', dot: 'bg-yellow-400' },
};

export default function LiveActivityFeed() {
  const [liveActivityFeed] = useDataStore('liveActivityFeed');
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = user ? `/${ROLE_CONFIG[user.role].prefix}` : '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-panel p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_6px_rgba(57,255,20,1)]" />
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Live Activity Feed</h3>
        </div>
        <button onClick={() => navigate(`${prefix}/pipelines`)} className="text-xs text-neon-blue flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></button>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {liveActivityFeed.map((item, i) => {
            const cfg = typeConfig[item.type] || typeConfig.registration;
            const Icon = cfg.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2 border-b border-gray-800/40 last:border-0 hover:bg-white/5 rounded-lg px-2 transition-colors cursor-pointer">
                <div className={`w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={cfg.color} />
                </div>
                <p className="text-xs text-primary flex-1">{item.text}</p>
                <span className="text-[10px] text-gray-600 flex-shrink-0">{item.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
