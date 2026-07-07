// src/dashboards/ReceptionistDashboard.jsx
// Enterprise Front Desk Operations Center — complete rebuild
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, UserCheck, Phone, PhoneCall, PhoneMissed,
  Calendar, CalendarPlus, Clock, CheckCircle2, AlertTriangle,
  MessageSquare, Mail, Star, Activity, Printer, List,
  Search, Filter, ChevronRight, Bell, BellRing,
  Package, ArrowUpRight, ArrowDownRight, X, Eye,
  CheckSquare, TrendingUp, RefreshCw, Zap, Shield, ClipboardList
} from 'lucide-react';
import { useTenantData } from '../contexts/DataContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import QuickAccessPanel from '../components/dashboard/QuickAccessPanel';
import { exportCSV } from '../utils/csvExport';
import { useToast } from '../contexts/ToastContext';
import NewBookingModal from '../components/modals/NewBookingModal';
import { getAppPath } from '../utils/routing';

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  VIP:    { bg:'#ffd70015', text:'#ffd700', border:'#ffd70030', dot:'#ffd700' },
  High:   { bg:'#ef444415', text:'#f87171', border:'#ef444430', dot:'#f87171' },
  Normal: { bg:'#3b82f615', text:'#60a5fa', border:'#3b82f630', dot:'#60a5fa' },
  Low:    { bg:'#6b728015', text:'#9ca3af', border:'#6b728030', dot:'#9ca3af' },
};
const STATUS_STYLE = {
  'Waiting':     { bg:'#f59e0b15', text:'#fbbf24', border:'#f59e0b30', dot:'#f59e0b' },
  'Checked In':  { bg:'#10b98115', text:'#34d399', border:'#10b98130', dot:'#34d399' },
  'Checked Out': { bg:'#6b728015', text:'#9ca3af', border:'#6b728030', dot:'#9ca3af' },
  'Scheduled':   { bg:'#3b82f615', text:'#60a5fa', border:'#3b82f630', dot:'#60a5fa' },
};
const APPT_STATUS = {
  'Upcoming':    { bg:'#3b82f615', text:'#60a5fa', border:'#3b82f630', dot:'#3b82f6' },
  'In Progress': { bg:'#10b98115', text:'#34d399', border:'#10b98130', dot:'#10b981' },
  'Completed':   { bg:'#6b728015', text:'#9ca3af', border:'#6b728030', dot:'#9ca3af' },
  'Cancelled':   { bg:'#ef444415', text:'#f87171', border:'#ef444430', dot:'#ef4444' },
};
const CALL_STYLE = {
  'Missed':    { bg:'#ef444415', text:'#f87171', border:'#ef444430' },
  'Connected': { bg:'#10b98115', text:'#34d399', border:'#10b98130' },
  'Voicemail': { bg:'#f59e0b15', text:'#fbbf24', border:'#f59e0b30' },
};
const TASK_STYLE = {
  'Pending':     { bg:'#f59e0b15', text:'#fbbf24', dot:'#f59e0b' },
  'In Progress': { bg:'#3b82f615', text:'#60a5fa', dot:'#3b82f6' },
  'Done':        { bg:'#10b98115', text:'#34d399', dot:'#10b981' },
  'Completed':   { bg:'#6b728015', text:'#9ca3af', dot:'#9ca3af' },
};
const NOTIF_ICON = {
  vip:    { icon: Star,           color:'#ffd700' },
  call:   { icon: PhoneMissed,    color:'#ef4444' },
  appt:   { icon: Calendar,       color:'#3b82f6' },
  queue:  { icon: Users,          color:'#f59e0b' },
  message:{ icon: MessageSquare,  color:'#8a2be2' },
  done:   { icon: CheckCircle2,   color:'#10b981' },
};
const CHART_COLORS = ['#3b82f6', '#10b981', '#8a2be2', '#f59e0b', '#ec4899'];
const APPT_PIE = [
  { name:'Completed', value:2, color:'#9ca3af' },
  { name:'In Progress',value:2, color:'#10b981' },
  { name:'Upcoming',  value:4, color:'#3b82f6' },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
const KPICard = ({ title, value, sub, trend, pct, icon: Icon, color, delay }) => (
  <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 relative overflow-hidden group">
    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
      style={{ backgroundColor: color }} />
    <div className="flex justify-between items-start mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor:`${color}18`, border:`1px solid ${color}30`, color }}>
        <Icon size={18} />
      </div>
      {pct && (
        <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend==='up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend==='up' ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {pct}
        </div>
      )}
    </div>
    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{title}</div>
    <div className="text-2xl font-black text-white mt-0.5">{value}</div>
    {sub && <div className="text-[10px] text-gray-500 mt-1">{sub}</div>}
  </motion.div>
);

const Badge = ({ label, styleMap }) => {
  const s = styleMap[label] || styleMap['Normal'] || {};
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap"
      style={{ backgroundColor:s.bg, color:s.text, borderColor:s.border }}>
      {s.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:s.dot }} />}
      {label}
    </span>
  );
};

