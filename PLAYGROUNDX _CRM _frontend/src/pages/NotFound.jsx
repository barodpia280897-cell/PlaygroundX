import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-pink/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-neon-blue/10 rounded-full blur-3xl" />
        
        <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-700 flex items-center justify-center mb-6 relative z-10 shadow-lg">
          <AlertCircle size={36} className="text-gray-400" />
        </div>
        
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-2 relative z-10">404</h1>
        <h2 className="text-lg font-bold text-white mb-2 relative z-10">Page Not Found</h2>
        <p className="text-xs text-gray-400 mb-8 max-w-[250px] relative z-10">
          The page you are looking for doesn't exist or has been moved to another location.
        </p>
        
        <button 
          onClick={() => navigate(-1)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-colors relative z-10"
        >
          <ArrowLeft size={14} /> Go Back
        </button>
      </motion.div>
      <div className="mt-8 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
        PlayGroundX CRM
      </div>
    </div>
  );
}
