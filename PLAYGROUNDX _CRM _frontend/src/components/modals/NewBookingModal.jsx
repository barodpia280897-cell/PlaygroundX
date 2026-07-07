// src/components/modals/NewBookingModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, Phone, Users, User, X, CheckSquare, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import { useDataStore } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

const HOST_OPTIONS = [
  { name: 'Priya Sharma', role: 'Sales Agent', dept: 'VIP Sales', color: '#39ff14' },
  { name: 'Mike Agent', role: 'Sales Agent', dept: 'Spanish Dept', color: '#00f0ff' },
  { name: 'Kiaan Sharma', role: 'Supervisor', dept: 'Floor Monitor', color: '#ffd700' },
  { name: 'Marcus Vance', role: 'CEO', dept: 'Executive', color: '#8a2be2' },
  { name: 'Sarah Jenkins', role: 'Manager', dept: 'Operations', color: '#ff0055' },
  { name: 'Elena Vasquez', role: 'Sales Agent', dept: 'Acquisition', color: '#39ff14' },
  { name: 'James Harrington', role: 'Executive', dept: 'Executive', color: '#8a2be2' },
  { name: 'Emma Watson', role: 'Front Desk', dept: 'Reception', color: '#00f0ff' },
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

export default function NewBookingModal({ open, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [appointments, { setCollection: setAppointments }] = useDataStore('appointments');
  const [events, { setCollection: setEvents }] = useDataStore('events');
  const [tasks, { setCollection: setTasks }] = useDataStore('tasks');
  const [notifications, { setCollection: setNotifications }] = useDataStore('notifications');

  const EMPTY_FORM = {
    clientType: 'Lead',
    customer: '',
    host: HOST_OPTIONS[0].name,
    date: '',
    time: '',
    type: 'video',
    notes: '',
    generateTask: false
  };

  const [formData, setFormData] = useState(EMPTY_FORM);

  // Reset form every time modal opens
  useEffect(() => {
    if (open) setFormData(EMPTY_FORM);
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const apptId = 'APT-' + Date.now();
    const customerName = formData.customer || 'VIP Client';
    const hostName = formData.host || 'Priya Sharma';
    const sessionTime = formData.time || '11:30 AM';
    const sessionDate = formData.date || 'Tomorrow';

    // 1. Sync with Appointments Store
    const newAppt = {
      id: apptId,
      title: `${formData.clientType} Session: ${customerName}`,
      customer: customerName,
      clientType: formData.clientType,
      time: sessionTime,
      date: sessionDate,
      type: formData.type,
      status: 'Confirmed',
      agent: hostName,
      host: hostName,
      notes: formData.notes,
      createdAt: Date.now()
    };
    setAppointments([newAppt, ...(appointments || [])]);

    // 2. Sync with Master Events Calendar Store
    let d = 21, m = 4, y = 2025; // Default demo date: May 21, 2025
    if (sessionDate && sessionDate.includes('-')) {
      const parts = sessionDate.split('-');
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1; // JS 0-indexed month
      d = parseInt(parts[2], 10);
    } else if (sessionDate === 'Today') {
      d = 20; m = 4;
    } else if (sessionDate === 'Tomorrow') {
      d = 21; m = 4;
    }

    const newEvent = {
      id: 'EV-' + Date.now(),
      title: `${formData.clientType} Call: ${customerName} (${hostName})`,
      date: d,
      month: m,
      year: y,
      time: sessionTime,
      duration: '45m',
      type: formData.type === 'video' ? 'Call' : formData.type === 'in-person' ? 'Meeting' : 'Call',
      agent: hostName,
      attendees: [{ name: customerName, img: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}` }],
      desc: formData.notes || `Assigned by Front Desk (${formData.clientType})`
    };
    if (setEvents && events) {
      setEvents([newEvent, ...events]);
    }

    // 3. Generate Preparation Task if checked
    if (formData.generateTask && setTasks && tasks) {
      const newTask = {
        id: 'TSK-' + Date.now(),
        title: `Prep for ${formData.clientType} session with ${customerName}`,
        desc: formData.notes || `Review profile and prepare documents for scheduled ${formData.type} session.`,
        agent: hostName,
        assignee: hostName,
        priority: formData.clientType === 'VIP' || formData.clientType === 'Creator' ? 'High' : 'Normal',
        status: 'Pending',
        dueDate: sessionDate,
        dueTime: sessionTime,
        tag: 'Appointments',
        createdAt: Date.now()
      };
      setTasks([newTask, ...tasks]);
    }

    // 4. Generate Mock Notification for Assigned User
    if (setNotifications && notifications) {
      const newNotif = {
        id: Date.now(),
        type: 'appt',
        title: 'New appointment assigned by Front Desk',
        body: `${sessionDate} at ${sessionTime} with ${customerName}.`,
        message: `${sessionDate} at ${sessionTime} with ${customerName}.`, // alias for both modal schemas
        time: 'Just now',
        unread: true,
        category: 'CRM',
        agent: hostName
      };
      setNotifications([newNotif, ...notifications]);
    }

    // Trigger feedback toast
    addToast('success', '📅 Appointment Scheduled!', `${customerName} booked with ${hostName} for ${sessionTime} (${sessionDate}). Synced across Dashboard, Calendar, and Tasks.`);
    
    if (onSuccess) onSuccess(newAppt);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
          className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl text-left space-y-5 my-8 relative overflow-hidden"
          onClick={e => e.stopPropagation()}>
          
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-green" />

          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 text-neon-purple flex items-center justify-center font-black">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  Schedule New Appointment
                  <span className="text-[10px] bg-neon-blue/20 text-neon-blue px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Front Desk Sync</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Book a session and automatically notify assigned team members.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white bg-gray-900 rounded-full transition-colors"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* 1. Appointment Type Selection */}
            <div>
              <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-2">1. Select Visitor / Client Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['Lead', 'Creator', 'Fan', 'External Visitor'].map(type => (
                  <button key={type} type="button"
                    onClick={() => setFormData({ ...formData, clientType: type })}
                    className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                      formData.clientType === type
                        ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(138,43,226,0.3)]'
                        : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Client Name & Host Assignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-1.5">2. Client / Visitor Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-gray-500" />
                  <input type="text" required
                    value={formData.customer}
                    onChange={e => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="e.g. Li Wei or Maria G."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-semibold focus:outline-none focus:border-neon-blue transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-1.5">3. Assign Host / Team Member</label>
                <select value={formData.host} onChange={e => setFormData({ ...formData, host: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-neon-purple transition-colors">
                  {HOST_OPTIONS.map(opt => (
                    <option key={opt.name} value={opt.name}>
                      {opt.name} ({opt.role} - {opt.dept})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Date, Time & Session Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-1.5">Date</label>
                <select value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-neon-blue">
                  <option value="Today">Today (May 20, 2025)</option>
                  <option value="Tomorrow">Tomorrow (May 21, 2025)</option>
                  <option value="2025-05-22">Thursday (May 22, 2025)</option>
                  <option value="2025-05-23">Friday (May 23, 2025)</option>
                </select>
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-1.5">Time Slot</label>
                <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-neon-blue">
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-1.5">Meeting Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 text-white font-semibold focus:outline-none focus:border-neon-blue">
                  <option value="video">🎥 Online Video Call</option>
                  <option value="call">📞 Phone Conference</option>
                  <option value="in-person">🏢 In-Person Office Meeting</option>
                  <option value="studio">🎙️ Live Studio Recording</option>
                </select>
              </div>
            </div>

            {/* 4. Notes */}
            <div>
              <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px] mb-1.5">4. Agenda & Notes</label>
              <textarea rows={2}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter meeting agenda, VIP requirements, or preparation notes..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-white font-normal focus:outline-none focus:border-neon-blue resize-none"
              />
            </div>

            {/* 5. Auto Task Generation Checkbox */}
            <div className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green shrink-0">
                  <CheckSquare size={16} />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    Generate Preparation Task for Assignee
                    <Sparkles size={12} className="text-yellow-400" />
                  </div>
                  <div className="text-[10px] text-gray-400">Automatically creates a high-priority task on {formData.host}'s task checklist.</div>
                </div>
              </div>
              <input type="checkbox"
                checked={formData.generateTask}
                onChange={e => setFormData({ ...formData, generateTask: e.target.checked })}
                className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-neon-green focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 font-bold transition-colors">
                Cancel
              </button>
              <button type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 text-black font-black flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
                <ShieldCheck size={16} /> Confirm & Sync Appointment
              </button>
            </div>

          </form>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
