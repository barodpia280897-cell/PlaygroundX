import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Phone, CreditCard, Shield, Flame, CheckCircle, User, Inbox, MessageSquare, Send, MoreHorizontal, ChevronRight, CheckSquare, Plus, Shuffle, ArrowUpRight, X, ShieldAlert, Lock } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

function CrownIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
}

const initialEscalations = [
  { id:1, name:'Maria Gonzalez', flag:'🇪🇸', avatar:'https://i.pravatar.cc/150?img=1', type:'VIP Prospect', priority:'VIP', reason:'Requested call · Lead Score 185', time:'2m ago', agent:'Unassigned', status:'Open', color:'#ffd700', icon:CrownIcon, score: 98, department: 'VIP Sales', history: [{role: 'user', text: 'I need to speak to a manager right now regarding my contract.'}, {role: 'ai', text: 'I understand. I am transferring you to our VIP Success team right now.'}] },
  { id:2, name:'Ahmed Al Mansour', flag:'🇦🇪', avatar:'https://i.pravatar.cc/150?img=7', type:'KYC Failed', priority:'High', reason:'Documents rejected 3rd time', time:'5m ago', agent:'Unassigned', status:'Open', color:'#ff0055', icon:Shield, score: 65, department: 'KYC & Legal', history: [{role: 'user', text: 'Why is my ID rejected again?!'}, {role: 'ai', text: 'The image appears to be blurry. Please ensure all text is legible.'}, {role: 'user', text: 'It is perfectly clear! Fix this now.'}] },
  { id:3, name:'Jenna Smith', flag:'🇺🇸', avatar:'https://i.pravatar.cc/150?img=13', type:'Payment Failed', priority:'High', reason:'Card declined $200 — wants refund', time:'8m ago', agent:'Sarah', status:'In Progress', color:'#ff0055', icon:CreditCard, score: 45, department: 'Billing', history: [{role: 'user', text: 'My card was charged but I did not get the coins.'}, {role: 'ai', text: 'I can help check your transaction status.'}, {role: 'user', text: 'Just give me a refund!'}] },
  { id:4, name:'Carlos Ramirez', flag:'🇲🇽', avatar:'https://i.pravatar.cc/150?img=11', type:'Call Requested', priority:'Medium', reason:'Confused about registration process', time:'12m ago', agent:'Unassigned', status:'Open', color:'#00f0ff', icon:Phone, score: 30, department: 'General Support', history: [{role: 'user', text: 'Can someone call me? I don\'t understand step 3.'}, {role: 'ai', text: 'Certainly, an agent will reach out shortly.'}] },
  { id:5, name:'Sophie Dubois', flag:'🇫🇷', avatar:'https://i.pravatar.cc/150?img=9', type:'Hot Lead', priority:'Hot', reason:'Multiple VIP questions + large following', time:'15m ago', agent:'Emma', status:'Claimed', color:'#ff7f00', icon:Flame, score: 85, department: 'VIP Sales', history: [{role: 'user', text: 'What is your revenue split for creators with 1M+ followers?'}, {role: 'ai', text: 'Our standard split is 80/20. However, for large creators, we have custom deals.'}] },
  { id:6, name:'Jin Woo', flag:'🇰🇷', avatar:'https://i.pravatar.cc/150?img=3', type:'Angry User', priority:'High', reason:'Upset about response time', time:'20m ago', agent:'You', status:'In Progress', color:'#ff0055', icon:AlertTriangle, score: 55, department: 'General Support', history: [{role: 'user', text: 'I have been waiting for 2 days for an answer!'}, {role: 'ai', text: 'I apologize for the delay. Your ticket has been escalated.'}] }
];

