import { useState, useMemo } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlatformData } from '../../contexts/DataContext';
import { Clock, Search, TrendingUp, Users, Activity, AlertTriangle, Mail, Eye, X, CheckCircle2 } from 'lucide-react';

const STATUS_STYLE = { Trial:'bg-yellow-500/10 text-yellow-500 border-yellow-500/30', Expiring:'bg-red-500/10 text-red-500 border-red-500/30' };
const PLAN_STYLE   = { Enterprise:'bg-neon-purple/10 text-neon-purple border-neon-purple/30', Pro:'bg-neon-blue/10 text-neon-blue border-neon-blue/30', Basic:'bg-neon-green/10 text-neon-green border-neon-green/30' };

export default function PlatformTrialAccounts() {
  const { addToast } = useToast();
  const [trials, { updateItem: updateTrial }] = usePlatformData('trialAccounts');
  const [q, setQ] = useState('');
  const [planF, setPlanF] = useState('All');
  const [staF, setStaF]   = useState('All');
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'convert', 'mail'

  const filtered = useMemo(()=>(trials||[]).filter(t=>
    (!q || t.name.toLowerCase().includes(q.toLowerCase()) || t.email.toLowerCase().includes(q.toLowerCase())) &&
    (planF==='All' || t.plan===planF)
  ), [trials, q, planF]);

  const expiring = (trials||[]).filter(t=>t.status==='Expiring').length;
  const highAct  = (trials||[]).filter(t=>t.activityScore>=80).length;
  const avgScore = trials?.length ? Math.round((trials||[]).reduce((s,t)=>s+t.activityScore,0)/(trials||[]).length) : 0;

  return (
    <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-6 h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3"><Clock size={22} className="text-yellow-500"/>Trial Accounts</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor and convert active platform trials.</p>
        </div>
        <button onClick={() => setModalType('bulk_mail')} className="px-4 py-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500/20 rounded-lg text-sm font-black flex items-center gap-2 shrink-0"><Mail size={14}/>Send Bulk Reminder</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Total Trials',    value:(trials||[]).length, icon:Users,        color:'yellow-500' },
          { label:'Expiring Soon',   value:expiring,            icon:AlertTriangle,color:'red-500'   },
          { label:'Highly Active',   value:highAct,             icon:Activity,     color:'neon-green' },
          { label:'Avg Activity',    value:`${avgScore}%`,      icon:TrendingUp,   color:'neon-blue'  },
        ].map((k,i)=>(
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${k.color}/10 border border-${k.color}/20 text-${k.color} shrink-0`}><k.icon size={20}/></div>
            <div><div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{k.label}</div><div className="text-2xl font-black text-white">{k.value}</div></div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-800">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by company or email..." className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-8 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-neon-blue"/>
          </div>
          {['All','Enterprise','Pro','Basic'].map(p=>(
            <button key={p} onClick={()=>setPlanF(p)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${planF===p?'bg-neon-blue text-black':'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}>{p}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-950 text-[10px] uppercase tracking-wider text-gray-500 font-bold border-b border-gray-800">
              <tr><th className="px-5 py-3">Company</th><th className="px-5 py-3">Desired Plan</th><th className="px-5 py-3">Industry</th><th className="px-5 py-3">Users</th><th className="px-5 py-3">Started</th><th className="px-5 py-3">Ends</th><th className="px-5 py-3">Days Left</th><th className="px-5 py-3">Activity</th><th className="px-5 py-3">Logins</th><th className="px-5 py-3">API Calls</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((t,i)=>(
                <motion.tr key={t.id} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}} className="hover:bg-white/4 group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500/20 to-neon-blue/20 border border-gray-700 flex items-center justify-center text-[10px] font-black text-white">{t.name.charAt(0)}</div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">{t.name}</div>
                        <div className="text-[10px] text-gray-500">{t.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${PLAN_STYLE[t.plan]||'text-gray-400 bg-gray-800 border-gray-700'}`}>{t.plan}</span></td>
                  <td className="px-5 py-3 text-xs text-gray-400">{t.industry}</td>
                  <td className="px-5 py-3 text-sm text-gray-300">{t.users}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{t.trialStart}</td>
                  <td className="px-5 py-3 text-xs text-gray-400">{t.trialEnd}</td>
                  <td className="px-5 py-3"><span className={`text-xs font-bold ${t.daysLeft<=10?'text-red-500':t.daysLeft<=20?'text-yellow-500':'text-neon-green'}`}>{t.daysLeft}d</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-800 rounded-full h-1.5 w-16">
                        <div className={`h-1.5 rounded-full ${t.activityScore>=80?'bg-neon-green':t.activityScore>=50?'bg-yellow-500':'bg-red-500'}`} style={{width:`${t.activityScore}%`}}/>
                      </div>
                      <span className="text-xs text-gray-400">{t.activityScore}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-300">{t.logins}</td>
                  <td className="px-5 py-3 text-sm font-mono text-gray-400">{t.apiCalls.toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${STATUS_STYLE[t.status]}`}>{t.status}</span></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setSelectedTrial(t); setModalType('view'); }} className="p-1.5 bg-gray-800 hover:bg-neon-blue/20 hover:text-neon-blue text-gray-400 rounded transition-colors"><Eye size={13}/></button>
                      <button onClick={() => { setSelectedTrial(t); setModalType('convert'); }} className="px-2 py-1 bg-neon-green/10 text-neon-green border border-neon-green/30 text-xs font-bold rounded hover:bg-neon-green/20">Convert</button>
                      <button onClick={() => { setSelectedTrial(t); setModalType('mail'); }} className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded"><Mail size={13}/></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-500">Showing {filtered.length} of {(trials||[]).length} trial accounts</div>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {(selectedTrial || modalType === 'bulk_mail') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="px-5 py-4 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                  {modalType === 'view' && 'Trial Details'}
                  {modalType === 'convert' && 'Manual Conversion'}
                  {modalType === 'mail' && 'Send Email to Trial'}
                  {modalType === 'bulk_mail' && 'Send Bulk Reminder'}
                </h3>
                <button onClick={() => { setSelectedTrial(null); setModalType(null); }} className="text-gray-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 text-sm text-gray-300">
                {modalType === 'view' && selectedTrial && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b border-[#30363d] pb-4">
                      <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-xl font-black text-white shrink-0">
                        {selectedTrial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{selectedTrial.name}</div>
                        <div className="text-xs text-gray-400">{selectedTrial.email}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Desired Plan</div>
                        <div className="font-medium text-white">{selectedTrial.plan}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</div>
                        <div className="font-medium text-white">{selectedTrial.status}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Trial Ends In</div>
                        <div className="font-medium text-emerald-400">{selectedTrial.daysLeft} days</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Activity Score</div>
                        <div className="font-medium text-white">{selectedTrial.activityScore}%</div>
                      </div>
                    </div>
                  </div>
                )}

                {modalType === 'convert' && selectedTrial && (
                  <div className="text-center py-4">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-neon-green" />
                    <p className="text-base text-white font-bold mb-2">Initiate Manual Conversion?</p>
                    <p className="text-xs text-gray-400">
                      You are about to force a conversion flow for <b>{selectedTrial.name}</b>.
                      The AI Success Manager will send an immediate payment link.
                    </p>
                  </div>
                )}

                {modalType === 'mail' && selectedTrial && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">To</label>
                      <input type="text" readOnly value={selectedTrial.email} className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Subject</label>
                      <input type="text" placeholder="Following up on your trial..." className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Message</label>
                      <textarea rows={4} placeholder="Type your message here..." className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"></textarea>
                    </div>
                  </div>
                )}

                {modalType === 'bulk_mail' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg flex items-start gap-3">
                      <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                      <div className="text-xs text-yellow-500">
                        You are about to send a bulk email to <b>{(trials||[]).length}</b> trial accounts.
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Subject</label>
                      <input type="text" placeholder="Your trial is expiring soon..." className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Message</label>
                      <textarea rows={4} placeholder="Type your message here..." className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"></textarea>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-[#30363d] flex justify-end gap-2 bg-[#161b22]">
                <button onClick={() => { setSelectedTrial(null); setModalType(null); }} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  {modalType === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalType !== 'view' && (
                  <button onClick={() => {
                    if(modalType === 'convert') {
                      updateTrial(selectedTrial.id, { status: 'Active' });
                      addToast('success', 'Conversion Triggered', 'Manual conversion initiated');
                    }
                    if(modalType === 'mail') addToast('success', 'Email Sent', 'Message sent to ' + selectedTrial.email);
                    if(modalType === 'bulk_mail') addToast('success', 'Bulk Mail Queued', 'Emails are being sent to all trial accounts.');
                    setSelectedTrial(null);
                    setModalType(null);
                  }} className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${
                    modalType === 'convert' ? 'bg-neon-green hover:bg-neon-green/80 text-black' : 
                    'bg-neon-blue hover:bg-neon-blue/80 text-black'
                  }`}>
                    {modalType === 'convert' ? 'Trigger Conversion' : modalType === 'bulk_mail' ? 'Send Bulk Mail' : 'Send Email'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
