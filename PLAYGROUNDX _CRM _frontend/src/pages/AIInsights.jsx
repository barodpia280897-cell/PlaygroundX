// src/pages/AIInsights.jsx
import { motion } from 'framer-motion';
import { Bot, Zap, TrendingUp, ShieldCheck, MessageSquare, CheckCircle } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

const sampleConvo = [
  { from: 'ai', text: 'Hi Maria! You\'re making great progress. Your profile is currently 65% complete. The next step is uploading your banner image. Adding a banner helps fans recognize you and improves your professional appearance.' },
  { from: 'user', text: 'How do I upload a banner?' },
  { from: 'ai', text: 'You can upload your banner from the Profile Settings page inside PlayGroundX. Go to Settings → Profile → Upload Banner. I recommend a high-quality image at 1500×500 pixels for the best result. Once uploaded, I\'ll guide you to the next step! 🎉' },
  { from: 'user', text: 'Thanks! What happens after banner?' },
  { from: 'ai', text: 'After your banner, the next step is completing your KYC (identity verification). This is required before you can receive payouts and unlock full creator functionality. Once approved, you\'ll be ready to start earning on PlayGroundX!' },
];

export default function AIInsights() {
  const [aiPerformance] = useDataStore('aiPerformance');
  if (!aiPerformance) return null;

  return (
    <div className="space-y-5 pb-10">
      <ReportHeaderBanner
        title="AI Assistant Performance & Handoff Report"
        subtitle="Monitor AI conversation resolution rates, escalation triggers, and onboarding guidance accuracy"
        measures="Measures AI first-contact resolution rate, question answer accuracy, handoff-to-agent rate, and average AI session length."
        audience="AI Operations Managers & Product Analytics Teams"
      />

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Bot size={28} className="text-neon-blue drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
          AI Insights
        </h2>
        <p className="text-sm text-muted mt-0.5">Executive overview of AI capabilities and resolution metrics</p>
      </motion.div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Questions Answered', value: aiPerformance.questionsAnswered.toLocaleString(), icon: MessageSquare, color: 'text-neon-blue', border: 'border-neon-blue/20' },
          { label: 'Escalated to Agent', value: aiPerformance.escalated, icon: Zap, color: 'text-neon-pink', border: 'border-neon-pink/20' },
          { label: 'Resolution Rate', value: `${aiPerformance.resolutionRate}%`, icon: CheckCircle, color: 'text-neon-green', border: 'border-neon-green/20' },
          { label: 'Conversations Active', value: '42', icon: TrendingUp, color: 'text-neon-purple', border: 'border-neon-purple/20' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`glass-panel p-5 border ${s.border}`}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Icon size={20} className={s.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted truncate">{s.label}</p>
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sample AI Conversation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="col-span-12 lg:col-span-7 glass-panel p-5 flex flex-col">
          <div className="flex items-center gap-3 mb-5 border-b border-gray-800 pb-4">
            <img src="https://i.pravatar.cc/150?img=1" alt="Maria" className="w-9 h-9 rounded-full border border-gray-700" />
            <div>
              <p className="font-semibold text-gray-200 text-sm">Maria Gonzalez</p>
              <p className="text-xs text-neon-green flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-green" />AI Managed · Spanish Creator</p>
            </div>
            <div className="ml-auto">
              <Bot size={18} className="text-neon-blue" />
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {sampleConvo.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'ai' && <Bot size={16} className="text-neon-blue mr-2 mt-1 flex-shrink-0" />}
                <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.from === 'ai'
                    ? 'bg-neon-blue/10 border border-neon-blue/20 text-gray-200'
                    : 'bg-gray-700/50 border border-gray-600/30 text-primary'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Rules & Escalation */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="col-span-12 lg:col-span-5 space-y-4">
          <div className="glass-panel border-neon-green/20 p-5">
            <h3 className="text-sm font-bold text-neon-green uppercase tracking-wider mb-3 flex items-center gap-2"><ShieldCheck size={16} />AI Escalation Triggers</h3>
            <div className="space-y-1.5">
              {['Call Me', 'Payment Failed', 'KYC Failed', 'I Want VIP', 'How Much Can I Earn', 'I Need Support', 'I Am Confused', 'Can Someone Contact Me'].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-pink flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel border-neon-blue/20 p-5">
            <h3 className="text-sm font-bold text-neon-blue uppercase tracking-wider mb-3 flex items-center gap-2"><Zap size={16} />AI Objectives (Today)</h3>
            <div className="space-y-2">
              {[
                { obj: 'Push Registration', count: 342, color: 'bg-neon-blue' },
                { obj: 'Profile Completion', count: 158, color: 'bg-neon-purple' },
                { obj: 'KYC Reminders', count: 94, color: 'bg-yellow-400' },
                { obj: 'Deposit Push', count: 62, color: 'bg-neon-green' },
                { obj: 'Reactivation', count: 38, color: 'bg-neon-pink' },
              ].map((o, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex flex-wrap items-center gap-2"><span className={`w-2 h-2 rounded-full ${o.color}`} /><span className="text-secondary">{o.obj}</span></div>
                  <span className="font-bold text-gray-200">{o.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
