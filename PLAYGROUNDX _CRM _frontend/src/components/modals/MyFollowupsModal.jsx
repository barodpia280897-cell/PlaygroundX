// src/components/modals/MyFollowupsModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarPlus, CheckCircle, Clock, AlertCircle, MessageSquare, Phone, User, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function MyFollowupsModal({ open, onClose }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [followups, setFollowups] = useState([
    {
      id: 'f-1',
      name: 'Li Wei',
      country: '🇨🇳',
      type: 'Creator',
      phone: '+1 (555) 382-9102',
      task: 'Call back to finalize VIP Commission structure & streaming setup',
      dueTime: 'Today, 3:00 PM',
      urgency: 'High',
      completed: false
    },
    {
      id: 'f-2',
      name: 'Maria Gonzalez',
      country: '🇪🇸',
      type: 'Creator',
      phone: '+1 (555) 921-8834',
      task: 'Verify uploaded government ID passport documentation for fast-track',
      dueTime: 'Today, 4:30 PM',
      urgency: 'High',
      completed: false
    },
    {
      id: 'f-3',
      name: 'Ahmed Al-Fayed',
      country: '🇦🇪',
      type: 'VIP Fan',
      phone: '+1 (555) 491-8821',
      task: 'WhatsApp reachout regarding VIP high-roller deposit bonus tournament',
      dueTime: 'Tomorrow, 11:00 AM',
      urgency: 'Medium',
      completed: false
    },
    {
      id: 'f-4',
      name: 'Sarah Mitchell',
      country: '🇺🇸',
      type: 'Lead',
      phone: '+1 (555) 019-2834',
      task: 'Initial KYC onboarding welcome call and account verification walkthrough',
      dueTime: 'Tomorrow, 2:00 PM',
      urgency: 'Normal',
      completed: false
    }
  ]);

  const [filter, setFilter] = useState('All');

  if (!open) return null;

  const handleMarkCompleted = (id, name) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, completed: !f.completed } : f));
    addToast('success', 'Follow-up Marked Completed! ✅', `Task for ${name} has been updated in your queue.`);
  };

  const filteredList = followups.filter(f => {
    if (filter === 'Pending' && f.completed) return false;
    if (filter === 'Completed' && !f.completed) return false;
    if (filter === 'High Urgency' && f.urgency !== 'High') return false;
    return true;
  });

  const pendingCount = followups.filter(f => !f.completed).length;

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
          className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/60 shrink-0">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CalendarPlus className="text-neon-green" size={18} /> My Follow-ups & Reminders
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage your scheduled callbacks, KYC document verifications, and VIP reachouts.
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 shrink-0">
              <X size={18} />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="p-4 border-b border-gray-800/80 bg-gray-900/30 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['All', 'Pending', 'High Urgency', 'Completed'].map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${filter === tab ? 'bg-neon-green/20 text-neon-green border-neon-green/40 shadow-[0_0_10px_rgba(57,255,20,0.2)]' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-gray-400 shrink-0">
              <span className="text-neon-green">{pendingCount}</span> pending task{pendingCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Followups List */}
          <div className="p-4 overflow-y-auto custom-scrollbar space-y-3 flex-1">
            {filteredList.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                <CheckCircle size={36} className="mx-auto mb-2 opacity-30 text-neon-green" />
                No follow-up tasks found matching this filter.
              </div>
            ) : (
              filteredList.map((f) => (
                <div
                  key={f.id}
                  className={`p-4 bg-gray-900/60 border rounded-xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${f.completed ? 'border-gray-800/60 opacity-60 bg-gray-950/40' : 'border-gray-800 hover:border-gray-700'}`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => handleMarkCompleted(f.id, f.name)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all ${f.completed ? 'bg-neon-green border-neon-green text-black' : 'border-gray-700 hover:border-neon-green text-transparent hover:text-neon-green/30'}`}
                      title={f.completed ? 'Mark pending' : 'Mark completed'}
                    >
                      <CheckCircle size={14} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-bold text-white flex items-center gap-1.5 ${f.completed ? 'line-through text-gray-400' : ''}`}>
                          {f.name} <span className="text-xs">{f.country}</span>
                        </h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                          f.type === 'Creator' ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30' :
                          f.type === 'VIP Fan' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                        }`}>
                          {f.type}
                        </span>
                        {f.urgency === 'High' && !f.completed && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30 flex items-center gap-1">
                            ⚡ High Urgency
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 font-medium ${f.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                        {f.task}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500 font-medium">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock size={12} className="text-neon-green" /> Due: {f.dueTime}
                        </span>
                        <span>•</span>
                        <span>{f.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-800/80 shrink-0">
                    <button
                      type="button"
                      onClick={() => addToast('info', 'Starting Reachout', `Opening chat composer for ${f.name}...`)}
                      className="px-3 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-black text-[#25D366] border border-[#25D366]/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <MessageSquare size={13} /> Chat
                    </button>
                    <button
                      type="button"
                      onClick={() => addToast('info', 'Calling Customer', `Initiating call to ${f.name} (${f.phone})...`)}
                      className="px-3 py-1.5 bg-neon-blue/10 hover:bg-neon-blue hover:text-black text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Phone size={13} /> Call
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center shrink-0">
            <span className="text-xs text-gray-400 font-medium">
              Showing {filteredList.length} of {followups.length} scheduled follow-ups
            </span>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
