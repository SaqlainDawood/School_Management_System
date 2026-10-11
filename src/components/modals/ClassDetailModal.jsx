// frontend/src/components/modals/ClassDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiBook,
  FiUsers,
  FiUserCheck,
  FiEdit2,
  FiBookOpen,
  FiMail,
  FiCalendar,
  FiHash,
  FiHome,
  FiUser,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ClassDetailModal = ({ isOpen, onClose, classId }) => {
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('subjects');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && classId) {
      fetchClassDetails();
    }
  }, [isOpen, classId]);

  const fetchClassDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/classes/${classId}`);
      setClassData(response.data.class);
    } catch (error) {
      console.error('Error fetching class details:', error);
      setError(
        error.response?.data?.message || 'Failed to fetch class details'
      );
      toast.error('Failed to fetch class details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      active: {
        label: 'Active',
        className:
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      },
      archived: {
        label: 'Archived',
        className:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      },
      inactive: {
        label: 'Inactive',
        className:
          'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400',
      },
    };
    const config = configs[status] || configs.active;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const handleEditClass = () => {
    onClose();
    navigate(`/admin/classes`);
    toast.info('Edit class from the Classes page');
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center gap-4">
              <FiLoader className="text-4xl text-blue-500 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading class details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
            <div className="flex flex-col items-center gap-4 text-center">
              <FiAlertCircle className="text-5xl text-red-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Error Loading Class
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    name,
    code,
    status,
    academicYear,
    capacity,
    roomNumber,
    building,
    students,
    subjects,
    classTeacher,
  } = classData || {};

  const assignedTeachers = (subjects || []).filter((s) => s.teacher);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                      <FiBook className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        {name} - Class Details
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Code: {code}
                        </span>
                        <span className="text-gray-300 dark:text-gray-600">
                          |
                        </span>
                        {getStatusBadge(status)}
                        <span className="text-gray-300 dark:text-gray-600">
                          |
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {academicYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                >
                  <FiX className="text-xl text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'subjects'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiBookOpen className="text-sm" />
                  Subjects ({subjects?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'students'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiUsers className="text-sm" />
                  Students ({students?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'teachers'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiUserCheck className="text-sm" />
                  Teachers ({assignedTeachers.length})
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === 'info'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FiHome className="text-sm" />
                  Information
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
              {/* SUBJECTS TAB */}
              {activeTab === 'subjects' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <FiBookOpen className="text-blue-600" />
                      Assigned Subjects
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Total: {subjects?.length || 0} subjects
                    </span>
                  </div>

                  {subjects?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <FiBook className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No subjects assigned to this class
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Assign subjects from the Subjects page
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {subjects.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <FiBook className="text-lg" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {item.subject?.name || 'Unknown Subject'}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span>
                                  Code: {item.subject?.code || 'N/A'}
                                </span>
                                {item.teacher && (
                                  <>
                                    <span className="text-gray-300 dark:text-gray-600">
                                      |
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <FiUser className="text-xs" />
                                      {item.teacher?.user?.name ||
                                        item.teacher?.name ||
                                        'Not Assigned'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                              {item.period?.perWeek || 5} periods/week
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === 'students' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <FiUsers className="text-blue-600" />
                      Enrolled Students
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Total: {students?.length || 0} students
                    </span>
                  </div>

                  {students?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <FiUsers className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">
                        No students enrolled in this class
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {students.map((student, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                              {student.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {student.user?.name || 'Unknown Student'}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                <span>
                                  Roll: {student.rollNumber || 'N/A'}
                                </span>
                                <span className="text-gray-300 dark:text-gray-600">
                                  |
                                </span>
                                <span>ID: {student.studentId || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          {student.user?.email && (
                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                              <FiMail className="text-xs" />
                              {student.user.email}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TEACHERS TAB */}
              {activeTab === 'teachers' && (
                <div className="space-y-6">
                  {/* Class Teacher */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-3">
                      <FiUserCheck className="text-blue-600" />
                      Class Teacher (Incharge)
                    </h3>
                    {classTeacher ? (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {classTeacher.user?.name?.charAt(0) ||
                              classTeacher.name?.charAt(0) ||
                              'C'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {classTeacher.user?.name ||
                                classTeacher.name ||
                                'Unknown'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                              {classTeacher.teacherId && (
                                <span>ID: {classTeacher.teacherId}</span>
                              )}
                              {classTeacher.user?.email && (
                                <span className="flex items-center gap-1">
                                  <FiMail className="text-xs" />
                                  {classTeacher.user.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-xs bg-blue-200 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
                            Incharge
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">
                          No class teacher assigned
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Subject Teachers */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <FiBook className="text-purple-600" />
                        Subject Teachers
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Total: {assignedTeachers.length}
                      </span>
                    </div>

                    {assignedTeachers.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400">
                          No subject teachers assigned
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Assign teachers from the Subjects page
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {assignedTeachers.map((item, index) => {
                          const teacherName =
                            item.teacher?.user?.name ||
                            item.teacher?.name ||
                            'Unknown Teacher';
                          const teacherEmail =
                            item.teacher?.user?.email ||
                            item.teacher?.email ||
                            '';
                          const teacherId = item.teacher?.teacherId || 'N/A';
                          const subjectName =
                            item.subject?.name || 'Unknown Subject';

                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                  {teacherName?.charAt(0) || 'T'}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    {teacherName}
                                  </p>
                                  <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <FiBook className="text-xs" />
                                      {subjectName}
                                    </span>
                                    {teacherId !== 'N/A' && (
                                      <>
                                        <span className="text-gray-300 dark:text-gray-600">
                                          |
                                        </span>
                                        <span>ID: {teacherId}</span>
                                      </>
                                    )}
                                  </div>
                                  {teacherEmail && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                                      <FiMail className="text-xs" />
                                      {teacherEmail}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                                {item.period?.perWeek || 5} periods/week
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* INFORMATION TAB */}
              {activeTab === 'info' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FiHome className="text-blue-600" />
                    Class Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiHash className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Class Name
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {name || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiHash className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Class Code
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {code || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiCalendar className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Academic Year
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {academicYear || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiUsers className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Capacity
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {capacity || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiHome className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Room Number
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {roomNumber || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiBook className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Building
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {building || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiBookOpen className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Total Subjects
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {subjects?.length || 0}
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                        <FiUsers className="text-sm" />
                        <span className="text-xs uppercase tracking-wider">
                          Total Students
                        </span>
                      </div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {students?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl p-4 md:p-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleEditClass}
                className="px-4 py-2 text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <FiEdit2 /> Edit Class
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ClassDetailModal;