export default function Escalations() {
  const { user } = useAuth();
  const [escalations, setEscalations] = useState(initialEscalations);
  const [activeFolder, setActiveFolder] = useState('Unassigned');
  const [selectedTicketId, setSelectedTicketId] = useState(initialEscalations[0].id);
  const [replyText, setReplyText] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // Modals state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetDepartment, setTargetDepartment] = useState('Finance Department');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  
  const { addToast } = useToast();

  const handleClaim = (id) => {
    const authorityName = user?.name ? `${user.name} (${user.role || 'Authority'})` : 'Floor Supervisor';
    setEscalations(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'Claimed & Locked',
          agent: authorityName,
          claimedRole: user?.role || 'SUPERVISOR',
          history: [...e.history, { role: 'sys', text: `🔒 SYSTEM LOCK: Ownership claimed by ${authorityName}. Dual-handling collision prevented. Other managers switched to View-Only mode.` }]
        };
      }
      return e;
    }));
    addToast('success', 'Ticket Claimed & Locked! 🔒', `You took ownership. Other authority roles cannot double-work this client.`);
  };

  const handleResolve = (id) => {
    setEscalations(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status: 'Resolved',
          history: [...e.history, { role: 'sys', text: `✅ RESOLUTION LOGGED: Ticket resolved and override approved by ${user?.name || 'Supervisor'}. Notification sent to Sales Agent.` }]
        };
      }
      return e;
    }));
    addToast('success', 'Ticket Resolved & Approved! ✅', 'Override approval sent to Priya Sharma. Client timeline archived in 360° Profile.');
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;
    
    const newMsg = { role: 'agent', text: replyText, time: 'Just now' };
    
    setEscalations(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: t.agent === 'Unassigned' ? 'In Progress' : t.status,
          agent: t.agent === 'Unassigned' ? 'You' : t.agent,
          history: [...t.history, newMsg]
        };
      }
      return t;
    }));

    addToast('success', 'Message Sent', 'Your reply was delivered to the user in real-time.');
    setReplyText('');
  };

  const handleTransfer = () => {
    if (!selectedTicketId) return;
    setEscalations(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          department: targetDepartment,
          agent: `Queue (${targetDepartment})`,
          history: [...t.history, { role: 'sys', text: `⚡ System: Ticket transferred to ${targetDepartment} by Manager.` }]
        };
      }
      return t;
    }));
    setShowTransferModal(false);
    addToast('info', 'Ticket Transferred', `Moved to ${targetDepartment} queue.`);
  };

  const handleEscalateFurther = () => {
    if (!selectedTicketId) return;
    setEscalations(prev => prev.map(t => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          priority: 'VIP',
          score: Math.min(100, t.score + 25),
          agent: 'CEO / Senior Executive',
          history: [...t.history, { role: 'sys', text: `🚨 System: Priority escalated to VIP Executive Level by Manager.` }]
        };
      }
      return t;
    }));
    setShowEscalateModal(false);
    addToast('warning', 'Escalation Upgraded', 'Ticket priority boosted to VIP and routed to Senior Executive.');
  };

  const handleSimulateNew = () => {
    const demoNames = ['Liam Hemsworth', 'Elena Rostova', 'Kenji Sato', 'Amara Okafor'];
    const demoFlags = ['🇦🇺', '🇷🇺', '🇯🇵', '🇳🇬'];
    const idx = Math.floor(Math.random() * demoNames.length);
    const newId = Date.now();
    
    const newTicket = {
      id: newId,
      name: demoNames[idx],
      flag: demoFlags[idx],
      avatar: `https://i.pravatar.cc/150?img=${idx + 25}`,
      type: 'Stripe Wire Hold',
      priority: 'Hot',
      reason: 'Urgent: Daily wire settlement blocked ($4,200)',
      time: 'Just now',
      agent: 'Unassigned',
      status: 'Open',
      color: '#ff0055',
      icon: Flame,
      score: 88,
      department: 'Finance & Billing',
      history: [
        { role: 'user', text: 'My daily $4,200 automated wire from creator earnings is stuck on hold!' },
        { role: 'ai', text: 'I am checking the Stripe banking gateway now. Because this is over $2,500, I am initiating an urgent human escalation.' }
      ]
    };

    setEscalations(prev => [newTicket, ...prev]);
    setSelectedTicketId(newId);
    addToast('warning', '🚨 New Critical Escalation', `${newTicket.name} needs immediate wire settlement support!`);
  };

  const handleSimulateSupervisorAssistance = () => {
    const newId = Date.now();
    const newTicket = {
      id: newId,
      name: 'Li Wei (VIP Fan - High Roller)',
      flag: '🇨🇳',
      avatar: 'https://i.pravatar.cc/150?img=33',
      type: 'Supervisor Assistance',
      priority: 'VIP',
      reason: '⚡ URGENT: Need supervisor override for fast-track KYC approval. Customer wants to deposit $5,000 immediately.',
      time: 'Just now',
      agent: 'Unassigned',
      status: 'Open',
      color: '#ffd700',
      icon: CrownIcon,
      score: 99,
      department: 'VIP Sales (Priya Sharma)',
      history: [
        { role: 'user', text: 'I want to deposit $5,000 right now for the VIP streaming tournament, but my KYC verification is taking too long!' },
        { role: 'agent', text: '⚡ [Priya Sharma - Sales Agent]: Submitting Escalation Ticket #ESC-892. Customer is waiting on live call. Requesting immediate Floor Supervisor override for ID verification.' }
      ]
    };
    setEscalations(prev => [newTicket, ...prev]);
    setSelectedTicketId(newId);
    setActiveFolder('Unassigned');
    addToast('warning', '🚨 New Supervisor Assistance Request', 'Priya Sharma requested fast-track KYC override for Li Wei!');
  };

  const filteredTickets = useMemo(() => {
    switch (activeFolder) {
      case 'Unassigned': return escalations.filter(e => e.agent === 'Unassigned' && e.status !== 'Resolved');
      case 'My Tickets': return escalations.filter(e => (e.agent === 'You' || e.agent === 'Priya Sharma') && e.status !== 'Resolved');
      case 'VIP Queue': return escalations.filter(e => e.priority === 'VIP' && e.status !== 'Resolved');
      case 'High Priority': return escalations.filter(e => (e.priority === 'High' || e.priority === 'Hot') && e.status !== 'Resolved');
      case 'All Open': return escalations.filter(e => e.status !== 'Resolved');
      case 'Resolved': return escalations.filter(e => e.status === 'Resolved');
      default: return escalations;
    }
  }, [activeFolder, escalations]);

  const activeTicket = escalations.find(e => e.id === selectedTicketId) || filteredTickets[0] || null;

  const folders = [
    { name: 'Unassigned', icon: Inbox, count: escalations.filter(e => e.agent === 'Unassigned' && e.status !== 'Resolved').length },
    { name: 'My Tickets', icon: User, count: escalations.filter(e => (e.agent === 'You' || e.agent === 'Priya Sharma') && e.status !== 'Resolved').length },
    { name: 'VIP Queue', icon: CrownIcon, count: escalations.filter(e => e.priority === 'VIP' && e.status !== 'Resolved').length },
    { name: 'High Priority', icon: Flame, count: escalations.filter(e => (e.priority === 'High' || e.priority === 'Hot') && e.status !== 'Resolved').length },
    { name: 'All Open', icon: Clock, count: escalations.filter(e => e.status !== 'Resolved').length },
    { name: 'Resolved', icon: CheckCircle, count: escalations.filter(e => e.status === 'Resolved').length }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] pb-8 space-y-4">
      
      {/* Header Bar */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            AI Escalations & Human Triage Inbox
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Take over critical user conversations, failed payments, and KYC blocks from AI assistants.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap filter-bar">
          <button 
            onClick={handleSimulateSupervisorAssistance}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-black text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all flex items-center gap-2"
          >
            ⚡ Simulate Priya's Help Request (#ESC-892)
          </button>
          <button 
            onClick={handleSimulateNew}
            className="bg-gradient-to-r from-red-600 to-neon-pink hover:from-red-500 hover:to-pink-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(255,0,85,0.4)] transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Simulate AI Escalation 🚨
          </button>
        </div>
      </motion.div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        
        {/* Left Pane: Folders */}
        <div className="w-full lg:w-56 shrink-0 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar shadow-lg">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider px-3 py-2">Triage Queues</div>
          {folders.map(f => {
            const Icon = f.icon;
            const isActive = activeFolder === f.name;
            return (
              <button
                key={f.name}
                onClick={() => setActiveFolder(f.name)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-neon-blue text-black font-black shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-black' : 'text-gray-400'} />
                  <span>{f.name}</span>
                </div>
                {f.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${isActive ? 'bg-black text-white' : 'bg-gray-800 text-gray-300'}`}>
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Middle Pane: Ticket List */}
        <div className="w-full lg:w-80 shrink-0 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-lg">
          <div className="p-4 border-b border-gray-800 bg-gray-950/80 flex items-center justify-between">
            <span className="text-xs font-black text-white uppercase tracking-wider">{activeFolder} ({filteredTickets.length})</span>
            <span className="text-[10px] text-neon-green font-bold">● Live Sync</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-xs font-medium">
                  <Inbox size={32} className="mx-auto mb-2 opacity-30" />
                  No open tickets in this queue.
                </div>
              ) : filteredTickets.map(ticket => {
                const Icon = ticket.icon || AlertTriangle;
                const isSelected = activeTicket?.id === ticket.id;
                return (
                  <motion.div
                    key={ticket.id}
                    layout
                    initial={{ opacity:0, scale:0.95 }}
                    animate={{ opacity:1, scale:1 }}
                    exit={{ opacity:0, scale:0.95 }}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${isSelected ? 'bg-gray-800/90 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-gray-950/60 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: `${ticket.color}20`, color: ticket.color, border: `1px solid ${ticket.color}40` }}>
                        <Icon size={10} /> {ticket.priority}
                      </span>
                      <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono"><Clock size={10} /> {ticket.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="relative">
                        <img src={ticket.avatar} className="w-8 h-8 rounded-full border border-gray-700 object-cover shrink-0" alt="" />
                        <span className="absolute -bottom-1 -right-1 text-xs">{ticket.flag}</span>
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-black text-white truncate">{ticket.name}</div>
                        <div className="text-[10px] text-gray-400 font-medium truncate">{ticket.department || ticket.type}</div>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-gray-300 truncate w-full mb-2 bg-black/30 p-1.5 rounded border border-gray-800/50">{ticket.reason}</p>
                    
                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-gray-800/60">
                      <span className="text-gray-400 font-semibold">{ticket.type}</span>
                      <span className={`font-black ${ticket.status === 'Claimed & Locked' ? 'text-yellow-400 font-extrabold flex items-center gap-1' : ticket.agent === 'You' ? 'text-neon-blue' : ticket.agent === 'Unassigned' ? 'text-yellow-400 font-extrabold animate-pulse' : 'text-gray-400'}`}>
                        {ticket.status === 'Claimed & Locked' ? `🔒 ${ticket.agent.split(' ')[0]}` : ticket.agent === 'Unassigned' ? '⚠ Unassigned' : `Agent: ${ticket.agent}`}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Pane: Active Ticket Detail & Interactive Chat */}
        <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col min-h-0 relative shadow-2xl overflow-hidden">
          {!activeTicket ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3 p-8 text-center">
              <Inbox size={48} className="text-gray-700" />
              <p className="text-sm font-bold text-gray-400">Select an escalation ticket from the triage inbox to view AI context and respond.</p>
            </div>
          ) : (
            <>
              {/* Ticket Detail Header */}
              <div className="p-5 border-b border-gray-800 bg-gray-950/90 shrink-0 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={activeTicket.avatar} className="w-14 h-14 rounded-full border-2 border-gray-700 object-cover shadow-md" alt="" />
                    <span className="absolute -bottom-1 -right-1 text-base bg-gray-900 rounded-full px-1">{activeTicket.flag}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-white tracking-tight">{activeTicket.name}</h2>
                      {activeTicket.priority === 'VIP' && <CrownIcon size={16} className="text-yellow-400 fill-yellow-400" />}
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] font-extrabold text-gray-300">{activeTicket.department || 'Support'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 font-bold">
                      <span className="flex items-center gap-1"><User size={12} /> {activeTicket.type}</span>
                      <span className="text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/30">Priority Score: {activeTicket.score}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {activeTicket.agent === 'Unassigned' && activeTicket.status !== 'Resolved' ? (
                    <button 
                      onClick={() => handleClaim(activeTicket.id)} 
                      className="px-4 py-2.5 rounded-xl bg-neon-blue text-black text-xs font-black shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-cyan-400 transition-all flex items-center gap-1.5"
                    >
                      <CheckSquare size={14} /> 🙋‍♂️ Claim & Lock Ownership
                    </button>
                  ) : activeTicket.status !== 'Resolved' ? (
                    <div className="flex items-center gap-2">
                      {activeTicket.status === 'Claimed & Locked' && (
                        <span className="px-3 py-2 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-black flex items-center gap-1 animate-pulse">
                          🔒 LOCKED BY {activeTicket.agent.split(' ')[0].toUpperCase()}
                        </span>
                      )}
                      <button 
                        onClick={() => handleResolve(activeTicket.id)} 
                        className="px-4 py-2.5 rounded-xl bg-neon-green text-black text-xs font-black shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:bg-green-400 transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} /> Resolve & Approve Override
                      </button>
                    </div>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-800 border border-green-500/50 text-green-400 text-xs font-black flex items-center gap-1.5">
                      <CheckCircle size={14} /> Resolved & Closed
                    </span>
                  )}

                  <div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === activeTicket.id ? null : activeTicket.id)}
                      className="p-2.5 rounded-xl border border-gray-700 hover:bg-gray-800 text-gray-300 transition-all shadow-sm"
                      title="More Actions"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {openMenuId === activeTicket.id && (
                      <div className="absolute top-full right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-2xl p-1.5 z-30 shadow-2xl text-left animate-fadeIn" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setShowTransferModal(true); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-xl text-xs text-gray-200 hover:text-white flex items-center gap-2 font-bold"><Shuffle size={14} className="text-neon-blue"/> Transfer Ticket</button>
                        <button onClick={() => { setShowEscalateModal(true); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-xl text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-2 font-bold"><ArrowUpRight size={14}/> Escalate Further</button>
                        {activeTicket.status !== 'Resolved' && (
                          <button onClick={() => { handleResolve(activeTicket.id); setOpenMenuId(null); }} className="w-full text-left px-3 py-2 hover:bg-white/10 rounded-xl text-xs text-neon-green hover:text-green-300 flex items-center gap-2 font-bold"><CheckCircle size={14}/> Mark Resolved</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Conversation Chat History */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                {activeTicket.status === 'Claimed & Locked' && (
                  <div className="w-full bg-yellow-500/15 border-2 border-yellow-500/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-fadeIn">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-xl shrink-0">🔒</div>
                      <div>
                        <span className="font-black text-yellow-400 block text-sm">OWNERSHIP LOCKED BY: {activeTicket.agent}</span>
                        <span className="text-xs text-gray-300">Dual-Handling Prevention Active: To prevent two authority roles from working on this client simultaneously, other supervisors/managers are restricted to View-Only mode.</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleClaim(activeTicket.id)}
                      className="px-3.5 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs transition-all shrink-0 shadow-md"
                      title="Force takeover if supervisor is offline"
                    >
                      ⚡ Override Lock & Takeover
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 mb-4 uppercase tracking-wider">
                  <div className="h-px bg-gray-800 flex-1" /> AI Deflection & Human Timeline <div className="h-px bg-gray-800 flex-1" />
                </div>
                
                {activeTicket.history.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.role === 'agent' ? 'flex-row-reverse' : ''} ${msg.role === 'sys' ? 'justify-center' : ''}`}>
                    {msg.role === 'sys' ? (
                      <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-1.5 rounded-full text-[11px] font-extrabold my-1 shadow-sm">
                        {msg.text}
                      </div>
                    ) : (
                      <>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black shadow-sm ${msg.role === 'user' ? 'bg-gray-800 border border-gray-700 text-white' : msg.role === 'ai' ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40' : 'bg-neon-blue text-black'}`}>
                          {msg.role === 'user' ? 'U' : msg.role === 'ai' ? 'AI' : 'YOU'}
                        </div>
                        <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gray-800/80 border border-gray-700/80 text-gray-100 rounded-tl-none' : msg.role === 'ai' ? 'bg-neon-purple/10 border border-neon-purple/30 text-purple-200 rounded-tl-none' : 'bg-neon-blue/15 border border-neon-blue/30 text-gray-100 rounded-tr-none'}`}>
                          <div className="flex justify-between items-center gap-3 mb-1 text-[10px]">
                            <span className="font-extrabold text-gray-400 uppercase tracking-wider">{msg.role === 'user' ? activeTicket.name : msg.role === 'ai' ? 'PGX-GPT 4.1 Assistant' : 'You (Live Manager)'}</span>
                            <span className="text-[9px] text-gray-500">{msg.time || 'Earlier'}</span>
                          </div>
                          {msg.text}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Working Live Reply Input Form */}
              <form onSubmit={handleReply} className="p-3.5 bg-gray-950/90 border-t border-gray-800 flex items-center gap-3 shrink-0">
                <input
                  type="text"
                  placeholder={activeTicket.status === 'Resolved' ? 'Ticket resolved. Reopen to reply...' : `Type a live reply to ${activeTicket.name}...`}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  disabled={activeTicket.status === 'Resolved'}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-neon-blue disabled:opacity-50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || activeTicket.status === 'Resolved'}
                  className="bg-neon-blue hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-600 text-black px-5 py-3 rounded-xl font-black text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center gap-2 shrink-0"
                >
                  <Send size={14} /> Send Reply
                </button>
              </form>
            </>
          )}
        </div>

      </div>

      {/* Transfer Ticket Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowTransferModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Shuffle size={16} className="text-neon-blue"/> Transfer Escalation Ticket</h3>
                <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-400">Select the target department or specialized team to take over this ticket from <strong className="text-white">{activeTicket?.name}</strong>.</p>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">Target Department Queue</label>
                <select value={targetDepartment} onChange={e => setTargetDepartment(e.target.value)} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
                  <option value="Finance Department">Finance & Wire Settlements</option>
                  <option value="Senior Legal Team">Senior Legal & KYC Compliance</option>
                  <option value="VIP Success Mgr">VIP Success Executive Desk</option>
                  <option value="Technical Support">Level 3 Engineering Support</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleTransfer} className="flex-1 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]">Confirm Transfer</button>
                <button onClick={() => setShowTransferModal(false)} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Escalate Further Modal */}
      <AnimatePresence>
        {showEscalateModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowEscalateModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><ShieldAlert size={16} className="text-yellow-400"/> Escalate to Executive Level</h3>
                <button onClick={() => setShowEscalateModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-400">This action will mark the ticket as <strong className="text-yellow-400">VIP High-Priority</strong>, increase its routing score by +25, and notify the CEO / Executive Desk immediately.</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl text-xs text-yellow-400 font-bold">
                ⚠ Use only for critical contract blocks or high-value VIP churn risks.
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleEscalateFurther} className="flex-1 py-3 bg-yellow-400 text-black font-black text-xs rounded-xl hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(250,204,21,0.4)]">Boost Priority & Escalate</button>
                <button onClick={() => setShowEscalateModal(false)} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
