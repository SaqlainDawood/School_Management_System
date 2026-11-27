// frontend/src/pages/admin/Classes.jsx
import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiBookOpen,
  FiUserCheck,
  FiArchive,
  FiRefreshCw,
  FiUserMinus,
  FiTrash,
  FiEye,
  FiLayers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Modal from '../../components/modals/Modal';
import ClassForm from '../../components/forms/ClassForm';
import ClassDetailModal from '../../components/modals/ClassDetailModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../utils/api';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [error, setError] = useState('');
  
  // Structured confirm dialog state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    variant: 'danger',
    action: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    academicYear: '',
    capacity: '',
    roomNumber: '',
  });

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/classes');
      setClasses(response.data.classes || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to fetch classes');
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/api/teachers', {
        params: { limit: 100 },
      });
      setTeachers(response.data.teachers || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const handleViewClass = (classId) => {
    setSelectedClassId(classId);
    setShowDetailModal(true);
  };

  const handleAddClass = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      academicYear: '',
      capacity: '',
      roomNumber: '',
    });
    setShowModal(true);
  };

  const handleEditClass = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name || '',
      code: cls.code || '',
      description: cls.description || '',
      academicYear: cls.academicYear || '',
      capacity: cls.capacity || '',
      roomNumber: cls.roomNumber || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingClass) {
        await api.put(`/api/classes/${editingClass._id}`, data);
        toast.success('Class updated successfully');
      } else {
        await api.post('/api/classes', data);
        toast.success('Class added successfully');
      }
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      console.error('Error saving class:', err);
      toast.error(err.response?.data?.message || 'Failed to save class');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id) => {
    const classData = classes.find((c) => c._id === id);
    const studentCount = classData?.students?.length || 0;
    const subjectCount = classData?.subjects?.length || 0;

    const message = studentCount > 0 || subjectCount > 0
      ? `This class currently has ${studentCount} student(s) and ${subjectCount} subject(s) enrolled. You should remove dependencies first, or use Clean Delete / Force Delete.`
      : `Are you sure you want to delete class "${classData?.name}"? This action cannot be undone.`;

    setConfirmConfig({
      isOpen: true,
      title: 'Delete Class',
      message,
      confirmText: 'Delete Class',
      variant: 'danger',
      action: async () => {
        try {
          const response = await api.delete(`/api/classes/${id}`);
          if (response.data.success) {
            toast.success('Class deleted successfully');
            fetchClasses();
          }
        } catch (err) {
          console.error('Error deleting class:', err);
          if (err.response?.status === 400 && err.response?.data?.dependencies) {
            const messages = err.response.data.dependencies.map((d) => `• ${d.message}`).join('\n');
            toast.error(`Cannot delete class:\n${messages}\nUse "Clean Delete" or "Force Delete".`);
          } else {
            toast.error(err.response?.data?.message || 'Failed to delete class');
          }
        }
      },
    });
  };

  const handleCleanDelete = (id) => {
    const classData = classes.find((c) => c._id === id);
    setConfirmConfig({
      isOpen: true,
      title: `Clean Delete: ${classData?.name}`,
      message: 'This will unassign all students and remove subject mappings, then safely delete this class. Academic history records will be preserved.',
      confirmText: 'Execute Clean Delete',
      variant: 'warning',
      action: async () => {
        try {
          const response = await api.delete(`/api/classes/${id}/clean-delete`);
          if (response.data.success) {
            toast.success(response.data.message || 'Clean delete completed');
            fetchClasses();
          }
        } catch (err) {
          console.error('Error in clean delete:', err);
          toast.error(err.response?.data?.message || 'Failed to clean delete class');
        }
      },
    });
  };

  const handleForceDelete = (id) => {
    const classData = classes.find((c) => c._id === id);
    setConfirmConfig({
      isOpen: true,
      title: `FORCE DELETE: ${classData?.name}`,
      message: 'CRITICAL: This permanently removes this class, enrolled students, attendance logs, exam schedules, and fee invoices linked to this class. This is non-reversible.',
      confirmText: 'Permanently Erase Everything',
      variant: 'danger',
      action: async () => {
        try {
          const response = await api.delete(`/api/classes/${id}/force-delete`);
          if (response.data.success) {
            toast.success(response.data.message || 'Force delete completed');
            fetchClasses();
          }
        } catch (err) {
          console.error('Error in force delete:', err);
          toast.error(err.response?.data?.message || 'Failed to force delete class');
        }
      },
    });
  };

  const handleArchive = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Archive Academic Class',
      message: 'Archiving marks this class and its roster as inactive. You can restore this class at any time without data loss.',
      confirmText: 'Archive Class',
      variant: 'warning',
      action: async () => {
        try {
          const response = await api.put(`/api/classes/${id}/archive`);
          if (response.data.success) {
            toast.success('Class archived successfully');
            fetchClasses();
          }
        } catch (err) {
          console.error('Error archiving class:', err);
          toast.error(err.response?.data?.message || 'Failed to archive class');
        }
      },
    });
  };

  const handleRestore = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Restore Class',
      message: 'Restoring will reactivate this class and reinstate student cohort status.',
      confirmText: 'Restore Class',
      variant: 'primary',
      action: async () => {
        try {
          const response = await api.put(`/api/classes/${id}/restore`);
          if (response.data.success) {
            toast.success('Class restored successfully');
            fetchClasses();
          }
        } catch (err) {
          console.error('Error restoring class:', err);
          toast.error(err.response?.data?.message || 'Failed to restore class');
        }
      },
    });
  };

  const handleRemoveAllStudents = (classId) => {
    const classData = classes.find((c) => c._id === classId);
    const studentCount = classData?.students?.length || 0;
    if (studentCount === 0) {
      toast.info('No students in this class to remove');
      return;
    }
    setConfirmConfig({
      isOpen: true,
      title: 'Unassign All Students',
      message: `Unassign all ${studentCount} students from "${classData?.name}"? Students will remain registered in the system but unlinked from this class.`,
      confirmText: 'Unassign Students',
      variant: 'warning',
      action: async () => {
        try {
          await api.delete(`/api/classes/${classId}/students`);
          toast.success(`Removed ${studentCount} students from class`);
          fetchClasses();
        } catch (err) {
          console.error('Error removing students:', err);
          toast.error(err.response?.data?.message || 'Failed to remove students');
        }
      },
    });
  };

  const handleRemoveAllSubjects = (classId) => {
    const classData = classes.find((c) => c._id === classId);
    const subjectCount = classData?.subjects?.length || 0;
    if (subjectCount === 0) {
      toast.info('No subjects assigned to this class');
      return;
    }
    setConfirmConfig({
      isOpen: true,
      title: 'Remove All Subjects',
      message: `Remove all ${subjectCount} subjects from "${classData?.name}"? Teaching assignments for this class will also be cleared.`,
      confirmText: 'Remove Subjects',
      variant: 'warning',
      action: async () => {
        try {
          await api.delete(`/api/classes/${classId}/subjects`);
          toast.success(`Removed ${subjectCount} subjects from class`);
          fetchClasses();
        } catch (err) {
          console.error('Error removing subjects:', err);
          toast.error(err.response?.data?.message || 'Failed to remove subjects');
        }
      },
    });
  };

  const handleAssignTeacher = async () => {
    if (!selectedClass || !selectedTeacher) {
      toast.error('Please select a class and teacher');
      return;
    }

    setFormLoading(true);
    try {
      await api.put(`/api/classes/${selectedClass}/assign-teacher`, {
        teacherId: selectedTeacher,
      });
      toast.success('Class teacher assigned successfully');
      setShowAssignTeacherModal(false);
      setSelectedClass(null);
      setSelectedTeacher('');
      fetchClasses();
    } catch (err) {
      console.error('Error assigning teacher:', err);
      toast.error(err.response?.data?.message || 'Failed to assign teacher');
    } finally {
      setFormLoading(false);
    }
  };

  const openAssignTeacherModal = (classId) => {
    setSelectedClass(classId);
    setSelectedTeacher('');
    setShowAssignTeacherModal(true);
  };

  const getStudentCount = (cls) => cls.students?.length || 0;
  const getSubjectCount = (cls) => cls.subjects?.length || 0;

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Classes & Cohorts"
        subtitle="Manage student sections, curriculum mappings, and class faculty leads"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Classes' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddClass}>
            Create Class
          </Button>
        }
      />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {classes.length === 0 ? (
        <div className="card p-12">
          <EmptyState
            icon={FiLayers}
            title="No classes established"
            description="Create your first academic class cohort to organize students and faculty."
            actionLabel="Create Class"
            onAction={handleAddClass}
          />
        </div>
      ) : (
        <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Class & Code</th>
                  <th className="px-6 py-3.5">Assigned Teacher</th>
                  <th className="px-6 py-3.5 text-center">Students</th>
                  <th className="px-6 py-3.5 text-center">Subjects</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {classes.map((cls) => {
                  const isArchived = cls.status === 'archived';
                  const studentCount = getStudentCount(cls);
                  const subjectCount = getSubjectCount(cls);
                  const teacherName = cls.classTeacher?.user?.name || cls.classTeacher?.name;

                  return (
                    <tr
                      key={cls._id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors ${
                        isArchived ? 'opacity-70 bg-slate-50/30 dark:bg-slate-900/30' : ''
                      }`}
                    >
                      {/* Class & Code */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-100 dark:border-indigo-900/50 flex-shrink-0">
                            <FiLayers />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {cls.name}
                            </div>
                            <div className="text-xs font-mono text-slate-400">
                              Code: {cls.code || '—'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Assigned Teacher */}
                      <td className="px-6 py-4">
                        {teacherName ? (
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {teacherName}
                          </span>
                        ) : (
                          <button
                            onClick={() => openAssignTeacherModal(cls._id)}
                            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <FiUserCheck className="text-xs" /> Assign Faculty
                          </button>
                        )}
                      </td>

                      {/* Students */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                          <FiUsers className="text-indigo-500 text-xs" />
                          {studentCount}
                        </span>
                      </td>

                      {/* Subjects */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50">
                          <FiBookOpen className="text-emerald-500 text-xs" />
                          {subjectCount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={isArchived ? 'archived' : 'active'} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleViewClass(cls._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="View Class Details"
                          >
                            <FiEye className="text-base" />
                          </button>

                          {!isArchived ? (
                            <>
                              <button
                                onClick={() => openAssignTeacherModal(cls._id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title={teacherName ? 'Change Assigned Teacher' : 'Assign Faculty'}
                              >
                                <FiUserCheck className="text-base" />
                              </button>
                              <button
                                onClick={() => handleEditClass(cls)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Edit Class"
                              >
                                <FiEdit2 className="text-base" />
                              </button>

                              {studentCount === 0 && subjectCount === 0 ? (
                                <button
                                  onClick={() => handleDelete(cls._id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Delete Empty Class"
                                >
                                  <FiTrash2 className="text-base" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleArchive(cls._id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                  title="Archive Class"
                                >
                                  <FiArchive className="text-base" />
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleRestore(cls._id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                              title="Restore Class"
                            >
                              <FiRefreshCw className="text-base" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClass ? 'Edit Academic Class' : 'Create New Academic Class'}
        size="lg"
      >
        <ClassForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Assign Teacher Modal */}
      <Modal
        isOpen={showAssignTeacherModal}
        onClose={() => setShowAssignTeacherModal(false)}
        title="Assign Faculty Lead"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="label">
              Select Class Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">Select a faculty member...</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user?.name} ({t.teacherId || 'No ID'}) — {t.department || 'Faculty'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAssignTeacherModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={formLoading}
              onClick={handleAssignTeacher}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Class Detail Modal */}
      <ClassDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedClassId(null);
        }}
        classId={selectedClassId}
      />

      {/* Master Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={async () => {
          if (confirmConfig.action) {
            await confirmConfig.action();
          }
          setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        confirmVariant={confirmConfig.variant}
      />
    </div>
  );
};

export default Classes;
