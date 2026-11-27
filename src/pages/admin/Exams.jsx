import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiAward,
  FiSend,
  FiFilter,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
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
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    } catch (err) {
      console.error('Error fetching exams:', err);
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes');
      setClasses(response.data.classes || []);
    } catch (err) {
      console.error('Error fetching classes:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.subjects || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
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
    if (!formData.academicYear) newErrors.academicYear = 'Academic year is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject is required';

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
        toast.success('Exam schedule updated successfully');
      } else {
        await api.post('/api/exams', formData);
        toast.success('Exam created successfully');
      }
      setShowModal(false);
      fetchExams();
    } catch (err) {
      console.error('Error saving exam:', err);
      toast.error(err.response?.data?.message || 'Failed to save exam');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/exams/${deleteTargetId}`);
      toast.success('Exam schedule removed successfully');
      setDeleteTargetId(null);
      fetchExams();
    } catch (err) {
      console.error('Error deleting exam:', err);
      toast.error('Failed to delete exam');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.put(`/api/exams/${id}/publish`);
      toast.success('Exam published to students and faculty');
      fetchExams();
    } catch (err) {
      console.error('Error publishing exam:', err);
      toast.error('Failed to publish exam');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'ongoing': return 'info';
      case 'draft': return 'warning';
      case 'completed': return 'neutral';
      case 'cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  if (loading && exams.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examinations Registry"
        subtitle="Schedule and orchestrate institution-wide assessments and grading periods"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Exams' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddExam}>
            Create Exam
          </Button>
        }
      />

      <div className="card overflow-hidden">
        {/* Class Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
          <div className="w-56">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="select-field text-xs py-2.5 w-full"
            >
              <option value="">All Academic Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {selectedClass && (
            <button
              onClick={() => setSelectedClass('')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Exams Table */}
        {exams.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiAward}
              title="No examinations scheduled"
              description="No exams registered for the selected cohort or term."
              actionLabel="Schedule First Exam"
              onAction={handleAddExam}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Examination Name</th>
                  <th className="px-4 py-3">Class Cohort</th>
                  <th className="px-4 py-3">Schedule Window</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {exams.map((exam) => (
                  <tr
                    key={exam._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {exam.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {exam.code} • {exam.type?.toUpperCase()}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                      {exam.class?.name || 'All Classes'}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <FiCalendar className="text-slate-400 text-xs" />
                        {formatDate(exam.startDate)} – {formatDate(exam.endDate)}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <FiClock className="text-slate-400" />
                        {exam.duration} minutes ({exam.totalMarks} marks)
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge
                        status={exam.status}
                        variant={getStatusVariant(exam.status)}
                      >
                        {exam.status?.toUpperCase()}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {exam.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(exam._id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                            title="Publish Exam"
                          >
                            <FiSend className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditExam(exam)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Exam"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(exam._id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Exam"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Exam Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingExam ? 'Update Examination Schedule' : 'Schedule New Examination'}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Exam Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Midterm Examination 2026"
              required
              error={errors.name}
            />
            <Input
              label="Exam Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. MID-2026"
              required
              error={errors.code}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Exam Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'midterm', label: 'Midterm Examination' },
                { value: 'final', label: 'Final Examination' },
                { value: 'quiz', label: 'Assessment Quiz' },
                { value: 'assignment', label: 'Term Project / Assignment' },
                { value: 'practical', label: 'Practical Lab' },
                { value: 'viva', label: 'Oral Examination / Viva' },
              ]}
            />
            <Select
              label="Term Period"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              options={[
                { value: 'annual', label: 'Annual Term' },
                { value: 'semester1', label: 'Fall Semester' },
                { value: 'semester2', label: 'Spring Semester' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Class Cohort"
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
            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="2026-2027"
              required
              error={errors.academicYear}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Maximum Marks"
              name="totalMarks"
              type="number"
              value={formData.totalMarks}
              onChange={handleChange}
              placeholder="100"
            />
            <Input
              label="Passing Threshold"
              name="passingMarks"
              type="number"
              value={formData.passingMarks}
              onChange={handleChange}
              placeholder="40"
            />
            <Input
              label="Duration (Minutes)"
              name="duration"
              type="number"
              value={formData.duration}
              onChange={handleChange}
              placeholder="60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="label">
              Covered Subjects <span className="text-rose-500">*</span>
            </label>
            <select
              name="subjects"
              multiple
              value={formData.subjects}
              onChange={handleMultiSelect}
              className="select-field text-xs h-28 w-full"
              required
            >
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name} ({subject.code})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Hold Ctrl/Cmd to select multiple curriculum subjects
            </p>
            {errors.subjects && (
              <p className="text-xs text-rose-500 mt-1">{errors.subjects}</p>
            )}
          </div>

          <Input
            label="Examination Guidelines & Instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Special instructions for invigilators and students..."
          />

          <Select
            label="Publication Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'draft', label: 'Draft (Internal Review)' },
              { value: 'published', label: 'Published (Visible to Students)' },
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
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel & Delete Examination"
        message="Are you sure you want to remove this examination? All published date sheets and scheduled time slots linked to this assessment will be revoked."
        confirmText="Delete Exam"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Exams;
