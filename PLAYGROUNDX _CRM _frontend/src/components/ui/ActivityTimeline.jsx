import * as LucideIcons from 'lucide-react';

export default function ActivityTimeline({ events = [] }) {
  if (!events.length) {
    return <div className="text-gray-400 text-sm">No activity recorded yet.</div>;
  }

  const getTypeStyles = (type) => {
    switch(type) {
      case 'system': return { bg: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-400' };
      case 'ai_action': return { bg: 'bg-purple-900/30', border: 'border-purple-500/50', text: 'text-purple-400' };
      case 'user_action': return { bg: 'bg-blue-900/30', border: 'border-blue-500/50', text: 'text-blue-400' };
      case 'agent_action': return { bg: 'bg-green-900/30', border: 'border-green-500/50', text: 'text-green-400' };
      case 'alert': return { bg: 'bg-red-900/30', border: 'border-red-500/50', text: 'text-red-400' };
      default: return { bg: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-400' };
    }
  };

  return (
    <div className="relative border-l border-gray-700/50 ml-4 space-y-6 pb-4">
      {events.map((event, idx) => {
        const Icon = LucideIcons[event.icon] || LucideIcons.Circle;
        const styles = getTypeStyles(event.type);
        
        return (
          <div key={event.id || idx} className="relative pl-6 group">
            <div className={`absolute -left-3.5 top-0.5 h-7 w-7 rounded-full flex items-center justify-center border ${styles.bg} ${styles.border} shadow-lg transition-transform group-hover:scale-110`}>
              <Icon className={`w-3.5 h-3.5 ${styles.text}`} />
            </div>
            <div className="bg-gray-900/40 rounded-lg p-3 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
              <p className="text-sm text-gray-200">{event.text}</p>
              <span className="text-xs text-gray-500 mt-1 block">
                {new Date(event.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
