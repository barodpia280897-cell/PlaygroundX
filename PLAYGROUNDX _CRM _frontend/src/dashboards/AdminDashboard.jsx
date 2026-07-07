// src/dashboards/AdminDashboard.jsx
import { useState } from 'react';
import { useDataStore } from '../contexts/DataContext';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { CardSkeleton, ChartSkeleton } from '../components/ui/Skeleton';
import StatCard from '../components/ui/StatCard';
import LanguageDistributionChart from '../components/dashboard/LanguageDistributionChart';
import ConversionFunnel from '../components/dashboard/ConversionFunnel';
import AIPerformanceCard from '../components/dashboard/AIPerformanceCard';
import PipelineSection from '../components/dashboard/PipelineSection';
import AgentAlerts from '../components/dashboard/AgentAlerts';
import ConversationsPanel from '../components/dashboard/ConversationsPanel';
import TasksPanel from '../components/dashboard/TasksPanel';
import TodaySummary from '../components/dashboard/TodaySummary';
import LiveActivityFeed from '../components/dashboard/LiveActivityFeed';
import BottomSection from '../components/dashboard/BottomSection';
import { motion } from 'framer-motion';
import { Filter, Calendar, Download, Radio } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import TeamBroadcastModal from '../components/modals/TeamBroadcastModal';

export default function AdminDashboard() {
  const [kpiStats] = useDataStore('kpiStats');
  const { addToast } = useToast();
  const [showBroadcast, setShowBroadcast] = useState(false);
  
  // Interactive Filter States
  const [dateRange, setDateRange] = useState('Last 30 Days');
  
  // Simulate data changing based on filters
  const getMultiplier = (range) => {
    switch(range) {
      case 'Today': return 0.05;
      case 'Last 7 Days': return 0.25;
      case 'Year to Date': return 4.5;
      case 'Last 30 Days':
      default: return 1;
    }
  };
  const multiplier = getMultiplier(dateRange);
  const isLoading = useSimulatedLoading(800, [dateRange]);
  
  const handleExport = () => {
    addToast('success', 'Export Started', 'Your report is being generated and will download shortly.');
  };
  
  return (
    <div className="space-y-4 pb-10">

      {/* Global Dashboard Filters */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-2 sm:gap-4 glass-panel p-3">
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-xs">
            <Calendar size={14} className="text-gray-400 shrink-0" />
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="bg-transparent text-white font-bold focus:outline-none cursor-pointer">
              <option>Today</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
        </div>
        <div className="flex items-center">
          {/* <button onClick={() => setShowBroadcast(true)} className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-black transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)]">
            <Radio size={14} className="animate-pulse shrink-0" /> <span className="hidden sm:inline">Team Broadcast</span>
          </button> */}
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-bold hover:bg-neon-blue hover:text-black transition-colors whitespace-nowrap">
            <Download size={14} className="shrink-0" /> <span className="hidden sm:inline">Export Report</span><span className="sm:hidden">Export</span>
          </button>
        </div>
      </motion.div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiStats.map((stat, i) => {
          const rawVal = typeof stat.value === 'string' ? parseInt(stat.value.replace(/,/g, '')) : stat.value;
          const newVal = Math.round(rawVal * multiplier).toLocaleString();
          return isLoading ? <CardSkeleton key={i} /> : <StatCard key={i} stat={{...stat, value: newVal}} index={i} />;
        })}
      </div>

      {/* Row 2: Language Dist | Conversion Funnel | AI Performance */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          {isLoading ? <ChartSkeleton /> : <LanguageDistributionChart multiplier={multiplier} />}
        </div>
        <div className="col-span-12 lg:col-span-6">
          {isLoading ? <ChartSkeleton /> : <ConversionFunnel multiplier={multiplier} />}
        </div>
        <div className="col-span-12 lg:col-span-3">
          {isLoading ? <ChartSkeleton /> : <AIPerformanceCard multiplier={multiplier} />}
        </div>
      </div>

      {/* Row 3: Pipelines */}
      <PipelineSection multiplier={multiplier} />

      {/* Row 4: Agent Alerts | Live Activity Feed | Conversations | Tasks+Summary */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-3">
          <AgentAlerts />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <LiveActivityFeed />
        </div>
        <div className="col-span-12 lg:col-span-3">
          <ConversationsPanel />
        </div>
        <div className="col-span-12 lg:col-span-2 space-y-4 flex flex-col">
          <TasksPanel />
          <TodaySummary multiplier={multiplier} />
        </div>
      </div>

      {/* Row 5: Primary Channels | Top Countries */}
      <BottomSection multiplier={multiplier} />

      {/* Footer branding */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center pt-4">
        <p className="text-xs text-gray-700 tracking-[0.3em] uppercase font-semibold">PlayGroundX</p>
      </motion.div>

      {/* Team Broadcast Modal for Bulk Msg & Email */}
      <TeamBroadcastModal open={showBroadcast} onClose={() => setShowBroadcast(false)} />
    </div>
  );
}