const SectionCard = ({ title, icon: Icon, color='#3b82f6', action, children }) => (
  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
    <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-800 bg-gray-950/60 shrink-0">
      <h2 className="font-black text-white text-sm flex items-center gap-2">
        <Icon size={15} style={{ color }} /> {title}
      </h2>
      {action}
    </div>
    {children}
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function ReceptionistDashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Data
  const [visitors,   { updateItem: updVis }]  = useTenantData('visitors');
  const [appts]                               = useTenantData('receptionAppointments');
  const [calls]                               = useTenantData('receptionCalls');
  const [tasks,      { updateItem: updTask }] = useTenantData('receptionTasks');
  const [messages,   { updateItem: updMsg }]  = useTenantData('receptionMessages');
  const [notifs,     { updateItem: updNotif}] = useTenantData('receptionNotifications');
  const [activity]                            = useTenantData('receptionActivity');
  const [hourly]                              = useTenantData('receptionHourly');

  // Local UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [visQ, setVisQ]               = useState('');
  const [visStatus, setVisStatus]     = useState('All');
  const [visDetail, setVisDetail]     = useState(null);
  const [calledNext, setCalledNext]   = useState([]);
  const [checkedIn, setCheckedIn]     = useState([]);
  const [checkedOut, setCheckedOut]   = useState([]);
  const [activeTab, setActiveTab]     = useState('queue'); // queue | visitors | messages | activity
  const [taskFilter, setTaskFilter]   = useState('All');
  const [msgFilter, setMsgFilter]     = useState('All');

  // Derived stats
  const waitingList = useMemo(() => (visitors||[]).filter(v => v.status==='Waiting'), [visitors]);
  const checkedInList= useMemo(() => (visitors||[]).filter(v => v.status==='Checked In'), [visitors]);
  const scheduledAppts = useMemo(() => (appts||[]).filter(a => a.status==='Upcoming' || a.status==='In Progress'), [appts]);
  const missedCalls = useMemo(() => (calls||[]).filter(c => c.status==='Missed'), [calls]);
  const pendingTasks= useMemo(() => (tasks||[]).filter(t => t.status==='Pending' || t.status==='In Progress'), [tasks]);
  const unreadMsgs  = useMemo(() => (messages||[]).filter(m => !m.read), [messages]);
  const unreadNotifs= useMemo(() => (notifs||[]).filter(n => !n.read), [notifs]);

  // Filtered visitors table
  const filteredVis = useMemo(() => (visitors||[]).filter(v =>
    (!visQ || v.name.toLowerCase().includes(visQ.toLowerCase()) || v.company.toLowerCase().includes(visQ.toLowerCase())) &&
    (visStatus==='All' || v.status===visStatus)
  ), [visitors, visQ, visStatus]);

  // Filtered tasks
  const filteredTasks = useMemo(() => (tasks||[]).filter(t =>
    taskFilter==='All' || t.status===taskFilter
  ), [tasks, taskFilter]);

  // Filtered messages
  const filteredMsgs = useMemo(() => (messages||[]).filter(m =>
    msgFilter==='All' || m.channel===msgFilter
  ), [messages, msgFilter]);

  // Actions
  const handleCallNext = (id) => setCalledNext(p => [...p, id]);
  const handleCheckIn  = (id) => { setCheckedIn(p=>[...p,id]); updVis(id, { status:'Checked In' }); };
  const handleCheckOut = (id) => { setCheckedOut(p=>[...p,id]); updVis(id, { status:'Checked Out', timeOut: new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) }); };
  const handlePrint    = (v)  => addToast('info', 'Print Pass', `🖨 Printing visitor pass for: ${v.name}`);
  const handleTaskDone = (id) => updTask(id, { status:'Done' });
  const handleReadMsg  = (id) => updMsg(id, { read: true });
  const handleReadNotif= (id) => updNotif(id, { read: true });

  return (
    <div className="flex flex-col gap-5 pb-10 overflow-y-auto h-full custom-scrollbar pr-1">

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Shield size={22} className="text-neon-purple" /> Front Desk Operations Center
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Real-time visitor management, appointments, calls, and front desk tasks.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportCSV(visitors||[], `visitors_${new Date().toISOString().slice(0,10)}.csv`, ['id','name','company','type','status','priority','timeIn','timeOut','badge','host','purpose'])}
            className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2">
            <ArrowDownRight size={15} /> Export Visitors
          </button>
          <button onClick={() => navigate(getAppPath('/appointments'))}
            className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-bold text-white transition-colors flex items-center gap-2">
            <UserCheck size={15} /> Check-In Visitor
          </button>
          <button onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-neon-purple hover:bg-neon-purple/90 text-white rounded-lg text-sm font-black transition-colors flex items-center gap-2">
            <CalendarPlus size={15} /> Schedule Appointment
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ──────────────────────────────────────────────────── */}
      <div className="kpi-grid-auto shrink-0">
        <KPICard title="Visitors Today" value={(visitors||[]).length} sub="All types combined"   pct="+3"   trend="up"   icon={Users}       color="#3b82f6" delay={0.05}/>
        <KPICard title="Walk-Ins"       value={(visitors||[]).filter(v=>v.type==='Walk-In').length} sub="Unscheduled" pct="+1" trend="up" icon={UserPlus} color="#10b981" delay={0.07}/>
        <KPICard title="Appointments"   value={(appts||[]).length}     sub="Scheduled today"    pct="+2"   trend="up"   icon={Calendar}    color="#8a2be2" delay={0.09}/>
        <KPICard title="Checked In"     value={checkedInList.length}   sub="Currently on-site"  pct="+1"   trend="up"   icon={UserCheck}   color="#10b981" delay={0.11}/>
        <KPICard title="Waiting"        value={waitingList.length}      sub="In queue now"       pct={null} trend="down" icon={Clock}        color="#f59e0b" delay={0.13}/>
        <KPICard title="Missed Calls"   value={missedCalls.length}      sub="Needs follow-up"    pct="-1"   trend="down" icon={PhoneMissed}  color="#ef4444" delay={0.15}/>
        <KPICard title="Pending Tasks"  value={pendingTasks.length}     sub="Today's duties"     pct="-2"   trend="down" icon={ClipboardList} color="#a855f7" delay={0.17}/>
        <KPICard title="Unread Messages"value={unreadMsgs.length}       sub="WhatsApp, SMS, Email"pct={null} trend="up"  icon={MessageSquare} color="#ec4899" delay={0.19}/>
      </div>

      {/* ── QUICK ACCESS ────────────────────────────────────────────────── */}
      <QuickAccessPanel title="Reception Quick Access" cards={[
        { icon: UserPlus,     title:'Register Walk-In',     description:'Log a new walk-in visitor to the queue',  color:'#3b82f6', onClick:()=>navigate(getAppPath('/walk-ins')) },
        { icon: CalendarPlus, title:'Schedule Appointment', description:'Open booking form to schedule a session',   color:'#8a2be2', onClick:()=>setShowAddModal(true) },
        { icon: UserCheck,    title:'Check-In Visitor',     description:'Mark a scheduled visitor as arrived',       color:'#10b981', onClick:()=>navigate(getAppPath('/appointments')) },
        { icon: Printer,      title:'Print Visitor Pass',   description:'Print badge for a checked-in visitor',      color:'#f97316', onClick:()=>addToast('info', 'Print Pass', 'Select a visitor from the queue below to print their pass') },
        { icon: Phone,        title:'Call Next in Queue',   description:`${waitingList.length} people waiting`,      color:'#ec4899', onClick:()=>{ const next=waitingList[0]; if(next) handleCallNext(next.id); else addToast('warning', 'Queue Empty', 'No one is waiting'); }},
        { icon: MessageSquare,title:'SMS / WhatsApp',       description:`${unreadMsgs.length} unread messages`,      color:'#a855f7', onClick:()=>navigate(getAppPath('/reception-messages')) },
        { icon: List,         title:'View Waiting Queue',   description:`See all ${waitingList.length} waiting`,     color:'#f59e0b', onClick:()=>setActiveTab('queue') },
        { icon: Shield,       title:'Emergency Contact',    description:'Call building security or emergency',       color:'#ef4444', onClick:()=>addToast('error', 'Emergency', 'Emergency: 911 | Building Security: ext. 0') },
      ]} />

      {/* ── MAIN GRID ROW 1: Charts + Appointment Timeline ─────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Hourly Traffic Chart */}
        <div className="col-span-12 lg:col-span-5 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-white text-sm flex items-center gap-2">
              <Activity size={15} className="text-neon-blue" /> Hourly Traffic
            </h2>
            <span className="text-[10px] text-gray-500">Visitors · Calls · Appointments</span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourly||[]} barSize={8} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false}/>
                <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false}/>
                <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} width={20}/>
                <Tooltip contentStyle={{ backgroundColor:'#111827', border:'1px solid #374151', borderRadius:'8px', fontSize:11 }}/>
                <Bar dataKey="visitors"     name="Visitors"     fill="#3b82f6" radius={[3,3,0,0]} fillOpacity={0.85}/>
                <Bar dataKey="calls"        name="Calls"        fill="#ec4899" radius={[3,3,0,0]} fillOpacity={0.85}/>
                <Bar dataKey="appointments" name="Appointments" fill="#8a2be2" radius={[3,3,0,0]} fillOpacity={0.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            {[['Visitors','#3b82f6'],['Calls','#ec4899'],['Appointments','#8a2be2']].map(([l,c])=>(
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:c}}/>
                <span className="text-[10px] text-gray-400">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Status Donut */}
        <div className="col-span-12 lg:col-span-3 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-5">
          <h2 className="font-black text-white text-sm flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-neon-purple"/> Appointment Status
          </h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={APPT_PIE} cx="50%" cy="50%" innerRadius={48} outerRadius={70}
                  dataKey="value" paddingAngle={3} strokeWidth={0}>
                  {APPT_PIE.map((entry,i) => <Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor:'#111827', border:'1px solid #374151', borderRadius:'8px', fontSize:11 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-1">
            {APPT_PIE.map(e=>(
              <div key={e.name} className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor:e.color}}/>
                  <span className="text-[10px] text-gray-400">{e.name}</span>
                </div>
                <span className="text-xs font-bold text-white">{e.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Timeline */}
        <div className="col-span-12 lg:col-span-4 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-800 bg-gray-950/60 flex justify-between items-center shrink-0">
            <h2 className="font-black text-white text-sm flex items-center gap-2">
              <Clock size={15} className="text-neon-blue"/> Today's Timeline
            </h2>
            <button onClick={()=>navigate(getAppPath('/appointments'))} className="text-[10px] font-bold text-neon-blue hover:underline">All →</button>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar">
            {(appts||[]).map((a, i) => {
              const s = APPT_STATUS[a.status] || APPT_STATUS['Upcoming'];
              return (
                <div key={a.id} className={`flex gap-3 px-4 py-3 border-b border-gray-800/50 hover:bg-white/5 transition-colors group ${a.status==='In Progress'?'bg-neon-blue/5':''}`}>
                  <div className="flex flex-col items-center shrink-0 w-14 pt-0.5">
                    <span className="text-[10px] font-bold text-white">{a.time}</span>
                    <div className="w-0.5 flex-1 bg-gray-800 mt-1"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-xs font-bold text-white truncate">{a.visitorName}</span>
                      <Badge label={a.status} styleMap={APPT_STATUS}/>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{a.type} · {a.dept}</div>
                    <div className="text-[10px] text-gray-600 mt-0.5">{a.meetingRoom} · {a.host}</div>
                    {a.notes && <div className="text-[10px] text-amber-400/70 mt-0.5 italic">⚠ {a.notes}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MAIN TABBED PANEL ────────────────────────────────────────────── */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden">

        {/* Tabs */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 shrink-0">
          {[
            { id:'queue',    label:'Waiting Queue',    icon:Users,        badge:waitingList.length },
            { id:'visitors', label:'Visitor Log',      icon:ClipboardList,badge:null },
            { id:'messages', label:'Messages',         icon:MessageSquare,badge:unreadMsgs.length },
            { id:'activity', label:'Activity Timeline',icon:Activity,     badge:null },
          ].map(tab => (
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-bold border-b-2 transition-all ${activeTab===tab.id ? 'border-neon-blue text-white bg-neon-blue/5' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
              <tab.icon size={13}/> {tab.label}
              {tab.badge > 0 && (
                <span className="ml-1 bg-neon-blue text-gray-950 text-[9px] font-black px-1.5 py-0.5 rounded-full">{tab.badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: Waiting Queue ── */}
        {activeTab==='queue' && (
          <div className="overflow-auto" style={{ maxHeight:'380px' }}>
            <table className="w-full min-w-[700px]">
              <thead className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800">
                <tr>
                  {['Visitor','Company','Type','Priority','Time In','Waiting Since','Host','Status','Actions'].map(h=>(
                    <th key={h} className="table-th text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {waitingList.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-500 text-sm">No visitors currently waiting.</td></tr>
                )}
                {waitingList.map((v, i) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{v.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{v.purpose}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300">{v.company}</td>
                    <td className="px-4 py-3"><Badge label={v.type} styleMap={PRIORITY_STYLE}/></td>
                    <td className="px-4 py-3"><Badge label={v.priority} styleMap={PRIORITY_STYLE}/></td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-300">{v.timeIn||'—'}</td>
                    <td className="px-4 py-3 text-xs text-amber-400 font-bold">
                      {v.timeIn ? `~${Math.floor(Math.random()*20)+5} min` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300">{v.host}</td>
                    <td className="px-4 py-3"><Badge label={v.status} styleMap={STATUS_STYLE}/></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        {!calledNext.includes(v.id)
                          ? <button onClick={()=>handleCallNext(v.id)} className="px-2.5 py-1 text-[10px] font-bold bg-neon-green/10 text-neon-green border border-neon-green/30 rounded hover:bg-neon-green/20 transition-colors whitespace-nowrap">Call Next</button>
                          : <span className="px-2.5 py-1 text-[10px] font-bold bg-gray-800 text-gray-400 rounded whitespace-nowrap">Called ✓</span>
                        }
                        {!checkedIn.includes(v.id)
                          ? <button onClick={()=>handleCheckIn(v.id)} className="px-2.5 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/20 transition-colors whitespace-nowrap">Check In</button>
                          : <span className="px-2.5 py-1 text-[10px] bg-gray-800 text-gray-400 rounded whitespace-nowrap">Checked In ✓</span>
                        }
                        <button onClick={()=>handlePrint(v)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded transition-colors" title="Print pass"><Printer size={12}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB: Visitor Log ── */}
        {activeTab==='visitors' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950/40 shrink-0">
              <div className="relative flex-1 min-w-[180px]">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                <input value={visQ} onChange={e=>setVisQ(e.target.value)} placeholder="Search by name or company..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-600 focus:border-neon-blue focus:outline-none"/>
              </div>
              <div className="flex gap-1">
                {['All','Waiting','Checked In','Checked Out','Scheduled'].map(s=>(
                  <button key={s} onClick={()=>setVisStatus(s)}
                    className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors whitespace-nowrap ${visStatus===s?'bg-neon-blue/20 text-neon-blue border border-neon-blue/40':'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={()=>exportCSV(filteredVis,'visitors.csv',['id','name','company','type','status','priority','timeIn','timeOut','badge','host','purpose'])}
                className="px-3 py-1.5 bg-gray-900 border border-gray-700 text-xs text-white font-bold rounded-lg hover:border-gray-500 transition-colors flex items-center gap-1">
                <ArrowDownRight size={12}/> Export
              </button>
            </div>
            {/* Table */}
            <div className="overflow-auto" style={{ maxHeight:'340px' }}>
              <table className="w-full min-w-[900px]">
                <thead className="sticky top-0 z-10 bg-gray-950 border-b border-gray-800">
                  <tr>
                    {['Visitor','Company','Contact','Type','Priority','Host','Check-In','Check-Out','Badge','Status','Actions'].map(h=>(
                      <th key={h} className="table-th text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredVis.length===0 && (
                    <tr><td colSpan={11} className="px-4 py-10 text-center text-gray-500">No visitors match filters.</td></tr>
                  )}
                  {filteredVis.map(v => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          {v.priority==='VIP' && <Star size={11} className="text-yellow-500"/>} {v.name}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{v.purpose}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300">{v.company}</td>
                      <td className="px-4 py-3 text-[11px] text-gray-400 font-mono">{v.contact}</td>
                      <td className="px-4 py-3"><Badge label={v.type} styleMap={STATUS_STYLE}/></td>
                      <td className="px-4 py-3"><Badge label={v.priority} styleMap={PRIORITY_STYLE}/></td>
                      <td className="px-4 py-3 text-xs text-gray-300">{v.host}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-300">{v.timeIn||'—'}</td>
                      <td className="px-4 py-3 text-xs font-mono text-gray-500">{v.timeOut||'—'}</td>
                      <td className="px-4 py-3 text-[11px] font-mono text-neon-blue">{v.badge||'—'}</td>
                      <td className="px-4 py-3"><Badge label={v.status} styleMap={STATUS_STYLE}/></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {v.status==='Waiting' && <button onClick={()=>handleCheckIn(v.id)} className="px-2 py-1 text-[10px] font-bold bg-neon-green/10 text-neon-green border border-neon-green/30 rounded hover:bg-neon-green/20">Check In</button>}
                          {v.status==='Checked In' && <button onClick={()=>handleCheckOut(v.id)} className="px-2 py-1 text-[10px] font-bold bg-gray-800 text-gray-300 border border-gray-700 rounded hover:bg-gray-700">Check Out</button>}
                          <button onClick={()=>handlePrint(v)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded" title="Print pass"><Printer size={12}/></button>
                          <button onClick={()=>setVisDetail(v)} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded" title="View details"><Eye size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 border-t border-gray-800 text-[10px] text-gray-500 shrink-0">
              Showing <b className="text-white">{filteredVis.length}</b> of <b className="text-white">{(visitors||[]).length}</b> visitors
            </div>
          </>
        )}

        {/* ── TAB: Messages ── */}
        {activeTab==='messages' && (
          <>
            <div className="flex gap-1 px-4 py-3 border-b border-gray-800 bg-gray-950/40 shrink-0">
              {['All','WhatsApp','SMS','Email'].map(ch=>(
                <button key={ch} onClick={()=>setMsgFilter(ch)}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-colors ${msgFilter===ch?'bg-neon-purple/20 text-neon-purple border border-neon-purple/40':'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white'}`}>
                  {ch}
                </button>
              ))}
            </div>
            <div className="overflow-y-auto flex-1 custom-scrollbar" style={{ maxHeight:'320px' }}>
              {filteredMsgs.map(m => (
                <div key={m.id} onClick={()=>handleReadMsg(m.id)}
                  className={`flex gap-3 px-4 py-4 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors ${!m.read?'bg-neon-purple/5 border-l-2 border-l-neon-purple':''}`}>
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: m.channel==='WhatsApp'?'#10b98120':m.channel==='Email'?'#3b82f620':'#f59e0b20',
                             color: m.channel==='WhatsApp'?'#34d399':m.channel==='Email'?'#60a5fa':'#fbbf24' }}>
                    {m.channel==='WhatsApp'?'W':m.channel==='Email'?'@':'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-white truncate">{m.from}</span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${m.channel==='WhatsApp'?'bg-emerald-500/10 text-emerald-400':m.channel==='Email'?'bg-blue-500/10 text-blue-400':'bg-amber-500/10 text-amber-400'}`}>{m.channel}</span>
                        <span className="text-[10px] text-gray-500">{m.time}</span>
                        {!m.read && <div className="w-2 h-2 rounded-full bg-neon-purple"/>}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{m.text}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="text-[10px] px-2 py-1 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded hover:bg-neon-blue/20 font-bold transition-colors">Reply</button>
                      <button className="text-[10px] px-2 py-1 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 font-bold transition-colors">Forward</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── TAB: Activity Timeline ── */}
        {activeTab==='activity' && (
          <div className="overflow-y-auto flex-1 custom-scrollbar p-4" style={{ maxHeight:'340px' }}>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800"/>
              <div className="space-y-0">
                {(activity||[]).map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04 }}
                    className="flex gap-4 pl-1">
                    <div className="relative shrink-0 w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center z-10">
                      {act.icon==='star'    && <Star size={14} className="text-yellow-500"/>}
                      {act.icon==='msg'     && <MessageSquare size={14} className="text-purple-400"/>}
                      {act.icon==='user'    && <UserPlus size={14} className="text-blue-400"/>}
                      {act.icon==='phone'   && <Phone size={14} className="text-pink-400"/>}
                      {act.icon==='check'   && <CheckCircle2 size={14} className="text-emerald-400"/>}
                      {act.icon==='flag'    && <Activity size={14} className="text-orange-400"/>}
                      {act.icon==='pkg'     && <Package size={14} className="text-gray-400"/>}
                      {act.icon==='sun'     && <Zap size={14} className="text-amber-400"/>}
                    </div>
                    <div className="pb-5 flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-bold text-white">{act.action}</span>
                        <span className="text-[10px] font-mono text-gray-500 shrink-0 ml-2">{act.time}</span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{act.detail}</div>
                      <div className="text-[10px] text-gray-600 mt-0.5">by {act.actor}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM ROW: Calls + Tasks + Notifications ────────────────────── */}
      <div className="grid grid-cols-12 gap-4">

        {/* Calls Panel */}
        <div className="col-span-12 lg:col-span-4">
          <SectionCard title="Recent Calls" icon={PhoneCall} color="#ec4899"
            action={<button onClick={()=>navigate(getAppPath('/calls'))} className="text-[10px] font-bold text-neon-blue hover:underline">All Calls →</button>}>
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight:'280px' }}>
              {(calls||[]).map(c => {
                const s = CALL_STYLE[c.status]||CALL_STYLE.Missed;
                return (
                  <div key={c.id} className="flex justify-between items-start px-4 py-3 border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                    <div className="flex gap-3 items-start">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.type==='Incoming'?'bg-blue-500/10 text-blue-400':'bg-gray-800 text-gray-400'}`}>
                        {c.status==='Missed' ? <PhoneMissed size={14}/> : <PhoneCall size={14}/>}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{c.caller}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{c.time} · {c.type}{c.duration?` · ${c.duration}`:''}</div>
                        {c.notes && <div className="text-[10px] text-gray-600 mt-0.5 italic">{c.notes}</div>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold border" style={{backgroundColor:s.bg,color:s.text,borderColor:s.border}}>{c.status}</span>
                      {c.status==='Missed' && (
                        <button onClick={()=>addToast('info', 'Calling', `Calling back: ${c.caller}`)}
                          className="text-[10px] px-2 py-0.5 bg-neon-blue/10 text-neon-blue border border-neon-blue/30 rounded hover:bg-neon-blue/20 font-bold transition-colors whitespace-nowrap">
                          Call Back
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Tasks Panel */}
        <div className="col-span-12 lg:col-span-4">
          <SectionCard title="Reception Tasks" icon={ClipboardList} color="#a855f7"
            action={
              <div className="flex gap-1">
                {['All','Pending','In Progress','Done','Completed'].map(f=>(
                  <button key={f} onClick={()=>setTaskFilter(f)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded transition-colors ${taskFilter===f?'bg-neon-purple/20 text-neon-purple':'text-gray-500 hover:text-gray-300'}`}>
                    {f}
                  </button>
                ))}
              </div>
            }>
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight:'280px' }}>
              {filteredTasks.length===0 && <div className="px-4 py-8 text-center text-gray-500 text-sm">No tasks in this category.</div>}
              {filteredTasks.map(t => {
                const s = TASK_STYLE[t.status]||TASK_STYLE.Pending;
                return (
                  <div key={t.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor:s.dot }}/>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors truncate">{t.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{backgroundColor:s.bg,color:s.text}}>{t.status}</span>
                        <span className="text-[10px] text-gray-600">{t.tag}</span>
                        <span className="text-[10px] text-gray-600">{t.time}</span>
                      </div>
                    </div>
                    {(t.status==='Pending'||t.status==='In Progress') && (
                      <button onClick={()=>handleTaskDone(t.id)}
                        className="shrink-0 text-[10px] px-2.5 py-1 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded hover:bg-neon-green/20 font-bold transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                        Done ✓
                      </button>
                    )}
                    {(t.status==='Done'||t.status==='Completed') && (
                      <CheckSquare size={14} className="text-emerald-500 shrink-0 mt-0.5"/>
                    )}
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Notifications Panel */}
        <div className="col-span-12 lg:col-span-4">
          <SectionCard title="Live Notifications" icon={BellRing} color="#ffd700"
            action={<span className="text-[10px] font-bold text-amber-400">{unreadNotifs.length} unread</span>}>
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight:'280px' }}>
              {(notifs||[]).map(n => {
                const cfg = NOTIF_ICON[n.type]||NOTIF_ICON.done;
                const Icon2 = cfg.icon;
                return (
                  <div key={n.id} onClick={()=>handleReadNotif(n.id)}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-800/50 cursor-pointer hover:bg-white/5 transition-colors ${!n.read?'bg-amber-500/3 border-l-2 border-l-amber-400':''}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor:`${cfg.color}18`, color:cfg.color }}>
                      <Icon2 size={14}/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">{n.title}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className="text-[10px] text-gray-500">{n.time}</span>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-amber-400"/>}
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── VISITOR DETAIL MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {visDetail && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={()=>setVisDetail(null)}>
            <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.95, opacity:0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6"
              onClick={e=>e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    {visDetail.priority==='VIP' && <Star size={16} className="text-yellow-500"/>}
                    {visDetail.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{visDetail.company}</p>
                </div>
                <button onClick={()=>setVisDetail(null)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-400"><X size={16}/></button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ['Contact',    visDetail.contact],
                  ['Purpose',    visDetail.purpose],
                  ['Host',       `${visDetail.host} (${visDetail.hostDept})`],
                  ['Type',       visDetail.type],
                  ['Priority',   visDetail.priority],
                  ['Status',     visDetail.status],
                  ['Check-In',   visDetail.timeIn||'Not yet checked in'],
                  ['Check-Out',  visDetail.timeOut||'Still on-site'],
                  ['Badge #',    visDetail.badge||'Not issued'],
                ].map(([label,val])=>(
                  <div key={label} className="flex justify-between py-1.5 border-b border-gray-800">
                    <span className="text-gray-500 text-xs">{label}</span>
                    <span className="text-white font-bold text-xs text-right">{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-5">
                {visDetail.status==='Waiting' && <button onClick={()=>{handleCheckIn(visDetail.id);setVisDetail(null);}} className="flex-1 py-2 bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-lg text-sm font-bold hover:bg-neon-green/20 transition-colors">Check In</button>}
                {visDetail.status==='Checked In' && <button onClick={()=>{handleCheckOut(visDetail.id);setVisDetail(null);}} className="flex-1 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors">Check Out</button>}
                <button onClick={()=>handlePrint(visDetail)} className="flex-1 py-2 bg-neon-purple/10 text-neon-purple border border-neon-purple/30 rounded-lg text-sm font-bold hover:bg-neon-purple/20 transition-colors flex items-center justify-center gap-2"><Printer size={14}/>Print Pass</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NewBookingModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
