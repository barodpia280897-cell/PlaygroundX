import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';

export default function CreatePipelineModal({ open, onClose }) {
  const [pipelines, setPipelines] = useDataStore('pipelines');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Creator',
    description: '',
    department: 'Creator Success',
    manager: 'Current User',
    status: 'Active'
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    
    // Add to mock store
    const newPipeline = {
      name: formData.name,
      count: 0,
      color: formData.type === 'Creator' ? '#00f0ff' : '#ff0055',
      leads: []
    };
    
    setPipelines([...pipelines, newPipeline]);
    
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setFormData({ name: '', type: 'Creator', description: '', department: 'Creator Success', manager: 'Current User', status: 'Active' });
      onClose();
    }, 1500);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-2 text-white font-bold">
              <GitBranch size={16} className="text-neon-blue" />
              <span>Create New Pipeline</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {success ? (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center">
                <CheckCircle size={32} className="text-neon-green" />
              </div>
              <h3 className="text-xl font-bold text-white">Pipeline Created!</h3>
              <p className="text-sm text-gray-400">Your new pipeline has been added to the system.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pipeline Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. VIP Onboarding 2024" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pipeline Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue appearance-none">
                      <option value="Creator">Creator Pipeline</option>
                      <option value="Fan">Fan Pipeline</option>
                      <option value="Custom">Custom Target</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue appearance-none">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive (Draft)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description (Optional)</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of this pipeline's goal..." className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue h-20 resize-none"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Department</label>
                    <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue appearance-none">
                      <option value="Creator Success">Creator Success</option>
                      <option value="Fan Acquisition">Fan Acquisition</option>
                      <option value="VIP Team">VIP Team</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Assigned Manager</label>
                    <select value={formData.manager} onChange={e => setFormData({...formData, manager: e.target.value})}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue appearance-none">
                      <option value="Current User">Me</option>
                      <option value="Jane Doe">Jane Doe</option>
                      <option value="John Smith">John Smith</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800 mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-xl bg-neon-blue text-black font-bold text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
                  Create Pipeline
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
