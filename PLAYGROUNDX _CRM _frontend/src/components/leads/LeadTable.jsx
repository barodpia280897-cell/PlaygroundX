import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Eye, Phone, Mail, ChevronDown, ChevronUp, ChevronsUpDown, Users, Pencil, Trash2, MessageSquare } from 'lucide-react';
import Badge from '../ui/Badge';
import ScoreCell from '../ui/ScoreCell';
import ConfirmModal from '../ui/ConfirmModal';
import EditLeadModal from './EditLeadModal';
import CallModal from '../modals/CallModal';
import EmptyState from '../ui/EmptyState';
import { useToast } from '../../contexts/ToastContext';

export default function LeadTable({ leads, config, onCall, onView, onDelete, onEdit }) {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [callTarget, setCallTarget] = useState(null);
  const { addToast } = useToast();
  const itemsPerPage = 10;

  // ─── Sorting ───────────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const sorted = [...leads].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginatedLeads = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleAll = (e) => setSelectedLeads(e.target.checked ? leads.map(l => l.id) : []);
  const toggleOne = (id) => setSelectedLeads(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const renderSortIcon = (k) => {
    if (sortKey !== k) return <ChevronsUpDown size={10} className="text-gray-600 inline ml-1" />;
    return sortDir === 'asc'
      ? <ChevronUp size={10} className="text-neon-blue inline ml-1" />
      : <ChevronDown size={10} className="text-neon-blue inline ml-1" />;
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'WhatsApp': return <MessageSquare size={12} className="text-[#25D366]" />;
      case 'SMS': return <MessageSquare size={12} className="text-[#00f0ff]" />;
      case 'Email': return <Mail size={12} className="text-[#8a2be2]" />;
      case 'Phone': return <Phone size={12} className="text-[#ffd700]" />;
      default: return <MessageSquare size={12} className="text-gray-400" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 350) return { text: 'text-neon-green' };
    if (score >= 250) return { text: 'text-neon-green' };
    if (score >= 100) return { text: 'text-yellow-400' };
    return { text: 'text-red-500' };
  };

  // ─── Confirm Delete ────────────────────────────────────────────────────────
  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      addToast('success', 'Lead Deleted', 'Lead deleted successfully');
    }
  };

  // ─── Confirm Edit ──────────────────────────────────────────────────────────
  const handleConfirmEdit = (updatedFields) => {
    if (editTarget) {
      onEdit(editTarget.id, updatedFields);
      addToast('success', 'Lead Updated', 'Lead updated successfully');
    }
  };

  return (
    <>
      <div className="bg-panel/30 border border-gray-800/50 rounded-2xl overflow-hidden shadow-lg mt-4 flex-1 flex flex-col min-w-0">
        <div className="hidden md:block overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/30">
                <th className="table-th">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={selectedLeads.length === leads.length && leads.length > 0} onChange={toggleAll} className="rounded bg-gray-800 border-gray-700" />
                    <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">Lead {renderSortIcon('name')}</button>
                  </div>
                </th>
                <th className="table-th">
                  <button onClick={() => handleSort('type')} className="flex items-center gap-1 hover:text-white transition-colors">Lead Type {renderSortIcon('type')}</button>
                </th>
                <th className="table-th">
                  <button onClick={() => handleSort('stage')} className="flex items-center gap-1 hover:text-white transition-colors">Pipeline / Stage {renderSortIcon('stage')}</button>
                </th>
                <th className="table-th">
                  <button onClick={() => handleSort('leadScore')} className="flex items-center gap-1 hover:text-white transition-colors">Score {renderSortIcon('leadScore')}</button>
                </th>
                <th className="table-th">Language</th>
                <th className="table-th">Primary Channel</th>
                {config.showAgent && <th className="table-th">Assigned Agent</th>}
                <th className="table-th">
                  <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1 hover:text-white transition-colors">Last Activity {renderSortIcon('createdAt')}</button>
                </th>
                <th className="table-th">
                  <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-white transition-colors">Status {renderSortIcon('status')}</button>
                </th>
                {(config.canAct || config.canView) && <th className="table-th text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {paginatedLeads.length === 0 ? (
                <tr>
                  <td colSpan={config.showAgent ? 10 : 9} className="py-12">
                    <EmptyState 
                      icon={Users} 
                      title="No leads found" 
                      description="Try adjusting your search or filters to find leads."
                    />
                  </td>
                </tr>
              ) : paginatedLeads.map((lead, i) => {
                const scoreInfo = getScoreColor(lead.leadScore);
                return (
                  <motion.tr key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => onView && onView(lead)}
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                    
                    {/* Lead Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={() => toggleOne(lead.id)} onClick={e=>e.stopPropagation()} className="rounded bg-gray-800 border-gray-700 mt-1 shrink-0" />
                        <img src={lead.avatar} alt={lead.name} className="w-9 h-9 rounded-full object-cover border border-gray-700 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-200 group-hover:text-neon-blue transition-colors truncate">{lead.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{lead.email}</p>
                          <p className="text-[10px] text-gray-500 truncate">{lead.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Lead Type */}
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${lead.type === 'Creator' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' : 'bg-neon-pink/10 text-neon-pink border-neon-pink/20'}`}>
                        {lead.type}
                      </span>
                    </td>

                    {/* Pipeline / Stage */}
                    <td className="px-4 py-3">
                      <div className="text-[10px] font-bold text-gray-200">{lead.stage}</div>
                      <div className="text-[9px] text-gray-500 mt-0.5">{lead.source}</div>
                    </td>

                    {/* Score */}
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-black ${scoreInfo.text}`}>{lead.leadScore ?? '—'}</span>
                    </td>

                    {/* Language */}
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-gray-400">{lead.language} {lead.flag}</span>
                    </td>

                    {/* Channel */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {getChannelIcon(lead.channel)}
                        <span className="text-[10px] text-gray-400">{lead.channel || 'WhatsApp'}</span>
                      </div>
                    </td>

                    {/* Agent */}
                    {config.showAgent && (
                      <td className="px-4 py-3">
                        <span className="text-[10px] text-gray-300">{lead.agent || 'Unassigned'}</span>
                      </td>
                    )}

                    {/* Date */}
                    <td className="px-4 py-3">
                      <span className="text-[10px] text-gray-500">{lead.createdAt}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          lead.status==='Hot Lead' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          lead.status==='VIP Prospect' ? 'bg-neon-purple/10 text-neon-purple border-neon-purple/20' :
                          lead.status==='Interested' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20' :
                          'bg-gray-800 text-gray-400 border-gray-700'
                      }`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Actions */}
                    {(config.canAct || config.canView) && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
                          {config.canAct && (
                            <button onClick={(e) => { e.stopPropagation(); if (onCall) { onCall(lead); } else { setCallTarget(lead); } }} className="p-1.5 rounded-lg hover:bg-neon-green/20 text-gray-400 hover:text-neon-green transition-colors" title="Call Lead">
                              <Phone size={14} />
                            </button>
                          )}
                          {(config.canView || config.canAct) && (
                            <button onClick={(e) => { e.stopPropagation(); onView && onView(lead); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="View Profile">
                              <Eye size={14} />
                            </button>
                          )}
                          {config.canAct && (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setEditTarget(lead); setOpenMenuId(null); }} className="p-1.5 rounded-lg hover:bg-neon-blue/20 text-gray-400 hover:text-neon-blue transition-colors" title="Edit Lead">
                                <Pencil size={14} />
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(lead); setOpenMenuId(null); }} className="p-1.5 rounded-lg hover:bg-neon-pink/20 text-gray-400 hover:text-neon-pink transition-colors" title="Delete Lead">
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (<768px) */}
        <div className="md:hidden divide-y divide-gray-800/60 flex-1 overflow-y-auto">
          {paginatedLeads.length === 0 ? (
            <div className="py-12">
              <EmptyState icon={Users} title="No leads found" description="Adjust filters to find leads" />
            </div>
          ) : paginatedLeads.map((lead) => {
            const scoreInfo = getScoreColor(lead.leadScore);
            return (
              <div key={lead.id} onClick={() => onView && onView(lead)} className="p-4 space-y-3 hover:bg-white/[0.02] active:bg-white/[0.05] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={(e) => { e.stopPropagation(); toggleOne(lead.id); }} className="rounded bg-gray-800 border-gray-700 shrink-0 mt-0.5" />
                    <img src={lead.avatar} alt={lead.name} className="w-9 h-9 rounded-full object-cover border border-gray-700 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate flex items-center gap-1.5">{lead.name} <span className="text-xs">{lead.flag}</span></div>
                      <div className="text-xs text-gray-400 truncate">{lead.email}</div>
                    </div>
                  </div>
                  <Badge variant={lead.status === 'Won' ? 'success' : lead.status === 'Lost' ? 'danger' : lead.status === 'Contacted' ? 'info' : 'warning'}>
                    {lead.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 bg-gray-900/50 p-2.5 rounded-xl border border-gray-800/60">
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-semibold">Type & Stage</span>
                    <span className="font-medium text-white">{lead.type} &bull; {lead.stage || lead.pipeline}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 block uppercase font-semibold">Score & Lang</span>
                    <span className={`font-bold ${scoreInfo.text}`}>{lead.leadScore ?? '—'}</span> <span className="text-gray-400">({lead.language || 'English'})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    {getChannelIcon(lead.channel)}
                    <span>{lead.channel}</span>
                    {config.showAgent && lead.assignedTo && <span className="text-gray-500 ml-1">&bull; {lead.assignedTo}</span>}
                  </div>
                  {config.canEdit && (
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button onClick={() => onCall(lead)} className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-yellow-400 rounded-lg border border-gray-700/50 transition-colors" title="Call">
                        <Phone size={13} />
                      </button>
                      <button onClick={() => setEditTarget(lead)} className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-blue-400 rounded-lg border border-gray-700/50 transition-colors" title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteTarget(lead)} className="p-1.5 bg-gray-800/80 hover:bg-gray-700 text-red-400 rounded-lg border border-gray-700/50 transition-colors" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-800/50 flex items-center justify-between bg-gray-900/30 text-xs text-gray-500 shrink-0">
          <div>Showing {leads.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, leads.length)} of {leads.length} leads</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 disabled:opacity-50">&lt;</button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const page = i + 1;
              return (
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-6 h-6 flex items-center justify-center rounded ${currentPage === page ? 'bg-neon-blue text-black font-bold' : 'hover:bg-white/10'}`}>
                  {page}
                </button>
              );
            })}
            {totalPages > 5 && <span className="text-gray-600 px-1">...</span>}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-gray-500 disabled:opacity-50">&gt;</button>
          </div>
          <div className="hidden sm:block text-gray-500">10 / page <ChevronDown size={12} className="inline ml-1" /></div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <ConfirmModal
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
            title="Delete Lead"
            message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
            confirmText="Delete Lead"
            variant="danger"
          />
        )}
      </AnimatePresence>

      {/* Edit Lead Modal */}
      <AnimatePresence>
        {editTarget && (
          <EditLeadModal
            open={!!editTarget}
            lead={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={handleConfirmEdit}
          />
        )}
      </AnimatePresence>

      {/* Built-in Call Console Modal */}
      <CallModal
        open={!!callTarget}
        lead={callTarget}
        onClose={() => setCallTarget(null)}
      />
    </>
  );
}
