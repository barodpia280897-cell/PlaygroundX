import { motion, AnimatePresence } from 'framer-motion';
import { Clock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SessionExpiredModal({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    logout();
    if (onClose) onClose();
    navigate('/login', { replace: true });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl text-center flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 relative">
            <Clock className="text-amber-500" size={28} />
            <div className="absolute top-0 right-0 w-4 h-4 bg-gray-950 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-lg font-black text-white mb-2">Session Expired</h2>
          <p className="text-xs text-gray-400 mb-6 px-4">
            For your security, your session has timed out due to inactivity. Please log in again to continue.
          </p>
          
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neon-blue text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all"
          >
            <LogIn size={16} /> Log In Again
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
