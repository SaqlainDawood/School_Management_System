import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiUser,
  FiBook,
  FiDollarSign,
  FiTrendingUp,
  FiBarChart2,
  FiLayers,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import api from '../../utils/api';
import { formatCurrency } from '../../utils/helpers';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/superadmin/dashboard');
      if (response.data?.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching superadmin stats:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load platform dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error && !stats.totalSchools && !stats.totalStudents) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Super Admin Master Control"
          subtitle="Multi-tenant institutional infrastructure, platform scale, and revenue overview"
          breadcrumbs={[{ label: 'Super Admin' }, { label: 'Dashboard' }]}
        />
        <ErrorState
          title="Platform Dashboard Unavailable"
          message={error}
          onRetry={fetchStats}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Master Control"
        subtitle="Multi-tenant institutional infrastructure, platform scale, and revenue overview"
        breadcrumbs={[{ label: 'Super Admin' }, { label: 'Dashboard' }]}
      />

      {/* Genuine Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Schools"
          value={stats.totalSchools || 0}
          icon={FiBook}
          color="primary"
          subtitle="Registered institutions"
        />
        <StatsCard
          title="Total Students"
          value={(stats.totalStudents || 0).toLocaleString()}
          icon={FiUsers}
          color="secondary"
          subtitle="Across all tenants"
        />
        <StatsCard
          title="Total Faculty"
          value={(stats.totalTeachers || 0).toLocaleString()}
          icon={FiUser}
          color="success"
          subtitle="Active educators"
        />
        <StatsCard
          title="Platform Revenue"
          value={formatCurrency(stats.totalRevenue || 0)}
          icon={FiDollarSign}
          color="warning"
          subtitle="System gross billing"
        />
      </div>

      {/* Operations Directory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/superadmin/schools"
          className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all group rounded-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
            <FiLayers />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
            Schools Management
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Provision, configure, and inspect individual school branches and tenant accounts.
          </p>
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1">
            <span>Manage Tenants</span>
            <FiArrowRight />
          </span>
        </Link>

        <Link
          to="/superadmin/users"
          className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all group rounded-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
            <FiUsers />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
            Global User Directory
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Audit system accounts, school administrators, and global access permissions.
          </p>
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1">
            <span>Inspect Users</span>
            <FiArrowRight />
          </span>
        </Link>

        <Link
          to="/superadmin/analytics"
          className="card p-6 border border-slate-200 dark:border-slate-800 hover:border-primary-500/40 hover:shadow-md transition-all group rounded-2xl"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
            <FiTrendingUp />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
            Platform Analytics
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Monitor real-time server health, latency, uptime, and database storage utilization.
          </p>
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1">
            <span>View Telemetry</span>
            <FiArrowRight />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
