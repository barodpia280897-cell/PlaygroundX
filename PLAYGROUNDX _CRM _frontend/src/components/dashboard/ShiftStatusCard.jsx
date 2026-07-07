// src/components/dashboard/ShiftStatusCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Coffee, Zap, LogOut, CheckCircle2 } from 'lucide-react';
import { useUIState } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

export default function ShiftStatusCard() {
  // Use persistent UI state so shift status remains consistent across Dashboard, Workspace, Leads, etc.
  const [shiftStatus, setShiftStatus] = useUIState('agent_shift_status', 'offline');
  const { addToast } = useToast();

  const handleClockIn = () => {
    if (shiftStatus !== 'offline') return;
    setShiftStatus('onduty');
    addToast('success', 'Shift Started', 'You are now Clocked In. Status: On Duty.');
  };

  const handleReadyForCalls = () => {
    if (shiftStatus === 'offline') {
      addToast('error', 'Action Blocked', 'Please Clock In before going Ready for Calls.');
      return;
    }
    setShiftStatus('ready');
    addToast('success', 'AI Routing Active', 'You are Ready for Calls. AI Routing Engine is actively dropping leads.');
  };

  const handleBreak = () => {
    if (shiftStatus === 'offline') {
      addToast('error', 'Action Blocked', 'Please Clock In before taking a break.');
      return;
    }
    setShiftStatus('break');
    addToast('warning', 'Queue Paused', 'You are currently On Break. Lead queue is temporarily paused.');
  };

  const handleEndShift = () => {
    setShiftStatus('offline');
    addToast('info', 'Shift Ended', 'You have clocked out. You are now Offline.');
  };

  // Status badge config
  const statusConfig = {
    offline: { label: '⚪ Offline (Not Clocked In)', bg: 'bg-gray-800/80', border: 'border-gray-700', text: 'text-gray-400', glow: '' },
    onduty:  { label: '🔵 On Duty (Clocked In)', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', text: 'text-neon-blue', glow: 'shadow-[0_0_15px_rgba(0,240,255,0.15)]' },
    ready:   { label: '🟢 Online (AI Routing Active)', bg: 'bg-neon-green/15', border: 'border-neon-green/40', text: 'text-neon-green', glow: 'shadow-[0_0_20px_rgba(57,255,20,0.25)]' },
    break:   { label: '🟡 On Break (Queue Paused)', bg: 'bg-yellow-500/15', border: 'border-yellow-500/40', text: 'text-yellow-400', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' },
  };

  const current = statusConfig[shiftStatus] || statusConfig.offline;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900/70 backdrop-blur-xl border ${current.border} rounded-2xl p-4 sm:p-5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 transition-all duration-300 ${current.glow}`}
    >
      {/* Left side: Status Badge & Description */}
      <div className="flex items-center gap-3.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${current.border} ${current.bg}`}>
          {shiftStatus === 'offline' && <Clock size={20} className="text-gray-400" />}
          {shiftStatus === 'onduty'  && <CheckCircle2 size={20} className="text-neon-blue" />}
          {shiftStatus === 'ready'   && <Zap size={20} className="text-neon-green animate-bounce" />}
          {shiftStatus === 'break'   && <Coffee size={20} className="text-yellow-400" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-sm sm:text-base font-black ${current.text} tracking-wide flex items-center gap-1.5`}>
              {shiftStatus === 'ready' && <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />}
              {current.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {shiftStatus === 'offline' && 'Clock in to start your shift and receive AI lead routing.'}
            {shiftStatus === 'onduty'  && 'You are clocked in. Click "Ready for Calls" to receive live customer queues.'}
            {shiftStatus === 'ready'   && 'You are live. Incoming VIP leads and chats are actively routed to your inbox.'}
            {shiftStatus === 'break'   && 'Your queue is paused. Click "Ready for Calls" when you return.'}
          </p>
        </div>
      </div>

      {/* Right side: Workflow Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto justify-end bg-gray-950/80 border border-gray-800/80 p-1.5 rounded-xl">
        
        {/* Clock In button (Only active when offline) */}
        {shiftStatus === 'offline' ? (
          <button
            onClick={handleClockIn}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-neon-blue hover:bg-neon-blue/90 text-black text-xs font-black shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Clock size={14} /> Clock In
          </button>
        ) : (
          <button
            disabled
            className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-gray-800 text-gray-500 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
            title="You are already clocked in"
          >
            <CheckCircle2 size={14} /> Clocked In
          </button>
        )}

        {/* Break button */}
        <button
          onClick={handleBreak}
          disabled={shiftStatus === 'offline' || shiftStatus === 'break'}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            shiftStatus === 'break'
              ? 'bg-yellow-500 text-black font-black shadow-[0_0_15px_rgba(234,179,8,0.3)] cursor-default'
              : shiftStatus === 'offline'
              ? 'bg-gray-850 text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gray-900 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 cursor-pointer'
          }`}
        >
          <Coffee size={14} /> Break
        </button>

        {/* Ready for Calls button */}
        <button
          onClick={handleReadyForCalls}
          disabled={shiftStatus === 'offline' || shiftStatus === 'ready'}
          className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            shiftStatus === 'ready'
              ? 'bg-neon-green text-black font-black shadow-[0_0_20px_rgba(57,255,20,0.4)] cursor-default'
              : shiftStatus === 'offline'
              ? 'bg-gray-850 text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gray-900 hover:bg-neon-green/20 text-neon-green border border-neon-green/30 cursor-pointer'
          }`}
        >
          <Zap size={14} /> Ready for Calls
        </button>

        {/* End Shift button (Only visible when clocked in) */}
        {shiftStatus !== 'offline' && (
          <button
            onClick={handleEndShift}
            className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ml-1"
            title="End shift and go offline"
          >
            <LogOut size={14} /> End Shift
          </button>
        )}
      </div>
    </motion.div>
  );
}
