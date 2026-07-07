import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, User, Clock, Flag, Target, Phone, MessageSquare, Briefcase } from 'lucide-react';

export default function ViewEscalationModal({ open, onClose, escalation, onResolve }) {
  if (!escalation) return null;

  const Icon = escalation.icon || AlertTriangle;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel w-full max-w-md overflow-hidden relative shadow-2xl"
              style={{ borderTop: `4px solid ${escalation.color || '#ff0055'}` }}
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-800/50 flex items-center justify-between bg-gray-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${escalation.color}15`, border: `1px solid ${escalation.color}30` }}>
                    <Icon size={20} style={{ color: escalation.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Escalation Details</h3>
                    <p className="text-xs text-muted">ID: #{escalation.id.toString().padStart(4, '0')} · {escalation.status}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                {/* User Profile */}
                <div className="flex items-center gap-4 bg-gray-900/30 p-3 rounded-xl border border-gray-800/50">
                  <div className="relative">
                    <img src={escalation.avatar} alt={escalation.name} className="w-14 h-14 rounded-full object-cover border border-gray-700" />
                    <span className="absolute -bottom-1 -right-1 text-lg">{escalation.flag}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{escalation.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-700 text-gray-300 bg-gray-800/50 uppercase">{escalation.priority}</span>
                      <span className="text-xs font-semibold" style={{ color: escalation.color }}>{escalation.type}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-1 flex items-center gap-1"><Target size={10}/> Reason</span>
                    <p className="text-sm text-primary">{escalation.reason}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-1 flex items-center gap-1"><Clock size={10}/> Elapsed Time</span>
                    <p className="text-sm text-primary">{escalation.time}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-1 flex items-center gap-1"><Briefcase size={10}/> Assigned Agent</span>
                    <p className="text-sm text-primary">{escalation.agent}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted uppercase tracking-wider font-semibold block mb-1 flex items-center gap-1"><Flag size={10}/> Status</span>
                    <p className="text-sm text-primary">{escalation.status}</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 border-t border-gray-800/50 bg-gray-900/50 flex items-center justify-end gap-2">
                {escalation.status !== 'Resolved' && onResolve && (
                  <button onClick={onResolve} className="px-4 py-2 rounded-xl text-sm font-bold bg-neon-green/15 text-neon-green border border-neon-green/30 hover:bg-neon-green/25 transition-colors flex items-center gap-1.5 mr-auto">
                    Resolve
                  </button>
                )}
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-muted hover:text-white transition-colors">
                  Close
                </button>
                <button onClick={() => { document.getElementById('header-messages')?.click(); onClose(); }} className="px-4 py-2 rounded-xl text-sm font-bold bg-neon-green/15 text-neon-green border border-neon-green/30 hover:bg-neon-green/25 transition-colors flex items-center gap-1.5">
                  <MessageSquare size={14} /> Message
                </button>
                <button onClick={() => { document.getElementById('header-call')?.click(); onClose(); }} className="px-4 py-2 rounded-xl text-sm font-bold bg-neon-blue/15 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/25 transition-colors flex items-center gap-1.5">
                  <Phone size={14} /> Call Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
