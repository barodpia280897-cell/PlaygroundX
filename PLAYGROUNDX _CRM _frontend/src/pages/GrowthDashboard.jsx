import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Users, MousePointerClick, TrendingUp, Filter, Search, ChevronDown, Download, BarChart2, ArrowUpRight, ArrowDownRight, X, Sparkles, CheckCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const growthTimeframes = {
  'Last 30 Days': {
    sent: '142.5K', sentTrend: 18.4,
    openRate: '38.2%', openTrend: 4.2,
    clickRate: '14.8%', clickTrend: 2.1,
    conversions: '4,280', convTrend: 15.6,
    campaigns: [
      { id: 1, name: 'Summer VIP Onboarding', status: 'Active', target: 'High-Potential Creators', sent: '12,450', openRate: '45.0%', clickRate: '12.0%', conversion: '3.2%', newRevenue: '$18,400', color: '#00f0ff' },
      { id: 2, name: 'Re-engagement Series', status: 'Active', target: 'Inactive Fans (>30 days)', sent: '45,200', openRate: '28.0%', clickRate: '5.0%', conversion: '1.8%', newRevenue: '$12,200', color: '#39ff14' },
      { id: 3, name: 'New Feature Announcement', status: 'Draft', target: 'All Active Users', sent: '0', openRate: '0%', clickRate: '0%', conversion: '0%', newRevenue: '$0', color: '#8a2be2' },
      { id: 4, name: 'Holiday Special Promotion', status: 'Completed', target: 'VIP Fans', sent: '8,300', openRate: '62.0%', clickRate: '24.0%', conversion: '8.5%', newRevenue: '$34,500', color: '#ffd700' },
      { id: 5, name: 'Stripe Gateway Recovery', status: 'Active', target: 'Failed Billing Subscriptions', sent: '3,100', openRate: '58.0%', clickRate: '32.0%', conversion: '14.2%', newRevenue: '$9,800', color: '#ff0055' }
    ]
  },
  'This Quarter': {
    sent: '412.0K', sentTrend: 26.8,
    openRate: '41.5%', openTrend: 6.5,
    clickRate: '16.2%', clickTrend: 3.8,
    conversions: '14,850', convTrend: 28.4,
    campaigns: [
      { id: 1, name: 'Summer VIP Onboarding', status: 'Active', target: 'High-Potential Creators', sent: '38,200', openRate: '46.2%', clickRate: '13.5%', conversion: '3.8%', newRevenue: '$52,000', color: '#00f0ff' },
      { id: 2, name: 'Re-engagement Series', status: 'Active', target: 'Inactive Fans (>30 days)', sent: '135,000', openRate: '31.0%', clickRate: '6.2%', conversion: '2.1%', newRevenue: '$38,400', color: '#39ff14' },
      { id: 3, name: 'New Feature Announcement', status: 'Completed', target: 'All Active Users', sent: '92,000', openRate: '39.0%', clickRate: '14.0%', conversion: '4.2%', newRevenue: '$64,000', color: '#8a2be2' },
      { id: 4, name: 'Holiday Special Promotion', status: 'Completed', target: 'VIP Fans', sent: '24,000', openRate: '65.0%', clickRate: '26.0%', conversion: '9.8%', newRevenue: '$108,000', color: '#ffd700' },
      { id: 5, name: 'Stripe Gateway Recovery', status: 'Active', target: 'Failed Billing Subscriptions', sent: '9,400', openRate: '61.0%', clickRate: '35.0%', conversion: '16.8%', newRevenue: '$29,400', color: '#ff0055' }
    ]
  },
  'This Year': {
    sent: '1.45M', sentTrend: 42.0,
    openRate: '44.0%', openTrend: 9.1,
    clickRate: '18.4%', clickTrend: 5.4,
    conversions: '62,400', convTrend: 45.2,
    campaigns: [
      { id: 1, name: 'Summer VIP Onboarding', status: 'Completed', target: 'High-Potential Creators', sent: '142,000', openRate: '48.0%', clickRate: '15.0%', conversion: '4.5%', newRevenue: '$210,000', color: '#00f0ff' },
      { id: 2, name: 'Re-engagement Series', status: 'Active', target: 'Inactive Fans (>30 days)', sent: '480,000', openRate: '34.0%', clickRate: '7.5%', conversion: '2.8%', newRevenue: '$165,000', color: '#39ff14' },
      { id: 3, name: 'New Feature Announcement', status: 'Completed', target: 'All Active Users', sent: '350,000', openRate: '42.0%', clickRate: '16.0%', conversion: '5.1%', newRevenue: '$280,000', color: '#8a2be2' },
      { id: 4, name: 'Holiday Special Promotion', status: 'Completed', target: 'VIP Fans', sent: '95,000', openRate: '68.0%', clickRate: '28.0%', conversion: '11.2%', newRevenue: '$420,000', color: '#ffd700' },
      { id: 5, name: 'Stripe Gateway Recovery', status: 'Active', target: 'Failed Billing Subscriptions', sent: '32,000', openRate: '64.0%', clickRate: '38.0%', conversion: '18.5%', newRevenue: '$115,000', color: '#ff0055' }
    ]
  }
};

