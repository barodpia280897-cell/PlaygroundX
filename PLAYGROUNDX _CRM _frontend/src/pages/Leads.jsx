import { useState, useEffect } from 'react';
import { useDataStore, useUIState } from '../contexts/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone, X } from 'lucide-react';
import { useDepartment } from '../contexts/DepartmentContext';
import StatCard from '../components/ui/StatCard';
import LeadFilterBar from '../components/leads/LeadFilterBar';
import LeadTable from '../components/leads/LeadTable';
import LeadAnalytics from '../components/leads/LeadAnalytics';
import ProfileModal from '../components/modals/ProfileModal';
import { filterDataByRole } from '../utils/rbac';
import { useSimulatedLoading } from '../hooks/useSimulatedLoading';
import { TableSkeleton, CardSkeleton } from '../components/ui/Skeleton';



const STAGES = ['New Lead','Contacted','Registered','KYC Submitted','KYC Approved','Active','VIP'];

const roleConfig = {
  ADMIN: { title: 'Leads', desc: (t, s) => `${t} total leads · ${s} shown`, canAdd: true, showAgent: true, canAct: true, canView: true, filterFn: (leads) => leads },
  EXECUTIVE: { title: 'Leads Overview', desc: (t, s) => `Global pipeline overview`, canAdd: false, showAgent: true, canAct: false, canView: true, filterFn: (leads) => leads },
  MANAGER: { title: 'Leads Directory', desc: (t, s) => `${t} organizational leads · ${s} shown`, canAdd: true, showAgent: true, canAct: true, canView: true, filterFn: (leads) => leads },
  SUPERVISOR: { title: 'Team Leads', desc: (t, s) => `Managing ${t} team leads`, canAdd: false, showAgent: true, canAct: true, canView: true, filterFn: (leads) => leads },
  AGENT: { title: 'My Leads', desc: (t, s) => `Your assigned leads`, canAdd: false, showAgent: false, canAct: true, canView: true, filterFn: (leads, user) => leads.slice(0, 5) },
  VIEWER: { title: 'Leads Data', desc: (t, s) => `Read-only access`, canAdd: false, showAgent: true, canAct: false, canView: true, filterFn: (leads) => leads }
};

function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', country:'', type:'Creator', language:'English', source:'Facebook Ad', stage:'New Lead' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-gray-950/98 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div><h3 className="font-black text-white text-lg">Add New Lead</h3><p className="text-xs text-muted">Fill in the lead details below</p></div>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors p-1"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="form-label">First Name *</label><input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Maria" className="form-input" /></div>
            <div><label className="form-label">Last Name *</label><input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Gonzalez" className="form-input" /></div>
          </div>
          <div><label className="form-label">Email *</label><input value={form.email} onChange={e => set('email', e.target.value)} placeholder="maria@email.com" type="email" className="form-input" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="form-label">Lead Type *</label>
              <div className="flex gap-2">{['Creator','Fan'].map(t => <button key={t} onClick={() => set('type', t)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${form.type === t ? 'bg-neon-blue/15 border-neon-blue/40 text-neon-blue' : 'border-gray-700 text-muted hover:border-gray-600'}`}>{t}</button>)}</div>
            </div>
            <div><label className="form-label">Stage</label>
              <select value={form.stage} onChange={e => set('stage', e.target.value)} className="form-input">{STAGES.map(s => <option key={s}>{s}</option>)}</select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-800 flex items-center gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-secondary text-sm font-medium hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={() => {
            onAdd({ id: Date.now(), name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone, country: form.country, flag: '🌐', type: form.type, language: form.language, status: 'New', leadScore: 10, vipScore: 0, stage: form.stage, source: form.source, agent: 'Unassigned', createdAt: new Date().toISOString().split('T')[0], avatar: `https://ui-avatars.com/api/?name=${form.firstName}+${form.lastName}&background=random` });
            onClose();
          }} className="flex-1 py-2.5 rounded-xl bg-neon-blue text-black font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">Create Lead</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CallLeadModal({ lead, onClose }) {
  const [calling, setCalling] = useState(false);
  const [active, setActive] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [active]);
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-80 bg-gray-950/98 border border-gray-800 rounded-2xl p-6 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <img src={lead.avatar} className="w-16 h-16 rounded-full mx-auto border-2 border-neon-blue/40 mb-3" />
        <div className="font-bold text-white text-lg">{lead.name} {lead.flag}</div>
        <div className="text-muted text-xs mb-1">{lead.phone}</div>
        {active ? (
          <>
            <div className="text-neon-green font-mono text-2xl font-bold my-4">{fmt(elapsed)}</div>
            <button onClick={() => { setActive(false); setCalling(false); setElapsed(0); onClose(); }} className="w-14 h-14 mx-auto rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]"><Phone size={22} className="text-white rotate-[135deg]" /></button>
          </>
        ) : (
          <button onClick={() => { setCalling(true); setTimeout(() => { setCalling(false); setActive(true); }, 2000); }} disabled={calling} className="mt-4 w-14 h-14 mx-auto rounded-full bg-neon-green flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.4)] disabled:opacity-60">
            {calling ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Phone size={22} className="text-black" />}
          </button>
        )}
        <div className="text-xs text-gray-600 mt-3">{calling ? 'Calling...' : active ? 'On call' : 'Click to call'}</div>
      </motion.div>
    </motion.div>
  );
}

