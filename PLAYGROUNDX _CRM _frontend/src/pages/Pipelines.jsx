import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Plus, Filter, LayoutGrid, Settings, TrendingUp, Users, Clock, Layers, ShieldCheck, Info, CheckCircle2, Heart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { useToast } from '../contexts/ToastContext';

// MOCK DATA

const creatorStages = [
  { id: 1, name: 'New Creator Lead', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', leads: 122, value: '$61,000', items: [
    { id: 'c1', name: 'Maria Gonzalez', time: '10 min ago', score: 78, avatar: 'https://i.pravatar.cc/150?u=maria' },
    { id: 'c2', name: 'Jin Woo', time: '15 min ago', score: 65, avatar: 'https://i.pravatar.cc/150?u=jin' },
    { id: 'c3', name: 'Ahmed Al Mansour', time: '18 min ago', score: 72, avatar: 'https://i.pravatar.cc/150?u=ahmed1' },
  ], more: '+119 more' },
  { id: 2, name: 'Contacted', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', leads: 84, value: '$5,200', items: [
    { id: 'c4', name: 'Sophie Dubois', time: '8 min ago', score: 82, avatar: 'https://i.pravatar.cc/150?u=sophie' },
    { id: 'c5', name: 'Rahul Sharma', time: '12 min ago', score: 60, avatar: 'https://i.pravatar.cc/150?u=rahul' },
    { id: 'c6', name: 'Patricia Oliveira', time: '22 min ago', score: 71, avatar: 'https://i.pravatar.cc/150?u=patricia' },
  ], more: '+81 more' },
  { id: 3, name: 'Interested', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', leads: 71, value: '$13,200', items: [
    { id: 'c7', name: 'Joao Silva', time: '8 min ago', score: 75, avatar: 'https://i.pravatar.cc/150?u=joao' },
    { id: 'c8', name: 'Lena Müller', time: '14 min ago', score: 68, avatar: 'https://i.pravatar.cc/150?u=lena' },
    { id: 'c9', name: 'Kim Ji Eun', time: '19 min ago', score: 66, avatar: 'https://i.pravatar.cc/150?u=kim' },
  ], more: '+68 more' },
  { id: 4, name: 'Reg. Started', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30', leads: 45, value: '$2,100', items: [
    { id: 'c10', name: 'Omar Hassan', time: '9 min ago', score: 70, avatar: 'https://i.pravatar.cc/150?u=omar' },
    { id: 'c11', name: 'Priya Das', time: '16 min ago', score: 64, avatar: 'https://i.pravatar.cc/150?u=priya2' },
    { id: 'c12', name: 'Li Wei', time: '25 min ago', score: 58, avatar: 'https://i.pravatar.cc/150?u=liwei' },
  ], more: '+42 more' },
  { id: 5, name: 'Registered', color: 'text-green-400 bg-green-500/10 border-green-500/30', leads: 84, value: '$8,300', items: [
    { id: 'c13', name: 'Maria Gonzalez', time: '5 min ago', score: 85, avatar: 'https://i.pravatar.cc/150?u=maria2' },
    { id: 'c14', name: 'Ahmed Al Mansour', time: '11 min ago', score: 80, avatar: 'https://i.pravatar.cc/150?u=ahmed2' },
    { id: 'c15', name: 'Sophie Dubois', time: '21 min ago', score: 78, avatar: 'https://i.pravatar.cc/150?u=sophie2' },
  ], more: '+81 more' },
  { id: 6, name: 'KYC Submitted', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', leads: 29, value: '$8.3k', items: [
    { id: 'c16', name: 'Carlos Ramirez', time: '7 min ago', score: 73, avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 'c17', name: 'Sarah Johnson', time: '13 min ago', score: 67, avatar: 'https://i.pravatar.cc/150?u=sarahj' },
    { id: 'c18', name: 'Hana Kim', time: '17 min ago', score: 61, avatar: 'https://i.pravatar.cc/150?u=hana' },
  ], more: '+26 more' },
  { id: 7, name: 'KYC Approved', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', leads: 22, value: '$4.3k', items: [
    { id: 'c19', name: 'Jenna Smith', time: '6 min ago', score: 88, avatar: 'https://i.pravatar.cc/150?u=jenna' },
    { id: 'c20', name: 'Lucas Martin', time: '15 min ago', score: 82, avatar: 'https://i.pravatar.cc/150?u=lucasm' },
    { id: 'c21', name: 'Emma Brown', time: '20 min ago', score: 79, avatar: 'https://i.pravatar.cc/150?u=emmab' },
  ], more: '+19 more' },
];

