import { useState } from 'react';
import { Send, Image, Paperclip, FileText, Smile } from 'lucide-react';

export default function OmnichannelComposer({ onSend, defaultChannel = 'WhatsApp', channels = ['WhatsApp', 'SMS', 'Email'] }) {
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState(defaultChannel);
  const [isInternal, setIsInternal] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend({ text: message, channel: isInternal ? 'Internal Note' : channel });
      setMessage('');
    }
  };

  return (
    <div className="bg-gray-900 border-t border-white/5 p-4 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {channels.map(ch => (
            <button 
              key={ch}
              onClick={() => { setChannel(ch); setIsInternal(false); }}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                !isInternal && channel === ch 
                  ? (ch === 'WhatsApp' ? 'bg-[#25D366]/20 border-[#25D366] text-[#25D366]' : 
                     ch === 'Email' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 
                     'bg-purple-500/20 border-purple-500 text-purple-400')
                  : 'bg-transparent border-gray-700 text-gray-400 hover:text-gray-300'
              }`}
            >
              {ch}
            </button>
          ))}
          <button 
            onClick={() => setIsInternal(true)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ${
              isInternal ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-transparent border-gray-700 text-gray-400 hover:text-gray-300'
            }`}
          >
            Internal Note
          </button>
        </div>
        <button className="self-start sm:self-auto text-xs px-3 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded hover:bg-gray-700 flex items-center gap-1 transition-colors">
          <FileText className="w-3 h-3" /> Templates
        </button>
      </div>
      
      <div className="relative">
        <textarea 
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isInternal ? "Add an internal note (only visible to team)..." : `Type a ${channel} message...`}
          className={`w-full bg-gray-950/50 border rounded-lg p-3 text-sm text-gray-100 focus:outline-none resize-none transition-colors ${
            isInternal ? 'border-yellow-500/50 focus:border-yellow-500' : 'border-gray-700 focus:border-neon-blue'
          }`}
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-gray-400">
          <button className="hover:text-neon-blue transition-colors"><Smile className="w-4 h-4" /></button>
          <button className="hover:text-neon-blue transition-colors"><Paperclip className="w-4 h-4" /></button>
          <button className="hover:text-neon-blue transition-colors"><Image className="w-4 h-4" /></button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={handleSend}
          disabled={!message.trim()}
          className={`px-6 py-2 text-white text-sm font-medium rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
            isInternal ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-gradient-to-r from-neon-blue to-purple-500 hover:opacity-90'
          }`}
        >
          {isInternal ? 'Save Note' : 'Send'} <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
