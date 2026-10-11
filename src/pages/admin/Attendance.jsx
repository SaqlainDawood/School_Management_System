// pages/Attendance.jsx
import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiUser,
  FiRefreshCw,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Select from '../../components/forms/Select';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
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
    } catch (error) {
      console.error('Error fetching classes:', error);
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
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students');
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
    } catch (error) {
      console.error('❌ Error fetching attendance:', error);
      setError(error.response?.data?.message || 'Failed to fetch attendance');
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

      setAttendance({ ...attendance, [studentId]: status });
      setSuccess(
        `Attendance marked as ${status} for ${
          students.find((s) => s._id === studentId)?.user?.name || 'student'
        }`
      );
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error marking attendance:', error);
      setError(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge-secondary';
    switch (status) {
      case 'present':
        return 'badge-success';
      case 'absent':
        return 'badge-danger';
      case 'late':
        return 'badge-warning';
      case 'excused':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Not Marked';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Attendance Management"
        subtitle="Mark and manage daily attendance"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <Select
            label="Select Class"
            name="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
              { value: '', label: 'Select Class' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
            className="w-64"
            icon={FiUser}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="self-end">
            <Button variant="secondary" icon={FiRefreshCw} onClick={fetchAttendance}>
              Refresh
            </Button>
          </div>
        </div>

        {selectedClass && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Roll No
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => {
                  const status = attendance[student._id];
                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-medium text-sm">
                            {student.user?.name?.charAt(0) || 'S'}
                          </div>
                          <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                            {student.user?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        {student.rollNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`badge ${getStatusBadgeClass(status)}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <button
                            onClick={() => markAttendance(student._id, 'present')}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              status === 'present'
                                ? 'bg-green-600 text-white cursor-default'
                                : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200'
                            }`}
                            disabled={status === 'present'}
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'absent')}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              status === 'absent'
                                ? 'bg-red-600 text-white cursor-default'
                                : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 hover:bg-red-200'
                            }`}
                            disabled={status === 'absent'}
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => markAttendance(student._id, 'late')}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              status === 'late'
                                ? 'bg-yellow-600 text-white cursor-default'
                                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200'
                            }`}
                            disabled={status === 'late'}
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
        )}

        {selectedClass && students.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No students found in this class
            </p>
          </div>
        )}

        {!selectedClass && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Please select a class to mark attendance
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;