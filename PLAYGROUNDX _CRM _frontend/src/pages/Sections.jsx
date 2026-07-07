import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, Clock, ShieldCheck, Search, Download, MoreVertical, Plus, Layers, Settings, Filter } from 'lucide-react';
import ActionModal from '../components/ui/ActionModal';
import { useToast } from '../contexts/ToastContext';
import { useDataStore } from '../contexts/DataContext';
import Badge from '../components/ui/Badge';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

export default function Sections() {
  const [sections, { addItem: addSection }] = useDataStore('sections');
  const [queues, { addItem: addQueue }] = useDataStore('queues');
  
  const [activeTab, setActiveTab] = useState('Sections'); // 'Sections' | 'Queues'
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddQueue, setShowAddQueue] = useState(false);
  
  const { addToast } = useToast();

  const handleAddSection = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        addSection({
          id: Date.now(), name: data.name, type: data.type, agents: 0, supervisors: 0, leads: 0, conversion: '0%', status: 'Active', color: '#ffd700', languages: [data.language]
        });
        addToast(`Section "${data.name}" created!`, 'success');
        resolve();
      }, 500);
    });
  };

  const handleAddQueue = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        addQueue({
          id: Date.now(), name: data.name, section: data.section, language: data.language, type: data.type, capacity: data.capacity, currentWorkload: 0, agents: 0, sla: data.sla, status: 'Active'
        });
        addToast(`Queue "${data.name}" created!`, 'success');
        resolve();
      }, 500);
    });
  };

  return (
    <div className="space-y-6 pb-10">
      <ReportHeaderBanner
        title="Section & Queue Structure Report"
        subtitle="Manage organizational divisions, language queues, capacities, and SLA compliance"
        measures="Measures workload distribution per queue, headcount per division, and language queue capacity."
        audience="Regional Directors & Queue Supervisors"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Sections & Queues
            <Badge text={`${sections.length} Sections`} color="blue" />
            <Badge text={`${queues?.length || 0} Queues`} color="purple" />
          </h2>
          <p className="text-sm font-normal text-muted mt-1">Manage organizational structure, language queues, capacities, and SLAs.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => addToast('success', 'Sections Exported', 'Exported section & queue structure to CSV.')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-500 transition-colors">
            <Download size={14} /> Export
          </button>
          {activeTab === 'Sections' ? (
            <button onClick={() => setShowAddSection(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-blue text-black text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
              <Plus size={16} /> Add Section
            </button>
          ) : (
            <button onClick={() => setShowAddQueue(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-purple text-white text-xs font-bold shadow-[0_0_15px_rgba(138,43,226,0.3)] hover:shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all">
              <Plus size={16} /> Add Queue
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('Sections')} 
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Sections' ? 'border-neon-blue text-neon-blue' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Sections
        </button>
        <button 
          onClick={() => setActiveTab('Queues')} 
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Queues' ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
        >
          Queue Management
        </button>
      </div>

      {activeTab === 'Sections' && (
        <div className="glass-panel flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Search sections..." className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
            </div>
            <button className="p-2 rounded bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"><Filter size={14} /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 table-th bg-gray-900/30">
                  <th className="px-4 py-3">Section Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Languages</th>
                  <th className="px-4 py-3 text-center">Agents</th>
                  <th className="px-4 py-3 text-center">Supervisors</th>
                  <th className="px-4 py-3 text-center">Open Leads</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {sections.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                          <Building2 size={14} className="text-neon-blue" />
                        </div>
                        <span className="text-sm font-bold text-white">{d.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-400">{d.type}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {d.languages.map(l => <span key={l} className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">{l}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-300 font-medium">{d.agents}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-300 font-medium">{d.supervisors}</td>
                    <td className="px-4 py-3 text-sm text-center font-bold text-white">{d.leads}</td>
                    <td className="px-4 py-3 text-center"><Badge text={d.status} color={d.status === 'Active' ? 'green' : 'gray'} /></td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-gray-400 hover:text-white p-1"><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Queues' && (
        <div className="glass-panel flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
             <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Search queues..." className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-neon-purple" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12}/> Global Working Hours: 24/7</span>
              <button className="p-2 rounded bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"><Settings size={14} /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 table-th bg-gray-900/30">
                  <th className="px-4 py-3">Queue Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3 text-center">Capacity</th>
                  <th className="px-4 py-3 text-center">Workload</th>
                  <th className="px-4 py-3 text-center">Agents Online</th>
                  <th className="px-4 py-3 text-center">Target SLA</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {queues?.map((q) => (
                  <tr key={q.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center border border-gray-700">
                          <Layers size={14} className="text-neon-purple" />
                        </div>
                        <span className="text-sm font-bold text-white">{q.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-300">{q.department}</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-medium text-gray-400">{q.language}</span></td>
                    <td className="px-4 py-3 text-sm text-center text-gray-300">{q.capacity}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${q.currentWorkload / q.capacity > 0.8 ? 'text-red-400' : 'text-neon-blue'}`}>{q.currentWorkload}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-300">{q.agents}</td>
                    <td className="px-4 py-3 text-sm text-center text-yellow-400 font-mono">{q.sla}</td>
                    <td className="px-4 py-3 text-center"><Badge text={q.status} color={q.status === 'Active' ? 'green' : q.status === 'High Volume' ? 'orange' : 'gray'} /></td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-gray-400 hover:text-white p-1"><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ActionModal
        open={showAddSection}
        onClose={() => setShowAddSection(false)}
        title="Create Section"
        icon={Building2}
        submitText="Create Section"
        onSubmit={handleAddSection}
        fields={[
          { name: 'name', label: 'Section Name', placeholder: 'e.g., VIP Support', required: true },
          { name: 'type', label: 'Type', placeholder: 'e.g., Business or Language', required: true },
          { name: 'language', label: 'Primary Language', placeholder: 'e.g., English', required: true }
        ]}
      />

      <ActionModal
        open={showAddQueue}
        onClose={() => setShowAddQueue(false)}
        title="Create Queue"
        icon={Layers}
        submitText="Create Queue"
        onSubmit={handleAddQueue}
        fields={[
          { name: 'name', label: 'Queue Name', placeholder: 'e.g., Escalated Support', required: true },
          { name: 'department', label: 'Assigned Department', placeholder: 'e.g., English Department', required: true },
          { name: 'language', label: 'Queue Language', placeholder: 'e.g., English', required: true },
          { name: 'type', label: 'Queue Type', placeholder: 'e.g., Language or Business', required: true },
          { name: 'capacity', label: 'Queue Capacity', type: 'number', placeholder: 'e.g., 50', required: true },
          { name: 'sla', label: 'Target SLA', placeholder: 'e.g., 15m or 2h', required: true }
        ]}
      />
    </div>
  );
}
