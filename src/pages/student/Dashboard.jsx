import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiAward,
  FiFileText,
  FiTrendingUp,
  FiBarChart2,
  FiBell,
  FiStar,
  FiBook,
} from 'react-icons/fi';
import { BiRupee } from 'react-icons/bi';
import { BsCurrencyRupee } from 'react-icons/bs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Loader from '../../components/common/Loader';

const attendanceData = [
  { month: 'Jan', present: 85, absent: 15 },
  { month: 'Feb', present: 88, absent: 12 },
  { month: 'Mar', present: 92, absent: 8 },
  { month: 'Apr', present: 78, absent: 22 },
  { month: 'May', present: 90, absent: 10 },
  { month: 'Jun', present: 95, absent: 5 },
];

const feeData = [
  { name: 'Paid', value: 70 },
  { name: 'Pending', value: 30 },
];

const COLORS = ['#22C55E', '#F59E0B'];

const upcomingExams = [
  {
    id: 1,
    name: 'Midterm Exam',
    subject: 'Mathematics',
    date: '2026-07-15',
    time: '09:00 AM',
  },
  {
    id: 2,
    name: 'Final Exam',
    subject: 'Physics',
    date: '2026-07-20',
    time: '10:00 AM',
  },
];

const latestNotices = [
  { id: 1, title: 'School Holiday on Monday', date: '2026-07-10', priority: 'high' },
  { id: 2, title: 'Parent-Teacher Meeting', date: '2026-07-12', priority: 'medium' },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendance: 92,
    gpa: 3.8,
    feeStatus: 'Paid',
    assignments: 3,
    subjects: 8,
  });

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/api/students/dashboard');
      setStats(response.data.dashboard?.stats || stats);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{dateStr}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <FiCalendar /> View Schedule
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <FiClock className="text-2xl opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              +5%
            </span>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.attendance}%</p>
          <p className="text-xs opacity-80">Attendance</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <FiAward className="text-2xl opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              +2%
            </span>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.gpa}</p>
          <p className="text-xs opacity-80">GPA</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <FiDollarSign className="text-2xl opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Paid
            </span>
          </div>
          <p className="text-3xl font-bold mt-2">✓</p>
          <p className="text-xs opacity-80">Fee Status</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <FiFileText className="text-2xl opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
              Pending
            </span>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.assignments}</p>
          <p className="text-xs opacity-80">Assignments</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Attendance Trend
              </h3>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Monthly
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
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
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <p className="text-green-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Fee Status
              </h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={feeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {feeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiAward className="text-purple-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Upcoming Exams
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {upcomingExams.map((exam) => (
              <div
                key={exam.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <p className="font-medium text-gray-800 dark:text-white text-sm">
                  {exam.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {exam.subject}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <FiCalendar className="text-xs" />
                  {formatDate(exam.date)} at {exam.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiBell className="text-yellow-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Latest Notices
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {latestNotices.map((notice) => (
              <div
                key={notice.id}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 ${
                    notice.priority === 'high'
                      ? 'bg-red-500'
                      : notice.priority === 'medium'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {notice.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(notice.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiStar className="text-yellow-600" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 transition-colors text-center">
              <FiBook className="text-2xl text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                View Results
              </span>
            </button>
            <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 transition-colors text-center">
              <FiClock className="text-2xl text-green-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Attendance
              </span>
            </button>
            <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 transition-colors text-center">
             <p className="text-2xl text-purple-600 mx-auto mb-1" >Rs</p>
<span className="text-xs text-gray-700 dark:text-gray-300">
  Pay Fee
</span>
            </button>
            <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 transition-colors text-center">
              <FiFileText className="text-2xl text-yellow-600 mx-auto mb-1" />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                Assignments
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;