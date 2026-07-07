import { motion } from 'framer-motion';
import { ChevronDown, Users, Heart, Globe, Target } from 'lucide-react';

export default function LeadAnalytics({ leads = [] }) {
  const total = Math.max(1, leads.length);
  
  const leadOverviewData = [
    { label: 'New Lead', value: leads.filter(l => l.stage === 'New Lead').length, color: 'bg-blue-600', text: 'text-blue-500' },
    { label: 'Contacted', value: leads.filter(l => l.stage === 'Contacted').length, color: 'bg-pink-500', text: 'text-pink-500' },
    { label: 'Registered', value: leads.filter(l => l.stage === 'Registered').length, color: 'bg-yellow-500', text: 'text-yellow-500' },
    { label: 'Active', value: leads.filter(l => l.stage === 'Active').length, color: 'bg-purple-500', text: 'text-purple-500' }
  ].map(item => ({...item, percent: Math.round((item.value / total) * 100)}));

  const byLeadType = [
    { label: 'Creators', value: leads.filter(l => l.type === 'Creator').length, icon: <Users size={12} />, color: 'bg-blue-500' },
    { label: 'Fans', value: leads.filter(l => l.type === 'Fan').length, icon: <Heart size={12} />, color: 'bg-pink-500' }
  ].map(item => ({...item, percent: Math.round((item.value / total) * 100)}));

  const eng = leads.filter(l => (l.language || 'English') === 'English').length;
  const spa = leads.filter(l => l.language === 'Spanish').length;
  const fre = leads.filter(l => l.language === 'French').length;
  const otherLang = leads.length - eng - spa - fre;
  
  const byLanguage = [
    { label: 'English', percent: Math.round((eng / total) * 100), color: 'bg-purple-500' },
    { label: 'Spanish', percent: Math.round((spa / total) * 100), color: 'bg-orange-500' },
    { label: 'French', percent: Math.round((fre / total) * 100), color: 'bg-blue-500' },
    { label: 'Others', percent: Math.round((otherLang / total) * 100), color: 'bg-gray-500' }
  ];

  const sourceInsta = leads.filter(l => l.source === 'Instagram').length;
  const sourceTikTok = leads.filter(l => l.source === 'TikTok').length;
  const sourceWeb = leads.filter(l => l.source === 'Website').length;
  const sourceOther = leads.length - sourceInsta - sourceTikTok - sourceWeb;

  const bySource = [
    { label: 'Instagram', value: sourceInsta, percent: Math.round((sourceInsta / total) * 100), color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { label: 'TikTok', value: sourceTikTok, percent: Math.round((sourceTikTok / total) * 100), color: 'bg-black border border-gray-700' },
    { label: 'Website', value: sourceWeb, percent: Math.round((sourceWeb / total) * 100), color: 'bg-blue-500' },
    { label: 'Others', value: sourceOther, percent: Math.round((sourceOther / total) * 100), color: 'bg-gray-500' }
  ];

  // For the conic gradient
  // 0-24% blue, 24%-56% pink, 56%-79% purple, 79%-92% yellow, 92%-100% cyan
  const conicGradient = `conic-gradient(
    #2563eb 0% 24%, 
    #ec4899 24% 56%, 
    #a855f7 56% 79%, 
    #eab308 79% 92%, 
    #06b6d4 92% 100%
  )`;

  return (
    <div className="w-full xl:w-[320px] shrink-0 space-y-4">
      
      {/* Lead Overview Donut */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className="bg-panel/40 border border-gray-800/60 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-white">Lead Overview</h3>
          <button className="text-[10px] text-gray-400 bg-gray-900/50 border border-gray-800 rounded px-2 py-1 flex items-center gap-1">
            Today <ChevronDown size={10} />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
               style={{ background: conicGradient }}>
            <div className="w-28 h-28 bg-[#0a0a0f] rounded-full flex flex-col items-center justify-center z-10 shadow-inner">
              <span className="text-xl font-black text-white">{leads.length.toLocaleString()}</span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Total Leads</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2.5">
          {leadOverviewData.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                <span className="text-gray-300 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{item.value}</span>
                <span className="text-gray-500 text-[10px]">({item.percent}%)</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* By Lead Type */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        className="bg-panel/40 border border-gray-800/60 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">By Lead Type</h3>
        <div className="space-y-4">
          {byLeadType.map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-gray-500">{item.icon}</span> {item.label}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{item.value}</span>
                  <span className="text-gray-500 text-[10px]">({item.percent}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-800/50 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* By Language */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
        className="bg-panel/40 border border-gray-800/60 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">By Language</h3>
        <div className="space-y-3">
          {byLanguage.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                <Globe size={10} /> {item.label}
              </div>
              <div className="flex-1 bg-gray-800/50 rounded-full h-1.5 overflow-hidden flex">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
              </div>
              <div className="w-8 text-right text-[10px] font-bold text-gray-300">{item.percent}%</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Lead Source */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
        className="bg-panel/40 border border-gray-800/60 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-4">Lead Source</h3>
        <div className="space-y-3">
          {bySource.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-20 text-[10px] text-gray-400 font-medium flex items-center gap-1.5">
                <Target size={10} /> {item.label}
              </div>
              <div className="flex-1 bg-gray-800/50 rounded-full h-1.5 overflow-hidden flex">
                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
              </div>
              <div className="text-right text-[10px] text-gray-500 w-12">{item.value} <span className="text-[8px]">({item.percent}%)</span></div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
