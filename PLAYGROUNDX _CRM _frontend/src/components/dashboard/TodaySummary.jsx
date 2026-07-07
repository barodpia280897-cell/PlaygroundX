// src/components/dashboard/TodaySummary.jsx
import { motion } from 'framer-motion';
import { Send, Inbox, Mail, Phone, CalendarCheck } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';

export default function TodaySummary({ multiplier = 1 }) {
  const [baseSummary] = useDataStore('todaySummary');
  const todaySummary = baseSummary ? {
    outgoingMessages: Math.round((baseSummary.outgoingMessages || 0) * multiplier),
    incomingMessages: Math.round((baseSummary.incomingMessages || 0) * multiplier),
    emailsSent: Math.round((baseSummary.emailsSent || 0) * multiplier),
    callsMade: Math.round((baseSummary.callsMade || 0) * multiplier),
    appointmentsBooked: Math.round((baseSummary.appointmentsBooked || 0) * multiplier),
  } : {};

  const items = [
    { label: 'Outgoing Messages', value: todaySummary.outgoingMessages?.toLocaleString(), icon: Send, color: 'text-neon-blue' },
    { label: 'Incoming Messages', value: todaySummary.incomingMessages?.toLocaleString(), icon: Inbox, color: 'text-neon-purple' },
    { label: 'Emails Sent', value: todaySummary.emailsSent?.toLocaleString(), icon: Mail, color: 'text-neon-green' },
    { label: 'Calls Made', value: todaySummary.callsMade, icon: Phone, color: 'text-yellow-400' },
    { label: 'Appointments Booked', value: todaySummary.appointmentsBooked, icon: CalendarCheck, color: 'text-neon-pink' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-panel p-5">
      <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Today's Summary</h3>
      <div className="flex flex-wrap gap-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex-1 min-w-[150px] flex items-center justify-between bg-black/20 p-2 rounded-lg border border-gray-800/30">
              <div className="flex items-center gap-2.5">
                <Icon size={14} className={item.color} />
                <span className="text-xs text-secondary">{item.label}</span>
              </div>
              <span className={`text-sm font-black ${item.color} ml-2`}>{item.value}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
