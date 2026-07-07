import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';

export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = 'Confirm', variant = 'danger' }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const colors = {
    danger: 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,85,0.4)]',
    warning: 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]',
    success: 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]',
    info: 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-sm bg-panel border border-gray-800 rounded-2xl shadow-2xl p-6 text-center z-10">
        
        <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mx-auto mb-4 border border-gray-700">
          <AlertTriangle size={24} className={variant === 'danger' ? 'text-neon-pink' : variant === 'warning' ? 'text-yellow-400' : 'text-neon-blue'} />
        </div>
        
        <h2 className="text-lg font-black text-white mb-2">{title}</h2>
        <p className="text-sm text-secondary mb-6 leading-relaxed">{message}</p>

        <div className="flex items-center gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-2.5 rounded-xl border border-gray-800 text-sm font-bold text-primary hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading} className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${colors[variant]} disabled:opacity-70 disabled:cursor-not-allowed`}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
