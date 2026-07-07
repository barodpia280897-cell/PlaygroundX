// src/components/dashboard/PriorityLeadsQueue.jsx
import React from 'react';
import { AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { useUIState, useDataStore } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';

export default function PriorityLeadsQueue() {
  const [queueLeads, setQueueLeads] = useUIState('agent_priority_queue', [
    { id: 'q-1', name: 'Li Wei', type: 'Creator', score: 95, flag: '🇨🇳', wait: '12m', sla: 'Warning' },
    { id: 'q-2', name: 'Ahmed Al-Fayed', type: 'Creator', score: 88, flag: '🇦🇪', wait: '18m', sla: 'Breached' },
    { id: 'q-3', name: 'Sofia Rossi', type: 'VIP Fan', score: 92, flag: '🇮🇹', wait: '5m', sla: 'Good' },
  ]);
  
  const [, { addItem: addLead }] = useDataStore('leads');
  const { addToast } = useToast();

  const handleClaimLead = (lead) => {
    setQueueLeads((prev) => prev.filter((l) => l.id !== lead.id));
    
    // Add claimed lead directly to agent's assigned pipeline in /app/leads
    const newLead = {
      id: `lead-claimed-${Date.now()}-${lead.id}`,
      name: lead.name,
      type: lead.type,
      status: 'Contacted',
      stage: 'Qualification',
      assignedTo: 'Priya Sharma (You)',
      email: `${lead.name.toLowerCase().replace(/\s+/g, '.')}@pgx.vip`,
      phone: '+1 (555) 019-2834',
      country: lead.flag || '🌐',
      vipScore: lead.score,
      source: 'Priority Queue (AI Routed)',
      createdAt: new Date().toISOString().split('T')[0],
      notes: `Claimed from Priority Queue after waiting ${lead.wait}. SLA status: ${lead.sla}.`,
      kycStatus: 'Pending',
      depositStatus: 'No Deposit'
    };
    addLead(newLead);

    addToast('success', 'Lead Claimed!', `You claimed ${lead.name} (VIP Score: ${lead.score}). Added to your active Leads page!`);
  };

  return (
    <div className="glass-panel p-5 bg-gray-900/60 border border-gray-800 rounded-2xl shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-gray-800/80 pb-2.5">
        <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400" /> Priority Leads Queue
        </h3>
        <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded font-bold animate-pulse">
          {queueLeads.length} WAITING
        </span>
      </div>

      {queueLeads.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-950/40 rounded-xl border border-dashed border-gray-800">
          <CheckCircle2 size={24} className="mx-auto mb-2 text-neon-green/60" />
          <p className="text-xs font-bold text-gray-400">Queue is Clear!</p>
          <p className="text-[10px] text-gray-600 mt-0.5">No high-priority VIP leads waiting for assignment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {queueLeads.map((lead) => (
            <div
              key={lead.id}
              className={`bg-gray-950/80 border p-3.5 rounded-xl flex flex-col gap-3 hover:border-gray-700 transition-all ${
                lead.sla === 'Breached' ? 'border-red-500/50 bg-red-500/5' : lead.sla === 'Warning' ? 'border-yellow-500/50' : 'border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center font-black text-white text-sm">
                    {lead.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      {lead.name} <span className="text-xs">{lead.flag}</span>
                    </h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{lead.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-extrabold ${lead.sla === 'Breached' ? 'text-red-400 animate-pulse' : lead.sla === 'Warning' ? 'text-yellow-400' : 'text-neon-green'}`}>
                    Waiting: {lead.wait}
                  </p>
                  <p className="text-[10px] text-neon-blue font-bold">VIP Score: {lead.score}</p>
                </div>
              </div>
              <button
                onClick={() => handleClaimLead(lead)}
                className="w-full py-2 bg-gray-900 hover:bg-neon-green hover:text-black border border-gray-700 hover:border-neon-green text-gray-200 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <UserPlus size={14} /> Claim Lead from Queue
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
