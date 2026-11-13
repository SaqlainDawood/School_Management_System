import React, { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiDollarSign, FiAward } from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/api/parents/dashboard');
      setChildren(response.data.dashboard?.parent?.children || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Parent Dashboard"
        subtitle="Monitor your children's progress"
      />

      <div className="space-y-6">
        {children.map((child) => (
          <div
            key={child._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold text-lg">
                  {child.user?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {child.user?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Class: {child.class?.name} • Roll: {child.rollNumber}
                  </p>
                </div>
              </div>
              <span
                className={`badge ${
                  child.status === 'active' ? 'badge-success' : 'badge-danger'
                }`}
              >
                {child.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FiClock className="text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Attendance
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    92%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiAward className="text-green-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    GPA
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    3.8
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-yellow-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Fee Status
                  </p>
                  <p className="font-semibold text-green-600">Paid</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiUsers className="text-purple-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Class Rank
                  </p>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    #12
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {children.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No children linked to your account
            </p>
          </div>
        )}

        <RecentActivity />
      </div>
    </div>
  );
};

export default ParentDashboard;