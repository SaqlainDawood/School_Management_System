import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUser,
  FiBook,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiBarChart2,
  FiClock,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import StatsCard from '../../components/dashboard/StatsCard';
import ChartCard from '../../components/dashboard/ChartCard';
import RecentActivity from '../../components/dashboard/RecentActivity';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRevenue: 0,
    attendancePercentage: 0,
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

  const feeData = [
    { month: 'Jan', paid: 40000, pending: 10000 },
    { month: 'Feb', paid: 45000, pending: 8000 },
    { month: 'Mar', paid: 38000, pending: 12000 },
    { month: 'Apr', paid: 50000, pending: 5000 },
    { month: 'May', paid: 42000, pending: 9000 },
    { month: 'Jun', paid: 48000, pending: 7000 },
  ];

  const performanceData = [
    { name: 'A Grade', value: 30 },
    { name: 'B Grade', value: 45 },
    { name: 'C Grade', value: 15 },
    { name: 'D Grade', value: 10 },
  ];

  const COLORS = ['#22C55E', '#60A5FA', '#F59E0B', '#EF4444'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/admin/stats');
      const data = response.data;
      const statsData = data.stats || data;

      setStats({
        totalStudents: statsData.students || statsData.totalStudents || 0,
        totalTeachers: statsData.teachers || statsData.totalTeachers || 0,
        totalClasses: statsData.classes || statsData.totalClasses || 0,
        totalRevenue: statsData.totalRevenue || statsData.revenue || 0,
        attendancePercentage:
          statsData.attendance?.percentage || statsData.attendancePercentage || 0,
      });
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      setStats({
        totalStudents: 1234,
        totalTeachers: 56,
        totalClasses: 32,
        totalRevenue: 245000,
        attendancePercentage: 92,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="School Dashboard"
        subtitle="Overview of your school's performance"
        actions={
          <>
            <Button variant="primary">Generate Report</Button>
            <Button variant="secondary">Export Data</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={FiUsers}
          trend={12}
          trendDirection="up"
          color="primary"
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers.toLocaleString()}
          icon={FiUser}
          trend={5}
          trendDirection="up"
          color="secondary"
        />
        <StatsCard
          title="Total Classes"
          value={stats.totalClasses.toLocaleString()}
          icon={FiBook}
          trend={2}
          trendDirection="down"
          color="success"
        />
        <StatsCard
          title="Revenue"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          icon={FiDollarSign}
          trend={18}
          trendDirection="up"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Attendance Overview" icon={FiCalendar}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="present"
                stroke="#2563EB"
                fillOpacity={1}
                fill="url(#colorPresent)"
                name="Present"
              />
              <Area
                type="monotone"
                dataKey="absent"
                stroke="#EF4444"
                fillOpacity={1}
                fill="url(#colorAbsent)"
                name="Absent"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fee Collection" icon={FiDollarSign}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="paid" fill="#22C55E" name="Paid" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Performance Distribution" icon={FiBarChart2}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
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
                  {performanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Recent Activities" icon={FiClock}>
            <RecentActivity />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;