import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Plus, Settings, ExternalLink, CheckCircle, Zap, Shield, HelpCircle, X, Server, Key, Copy } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useToast } from '../contexts/ToastContext';

const allIntegrations = [
  { id: 'stripe', name: 'Stripe', desc: 'Payment processing & billing infrastructure', category: 'Finance', icon: '💳', color: '#6772E5', popular: true },
  { id: 'twilio', name: 'Twilio', desc: 'Global SMS & WhatsApp messaging', category: 'Communication', icon: '💬', color: '#F22F46', popular: true },
  { id: 'sendgrid', name: 'SendGrid', desc: 'High-volume email delivery service', category: 'Communication', icon: '📧', color: '#009DD9', popular: true },
  { id: 'zoom', name: 'Zoom', desc: 'Video conferencing for VIP sessions', category: 'Video', icon: '📹', color: '#2D8CFF', popular: false },
  { id: 'slack', name: 'Slack', desc: 'Internal team notifications & alerts', category: 'Productivity', icon: '📱', color: '#E01E5A', popular: true },
  { id: 'zendesk', name: 'Zendesk', desc: 'Customer support ticketing system', category: 'Support', icon: '🎧', color: '#03363D', popular: false },
  { id: 'mailchimp', name: 'Mailchimp', desc: 'Marketing automation and email', category: 'Marketing', icon: '🐵', color: '#FFE01B', popular: false },
  { id: 'hubspot', name: 'HubSpot', desc: 'Inbound marketing and CRM platform', category: 'CRM', icon: '🟠', color: '#FF7A59', popular: false },
];

