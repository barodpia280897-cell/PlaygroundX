import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Check, CheckCheck } from 'lucide-react';

const mockChats = [
  { id: 1, name: 'Maria Gonzalez', avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=25D366&color=fff', lastMsg: 'I just submitted the KYC documents!', time: '10:42 AM', unread: 2 },
  { id: 2, name: 'John Doe (Acme)', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=00f0ff&color=fff', lastMsg: 'Thanks for the quick update.', time: 'Yesterday', unread: 0 },
  { id: 3, name: 'VIP Support Channel', avatar: 'https://ui-avatars.com/api/?name=VIP&background=ffd700&color=fff', lastMsg: 'The server migration is complete.', time: 'Monday', unread: 0 },
  { id: 4, name: 'Emma Wilson', avatar: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=8a2be2&color=fff', lastMsg: 'Can we reschedule our meeting?', time: '09:15 AM', unread: 1 },
  { id: 5, name: 'David Lee', avatar: 'https://ui-avatars.com/api/?name=David+Lee&background=ff7f00&color=fff', lastMsg: 'Okay, got it 👍', time: 'Sunday', unread: 0 },
];

const mockMessages = [
  { id: 1, text: 'Hi Maria, did you receive the welcome kit?', sender: 'me', time: '10:30 AM', status: 'read' },
  { id: 2, text: 'Yes, thank you! I am going through it now.', sender: 'them', time: '10:35 AM' },
  { id: 3, text: 'Great. Let me know if you need help with KYC.', sender: 'me', time: '10:36 AM', status: 'read' },
  { id: 4, text: 'Actually, yes. What documents do I need to upload?', sender: 'them', time: '10:38 AM' },
  { id: 5, text: 'A government ID and a proof of address.', sender: 'me', time: '10:40 AM', status: 'read' },
  { id: 6, text: 'I just submitted the KYC documents!', sender: 'them', time: '10:42 AM' },
];

export default function WhatsAppModal({ open, onClose }) {
  const [activeChat, setActiveChat] = useState(mockChats[0]);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  if (!open) return null;

  const handleSend = () => {
    if (!msgInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: msgInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMsg]);
    setMsgInput('');
    // Update last message in chat list (mocking)
    activeChat.lastMsg = newMsg.text;
    activeChat.time = newMsg.time;
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="w-full max-w-5xl h-[85vh] bg-[#111b21] border border-gray-800 shadow-2xl overflow-hidden flex rounded-xl"
        >
          
          {/* LEFT SIDEBAR - CHAT LIST */}
          <div className="w-1/3 min-w-[300px] border-r border-[#222d34] flex flex-col bg-[#111b21]">
            {/* Header */}
            <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Me&background=00a884&color=fff" alt="User" />
                </div>
                <span className="text-gray-200 font-semibold text-sm">Chats</span>
              </div>
              <div className="flex items-center gap-4 text-[#aebac1]">
                <button className="hover:text-white"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Search */}
            <div className="p-2 border-b border-[#222d34]">
              <div className="bg-[#202c33] rounded-lg flex items-center px-3 py-1.5 gap-3">
                <Search size={16} className="text-[#aebac1]" />
                <input 
                  type="text" 
                  placeholder="Search or start new chat" 
                  className="bg-transparent border-none text-sm text-[#d1d7db] w-full focus:outline-none placeholder:text-[#aebac1]"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {mockChats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => { setActiveChat(chat); setMessages(mockMessages); }}
                  className={`flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-[#202c33] transition-colors border-b border-[#222d34] ${activeChat.id === chat.id ? 'bg-[#2a3942]' : ''}`}
                >
                  <img src={chat.avatar} className="w-12 h-12 rounded-full shrink-0" alt={chat.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[#e9edef] font-medium text-[15px] truncate">{chat.name}</span>
                      <span className={`text-xs ${chat.unread ? 'text-[#00a884]' : 'text-[#8696a0]'}`}>{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#8696a0] text-[13px] truncate">{chat.lastMsg}</span>
                      {chat.unread > 0 && (
                        <div className="bg-[#00a884] text-[#111b21] text-[11px] font-bold px-1.5 min-w-[20px] h-5 rounded-full flex items-center justify-center shrink-0">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANE - ACTIVE CHAT */}
          <div className="flex-1 flex flex-col bg-[#0b141a] relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")' }}></div>
            
            {/* Header */}
            <div className="h-16 bg-[#202c33] flex items-center justify-between px-4 shrink-0 relative z-10 border-b border-[#222d34]">
              <div className="flex items-center gap-4 cursor-pointer">
                <img src={activeChat.avatar} className="w-10 h-10 rounded-full" alt={activeChat.name} />
                <div>
                  <div className="text-[#e9edef] font-medium text-[15px]">{activeChat.name}</div>
                  <div className="text-[#8696a0] text-[13px]">click here for contact info</div>
                </div>
              </div>
              <div className="flex items-center gap-5 text-[#aebac1]">
                <button className="hover:text-white transition-colors"><Video size={20} /></button>
                <button className="hover:text-white transition-colors"><Search size={20} /></button>
                <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
                <div className="w-px h-6 bg-[#222d34] mx-1"></div>
                <button onClick={onClose} className="text-gray-400 hover:text-red-400 transition-colors p-1 bg-black/20 rounded-lg"><X size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="bg-[#182229] text-[#8696a0] text-[11px] uppercase tracking-wide px-3 py-1 rounded-lg font-medium shadow-sm">
                  Today
                </div>
              </div>
              
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-xl px-2 py-1.5 relative shadow-sm ${msg.sender === 'me' ? 'bg-[#005c4b] text-[#e9edef]' : 'bg-[#202c33] text-[#e9edef]'}`} style={{ borderTopRightRadius: msg.sender === 'me' ? '0' : '12px', borderTopLeftRadius: msg.sender === 'them' ? '0' : '12px' }}>
                    <div className="text-[14.2px] leading-relaxed break-words px-1 pb-[14px]">
                      {msg.text}
                    </div>
                    <div className="text-[11px] text-white/50 absolute bottom-1 right-2 flex items-center gap-1">
                      {msg.time}
                      {msg.sender === 'me' && (
                        msg.status === 'read' ? <CheckCheck size={14} className="text-[#53bdeb]" /> : <Check size={14} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center gap-4 relative z-10 shrink-0">
              <button className="text-[#aebac1] hover:text-white transition-colors"><Smile size={24} /></button>
              <button className="text-[#aebac1] hover:text-white transition-colors"><Paperclip size={24} /></button>
              
              <div className="flex-1 bg-[#2a3942] rounded-lg flex items-center px-4 py-2.5">
                <input 
                  type="text" 
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message" 
                  className="bg-transparent border-none text-[#e9edef] w-full focus:outline-none placeholder:text-[#8696a0] text-[15px]"
                />
              </div>
              
              {msgInput.trim() ? (
                <button onClick={handleSend} className="text-[#00a884] hover:text-[#00c298] transition-colors bg-[#005c4b]/20 p-2 rounded-full">
                  <Check size={20} />
                </button>
              ) : (
                <button className="text-[#aebac1] hover:text-white transition-colors"><Mic size={24} /></button>
              )}
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
