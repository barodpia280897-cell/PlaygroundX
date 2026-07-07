import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Paperclip, Type } from 'lucide-react';

export default function EmailModal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
            <h3 className="text-sm font-bold text-white">Compose Email</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 border-b border-gray-800/60 pb-3">
              <span className="text-[11px] text-neon-blue font-bold uppercase tracking-wider w-14 shrink-0">To:</span>
              <input
                type="email"
                placeholder="recipient@example.com"
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-600"
              />
            </div>
            <div className="flex items-center gap-3 border-b border-gray-800/60 pb-3">
              <span className="text-[11px] text-neon-blue font-bold uppercase tracking-wider w-14 shrink-0">Subject:</span>
              <input
                type="text"
                placeholder="Enter subject..."
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-600"
              />
            </div>

            {/* Body */}
            <textarea
              rows="6"
              placeholder="Write your message..."
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-600 resize-none"
            />
          </div>

          {/* Footer Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 bg-gray-950/60">
            <div className="flex items-center gap-1.5">
              <button className="p-2 text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 rounded-lg transition-colors">
                <Type size={14} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700/50 rounded-lg transition-colors">
                <Paperclip size={14} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-neon-blue text-black font-black text-xs rounded-xl shadow-[0_0_12px_rgba(0,240,255,0.35)] hover:shadow-[0_0_20px_rgba(0,240,255,0.55)] transition-all"
            >
              <Send size={13} /> Send Email
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
