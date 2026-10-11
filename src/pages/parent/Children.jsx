import React, { useState, useEffect } from 'react';
import { FiUser, FiBook, FiClock } from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const ParentChildren = () => {
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
        title="My Children"
        subtitle="View all your children's information"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div
            key={child._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                {child.user?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {child.user?.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {child.class?.name} • Roll: {child.rollNumber}
                </p>
                <span
                  className={`badge ${
                    child.status === 'active' ? 'badge-success' : 'badge-danger'
                  }`}
                >
                  {child.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiUser className="text-gray-400" />
                <span>Student ID: {child.studentId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiBook className="text-gray-400" />
                <span>Section: {child.section || 'A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiClock className="text-gray-400" />
                <span>Enrolled: {formatDate(child.enrollmentDate)}</span>
              </div>
            </div>
          </div>
        ))}

        {children.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No children linked to your account
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentChildren;