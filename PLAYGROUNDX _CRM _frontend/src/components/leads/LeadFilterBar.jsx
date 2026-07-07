import { useState } from 'react';
import { Search, ChevronDown, Filter, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

import { useToast } from '../../contexts/ToastContext';

export default function LeadFilterBar({ search, setSearch, filters, setFilters, onAdd, canAdd, userRole }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const toggle = (id) => setOpenDropdown(prev => prev === id ? null : id);
  const { addToast } = useToast();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} 
      className="bg-panel/40 border border-gray-800/60 rounded-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
      
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          placeholder="Search leads, contacts, email, phone..." 
          className="w-full bg-gray-900/60 border border-gray-700 rounded-xl py-2 pl-9 pr-4 text-xs text-gray-200 focus:outline-none focus:border-neon-blue/50 transition-all placeholder:text-gray-600" 
        />
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 ml-auto shrink-0 flex-wrap sm:flex-nowrap">
        
        {/* Filters Button */}
        <div className="relative">
          <button onClick={() => toggle('filters')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
            <Filter size={14} /> Filters
          </button>
          
          {openDropdown === 'filters' && (
            <div className="absolute top-full left-0 sm:right-auto mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-64 bg-gray-950 border border-gray-800 rounded-xl p-4 z-50 shadow-2xl text-left" onClick={e=>e.stopPropagation()}>
              <div className="text-sm font-bold text-white mb-4">Filter Leads</div>
              
              <div className="space-y-3">
                <div>
                  <label className="table-th block mb-1">Pipeline</label>
                  <select value={filters.pipeline} onChange={e => setFilters({...filters, pipeline: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue/50">
                    <option>All Pipelines</option>
                    <option>Creator</option>
                    <option>Fan</option>
                  </select>
                </div>
                <div>
                  <label className="table-th block mb-1">Lead Type</label>
                  <select value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue/50">
                    <option>All Types</option>
                    <option>Creator</option>
                    <option>Fan</option>
                  </select>
                </div>
                <div>
                  <label className="table-th block mb-1">Language</label>
                  <select value={filters.language} onChange={e => setFilters({...filters, language: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neon-blue/50">
                    <option>All Languages</option>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-800 flex justify-end gap-2">
                <button onClick={() => { setFilters({ type: 'All Types', pipeline: 'All Pipelines', language: 'All Languages' }); toggle(null); }} className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">Clear</button>
                <button onClick={() => toggle(null)} className="px-4 py-2 rounded-lg bg-neon-blue text-black font-bold text-xs hover:bg-cyan-400 transition-colors">Apply Filters</button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-800 hidden sm:block"></div>

        {/* Actions */}
        {userRole !== 'VIEWER' && (
          <button onClick={() => addToast('Exporting data as CSV...', 'success')} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-700 bg-gray-900/50 text-xs font-bold text-gray-300 hover:text-white hover:border-gray-600 transition-colors">
            <Download size={14} /> Export
          </button>
        )}
        
        {canAdd && (
          <button onClick={onAdd}
            className="bg-neon-blue text-black font-bold text-xs px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all flex items-center gap-1.5 whitespace-nowrap">
            <Plus size={14} /> Add Lead
          </button>
        )}
      </div>

    </motion.div>
  );
}
