import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Select from '../../components/forms/Select';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';

const TeacherAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
      fetchAttendance();
    }
  }, [selectedClass, date]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/teachers/classes');
      setClasses(response.data?.classes || []);
    } catch (err) {
      console.error('Error fetching teacher classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get(`/api/classes/${selectedClass}/students`);
      setStudents(response.data?.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get(`/api/attendance/class/${selectedClass}`, {
        params: { date },
      });
      const attendanceData = {};
      response.data?.attendance?.forEach((item) => {
        if (item.records?.length > 0) {
          const latest = item.records[item.records.length - 1];
          attendanceData[item.student._id] = latest.status;
        }
      });
      setAttendance(attendanceData);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await api.post('/api/attendance', {
        studentId,
        classId: selectedClass,
        status,
        date,
        semester: '2026-2027',
      });
      setAttendance((prev) => ({ ...prev, [studentId]: status }));
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  const markAll = async (status) => {
    const unmarked = students.filter((s) => !attendance[s._id]);
    for (const student of unmarked) {
      await markAttendance(student._id, status);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'danger';
      case 'late': return 'warning';
      default: return 'neutral';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Roll Call & Attendance"
        subtitle="Record daily classroom participation and presence for your assigned cohorts"
        breadcrumbs={[
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Attendance' },
        ]}
      />

      <div className="card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-full sm:w-64">
            <label className="label">Class Cohort</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">Select a class...</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-52">
            <label className="label">Roll Call Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field text-xs pl-9 py-2 w-full"
              />
            </div>
          </div>

          {selectedClass && (
            <div className="sm:ml-auto flex items-center gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => markAll('present')}
              >
                Mark All Present
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => markAll('absent')}
              >
                Mark All Absent
              </Button>
            </div>
          )}
        </div>

        {selectedClass && students.length > 0 ? (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-4 py-3">Roll No.</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Quick Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {students.map((student) => {
                  const currentStatus = attendance[student._id];
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
                            <p className="font-bold text-slate-900 dark:text-white">
                              {student.user?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300">
                        {student.rollNumber || '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <StatusBadge variant={getStatusVariant(currentStatus)} dot>
                          {currentStatus ? currentStatus.toUpperCase() : 'PENDING'}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
                          <button
                            onClick={() => markAttendance(student._id, 'present')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'absent')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'late')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                              currentStatus === 'late'
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
            title="No students enrolled"
            description="No student records found in this selected class cohort."
          />
        ) : (
          <EmptyState
            icon={FiCalendar}
            title="Select Cohort"
            description="Choose a teaching class from the selector above to populate the roll call."
          />
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;
