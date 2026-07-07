import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Flag, CheckSquare } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function CreateTaskModal({ leadId, leadName, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Follow-up',
    priority: 'Medium',
    dueDate: '',
    description: ''
  });
  
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;
    
    onAdd({
      id: Date.now(),
      leadId: leadId,
      title: formData.title,
      desc: formData.description || `Task for ${leadName}`,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'Pending',
      type: formData.type
    });
    
    addToast('success', 'Task Created', `Task "${formData.title}" added successfully.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
              <CheckSquare size={20} className="text-neon-blue" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Task</h2>
              <p className="text-xs text-gray-400">For {leadName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-5 max-h-[70vh]">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="e.g. Call to verify documents" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Task Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none">
                <option value="Phone Call">Phone Call</option>
                <option value="Email">Email</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Meeting">Meeting</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Due Date</label>
            <input type="datetime-local" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors [color-scheme:dark]" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description (Optional)</label>
            <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors resize-none" placeholder="Add any extra details here..."></textarea>
          </div>
        </form>
        
        <div className="p-5 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl flex justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-neon-blue text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">Save Task</button>
        </div>
      </motion.div>
    </div>
  );
}
