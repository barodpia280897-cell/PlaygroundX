import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Trophy, Gift, Mic, Star } from 'lucide-react';

const NotificationContext = createContext();

const iconMap = {
  vip: <Star size={16} className="text-yellow-500" />,
  tip: <Gift size={16} className="text-green-400" />,
  match: <Trophy size={16} className="text-neon-blue" />,
  voice: <Mic size={16} className="text-neon-purple" />,
  default: <Bell size={16} className="text-gray-300" />
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, title, message) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      
      {/* Global Notification Manager UI */}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-3 items-start shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group cursor-pointer"
              onClick={() => removeNotification(notif.id)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
              
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {iconMap[notif.type] || iconMap.default}
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{notif.title}</span>
                <span className="text-xs text-gray-400 leading-snug">{notif.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
