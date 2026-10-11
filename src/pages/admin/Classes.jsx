// frontend/src/pages/admin/Classes.jsx
import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiBookOpen,
  FiUserCheck,
  FiBook,
  FiArchive,
  FiRefreshCw,
  FiUserMinus,
  FiTrash,
  FiEye,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Modal from '../../components/modals/Modal';
import ClassForm from '../../components/forms/ClassForm';
import ClassDetailModal from '../../components/modals/ClassDetailModal';
import Loader from '../../components/common/Loader';
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
    } catch (error) {
      console.error('Error fetching classes:', error);
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
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error(error.response?.data?.message || 'Failed to save class');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const classData = classes.find((c) => c._id === id);
    const studentCount = classData?.students?.length || 0;
    const subjectCount = classData?.subjects?.length || 0;

    let confirmMessage = 'Are you sure you want to delete this class?';

    if (studentCount > 0 || subjectCount > 0) {
      confirmMessage =
        `⚠️ WARNING: This class has:\n` +
        `• ${studentCount} student(s)\n` +
        `• ${subjectCount} subject(s)\n\n` +
        `You must remove all students and subjects first.\n` +
        `Or use "Clean Delete" or "Force Delete".\n\n` +
        `Do you want to proceed with normal delete?`;
    }

    if (!window.confirm(confirmMessage)) return;

    try {
      const response = await api.delete(`/api/classes/${id}`);
      if (response.data.success) {
        toast.success('Class deleted successfully');
        fetchClasses();
      }
    } catch (error) {
      console.error('❌ Error deleting class:', error);

      if (
        error.response?.status === 400 &&
        error.response?.data?.dependencies
      ) {
        const dependencies = error.response.data.dependencies;
        const dependencyMessages = dependencies
          .map((d) => `• ${d.message}`)
          .join('\n');

        toast.error(
          `❌ Cannot delete class!\n\n${dependencyMessages}\n\n` +
            `💡 Use "Clean Delete" or "Force Delete" from the admin panel.`,
          { autoClose: false }
        );
        setError(error.response.data.message);
      } else {
        const errorMsg =
          error.response?.data?.message || 'Failed to delete class';
        toast.error(errorMsg);
        setError(errorMsg);
      }
    }
  };

  const handleCleanDelete = async (id) => {
    const classData = classes.find((c) => c._id === id);

    if (
      !window.confirm(
        `🧹 Clean Delete "${classData?.name}"?\n\n` +
          `This will:\n` +
          `✅ Remove all students (unassign them)\n` +
          `✅ Remove all subjects and teacher assignments\n` +
          `✅ Then delete the class\n\n` +
          `All other data (attendance, fees, results) will remain.`
      )
    )
      return;

    try {
      const response = await api.delete(`/api/classes/${id}/clean-delete`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchClasses();
      }
    } catch (error) {
      console.error('Error in clean delete:', error);
      toast.error(
        error.response?.data?.message || 'Failed to clean delete class'
      );
    }
  };

  const handleForceDelete = async (id) => {
    const classData = classes.find((c) => c._id === id);

    if (
      !window.confirm(
        `🗑️ FORCE DELETE "${classData?.name}"?\n\n` +
          `⚠️ THIS WILL DELETE:\n` +
          `• ALL students in this class\n` +
          `• ALL attendance records\n` +
          `• ALL fee records\n` +
          `• ALL results\n` +
          `• ALL exams\n` +
          `• ALL timetables\n\n` +
          `This action CANNOT be undone!\n\n` +
          `Are you absolutely sure?`
      )
    )
      return;

    try {
      const response = await api.delete(`/api/classes/${id}/force-delete`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchClasses();
      }
    } catch (error) {
      console.error('Error in force delete:', error);
      toast.error(
        error.response?.data?.message || 'Failed to force delete class'
      );
    }
  };

  const handleArchive = async (id) => {
    const confirm = window.confirm(
      '📦 Archive this class?\n\n' +
        'Archiving will:\n' +
        '✅ Mark the class as inactive\n' +
        '✅ Archive all students in this class\n' +
        '✅ You can restore it later\n\n' +
        'Continue?'
    );

    if (!confirm) return;

    try {
      const response = await api.put(`/api/classes/${id}/archive`);
      if (response.data.success) {
        toast.success('Class archived successfully');
        fetchClasses();
      }
    } catch (error) {
      console.error('Error archiving class:', error);
      toast.error(error.response?.data?.message || 'Failed to archive class');
    }
  };

  const handleRestore = async (id) => {
    const confirm = window.confirm(
      '🔄 Restore this class?\n\n' +
        'Restoring will:\n' +
        '✅ Mark the class as active\n' +
        '✅ Restore all students in this class\n\n' +
        'Continue?'
    );

    if (!confirm) return;

    try {
      const response = await api.put(`/api/classes/${id}/restore`);
      if (response.data.success) {
        toast.success('Class restored successfully');
        fetchClasses();
      }
    } catch (error) {
      console.error('Error restoring class:', error);
      toast.error(error.response?.data?.message || 'Failed to restore class');
    }
  };

  const handleRemoveAllStudents = async (classId) => {
    const classData = classes.find((c) => c._id === classId);
    const studentCount = classData?.students?.length || 0;

    if (studentCount === 0) {
      toast.info('No students in this class to remove');
      return;
    }

    if (
      !window.confirm(
        `⚠️ Remove ALL ${studentCount} students from "${classData?.name}"?\n\n` +
          `Students will be unassigned from this class but will remain in the system.`
      )
    )
      return;

    try {
      await api.delete(`/api/classes/${classId}/students`);
      toast.success(
        `All ${studentCount} students removed from class successfully`
      );
      fetchClasses();
    } catch (error) {
      console.error('Error removing all students:', error);
      toast.error(error.response?.data?.message || 'Failed to remove students');
    }
  };

  const handleRemoveAllSubjects = async (classId) => {
    const classData = classes.find((c) => c._id === classId);
    const subjectCount = classData?.subjects?.length || 0;

    if (subjectCount === 0) {
      toast.info('No subjects assigned to this class');
      return;
    }

    if (
      !window.confirm(
        `⚠️ Remove ALL ${subjectCount} subjects from "${classData?.name}"?\n\n` +
          `All subject assignments and teacher associations will be removed.`
      )
    )
      return;

    try {
      await api.delete(`/api/classes/${classId}/subjects`);
      toast.success(
        `All ${subjectCount} subjects removed from class successfully`
      );
      fetchClasses();
    } catch (error) {
      console.error('Error removing all subjects:', error);
      toast.error(error.response?.data?.message || 'Failed to remove subjects');
    }
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
      toast.success('Teacher assigned successfully');
      setShowAssignTeacherModal(false);
      setSelectedClass(null);
      setSelectedTeacher('');
      fetchClasses();
    } catch (error) {
      console.error('Error assigning teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to assign teacher');
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

  const getStatusBadge = (status) => {
    if (status === 'archived') {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full">
          Archived
        </span>
      );
    } else if (status === 'active') {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
        {status || 'N/A'}
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Classes Management"
        subtitle="Manage all classes and sections"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddClass}>
            Add Class
          </Button>
        }
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
          <button
            onClick={() => setError('')}
            className="ml-2 text-red-800 dark:text-red-300 hover:text-red-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls._id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border ${
              cls.status === 'archived'
                ? 'border-yellow-200 dark:border-yellow-800 opacity-70'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {cls.name}
                  </h3>
                  {getStatusBadge(cls.status)}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {cls.code}
                </p>
                {cls.classTeacher && (
                  <p className="text-sm text-primary-600 dark:text-primary-400">
                    Teacher:{' '}
                    {cls.classTeacher.user?.name ||
                      cls.classTeacher.name ||
                      'Assigned'}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleViewClass(cls._id)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600"
                  title="View Class Details"
                >
                  <FiEye className="text-sm" />
                </button>
                {cls.status !== 'archived' && (
                  <>
                    <button
                      onClick={() => handleEditClass(cls)}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
                      title="Edit Class"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    {getStudentCount(cls) === 0 && getSubjectCount(cls) === 0 ? (
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                        title="Delete Class"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleArchive(cls._id)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600"
                        title="Archive Class"
                      >
                        <FiArchive className="text-sm" />
                      </button>
                    )}
                  </>
                )}
                {cls.status === 'archived' && (
                  <button
                    onClick={() => handleRestore(cls._id)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-green-600"
                    title="Restore Class"
                  >
                    <FiRefreshCw className="text-sm" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <FiUsers className="text-gray-400" />
                <span>{getStudentCount(cls)} Students</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                <FiBookOpen className="text-gray-400" />
                <span>{getSubjectCount(cls)} Subjects</span>
              </div>
            </div>

            {cls.status !== 'archived' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
                <button
                  onClick={() => openAssignTeacherModal(cls._id)}
                  className="px-3 py-1.5 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center gap-1"
                >
                  <FiUserCheck className="text-xs" /> Assign Teacher
                </button>

                {getStudentCount(cls) > 0 && (
                  <button
                    onClick={() => handleRemoveAllStudents(cls._id)}
                    className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1"
                  >
                    <FiUserMinus className="text-xs" /> Remove All Students
                  </button>
                )}

                {getSubjectCount(cls) > 0 && (
                  <button
                    onClick={() => handleRemoveAllSubjects(cls._id)}
                    className="px-3 py-1.5 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors flex items-center gap-1"
                  >
                    <FiBookOpen className="text-xs" /> Remove All Subjects
                  </button>
                )}

                {(getStudentCount(cls) > 0 || getSubjectCount(cls) > 0) && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleCleanDelete(cls._id)}
                      className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
                      title="Remove all dependencies then delete"
                    >
                      <FiTrash className="text-xs" /> Clean Delete
                    </button>
                    <button
                      onClick={() => handleForceDelete(cls._id)}
                      className="px-3 py-1.5 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors flex items-center gap-1"
                      title="Delete everything including all data"
                    >
                      <FiTrash className="text-xs" /> Force Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingClass ? 'Edit Class' : 'Add Class'}
        size="lg"
      >
        <ClassForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>

      <Modal
        isOpen={showAssignTeacherModal}
        onClose={() => setShowAssignTeacherModal(false)}
        title="Assign Class Teacher"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Teacher
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="input-field"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.user?.name} ({teacher.teacherId})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
              Assign Teacher
            </Button>
          </div>
        </div>
      </Modal>

      <ClassDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedClassId(null);
        }}
        classId={selectedClassId}
      />
    </div>
  );
};

export default Classes;