import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((arg1, arg2, arg3) => {
    let type = 'info';
    let title = '';
    let message = '';

    if (['success', 'error', 'info', 'warning'].includes(arg1)) {
      type = arg1;
      if (arg3) {
        title = arg2;
        message = arg3;
      } else {
        message = arg2;
      }
    } else {
      message = arg1;
      type = arg2 || 'info';
    }

    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    const handleGlobalToast = (e) => {
      addToast(e.detail.type, e.detail.title, e.detail.message);
    };
    window.addEventListener('globalToast', handleGlobalToast);
    return () => window.removeEventListener('globalToast', handleGlobalToast);
  }, [addToast]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const typeConfig = {
  success: { icon: CheckCircle2, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/30' },
  error: { icon: AlertCircle, color: 'text-neon-pink', bg: 'bg-neon-pink/10', border: 'border-neon-pink/30' },
  warning: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  info: { icon: Info, color: 'text-neon-blue', bg: 'bg-neon-blue/10', border: 'border-neon-blue/30' },
};

function Toast({ toast, onRemove }) {
  const cfg = typeConfig[toast.type] || typeConfig.info;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className={`glass-panel border ${cfg.border} ${cfg.bg} p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-start gap-3 min-w-[300px] max-w-sm`}
    >
      <Icon size={18} className={`${cfg.color} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className={`text-xs font-bold ${cfg.color} mb-0.5`}>{toast.title}</p>}
        <p className="text-sm text-white font-medium leading-snug">{toast.message}</p>
      </div>
      <button onClick={() => onRemove(toast.id)} className="text-secondary hover:text-white transition-colors shrink-0 p-0.5">
        <X size={14} />
      </button>
    </motion.div>
  );
}
