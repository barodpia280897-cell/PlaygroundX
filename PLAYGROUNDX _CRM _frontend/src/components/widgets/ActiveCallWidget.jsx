import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Phone, PhoneOff, Mic, MicOff, Pause, Play, UserPlus, 
  Settings, Users, FileText, CheckCircle2, ChevronDown, ChevronUp, Bot,
  Clock, ShieldAlert, History, User
} from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';

const callOutcomes = [
  'Issue Resolved', 'Follow-up Required', 'Sale Completed', 
  'Left Voicemail', 'Not Interested', 'Escalated to Manager'
];

export default function ActiveCallWidget({ open, onClose, targetMember }) {
  const [leads] = useDataStore('leads');
  const [dialValue, setDialValue] = useState('');
  const [callState, setCallState] = useState('idle'); // idle, incoming, dialing, active, wrapup
  const [elapsed, setElapsed] = useState(0);
  
  // Call Controls
  const [muted, setMuted] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [recording, setRecording] = useState(true);
  
  // Panel Toggles
  const [activeTab, setActiveTab] = useState('info'); // info, history, notes, ai
  const [notes, setNotes] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  
  // Active Lead (Mock detection based on number or random)
  const activeLead = targetMember ? {
    name: targetMember.name || 'VIP Client',
    company: targetMember.company || targetMember.flag || targetMember.country || 'Global VIP',
    email: targetMember.email || `${(targetMember.name || 'client').toLowerCase().replace(/\s+/g, '.')}@pgx.vip`,
    phone: targetMember.phone || '+1 310 555 0123',
    status: targetMember.status || 'Active',
    avatar: targetMember.avatar || 'https://i.pravatar.cc/150?img=13',
    type: targetMember.memberType || targetMember.type || 'VIP Customer',
    value: targetMember.value || '$5,000',
    tags: ['VIP', targetMember.score ? `Score: ${targetMember.score}` : 'High Priority']
  } : (leads?.[0] || {
    name: 'Jenna Smith',
    company: 'Alpha Creatives',
    email: 'jenna@alphacreatives.com',
    phone: '+1 310 555 0123',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=13',
    type: 'Creator',
    value: '$4,800',
    tags: ['VIP', 'High Priority']
  });

  useEffect(() => {
    if (open) {
      if (targetMember && targetMember.phone) {
        setDialValue(targetMember.phone);
      } else if (!dialValue && leads?.[0]?.phone) {
        setDialValue(leads[0].phone);
      }
    }
  }, [open, targetMember, leads]);

  useEffect(() => {
    let t;
    if (callState === 'active' && !onHold) {
      t = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(t);
  }, [callState, onHold]);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const startCall = () => {
    if (!dialValue) return;
    setCallState('dialing');
    setTimeout(() => {
      setCallState('active');
    }, 2000);
  };

  const endCall = () => {
    setCallState('wrapup');
  };

  const finishWrapUp = () => {
    setCallState('idle');
    setElapsed(0);
    setDialValue('');
    setNotes('');
    setSelectedOutcome('');
    onClose();
  };

  // Simulated AI Transcription
  const transcriptRef = useRef(null);
  const [transcript, setTranscript] = useState([
    { speaker: 'AI', text: 'Call recording started.', time: '00:00', type: 'system' }
  ]);

  useEffect(() => {
    if (callState === 'active' && !onHold) {
      const interval = setInterval(() => {
        setTranscript(prev => [
          ...prev, 
          { speaker: 'Customer', text: 'Hello, I have a question about my recent payout.', time: fmt(elapsed), type: 'customer' },
          { speaker: 'Agent', text: 'I can certainly help you with that. Let me pull up your account.', time: fmt(elapsed + 2), type: 'agent' }
        ]);
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [callState, onHold, elapsed]);

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const pad = (d) => setDialValue(v => v + d);

  if (!open && callState === 'idle') return null;

  return (
    <AnimatePresence>
      {(open || callState !== 'idle') && (
        <motion.div 
          initial={{ x: 400, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 right-4 z-50 flex flex-col pointer-events-none"
        >
          {/* Main Widget Container */}
          <div className="w-[380px] bg-[#06080F]/95 backdrop-blur-2xl border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${callState === 'active' ? 'bg-neon-green animate-pulse' : callState === 'wrapup' ? 'bg-neon-pink' : 'bg-neon-blue'}`} />
                <span className="font-bold text-white text-sm">
                  {callState === 'idle' ? 'Dialer' : callState === 'incoming' ? 'Incoming Call' : callState === 'dialing' ? 'Dialing...' : callState === 'active' ? 'Active Call' : 'Wrap-up'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {recording && callState === 'active' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-neon-pink font-bold bg-neon-pink/10 px-2 py-0.5 rounded border border-neon-pink/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse" />
                    REC
                  </div>
                )}
                {callState === 'idle' && (
                  <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              
              {/* DIALER STATE */}
              {callState === 'idle' && (
                <div className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <input 
                      value={dialValue} 
                      onChange={e => setDialValue(e.target.value)}
                      placeholder="Enter number..." 
                      className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-lg font-mono focus:outline-none focus:border-neon-blue/50 tracking-widest mb-6"
                    />
                    <div className="grid grid-cols-3 gap-3 mb-6 px-4">
                      {['1','2','3','4','5','6','7','8','9','*','0','#'].map(d => (
                        <button key={d} onClick={() => pad(d)}
                          className="py-3 rounded-full bg-gray-800/80 hover:bg-gray-700 text-white font-bold text-lg transition-colors active:scale-95 shadow-inner">
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={startCall} disabled={!dialValue}
                    className="w-full py-3.5 rounded-xl bg-neon-green text-black font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Phone size={18} className="fill-black" /> Call
                  </button>
                </div>
              )}

              {/* ACTIVE / DIALING STATE */}
              {(callState === 'active' || callState === 'dialing') && (
                <div className="flex flex-col h-full">
                  {/* Caller Info */}
                  <div className="p-5 flex flex-col items-center justify-center border-b border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-transparent relative">
                    <div className="absolute top-4 right-4 text-2xl font-mono font-bold text-neon-green">{fmt(elapsed)}</div>
                    
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full border-2 border-gray-700 overflow-hidden relative z-10 bg-gray-800">
                        <img src={activeLead.avatar} alt="Caller" className="w-full h-full object-cover" />
                      </div>
                      {callState === 'active' && !onHold && (
                        <div className="absolute inset-0 rounded-full border-2 border-neon-green animate-ping opacity-50 z-0" />
                      )}
                    </div>
                    <h3 className="text-xl font-black text-white">{activeLead.name}</h3>
                    <div className="text-xs text-neon-blue font-bold uppercase tracking-wider mt-1">{activeLead.type} • {activeLead.company}</div>
                    <div className="text-sm text-gray-400 mt-1 font-mono">{activeLead.phone}</div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-800">
                    <button onClick={() => setActiveTab('info')} className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Info</button>
                    <button onClick={() => setActiveTab('ai')} className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold border-b-2 transition-colors ${activeTab === 'ai' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>AI Live</button>
                    <button onClick={() => setActiveTab('notes')} className={`flex-1 py-2 text-[10px] uppercase tracking-wider font-bold border-b-2 transition-colors ${activeTab === 'notes' ? 'border-neon-pink text-neon-pink' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Notes</button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 p-4 min-h-[150px] overflow-y-auto custom-scrollbar">
                    {activeTab === 'info' && (
                      <div className="space-y-4">
                        <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Lead Details</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-gray-400">Value:</div><div className="text-white font-bold text-right">{activeLead.value}</div>
                            <div className="text-gray-400">Status:</div><div className="text-white font-bold text-right">{activeLead.status}</div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {activeLead.tags.map(t => <span key={t} className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-300">{t}</span>)}
                          </div>
                        </div>
                        <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                          <div className="text-[10px] text-gray-500 uppercase font-bold mb-2">Recent Interactions</div>
                          <div className="text-xs text-gray-300 space-y-2">
                            <div className="flex items-center gap-2"><Clock size={10} className="text-neon-blue"/> 2 days ago - Email Sent</div>
                            <div className="flex items-center gap-2"><Phone size={10} className="text-neon-green"/> 5 days ago - Outbound Call (3m)</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'ai' && (
                      <div className="space-y-3 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot size={14} className="text-neon-purple" />
                          <span className="text-xs font-bold text-neon-purple">Live Transcription</span>
                        </div>
                        <div ref={transcriptRef} className="flex-1 overflow-y-auto space-y-2 pr-2">
                          {transcript.map((msg, i) => (
                            <div key={i} className={`text-xs p-2 rounded-lg ${msg.type === 'system' ? 'bg-gray-800 text-gray-400 text-center text-[10px]' : msg.type === 'agent' ? 'bg-neon-blue/10 border border-neon-blue/20 ml-4' : 'bg-gray-800 mr-4'}`}>
                              {msg.type !== 'system' && <div className="text-[9px] font-bold text-gray-500 mb-1">{msg.speaker} <span className="float-right">{msg.time}</span></div>}
                              <div className={msg.type === 'system' ? 'italic' : 'text-gray-200'}>{msg.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="h-full flex flex-col">
                        <textarea 
                          value={notes} 
                          onChange={e => setNotes(e.target.value)}
                          placeholder="Type live call notes here..."
                          className="flex-1 bg-gray-900/80 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-neon-blue/50 resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Call Controls */}
                  <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button onClick={() => setMuted(!muted)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${muted ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/40' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title="Mute">
                        {muted ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>
                      <button onClick={() => setOnHold(!onHold)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${onHold ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/40' : 'bg-gray-800 text-white hover:bg-gray-700'}`} title="Hold">
                        {onHold ? <Play size={16} className="fill-yellow-500" /> : <Pause size={16} className="fill-white" />}
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center transition-all" title="Transfer">
                        <Users size={16} />
                      </button>
                    </div>
                    
                    <button onClick={endCall} className="h-10 px-6 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all">
                      <PhoneOff size={16} /> End
                    </button>
                  </div>
                </div>
              )}

              {/* WRAP-UP STATE */}
              {callState === 'wrapup' && (
                <div className="p-5 flex flex-col h-full">
                  <div className="text-center mb-5">
                    <h3 className="text-lg font-black text-white">Call Wrap-up</h3>
                    <div className="text-xs text-gray-400 mt-1">Duration: <span className="text-white font-mono">{fmt(elapsed)}</span></div>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Call Outcome</label>
                      <div className="grid grid-cols-2 gap-2">
                        {callOutcomes.map(out => (
                          <button 
                            key={out}
                            onClick={() => setSelectedOutcome(out)}
                            className={`text-xs py-2 px-2 rounded-lg border transition-all ${selectedOutcome === out ? 'bg-neon-blue/20 border-neon-blue text-neon-blue' : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'}`}
                          >
                            {out}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Final Notes</label>
                      <textarea 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Add any final notes..."
                        className="w-full h-24 bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-neon-blue/50 resize-none"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={finishWrapUp} 
                    disabled={!selectedOutcome}
                    className="w-full mt-4 py-3 rounded-xl bg-neon-blue text-background font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} /> Complete Wrap-up
                  </button>
                </div>
              )}

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
