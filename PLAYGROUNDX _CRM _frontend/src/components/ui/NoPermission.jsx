import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NoPermission({ 
  title = "Access Denied", 
  message = "You do not have permission to view this page. Contact your administrator if you believe this is an error."
}) {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full bg-panel border border-gray-800 rounded-2xl p-8 text-center shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
          <Lock className="text-gray-500" size={28} />
        </div>
        <h2 className="text-lg font-black text-white mb-2">{title}</h2>
        <p className="text-xs text-muted mb-6">{message}</p>
        
        <button 
          onClick={() => navigate(-1)}
          className="w-full py-2.5 bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl text-xs font-bold transition-colors"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
