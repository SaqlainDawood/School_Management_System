import React, { useState, useEffect } from 'react';
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiBarChart2,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const CURRENT_DATE = new Date();
const INITIAL_MONTH = CURRENT_DATE.getMonth() + 1;
const INITIAL_YEAR = CURRENT_DATE.getFullYear();

const ParentAttendance = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchingRecords, setFetchingRecords] = useState(false);
  const [month, setMonth] = useState(INITIAL_MONTH);
  const [year, setYear] = useState(INITIAL_YEAR);

  useEffect(() => {
    let ignore = false;
    const fetchChildren = async () => {
      try {
        const response = await api.get('/api/parents/dashboard');
        if (ignore) return;
        const kids = response.data?.dashboard?.parent?.children || [];
        setChildren(kids);
        if (kids.length > 0) setSelectedChild(kids[0]._id);
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching children:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchChildren();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedChild) return;
    let ignore = false;

    const fetchAttendance = async () => {
      try {
        setFetchingRecords(true);
        const response = await api.get(
          `/api/parents/child/${selectedChild}/attendance`,
          { params: { month, year } }
        );
        if (ignore) return;
        setAttendance(response.data?.attendance || []);
        setStatistics(response.data?.statistics || {});
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching attendance:', error);
          setAttendance([]);
          setStatistics({});
        }
      } finally {
        if (!ignore) {
          setFetchingRecords(false);
        }
      }
    };

    fetchAttendance();

    return () => {
      ignore = true;
    };
  }, [selectedChild, month, year]);

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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Children Attendance"
        subtitle="Track classroom presence and monthly roll call records"
        breadcrumbs={[
          { label: 'Parent', href: '/parent/dashboard' },
          { label: 'Attendance' },
        ]}
      />

      {children.length === 0 ? (
        <EmptyState
          icon={FiUser}
          title="No Students Linked"
          description="No students are associated with this guardian profile."
        />
      ) : (
        <>
          {/* Filters Bar */}
          <div className="card p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-wrap items-center gap-4">
            <Select
              label="Select Student"
              name="child"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              options={children.map((c) => ({
                value: c._id,
                label: `${c.user?.name || 'Student'} (${c.class?.name || 'Class'})`,
              }))}
              className="w-64"
              icon={FiUser}
            />
            <Select
              label="Month"
              name="month"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              options={monthOptions}
              className="w-40"
            />
            <Select
              label="Year"
              name="year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              options={yearOptions}
              className="w-32"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Days"
              value={statistics.totalDays || 0}
              icon={FiClock}
              color="primary"
            />
            <StatsCard
              title="Present Days"
              value={statistics.presentDays || 0}
              icon={FiCheckCircle}
              color="success"
            />
            <StatsCard
              title="Absences"
              value={statistics.absentDays || 0}
              icon={FiXCircle}
              color="danger"
            />
            <StatsCard
              title="Attendance Rate"
              value={`${statistics.attendancePercentage || 0}%`}
              icon={FiBarChart2}
              color={statistics.attendancePercentage >= 75 ? 'success' : 'warning'}
            />
          </div>

          {/* Attendance Table */}
          <SectionCard
            title="Attendance Log"
            subtitle={`Monthly register for ${children.find((c) => c._id === selectedChild)?.user?.name || 'Selected Student'}`}
          >
            {fetchingRecords ? (
              <Loader />
            ) : attendance.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No attendance entries"
                description="No roll-call sessions recorded for this student in the chosen month."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Session / Subject</th>
                      <th className="py-3 px-4">Roll Call Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {attendance.map((record, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {formatDate(record.date)}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {record.subject?.name || 'Daily Roll Call'}
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
        </>
      )}
    </div>
  );
};

export default ParentAttendance;
