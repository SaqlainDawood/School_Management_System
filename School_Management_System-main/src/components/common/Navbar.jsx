import React, { useState, useRef, useEffect } from 'react';
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiUser,
  FiMoon,
  FiSun,
  FiLogOut,
  FiSettings,
  FiX,
  FiArrowRight,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ROLE_LABELS } from '../../utils/constants';

const ROUTE_DIRECTORY = [
  { path: '/admin/dashboard', title: 'Admin Dashboard', roles: ['admin'] },
  { path: '/admin/students', title: 'Student Management', roles: ['admin'] },
  { path: '/admin/teachers', title: 'Teacher Directory', roles: ['admin'] },
  { path: '/admin/classes', title: 'Class Management', roles: ['admin'] },
  { path: '/admin/subjects', title: 'Subject Directory', roles: ['admin'] },
  { path: '/admin/exams', title: 'Examinations', roles: ['admin'] },
  { path: '/admin/results', title: 'Academic Results', roles: ['admin'] },
  { path: '/admin/attendance', title: 'Attendance Tracking', roles: ['admin'] },
  { path: '/admin/fees', title: 'Fee Management', roles: ['admin'] },
  { path: '/admin/timetable', title: 'Timetable Schedules', roles: ['admin'] },
  { path: '/admin/transport', title: 'Transport Routes', roles: ['admin'] },
  { path: '/admin/library', title: 'Library Catalog', roles: ['admin'] },
  { path: '/admin/notices', title: 'Notice Board', roles: ['admin'] },
  { path: '/admin/reports', title: 'Institutional Reports', roles: ['admin'] },
  { path: '/admin/settings', title: 'System Settings', roles: ['admin'] },
  { path: '/teacher/dashboard', title: 'Teacher Dashboard', roles: ['teacher'] },
  { path: '/teacher/classes', title: 'My Classes', roles: ['teacher'] },
  { path: '/teacher/attendance', title: 'Class Attendance', roles: ['teacher'] },
  { path: '/teacher/assignments', title: 'Assignments', roles: ['teacher'] },
  { path: '/teacher/results', title: 'Gradebook & Results', roles: ['teacher'] },
  { path: '/teacher/profile', title: 'Teacher Profile', roles: ['teacher'] },
  { path: '/student/dashboard', title: 'Student Dashboard', roles: ['student'] },
  { path: '/student/profile', title: 'My Profile', roles: ['student'] },
  { path: '/student/attendance', title: 'My Attendance', roles: ['student'] },
  { path: '/student/results', title: 'My Report Card', roles: ['student'] },
  { path: '/student/fees', title: 'Fee Invoices', roles: ['student'] },
  { path: '/student/assignments', title: 'Coursework', roles: ['student'] },
  { path: '/student/timetable', title: 'My Class Schedule', roles: ['student'] },
  { path: '/parent/dashboard', title: 'Parent Portal', roles: ['parent'] },
  { path: '/parent/children', title: 'Enrolled Children', roles: ['parent'] },
  { path: '/parent/attendance', title: 'Attendance Monitoring', roles: ['parent'] },
  { path: '/parent/results', title: 'Children Grades', roles: ['parent'] },
  { path: '/parent/fees', title: 'Fee Invoices', roles: ['parent'] },
  { path: '/coordinator/dashboard', title: 'Coordinator Overview', roles: ['coordinator'] },
  { path: '/coordinator/departments', title: 'Academic Departments', roles: ['coordinator'] },
  { path: '/coordinator/attendance', title: 'Department Attendance', roles: ['coordinator'] },
  { path: '/coordinator/reports', title: 'Academic Reports', roles: ['coordinator'] },
  { path: '/examination/dashboard', title: 'Exam Controller', roles: ['examination'] },
  { path: '/examination/exams', title: 'Exam Registry', roles: ['examination'] },
  { path: '/examination/results', title: 'Grade Ledger', roles: ['examination'] },
  { path: '/examination/datesheets', title: 'Date Sheet Schedules', roles: ['examination'] },
  { path: '/superadmin/dashboard', title: 'SuperAdmin HQ', roles: ['superadmin'] },
  { path: '/superadmin/schools', title: 'Registered Schools', roles: ['superadmin'] },
  { path: '/superadmin/users', title: 'Global Directory', roles: ['superadmin'] },
  { path: '/superadmin/analytics', title: 'Platform Analytics', roles: ['superadmin'] },
  { path: '/superadmin/settings', title: 'Platform Settings', roles: ['superadmin'] },
  { path: '/profile', title: 'User Profile', roles: ['admin', 'teacher', 'student', 'parent', 'coordinator', 'examination', 'superadmin'] },
];

const Navbar = ({ toggleSidebar, mobileOpen, onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userRole = user?.role || 'student';
  const roleLabel = ROLE_LABELS[userRole] || userRole;
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // Filter routes permissible for current user role
  const searchableRoutes = ROUTE_DIRECTORY.filter(
    (r) => r.roles.includes(userRole) && r.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelectRoute = (path) => {
    navigate(path);
    setShowSearchModal(false);
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-white dark:bg-[#162033] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between transition-colors">
      {/* ── Left: Hamburger & Search ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick || toggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
          aria-label="Toggle navigation"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Global Quick-Find (Permitted Routes Search) */}
        <div className="relative">
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs transition-colors w-44 sm:w-64 text-left group"
          >
            <FiSearch className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
            <span className="truncate">Search modules...</span>
            <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 rounded text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400">
              Ctrl+K
            </kbd>
          </button>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle color theme"
        >
          {isDark ? (
            <FiSun className="text-lg text-amber-400" />
          ) : (
            <FiMoon className="text-lg text-slate-600" />
          )}
        </button>

        {/* Notification Bell (No Fake Live Data, Honest State) */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
            aria-label="Notifications"
          >
            <FiBell className="text-lg" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#162033] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 p-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Notifications
                  </h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    0 unread
                  </span>
                </div>
                <div className="py-8 text-center text-slate-400 dark:text-slate-500 space-y-1">
                  <FiBell className="w-8 h-8 mx-auto stroke-1 opacity-50 mb-2" />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">No active alerts</p>
                  <p className="text-[11px] text-slate-400">Institutional notifications will appear here</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User menu"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px] leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 capitalize leading-none mt-0.5">
                {roleLabel}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#162033] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 p-2"
              >
                <div className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {user?.email}
                  </p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {roleLabel}
                  </span>
                </div>

                <div className="space-y-0.5 pt-1">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfile(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <FiUser className="text-sm text-slate-400" /> My Profile
                  </button>

                  {(userRole === 'admin' || userRole === 'superadmin') && (
                    <button
                      onClick={() => {
                        navigate(userRole === 'admin' ? '/admin/settings' : '/superadmin/settings');
                        setShowProfile(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <FiSettings className="text-sm text-slate-400" /> Settings
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <FiLogOut className="text-sm text-rose-500" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Quick-Find Search Modal ── */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#162033] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden"
            >
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <FiSearch className="text-slate-400 ml-1.5" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Jump to module (e.g. students, fees, results)..."
                  className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <FiX className="text-base" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto p-2 space-y-1">
                {searchableRoutes.length > 0 ? (
                  searchableRoutes.map((route) => (
                    <button
                      key={route.path}
                      onClick={() => handleSelectRoute(route.path)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors group"
                    >
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {route.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        {route.path}
                        <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No matching modules found for your role.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
