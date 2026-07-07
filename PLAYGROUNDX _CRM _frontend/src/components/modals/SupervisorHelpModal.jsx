// src/components/modals/SupervisorHelpModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, AlertTriangle, CheckCircle, Clock, Send, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function SupervisorHelpModal({ open, onClose }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [relatedContact, setRelatedContact] = useState('Li Wei (VIP Fan - High Roller)');
  const [urgency, setUrgency] = useState('⚡ High Urgency - VIP Customer Waiting');
  const [reason, setReason] = useState('Need supervisor override for fast-track KYC approval. Customer wants to deposit $5,000 immediately.');

  if (!open) return null;

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!reason.trim()) {
      addToast('error', 'Description Required', 'Please explain the reason for supervisor assistance.');
      return;
    }

    const ticketId = `ESC-${Math.floor(100 + Math.random() * 900)}`;
    addToast('success', 'Supervisor Escalation Sent! 🚨', `Ticket #${ticketId} dispatched to Team Supervisor. Estimated SLA: 3 mins.`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-red-500/10 shrink-0">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldAlert className="text-red-500 animate-pulse" size={18} /> Request Supervisor Assistance
              </h3>
              <p className="text-xs text-red-300/80 mt-0.5">
                Escalate an urgent ticket or request immediate live support from Floor Supervisor.
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 shrink-0">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-gray-900/80 border border-gray-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-300">
                <User size={15} className="text-neon-blue shrink-0" />
                <span>Requesting Agent: <strong className="text-white font-bold">{user?.name || 'Priya Sharma'}</strong></span>
              </div>
              <span className="px-2 py-0.5 rounded bg-neon-blue/10 text-neon-blue border border-neon-blue/20 font-mono font-bold text-[10px]">
                SLOT #4 - SALES
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Related Lead / Customer
              </label>
              <select
                value={relatedContact}
                onChange={e => setRelatedContact(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 font-medium"
              >
                <option value="General Query / Floor Support">General Query / Floor Support</option>
                <option value="Li Wei (VIP Fan - High Roller)">Li Wei (VIP Fan - High Roller) 🇨🇳</option>
                <option value="Maria Gonzalez (Creator)">Maria Gonzalez (Creator) 🇪🇸</option>
                <option value="Ahmed Al-Fayed (VIP Fan)">Ahmed Al-Fayed (VIP Fan) 🇦🇪</option>
                <option value="Sarah Mitchell (Lead)">Sarah Mitchell (Lead) 🇺🇸</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm font-bold focus:outline-none focus:border-red-500 text-white"
              >
                <option value="⚡ High Urgency - VIP Customer Waiting">⚡ High Urgency - VIP Customer Waiting</option>
                <option value="⚠️ Medium Urgency - Commission / Tier Approval">⚠️ Medium Urgency - Commission / Tier Approval</option>
                <option value="ℹ️ Normal - Policy or System Query">ℹ️ Normal - Policy or System Query</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Reason for Escalation / Assistance</span>
                <span className="text-[10px] text-gray-500 font-normal">SLA Response: ~3 mins</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Explain what supervisor override or assistance is needed..."
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-red-500 resize-none custom-scrollbar font-medium leading-relaxed"
              />
            </div>

            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-200 flex items-center gap-2">
              <Clock size={15} className="text-red-400 shrink-0" />
              <span>Submitting this request will instantly notify Floor Supervisor on duty via priority system broadcast.</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-red-500 text-white hover:bg-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all flex items-center gap-1.5"
              >
                <Send size={14} /> Submit Escalation Ticket 🚨
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
