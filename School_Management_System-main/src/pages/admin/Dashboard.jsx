import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUser,
  FiBook,
  FiDollarSign,
  FiCalendar,
  FiBarChart2,
  FiClock,
  FiUserPlus,
  FiBookOpen,
  FiCheckSquare,
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
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import PageHeader from '../../components/common/PageHeader';
import ErrorState from '../../components/common/ErrorState';
import Loader from '../../components/common/Loader';
import Button from '../../components/forms/Button';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await api.get('/api/admin/stats');
      const data = response.data;
      const statsData = data.stats || data;

      setStats({
        totalStudents: statsData.students ?? statsData.totalStudents ?? null,
        totalTeachers: statsData.teachers ?? statsData.totalTeachers ?? null,
        totalClasses: statsData.classes ?? statsData.totalClasses ?? null,
        totalRevenue: statsData.totalRevenue ?? statsData.revenue ?? null,
        attendancePercentage:
          statsData.attendance?.percentage ?? statsData.attendancePercentage ?? null,
        attendanceHistory: statsData.attendanceHistory || [],
      });

      // Build attendance chart data only from real API data
      if (statsData.attendanceHistory && statsData.attendanceHistory.length > 0) {
        setAttendanceData(statsData.attendanceHistory);
      } else {
        setAttendanceData([]);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(true);
      setStats(null);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const schoolName = user?.schoolName || user?.school?.name || 'Your School';
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    { label: 'Add Student', icon: FiUserPlus, to: '/admin/students' },
    { label: 'Add Teacher', icon: FiUser, to: '/admin/teachers' },
    { label: 'Manage Classes', icon: FiBook, to: '/admin/classes' },
    { label: 'Attendance', icon: FiCheckSquare, to: '/admin/attendance' },
    { label: 'Subjects', icon: FiBookOpen, to: '/admin/subjects' },
    { label: 'Fees', icon: FiDollarSign, to: '/admin/fees' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting()}, Admin`}
        subtitle={`Welcome back to ${schoolName} dashboard`}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {error ? (
        <ErrorState
          title="Failed to load dashboard statistics"
          message="Unable to reach the server. Check your connection and try again."
          onRetry={fetchStats}
        />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard
              title="Total Students"
              value={stats?.totalStudents != null ? stats.totalStudents.toLocaleString() : null}
              icon={FiUsers}
              color="primary"
            />
            <StatsCard
              title="Total Teachers"
              value={stats?.totalTeachers != null ? stats.totalTeachers.toLocaleString() : null}
              icon={FiUser}
              color="info"
            />
            <StatsCard
              title="Total Classes"
              value={stats?.totalClasses != null ? stats.totalClasses.toLocaleString() : null}
              icon={FiBook}
              color="success"
            />
            <StatsCard
              title="Total Revenue"
              value={
                stats?.totalRevenue != null
                  ? `Rs. ${Number(stats.totalRevenue).toLocaleString()}`
                  : null
              }
              icon={FiDollarSign}
              color="warning"
            />
          </div>

          {/* Attendance % card */}
          {stats?.attendancePercentage != null && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatsCard
                title="Attendance Rate"
                value={`${stats.attendancePercentage}%`}
                icon={FiCalendar}
                color="success"
                subtitle="School-wide average"
              />
            </div>
          )}

          {/* Attendance Chart — only when real data exists */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartCard title="Attendance Overview" icon={FiBarChart2}>
                {attendanceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={attendanceData}>
                      <defs>
                        <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="present"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPresent)"
                        name="Present %"
                      />
                      <Area
                        type="monotone"
                        dataKey="absent"
                        stroke="#EF4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAbsent)"
                        name="Absent %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[280px] text-slate-400 dark:text-slate-600 space-y-2">
                    <FiCalendar className="text-4xl" />
                    <p className="text-sm font-medium">Attendance chart unavailable</p>
                    <p className="text-xs">No historical data returned by the server</p>
                  </div>
                )}
              </ChartCard>
            </div>

            {/* Recent Activity */}
            <div>
              <ChartCard title="Recent Activity" icon={FiClock}>
                <RecentActivity />
              </ChartCard>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map(({ label, icon: Icon, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all group"
                >
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="text-lg" />
                  </span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-center leading-tight">
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

export default AdminDashboard;
