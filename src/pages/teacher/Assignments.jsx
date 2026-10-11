import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import TextArea from '../../components/forms/TextArea';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
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
      setAssignments(response.data.assignments || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherData = async () => {
    try {
      const classesRes = await api.get('/api/teachers/classes');
      setClasses(classesRes.data.classes || []);

      const subjectsSet = new Set();
      classesRes.data.classes.forEach((cls) => {
        cls.subjects?.forEach((s) => {
          subjectsSet.add(
            JSON.stringify({ _id: s.subject?._id, name: s.subject?.name })
          );
        });
      });
      const uniqueSubjects = Array.from(subjectsSet).map((s) => JSON.parse(s));
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
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
    if (!formData.description)
      newErrors.description = 'Description is required';
    if (!formData.class) newErrors.class = 'Please select a class';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.totalMarks || parseFloat(formData.totalMarks) <= 0)
      newErrors.totalMarks = 'Total marks must be greater than 0';
    if (
      parseFloat(formData.passingMarks) > parseFloat(formData.totalMarks)
    ) {
      newErrors.passingMarks = 'Passing marks cannot exceed total marks';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
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
        toast.success('Assignment updated successfully');
      } else {
        await api.post('/api/assignments', submitData);
        toast.success('Assignment created successfully');
      }
      setShowModal(false);
      fetchAssignments();
    } catch (error) {
      console.error('Error saving assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to save assignment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await api.delete(`/api/assignments/${id}`);
        toast.success('Assignment deleted successfully');
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
        toast.error('Failed to delete assignment');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/api/assignments/${id}`, { status: 'published' });
      toast.success('Assignment published successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Error publishing assignment:', error);
      toast.error('Failed to publish assignment');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'badge-warning',
      published: 'badge-success',
      closed: 'badge-danger',
    };
    return (
      <span className={`badge ${colors[status] || 'badge-info'}`}>{status}</span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Assignments"
        subtitle="Create and manage assignments"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddAssignment}>
            Create Assignment
          </Button>
        }
      />

      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
            <FiFileText className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No assignments created yet
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FiFileText className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {assignment.title}
                    </h3>
                    {getStatusBadge(assignment.status)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {assignment.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>Class: {assignment.class?.name}</span>
                    <span>Subject: {assignment.subject?.name}</span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" />
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span>
                      Submissions: {assignment.submissions?.length || 0}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {assignment.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(assignment._id)}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600"
                      title="Publish"
                    >
                      <FiCheckCircle className="text-sm" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAssignment(assignment)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-600"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Create Assignment'}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <Input
            label="Assignment Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter assignment title"
            required
            icon={FiFileText}
            error={errors.title}
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter assignment description"
            rows={4}
            required
            error={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              options={[
                { value: '', label: 'Select Class' },
                ...classes.map((c) => ({ value: c._id, label: c.name })),
              ]}
              required
              error={errors.class}
            />
            <Select
              label="Subject"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Due Date"
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
              label="Passing Marks"
              name="passingMarks"
              type="number"
              value={formData.passingMarks}
              onChange={handleChange}
              required
              error={errors.passingMarks}
            />
          </div>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
              className="w-full sm:w-auto"
            >
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherAssignments;