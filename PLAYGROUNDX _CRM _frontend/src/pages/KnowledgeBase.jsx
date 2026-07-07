import { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, RotateCw, Eye, FileText, Bot, FileQuestion, BookOpen, Clock, Activity } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/ui/Badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

const categoryData = [
  { name: 'Account & Billing', value: 35, color: '#00f0ff' },
  { name: 'Compliance', value: 25, color: '#ff0055' },
  { name: 'Safety', value: 20, color: '#ffd700' },
  { name: 'Onboarding', value: 20, color: '#8a2be2' },
];

const searchQueriesData = [
  { query: 'kyc verification', count: 1200 },
  { query: 'payout failed', count: 950 },
  { query: 'block user', count: 820 },
  { query: 'forgot password', count: 600 },
  { query: 'vip upgrade', count: 450 },
];

export default function KnowledgeBase() {
  const [articles, { addItem, updateItem, deleteItem }] = useDataStore('articles');
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentArticle({
      id: Date.now(),
      title: 'New Article',
      category: 'General',
      tags: [],
      status: 'Draft',
      author: 'Admin User',
      lastUpdated: new Date().toISOString().split('T')[0],
      aiSyncStatus: 'Syncing...',
      views: 0,
      content: ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (articles.find(a => a.id === currentArticle.id)) {
      updateItem(currentArticle);
      addToast('success', 'Article Updated', `"${currentArticle.title}" has been saved.`);
    } else {
      addItem(currentArticle);
      addToast('success', 'Article Created', `"${currentArticle.title}" has been published.`);
    }
    setIsEditing(false);
  };

  const handleDelete = (article) => {
    deleteItem(article.id);
    addToast('success', 'Article Deleted', `"${article.title}" has been removed.`);
  };

  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isEditing) {
    return (
      <div className="space-y-6 pb-10 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Book size={20} className="text-neon-blue"/> {currentArticle.id > 10000 ? 'Create Article' : 'Edit Article'}</h2>
            <p className="text-sm text-gray-400">Manage internal knowledge base for AI consumption.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors flex items-center gap-2"><Eye size={16}/> Preview</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">Cancel</button>
            <button onClick={handleSave} className="btn-primary">Save & Publish</button>
          </div>
        </div>

        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Main Editor */}
          <div className="flex-1 glass-panel p-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <input 
              value={currentArticle.title} 
              onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})} 
              className="w-full bg-transparent border-b border-gray-700 pb-2 text-2xl font-bold text-white focus:outline-none focus:border-neon-blue" 
              placeholder="Article Title..."
            />
            
            {/* Simple Rich Text Editor Toolbar Mockup */}
            <div className="flex items-center gap-2 border border-gray-700 bg-gray-900/50 p-2 rounded-lg mt-2">
              <button className="px-2 py-1 hover:bg-gray-800 rounded font-bold text-gray-300">B</button>
              <button className="px-2 py-1 hover:bg-gray-800 rounded italic text-gray-300">I</button>
              <button className="px-2 py-1 hover:bg-gray-800 rounded underline text-gray-300">U</button>
              <div className="w-px h-4 bg-gray-700 mx-2"></div>
              <button className="px-2 py-1 hover:bg-gray-800 rounded text-gray-300 text-xs">H1</button>
              <button className="px-2 py-1 hover:bg-gray-800 rounded text-gray-300 text-xs">H2</button>
              <div className="w-px h-4 bg-gray-700 mx-2"></div>
              <button className="px-2 py-1 hover:bg-gray-800 rounded text-gray-300 text-xs flex items-center gap-1">🔗 Link</button>
            </div>

            <textarea 
              value={currentArticle.content || ''}
              onChange={e => setCurrentArticle({...currentArticle, content: e.target.value})}
              className="flex-1 w-full bg-gray-900/30 border border-gray-700 rounded-lg p-4 text-sm text-gray-200 focus:outline-none focus:border-neon-blue resize-none leading-relaxed"
              placeholder="Write your article content here..."
            />
          </div>

          {/* Right Config Panel */}
          <div className="w-80 glass-panel p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 shrink-0">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Status</label>
              <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" value={currentArticle.status} onChange={e => setCurrentArticle({...currentArticle, status: e.target.value})}>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Category</label>
              <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" value={currentArticle.category} onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}>
                <option>Account</option>
                <option>Billing</option>
                <option>Compliance</option>
                <option>Safety</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-bold">Tags (Comma Separated)</label>
              <input 
                value={currentArticle.tags.join(', ')} 
                onChange={e => setCurrentArticle({...currentArticle, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neon-blue" 
              />
            </div>
            
            <div className="border-t border-gray-800 pt-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Bot size={14} className="text-neon-purple"/> AI Sync Status</h4>
              <div className="flex items-center gap-3">
                {currentArticle.aiSyncStatus === 'Learned' ? (
                  <><CheckCircle2 size={16} className="text-green-400"/> <span className="text-sm text-green-400 font-bold">Learned by AI</span></>
                ) : (
                  <><RotateCw size={16} className="text-yellow-400 animate-spin"/> <span className="text-sm text-yellow-400 font-bold">Syncing...</span></>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">The PlayGroundX AI is currently digesting this document to use in automated replies.</p>
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
            Knowledge Base CMS
            <Badge text={`${articles.length} Articles`} color="blue" />
          </h2>
          <p className="text-sm font-normal text-muted mt-1">Manage articles, FAQs, and policies that train the PGX AI.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleCreate} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-neon-blue text-black text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all">
            <Plus size={16} /> New Article
          </button>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-neon-blue" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Total Articles</h4>
          </div>
          <span className="text-2xl font-black text-white">{articles.length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <FileQuestion size={16} className="text-yellow-400" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Drafts</h4>
          </div>
          <span className="text-2xl font-black text-white">{articles.filter(a => a.status === 'Draft').length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-neon-green" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">Published</h4>
          </div>
          <span className="text-2xl font-black text-white">{articles.filter(a => a.status === 'Published').length}</span>
        </div>
        <div className="glass-panel p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={16} className="text-neon-purple" />
            <h4 className="text-xs font-bold text-gray-400 uppercase">AI Learning Sync</h4>
          </div>
          <div className="flex items-end justify-between mb-1">
             <span className="text-2xl font-black text-white">94%</span>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-1.5 mt-1">
            <div className="bg-neon-purple h-1.5 rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Category Distribution</h3>
           <div className="h-48">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                    {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Top Search Queries (30d)</h3>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchQueriesData} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="query" stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} width={80} />
                  <RechartsTooltip cursor={{fill: '#1f2937'}} contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#00f0ff" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-panel p-5">
           <h3 className="text-sm font-bold text-white mb-4 border-b border-gray-800 pb-2">Content Activity</h3>
           <div className="space-y-4 mt-2">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400"/>
                  <div>
                    <p className="text-xs text-white">Updated "How to verify..."</p>
                    <p className="text-[10px] text-gray-500">by Jane Doe • 2h ago</p>
                  </div>
                </div>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-neon-purple"/>
                  <div>
                    <p className="text-xs text-white">AI Synced 4 articles</p>
                    <p className="text-[10px] text-gray-500">System • 5h ago</p>
                  </div>
                </div>
             </div>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plus size={14} className="text-green-400"/>
                  <div>
                    <p className="text-xs text-white">New Draft Created</p>
                    <p className="text-[10px] text-gray-500">by Admin Jane • Yesterday</p>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="glass-panel flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue" />
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
              <option>All Categories</option>
              <option>Account</option>
              <option>Billing</option>
            </select>
            <button className="p-2 rounded bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"><Filter size={14} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 table-th bg-gray-900/30">
                <th className="px-4 py-3">Article Title</th>
                <th className="px-4 py-3">Category & Tags</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3 text-center">AI Status</th>
                <th className="px-4 py-3 text-center">Views</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredArticles.map((a) => (
                <tr key={a.id} className={`hover:bg-white/[0.02] ${a.status === 'Draft' ? 'opacity-70' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-neon-blue"/>
                      <div>
                        <div className="text-sm font-bold text-white hover:text-neon-blue cursor-pointer" onClick={() => handleEdit(a)}>{a.title}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">Updated: {a.lastUpdated}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-bold text-gray-300 mb-1">{a.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {a.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{a.author}</td>
                  <td className="px-4 py-3 text-center">
                    {a.aiSyncStatus === 'Learned' ? (
                      <Badge text="Learned" color="green" />
                    ) : (
                      <Badge text="Syncing..." color="orange" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-center text-gray-400">{a.views}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge text={a.status} color={a.status === 'Published' ? 'blue' : 'gray'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(a)} className="text-gray-400 hover:text-neon-blue p-1" title="Edit"><Edit2 size={14} /></button>
                      <button onClick={() => deleteItem(a.id)} className="text-gray-400 hover:text-red-500 p-1" title="Delete"><Trash2 size={14} /></button>
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
