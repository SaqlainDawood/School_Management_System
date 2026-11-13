import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const Analytics = () => {
  return (
    <div>
      <DashboardHeader
        title="System Analytics"
        subtitle="View system-wide analytics and reports"
      />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Analytics coming soon...
        </p>
      </div>
    </div>
  );
};

export default Analytics;