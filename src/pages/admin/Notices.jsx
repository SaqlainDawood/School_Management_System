import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBell,
  FiClock,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await api.get('/api/notices');
      setNotices(response.data.notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'badge-info',
      medium: 'badge-warning',
      high: 'badge-danger',
      urgent: 'badge-danger',
    };
    return (
      <span className={`badge ${colors[priority] || 'badge-info'}`}>
        {priority}
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Notice Board"
        subtitle="Manage notices and announcements"
        actions={
          <Button variant="primary" icon={FiPlus}>
            Create Notice
          </Button>
        }
      />

      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <FiBell
                    className={`text-lg ${
                      notice.priority === 'urgent'
                        ? 'text-red-500'
                        : notice.priority === 'high'
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {notice.title}
                  </h3>
                  {getPriorityBadge(notice.priority)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {notice.content}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>By: {notice.createdBy?.name}</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="text-xs" />
                    {formatDate(notice.createdAt)}
                  </span>
                  <span className="badge badge-info">
                    {notice.audience.join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600">
                  <FiEdit2 className="text-sm" />
                </button>
                <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600">
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {notices.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
            <FiBell className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No notices found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;