import React, { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
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
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const CoordinatorAttendance = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
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
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/coordinator/departments');
      setDepartments(response.data.departments);
      if (response.data.departments.length > 0) {
        setSelectedDept(response.data.departments[0]._id);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Attendance Overview"
        subtitle="Monitor department attendance"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <Select
            label="Select Department"
            name="department"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            options={departments.map((d) => ({ value: d._id, label: d.name }))}
            className="w-64"
            icon={FiUsers}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Average Attendance
            </p>
            <p className="text-2xl font-bold text-primary-600">88.5%</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Students
            </p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              250
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Today's Present
            </p>
            <p className="text-2xl font-bold text-green-600">220</p>
          </div>
        </div>

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
              name="Present"
            />
            <Area
              type="monotone"
              dataKey="absent"
              stroke="#EF4444"
              fillOpacity={0.2}
              fill="#EF4444"
              name="Absent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoordinatorAttendance;