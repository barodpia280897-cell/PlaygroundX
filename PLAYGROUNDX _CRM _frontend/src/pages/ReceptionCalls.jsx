import { useState } from 'react';
import { useTenantData } from '../contexts/DataContext';
import { PhoneCall, Search, Filter, PhoneForwarded, PhoneMissed, PhoneIncoming } from 'lucide-react';
import { motion } from 'framer-motion';
import CallModal from '../components/modals/CallModal';

export default function ReceptionCalls() {
  const [calls] = useTenantData('receptionCalls');
  const [callTarget, setCallTarget] = useState(null);

  const handleCallBack = (c) => {
    setCallTarget({
      name: c.caller,
      phone: c.number || '+1 (555) 000-0000',
      stage: `Call Back — ${c.status}`
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <PhoneCall size={24} className="text-neon-pink" />
            Front Desk Calls
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage incoming reception calls, voicemails, and missed calls.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by caller name or number..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-pink focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800">
          <Filter size={16} /> Filter Status
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-950 sticky top-0 z-10 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Caller</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {(calls || []).map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-white group-hover:text-neon-pink transition-colors">{c.caller}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-gray-300">
                      {c.type === 'Incoming' && <PhoneIncoming size={14} className="text-neon-blue" />}
                      {c.type === 'Outgoing' && <PhoneForwarded size={14} className="text-neon-green" />}
                      {c.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm font-mono">{c.time}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm font-mono">{c.duration || '--'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                      ${c.status === 'Missed' ? 'bg-red-500/10 text-red-500 border border-red-500/30' : ''}
                      ${c.status === 'Voicemail' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : ''}
                      ${c.status === 'Connected' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : ''}
                    `}>
                      {c.status === 'Missed' && <PhoneMissed size={12} />}
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCallBack(c)}
                        className="px-3 py-1 bg-neon-pink/10 text-neon-pink border border-neon-pink/30 font-bold rounded hover:bg-neon-pink/20 text-xs flex items-center gap-1 transition-colors"
                      >
                        <PhoneCall size={12}/> Call Back
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CallModal open={!!callTarget} lead={callTarget} onClose={() => setCallTarget(null)} />
    </div>
  );
}
