import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Filter, Smartphone, Mail, MessageSquare, Eye, Edit2, Trash2, CheckCircle2, Copy, Send, BarChart2, Clock } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/ui/Badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis } from 'recharts';

const channelData = [
  { name: 'WhatsApp', value: 55, color: '#25D366' },
  { name: 'SMS', value: 25, color: '#00f0ff' },
  { name: 'Email', value: 20, color: '#8a2be2' },
];

const usageTrendData = [
  { day: 'Mon', sends: 1200 }, { day: 'Tue', sends: 1500 }, { day: 'Wed', sends: 1100 },
  { day: 'Thu', sends: 1800 }, { day: 'Fri', sends: 2100 }, { day: 'Sat', sends: 900 },
  { day: 'Sun', sends: 850 },
];

export default function MessageTemplates() {
  const [templates, { addItem, updateItem, deleteItem }] = useDataStore('templates');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  // Extract variables (e.g. {{name}}) from content
  const variables = useMemo(() => {
    if (!currentTemplate?.content) return [];
    const matches = currentTemplate.content.match(/{{([^}]+)}}/g);
    if (!matches) return [];
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))];
  }, [currentTemplate?.content]);

  // Preview content replaces variables with mock data
  const previewContent = useMemo(() => {
    if (!currentTemplate?.content) return '';
    let preview = currentTemplate.content;
    variables.forEach(v => {
      preview = preview.replace(new RegExp(`{{${v}}}`, 'g'), `[${v}]`);
    });
    return preview;
  }, [currentTemplate?.content, variables]);

  const handleEdit = (template) => {
    setCurrentTemplate(template);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentTemplate({
      id: Date.now(),
      name: 'New Template',
      channel: 'WhatsApp',
      language: 'English',
      status: 'Draft',
      content: 'Hi {{name}},\n\nYour message here...',
      category: 'General',
      totalSends: 0,
      lastUsed: 'Never'
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const isNew = !templates.find(t => t.id === currentTemplate.id);
    if (!isNew) {
      updateItem(currentTemplate);
      addToast('success', 'Template Updated', `"${currentTemplate.name}" has been saved.`);
    } else {
      addItem(currentTemplate);
      addToast('success', 'Template Created', `"${currentTemplate.name}" is now available.`);
    }
    setIsEditing(false);
  };

  const handleDelete = (template) => {
    deleteItem(template.id);
    addToast('success', 'Template Deleted', `"${template.name}" has been removed.`);
  };

  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isEditing) {
    return (
      <div className="space-y-6 pb-10 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><FileText size={20} className="text-neon-blue"/> {currentTemplate.id > 10000 ? 'Create Template' : 'Edit Template'}</h2>
            <p className="text-sm text-gray-400">Configure omnichannel message templates with dynamic variables.</p>
          </div>
          <div className="flex gap-3">
            {currentTemplate.status === 'Draft' && (
              <button className="px-4 py-2 border border-gray-700 bg-gray-900 rounded-lg text-sm text-yellow-400 hover:bg-gray-800 transition-colors font-bold">Request Approval</button>
            )}
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save Template</button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Editor Column */}
          <div className="w-1/2 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
            <div className="glass-panel p-6 space-y-4 shrink-0">
              <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Template Name</label>
                  <input value={currentTemplate.name} onChange={e => setCurrentTemplate({...currentTemplate, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Category</label>
                  <select value={currentTemplate.category} onChange={e => setCurrentTemplate({...currentTemplate, category: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue">
                    <option>Account</option>
                    <option>Billing</option>
                    <option>Marketing</option>
                    <option>Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Channel</label>
                  <select value={currentTemplate.channel} onChange={e => setCurrentTemplate({...currentTemplate, channel: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue">
                    <option>WhatsApp</option>
                    <option>SMS</option>
                    <option>Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Language</label>
                  <select value={currentTemplate.language} onChange={e => setCurrentTemplate({...currentTemplate, language: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Mandarin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-4">
                <h3 className="text-sm font-bold text-white">Content Editor</h3>
                <span className="text-[10px] text-gray-500">Use {'{{variable}}'} for dynamic data</span>
              </div>
              
              <textarea 
                value={currentTemplate.content}
                onChange={e => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                className="flex-1 w-full bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-neon-blue resize-none custom-scrollbar font-mono leading-relaxed"
                placeholder="Hi {{name}}, your account is verified!"
              />
              
              <div className="mt-4 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                <h4 className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Detected Variables ({variables.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {variables.length > 0 ? variables.map(v => (
                    <span key={v} className="text-xs bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-2 py-1 rounded font-mono">
                      {v}
                    </span>
                  )) : (
                    <span className="text-xs text-gray-600">No variables detected.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="w-1/2 glass-panel p-6 flex flex-col bg-gray-950">
            <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2 mb-6 flex items-center gap-2">
              <Eye size={16} className="text-neon-purple"/> Live Preview
            </h3>
            
            <div className="flex-1 flex items-center justify-center p-4 bg-[#0a0a0f] rounded-xl border border-gray-800/50 relative overflow-hidden">
              
              {/* Phone Mockup Container */}
              {currentTemplate.channel !== 'Email' && (
                <div className="w-72 h-[500px] border-[6px] border-gray-800 rounded-[2.5rem] bg-[#0f111a] flex flex-col relative overflow-hidden shadow-2xl">
                  {/* Notch */}
                  <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
                    <div className="w-32 h-4 bg-gray-800 rounded-b-2xl"></div>
                  </div>
                  
                  {/* Header */}
                  <div className={`h-16 pt-5 px-4 flex items-center gap-3 z-10 ${currentTemplate.channel === 'WhatsApp' ? 'bg-[#075e54]' : 'bg-gray-900 border-b border-gray-800'}`}>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">PGX</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">PlayGroundX</h4>
                      <p className="text-[10px] text-white/70">Verified Business</p>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className={`flex-1 p-4 flex flex-col justify-end ${currentTemplate.channel === 'WhatsApp' ? 'bg-[#efe7dd] bg-opacity-10' : 'bg-[#0f111a]'}`}>
                    <div className="w-full flex justify-start">
                      <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${currentTemplate.channel === 'WhatsApp' ? 'bg-white text-black rounded-tl-sm' : 'bg-gray-800 text-white rounded-bl-sm border border-gray-700'}`}>
                        <p className="text-sm whitespace-pre-wrap">{previewContent || 'Message preview will appear here...'}</p>
                        <div className="text-[9px] text-right mt-1 opacity-50">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Mockup */}
              {currentTemplate.channel === 'Email' && (
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden text-black flex flex-col">
                   <div className="bg-gray-100 p-3 border-b flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                   </div>
                   <div className="p-4 border-b">
                     <p className="text-xs text-gray-500 mb-1">From: <span className="text-black font-bold">PlayGroundX &lt;noreply@playgroundx.com&gt;</span></p>
                     <p className="text-xs text-gray-500 mb-1">To: <span className="text-black font-bold">[user_email]</span></p>
                     <p className="text-sm font-bold mt-2">{currentTemplate.name}</p>
                   </div>
                   <div className="p-6 flex-1 text-sm whitespace-pre-wrap">
                     {previewContent || 'Message preview will appear here...'}
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-white flex items-center gap-3">
            Message Templates
            <Badge text={`${templates.length} Templates`} color="purple" />
          </h2>
          <p className="text-sm font-normal text-muted mt-1">Manage standardized responses for Omnichannel communications.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-blue text-black text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            <Plus size={16} /> Create Template
          </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-neon-blue" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Total Templates</h4>
          </div>
          <span className="text-2xl font-black text-white">{templates.length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-neon-green" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Approved</h4>
          </div>
          <span className="text-2xl font-black text-white">{templates.filter(t => t.status === 'Approved').length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-yellow-400" />
            <h4 className="text-xs font-bold text-gray-400 uppercase relative z-10">Pending Review</h4>
          </div>
          <span className="text-2xl font-black text-white relative z-10">{templates.filter(t => t.status === 'Draft' || t.status === 'Pending').length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Send size={16} className="text-neon-purple" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Total Sends (30d)</h4>
          </div>
          <span className="text-2xl font-black text-white">124.5K</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Usage Trend (Last 7 Days)</h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usageTrendData}>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#00f0ff' }} />
                  <Line type="monotone" dataKey="sends" stroke="#00f0ff" strokeWidth={2} dot={{ r: 3, fill: '#00f0ff' }} />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Channel Distribution</h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {channelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="glass-panel flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
              <option>All Channels</option>
              <option>WhatsApp</option>
              <option>SMS</option>
              <option>Email</option>
            </select>
            <button className="p-2 rounded bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"><Filter size={14} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 table-th bg-gray-900/30">
                <th className="px-4 py-3">Template Name & Category</th>
                <th className="px-4 py-3">Channel & Language</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Total Sends</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredTemplates.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-white mb-1 hover:text-neon-blue cursor-pointer" onClick={() => handleEdit(t)}>{t.name}</div>
                    <div className="text-[10px] text-gray-500">{t.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      {t.channel === 'WhatsApp' ? <MessageSquare size={12} className="text-green-400"/> : 
                       t.channel === 'SMS' ? <Smartphone size={12} className="text-neon-blue"/> : 
                       <Mail size={12} className="text-purple-400"/>}
                      <span className="text-xs font-bold text-gray-300">{t.channel}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">{t.language}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge text={t.status} color={t.status === 'Approved' ? 'green' : t.status === 'Draft' ? 'gray' : 'yellow'} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="text-xs font-bold text-white">{t.totalSends?.toLocaleString() || Math.floor(Math.random() * 50000).toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500">Last: {t.lastUsed || 'Today'}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-gray-400 hover:text-white p-1" title="Duplicate"><Copy size={14} /></button>
                      <button onClick={() => handleEdit(t)} className="text-gray-400 hover:text-neon-blue p-1" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => deleteItem(t.id)} className="text-gray-400 hover:text-red-500 p-1" title="Delete"><Trash2 size={14} /></button>
                    </div>
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
