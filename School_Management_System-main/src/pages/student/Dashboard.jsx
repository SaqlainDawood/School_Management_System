import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiAward,
  FiFileText,
  FiArrowRight,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';

const getFormattedDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const dateStr = getFormattedDate();

  useEffect(() => {
    let ignore = false;
    const fetchDashboard = async () => {
      try {
        const [dashRes, profileRes] = await Promise.allSettled([
          api.get('/api/students/dashboard'),
          api.get('/api/students/profile'),
        ]);

        if (ignore) return;

        if (dashRes.status === 'fulfilled' && dashRes.value.data?.dashboard) {
          setStats(dashRes.value.data.dashboard.stats || null);
        }
        if (profileRes.status === 'fulfilled' && profileRes.value.data?.student) {
          setStudentData(profileRes.value.data.student);
        }
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching student dashboard:', err);
          setError('Unable to load student metrics at this time.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

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
          onRetry={() => {
            setLoading(true);
            setError(null);
            setRefreshTrigger((t) => t + 1);
          }}
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
      {studentData && (
        <div className="card p-6 bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-2xl border border-navy-700/60 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/30 border border-primary-500/40 flex items-center justify-center text-2xl font-bold text-primary-300">
                {studentData.user?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{studentData.user?.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Student
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-1">
                  Class: <span className="font-semibold text-white">{studentData.class?.name || 'Assigned'}</span> • Section: <span className="font-semibold text-white">{studentData.section || 'A'}</span> • Roll No: <span className="font-semibold text-white">{studentData.rollNumber || '—'}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/student/profile"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors border border-white/10 flex items-center gap-1.5"
              >
                <FiUser className="text-base" />
                <span>My Profile</span>
              </Link>
              <Link
                to="/student/results"
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Report Card</span>
                <FiArrowRight className="text-base" />
              </Link>
            </div>
          </div>
        </div>
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
