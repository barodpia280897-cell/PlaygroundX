// src/components/modals/LogCallNoteModal.jsx
import { useState } from 'react';
import { X, Search, Phone, FileText, User, CheckCircle, ArrowLeft, Clock, Tag } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function LogCallNoteModal({ open, onClose, onStartCall, onOpen360 }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [allConversations, { setCollection: setConversations }] = useDataStore('conversations');
  const [leads] = useDataStore('leads');
  const [creators] = useDataStore('creators');
  const [fans] = useDataStore('fans');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // Step: 'list' | 'log_call' | 'add_note'
  const [currentStep, setCurrentStep] = useState('list');
  const [selectedMember, setSelectedMember] = useState(null);

  // Call Log Form State
  const [callOutcome, setCallOutcome] = useState('Connected & Interested');
  const [callDuration, setCallDuration] = useState('04:15');
  const [callSummary, setCallSummary] = useState('');

  // Note Form State
  const [noteCategory, setNoteCategory] = useState('KYC & Compliance');
  const [noteContent, setNoteContent] = useState('');

  if (!open) return null;

  // Combine and filter assigned members
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
    if (activeTab !== 'All' && m.memberType !== activeTab) return false;
    if (searchQuery && !m.name?.toLowerCase().includes(searchQuery.toLowerCase()) && !m.phone?.includes(searchQuery) && !m.email?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleOpenCallLog = (member) => {
    setSelectedMember(member);
    setCallSummary(`Connected with ${member.name}. Discussed VIP onboarding and account KYC verification status.`);
    setCurrentStep('log_call');
  };

  const handleOpenAddNote = (member) => {
    setSelectedMember(member);
    setNoteContent(`Verified passport documentation and account details for ${member.name}. Ready for fast-track review.`);
    setCurrentStep('add_note');
  };

  const handleSubmitCallLog = (e) => {
    e?.preventDefault?.();
    if (!selectedMember || !callSummary.trim()) return;

    const convList = Array.isArray(allConversations) ? allConversations : [];
    let convIndex = convList.findIndex(c => c.lead?.name === selectedMember.name || c.name === selectedMember.name);
    
    const callLogMessage = {
      id: `m-call-${Date.now()}`,
      sender: 'agent',
      type: 'note',
      content: `📞 [CALL LOG - ${callOutcome} • Duration: ${callDuration}]\n${callSummary}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: user?.name || 'Priya Sharma'
    };

    if (convIndex !== -1) {
      const updated = [...convList];
      updated[convIndex] = {
        ...updated[convIndex],
        lastMessage: `📞 Call Logged: ${callOutcome}`,
        time: 'Just now',
        messages: [...(updated[convIndex].messages || []), callLogMessage]
      };
      setConversations(updated);
    } else {
      const newConv = {
        id: `conv-call-${Date.now()}`,
        lead: {
          id: selectedMember.id || Date.now(),
          name: selectedMember.name,
          type: selectedMember.memberType || 'Creator',
          score: selectedMember.score || 85,
          flag: selectedMember.flag || selectedMember.country || '🌐',
          language: 'English',
          assignedAgent: user?.name || 'Priya Sharma',
          status: 'Active',
          vip: selectedMember.memberType === 'VIP Fan' || (selectedMember.score || 0) > 80,
          health: 90,
          lastInteraction: 'Just now'
        },
        channel: 'Phone',
        status: 'Read',
        unreadCount: 0,
        lastMessage: `📞 Call Logged: ${callOutcome}`,
        time: 'Just now',
        messages: [callLogMessage]
      };
      setConversations([newConv, ...convList]);
    }

    addToast('success', 'Call Logged Successfully! 📞', `Recorded ${callDuration} call with ${selectedMember.name} (${callOutcome}).`);
    if (onStartCall) {
      onStartCall(selectedMember);
    } else {
      handleResetAndClose();
    }
  };

  const handleSubmitNote = (e) => {
    e?.preventDefault?.();
    if (!selectedMember || !noteContent.trim()) return;

    const convList = Array.isArray(allConversations) ? allConversations : [];
    let convIndex = convList.findIndex(c => c.lead?.name === selectedMember.name || c.name === selectedMember.name);
    
    const noteMessage = {
      id: `m-note-${Date.now()}`,
      sender: 'agent',
      type: 'note',
      content: `⚠️ [PRIVATE STAFF NOTE - ${noteCategory}]\n${noteContent}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: user?.name || 'Priya Sharma'
    };

    if (convIndex !== -1) {
      const updated = [...convList];
      updated[convIndex] = {
        ...updated[convIndex],
        lastMessage: `📝 Staff Note: ${noteCategory}`,
        time: 'Just now',
        messages: [...(updated[convIndex].messages || []), noteMessage]
      };
      setConversations(updated);
    } else {
      const newConv = {
        id: `conv-note-${Date.now()}`,
        lead: {
          id: selectedMember.id || Date.now(),
          name: selectedMember.name,
          type: selectedMember.memberType || 'Creator',
          score: selectedMember.score || 85,
          flag: selectedMember.flag || selectedMember.country || '🌐',
          language: 'English',
          assignedAgent: user?.name || 'Priya Sharma',
          status: 'Active',
          vip: selectedMember.memberType === 'VIP Fan' || (selectedMember.score || 0) > 80,
          health: 90,
          lastInteraction: 'Just now'
        },
        channel: 'Internal',
        status: 'Read',
        unreadCount: 0,
        lastMessage: `📝 Staff Note: ${noteCategory}`,
        time: 'Just now',
        messages: [noteMessage]
      };
      setConversations([newConv, ...convList]);
    }

    addToast('success', 'Internal Note Saved! 📝', `Note added to ${selectedMember.name}'s timeline (Hidden from customer).`);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setCurrentStep('list');
    setSelectedMember(null);
    setCallSummary('');
    setNoteContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#111116] border border-gray-800 rounded-2xl w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-gray-900 via-gray-900/90 to-neon-blue/10 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center text-neon-blue">
              <Phone size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight">
                {currentStep === 'list' && 'Log Call / Add Note – Assigned Contacts'}
                {currentStep === 'log_call' && `Log Phone Call: ${selectedMember?.name}`}
                {currentStep === 'add_note' && `Add Internal Note: ${selectedMember?.name}`}
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                {currentStep === 'list' && 'Select an assigned lead, creator, or VIP fan to record call activity or staff notes.'}
                {currentStep === 'log_call' && `Recording voice interaction details for ${selectedMember?.memberType} (${selectedMember?.phone}).`}
                {currentStep === 'add_note' && `Writing a private staff note for ${selectedMember?.memberType} (${selectedMember?.email}).`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          
          {/* VIEW 1: CONTACT LIST */}
          {currentStep === 'list' && (
            <>
              <div className="p-4 border-b border-gray-800 bg-gray-900/40 space-y-3 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assigned members by name, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/50 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-blue transition-all"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-500 text-xs">🔍</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {['All', 'Creator', 'VIP Fan', 'Lead'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        activeTab === tab ? 'bg-neon-blue text-black font-black shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-gray-800/80 text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab === 'All' ? 'All Assigned' : `${tab}s`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-2.5 flex-1 overflow-y-auto">
                {allAssignedMembers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 font-bold text-xs">
                    No assigned contacts found matching your criteria.
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
                      
                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-800/80">
                        <button
                          type="button"
                          onClick={() => { if (onStartCall) onStartCall(m); else handleResetAndClose(); }}
                          className="flex-1 py-1.5 bg-neon-blue/15 hover:bg-neon-blue hover:text-black text-neon-blue border border-neon-blue/30 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-sm"
                          title="Start live call in dialer"
                        >
                          <Phone size={12} /> Call
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenCallLog(m)}
                          className="flex-1 py-1.5 bg-neon-green/15 hover:bg-neon-green hover:text-black text-neon-green border border-neon-green/30 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-sm"
                          title="Log past call"
                        >
                          <Phone size={12} /> Log Call
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenAddNote(m)}
                          className="flex-1 py-1.5 bg-yellow-400/15 hover:bg-yellow-400 hover:text-black text-yellow-400 border border-yellow-400/30 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-sm"
                          title="Add private staff note"
                        >
                          <FileText size={12} /> Note
                        </button>
                        <button
                          type="button"
                          onClick={() => { if (onOpen360) onOpen360(m); }}
                          className="flex-1 py-1.5 bg-neon-purple/15 hover:bg-neon-purple hover:text-black text-neon-purple border border-neon-purple/30 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-1 shadow-sm"
                          title="View 360° Profile & Past History"
                        >
                          👁️ 360°
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between items-center shrink-0">
                <span className="text-xs text-gray-400 font-medium">Showing {allAssignedMembers.length} assigned contact{allAssignedMembers.length !== 1 ? 's' : ''}</span>
                <button type="button" onClick={handleResetAndClose} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800">Close</button>
              </div>
            </>
          )}

          {/* VIEW 2: LOG CALL FORM */}
          {currentStep === 'log_call' && (
            <form onSubmit={handleSubmitCallLog} className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-3 bg-gray-900/80 border border-gray-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block">Contact Person</span>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    {selectedMember?.name} {selectedMember?.flag || '🌐'} <span className="text-xs text-gray-400">({selectedMember?.phone})</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-neon-green/10 text-neon-green border border-neon-green/20 text-[10px] font-bold">Inbound/Outbound Call</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Tag size={13} className="text-neon-blue"/> Call Outcome
                  </label>
                  <select
                    value={callOutcome}
                    onChange={e => setCallOutcome(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neon-green font-medium"
                  >
                    <option value="Connected & Interested">✅ Connected & Interested</option>
                    <option value="Left Voicemail">📬 Left Voicemail</option>
                    <option value="No Answer / Busy">⏳ No Answer / Busy</option>
                    <option value="KYC Follow-up Scheduled">📋 KYC Follow-up Scheduled</option>
                    <option value="Converted to VIP Tier">⭐ Converted to VIP Tier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Clock size={13} className="text-neon-green"/> Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:30"
                    value={callDuration}
                    onChange={e => setCallDuration(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-neon-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Call Summary & Next Steps</span>
                  <span className="text-[10px] text-gray-500 font-normal">Will be saved to conversation logs</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Summarize key points discussed during the phone call..."
                  value={callSummary}
                  onChange={e => setCallSummary(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-neon-green resize-none custom-scrollbar font-medium leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
                <button
                  type="button"
                  onClick={() => setCurrentStep('list')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Contacts
                </button>
                <button
                  type="submit"
                  onClick={handleSubmitCallLog}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-neon-green text-black hover:bg-green-400 shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all flex items-center gap-1.5"
                >
                  <CheckCircle size={15} /> Save & Log Call 🚀
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: ADD INTERNAL NOTE FORM */}
          {currentStep === 'add_note' && (
            <form onSubmit={handleSubmitNote} className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-yellow-400 uppercase tracking-wider font-bold block flex items-center gap-1">
                    ⚠️ Private Staff Note for
                  </span>
                  <p className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    {selectedMember?.name} {selectedMember?.flag || '🌐'} <span className="text-xs text-gray-400">({selectedMember?.email})</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 text-[10px] font-black uppercase">Staff Only</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag size={13} className="text-yellow-400"/> Note Category
                </label>
                <select
                  value={noteCategory}
                  onChange={e => setNoteCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400 font-medium"
                >
                  <option value="KYC & Compliance">🛡️ KYC & Compliance Verification</option>
                  <option value="VIP Commission">💰 VIP Commission Tier Setup</option>
                  <option value="General Account Note">📌 General Account Note</option>
                  <option value="Supervisor Review Required">🚨 Supervisor Review Required</option>
                  <option value="Creator Studio Onboarding">🎥 Creator Studio Onboarding</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Private Note Content</span>
                  <span className="text-[10px] text-yellow-400/80 font-normal">Hidden from customer</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write detailed staff notes regarding KYC documents, commission structures, or follow-up instructions..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3.5 text-sm text-yellow-100 placeholder:text-gray-500 focus:outline-none focus:border-yellow-400 resize-none custom-scrollbar font-medium leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-[11px] text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
                <span>This note will be attached to {selectedMember?.name}'s timeline and is visible to Sales Agents and Supervisors.</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
                <button
                  type="button"
                  onClick={() => setCurrentStep('list')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-gray-800 flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Contacts
                </button>
                <button
                  type="submit"
                  onClick={handleSubmitNote}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)] transition-all flex items-center gap-1.5"
                >
                  <FileText size={15} /> Save Internal Note 📝
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
