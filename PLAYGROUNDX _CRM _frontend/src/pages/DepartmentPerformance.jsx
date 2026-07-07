// src/pages/DepartmentPerformance.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Search, Globe } from 'lucide-react';
import ReportHeaderBanner from '../components/reports/ReportHeaderBanner';

const initialDepartments = [
  { id: 1, name: 'Creator Acquisition', type: 'Business', agents: 8, supervisors: 2, leads: 312, conversion: '22%', status: 'Active', color: '#00f0ff', languages: ['English','Spanish','French'] },
  { id: 2, name: 'Creator Success', type: 'Business', agents: 6, supervisors: 1, leads: 204, conversion: '31%', status: 'Active', color: '#39ff14', languages: ['English','Spanish'] },
  { id: 3, name: 'Fan Acquisition', type: 'Business', agents: 10, supervisors: 2, leads: 518, conversion: '18%', status: 'Active', color: '#8a2be2', languages: ['English','Spanish','Portuguese','Korean'] },
  { id: 4, name: 'Fan Success', type: 'Business', agents: 7, supervisors: 2, leads: 290, conversion: '28%', status: 'Active', color: '#ff0055', languages: ['English','Arabic','Hindi'] },
  { id: 5, name: 'VIP Team', type: 'Business', agents: 4, supervisors: 1, leads: 48, conversion: '65%', status: 'Active', color: '#ffd700', languages: ['English','Spanish','French'] },
  { id: 6, name: 'KYC Team', type: 'Business', agents: 5, supervisors: 1, leads: 180, conversion: '88%', status: 'Active', color: '#00f0ff', languages: ['All'] },
  { id: 7, name: 'English Department', type: 'Language', agents: 14, supervisors: 3, leads: 578, conversion: '24%', status: 'Active', color: '#00f0ff', languages: ['English'] },
  { id: 8, name: 'Spanish Department', type: 'Language', agents: 9, supervisors: 2, leads: 231, conversion: '21%', status: 'Active', color: '#ffd700', languages: ['Spanish'] },
  { id: 9, name: 'French Department', type: 'Language', agents: 5, supervisors: 1, leads: 154, conversion: '19%', status: 'Active', color: '#8a2be2', languages: ['French'] },
  { id: 10, name: 'Arabic Department', type: 'Language', agents: 4, supervisors: 1, leads: 102, conversion: '17%', status: 'Active', color: '#ff7f00', languages: ['Arabic'] },
];

export default function DepartmentPerformance() {
  const [departments] = useState(initialDepartments);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = departments.filter(d =>
    (tab === 'All' || d.type === tab) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-10">
      <ReportHeaderBanner
        title="Department & Team Benchmark Report"
        subtitle="Executive view of structural headcount, ticket resolution speeds, and SLA compliance"
        measures="Compares team performance across units (Billing vs Support vs Onboarding), tracking average first-response times and resolution rates."
        audience="Department Heads & Shift Directors"
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Departments', value: departments.length, color: '#00f0ff', icon: Building2 },
          { label: 'Total Agents', value: departments.reduce((a,d)=>a+d.agents,0), color: '#39ff14', icon: Users },
          { label: 'Active Leads', value: departments.reduce((a,d)=>a+d.leads,0).toLocaleString(), color: '#8a2be2', icon: TrendingUp },
          { label: 'Languages', value: new Set(departments.flatMap(d=>d.languages)).size, color: '#ffd700', icon: Globe },
        ].map((s,i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.1*i }}
            className="glass-panel p-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color+'15', border:`1px solid ${s.color}30` }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search departments..."
            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2 pl-9 pr-4 text-sm text-gray-200 focus:outline-none focus:border-neon-blue/50" />
        </div>
        <div className="flex gap-2">
          {['All','Business','Language'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${tab===t?'bg-neon-blue/15 border-neon-blue/40 text-neon-blue':'border-gray-700 text-secondary hover:border-gray-600'}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((dept, i) => (
          <motion.div key={dept.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05*i }}
            className="glass-panel p-5 hover:border-neon-blue/20 transition-colors cursor-pointer group"
            style={{ borderColor: dept.color+'20' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: dept.color+'15', border:`1px solid ${dept.color}30` }}>
                  {dept.type === 'Language' ? <Globe size={18} style={{ color: dept.color }} /> : <Building2 size={18} style={{ color: dept.color }} />}
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-neon-blue transition-colors">{dept.name}</div>
                  <div className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5" style={{ background: dept.color+'15', color: dept.color }}>{dept.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-neon-green font-medium">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Agents', value: dept.agents },
                { label: 'Supervisors', value: dept.supervisors },
                { label: 'Active Leads', value: dept.leads },
              ].map(s => (
                <div key={s.label} className="bg-gray-900/50 rounded-lg p-2.5 text-center">
                  <div className="text-base font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-muted mb-1">Languages</div>
                <div className="flex flex-wrap gap-1">
                  {dept.languages.slice(0,3).map(l => (
                    <span key={l} className="text-[9px] px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-primary">{l}</span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted">Conversion</div>
                <div className="text-lg font-black" style={{ color: dept.color }}>{dept.conversion}</div>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="col-span-2 text-center text-muted py-10">No departments found.</div>}
      </div>
    </div>
  );
}
