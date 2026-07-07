import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Users, Bell, Lock, CreditCard, Link2, List, Shield, Zap, Mail, Bot, Palette, Check, Download, Upload, Database, Trash2, ChevronRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { AccountSettings, TeamRolesSettings, NotificationsSettings, SecuritySettings, BillingSettings, IntegrationsSettings, CustomFieldsSettings, PermissionsSettings, AutomationSettings, InboxSettings, AiSettings, AppearanceSettings } from '../components/settings/SettingsPanels';

const NAV_CATEGORIES = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'account', label: 'Account', icon: User },
  { id: 'team', label: 'Team & Roles', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Link2 },
  { id: 'custom_fields', label: 'Custom Fields', icon: List },
  { id: 'permissions', label: 'Data & Permissions', icon: Shield },
  { id: 'automation', label: 'Automation', icon: Zap },
  { id: 'inbox', label: 'Inbox Settings', icon: Mail },
  { id: 'ai', label: 'AI Preferences', icon: Bot },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [toggles, setToggles] = useState({
    darkMode: true,
    compactView: false,
    autoSave: true,
    showTips: true
  });
  const { addToast } = useToast();

  const handleToggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));
  
  const handleSave = () => addToast('Settings saved successfully', 'success');
  const handleAction = (msg) => addToast(msg, 'info');

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
            Settings <span className="text-sm font-normal text-muted sm:ml-2">Manage your account, preferences and system configurations</span>
          </h2>
        </motion.div>
      </div>

      {/* 3-Column Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Column 1: Left Sticky Navigation */}
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto custom-scrollbar w-full lg:w-56 shrink-0 lg:sticky lg:top-24 self-start pb-2 lg:pb-0">
          {NAV_CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 lg:gap-3 px-4 py-2 lg:py-3 rounded-lg text-xs font-bold whitespace-nowrap transition-colors w-auto lg:w-full ${
                activeTab === cat.id ? 'bg-neon-blue/10 border-b-2 lg:border-b-0 lg:border-l-2 border-neon-blue text-neon-blue' : 'text-gray-400 hover:bg-gray-900 hover:text-white border-b-2 lg:border-b-0 lg:border-l-2 border-transparent'
              }`}
            >
              <cat.icon size={16} className="shrink-0" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Column 2: Main Configuration Area */}
        <div className="flex-1 glass-panel p-6 flex flex-col space-y-8 min-w-0">
          
          {activeTab === 'account' && <AccountSettings onSave={handleAction} />}
          {activeTab === 'team' && <TeamRolesSettings onSave={handleAction} />}
          {activeTab === 'notifications' && <NotificationsSettings onSave={handleAction} />}
          {activeTab === 'security' && <SecuritySettings onSave={handleAction} />}
          {activeTab === 'billing' && <BillingSettings onSave={handleAction} />}
          {activeTab === 'integrations' && <IntegrationsSettings onSave={handleAction} />}
          {activeTab === 'custom_fields' && <CustomFieldsSettings onSave={handleAction} />}
          {activeTab === 'permissions' && <PermissionsSettings onSave={handleAction} />}
          {activeTab === 'automation' && <AutomationSettings onSave={handleAction} />}
          {activeTab === 'inbox' && <InboxSettings onSave={handleAction} />}
          {activeTab === 'ai' && <AiSettings onSave={handleAction} />}
          {activeTab === 'appearance' && <AppearanceSettings onSave={handleAction} />}

          {activeTab === 'general' && (
            <>
          {/* General Settings Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">General Settings</h3>
                <p className="text-[10px] text-gray-400 mt-1">Manage your organization and system preferences</p>
              </div>
              <button onClick={handleSave} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">Save Changes</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Organization Name</label>
                <input type="text" defaultValue="PlayGroundX" className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Time Zone</label>
                <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue appearance-none">
                  <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                  <option>(UTC-08:00) Pacific Time (US & Canada)</option>
                  <option>(UTC+00:00) Greenwich Mean Time</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Date Format</label>
                <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue appearance-none">
                  <option>May 20, 2025 (MMM DD, YYYY)</option>
                  <option>20/05/2025 (DD/MM/YYYY)</option>
                  <option>2025-05-20 (YYYY-MM-DD)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Time Format</label>
                <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue appearance-none">
                  <option>10:45 AM (12 Hour)</option>
                  <option>10:45 (24 Hour)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Default Language</label>
                <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue appearance-none">
                  <option>English (US)</option>
                  <option>Spanish (ES)</option>
                  <option>French (FR)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 block mb-1">Currency</label>
                <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue appearance-none">
                  <option>USD - US Dollar ($)</option>
                  <option>EUR - Euro (€)</option>
                  <option>GBP - British Pound (£)</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Preferences Section */}
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">System Preferences</h3>
                <p className="text-[10px] text-gray-400 mt-1">Configure system behavior and default settings</p>
              </div>
              <button onClick={handleSave} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">Save Changes</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Toggles */}
              <div className="space-y-6">
                {[
                  { id: 'darkMode', label: 'Enable Dark Mode', desc: 'Switch between light and dark appearance' },
                  { id: 'compactView', label: 'Compact View', desc: 'Show more content in less space' },
                  { id: 'autoSave', label: 'Auto Save', desc: 'Automatically save changes' },
                  { id: 'showTips', label: 'Show Onboarding Tips', desc: 'Show helpful tips for new features' }
                ].map(t => (
                  <div key={t.id} className="flex justify-between items-center pr-4">
                    <div>
                      <div className="text-[11px] font-bold text-white">{t.label}</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">{t.desc}</div>
                    </div>
                    <div onClick={() => handleToggle(t.id)} className={`w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${toggles[t.id] ? 'bg-neon-blue' : 'bg-gray-700'}`}>
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform ${toggles[t.id] ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Selects */}
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Items Per Page</label>
                  <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue appearance-none">
                    <option>10 Number of items to display in tables</option>
                    <option>25</option>
                    <option>50</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Default Landing Page</label>
                  <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue appearance-none">
                    <option>Dashboard</option>
                    <option>Tasks</option>
                    <option>Conversations</option>
                  </select>
                  <p className="text-[9px] text-gray-500 mt-1">Choose your default page after login</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Activity Refresh Interval</label>
                  <select className="w-full bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue appearance-none">
                    <option>30 seconds</option>
                    <option>1 minute</option>
                    <option>5 minutes</option>
                  </select>
                  <p className="text-[9px] text-gray-500 mt-1">Automatically refresh data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-sm font-bold text-white">Data Management</h3>
              <p className="text-[10px] text-gray-400 mt-1">Manage your data and system operations</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/30 text-center flex flex-col items-center justify-between gap-3 group hover:border-green-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Download size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white mb-1">Export Data</div>
                  <div className="text-[9px] text-gray-500 leading-tight">Export your data in CSV or Excel format</div>
                </div>
                <button onClick={() => handleAction('Export started')} className="w-full text-[10px] font-bold text-green-400 py-1.5 border border-green-500/30 rounded hover:bg-green-500/10 transition-colors">Export Now</button>
              </div>

              <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/30 text-center flex flex-col items-center justify-between gap-3 group hover:border-blue-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Upload size={18} className="text-blue-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white mb-1">Import Data</div>
                  <div className="text-[9px] text-gray-500 leading-tight">Import leads, contacts and other data</div>
                </div>
                <button onClick={() => handleAction('Import modal opened')} className="w-full text-[10px] font-bold text-blue-400 py-1.5 border border-blue-500/30 rounded hover:bg-blue-500/10 transition-colors">Import Now</button>
              </div>

              <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/30 text-center flex flex-col items-center justify-between gap-3 group hover:border-purple-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Database size={18} className="text-purple-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white mb-1">Backup Data</div>
                  <div className="text-[9px] text-gray-500 leading-tight">Create a backup of your data</div>
                </div>
                <button onClick={() => handleAction('Backup initiated')} className="w-full text-[10px] font-bold text-purple-400 py-1.5 border border-purple-500/30 rounded hover:bg-purple-500/10 transition-colors">Backup Now</button>
              </div>

              <div className="p-4 border border-gray-800 rounded-xl bg-gray-900/30 text-center flex flex-col items-center justify-between gap-3 group hover:border-yellow-500/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Trash2 size={18} className="text-yellow-500" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white mb-1">Clear Cache</div>
                  <div className="text-[9px] text-gray-500 leading-tight">Clear system cache and temporary data</div>
                </div>
                <button onClick={() => handleAction('Cache cleared')} className="w-full text-[10px] font-bold text-yellow-400 py-1.5 border border-yellow-500/30 rounded hover:bg-yellow-500/10 transition-colors">Clear Cache</button>
              </div>
            </div>
          </div>
          </>
          )}

        </div>

        {/* Column 3: Right Utility Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          
          {/* Account Information */}
          <div className="glass-panel p-5">
            <h3 className="text-[11px] font-bold text-white mb-4 border-b border-gray-800 pb-2">Account Information</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?img=47" className="w-12 h-12 rounded-full border border-gray-700" alt="" />
              <div>
                <div className="text-sm font-bold text-white">Sarah Agent</div>
                <div className="text-[10px] text-gray-500">sarah.agent@pgx.com</div>
              </div>
            </div>
            <button className="w-full py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-neon-blue text-[10px] font-bold rounded transition-colors">Update Profile</button>
          </div>

          {/* Subscription Plan */}
          <div className="glass-panel p-5">
            <h3 className="text-[11px] font-bold text-white mb-4 border-b border-gray-800 pb-2">Subscription Plan</h3>
            <div className="flex items-center gap-2 mb-2">
               <Crown size={18} className="text-purple-400" />
               <span className="text-sm font-black text-purple-400">Enterprise Plan</span>
            </div>
            <div className="text-lg font-black text-white mb-1">$299 <span className="text-[10px] text-gray-500 font-normal">/ month</span></div>
            <div className="text-[9px] text-gray-500 mb-4">Next billing: June 20, 2025</div>
            <ul className="space-y-2 mb-4">
              {['Unlimited Users', 'Advanced Analytics', 'Priority Support', 'Custom Integrations'].map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-gray-300">
                  <Check size={12} className="text-neon-green" /> {f}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 bg-gray-900 border border-gray-800 hover:bg-gray-800 text-neon-blue text-[10px] font-bold rounded transition-colors">Manage Subscription</button>
          </div>

          {/* Quick Settings */}
          <div className="glass-panel p-5">
            <h3 className="text-[11px] font-bold text-white mb-4 border-b border-gray-800 pb-2">Quick Settings</h3>
            <div className="space-y-1 -mx-2">
              {[
                { icon: Mail, title: 'Email Settings', desc: 'Configure email preferences' },
                { icon: Bell, title: 'SMS Settings', desc: 'Configure SMS preferences' },
                { icon: Bell, title: 'Push Notifications', desc: 'Configure push notification settings' },
                { icon: Link2, title: 'API Settings', desc: 'Manage API keys and webhooks' }
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer group">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                    <q.icon size={14} className="text-neon-blue shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-white truncate">{q.title}</div>
                      <div className="text-[8px] text-gray-500 truncate">{q.desc}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel p-5">
             <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-4">
              <h3 className="text-[11px] font-bold text-white">Recent Activity</h3>
              <span className="text-[9px] text-neon-blue hover:underline cursor-pointer">View All</span>
            </div>
            <div className="space-y-4">
              {[
                { color: 'bg-blue-500', action: 'You updated notification settings', time: 'May 20, 2025 10:30 AM' },
                { color: 'bg-green-500', action: 'Mike Agent added new integration', time: 'May 20, 2025 09:45 AM' },
                { color: 'bg-purple-500', action: 'System backup completed', time: 'May 20, 2025 02:15 AM' }
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {i < 2 && <div className="absolute left-1 top-4 bottom-[-16px] w-px bg-gray-800" />}
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 relative z-10 ${act.color}`} />
                  <div>
                    <div className="text-[10px] text-white leading-tight">{act.action}</div>
                    <div className="text-[8px] text-gray-500 mt-0.5">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function Crown(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>;
}
