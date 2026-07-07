// src/components/dashboard/TasksPanel.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, ArrowRight } from 'lucide-react';
import { useAuth, ROLE_CONFIG } from '../../contexts/AuthContext';
import { useDataStore } from '../../contexts/DataContext';

const urgencyStyles = {
  critical: 'border-neon-pink/40 bg-neon-pink/10 text-neon-pink',
  high:     'border-orange-500/40 bg-orange-500/10 text-orange-400',
  medium:   'border-yellow-500/40 bg-yellow-500/10 text-yellow-400',
};

export default function TasksPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, { updateItem }] = useDataStore('tasks');
  const prefix = user ? `/${ROLE_CONFIG[user.role].prefix}` : '';
  const pendingTasks = tasks.filter(t => !t.done).slice(0, 5);

  const toggleTask = (e, id) => {
    e.stopPropagation();
    updateItem(id, (task) => ({ ...task, done: !task.done }));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="glass-panel p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Tasks</h3>
          <span className="text-muted text-xs">(17)</span>
        </div>
        <button onClick={() => navigate(`${prefix}/tasks`)} className="text-xs text-neon-blue flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></button>
      </div>
      <div className="space-y-2">
        {pendingTasks.map((task, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800/50 bg-gray-900/30 hover:border-gray-700 transition-colors cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-600 accent-neon-blue cursor-pointer" checked={task.done} onChange={(e) => toggleTask(e, task.id)} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors truncate">{task.title}</p>
              <p className="text-[11px] text-muted truncate">{task.name}</p>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${urgencyStyles[task.urgency] || 'text-muted border-gray-600'}`}>{task.due}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
