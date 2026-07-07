import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Video, Users, Plus, ChevronLeft, ChevronRight, Filter, Download, Phone, CheckSquare, Search, MapPin, AlignLeft, X, User, Check, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActionModal from '../components/ui/ActionModal';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../contexts/DataContext';
import { filterDataByRole } from '../utils/rbac';
import { getAppPath } from '../utils/routing';

const eventTypes = {
  Meeting: { color: '#3b82f6', bg: '#3b82f630', icon: Video },
  Call: { color: '#10b981', bg: '#10b98130', icon: Phone },
  Task: { color: '#f59e0b', bg: '#f59e0b30', icon: CheckSquare },
  VIP: { color: '#8a2be2', bg: '#8a2be230', icon: CrownIcon },
  'In-Person': { color: '#ec4899', bg: '#ec489930', icon: Users },
  Studio: { color: '#00f0ff', bg: '#00f0ff30', icon: MapPin }
};

function CrownIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
}

const generateInitialEvents = () => {
  const evts = [
    { id: 1, title: 'Creator Onboarding Call - Maria G.', date: 20, month: 4, year: 2025, time: '10:00 AM', duration: '45m', type: 'Call', agent: 'Priya Sharma', attendees: [{name:'Maria G.', img:'https://i.pravatar.cc/150?img=1'}], desc: 'Guiding new Creator through KYC verification and profile setup.' },
    { id: 2, title: 'Weekly Sync - Spanish Dept', date: 20, month: 4, year: 2025, time: '11:30 AM', duration: '1h', type: 'Meeting', agent: 'Mike Agent', attendees: [{name:'Carlos M.', img:'https://i.pravatar.cc/150?img=11'}, {name:'Team', img:'https://i.pravatar.cc/150?img=3'}], desc: 'Review weekly KPIs for Spanish department.' },
    { id: 3, title: 'KYC Verification Follow-up - Jin Woo', date: 20, month: 4, year: 2025, time: '04:00 PM', duration: '30m', type: 'Task', agent: 'Priya Sharma', attendees: [{name:'Jin Woo', img:'https://i.pravatar.cc/150?img=9'}], desc: 'Assisting creator with ID document upload.' },
    { id: 4, title: 'VIP Fan Deposit Guidance - Sophie Dubois', date: 15, month: 4, year: 2025, time: '02:00 PM', duration: '30m', type: 'VIP', agent: 'Priya Sharma', attendees: [{name:'Sophie D.', img:'https://i.pravatar.cc/150?img=13'}], desc: 'Guiding VIP fan through first wallet deposit and token purchase.' },
    { id: 5, title: 'KYC Verification Audit Call', date: 25, month: 4, year: 2025, time: '09:30 AM', duration: '45m', type: 'Call', agent: 'Mike Agent', attendees: [{name:'Ahmed A.', img:'https://i.pravatar.cc/150?img=7'}], desc: 'Resolving ID verification discrepancies.' },
    // June events for month switching demonstration
    { id: 6, title: 'Assigned Lead Qualification - Ahmed A.', date: 5, month: 5, year: 2025, time: '11:00 AM', duration: '45m', type: 'Call', agent: 'Priya Sharma', attendees: [{name:'Ahmed A.', img:'https://i.pravatar.cc/150?img=7'}], desc: 'Initial qualification call with priority routed lead.' },
    { id: 7, title: 'Quarterly Financial Review', date: 12, month: 5, year: 2025, time: '03:00 PM', duration: '1h 30m', type: 'Meeting', agent: 'Mike Agent', attendees: [{name:'Board', img:'https://i.pravatar.cc/150?img=20'}], desc: 'Q2 revenue split and studio budget review.' }
  ];

  const types = ['Meeting', 'Call', 'Task', 'VIP'];
  const agents = ['Priya Sharma', 'Mike Agent', 'Sarah Jenkins', 'Omar Agent'];

  // Add randomized events across May and June 2025
  for (let m = 3; m <= 6; m++) {
    for (let i = 1; i <= 28; i++) {
      if (m === 4 && i === 20) continue;
      if (Math.random() > 0.65) {
        const type = types[Math.floor(Math.random() * types.length)];
        evts.push({
          id: 1000 + m * 100 + i,
          title: `${type} with Client #${i}`,
          date: i,
          month: m,
          year: 2025,
          time: `${Math.floor(Math.random() * 7) + 9}:00 AM`,
          duration: '30m',
          type: type,
          agent: agents[i % agents.length],
          attendees: [{name:'Client', img:`https://i.pravatar.cc/150?img=${(i % 50) + 1}`}],
          desc: 'Automated CRM schedule block.'
        });
      }
    }
  }
  return evts;
};

