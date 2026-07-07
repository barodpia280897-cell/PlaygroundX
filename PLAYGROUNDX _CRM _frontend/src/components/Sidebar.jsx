import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLE_CONFIG } from '../contexts/AuthContext';
import { LogOut, ChevronDown, ChevronRight } from 'lucide-react';
import { PLATFORM_MENU, TENANT_MENU } from '../config/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppPath } from '../utils/routing';

// Role badge colors
const roleBadgeStyles = {
  ADMIN:       'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
  EXECUTIVE:   'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
  MANAGER:     'text-purple-300 bg-purple-500/10 border-purple-500/30',
  SUPERVISOR:  'text-orange-300 bg-orange-500/10 border-orange-500/30',
  AGENT:       'text-green-300 bg-green-500/10 border-green-500/30',
  VIEWER:      'text-primary bg-gray-500/10 border-gray-500/30',
  RECEPTIONIST:'text-pink-300 bg-pink-500/10 border-pink-500/30',
  TENANT_OWNER:'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
};

export default function Sidebar({ isOpen, setOpen }) {
  const { user, canAccess, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  // Multi-expand accordion state - persist in localStorage
  const [expandedGroups, setExpandedGroups] = useState(() => {
    try {
      const stored = localStorage.getItem('sidebar_expanded_groups');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const getPath = (path) => {
    if (path === '/') return user?.scope === 'PLATFORM' ? '/platform/dashboard' : getAppPath('/dashboard', user?.role);
    if (user?.scope === 'PLATFORM') return path;
    return getAppPath(path, user?.role);
  };

  const MENU_TO_USE = user?.scope === 'PLATFORM' ? PLATFORM_MENU : TENANT_MENU;

  // Auto-expand active group
  useEffect(() => {
    if (user?.scope === 'PLATFORM') return;

    const currentPath = location.pathname;
    const activeGroup = TENANT_MENU.find(group => 
      group.isGroup && group.children?.some(child => currentPath.endsWith(child.path) || currentPath.includes(child.path))
    );

    if (activeGroup) {
      setExpandedGroups(prev => {
        const next = new Set(prev);
        next.add(activeGroup.id);
        localStorage.setItem('sidebar_expanded_groups', JSON.stringify([...next]));
        return next;
      });
    }
  }, [location.pathname, user?.scope]);

  const handleGroupClick = (groupId) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      localStorage.setItem('sidebar_expanded_groups', JSON.stringify([...next]));
      return next;
    });
  };

  // Pre-process items for permissions
  const filterByRole = (items) => {
    if (!items) return [];
    return items.filter(item => 
      item.allowedRoles.includes('*') || (user && item.allowedRoles.includes(user.role))
    );
  };

  // For Platform, it's still category-based flat list. For Tenant, it's accordion.
  const isPlatform = user?.scope === 'PLATFORM';

  // Platform specific grouping (existing logic)
  const PLATFORM_CATEGORY_ORDER = ['Dashboard', 'Tenant Management', 'Billing & Payments', 'API & Webhooks', 'Support Center', 'System Settings'];
  const platformGrouped = filterByRole(PLATFORM_MENU).reduce((acc, item) => {
    const cat = item.category || 'root';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  
  const platformSections = PLATFORM_CATEGORY_ORDER.map(cat => ({
    label: cat === 'root' ? null : cat,
    items: platformGrouped[cat] || []
  })).filter(section => section.items.length > 0);

  // Tenant items (Accordion)
  const tenantGroups = MENU_TO_USE.filter(item => !item.isHidden && (item.allowedRoles.includes('*') || (user && item.allowedRoles.includes(user.role))));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out w-60 border-r border-gray-800/50 bg-panel backdrop-blur-xl flex flex-col z-40`}>
        {/* Logo */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-gray-800/50">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <span className="text-xs font-black text-black tracking-tighter">PGX</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white tracking-widest text-base leading-tight">
              PlayGroundX
            </span>
            <span className="text-[9px] text-neon-blue tracking-widest uppercase">{isPlatform ? 'GATEWAY' : 'CENTER'}</span>
          </div>
        </div>

        {/* Role badge */}
        {user && (
          <div className="px-4 py-2.5 border-b border-gray-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-700 shrink-0">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user.name}</div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${roleBadgeStyles[user.role] || ''}`}>
                  {user.roleLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-2">
          {isPlatform ? (
            // Platform Nav (Legacy grouped)
            platformSections.map((section) => (
              <div key={section.label || 'root'} className="mb-4">
                {section.label && (
                  <div className="px-3 mb-1 text-[9px] font-bold text-gray-600 uppercase tracking-widest">{section.label}</div>
                )}
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.id}
                      to={getPath(item.path)}
                      end={item.path === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200 text-sm group ${
                          isActive
                            ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_8px_rgba(0,240,255,0.08)]'
                            : 'text-muted hover:text-gray-200 hover:bg-white/5'
                        }`
                      }
                    >
                      <item.icon size={15} className="shrink-0" />
                      <span className="font-medium flex-1 truncate text-[13px]">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))
          ) : user?.role === 'RECEPTIONIST' ? (
            // RECEPTIONIST — flat nav (no accordion groups)
            <div className="space-y-0.5">
              {tenantGroups.map(group => {
                const children = filterByRole(group.children);
                return children.map(child => (
                  <NavLink
                    key={child.id}
                    to={getPath(child.path)}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm group ${
                        isActive
                          ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20 shadow-[0_0_8px_rgba(255,0,85,0.08)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <span className="font-medium text-[13px] truncate">{child.label}</span>
                    {child.badge && (
                      <span className={`text-[10px] py-0.5 px-1.5 rounded-full border font-bold ${child.badgeColor}`}>
                        {child.badge}
                      </span>
                    )}
                  </NavLink>
                ));
              })}
            </div>
          ) : (
            // Tenant Nav (Accordion)
            tenantGroups.map(group => {
              const children = filterByRole(group.children);
              if (children.length === 0) return null;

              const isExpanded = expandedGroups.has(group.id);
              
              // Badge preservation calculation
              const hasBadgeChild = children.some(c => c.badge);

              return (
                <div key={group.id} className="flex flex-col">
                  {/* Group Header */}
                  <button 
                    onClick={() => handleGroupClick(group.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group ${isExpanded ? 'text-white bg-white/5' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <group.icon size={16} className={`shrink-0 ${isExpanded ? 'text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]' : ''}`} />
                      <span className="font-semibold text-[13px] tracking-wide truncate">{group.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pl-2">
                      {!isExpanded && hasBadgeChild && (
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
                      )}
                      {isExpanded ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
                    </div>
                  </button>

                  {/* Children via Framer Motion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pl-9 pr-2 py-1 space-y-0.5">
                          {children.map(child => (
                            <NavLink
                              key={child.id}
                              to={getPath(child.path)}
                              onClick={() => setOpen(false)}
                              className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm group ${
                                  isActive
                                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[0_0_8px_rgba(0,240,255,0.08)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                              }
                            >
                              <span className="font-medium text-[13px] truncate">{child.id === 't-calendar' && user?.role === 'AGENT' ? 'My Follow-ups' : child.label}</span>
                              {child.badge && (
                                <span className={`text-[10px] py-0.5 px-1.5 rounded-full border font-bold ${child.badgeColor}`}>
                                  {child.badge}
                                </span>
                              )}
                            </NavLink>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </nav>

        {/* PGX AI Assistant - compact row above logout */}
        {!isPlatform && (
          <div className="px-3 pb-2 border-t border-gray-800/50 pt-2">
            <button
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event('open-pgx-ai-chat'));
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-[rgba(99,102,241,0.22)] hover:border-[rgba(99,102,241,0.45)] transition-all group cursor-pointer text-left"
              style={{ background: 'linear-gradient(135deg,#0d1130 0%,#0a0c1a 100%)' }}
            >
              {/* Mini robot avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(99,102,241,0.3)] shrink-0"
                style={{ background: 'linear-gradient(145deg,#312e81,#1e1b4b)' }}
              >
                <svg viewBox="0 0 64 64" width="26" height="26">
                  <rect x="16" y="20" width="32" height="24" rx="6" fill="#6366f1" />
                  <rect x="21" y="27" width="9" height="7" rx="2.5" fill="#fff" opacity="0.9" />
                  <rect x="34" y="27" width="9" height="7" rx="2.5" fill="#fff" opacity="0.9" />
                  <circle cx="25.5" cy="30.5" r="2.5" fill="#312e81" />
                  <circle cx="38.5" cy="30.5" r="2.5" fill="#312e81" />
                  <rect x="25" y="38" width="14" height="2.5" rx="1.25" fill="#fff" opacity="0.6" />
                  <rect x="30" y="12" width="4" height="8" rx="2" fill="#818cf8" />
                  <circle cx="32" cy="10" r="3.5" fill="#a5b4fc" />
                  <rect x="5" y="24" width="11" height="5" rx="2.5" fill="#4f46e5" />
                  <rect x="48" y="24" width="11" height="5" rx="2.5" fill="#4f46e5" />
                </svg>
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-[#818cf8] leading-tight">PGX AI Assistant</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_4px_rgba(74,222,128,0.8)]" />
                  <span className="text-[9px] font-bold text-green-400 tracking-widest">ONLINE</span>
                </div>
              </div>
              {/* Chat label */}
              <span className="text-[10px] font-semibold text-indigo-400 group-hover:text-indigo-300 shrink-0">Chat →</span>
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-gray-800/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_8px_rgba(255,0,85,0.2)] transition-all">
            <LogOut size={15} className="shrink-0" />
            <span className="font-bold tracking-wider text-[13px]">LOGOUT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
