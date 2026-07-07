import { useState } from 'react';
import { Outlet, useLocation, useParams, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUIState } from '../contexts/DataContext';
import { getRolePrefix } from '../utils/routing';

export default function MainLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useUIState('sidebar_open', false);
  const location = useLocation();

  const { rolePrefix } = useParams();

  // Validate the URL prefix matches the user's actual role prefix
  const expectedPrefix = getRolePrefix(user?.role);
  if (rolePrefix && rolePrefix !== expectedPrefix && rolePrefix !== 'app') {
    return <Navigate to={`/${expectedPrefix}/dashboard`} replace />;
  }

  const getBreadcrumbs = () => {
    const path = location.pathname.split('/').filter(Boolean);
    // Ignore prefix in breadcrumbs
    if (path.length > 0 && path[0] === rolePrefix) path.shift();
    if (path.length === 0) return 'Dashboard';
    return path.map(p => p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ')).join(' / ');
  };

  return (
    <div className="flex h-screen bg-background text-gray-200 overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {user?.role === 'VIEWER' && (
            <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center justify-center gap-2">
              <span className="text-yellow-500 text-sm font-bold">Read Only Mode:</span>
              <span className="text-yellow-400 text-xs">You are viewing this data with Viewer permissions. Changes are disabled.</span>
            </div>
          )}
          <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 sm:px-4 md:px-6 pb-4 md:pb-6 pt-3 sm:pt-4 main-content-area [&:has(.no-scroll)]:overflow-hidden">
            <div className="w-full min-w-0 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
