import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, MessageCircle, Plus, Search, CheckCircle2, Copy, Edit2, Trash2, ArrowDown, Activity, Play, PauseCircle, Settings } from 'lucide-react';
import { useDataStore } from '../contexts/DataContext';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/ui/Badge';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { runTrend } from '../data/mock/automations';

export default function Automations() {
  const [automations, { addItem, updateItem }] = useDataStore('automations');
  const [activeAutoId, setActiveAutoId] = useState(automations?.[0]?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToast } = useToast();

  const activeAuto = automations?.find(a => a.id === activeAutoId);

  const getStepIcon = (type) => {
    switch(type) {
      case 'trigger': return <Zap size={16} className="text-yellow-400" />;
      case 'action': return <MessageCircle size={16} className="text-neon-blue" />;
      case 'delay': return <Clock size={16} className="text-gray-400" />;
      default: return <CheckCircle2 size={16} className="text-green-400" />;
    }
  };

  const getStepColor = (type) => {
    switch(type) {
      case 'trigger': return 'border-yellow-400/50 bg-yellow-400/5';
      case 'action': return 'border-neon-blue/50 bg-neon-blue/5';
      case 'delay': return 'border-gray-600 bg-gray-800/30';
      default: return 'border-gray-700 bg-gray-900';
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden bg-[#0a0a0f]">
      
      {/* Left Sidebar: Automation List */}
      <div className="w-80 flex-shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">Workflows</h2>
            <button onClick={() => addToast('info', 'Create Workflow', 'Workflow builder coming in Phase 3.')} className="text-xs bg-neon-blue text-black font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-neon-blue/80 transition-colors">
              <Plus size={14}/> New
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Search workflows..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:border-neon-blue focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {automations?.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map(auto => (
            <div 
              key={auto.id}
              onClick={() => setActiveAutoId(auto.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${activeAutoId === auto.id ? 'bg-gray-900 border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'bg-transparent border-gray-800 hover:border-gray-600'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-bold text-gray-200 truncate pr-2">{auto.name}</h4>
                <Badge text={auto.status} color={auto.status === 'Active' ? 'green' : 'gray'} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-gray-400 bg-gray-800 px-2 py-0.5 rounded">Category: Onboarding</span>
                <span className="text-[10px] font-bold text-neon-blue">{Math.round((auto.completed / auto.triggers) * 100)}% Success</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Area: Workflow Builder & Analytics */}
      <div className="flex-1 flex flex-col bg-[#0f111a] relative overflow-hidden">
        {activeAuto ? (
          <>
            {/* Header */}
            <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between bg-gray-950/80 backdrop-blur-md z-10 shrink-0">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  {activeAuto.name}
                  <button className="text-gray-500 hover:text-white"><Edit2 size={14}/></button>
                </h3>
                <p className="text-xs text-gray-400">Last edited on {activeAuto.lastEdited}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 hover:text-white rounded text-sm transition-colors font-medium flex items-center gap-2"><Play size={14}/> Test</button>
                {activeAuto.status === 'Active' ? (
                   <button className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded text-sm transition-colors font-bold flex items-center gap-2"><PauseCircle size={14}/> Pause Workflow</button>
                ) : (
                   <button className="px-4 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black rounded text-sm transition-colors font-bold flex items-center gap-2"><CheckCircle2 size={14}/> Publish</button>
                )}
                <button className="p-2 bg-gray-900 border border-gray-700 text-gray-300 hover:text-white rounded transition-colors"><Settings size={16}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
              
              {/* Analytics Ribbon */}
              <div className="grid grid-cols-4 border-b border-gray-800 bg-gray-950 shrink-0 divide-x divide-gray-800">
                <div className="p-4 flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><Zap size={10}/> Total Enrolled</span>
                  <span className="text-2xl font-black text-white">{activeAuto.triggers.toLocaleString()}</span>
                </div>
                <div className="p-4 flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1"><CheckCircle2 size={10}/> Completed</span>
                  <span className="text-2xl font-black text-white">{activeAuto.completed.toLocaleString()}</span>
                </div>
                <div className="p-4 flex flex-col relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={runTrend}>
                          <Area type="monotone" dataKey="runs" stroke="#00f0ff" fill="#00f0ff" strokeWidth={2} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1 z-10"><Activity size={10}/> Success Rate</span>
                  <span className="text-2xl font-black text-neon-blue z-10">{Math.round((activeAuto.completed / activeAuto.triggers) * 100)}%</span>
                </div>
                <div className="p-4 flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Last Run</span>
                  <span className="text-sm font-bold text-gray-300 mt-1">2 mins ago</span>
                  <span className="text-[10px] text-green-400 font-bold mt-1">Success</span>
                </div>
              </div>

              {/* Builder Canvas */}
              <div className="flex-1 p-8 flex flex-col items-center">
                <div className="w-full max-w-2xl space-y-4 pb-20 relative">
                  {/* Decorative Background Line */}
                  <div className="absolute top-4 bottom-16 left-9 w-0.5 bg-gray-800 -z-10"></div>
                  
                  {activeAuto.steps.map((step, index) => (
                    <motion.div 
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className={`w-full p-5 rounded-xl border flex items-start gap-5 shadow-lg ${getStepColor(step.type)}`}>
                        <div className="w-10 h-10 rounded-full bg-gray-950 border border-gray-700 flex items-center justify-center shrink-0 shadow-inner z-10">
                          {getStepIcon(step.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{step.type}</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                              <button className="text-gray-500 hover:text-white p-1 bg-gray-900 rounded"><Edit2 size={12}/></button>
                              <button className="text-gray-500 hover:text-white p-1 bg-gray-900 rounded"><Copy size={12}/></button>
                              <button className="text-red-500/70 hover:text-red-500 p-1 bg-gray-900 rounded"><Trash2 size={12}/></button>
                            </div>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-3">{step.label}</h4>
                          
                          <div className="bg-gray-950/80 rounded-lg p-3 text-xs text-gray-300 font-mono border border-gray-800/50 shadow-inner">
                            {Object.entries(step.config).map(([key, val]) => (
                              <div key={key} className="flex mb-1 last:mb-0">
                                <span className="text-gray-500 w-24 shrink-0">{key}:</span>
                                <span className="text-neon-blue">{val}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {index < activeAuto.steps.length - 1 && (
                        <div className="flex justify-center -my-3 relative z-0 h-10">
                          <div className="absolute left-[39px] top-0 bottom-0 w-px bg-gray-700"></div>
                          <ArrowDown size={14} className="absolute top-1/2 -translate-y-1/2 left-[33px] text-gray-500 bg-[#0f111a] px-0.5" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  <div className="flex justify-start ml-[22px] mt-6 relative z-10">
                    <button className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 border-dashed flex items-center justify-center text-gray-500 hover:text-neon-blue hover:border-neon-blue hover:bg-neon-blue/10 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an automation to edit.
          </div>
        )}
      </div>

    </div>
  );
}
