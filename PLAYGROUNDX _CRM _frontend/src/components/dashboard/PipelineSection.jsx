// src/components/dashboard/PipelineSection.jsx
import { motion } from 'framer-motion';
import { useDataStore } from '../../contexts/DataContext';
import { ArrowRight } from 'lucide-react';

function PipelineList({ items, accentColor }) {
  const max = Math.max(...items.map(i => i.count));
  return (
    <div className="space-y-1.5 flex-1">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-xs">
          <span className="text-muted w-4 text-right flex-shrink-0">{i + 1}</span>
          <span className="text-primary w-36 flex-shrink-0 truncate">{item.stage}</span>
          <div className="flex-1 bg-gray-900 rounded-full h-1.5">
            <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${(item.count / max) * 100}%`, backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}50` }} />
          </div>
          <span className="font-bold text-gray-200 w-8 text-right">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

function CircularRate({ percent, color, label, sublabel }) {
  const c = 2 * Math.PI * 28;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 70 70" className="-rotate-90 w-full h-full">
          <circle cx="35" cy="35" r="28" fill="none" stroke="#1a1a2e" strokeWidth="6" />
          <circle cx="35" cy="35" r="28" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={c} strokeDashoffset={c - (percent / 100) * c}
            strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black" style={{ color }}>{percent}%</span>
        </div>
      </div>
      <span className="text-[10px] text-primary font-semibold">{label}</span>
      <span className="text-[9px] text-muted">{sublabel}</span>
    </div>
  );
}

export default function PipelineSection({ multiplier = 1 }) {
  const [baseCreator] = useDataStore('creatorPipeline');
  const [baseFan] = useDataStore('fanPipeline');
  
  const creatorPipeline = baseCreator.map(d => ({...d, count: Math.max(1, Math.round(d.count * multiplier))}));
  const fanPipeline = baseFan.map(d => ({...d, count: Math.max(1, Math.round(d.count * multiplier))}));
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Creator Pipeline */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-panel border-neon-blue/15 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Creator Pipeline</h3>
          <button className="text-xs text-neon-blue flex items-center gap-1 hover:underline">View Pipeline <ArrowRight size={12} /></button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
          <PipelineList items={creatorPipeline} accentColor="#00f0ff" />
          <div className="flex sm:flex-col items-center justify-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-800 pt-4 sm:pt-0 sm:pl-4">
            <CircularRate percent={58} color="#00f0ff" label="Active Creators" sublabel="+13%" />
            <CircularRate percent={25} color="#ffd700" label="VIP Creators" sublabel="+25%" />
          </div>
        </div>
      </motion.div>

      {/* Fan Pipeline */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="glass-panel border-neon-pink/15 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Fan Pipeline</h3>
          <button className="text-xs text-neon-pink flex items-center gap-1 hover:underline">View Pipeline <ArrowRight size={12} /></button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-2">
          <PipelineList items={fanPipeline} accentColor="#ff0055" />
          <div className="flex sm:flex-col items-center justify-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-800 pt-4 sm:pt-0 sm:pl-4">
            <CircularRate percent={37} color="#ff0055" label="Active Fans" sublabel="+12%" />
            <CircularRate percent={22} color="#ffd700" label="VIP Fans" sublabel="+22%" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
