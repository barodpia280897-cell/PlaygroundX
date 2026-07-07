import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, Mail, FileText, Search, Filter, MoreVertical, Paperclip, Send, CheckCircle2, User, Star, Clock, AlertCircle, Bot, Mic, Image as ImageIcon, ArrowLeft, X, ChevronRight, Video, UserPlus, Repeat, Plus, Check, ShieldCheck } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import Badge from '../components/ui/Badge';
import SystemAlert from '../components/ui/SystemAlert';
import AIBadge from '../components/ui/AIBadge';
import { useToast } from '../contexts/ToastContext';

import { useAuth } from '../contexts/AuthContext';
import { filterDataByRole } from '../utils/rbac';

// Import Modals
import CallModal from '../components/modals/CallModal';
import ConversationsFilterModal from '../components/modals/ConversationsFilterModal';
import MoreOptionsModal from '../components/modals/MoreOptionsModal';

export default function CommunicationCenter() {
  const { user } = useAuth();
  const isViewer = user?.role === 'VIEWER';
  const [allConversations, setConversations] = useDataStore('conversations');
  const [leads] = useDataStore('leads');
  const [creators] = useDataStore('creators');
  const [fans] = useDataStore('fans');
  const [reachoutSearch, setReachoutSearch] = useState('');
  const [reachoutTab, setReachoutTab] = useState('All');
  const conversations = filterDataByRole(allConversations, user, 'conversations');
  const [activeConvId, setActiveConvId] = useState(conversations?.[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [mobileView, setMobileView] = useState('inbox'); // 'inbox' or 'chat'
  const [showDetails, setShowDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modals & Popovers state
  const [showCallModal, setShowCallModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  
  // Composer & Mode state
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [composerChannel, setComposerChannel] = useState(null);

  // Advanced Filters state for ConversationsFilterModal
  const [modalFilters, setModalFilters] = useState({
    language: 'All',
    agent: 'All',
    unreadOnly: false,
    vipOnly: false,
    escalatedOnly: false
  });

  // New Reachout Form State
  const [newReachout, setNewReachout] = useState({
    recipientName: '',
    recipientType: 'Creator',
    channel: 'WhatsApp',
    message: ''
  });
  
  const chatScrollRef = useRef(null);
  const { addToast } = useToast();

  const activeConv = conversations?.find(c => c.id === activeConvId);

  // Reset composer mode when active conversation changes
  useEffect(() => {
    setComposerChannel(null);
    setIsNoteMode(false);
    setShowAssignModal(false);
    setShowTransferModal(false);
  }, [activeConvId]);

  // Scroll to bottom when active conversation changes or new message is added
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeConvId, activeConv?.messages]);

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'WhatsApp': return <MessageSquare size={14} className="text-green-400" />;
      case 'SMS': return <Phone size={14} className="text-neon-blue" />;
      case 'Email': return <Mail size={14} className="text-purple-400" />;
      case 'Internal Note': return <FileText size={14} className="text-yellow-400" />;
      default: return <MessageSquare size={14} />;
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'read') return <span className="text-blue-500 font-bold tracking-tighter">✓✓</span>;
    if (status === 'delivered') return <span className="text-gray-400 font-bold tracking-tighter">✓✓</span>;
    if (status === 'sent') return <span className="text-gray-400 font-bold tracking-tighter">✓</span>;
    return null;
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (isViewer) return;
    if (!messageText.trim() || !activeConv) return;

    const currentChannel = isNoteMode ? 'Internal Note' : (composerChannel || activeConv.channel);

    const newMessage = isNoteMode ? {
      id: Date.now(),
      type: 'note',
      content: messageText,
      author: user?.name || 'Assigned Agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } : {
      id: Date.now(),
      sender: 'agent',
      type: 'text',
      content: messageText,
      channel: currentChannel,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    const updatedConversations = allConversations.map(c => {
      if (c.id === activeConv.id) {
        return {
          ...c,
          lastMessage: isNoteMode ? `📝 Note: ${messageText}` : messageText,
          channel: isNoteMode ? c.channel : currentChannel,
          time: 'Just now',
          status: 'Active',
          unreadCount: 0, // Clear unread since agent replied
          messages: [...(c.messages || []), newMessage]
        };
      }
      return c;
    });

    // Move the active conversation to the top
    const convToMove = updatedConversations.find(c => c.id === activeConv.id);
    const otherConvs = updatedConversations.filter(c => c.id !== activeConv.id);
    
    setConversations([convToMove, ...otherConvs]);
    setMessageText('');
    
    if (isNoteMode) {
      setIsNoteMode(false);
      addToast('success', 'Internal Note Added', 'Your note has been saved to the conversation audit log.');
    } else {
      addToast('success', `Sent via ${currentChannel}`, `Delivering message to ${activeConv.lead?.name}...`);
    }
  };

  const handleStartNewReachout = (e) => {
    e?.preventDefault();
    if (!newReachout.recipientName.trim() || !newReachout.message.trim()) return;
    
    const newConv = {
      id: Date.now(),
      lead: {
        id: Date.now(),
        name: newReachout.recipientName,
        type: newReachout.recipientType,
        vip: false,
        language: 'English',
        flag: '🌐',
        assignedAgent: user?.name || 'Sarah Mitchell'
      },
      channel: newReachout.channel,
      lastMessage: newReachout.message,
      time: 'Just now',
      status: 'Active',
      unreadCount: 0,
      messages: [
        {
          id: Date.now(),
          sender: 'agent',
          type: 'text',
          content: newReachout.message,
          channel: newReachout.channel,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        }
      ]
    };

    setConversations([newConv, ...allConversations]);
    setActiveConvId(newConv.id);
    setShowNewMessageModal(false);
    setNewReachout({ recipientName: '', recipientType: 'Creator', channel: 'WhatsApp', message: '' });
    addToast('success', `New ${newReachout.channel} Reachout Started`, `Direct message sent to ${newReachout.recipientName}`);
  };

  const allAssignedMembers = [
    ...(creators || []).map(c => ({ ...c, memberType: 'Creator', phone: c.phone || '+1 (555) 382-9102', email: c.email || `${c.name?.toLowerCase().replace(/\s+/g, '.')}@pgx.vip`, score: c.vipScore || c.score || 95 })),
    ...(fans || []).map(f => ({ ...f, memberType: 'VIP Fan', phone: f.phone || '+1 (555) 491-8821', email: f.email || `${f.name?.toLowerCase().replace(/\s+/g, '.')}@pgx.vip`, score: f.vipScore || f.score || 85 })),
    ...(leads || []).map(l => ({ ...l, memberType: l.type || 'Lead', phone: l.phone || '+1 (555) 019-2834', email: l.email || `${l.name?.toLowerCase().replace(/\s+/g, '.')}@pgx.vip`, score: l.vipScore || l.score || 75 }))
  ].filter(m => {
    if (user?.role === 'AGENT') {
      const ag = m.assignedTo || m.assignedAgent || m.agent || '';
      return ag.includes('Priya') || ag === 'Priya Sharma' || ag === 'You' || ag.includes('Sharma') || ag === 'Unassigned' || !ag;
    }
    return true;
  }).filter(m => {
    if (reachoutTab !== 'All' && m.memberType !== reachoutTab) return false;
    if (reachoutSearch && !m.name?.toLowerCase().includes(reachoutSearch.toLowerCase()) && !m.phone?.includes(reachoutSearch) && !m.email?.toLowerCase().includes(reachoutSearch.toLowerCase())) return false;
    return true;
  });

  const handleSelectReachoutMember = (member, channel) => {
    const existingConv = allConversations.find(c => (c.lead?.name === member.name || c.name === member.name) && c.channel === channel);
    if (existingConv) {
      setActiveConvId(existingConv.id);
      setShowNewMessageModal(false);
      addToast('success', `Opened ${channel} Chat`, `Active conversation with ${member.name} loaded.`);
      return;
    }

    const newConv = {
      id: `conv-reachout-${Date.now()}`,
      lead: {
        id: member.id || Date.now(),
        name: member.name,
        type: member.memberType || 'Creator',
        score: member.score || 85,
        flag: member.flag || member.country || '🌐',
        language: 'English',
        assignedAgent: user?.name || 'Priya Sharma',
        status: 'Active',
        vip: member.memberType === 'VIP Fan' || (member.score || 0) > 80,
        health: 90,
        lastInteraction: 'Just now'
      },
      channel: channel,
      status: 'Read',
      unreadCount: 0,
      lastMessage: `Started direct ${channel} follow-up with ${member.name}.`,
      time: 'Just now',
      messages: [
        { 
          id: `m-${Date.now()}`, 
          sender: 'agent', 
          type: 'text', 
          content: `Hi ${member.name}! Reaching out from your assigned PGX team regarding your account verification and setup. How can we assist you today?`, 
          channel: channel, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          status: 'sent' 
        }
      ]
    };

    setConversations([newConv, ...allConversations]);
    setActiveConvId(newConv.id);
    setShowNewMessageModal(false);
    addToast('success', `Created ${channel} Chat!`, `Started direct reachout with ${member.name}.`);
  };

  const handleKeyDown = (e) => {
    if (isViewer) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const insertSuggestedReply = () => {
    setMessageText("Yes, you can upload a PDF or JPG for your KYC. I will review it immediately once you submit it.");
  };

  const markAsRead = (id) => {
    setConversations(allConversations.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const filteredConversations = conversations?.filter(c => {
    const matchesSearch = (c.lead?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    if (activeFilter === 'Unread') matchesFilter = c.unreadCount > 0;
    if (activeFilter === 'WhatsApp') matchesFilter = c.channel === 'WhatsApp';
    if (activeFilter === 'VIPs') matchesFilter = c.lead?.vip === true;

    // Advanced Modal Filters
    if (modalFilters.language !== 'All' && c.lead?.language !== modalFilters.language) matchesFilter = false;
    if (modalFilters.agent !== 'All' && c.lead?.assignedAgent !== modalFilters.agent && !(modalFilters.agent === 'Unassigned' && !c.lead?.assignedAgent)) matchesFilter = false;
    if (modalFilters.unreadOnly && !c.unreadCount) matchesFilter = false;
    if (modalFilters.vipOnly && !c.lead?.vip) matchesFilter = false;
    if (modalFilters.escalatedOnly && c.status !== 'Needs Action') matchesFilter = false;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden bg-[#0a0a0f] relative">

      {/* Inbox Sidebar */}
      <div className={`w-full md:w-[350px] flex-shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-800 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Omnichannel Inbox</h2>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowNewMessageModal(true)}
                className="px-2.5 py-1.5 bg-neon-blue text-black font-bold text-xs rounded-lg hover:bg-cyan-400 transition-colors flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                title="Start Direct Reachout (WhatsApp, SMS, Email)"
              >
                <Plus size={14} /> New Message
              </button>
              <button 
                onClick={() => setShowFilterModal(true)} 
                className={`p-2 hover:bg-gray-800 rounded-lg transition-colors ${showFilterModal || modalFilters.language !== 'All' || modalFilters.unreadOnly || modalFilters.vipOnly ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30' : 'text-gray-400'}`}
                title="Filter Conversations"
              >
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-200 focus:border-neon-blue focus:outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {['All', 'Unread', 'WhatsApp', 'VIPs'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 font-bold rounded-full text-[10px] shrink-0 transition-colors ${activeFilter === filter ? 'bg-neon-blue text-black shadow-[0_0_8px_rgba(0,240,255,0.3)]' : 'bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800'}`}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations?.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-40 text-gray-500">
               <MessageSquare size={32} className="mb-2 opacity-50" />
               <p className="text-sm font-bold">No conversations found</p>
               <button onClick={() => { setActiveFilter('All'); setModalFilters({ language: 'All', agent: 'All', unreadOnly: false, vipOnly: false, escalatedOnly: false }); }} className="mt-2 text-xs text-neon-blue hover:underline">Clear all filters</button>
             </div>
          ) : (
            filteredConversations?.map(conv => (
              <div 
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setMobileView('chat');
                  if (conv.unreadCount > 0) markAsRead(conv.id);
                }}
                className={`p-4 border-b border-gray-800/50 cursor-pointer transition-all flex items-start gap-3 hover:bg-gray-900/50 ${activeConvId === conv.id ? 'bg-gray-900 border-l-2 border-l-neon-blue' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-300 shrink-0 shadow-inner">
                    {conv.lead?.name?.charAt(0) || '?'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-950 rounded-full flex items-center justify-center border border-gray-800 shadow-sm" title={`via ${conv.channel}`}>
                    {getChannelIcon(conv.channel)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className={`text-sm truncate pr-2 ${conv.unreadCount > 0 ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
                      {conv.lead?.name || 'Unknown User'} {conv.lead?.vip && <Star size={10} className="inline text-yellow-400 ml-1 fill-yellow-400"/>}
                    </h4>
                    <span className={`text-[10px] shrink-0 ${conv.unreadCount > 0 ? 'text-neon-blue font-bold' : 'text-gray-500'}`}>{conv.time}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-gray-300 font-bold' : 'text-gray-500'}`}>
                    {conv.lastMessage}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">{conv.lead?.type || 'User'}</span>
                     <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800 font-bold">{conv.channel}</span>
                     {conv.unreadCount > 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-neon-blue text-black font-bold shadow-[0_0_8px_rgba(0,240,255,0.4)]">{conv.unreadCount}</span>}
                     {conv.status === 'Needs Action' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 font-bold border border-red-500/30">Needs Action</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Center Chat Area */}
      {activeConv ? (
        <div className={`flex-1 flex flex-col relative overflow-hidden bg-[#0f111a] ${mobileView === 'inbox' ? 'hidden md:flex' : 'flex'}`}>
          {/* Chat Header */}
          <div className="h-16 px-4 md:px-6 border-b border-gray-800 flex items-center justify-between bg-gray-950/80 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => setMobileView('inbox')} 
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-gray-300 shrink-0 shadow-inner">
                {activeConv.lead?.name?.charAt(0) || '?'}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-sm md:text-base flex items-center gap-1.5 truncate">
                  {activeConv.lead?.name || 'Unknown User'}
                  {activeConv.lead?.flag && <span className="text-xs shrink-0">{activeConv.lead.flag}</span>}
                </h3>
                <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span> Online • via <strong className="text-gray-200">{activeConv.channel}</strong> {activeConv.department && `• ${activeConv.department}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 relative">
              <button 
                onClick={() => setShowDetails(v => !v)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors shrink-0 ${showDetails ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800'}`}
                title="Toggle Workspace Panel"
              >
                <User size={16} />
              </button>
              
              <div className="h-5 w-px bg-gray-800 mx-1 hidden sm:block"></div>

              <button
                onClick={() => {
                  setIsNoteMode(v => !v);
                  if (!isNoteMode) addToast('info', 'Internal Note Mode Active', 'You are composing a private staff note.');
                }}
                className={`hidden sm:flex w-9 h-9 rounded-full border items-center justify-center shrink-0 transition-colors ${isNoteMode ? 'bg-yellow-400 text-black border-yellow-400 font-bold shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400/10'}`}
                title="Add Internal Note"
              ><FileText size={16} /></button>

              <button
                onClick={() => {
                  setShowAssignModal(v => !v);
                  setShowTransferModal(false);
                }}
                className={`hidden sm:flex w-9 h-9 rounded-full border items-center justify-center shrink-0 transition-colors ${showAssignModal ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800'}`}
                title="Assign Conversation"
              ><UserPlus size={16} /></button>

              <button
                onClick={() => {
                  setShowTransferModal(v => !v);
                  setShowAssignModal(false);
                }}
                className={`hidden sm:flex w-9 h-9 rounded-full border items-center justify-center shrink-0 transition-colors ${showTransferModal ? 'bg-neon-green text-black border-neon-green shadow-[0_0_10px_rgba(57,255,20,0.4)]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800'}`}
                title="Transfer Chat Department"
              ><Repeat size={16} /></button>

              <button
                onClick={() => setShowCallModal(true)}
                className="hidden sm:flex w-9 h-9 rounded-full bg-gray-900 border border-gray-700 items-center justify-center text-gray-400 hover:text-neon-green hover:border-neon-green hover:bg-neon-green/10 shrink-0 transition-colors"
                title="Start Voice Call"
              ><Phone size={16} /></button>
              
              <button
                onClick={() => setShowCallModal(true)}
                className="hidden sm:flex w-9 h-9 rounded-full bg-gray-900 border border-gray-700 items-center justify-center text-gray-400 hover:text-neon-blue hover:border-neon-blue hover:bg-neon-blue/10 shrink-0 transition-colors"
                title="Start Video Call Escalation"
              ><Video size={16} /></button>

              <button
                onClick={() => setShowMoreModal(true)}
                className="w-9 h-9 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 shrink-0 transition-colors ml-1"
                title="More Options"
              ><MoreVertical size={16} /></button>

              {/* Assign Agent Popover */}
              {showAssignModal && (
                <div className="absolute top-12 right-12 z-50 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5"><UserPlus size={14} className="text-neon-blue"/> Assign Agent</span>
                    <button onClick={() => setShowAssignModal(false)} className="text-gray-500 hover:text-white"><X size={14}/></button>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {['Sarah Mitchell', 'James Harrington', 'Elena Rodriguez', 'Carlos Ramirez', 'AI Bot (Automated)', 'Unassigned'].map(agent => (
                      <button
                        key={agent}
                        onClick={() => {
                          setConversations(allConversations.map(c => c.id === activeConv.id ? { ...c, lead: { ...c.lead, assignedAgent: agent } } : c));
                          setShowAssignModal(false);
                          addToast('success', 'Conversation Assigned', `Assigned to ${agent}`);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeConv.lead?.assignedAgent === agent ? 'bg-neon-blue/20 text-neon-blue font-bold border border-neon-blue/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                      >
                        <span>{agent}</span>
                        {activeConv.lead?.assignedAgent === agent && <Check size={12} className="text-neon-blue" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Transfer Chat Popover */}
              {showTransferModal && (
                <div className="absolute top-12 right-12 z-50 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5"><Repeat size={14} className="text-neon-green"/> Transfer Department</span>
                    <button onClick={() => setShowTransferModal(false)} className="text-gray-500 hover:text-white"><X size={14}/></button>
                  </div>
                  <div className="space-y-1">
                    {['Support & Helpdesk', 'Billing & Finance', 'Compliance & KYC', 'VIP Fast-Track Team', 'Technical Operations'].map(dept => (
                      <button
                        key={dept}
                        onClick={() => {
                          setConversations(allConversations.map(c => c.id === activeConv.id ? { ...c, department: dept, status: 'Needs Action' } : c));
                          setShowTransferModal(false);
                          addToast('success', 'Chat Transferred', `Transferred to ${dept}`);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>{dept}</span>
                        <ChevronRight size={12} className="text-gray-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar flex flex-col">
            <div className="text-center text-xs text-gray-600 my-4 font-medium border-b border-gray-800/50 pb-4">
              Conversation started • {new Date().toLocaleDateString()} • Platform: <strong className="text-gray-400">{activeConv.channel}</strong>
            </div>

            {activeConv.messages?.map(msg => {
              if (msg.type === 'note') {
                return (
                  <div key={msg.id} className="flex justify-center my-4">
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3 max-w-[85%] md:max-w-lg text-center shadow-sm">
                      <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs font-bold mb-1">
                        <FileText size={12} /> Internal Note by {msg.author}
                      </div>
                      <p className="text-xs text-gray-300">{msg.content}</p>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'event' || msg.sender === 'system') {
                return <SystemAlert key={msg.id} message={msg.content} />;
              }

              const isOutgoing = msg.sender === 'agent' || msg.sender === 'ai';
              const isAI = msg.sender === 'ai';
              const msgChannel = msg.channel || activeConv.channel;

              return (
                <div key={msg.id} className={`flex w-full ${isOutgoing ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-3 shadow-sm ${isOutgoing
                      ? (isAI ? 'bg-indigo-600 text-white rounded-tr-sm shadow-[0_0_10px_rgba(79,70,229,0.2)]' : msgChannel === 'WhatsApp' ? 'bg-[#dcf8c6] text-black rounded-tr-sm' : msgChannel === 'SMS' ? 'bg-blue-500 text-white rounded-tr-sm' : 'bg-gray-700 text-white rounded-tr-sm border border-gray-600')
                      : 'bg-gray-800 border border-gray-700 text-white rounded-tl-sm'
                    }`}>

                    {isAI && <AIBadge />}

                    {msg.type === 'attachment' && (
                      <div className="flex items-center gap-3 bg-black/10 rounded-xl p-2 mb-2 border border-black/10">
                        {msg.fileType === 'pdf' ? <FileText size={24} className={isOutgoing && msgChannel === 'WhatsApp' ? 'text-red-500' : 'text-red-400'} /> : <ImageIcon size={24} className={isOutgoing && msgChannel === 'WhatsApp' ? 'text-blue-600' : 'text-blue-400'} />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{msg.content}</p>
                          <p className={`text-[10px] ${isOutgoing && msgChannel === 'WhatsApp' ? 'text-gray-600' : 'text-gray-400'}`}>{msg.fileSize}</p>
                        </div>
                      </div>
                    )}

                    {msg.type === 'text' && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}

                    <div className={`text-[9px] mt-1.5 text-right flex items-center justify-end gap-1.5 ${isOutgoing && msgChannel === 'WhatsApp' ? 'text-gray-600 font-medium' : 'text-gray-400'}`}>
                      <span className="opacity-80">via {msgChannel}</span> • <span>{msg.time}</span>
                      {isOutgoing && getStatusIcon(msg.status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Composer */}
          <div className="p-3 md:p-4 bg-gray-950 border-t border-gray-800 shrink-0">
            {isViewer ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center text-xs text-gray-500 font-bold">
                🔒 Read-only Mode: You are viewing this conversation in compliance audit mode. Messaging and interaction actions are disabled.
              </div>
            ) : (
              <>
                {/* Channel Switcher & Internal Note Bar */}
                <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-gray-800/60 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mr-1">Send Reply Via:</span>
                    {['WhatsApp', 'SMS', 'Email'].map(ch => {
                      const isSelected = !isNoteMode && (composerChannel || activeConv.channel) === ch;
                      return (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => { setComposerChannel(ch); setIsNoteMode(false); }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${isSelected ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}
                        >
                          {getChannelIcon(ch)} {ch}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setIsNoteMode(v => !v);
                        if (!isNoteMode) addToast('info', 'Internal Note Mode Active', 'Composing a private staff note.');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ml-1 ${isNoteMode ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)] font-black' : 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20'}`}
                    >
                      <FileText size={12} /> {isNoteMode ? '⚠️ Internal Note Active' : '+ Internal Note'}
                    </button>
                  </div>
                  {isNoteMode && (
                    <button onClick={() => setIsNoteMode(false)} className="text-[10px] text-red-400 hover:underline font-bold shrink-0">Cancel Note Mode</button>
                  )}
                </div>

                {/* Quick Actions / Templates */}
                <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar pb-1">
                  <button 
                    onClick={() => {
                      const isPaused = activeConv.aiPaused;
                      setConversations(allConversations.map(c => c.id === activeConv.id ? { 
                        ...c, 
                        aiPaused: !isPaused,
                        status: !isPaused ? 'Human Takeover' : 'Active',
                        messages: [...(c.messages || []), {
                          id: Date.now(),
                          sender: 'system',
                          type: 'event',
                          content: !isPaused ? '⚠️ Staff Agent took over conversation from AI Auto-Pilot. Manual mode active.' : '🤖 AI Auto-Pilot Resumed by Agent.',
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }]
                      } : c));
                      addToast(!isPaused ? 'warning' : 'success', !isPaused ? 'AI Auto-Pilot Paused' : 'AI Auto-Pilot Active', !isPaused ? 'You have taken over this chat. AI will not auto-reply.' : 'AI Bot is now monitoring and auto-answering.');
                    }}
                    className={`px-3 py-1.5 font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-sm whitespace-nowrap transition-all ${
                      activeConv.aiPaused || activeConv.status === 'Human Takeover'
                        ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 hover:bg-neon-green hover:text-black shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                        : 'bg-red-500 text-white hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                    }`}
                  >
                    {activeConv.aiPaused || activeConv.status === 'Human Takeover' ? (
                      <><Bot size={12} /> Resume AI Auto-Pilot</>
                    ) : (
                      <><AlertCircle size={12} /> ⚠️ Takeover from AI</>
                    )}
                  </button>
                  <button onClick={insertSuggestedReply} className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg text-[10px] hover:text-white hover:bg-gray-800 flex items-center gap-1.5 whitespace-nowrap transition-colors">
                    <Bot size={12} className="text-neon-purple"/> Suggested Reply
                  </button>
                  <button 
                    onClick={() => {
                      setMessageText("Hi! Welcome to Acme Digital VIP support. Let me know how I can assist you today.");
                      addToast('info', 'Template Applied', 'Inserted greeting template into composer.');
                    }} 
                    className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-gray-300 rounded-lg text-[10px] hover:text-white hover:bg-gray-800 flex items-center gap-1.5 whitespace-nowrap transition-colors"
                  >
                    <FileText size={12} /> Templates
                  </button>
                  <button 
                    onClick={() => {
                      setIsNoteMode(true);
                      addToast('info', 'Internal Note Mode Active', 'You are now writing a staff note.');
                    }} 
                    className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-lg text-[10px] hover:bg-yellow-400/20 font-bold whitespace-nowrap transition-colors"
                  >
                    Add Note
                  </button>
                </div>

                <div className={`relative flex items-end gap-2 rounded-xl p-1.5 transition-colors shadow-inner ${isNoteMode ? 'bg-yellow-500/10 border-2 border-yellow-500/50' : 'bg-gray-900 border border-gray-700 focus-within:border-neon-blue'}`}>
                  <button className="p-2.5 text-gray-400 hover:text-white shrink-0 transition-colors" title="Attach Document / Photo"><Paperclip size={18} /></button>
                  <textarea
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isNoteMode ? `Type a private internal note for team members...` : `Type a ${composerChannel || activeConv.channel} message to ${activeConv.lead?.name}...`}
                    className={`flex-1 bg-transparent border-none text-sm resize-none max-h-32 min-h-[44px] py-3 focus:outline-none custom-scrollbar ${isNoteMode ? 'text-yellow-200 placeholder:text-yellow-500/60 font-medium' : 'text-white placeholder:text-gray-500'}`}
                    rows={1}
                  />
                  <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
                    <button className="hidden sm:block p-2 text-gray-400 hover:text-white transition-colors" title="Voice Message"><Mic size={18} /></button>
                    <button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className={`p-2.5 rounded-lg transition-colors disabled:opacity-50 ${isNoteMode ? 'bg-yellow-400 text-black hover:bg-yellow-300 font-bold shadow-[0_0_10px_rgba(250,204,21,0.4)]' : 'bg-neon-blue text-black hover:bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
                <div className="hidden md:block text-[10px] text-gray-500 mt-2 text-center font-bold">
                  {isNoteMode ? <span className="text-yellow-400">⚠️ Private Internal Staff Note • Not visible to customer</span> : <span>Press Enter to send, Shift+Enter for new line. Active Channel: <span className="text-gray-300">{composerChannel || activeConv.channel}</span>.</span>}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex items-center justify-center bg-[#0f111a] text-gray-500 flex-col gap-4">
          <MessageSquare size={64} className="text-gray-800" />
          <p className="font-bold">Select a conversation to start messaging</p>
          <button onClick={() => setShowNewMessageModal(true)} className="px-4 py-2 bg-neon-blue text-black font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:bg-cyan-400 transition-colors flex items-center gap-1.5">
            <Plus size={16} /> Start New Reachout
          </button>
        </div>
      )}

      {/* Right Context Panel Backdrop */}
      {showDetails && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 xl:hidden" 
          onClick={() => setShowDetails(false)}
        />
      )}

      {/* Right Context Panel */}
      {activeConv && (
        <div className={`w-[85%] max-w-sm sm:w-80 flex-shrink-0 bg-gray-950 border-l border-gray-800 flex flex-col overflow-y-auto custom-scrollbar transition-transform duration-300
          ${showDetails 
            ? 'fixed inset-y-0 right-0 z-30 translate-x-0 shadow-2xl' 
            : 'fixed inset-y-0 right-0 z-30 translate-x-full xl:relative xl:translate-x-0 xl:flex'}`}>
          
          {/* Mobile Close Button */}
          <div className="xl:hidden flex justify-between items-center p-4 border-b border-gray-800/50 bg-gray-950 shrink-0">
             <span className="text-sm font-bold text-gray-300">Contact Info</span>
            <button onClick={() => setShowDetails(false)} className="p-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Customer Profile Summary */}
          <div className="p-6 border-b border-gray-800 text-center flex flex-col items-center shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-800 border-4 border-gray-900 shadow-xl flex items-center justify-center text-3xl font-black text-white relative mb-3">
              {activeConv.lead?.name?.charAt(0) || '?'}
              {activeConv.lead?.vip && <div className="absolute -top-1 -right-1 bg-yellow-400 text-black p-1.5 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"><Star size={14} fill="currentColor"/></div>}
            </div>
            <h3 className="text-lg font-black text-white truncate max-w-full tracking-wide">{activeConv.lead?.name || 'Unknown User'}</h3>
            <p className="text-xs font-bold text-gray-400 mb-3">{activeConv.lead?.type || 'User'} • {activeConv.lead?.language || 'Unknown'} {activeConv.lead?.flag}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
               {activeConv.lead?.tags?.map(tag => (
                 <span key={tag} className="px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-300 rounded text-[9px] font-bold uppercase tracking-wider">{tag}</span>
               )) || (
                 <>
                   <span className="px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-300 rounded text-[9px] font-bold uppercase tracking-wider">High Intent</span>
                   <span className="px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-300 rounded text-[9px] font-bold uppercase tracking-wider">New</span>
                 </>
               )}
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => activeConv?.lead?.id && (window.location.href = `/app/leads/${activeConv.lead.id}`)}
                className="flex-1 py-2 bg-gray-900 border border-gray-700 rounded-lg text-xs font-bold text-white hover:border-neon-blue hover:text-neon-blue transition-colors"
              >View Profile</button>
            </div>
          </div>

          {/* Context Details */}
          <div className="p-5 border-b border-gray-800 space-y-4 shrink-0">
            <div>
              <span className="block text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-wider">Assigned Agent</span>
              <div className="flex items-center justify-between bg-gray-900 p-2.5 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"><User size={12} className="text-gray-400"/></div>
                  <span className="text-sm font-bold text-gray-200">{activeConv.lead?.assignedAgent || 'Unassigned'}</span>
                </div>
                <button onClick={() => setShowAssignModal(true)} className="text-[10px] text-neon-blue font-bold hover:underline">Change</button>
              </div>
            </div>
          </div>
          
          {/* Previous Conversations */}
          <div className="p-5 border-b border-gray-800 space-y-3 shrink-0">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center justify-between mb-2">Previous Chats</h4>
            <div className="space-y-2">
               <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] text-gray-400 font-bold">2 Days Ago</span>
                     <span className="text-[10px] text-neon-green font-bold bg-neon-green/10 px-1.5 py-0.5 rounded">Resolved</span>
                  </div>
                  <p className="text-xs text-gray-300 truncate">Help with resetting my password...</p>
               </div>
               <div className="bg-gray-900 border border-gray-800 p-2.5 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] text-gray-400 font-bold">Last Week</span>
                     <span className="text-[10px] text-neon-green font-bold bg-neon-green/10 px-1.5 py-0.5 rounded">Resolved</span>
                  </div>
                  <p className="text-xs text-gray-300 truncate">Question about pricing tiers...</p>
               </div>
            </div>
          </div>

          {/* Open Tasks & Escalations */}
          <div className="p-5 border-b border-gray-800 space-y-4 shrink-0">
            <div>
               <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center justify-between mb-3">Open Tasks <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded text-[9px]">1</span></h4>
               <div className="flex items-start gap-2 bg-gray-900 p-2.5 rounded-lg border border-gray-800">
                 <CheckCircle2 size={14} className="text-gray-500 mt-0.5 shrink-0" />
                 <div>
                    <span className="text-xs font-bold text-gray-200 block">Follow up on KYC</span>
                    <span className="text-[10px] text-red-400 font-bold">Due Today</span>
                 </div>
               </div>
            </div>
          </div>

          {/* AI Suggestions Panel */}
          <div className="p-6 bg-gradient-to-b from-neon-purple/10 to-transparent shrink-0">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4"><Bot size={14} className="text-neon-purple" /> AI Insights</h4>

            {/* AI Auto-Pilot Status Banner */}
            <div className={`p-3 rounded-xl border mb-4 text-xs font-bold flex items-center justify-between ${
              activeConv.aiPaused || activeConv.status === 'Human Takeover'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-green-500/10 border-green-500/30 text-green-400'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${activeConv.aiPaused || activeConv.status === 'Human Takeover' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                <span className="truncate">{activeConv.aiPaused || activeConv.status === 'Human Takeover' ? '⏸️ AI Paused (Manual Mode)' : '⚡ AI Auto-Pilot Active'}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const isPaused = activeConv.aiPaused;
                  setConversations(allConversations.map(c => c.id === activeConv.id ? { 
                    ...c, 
                    aiPaused: !isPaused,
                    status: !isPaused ? 'Human Takeover' : 'Active',
                    messages: [...(c.messages || []), {
                      id: Date.now(),
                      sender: 'system',
                      type: 'event',
                      content: !isPaused ? '⚠️ Staff Agent took over conversation from AI Auto-Pilot. Manual mode active.' : '🤖 AI Auto-Pilot Resumed by Agent.',
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]
                  } : c));
                  addToast(!isPaused ? 'warning' : 'success', !isPaused ? 'AI Auto-Pilot Paused' : 'AI Auto-Pilot Active', !isPaused ? 'You have taken over this chat. AI will not auto-reply.' : 'AI Bot is now monitoring and auto-answering.');
                }}
                className="underline text-[10px] shrink-0 ml-2 hover:text-white"
              >
                {activeConv.aiPaused || activeConv.status === 'Human Takeover' ? 'Resume AI' : 'Takeover Now'}
              </button>
            </div>

            {activeConv.unreadCount > 0 ? (
              <div className="bg-gray-900/80 backdrop-blur border border-neon-purple/30 rounded-xl p-4 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-purple mt-1.5 shrink-0 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                  <div>
                    <span className="text-[10px] font-black text-neon-purple uppercase tracking-wider block mb-1">Suggested Reply</span>
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">"Yes, you can upload a PDF or JPG for your KYC. I will review it immediately once you submit it."</p>
                  </div>
                </div>
                {!isViewer && (
                  <button onClick={insertSuggestedReply} className="w-full py-2 bg-neon-purple/20 text-neon-purple font-bold text-xs rounded-lg border border-neon-purple/30 hover:bg-neon-purple hover:text-white transition-colors shadow-sm">Insert Reply</button>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center text-xs font-medium text-gray-500">
                AI is monitoring the conversation. Waiting for lead's response.
              </div>
            )}

            {!isViewer && (
              <div className="mt-6">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-2 tracking-wider">Next Best Action</span>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-bold text-gray-300 hover:text-neon-blue hover:border-neon-blue transition-colors flex items-center justify-between group">
                    Offer VIP Fast-Track <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-full text-left px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-xs font-bold text-gray-300 hover:text-neon-blue hover:border-neon-blue transition-colors flex items-center justify-between group">
                    Send Knowledge Base Link <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Modals & Popovers */}
      <CallModal open={showCallModal} onClose={() => setShowCallModal(false)} />
      <ConversationsFilterModal open={showFilterModal} onClose={() => setShowFilterModal(false)} filters={modalFilters} setFilters={setModalFilters} />
      <MoreOptionsModal
        open={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        lead={activeConv?.lead}
        onViewProfile={() => activeConv?.lead?.id && (window.location.href = `/app/leads/${activeConv.lead.id}`)}
        onBlockLead={() => {
          setConversations(allConversations.map(c => c.id === activeConv?.id ? { ...c, lead: { ...c.lead, isBlocked: true } } : c));
          addToast('warning', 'Lead Blocked', `${activeConv?.lead?.name} has been blocked.`);
        }}
        onUnblockLead={() => {
          setConversations(allConversations.map(c => c.id === activeConv?.id ? { ...c, lead: { ...c.lead, isBlocked: false } } : c));
          addToast('success', 'Lead Unblocked', `${activeConv?.lead?.name} is now unblocked.`);
        }}
        onClearChat={() => {
          setConversations(allConversations.map(c => c.id === activeConv?.id ? { ...c, messages: [] } : c));
          addToast('info', 'Chat Cleared', 'Conversation history has been cleared.');
        }}
      />

      {/* Start Direct Reachout / Select Assigned Member Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 shrink-0">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Plus className="text-neon-blue" size={18}/> New Reachout – Assigned Members
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Select from your assigned leads, creators, and fans to start an immediate chat.</p>
              </div>
              <button onClick={() => setShowNewMessageModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"><X size={18}/></button>
            </div>
            
            {/* Search and Category Tabs */}
            <div className="p-4 border-b border-gray-800/80 bg-gray-900/30 space-y-3 shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search assigned members by name, phone, or email..."
                  value={reachoutSearch}
                  onChange={e => setReachoutSearch(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-neon-blue"
                />
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['All', 'Creator', 'VIP Fan', 'Lead'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setReachoutTab(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${reachoutTab === tab ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  >
                    {tab === 'All' ? 'All Assigned' : `${tab}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Member List */}
            <div className="p-4 overflow-y-auto custom-scrollbar space-y-2.5 flex-1">
              {allAssignedMembers.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  <User size={32} className="mx-auto mb-2 opacity-40" />
                  No assigned members found matching your search.
                </div>
              ) : (
                allAssignedMembers.map((m, idx) => (
                  <div key={`${m.memberType}-${m.id}-${idx}`} className="p-3 bg-gray-900/60 border border-gray-800 rounded-xl hover:border-gray-700 transition-all flex flex-col gap-2.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center font-black text-white text-sm shrink-0 shadow-inner">
                          {m.name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                            {m.name} <span className="text-xs shrink-0">{m.flag || m.country || '🌐'}</span>
                          </h4>
                          <p className="text-[11px] text-gray-400 font-medium truncate">{m.phone} • {m.email}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border uppercase tracking-wider ${
                          m.memberType === 'Creator' ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/30' :
                          m.memberType === 'VIP Fan' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-neon-blue/20 text-neon-blue border-neon-blue/30'
                        }`}>
                          {m.memberType}
                        </span>
                        <p className="text-[10px] text-gray-500 font-bold mt-1">Score: {m.score || 85}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-800/80">
                      <button
                        type="button"
                        onClick={() => handleSelectReachoutMember(m, 'WhatsApp')}
                        className="flex-1 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366] hover:text-black text-[#25D366] border border-[#25D366]/30 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        💬 WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectReachoutMember(m, 'SMS')}
                        className="flex-1 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff] hover:text-black text-[#00f0ff] border border-[#00f0ff]/30 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        📱 SMS Text
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectReachoutMember(m, 'Email')}
                        className="flex-1 py-1.5 bg-[#8a2be2]/10 hover:bg-[#8a2be2] hover:text-white text-[#8a2be2] border border-[#8a2be2]/30 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        📧 Email
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center shrink-0">
              <span className="text-xs text-gray-400 font-medium">Showing {allAssignedMembers.length} assigned member{allAssignedMembers.length !== 1 ? 's' : ''}</span>
              <button type="button" onClick={() => setShowNewMessageModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
