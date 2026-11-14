import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBell,
  FiClock,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const getPriorityVariant = (priority) => {
  switch (priority) {
    case 'urgent': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'info';
    default: return 'neutral';
  }
};

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    const fetchNotices = async () => {
      try {
        const response = await api.get('/api/notices');
        if (ignore) return;
        setNotices(response.data?.notices || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching notices:', err);
          setNotices([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchNotices();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Bulletin & Notices"
        subtitle="Broadcast administrative announcements, policy updates, and academic notices"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Notices' },
        ]}
        actions={
          <div title="Notice authoring endpoint pending backend route implementation">
            <Button variant="primary" icon={FiPlus} disabled>
              Draft Notice
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="card p-12">
            <EmptyState
              icon={FiBell}
              title="No active circulars"
              description="There are currently no administrative bulletins posted for this institution."
            />
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice._id}
              className="card p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <FiBell className="text-sm" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {notice.title}
                    </h3>
                    <StatusBadge variant={getPriorityVariant(notice.priority)} dot>
                      {notice.priority?.toUpperCase()} PRIORITY
                    </StatusBadge>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                    {notice.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <FiUser className="text-slate-400" /> By: {notice.createdBy?.name || 'Administration'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="text-slate-400" /> {formatDate(notice.createdAt)}
                    </span>
                    {Array.isArray(notice.audience) && notice.audience.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <FiUsers className="text-slate-400" /> Target: {notice.audience.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    disabled
                    className="p-1.5 rounded-lg text-slate-400 cursor-not-allowed opacity-50"
                    title="Notice editing requires backend update route"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    disabled
                    className="p-1.5 rounded-lg text-slate-400 cursor-not-allowed opacity-50"
                    title="Notice deletion requires backend delete route"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notices;
