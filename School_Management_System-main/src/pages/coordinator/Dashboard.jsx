import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiBook,
  FiClock,
  FiFileText,
  FiLayers,
  FiArrowRight,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const CoordinatorDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/coordinator/dashboard');
      setStats(response.data?.dashboard || {});
    } catch (error) {
      console.error('Error fetching coordinator stats:', error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Coordinator Portal"
        subtitle="Manage educational departments, cross-faculty allocations, and attendance trends"
        breadcrumbs={[{ label: 'Coordinator' }, { label: 'Dashboard' }]}
      />

      {/* Real KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Departments"
          value={stats.departments || 0}
          icon={FiLayers}
          color="primary"
          subtitle="Active academic divisions"
        />
        <StatsCard
          title="Faculty Members"
          value={stats.teachers || 0}
          icon={FiUsers}
          color="secondary"
          subtitle="Assigned teachers"
        />
        <StatsCard
          title="Enrolled Students"
          value={stats.students || 0}
          icon={FiBook}
          color="success"
          subtitle="Under coordination"
        />
        <StatsCard
          title="Attendance Rate"
          value={stats.attendance?.percentage != null ? `${stats.attendance.percentage}%` : '—'}
          icon={FiClock}
          color="warning"
          subtitle="Department wide rate"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Coordination Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Link
            to="/coordinator/departments"
            className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all group rounded-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
              <FiLayers />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Department Registry
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Inspect divisions, curriculum coordinators, and teacher subject distributions.
            </p>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1">
              <span>Manage Departments</span>
              <FiArrowRight />
            </span>
          </Link>

          <Link
            to="/coordinator/attendance"
            className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all group rounded-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
              <FiClock />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Department Attendance
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Monitor faculty and student presence across all academic departments.
            </p>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1">
              <span>View Attendance</span>
              <FiArrowRight />
            </span>
          </Link>

          <Link
            to="/coordinator/reports"
            className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all group rounded-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
              <FiFileText />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
              Academic Reports
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Generate department performance audits, faculty evaluations, and metrics.
            </p>
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1">
              <span>Access Reports</span>
              <FiArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
