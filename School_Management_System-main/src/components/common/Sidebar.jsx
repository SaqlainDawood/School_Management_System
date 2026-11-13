import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiUsers,
  FiUser,
  FiBook,
  FiCalendar,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiClock,
  FiAward,
  FiFileText,
  FiLayers,
  FiBookOpen,
  FiLogOut,
  FiMapPin,
  FiBell,
  FiClipboard,
} from 'react-icons/fi';
import { IoMdSchool } from 'react-icons/io';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

const Sidebar = ({ isOpen, user, isMobile, toggleSidebar }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case ROLES.SUPER_ADMIN:
        return [
          { to: '/superadmin/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/superadmin/schools', icon: FiMapPin, label: 'Schools' },
          { to: '/superadmin/users', icon: FiUsers, label: 'Users' },
          { to: '/superadmin/analytics', icon: FiBarChart2, label: 'Analytics' },
          { to: '/superadmin/settings', icon: FiSettings, label: 'Settings' },
        ];
      case ROLES.ADMIN:
        return [
          { to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/admin/students', icon: FiUsers, label: 'Students' },
          { to: '/admin/teachers', icon: FiUser, label: 'Teachers' },
          { to: '/admin/classes', icon: FiLayers, label: 'Classes' },
          { to: '/admin/subjects', icon: FiBook, label: 'Subjects' },
          { to: '/admin/attendance', icon: FiClock, label: 'Attendance' },
          { to: '/admin/exams', icon: FiAward, label: 'Exams' },
          { to: '/admin/results', icon: FiBarChart2, label: 'Results' },
          { to: '/admin/fees', icon: FiDollarSign, label: 'Fees' },
          { to: '/admin/timetable', icon: FiCalendar, label: 'Timetable' },
          { to: '/admin/transport', icon: FiMapPin, label: 'Transport' },
        ];
      case ROLES.TEACHER:
        return [
          { to: '/teacher/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/teacher/attendance', icon: FiClock, label: 'Attendance' },
          { to: '/teacher/assignments', icon: FiFileText, label: 'Assignments' },
          { to: '/teacher/results', icon: FiBarChart2, label: 'Results' },
          { to: '/teacher/classes', icon: FiLayers, label: 'Classes' },
          { to: '/teacher/profile', icon: FiUser, label: 'Profile' },
        ];
      case ROLES.STUDENT:
        return [
          { to: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/student/profile', icon: FiUser, label: 'Profile' },
          { to: '/student/attendance', icon: FiClock, label: 'Attendance' },
          { to: '/student/results', icon: FiBarChart2, label: 'Results' },
          { to: '/student/fees', icon: FiDollarSign, label: 'Fees' },
          { to: '/student/assignments', icon: FiFileText, label: 'Assignments' },
          { to: '/student/timetable', icon: FiCalendar, label: 'Timetable' },
        ];
      case ROLES.PARENT:
        return [
          { to: '/parent/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/parent/children', icon: FiUsers, label: 'Children' },
          { to: '/parent/attendance', icon: FiClock, label: 'Attendance' },
          { to: '/parent/results', icon: FiBarChart2, label: 'Results' },
          { to: '/parent/fees', icon: FiDollarSign, label: 'Fees' },
        ];
      case ROLES.COORDINATOR:
        return [
          { to: '/coordinator/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/coordinator/departments', icon: FiLayers, label: 'Departments' },
          { to: '/coordinator/attendance', icon: FiClock, label: 'Attendance' },
          { to: '/coordinator/reports', icon: FiClipboard, label: 'Reports' },
        ];
      case ROLES.EXAMINATION:
        return [
          { to: '/examination/dashboard', icon: FiHome, label: 'Dashboard' },
          { to: '/examination/exams', icon: FiAward, label: 'Exams' },
          { to: '/examination/results', icon: FiBarChart2, label: 'Results' },
          { to: '/examination/datesheets', icon: FiCalendar, label: 'Date Sheets' },
        ];
      default:
        return [];
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      <motion.aside
        initial={{ width: isOpen ? 280 : 80 }}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`bg-white dark:bg-gray-800 shadow-xl h-full flex flex-col border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 z-50 ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 px-4">
          <IoMdSchool className="text-3xl text-primary-600 dark:text-primary-400 flex-shrink-0" />
          {isOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="ml-2 text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap"
            >
              SchoolMS
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="text-xl flex-shrink-0" />
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="ml-3 text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
          <button
            onClick={() => {
              if (user?.role === 'superadmin') {
                navigate('/superadmin/settings');
              } else if (user?.role === 'admin') {
                navigate('/admin/settings');
              } else {
                navigate('/profile');
              }
            }}
            className="w-full flex items-center px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiSettings className="text-xl flex-shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 text-sm"
              >
                Settings
              </motion.span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiLogOut className="text-xl flex-shrink-0" />
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 text-sm"
              >
                Logout
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;