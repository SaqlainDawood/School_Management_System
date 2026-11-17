import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiClock,
  FiSend,
  FiBookOpen,
  FiLayers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    class: '',
    section: '',
    subject: '',
    dueDate: '',
    totalMarks: 100,
    passingMarks: 40,
    status: 'draft',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAssignments();
    fetchTeacherData();
  }, []);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/assignments');
      setAssignments(response.data?.assignments || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherData = async () => {
    try {
      const classesRes = await api.get('/api/teachers/classes');
      const classList = classesRes.data?.classes || [];
      setClasses(classList);

      const subjectsSet = new Set();
      classList.forEach((cls) => {
        cls.subjects?.forEach((s) => {
          if (s.subject?._id) {
            subjectsSet.add(
              JSON.stringify({ _id: s.subject._id, name: s.subject.name })
            );
          }
        });
      });
      const uniqueSubjects = Array.from(subjectsSet).map((s) => JSON.parse(s));
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error('Error fetching teacher class data:', err);
    }
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setFormData({
      title: '',
      description: '',
      class: '',
      section: '',
      subject: '',
      dueDate: '',
      totalMarks: 100,
      passingMarks: 40,
      status: 'draft',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title || '',
      description: assignment.description || '',
      class: assignment.class?._id || '',
      section: assignment.section?._id || '',
      subject: assignment.subject?._id || '',
      dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
      totalMarks: assignment.totalMarks || 100,
      passingMarks: assignment.passingMarks || 40,
      status: assignment.status || 'draft',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.class) newErrors.class = 'Please select a class';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.totalMarks || parseFloat(formData.totalMarks) <= 0)
      newErrors.totalMarks = 'Total marks must be greater than 0';
    if (parseFloat(formData.passingMarks) > parseFloat(formData.totalMarks)) {
      newErrors.passingMarks = 'Passing marks cannot exceed total marks';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please resolve the required fields');
      return;
    }

    setFormLoading(true);
    try {
      const submitData = {
        ...formData,
        totalMarks: parseFloat(formData.totalMarks),
        passingMarks: parseFloat(formData.passingMarks),
      };

      if (editingAssignment) {
        await api.put(`/api/assignments/${editingAssignment._id}`, submitData);
        toast.success('Coursework updated successfully');
      } else {
        await api.post('/api/assignments', submitData);
        toast.success('Assignment created successfully');
      }
      setShowModal(false);
      fetchAssignments();
    } catch (err) {
      console.error('Error saving assignment:', err);
      toast.error(err.response?.data?.message || 'Failed to save assignment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/assignments/${deleteTargetId}`);
      toast.success('Assignment deleted');
      setDeleteTargetId(null);
      fetchAssignments();
    } catch (err) {
      console.error('Error deleting assignment:', err);
      toast.error('Failed to delete assignment');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/api/assignments/${id}`, { status: 'published' });
      toast.success('Assignment published to students');
      fetchAssignments();
    } catch (err) {
      console.error('Error publishing assignment:', err);
      toast.error('Failed to publish assignment');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'closed': return 'danger';
      default: return 'neutral';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coursework & Assignments"
        subtitle="Author, publish, and evaluate academic assignments across your class cohorts"
        breadcrumbs={[
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Assignments' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddAssignment}>
            New Assignment
          </Button>
        }
      />

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="card p-12">
            <EmptyState
              icon={FiFileText}
              title="No assignments configured"
              description="Create homework, research papers, or term projects for your classes."
              actionLabel="Create Assignment"
              onAction={handleAddAssignment}
            />
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="card p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                      <FiFileText className="text-sm" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {assignment.title}
                    </h3>
                    <StatusBadge variant={getStatusVariant(assignment.status)} dot>
                      {assignment.status?.toUpperCase()}
                    </StatusBadge>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    {assignment.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <FiLayers className="text-slate-400" /> Class: {assignment.class?.name || 'Assigned Class'}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                      <FiBookOpen className="text-slate-400" /> Subject: {assignment.subject?.name || 'General'}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-rose-600 dark:text-rose-400">
                      <FiClock className="text-xs" /> Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span className="font-mono text-slate-500">
                      Marks: {assignment.passingMarks || 40}/{assignment.totalMarks || 100}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {assignment.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(assignment._id)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      title="Publish Assignment"
                    >
                      <FiSend className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAssignment(assignment)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Assignment"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(assignment._id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Assignment"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Assignment Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAssignment ? 'Update Coursework' : 'Author Assignment'}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <Input
            label="Assignment Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Chapter 4 Differential Equations Lab"
            required
            icon={FiFileText}
            error={errors.title}
          />

          <TextArea
            label="Detailed Assignment Brief & Tasks"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter complete assignment requirements, reading references, and deliverable format..."
            rows={4}
            required
            error={errors.description}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Cohort Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Target Class' },
                ...classes.map((c) => ({ value: c._id, label: c.name })),
              ]}
              required
              error={errors.class}
            />
            <Select
              label="Subject Discipline"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Subject' },
                ...subjects.map((s) => ({ value: s._id, label: s.name })),
              ]}
              required
              error={errors.subject}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Submission Deadline"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
              error={errors.dueDate}
            />
            <Input
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              error={errors.totalMarks}
            />
            <Input
              label="Passing Threshold"
              name="passingMarks"
              type="number"
              value={formData.passingMarks}
              onChange={handleChange}
              required
              error={errors.passingMarks}
            />
          </div>

          <Select
            label="Initial State"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'draft', label: 'Draft (Save for Review)' },
              { value: 'published', label: 'Published (Immediate Student Access)' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
            >
              {editingAssignment ? 'Save Changes' : 'Publish Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? Student submissions and draft grades for this coursework will be removed."
        confirmText="Delete Assignment"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default TeacherAssignments;
