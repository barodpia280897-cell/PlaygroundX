import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, User, Clock, AlertCircle, MessageSquare, Phone, Mail, CheckCircle, XCircle, TrendingUp, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function QAReviewModal({ open, onClose, review, onSave }) {
  const { user } = useAuth();
  const isViewer = user?.role === 'VIEWER';
  const [checklist, setChecklist] = useState({
    greeting: true,
    empathy: false,
    resolution: false,
    compliance: true,
    tone: true
  });
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (open) {
      setNotes('');
      // Reset checklist based on review type or randomly for mock
      setChecklist({ greeting: true, empathy: false, resolution: false, compliance: true, tone: true });
    }
  }, [open, review]);

  if (!open || !review) return null;

  const handleAction = (action) => {
    onSave({ ...review, status: action, notes });
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[900px] max-h-[90vh] bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Panel: Info */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800 bg-gray-900/30 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-neon-blue" />
              <span className="text-sm font-bold text-white">QA Review</span>
            </div>
            <button onClick={onClose} className="md:hidden"><X size={16} className="text-gray-500 hover:text-white" /></button>
          </div>
          
          <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Interaction ID</div>
              <div className="text-sm font-bold text-gray-200">{review.id}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Type</div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-neon-purple">
                {review.type === 'Call' && <Phone size={12} />}
                {review.type === 'Chat' && <MessageSquare size={12} />}
                {review.type === 'Email' && <Mail size={12} />}
                {review.type}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Agent</div>
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"><User size={12} /></div>
                {review.agent}
              </div>
              <div className="text-xs text-gray-400 mt-1 pl-8">{review.dept}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Lead / Customer</div>
              <div className="text-sm text-gray-300">{review.lead || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Date & Time</div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Clock size={12} /> {review.date}
              </div>
            </div>
          </div>
        </div>

        {/* Main Panel: Content & Checklist */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-950">
          <div className="p-4 flex items-center justify-between border-b border-gray-800 shrink-0">
            <h3 className="text-lg font-black text-white">Interaction Evaluation</h3>
            <button onClick={onClose} className="hidden md:block p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            
            {/* Interaction Content Mock */}
            <div className="border border-gray-800 rounded-xl bg-gray-900/50 p-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Transcript / Content</h4>
              {review.type === 'Call' && (
                <div className="space-y-3">
                  <div className="w-full h-8 bg-gray-800 rounded-lg flex items-center px-3 relative overflow-hidden">
                    <div className="absolute left-0 h-full bg-neon-blue/20 w-1/3"></div>
                    <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden z-10"><div className="w-1/3 h-full bg-neon-blue"></div></div>
                  </div>
                  <p className="text-xs text-gray-400 italic">"Thank you for calling support, my name is {review.agent}. How can I assist you today? ..."</p>
                </div>
              )}
              {review.type === 'Chat' && (
                <div className="space-y-2">
                  <div className="flex justify-start"><div className="bg-gray-800 text-gray-300 text-xs py-1.5 px-3 rounded-lg rounded-bl-sm">I have an issue with my account.</div></div>
                  <div className="flex justify-end"><div className="bg-neon-blue/20 border border-neon-blue/20 text-neon-blue text-xs py-1.5 px-3 rounded-lg rounded-br-sm">I can definitely help you with that!</div></div>
                </div>
              )}
              {review.type === 'Email' && (
                <div className="text-xs text-gray-300">
                  <p><strong>Subject:</strong> {review.subject || 'Inquiry'}</p>
                  <p className="mt-2 text-gray-400">Dear customer, thank you for reaching out...</p>
                </div>
              )}
              {review.type === 'AI Handover' && (
                <div className="text-xs text-gray-300">
                  <p><strong>AI Confidence:</strong> {review.aiConfidence}</p>
                  <p><strong>Reason:</strong> {review.reason}</p>
                  <p className="mt-2 text-gray-400">AI failed to resolve complex billing issue. Handed over to {review.agent}.</p>
                </div>
              )}
              {review.type === 'Escalation' && (
                <div className="text-xs text-gray-300">
                  <p><strong>Supervisor:</strong> {review.supervisor}</p>
                  <p><strong>Priority:</strong> <span className="text-red-500 font-bold">{review.priority}</span></p>
                </div>
              )}
            </div>

            {/* AI Recommendations */}
            {(review.aiSuggestion || review.type === 'Chat') && (
              <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex gap-3 items-start">
                <AlertCircle size={16} className="text-neon-purple shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neon-purple mb-1">AI Recommendation</h4>
                  <p className="text-xs text-gray-300">{review.aiSuggestion || 'Agent missed an opportunity to upsell premium subscription.'}</p>
                </div>
              </div>
            )}

            {/* QA Checklist */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">QA Checklist</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.keys(checklist).map(key => (
                  <label key={key} className={`flex items-center gap-2 p-2 rounded-lg border border-transparent transition-colors ${isViewer ? 'cursor-default' : 'hover:bg-white/5 cursor-pointer hover:border-gray-800'}`}>
                    <input type="checkbox" checked={checklist[key]} onChange={() => !isViewer && setChecklist({...checklist, [key]: !checklist[key]})} disabled={isViewer} className="rounded bg-gray-900 border-gray-700 disabled:opacity-50" />
                    <span className="text-sm text-gray-300 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Internal Notes</h4>
              <textarea value={notes} onChange={e => !isViewer && setNotes(e.target.value)} readOnly={isViewer} placeholder={isViewer ? "No notes added." : "Add feedback or coaching notes here..."} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue min-h-[80px] resize-none"></textarea>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex flex-wrap items-center justify-end gap-3 shrink-0">
            {isViewer ? (
              <button onClick={onClose} className="px-5 py-2 rounded-xl bg-gray-800 text-white font-bold text-xs border border-gray-700 hover:border-gray-500 transition-colors">
                Close Evaluation
              </button>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={() => handleAction('Pass')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neon-green/30 bg-neon-green/10 text-xs font-bold text-neon-green hover:bg-neon-green hover:text-black transition-colors">
                    <CheckCircle size={14} /> Pass
                  </button>
                  <button onClick={() => handleAction('Fail')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <XCircle size={14} /> Fail
                  </button>
                  <button onClick={() => handleAction('Needs Coaching')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-xs font-bold text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
                    <TrendingUp size={14} /> Needs Coaching
                  </button>
                  <button onClick={() => handleAction('Escalated')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-xs font-bold text-orange-500 hover:bg-orange-500 hover:text-black transition-colors">
                    <AlertCircle size={14} /> Escalate
                  </button>
                </div>
                <button onClick={() => handleAction('Reviewed')} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
                  <Save size={14} /> Save Review
                </button>
              </>
            )}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
