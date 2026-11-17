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
import StatusBadge from '../common/StatusBadge';
import Button from '../forms/Button';

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
    } catch (err) {
      console.error('Error fetching class details:', err);
      setError(
        err.response?.data?.message || 'Failed to fetch class details'
      );
      toast.error('Failed to fetch class details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = () => {
    onClose();
    navigate(`/admin/classes`);
    toast.info('Edit class from the Classes page');
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white dark:bg-[#162033] rounded-2xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center gap-4">
              <FiLoader className="text-4xl text-indigo-600 dark:text-indigo-400 animate-spin" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
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
      <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true">
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white dark:bg-[#162033] rounded-2xl p-8 shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <FiAlertCircle className="text-2xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Error Loading Class
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
              <Button onClick={onClose} variant="primary">
                Close
              </Button>
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
      <div className="fixed inset-0 z-[9999] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="class-detail-title">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-[#162033] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-[#162033] border-b border-slate-100 dark:border-slate-800 p-5 md:p-6 flex-shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 flex-shrink-0">
                      <FiBook className="text-xl" />
                    </div>
                    <div className="min-w-0">
                      <h2 id="class-detail-title" className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                        {name} — Class Details
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          Code: {code}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <StatusBadge status={status || 'active'} />
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {academicYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => setActiveTab('subjects')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'subjects'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <FiBookOpen className="text-sm" />
                  Subjects ({subjects?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'students'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <FiUsers className="text-sm" />
                  Students ({students?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'teachers'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <FiUserCheck className="text-sm" />
                  Teachers ({assignedTeachers.length})
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'info'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <FiHome className="text-sm" />
                  Information
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1">
              {/* SUBJECTS TAB */}
              {activeTab === 'subjects' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <FiBookOpen className="text-indigo-600 dark:text-indigo-400" />
                      Assigned Subjects
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Total: {subjects?.length || 0} subjects
                    </span>
                  </div>

                  {(!subjects || subjects.length === 0) ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-[#111827]/40 rounded-xl border border-slate-200 dark:border-slate-800">
                      <FiBook className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        No subjects assigned to this class
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Assign subjects from the Subjects management module
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {subjects.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                              <FiBook className="text-base" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {item.subject?.name || 'Unknown Subject'}
                              </p>
                              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <span className="font-mono">
                                  Code: {item.subject?.code || 'N/A'}
                                </span>
                                {item.teacher && (
                                  <>
                                    <span className="text-slate-300 dark:text-slate-700">|</span>
                                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                      <FiUser className="text-xs text-slate-400" />
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
                            <span className="badge badge-primary text-[11px]">
                              {item.period?.perWeek || 5} periods/wk
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === 'students' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <FiUsers className="text-indigo-600 dark:text-indigo-400" />
                      Enrolled Students
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Total: {students?.length || 0} students
                    </span>
                  </div>

                  {(!students || students.length === 0) ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-[#111827]/40 rounded-xl border border-slate-200 dark:border-slate-800">
                      <FiUsers className="text-4xl text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        No students enrolled in this class
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {students.map((student, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3.5 bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              {student.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {student.user?.name || 'Unknown Student'}
                              </p>
                              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                <span>Roll: {student.rollNumber || 'N/A'}</span>
                                <span className="text-slate-300 dark:text-slate-700">|</span>
                                <span className="font-mono">ID: {student.studentId || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          {student.user?.email && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                              <FiMail className="text-xs" />
                              {student.user.email}
                            </span>
                          )}
                        </div>
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
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                      <FiUserCheck className="text-indigo-600 dark:text-indigo-400" />
                      Class Teacher (Incharge)
                    </h3>
                    {classTeacher ? (
                      <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0 shadow-sm">
                            {classTeacher.user?.name?.charAt(0) ||
                              classTeacher.name?.charAt(0) ||
                              'C'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {classTeacher.user?.name ||
                                classTeacher.name ||
                                'Unknown'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {classTeacher.teacherId && (
                                <span className="font-mono">ID: {classTeacher.teacherId}</span>
                              )}
                              {classTeacher.user?.email && (
                                <span className="flex items-center gap-1 font-mono">
                                  <FiMail className="text-xs" />
                                  {classTeacher.user.email}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="badge badge-primary">
                            Incharge
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-slate-50 dark:bg-[#111827]/40 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          No class teacher assigned
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Subject Teachers */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FiBook className="text-indigo-600 dark:text-indigo-400" />
                        Subject Teachers
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Total: {assignedTeachers.length}
                      </span>
                    </div>

                    {assignedTeachers.length === 0 ? (
                      <div className="text-center py-6 bg-slate-50 dark:bg-[#111827]/40 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          No subject teachers assigned
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Assign teachers from the Subjects management page
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
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
                            <div
                              key={index}
                              className="flex items-center justify-between p-3.5 bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {teacherName?.charAt(0) || 'T'}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {teacherName}
                                  </p>
                                  <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                                      <FiBook className="text-xs text-slate-400" />
                                      {subjectName}
                                    </span>
                                    {teacherId !== 'N/A' && (
                                      <>
                                        <span className="text-slate-300 dark:text-slate-700">|</span>
                                        <span className="font-mono">ID: {teacherId}</span>
                                      </>
                                    )}
                                  </div>
                                  {teacherEmail && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                                      <FiMail className="text-xs" />
                                      {teacherEmail}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className="badge badge-secondary text-[11px]">
                                {item.period?.perWeek || 5} periods/wk
                              </span>
                            </div>
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <FiHome className="text-indigo-600 dark:text-indigo-400" />
                    Class Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiHash className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Class Name
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {name || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiHash className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Class Code
                        </span>
                      </div>
                      <p className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">
                        {code || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiCalendar className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Academic Year
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {academicYear || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiUsers className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Capacity
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {capacity || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiHome className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Room Number
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {roomNumber || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiBook className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Building
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {building || 'N/A'}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiBookOpen className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Total Subjects
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {subjects?.length || 0}
                      </p>
                    </div>

                    <div className="bg-slate-50/75 dark:bg-[#111827]/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <FiUsers className="text-xs" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Total Students
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {students?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-50 dark:bg-[#111827]/80 border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3.5 flex items-center justify-end gap-2.5 flex-shrink-0">
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                variant="primary"
                icon={FiEdit2}
                onClick={handleEditClass}
              >
                Edit Class
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ClassDetailModal;
