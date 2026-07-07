// src/components/modals/QuickActionModal.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, UserPlus, MessageSquare, Phone, Mail, CalendarPlus, FileText, Zap, Search, Activity, Clock, AlertTriangle, CheckSquare, ShieldCheck, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

import { ShieldAlert, Database, Key, Radio, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppPath } from '../../utils/routing';

const crmActions = [
  { label: 'Add New Lead', icon: UserPlus, color: '#00f0ff', shortcut: '⌘N', desc: 'Create a new lead record', path: '/leads?new=true' },
  { label: 'Send WhatsApp', icon: MessageSquare, color: '#25D366', shortcut: '⌘W', desc: 'Send a WhatsApp message', isAlert: true, action: 'whatsapp' },
  { label: 'Assign Task', icon: FileText, color: '#ff7f00', shortcut: '⌘T', desc: 'Assign a task to team', path: '/tasks' },
  { label: 'Generate Report', icon: FileText, color: '#8a2be2', shortcut: '⌘R', desc: 'View comprehensive reports', path: '/reports' },
  { label: 'Schedule Meeting', icon: CalendarPlus, color: '#39ff14', shortcut: '⌘M', desc: 'Book a calendar event', path: '/calendar' },
  // { label: 'Team Broadcast', icon: Radio, color: '#f59e0b', shortcut: '⌘B', desc: 'Send alert to all employees', isAlert: true, action: 'broadcast' },
];

const platformActions = [
  { label: 'Add New Tenant', icon: Building2, color: '#00f0ff', shortcut: '⌘N', desc: 'Quick onboard a new tenant', path: '/platform/tenants' },
  { label: 'Generate API Key', icon: Key, color: '#ec4899', shortcut: '⌘K', desc: 'Create a global integration key', path: '/platform/api' },
  // { label: 'Broadcast Message', icon: Radio, color: '#f59e0b', shortcut: '⌘B', desc: 'Send system-wide alert to all tenants', isAlert: true, action: 'broadcast' },
  { label: 'System Backup', icon: Database, color: '#10b981', shortcut: '⌘S', desc: 'Trigger manual database snapshot', isAlert: true },
  { label: 'Suspend Tenant', icon: ShieldAlert, color: '#ef4444', shortcut: '⌘X', desc: 'Immediately freeze an account', isAlert: true },
];

const agentActions = [
  { label: 'Claim Priority Lead', icon: UserPlus, color: '#00f0ff', shortcut: '⌘L', desc: 'Claim next VIP lead from queue', path: '/workspace' },
  { label: 'Open My Leads', icon: FileText, color: '#39ff14', shortcut: '⌘D', desc: 'View your assigned leads list', path: '/leads' },
  { label: 'Open Conversations', icon: MessageSquare, color: '#25D366', shortcut: '⌘W', desc: 'Open live customer WhatsApp/chat inbox', path: '/conversations' },
  { label: 'My Follow-ups', icon: CalendarPlus, color: '#ff7f00', shortcut: '⌘F', desc: 'Check pending lead tasks & follow-ups', isAlert: true, action: 'followups' },
  { label: 'Log Call / Add Note', icon: Phone, color: '#8a2be2', shortcut: '⌘C', desc: 'Log a call or add conversation notes', isAlert: true, action: 'logCallNote' },
  { label: "View Today's Tasks", icon: FileText, color: '#ec4899', shortcut: '⌘T', desc: 'Check your assigned daily targets', path: '/tasks' },
  { label: 'Request Supervisor Help', icon: ShieldAlert, color: '#ef4444', shortcut: '⌘H', desc: 'Escalate ticket to Team Supervisor', isAlert: true, action: 'supervisorHelp' },
];

const supervisorActions = [
  { label: 'Monitor Floor', icon: Activity, color: '#10b981', shortcut: '⌘M', desc: 'Open Live Audio Console', path: '/supervisor' },
  { label: 'Queue Monitor', icon: Clock, color: '#f59e0b', shortcut: '⌘Q', desc: 'View SLA & Emergency Assign', path: '/queue-monitor' },
  { label: 'Review Escalations', icon: AlertTriangle, color: '#ef4444', shortcut: '⌘E', desc: 'Approve/Reject requests', path: '/escalations' },
  { label: 'Assign Team Task', icon: CheckSquare, color: '#ec4899', shortcut: '⌘T', desc: 'Assign tasks to agents', path: '/tasks' },
  { label: 'Quality Assurance', icon: ShieldCheck, color: '#8a2be2', shortcut: '⌘A', desc: 'Audit calls and chats', path: '/quality' },
  { label: 'Team Calendar', icon: CalendarIcon, color: '#f97316', shortcut: '⌘C', desc: 'View team schedules', path: '/calendar' },
];

