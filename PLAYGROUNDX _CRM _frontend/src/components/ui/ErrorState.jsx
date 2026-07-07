import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ 
  title = "Something went wrong", 
  message = "An error occurred while loading this component.", 
  onRetry 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col items-center justify-center p-8 bg-red-950/20 border border-red-900/30 rounded-xl text-center"
    >
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
        <AlertTriangle className="text-red-500" size={24} />
      </div>
      <h3 className="text-sm font-bold text-red-400 mb-1">{title}</h3>
      <p className="text-[11px] text-red-500/70 max-w-xs">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 rounded-lg text-xs font-medium transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </motion.div>
  );
}
