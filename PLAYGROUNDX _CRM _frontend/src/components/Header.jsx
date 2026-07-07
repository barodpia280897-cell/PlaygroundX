import { useState } from 'react';
import { Search, Bell, MessageSquare, LogOut, Plus, Phone, Menu, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDepartment } from '../contexts/DepartmentContext';
import { useNavigate } from 'react-router-dom';
import NotificationsModal from './modals/NotificationsModal';
import MessagesModal from './modals/MessagesModal';
import QuickActionModal from './modals/QuickActionModal';
import ActiveCallWidget from './widgets/ActiveCallWidget';
import EmailModal from './modals/EmailModal';
import WhatsAppModal from './modals/WhatsAppModal';
import TeamBroadcastModal from './modals/TeamBroadcastModal';
import PlatformBroadcastModal from './modals/PlatformBroadcastModal';
import LogCallNoteModal from './modals/LogCallNoteModal';
import MyFollowupsModal from './modals/MyFollowupsModal';
import SupervisorHelpModal from './modals/SupervisorHelpModal';
import Customer360Modal from './modals/Customer360Modal';

export default function Header({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const { selectedDepartment, setSelectedDepartment, availableDepartments } = useDepartment();
  const navigate = useNavigate();
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showLogCallNote, setShowLogCallNote] = useState(false);
  const [showFollowups, setShowFollowups] = useState(false);
  const [showSupervisorHelp, setShowSupervisorHelp] = useState(false);
  const [callTarget, setCallTarget] = useState(null);
  const [customer360Target, setCustomer360Target] = useState(null);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      <header className="h-16 md:h-20 border-b border-gray-800/50 bg-background/80 backdrop-blur-lg px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <button className="lg:hidden text-secondary hover:text-white p-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div>
            <h1 className="text-sm sm:text-base md:text-xl font-black text-white tracking-tight flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded overflow-hidden shrink-0 flex items-center justify-center bg-gradient-to-tr from-neon-blue to-neon-purple">
                <span className="text-[10px] font-black text-black tracking-tighter">PGX</span>
              </div>
              <span className="text-neon-blue drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">PlayGroundX</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple">
                 {user?.scope === 'PLATFORM' ? 'GATEWAY' : 'CENTER'}
              </span>
            </h1>
            <p className="hidden sm:block text-[10px] text-muted tracking-wide">{user?.tenantName || 'PlayGroundX Command & Operations Center'}</p>
          </div>
        </div>

        {/* Center Department Dropdown */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <button
              id="header-department-selector"
              onClick={() => setShowDeptDropdown(!showDeptDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 transition-colors"
            >
              <Globe size={14} className="text-neon-blue" />
              <span>{selectedDepartment?.name || 'All Departments'}</span>
              <ChevronDown size={14} className={`text-muted transition-transform ${showDeptDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDeptDropdown && (
              <div className="absolute top-full mt-2 w-56 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-1 z-50">
                {availableDepartments?.map(dept => (
                  <button
                    key={dept.id || dept}
                    onClick={() => { setSelectedDepartment(dept); setShowDeptDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-white/5 flex items-center justify-between ${selectedDepartment?.id === dept.id ? 'text-neon-blue bg-neon-blue/10' : 'text-gray-400 hover:text-white'}`}
                  >
                    <span className="flex items-center gap-2">{dept.flag} <span>{dept.name || dept}</span></span>
                    {selectedDepartment?.id === dept.id && <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <button id="header-quick-action" onClick={() => setShowQuickAction(true)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:border-neon-blue transition-all">
            <Plus size={14} className="text-neon-blue" />
            <span className="hidden sm:inline">Quick Actions</span>
            <span className="text-[10px] bg-white/10 px-1 rounded text-muted hidden md:inline">⌘K</span>
          </button>

          <div className="flex items-center gap-1">
            <button id="header-call" onClick={() => { setCallTarget(null); setShowCall(true); }}
              className="hidden md:block relative text-secondary hover:text-neon-green transition-colors p-1.5 rounded-lg hover:bg-neon-green/10"
              title="Call Center">
              <Phone size={17} />
            </button>

            {/* Notifications */}
            <button id="header-notifications" onClick={() => { setShowNotif(v => !v); setShowMessages(false); }}
              className="relative text-secondary hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Notifications">
              <Bell size={17} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-pink rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(255,0,85,0.5)]">4</span>
            </button>

            {/* Messages */}
            <button id="header-messages" onClick={() => { setShowMessages(v => !v); setShowNotif(false); }}
              className="hidden md:block relative text-secondary hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
              title="Messages">
              <MessageSquare size={17} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-neon-blue rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.5)]">6</span>
            </button>
          </div>

          {/* Profile + Logout */}
          <div className="hidden md:flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-gray-800">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.name || 'Admin'}</div>
              <div className="text-[10px] text-gray-600">{user?.roleLabel || 'Admin'}</div>
            </div>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700 hover:border-neon-blue transition-colors cursor-pointer">
              <img src={user?.avatar || 'https://i.pravatar.cc/150?img=47'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button id="header-logout" onClick={handleLogout} title="Logout"
              className="text-neon-pink hover:text-white transition-colors p-1.5 rounded-lg hover:bg-neon-pink/10">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <NotificationsModal open={showNotif} onClose={() => setShowNotif(false)} />
      <MessagesModal open={showMessages} onClose={() => setShowMessages(false)} />
      <QuickActionModal 
        open={showQuickAction} 
        onClose={() => setShowQuickAction(false)} 
        onCallClick={() => setShowCall(true)}
        onEmailClick={() => setShowEmail(true)}
        onWhatsAppClick={() => setShowWhatsApp(true)}
        onBroadcastClick={() => setShowBroadcast(true)}
        onLogCallNoteClick={() => setShowLogCallNote(true)}
        onFollowupsClick={() => setShowFollowups(true)}
        onSupervisorHelpClick={() => setShowSupervisorHelp(true)}
      />
      <ActiveCallWidget open={showCall} onClose={() => { setShowCall(false); setCallTarget(null); }} targetMember={callTarget} />
      <EmailModal open={showEmail} onClose={() => setShowEmail(false)} />
      <WhatsAppModal open={showWhatsApp} onClose={() => setShowWhatsApp(false)} />
      {user?.scope === 'PLATFORM' ? (
        <PlatformBroadcastModal open={showBroadcast} onClose={() => setShowBroadcast(false)} />
      ) : (
        <TeamBroadcastModal open={showBroadcast} onClose={() => setShowBroadcast(false)} />
      )}
      <LogCallNoteModal open={showLogCallNote} onClose={() => setShowLogCallNote(false)} onStartCall={(member) => { setCallTarget(member || null); setShowLogCallNote(false); setShowCall(true); }} onOpen360={(member) => setCustomer360Target(member)} />
      <MyFollowupsModal open={showFollowups} onClose={() => setShowFollowups(false)} />
      <SupervisorHelpModal open={showSupervisorHelp} onClose={() => setShowSupervisorHelp(false)} />
      <Customer360Modal open={!!customer360Target} onClose={() => setCustomer360Target(null)} member={customer360Target} onStartCall={(member) => { setCustomer360Target(null); setCallTarget(member || null); setShowCall(true); }} />
    </>
  );
}
