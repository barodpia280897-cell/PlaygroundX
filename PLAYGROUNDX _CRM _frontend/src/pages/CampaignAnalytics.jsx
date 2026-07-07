import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick, Megaphone, TrendingUp, Activity, Filter, Download, Calendar as CalendarIcon, ChevronDown, BarChart2, ArrowUpRight, ArrowDownRight, RefreshCw, X, Share2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useToast } from '../contexts/ToastContext';

const timeframeData = {
  'Last 7 Days': {
    impressions: '19.5K', impTrend: 12.4,
    clicks: '30.4K', clickTrend: 8.2,
    conversions: '1,568', convTrend: 15.1,
    cpa: '$14.50', cpaTrend: -4.2,
    chartData: [
      { day: 'Mon', impressions: 4000, clicks: 2400, conversions: 240 },
      { day: 'Tue', impressions: 3000, clicks: 1398, conversions: 221 },
      { day: 'Wed', impressions: 2000, clicks: 9800, conversions: 229 },
      { day: 'Thu', impressions: 2780, clicks: 3908, conversions: 200 },
      { day: 'Fri', impressions: 1890, clicks: 4800, conversions: 218 },
      { day: 'Sat', impressions: 2390, clicks: 3800, conversions: 250 },
      { day: 'Sun', impressions: 3490, clicks: 4300, conversions: 210 },
    ],
    campaignBreakdown: [
      { name: 'VIP Creator Welcome Series', channel: 'Email', spend: '$2,400', clicks: '12,450', ctr: '18.4%', conversions: 640, cpa: '$3.75', roi: '340%' },
      { name: 'WhatsApp Flash Promo', channel: 'WhatsApp', spend: '$1,850', clicks: '9,800', ctr: '24.2%', conversions: 520, cpa: '$3.55', roi: '410%' },
      { name: 'Re-engagement Blast', channel: 'SMS', spend: '$950', clicks: '4,200', ctr: '11.0%', conversions: 210, cpa: '$4.52', roi: '180%' },
      { name: 'Push Notification Tip Alert', channel: 'Push', spend: '$400', clicks: '3,950', ctr: '8.5%', conversions: 198, cpa: '$2.02', roi: '520%' }
    ]
  },
  'Last 30 Days': {
    impressions: '84.2K', impTrend: 24.6,
    clicks: '128.5K', clickTrend: 18.9,
    conversions: '6,840', convTrend: 22.4,
    cpa: '$12.80', cpaTrend: -8.5,
    chartData: [
      { day: 'Week 1', impressions: 18000, clicks: 28000, conversions: 1450 },
      { day: 'Week 2', impressions: 22000, clicks: 32000, conversions: 1720 },
      { day: 'Week 3', impressions: 21000, clicks: 34000, conversions: 1810 },
      { day: 'Week 4', impressions: 23200, clicks: 34500, conversions: 1860 },
    ],
    campaignBreakdown: [
      { name: 'VIP Creator Welcome Series', channel: 'Email', spend: '$9,600', clicks: '48,200', ctr: '19.1%', conversions: 2680, cpa: '$3.58', roi: '360%' },
      { name: 'WhatsApp Flash Promo', channel: 'WhatsApp', spend: '$7,400', clicks: '42,100', ctr: '25.6%', conversions: 2310, cpa: '$3.20', roi: '450%' },
      { name: 'Re-engagement Blast', channel: 'SMS', spend: '$3,800', clicks: '21,000', ctr: '12.4%', conversions: 1050, cpa: '$3.61', roi: '210%' },
      { name: 'Push Notification Tip Alert', channel: 'Push', spend: '$1,600', clicks: '17,200', ctr: '9.8%', conversions: 800, cpa: '$2.00', roi: '540%' }
    ]
  },
  'This Quarter': {
    impressions: '264.8K', impTrend: 35.2,
    clicks: '389.2K', clickTrend: 28.1,
    conversions: '21,450', convTrend: 31.0,
    cpa: '$11.40', cpaTrend: -12.1,
    chartData: [
      { day: 'Month 1', impressions: 78000, clicks: 120000, conversions: 6500 },
      { day: 'Month 2', impressions: 88000, clicks: 134000, conversions: 7200 },
      { day: 'Month 3', impressions: 98800, clicks: 135200, conversions: 7750 },
    ],
    campaignBreakdown: [
      { name: 'VIP Creator Welcome Series', channel: 'Email', spend: '$28,800', clicks: '144,600', ctr: '19.8%', conversions: 8400, cpa: '$3.42', roi: '380%' },
      { name: 'WhatsApp Flash Promo', channel: 'WhatsApp', spend: '$22,200', clicks: '126,300', ctr: '26.1%', conversions: 7100, cpa: '$3.12', roi: '470%' },
      { name: 'Re-engagement Blast', channel: 'SMS', spend: '$11,400', clicks: '63,000', ctr: '13.0%', conversions: 3450, cpa: '$3.30', roi: '240%' },
      { name: 'Push Notification Tip Alert', channel: 'Push', spend: '$4,800', clicks: '55,300', ctr: '10.5%', conversions: 2500, cpa: '$1.92', roi: '560%' }
    ]
  }
};

