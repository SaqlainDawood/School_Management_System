import React from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

const Schools = () => {
  return (
    <div>
      <DashboardHeader
        title="Schools Management"
        subtitle="Manage all schools in the system"
      />
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Schools management coming soon...
        </p>
      </div>
    </div>
  );
};

export default Schools;