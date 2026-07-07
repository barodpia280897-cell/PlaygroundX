import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Target, Activity, Calendar, Tag, Shield } from 'lucide-react';

export default function ProfileModal({ open, onClose, lead }) {
  if (!open || !lead) return null;

  const mockTimeline = [
    { title: 'Chat Escalated', date: 'Today, 10:45 AM', type: 'escalation' },
    { title: 'Utility Bill Rejected', date: 'Today, 10:32 AM', type: 'system' },
    { title: 'Account Registration', date: 'Yesterday, 4:20 PM', type: 'event' }
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800/80 bg-gray-900/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <img src={lead.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-neon-blue/50" />
                <span className="absolute -bottom-1 -right-1 text-lg">{lead.flag}</span>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{lead.name}</h2>
                <div className="text-xs text-neon-blue font-bold flex items-center gap-1.5 mt-0.5">
                  <Shield size={12} /> {lead.type} Lead
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors relative z-10"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Contact Information</h3>
                <div className="space-y-3 glass-panel p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-200">{lead.name.toLowerCase().replace(' ', '.')}@example.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-200">+1 234 567 8900</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-gray-200">Global Region {lead.flag}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">CRM Data</h3>
                <div className="space-y-3 glass-panel p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Target size={14}/> Lead Score</span>
                    <span className="font-black text-neon-blue">120</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Activity size={14}/> Current Status</span>
                    <span className="font-bold text-white bg-gray-800 px-2 py-0.5 rounded border border-gray-700">{lead.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><User size={14}/> Assigned Agent</span>
                    <span className="font-medium text-gray-200">{lead.agent}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-2"><Calendar size={14}/> Joined Date</span>
                    <span className="font-medium text-gray-200">Oct 12, 2025</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-xs font-bold flex items-center gap-1.5"><Tag size={10} /> High Value</span>
                  <span className="px-2.5 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold flex items-center gap-1.5"><Tag size={10} /> KYC Pending</span>
                  <span className="px-2.5 py-1 rounded bg-neon-blue/20 border border-neon-blue/30 text-neon-blue text-xs font-bold flex items-center gap-1.5"><Tag size={10} /> Inbound</span>
                </div>
              </div>
            </div>

            {/* Right Column: Timeline */}
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Recent Activity</h3>
              <div className="glass-panel p-5 relative">
                <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-800/50" />
                <div className="space-y-6">
                  {mockTimeline.map((item, i) => (
                    <div key={i} className="flex gap-4 relative z-10">
                      <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${item.type === 'escalation' ? 'bg-neon-pink shadow-[0_0_8px_rgba(255,0,85,0.5)]' : item.type === 'system' ? 'bg-yellow-400' : 'bg-neon-blue'}`} />
                      <div>
                        <div className="text-sm font-bold text-gray-200">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
