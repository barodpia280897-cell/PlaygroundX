// src/components/ui/StatCard.jsx
import { memo } from 'react';
import { Users, Star, Heart, Flame, Crown, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = { Users, Star, Heart, Flame, Crown, Headphones };

const colorMap = {
  blue:   { glow: 'shadow-[0_0_20px_rgba(0,240,255,0.12)]', border: 'border-neon-blue/20', text: 'text-neon-blue', bg: 'bg-neon-blue/10' },
  purple: { glow: 'shadow-[0_0_20px_rgba(138,43,226,0.15)]', border: 'border-neon-purple/20', text: 'text-neon-purple', bg: 'bg-neon-purple/10' },
  pink:   { glow: 'shadow-[0_0_20px_rgba(255,0,85,0.12)]',  border: 'border-neon-pink/20', text: 'text-neon-pink', bg: 'bg-neon-pink/10' },
  orange: { glow: 'shadow-[0_0_20px_rgba(255,107,0,0.12)]', border: 'border-orange-500/20', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  gold:   { glow: 'shadow-[0_0_20px_rgba(255,215,0,0.12)]', border: 'border-yellow-500/20', text: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  red:    { glow: 'shadow-[0_0_20px_rgba(255,0,0,0.12)]',   border: 'border-red-500/20', text: 'text-red-400', bg: 'bg-red-500/10' },
};

function StatCard({ stat, index, compact = false }) {
  const Icon = iconMap[stat.icon] || Users;
  const c = colorMap[stat.color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`glass-panel ${c.border} ${c.glow} ${compact ? 'p-3' : 'p-5'} relative overflow-hidden group cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={`${compact ? 'text-[9px]' : 'text-[10px] sm:text-xs'} text-secondary uppercase tracking-wider font-medium truncate`}>{stat.label}</p>
          <p className={`${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} font-black mt-0.5 ${c.text} drop-shadow-[0_0_10px_currentColor] truncate`}>{stat.value}</p>
          <p className={`${compact ? 'text-[9px]' : 'text-[10px] sm:text-xs'} mt-0.5 sm:mt-1 font-medium truncate ${stat.positive ? 'text-neon-green' : 'text-red-400'}`}>
            {stat.change}
          </p>
        </div>
        <div className={`${compact ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl'} shrink-0 ${c.bg} flex items-center justify-center`}>
          <Icon className={`${compact ? 'w-4 h-4' : 'sm:w-[22px] sm:h-[22px] w-5 h-5'} ${c.text}`} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent ${c.text} opacity-30`} />
    </motion.div>
  );
}

export default memo(StatCard);
