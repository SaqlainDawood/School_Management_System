import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

// ─── Nav configuration per role ─────────────────────────────────────────────

const NAV_CONFIG = {
  [ROLES.ADMIN]: [
    {
      group: 'Overview',
      items: [{ to: '/admin/dashboard', icon: FiHome, label: 'Dashboard' }],
    },
    {
      group: 'People',
      items: [
        { to: '/admin/students', icon: FiUsers, label: 'Students' },
        { to: '/admin/teachers', icon: FiUser, label: 'Teachers' },
      ],
    },
    {
      group: 'Academics',
      items: [
        { to: '/admin/classes', icon: FiLayers, label: 'Classes' },
        { to: '/admin/subjects', icon: FiBook, label: 'Subjects' },
        { to: '/admin/exams', icon: FiAward, label: 'Exams' },
        { to: '/admin/results', icon: FiBarChart2, label: 'Results' },
        { to: '/admin/attendance', icon: FiClock, label: 'Attendance' },
      ],
    },
    {
      group: 'Finance',
      items: [{ to: '/admin/fees', icon: FiDollarSign, label: 'Fees' }],
    },
    {
      group: 'Operations',
      items: [
        { to: '/admin/timetable', icon: FiCalendar, label: 'Timetable' },
        { to: '/admin/transport', icon: FiMapPin, label: 'Transport' },
        { to: '/admin/library', icon: FiBookOpen, label: 'Library' },
        { to: '/admin/notices', icon: FiBell, label: 'Notices' },
      ],
    },
    {
      group: 'Administration',
      items: [
        { to: '/admin/reports', icon: FiClipboard, label: 'Reports' },
        { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
      ],
    },
  ],

  [ROLES.TEACHER]: [
    {
      group: null,
      items: [
        { to: '/teacher/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/teacher/classes', icon: FiLayers, label: 'My Classes' },
        { to: '/teacher/attendance', icon: FiClock, label: 'Attendance' },
        { to: '/teacher/assignments', icon: FiFileText, label: 'Assignments' },
        { to: '/teacher/results', icon: FiBarChart2, label: 'Results' },
        { to: '/teacher/profile', icon: FiUser, label: 'Profile' },
      ],
    },
  ],

  [ROLES.STUDENT]: [
    {
      group: null,
      items: [
        { to: '/student/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/student/profile', icon: FiUser, label: 'Profile' },
        { to: '/student/attendance', icon: FiClock, label: 'Attendance' },
        { to: '/student/results', icon: FiBarChart2, label: 'Results' },
        { to: '/student/fees', icon: FiDollarSign, label: 'Fees' },
        { to: '/student/assignments', icon: FiFileText, label: 'Assignments' },
        { to: '/student/timetable', icon: FiCalendar, label: 'Timetable' },
      ],
    },
  ],

  [ROLES.PARENT]: [
    {
      group: null,
      items: [
        { to: '/parent/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/parent/children', icon: FiUsers, label: 'Children' },
        { to: '/parent/attendance', icon: FiClock, label: 'Attendance' },
        { to: '/parent/results', icon: FiBarChart2, label: 'Results' },
        { to: '/parent/fees', icon: FiDollarSign, label: 'Fees' },
      ],
    },
  ],

  [ROLES.COORDINATOR]: [
    {
      group: null,
      items: [
        { to: '/coordinator/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/coordinator/departments', icon: FiLayers, label: 'Departments' },
        { to: '/coordinator/attendance', icon: FiClock, label: 'Attendance' },
        { to: '/coordinator/reports', icon: FiClipboard, label: 'Reports' },
      ],
    },
  ],

  [ROLES.EXAMINATION]: [
    {
      group: null,
      items: [
        { to: '/examination/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/examination/exams', icon: FiAward, label: 'Exams' },
        { to: '/examination/results', icon: FiBarChart2, label: 'Results' },
        { to: '/examination/datesheets', icon: FiCalendar, label: 'Date Sheets' },
      ],
    },
  ],

  [ROLES.SUPER_ADMIN]: [
    {
      group: null,
      items: [
        { to: '/superadmin/dashboard', icon: FiHome, label: 'Dashboard' },
        { to: '/superadmin/schools', icon: FiMapPin, label: 'Schools' },
        { to: '/superadmin/users', icon: FiUsers, label: 'Users' },
        { to: '/superadmin/analytics', icon: FiBarChart2, label: 'Analytics' },
        { to: '/superadmin/settings', icon: FiSettings, label: 'Settings' },
      ],
    },
  ],
};

// ─── Role badge colors ───────────────────────────────────────────────────────

const ROLE_BADGE_COLOR = {
  [ROLES.SUPER_ADMIN]:  'bg-rose-500/20 text-rose-300',
  [ROLES.ADMIN]:        'bg-indigo-500/20 text-indigo-300',
  [ROLES.TEACHER]:      'bg-emerald-500/20 text-emerald-300',
  [ROLES.STUDENT]:      'bg-sky-500/20 text-sky-300',
  [ROLES.PARENT]:       'bg-orange-500/20 text-orange-300',
  [ROLES.COORDINATOR]:  'bg-purple-500/20 text-purple-300',
  [ROLES.EXAMINATION]:  'bg-yellow-500/20 text-yellow-300',
};

// ─── NavItem ─────────────────────────────────────────────────────────────────

const NavItem = ({ to, icon: Icon, label, collapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group
       ${isActive
         ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-400'
         : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border-l-2 border-transparent'
       }
       ${collapsed ? 'justify-center px-2' : ''}`
    }
    title={collapsed ? label : undefined}
  >
    <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
    {!collapsed && <span className="truncate">{label}</span>}
  </NavLink>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const Sidebar = ({ mobileOpen, onMobileClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem('sidebar-collapsed', String(next)); } catch {}
      return next;
    });
  }, []);

  // Expose collapse state via custom event so MainLayout can react
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebar-collapse-change', { detail: { collapsed } }));
  }, [collapsed]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const groups = NAV_CONFIG[user?.role] ?? [];
  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role ?? '';
  const badgeClass = ROLE_BADGE_COLOR[user?.role] ?? 'bg-slate-500/20 text-slate-300';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  // ── Shared sidebar content ──────────────────────────────────────────────

  const sidebarContent = (isDrawer = false) => (
    <aside
      className={`
        h-full flex flex-col bg-[#0F172A] border-r border-white/5
        ${isDrawer ? 'w-64' : collapsed ? 'w-[72px]' : 'w-60'}
        transition-[width] duration-300 ease-in-out
      `}
    >
      {/* ── Logo ── */}
      <div
        className={`flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0
          ${collapsed && !isDrawer ? 'justify-center' : 'gap-2.5'}`}
      >
        {/* School icon */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="w-5 h-5 text-white">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        {(!collapsed || isDrawer) && (
          <div className="min-w-0">
            <span className="block text-white font-semibold text-base leading-tight truncate">
              EduManage
            </span>
            <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeClass}`}>
              {roleLabel}
            </span>
          </div>
        )}
        {/* Mobile close */}
        {isDrawer && (
          <button
            onClick={onMobileClose}
            type="button"
            aria-label="Close mobile navigation drawer"
            className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        {/* Desktop collapse toggle */}
        {!isDrawer && (
          <button
            onClick={toggleCollapsed}
            type="button"
            aria-label={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
            className={`ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0
              ${collapsed ? 'mx-auto ml-auto' : ''}`}
          >
            {collapsed
              ? <FiChevronRight className="w-4 h-4" />
              : <FiChevronLeft className="w-4 h-4" />
            }
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav aria-label="Main navigation" className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {groups.map((group, gi) => (
          <div key={gi}>
            {group.group && !collapsed && (
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500 select-none">
                {group.group}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavItem
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    collapsed={collapsed && !isDrawer}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Profile + Logout ── */}
      <div className="border-t border-white/5 px-2 py-3 space-y-1 flex-shrink-0">
        {/* Profile row */}
        <div
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg
            ${collapsed && !isDrawer ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
          {(!collapsed || isDrawer) && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email ?? ''}</p>
            </div>
          )}
        </div>
        {/* Logout */}
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Logout"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors
            ${collapsed && !isDrawer ? 'justify-center' : ''}`}
          title={collapsed && !isDrawer ? 'Logout' : undefined}
        >
          <FiLogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {(!collapsed || isDrawer) && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop fixed sidebar ── */}
      <div className="hidden md:flex fixed left-0 top-0 bottom-0 z-40">
        {sidebarContent(false)}
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-50 md:hidden"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <div className="fixed left-0 top-0 bottom-0 z-50 md:hidden flex">
            {sidebarContent(true)}
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
