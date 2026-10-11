import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiClock,
  FiCalendar,
  FiDownload,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
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
import api from '../../utils/api';
import Loader from '../../components/common/Loader';

const attendanceData = [
  { month: 'Jan', present: 85, absent: 15, late: 5 },
  { month: 'Feb', present: 88, absent: 12, late: 3 },
  { month: 'Mar', present: 92, absent: 8, late: 2 },
  { month: 'Apr', present: 78, absent: 22, late: 8 },
  { month: 'May', present: 90, absent: 10, late: 4 },
  { month: 'Jun', present: 95, absent: 5, late: 1 },
];

const COLORS = ['#22C55E', '#EF4444', '#F59E0B'];

const StudentAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    attendancePercentage: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/attendance/my-attendance', {
        params: { month, year },
      });
      setAttendance(response.data.attendance || []);
      setStatistics(response.data.statistics || statistics);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const attendanceSummary = [
    { name: 'Present', value: statistics.presentDays },
    { name: 'Absent', value: statistics.absentDays },
    { name: 'Late', value: statistics.lateDays },
  ];

  const getStatusBadge = (status) => {
    const configs = {
      present: {
        label: 'Present',
        color:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      },
      absent: {
        label: 'Absent',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      },
      late: {
        label: 'Late',
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      },
      excused: {
        label: 'Excused',
        color:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      },
    };
    return configs[status] || configs.present;
  };

  if (loading && attendance.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Attendance
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your attendance records
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
            <FiDownload /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiClock className="text-blue-500" /> Total Days
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
            {statistics.totalDays}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiCheckCircle className="text-green-500" /> Present
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            {statistics.presentDays}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiXCircle className="text-red-500" /> Absent
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            {statistics.absentDays}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <FiTrendingUp className="text-primary-500" /> Attendance %
          </div>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
            {statistics.attendancePercentage}%
          </p>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiBarChart2 className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Monthly Attendance
              </h3>
            </div>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {new Date(2000, m - 1).toLocaleString('default', {
                      month: 'long',
                    })}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
              >
                {[2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#22C55E" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              <Bar dataKey="late" fill="#F59E0B" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Attendance Distribution
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceSummary}
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
                {attendanceSummary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-gray-600 dark:text-gray-400" />
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Recent Attendance
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Subject
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {attendance.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.slice(0, 10).map((record, index) => {
                  const status = getStatusBadge(record.status);
                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {record.subject?.name || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;