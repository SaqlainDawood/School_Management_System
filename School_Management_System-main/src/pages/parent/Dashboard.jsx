import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiClock,
  FiDollarSign,
  FiAward,
  FiBook,
  FiArrowRight,
  FiCheckCircle,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/parents/dashboard');
      setChildren(response.data?.dashboard?.parent?.children || []);
    } catch (error) {
      console.error('Error fetching parent dashboard:', error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Portal"
        subtitle="Monitor academic progress, classroom attendance, and tuition accounts"
        breadcrumbs={[{ label: 'Parent' }, { label: 'Dashboard' }]}
      />

      {children.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No Linked Students"
          description="There are currently no student accounts linked to your guardian profile. Please contact the school admissions office to associate your children."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {children.map((child) => (
              <div
                key={child._id}
                className="card p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary-600/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-bold">
                      {child.user?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                          {child.user?.name}
                        </h3>
                        <StatusBadge status={child.status || 'active'} />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Class: <strong className="text-slate-700 dark:text-slate-300">{child.class?.name || 'Assigned'}</strong> • Section: <strong className="text-slate-700 dark:text-slate-300">{child.section || 'A'}</strong> • Roll No: <strong className="text-slate-700 dark:text-slate-300">{child.rollNumber || '—'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/parent/children"
                      className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
                    >
                      <FiUsers />
                      <span>Full Profile</span>
                    </Link>
                  </div>
                </div>

                {/* Academic Quick Portals */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                  <Link
                    to="/parent/attendance"
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold uppercase">Attendance</span>
                      <FiClock className="group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">
                      View Attendance Records →
                    </p>
                  </Link>

                  <Link
                    to="/parent/results"
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold uppercase">Examinations</span>
                      <FiAward className="group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">
                      Review Grade Cards →
                    </p>
                  </Link>

                  <Link
                    to="/parent/fees"
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                      <span className="text-xs font-semibold uppercase">Tuition Dues</span>
                      <FiDollarSign className="group-hover:text-primary-600 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 transition-colors">
                      Check Fee Vouchers →
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