export default function GrowthDashboard() {
  const { addToast } = useToast();
  const [timeframe, setTimeframe] = useState('Last 30 Days');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const currentData = growthTimeframes[timeframe];

  const filteredCampaigns = currentData.campaigns.filter(c => {
    if (statusFilter !== 'All Status' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.target.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-pink/20 to-purple-500/20 border border-neon-pink/30 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,85,0.2)]">
              <TrendingUp size={20} className="text-neon-pink" />
            </div>
            Executive Growth Dashboard
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">High-level executive overview of marketing campaigns, user acquisition velocity, and conversion funnels.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap filter-bar">
          {/* Timeframe Switcher */}
          <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
            {['Last 30 Days', 'This Quarter', 'This Year'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTimeframe(t);
                  addToast('info', 'Executive Period Updated', `Showing growth telemetry for ${t}.`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${timeframe === t ? 'bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,85,0.4)]' : 'text-gray-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => addToast('success', 'Executive Presentation Ready', 'Exported growth KPIs to PowerPoint / PDF.')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Download size={14} className="text-neon-pink" /> Export Slide Deck
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages Sent', value: currentData.sent, trend: currentData.sentTrend, icon: Megaphone, color: 'neon-blue' },
          { label: 'Avg Open Rate', value: currentData.openRate, trend: currentData.openTrend, icon: Users, color: 'neon-green' },
          { label: 'Avg Click Rate', value: currentData.clickRate, trend: currentData.clickTrend, icon: MousePointerClick, color: 'yellow-400' },
          { label: 'Total Conversions', value: currentData.conversions, trend: currentData.convTrend, icon: TrendingUp, color: 'neon-pink' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-28 h-28 bg-${s.color}/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110`} />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="flex items-center gap-1 mt-2 text-xs font-bold text-neon-green">
                  <ArrowUpRight size={14} />
                  +{s.trend}% vs prior {timeframe.toLowerCase()}
                </div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${s.color}/10 border border-${s.color}/20 text-${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Growth Campaigns Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-5 border-b border-gray-800 bg-gray-950/80 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2"><Sparkles size={16} className="text-yellow-400"/> Strategic Growth Campaigns ({timeframe})</h3>
            <p className="text-xs text-gray-400">Click any campaign row to inspect deep conversion funnel and revenue attribution.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap filter-bar">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search campaigns..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-gray-900 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-neon-pink w-48 font-medium"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-neon-pink cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/40 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="py-3.5 pl-5">Campaign Name</th>
                <th className="py-3.5 text-center">Status</th>
                <th className="py-3.5">Target Audience</th>
                <th className="py-3.5 text-right">Sent Volume</th>
                <th className="py-3.5 text-right">Open Rate</th>
                <th className="py-3.5 text-right">Click Rate</th>
                <th className="py-3.5 text-right">Conversion</th>
                <th className="py-3.5 text-right pr-5">New Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50 text-xs">
              {filteredCampaigns.map((c, idx) => (
                <tr key={idx} onClick={() => setSelectedCampaign(c)} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                  <td className="py-4 pl-5 font-extrabold text-white group-hover:text-neon-pink transition-colors flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </td>
                  <td className="py-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] border ${c.status==='Active'?'bg-green-500/10 text-green-400 border-green-500/20':c.status==='Completed'?'bg-blue-500/10 text-blue-400 border-blue-500/20':'bg-gray-800 text-gray-400 border-gray-700'}`}>{c.status}</span>
                  </td>
                  <td className="py-4 text-gray-300 font-medium">{c.target}</td>
                  <td className="py-4 text-right font-mono text-white font-bold">{c.sent}</td>
                  <td className="py-4 text-right text-neon-blue font-bold">{c.openRate}</td>
                  <td className="py-4 text-right text-yellow-400 font-bold">{c.clickRate}</td>
                  <td className="py-4 text-right font-black text-neon-green">{c.conversion}</td>
                  <td className="py-4 text-right pr-5 font-black text-white font-mono">{c.newRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedCampaign(null)}>
            <motion.div initial={{ scale:0.95 }} animate={{ scale:1 }} exit={{ scale:0.95 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedCampaign.color }} />
                  <h3 className="text-base font-black text-white">{selectedCampaign.name}</h3>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="text-gray-400 hover:text-white p-1 bg-gray-900 rounded-full"><X size={14}/></button>
              </div>

              <div className="bg-gray-900/80 p-4 rounded-2xl space-y-3 text-xs border border-gray-800">
                <div className="flex justify-between"><span>Target Audience:</span><strong className="text-white">{selectedCampaign.target}</strong></div>
                <div className="flex justify-between"><span>Total Dispatched:</span><strong className="text-neon-blue font-mono">{selectedCampaign.sent} Messages</strong></div>
                <div className="flex justify-between"><span>Open Rate:</span><strong className="text-green-400">{selectedCampaign.openRate}</strong></div>
                <div className="flex justify-between"><span>Link CTR:</span><strong className="text-yellow-400">{selectedCampaign.clickRate}</strong></div>
                <div className="flex justify-between border-t border-gray-800 pt-2"><span>Conversion Rate:</span><strong className="text-neon-green text-sm">{selectedCampaign.conversion}</strong></div>
                <div className="flex justify-between"><span>Generated Revenue:</span><strong className="text-white text-base font-black font-mono">{selectedCampaign.newRevenue}</strong></div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => {
                    addToast('success', 'Campaign Boosted', `Allocated +$5,000 budget to ${selectedCampaign.name}.`);
                    setSelectedCampaign(null);
                  }}
                  className="flex-1 py-3 bg-neon-pink text-white font-black text-xs rounded-xl hover:bg-pink-600 transition-all shadow-[0_0_15px_rgba(255,0,85,0.4)]"
                >
                  🚀 Boost Ad Budget (+50%)
                </button>
                <button onClick={() => setSelectedCampaign(null)} className="px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs rounded-xl">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
