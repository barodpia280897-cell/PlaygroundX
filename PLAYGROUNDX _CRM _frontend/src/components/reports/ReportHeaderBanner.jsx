import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Download, Calendar, Users, Target, Check,
  ChevronDown, FileText, Share2, Sliders, Info, X
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function ReportHeaderBanner({
  title = "Analytics Report",
  subtitle = "Track performance and key operational insights",
  measures = "Tracks daily ticket volume, inbound lead generation, and team resolution speed.",
  audience = "Operations Managers & Team Supervisors",
  activeDate = "Last 30 Days",
  activeDept = "All Departments",
  onDateChange,
  onDeptChange,
  onExport
}) {
  const { addToast } = useToast();
  const [date, setDate] = useState(activeDate);
  const [dept, setDept] = useState(activeDept);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [filters, setFilters] = useState({
    vipOnly: false,
    comparePrev: true,
    includeArchived: false,
    channel: 'All Channels'
  });

  const closeAll = () => {
    setShowDateDropdown(false);
    setShowDeptDropdown(false);
    setShowExportDropdown(false);
  };

  const handleDateSelect = (val) => {
    setDate(val); closeAll();
    if (onDateChange) onDateChange(val);
    addToast('success', 'Date Range Updated', `Report filtered for: ${val}`);
  };

  const handleDeptSelect = (val) => {
    setDept(val); closeAll();
    if (onDeptChange) onDeptChange(val);
    addToast('success', 'Department Filtered', `Showing data for: ${val}`);
  };

  const triggerExport = (format) => {
    closeAll();
    if (onExport) onExport(format);
    else addToast('success', `${format.toUpperCase()} Export Generated!`, `Your report has been exported.`);
  };

  const applyFilters = () => {
    setShowFilterModal(false);
    addToast('success', 'Filters Applied', `Channel: ${filters.channel}${filters.vipOnly ? ' - VIP Only' : ''}`);
  };

  const activeFiltersCount = [
    filters.vipOnly,
    filters.channel !== 'All Channels',
    filters.includeArchived
  ].filter(Boolean).length;

  const dateOptions = ['Today (Live)', 'Last 7 Days', 'Last 30 Days', 'Quarter to Date', 'Year to Date 2025'];
  const deptOptions = ['All Departments', 'VIP Sales & Success', 'Customer Support', 'Billing & Finance', 'Compliance & KYC', 'AI Concierge'];
  const exportOptions = [
    { label: 'Export CSV', sub: 'Raw spreadsheet data', icon: FileText, color: 'text-neon-blue', fmt: 'csv' },
    { label: 'Download PDF', sub: 'Formatted summary', icon: Download, color: 'text-purple-400', fmt: 'pdf' },
    { label: 'Email to C-Suite', sub: 'Send report link', icon: Share2, color: 'text-neon-green', fmt: 'email' },
  ];

  return (
    <div className="mb-5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-gray-800 bg-gradient-to-br from-[#0d0f1a] via-[#111520] to-[#0a0c15] shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-4 py-3 md:px-5 md:py-4">
          {/* Top row: title left, controls right */}
          <div className="flex items-start justify-between gap-3">
            {/* Left: title + subtitle */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-snug">
                  {title}
                </h1>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black bg-neon-blue/15 text-neon-blue border border-neon-blue/30 uppercase tracking-widest whitespace-nowrap">
                  Live
                </span>
                <button
                  onClick={() => setShowInfo(v => !v)}
                  className="sm:hidden shrink-0 p-1 rounded-lg transition-colors"
                  style={{ color: showInfo ? '#00f0ff' : '#6b7280' }}
                  title="Toggle details"
                >
                  <Info size={12} />
                </button>
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed">{subtitle}</p>
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {/* Date */}
              <div className="relative">
                <button
                  onClick={() => { setShowDateDropdown(v => !v); setShowDeptDropdown(false); setShowExportDropdown(false); }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-gray-700 bg-gray-900/80 text-[10px] sm:text-[11px] font-bold text-gray-300 hover:text-white hover:border-neon-blue/50 transition-all whitespace-nowrap"
                >
                  <Calendar size={11} className="text-neon-blue shrink-0" />
                  <span className="hidden md:inline max-w-[80px] truncate">{date}</span>
                  <span className="md:hidden">Date</span>
                  <ChevronDown size={10} className={`text-gray-500 transition-transform shrink-0 ${showDateDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showDateDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-1.5 w-48 bg-[#0d0f1a] border border-gray-700 rounded-xl shadow-2xl py-1 z-[200]"
                    >
                      {dateOptions.map(item => (
                        <button key={item} onClick={() => handleDateSelect(item)}
                          className={`w-full text-left px-3 py-2 text-[11px] font-bold flex items-center justify-between transition-colors ${date === item ? 'bg-neon-blue/10 text-neon-blue' : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'}`}>
                          <span>{item}</span>
                          {date === item && <Check size={10} className="shrink-0" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dept */}
              <div className="relative">
                <button
                  onClick={() => { setShowDeptDropdown(v => !v); setShowDateDropdown(false); setShowExportDropdown(false); }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-gray-700 bg-gray-900/80 text-[10px] sm:text-[11px] font-bold text-gray-300 hover:text-white hover:border-purple-500/50 transition-all whitespace-nowrap"
                >
                  <Sliders size={11} className="text-purple-400 shrink-0" />
                  <span className="hidden lg:inline max-w-[90px] truncate">{dept}</span>
                  <span className="lg:hidden">Dept</span>
                  <ChevronDown size={10} className={`text-gray-500 transition-transform shrink-0 ${showDeptDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showDeptDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-1.5 w-52 bg-[#0d0f1a] border border-gray-700 rounded-xl shadow-2xl py-1 z-[200]"
                    >
                      {deptOptions.map(item => (
                        <button key={item} onClick={() => handleDeptSelect(item)}
                          className={`w-full text-left px-3 py-2 text-[11px] font-bold flex items-center justify-between transition-colors ${dept === item ? 'bg-purple-500/10 text-purple-300' : 'text-gray-300 hover:bg-white/[0.04] hover:text-white'}`}>
                          <span>{item}</span>
                          {dept === item && <Check size={10} className="text-purple-400 shrink-0" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Filters */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-gray-700 bg-gray-900/80 text-[10px] sm:text-[11px] font-bold text-gray-300 hover:text-white hover:border-neon-green/50 transition-all whitespace-nowrap"
                >
                  <Filter size={11} className="text-neon-green shrink-0" />
                  <span>Filters</span>
                </button>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neon-green text-black text-[8px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => { setShowExportDropdown(v => !v); setShowDateDropdown(false); setShowDeptDropdown(false); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neon-blue text-black font-black text-[10px] sm:text-[11px] hover:bg-cyan-400 transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)] whitespace-nowrap"
                >
                  <Download size={11} className="shrink-0" />
                  <span>Export</span>
                  <ChevronDown size={10} className={`transition-transform shrink-0 ${showExportDropdown ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showExportDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-1.5 w-48 bg-[#0d0f1a] border border-gray-700 rounded-xl shadow-2xl py-1 z-[200]"
                    >
                      {exportOptions.map(({ label, sub, icon: Icon, color, fmt }, i) => (
                        <button key={fmt} onClick={() => triggerExport(fmt)}
                          className={`w-full text-left px-3 py-2.5 text-[11px] font-bold text-gray-200 hover:bg-white/[0.04] hover:text-white flex items-center gap-2 ${i > 0 ? 'border-t border-gray-800/60' : ''}`}>
                          <Icon size={12} className={`${color} shrink-0`} />
                          <div className="min-w-0">
                            <div>{label}</div>
                            <div className="text-[9px] text-gray-500 font-normal">{sub}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile: metadata toggle */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="sm:hidden overflow-hidden"
              >
                <div className="mt-3 pt-3 border-t border-gray-800/70 space-y-1.5">
                  <div className="flex items-start gap-1.5 text-[10px]">
                    <Target size={11} className="text-neon-blue shrink-0 mt-0.5" />
                    <span className="text-gray-500 font-bold shrink-0">Measures:</span>
                    <span className="text-gray-300">{measures}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10px]">
                    <Users size={11} className="text-purple-400 shrink-0 mt-0.5" />
                    <span className="text-gray-500 font-bold shrink-0">Audience:</span>
                    <span className="text-purple-300 font-semibold">{audience}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop: metadata always visible */}
          <div className="hidden sm:flex flex-wrap gap-x-6 gap-y-1 mt-2.5 pt-2.5 border-t border-gray-800/70">
            <div className="flex items-start gap-1.5 text-[10px] max-w-2xl">
              <Target size={11} className="text-neon-blue shrink-0 mt-0.5" />
              <span className="text-gray-500 font-bold shrink-0">Measures:</span>
              <span className="text-gray-300 leading-relaxed">{measures}</span>
            </div>
            <div className="flex items-start gap-1.5 text-[10px]">
              <Users size={11} className="text-purple-400 shrink-0 mt-0.5" />
              <span className="text-gray-500 font-bold shrink-0">Audience:</span>
              <span className="text-purple-300 font-semibold">{audience}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d0f1a] border border-gray-800 rounded-2xl p-5 w-full max-w-sm shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Sliders size={14} className="text-neon-blue" /> Advanced Filters
                </h3>
                <button onClick={() => setShowFilterModal(false)} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Channel</label>
                  <select value={filters.channel} onChange={e => setFilters({ ...filters, channel: e.target.value })}
                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
                    <option>All Channels</option>
                    <option>WhatsApp & SMS Only</option>
                    <option>Instagram & Social Direct</option>
                    <option>Email & In-App Support</option>
                    <option>Phone Dialer Voice Calls</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'vipOnly', label: 'VIP Creators Only' },
                    { key: 'comparePrev', label: 'Compare with previous period' },
                    { key: 'includeArchived', label: 'Include archived accounts' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer gap-3">
                      <span className="text-xs font-bold text-gray-200">{label}</span>
                      <div onClick={() => setFilters(f => ({ ...f, [key]: !f[key] }))}
                        className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 cursor-pointer shrink-0 ${filters[key] ? 'bg-neon-blue' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${filters[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2.5 pt-4 mt-4 border-t border-gray-800">
                <button onClick={() => { setFilters({ vipOnly: false, comparePrev: true, includeArchived: false, channel: 'All Channels' }); addToast('info', 'Filters Reset', 'Default filters restored.'); }}
                  className="flex-1 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white font-bold text-xs transition-colors">
                  Reset
                </button>
                <button onClick={applyFilters}
                  className="flex-1 py-2 rounded-xl bg-neon-blue text-black font-black text-xs hover:bg-cyan-400 transition-colors">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
