import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Send, Phone, Mail, Smile, Paperclip, MoreHorizontal, Bot, User, ArrowLeft, Ban, ChevronDown, Filter, Star, Clock, Info, CheckCircle2, Circle, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore, useUIState } from '../contexts/DataContext';
import CallModal from '../components/modals/CallModal';
import EmailModal from '../components/modals/EmailModal';
import ProfileModal from '../components/modals/ProfileModal';
import MoreOptionsModal from '../components/modals/MoreOptionsModal';
import EscalateModal from '../components/modals/EscalateModal';
import ConversationsFilterModal from '../components/modals/ConversationsFilterModal';
import Emails from './Emails';

const initialMessages = {
  1: [
    { from:'ai', text:'Hi Maria! 👋 Welcome to PlayGroundX! Your account is almost ready. The next step is completing your KYC verification.', time:'10:30 AM' },
    { from:'lead', text:'¿Cómo gano dinero en PlayGroundX?', time:'10:45 AM', original: 'How do I earn money on PlayGroundX?' },
    { from:'ai', text:'Puedes ganar dinero como creador a través de:\n• Suscripciones\n• Propinas\n• Llamadas privadas\n• Salas en vivo\n• Contenido exclusivo\n\n¿Te gustaría que alguien te llame para explicarte mejor?', time:'10:45 AM', isTranslated: true },
    { from:'lead', text:'Sí, por favor. Llámame.', time:'10:46 AM' },
    { from:'system', type:'escalation', text:'"Call me"\nThe conversation has been marked as Needs Agent.', time:'10:46 AM' }
  ],
  2: [
    { from:'ai', text:'Hi Jin! 👋 Your PlayGroundX account is active. Funding your wallet is the next step to unlock premium features.', time:'11:00 AM' },
    { from:'lead', text:'When can I start earning?', time:'11:01 AM' },
    { from:'ai', text:'Great question! As a fan you can earn through referrals. Start by exploring creators in the platform!', time:'11:02 AM' },
  ],
};

const channelColors = { WhatsApp:'#25D366', SMS:'#00f0ff', Email:'#8a2be2', Phone:'#ffd700', Video:'#ff0055' };

const roleConfig = {
  ADMIN: { canReply: true, canEscalate: true, filterFn: (c) => c },
  EXECUTIVE: { canReply: false, canEscalate: false, filterFn: (c) => c },
  MANAGER: { canReply: true, canEscalate: true, filterFn: (c) => c },
  SUPERVISOR: { canReply: true, canEscalate: true, filterFn: (c) => c },
  AGENT: { canReply: true, canEscalate: true, filterFn: (c) => c.filter(x => x.agent === 'Carlos' || x.agent === 'Unassigned') },
  VIEWER: { canReply: false, canEscalate: false, filterFn: (c) => c },
};

