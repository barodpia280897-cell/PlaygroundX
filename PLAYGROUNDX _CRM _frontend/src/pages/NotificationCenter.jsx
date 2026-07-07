import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Filter, AlertTriangle, MessageSquare, CheckCircle, Clock, Zap, CreditCard, ChevronRight, Crown, Shield, Phone, Flame, Info, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../contexts/DataContext';

const defaultNotifications = [
  { id: 1, type: 'SLA Alert', icon: AlertTriangle, color: 'text-neon-pink', bg: 'bg-neon-pink/10 border-neon-pink/30', message: 'VIP Queue wait time exceeded 5 minutes.', time: '2 mins ago', unread: true, category: 'System' },
  { id: 2, type: 'New Lead', icon: MessageSquare, color: 'text-neon-blue', bg: 'bg-neon-blue/10 border-neon-blue/30', message: 'New High Value Creator lead assigned to you: Sarah Jenkins.', time: '15 mins ago', unread: true, category: 'CRM' },
  { id: 3, type: 'Task Reminder', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30', message: 'Follow up call with Acme Corp scheduled in 10 minutes.', time: '1 hr ago', unread: true, category: 'Tasks' },
  { id: 4, type: 'Campaign', icon: Zap, color: 'text-neon-purple', bg: 'bg-neon-purple/10 border-neon-purple/30', message: 'Summer Giveaway Campaign reached 10k engagement.', time: '3 hrs ago', unread: false, category: 'Growth' },
  { id: 5, type: 'Payment', icon: CreditCard, color: 'text-neon-green', bg: 'bg-neon-green/10 border-neon-green/30', message: 'Subscription payment of $4,500 received from Alpha Studios.', time: '1 day ago', unread: false, category: 'Billing' },
  { id: 6, type: 'System', icon: CheckCircle, color: 'text-gray-400', bg: 'bg-gray-800 border-gray-700', message: 'System maintenance completed successfully.', time: '2 days ago', unread: false, category: 'System' },
];

const getNotifIcon = (type, IconProp) => {
  if (IconProp && typeof IconProp !== 'string') return IconProp;
  switch (type) {
    case 'SLA Alert': case 'alert': return AlertTriangle;
    case 'New Lead': case 'message': return MessageSquare;
    case 'Task Reminder': return Clock;
    case 'Campaign': return Zap;
    case 'Payment': return CreditCard;
    case 'appt': return CalendarIcon;
    case 'vip': return Crown;
    case 'call': return Phone;
    case 'hot': return Flame;
    case 'queue': return Users;
    default: return Bell;
  }
};

const categories = ['All', 'System', 'CRM', 'Tasks', 'Growth', 'Billing'];

export default function NotificationCenter() {
  const { user } = useAuth();
  const isViewer = user?.role === 'VIEWER';
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [storedNotifs, { setCollection: setStoredNotifs }] = useDataStore('notifications');
  const notifications = (storedNotifs && storedNotifs.length > 0) ? storedNotifs : defaultNotifications;

  const filtered = notifications.filter(n => 
    (activeCategory === 'All' || n.category === activeCategory) &&
    (n.message || n.body || '').toLowerCase().includes(search.toLowerCase())
  );

  const markAllRead = () => {
    if (isViewer || !setStoredNotifs) return;
    setStoredNotifs(notifications.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    if (isViewer || !setStoredNotifs) return;
    setStoredNotifs(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-pink/20 to-neon-purple/20 border border-neon-pink/30 flex items-center justify-center">
              <Bell size={16} className="text-neon-pink" />
            </div>
            Notification Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage system alerts, task reminders, and campaign updates.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-neon-pink/50 w-64"
            />
          </div>
          {!isViewer && (
            <button onClick={markAllRead} className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-bold text-gray-300 transition-colors whitespace-nowrap">
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-6">
        
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Categories</div>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-bold text-sm
                ${activeCategory === cat ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/30' : 'bg-transparent text-gray-400 hover:bg-white/5 border border-transparent'}
              `}
            >
              {cat}
              {cat === 'All' && <span className="bg-neon-pink text-white text-[10px] px-2 py-0.5 rounded-full">{notifications.filter(n => n.unread).length}</span>}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/80 flex justify-between items-center">
            <h2 className="font-bold text-white">{activeCategory} Notifications</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
              <Filter size={14} />
              Showing {filtered.length} results
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {filtered.length > 0 ? (
              <div className="space-y-1">
                {filtered.map((n) => {
                  const Icon = getNotifIcon(n.type, n.icon);
                  const colorClass = n.color?.startsWith('text-') ? n.color : (n.type === 'appt' ? 'text-neon-blue' : 'text-neon-purple');
                  const bgClass = n.bg || (n.type === 'appt' ? 'bg-neon-blue/10 border-neon-blue/30' : 'bg-neon-purple/10 border-neon-purple/30');
                  return (
                    <motion.div 
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => !isViewer && markAsRead(n.id)}
                      className={`relative flex items-start gap-4 p-4 rounded-xl transition-all border
                        ${isViewer ? 'cursor-default' : 'cursor-pointer'}
                        ${n.unread ? 'bg-gray-800/80 hover:bg-gray-800 border-gray-700 shadow-lg' : 'bg-transparent hover:bg-white/5 border-transparent opacity-80'}
                      `}
                    >
                      {n.unread && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-pink rounded-r-full" />}
                      
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${bgClass}`}>
                        <Icon size={18} className={colorClass} />
                      </div>
                      
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{n.title || n.type}</span>
                            <span className="table-th px-1.5 py-0.5 border border-gray-700 rounded bg-gray-900">{n.category || 'CRM'}</span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className={`text-sm ${n.unread ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                          {n.message || n.body}
                        </p>
                      </div>
                      
                      <div className="pt-2">
                        <ChevronRight size={16} className="text-gray-600" />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Bell size={48} className="mb-4 opacity-20" />
                <p>No notifications found in this category.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
