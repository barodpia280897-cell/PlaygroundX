import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useUIState } from '../contexts/DataContext';

export default function PlatformLayout() {
  const [isSidebarOpen, setSidebarOpen] = useUIState('sidebar_open', false);

  return (
    <div className="flex h-screen bg-[#06080F] text-gray-200 overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-hidden flex flex-col relative">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 pb-4 md:pb-6 pt-4 [&:has(.no-scroll)]:overflow-hidden">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
