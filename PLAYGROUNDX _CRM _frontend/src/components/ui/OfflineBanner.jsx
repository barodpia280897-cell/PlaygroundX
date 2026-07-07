import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, X } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => { setIsOffline(false); setDismissed(false); };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-red-600/90 backdrop-blur-md text-white py-2 px-4 shadow-[0_4px_20px_rgba(220,38,38,0.3)] flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <WifiOff size={16} />
          <span className="text-xs font-bold">You are currently offline.</span>
          <span className="text-[10px] hidden sm:inline ml-2 opacity-80">Some features may be unavailable until your connection is restored.</span>
        </div>
        <button onClick={() => setDismissed(true)} className="p-1 hover:bg-white/20 rounded-md transition-colors">
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
