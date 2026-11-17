import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAward,
  FiUser,
  FiBook,
  FiCheckCircle,
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
import { calculateGrade, calculateGPA } from '../../utils/helpers';

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [filters, setFilters] = useState({ classId: '', examId: '' });
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    student: '',
    exam: '',
    class: '',
    section: '',
    marks: [],
    remarks: '',
  });
  const [marksData, setMarksData] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchResults();
    fetchClasses();
    fetchExams();
    fetchSubjects();
  }, [filters]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/results', { params: filters });
      setResults(response.data.results || []);
    } catch (err) {
      console.error('Error fetching results:', err);
      toast.error('Failed to fetch results');
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

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/exams');
      setExams(response.data.exams || []);
    } catch (err) {
      console.error('Error fetching exams:', err);
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

  const fetchStudentsByClass = async (classId) => {
    try {
      const response = await api.get(`/api/classes/${classId}/students`);
      setStudents(response.data.students || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    setFormData({ ...formData, class: classId });
    if (classId) {
      fetchStudentsByClass(classId);
    } else {
      setStudents([]);
    }
  };

  const handleExamChange = (examId) => {
    setSelectedExam(examId);
    setFormData({ ...formData, exam: examId });
    if (examId) {
      const exam = exams.find((e) => e._id === examId);
      if (exam) {
        const marks = exam.subjects.map((subjectId) => {
          const subject = subjects.find((s) => s._id === subjectId);
          return {
            subject: subjectId,
            subjectName: subject?.name || 'Unknown',
            obtainedMarks: '',
            totalMarks: exam.totalMarks || 100,
            grade: '',
            gradePoints: 0,
            remarks: '',
          };
        });
        setMarksData(marks);
        setFormData({ ...formData, exam: examId, marks: marks });
      }
    } else {
      setMarksData([]);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleAddResult = () => {
    setEditingResult(null);
    setFormData({
      student: '',
      exam: '',
      class: '',
      section: '',
      marks: [],
      remarks: '',
    });
    setMarksData([]);
    setSelectedExam('');
    setSelectedClass('');
    setErrors({});
    setShowModal(true);
  };

  const handleEditResult = (result) => {
    setEditingResult(result);
    setFormData({
      student: result.student?._id || '',
      exam: result.exam?._id || '',
      class: result.class?._id || '',
      section: result.section?._id || '',
      marks: result.marks || [],
      remarks: result.remarks || '',
    });
    setMarksData(result.marks || []);
    setSelectedExam(result.exam?._id || '');
    setSelectedClass(result.class?._id || '');
    if (result.class?._id) {
      fetchStudentsByClass(result.class._id);
    }
    setErrors({});
    setShowModal(true);
  };

  const handleMarksChange = (index, field, value) => {
    const updatedMarks = [...marksData];
    updatedMarks[index][field] = value;

    if (field === 'obtainedMarks' || field === 'totalMarks') {
      const obtained = parseFloat(updatedMarks[index].obtainedMarks) || 0;
      const total = parseFloat(updatedMarks[index].totalMarks) || 100;
      const percentage = total > 0 ? (obtained / total) * 100 : 0;
      updatedMarks[index].grade = calculateGrade(percentage);
      updatedMarks[index].gradePoints = calculateGPA(updatedMarks[index].grade);
    }

    setMarksData(updatedMarks);
    setFormData({ ...formData, marks: updatedMarks });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student) newErrors.student = 'Please select a student';
    if (!formData.exam) newErrors.exam = 'Please select an exam';
    if (!formData.class) newErrors.class = 'Please select a class';
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
      const submitData = {
        studentId: formData.student,
        examId: formData.exam,
        marks: marksData.map((m) => ({
          subject: m.subject,
          obtainedMarks: parseFloat(m.obtainedMarks),
          totalMarks: parseFloat(m.totalMarks),
          remarks: m.remarks || '',
        })),
        remarks: formData.remarks,
      };

      if (editingResult) {
        await api.put(`/api/results/${editingResult._id}`, submitData);
        toast.success('Result ledger updated successfully');
      } else {
        await api.post('/api/results', submitData);
        toast.success('Gradebook result recorded successfully');
      }
      setShowModal(false);
      fetchResults();
    } catch (err) {
      console.error('Error saving result:', err);
      toast.error(err.response?.data?.message || 'Failed to save result');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/results/${deleteTargetId}`);
      toast.success('Grade entry removed');
      setDeleteTargetId(null);
      fetchResults();
    } catch (err) {
      console.error('Error deleting result:', err);
      toast.error('Failed to delete result');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getGradeVariant = (grade) => {
    if (!grade) return 'neutral';
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'info';
    if (grade.startsWith('C')) return 'warning';
    return 'danger';
  };

  if (loading && results.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gradebook & Results"
        subtitle="Manage academic transcripts, term grades, and student marks registers"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Results' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddResult}>
            Enter Marks
          </Button>
        }
      />

      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap gap-3">
          <div className="w-52">
            <select
              value={filters.classId}
              onChange={(e) => handleFilterChange('classId', e.target.value)}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">All Academic Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-56">
            <select
              value={filters.examId}
              onChange={(e) => handleFilterChange('examId', e.target.value)}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">All Assessments & Exams</option>
              {exams.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {(filters.classId || filters.examId) && (
            <button
              onClick={() => setFilters({ classId: '', examId: '' })}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline self-center font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiAward}
              title="No grades on ledger"
              description="No marks recorded for the selected assessment and class parameters."
              actionLabel="Enter Gradebook Record"
              onAction={handleAddResult}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-4 py-3">Assessment</th>
                  <th className="px-4 py-3">Marks Earned</th>
                  <th className="px-4 py-3 text-center">Final Grade</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {results.map((result) => {
                  const initial = result.student?.name?.charAt(0) || 'S';
                  return (
                    <tr
                      key={result._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 flex items-center justify-center font-bold text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {result.student?.name || 'Unknown Student'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Roll: {result.student?.rollNumber || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                        {result.exam?.name || 'Term Exam'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <div className="font-mono font-semibold">
                          {result.obtainedMarks} / {result.totalMarks}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {result.percentage != null ? `${result.percentage.toFixed(1)}%` : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <StatusBadge
                          variant={getGradeVariant(result.grade)}
                        >
                          Grade {result.grade || '—'}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditResult(result)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Marks"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(result._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Record"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Result Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingResult ? 'Update Assessment Result' : 'Enter Student Exam Marks'}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Class Cohort"
              name="class"
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              options={[
                { value: '', label: 'Select Cohort' },
                ...classes.map((c) => ({ value: c._id, label: c.name })),
              ]}
              required
              error={errors.class}
            />
            <Select
              label="Assessment / Exam"
              name="exam"
              value={selectedExam}
              onChange={(e) => handleExamChange(e.target.value)}
              options={[
                { value: '', label: 'Select Exam' },
                ...exams.map((e) => ({ value: e._id, label: e.name })),
              ]}
              required
              error={errors.exam}
            />
          </div>

          <Select
            label="Candidate Student"
            name="student"
            value={formData.student}
            onChange={(e) =>
              setFormData({ ...formData, student: e.target.value })
            }
            options={[
              { value: '', label: 'Select Student' },
              ...students.map((s) => ({
                value: s._id,
                label: `${s.user?.name || s.name} (Roll: ${s.rollNumber})`,
              })),
            ]}
            required
            error={errors.student}
            disabled={!selectedClass}
          />

          {selectedExam && marksData.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                Subject Marks Ledger
              </h4>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500">
                    <tr>
                      <th className="px-3 py-2.5 text-left">Subject</th>
                      <th className="px-3 py-2.5 text-left">Total Points</th>
                      <th className="px-3 py-2.5 text-left">Marks Scored</th>
                      <th className="px-3 py-2.5 text-center">Calculated Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {marksData.map((mark, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">
                          {mark.subjectName || 'Unknown Subject'}
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={mark.totalMarks}
                            onChange={(e) =>
                              handleMarksChange(
                                index,
                                'totalMarks',
                                e.target.value
                              )
                            }
                            className="input-field text-xs w-24 py-1"
                            min="1"
                            required
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={mark.obtainedMarks}
                            onChange={(e) =>
                              handleMarksChange(
                                index,
                                'obtainedMarks',
                                e.target.value
                              )
                            }
                            className="input-field text-xs w-24 py-1 font-bold text-indigo-600 dark:text-indigo-400"
                            min="0"
                            max={mark.totalMarks}
                            required
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <StatusBadge
                            variant={getGradeVariant(mark.grade)}
                          >
                            {mark.grade || '—'}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              {editingResult ? 'Update Ledger' : 'Commit Grades'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Revoke Result Ledger Record"
        message="Are you sure you want to delete this result entry? Academic GPA recalculations may occur."
        confirmText="Delete Result"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Results;
