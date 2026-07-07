import { useTenantData, useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import { Activity, Search, Filter, UserPlus, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WalkInCustomers() {
  const [visitors, { setCollection: setVisitors }] = useTenantData('visitors');
  const [notifs, { setCollection: setNotifs }] = useDataStore('notifications');
  const { addToast } = useToast();
  
  // Filter only walk-ins
  const walkIns = (visitors || []).filter(v => v.type === 'Walk-In');

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
            <Activity size={24} className="text-neon-pink" />
            Walk-In Queue
          </h1>
          <p className="text-sm text-gray-400 mt-1">Manage ad-hoc visitors and unscheduled customer walk-ins.</p>
        </div>
        <button onClick={handleSimulateWalkIn} className="px-4 py-2 bg-gradient-to-r from-neon-pink to-purple-600 hover:opacity-90 text-white rounded-lg text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-neon-pink/20">
          <UserPlus size={16} /> Register New Walk-In
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 shrink-0">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search walk-ins..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-neon-pink focus:outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white hover:bg-gray-800">
          <Filter size={16} /> Sort by Time
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-950 sticky top-0 z-10 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Arrival Time</th>
                <th className="px-6 py-4">Assigned Agent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {walkIns.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No walk-ins currently in queue.</td></tr>
              ) : (
                walkIns.map((v, i) => (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-white group-hover:text-neon-pink transition-colors">{v.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{v.purpose}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-mono">{v.timeIn}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{v.host}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                        ${v.status === 'Waiting' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : 'bg-gray-800 text-gray-400'}
                      `}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1 bg-neon-pink/10 text-neon-pink font-bold rounded border border-neon-pink/30 hover:bg-neon-pink/20 text-xs">Assign</button>
                        <button className="p-1 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"><FileText size={14}/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
