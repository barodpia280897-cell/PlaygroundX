import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Ban, Trash2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function MoreOptionsModal({ open, onClose, lead, onViewProfile, onBlockLead, onUnblockLead, onClearChat }) {
  const { user } = useAuth();
  const isViewer = user?.role === 'VIEWER';
  if (!open || !lead) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-[320px] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <span className="font-bold text-white text-sm">Conversation Options</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
          </div>

          <div className="p-2 space-y-1">
            <button onClick={() => { onViewProfile(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              <User size={16} className="text-neon-blue" />
              <span className="font-medium">View Full Profile</span>
            </button>

            {!isViewer && (
              <>
                {lead.isBlocked ? (
                  <button onClick={() => { onUnblockLead(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-xl transition-colors">
                    <ShieldCheck size={16} />
                    <span className="font-medium">Unblock Lead</span>
                  </button>
                ) : (
                  <button onClick={() => { onBlockLead(); onClose(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 rounded-xl transition-colors">
                    <Ban size={16} />
                    <span className="font-medium">Block Lead</span>
                  </button>
                )}

                <div className="h-px bg-gray-800/50 my-1 mx-2" />

                <button onClick={() => { onClearChat(); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                  <Trash2 size={16} />
                  <span className="font-medium">Clear Chat History</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
