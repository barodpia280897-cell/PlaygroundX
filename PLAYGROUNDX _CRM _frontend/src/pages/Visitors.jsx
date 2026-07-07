import { useTenantData, useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Users, Search, Filter, LogIn, LogOut, FileText, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Visitors() {
  const [visitors, { setCollection: setVisitors }] = useTenantData('visitors');
  const [notifs, { setCollection: setNotifs }] = useDataStore('notifications');
  const { addToast } = useToast();

  const handleSimulateWalkIn = () => {
    const names = ['Alexa Vance', 'Jordan Lee', 'David Miller', 'Chloe Bennett', 'Liam Thorne'];
    const purposes = ['Account Verification', 'KYC Assistance', 'VIP Studio Tour', 'Billing Inquiry', 'Creator Contract Review'];
    const hosts = ['Priya Sharma', 'Mike Agent', 'Sarah Jenkins', 'Elena Vasquez'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomPurpose = purposes[Math.floor(Math.random() * purposes.length)];
    const randomHost = hosts[Math.floor(Math.random() * hosts.length)];

    const newVisitor = {
      id: 'VIS-' + Date.now().toString().slice(-4),
      name: randomName,
      type: 'Walk-In',
      purpose: randomPurpose,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      host: randomHost,
      status: 'Waiting',
      pass: 'W-' + Math.floor(100 + Math.random() * 900)
    };

    if (setVisitors) {
      setVisitors([newVisitor, ...(visitors || [])]);
    }

    if (setNotifs) {
      const newNotif = {
        id: Date.now(),
        type: 'alert',
        title: 'Walk-In Visitor Arrived',
        body: `${randomName} is waiting at Front Desk for ${randomPurpose}.`,
        message: `${randomName} is waiting at Front Desk for ${randomPurpose}.`,
        time: 'Just now',
        unread: true,
        category: 'CRM',
        agent: randomHost
      };
      setNotifs([newNotif, ...(notifs || [])]);
    }

    addToast('success', 'Walk-In Simulated', `${randomName} arrived for ${randomHost}. Alert dispatched.`);
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <Users size={24} className="text-yellow-500" />
            Visitor Log
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage all checked-in, waiting, and historical visitors.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSimulateWalkIn} className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:opacity-90 text-black rounded-lg text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/20">
            <UserPlus size={16} /> Register New Walk-In
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search visitors by name or host..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800">
          <Filter size={16} /> Filter Status
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-950 sticky top-0 z-10 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Visitor ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type & Purpose</th>
                <th className="px-6 py-4">Time In</th>
                <th className="px-6 py-4">Host</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {(visitors || []).map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-mono text-gray-400">{v.id}</td>
                  <td className="px-6 py-4 font-bold text-white group-hover:text-yellow-500 transition-colors cursor-pointer">{v.name}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-300 bg-gray-800 px-2.5 py-1 rounded-md">{v.type}</span>
                    <div className="text-[10px] text-gray-500 mt-1">{v.purpose}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300 text-sm font-mono">
                    {v.timeIn}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {v.host}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                      ${v.status === 'Checked In' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : ''}
                      ${v.status === 'Waiting' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : ''}
                      ${v.status === 'Checked Out' ? 'bg-gray-800 text-gray-400 border border-gray-700' : ''}
                    `}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {v.status === 'Waiting' && <button className="p-1.5 text-neon-green hover:bg-neon-green/10 rounded"><LogIn size={14}/></button>}
                      {v.status === 'Checked In' && <button className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"><LogOut size={14}/></button>}
                      <button className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"><FileText size={14}/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
