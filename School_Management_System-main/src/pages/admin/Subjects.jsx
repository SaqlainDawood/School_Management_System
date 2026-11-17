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

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    } catch (err) {
      console.error('Error fetching subjects:', err);
      toast.error('Failed to fetch subjects');
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
    } catch (err) {
      console.error('Error saving subject:', err);
      toast.error(err.response?.data?.message || 'Failed to save subject');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/subjects/${deleteTargetId}`);
      toast.success('Subject deleted successfully');
      setDeleteTargetId(null);
      fetchSubjects();
    } catch (err) {
      console.error('Error deleting subject:', err);
      toast.error('Failed to delete subject');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getTypeVariant = (type) => {
    switch (type) {
      case 'core': return 'primary';
      case 'elective': return 'info';
      case 'lab': return 'warning';
      case 'practical': return 'success';
      default: return 'neutral';
    }
  };

  const SubjectTable = ({ subjectList, showClassCol = true }) => (
    <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-3.5">Subject & Code</th>
              <th className="px-6 py-3.5">Classification</th>
              <th className="px-6 py-3.5 text-center">Credits</th>
              {showClassCol && <th className="px-6 py-3.5">Assigned Classes</th>}
              <th className="px-6 py-3.5">Faculty Lead</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {subjectList.map((subject) => {
              const facultyNames = subject.teachers?.map((t) => t.user?.name || t.name).filter(Boolean);
              const classNames = subject.classes?.map((c) => c.name).filter(Boolean);

              return (
                <tr
                  key={subject._id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Subject & Code */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-100 dark:border-indigo-900/50 flex-shrink-0">
                        <FiBookOpen />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {subject.name}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          Code: {subject.code}
                        </div>
                        {subject.description && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                            {subject.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Classification */}
                  <td className="px-6 py-4">
                    <StatusBadge variant={getTypeVariant(subject.type)}>
                      {subject.type}
                    </StatusBadge>
                  </td>

                  {/* Credits */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {subject.credits} Credits
                    </span>
                  </td>

                  {/* Assigned Classes */}
                  {showClassCol && (
                    <td className="px-6 py-4">
                      {classNames && classNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {classNames.map((cName, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50"
                            >
                              <FiLayers className="text-[10px]" />
                              {cName}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No class assigned</span>
                      )}
                    </td>
                  )}

                  {/* Faculty Lead */}
                  <td className="px-6 py-4">
                    {facultyNames && facultyNames.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        <FiUser className="text-indigo-500 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{facultyNames.join(', ')}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No faculty assigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEditSubject(subject)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Subject"
                      >
                        <FiEdit2 className="text-base" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(subject._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Subject"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ClassSectionHeader = ({ classData, count, isUnassigned }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-indigo-600"></div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {isUnassigned
              ? 'Unassigned Curriculum'
              : classData?.name || 'Class Cohort'}
          </h2>
          <p className="text-[11px] text-slate-400">
            {count} {count === 1 ? 'subject' : 'subjects'} enrolled
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Curriculum & Subjects"
        subtitle="Manage academic courses, credit definitions, and instructional syllabus"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Subjects' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddSubject}>
            Create Subject
          </Button>
        }
      />

      <div className="card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="select-field text-xs pl-9 pr-9 py-2.5 w-full appearance-none cursor-pointer"
              >
                <option value="">All Academic Classes</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject by title, code, or overview..."
                className="input-field text-xs pl-9 pr-9 py-2.5 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              Clear Filters
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Total Subjects: <span className="font-semibold text-slate-900 dark:text-white">{subjects.length}</span>
          </div>
          <div>
            Classes: <span className="font-semibold text-slate-900 dark:text-white">{classes.length}</span>
          </div>
          {hasActiveFilters && (
            <div>
              Matching Query: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filteredSubjects.length}</span>
            </div>
          )}
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="card p-12">
          <EmptyState
            icon={FiBookOpen}
            title={hasActiveFilters ? 'No curriculum matches filter' : 'No subjects registered'}
            description={hasActiveFilters ? 'Try adjusting your search criteria or class selector' : 'Create course offerings to populate the institutional curriculum.'}
            actionLabel={hasActiveFilters ? 'Reset Filters' : 'Add Subject'}
            onAction={hasActiveFilters ? handleClearFilters : handleAddSubject}
          />
        </div>
      ) : selectedClass ? (
        <div>
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {classes.find((c) => c._id === selectedClass)?.name || 'Class Cohort'}
            </h2>
            <p className="text-xs text-slate-400">
              {filteredSubjects.length} courses registered
            </p>
          </div>

          <SubjectTable subjectList={filteredSubjects} showClassCol={false} />
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSubjects).map(
            ([classId, { classData, subjects: classSubjects }]) => (
              <div key={classId}>
                <ClassSectionHeader
                  classData={classData}
                  count={classSubjects.length}
                  isUnassigned={classId === 'unassigned'}
                />

                <SubjectTable
                  subjectList={classSubjects}
                  showClassCol={classId === 'unassigned'}
                />
              </div>
            )
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSubject ? 'Edit Subject Offering' : 'Register New Subject'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Subject Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Advanced Mathematics"
            required
            icon={FiBookOpen}
            error={errors.name}
          />

          <Input
            label="Course Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="e.g. MATH-401"
            required
            error={errors.code}
          />

          <Select
            label="Class Cohort"
            name="class"
            value={formData.classes?.[0] || ''}
            onChange={handleClassChange}
            options={[
              { value: '', label: 'Select Cohort (optional)' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
          />

          <Select
            label="Instructor Lead"
            name="teacher"
            value={formData.teachers?.[0] || ''}
            onChange={handleTeacherChange}
            options={[
              { value: '', label: 'Select Instructor (optional)' },
              ...teachers.map((t) => ({
                value: t._id,
                label: t.user?.name || t.teacherId,
              })),
            ]}
          />

          <Input
            label="Course Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief syllabus outline..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subject Classification"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'core', label: 'Core Requirement' },
                { value: 'elective', label: 'Elective' },
                { value: 'lab', label: 'Laboratory' },
                { value: 'practical', label: 'Practical' },
                { value: 'theory', label: 'Theory' },
              ]}
            />

            <Input
              label="Credit Units"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleChange}
              min={1}
              max={6}
            />
          </div>

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
              {editingSubject ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? Curriculum associations and gradebooks referencing this course code may be affected."
        confirmText="Delete Subject"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Subjects;
