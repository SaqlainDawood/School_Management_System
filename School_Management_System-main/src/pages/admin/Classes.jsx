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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    academicYear: '',
    capacity: '',
    roomNumber: '',
  });

  useEffect(() => {
    let ignore = false;
    const fetchClasses = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/api/classes');
        if (ignore) return;
        setClasses(response.data.classes || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching classes:', err);
          setError('Failed to fetch classes');
          toast.error('Failed to fetch classes');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchClasses();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  useEffect(() => {
    let ignore = false;
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/api/teachers', {
          params: { limit: 100 },
        });
        if (ignore) return;
        setTeachers(response.data.teachers || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching teachers:', err);
        }
      }
    };

    fetchTeachers();

    return () => {
      ignore = true;
    };
  }, []);

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
      setRefreshTrigger((prev) => prev + 1);
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
            setRefreshTrigger((prev) => prev + 1);
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
            setRefreshTrigger((prev) => prev + 1);
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
            setRefreshTrigger((prev) => prev + 1);
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
            setRefreshTrigger((prev) => prev + 1);
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
            setRefreshTrigger((prev) => prev + 1);
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
          setRefreshTrigger((prev) => prev + 1);
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
          setRefreshTrigger((prev) => prev + 1);
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
      setRefreshTrigger((prev) => prev + 1);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls) => {
            const isArchived = cls.status === 'archived';
            return (
              <div
                key={cls._id}
                className={`card p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md ${
                  isArchived ? 'opacity-70 bg-slate-50/50 dark:bg-slate-900/40 border-amber-300/40' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          {cls.name}
                        </h3>
                        <StatusBadge
                          variant={isArchived ? 'warning' : 'success'}
                          dot
                        >
                          {isArchived ? 'Archived' : 'Active'}
                        </StatusBadge>
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        Code: {cls.code || '—'}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-medium truncate">
                        Faculty Lead: {cls.classTeacher?.user?.name || cls.classTeacher?.name || 'Unassigned'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleViewClass(cls._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Class Details"
                      >
                        <FiEye className="text-sm" />
                      </button>
                      {!isArchived ? (
                        <>
                          <button
                            onClick={() => handleEditClass(cls)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Class"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          {getStudentCount(cls) === 0 && getSubjectCount(cls) === 0 ? (
                            <button
                              onClick={() => handleDelete(cls._id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Delete Empty Class"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(cls._id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Archive Class"
                            >
                              <FiArchive className="text-sm" />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleRestore(cls._id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                          title="Restore Class"
                        >
                          <FiRefreshCw className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiUsers className="text-indigo-500" />
                      {getStudentCount(cls)} Students
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <FiBookOpen className="text-emerald-500" />
                      {getSubjectCount(cls)} Subjects
                    </span>
                  </div>
                </div>

                {/* Operations Toolbar */}
                {!isArchived && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                    <button
                      onClick={() => openAssignTeacherModal(cls._id)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <FiUserCheck /> Assign Faculty
                    </button>

                    {getStudentCount(cls) > 0 && (
                      <button
                        onClick={() => handleRemoveAllStudents(cls._id)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <FiUserMinus /> Clear Students
                      </button>
                    )}

                    {getSubjectCount(cls) > 0 && (
                      <button
                        onClick={() => handleRemoveAllSubjects(cls._id)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <FiBookOpen /> Clear Subjects
                      </button>
                    )}

                    {(getStudentCount(cls) > 0 || getSubjectCount(cls) > 0) && (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => handleCleanDelete(cls._id)}
                          className="px-2 py-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                          title="Unlink all dependencies then safely delete"
                        >
                          Clean Del
                        </button>
                        <button
                          onClick={() => handleForceDelete(cls._id)}
                          className="px-2 py-1 text-[10px] font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded transition-colors"
                          title="Purge all class data permanently"
                        >
                          Force Del
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
