import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Users, ShieldAlert, Info, Trophy, Send, Link as LinkIcon, Building2, Globe, Lock } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TeamBroadcastModal({ open, onClose }) {
  const { user } = useAuth();
  const isSuperAdmin = user?.scope === 'PLATFORM' || user?.role === 'PLATFORM_ADMIN' || user?.role === 'PLATFORM_OWNER';
  const [step, setStep] = useState(1);
  const [audience, setAudience] = useState('all'); // all, roles, depts, global
  const [type, setType] = useState('announcement'); // alert, announcement, win
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [link, setLink] = useState('');
  const [sending, setSending] = useState(false);
  
  const { addToast } = useToast();

  if (!open) return null;



  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      addToast('success', 'Tenant Broadcast Sent 📢', 'Your message has been delivered to your agency staff and assigned teams.');
      onClose();
      // Reset state for next time
      setTimeout(() => {
        setStep(1);
        setAudience('all');
        setType('announcement');
        setMessage('');
        setSubject('');
        setLink('');
      }, 500);
    }, 1500);
  };

  const types = [
    { id: 'alert', label: 'Urgent Alert', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    { id: 'announcement', label: 'Announcement', icon: Info, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
    { id: 'win', label: 'Goal / Win', icon: Trophy, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' }
  ];

  const audiences = [
    { id: 'all', label: 'Entire Workspace Team', icon: Users, desc: 'All staff in your tenant agency' },
    { id: 'roles', label: 'Specific Team Roles', icon: ShieldAlert, desc: 'E.g., Only your Managers or Agents' },
    { id: 'depts', label: 'Specific Departments', icon: Building2, desc: 'E.g., Only Sales or Support Staff' }
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" 
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-800 shrink-0 bg-gray-900/40 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shrink-0">
                <Radio className="text-orange-500" size={20} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-black text-white text-base sm:text-lg leading-tight">
                    Internal Team Broadcast
                  </h3>
                  {isSuperAdmin ? (
                    <span className="text-[9px] sm:text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-extrabold uppercase shrink-0">Super Admin Global Access</span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full font-extrabold uppercase shrink-0">Tenant Workspace Scope</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Send instant notifications or announcements to your staff members and teams</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-900 rounded-full shrink-0"><X size={18} /></button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            
            {/* PERMISSION EXPLANATION BANNER */}
            <div className="p-3.5 rounded-2xl bg-gray-900/80 border border-gray-800 text-xs flex items-start gap-3">
              {isSuperAdmin ? (
                <>
                  <Globe className="text-purple-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="text-white font-bold block mb-0.5">Super Admin Permission Scope:</strong>
                    <span className="text-gray-300">You have global rights to broadcast messages to <strong className="text-purple-400">All Active Tenants & Employees</strong> platform-wide, or restrict to this workspace.</span>
                  </div>
                </>
              ) : (
                <>
                  <Lock className="text-orange-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="text-white font-bold block mb-0.5">Tenant Administrator Permission Scope:</strong>
                    <span className="text-gray-300">As a Tenant Manager, you can <strong className="text-orange-400">only broadcast to your own agency teams, staff members, and assigned creators/fans</strong>. You cannot send announcements to other external tenants or global platform staff.</span>
                  </div>
                </>
              )}
            </div>

            {/* 1. Select Audience */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-black font-black text-xs flex items-center justify-center">1</div>
                <h4 className="font-extrabold text-white text-sm">Select Target Audience</h4>
              </div>
              <div className={`grid grid-cols-1 ${isSuperAdmin ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
                {audiences.map(a => (
                  <button 
                    key={a.id} 
                    onClick={() => setAudience(a.id)} 
                    className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all ${audience === a.id ? (a.special ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-orange-500/10 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]') : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'}`}
                  >
                    <a.icon size={22} className={`mb-2 ${audience === a.id ? (a.special ? 'text-purple-400' : 'text-orange-500') : 'text-gray-500'}`} />
                    <span className="font-black text-xs mb-1 text-white">{a.label}</span>
                    <span className="text-[10px] text-gray-400 leading-tight">{a.desc}</span>
                  </button>
                ))}
              </div>
              
              {/* Conditional Role/Dept Selection */}
              <AnimatePresence>
                {audience === 'roles' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2 overflow-hidden">
                    <div className="flex flex-wrap gap-2 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                      <span className="text-xs font-bold text-gray-400 mr-2 flex items-center">Target Roles:</span>
                      {['Managers', 'Supervisors', 'Agents', 'VIP Concierge Staff'].map(role => (
                        <button key={role} className="px-3 py-1 rounded-lg border border-gray-700 bg-gray-950 text-xs font-bold text-gray-300 hover:border-orange-500 hover:text-white transition-colors">
                          + {role}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {audience === 'depts' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-2 overflow-hidden">
                    <div className="flex flex-wrap gap-2 bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                      <span className="text-xs font-bold text-gray-400 mr-2 flex items-center">Target Depts:</span>
                      {['Sales Desk', 'Support Desk', 'VIP Creators Team', 'Operations & Escalations'].map(dept => (
                        <button key={dept} className="px-3 py-1 rounded-lg border border-gray-700 bg-gray-950 text-xs font-bold text-gray-300 hover:border-orange-500 hover:text-white transition-colors">
                          + {dept}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Select Type */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-black font-black text-xs flex items-center justify-center">2</div>
                <h4 className="font-extrabold text-white text-sm">Message Priority & Styling</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {types.map(t => (
                  <button key={t.id} onClick={() => setType(t.id)} className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${type === t.id ? `${t.bg} ${t.border} ${t.color} shadow-sm` : 'border-gray-800 text-gray-400 hover:border-gray-700 hover:bg-gray-900/50'}`}>
                    <t.icon size={18} className={type === t.id ? t.color : 'text-gray-500'} />
                    <span className="font-extrabold text-xs text-white">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Compose */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-black font-black text-xs flex items-center justify-center">3</div>
                <h4 className="font-extrabold text-white text-sm">Compose Announcement</h4>
              </div>
              
              <div className="space-y-3 bg-gray-900/40 p-4 rounded-2xl border border-gray-800">
                <div>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Subject Line (e.g., Critical System Update at 2 AM)" 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500 font-bold"
                  />
                </div>
                <div>
                  <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message details here..." 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-500 min-h-[110px] resize-none leading-relaxed custom-scrollbar font-medium"
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 focus-within:border-orange-500 transition-colors">
                  <LinkIcon size={14} className="text-gray-500" />
                  <input 
                    type="text" 
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="Attach optional link (e.g., Zoom meeting or ticket URL)" 
                    className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-gray-500 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-gray-900/60">
            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1.5"><Info size={14} className="text-orange-400 shrink-0"/> Instantly notifies targeted staff in real-time</span>
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={onClose} className="px-4 sm:px-5 py-2.5 rounded-xl border border-gray-800 text-gray-300 text-xs font-bold hover:bg-gray-900 transition-colors whitespace-nowrap">Cancel</button>
              <button 
                onClick={handleSend} 
                disabled={!subject.trim() || !message.trim() || sending}
                className="px-4 sm:px-6 py-2.5 rounded-xl bg-orange-500 text-black text-xs font-black hover:bg-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {sending ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Send size={14} />}
                {sending ? 'Broadcasting...' : audience === 'global' ? 'Broadcast Globally' : 'Broadcast to Tenant'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
