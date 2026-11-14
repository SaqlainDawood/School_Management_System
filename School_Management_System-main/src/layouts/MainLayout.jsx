import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();

  useEffect(() => {
    const handleCollapseChange = (e) => {
      if (e.detail && typeof e.detail.collapsed === 'boolean') {
        setIsCollapsed(e.detail.collapsed);
      }
    };
    window.addEventListener('sidebar-collapse-change', handleCollapseChange);
    return () => window.removeEventListener('sidebar-collapse-change', handleCollapseChange);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Container adjusted for Desktop Sidebar */}
      <div
        className={`flex-1 flex flex-col transition-[margin-left] duration-300 ease-in-out ${
          isCollapsed ? 'md:ml-[72px]' : 'md:ml-60'
        }`}
      >
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          mobileOpen={mobileOpen}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
