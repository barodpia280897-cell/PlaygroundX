import { motion } from 'framer-motion';
import { Headphones, CheckCircle2, Clock, Calendar as CalendarIcon, Bot, TrendingUp, AlertCircle, Phone, ArrowRight, User } from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis } from 'recharts';
import Badge from '../components/ui/Badge';
import ShiftStatusCard from '../components/dashboard/ShiftStatusCard';
import PriorityLeadsQueue from '../components/dashboard/PriorityLeadsQueue';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { getAppPath } from '../utils/routing';

const productivityData = [
  { day: 'Mon', calls: 24, conversions: 4 },
  { day: 'Tue', calls: 35, conversions: 7 },
  { day: 'Wed', calls: 18, conversions: 2 },
  { day: 'Thu', calls: 42, conversions: 8 },
  { day: 'Fri', calls: 38, conversions: 6 },
  { day: 'Sat', calls: 15, conversions: 1 },
  { day: 'Sun', calls: 0, conversions: 0 },
];

export default function AgentWorkspace() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments] = useDataStore('appointments');

  const myAppointments = (() => {
    const all = appointments || [];
    const forMe = all.filter(a => a.agent === user?.name || a.host === user?.name || (user?.name && (a.agent?.includes(user.name) || a.host?.includes(user.name))));
    return (forMe.length > 0 ? forMe : all).slice(0, 4);
  })();
  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Agent Workspace <Badge text="Online" color="green" />
          </h2>
          <p className="text-sm font-normal text-muted mt-1">Manage your queue, follow-ups, and daily tasks.</p>
        </motion.div>
      </div>

      {/* Shift Readiness Workflow Card */}
      <ShiftStatusCard />

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Headphones size={16} className="text-neon-blue" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">My Queue</h4>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-white">12</span>
            <span className="text-xs text-red-400 font-bold">3 High Priority</span>
          </div>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-neon-purple" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Pending Follow-ups</h4>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-white">8</span>
            <span className="text-xs text-yellow-400 font-bold">2 Due Soon</span>
          </div>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-neon-green" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">SLA Hit Rate</h4>
          </div>
          <div className="flex items-end justify-between mb-1">
            <span className="text-2xl font-black text-white">96%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5 mt-1">
            <div className="bg-neon-green h-1.5 rounded-full" style={{ width: '96%' }}></div>
          </div>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-yellow-400" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Today's Conversions</h4>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-black text-white">5</span>
            <span className="text-xs text-green-400 font-bold">+2 from yesterday</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Priority Leads & AI Actions */}
        <div className="space-y-6">
          <PriorityLeadsQueue />

          <div className="glass-panel p-5 bg-neon-purple/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Bot size={16} className="text-neon-purple" /> AI Next Best Actions
            </h3>
            <div className="space-y-2">
               <div className="bg-gray-950 border border-gray-800 p-3 rounded-lg flex items-start gap-3">
                 <div className="p-1.5 bg-neon-purple/20 rounded text-neon-purple mt-0.5"><Phone size={12}/></div>
                 <div>
                   <h4 className="text-xs font-bold text-white">Call Elena Rodriguez</h4>
                   <p className="text-[10px] text-gray-400 mt-1">She viewed the pricing page 3 times today. High intent to purchase VIP.</p>
                   <button className="text-[10px] text-neon-blue font-bold mt-2 hover:underline">Initiate Call</button>
                 </div>
               </div>
               <div className="bg-gray-950 border border-gray-800 p-3 rounded-lg flex items-start gap-3">
                 <div className="p-1.5 bg-neon-blue/20 rounded text-neon-blue mt-0.5"><User size={12}/></div>
                 <div>
                   <h4 className="text-xs font-bold text-white">Follow up with Sarah Jenkins</h4>
                   <p className="text-[10px] text-gray-400 mt-1">Billing issue resolved 2 days ago. Check satisfaction.</p>
                   <button className="text-[10px] text-neon-blue font-bold mt-2 hover:underline">Send Message</button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Performance & Trend */}
        <div className="space-y-6">
          <div className="glass-panel p-5">
             <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <TrendingUp size={16} className="text-neon-blue" /> Weekly Performance Trend
            </h3>
            <div className="h-48 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityData}>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#00f0ff' }}
                  />
                  <Line type="monotone" dataKey="calls" stroke="#00f0ff" strokeWidth={2} dot={{ r: 3, fill: '#00f0ff' }} name="Calls Made" />
                  <Line type="monotone" dataKey="conversions" stroke="#8a2be2" strokeWidth={2} dot={{ r: 3, fill: '#8a2be2' }} name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
               <div className="text-center">
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Total Calls</p>
                 <p className="text-xl font-bold text-white mt-1">172</p>
               </div>
               <div className="text-center">
                 <p className="text-[10px] text-gray-500 font-bold uppercase">Conversions</p>
                 <p className="text-xl font-bold text-white mt-1">28</p>
               </div>
            </div>
          </div>

          <div className="glass-panel p-5">
             <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Clock size={16} className="text-gray-400" /> Recent Activities
            </h3>
            <div className="space-y-4 mt-4">
              <div className="flex gap-3 relative">
                <div className="absolute left-[7px] top-4 bottom-[-16px] w-px bg-gray-800"></div>
                <div className="w-4 h-4 rounded-full bg-neon-green border-2 border-gray-900 mt-1 shrink-0 z-10"></div>
                <div>
                  <p className="text-xs text-white">Closed conversation with <b>Maria G.</b></p>
                  <p className="text-[10px] text-gray-500">10 mins ago • Resolved</p>
                </div>
              </div>
              <div className="flex gap-3 relative">
                <div className="absolute left-[7px] top-4 bottom-[-16px] w-px bg-gray-800"></div>
                <div className="w-4 h-4 rounded-full bg-neon-purple border-2 border-gray-900 mt-1 shrink-0 z-10"></div>
                <div>
                  <p className="text-xs text-white">Completed onboarding for <b>Tom Evans</b></p>
                  <p className="text-[10px] text-gray-500">1 hour ago • Creator Onboarding</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-4 h-4 rounded-full bg-neon-blue border-2 border-gray-900 mt-1 shrink-0 z-10"></div>
                <div>
                  <p className="text-xs text-white">Called <b>Jin Woo</b> (No answer)</p>
                  <p className="text-[10px] text-gray-500">2 hours ago • Left Voicemail</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Tasks */}
        <div className="space-y-6">
          <div className="glass-panel p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-neon-blue" /> Today's Schedule
              </div>
              <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded">{myAppointments.length} Events</span>
            </h3>
            <div className="space-y-3">
               {myAppointments.length > 0 ? (
                 myAppointments.map((appt, idx) => {
                   const timeParts = (appt.time || '10:00 AM').split(' ');
                   const timeNum = timeParts[0];
                   const ampm = timeParts[1] || '';
                   const isNew = appt.id?.toString().startsWith('APT-');
                   return (
                     <div key={appt.id || idx} className={`flex gap-3 p-3 bg-gray-950 border rounded-lg relative overflow-hidden transition-all ${isNew ? 'border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-gray-800'}`}>
                       {isNew && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue"></div>}
                       <div className="text-center w-14 shrink-0">
                         <span className="block text-xs font-bold text-white">{timeNum}</span>
                         <span className="block text-[10px] text-gray-500">{ampm} • {appt.date || 'Today'}</span>
                       </div>
                       <div className="border-l border-gray-700 pl-3 flex-1 min-w-0">
                         <p className="text-xs font-bold text-white truncate">{appt.title}</p>
                         <p className="text-[10px] text-neon-green mt-0.5 truncate">with {appt.customer || 'Client'} ({appt.clientType || 'Lead'})</p>
                         {appt.host && <p className="text-[9px] text-gray-400 mt-0.5">Host: {appt.host}</p>}
                       </div>
                     </div>
                   );
                 })
               ) : (
                 <p className="text-xs text-gray-500 text-center py-4">No scheduled sessions for today.</p>
               )}
            </div>
            <button onClick={() => navigate(getAppPath('/calendar'))} className="w-full mt-4 py-2 text-xs text-neon-blue hover:bg-neon-blue/10 rounded font-bold transition-colors">View Full Calendar</button>
          </div>

          <div className="glass-panel p-5">
             <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-neon-purple" /> Pending Tasks
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">1 Overdue</span>
            </h3>
            <div className="space-y-2 mt-4">
               <div className="flex items-start gap-3 p-2 hover:bg-gray-900 rounded transition-colors group cursor-pointer">
                 <div className="w-4 h-4 rounded border border-red-500 mt-0.5 shrink-0"></div>
                 <div className="flex-1">
                   <p className="text-xs text-red-400 font-bold group-hover:text-red-300">Submit KYC Approval for Jin Woo</p>
                   <p className="text-[10px] text-gray-500">Due Yesterday</p>
                 </div>
               </div>
               <div className="flex items-start gap-3 p-2 hover:bg-gray-900 rounded transition-colors group cursor-pointer">
                 <div className="w-4 h-4 rounded border border-gray-600 mt-0.5 shrink-0 group-hover:border-neon-blue"></div>
                 <div className="flex-1">
                   <p className="text-xs text-gray-300 group-hover:text-white">Review payout logs for Elena R.</p>
                   <p className="text-[10px] text-gray-500">Due Today, 5:00 PM</p>
                 </div>
               </div>
               <div className="flex items-start gap-3 p-2 hover:bg-gray-900 rounded transition-colors group cursor-pointer">
                 <div className="w-4 h-4 rounded border border-gray-600 mt-0.5 shrink-0 group-hover:border-neon-blue"></div>
                 <div className="flex-1">
                   <p className="text-xs text-gray-300 group-hover:text-white">Prepare weekly shift report</p>
                   <p className="text-[10px] text-gray-500">Due Friday</p>
                 </div>
               </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
               <input type="text" placeholder="Quick add task..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
