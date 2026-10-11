import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiUsers,
  FiBarChart2,
  FiClock,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Loader from '../../components/common/Loader';

const ExaminationDashboard = () => {
  const [loading, setLoading] = useState(true);

  const examStatusData = [
    { name: 'Completed', value: 45 },
    { name: 'Ongoing', value: 12 },
    { name: 'Upcoming', value: 18 },
    { name: 'Draft', value: 10 },
  ];

  const COLORS = ['#22C55E', '#F59E0B', '#60A5FA', '#9CA3AF'];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Examination Dashboard"
        subtitle="Manage exams and results"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard title="Total Exams" value={45} icon={FiAward} color="primary" />
        <StatsCard
          title="Ongoing Exams"
          value={12}
          icon={FiClock}
          color="warning"
        />
        <StatsCard
          title="Results Published"
          value={30}
          icon={FiBarChart2}
          color="success"
        />
        <StatsCard
          title="Total Students"
          value={850}
          icon={FiUsers}
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Exam Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={examStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {examStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default ExaminationDashboard;