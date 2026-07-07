import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, Mail, Globe, MapPin, Briefcase } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export default function EditLeadModal({ open, lead, onClose, onSave, onUpdate }) {
  const [formData, setFormData] = useState({
    name: lead.name || '',
    email: lead.email || '',
    phone: lead.phone || '',
    country: lead.country || '',
    language: lead.language || '',
    type: lead.type || 'Creator',
    status: lead.status || 'Active',
    stage: lead.stage || 'New Lead'
  });
  
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    const handler = onSave || onUpdate;
    if (handler) handler(formData);
    addToast('success', 'Profile Updated', `${formData.name}'s profile has been saved.`);
    onClose();
  };

  if (!open && open !== undefined) return null;
  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 sm:p-0">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-gray-900 border-l border-gray-800 shadow-2xl w-full max-w-md h-full overflow-hidden flex flex-col">
        
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-700 overflow-hidden">
               <img src={lead.avatar} alt={lead.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Edit Profile</h2>
              <p className="text-xs text-gray-400">ID: {lead.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neon-blue uppercase tracking-wider flex items-center gap-2"><User size={14} /> Basic Information</h3>
            
            <div className="space-y-1">
              <label className="table-th">Full Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" />
            </div>
            
            <div className="space-y-1">
              <label className="table-th">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="table-th">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800/50">
            <h3 className="text-xs font-bold text-neon-purple uppercase tracking-wider flex items-center gap-2"><Briefcase size={14} /> CRM Data</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="table-th">Lead Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none">
                  <option value="Creator">Creator</option>
                  <option value="Fan">Fan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="table-th">Lead Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none">
                  <option value="Hot Lead">Hot Lead</option>
                  <option value="Active">Active</option>
                  <option value="VIP Prospect">VIP Prospect</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="table-th">Pipeline Stage</label>
              <select value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none">
                <option value="New Lead">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Interested">Interested</option>
                <option value="Registration Started">Registration Started</option>
                <option value="Registered">Registered</option>
                <option value="KYC Submitted">KYC Submitted</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-800/50">
            <h3 className="text-xs font-bold text-neon-pink uppercase tracking-wider flex items-center gap-2"><Globe size={14} /> Location</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="table-th">Country</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="table-th">Language</label>
                <input type="text" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-blue transition-colors" />
              </div>
            </div>
          </div>
          
        </form>
        
        <div className="p-6 border-t border-gray-800 bg-gray-900/50 backdrop-blur-xl flex justify-end gap-3 sticky bottom-0">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 rounded-lg bg-neon-blue text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">Save Changes</button>
        </div>
      </motion.div>
    </div>
  );
}
