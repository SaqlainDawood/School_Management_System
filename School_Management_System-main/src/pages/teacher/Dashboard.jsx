import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiBook,
  FiClock,
  FiFileText,
  FiTrendingUp,
  FiCheckSquare,
  FiAward,
  FiCalendar,
  FiRefreshCw,
  FiAlertCircle,
  FiArrowRight,
  FiShield,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Loader from '../../components/common/Loader';
import Button from '../../components/forms/Button';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(false);
    setErrorMessage('');
    try {
      const response = await api.get('/api/teachers/dashboard');
      const data = response.data?.dashboard?.stats || response.data?.stats || {};
      setStats({
        classes: data.classes ?? null,
        students: data.students ?? null,
        assignments: data.pendingAssignments ?? data.assignments ?? null,
        attendance: data.todayAttendance ?? null,
      });

      if (Array.isArray(data.attendanceHistory) && data.attendanceHistory.length > 0) {
        setAttendanceData(data.attendanceHistory);
      } else {
        setAttendanceData([]);
      }
    } catch (err) {
      console.error('Error fetching teacher dashboard:', err);
      setError(true);
      setErrorMessage(
        err.response?.data?.message ||
        'Unable to retrieve real-time teacher statistics from the server.'
      );
      setStats(null);
      setAttendanceData([]);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchDashboard();
  };

  if (loading && !retrying) return <Loader />;

  const teacherName = user?.name || 'Faculty Member';
  const departmentName = user?.department || 'Academic Division';

  const quickActions = [
    {
      label: 'Mark Class Attendance',
      sublabel: 'Daily student roll call',
      icon: FiCheckSquare,
      to: '/teacher/attendance',
      color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40',
    },
    {
      label: 'New Coursework Assignment',
      sublabel: 'Create & publish tasks',
      icon: FiFileText,
      to: '/teacher/assignments',
      color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40',
    },
    {
      label: 'Enter Assessment Grades',
      sublabel: 'Input marks & exam results',
      icon: FiAward,
      to: '/teacher/results',
      color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/40',
    },
    {
      label: 'My Enrolled Classes',
      sublabel: 'Cohorts & student rosters',
      icon: FiBook,
      to: '/teacher/classes',
      color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Refined Dashboard Header ── */}
      <PageHeader
        title={`Welcome back, ${teacherName}`}
        subtitle={`Faculty Teaching Workspace • ${departmentName} • Real-time overview of active classes, students, and tasks`}
        breadcrumbs={[{ label: 'Teacher' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              <FiShield className="text-xs" /> Verified Educator
            </span>
          </div>
        }
      />

      {/* ── Faculty Workflows / Primary Actions (Always accessible) ── */}
      <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Faculty Teaching Workflows
          </h3>
          <span className="text-[11px] text-slate-400">Quick Navigation</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ label, sublabel, icon: Icon, to, color }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-slate-800/60 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 group-hover:scale-105 transition-transform ${color}`}>
                <Icon className="text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {sublabel}
                </p>
              </div>
              <FiArrowRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all text-sm shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Analytics & Live Statistics Section ── */}
      {error ? (
        /* Localized, proportional, and informative Error Panel */
        <div className="card p-6 sm:p-8 border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0 border border-amber-200 dark:border-amber-800">
                <FiAlertCircle />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Failed to load faculty overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                  {errorMessage}
                </p>
                <p className="text-[11px] text-slate-400">
                  Direct module links above remain operational while analytics are reconnected.
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={FiRefreshCw}
              loading={retrying}
              onClick={handleRetry}
              className="shrink-0 self-start sm:self-auto"
            >
              Retry Request
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <StatsCard
              title="Assigned Classes"
              value={stats?.classes != null ? stats.classes : '—'}
              icon={FiBook}
              color="primary"
            />
            <StatsCard
              title="Enrolled Students"
              value={stats?.students != null ? stats.students : '—'}
              icon={FiUsers}
              color="info"
            />
            <StatsCard
              title="Pending Coursework"
              value={stats?.assignments != null ? stats.assignments : '—'}
              icon={FiFileText}
              color="warning"
            />
            <StatsCard
              title="Today's Roll Logged"
              value={stats?.attendance != null ? `${stats.attendance}%` : '—'}
              icon={FiClock}
              color="success"
            />
          </div>

          {/* Charts and Recent Stream */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            <ChartCard title="Classroom Attendance History" icon={FiTrendingUp}>
              {attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="teacherPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="present"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#teacherPresent)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[260px] text-slate-400 space-y-2">
                  <FiCalendar className="text-4xl stroke-1 opacity-50" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No historical attendance analytics returned
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Daily class logs will aggregate here automatically
                  </p>
                </div>
              )}
            </ChartCard>

            <ChartCard title="Instructional Activity Stream" icon={FiClock}>
              <RecentActivity />
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
