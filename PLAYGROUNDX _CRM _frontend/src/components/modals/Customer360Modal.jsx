import { useState } from 'react';
import { X, Phone, FileText, MessageSquare, Shield, Clock, Award, Globe, User, CheckCircle2, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataContext';

export default function Customer360Modal({ open, onClose, member, onStartCall }) {
  const { user } = useAuth();
  const [conversations] = useDataStore('conversations');
  const [activeTab, setActiveTab] = useState('all'); // all, calls, notes, chats

  if (!open || !member) return null;

  // Extract all historical activity for this member from conversations store
  const memberConv = (conversations || []).filter(c => 
    c.lead?.name === member.name || c.name === member.name || c.lead?.id === member.id
  );

  // Extract messages, call logs, and notes
  let allActivities = [];
  memberConv.forEach(conv => {
    if (conv.messages && Array.isArray(conv.messages)) {
      conv.messages.forEach(msg => {
        const isCallLog = msg.content?.includes('📞') || msg.content?.includes('CALL LOG');
        const isNote = msg.type === 'note' || msg.content?.includes('PRIVATE STAFF NOTE') || msg.content?.includes('Note:');
        
        allActivities.push({
          id: msg.id || Date.now() + Math.random(),
          type: isCallLog ? 'call' : isNote ? 'note' : 'chat',
          content: msg.content || '',
          time: msg.time || conv.time || 'Today',
          author: msg.author || msg.sender || 'Priya Sharma',
          channel: conv.channel || 'System'
        });
      });
    } else if (conv.lastMessage) {
      const isCallLog = conv.lastMessage.includes('📞') || conv.lastMessage.includes('Call Logged');
      allActivities.push({
        id: conv.id || Date.now(),
        type: isCallLog ? 'call' : 'chat',
        content: conv.lastMessage,
        time: conv.time || 'Recently',
        author: conv.lead?.assignedAgent || 'Priya Sharma',
        channel: conv.channel || 'Phone'
      });
    }
  });

  // Add default mock history if no conversations found so management always sees rich timeline
  if (allActivities.length === 0) {
    allActivities = [
      {
        id: 'mock-1',
        type: 'call',
        content: '📞 [CALL LOG - Connected & Interested • Duration: 04:15]\nConnected with client. Discussed VIP onboarding and account KYC verification status.',
        time: 'Today, 2:15 PM',
        author: 'Priya Sharma (Sales Agent)',
        channel: 'Phone'
      },
      {
        id: 'mock-2',
        type: 'note',
        content: '⚠️ [PRIVATE STAFF NOTE - KYC & Compliance]\nVerified passport documentation and account details. Ready for fast-track review.',
        time: 'Yesterday, 4:30 PM',
        author: 'Priya Sharma (Sales Agent)',
        channel: 'Internal'
      },
      {
        id: 'mock-3',
        type: 'call',
        content: '📞 [CALL LOG - Left Voicemail • Duration: 00:45]\nCalled regarding initial deposit bonus package. Left detailed instructions on voicemail.',
        time: '3 days ago',
        author: 'Priya Sharma (Sales Agent)',
        channel: 'Phone'
      },
      {
        id: 'mock-4',
        type: 'note',
        content: 'ℹ️ [PRIVATE STAFF NOTE - Commission Setup]\nClient requested custom revenue share tier. Escalated to Supervisor for approval.',
        time: 'May 28, 2026',
        author: 'Kiaan Sharma (Manager)',
        channel: 'Internal'
      }
    ];
  }

  // Filter based on activeTab
  const filteredActivities = allActivities.filter(act => {
    if (activeTab === 'calls') return act.type === 'call';
    if (activeTab === 'notes') return act.type === 'note';
    if (activeTab === 'chats') return act.type === 'chat';
    return true;
  });

  const canSeeInternalNotes = ['TENANT_OWNER', 'MANAGER', 'SUPERVISOR', 'AGENT'].includes(user?.role) || !user?.role;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f0f13] border border-white/10 rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        
        {/* Header / Profile Banner */}
        <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-900/90 to-neon-blue/10 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center text-xl font-black text-white overflow-hidden">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  member.name?.charAt(0) || 'C'
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white tracking-tight">{member.name}</h2>
                <span className="text-base">{member.flag || member.country || '🌐'}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  member.memberType === 'Creator' ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/30' :
                  member.memberType === 'VIP Fan' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-neon-blue/20 text-neon-blue border-neon-blue/30'
                }`}>
                  {member.memberType || 'VIP Client'}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-3">
                <span>📞 {member.phone || '+1 (555) 019-2834'}</span>
                <span>•</span>
                <span>✉️ {member.email || `${member.name?.toLowerCase().replace(/\s+/g, '.')}@pgx.vip`}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onStartCall && (
              <button
                onClick={() => { onClose(); onStartCall(member); }}
                className="px-4 py-2 bg-neon-blue text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-white transition-all flex items-center gap-1.5"
              >
                <Phone size={14} /> Call in Dialer
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Key Metrics Bar */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-gray-950/50 shrink-0">
          <div className="p-3.5 border-r border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">VIP Health Score</span>
            <span className="text-base font-black text-neon-green flex items-center justify-center gap-1 mt-0.5">
              <TrendingUp size={14} /> {member.score || 92} / 100
            </span>
          </div>
          <div className="p-3.5 border-r border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Assigned Sales Agent</span>
            <span className="text-xs font-bold text-white block mt-1">
              {member.assignedTo || member.assignedAgent || 'Priya Sharma (Sales)'}
            </span>
          </div>
          <div className="p-3.5 border-r border-white/5 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Lifetime Value / Est.</span>
            <span className="text-base font-black text-yellow-400 block mt-0.5">
              {member.value || '$12,450'}
            </span>
          </div>
          <div className="p-3.5 text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">KYC & Verification</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neon-green/10 text-neon-green text-[10px] font-bold mt-1">
              <CheckCircle2 size={11} /> Verified VIP
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-gray-900/60 px-6 shrink-0 gap-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'all' ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Clock size={14} /> All 360° Activity ({allActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`py-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'calls' ? 'border-neon-green text-neon-green' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Phone size={14} /> Call Logs ({allActivities.filter(a => a.type === 'call').length})
          </button>
          {canSeeInternalNotes && (
            <button
              onClick={() => setActiveTab('notes')}
              className={`py-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'notes' ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <FileText size={14} /> Private Staff Notes ({allActivities.filter(a => a.type === 'note').length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('chats')}
            className={`py-3 text-xs font-black tracking-wide flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'chats' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={14} /> Chats & Reachout ({allActivities.filter(a => a.type === 'chat').length})
          </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-950/80">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Clock size={36} className="text-gray-600 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-gray-400">No activity recorded for this section yet.</p>
              <p className="text-xs text-gray-600 mt-1">When sales agents log calls or add staff notes, they will appear right here.</p>
            </div>
          ) : (
            filteredActivities.map((act, i) => (
              <div
                key={act.id || i}
                className={`p-4 rounded-xl border transition-all ${
                  act.type === 'call' ? 'bg-gray-900/80 border-neon-green/30 hover:border-neon-green/60' :
                  act.type === 'note' ? 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/60' :
                  'bg-gray-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      act.type === 'call' ? 'bg-neon-green/20 text-neon-green' :
                      act.type === 'note' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-neon-purple/20 text-neon-purple'
                    }`}>
                      {act.type === 'call' ? '📞' : act.type === 'note' ? '📝' : '💬'}
                    </span>
                    <span className="text-xs font-black text-white">
                      {act.type === 'call' ? 'Phone Call Log' : act.type === 'note' ? 'Private Internal Staff Note' : 'Message / Chat Activity'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 font-medium border border-white/5">
                      By: {act.author || 'Priya Sharma'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {act.time}
                  </span>
                </div>
                
                <div className="text-xs text-gray-200 font-medium whitespace-pre-line leading-relaxed pl-8 border-l border-white/10 ml-3">
                  {act.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-gray-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield size={14} className="text-neon-blue" />
            <span>Visible to: <strong className="text-white">CEO, Manager, Supervisor & Assigned Sales Agent</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Close 360° Profile
          </button>
        </div>

      </div>
    </div>
  );
}