export default function Conversations() {
  const { user } = useAuth();
  const config = roleConfig[user?.role] || roleConfig.ADMIN;
  
  const [allConversations, conversationsActions] = useDataStore('conversations');
  const roleFiltered = config.filterFn(allConversations);

  const [channelTab, setChannelTab] = useState('All');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ language: 'All', agent: 'All', unreadOnly: false, vipOnly: false, escalatedOnly: false });
  
  const conversations = roleFiltered.filter(c => {
    if (channelTab !== 'All' && c.channel !== channelTab) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !(c.lastMsg || '').toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.language !== 'All' && (c.language || 'English') !== filters.language) return false;
    if (filters.agent !== 'All' && c.agent !== filters.agent) return false;
    if (filters.unreadOnly && !c.unread) return false;
    if (filters.vipOnly && c.status !== 'New') return false;
    if (filters.escalatedOnly && c.status !== 'Escalated') return false;
    return true;
  });

  const [selectedId, setSelectedId] = useUIState('selected_conv_id', conversations[0]?.id);
  const selected = conversations.find(c => String(c.id) === String(selectedId)) || conversations[0] || {};
  
  const [input, setInput] = useState('');
  const [messagesData, setMessagesData] = useUIState('chat_messages', initialMessages);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(conversations.length / itemsPerPage));
  const paginatedConversations = conversations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const msgs = messagesData[selected.id] || [];

  const [showListOnMobile, setShowListOnMobile] = useState(true);
  const [showCall, setShowCall] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);

  const [inputTab, setInputTab] = useState('Reply');
  const [rightTab, setRightTab] = useState('Contact');

  const [filterOpen, setFilterOpen] = useState(false);
  const [clockOpen, setClockOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  const handleSend = () => {
    if (!input.trim() || !config.canReply) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMessage = { from: 'agent', text: input.trim(), time };
    
    setMessagesData(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), newMessage]
    }));
    setInput('');
  };

  const handleAIReply = () => {
    if (!config.canReply || selected.isBlocked) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMessage = { from: 'ai', text: 'I have analyzed the conversation and suggest asking for their latest utility bill or government ID.', time };
    
    setMessagesData(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] || []), newMessage]
    }));
  };

  const handleClearChat = () => {
    setMessagesData(prev => ({ ...prev, [selected.id]: [] }));
  };

  const handleToggleStar = () => {
    conversationsActions.updateItem(selected.id, { isStarred: !selected.isStarred });
  };

  const handleBlockToggle = (blocked) => {
    conversationsActions.updateItem(selected.id, { isBlocked: blocked, status: blocked ? 'Blocked' : 'New' });
  };

  const handleEscalateConfirm = (notes) => {
    conversationsActions.updateItem(selected.id, { status: 'Escalated' });
  };

  const milestones = [
    { label: 'Registered', done: true },
    { label: 'Email Verified', done: true },
    { label: 'Phone Verified', done: true },
    { label: 'Profile Photo', done: true },
    { label: 'Banner', done: true },
    { label: 'Bio', done: true },
    { label: 'KYC Approval', done: false },
    { label: 'First Content', done: false },
    { label: 'First Live Hosted', done: false },
    { label: 'Active Creator', done: false },
  ];

  const channelTabs = [
    { id: 'All', label: 'All', count: roleFiltered.length, color: 'text-gray-400', bg: 'bg-gray-800' },
    { id: 'WhatsApp', label: 'WhatsApp', count: roleFiltered.filter(c=>c.channel==='WhatsApp').length, color: 'text-[#25D366]', bg: 'bg-[#25D366]/20' },
    { id: 'SMS', label: 'SMS', count: roleFiltered.filter(c=>c.channel==='SMS').length, color: 'text-[#00f0ff]', bg: 'bg-[#00f0ff]/20' },
    { id: 'Email', label: 'Email', count: roleFiltered.filter(c=>c.channel==='Email').length, color: 'text-[#8a2be2]', bg: 'bg-[#8a2be2]/20' },
    { id: 'Phone', label: 'Voice Call', count: roleFiltered.filter(c=>c.channel==='Phone').length, color: 'text-[#ffd700]', bg: 'bg-[#ffd700]/20' },
    { id: 'Video', label: 'Video Call', count: roleFiltered.filter(c=>c.channel==='Video').length, color: 'text-[#ff0055]', bg: 'bg-[#ff0055]/20' }
  ];

  return (
    <div className="flex flex-col h-full -mx-4 md:-mx-6 -mb-4 md:-mb-6 overflow-hidden">
      
      {/* GLOBAL HEADER */}
      <div className="px-5 py-4 border-b border-gray-800/50 bg-background/50 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-white">Conversations</h1>
            <span className="text-sm text-gray-500 hidden sm:block">All customer conversations in one place</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <div className="relative shrink-0 w-64 hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts, leads, messages..." className="w-full bg-gray-900/50 border border-gray-800 rounded-full py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-neon-blue/40" />
            </div>
            
            <div className="relative">
              <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 text-xs text-gray-300 hover:text-white shrink-0">
                {filters.language === 'All' ? 'All Languages' : filters.language} <ChevronDown size={14} />
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 text-xs text-gray-300 hover:text-white shrink-0">
                {filters.agent === 'All' ? 'All Agents' : filters.agent} <ChevronDown size={14} />
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setFilterOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 text-xs text-gray-300 hover:text-white shrink-0">
                <Filter size={12} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* Channel Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {channelTabs.map(tab => (
            <button key={tab.id} onClick={() => setChannelTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${channelTab === tab.id ? 'bg-white/10 border-white/20' : 'bg-transparent border-transparent hover:bg-white/5'}`}>
              <span className={tab.color}>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${tab.bg} ${tab.color}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {channelTab === 'Email' ? (
          <div className="absolute inset-0 bg-background z-10 flex">
            <Emails embedded={true} />
          </div>
        ) : (
          <>
            {/* LEFT PANEL: Conversation List */}
            <div className={`w-full md:w-[320px] shrink-0 border-r border-gray-800/50 bg-panel/30 flex flex-col h-full overflow-hidden ${showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
              <div className="p-3">
                <div className="relative md:hidden mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." className="w-full bg-gray-900/50 border border-gray-800 rounded-full py-2 pl-9 pr-4 text-xs text-white" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {paginatedConversations.map(c => (
                  <button key={c.id} onClick={() => { setSelectedId(c.id); setShowListOnMobile(false); }}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-l-2 ${selected.id===c.id?'bg-neon-blue/5 border-neon-blue':'border-transparent hover:bg-white/5'}`}>
                    <div className="relative shrink-0">
                      <img src={c.avatar} className="w-11 h-11 rounded-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-gray-200 truncate flex items-center gap-2">
                          {c.name}
                          <span className="text-sm shadow-sm border border-gray-700 rounded ml-1 px-1.5 py-0.5 bg-gray-800/80 leading-none">{c.flag}</span>
                          {c.isStarred && <Star size={12} className="text-yellow-400 fill-yellow-400 shrink-0" />}
                        </span>
                        <span className="text-[10px] text-gray-500 shrink-0 ml-2">{c.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold" style={{ color: channelColors[c.channel] }}>{c.channel}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                          c.status==='Blocked'?'bg-gray-800 text-gray-400 border border-gray-700':
                          c.status==='Escalated'?'bg-neon-pink/20 text-neon-pink border border-neon-pink/30':
                          c.status==='New'?'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30':'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                        }`}>{c.status==='New'?'VIP':'Escalated'}</span>
                      </div>
                      <p className="text-[11px] text-muted truncate">{c.lastMsg}</p>
                    </div>
                    {c.unread > 0 && <div className="shrink-0 w-5 h-5 mt-1 rounded-full bg-neon-purple text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(157,78,221,0.5)]">{c.unread}</div>}
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-gray-800/50 flex items-center justify-center gap-2 shrink-0">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 text-xs font-bold disabled:opacity-50">&lt;</button>
                <div className="text-xs text-gray-500 font-bold">
                  {currentPage} of {totalPages}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 text-xs font-bold disabled:opacity-50">&gt;</button>
              </div>
            </div>

            {/* MIDDLE PANEL: Chat Feed */}
            <div className={`flex-1 flex-col min-w-0 overflow-hidden h-full ${!showListOnMobile ? 'flex' : 'hidden md:flex'}`}>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/50 bg-background/50 backdrop-blur shrink-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button onClick={() => setShowListOnMobile(true)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 text-secondary hover:text-white transition-colors">
                    <ArrowLeft size={18} />
                  </button>
                  <img src={selected.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{selected.name} {selected.flag}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold" style={{ color: channelColors[selected.channel] }}>{selected.channel}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                      <span className="text-[10px] text-neon-green flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div> Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 bg-gray-900/50 border border-gray-800 rounded-full px-3 py-1.5">
                    <span className="text-[10px] text-gray-500">Assign to</span>
                    <select 
                      className="bg-transparent text-[10px] font-bold text-gray-200 focus:outline-none cursor-pointer" 
                      value={selected.agent || 'Unassigned'} 
                      disabled={user?.role === 'VIEWER'}
                      onChange={e => conversationsActions.updateItem(selected.id, { agent: e.target.value })}
                    >
                      <option>Unassigned</option>
                      <option>Sarah Agent</option>
                      <option>Carlos</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {user?.role !== 'VIEWER' && (
                      <button onClick={handleToggleStar} className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${selected.isStarred ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-white'}`}>
                        <Star size={15} className={selected.isStarred ? "fill-yellow-400" : ""} />
                      </button>
                    )}
                    <div className="relative">
                      <button onClick={() => setClockOpen(!clockOpen)} className={`p-2 rounded-lg hover:bg-white/5 transition-colors ${clockOpen ? 'text-neon-blue bg-neon-blue/10' : 'text-gray-400 hover:text-white'}`}>
                        <Clock size={15} />
                      </button>
                      {clockOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl p-3 z-20 shadow-xl">
                          <div className="table-th mb-3">Recent Activity</div>
                          <div className="text-xs text-gray-300 mb-2 border-b border-gray-800 pb-2">Sent Pricing Proposal <br/><span className="text-[9px] text-gray-500">10:45 AM</span></div>
                          <div className="text-xs text-gray-300">Completed KYC <br/><span className="text-[9px] text-gray-500">Yesterday</span></div>
                        </div>
                      )}
                    </div>
                    {user?.role !== 'VIEWER' && (
                      <button onClick={() => setShowMoreOptions(true)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white border border-gray-700 bg-gray-900/50 transition-colors"><MoreHorizontal size={15} /></button>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Banner */}
              <div className="bg-gray-900/50 border-b border-gray-800/50 px-5 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Info size={14} className="text-gray-500" />
                  <span className="text-xs text-gray-400">conversation is in Spanish. AI translation is ON.</span>
                </div>
                <button className="text-[10px] font-bold text-neon-blue border border-neon-blue/30 bg-neon-blue/10 px-2 py-1 rounded">View Original</button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5 bg-[#0a0a0f]">
                {msgs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted text-sm">No messages yet.</div>
                ) : (
                  msgs.map((m, i) => (
                    <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.05 }}
                      className={`flex ${m.from==='lead'?'justify-start':'justify-end'} ${m.type==='escalation'?'justify-start':''}`}>
                      
                      {m.type === 'escalation' ? (
                        <div className="w-full max-w-sm bg-neon-pink/5 border border-neon-pink/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-neon-pink text-[10px] font-bold uppercase tracking-wider mb-2">
                            <Ban size={12} /> Escalation Trigger Detected
                          </div>
                          <div className="text-sm text-white font-medium whitespace-pre-wrap">{m.text}</div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]">
                          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                            m.from==='lead'?'bg-gray-900 border border-gray-800 text-gray-300 rounded-tl-sm':
                            m.from==='ai'?'bg-[#0f172a] border border-neon-blue/30 text-gray-200 rounded-tr-sm':
                            'bg-neon-blue/10 border border-neon-blue/20 text-gray-100 rounded-tr-sm'
                          }`}>
                            {m.isTranslated && (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neon-purple mb-2 pb-2 border-b border-gray-800">
                                <Bot size={12} /> AI Translation (English)
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">{m.text}</div>
                            {m.isTranslated && (
                              <div className="mt-3 flex justify-end">
                                <CheckCircle2 size={14} className="text-neon-blue" />
                              </div>
                            )}
                          </div>
                          <div className={`text-[10px] text-gray-600 px-1 ${m.from==='lead'?'text-left':'text-right'}`}>{m.time} {m.from==='lead' && m.original ? '' : '✓✓'}</div>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {config.canReply && (
                <div className="px-5 py-4 border-t border-gray-800/50 bg-background shrink-0 flex flex-col gap-3">
                  {selected.isBlocked ? (
                    <div className="flex items-center justify-between bg-gray-900/60 border border-gray-700/50 rounded-xl px-4 py-3">
                      <span className="text-sm font-bold text-gray-400 flex items-center gap-2"><Ban size={16}/> 🚫 This lead has been blocked.</span>
                      <button onClick={() => handleBlockToggle(false)} className="text-xs font-bold text-neon-blue hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/20">Unblock Lead</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-6 border-b border-gray-800">
                        {['Reply', 'Note', 'Task', 'AI Assist'].map(tab => (
                          <button key={tab} onClick={() => setInputTab(tab)}
                            className={`text-[11px] font-bold pb-2 transition-colors border-b-2 ${inputTab === tab ? 'text-neon-blue border-neon-blue' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
                            {tab}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-start gap-3 bg-gray-900/50 border border-gray-800 rounded-xl p-3">
                        <input 
                          value={input} 
                          onChange={e => setInput(e.target.value)} 
                          onKeyDown={e => e.key === 'Enter' && handleSend()}
                          placeholder={inputTab === 'Reply' ? "Type your message..." : `Add a ${inputTab.toLowerCase()}...`}
                          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none min-w-0 resize-none h-10" 
                        />
                        <button onClick={handleSend} className="w-10 h-10 shrink-0 rounded-full bg-neon-blue flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
                          <Send size={16} className="text-black ml-1" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 px-2 text-gray-500">
                        <Smile size={16} className="cursor-pointer hover:text-white transition-colors" />
                        <Paperclip size={16} className="cursor-pointer hover:text-white transition-colors" />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Lead Details */}
            <div className="hidden xl:flex w-[340px] shrink-0 border-l border-gray-800/50 bg-panel/20 flex-col h-full overflow-hidden">
              
              <div className="flex items-center gap-4 px-4 pt-4 border-b border-gray-800">
                {['Contact', 'Lead Info', 'Activity', 'Notes', 'Files'].map(tab => (
                  <button key={tab} onClick={() => setRightTab(tab)}
                    className={`text-[10px] font-bold pb-3 transition-colors border-b-2 whitespace-nowrap ${rightTab === tab ? 'text-white border-neon-blue' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                
                {rightTab === 'Contact' && (
                  <>
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        <img src={selected.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-700" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-900 border-2 border-[#0a0a0f] flex items-center justify-center">
                          <User size={10} className="text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{selected.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">{selected.type}</span>
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded">Spanish</span>
                          <span className="text-[9px] font-bold text-neon-purple bg-neon-purple/20 border border-neon-purple/30 px-1.5 py-0.5 rounded uppercase tracking-wider">VIP Prospect</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs">
                        <Phone size={14} className="text-[#25D366]" />
                        <span className="text-gray-300">+34 612 345 678</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Mail size={14} className="text-neon-blue" />
                        <span className="text-gray-300">{selected.name.toLowerCase().replace(' ', '.')}@email.com</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-lg w-3.5 h-3.5 flex items-center justify-center overflow-hidden leading-none">{selected.flag}</span>
                        <span className="text-gray-300">Spain</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Clock size={14} className="text-gray-500" />
                        <span className="text-gray-300">10:45 AM (GMT+2)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-neon-green" />
                        <div className="text-[10px] text-gray-500 font-bold mb-1">Lead Score</div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-black text-white">285</span>
                          <span className="text-[10px] font-bold text-neon-green bg-neon-green/20 px-1.5 py-0.5 rounded mb-1">High</span>
                        </div>
                      </div>
                      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-3">
                        <div className="text-[10px] text-gray-500 font-bold mb-1">Current Stage</div>
                        <div className="text-sm font-bold text-white mb-1">Interested</div>
                        <div className="text-[9px] text-gray-500">Creator Pipeline</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-white mb-3">Milestones <span className="text-gray-500 font-normal ml-1">6/10 Completed</span></div>
                      <div className="space-y-2">
                        {milestones.map((m, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            {m.done ? <CheckCircle2 size={12} className="text-neon-green shrink-0" /> : <Circle size={12} className="text-gray-600 shrink-0" />}
                            <span className={m.done ? 'text-gray-300' : 'text-gray-600'}>{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-neon-purple/5 border border-neon-purple/20 rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute -top-6 -right-6 w-20 h-20 bg-neon-purple/10 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center gap-2 mb-2">
                        <Bot size={14} className="text-neon-purple" />
                        <span className="text-[10px] font-bold text-neon-purple uppercase tracking-widest">AI Summary</span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        Maria is interested in monetization. She asked how to earn money and requested a call. High potential creator.
                      </p>
                    </div>
                  </>
                )}

                {rightTab === 'Lead Info' && (
                  <div className="text-sm text-gray-400 space-y-4">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                        <h4 className="text-white font-bold mb-3">Professional Details</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-gray-500">Company:</span> <span className="text-gray-300">PlayStudio Media</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Role:</span> <span className="text-gray-300">Lead Content Creator</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Industry:</span> <span className="text-gray-300">Entertainment</span></div>
                          <div className="flex justify-between"><span className="text-gray-500">Audience:</span> <span className="text-gray-300">100k+ Followers</span></div>
                        </div>
                    </div>
                  </div>
                )}

                {rightTab === 'Activity' && (
                  <div className="text-sm text-gray-400 space-y-5 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-800">
                    <div className="relative pl-6">
                        <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-neon-blue border-4 border-[#0a0a0f]"></span>
                        <p className="text-white text-xs font-bold">Sent Pricing Proposal</p>
                        <p className="text-[10px] text-gray-500 mt-1">Today, 10:45 AM</p>
                    </div>
                    <div className="relative pl-6">
                        <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-neon-purple border-4 border-[#0a0a0f]"></span>
                        <p className="text-white text-xs font-bold">Completed KYC Verification</p>
                        <p className="text-[10px] text-gray-500 mt-1">Yesterday, 02:30 PM</p>
                    </div>
                    <div className="relative pl-6">
                        <span className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-gray-600 border-4 border-[#0a0a0f]"></span>
                        <p className="text-white text-xs font-bold">Lead Created</p>
                        <p className="text-[10px] text-gray-500 mt-1">Oct 20, 2024</p>
                    </div>
                  </div>
                )}

                {rightTab === 'Notes' && (
                  <div className="space-y-4">
                    <textarea disabled={user?.role === 'VIEWER'} placeholder="Add a private note about this lead..." className="w-full bg-gray-900/50 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-neon-blue/40 focus:outline-none min-h-[120px] resize-none"></textarea>
                    {user?.role !== 'VIEWER' && <button className="w-full py-2.5 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/30 font-bold text-xs hover:bg-neon-blue/20 transition-colors">Save Note</button>}
                  </div>
                )}

                {rightTab === 'Files' && (
                  <div className="text-sm text-gray-400 space-y-3">
                    <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                          <div className="w-8 h-8 rounded bg-neon-blue/10 flex items-center justify-center shrink-0">
                            <Paperclip size={14} className="text-neon-blue" />
                          </div>
                          <div>
                            <div className="text-xs text-white font-bold">contract_signed.pdf</div>
                            <div className="text-[10px] text-gray-500">2.4 MB</div>
                          </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                          <div className="w-8 h-8 rounded bg-neon-purple/10 flex items-center justify-center shrink-0">
                            <Paperclip size={14} className="text-neon-purple" />
                          </div>
                          <div>
                            <div className="text-xs text-white font-bold">id_card_front.jpg</div>
                            <div className="text-[10px] text-gray-500">1.1 MB</div>
                          </div>
                        </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </>
        )}

      </div>

      {/* GLOBAL FOOTER (Stats Bar) */}
      <div className="px-6 py-3 border-t border-gray-800/50 bg-[#0a0a0f] flex flex-wrap items-center justify-between gap-6 shrink-0 z-20 relative">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
            <MessageSquare size={14} className="text-neon-blue" />
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Conversations Handled</div>
            <div className="text-lg font-black text-white leading-none mt-1">{conversations.length}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-neon-purple/10 flex items-center justify-center border border-neon-purple/20">
            <Bot size={14} className="text-neon-purple" />
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">AI Handled</div>
            <div className="text-base font-black text-white leading-none mt-1">{Math.round(conversations.length * 0.68)} <span className="text-neon-green text-[11px] font-bold">(68%)</span></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-full bg-neon-pink/10 flex items-center justify-center border border-neon-pink/20">
            <Headphones size={14} className="text-neon-pink" />
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Escalated to Agents</div>
            <div className="text-base font-black text-white leading-none mt-1">{conversations.filter(c => c.status === 'Escalated').length} <span className="text-neon-pink text-[11px] font-bold">({conversations.length ? Math.round((conversations.filter(c => c.status === 'Escalated').length / conversations.length) * 100) : 0}%)</span></div>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
            <Clock size={14} className="text-neon-blue" />
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Average Response Time</div>
            <div className="text-base font-black text-white leading-none mt-1">2m 34s</div>
          </div>
        </div>
        <div className="hidden xl:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center border border-neon-blue/20">
            <CheckCircle2 size={14} className="text-neon-blue" />
          </div>
          <div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Resolution Rate</div>
            <div className="text-base font-black text-white leading-none mt-1">98.3%</div>
          </div>
        </div>
      </div>

      <CallModal open={showCall} onClose={() => setShowCall(false)} />
      <EmailModal open={showEmail} onClose={() => setShowEmail(false)} />
      <ConversationsFilterModal open={filterOpen} onClose={() => setFilterOpen(false)} filters={filters} setFilters={setFilters} />
      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} lead={selected} />
      <MoreOptionsModal 
        open={showMoreOptions} 
        onClose={() => setShowMoreOptions(false)} 
        lead={selected} 
        onViewProfile={() => setShowProfile(true)}
        onBlockLead={() => handleBlockToggle(true)}
        onUnblockLead={() => handleBlockToggle(false)}
        onClearChat={handleClearChat}
      />
      <EscalateModal 
        open={showEscalate} 
        onClose={() => setShowEscalate(false)}
        onConfirm={handleEscalateConfirm}
      />
    </div>
  );
}
