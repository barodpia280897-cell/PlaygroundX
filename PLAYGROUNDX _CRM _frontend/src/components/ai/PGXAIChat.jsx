import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { callGemini } from '../../utils/geminiClient';
import { X, Send, Bot, Sparkles, MessageSquare, Minimize2, CornerDownLeft } from 'lucide-react';

export default function PGXAIChat() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi **${user?.name || 'there'}**! 🤖 I'm your **PlayGroundX AI Assistant**.\n\nI'm context-aware and know you are working as a **${user?.roleLabel || user?.role || 'User'}** on the **${getPageName(location.pathname)}** page.\n\nHow can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Listen for global open/toggle events from Sidebar or buttons
  useEffect(() => {
    const handleOpen = () => { setIsDismissed(false); setIsOpen(true); };
    const handleToggle = () => { setIsDismissed(false); setIsOpen(prev => !prev); };
    window.addEventListener('open-pgx-ai-chat', handleOpen);
    window.addEventListener('toggle-pgx-ai-chat', handleToggle);
    return () => {
      window.removeEventListener('open-pgx-ai-chat', handleOpen);
      window.removeEventListener('toggle-pgx-ai-chat', handleToggle);
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen, isLoading]);

  function getPageName(pathname) {
    if (pathname.includes('/automations')) return 'Automation Center';
    if (pathname.includes('/leads')) return 'Leads Management';
    if (pathname.includes('/vip')) return 'VIP Center';
    if (pathname.includes('/dashboard')) return 'Executive Dashboard';
    if (pathname.includes('/campaigns')) return 'Campaigns & Broadcasts';
    if (pathname.includes('/reception')) return 'Front Desk Center';
    if (pathname.includes('/appointments')) return 'Appointment Center';
    if (pathname.includes('/agents')) return 'Agents Management';
    if (pathname.includes('/revenue')) return 'Revenue Analytics';
    const parts = pathname.split('/').filter(Boolean);
    return parts.length > 1 ? parts[1].replace('-', ' ').toUpperCase() : 'CRM Dashboard';
  }

  function getSuggestedPrompts(pathname) {
    if (pathname.includes('/automations')) {
      return [
        "Explain how this workflow works",
        "Suggest next automation step",
        "How to debug a stuck node?",
        "Best practice for WhatsApp reminders"
      ];
    }
    if (pathname.includes('/leads')) {
      return [
        "How do I qualify a high-value lead?",
        "Best follow-up sequence for leads?",
        "How to convert a lead to a creator?"
      ];
    }
    if (pathname.includes('/vip')) {
      return [
        "What qualifies a fan as VIP?",
        "How to engage high-value creators?",
        "Explain VIP escalation steps"
      ];
    }
    if (pathname.includes('/campaigns')) {
      return [
        "Write a promotional WhatsApp template",
        "What is the best time to send broadcasts?",
        "How to segment my audience?"
      ];
    }
    return [
      "How does this module work?",
      "Summarize best practices for my role",
      "What actions can I take here?",
      "How is tenant isolation handled?"
    ];
  }

  const handleSend = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : input;
    if (!query || !query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (typeof textToSend !== 'string') setInput('');
    setIsLoading(true);

    // Build context-aware system prompt
    const pageName = getPageName(location.pathname);
    const systemPrompt = `You are PGX AI Assistant, an intelligent CRM assistant for PlayGroundX — a premium entertainment and creator CRM platform.

Current User Context:
- Name: ${user?.name || 'User'}
- Role: ${user?.role || 'AGENT'} (${user?.roleLabel || 'Team Member'})
- Tenant: ${user?.tenantName || 'Acme Digital'}

Current Page: ${pageName}
Page URL: ${location.pathname}

Your capabilities & rules:
1. Answer questions about PlayGroundX CRM features and modules (Dashboard, Leads, Creators, Fans, Pipelines, AI Center, Escalations, Tasks, Calendar, Reports, Revenue Center, Agents, Quality Assurance, Campaigns, VIP Center, Automations, Settings, Integrations, System Health, Front Desk Operations).
2. Help users understand how their current page (${pageName}) works and provide actionable recommendations tailored to their role (${user?.roleLabel || user?.role}).
3. When asked to write templates (WhatsApp/Email/SMS), provide clean, conversion-focused formatting with variables like {{first_name}} or {{link}}.
4. Keep answers clear, well-formatted using markdown (bolding, bullet points), professional, and concise.
5. If asked about real-time database totals that require a live server query, politely explain that you can guide them on where to view those reports in the CRM interface.`;

    const replyText = await callGemini(newMessages.filter(m => m.id !== 'welcome'), systemPrompt);

    const botMsg = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...newMessages, botMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    // Simple formatting for bold and newlines
    return text.split('\n').map((line, i) => (
      <span key={i} className="block mb-1 last:mb-0">
        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-indigo-300">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    ));
  };

  return (
    <>
      {/* ── Floating Button (Collapsed State) - Hidden on mobile (<1024px) ───── */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-50 items-center gap-2">
        {!isOpen && !isDismissed && (
          <div className="relative group flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 pl-4 pr-9 py-3 rounded-full border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}
              title="Chat with PGX AI"
            >
              {/* Robot Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center border border-indigo-400/50 bg-indigo-600/40 shrink-0">
                <svg viewBox="0 0 64 64" width="22" height="22">
                  <rect x="16" y="20" width="32" height="24" rx="6" fill="#818cf8" />
                  <rect x="21" y="27" width="9" height="7" rx="2.5" fill="#fff" />
                  <rect x="34" y="27" width="9" height="7" rx="2.5" fill="#fff" />
                  <circle cx="25.5" cy="30.5" r="2.5" fill="#312e81" />
                  <circle cx="38.5" cy="30.5" r="2.5" fill="#312e81" />
                  <rect x="25" y="38" width="14" height="2.5" rx="1.25" fill="#fff" opacity="0.8" />
                  <rect x="30" y="12" width="4" height="8" rx="2" fill="#a5b4fc" />
                  <circle cx="32" cy="10" r="3.5" fill="#c4b5fd" />
                  <rect x="5" y="24" width="11" height="5" rx="2.5" fill="#6366f1" />
                  <rect x="48" y="24" width="11" height="5" rx="2.5" fill="#6366f1" />
                </svg>
              </div>
              
              <div className="flex flex-col text-left pr-1">
                <span className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                  PGX AI <Sparkles size={12} className="text-indigo-400 animate-pulse" />
                </span>
                <span className="text-[10px] font-semibold text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> ONLINE
                </span>
              </div>
            </button>

            {/* Close / Dismiss Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="absolute right-2.5 w-5 h-5 rounded-full bg-indigo-950/90 hover:bg-red-500 border border-indigo-400/40 hover:border-red-400 text-indigo-300 hover:text-white flex items-center justify-center text-[10px] transition-all cursor-pointer shadow-sm z-10"
              title="Hide AI floating button"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      {/* ── Slide-up Drawer Modal (Expanded State) ──────────────────────────── */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] h-[560px] max-h-[85vh] rounded-2xl border border-indigo-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(99,102,241,0.2)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
          style={{ background: 'linear-gradient(165deg, #0b0f19 0%, #060911 100%)' }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-indigo-900/40 flex items-center justify-between shrink-0" style={{ background: 'linear-gradient(90deg, rgba(30,27,75,0.7) 0%, rgba(15,23,42,0.8) 100%)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center border border-indigo-400/40 bg-indigo-600/30 shrink-0">
                <svg viewBox="0 0 64 64" width="24" height="24">
                  <rect x="16" y="20" width="32" height="24" rx="6" fill="#818cf8" />
                  <rect x="21" y="27" width="9" height="7" rx="2.5" fill="#fff" />
                  <rect x="34" y="27" width="9" height="7" rx="2.5" fill="#fff" />
                  <circle cx="25.5" cy="30.5" r="2.5" fill="#312e81" />
                  <circle cx="38.5" cy="30.5" r="2.5" fill="#312e81" />
                  <rect x="25" y="38" width="14" height="2.5" rx="1.25" fill="#fff" opacity="0.8" />
                  <rect x="30" y="12" width="4" height="8" rx="2" fill="#a5b4fc" />
                  <circle cx="32" cy="10" r="3.5" fill="#c4b5fd" />
                  <rect x="5" y="24" width="11" height="5" rx="2.5" fill="#6366f1" />
                  <rect x="48" y="24" width="11" height="5" rx="2.5" fill="#6366f1" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  PGX AI Assistant <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded font-mono">v2.5</span>
                </div>
                <div className="text-[10px] text-green-400 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  ONLINE · <span className="text-slate-400 font-normal">{getPageName(location.pathname)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Minimize chat"
              >
                <Minimize2 size={15} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-red-500/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Suggested Prompts (Chips) */}
          <div className="px-3 py-2 border-b border-slate-800/60 bg-slate-900/40 overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Sparkles size={10} className="text-indigo-400" /> Suggest:
            </span>
            {getSuggestedPrompts(location.pathname).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-[11px] font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-indigo-400/50 rounded-full px-2.5 py-1 whitespace-nowrap transition-all cursor-pointer shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-baseline gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {isBot ? 'PGX AI' : user?.name || 'You'}
                    </span>
                    <span className="text-[9px] text-slate-500">{msg.time}</span>
                  </div>
                  <div 
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      isBot 
                        ? 'bg-slate-900/90 border border-indigo-500/25 text-slate-200 rounded-tl-sm' 
                        : 'bg-indigo-600 text-white rounded-tr-sm font-medium shadow-[0_2px_10px_rgba(79,70,229,0.3)]'
                    }`}
                  >
                    {isBot ? formatText(msg.content) : msg.content}
                  </div>
                </div>
              );
            })}
            
            {/* Loading typing indicator */}
            {isLoading && (
              <div className="flex flex-col items-start animate-pulse">
                <div className="text-[10px] font-bold text-slate-400 mb-1 px-1">PGX AI</div>
                <div className="bg-slate-900/90 border border-indigo-500/25 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-400 ml-1 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 shrink-0">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask anything about ${getPageName(location.pathname)}... (Enter to send)`}
                disabled={isLoading}
                rows={1}
                className="w-full bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none max-h-24 transition-colors disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send size={13} className="transform translate-x-[0.5px]" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[9px] text-slate-500">
              <span>Powered by <strong className="text-indigo-400 font-semibold">Google Gemini</strong></span>
              <span className="flex items-center gap-1">Press <kbd className="bg-slate-800 px-1 py-0.2 rounded text-[8px] text-slate-400">Enter ↵</kbd> to send</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
