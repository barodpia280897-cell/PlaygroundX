import { useState } from 'react';
import { usePlatformData } from '../../contexts/DataContext';
import { Settings, ShieldCheck, Globe, Mail, Smartphone, MessageSquare, Bot, Database, Zap, Monitor, ChevronRight, ToggleLeft, ToggleRight, Save, CheckCircle2, AlertTriangle } from 'lucide-react';

const Section = ({ title, icon: Icon, color, children }) => (
  <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
    <div className={`flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-${color}/5`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}/10 border border-${color}/20 text-${color}`}><Icon size={16}/></div>
      <span className="font-bold text-white text-sm">{title}</span>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Row = ({ label, desc, value, type='text', badge }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-800/50 last:border-0">
    <div>
      <div className="text-sm font-bold text-white flex items-center gap-2">{label} {badge && <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${badge==='Connected'?'bg-neon-green/10 text-neon-green border-neon-green/30':badge==='Healthy'?'bg-neon-blue/10 text-neon-blue border-neon-blue/30':'bg-red-500/10 text-red-500 border-red-500/30'}`}>{badge}</span>}</div>
      {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
    </div>
    {type==='text' && <span className="text-sm text-gray-400 font-mono">{value}</span>}
    {type==='bool' && (
      <div className={`flex items-center gap-2 text-xs font-bold ${value?'text-neon-green':'text-gray-500'}`}>
        {value ? <ToggleRight size={20} className="text-neon-green"/> : <ToggleLeft size={20} className="text-gray-600"/>}
        {value ? 'Enabled' : 'Disabled'}
      </div>
    )}
    {type==='action' && <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded transition-colors">{value}</button>}
  </div>
);

export default function PlatformSettings() {
  const [settingsArr] = usePlatformData('platformSettings');
  // platformSettings is stored as a plain object but DataProvider may wrap it in an array, so:
  const S = Array.isArray(settingsArr) ? settingsArr[0] : settingsArr;
  const g = S?.general   || {};
  const sec= S?.security  || {};
  const b = S?.billing   || {};
  const em= S?.email     || {};
  const sm= S?.sms       || {};
  const wa= S?.whatsapp  || {};
  const api= S?.api      || {};
  const ai= S?.ai        || {};
  const bk= S?.backup    || {};
  const ff= S?.featureFlags || [];

  const [maint, setMaint] = useState(g.maintenanceMode ?? false);
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3"><Settings size={22} className="text-neon-purple"/>Platform Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Global configuration, integrations, and system management.</p>
        </div>
        <button onClick={save} className={`px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2 transition-all shrink-0 ${saved?'bg-neon-green text-black':'bg-neon-purple hover:bg-neon-purple/90 text-white'}`}>
          {saved ? <><CheckCircle2 size={14}/>Saved!</> : <><Save size={14}/>Save Changes</>}
        </button>
      </div>

      {/* Health KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:'Security Score', value:`${sec.securityScore||92}/100`,  icon:ShieldCheck, color:'neon-green'  },
          { label:'Integrations',   value:'4 Active',                       icon:Zap,         color:'neon-blue'  },
          { label:'Backup Status',  value:bk.status||'Healthy',             icon:Database,    color:'neon-purple'},
          { label:'Maintenance',    value:maint?'ON':'OFF',                  icon:Monitor,     color:maint?'red-500':'gray-500'},
        ].map((k,i)=>(
          <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${k.color}/10 border border-${k.color}/20 text-${k.color} shrink-0`}><k.icon size={18}/></div>
            <div><div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{k.label}</div><div className="text-lg font-black text-white">{k.value}</div></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* General */}
        <Section title="Platform Configuration" icon={Globe} color="neon-blue">
          <Row label="Platform Name"     value={g.platformName||'PlayGroundX'}/>
          <Row label="Tagline"           value={g.tagline||'—'}/>
          <Row label="Support Email"     value={g.supportEmail||'—'}/>
          <Row label="Timezone"          value={g.timezone||'UTC'}/>
          <Row label="Date Format"       value={g.dateFormat||'DD/MM/YYYY'}/>
          <Row label="Maintenance Mode"  type="bool" value={maint} desc="Disables access for all tenants"/>
        </Section>

        {/* Security */}
        <Section title="Security & Authentication" icon={ShieldCheck} color="neon-purple">
          <Row label="MFA Required"      type="bool" value={sec.mfaRequired}  desc="Enforce 2FA for all platform admins"/>
          <Row label="Session Timeout"   value={`${sec.sessionTimeout||30} minutes`}/>
          <Row label="Password Policy"   value={sec.passwordPolicy||'Strong'}/>
          <Row label="IP Whitelist"      type="bool" value={sec.ipWhitelist}  desc="Restrict login to whitelisted IPs"/>
          <Row label="SSO (SAML)"        type="bool" value={sec.ssoEnabled}   desc="Enterprise Single Sign-On"/>
          <Row label="Security Score"    value={`${sec.securityScore||92}/100`} desc="Auto-calculated from active policies"/>
        </Section>

        {/* Email */}
        <Section title="Email Configuration" icon={Mail} color="neon-green">
          <Row label="Provider"          value={em.provider||'SendGrid'} badge={em.connected?'Connected':undefined}/>
          <Row label="From Name"         value={em.fromName||'PlayGroundX'}/>
          <Row label="From Email"        value={em.fromEmail||'noreply@playgroundx.io'}/>
          <Row label="Daily Sent"        value={`${(em.dailySent||0).toLocaleString()} emails`}/>
          <Row label="Test Connection"   type="action" value="Send Test Email"/>
        </Section>

        {/* SMS */}
        <Section title="SMS Configuration" icon={Smartphone} color="neon-pink">
          <Row label="Provider"          value={sm.provider||'Twilio'} badge={sm.connected?'Connected':undefined}/>
          <Row label="From Number"       value={sm.fromNumber||'—'}/>
          <Row label="Daily Sent"        value={`${(sm.dailySent||0).toLocaleString()} SMS`}/>
          <Row label="Test Connection"   type="action" value="Send Test SMS"/>
        </Section>

        {/* WhatsApp */}
        <Section title="WhatsApp Configuration" icon={MessageSquare} color="neon-green">
          <Row label="Provider"          value={wa.provider||'Meta Business API'} badge={wa.connected?'Connected':undefined}/>
          <Row label="Daily Sent"        value={`${(wa.dailySent||0).toLocaleString()} messages`}/>
          <Row label="Configure"         type="action" value="Open Meta Portal"/>
        </Section>

        {/* AI */}
        <Section title="AI Configuration" icon={Bot} color="neon-purple">
          <Row label="Provider"          value={ai.provider||'Google Gemini'} badge={ai.connected?'Connected':undefined}/>
          <Row label="Model"             value={ai.model||'gemini-pro'}/>
          <Row label="Tokens Used"       value={ai.tokensUsed||'0'}/>
          <Row label="Monthly Budget"    value={`$${(ai.budget||0).toLocaleString()}`}/>
          <Row label="Configure"         type="action" value="Open AI Console"/>
        </Section>

        {/* Backup */}
        <Section title="Backup & Recovery" icon={Database} color="neon-blue">
          <Row label="Frequency"         value={bk.frequency||'Daily'}/>
          <Row label="Last Backup"       value={bk.lastBackup||'—'} badge={bk.status||'Healthy'}/>
          <Row label="Retention"         value={`${bk.retentionDays||30} days`}/>
          <Row label="Backup Size"       value={bk.size||'—'}/>
          <Row label="Run Now"           type="action" value="Trigger Backup"/>
        </Section>

        {/* API */}
        <Section title="API Configuration" icon={Globe} color="neon-pink">
          <Row label="Default Rate Limit"  value={`${api.rateLimitDefault||1000} rpm`}/>
          <Row label="Max Keys / Tenant"   value={api.maxKeysPerTenant||5}/>
          <Row label="Webhook Retries"     value={api.webhookRetries||3}/>
          <Row label="Log Retention"       value={`${api.logRetentionDays||90} days`}/>
        </Section>
      </div>

      {/* Feature Flags */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 bg-neon-blue/5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neon-blue/10 border border-neon-blue/20 text-neon-blue"><Zap size={16}/></div>
          <span className="font-bold text-white text-sm">Feature Flags</span>
          <span className="ml-2 text-xs text-gray-500">Toggle platform features globally</span>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {ff.map((f,i)=>(
            <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <div className="text-sm font-bold text-white">{f.name}</div>
              <div className={`flex items-center gap-2 text-xs font-bold cursor-pointer ${f.enabled?'text-neon-green':'text-gray-500'}`}>
                {f.enabled ? <ToggleRight size={22} className="text-neon-green"/> : <ToggleLeft size={22} className="text-gray-600"/>}
                {f.enabled ? 'ON' : 'OFF'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