export default function CampaignAnalytics() {
  const { addToast } = useToast();
  const [timeframe, setTimeframe] = useState('Last 7 Days');
  const [channelFilter, setChannelFilter] = useState('All Channels');
  const [showExportModal, setShowExportModal] = useState(false);

  const currentData = timeframeData[timeframe];
  
  const filteredBreakdown = currentData.campaignBreakdown.filter(c => {
    if (channelFilter !== 'All Channels' && c.channel !== channelFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-green/20 border border-neon-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <MousePointerClick size={20} className="text-neon-blue" />
            </div>
            Campaign Analytics & ROI Tracking
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Deep-dive into multi-channel conversion rates, cost per acquisition (CPA), and ad spend efficiency.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap filter-bar">
          {/* Timeframe Switcher */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            {['Last 7 Days', 'Last 30 Days', 'This Quarter'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTimeframe(t);
                  addToast('info', 'Timeframe Synced', `Recalculated ROI & conversion metrics for ${t}.`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${timeframe === t ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'text-gray-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download size={14} className="text-neon-blue" /> Export Audit Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Impressions', value: currentData.impressions, trend: currentData.impTrend, icon: Megaphone, color: 'neon-blue' },
          { label: 'Total Link Clicks', value: currentData.clicks, trend: currentData.clickTrend, icon: MousePointerClick, color: 'neon-green' },
          { label: 'Total Conversions', value: currentData.conversions, trend: currentData.convTrend, icon: TrendingUp, color: 'yellow-400' },
          { label: 'Avg Cost Per Acquisition', value: currentData.cpa, trend: currentData.cpaTrend, icon: Activity, color: 'neon-pink' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-28 h-28 bg-${s.color}/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110`} />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${s.trend > 0 ? (s.label.includes('Cost') ? 'text-red-400' : 'text-neon-green') : (s.label.includes('Cost') ? 'text-neon-green' : 'text-red-400')}`}>
                  {s.trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {Math.abs(s.trend)}% vs prior period
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}/10 border border-${s.color}/20 text-${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Area Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-gray-800 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2"><BarChart2 size={18} className="text-neon-blue"/> Multi-Channel Performance Trend ({timeframe})</h3>
            <p className="text-xs text-gray-400">Comparing ad impressions against direct user link clicks and conversions over time.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.6)]" /> Impressions</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]" /> Link Clicks</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]" /> Conversions</span>
          </div>
        </div>

        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentData.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorImp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClick" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#39ff14" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#1f2937', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', color: '#fff' }} />
              <Area type="monotone" dataKey="impressions" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorImp)" />
              <Area type="monotone" dataKey="clicks" stroke="#39ff14" strokeWidth={2} fillOpacity={1} fill="url(#colorClick)" />
              <Area type="monotone" dataKey="conversions" stroke="#facc15" strokeWidth={2} fillOpacity={1} fill="url(#colorConv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Campaign ROI Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800 bg-gray-950/80 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-extrabold text-white text-base">Campaign ROI & CPA Breakdown</h3>
            <p className="text-xs text-gray-400">Detailed financial performance per marketing broadcast series.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">Filter Channel:</span>
            <select
              value={channelFilter}
              onChange={e => setChannelFilter(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue cursor-pointer"
            >
              <option value="All Channels">All Channels</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
              <option value="Push">Push</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/40 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="py-3.5 pl-5">Campaign Name</th>
                <th className="py-3.5 text-center">Channel</th>
                <th className="py-3.5 text-right">Ad Spend</th>
                <th className="py-3.5 text-right">Link Clicks</th>
                <th className="py-3.5 text-right">CTR %</th>
                <th className="py-3.5 text-right">Conversions</th>
                <th className="py-3.5 text-right">CPA ($)</th>
                <th className="py-3.5 text-right pr-5">Net ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-xs">
              {filteredBreakdown.map((c, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 pl-5 font-extrabold text-white">{c.name}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-lg font-black text-[10px] border ${c.channel==='Email'?'bg-blue-500/10 text-blue-400 border-blue-500/20':c.channel==='WhatsApp'?'bg-green-500/10 text-green-400 border-green-500/20':c.channel==='SMS'?'bg-purple-500/10 text-purple-400 border-purple-500/20':'bg-red-500/10 text-red-400 border-red-500/20'}`}>{c.channel}</span>
                  </td>
                  <td className="py-4 text-right font-mono text-gray-300 font-bold">{c.spend}</td>
                  <td className="py-4 text-right text-white font-bold">{c.clicks}</td>
                  <td className="py-4 text-right text-neon-blue font-black">{c.ctr}</td>
                  <td className="py-4 text-right text-white font-black">{c.conversions.toLocaleString()}</td>
                  <td className="py-4 text-right font-mono text-yellow-400 font-bold">{c.cpa}</td>
                  <td className="py-4 text-right pr-5 font-black text-neon-green">{c.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowExportModal(false)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <h3 className="text-base font-black text-white flex items-center gap-2"><Download size={16} className="text-neon-blue"/> Export Analytics Audit</h3>
                <button onClick={() => setShowExportModal(false)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">Choose format to download full multi-channel campaign analytics and ROI audit report for <strong className="text-white font-bold">{timeframe}</strong>.</p>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => {
                    addToast('success', 'CSV Downloaded', `Campaign_Analytics_${timeframe.replace(/ /g, '_')}.csv generated.`);
                    setShowExportModal(false);
                  }}
                  className="py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-md"
                >
                  Download CSV
                </button>
                <button 
                  onClick={() => {
                    addToast('success', 'PDF Downloaded', `Executive_ROI_Report_${timeframe.replace(/ /g, '_')}.pdf generated.`);
                    setShowExportModal(false);
                  }}
                  className="py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl border border-gray-700"
                >
                  Download PDF
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
