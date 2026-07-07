import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, Phone, Users, User, ChevronLeft, ChevronRight, Plus, CheckCircle, PhoneCall, RefreshCw, X, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import ActionModal from '../components/ui/ActionModal';
import CallModal from '../components/modals/CallModal';
import NewBookingModal from '../components/modals/NewBookingModal';
import { getAppPath } from '../utils/routing';

export default function AppointmentCenter() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [view, setView] = useState('Daily');
  const [appointments, { setCollection }] = useDataStore('appointments');

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [callLead, setCallLead] = useState(null);

  const handleCheckIn = (appt, newStatus) => {
    const updated = (appointments || []).map(a => a.id === appt.id ? { ...a, status: newStatus } : a);
    setCollection(updated);
    addToast('success', 'Status Updated', `${appt.title} marked as ${newStatus}.`);
    setSelectedAppt(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-green/20 border border-neon-blue/30 flex items-center justify-center">
              <CalendarIcon size={16} className="text-neon-blue" />
            </div>
            Appointment Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage scheduled calls, video sessions, and creator meetings.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => navigate(getAppPath('/calendar'))} className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
            <ExternalLink size={14} className="text-neon-purple"/> View Master Calendar
          </button>
          <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1">
            {['Daily', 'Weekly', 'Monthly'].map(v => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${view === v ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-neon-blue hover:bg-neon-blue/90 text-black rounded-lg text-sm font-black transition-colors flex items-center gap-2 shadow-md">
            <Plus size={16} /> New Booking
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Calendar / Timeline View */}
        <div className="lg:w-2/3 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/80">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-white text-lg">Today, May 20</h2>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-white bg-gray-800 rounded"><ChevronLeft size={16} /></button>
                <button className="p-1 text-gray-400 hover:text-white bg-gray-800 rounded"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0a0c10]">
            {/* Simple Timeline Mockup */}
            <div className="absolute top-0 bottom-0 left-16 w-px bg-gray-800" />
            
            <div className="py-6">
              {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((time, i) => (
                <div key={time} className="relative h-20 group">
                  <div className="absolute left-4 top-0 text-[10px] text-gray-500 font-bold font-mono">{time}</div>
                  <div className="absolute left-16 right-0 border-t border-gray-800/50" />
                  
                  {/* Render Mock Appointment Blocks inline for visualization */}
                  {i === 1 && (
                    <div className="absolute top-0 left-20 right-8 h-16 bg-neon-blue/10 border border-neon-blue/30 rounded-lg p-3 flex justify-between items-start group-hover:bg-neon-blue/20 transition-colors cursor-pointer">
                      <div>
                        <div className="font-bold text-neon-blue text-sm">VIP Onboarding</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <Users size={12} /> Maria Gonzalez
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                        <Video size={14} />
                      </div>
                    </div>
                  )}
                  {i === 5 && (
                    <div className="absolute top-0 left-20 right-8 h-16 bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-3 flex justify-between items-start group-hover:bg-neon-purple/20 transition-colors cursor-pointer">
                      <div>
                        <div className="font-bold text-neon-purple text-sm">Contract Negotiation</div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <Users size={12} /> Alpha Studios
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                        <Video size={14} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar List */}
        <div className="lg:w-1/3 flex flex-col gap-6 min-h-0">
          
          {/* Upcoming Snapshot */}
          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-0">
            <div className="px-5 py-4 border-b border-gray-800 bg-gray-900/80">
              <h2 className="font-bold text-white">Upcoming Agenda</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
              {(appointments || []).map(app => (
                <div key={app.id} onClick={() => setSelectedAppt(app)} className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-white text-sm">{app.title}</div>
                    {app.type === 'video' ? <Video size={14} className="text-neon-blue" /> : app.type === 'in-person' || app.type === 'studio' ? <Users size={14} className="text-neon-purple" /> : <Phone size={14} className="text-neon-green" />}
                  </div>
                  <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                    <Clock size={12} /> {app.time}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-2 text-xs text-gray-300 font-bold">
                      <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center"><User size={10} /></div>
                      {app.customer}
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider
                      ${app.status === 'Completed' ? 'bg-gray-800 text-gray-500' : 'bg-neon-blue/20 text-neon-blue'}
                    `}>{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* UNIVERSAL BOOKING MODAL */}
      <NewBookingModal open={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* APPOINTMENT EXECUTION & CHECK-IN MODAL */}
      <AnimatePresence>
        {selectedAppt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedAppt(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-left space-y-4"
              onClick={e => e.stopPropagation()}>
              
              <div className="flex justify-between items-start pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neon-blue/20 text-neon-blue flex items-center justify-center font-black">
                    {selectedAppt.type === 'video' ? <Video size={18}/> : selectedAppt.type === 'in-person' || selectedAppt.type === 'studio' ? <Users size={18} className="text-neon-purple"/> : <Phone size={18}/>}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">{selectedAppt.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><Clock size={12} className="text-neon-green"/> {selectedAppt.time} • {selectedAppt.date || 'Today'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAppt(null)} className="p-1 text-gray-400 hover:text-white bg-gray-900 rounded-full"><X size={16}/></button>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 font-bold"><User size={14}/></div>
                  <div>
                    <div className="text-[10px] text-gray-400">Client / Visitor</div>
                    <div className="font-bold text-white">{selectedAppt.customer}</div>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${selectedAppt.status === 'Completed' ? 'bg-gray-800 text-gray-400' : selectedAppt.status === 'Arrived' || selectedAppt.status === 'In Progress' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-blue/20 text-neon-blue'}`}>
                  {selectedAppt.status}
                </span>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <label className="font-extrabold text-gray-300 block uppercase tracking-wider text-[10px]">Front Desk & Execution Actions</label>
                
                <button onClick={() => { handleCheckIn(selectedAppt, 'Arrived'); }} className="w-full p-3 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 text-neon-green rounded-xl font-bold flex items-center justify-between transition-all">
                  <span className="flex items-center gap-2"><CheckCircle size={15}/> Mark Client as Checked-In / Arrived</span>
                  <ArrowRight size={14}/>
                </button>

                <button onClick={() => { setSelectedAppt(null); setCallLead({ name: selectedAppt.customer, phone: '+1 (555) 019-2834', stage: 'Confirmed Booking' }); }} className="w-full p-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 text-neon-blue rounded-xl font-bold flex items-center justify-between transition-all">
                  <span className="flex items-center gap-2"><PhoneCall size={15}/> Launch Live Session Dialer / Video</span>
                  <ArrowRight size={14}/>
                </button>

                <button onClick={() => { handleCheckIn(selectedAppt, 'Completed'); }} className="w-full p-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 rounded-xl font-bold flex items-center justify-between transition-all">
                  <span className="flex items-center gap-2"><RefreshCw size={15}/> Mark Session Completed</span>
                  <ArrowRight size={14}/>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CALL DIALER MODAL */}
      <CallModal open={!!callLead} lead={callLead} onClose={() => setCallLead(null)} />

    </div>
  );
}
