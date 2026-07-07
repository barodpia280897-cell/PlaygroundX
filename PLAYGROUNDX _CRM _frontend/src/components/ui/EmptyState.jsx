import { motion } from 'framer-motion';

export default function EmptyState({ 
  icon: Icon, 
  title = "No Records Found", 
  description = "Try adjusting your search or filters to find what you're looking for.",
  actionLabel,
  onAction
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]"
    >
      <div className="w-16 h-16 rounded-full bg-gray-900/50 border border-gray-800 flex items-center justify-center mb-4">
        {Icon && <Icon size={24} className="text-gray-500" />}
      </div>
      <h3 className="text-sm font-bold text-gray-300 mb-1">{title}</h3>
      <p className="text-[11px] text-gray-500 max-w-sm mx-auto">{description}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-bold hover:bg-neon-blue hover:text-black transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
