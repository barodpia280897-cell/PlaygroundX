import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Eye, Mic, PhoneCall, AlertCircle, Shuffle, ShieldAlert, Users, PhoneOff, MessageSquare, Clock, BarChart2, MicOff, Radio, Volume2, X, CheckCircle, RefreshCw } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';

const KPICard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-lg flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}/10 border border-${color}/20 text-${color} shrink-0`}>
      <Icon size={20} />
    </div>
    <div>
      <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{title}</div>
      <div className="text-xl font-black text-white leading-tight">{value}</div>
    </div>
  </motion.div>
);

export default function SupervisorMonitoring() {
  const [agentsStore, setAgentsStore] = useDataStore('agents');
  const [leads] = useDataStore('leads');
  const { addToast } = useToast();
  
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeSession, setActiveSession] = useState(null); // { type: 'Silent Listen' | 'Whisper' | 'Barge In', agent: Object, seconds: 0, isMuted: false }
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [targetDepartment, setTargetDepartment] = useState('VIP Creators');

  // Live session timer effect
  useEffect(() => {
    let interval = null;
    if (activeSession) {
      interval = setInterval(() => {
        setActiveSession(prev => prev ? { ...prev, seconds: prev.seconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartSession = (actionName) => {
    if (!selectedAgent) return;
    setActiveSession({
      type: actionName,
      agent: selectedAgent,
      seconds: 0,
      isMuted: actionName === 'Silent Listen'
    });
    addToast('success', `${actionName} Session Active`, `Connected to secure audio bridge with ${selectedAgent.name}.`);
  };

  const handleEndSession = () => {
    if (activeSession) {
      addToast('info', 'Session Terminated', `Disconnected from ${activeSession.agent.name}. Duration: ${formatSeconds(activeSession.seconds)}`);
      setActiveSession(null);
    }
  };

  const handleReassignAgent = () => {
    if (!selectedAgent) return;
    setAgentsStore(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        return { ...a, department: targetDepartment, queue: targetDepartment };
      }
      return a;
    }));
    setSelectedAgent(prev => prev ? { ...prev, department: targetDepartment, queue: targetDepartment } : null);
    setShowReassignModal(false);
    addToast('success', 'Floor Reassigned', `${selectedAgent.name} moved to ${targetDepartment} queue.`);
  };

  const handleForceStatus = (newStatus) => {
    if (!selectedAgent) return;
    setAgentsStore(prev => prev.map(a => {
      if (a.id === selectedAgent.id) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
    setSelectedAgent(prev => prev ? { ...prev, status: newStatus } : null);
    addToast('info', 'Agent Status Forced', `${selectedAgent.name} status remotely set to ${newStatus}.`);
  };

  // Derive KPIs
  const activeAgents = agentsStore?.length || 0;
  const availableAgents = agentsStore?.filter(a => a.status === 'Available').length || 0;
  const onCall = agentsStore?.filter(a => a.status === 'On Call').length || 0;
  const onBreak = agentsStore?.filter(a => a.status === 'On Break').length || 0;
  const escalatedCases = agentsStore?.filter(a => a.critical).length || 0;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-12 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-neon-purple/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Eye size={20} className="text-neon-purple" />
            </div>
            Supervisor Floor Monitor
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Live audio whisper, 3-way conference barge-in, and remote staff control suite.</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs font-black text-neon-green uppercase tracking-wider">Secure Telephony Bridge Connected</span>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <KPICard title="Total Staff" value={activeAgents} icon={Users} color="neon-blue" delay={0.05} />
        <KPICard title="Available" value={availableAgents} icon={Headphones} color="neon-green" delay={0.1} />
        <KPICard title="On Call" value={onCall} icon={PhoneCall} color="yellow-500" delay={0.15} />
        <KPICard title="On Break" value={onBreak} icon={PhoneOff} color="gray-400" delay={0.2} />
        <KPICard title="Queue Length" value="18" icon={Users} color="neon-purple" delay={0.25} />
        <KPICard title="Avg Wait" value="02:15" icon={Clock} color="neon-blue" delay={0.3} />
        <KPICard title="SLA Status" value="94%" icon={BarChart2} color="neon-green" delay={0.35} />
        <KPICard title="Escalated" value={escalatedCases} icon={ShieldAlert} color="neon-pink" delay={0.4} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Active Floor List (Agent Grid) */}
        <div className="lg:w-2/3 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/80">
            <h2 className="font-bold text-white flex items-center gap-2">Live Floor Staff Grid</h2>
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-neon-green/10 text-neon-green border border-neon-green/20">VIP Queue: 3</span>
              <span className="px-2.5 py-1 rounded-lg bg-neon-blue/10 text-neon-blue border border-neon-blue/20">General: 12</span>
              <span className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">KYC: 3</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agentsStore?.map((agent) => {
                const currentCustomer = agent.currentLeadId ? leads?.find(l => l.id === agent.currentLeadId)?.name : null;
                const isSelected = selectedAgent?.id === agent.id;
                const isMonitored = activeSession?.agent.id === agent.id;
                
                return (
                  <div 
                    key={agent.id}
                    onClick={() => setSelectedAgent({...agent, customerName: currentCustomer})}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col relative
                      ${isSelected ? 'bg-gray-800/90 border-neon-blue shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-[1.02]' : 'bg-gray-900/40 border-gray-700/60 hover:bg-gray-800/60 hover:border-gray-600 shadow-lg'}
                      ${agent.critical ? 'border-neon-pink/70 shadow-[0_0_15px_rgba(255,0,85,0.25)]' : ''}
                    `}
                  >
                    {isMonitored && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider animate-pulse">
                        <Radio size={10} /> Live {activeSession.type}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={agent.avatar} alt={agent.name} className="w-11 h-11 rounded-full border-2 border-gray-700 object-cover" />
                          {agent.status === 'On Call' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-gray-900 flex items-center justify-center animate-pulse"><PhoneCall size={8} className="text-black" /></div>}
                          {agent.status === 'Chatting' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neon-blue rounded-full border-2 border-gray-900 flex items-center justify-center"><MessageSquare size={8} className="text-black" /></div>}
                          {agent.status === 'Available' && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-neon-green rounded-full border-2 border-gray-900" />}
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-sm flex items-center gap-2">
                            {agent.name}
                            {agent.critical && <span className="bg-neon-pink text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase font-black">Escalated</span>}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">{agent.department || 'VIP Sales'} • {agent.queue || 'VIP'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-block uppercase tracking-wider whitespace-nowrap
                          ${agent.status === 'Available' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                            agent.status === 'On Call' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' :
                            agent.status === 'On Break' ? 'bg-gray-800 text-gray-400 border-gray-700' :
                            'bg-blue-500/15 text-neon-blue border-blue-500/30'}
                        `}>{agent.status}</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/40 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs border border-gray-700/60 shadow-inner">
                      <div>
                        <div className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">Current Customer</div>
                        {currentCustomer ? (
                          <div className="font-black text-neon-blue truncate">{currentCustomer}</div>
                        ) : (
                          <div className="text-gray-400 italic">No active call</div>
                        )}
                      </div>
                      <div>
                        <div className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">Duration</div>
                        <div className="font-mono text-gray-200 font-bold">{agent.duration || '00:00'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">Today's Traffic</div>
                        <div className="text-gray-300 font-semibold">{agent.callsToday || 14} Calls / {agent.chatsToday || 8} Chats</div>
                      </div>
                      <div>
                        <div className="text-gray-500 text-[9px] uppercase font-bold mb-0.5">SLA / Score</div>
                        <div className="text-neon-green font-extrabold">{agent.slaPercent || 94}% / {agent.performanceScore || 92}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:w-1/3 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          <div className="px-5 py-4 border-b border-gray-800 bg-gray-950/80 flex items-center justify-between">
            <h2 className="font-bold text-white">Supervisor Command Desk</h2>
            {selectedAgent && <span className="text-[10px] text-neon-blue font-mono">ID #{selectedAgent.id}</span>}
          </div>
          
          <div className="p-5 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            {selectedAgent ? (
              <div className="h-full flex flex-col space-y-6">
                
                <div className="text-center bg-gray-950/60 p-4 rounded-2xl border border-gray-800">
                  <img src={selectedAgent.avatar} className="w-20 h-20 rounded-full mx-auto border-2 border-neon-purple mb-3 object-cover shadow-lg" alt="" />
                  <h3 className="text-lg font-black text-white">{selectedAgent.name}</h3>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">{selectedAgent.status} {selectedAgent.customerName ? `with ${selectedAgent.customerName}` : ''}</p>
                </div>

                {selectedAgent.status === 'On Call' || selectedAgent.status === 'Chatting' ? (
                  <div className="space-y-3 flex-1">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center mb-2">Live Audio Interventions</div>
                    
                    <button 
                      onClick={() => handleStartSession('Silent Listen')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${activeSession?.type === 'Silent Listen' && activeSession.agent.id === selectedAgent.id ? 'bg-neon-blue/20 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 shadow-md hover:border-neon-blue/50'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center"><Headphones size={18} className="text-neon-blue" /></div>
                        <div className="text-left"><div className="text-sm font-black text-white group-hover:text-neon-blue transition-colors">Silent Listen</div><div className="text-[10px] text-gray-300">Hear agent & customer without them knowing</div></div>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleStartSession('Whisper')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${activeSession?.type === 'Whisper' && activeSession.agent.id === selectedAgent.id ? 'bg-neon-purple/20 border-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-gray-800 hover:bg-gray-700 border-gray-600 shadow-md hover:border-neon-purple/50'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-700 flex items-center justify-center"><Mic size={18} className="text-neon-purple" /></div>
                        <div className="text-left"><div className="text-sm font-black text-white group-hover:text-neon-purple transition-colors">Whisper to Agent</div><div className="text-[10px] text-gray-300">Only agent hears your voice guidance</div></div>
                      </div>
                    </button>

                    <button 
                      onClick={() => handleStartSession('Barge In')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${activeSession?.type === 'Barge In' && activeSession.agent.id === selectedAgent.id ? 'bg-red-500/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40 shadow-md hover:border-red-400'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><AlertCircle size={18} className="text-red-400" /></div>
                        <div className="text-left"><div className="text-sm font-black text-red-300 group-hover:text-red-200 transition-colors">Barge In (3-Way)</div><div className="text-[10px] text-red-200/80">Join live conversation as supervisor</div></div>
                      </div>
                    </button>

                    <div className="pt-3 border-t border-gray-700/50 space-y-2">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Remote Floor Control</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => { setTargetDepartment(selectedAgent.department || 'VIP Creators'); setShowReassignModal(true); }}
                          className="py-2.5 rounded-xl text-xs font-black text-white bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <Shuffle size={14} className="text-gray-300" /> Reassign Queue
                        </button>
                        <button 
                          onClick={() => handleForceStatus('On Break')}
                          className="py-2.5 rounded-xl text-xs font-black text-yellow-300 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 transition-all flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <PhoneOff size={14} /> Force Break
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4 justify-between">
                    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/80 text-center text-gray-300 text-xs shadow-inner">
                      Agent is currently <strong className="text-white font-black">{selectedAgent.status}</strong>. Live telephony audio stream is offline.
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Remote Staff Commands</div>
                      
                      <button 
                        onClick={() => { setTargetDepartment(selectedAgent.department || 'VIP Creators'); setShowReassignModal(true); }}
                        className="w-full py-3 rounded-xl text-xs font-black text-white bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600 flex items-center justify-center gap-2 shadow-md hover:border-gray-500"
                      >
                        <Shuffle size={16} className="text-gray-300" /> Reassign Department Queue
                      </button>

                      {selectedAgent.status === 'On Break' ? (
                        <button 
                          onClick={() => handleForceStatus('Available')}
                          className="w-full py-3 rounded-xl text-xs font-black text-black bg-neon-green hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)] flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Force Available (End Break)
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleForceStatus('On Break')}
                          className="w-full py-3 rounded-xl text-xs font-black text-yellow-300 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                          <PhoneOff size={16} /> Force Break Status
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm p-6 text-center gap-3">
                <ShieldAlert size={48} className="opacity-20 text-gray-400" />
                <p className="font-bold">Select an agent from the floor grid to launch audio interventions and remote controls.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* PERSISTENT LIVE AUDIO STREAM FOOTER CONSOLE */}
      <AnimatePresence>
        {activeSession && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }} 
            className="fixed bottom-6 left-6 right-6 z-50 bg-gray-950/95 border-2 border-neon-blue rounded-3xl p-4 shadow-[0_0_40px_rgba(0,240,255,0.4)] backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute -top-1 -right-1" />
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 font-black">
                  <Radio size={22} className="animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-white">{activeSession.type} Session</span>
                  <span className="px-2 py-0.5 rounded-full bg-neon-blue/20 text-neon-blue border border-neon-blue/40 text-[10px] font-extrabold uppercase">Live Audio Bridge #44</span>
                </div>
                <div className="text-xs text-gray-300 font-bold mt-0.5">
                  Connected to <strong className="text-white">{activeSession.agent.name}</strong> • Timer: <strong className="font-mono text-neon-green">{formatSeconds(activeSession.seconds)}</strong>
                </div>
              </div>
            </div>

            {/* Animated Audio Soundwaves */}
            <div className="hidden md:flex items-center gap-1.5 h-8 px-6 bg-black/40 rounded-xl border border-gray-800">
              <span className="text-[10px] text-gray-500 font-extrabold mr-2 uppercase">Audio Feed:</span>
              {[40, 80, 30, 90, 60, 100, 50, 85, 35, 75, 45, 95].map((h, i) => (
                <motion.div
                  key={i}
                  animate={{ height: activeSession.isMuted ? ['4px', '4px'] : [`${h * 0.25}px`, `${h * 0.3}px`, `${h * 0.15}px`] }}
                  transition={{ repeat: Infinity, duration: 0.4 + (i * 0.05) }}
                  className={`w-1 rounded-full ${activeSession.isMuted ? 'bg-gray-700' : 'bg-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.8)]'}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setActiveSession(prev => ({ ...prev, isMuted: !prev.isMuted }));
                  addToast('info', activeSession.isMuted ? 'Microphone Unmuted' : 'Microphone Muted', '');
                }}
                className={`px-4 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-2 ${activeSession.isMuted ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'}`}
              >
                {activeSession.isMuted ? <MicOff size={14} /> : <Mic size={14} className="text-neon-green" />}
                {activeSession.isMuted ? 'Mic Muted' : 'Mic Active'}
              </button>

              <button
                onClick={handleEndSession}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all flex items-center gap-2"
              >
                <X size={16} /> Leave Session
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassign Queue Modal */}
      <AnimatePresence>
        {showReassignModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowReassignModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Shuffle size={16} className="text-neon-blue"/> Reassign Floor Department</h3>
                <button onClick={() => setShowReassignModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-400">Change operational routing queue for <strong className="text-white font-bold">{selectedAgent?.name}</strong>.</p>
              
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">New Target Department</label>
                <select value={targetDepartment} onChange={e => setTargetDepartment(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
                  <option value="VIP Creators">VIP Creators Tier 1</option>
                  <option value="General Fans">General Fans Support</option>
                  <option value="Billing Support">Billing & Stripe Gateway</option>
                  <option value="KYC Verification">KYC & Legal Document Audit</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={handleReassignAgent} className="flex-1 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]">Confirm Reassignment</button>
                <button onClick={() => setShowReassignModal(false)} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
