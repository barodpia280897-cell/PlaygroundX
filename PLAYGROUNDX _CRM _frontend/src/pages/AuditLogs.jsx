import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Filter, Download, Activity, User, Key, Server, Laptop, ChevronLeft, ChevronRight, Eye, AlertTriangle } from 'lucide-react';

const mockLogs = [
  { id: 'AL-9021', user: 'James Harrington', role: 'TENANT_OWNER', action: 'Modified Routing Rule #4', module: 'Routing Engine', time: '10:45:12 AM', ip: '192.168.1.42', browser: 'Chrome/Win', status: 'Success' },
  { id: 'AL-9020', user: 'System', role: 'SYSTEM', action: 'Daily Backup Completed', module: 'Database', time: '02:00:00 AM', ip: '10.0.0.5', browser: 'Server', status: 'Success' },
  { id: 'AL-9019', user: 'Priya Sharma', role: 'AGENT', action: 'Exported Leads (CSV)', module: 'CRM Core', time: 'Yesterday, 4:12 PM', ip: '192.168.1.88', browser: 'Safari/Mac', status: 'Warning' },
  { id: 'AL-9018', user: 'Unknown', role: 'UNAUTHORIZED', action: 'Failed Login Attempt', module: 'Authentication', time: 'Yesterday, 3:05 PM', ip: '45.22.19.102', browser: 'Firefox/Linux', status: 'Failed' },
  { id: 'AL-9017', user: 'Elena Vasquez', role: 'MANAGER', action: 'Deleted User "John Doe"', module: 'User Management', time: 'May 20, 11:30 AM', ip: '192.168.1.15', browser: 'Chrome/Mac', status: 'Success' },
  { id: 'AL-9016', user: 'Sarah Jenkins', role: 'AGENT', action: 'Escalated Ticket #102', module: 'Operations', time: 'May 20, 09:15 AM', ip: '192.168.1.22', browser: 'Edge/Win', status: 'Success' },
  { id: 'AL-9015', user: 'API Key', role: 'INTEGRATION', action: 'Webhook Delivery Failed', module: 'API Gateway', time: 'May 19, 08:44 PM', ip: '10.0.1.55', browser: 'Node/v18', status: 'Failed' },
];

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('All');

  const modules = ['All', 'Authentication', 'User Management', 'CRM Core', 'Routing Engine', 'API Gateway', 'Operations', 'Database'];

  const filteredLogs = mockLogs.filter(log => 
    (filterModule === 'All' || log.module === filterModule) &&
    (log.action.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 flex items-center justify-center">
              <Shield size={16} className="text-gray-300" />
            </div>
            Enterprise Audit Logs
          </h1>
          <p className="text-sm text-gray-400 mt-1">Immutable record of all system, user, and API activities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 rounded-lg text-sm font-bold text-gray-300 transition-colors flex items-center gap-2">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Search by user, action, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg py-2.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-gray-500"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          <div className="flex items-center gap-1 bg-gray-950 border border-gray-800 rounded-lg p-1">
            {modules.map(mod => (
              <button 
                key={mod}
                onClick={() => setFilterModule(mod)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md whitespace-nowrap transition-colors
                  ${filterModule === mod ? 'bg-gray-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}
                `}
              >
                {mod}
              </button>
            ))}
          </div>
          <button className="p-2.5 bg-gray-950 border border-gray-800 hover:border-gray-600 rounded-lg text-gray-400 transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-950/80 sticky top-0 z-10">
              <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800">
                <th className="py-4 pl-6">Timestamp / ID</th>
                <th className="py-4">User & Role</th>
                <th className="py-4">Action</th>
                <th className="py-4">Module</th>
                <th className="py-4">Network Info</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 pr-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                  <td className="py-4 pl-6">
                    <div className="text-sm font-bold text-gray-200">{log.time}</div>
                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{log.id}</div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {log.role === 'SYSTEM' || log.role === 'INTEGRATION' ? (
                        <Server size={14} className="text-gray-500" />
                      ) : log.role === 'UNAUTHORIZED' ? (
                        <AlertTriangle size={14} className="text-neon-pink" />
                      ) : (
                        <User size={14} className="text-neon-blue" />
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-200">{log.user}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider">{log.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-sm text-gray-300 font-medium">{log.action}</div>
                  </td>
                  <td className="py-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-400">
                      <Activity size={12} /> {log.module}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                      <Laptop size={12} className="text-gray-500" /> {log.ip}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">{log.browser}</div>
                  </td>
                  <td className="py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                      ${log.status === 'Success' ? 'bg-neon-green/10 text-neon-green border border-neon-green/30' : 
                        log.status === 'Warning' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30' : 
                        'bg-neon-pink/10 text-neon-pink border border-neon-pink/30'}
                    `}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="p-1.5 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors inline-block">
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex items-center justify-between text-sm text-gray-500">
          <div>Showing 1 to {filteredLogs.length} of 1,240 entries</div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:text-white transition-colors disabled:opacity-50"><ChevronLeft size={16} /></button>
            <span className="font-bold text-white bg-gray-800 px-3 py-1 rounded">1</span>
            <button className="px-2 py-1 hover:text-white transition-colors">2</button>
            <button className="px-2 py-1 hover:text-white transition-colors">3</button>
            <span className="px-1">...</span>
            <button className="px-2 py-1 hover:text-white transition-colors">124</button>
            <button className="p-1 hover:text-white transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
