import React, { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
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
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const ParentAttendance = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) fetchAttendance();
  }, [selectedChild, month, year]);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/api/parents/dashboard');
      const kids = response.data.dashboard?.parent?.children || [];
      setChildren(kids);
      if (kids.length > 0) setSelectedChild(kids[0]._id);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get(
        `/api/parents/child/${selectedChild}/attendance`,
        { params: { month, year } }
      );
      setAttendance(response.data.attendance || []);
      setStatistics(response.data.statistics || {});
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const chartData = attendance.slice(0, 10).map((record) => ({
    date: formatDate(record.date),
    status: record.status === 'present' ? 1 : 0,
    label: record.status,
  }));

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Children Attendance"
        subtitle="View your children's attendance"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            label="Select Child"
            name="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            options={children.map((c) => ({
              value: c._id,
              label: c.user?.name || 'Child',
            }))}
            className="w-64"
            icon={FiUser}
          />
          <Select
            label="Month"
            name="month"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            options={[
              { value: 1, label: 'January' },
              { value: 2, label: 'February' },
              { value: 3, label: 'March' },
              { value: 4, label: 'April' },
              { value: 5, label: 'May' },
              { value: 6, label: 'June' },
              { value: 7, label: 'July' },
              { value: 8, label: 'August' },
              { value: 9, label: 'September' },
              { value: 10, label: 'October' },
              { value: 11, label: 'November' },
              { value: 12, label: 'December' },
            ]}
            className="w-40"
          />
          <Select
            label="Year"
            name="year"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            options={[
              { value: 2025, label: '2025' },
              { value: 2026, label: '2026' },
              { value: 2027, label: '2027' },
            ]}
            className="w-32"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Days
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {statistics.totalDays || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
            <p className="text-xl font-bold text-green-600">
              {statistics.presentDays || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Absent</p>
            <p className="text-xl font-bold text-red-600">
              {statistics.absentDays || 0}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Attendance %
            </p>
            <p className="text-xl font-bold text-primary-600">
              {statistics.attendancePercentage || 0}%
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 1]} />
              <Tooltip />
              <Bar dataKey="status" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ParentAttendance;