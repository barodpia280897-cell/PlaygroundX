import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, Globe, Users, Check } from 'lucide-react';

export default function ConversationsFilterModal({ open, onClose, filters, setFilters }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="fixed top-[135px] right-6 w-full max-w-[340px] bg-panel border border-gray-800/60 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col origin-top-right"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-800/60 flex items-center justify-between bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
                  <Filter size={14} className="text-neon-blue" />
                </div>
                <h2 className="text-base font-bold text-white">Filter Conversations</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              
              {/* Languages */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-300">
                  <Globe size={14} className="text-gray-400" /> Language
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setFilters({...filters, language: 'All'})} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filters.language === 'All' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    All Languages {filters.language === 'All' && <Check size={12} />}
                  </button>
                  <button onClick={() => setFilters({...filters, language: 'English'})} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filters.language === 'English' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    English {filters.language === 'English' && <Check size={12} />}
                  </button>
                  <button onClick={() => setFilters({...filters, language: 'Spanish'})} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${filters.language === 'Spanish' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    Spanish {filters.language === 'Spanish' && <Check size={12} />}
                  </button>
                </div>
              </div>

              {/* Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-300">
                  <Users size={14} className="text-gray-400" /> Assigned Agent
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setFilters({...filters, agent: 'All'})} className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${filters.agent === 'All' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    <span>All Agents</span>
                    {filters.agent === 'All' && <Check size={12} />}
                  </button>
                  <button onClick={() => setFilters({...filters, agent: 'Sarah Agent'})} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${filters.agent === 'Sarah Agent' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    <img src="https://i.pravatar.cc/150?img=33" className="w-4 h-4 rounded-full" alt="Agent" />
                    Sarah Agent
                  </button>
                  <button onClick={() => setFilters({...filters, agent: 'Carlos'})} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${filters.agent === 'Carlos' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    <img src="https://i.pravatar.cc/150?img=11" className="w-4 h-4 rounded-full" alt="Agent" />
                    Carlos
                  </button>
                  <button onClick={() => setFilters({...filters, agent: 'Unassigned'})} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${filters.agent === 'Unassigned' ? 'bg-neon-blue/10 border border-neon-blue/30 text-neon-blue' : 'bg-gray-800/50 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    Unassigned
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-300">
                  Quick Filters
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-900/30 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <input type="checkbox" checked={filters.unreadOnly} onChange={e => setFilters({...filters, unreadOnly: e.target.checked})} className="rounded bg-gray-800 border-gray-700 text-neon-blue focus:ring-neon-blue" />
                    <span className="text-sm font-medium text-gray-200">Show Unread Only</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-900/30 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <input type="checkbox" checked={filters.vipOnly} onChange={e => setFilters({...filters, vipOnly: e.target.checked})} className="rounded bg-gray-800 border-gray-700 text-neon-blue focus:ring-neon-blue" />
                    <span className="text-sm font-medium text-gray-200">Show VIP Prospects Only</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-800 bg-gray-900/30 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <input type="checkbox" checked={filters.escalatedOnly} onChange={e => setFilters({...filters, escalatedOnly: e.target.checked})} className="rounded bg-gray-800 border-gray-700 text-neon-blue focus:ring-neon-blue" />
                    <span className="text-sm font-medium text-gray-200">Show Escalated Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-800/60 bg-gray-900/30 flex items-center justify-end gap-3">
              <button
                onClick={() => setFilters({ language: 'All', agent: 'All', unreadOnly: false, vipOnly: false, escalatedOnly: false })}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-neon-blue text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