const fanStages = [
  { id: 1, name: 'New Fan Lead', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', leads: 344, value: '$68,800', items: [
    { id: 'f1', name: 'Sarah Thompson', time: '2 min ago', score: 45, avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 'f2', name: 'Carlos Ramirez', time: '6 min ago', score: 42, avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 'f3', name: 'Priya Patel', time: '9 min ago', score: 41, avatar: 'https://i.pravatar.cc/150?u=priya' },
  ], more: '+341 more' },
  { id: 2, name: 'Contacted', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', leads: 201, value: '$45,800', items: [
    { id: 'f4', name: 'Ahmed Zayani', time: '4 min ago', score: 50, avatar: 'https://i.pravatar.cc/150?u=ahmed' },
    { id: 'f5', name: 'Sophie Martin', time: '8 min ago', score: 47, avatar: 'https://i.pravatar.cc/150?u=sophie' },
    { id: 'f6', name: 'Li Wei', time: '12 min ago', score: 44, avatar: 'https://i.pravatar.cc/150?u=liwei' },
  ], more: '+198 more' },
  { id: 3, name: 'Registered', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', leads: 201, value: '$52,100', items: [
    { id: 'f7', name: 'Joao Silva', time: '3 min ago', score: 60, avatar: 'https://i.pravatar.cc/150?u=joao' },
    { id: 'f8', name: 'Lena Müller', time: '8 min ago', score: 57, avatar: 'https://i.pravatar.cc/150?u=lena' },
    { id: 'f9', name: 'Kim Ji Eun', time: '11 min ago', score: 55, avatar: 'https://i.pravatar.cc/150?u=kim' },
  ], more: '+198 more' },
  { id: 4, name: 'First Deposit', color: 'text-green-400 bg-green-500/10 border-green-500/30', leads: 206, value: '$73,200', items: [
    { id: 'f10', name: 'Maria Lopez', time: '5 min ago', score: 72, avatar: 'https://i.pravatar.cc/150?u=marial' },
    { id: 'f11', name: 'Omar Hassan', time: '10 min ago', score: 69, avatar: 'https://i.pravatar.cc/150?u=omar' },
    { id: 'f12', name: 'Nisha Patel', time: '13 min ago', score: 66, avatar: 'https://i.pravatar.cc/150?u=nisha' },
  ], more: '+143 more' },
  { id: 5, name: 'First Purchase', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', leads: 112, value: '$44,8k', items: [
    { id: 'f13', name: 'James Wilson', time: '7 min ago', score: 75, avatar: 'https://i.pravatar.cc/150?u=james' },
    { id: 'f14', name: 'Emma Watson', time: '12 min ago', score: 72, avatar: 'https://i.pravatar.cc/150?u=emmaw' },
    { id: 'f15', name: 'Lucas Moreau', time: '16 min ago', score: 69, avatar: 'https://i.pravatar.cc/150?u=lucas' },
  ], more: '+109 more' },
  { id: 6, name: 'Joined Room', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', leads: 97, value: '$21,6k', items: [
    { id: 'f16', name: 'Sarah Kim', time: '6 min ago', score: 70, avatar: 'https://i.pravatar.cc/150?u=sarahk' },
    { id: 'f17', name: 'Ahmed Ali', time: '9 min ago', score: 68, avatar: 'https://i.pravatar.cc/150?u=ahmeda' },
    { id: 'f18', name: 'Patricia Silva', time: '11 min ago', score: 65, avatar: 'https://i.pravatar.cc/150?u=patricias' },
  ], more: '+94 more' },
  { id: 7, name: 'Active Fan', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30', leads: 88, value: '$29,600', items: [
    { id: 'f19', name: 'John Smith', time: '8 min ago', score: 78, avatar: 'https://i.pravatar.cc/150?u=john' },
    { id: 'f20', name: 'Sophie Brown', time: '14 min ago', score: 76, avatar: 'https://i.pravatar.cc/150?u=sophieb' },
    { id: 'f21', name: 'Carlos M.', time: '17 min ago', score: 74, avatar: 'https://i.pravatar.cc/150?u=carlosm' },
  ], more: '+85 more' },
  { id: 8, name: 'VIP Fan', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', leads: 48, value: '$6.2k', items: [
    { id: 'f22', name: 'VIP - Emma', time: '5 min ago', score: 92, avatar: 'https://i.pravatar.cc/150?u=vip1' },
    { id: 'f23', name: 'VIP - James', time: '10 min ago', score: 90, avatar: 'https://i.pravatar.cc/150?u=vip2' },
    { id: 'f24', name: 'VIP - Sophia', time: '15 min ago', score: 89, avatar: 'https://i.pravatar.cc/150?u=vip3' },
  ], more: '+45 more' },
];

