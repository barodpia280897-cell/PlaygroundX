import { useState } from 'react';
import { useTenantData } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Smartphone, Search, Filter, MessageSquare, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ComposeModal({ open, onClose, replyTo }) {
  const { addToast } = useToast();
  const [to, setTo] = useState(replyTo || '');
  const [msg, setMsg] = useState('');
  const [channel, setChannel] = useState('WhatsApp');

  const handleSend = () => {
    if (!to.trim() || !msg.trim()) {
      addToast('warning', 'Missing Fields', 'Please fill in recipient and message.');
      return;
    }
    addToast('success', 'Message Sent', `${channel} message sent to ${to}.`);
    setTo(''); setMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            className="bg-gray-950 border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-white font-black text-base flex items-center gap-2">
                <MessageSquare size={18} className="text-neon-blue" />
                {replyTo ? `Reply to ${replyTo}` : 'New Message'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full bg-gray-900"><X size={16}/></button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Channel</label>
              <select value={channel} onChange={e => setChannel(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue">
                <option value="WhatsApp">💬 WhatsApp</option>
                <option value="SMS">📱 SMS</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">To (Name / Number)</label>
              <input
                value={to} onChange={e => setTo(e.target.value)}
                placeholder="e.g. Maria Gonzalez or +1 555 000 1234"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Message</label>
              <textarea
                rows={4} value={msg} onChange={e => setMsg(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="flex-1 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleSend} className="flex-1 py-2 bg-neon-blue hover:bg-neon-blue/90 text-black rounded-xl text-sm font-black transition-colors flex items-center justify-center gap-2">
                <Send size={15}/> Send {channel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ReceptionMessages() {
  const [conversations] = useTenantData('conversations');
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  const receptionMsgs = (conversations || []).slice(0, 5);

  const handleReply = (msg) => {
    const name = typeof msg.lead === 'object' ? msg.lead.name : msg.lead;
    setReplyTo(name);
    setShowCompose(true);
  };

  const handleNewMessage = () => {
    setReplyTo(null);
    setShowCompose(true);
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Smartphone size={24} className="text-neon-blue" />
            SMS &amp; WhatsApp
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage front desk SMS and WhatsApp communications.</p>
        </div>
        <button
          onClick={handleNewMessage}
          className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/90 text-black rounded-lg text-sm font-black transition-colors flex items-center gap-2"
        >
          <MessageSquare size={16} /> New Message
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages by name or number..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-blue focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800">
          <Filter size={16} /> All Channels
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
        {receptionMsgs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent messages.</div>
        ) : (
          receptionMsgs.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4 rounded-2xl flex justify-between items-center group cursor-pointer hover:border-neon-blue/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="text-lg">{msg.platform === 'WhatsApp' ? '💬' : '📱'}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">
                    {typeof msg.lead === 'object' ? msg.lead.name : msg.lead}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 truncate max-w-md">{msg.lastMessage}</div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <div className="text-[10px] text-gray-500 font-mono">{msg.time}</div>
                <button
                  onClick={() => handleReply(msg)}
                  className="px-3 py-1.5 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 text-xs font-bold rounded-lg hover:bg-neon-blue/20 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                >
                  <Send size={12}/> Reply
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ComposeModal
        open={showCompose}
        onClose={() => { setShowCompose(false); setReplyTo(null); }}
        replyTo={replyTo}
      />
    </div>
  );
}
