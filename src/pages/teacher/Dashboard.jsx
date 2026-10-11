import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiBook,
  FiClock,
  FiFileText,
  FiTrendingUp,
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
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    assignments: 0,
    attendance: 0,
  });
  const [loading, setLoading] = useState(true);

  const attendanceData = [
    { month: 'Jan', present: 85, absent: 15 },
    { month: 'Feb', present: 88, absent: 12 },
    { month: 'Mar', present: 92, absent: 8 },
    { month: 'Apr', present: 78, absent: 22 },
    { month: 'May', present: 90, absent: 10 },
    { month: 'Jun', present: 95, absent: 5 },
  ];

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/api/teachers/dashboard');
      const data = response.data.dashboard?.stats || {};
      setStats({
        classes: data.classes || 0,
        students: data.students || 0,
        assignments: data.pendingAssignments || 0,
        attendance: data.todayAttendance || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Teacher Dashboard"
        subtitle="Welcome back! Here's your overview"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="My Classes"
          value={stats.classes}
          icon={FiBook}
          color="primary"
        />
        <StatsCard
          title="My Students"
          value={stats.students}
          icon={FiUsers}
          color="secondary"
        />
        <StatsCard
          title="Pending Assignments"
          value={stats.assignments}
          icon={FiFileText}
          color="warning"
        />
        <StatsCard
          title="Today Attendance"
          value={stats.attendance}
          icon={FiClock}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Attendance Overview" icon={FiTrendingUp}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#2563EB"
                fillOpacity={1}
                fill="url(#colorPresent)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Recent Activities" icon={FiClock}>
          <RecentActivity />
        </ChartCard>
      </div>
    </div>
  );
};

export default TeacherDashboard;