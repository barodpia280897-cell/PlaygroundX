import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EscalateModal({ open, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [notes, setNotes] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep(1);
      setNotes('');
    }
  }, [open]);

  const handleEscalate = () => {
    setStep(2);
    // Wait for animation, then trigger confirm and close
    setTimeout(() => {
      onConfirm(notes);
      onClose();
    }, 2000);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-[400px] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {step === 1 ? (
            <>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-neon-pink/5">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-neon-pink" />
                  <span className="font-bold text-white text-sm">Escalate Conversation</span>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-300">Are you sure you want to escalate this conversation to a Supervisor? This will tag the conversation as High Priority.</p>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Optional Notes</label>
                  <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Briefly explain why you are escalating..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-pink/50 resize-none h-24"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-bold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                  <button onClick={handleEscalate} className="flex-1 py-2.5 rounded-xl bg-neon-pink text-white font-bold text-sm hover:bg-neon-pink/90 hover:shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all">Escalate</button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center space-y-4 py-12">
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-neon-pink/20 border-2 border-neon-pink/50 flex items-center justify-center mb-6">
                <CheckCircle2 size={32} className="text-neon-pink" />
              </motion.div>
              <h3 className="text-xl font-black text-white">Escalated!</h3>
              <p className="text-sm text-neon-pink font-medium">Conversation Escalated to Supervisor!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
