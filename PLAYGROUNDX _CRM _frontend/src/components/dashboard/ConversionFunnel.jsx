// src/components/dashboard/ConversionFunnel.jsx
import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Filter, UserPlus, ShieldCheck, DollarSign, Zap } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';

const icons = [UserPlus, UserPlus, ShieldCheck, DollarSign, Zap];
const colors = ['text-neon-blue', 'text-neon-purple', 'text-neon-green', 'text-yellow-400', 'text-neon-pink'];
const arrows = ['→', '→', '→', '→'];

export default function ConversionFunnel({ multiplier = 1 }) {
  const [baseFunnel] = useDataStore('conversionFunnel');
  const conversionFunnel = baseFunnel.map(d => ({...d, value: Math.max(1, Math.round(d.value * multiplier))}));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="glass-panel p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Conversion Funnel</h3>
        <span className="text-[10px] text-muted">Overall Conversion Stages</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <div className="flex items-center justify-between gap-1 min-w-[500px]">
          {conversionFunnel.map((stage, i) => {
            const Icon = icons[i];
            const col = colors[i];
            return (
              <Fragment key={i}>
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-800 flex items-center justify-center ${col}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] text-secondary text-center leading-tight">{stage.stage}</span>
                  <span className={`text-sm font-black ${col}`}>{stage.value.toLocaleString()}</span>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" style={{ width: `${stage.percent}%` }} />
                  </div>
                  <span className="text-[10px] text-muted">{stage.percent}%</span>
                </div>
                {i < conversionFunnel.length - 1 && (
                  <span className="text-gray-600 text-lg flex-shrink-0 mb-8">→</span>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
