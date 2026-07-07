// src/components/modals/NotificationsModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Crown, Shield, CreditCard, Phone, Flame, CheckCircle, Info, Calendar as CalendarIcon, MessageSquare, Users } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';
import { getAppPath } from '../../utils/routing';

const defaultNotifications = [
  { id: 1, type: 'vip', icon: Crown, color: '#ffd700', title: 'VIP Prospect Detected', body: 'Maria Gonzalez — Lead Score 185, VIP Score 92', time: '2m ago', unread: true },
  { id: 2, type: 'alert', icon: Shield, color: '#ff0055', title: 'KYC Failed', body: 'Ahmed Al Mansour — documents rejected', time: '5m ago', unread: true },
  { id: 3, type: 'alert', icon: CreditCard, color: '#ff0055', title: 'Payment Failed', body: 'Jenna Smith — card declined $200', time: '8m ago', unread: true },
  { id: 4, type: 'call', icon: Phone, color: '#00f0ff', title: 'Call Requested', body: 'Carlos Ramirez — wants agent callback', time: '12m ago', unread: true },
  { id: 5, type: 'hot', icon: Flame, color: '#ff7f00', title: 'Hot Lead Alert', body: 'Sophie Dubois — multiple link clicks', time: '15m ago', unread: false },
  { id: 6, type: 'info', icon: CheckCircle, color: '#39ff14', title: 'Registration Complete', body: 'Li Wei completed registration', time: '20m ago', unread: false },
  { id: 7, type: 'info', icon: Info, color: '#8a2be2', title: 'System Update', body: 'AI Success Manager updated rules', time: '1h ago', unread: false },
];

const getNotifIcon = (type, IconProp) => {
  if (IconProp && typeof IconProp !== 'string') return IconProp;
  switch (type) {
    case 'vip': return Crown;
    case 'alert': return Shield;
    case 'call': return Phone;
    case 'hot': return Flame;
    case 'appt': return CalendarIcon;
    case 'message': return MessageSquare;
    case 'queue': return Users;
    default: return Bell;
  }
};

export default function NotificationsModal({ open, onClose }) {
  const navigate = useNavigate();
  const [storedNotifs, { setCollection: setStoredNotifs }] = useDataStore('notifications');
  const notifications = (storedNotifs && storedNotifs.length > 0) ? storedNotifs : defaultNotifications;

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    if (setStoredNotifs) {
      setStoredNotifs(notifications.map(n => ({ ...n, unread: false })));
    }
  };

  const handleViewAll = () => {
    onClose();
    navigate(getAppPath('/notifications'));
  };

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div initial={{ opacity: 0, x: 40, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40 }}
        className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 sm:w-96 bg-gray-950/95 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-neon-blue" />
            <span className="font-bold text-white">Notifications</span>
            {unreadCount > 0 && <span className="bg-neon-pink text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleMarkAllRead} className="text-xs text-neon-blue hover:underline">Mark all read</button>
            <button onClick={onClose} className="text-muted hover:text-white transition-colors"><X size={16} /></button>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[440px] custom-scrollbar divide-y divide-gray-800/60">
          {notifications.map(n => {
            const Icon = getNotifIcon(n.type, n.icon);
            const color = n.color || (n.type === 'appt' ? '#00f0ff' : '#8a2be2');
            return (
              <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-white/5 transition-colors ${n.unread ? 'bg-white/[0.02]' : ''}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: color + '15', border: `1px solid ${color}30` }}>
                  <Icon size={15} style={{ color: color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-gray-100 truncate">{n.title || n.type}</span>
                    {n.unread && <div className="w-2 h-2 rounded-full bg-neon-blue shrink-0 shadow-[0_0_5px_rgba(0,240,255,0.8)]" />}
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate">{n.body || n.message}</p>
                  <p className="text-[10px] text-gray-700 mt-1">{n.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-gray-800 text-center">
          <button onClick={handleViewAll} className="text-xs text-neon-blue hover:underline">View all notifications</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
