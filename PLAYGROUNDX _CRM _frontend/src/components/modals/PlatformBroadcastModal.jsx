import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio, Building2, ShieldAlert, Globe, Server, Send, LayoutTemplate } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function PlatformBroadcastModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [audience, setAudience] = useState(['all']); // Array for multi-select
  const [type, setType] = useState('maintenance'); // maintenance, update, alert
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  
  const { addToast } = useToast();

  if (!open) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      addToast('success', 'Global Broadcast Sent 🌐', `System-wide message delivered to selected tenant audience.`);
      onClose();
      setTimeout(() => {
        setStep(1);
        setAudience(['all']);
        setType('maintenance');
        setMessage('');
        setSubject('');
      }, 500);
    }, 1500);
  };

  const types = [
    { id: 'maintenance', label: 'System Maintenance', icon: Server, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    { id: 'update', label: 'Platform Update', icon: LayoutTemplate, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
    { id: 'alert', label: 'Critical Alert', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
  ];

  const audiences = [
    { id: 'all', label: 'All Active Tenants', icon: Globe, desc: 'Every registered company workspace.' },
    { id: 'enterprise', label: 'Enterprise Tier', icon: Building2, desc: 'Only premium/enterprise SLA tenants.' },
    { id: 'trial', label: 'Trial Accounts', icon: Radio, desc: 'Tenants currently on a 14-day free trial.' }
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-[#0a0c10] border border-[#21262d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-[#21262d] flex items-center justify-between shrink-0 bg-[#0d1117] gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <Globe size={20} className="text-red-500" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight">Global Platform Broadcast</h2>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 uppercase tracking-widest shrink-0">Super Admin Scope</span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Send critical system-wide notifications to tenant organizations.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-xl transition-colors shrink-0">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            {/* Warning Banner */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldAlert size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-red-400">Global Communication Scope</div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed">
                  You are broadcasting from the Platform layer. This message will be sent to the administrators and users of the selected tenant organizations across the entire infrastructure. This bypasses internal company walls.
                </div>
              </div>
            </div>

            {/* Step 1: Audience */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold text-gray-300">1</div>
                <h3 className="text-sm font-bold text-white">Select Target Tenant Audience</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-8">
                {audiences.map(aud => {
                  const Icon = aud.icon;
                  const isActive = audience.includes(aud.id) || (aud.id !== 'all' && audience.includes('all'));
                  
                  const handleToggle = () => {
                    if (aud.id === 'all') {
                      setAudience(['all']);
                    } else {
                      let newAud = audience.filter(a => a !== 'all');
                      if (newAud.includes(aud.id)) {
                        newAud = newAud.filter(a => a !== aud.id);
                        if (newAud.length === 0) newAud = ['all'];
                      } else {
                        newAud.push(aud.id);
                      }
                      setAudience(newAud);
                    }
                  };

                  return (
                    <button key={aud.id} onClick={handleToggle}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col h-full whitespace-normal ${
                        isActive ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'bg-[#0d1117] border-[#21262d] hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 w-full">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isActive ? 'border-red-500 bg-red-500' : 'border-[#21262d] bg-[#0d1117]'}`}>
                          {isActive && <X size={10} className="text-white" style={{ clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />}
                        </div>
                        <Icon size={16} className={isActive ? 'text-red-500' : 'text-gray-400'} />
                        <span className={`text-sm font-bold truncate ${isActive ? 'text-red-400' : 'text-white'}`}>{aud.label}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 leading-tight mt-auto">{aud.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Message Type */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold text-gray-300">2</div>
                <h3 className="text-sm font-bold text-white">Broadcast Category</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-8">
                {types.map(t => {
                  const Icon = t.icon;
                  const isActive = type === t.id;
                  return (
                    <button key={t.id} onClick={() => setType(t.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isActive ? `bg-[#0d1117] ${t.border}` : 'bg-[#0d1117] border-[#21262d] hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? t.bg : 'bg-[#21262d]'}`}>
                        <Icon size={14} className={isActive ? t.color : 'text-gray-400'} />
                      </div>
                      <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Compose */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#21262d] flex items-center justify-center text-xs font-bold text-gray-300">3</div>
                <h3 className="text-sm font-bold text-white">Compose Global Message</h3>
              </div>
              <div className="pl-8 space-y-4">
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Subject Line (e.g., Scheduled Maintenance at 02:00 UTC)"
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
                />
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your system-wide announcement here... This will appear on all tenant dashboards."
                  rows={4}
                  className="w-full bg-[#0d1117] border border-[#21262d] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 border-t border-[#21262d] bg-[#0d1117] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <ShieldAlert size={12} className="text-red-500 shrink-0" /> System-wide execution
            </div>
            <div className="flex gap-3 ml-auto">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                Cancel
              </button>
              <button 
                onClick={handleSend}
                disabled={!subject || !message || sending}
                className="px-4 sm:px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {sending ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deploying...</span>
                ) : (
                  <span className="flex items-center gap-2"><Send size={16} /> Broadcast to Network</span>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