const initialEventsList = generateInitialEvents();

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [appointments, { setCollection: setAppointments }] = useDataStore('appointments');
  const [eventsStore, { setCollection: setEventsStore }] = useDataStore('events');
  
  // Real Date Navigation State (Default to May 2025 where mock data is rich)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 20)); // Month is 0-indexed (4 = May)
  const [view, setView] = useState('Month'); // Day, Week, Month
  const [showAdd, setShowAdd] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const allEvents = (() => {
    const baseEvents = (eventsStore && eventsStore.length > 0) ? eventsStore : initialEventsList;
    const apptEvents = (appointments || []).map(a => {
      if (baseEvents.some(ev => ev.id === a.id || (ev.title && ev.title.includes(a.customer || '---')))) return null;
      let d = 20, m = 4, y = 2025;
      if (a.date === 'Today') { d = 20; m = 4; }
      else if (a.date === 'Tomorrow') { d = 21; m = 4; }
      else if (a.date && a.date.includes('-')) {
        const p = a.date.split('-');
        y = parseInt(p[0], 10); m = parseInt(p[1], 10) - 1; d = parseInt(p[2], 10);
      }
      return {
        id: a.id,
        title: `${a.clientType || 'Lead'} Session: ${a.customer || a.title}`,
        date: d, month: m, year: y,
        time: (a.time || '10:00 AM').split(' ')[0],
        duration: '45m',
        type: a.type === 'video' ? 'Call' : 'Meeting',
        agent: a.agent || a.host || 'Priya Sharma',
        attendees: [{ name: a.customer || 'Client', img: 'https://i.pravatar.cc/150?img=12' }],
        desc: a.notes || `CRM Appointment: ${a.title}`
      };
    }).filter(Boolean);
    return [...baseEvents, ...apptEvents];
  })();
  const [typeFilter, setTypeFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handlePrevMonth = () => {
    const next = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(next);
    addToast('info', 'Calendar Updated', `Switched to ${monthNames[next.getMonth()]} ${next.getFullYear()}`);
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(next);
    addToast('info', 'Calendar Updated', `Switched to ${monthNames[next.getMonth()]} ${next.getFullYear()}`);
  };

  const handleToday = () => {
    const today = new Date(2025, 4, 20); // Resetting to May 20, 2025 demo date
    setCurrentDate(today);
    addToast('success', 'Jumped to Today', 'Showing May 20, 2025 schedule.');
  };

  // Filter events by RBAC and user filters
  const rbacEvents = filterDataByRole(allEvents, user, 'appointments');
  const events = rbacEvents.filter(ev => {
    if (ev.month !== currentMonth || ev.year !== currentYear) return false;
    if (typeFilter !== 'All' && ev.type !== typeFilter) return false;
    if (agentFilter !== 'All' && ev.agent !== agentFilter) return false;
    return true;
  });

  const handleAddEvent = async (data) => {
    const d = data.date ? parseInt(data.date.split('-')[2], 10) : currentDate.getDate();
    const m = data.date ? parseInt(data.date.split('-')[1], 10) - 1 : currentMonth;
    const y = data.date ? parseInt(data.date.split('-')[0], 10) : currentYear;

    const newEvent = {
      id: Date.now(),
      title: data.title || 'New Consultation',
      date: isNaN(d) ? 20 : d,
      month: isNaN(m) ? currentMonth : m,
      year: isNaN(y) ? currentYear : y,
      time: data.time || '10:00 AM',
      duration: data.duration || '30m',
      type: data.type || 'Meeting',
      agent: user?.name || 'Priya Sharma',
      attendees: [{name: 'Me', img: 'https://i.pravatar.cc/150?img=47'}],
      desc: data.desc || 'Scheduled via VIP CRM portal.'
    };
    setAllEvents(prev => [...prev, newEvent]);
    if (setAppointments) {
      setAppointments([
        ...((appointments || [])),
        { id: 'APT-' + Date.now(), title: newEvent.title, customer: 'VIP Client', time: newEvent.time, date: `${newEvent.year}-${String(newEvent.month+1).padStart(2,'0')}-${String(newEvent.date).padStart(2,'0')}`, type: newEvent.type === 'Call' ? 'call' : 'video', status: 'Confirmed' }
      ]);
    }
    setShowAdd(false);
    addToast('success', 'Event Created', `"${newEvent.title}" booked for ${monthNames[newEvent.month]} ${newEvent.date}. Synced with Daily Desk.`);
  };

  const handleDeleteEvent = (id) => {
    setAllEvents(prev => prev.filter(e => e.id !== id));
    setSelectedEvent(null);
    addToast('success', 'Event Cancelled', 'The scheduled appointment was removed.');
  };

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const renderMonthGrid = () => (
    <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="grid grid-cols-7 border-b border-gray-800 bg-gray-950/80">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="px-2 py-3 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center border-r border-gray-800/80 last:border-r-0">
            {d}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-gray-950/40">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="border-r border-b border-gray-800/40 p-1 min-h-[100px] bg-black/30" />
        ))}
        {days.map(d => {
          const isToday = d === 20 && currentMonth === 4 && currentYear === 2025;
          const dayEvents = events.filter(e => e.date === d).sort((a,b) => a.time.localeCompare(b.time));
          
          return (
            <div 
              key={d} 
              onClick={() => {
                if (dayEvents.length === 1) setSelectedEvent(dayEvents[0]);
                else if (dayEvents.length === 0) {
                  setShowAdd(true);
                }
              }}
              className={`border-r border-b border-gray-800/40 p-1.5 min-h-[100px] flex flex-col gap-1 transition-all hover:bg-white/[0.03] cursor-pointer group ${isToday ? 'bg-neon-blue/5 border-neon-blue/30' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-transform group-hover:scale-110 ${isToday ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'text-gray-300 group-hover:text-white'}`}>
                  {d}
                </span>
                {dayEvents.length > 0 && <span className="text-[9px] font-extrabold text-gray-500">{dayEvents.length} ev</span>}
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {dayEvents.slice(0, 3).map(ev => (
                  <div 
                    key={ev.id} 
                    onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                    className="text-[10px] px-2 py-1 rounded-md cursor-pointer truncate font-bold border border-transparent hover:border-white/30 transition-all shadow-sm flex items-center gap-1"
                    style={{ backgroundColor: eventTypes[ev.type]?.bg || '#3b82f630', color: eventTypes[ev.type]?.color || '#3b82f6' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: eventTypes[ev.type]?.color || '#3b82f6' }} />
                    <span className="truncate">{ev.time} - {ev.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[9px] text-neon-blue font-black px-1 hover:underline">+ {dayEvents.length - 3} more schedule blocks</div>
                )}
              </div>
            </div>
          );
        })}
        {Array.from({ length: Math.max(0, 35 - (days.length + blanks.length)) }).map((_, i) => (
          <div key={`fill-${i}`} className="border-r border-b border-gray-800/40 p-1 min-h-[100px] bg-black/30" />
        ))}
      </div>
    </div>
  );

  const renderDayView = () => {
    const hours = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
    const todayEvents = events.filter(e => e.date === currentDate.getDate());

    return (
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 flex flex-col overflow-y-auto custom-scrollbar shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Day Grid: {monthNames[currentMonth]} {currentDate.getDate()}, {currentYear}</h3>
          <span className="text-xs text-neon-green font-bold">● {todayEvents.length} Appointments Scheduled</span>
        </div>
        <div className="space-y-3">
          {hours.map(hr => {
            const hrEvents = todayEvents.filter(e => e.time.startsWith(hr.slice(0, 2)));
            return (
              <div key={hr} className="flex gap-4 p-3 bg-gray-950/60 rounded-2xl border border-gray-800/80 items-start hover:border-gray-700 transition-colors">
                <div className="w-20 font-mono text-xs font-black text-gray-400 pt-1 shrink-0">{hr}</div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hrEvents.length === 0 ? (
                    <div onClick={() => setShowAdd(true)} className="text-xs text-gray-600 italic py-1 cursor-pointer hover:text-gray-400 transition-colors">+ Click to book appointment in this slot</div>
                  ) : (
                    hrEvents.map(ev => (
                      <div 
                        key={ev.id} 
                        onClick={() => setSelectedEvent(ev)}
                        className="p-3 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all shadow-md flex items-center justify-between"
                        style={{ backgroundColor: eventTypes[ev.type]?.bg || '#3b82f630', borderColor: `${eventTypes[ev.type]?.color || '#3b82f6'}50` }}
                      >
                        <div>
                          <div className="font-extrabold text-xs text-white flex items-center gap-1.5">
                            {ev.title}
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/30 text-white font-black">{ev.type}</span>
                          </div>
                          <div className="text-[11px] text-gray-300 mt-0.5">Agent: {ev.agent} • {ev.duration}</div>
                        </div>
                        <ChevronRight size={16} className="text-white/60" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4">Week Overview ({monthNames[currentMonth]} {currentYear})</h3>
        <div className="grid grid-cols-7 gap-3 flex-1 overflow-y-auto custom-scrollbar">
          {weekDays.map((wd, idx) => {
            const dayNum = idx + 18; // Demo week centered around May 20
            const dayEvts = events.filter(e => e.date === dayNum);
            return (
              <div key={wd} className="bg-gray-950/70 border border-gray-800/80 rounded-2xl p-3 flex flex-col gap-2">
                <div className="text-center pb-2 border-b border-gray-800">
                  <div className="text-[10px] font-black text-gray-400 uppercase">{wd}</div>
                  <div className={`text-sm font-extrabold mt-0.5 ${dayNum === 20 ? 'text-neon-blue font-black' : 'text-white'}`}>{dayNum}</div>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                  {dayEvts.map(ev => (
                    <div 
                      key={ev.id} 
                      onClick={() => setSelectedEvent(ev)}
                      className="p-2 rounded-lg text-[10px] font-bold cursor-pointer border transition-transform hover:scale-105"
                      style={{ backgroundColor: eventTypes[ev.type]?.bg || '#3b82f630', borderColor: eventTypes[ev.type]?.color || '#3b82f6', color: '#fff' }}
                    >
                      <div className="truncate">{ev.time}</div>
                      <div className="truncate font-black">{ev.title}</div>
                    </div>
                  ))}
                  {dayEvts.length === 0 && <div className="text-[9px] text-gray-600 text-center py-4">No events</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-10 h-[calc(100vh-80px)] flex flex-col">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <CalendarIcon size={20} className="text-neon-blue" />
            </div>
            {user?.role === 'AGENT' ? 'My Follow-up Schedule & Reminders' : 'VIP CRM Schedule & Appointments'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {user?.role === 'AGENT' ? 'Track your scheduled follow-up calls with assigned Leads, Creators, and VIP Fans.' : 'Manage creator consultations, audits, and internal executive meetings.'}
          </p>
        </motion.div>
        
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {user?.role !== 'AGENT' && (
            <button onClick={() => navigate(getAppPath('/appointments'))} className="px-3.5 py-2 bg-gray-950 hover:bg-gray-900 text-gray-300 border border-gray-800 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm">
              <ExternalLink size={14} className="text-neon-blue"/> Daily Appointment Desk
            </button>
          )}
          {/* View Switcher */}
          <div className="flex bg-gray-950 rounded-xl p-1 border border-gray-800 shrink-0 shadow-inner">
            {['Day', 'Week', 'Month'].map(v => (
              <button 
                key={v} 
                onClick={() => { setView(v); addToast('info', `${v} View Active`, `Switched schedule view to ${v}.`); }}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${view === v ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
              >
                {v}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-extrabold transition-all ${showFilter ? 'bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-gray-800 bg-gray-900 text-gray-300 hover:text-white hover:border-gray-700'}`}
          >
            <Filter size={14} className={showFilter ? 'text-neon-purple' : ''} /> Filters {(typeFilter !== 'All' || agentFilter !== 'All') && <span className="w-2 h-2 rounded-full bg-neon-purple animate-ping" />}
          </button>
          
          {user?.role === 'AGENT' ? (
            <button 
              onClick={() => navigate(getAppPath('/leads'))} 
              className="bg-neon-green text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:bg-emerald-400 transition-all flex items-center gap-2 shrink-0 group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Schedule Follow-up
            </button>
          ) : (user?.role === 'SUPERVISOR' || user?.role === 'TENANT_OWNER') ? null : (
            <button 
              onClick={() => setShowAdd(true)} 
              className="bg-neon-blue text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan-400 transition-all flex items-center gap-2 shrink-0 group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" /> New Appointment
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar Expandable Panel */}
      <AnimatePresence>
        {showFilter && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden shrink-0">
            <div className="bg-gray-950/90 border border-gray-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-gray-400">Event Type:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {['All', 'VIP', 'Meeting', 'Call', 'Task', 'In-Person', 'Studio'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${typeFilter === t ? 'bg-white text-black font-black shadow' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-px h-6 bg-gray-800 hidden sm:block" />

                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-gray-400">Assigned Agent:</span>
                  <select 
                    value={agentFilter} 
                    onChange={e => setAgentFilter(e.target.value)}
                    className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-1 text-xs font-bold text-white focus:outline-none focus:border-neon-blue"
                  >
                    <option value="All">All Agents (Team View)</option>
                    <option value="Priya Sharma">Priya Sharma</option>
                    <option value="Mike Agent">Mike Agent</option>
                    <option value="Sarah Jenkins">Sarah Jenkins</option>
                  </select>
                </div>
              </div>

              {(typeFilter !== 'All' || agentFilter !== 'All') && (
                <button 
                  onClick={() => { setTypeFilter('All'); setAgentFilter('All'); addToast('info', 'Filters Cleared', 'Showing all appointments.'); }}
                  className="text-xs font-bold text-red-400 hover:underline flex items-center gap-1"
                >
                  <X size={12} /> Reset Filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 min-h-0">
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Navigation Bar */}
          <div className="bg-gray-900/60 border border-gray-800 p-3.5 mb-4 shrink-0 flex items-center justify-between rounded-2xl backdrop-blur-md shadow-md">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-black text-white tracking-wide">{monthNames[currentMonth]} {currentYear}</h3>
              <div className="flex gap-1.5">
                <button onClick={handlePrevMonth} className="p-1.5 text-gray-300 hover:text-white transition-all bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 shadow-sm"><ChevronLeft size={16}/></button>
                <button onClick={handleNextMonth} className="p-1.5 text-gray-300 hover:text-white transition-all bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 shadow-sm"><ChevronRight size={16}/></button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">Showing <strong className="text-white">{events.length}</strong> scheduled events</span>
              <button onClick={handleToday} className="text-xs font-black bg-neon-blue/10 text-neon-blue border border-neon-blue/30 px-3.5 py-1.5 rounded-xl hover:bg-neon-blue hover:text-black transition-all shadow-sm">Jump to Today</button>
            </div>
          </div>
          
          {view === 'Month' ? renderMonthGrid() : view === 'Day' ? renderDayView() : renderWeekView()}
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col gap-4 min-h-0 overflow-y-auto custom-scrollbar">
          
          {/* Mini Calendar */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 shrink-0 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black text-white uppercase tracking-wider">{monthNames[currentMonth]} {currentYear}</span>
              <div className="flex gap-1.5">
                <button onClick={handlePrevMonth} className="text-gray-400 hover:text-white p-1 bg-gray-800 rounded-lg"><ChevronLeft size={12}/></button>
                <button onClick={handleNextMonth} className="text-gray-400 hover:text-white p-1 bg-gray-800 rounded-lg"><ChevronRight size={12}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-500 mb-2">
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {blanks.map((_, i) => <div key={`mini-blank-${i}`} />)}
              {days.map(d => {
                const hasEvent = events.some(e => e.date === d);
                const isSelectedToday = d === 20 && currentMonth === 4;
                return (
                  <div 
                    key={d} 
                    onClick={() => {
                      const dayEvs = events.filter(e => e.date === d);
                      if (dayEvs.length > 0) setSelectedEvent(dayEvs[0]);
                      else {
                        addToast('info', `Selected ${monthNames[currentMonth]} ${d}`, 'No appointments on this date.');
                      }
                    }}
                    className={`p-1.5 rounded-lg cursor-pointer transition-all relative font-bold ${isSelectedToday ? 'bg-neon-blue text-black font-black shadow' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    {d}
                    {hasEvent && <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelectedToday ? 'bg-black' : 'bg-neon-green'}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Schedule Highlights */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-5 flex-1 flex flex-col min-h-0 shadow-lg">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-neon-purple" /> Upcoming Appointments
              </h4>
              <span className="text-[10px] text-neon-green font-bold">● Active Sync</span>
            </div>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1">
              {events.slice(0, 5).map(ev => (
                <div 
                  key={ev.id} 
                  onClick={() => setSelectedEvent(ev)}
                  className="p-3 bg-gray-950/80 rounded-2xl border border-gray-800/80 hover:border-gray-700 cursor-pointer transition-all hover:translate-x-1 group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-mono text-neon-blue font-bold">{monthNames[currentMonth].slice(0,3)} {ev.date} • {ev.time}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider" style={{ backgroundColor: eventTypes[ev.type]?.bg, color: eventTypes[ev.type]?.color }}>{ev.type}</span>
                  </div>
                  <div className="text-xs font-extrabold text-white group-hover:text-neon-blue transition-colors truncate">{ev.title}</div>
                  <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-between">
                    <span>Host: {ev.agent}</span>
                    <span className="text-gray-500 font-mono">{ev.duration}</span>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-xs italic">No upcoming events found for this filter.</div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-gray-950 border border-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl text-left space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider" style={{ backgroundColor: eventTypes[selectedEvent.type]?.bg, color: eventTypes[selectedEvent.type]?.color }}>
                    {selectedEvent.type} Consultation
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID #{selectedEvent.id}</span>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="p-1.5 text-gray-400 hover:text-white bg-gray-900 rounded-full"><X size={16} /></button>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">{selectedEvent.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{selectedEvent.desc}</p>
              </div>

              <div className="bg-gray-900/60 p-4 rounded-2xl border border-gray-800/80 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Date & Time</span>
                  <span className="font-extrabold text-white mt-0.5 block">{monthNames[currentMonth]} {selectedEvent.date}, {currentYear} • {selectedEvent.time}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Duration</span>
                  <span className="font-extrabold text-neon-green mt-0.5 block">{selectedEvent.duration} Block</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Assigned Host</span>
                  <span className="font-extrabold text-gray-200 mt-0.5 block">{selectedEvent.agent}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold uppercase text-[9px] block">Conference Room</span>
                  <span className="font-extrabold text-neon-blue mt-0.5 block">PGX Secure Video #88</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Attendees ({selectedEvent.attendees?.length || 1})</span>
                <div className="flex items-center gap-2">
                  {selectedEvent.attendees?.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800">
                      <img src={att.img || 'https://i.pravatar.cc/150?img=1'} className="w-5 h-5 rounded-full object-cover" alt="" />
                      <span className="text-xs font-bold text-white">{att.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => {
                    addToast('success', 'Joined Conference Room', `Launching video consultation for ${selectedEvent.title}`);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 py-3 bg-neon-blue text-black font-black text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center gap-2"
                >
                  <Video size={16} /> Enter Video Room
                </button>
                <button 
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl border border-red-500/30 transition-all"
                >
                  Cancel Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <ActionModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onConfirm={handleAddEvent}
        title="Schedule New CRM Appointment"
        confirmText="Book Appointment"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Appointment Title</label>
            <input name="title" required placeholder="e.g. VIP Creator Revenue Review" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Date</label>
              <input name="date" type="date" defaultValue={`2025-05-20`} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Time</label>
              <select name="time" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue">
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:30 AM</option>
                <option>02:00 PM</option>
                <option>04:30 PM</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Event Type</label>
              <select name="type" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue">
                <option value="VIP">VIP Consultation</option>
                <option value="Meeting">Team Meeting</option>
                <option value="Call">Phone Sync</option>
                <option value="Task">Audit Task</option>
                <option value="In-Person">Offline Office Visit</option>
                <option value="Studio">Live Studio Recording</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">Duration</label>
              <select name="duration" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue">
                <option value="30m">30 Minutes</option>
                <option value="45m">45 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="1h 30m">1.5 Hours</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 block mb-1">Agenda / Notes</label>
            <textarea name="desc" rows={2} placeholder="Brief outline of topics to cover..." className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
        </div>
      </ActionModal>

    </div>
  );
}
