import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Bell, Lock, CreditCard, Link2, List, Shield, Zap, Mail, Bot, Palette, Check, Plus, Trash2, Download, ExternalLink, RefreshCw, Eye, AlertCircle, Sparkles, Sliders, Calendar, Clock, DollarSign, Key, Globe, CheckCircle2, XCircle, AlertTriangle, Upload, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAppPath } from '../../utils/routing';

export function AccountSettings({ onSave }) {
  const [profile, setProfile] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@pgx.com',
    phone: '+1 (555) 019-2834',
    title: 'Executive CRM Administrator',
    bio: 'Leading VIP creator onboarding and enterprise client relationships at PlayGroundX.'
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Account Profile & Personal Details</h3>
          <p className="text-[10px] text-gray-400 mt-1">Manage your identity, contact information, and security credentials</p>
        </div>
        <button onClick={() => onSave('Account Profile Updated')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors flex items-center gap-1.5">
          <Save size={12} /> Save Changes
        </button>
      </div>

      {/* Avatar Upload Box */}
      <div className="flex items-center gap-5 p-4 bg-gray-900/40 border border-gray-800 rounded-2xl">
        <img src="https://i.pravatar.cc/150?img=47" className="w-16 h-16 rounded-2xl object-cover border-2 border-neon-blue/40 shadow-lg" alt="Avatar" />
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-white">Profile Avatar</div>
          <div className="text-[10px] text-gray-400">JPG, GIF or PNG. Recommended size 400x400px.</div>
          <div className="flex gap-2 pt-1">
            <button onClick={() => onSave('New avatar uploaded')} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-[10px] rounded-lg border border-gray-700 transition-colors flex items-center gap-1">
              <Upload size={12} /> Upload New Photo
            </button>
            <button onClick={() => onSave('Avatar reset to default')} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-[10px] rounded-lg border border-red-500/30 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
          <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Work Email</label>
          <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number</label>
          <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Job Title</label>
          <input value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue" />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Professional Bio / Signature</label>
        <textarea rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-black/40 border border-gray-800 rounded-xl p-3.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue" />
      </div>

      {/* Password Change Section */}
      <div className="pt-4 border-t border-gray-800 space-y-4">
        <h4 className="text-xs font-black text-white flex items-center gap-2">
          <Lock size={14} className="text-neon-purple" /> Change Password
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="password" placeholder="Current Password" className="bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neon-purple" />
          <input type="password" placeholder="New Password (min 8 chars)" className="bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neon-purple" />
          <input type="password" placeholder="Confirm New Password" className="bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-neon-purple" />
        </div>
        <button onClick={() => onSave('Password updated securely')} className="px-4 py-2 bg-gray-900 border border-gray-700 hover:border-gray-500 text-white font-bold text-[10px] rounded-lg transition-colors">
          Update Password
        </button>
      </div>
    </div>
  );
}

