import { motion } from 'framer-motion';
import { Bot, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataContext';

export default function AIPerformanceCard({ multiplier = 1 }) {
  const [baseAi] = useDataStore('aiPerformance');
  const aiPerformance = { ...baseAi, questionsAnswered: Math.round(baseAi.questionsAnswered * multiplier), escalated: Math.max(1, Math.round(baseAi.escalated * multiplier)) };
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefix = user ? `/${ROLE_CONFIG[user.role].prefix}` : '';

  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference - (aiPerformance.resolutionRate / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-panel border-neon-blue/10 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">AI Performance <span className="text-muted lowercase font-normal">(Today)</span></h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1">
        {/* Circular gauge */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1a1a2e" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#00f0ff" strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 6px rgba(0,240,255,0.6))', transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Bot size={16} className="text-neon-blue mb-1" />
            <span className="text-xs font-black text-neon-blue">{aiPerformance.resolutionRate}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-xs text-muted">Questions Answered</p>
            <p className="text-xl font-black text-white">{aiPerformance.questionsAnswered.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Escalated</p>
            <p className="text-xl font-black text-neon-pink drop-shadow-[0_0_6px_rgba(255,0,85,0.5)]">{aiPerformance.escalated}</p>
          </div>
          <div>
            <p className="text-xs text-muted">Resolution Rate</p>
            <p className="text-xl font-black text-neon-green drop-shadow-[0_0_6px_rgba(57,255,20,0.5)]">{aiPerformance.resolutionRate}%</p>
          </div>
        </div>
      </div>

      <button onClick={() => navigate(`${prefix}/ai-center`)} className="mt-4 w-full text-center text-xs text-neon-blue border border-neon-blue/20 rounded-lg py-2 hover:bg-neon-blue/10 transition-colors">
        Go to AI Center →
      </button>
    </motion.div>
  );
}
