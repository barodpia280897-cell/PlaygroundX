import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Star, MessageCircle, DollarSign, Crown, Users, Zap, CheckCircle2, Search, Filter } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';

const mockActivities = [
  { id: 1, type: 'VIP_ASSIGN', user: 'System', target: 'Maria Gonzalez', detail: 'Assigned to High-Value Queue', time: 'Just now', icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 2, type: 'PAYMENT', user: 'Alpha Studios', target: '$4,800', detail: 'Subscription Renewal Processed', time: '2m ago', icon: DollarSign, color: 'text-neon-green', bg: 'bg-neon-green/10 border-neon-green/30' },
  { id: 3, type: 'AI_ACTION', user: 'AI Assistant', target: 'Lead #402', detail: 'Sent auto-response to inquiry', time: '5m ago', icon: Zap, color: 'text-neon-purple', bg: 'bg-neon-purple/10 border-neon-purple/30' },
  { id: 4, type: 'AGENT_REPLY', user: 'Sarah Jenkins', target: 'Carlos Ramirez', detail: 'Replied to chat conversation', time: '12m ago', icon: MessageCircle, color: 'text-neon-blue', bg: 'bg-neon-blue/10 border-neon-blue/30' },
  { id: 5, type: 'LEAD_CREATED', user: 'Website Form', target: 'New Fan', detail: 'Registered via Landing Page A', time: '18m ago', icon: Users, color: 'text-gray-300', bg: 'bg-gray-800 border-gray-700' },
  { id: 6, type: 'WORKFLOW', user: 'Automation', target: 'Onboarding Sequence', detail: 'Triggered for 5 new creators', time: '25m ago', icon: Star, color: 'text-neon-pink', bg: 'bg-neon-pink/10 border-neon-pink/30' },
  { id: 7, type: 'KYC_APPROVED', user: 'Compliance Team', target: 'Ahmed Al Mansour', detail: 'Documents verified successfully', time: '1h ago', icon: CheckCircle2, color: 'text-neon-green', bg: 'bg-neon-green/10 border-neon-green/30' },
];

export default function LiveActivityFeed() {
  const [search, setSearch] = useState('');
  
  const filtered = mockActivities.filter(a => 
    a.user.toLowerCase().includes(search.toLowerCase()) || 
    a.detail.toLowerCase().includes(search.toLowerCase()) ||
    a.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center">
              <Activity size={16} className="text-gray-300" />
            </div>
            Live Activity Feed
          </h1>
          <p className="text-sm text-gray-400 mt-1">Enterprise-wide real-time operations timeline.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-gray-500 w-64"
            />
          </div>
          <button className="p-2 bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-lg text-gray-400 transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-0 relative">
        <div className="absolute top-0 bottom-0 left-[4.5rem] w-px bg-gray-800/80 z-0" />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 z-10 space-y-6">
          {filtered.map((act, index) => {
            const Icon = act.icon;
            return (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-6 group cursor-pointer"
              >
                {/* Time */}
                <div className="w-12 text-right pt-2 shrink-0 text-xs font-bold text-gray-500">
                  {act.time}
                </div>
                
                {/* Node */}
                <div className="relative shrink-0 flex items-start justify-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 shadow-lg bg-[#0a0c10] ${act.bg}`}>
                    <Icon size={16} className={act.color} />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-gray-800/40 hover:bg-gray-800 border border-gray-700/50 rounded-2xl p-4 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm">{act.user}</span>
                      <span className="text-gray-500 text-xs">→</span>
                      <span className="font-bold text-gray-300 text-sm">{act.target}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
                      {act.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{act.detail}</p>
                </div>
              </motion.div>
            )
          })}
          
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-12">No activities found matching your search.</div>
          )}
        </div>
      </div>

    </div>
  );
}
