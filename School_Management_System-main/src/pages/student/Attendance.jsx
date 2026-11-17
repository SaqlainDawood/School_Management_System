import React, { useState, useEffect } from 'react';
import {
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiBarChart2,
  FiRefreshCw,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { formatDate } from '../../utils/helpers';
import api from '../../utils/api';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Select from '../../components/forms/Select';

const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#3B82F6'];

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
      setAttendance(response.data?.attendance || []);
      setStatistics(response.data?.statistics || {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        attendancePercentage: 0,
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Present', value: statistics.presentDays || 0 },
    { name: 'Absent', value: statistics.absentDays || 0 },
    { name: 'Late', value: statistics.lateDays || 0 },
  ].filter((item) => item.value > 0);

  const monthOptions = [
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
  ];

  const yearOptions = [
    { value: 2025, label: '2025' },
    { value: 2026, label: '2026' },
    { value: 2027, label: '2027' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Attendance"
        subtitle="Track your monthly classroom attendance record"
        breadcrumbs={[
          { label: 'Student', href: '/student/dashboard' },
          { label: 'Attendance' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Select
              name="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              options={monthOptions}
              className="w-36"
            />
            <Select
              name="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              options={yearOptions}
              className="w-28"
            />
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Days"
          value={statistics.totalDays || 0}
          icon={FiClock}
          color="primary"
        />
        <StatsCard
          title="Present"
          value={statistics.presentDays || 0}
          icon={FiCheckCircle}
          color="success"
        />
        <StatsCard
          title="Absent"
          value={statistics.absentDays || 0}
          icon={FiXCircle}
          color="danger"
        />
        <StatsCard
          title="Rate"
          value={`${statistics.attendancePercentage || 0}%`}
          icon={FiBarChart2}
          color={statistics.attendancePercentage >= 75 ? 'success' : 'warning'}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Table */}
          <div className="lg:col-span-2">
            <SectionCard
              title="Daily Attendance Ledger"
              subtitle={`Recorded sessions for ${monthOptions.find((m) => m.value === month)?.label} ${year}`}
            >
              {attendance.length === 0 ? (
                <EmptyState
                  icon={FiCalendar}
                  title="No attendance entries"
                  description="No attendance records have been registered for this selected month."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Subject</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {attendance.map((record, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(record.date)}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                            {record.subject?.name || 'General Session'}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={record.status || 'present'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </div>

          {/* Attendance Distribution Chart */}
          <div>
            <SectionCard title="Attendance Distribution" subtitle="Monthly presence ratio">
              {pieData.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No attendance records logged for distribution calculation
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAttendance;