export default function Leads() {
  const { user } = useAuth();
  const { selectedDepartment } = useDepartment();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const config = roleConfig[user?.role] || roleConfig.ADMIN;
  
  const [allLeads, { addItem, deleteItem, updateItem }] = useDataStore('leads');
  const leads = filterDataByRole(allLeads, user, 'leads');
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: 'All Types', pipeline: 'All Pipelines', language: 'All Languages' });
  const [showAddLead, setShowAddLead] = useState(false);
  const [callLead, setCallLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const isLoading = useSimulatedLoading(800, [filters.type, search]);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowAddLead(true);
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams]);

  const filtered = leads.filter(l => {
    // 1. Global Language Filter (Department)
    const leadLang = l.language || 'English';
    const matchesGlobalLang = selectedDepartment.id === 'all' || 
                              selectedDepartment.name.toLowerCase().includes(leadLang.toLowerCase()) || 
                              leadLang.toLowerCase().includes(selectedDepartment.name.split(' ')[0].toLowerCase());
    
    if (!matchesGlobalLang) return false;

    // 2. Local Filters
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchType = filters.type === 'All Types' || l.type === filters.type;
    const matchLanguage = filters.language === 'All Languages' || leadLang === filters.language;
    
    return matchSearch && matchType && matchLanguage;
  });

  const leadsKpiStats = [
    { label: 'Total Leads', value: filtered.length.toLocaleString(), change: '+18.6% vs yesterday', icon: 'Users', color: 'blue', positive: true },
    { label: 'New Leads', value: filtered.filter(l => l.stage === 'New Lead').length.toLocaleString(), change: '+12.4%', icon: 'Users', color: 'green', positive: true },
    { label: 'Creators', value: filtered.filter(l => l.type === 'Creator').length.toLocaleString(), change: '+16.4%', icon: 'Users', color: 'blue', positive: true },
    { label: 'Fans', value: filtered.filter(l => l.type === 'Fan').length.toLocaleString(), change: '+20.1%', icon: 'Heart', color: 'pink', positive: true },
    { label: 'Hot Leads', value: filtered.filter(l => l.status === 'Hot Lead').length.toLocaleString(), change: '+19.3%', icon: 'Flame', color: 'orange', positive: true },
    { label: 'VIP Leads', value: filtered.filter(l => l.stage === 'VIP').length.toLocaleString(), change: '+15.7%', icon: 'Crown', color: 'gold', positive: true },
    { label: 'Needs Agent', value: filtered.filter(l => l.agent === 'Unassigned').length.toLocaleString(), change: '-8.2%', icon: 'Headphones', color: 'red', positive: false },
  ];

  return (
    <>
      <div className="space-y-5 pb-10">
        
        {/* Header Title & Global KPI Row Combined */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-gray-800/50 pb-5">
          <div className="shrink-0">
            <h2 className="text-2xl font-black text-white">{config.title}</h2>
            <p className="text-sm text-muted mt-0.5">{config.desc(leads.length, filtered.length)}</p>
          </div>

          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto xl:flex xl:justify-end">
              {leadsKpiStats.map((stat, i) => (
                <div key={i} className="w-full xl:w-[150px]">
                  {isLoading ? <CardSkeleton /> : <StatCard stat={stat} index={i} compact />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <LeadFilterBar 
          search={search} 
          setSearch={setSearch} 
          filters={filters}
          setFilters={setFilters}
          canAdd={config.canAdd} 
          onAdd={() => setShowAddLead(true)}
          userRole={user?.role}
        />

        {/* 2-Column Main Content Layout */}
        <div className="flex flex-col xl:flex-row items-start gap-5">
          
          {/* Left Column: Data Table & Pipelines Stepper */}
          <div className="flex-1 w-full min-w-0 space-y-5">
            {isLoading ? <TableSkeleton rows={10} cols={6} /> : (
              <LeadTable leads={filtered} config={config} onCall={setCallLead} onView={(lead) => navigate(String(lead.id))} onDelete={deleteItem} onEdit={updateItem} />
            )}
            
            {/* Pipelines Steppers (Below Table) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-panel/30 border border-gray-800/50 rounded-2xl p-4 shadow-lg">
                <h3 className="text-sm font-bold text-neon-purple mb-4">Creator Pipeline <span className="text-gray-500 font-normal">{filtered.filter(l => l.type === 'Creator').length} Total &gt;</span></h3>
                <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                  <div className="flex justify-between items-center relative min-w-[650px] py-1.5">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-800 -z-10" />
                    {[
                      { n:'New Lead', v: filtered.filter(l=>l.type==='Creator' && l.stage==='New Lead').length },
                      { n:'Contacted', v: filtered.filter(l=>l.type==='Creator' && l.stage==='Contacted').length },
                      { n:'Interested', v: filtered.filter(l=>l.type==='Creator' && l.stage==='Interested').length },
                      { n:'Reg. Started', v: filtered.filter(l=>l.type==='Creator' && l.stage==='Registration Started').length },
                      { n:'Registered', v: filtered.filter(l=>l.type==='Creator' && l.stage==='Registered').length },
                      { n:'KYC Submitted', v: filtered.filter(l=>l.type==='Creator' && l.stage==='KYC Submitted').length },
                      { n:'KYC Approved', v: filtered.filter(l=>l.type==='Creator' && l.stage==='KYC Approved').length },
                      { n:'VIP Creator', v: filtered.filter(l=>l.type==='Creator' && l.stage==='VIP').length }
                    ].map((s,i) => (
                      <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-panel border border-neon-purple/50 flex items-center justify-center text-[10px] font-bold text-neon-purple shadow-[0_0_10px_rgba(157,78,221,0.2)]">{s.v}</div>
                        <span className="text-[9px] text-gray-400 text-center leading-tight">{s.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-panel/30 border border-gray-800/50 rounded-2xl p-4 shadow-lg">
                <h3 className="text-sm font-bold text-neon-pink mb-4">Fan Pipeline <span className="text-gray-500 font-normal">{filtered.filter(l => l.type === 'Fan').length} Total &gt;</span></h3>
                <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                  <div className="flex justify-between items-center relative min-w-[650px] py-1.5">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-800 -z-10" />
                    {[
                      { n:'New Lead', v: filtered.filter(l=>l.type==='Fan' && l.stage==='New Lead').length },
                      { n:'Contacted', v: filtered.filter(l=>l.type==='Fan' && l.stage==='Contacted').length },
                      { n:'Registered', v: filtered.filter(l=>l.type==='Fan' && l.stage==='Registered').length },
                      { n:'First Deposit', v: filtered.filter(l=>l.type==='Fan' && l.stage==='First Deposit').length },
                      { n:'First Purchase', v: filtered.filter(l=>l.type==='Fan' && l.stage==='First Purchase').length },
                      { n:'Joined Room', v: filtered.filter(l=>l.type==='Fan' && l.stage==='Joined Room').length },
                      { n:'Active Fan', v: filtered.filter(l=>l.type==='Fan' && l.stage==='Active').length },
                      { n:'VIP Fan', v: filtered.filter(l=>l.type==='Fan' && l.stage==='VIP').length }
                    ].map((s,i) => (
                      <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-panel border border-neon-pink/50 flex items-center justify-center text-[10px] font-bold text-neon-pink shadow-[0_0_10px_rgba(255,0,127,0.2)]">{s.v}</div>
                        <span className="text-[9px] text-gray-400 text-center leading-tight">{s.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Analytics Sidebar (Sticky) */}
          <div className="w-full xl:w-[320px] shrink-0 xl:sticky xl:top-[88px]">
            <LeadAnalytics leads={filtered} />
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showAddLead && config.canAdd && <AddLeadModal onClose={() => setShowAddLead(false)} onAdd={addItem} />}
        {callLead && config.canAct && <CallLeadModal lead={callLead} onClose={() => setCallLead(null)} />}
        {viewLead && <ProfileModal open={!!viewLead} onClose={() => setViewLead(null)} lead={viewLead} />}
      </AnimatePresence>
    </>
  );
}