export default function Integrations() {
  const [activeTab, setActiveTab] = useState('All Integrations');
  const [connectedApps, setConnectedApps] = useState(['stripe', 'twilio', 'slack', 'sendgrid']);
  const [configModal, setConfigModal] = useState(null);
  const { addToast } = useToast();

  const tabs = ['All Integrations', 'Connected', 'Available', 'Webhooks', 'API Keys'];

  const toggleConnection = (id, name) => {
    if (connectedApps.includes(id)) {
      setConnectedApps(connectedApps.filter(appId => appId !== id));
      addToast('info', 'Disconnected', `${name} has been disconnected.`);
    } else {
      setConnectedApps([...connectedApps, id]);
      addToast('success', 'Connected!', `${name} is now connected to your CRM.`);
    }
  };

  const getFilteredIntegrations = () => {
    if (activeTab === 'Connected') return allIntegrations.filter(i => connectedApps.includes(i.id));
    if (activeTab === 'Available') return allIntegrations.filter(i => !connectedApps.includes(i.id));
    return allIntegrations;
  };

  const donutData = [
    { name: 'Connected', value: connectedApps.length, color: '#39ff14' },
    { name: 'Available', value: allIntegrations.length - connectedApps.length, color: '#1f2937' },
  ];

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            <Link2 size={22} className="text-neon-blue" /> Integrations Center
          </h2>
          <p className="text-sm text-muted mt-0.5">Connect third-party services, APIs, and Webhooks</p>
        </motion.div>
        <button onClick={() => addToast('info', 'Custom Integration', 'Opening custom webhook configuration builder...')} className="bg-neon-blue text-black font-bold text-sm px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all flex items-center gap-2">
          <Plus size={16} /> Custom Integration
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto custom-scrollbar w-full">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === t ? 'text-neon-blue border-neon-blue' : 'text-gray-500 border-transparent hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {(activeTab === 'All Integrations' || activeTab === 'Connected' || activeTab === 'Available') && (
            <>
              {/* Popular Integrations Section */}
              {activeTab === 'All Integrations' && (
                <div>
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Popular Integrations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allIntegrations.filter(i => i.popular).map(inv => renderIntegrationCard(inv))}
                  </div>
                </div>
              )}

              {/* All/Filtered Integrations Section */}
              <div>
                {activeTab === 'All Integrations' && <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-6 mb-4">More Integrations</h3>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredIntegrations()
                    .filter(i => activeTab === 'All Integrations' ? !i.popular : true)
                    .map(inv => renderIntegrationCard(inv))}
                </div>
                {getFilteredIntegrations().length === 0 && (
                  <div className="glass-panel p-10 text-center text-gray-500 flex flex-col items-center">
                    <Link2 size={32} className="mb-2 opacity-50" />
                    <p>No integrations found in this category.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Webhooks Tab Content */}
          {activeTab === 'Webhooks' && (
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Configured Webhooks</h3>
                <button className="text-[10px] bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700">Add Endpoint</button>
              </div>
              <div className="space-y-3">
                {[
                  { url: 'https://api.playground.com/v1/webhook/stripe', events: 'payment.success, payment.failed', status: 'Active' },
                  { url: 'https://api.playground.com/v1/webhook/twilio', events: 'message.received', status: 'Active' },
                  { url: 'https://api.playground.com/v1/webhook/custom', events: 'user.created', status: 'Inactive' }
                ].map((w, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-900/50 border border-gray-800 rounded-lg gap-4">
                    <div>
                      <div className="text-[11px] font-bold text-white mb-1">{w.url}</div>
                      <div className="text-[9px] text-gray-500 font-mono">{w.events}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <span className={`text-[9px] px-2 py-0.5 rounded border ${w.status === 'Active' ? 'text-neon-green border-neon-green/30 bg-neon-green/10' : 'text-gray-400 border-gray-600 bg-gray-800'}`}>{w.status}</span>
                      <button className="text-gray-400 hover:text-white"><Settings size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Keys Tab Content */}
          {activeTab === 'API Keys' && (
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white">Active API Keys</h3>
                <button className="text-[10px] bg-neon-blue text-black px-3 py-1.5 rounded hover:bg-cyan-400 font-bold">Generate New Key</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Production App Key', prefix: 'pk_live_8f92...', created: 'May 10, 2025', lastUsed: '2 mins ago' },
                  { name: 'Staging Environment', prefix: 'pk_test_3a1b...', created: 'Apr 22, 2025', lastUsed: '5 hours ago' }
                ].map((k, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg gap-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400"><Key size={14} /></div>
                      <div>
                        <div className="text-[11px] font-bold text-white mb-0.5">{k.name}</div>
                        <div className="text-[9px] text-gray-500">Created: {k.created}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded border border-gray-800">
                        <span className="text-[10px] text-gray-400 font-mono">{k.prefix}</span>
                        <button className="text-gray-500 hover:text-white"><Copy size={12} /></button>
                      </div>
                      <div className="text-[9px] text-gray-500 text-right w-20">Last used:<br/>{k.lastUsed}</div>
                      <button className="text-red-400 hover:text-red-300 text-[10px] font-bold">Revoke</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar Analytics */}
        <div className="w-full xl:w-80 shrink-0 space-y-4">
          
          {/* Connection Stats */}
          <div className="glass-panel p-5 flex flex-col items-center">
            <h3 className="text-[11px] font-bold text-white w-full text-left mb-2">Platform Connectivity</h3>
            <div className="relative w-40 h-40 mt-4 mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                    {donutData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-black text-white">{connectedApps.length}</span>
                 <span className="text-[8px] text-gray-500 uppercase tracking-wider">Connected</span>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-neon-green" /> <span className="text-gray-300">Active</span></div>
              <span className="text-white font-bold">{connectedApps.length}</span>
            </div>
            <div className="w-full mt-2 flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-700" /> <span className="text-gray-300">Available</span></div>
              <span className="text-white font-bold">{allIntegrations.length - connectedApps.length}</span>
            </div>
          </div>

          {/* Integration Benefits */}
          <div className="glass-panel p-5">
            <h3 className="text-[11px] font-bold text-white mb-4">Why Connect Apps?</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0"><Zap size={14} className="text-blue-500" /></div>
                <div>
                  <div className="text-[10px] font-bold text-white mb-0.5">Automate Workflows</div>
                  <div className="text-[9px] text-gray-400 leading-snug">Trigger actions automatically across your tech stack.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0"><Server size={14} className="text-green-500" /></div>
                <div>
                  <div className="text-[10px] font-bold text-white mb-0.5">Centralize Data</div>
                  <div className="text-[9px] text-gray-400 leading-snug">Bring all your fan and revenue data into one dashboard.</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0"><Shield size={14} className="text-purple-500" /></div>
                <div>
                  <div className="text-[10px] font-bold text-white mb-0.5">Secure Connections</div>
                  <div className="text-[9px] text-gray-400 leading-snug">Enterprise-grade OAuth and API token encryption.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}
          <div className="glass-panel p-5 border border-neon-blue/20 bg-neon-blue/5">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={16} className="text-neon-blue" />
              <h3 className="text-[11px] font-bold text-white">Need Help Integrating?</h3>
            </div>
            <p className="text-[10px] text-gray-400 leading-snug mb-4">Our engineering team is available 24/7 to help you set up custom webhooks or API endpoints.</p>
            <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-bold rounded-lg transition-colors border border-gray-700">Read Documentation</button>
          </div>

        </div>
      </div>

      {/* Configure Modal */}
      <AnimatePresence>
        {configModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfigModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: `${configModal.color}15`, border: `1px solid ${configModal.color}30` }}>
                    {configModal.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white">Configure {configModal.name}</h3>
                </div>
                <button onClick={() => setConfigModal(null)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-[11px] text-gray-400 mb-4">{configModal.desc}</div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">API Key</label>
                  <input type="password" value="************************" readOnly className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-neon-blue" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-1">Webhook Secret</label>
                  <input type="password" value="whsec_test12345" readOnly className="w-full bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-neon-blue" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-gray-400 font-bold">Sync Data Automatically</span>
                  <div className="w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer bg-neon-green/80">
                    <div className="w-3 h-3 rounded-full bg-white translate-x-4 transition-transform" />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-between">
                <button onClick={() => { toggleConnection(configModal.id, configModal.name); setConfigModal(null); }} className="px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors">Disconnect</button>
                <div className="flex gap-2">
                  <button onClick={() => setConfigModal(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button onClick={() => { setConfigModal(null); addToast('success', 'Changes Saved', `Settings for ${configModal.name} updated.`); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-neon-blue text-black hover:bg-cyan-400 transition-colors">Save Changes</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // Helper render function for integration cards
  function renderIntegrationCard(inv) {
    const isConnected = connectedApps.includes(inv.id);
    return (
      <motion.div key={inv.id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="glass-panel p-5 relative overflow-hidden flex flex-col border border-gray-800 hover:border-gray-600 transition-colors group">
        {isConnected && (
          <div className="absolute top-0 right-0 w-12 h-12 bg-neon-green/10 flex items-start justify-end p-1.5" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}>
            <CheckCircle size={10} className="text-neon-green relative -top-0.5 -right-0.5 drop-shadow-[0_0_5px_rgba(57,255,20,0.8)]" />
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: `${inv.color}15`, border: `1px solid ${inv.color}30` }}>
            {inv.icon}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">{inv.name}</h3>
            <span className="text-[8px] text-gray-500 uppercase">{inv.category}</span>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mb-6 flex-1 line-clamp-2">{inv.desc}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${isConnected ? 'bg-neon-green/10 text-neon-green border-neon-green/30' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
            {isConnected ? 'Connected' : 'Available'}
          </span>
          {isConnected ? (
            <button onClick={() => setConfigModal(inv)} className="text-[10px] text-neon-blue font-bold hover:underline flex items-center gap-1">
              Manage <Settings size={10} />
            </button>
          ) : (
            <button onClick={() => toggleConnection(inv.id, inv.name)} className="text-[10px] text-white font-bold bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded transition-colors">
              Connect
            </button>
          )}
        </div>
      </motion.div>
    );
  }
}
