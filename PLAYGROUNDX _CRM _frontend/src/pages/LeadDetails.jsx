import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../contexts/DataContext';
import { ArrowLeft, User, Phone, Mail, Globe, MapPin, Tag, Calendar as CalendarIcon, CheckCircle, Clock } from 'lucide-react';
import ActivityTimeline from '../components/ui/ActivityTimeline';
import OmnichannelComposer from '../components/ui/OmnichannelComposer';
import Badge from '../components/ui/Badge';
import { useToast } from '../contexts/ToastContext';
import CreateTaskModal from '../components/leads/CreateTaskModal';
import EditLeadModal from '../components/leads/EditLeadModal';
import { AnimatePresence } from 'framer-motion';

import { useAuth } from '../contexts/AuthContext';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  const isViewer = user?.role === 'VIEWER';
  
  const [leads, { updateItem: updateLead }] = useDataStore('leads');
  const [timelineEvents, { addItem: addTimelineEvent }] = useDataStore('timelineEvents');
  const [tasks, { addItem: addTask }] = useDataStore('tasks');
  const [appointments] = useDataStore('appointments');

  const [lead, setLead] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  useEffect(() => {
    if (leads && leads.length > 0) {
      const found = leads.find(l => l.id.toString() === id);
      setLead(found || null);
    }
  }, [id, leads]);

  if (!lead) {
    return (
      <div className="p-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-neon-blue hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        <div className="text-gray-400">Loading lead details...</div>
      </div>
    );
  }

  const leadEvents = timelineEvents.filter(e => e.leadId === lead.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const leadTasks = tasks.filter(t => t.leadId === lead.id);
  const leadAppts = appointments.filter(a => a.leadId === lead.id);

  const handleSendMessage = (msg) => {
    addTimelineEvent({
      id: Date.now(),
      leadId: lead.id,
      type: msg.channel === 'Internal Note' ? 'system' : 'agent_action',
      text: msg.channel === 'Internal Note' ? `Note: ${msg.text}` : `Sent ${msg.channel}: ${msg.text}`,
      timestamp: new Date().toISOString(),
      icon: msg.channel === 'WhatsApp' ? 'MessageCircle' : msg.channel === 'Email' ? 'Mail' : msg.channel === 'SMS' ? 'MessageSquare' : 'FileText',
      iconColor: msg.channel === 'WhatsApp' ? 'text-[#25D366]' : 'text-blue-500'
    });
    addToast('success', 'Sent', `Successfully logged ${msg.channel}`);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto flex flex-col min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex flex-wrap items-center gap-2 sm:gap-3">
            {lead.name} {lead.flag}
            <Badge text={lead.status} color={lead.status === 'Active' || lead.status === 'VIP' ? 'green' : 'blue'} />
          </h1>
        </div>
        {!isViewer && (
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <button onClick={() => setShowEditModal(true)} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors text-xs sm:text-sm font-medium">Edit Profile</button>
            <button onClick={() => setShowTaskModal(true)} className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg hover:bg-neon-blue hover:text-gray-950 transition-colors text-xs sm:text-sm font-medium">Create Task</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 lg:overflow-hidden">
        
        {/* Left Column: Profile */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 shadow-xl">
            <div className="flex flex-col items-center mb-6">
              <img src={lead.avatar} alt={lead.name} className="w-24 h-24 rounded-full border-2 border-gray-700 shadow-lg mb-4" />
              <h2 className="text-xl font-bold text-white">{lead.name}</h2>
              <p className="text-neon-blue">{lead.type}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-300">
                <Mail className="w-4 h-4 mr-3 text-gray-500" /> {lead.email}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="w-4 h-4 mr-3 text-gray-500" /> {lead.phone}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <MapPin className="w-4 h-4 mr-3 text-gray-500" /> {lead.country}
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Globe className="w-4 h-4 mr-3 text-gray-500" /> {lead.language}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Health Score</span>
                <span className={`text-xs font-bold ${lead.healthScore > 80 ? 'text-green-400' : lead.healthScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{lead.healthScore}/100</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                <div className={`h-1.5 rounded-full ${lead.healthScore > 80 ? 'bg-green-400' : lead.healthScore > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${lead.healthScore}%` }}></div>
              </div>
              
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">VIP Potential</span>
                <span className="text-xs font-bold text-purple-400">{lead.vipScore}/100</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-1.5 rounded-full" style={{ width: `${lead.vipScore}%` }}></div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {lead.tags?.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-4">Assignment</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{lead.agent}</p>
                  <p className="text-xs text-gray-500">Agent</p>
                </div>
              </div>
              {!isViewer && <button className="text-xs text-neon-blue hover:underline">Reassign</button>}
            </div>
          </div>
        </div>

        {/* Middle Column: Timeline */}
        <div className="lg:col-span-5 flex flex-col h-full bg-gray-900 border border-white/5 rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-md z-10 sticky top-0">
            <h2 className="font-semibold text-white">Activity Timeline</h2>
            <p className="text-xs text-gray-400">Chronological history of all interactions</p>
          </div>
          <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
            <ActivityTimeline events={leadEvents} />
          </div>
        </div>

        {/* Right Column: Action Center */}
        <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Quick Tasks */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Pending Tasks</h3>
              <span className="text-xs font-medium bg-gray-800 px-2 py-1 rounded-full text-gray-300">{leadTasks.length}</span>
            </div>
            {leadTasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No pending tasks.</p>
            ) : (
              <div className="space-y-3">
                {leadTasks.map(task => (
                  <div key={task.id} className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-start gap-3">
                    <div className="mt-0.5"><Clock className={`w-4 h-4 ${task.priority === 'High' ? 'text-red-400' : 'text-blue-400'}`} /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{task.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-white mb-4">Upcoming Appointments</h3>
            {leadAppts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled.</p>
            ) : (
              <div className="space-y-3">
                {leadAppts.map(appt => (
                  <div key={appt.id} className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-900/30 border border-blue-500/30 flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{appt.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(appt.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {!isViewer ? (
                      <button className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded hover:bg-neon-blue hover:text-black transition-colors">Join</button>
                    ) : (
                      <span className="text-xs text-gray-500 font-bold px-2 py-1 bg-gray-800 rounded">Scheduled</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Message Composer */}
          {!isViewer ? (
            <div className="bg-gray-900 border border-white/5 rounded-xl shadow-xl overflow-hidden mt-auto">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-white">Direct Message</h3>
              </div>
              <OmnichannelComposer onSend={handleSendMessage} defaultChannel="WhatsApp" />
            </div>
          ) : (
            <div className="bg-gray-900 border border-white/5 rounded-xl shadow-xl p-4 text-center text-xs text-gray-500 font-bold mt-auto">
              🔒 Messaging is disabled in read-only mode.
            </div>
          )}

        </div>
      </div>
      
      <AnimatePresence>
        {showTaskModal && <CreateTaskModal leadId={lead.id} leadName={lead.name} onClose={() => setShowTaskModal(false)} onAdd={addTask} />}
        {showEditModal && <EditLeadModal lead={lead} onClose={() => setShowEditModal(false)} onUpdate={updateLead} />}
      </AnimatePresence>
    </div>
  );
}
