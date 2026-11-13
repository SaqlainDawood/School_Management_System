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
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
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
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Failed to fetch results');
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

  const fetchExams = async () => {
    try {
      const response = await api.get('/api/exams');
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
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

  const fetchStudentsByClass = async (classId) => {
    try {
      const response = await api.get(`/api/classes/${classId}/students`);
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
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
        toast.success('Result updated successfully');
      } else {
        await api.post('/api/results', submitData);
        toast.success('Result added successfully');
      }
      setShowModal(false);
      fetchResults();
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error(error.response?.data?.message || 'Failed to save result');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await api.delete(`/api/results/${id}`);
        toast.success('Result deleted successfully');
        fetchResults();
      } catch (error) {
        console.error('Error deleting result:', error);
        toast.error('Failed to delete result');
      }
    }
  };

  const getGradeBadge = (grade) => {
    const colors = {
      'A+': 'badge-success',
      A: 'badge-success',
      'B+': 'badge-info',
      B: 'badge-info',
      'C+': 'badge-warning',
      C: 'badge-warning',
      D: 'badge-danger',
      F: 'badge-danger',
    };
    return (
      <span className={`badge ${colors[grade] || 'badge-info'}`}>{grade}</span>
    );
  };

  if (loading && results.length === 0) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Results Management"
        subtitle="Manage student results"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddResult}>
            Add Result
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <Select
              name="class"
              value={filters.classId}
              onChange={(e) => handleFilterChange('classId', e.target.value)}
              options={[
                { value: '', label: 'All Classes' },
                ...classes.map((c) => ({ value: c._id, label: c.name })),
              ]}
              className="w-48"
              label="Filter by Class"
            />
            <Select
              name="exam"
              value={filters.examId}
              onChange={(e) => handleFilterChange('examId', e.target.value)}
              options={[
                { value: '', label: 'All Exams' },
                ...exams.map((e) => ({ value: e._id, label: e.name })),
              ]}
              className="w-48"
              label="Filter by Exam"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiAward className="text-4xl text-gray-300 mx-auto mb-3" />
                    No results found
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr
                    key={result._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {result.student?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {result.student?.rollNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {result.exam?.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {result.obtainedMarks} / {result.totalMarks}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.percentage?.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getGradeBadge(result.grade)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditResult(result)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
                          title="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(result._id)}
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

      {/* Add/Edit Result Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingResult ? 'Edit Result' : 'Add Result'}
        size="xl"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Class"
              name="class"
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              options={[
                { value: '', label: 'Select Class' },
                ...classes.map((c) => ({ value: c._id, label: c.name })),
              ]}
              required
              error={errors.class}
            />
            <Select
              label="Exam"
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
            label="Student"
            name="student"
            value={formData.student}
            onChange={(e) =>
              setFormData({ ...formData, student: e.target.value })
            }
            options={[
              { value: '', label: 'Select Student' },
              ...students.map((s) => ({
                value: s._id,
                label: `${s.user?.name || s.name} (${s.rollNumber})`,
              })),
            ]}
            required
            error={errors.student}
            disabled={!selectedClass}
          />

          {selectedExam && marksData.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                Marks Entry
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-3 py-2 text-left">Subject</th>
                      <th className="px-3 py-2 text-left">Total Marks</th>
                      <th className="px-3 py-2 text-left">Obtained</th>
                      <th className="px-3 py-2 text-left">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {marksData.map((mark, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-medium">
                          {mark.subjectName || 'Unknown'}
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
                            className="input-field w-20 text-sm"
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
                            className="input-field w-20 text-sm"
                            min="0"
                            max={mark.totalMarks}
                            required
                          />
                        </td>
                        <td className="px-3 py-2">
                          {getGradeBadge(mark.grade || 'N/A')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              {editingResult ? 'Update Result' : 'Add Result'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Results;