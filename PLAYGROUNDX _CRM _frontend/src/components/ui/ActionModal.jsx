import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

export default function ActionModal({ open, isOpen, onClose, title, icon: Icon, onSubmit, onConfirm, fields = [], submitText, confirmText, children }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const isModalOpen = open !== undefined ? open : isOpen;
  const handleSubmitFunc = onSubmit || onConfirm || (() => {});
  const buttonText = submitText || confirmText || 'Save';

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let combinedData = { ...formData };
      if (e.target && typeof e.target === 'object') {
        const formProps = Object.fromEntries(new FormData(e.target));
        combinedData = { ...combinedData, ...formProps };
      }
      await handleSubmitFunc(combinedData);
    } finally {
      setLoading(false);
      setFormData({});
      onClose && onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-gray-950 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            {Icon && <Icon size={18} className="text-neon-blue" />}
            <h2 className="text-base font-black text-white">{title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          {children && <div className="mb-2">{children}</div>}

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="" disabled>Select {field.label}</option>
                  {field.options?.map(opt => {
                    const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
                    const lbl = typeof opt === 'object' && opt !== null ? opt.label : opt;
                    return <option key={val} value={val}>{lbl}</option>;
                  })}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  rows={3}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white font-medium focus:outline-none focus:border-neon-blue transition-colors resize-none custom-scrollbar"
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue transition-colors"
                />
              )}
            </div>
          ))}

          <div className="pt-3 flex items-center gap-3 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-800 text-xs font-bold text-gray-400 hover:bg-gray-900 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-neon-blue text-black text-xs font-black shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : buttonText}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
