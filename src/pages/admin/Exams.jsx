import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'midterm',
    class: '',
    section: '',
    subjects: [],
    totalMarks: 100,
    passingMarks: 40,
    duration: 60,
    instructions: '',
    academicYear: '',
    semester: 'annual',
    startDate: '',
    endDate: '',
    status: 'draft',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchExams();
    fetchClasses();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchExams();
  }, [selectedClass]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedClass) params.classId = selectedClass;
      const response = await api.get('/api/exams', { params });
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes');
      setClasses(response.data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleAddExam = () => {
    setEditingExam(null);
    setFormData({
      name: '',
      code: '',
      type: 'midterm',
      class: selectedClass || '',
      section: '',
      subjects: [],
      totalMarks: 100,
      passingMarks: 40,
      duration: 60,
      instructions: '',
      academicYear: '2026-2027',
      semester: 'annual',
      startDate: '',
      endDate: '',
      status: 'draft',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditExam = (exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name || '',
      code: exam.code || '',
      type: exam.type || 'midterm',
      class: exam.class?._id || '',
      section: exam.section?._id || '',
      subjects: exam.subjects?.map((s) => s._id) || [],
      totalMarks: exam.totalMarks || 100,
      passingMarks: exam.passingMarks || 40,
      duration: exam.duration || 60,
      instructions: exam.instructions || '',
      academicYear: exam.academicYear || '',
      semester: exam.semester || 'annual',
      startDate: exam.startDate ? exam.startDate.split('T')[0] : '',
      endDate: exam.endDate ? exam.endDate.split('T')[0] : '',
      status: exam.status || 'draft',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleMultiSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData({ ...formData, subjects: selected });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Exam name is required';
    if (!formData.code) newErrors.code = 'Exam code is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.academicYear)
      newErrors.academicYear = 'Academic year is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.subjects.length === 0)
      newErrors.subjects = 'At least one subject is required';

    // Date validation
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setFormLoading(true);
    try {
      if (editingExam) {
        await api.put(`/api/exams/${editingExam._id}`, formData);
        toast.success('Exam updated successfully');
      } else {
        await api.post('/api/exams', formData);
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      fetchExams();
    } catch (error) {
      console.error('Error saving exam:', error);
      toast.error(error.response?.data?.message || 'Failed to save exam');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await api.delete(`/api/exams/${id}`);
        toast.success('Exam deleted successfully');
        fetchExams();
      } catch (error) {
        console.error('Error deleting exam:', error);
        toast.error('Failed to delete exam');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/api/exams/${id}/publish`);
      toast.success('Exam published successfully');
      fetchExams();
    } catch (error) {
      console.error('Error publishing exam:', error);
      toast.error('Failed to publish exam');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'badge-warning',
      published: 'badge-success',
      ongoing: 'badge-info',
      completed: 'badge-secondary',
      cancelled: 'badge-danger',
    };
    return (
      <span className={`badge ${colors[status] || 'badge-warning'}`}>
        {status}
      </span>
    );
  };

  if (loading && exams.length === 0) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Exams Management"
        subtitle="Create and manage exams"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddExam}>
            Create Exam
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Select
            name="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
              { value: '', label: 'All Classes' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
            className="w-48"
            label="Filter by Class"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {exams.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiAward className="text-4xl text-gray-300 mx-auto mb-3" />
                    No exams found
                  </td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr
                    key={exam._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {exam.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {exam.code}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {exam.class?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-gray-400 text-xs" />
                          {formatDate(exam.startDate)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <FiClock className="text-gray-400" />
                          {exam.duration} minutes
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(exam.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {exam.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(exam._id)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-green-600"
                            title="Publish"
                          >
                            <FiAward className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditExam(exam)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
                          title="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Exam Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExam ? 'Edit Exam' : 'Create Exam'}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Exam Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter exam name"
              required
              error={errors.name}
            />
            <Input
              label="Exam Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter exam code"
              required
              error={errors.code}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Exam Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'midterm', label: 'Midterm' },
                { value: 'final', label: 'Final' },
                { value: 'quiz', label: 'Quiz' },
                { value: 'assignment', label: 'Assignment' },
                { value: 'practical', label: 'Practical' },
                { value: 'viva', label: 'Viva' },
              ]}
            />
            <Select
              label="Fee Period"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              options={[
                { value: 'annual', label: 'Annual' },
                { value: 'semester1', label: 'Semester 1' },
                { value: 'semester2', label: 'Semester 2' },
              ]}
            />
          </div>

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
            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g., 2026-2027"
              required
              error={errors.academicYear}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Total Marks"
              name="totalMarks"
              type="number"
              value={formData.totalMarks}
              onChange={handleChange}
              placeholder="100"
            />
            <Input
              label="Passing Marks"
              name="passingMarks"
              type="number"
              value={formData.passingMarks}
              onChange={handleChange}
              placeholder="40"
            />
            <Input
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              required
              error={errors.startDate}
            />
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              required
              error={errors.endDate}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Subjects <span className="text-red-500">*</span>
            </label>
            <select
              name="subjects"
              multiple
              value={formData.subjects}
              onChange={handleMultiSelect}
              className="input-field h-32"
              required
            >
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Hold Ctrl/Cmd to select multiple subjects
            </p>
            {errors.subjects && (
              <p className="text-sm text-red-500 mt-1">{errors.subjects}</p>
            )}
          </div>

          <Input
            label="Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Enter exam instructions"
          />

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
              {editingExam ? 'Update Exam' : 'Create Exam'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Exams;