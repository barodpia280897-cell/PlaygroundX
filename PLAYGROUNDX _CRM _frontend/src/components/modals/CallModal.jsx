// src/components/modals/CallModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User, Sparkles } from 'lucide-react';

const recentCalls = [
  { name: 'Maria Gonzalez', flag: '🇪🇸', phone: '+34 612 345 678', type: 'Creator', time: '5m ago', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Carlos Ramirez', flag: '🇲🇽', phone: '+52 55 1234 5678', type: 'Fan', time: '12m ago', avatar: 'https://i.pravatar.cc/150?img=11' },
  { name: 'Jenna Smith', flag: '🇺🇸', phone: '+1 310 555 0123', type: 'Creator', time: '1h ago', avatar: 'https://i.pravatar.cc/150?img=13' },
];

export default function CallModal({ open, onClose, lead }) {
  const [dialValue, setDialValue] = useState('');
  const [calling, setCalling] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (open && lead) {
      setDialValue(lead.phone || '+1 (310) 555-0199');
    } else if (!open) {
      setCallActive(false);
      setCalling(false);
      setElapsed(0);
    }
  }, [open, lead]);

  useEffect(() => {
    if (!callActive) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [callActive]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startCall = () => { setCalling(true); setTimeout(() => { setCalling(false); setCallActive(true); }, 1500); };
  const endCall = () => { setCallActive(false); setCalling(false); setElapsed(0); onClose && onClose(); };

  const pad = (d) => setDialValue(v => v + d);

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
          className="w-full max-w-[380px] bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900/40">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                <Phone size={13} />
              </div>
              <span className="font-bold text-white text-sm">Live Voice Console</span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white"><X size={16} /></button>
          </div>

          {lead && !callActive && (
            <div className="mx-5 mt-4 p-3 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/50 border border-gray-800 flex items-center gap-3">
              {lead.avatar ? (
                <img src={lead.avatar} className="w-11 h-11 rounded-full border border-gray-700 object-cover shrink-0" alt="" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-neon-blue/20 text-neon-blue flex items-center justify-center font-black text-sm shrink-0">
                  {lead.name?.[0] || 'V'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                  {lead.name || 'VIP Client'} {lead.flag || '🌐'}
                </div>
                <div className="text-[10px] text-gray-400 font-medium truncate">
                  {lead.stage || lead.status || lead.type || 'Priority Tier Member'} • <span className="text-neon-green font-mono">{lead.phone || '+1 (310) 555-0199'}</span>
                </div>
              </div>
            </div>
          )}

          {callActive ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-neon-green/10 border-2 border-neon-green/50 flex items-center justify-center animate-pulse relative">
                {lead?.avatar ? (
                  <img src={lead.avatar} className="w-16 h-16 rounded-full object-cover" alt="" />
                ) : (
                  <Phone size={28} className="text-neon-green" />
                )}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neon-green text-black flex items-center justify-center text-[10px] font-black">✓</span>
              </div>
              <div>
                <div className="text-white font-extrabold text-base">{lead?.name || 'Call in Progress'}</div>
                <div className="text-neon-green font-mono text-3xl font-black mt-1">{fmt(elapsed)}</div>
                <div className="text-gray-400 text-xs font-mono mt-1">{dialValue || '+1 (310) 555-0199'}</div>
              </div>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button onClick={() => setMuted(!muted)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-red-500/20 border border-red-500/40' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'}`}>
                  {muted ? <MicOff size={18} className="text-red-400" /> : <Mic size={18} className="text-gray-300" />}
                </button>
                <button onClick={endCall} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all scale-105">
                  <PhoneOff size={22} className="text-white" />
                </button>
                <button onClick={() => setVideoOn(!videoOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-neon-blue/20 border border-neon-blue/40' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'}`}>
                  {videoOn ? <Video size={18} className="text-neon-blue" /> : <VideoOff size={18} className="text-gray-300" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Number input */}
              <input value={dialValue} onChange={e => setDialValue(e.target.value)}
                placeholder="Enter phone number..." readOnly={calling}
                className="w-full bg-gray-900/80 border border-gray-800 rounded-2xl px-4 py-3.5 text-white text-center text-lg font-mono font-bold focus:outline-none focus:border-neon-green/50 tracking-widest shadow-inner"
              />

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2">
                {['1','2','3','4','5','6','7','8','9','*','0','#'].map(d => (
                  <button key={d} onClick={() => pad(d)}
                    className="py-3 rounded-2xl bg-gray-900 hover:bg-gray-800 border border-gray-800/80 text-white font-extrabold text-base transition-all active:scale-95 shadow-sm">
                    {d}
                  </button>
                ))}
              </div>

              {/* Call button */}
              <button onClick={startCall} disabled={calling}
                className="w-full py-3.5 rounded-2xl bg-neon-green text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all disabled:opacity-70">
                {calling ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Phone size={18} />}
                {calling ? 'Connecting Call...' : `Dial ${lead?.name ? lead.name.split(' ')[0] : 'Number'}`}
              </button>

              {/* Recent calls */}
              {!lead && (
                <div>
                  <div className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Quick Dial Contacts</div>
                  <div className="space-y-1.5">
                    {recentCalls.map(c => (
                      <button key={c.name} onClick={() => setDialValue(c.phone)}
                        className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors text-left border border-transparent hover:border-gray-800">
                        <img src={c.avatar} className="w-8 h-8 rounded-full border border-gray-700 object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-200 truncate">{c.name} {c.flag}</div>
                          <div className="text-[10px] text-gray-500 font-mono">{c.phone} · {c.time}</div>
                        </div>
                        <Phone size={12} className="text-neon-green shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
