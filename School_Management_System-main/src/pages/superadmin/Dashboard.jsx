import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUser,
  FiBook,
  FiDollarSign,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  const growthData = [
    { month: 'Jan', schools: 5, students: 1000 },
    { month: 'Feb', schools: 6, students: 1200 },
    { month: 'Mar', schools: 8, students: 1500 },
    { month: 'Apr', schools: 9, students: 1800 },
    { month: 'May', schools: 10, students: 2100 },
    { month: 'Jun', schools: 12, students: 2500 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/superadmin/dashboard');
      setStats(response.data.stats);
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
        title="Super Admin Dashboard"
        subtitle="Overview of all schools and system statistics"
        actions={<Button variant="primary">Generate Report</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Schools"
          value={stats.totalSchools}
          icon={FiBook}
          trend={12}
          trendDirection="up"
          color="primary"
        />
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          icon={FiUsers}
          trend={15}
          trendDirection="up"
          color="secondary"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={FiUser}
          trend={8}
          trendDirection="up"
          color="success"
        />
        <StatsCard
          title="Total Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={FiDollarSign}
          trend={20}
          trendDirection="up"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Growth Overview" icon={FiTrendingUp}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="schools"
                  stroke="#2563EB"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  name="Schools"
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#0EA5E9"
                  fill="#0EA5E9"
                  fillOpacity={0.1}
                  name="Students"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Recent Activities" icon={FiBarChart2}>
            <RecentActivity />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;