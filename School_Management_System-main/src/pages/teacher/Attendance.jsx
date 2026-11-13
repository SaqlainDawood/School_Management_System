import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiCalendar,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Select from '../../components/forms/Select';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
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
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get(`/api/classes/${selectedClass}/students`);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get(`/api/attendance/class/${selectedClass}`, {
        params: { date },
      });
      const attendanceData = {};
      response.data.attendance?.forEach((item) => {
        if (item.records?.length > 0) {
          const latest = item.records[item.records.length - 1];
          attendanceData[item.student._id] = latest.status;
        }
      });
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error fetching attendance:', error);
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
      setAttendance({ ...attendance, [studentId]: status });
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const markAll = async (status) => {
    const unmarked = students.filter((s) => !attendance[s._id]);
    for (const student of unmarked) {
      await markAttendance(student._id, status);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Mark Attendance"
        subtitle="Mark daily attendance for your classes"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          {selectedClass && (
            <div className="self-end flex gap-2">
              <Button
                variant="success"
                size="sm"
                onClick={() => markAll('present')}
              >
                All Present
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => markAll('absent')}
              >
                All Absent
              </Button>
            </div>
          )}
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
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
                          {student.user?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {student.rollNumber}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`badge ${
                          attendance[student._id] === 'present'
                            ? 'badge-success'
                            : attendance[student._id] === 'absent'
                            ? 'badge-danger'
                            : attendance[student._id] === 'late'
                            ? 'badge-warning'
                            : 'badge-info'
                        }`}
                      >
                        {attendance[student._id] || 'Not Marked'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => markAttendance(student._id, 'present')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            attendance[student._id] === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => markAttendance(student._id, 'absent')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            attendance[student._id] === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => markAttendance(student._id, 'late')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            attendance[student._id] === 'late'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          L
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
      </div>
    </div>
  );
};

export default TeacherAttendance;