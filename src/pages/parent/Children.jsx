import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiUser,
  FiBook,
  FiClock,
  FiAward,
  FiDollarSign,
  FiUsers,
  FiHash,
  FiCalendar,
  FiEye,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/modals/Modal';
import Button from '../../components/forms/Button';
import api from '../../utils/api';
import { formatDate, formatAddress } from '../../utils/helpers';

const ParentChildren = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingChild, setViewingChild] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/parents/dashboard');
      setChildren(response.data?.dashboard?.parent?.children || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Children"
        subtitle="Manage academic profiles and enrollment records for your family"
        breadcrumbs={[
          { label: 'Parent', href: '/parent/dashboard' },
          { label: 'Children' },
        ]}
      />

      {children.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No Students Associated"
          description="There are currently no student accounts linked to your guardian profile."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div
              key={child._id}
              className="card p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between bg-white dark:bg-[#162033]"
            >
              <div>
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {child.user?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {child.user?.name}
                      </h3>
                      <StatusBadge status={child.status || 'active'} />
                    </div>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-0.5">
                      {child.class?.name || 'Class Assigned'} • Section {child.section || 'A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 font-semibold uppercase">Student ID</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {child.studentId || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase">Roll Number</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {child.rollNumber || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase">Gender</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                      {child.gender || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold uppercase">Enrolled</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {child.enrollmentDate ? formatDate(child.enrollmentDate) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-5 mt-5 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setViewingChild(child)}
                  className="inline-flex items-center justify-center gap-1.5 flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 transition-colors"
                >
                  <FiEye className="text-sm" />
                  View
                </button>
                <Link
                  to="/parent/attendance"
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Attendance
                </Link>
                <Link
                  to="/parent/results"
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Results
                </Link>
                <Link
                  to="/parent/fees"
                  className="flex-1 py-2 text-center text-xs font-semibold rounded-lg bg-primary-50 dark:bg-primary-950/40 hover:bg-primary-100 text-primary-700 dark:text-primary-300 transition-colors"
                >
                  Fees
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={Boolean(viewingChild)}
        onClose={() => setViewingChild(null)}
        title="Student Profile Details"
        size="lg"
      >
        {viewingChild && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {viewingChild.user?.name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingChild.user?.name || '—'}
                  </h3>
                  <p className="text-slate-500">{viewingChild.user?.email || '—'}</p>
                </div>
              </div>
              <StatusBadge status={viewingChild.status || 'active'} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between"><span className="text-slate-500">Class</span><span className="font-semibold text-slate-900 dark:text-white">{viewingChild.class?.name || '—'} {viewingChild.section ? `(${viewingChild.section})` : ''}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Student ID</span><span className="font-mono font-semibold text-slate-900 dark:text-white">{viewingChild.studentId || '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Roll Number</span><span className="font-semibold text-slate-900 dark:text-white">{viewingChild.rollNumber || '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Gender</span><span className="font-semibold capitalize text-slate-900 dark:text-white">{viewingChild.gender || '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-semibold text-slate-900 dark:text-white">{viewingChild.phone || 'Not Configured'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-semibold text-slate-900 dark:text-white">{formatAddress(viewingChild.address || viewingChild.user?.address) || 'Not Configured'}</span></div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setViewingChild(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ParentChildren;