export function TeamRolesSettings({ onSave }) {
  const [roles, setRoles] = useState([
    { id: 'owner', name: 'Platform Owner', count: 1, desc: 'Full administrative access to all tenants, billing, and system settings.', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10', perms: { users: true, billing: true, sla: true, audit: true, export: true } },
    { id: 'admin', name: 'Administrator', count: 3, desc: 'Manage users, routing queues, integrations, and organizational settings.', color: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10', perms: { users: true, billing: false, sla: true, audit: true, export: true } },
    { id: 'manager', name: 'Manager / Supervisor', count: 5, desc: 'Monitor agent live queues, shift transfers, and emergency SLA support (+3).', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', perms: { users: false, billing: false, sla: true, audit: false, export: true } },
    { id: 'senior', name: 'Senior Agent', count: 8, desc: 'Handle VIP creators, high-priority tickets, and KYC legal reviews.', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10', perms: { users: false, billing: false, sla: false, audit: false, export: false } },
    { id: 'agent', name: 'Agent', count: 12, desc: 'Standard client communication, dialer calls, and daily consultation tasks.', color: 'text-gray-300 border-gray-700 bg-gray-800/60', perms: { users: false, billing: false, sla: false, audit: false, export: false } },
  ]);

  const togglePerm = (roleIndex, permKey) => {
    const updated = [...roles];
    updated[roleIndex].perms[permKey] = !updated[roleIndex].perms[permKey];
    setRoles(updated);
    onSave(`Permissions updated for ${updated[roleIndex].name}`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Team Roles & Access Permissions</h3>
          <p className="text-[10px] text-gray-400 mt-1">Configure role-based access control (RBAC) and feature capabilities</p>
        </div>
        <button onClick={() => onSave('New custom role created')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors flex items-center gap-1.5">
          <Plus size={12} /> Create Custom Role
        </button>
      </div>

      <div className="space-y-4">
        {roles.map((role, idx) => (
          <div key={role.id} className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${role.color}`}>
                  {role.name}
                </span>
                <span className="text-[11px] font-bold text-gray-400">{role.count} active staff</span>
              </div>
              <button onClick={() => onSave(`Editing ${role.name} configuration`)} className="text-[10px] font-bold text-gray-400 hover:text-white px-2.5 py-1 bg-gray-800 rounded border border-gray-700 w-fit">
                Edit Role
              </button>
            </div>
            <p className="text-xs text-gray-400">{role.desc}</p>
            
            <div className="pt-2 border-t border-gray-800/60 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: 'users', label: 'Manage Staff' },
                { key: 'billing', label: 'Billing & Plan' },
                { key: 'sla', label: 'Shift / SLA Control' },
                { key: 'export', label: 'Export Leads CSV' },
                { key: 'audit', label: 'View Audit Logs' },
              ].map(perm => (
                <label key={perm.key} className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-bold select-none">
                  <input
                    type="checkbox"
                    checked={role.perms[perm.key]}
                    onChange={() => togglePerm(idx, perm.key)}
                    className="rounded border-gray-700 bg-black/50 text-neon-blue focus:ring-0 w-3.5 h-3.5"
                  />
                  {perm.label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsSettings({ onSave }) {
  const [notifs, setNotifs] = useState({
    emailDigests: true,
    smsAlerts: true,
    slaWarnings: true,
    emergencyBackup: true,
    weeklyKpi: true,
    desktopPush: false
  });

  const toggle = (k, label) => {
    setNotifs(p => ({ ...p, [k]: !p[k] }));
    onSave(`${label} ${!notifs[k] ? 'enabled' : 'disabled'}`);
  };

  const list = [
    { key: 'emailDigests', label: 'Daily Email Digests', desc: 'Receive morning summaries of scheduled VIP sessions and open tickets.' },
    { key: 'smsAlerts', label: 'Urgent SMS & WhatsApp Alerts', desc: 'Instant text messaging when high-priority VIP creators escalate issues.' },
    { key: 'slaWarnings', label: 'SLA Breach Warning Push Alerts', desc: 'Browser notification when any queue wait time exceeds the defined SLA.' },
    { key: 'emergencyBackup', label: 'Emergency Support (+3) Trigger Alerts', desc: 'Notify supervisors immediately when emergency backup counters are activated.' },
    { key: 'weeklyKpi', label: 'Weekly Team KPI Reports', desc: 'Automated Monday report covering agent response speeds and deal closures.' },
    { key: 'desktopPush', label: 'Desktop & Audio Sound Alerts', desc: 'Play subtle acoustic chime when a new live chat or phone dialer session initiates.' },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Notification & Alert Preferences</h3>
          <p className="text-[10px] text-gray-400 mt-1">Control how and when you receive critical system updates and SLA warnings</p>
        </div>
        <button onClick={() => onSave('All notification preferences saved')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Save Preferences
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {list.map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors">
            <div className="space-y-0.5 max-w-xl">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Bell size={14} className={notifs[item.key] ? 'text-neon-green' : 'text-gray-500'} />
                {item.label}
              </div>
              <div className="text-[11px] text-gray-400">{item.desc}</div>
            </div>
            <button
              onClick={() => toggle(item.key, item.label)}
              className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center shrink-0 ${notifs[item.key] ? 'bg-neon-blue' : 'bg-gray-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifs[item.key] ? 'translate-x-6 bg-black font-bold' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecuritySettings({ onSave }) {
  const [twoFactor, setTwoFactor] = useState(true);
  const [timeout, setTimeoutVal] = useState('30 Minutes');
  const [ipWhitelist, setIpWhitelist] = useState('192.168.1.0/24, 10.0.0.0/8');

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Security & Two-Factor Authentication</h3>
          <p className="text-[10px] text-gray-400 mt-1">Protect your enterprise tenant with multi-factor authentication and IP fencing</p>
        </div>
        <button onClick={() => onSave('Security policies updated')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Apply Policies
        </button>
      </div>

      {/* 2FA Banner */}
      <div className="p-5 bg-gradient-to-r from-purple-900/20 to-gray-900 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
            <Key size={20} />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-2">
              Two-Factor Authentication (2FA)
              <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${twoFactor ? 'bg-neon-green/20 text-neon-green border border-neon-green/40' : 'bg-red-500/20 text-red-400'}`}>
                {twoFactor ? 'Enabled & Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Requires an authenticator app (Google Authenticator, Authy, or 1Password) at login.</p>
          </div>
        </div>
        <button onClick={() => { setTwoFactor(!twoFactor); onSave(`2FA ${!twoFactor ? 'Enabled' : 'Disabled'}`); }} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-black text-xs rounded-xl transition-colors shrink-0">
          {twoFactor ? 'Reconfigure App' : 'Enable 2FA Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Session Inactivity Timeout</label>
          <select value={timeout} onChange={e => { setTimeoutVal(e.target.value); onSave(`Session timeout set to ${e.target.value}`); }} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
            <option>15 Minutes</option>
            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>4 Hours (Half Shift)</option>
            <option>8 Hours (Full Shift)</option>
          </select>
          <p className="text-[10px] text-gray-500 mt-1">Automatically log out idle staff members for data security.</p>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">IP Whitelisting / Office VPN Fencing</label>
          <input value={ipWhitelist} onChange={e => setIpWhitelist(e.target.value)} placeholder="e.g. 192.168.1.0/24" className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue" />
          <p className="text-[10px] text-gray-500 mt-1">Comma-separated IP CIDR ranges allowed for administrative login.</p>
        </div>
      </div>

      {/* Active Login Sessions */}
      <div className="space-y-3 pt-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black text-white flex items-center gap-2">
            <Globe size={14} className="text-neon-blue" /> Active Login Sessions (3)
          </h4>
          <button onClick={() => onSave('All other active login sessions revoked')} className="text-[10px] font-bold text-red-400 hover:underline">
            Revoke All Other Sessions
          </button>
        </div>

        <div className="space-y-2">
          {[
            { device: 'Windows PC • Chrome 124', location: 'New York, USA (IP: 192.168.1.42)', time: 'Current Active Session', current: true },
            { device: 'macOS Sonoma • Safari', location: 'London, UK (IP: 82.165.197.1)', time: 'Last active yesterday at 4:12 PM', current: false },
            { device: 'iPhone 15 Pro • iOS App', location: 'New York, USA (IP: 172.56.21.8)', time: 'Last active 3 days ago', current: false },
          ].map((sess, idx) => (
            <div key={idx} className="p-3.5 bg-gray-900/30 border border-gray-800 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {sess.device}
                  {sess.current && <span className="bg-neon-blue/20 text-neon-blue border border-neon-blue/40 text-[9px] px-1.5 py-0.5 rounded uppercase font-black">This Device</span>}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{sess.location} • {sess.time}</div>
              </div>
              {!sess.current && (
                <button onClick={() => onSave('Session revoked')} className="px-2.5 py-1 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 text-[10px] font-bold rounded border border-gray-700 transition-colors">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BillingSettings({ onSave }) {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Subscription & Invoice History</h3>
          <p className="text-[10px] text-gray-400 mt-1">Manage your Enterprise SaaS subscription and automated wire receipts</p>
        </div>
        <button onClick={() => onSave('Billing preferences updated')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Update Payment Method
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-500/40 rounded-2xl space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Current Active Plan</span>
              <h3 className="text-xl font-black text-white mt-1">PlayGroundX Enterprise CRM</h3>
            </div>
            <span className="bg-neon-green/20 text-neon-green border border-neon-green/40 px-2.5 py-1 rounded-full text-[10px] font-black uppercase">
              Active & Healthy
            </span>
          </div>
          <div className="text-2xl font-black text-white">$299 <span className="text-xs font-normal text-gray-400">/ month billed annually</span></div>
          <div className="text-xs text-gray-300 space-y-1 pt-2 border-t border-purple-500/20">
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-neon-green"/> Unlimited Staff Accounts & Queues</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-neon-green"/> Emergency Support (+3 Backup Agents)</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-neon-green"/> 24/7 Dedicated SLA Concierge</div>
          </div>
        </div>

        <div className="p-5 bg-gray-900/40 border border-gray-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Payment Method</span>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-xs shadow">
                VISA
              </div>
              <div>
                <div className="text-sm font-bold text-white">•••• •••• •••• 4242</div>
                <div className="text-[10px] text-gray-400">Expires 08/2028 • Corporate Card</div>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-xs">
            <span className="text-gray-400">Next Auto-Renewal: <strong className="text-white font-bold">June 20, 2025</strong></span>
            <button onClick={() => onSave('Card edit modal opened')} className="text-neon-blue font-bold hover:underline">Edit Card</button>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black text-white flex items-center gap-2">
          <DollarSign size={14} className="text-neon-green" /> Past Invoices & Wire Settlements
        </h4>
        <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-950/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 font-bold border-b border-gray-800 text-[11px]">
              <tr>
                <th className="p-3">Invoice ID</th>
                <th className="p-3">Billing Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {[
                { id: 'INV-2025-05', date: 'May 20, 2025', amt: '$299.00', status: 'Paid' },
                { id: 'INV-2025-04', date: 'April 20, 2025', amt: '$299.00', status: 'Paid' },
                { id: 'INV-2025-03', date: 'March 20, 2025', amt: '$299.00', status: 'Paid' },
              ].map(inv => (
                <tr key={inv.id} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-white">{inv.id}</td>
                  <td className="p-3 text-gray-300">{inv.date}</td>
                  <td className="p-3 font-bold text-neon-green">{inv.amt}</td>
                  <td className="p-3"><span className="bg-neon-green/10 text-neon-green border border-neon-green/30 text-[9px] px-2 py-0.5 rounded uppercase font-black">{inv.status}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={() => onSave(`Downloaded ${inv.id}.pdf`)} className="text-gray-400 hover:text-white inline-flex items-center gap-1 font-bold">
                      <Download size={13}/> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function IntegrationsSettings({ onSave }) {
  const navigate = useNavigate();
  const [apps, setApps] = useState({ stripe: true, twilio: true, slack: true, zoom: false });

  const toggleApp = (key, name) => {
    setApps(p => ({ ...p, [key]: !p[key] }));
    onSave(`${name} integration ${!apps[key] ? 'connected' : 'disconnected'}`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Quick Connector shortcuts</h3>
          <p className="text-[10px] text-gray-400 mt-1">Manage core API keys and active third-party integrations</p>
        </div>
        <button onClick={() => navigate(getAppPath('/integrations'))} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors flex items-center gap-1.5">
          <ExternalLink size={12} /> Open Full Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { key: 'stripe', name: 'Stripe Payments', icon: '💳', desc: 'Real-time creator payout wire settlements & invoicing', active: apps.stripe },
          { key: 'twilio', name: 'Twilio SMS & WhatsApp', icon: '💬', desc: 'Global automated alerts and phone dialer connectivity', active: apps.twilio },
          { key: 'slack', name: 'Slack Workplace', icon: '📱', desc: 'Send SLA breach alerts and emergency +3 backup notifications', active: apps.slack },
          { key: 'zoom', name: 'Zoom Conference Rooms', icon: '📹', desc: 'Generate 1-click video links for VIP creator onboarding', active: apps.zoom },
        ].map(item => (
          <div key={item.key} className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl p-2 bg-gray-800 rounded-xl">{item.icon}</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  {item.name}
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${item.active ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-800 text-gray-500'}`}>
                    {item.active ? 'Connected' : 'Offline'}
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.desc}</div>
              </div>
            </div>
            <button onClick={() => toggleApp(item.key, item.name)} className={`px-3 py-1.5 rounded-lg font-black text-[10px] shrink-0 transition-colors ${item.active ? 'bg-gray-800 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-gray-700' : 'bg-neon-blue text-black'}`}>
              {item.active ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomFieldsSettings({ onSave }) {
  const [fields, setFields] = useState([
    { id: 1, name: 'Creator Tier', type: 'Select Dropdown', target: 'Leads & Creators', values: 'VIP, Gold, Silver, Bronze' },
    { id: 2, name: 'Stripe Account ID', type: 'Text String', target: 'Billing & Payouts', values: 'acct_1xxx...' },
    { id: 3, name: 'KYC Legal Status', type: 'Status Badge', target: 'Compliance Audits', values: 'Verified, Pending, Rejected' },
    { id: 4, name: 'Studio Room Requirement', type: 'Select Dropdown', target: 'Appointments', values: 'Room A (Podcast), Room B (Video), Remote' },
  ]);

  const addField = () => {
    const newF = { id: Date.now(), name: 'New Custom Attribute', type: 'Text String', target: 'Leads', values: 'Default Value' };
    setFields([...fields, newF]);
    onSave('New custom field created');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Custom Entity Attributes & Metadata</h3>
          <p className="text-[10px] text-gray-400 mt-1">Define custom database properties for leads, creators, and daily appointments</p>
        </div>
        <button onClick={addField} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors flex items-center gap-1.5">
          <Plus size={12} /> Add New Field
        </button>
      </div>

      <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-950/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-900 text-gray-400 font-bold border-b border-gray-800 text-[11px]">
            <tr>
              <th className="p-3">Field Name</th>
              <th className="p-3">Data Type</th>
              <th className="p-3">Target Entity</th>
              <th className="p-3">Allowed Values / Format</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 font-medium">
            {fields.map(f => (
              <tr key={f.id} className="hover:bg-white/[0.02]">
                <td className="p-3 font-bold text-white">{f.name}</td>
                <td className="p-3"><span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-700">{f.type}</span></td>
                <td className="p-3 text-neon-blue font-bold">{f.target}</td>
                <td className="p-3 text-gray-400 text-[11px] truncate max-w-xs">{f.values}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setFields(fields.filter(x => x.id !== f.id)); onSave(`Deleted field: ${f.name}`); }} className="text-gray-500 hover:text-red-400 p-1">
                    <Trash2 size={14}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PermissionsSettings({ onSave }) {
  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Data Retention & GDPR / CCPA Privacy</h3>
          <p className="text-[10px] text-gray-400 mt-1">Configure tenant data retention rules, anonymization, and global export compliance</p>
        </div>
        <button onClick={() => onSave('Privacy policies saved')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Save Policies
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Data Retention Period</label>
          <select onChange={e => onSave(`Retention period set to ${e.target.value}`)} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
            <option>Keep Forever (Enterprise Default)</option>
            <option>7 Years (Tax & Accounting Compliance)</option>
            <option>3 Years (Standard CRM Archive)</option>
            <option>1 Year (Strict Privacy Mode)</option>
          </select>
          <p className="text-[10px] text-gray-500 mt-1">Old communication logs and closed tickets are automatically archived.</p>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Audit Trail Logging Level</label>
          <select onChange={e => onSave(`Audit log level set to ${e.target.value}`)} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
            <option>Comprehensive (All Reads, Writes & API calls)</option>
            <option>Standard (Modifications & Deletions only)</option>
            <option>Minimal (Login attempts & Security alerts only)</option>
          </select>
          <p className="text-[10px] text-gray-500 mt-1">Controls granularity of events recorded in `/app/audit`.</p>
        </div>
      </div>

      <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-black text-white">GDPR & CCPA Tenant Data Export</div>
          <div className="text-[11px] text-gray-400">Download a complete JSON/CSV archive of all lead profiles, creator KYC documents, and session logs.</div>
        </div>
        <button onClick={() => onSave('Full tenant data archive (JSON/CSV) export generated!')} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl border border-gray-700 shrink-0 flex items-center gap-1.5">
          <Download size={14} /> Export Tenant Archive
        </button>
      </div>
    </div>
  );
}

export function AutomationSettings({ onSave }) {
  const [autos, setAutos] = useState({ vipRoute: true, slaEscalate: true, afterHours: true, aiCategorize: true });

  const toggle = (k, lbl) => {
    setAutos(p => ({ ...p, [k]: !p[k] }));
    onSave(`${lbl} workflow ${!autos[k] ? 'activated' : 'deactivated'}`);
  };

  const list = [
    { key: 'vipRoute', label: 'Auto-Assign Inbound VIP Creators', desc: 'Automatically route new VIP creator inquiries to active Senior Agents with the lowest workload.' },
    { key: 'slaEscalate', label: 'SLA Breach Auto-Escalate (+3 Agents)', desc: 'Automatically trigger the emergency "+3 backup agents" assignment when any queue wait time hits critical threshold.' },
    { key: 'afterHours', label: 'After-Hours AI Concierge Greeting', desc: 'Send immediate automated AI greeting and capture inquiry details when messages arrive outside working shift hours.' },
    { key: 'aiCategorize', label: 'AI Smart Ticket Categorization', desc: 'Automatically classify incoming support tickets into KYC, Billing, or Technical using AI text analysis.' },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Automated Workflows & SLA Triggers</h3>
          <p className="text-[10px] text-gray-400 mt-1">Enable intelligent queue automation and emergency backup rules</p>
        </div>
        <button onClick={() => onSave('Automation rules saved')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Save Workflows
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {list.map(item => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-900/40 border border-gray-800 rounded-2xl">
            <div className="space-y-0.5 max-w-xl">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Zap size={14} className={autos[item.key] ? 'text-neon-yellow' : 'text-gray-500'} />
                {item.label}
              </div>
              <div className="text-[11px] text-gray-400">{item.desc}</div>
            </div>
            <button
              onClick={() => toggle(item.key, item.label)}
              className={`w-12 h-6 rounded-full p-1 transition-colors flex items-center shrink-0 ${autos[item.key] ? 'bg-neon-blue' : 'bg-gray-800'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autos[item.key] ? 'translate-x-6 bg-black font-bold' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InboxSettings({ onSave }) {
  const [sig, setSig] = useState("--\nBest regards,\nSarah Jenkins | Executive CRM Administrator\nPlayGroundX Creator Relations");

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Communication Center & Inbox Setup</h3>
          <p className="text-[10px] text-gray-400 mt-1">Configure default agent signatures, shift business hours, and channel routing</p>
        </div>
        <button onClick={() => onSave('Inbox settings saved')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Default Channel Priority</label>
          <select onChange={e => onSave(`Channel priority set to ${e.target.value}`)} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
            <option>WhatsApp & SMS (Highest Response Rate)</option>
            <option>Email & In-App Chat</option>
            <option>Phone Dialer First</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Standard Shift Business Hours</label>
          <select onChange={e => onSave(`Business hours set to ${e.target.value}`)} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
            <option>09:00 AM - 06:00 PM EST (Mon - Fri)</option>
            <option>24/7 Global Follow-the-Sun Coverage</option>
            <option>08:00 AM - 08:00 PM EST (Extended Shift)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Default Agent Email / Chat Signature</label>
        <textarea rows={4} value={sig} onChange={e => setSig(e.target.value)} className="w-full bg-black/40 border border-gray-800 rounded-xl p-3.5 text-xs text-white font-mono focus:outline-none focus:border-neon-blue" />
      </div>
    </div>
  );
}

export function AiSettings({ onSave }) {
  const [model, setModel] = useState('Antigravity 2.0 Ultra (Recommended Enterprise Engine)');
  const [tone, setTone] = useState('Professional & Executive VIP Concierge');

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">AI Concierge & Smart Assistant Preferences</h3>
          <p className="text-[10px] text-gray-400 mt-1">Configure automated conversation summaries, smart replies, and persona tone</p>
        </div>
        <button onClick={() => onSave('AI engine preferences updated')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors flex items-center gap-1.5">
          <Sparkles size={12} /> Apply AI Engine
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">AI Language Engine</label>
          <select value={model} onChange={e => { setModel(e.target.value); onSave(`AI Model set to ${e.target.value}`); }} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-neon-blue font-black focus:outline-none focus:border-neon-blue">
            <option>Antigravity 2.0 Ultra (Recommended Enterprise Engine)</option>
            <option>Gemini Pro 1.5 (Fast Multi-modal Processing)</option>
            <option>Claude 3.5 Sonnet (Nuanced Creator Relations)</option>
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Concierge Persona / Tone</label>
          <select value={tone} onChange={e => { setTone(e.target.value); onSave(`AI Tone set to ${e.target.value}`); }} className="w-full bg-black/40 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-neon-blue">
            <option>Professional & Executive VIP Concierge</option>
            <option>Friendly, Enthusiastic & Casual</option>
            <option>Direct, Concise & Action-Oriented</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black text-white">Smart Features</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Auto-Summarize Sessions', desc: 'Generate bulleted action items after video consultations.', active: true },
            { title: 'Smart Reply Suggestions', desc: 'Suggest 3 instant contextual replies in Communication Center.', active: true },
            { title: 'Real-Time Sentiment Score', desc: 'Score creator frustration vs satisfaction during live chats.', active: true },
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl space-y-1">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                {item.title}
                <CheckCircle2 size={14} className="text-neon-green" />
              </div>
              <p className="text-[10px] text-gray-400 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppearanceSettings({ onSave }) {
  const [theme, setTheme] = useState('neon');
  const [density, setDensity] = useState('comfortable');

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-start border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Theme Palette & UI Density</h3>
          <p className="text-[10px] text-gray-400 mt-1">Customize visual aesthetics, dark modes, and table spacing</p>
        </div>
        <button onClick={() => onSave('UI appearance saved')} className="bg-neon-blue text-black font-bold text-[10px] px-4 py-2 rounded shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:bg-cyan-400 transition-colors">
          Save Appearance
        </button>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Theme Palette</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'neon', name: 'Neon Cyberpunk Dark', desc: 'Vibrant neon cyan & purple accents on deep charcoal', bg: 'bg-gray-950 border-neon-blue/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]' },
            { id: 'obsidian', name: 'Obsidian Sleek Black', desc: 'Pure OLED black with minimalist monochrome contrast', bg: 'bg-black border-gray-800 hover:border-gray-600' },
            { id: 'high', name: 'High Contrast Dark', desc: 'Maximum legibility for intense daily supervisor monitoring', bg: 'bg-gray-900 border-gray-700 hover:border-gray-500' },
          ].map(t => (
            <div
              key={t.id}
              onClick={() => { setTheme(t.id); onSave(`Switched theme to ${t.name}`); }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-28 ${t.bg} ${theme === t.id ? 'ring-2 ring-neon-blue' : ''}`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white">{t.name}</span>
                {theme === t.id && <CheckCircle2 size={16} className="text-neon-blue" />}
              </div>
              <span className="text-[10px] text-gray-400 leading-tight">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Table & Queue Display Density</label>
        <div className="flex gap-3">
          {['Comfortable (Default)', 'Compact (More rows)', 'Ultra-Dense (Executive View)'].map((d, idx) => (
            <button
              key={d}
              onClick={() => { setDensity(d); onSave(`Display density set to ${d}`); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${density === d ? 'bg-neon-blue text-black border-neon-blue font-black' : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