const executiveActions = [
  { label: 'Team Conversations', icon: MessageSquare, color: '#25D366', shortcut: '⌘C', desc: 'Monitor all customer chats', path: '/conversations' },
  // { label: 'Team Broadcast', icon: Radio, color: '#f59e0b', shortcut: '⌘B', desc: 'Send bulk message/email to all staff & teams', isAlert: true, action: 'broadcast' },
  { label: 'Send WhatsApp', icon: MessageSquare, color: '#25D366', shortcut: '⌘W', desc: 'Send a WhatsApp message to a contact', isAlert: true, action: 'whatsapp' },
  { label: 'Send Email', icon: Mail, color: '#8a2be2', shortcut: '⌘E', desc: 'Send an email to leads or team members', isAlert: true, action: 'email' },
  { label: 'Delegate Task', icon: CheckSquare, color: '#ff7f00', shortcut: '⌘T', desc: 'Assign work to your managers', path: '/tasks' },
  { label: 'Executive Reports', icon: FileText, color: '#8a2be2', shortcut: '⌘R', desc: 'View comprehensive reports', path: '/reports' },
  { label: 'Revenue Analytics', icon: Activity, color: '#10b981', shortcut: '⌘A', desc: 'Check financial performance', path: '/revenue' },
  { label: 'AI Insights', icon: Zap, color: '#00f0ff', shortcut: '⌘I', desc: 'AI-powered performance summary', path: '/ai-insights' },
];


export default function QuickActionModal({ open, onClose, onCallClick, onEmailClick, onWhatsAppClick, onBroadcastClick, onLogCallNoteClick, onFollowupsClick, onSupervisorHelpClick }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const actions = user?.role === 'PLATFORM_ADMIN' 
    ? platformActions 
    : user?.role === 'TENANT_OWNER' || user?.role === 'MANAGER'
      ? executiveActions
      : user?.role === 'SUPERVISOR'
        ? supervisorActions
        : user?.role === 'AGENT' 
          ? agentActions 
          : crmActions;

  const filtered = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));
  if (!open) return null;

  const handleAction = (a) => {
    onClose();
    if (a.path) {
      navigate(getAppPath(a.path, user?.role));
    } else if (a.isAlert) {
      if (a.label === 'Make a Call' && onCallClick) {
        onCallClick();
      } else if (a.label === 'Send Email' && onEmailClick) {
        onEmailClick();
      } else if (a.action === 'whatsapp' && onWhatsAppClick) {
        onWhatsAppClick();
      } else if (a.action === 'broadcast' && onBroadcastClick) {
        onBroadcastClick();
      } else if (a.action === 'logCallNote' && onLogCallNoteClick) {
        onLogCallNoteClick();
      } else if (a.action === 'followups' && onFollowupsClick) {
        onFollowupsClick();
      } else if (a.action === 'supervisorHelp' && onSupervisorHelpClick) {
        onSupervisorHelpClick();
      } else {
        addToast('info', 'Quick Action', `Triggered Quick Action: ${a.label}`);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-28 px-3 sm:px-4"
        onClick={onClose}
      >
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-[520px] bg-gray-950/98 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Search */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
            <Search size={16} className="text-muted" />
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search quick actions..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-600 focus:outline-none text-sm"
            />
            <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors text-xs border border-gray-700 px-2 py-0.5 rounded">ESC</button>
          </div>

          {/* Actions */}
          <div className="p-3 space-y-1">
            <div className="text-[10px] text-gray-600 uppercase tracking-widest px-3 mb-2">Quick Actions</div>
            {filtered.map(a => {
              const Icon = a.icon;
              return (
                <button key={a.label} onClick={() => handleAction(a)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group text-left">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: a.color + '15', border: `1px solid ${a.color}30` }}>
                    <Icon size={16} style={{ color: a.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-200 group-hover:text-white">{a.label}</div>
                    <div className="text-[11px] text-gray-600">{a.desc}</div>
                  </div>
                  <kbd className="text-[10px] text-gray-600 border border-gray-700 px-2 py-0.5 rounded font-mono">{a.shortcut}</kbd>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-sm">No actions found</div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
