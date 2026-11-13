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
import ErrorState from '../../components/common/ErrorState';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(false);
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
      setStats(null);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const teacherName = user?.name || 'Faculty Member';

  const quickActions = [
    { label: 'Mark Class Attendance', icon: FiCheckSquare, to: '/teacher/attendance' },
    { label: 'New Assignment', icon: FiFileText, to: '/teacher/assignments' },
    { label: 'Enter Exam Grades', icon: FiAward, to: '/teacher/results' },
    { label: 'My Enrolled Classes', icon: FiBook, to: '/teacher/classes' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${teacherName}`}
        subtitle="Overview of your active teaching classes, student attendance, and assignments"
        breadcrumbs={[{ label: 'Faculty Dashboard' }]}
      />

      {error ? (
        <ErrorState
          title="Failed to load faculty overview"
          message="Unable to retrieve real-time teacher statistics from the server."
          onRetry={fetchDashboard}
        />
      ) : (
        <>
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Quick Shortcuts */}
          <div className="card p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Faculty Workflows
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map(({ label, icon: Icon, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all text-center group"
                >
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="text-lg" />
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
