import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiAward,
  FiFileText,
  FiBook,
  FiCheckCircle,
  FiArrowRight,
  FiAlertCircle,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [studentData, setStudentData] = useState(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashRes, profileRes] = await Promise.allSettled([
        api.get('/api/students/dashboard'),
        api.get('/api/students/profile'),
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.data?.dashboard) {
        setStats(dashRes.value.data.dashboard.stats || null);
      }
      if (profileRes.status === 'fulfilled' && profileRes.value.data?.student) {
        setStudentData(profileRes.value.data.student);
      }
    } catch (err) {
      console.error('Error fetching student dashboard:', err);
      setError('Unable to load student metrics at this time.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}`}
        subtitle={`Academic Session 2026-2027 • Today is ${dateStr}`}
        actions={
          <button
            onClick={() => navigate('/student/timetable')}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <FiCalendar className="text-lg" />
            <span>View Schedule</span>
          </button>
        }
      />

      {error && (
        <ErrorState
          title="Dashboard Notice"
          message={error}
          onRetry={fetchDashboard}
        />
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Attendance"
          value={stats?.attendance != null ? `${stats.attendance}%` : '—'}
          icon={FiClock}
          color="primary"
          subtitle="Overall present rate"
        />

        <StatsCard
          title="Current GPA"
          value={stats?.gpa != null ? Number(stats.gpa).toFixed(2) : '—'}
          icon={FiAward}
          color="success"
          subtitle="Cumulative performance"
        />

        <StatsCard
          title="Fee Status"
          value={stats?.feeStatus || 'Up to Date'}
          icon={FiDollarSign}
          color={stats?.feeStatus === 'Pending' ? 'danger' : 'success'}
          subtitle="Current semester billing"
        />

        <StatsCard
          title="Pending Tasks"
          value={stats?.assignments != null ? stats.assignments : '—'}
          icon={FiFileText}
          color="warning"
          subtitle="Active assignments"
        />
      </div>

      {/* Student Academic Identity Card */}
      {(studentData || user) && (
        <section className="card p-5 sm:p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                {(studentData?.user?.name || user?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                    {studentData?.user?.name || user?.name || 'Student'}
                  </h3>
                  <StatusBadge
                    status={studentData?.status || user?.status || 'active'}
                    label="Student"
                  />
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  <span>
                    Class: <strong className="font-semibold text-slate-800 dark:text-slate-200">{studentData?.class?.name || (typeof studentData?.class === 'string' ? studentData.class : null) || 'Assigned'}</strong>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                  <span>
                    Section: <strong className="font-semibold text-slate-800 dark:text-slate-200">{studentData?.section || 'A'}</strong>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
                  <span>
                    Roll No: <strong className="font-semibold text-slate-800 dark:text-slate-200">{studentData?.rollNumber || studentData?.rollNo || '—'}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                to="/student/profile"
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
              >
                <FiUser className="text-sm text-slate-500 dark:text-slate-400" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/student/results"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Report Card</span>
                <FiArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Quick Navigation Modules */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Quick Academic Portals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/student/results"
            className="card p-5 hover:border-primary-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              <FiAward />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Exam Results
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Check marks, grades, and cumulative transcripts
            </p>
          </Link>

          <Link
            to="/student/attendance"
            className="card p-5 hover:border-primary-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              <FiClock />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Attendance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              View daily roll call records and monthly percentages
            </p>
          </Link>

          <Link
            to="/student/fees"
            className="card p-5 hover:border-primary-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              <FiDollarSign />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Fee Invoices
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Download payment vouchers and inspect dues
            </p>
          </Link>

          <Link
            to="/student/assignments"
            className="card p-5 hover:border-primary-500/50 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
              <FiFileText />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Assignments
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              View assigned homework, deadlines, and teacher feedback
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