const velocityData = [
  { date: 'Apr 20', value: 100000 },
  { date: 'Apr 27', value: 120000 },
  { date: 'May 4', value: 250000 },
  { date: 'May 11', value: 310000 },
  { date: 'May 18', value: 428600 },
];

export default function Pipelines() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [localCreatorStages, setLocalCreatorStages] = useState(creatorStages);
  const [localFanStages, setLocalFanStages] = useState(fanStages);
  const [draggedLead, setDraggedLead] = useState(null);

  const handleDragStart = (e, lead, sourceStageId, type) => {
    e.dataTransfer.setData('leadId', lead.id);
    setDraggedLead({ lead, sourceStageId, type });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStageId, type) => {
    e.preventDefault();
    if (!draggedLead || draggedLead.type !== type || draggedLead.sourceStageId === targetStageId) return;

    if (type === 'creator') {
      const newStages = localCreatorStages.map(stage => {
        if (stage.id === draggedLead.sourceStageId) {
          return { ...stage, items: stage.items.filter(item => item.id !== draggedLead.lead.id) };
        }
        if (stage.id === targetStageId) {
          return { ...stage, items: [draggedLead.lead, ...stage.items] };
        }
        return stage;
      });
      setLocalCreatorStages(newStages);
    } else {
      const newStages = localFanStages.map(stage => {
        if (stage.id === draggedLead.sourceStageId) {
          return { ...stage, items: stage.items.filter(item => item.id !== draggedLead.lead.id) };
        }
        if (stage.id === targetStageId) {
          return { ...stage, items: [draggedLead.lead, ...stage.items] };
        }
        return stage;
      });
      setLocalFanStages(newStages);
    }
    
    addToast('success', 'Lead Moved', 'Stage updated successfully.');
    setDraggedLead(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 60) return 'text-neon-blue';
    return 'text-[#ec4899]';
  };

  const kpis = [
    { label: 'Total Pipeline Value', value: '$2.48M', change: '↑ 18.7% vs last 30 days', changeColor: 'text-[#22c55e]', icon: <div className="w-8 h-8 rounded-full border border-purple-500/30 flex items-center justify-center text-purple-400 bg-purple-500/10 text-lg font-black">$</div> },
    { label: 'Total Leads in Pipelines', value: '2,054', change: '↑ 14.3% vs last 30 days', changeColor: 'text-[#22c55e]', icon: <div className="w-8 h-8 rounded-full border border-blue-500/30 flex items-center justify-center text-blue-400 bg-blue-500/10"><Users size={16} /></div> },
    { label: 'Conversion Rate (Overall)', value: '18.4%', change: '↑ 2.6% vs last 30 days', changeColor: 'text-[#22c55e]', icon: <div className="w-8 h-8 rounded-full border border-green-500/30 flex items-center justify-center text-green-400 bg-green-500/10"><TrendingUp size={16} /></div> },
    { label: 'Avg. Time in Pipeline', value: '7.2 days', change: '↓ 1.1 days vs last 30 days', changeColor: 'text-red-500', icon: <div className="w-8 h-8 rounded-full border border-orange-500/30 flex items-center justify-center text-orange-400 bg-orange-500/10"><Clock size={16} /></div> },
    { label: 'Pipelines Active', value: '2', change: 'Creator, Fan', changeColor: 'text-gray-400', icon: <div className="w-8 h-8 rounded-full border border-pink-500/30 flex items-center justify-center text-pink-400 bg-pink-500/10"><Layers size={16} /></div> },
    { label: 'Pipeline Health', value: 'Excellent', change: 'All systems running', changeColor: 'text-gray-400', icon: <div className="w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center text-cyan-400 bg-cyan-500/10"><ShieldCheck size={16} /></div> },
  ];

  return (
    <div className="space-y-5 pb-10 relative text-white bg-[#090C13] min-h-screen">
      
      {/* Page Header & Tabs */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-white flex items-center tracking-tight">
            Pipelines <span className="text-[12px] font-medium text-gray-400 ml-3 mt-1.5">Visualize and manage your sales and onboarding pipelines</span>
          </h2>
          <div className="flex gap-6 border-b border-gray-800/80 w-full mt-5">
            <button className="pb-3 text-[11px] font-semibold text-gray-400 hover:text-white transition-colors">All Pipelines</button>
            <button className="pb-3 text-[11px] font-semibold text-neon-blue border-b-[2px] border-neon-blue">Creator Pipelines</button>
            <button className="pb-3 text-[11px] font-semibold text-gray-400 hover:text-white transition-colors">Fan Pipeline</button>
          </div>
        </div>

        <div className="flex items-center gap-3 -mb-1">
          <div className="relative group">
            <select className="bg-[#12161f] border border-gray-800/80 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold text-gray-300 focus:outline-none focus:border-neon-blue/50 cursor-pointer appearance-none transition-colors hover:bg-[#1a1f2b]">
              <option>All Pipelines</option>
            </select>
            <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
          </div>
          
          <div className="relative group">
            <select className="bg-[#12161f] border border-gray-800/80 rounded-lg pl-3 pr-8 py-2 text-[11px] font-semibold text-gray-300 focus:outline-none focus:border-neon-blue/50 cursor-pointer appearance-none transition-colors hover:bg-[#1a1f2b]">
              <option>All Agents</option>
            </select>
            <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
          </div>

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-800/80 bg-[#12161f] text-[11px] font-semibold text-gray-300 hover:text-white hover:bg-[#1a1f2b] transition-colors">
            <Filter size={13} /> Filters
          </button>
          
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3b82f6] text-[11px] font-bold text-white hover:bg-blue-600 transition-colors shadow-sm ml-2">
            <Plus size={14} /> Add Pipeline
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-1">
        {kpis.map((k, i) => (
          <div key={i} className="rounded-xl p-4 flex flex-col justify-between min-w-[200px] flex-1 border border-gray-800/80 bg-[#0B0E14] shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-gray-700 transition-colors relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="text-[11px] font-semibold text-gray-400 tracking-wide">{k.label}</span>
              {k.icon}
            </div>
            <div className="relative z-10">
              <div className="text-[20px] font-bold text-white tracking-tight">{k.value}</div>
              <div className={`text-[9px] mt-1.5 font-medium ${k.changeColor}`}>{k.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Boards Area */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        
        {/* Left Side: Pipeline Boards */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden min-w-0">
          
          {/* Creator Pipeline */}
          <div className="rounded-xl border border-gray-800/80 bg-[#0B0E14] shadow-sm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-[#0f1219]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white tracking-wider">CREATOR PIPELINE</h3>
                  <div className="text-[10px] font-medium text-gray-500 mt-0.5">13 Stages &nbsp;•&nbsp; 514 Total Leads</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <select className="bg-[#12161f] border border-gray-800/80 rounded-md pl-3 pr-7 py-1.5 text-[10px] font-semibold text-gray-300 focus:outline-none appearance-none cursor-pointer">
                    <option>Stage View</option>
                  </select>
                  <ChevronRight size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-800/80 bg-[#12161f] text-[10px] font-semibold text-gray-300 hover:text-white transition-colors">
                  <Settings size={12} /> Customize Stages
                </button>
              </div>
            </div>

            {/* Columns Container */}
            <div className="flex overflow-x-auto no-scrollbar p-4 gap-3 bg-[#0B0E14] min-h-[300px]">
              {localCreatorStages.map((stage, i) => (
                <div 
                  key={stage.id} 
                  className="w-[200px] shrink-0 flex flex-col h-full bg-[#12161f]/50 border border-gray-800/60 rounded-xl overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id, 'creator')}
                >
                  <div className="p-3 pb-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold border ${stage.color}`}>
                        {stage.id}
                      </div>
                      <h4 className={`text-[11px] font-bold truncate ${stage.color.split(' ')[0]}`}>{stage.name}</h4>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-semibold text-gray-400 mt-1">
                      <span>{stage.leads} Leads</span>
                      <span>{stage.value}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {stage.items.map(lead => (
                      <div 
                        key={lead.id} 
                        draggable 
                        onDragStart={(e) => handleDragStart(e, lead, stage.id, 'creator')}
                        className="bg-[#0B0E14] border border-gray-800 p-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-gray-600 transition-colors shadow-md relative group"
                      >
                         <div className="flex items-center gap-2 mb-2">
                           <img src={lead.avatar} className="w-6 h-6 rounded-full object-cover border border-gray-700/50" />
                           <div className="min-w-0 flex-1">
                             <div className="text-[10px] font-bold text-white truncate">{lead.name}</div>
                             <div className="text-[8px] font-medium text-gray-500 mt-0.5">{lead.time}</div>
                           </div>
                           <div className={`text-[9px] font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
                         </div>
                      </div>
                    ))}
                    <div className="text-center pt-1 pb-1">
                      <span className="text-[9px] font-semibold text-gray-500 cursor-pointer hover:text-gray-300">{stage.more}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* +6 More Stages Placeholder */}
              <div className="w-[140px] shrink-0 border-l border-gray-800/80 pl-4 flex flex-col justify-center gap-4 relative">
                <div className="text-[11px] font-bold text-[#8b5cf6] leading-tight">+6 More<br/>Stages</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-[7px] text-purple-400 font-bold">8</div><span className="text-[9px] text-gray-400 font-medium truncate">Profile Complete</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-[7px] text-purple-400 font-bold">11</div><span className="text-[9px] text-gray-400 font-medium truncate">First Content Upload</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-[7px] text-purple-400 font-bold">12</div><span className="text-[9px] text-gray-400 font-medium truncate">First Live Hosted</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-[7px] text-purple-400 font-bold">14</div><span className="text-[9px] text-gray-400 font-medium truncate">Active Creator</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-purple-500/30 bg-purple-500/10 flex items-center justify-center text-[7px] text-purple-400 font-bold">16</div><span className="text-[9px] text-gray-400 font-medium truncate">VIP Creator</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Fan Pipeline */}
          <div className="rounded-xl border border-gray-800/80 bg-[#0B0E14] shadow-sm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-800/80 flex items-center justify-between bg-[#0f1219]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                  <Heart size={16} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white tracking-wider">FAN PIPELINE</h3>
                  <div className="text-[10px] font-medium text-gray-500 mt-0.5">8 Stages &nbsp;•&nbsp; 770 Total Leads</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <select className="bg-[#12161f] border border-gray-800/80 rounded-md pl-3 pr-7 py-1.5 text-[10px] font-semibold text-gray-300 focus:outline-none appearance-none cursor-pointer">
                    <option>Stage View</option>
                  </select>
                  <ChevronRight size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-800/80 bg-[#12161f] text-[10px] font-semibold text-gray-300 hover:text-white transition-colors">
                  <Settings size={12} /> Customize Stages
                </button>
              </div>
            </div>

            {/* Columns Container */}
            <div className="flex overflow-x-auto no-scrollbar p-4 gap-3 bg-[#0B0E14] min-h-[300px]">
              {localFanStages.map((stage, i) => (
                <div 
                  key={stage.id} 
                  className="w-[200px] shrink-0 flex flex-col h-full bg-[#12161f]/50 border border-gray-800/60 rounded-xl overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id, 'fan')}
                >
                  <div className="p-3 pb-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold border ${stage.color}`}>
                        {stage.id}
                      </div>
                      <h4 className={`text-[11px] font-bold truncate ${stage.color.split(' ')[0]}`}>{stage.name}</h4>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-semibold text-gray-400 mt-1">
                      <span>{stage.leads} Leads</span>
                      <span>{stage.value}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                    {stage.items.map(lead => (
                      <div 
                        key={lead.id} 
                        draggable 
                        onDragStart={(e) => handleDragStart(e, lead, stage.id, 'fan')}
                        className="bg-[#0B0E14] border border-gray-800 p-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:border-gray-600 transition-colors shadow-md relative group"
                      >
                         <div className="flex items-center gap-2 mb-2">
                           <img src={lead.avatar} className="w-6 h-6 rounded-full object-cover border border-gray-700/50" />
                           <div className="min-w-0 flex-1">
                             <div className="text-[10px] font-bold text-white truncate">{lead.name}</div>
                             <div className="text-[8px] font-medium text-gray-500 mt-0.5">{lead.time}</div>
                           </div>
                           <div className={`text-[9px] font-bold ${getScoreColor(lead.score)}`}>{lead.score}</div>
                         </div>
                      </div>
                    ))}
                    <div className="text-center pt-1 pb-1">
                      <span className="text-[9px] font-semibold text-gray-500 cursor-pointer hover:text-gray-300">{stage.more}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Right Analytics Sidebar */}
        <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-4">
          
          {/* Pipeline Performance */}
          <div className="rounded-xl p-5 border border-gray-800/80 bg-[#0B0E14] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[12px] font-semibold text-gray-300">Pipeline Performance</h3>
              <div className="relative group">
                <select className="bg-transparent text-[9px] font-medium text-gray-500 focus:outline-none cursor-pointer appearance-none pr-3">
                  <option>Last 30 Days</option>
                </select>
                <ChevronRight size={8} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="42" className="stroke-gray-800/60" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="42" className="stroke-[#00f0ff]" strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 - (264 * 0.184)} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[16px] font-bold text-white">18.4%</span>
                  <span className="text-[7px] text-gray-500 font-medium text-center leading-tight mt-0.5">Overall Conversion<br/>Rate</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="flex items-center gap-2 text-[9px]">
                  <div className="w-2 h-2 rounded-sm bg-[#00f0ff]" />
                  <span className="text-gray-400 font-medium">Converted</span>
                  <span className="text-white ml-auto">378 (18.4%)</span>
                </div>
                <div className="flex items-center gap-2 text-[9px]">
                  <div className="w-2 h-2 rounded-sm bg-gray-800" />
                  <span className="text-gray-400 font-medium">Not Converted</span>
                  <span className="text-white ml-auto">1,676 (81.6%)</span>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
               <h4 className="text-[10px] font-semibold text-gray-400 mb-3">By Pipeline</h4>
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-[9px] font-medium text-gray-300">
                   <span>Creator Pipeline</span>
                   <span>22.1%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#8b5cf6] w-[22.1%]" /></div>
                 
                 <div className="flex items-center justify-between text-[9px] font-medium text-gray-300 pt-1">
                   <span>Fan Pipeline</span>
                   <span>15.2%</span>
                 </div>
                 <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden"><div className="h-full bg-[#3b82f6] w-[15.2%]" /></div>
               </div>
            </div>
            
            <button className="w-full py-2 border-t border-gray-800/80 text-[10px] font-semibold text-[#3b82f6] hover:text-white transition-colors mt-2">
              View Full Report
            </button>
          </div>

          {/* Pipeline Velocity */}
          <div className="rounded-xl p-5 border border-gray-800/80 bg-[#0B0E14] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[12px] font-semibold text-gray-300">Pipeline Velocity</h3>
              <div className="relative group">
                <select className="bg-transparent text-[9px] font-medium text-gray-500 focus:outline-none cursor-pointer appearance-none pr-3">
                  <option>Last 30 Days</option>
                </select>
                <ChevronRight size={8} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-[18px] font-bold text-white mb-0.5">$428,600</div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-500 font-medium">Total Pipeline Value</span>
                <span className="text-[9px] text-neon-green font-bold">↑ 18.7% <span className="text-gray-500 font-medium">vs last 30 days</span></span>
              </div>
            </div>
            
            <div className="h-28 w-full -ml-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280' }} tickFormatter={(val) => `${val/1000}K`} width={30} />
                  <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pipeline Health */}
          <div className="rounded-xl p-5 border border-gray-800/80 bg-[#0B0E14] shadow-sm flex flex-col">
             <h3 className="text-[12px] font-semibold text-gray-300 mb-5">Pipeline Health</h3>
             <div className="flex items-center gap-5 mb-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-gray-800/60" strokeWidth="6" fill="none" />
                    <circle cx="40" cy="40" r="34" className="stroke-[#22c55e]" strokeWidth="6" fill="none" strokeDasharray="213" strokeDashoffset={213 - (213 * 0.96)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[16px] font-bold text-white leading-tight">96%</span>
                    <span className="text-[9px] text-gray-400 font-medium">Excellent</span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#22c55e]" /><span className="text-[10px] text-gray-400 font-medium">Stages Updated</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#22c55e]" /><span className="text-[10px] text-gray-400 font-medium">Agents Active</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#22c55e]" /><span className="text-[10px] text-gray-400 font-medium">Leads Flowing</span></div>
                  <div className="flex items-center gap-2"><CheckCircle2 size={12} className="text-[#22c55e]" /><span className="text-[10px] text-gray-400 font-medium">No Blocked Deals</span></div>
                </div>
             </div>
             
             <button className="w-full py-2 border-t border-gray-800/80 text-[10px] font-semibold text-[#3b82f6] hover:text-white transition-colors">
               View Pipeline Analytics
             </button>
          </div>

        </div>
      </div>

      {/* Bottom Tip Bar */}
      <div className="bg-[#12161f] border border-[#8b5cf6]/30 text-[#8b5cf6] p-3 rounded-lg flex items-center gap-2 text-[11px] font-medium mt-1 w-full max-w-fit shadow-sm">
        <Info size={14} /> Tip: Drag and drop leads between stages to update their status. Changes are saved automatically.
      </div>
      
    </div>
  );
}
