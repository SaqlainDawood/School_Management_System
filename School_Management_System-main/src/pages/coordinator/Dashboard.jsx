import React, { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiClock } from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const CoordinatorDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const departmentData = [
    { name: 'Science', teachers: 12, students: 200 },
    { name: 'Math', teachers: 8, students: 150 },
    { name: 'English', teachers: 10, students: 180 },
    { name: 'Arts', teachers: 6, students: 120 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/coordinator/dashboard');
      setStats(response.data.dashboard);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Coordinator Dashboard"
        subtitle="Manage departments and activities"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Departments"
          value={stats.departments || 0}
          icon={FiBook}
          color="primary"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.teachers || 0}
          icon={FiUsers}
          color="secondary"
        />
        <StatsCard
          title="Total Students"
          value={stats.students || 0}
          icon={FiUsers}
          color="success"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendance?.percentage || 0}%`}
          icon={FiClock}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Department Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="teachers" fill="#2563EB" name="Teachers" />
              <Bar dataKey="students" fill="#0EA5E9" name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;