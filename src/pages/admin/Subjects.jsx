// frontend/src/pages/admin/Subjects.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiBookOpen,
  FiUser,
  FiX,
  FiSearch,
  FiFilter,
  FiLayers,
  FiChevronDown,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [selectedClass, setSelectedClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    type: 'core',
    credits: 3,
    classes: [],
    teachers: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
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

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const matchesClass =
        !selectedClass ||
        (Array.isArray(subject.classes) &&
          subject.classes.some((c) => {
            const classId =
              typeof c === 'object' && c !== null ? c._id || c.id : c;
            return String(classId) === String(selectedClass);
          }));

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        subject.name?.toLowerCase().includes(query) ||
        subject.code?.toLowerCase().includes(query) ||
        subject.description?.toLowerCase().includes(query);

      return matchesClass && matchesSearch;
    });
  }, [subjects, selectedClass, searchQuery]);

  const groupedSubjects = useMemo(() => {
    if (selectedClass) return null;

    const groups = {};

    filteredSubjects.forEach((subject) => {
      const subjectClasses = subject.classes || [];

      if (subjectClasses.length === 0) {
        if (!groups['unassigned']) {
          groups['unassigned'] = { classData: null, subjects: [] };
        }
        groups['unassigned'].subjects.push(subject);
      } else {
        subjectClasses.forEach((cls) => {
          const classId = cls._id || cls;
          if (!groups[classId]) {
            const classData = classes.find((c) => c._id === classId);
            groups[classId] = {
              classData:
                classData ||
                (typeof cls === 'object'
                  ? cls
                  : { _id: classId, name: 'Unknown Class' }),
              subjects: [],
            };
          }
          groups[classId].subjects.push(subject);
        });
      }
    });

    const sortedEntries = Object.entries(groups).sort((a, b) => {
      const nameA = a[1].classData?.name || 'zzz';
      const nameB = b[1].classData?.name || 'zzz';
      return nameA.localeCompare(nameB, undefined, { numeric: true });
    });

    return Object.fromEntries(sortedEntries);
  }, [filteredSubjects, selectedClass, classes]);

  const handleClearFilters = () => {
    setSelectedClass('');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedClass || searchQuery;

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      description: '',
      type: 'core',
      credits: 3,
      classes: [],
      teachers: [],
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name || '',
      code: subject.code || '',
      description: subject.description || '',
      type: subject.type || 'core',
      credits: subject.credits || 3,
      classes: subject.classes?.map((c) => c._id || c) || [],
      teachers: subject.teachers?.map((t) => t._id || t) || [],
    });
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setFormData({ ...formData, classes: classId ? [classId] : [] });
  };

  const handleTeacherChange = (e) => {
    const teacherId = e.target.value;
    setFormData({ ...formData, teachers: teacherId ? [teacherId] : [] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Subject name is required';
    if (!formData.code) newErrors.code = 'Subject code is required';
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
      if (editingSubject) {
        await api.put(`/api/subjects/${editingSubject._id}`, formData);
        toast.success('Subject updated successfully');
      } else {
        await api.post('/api/subjects', formData);
        toast.success('Subject added successfully');
      }
      setShowModal(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error(error.response?.data?.message || 'Failed to save subject');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await api.delete(`/api/subjects/${id}`);
        toast.success('Subject deleted successfully');
        fetchSubjects();
      } catch (error) {
        console.error('Error deleting subject:', error);
        toast.error('Failed to delete subject');
      }
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      core: 'badge-primary',
      elective: 'badge-info',
      lab: 'badge-warning',
      practical: 'badge-success',
      theory: 'badge-secondary',
    };
    return (
      <span className={`badge ${colors[type] || 'badge-info'}`}>{type}</span>
    );
  };

  const SubjectCard = ({ subject, showClassBadge = false }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-5 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FiBookOpen className="text-primary-500 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
              {subject.name}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Code: {subject.code}
          </p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => handleEditSubject(subject)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
            title="Edit Subject"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button
            onClick={() => handleDelete(subject._id)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
            title="Delete Subject"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {getTypeBadge(subject.type)}
        <span className="badge badge-info">{subject.credits} Credits</span>
        {showClassBadge && subject.classes && subject.classes.length > 0 && (
          <span className="badge badge-secondary flex items-center gap-1">
            <FiLayers className="text-xs" />
            {subject.classes.map((c) => c.name || 'N/A').join(', ')}
          </span>
        )}
      </div>

      {subject.description && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {subject.description}
        </p>
      )}

      {subject.teachers && subject.teachers.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <FiUser className="text-gray-400 flex-shrink-0" />
            <span className="truncate">
              {subject.teachers.length === 1
                ? subject.teachers[0]?.user?.name ||
                  subject.teachers[0]?.name ||
                  'Teacher assigned'
                : `${subject.teachers.length} teachers assigned`}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );

  const ClassSectionHeader = ({ classData, count, isUnassigned }) => (
    <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary-500 to-primary-700"></div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isUnassigned
              ? 'Unassigned Subjects'
              : classData?.name || 'Unknown Class'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {count} {count === 1 ? 'subject' : 'subjects'}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Subjects Management"
        subtitle="Manage all subjects across classes"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddSubject}>
            Add Subject
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none appearance-none cursor-pointer transition-all"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, code, or description..."
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              icon={FiX}
              onClick={handleClearFilters}
              className="whitespace-nowrap"
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Total:</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {subjects.length}
            </span>
            <span className="text-gray-500 dark:text-gray-400">subjects</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Classes:</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              {classes.length}
            </span>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Showing:</span>
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {filteredSubjects.length}
              </span>
              <span className="text-gray-500 dark:text-gray-400">results</span>
            </div>
          )}
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
          <FiBookOpen className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {hasActiveFilters
              ? 'No subjects match your filters'
              : 'No subjects found'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {hasActiveFilters
              ? 'Try changing your filter or search query'
              : 'Get started by adding your first subject'}
          </p>
          <div className="flex justify-center gap-3">
            {hasActiveFilters && (
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
            <Button variant="primary" icon={FiPlus} onClick={handleAddSubject}>
              Add Subject
            </Button>
          </div>
        </div>
      ) : selectedClass ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-gradient-to-b from-primary-500 to-primary-700"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {classes.find((c) => c._id === selectedClass)?.name ||
                    'Selected Class'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {filteredSubjects.length}{' '}
                  {filteredSubjects.length === 1 ? 'subject' : 'subjects'}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredSubjects.map((subject) => (
                <SubjectCard
                  key={`${subject._id}-${selectedClass}`}
                  subject={subject}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSubjects).map(
            ([classId, { classData, subjects: classSubjects }]) => (
              <motion.div
                key={classId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ClassSectionHeader
                  classData={classData}
                  count={classSubjects.length}
                  isUnassigned={classId === 'unassigned'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {classSubjects.map((subject) => (
                      <SubjectCard
                        key={`${subject._id}-${classId}`}
                        subject={subject}
                        showClassBadge={false}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter subject name"
            required
            icon={FiBookOpen}
            error={errors.name}
          />

          <Input
            label="Subject Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="Enter subject code (e.g., MATH-9)"
            required
            error={errors.code}
          />

          <Select
            label="Assign to Class"
            name="class"
            value={formData.classes?.[0] || ''}
            onChange={handleClassChange}
            options={[
              { value: '', label: 'Select Class (optional)' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
          />

          <Select
            label="Assign Teacher"
            name="teacher"
            value={formData.teachers?.[0] || ''}
            onChange={handleTeacherChange}
            options={[
              { value: '', label: 'Select Teacher (optional)' },
              ...teachers.map((t) => ({
                value: t._id,
                label: t.user?.name || t.teacherId,
              })),
            ]}
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Subject Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'core', label: 'Core' },
                { value: 'elective', label: 'Elective' },
                { value: 'lab', label: 'Lab' },
                { value: 'practical', label: 'Practical' },
                { value: 'theory', label: 'Theory' },
              ]}
            />

            <Input
              label="Credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleChange}
              placeholder="Enter credits"
              min={1}
              max={6}
            />
          </div>

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
              {editingSubject ? 'Update Subject' : 'Add Subject'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subjects;