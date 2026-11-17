// pages/Attendance.jsx
import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCheck,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Select from '../../components/forms/Select';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes');
      setClasses(response.data.classes || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!selectedClass) return;
    try {
      const response = await api.get(`/api/classes/${selectedClass}/students`);
      setStudents(response.data.students || []);
      setError('');
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students for selected class');
    }
  };

  const fetchAttendance = async () => {
    if (!selectedClass) return;
    try {
      const response = await api.get(
        `/api/attendance/class/${selectedClass}`,
        { params: { date: selectedDate } }
      );

      const attendanceData = {};
      if (response.data.attendance && Array.isArray(response.data.attendance)) {
        response.data.attendance.forEach((item) => {
          if (item.student && item.records && Array.isArray(item.records)) {
            if (item.records.length > 0) {
              const latestRecord = item.records[item.records.length - 1];
              attendanceData[item.student._id] = latestRecord.status;
            } else {
              attendanceData[item.student._id] = 'absent';
            }
          }
        });
      }
      setAttendance(attendanceData);
      setError('');
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.response?.data?.message || 'Failed to fetch attendance');
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await api.post('/api/attendance', {
        studentId,
        classId: selectedClass,
        status,
        date: selectedDate,
        semester: '2026-2027',
      });

      setAttendance((prev) => ({ ...prev, [studentId]: status }));
      const studentName = students.find((s) => s._id === studentId)?.user?.name || 'Student';
      setSuccess(`Marked ${status.toUpperCase()} for ${studentName}`);
      setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'danger';
      case 'late': return 'warning';
      case 'excused': return 'info';
      default: return 'neutral';
    }
  };

  const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendance).filter((s) => s === 'absent').length;
  const lateCount = Object.values(attendance).filter((s) => s === 'late').length;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Attendance"
        subtitle="Log and verify daily student presence, tardiness, and absences"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Attendance' },
        ]}
      />

      <div className="card p-5 sm:p-6 space-y-5">
        {success && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <FiCheck className="text-sm" />
            {success}
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-full sm:w-64">
            <label className="label">Class Cohort</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select-field text-xs py-2.5 w-full"
            >
              <option value="">Select a class cohort...</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-52">
            <label className="label">Attendance Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field text-xs pl-9 py-2.5 w-full"
              />
            </div>
          </div>

          <div className="sm:ml-auto">
            <Button
              variant="secondary"
              icon={FiRefreshCw}
              onClick={fetchAttendance}
              disabled={!selectedClass}
            >
              Reload Roster
            </Button>
          </div>
        </div>

        {/* Live Attendance Summary KPIs */}
        {selectedClass && students.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Enrolled</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{students.length}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Present</span>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{presentCount}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Absent</span>
              <p className="text-xl font-bold text-rose-700 dark:text-rose-300 mt-1">{absentCount}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Late</span>
              <p className="text-xl font-bold text-amber-700 dark:text-amber-300 mt-1">{lateCount}</p>
            </div>
          </div>
        )}

        {/* Student Roster Table */}
        {selectedClass && students.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-4 py-3">Roll No.</th>
                  <th className="px-4 py-3 text-center">Recorded State</th>
                  <th className="px-5 py-3 text-right">Log Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {students.map((student) => {
                  const status = attendance[student._id];
                  const initial = student.user?.name?.charAt(0) || 'S';
                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 flex items-center justify-center font-bold text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {student.user?.name || 'Unknown'}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {student.studentId || ''}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-mono">
                        {student.rollNumber || '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <StatusBadge
                          status={status || 'not logged'}
                          variant={getStatusVariant(status)}
                        >
                          {status ? status.toUpperCase() : 'NOT LOGGED'}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
                          <button
                            onClick={() => markAttendance(student._id, 'present')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'absent')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'late')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              status === 'late'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : selectedClass && students.length === 0 ? (
          <EmptyState
            icon={FiUser}
            title="Empty Class Roster"
            description="No active students are currently enrolled in this academic class."
          />
        ) : (
          <EmptyState
            icon={FiCalendar}
            title="Select Class Cohort"
            description="Choose a class and target date from the header controls above to load the student attendance roster."
          />
        )}
      </div>
    </div>
  );
};

export default Attendance;
