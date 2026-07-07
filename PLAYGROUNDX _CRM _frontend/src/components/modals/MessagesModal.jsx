// src/components/modals/MessagesModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Search } from 'lucide-react';

const crmConversations = [
  { id: 1, name: 'Priya Sharma (Manager)', flag: '👑', channel: 'Direct', time: '2m', unread: 2, last: 'Can you review the VIP lead?', avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 2, name: 'Carlos Ray (Agent)', flag: '🎧', channel: 'Direct', time: '5m', unread: 1, last: 'SLA is getting breached in KYC', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: 3, name: 'Global Operations', flag: '🚨', channel: 'Group', time: '10m', unread: 3, last: 'System update at midnight', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 4, name: 'Ahmed Al Mansour', flag: '👔', channel: 'Direct', time: '15m', unread: 0, last: 'Approved the vacation request', avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 5, name: 'Support Team', flag: '👥', channel: 'Group', time: '20m', unread: 0, last: 'Who can take the next shift?', avatar: 'https://i.pravatar.cc/150?img=33' },
];

const platformConversations = [
  { id: 1, name: 'DataNest Analytics', flag: '🏢', channel: 'Support', time: '2m', unread: 1, last: 'We need to upgrade our plan', avatar: 'https://i.pravatar.cc/150?u=data' },
  { id: 2, name: 'Peak Retail Co.', flag: '🏢', channel: 'Billing', time: '15m', unread: 1, last: 'Payment failed for Invoice #892', avatar: 'https://i.pravatar.cc/150?u=peak' },
  { id: 3, name: 'System Alerts', flag: '🚨', channel: 'Infra', time: '30m', unread: 3, last: 'High CPU load on Gateway Node 4', avatar: 'https://i.pravatar.cc/150?u=sys' },
  { id: 4, name: 'BrightSpark Media', flag: '🏢', channel: 'Sales', time: '1h', unread: 0, last: 'Can we schedule a demo?', avatar: 'https://i.pravatar.cc/150?u=bright' },
];

const channelColors = { Direct: '#00f0ff', Group: '#8a2be2', Support: '#3b82f6', Billing: '#f59e0b', Infra: '#ef4444', Sales: '#10b981' };

const crmMessages = [
  { from: 'lead', text: 'Hey, I need some help with the new KYC process. Can you jump on a quick huddle?', time: '10:30 AM' },
  { from: 'agent', text: 'Sure thing. Let me finish this VIP ticket first. Give me 5 mins.', time: '10:31 AM' },
  { from: 'lead', text: 'Okay, I will share the screen when you are ready.', time: '10:32 AM' },
  { from: 'agent', text: 'Ready! Send the internal meet link.', time: '10:35 AM' },
];

const platformMessages = [
  { from: 'lead', text: 'Hi team, our usage has skyrocketed and we are hitting the API rate limits on the Pro plan.', time: '09:15 AM' },
  { from: 'agent', text: 'Hello! I see you are nearing the 50k limit. Would you like me to initiate the Enterprise upgrade flow?', time: '09:20 AM' },
  { from: 'lead', text: 'Yes please, send over the new contract and pricing details.', time: '09:25 AM' },
];

import { useAuth } from '../../contexts/AuthContext';

export default function MessagesModal({ open, onClose }) {
  const { user } = useAuth();
  const isPlatform = user?.role === 'PLATFORM_ADMIN';
  const conversations = isPlatform ? platformConversations : crmConversations;
  const sampleMessages = isPlatform ? platformMessages : crmMessages;

  const [selected, setSelected] = useState(conversations[0]);
  const [input, setInput] = useState('');

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
        className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-[580px] h-[calc(100vh-6rem)] sm:h-[500px] bg-gray-950/97 border border-gray-800 rounded-2xl shadow-2xl flex flex-col sm:flex-row overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Left: Conversation list */}
        <div className="w-full sm:w-52 h-[40%] sm:h-auto border-b sm:border-b-0 sm:border-r border-gray-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-neon-blue" />
                <span className="text-sm font-bold text-white">Messages</span>
              </div>
              <button onClick={onClose}><X size={14} className="text-muted hover:text-white" /></button>
            </div>
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input placeholder="Search..." className="w-full bg-gray-900 border border-gray-800 rounded-lg py-1.5 pl-7 pr-2 text-[11px] text-primary focus:outline-none focus:border-neon-blue/40" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setSelected(c)}
                className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors border-b border-gray-800/50 ${selected.id === c.id ? 'bg-neon-blue/10' : 'hover:bg-white/5'}`}>
                <div className="relative shrink-0">
                  <img src={c.avatar} className="w-8 h-8 rounded-full object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 text-[10px]">{c.flag}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-200 truncate">{c.name}</span>
                    {c.unread > 0 && <span className="w-4 h-4 rounded-full bg-neon-blue text-[9px] font-bold text-black flex items-center justify-center shrink-0">{c.unread}</span>}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[9px] font-bold" style={{ color: channelColors[c.channel] }}>{c.channel}</span>
                    <span className="text-[9px] text-gray-600 truncate">· {c.last}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
            <img src={selected.avatar} className="w-8 h-8 rounded-full" />
            <div>
              <div className="text-sm font-bold text-white">{selected.name} {selected.flag}</div>
              <div className="text-[10px]" style={{ color: channelColors[selected.channel] }}>{selected.channel}</div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {sampleMessages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'agent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                  m.from === 'agent'
                    ? 'bg-neon-blue/20 border border-neon-blue/20 text-gray-100 rounded-br-sm'
                    : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-sm'
                }`}>
                  {m.text}
                  <div className="text-[9px] text-gray-600 mt-1 text-right">{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder={`Reply on ${selected.channel}...`}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-blue/40"
            />
            <button onClick={() => setInput('')} className="w-8 h-8 rounded-xl bg-neon-blue flex items-center justify-center hover:shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all">
              <Send size={13} className="text-black" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
