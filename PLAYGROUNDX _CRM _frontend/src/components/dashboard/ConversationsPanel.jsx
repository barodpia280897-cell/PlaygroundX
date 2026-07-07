import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataContext';

const channelColors = { WhatsApp: 'text-green-400', SMS: 'text-neon-blue', Email: 'text-neon-purple', Phone: 'text-yellow-400' };

export default function ConversationsPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentConversations] = useDataStore('conversations');
  const prefix = user ? `/${ROLE_CONFIG[user.role].prefix}` : '';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-panel p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Conversations</h3>
          <span className="w-6 h-6 rounded-full bg-neon-pink text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(255,0,85,0.5)]">42</span>
        </div>
        <button onClick={() => navigate(`${prefix}/conversations`)} className="text-xs text-neon-blue flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></button>
      </div>
      <div className="space-y-2 flex-1">
        {recentConversations.map((conv, i) => (
          <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="relative flex-shrink-0">
              <img src={conv.avatar} alt={conv.name} className="w-9 h-9 rounded-full object-cover border border-gray-700 group-hover:border-neon-blue/40 transition-colors" />
              <span className="absolute -bottom-0.5 -right-0.5 text-sm">{conv.flag}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-200 group-hover:text-neon-blue transition-colors truncate">{conv.name}</p>
              <p className={`text-xs truncate ${channelColors[conv.channel] || 'text-secondary'}`}>{conv.channel}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-muted">{conv.time}</span>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-neon-pink text-white text-[9px] font-black flex items-center justify-center">{conv.unread}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate(`${prefix}/conversations`)} className="mt-4 w-full text-center text-xs text-neon-blue border border-neon-blue/20 rounded-lg py-2 hover:bg-neon-blue/10 transition-colors">
        Open Chat Center
      </button>
    </motion.div>
  );
}
