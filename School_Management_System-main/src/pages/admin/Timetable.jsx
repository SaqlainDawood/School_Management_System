import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiBook,
  FiUser,
  FiMapPin,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../utils/api';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    class: '',
    section: '',
    day: 'monday',
    academicYear: '',
    semester: 'annual',
    periods: [],
  });
  const [periodForm, setPeriodForm] = useState({
    periodNumber: 1,
    startTime: '08:00',
    endTime: '08:45',
    subject: '',
    teacher: '',
    room: '',
  });
  const [editingPeriodIndex, setEditingPeriodIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const periodTimes = [
    { number: 1, start: '08:00', end: '08:45' },
    { number: 2, start: '08:45', end: '09:30' },
    { number: 3, start: '09:30', end: '10:15' },
    { number: 4, start: '10:30', end: '11:15' },
    { number: 5, start: '11:15', end: '12:00' },
    { number: 6, start: '12:00', end: '12:45' },
    { number: 7, start: '13:30', end: '14:15' },
    { number: 8, start: '14:15', end: '15:00' },
  ];

  useEffect(() => {
    fetchTimetables();
    fetchClasses();
    fetchTeachers();
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchTimetables();
  }, [selectedClass]);

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedClass) params.classId = selectedClass;
      const response = await api.get('/api/timetable', { params });
      setTimetables(response.data.timetables || []);
    } catch (err) {
      console.error('Error fetching timetables:', err);
      toast.error('Failed to fetch timetables');
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

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.subjects || []);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const getSubjectName = (subjectData) => {
    if (!subjectData) return 'Not Assigned';
    if (typeof subjectData === 'object' && subjectData.name)
      return subjectData.name;
    if (typeof subjectData === 'string') {
      const subject = subjects.find((s) => s._id === subjectData);
      return subject?.name || 'Unknown';
    }
    return 'Unknown';
  };

  const getTeacherName = (teacherData) => {
    if (!teacherData) return 'Not Assigned';
    if (typeof teacherData === 'object' && teacherData.user?.name)
      return teacherData.user.name;
    if (typeof teacherData === 'object' && teacherData.name)
      return teacherData.name;
    if (typeof teacherData === 'string') {
      const teacher = teachers.find((t) => t._id === teacherData);
      return teacher?.user?.name || 'Unknown';
    }
    return 'Unknown';
  };

  const handleAddTimetable = () => {
    setEditingTimetable(null);
    setFormData({
      class: selectedClass || '',
      section: '',
      day: 'monday',
      academicYear: '2026-2027',
      semester: 'annual',
      periods: [],
    });
    setPeriodForm({
      periodNumber: 1,
      startTime: '08:00',
      endTime: '08:45',
      subject: '',
      teacher: '',
      room: '',
    });
    setEditingPeriodIndex(null);
    setErrors({});
    setShowModal(true);
  };

  const handleEditTimetable = (timetable) => {
    setEditingTimetable(timetable);
    setFormData({
      class: timetable.class?._id || '',
      section: timetable.section?._id || '',
      day: timetable.day || 'monday',
      academicYear: timetable.academicYear || '',
      semester: timetable.semester || 'annual',
      periods: timetable.periods || [],
    });
    setPeriodForm({
      periodNumber: 1,
      startTime: '08:00',
      endTime: '08:45',
      subject: '',
      teacher: '',
      room: '',
    });
    setEditingPeriodIndex(null);
    setErrors({});
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePeriodChange = (e) => {
    setPeriodForm({ ...periodForm, [e.target.name]: e.target.value });
  };

  const addPeriod = () => {
    if (!periodForm.subject) {
      toast.error('Please select a subject');
      return;
    }
    if (!periodForm.teacher) {
      toast.error('Please select an instructor');
      return;
    }

    const existingPeriod = formData.periods.find(
      (p) => p.periodNumber === parseInt(periodForm.periodNumber)
    );
    if (existingPeriod) {
      toast.error(
        `Period ${periodForm.periodNumber} is already scheduled on this day.`
      );
      return;
    }

    const newPeriod = {
      periodNumber: parseInt(periodForm.periodNumber),
      startTime: periodForm.startTime,
      endTime: periodForm.endTime,
      subject: periodForm.subject,
      teacher: periodForm.teacher,
      room: periodForm.room || '',
    };

    setFormData({
      ...formData,
      periods: [...formData.periods, newPeriod].sort(
        (a, b) => a.periodNumber - b.periodNumber
      ),
    });

    const nextPeriodNumber = formData.periods.length + 2;
    const nextTime =
      periodTimes.find((p) => p.number === nextPeriodNumber) || periodTimes[0];
    setPeriodForm({
      periodNumber: nextPeriodNumber,
      startTime: nextTime.start,
      endTime: nextTime.end,
      subject: '',
      teacher: '',
      room: '',
    });
    setEditingPeriodIndex(null);
    toast.success('Period added to schedule');
  };

  const removePeriod = (index) => {
    const updatedPeriods = formData.periods.filter((_, i) => i !== index);
    setFormData({ ...formData, periods: updatedPeriods });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.class) {
      setErrors({ class: 'Please select a class' });
      return;
    }
    if (formData.periods.length === 0) {
      setErrors({ periods: 'At least one period is required' });
      return;
    }

    setFormLoading(true);
    try {
      const submitData = {
        class: formData.class,
        section: formData.section || undefined,
        day: formData.day,
        academicYear: formData.academicYear,
        semester: formData.semester,
        periods: formData.periods,
      };

      if (editingTimetable) {
        await api.put(`/api/timetable/${editingTimetable._id}`, submitData);
        toast.success('Timetable updated successfully');
      } else {
        await api.post('/api/timetable', submitData);
        toast.success('Timetable registered successfully');
      }
      setShowModal(false);
      fetchTimetables();
    } catch (err) {
      console.error('Error saving timetable:', err);
      toast.error(err.response?.data?.message || 'Failed to save timetable');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/timetable/${deleteTargetId}`);
      toast.success('Timetable schedule deleted');
      setDeleteTargetId(null);
      fetchTimetables();
    } catch (err) {
      console.error('Error deleting timetable:', err);
      toast.error('Failed to delete timetable');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getDayLabel = (day) =>
    day ? day.charAt(0).toUpperCase() + day.slice(1) : '';

  if (loading && timetables.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Timetables & Schedules"
        subtitle="Orchestrate daily lecture periods, room assignments, and faculty rotation"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Timetable' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddTimetable}>
            Create Schedule
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
          {selectedClass && (
            <button
              onClick={() => setSelectedClass('')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Show all classes
            </button>
          )}
        </div>

        {/* Timetables Container */}
        {timetables.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiCalendar}
              title="No timetable schedules found"
              description="No weekly class periods configured for the selected cohort."
              actionLabel="Create Schedule"
              onAction={handleAddTimetable}
            />
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6">
            {timetables.map((timetable) => (
              <div
                key={timetable._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shadow-sm">
                      <FiCalendar />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {timetable.class?.name || 'Class'} — {getDayLabel(timetable.day)}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Academic Term: {timetable.academicYear || 'Current'} ({timetable.periods?.length || 0} Periods)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditTimetable(timetable)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Schedule"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(timetable._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                      title="Delete Schedule"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {timetable.periods.map((period) => (
                    <div
                      key={period.periodNumber}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#162033] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                          Period {period.periodNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {period.startTime} – {period.endTime}
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate pt-1">
                        {getSubjectName(period.subject)}
                      </h5>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span className="truncate flex items-center gap-1">
                          <FiUser className="text-[10px]" />
                          {getTeacherName(period.teacher)}
                        </span>
                        {period.room && (
                          <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">
                            {period.room}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Timetable Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTimetable ? 'Update Timetable Roster' : 'Compose Class Timetable'}
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
              label="Day of Week"
              name="day"
              value={formData.day}
              onChange={handleChange}
              options={[
                { value: 'monday', label: 'Monday' },
                { value: 'tuesday', label: 'Tuesday' },
                { value: 'wednesday', label: 'Wednesday' },
                { value: 'thursday', label: 'Thursday' },
                { value: 'friday', label: 'Friday' },
                { value: 'saturday', label: 'Saturday' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g. 2026-2027"
              required
            />
            <Select
              label="Academic Term"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              options={[
                { value: 'annual', label: 'Annual Term' },
                { value: 'semester1', label: 'Semester 1' },
                { value: 'semester2', label: 'Semester 2' },
              ]}
            />
          </div>

          {/* Periods Management Builder */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Period Allocation Builder
              </h4>
              <span className="text-xs text-indigo-600 font-semibold">
                {formData.periods.length} Scheduled
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                <div>
                  <label className="label">Slot #</label>
                  <select
                    name="periodNumber"
                    value={periodForm.periodNumber}
                    onChange={handlePeriodChange}
                    className="select-field text-xs py-1.5 w-full"
                    disabled={editingPeriodIndex !== null}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        P{num}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Start</label>
                  <input
                    type="time"
                    name="startTime"
                    value={periodForm.startTime}
                    onChange={handlePeriodChange}
                    className="input-field text-xs py-1.5 w-full"
                  />
                </div>
                <div>
                  <label className="label">End</label>
                  <input
                    type="time"
                    name="endTime"
                    value={periodForm.endTime}
                    onChange={handlePeriodChange}
                    className="input-field text-xs py-1.5 w-full"
                  />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <select
                    name="subject"
                    value={periodForm.subject}
                    onChange={handlePeriodChange}
                    className="select-field text-xs py-1.5 w-full"
                  >
                    <option value="">Select...</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Faculty</label>
                  <select
                    name="teacher"
                    value={periodForm.teacher}
                    onChange={handlePeriodChange}
                    className="select-field text-xs py-1.5 w-full"
                  >
                    <option value="">Select...</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.user?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Room / Hall</label>
                  <input
                    type="text"
                    name="room"
                    value={periodForm.room}
                    onChange={handlePeriodChange}
                    placeholder="e.g. 104"
                    className="input-field text-xs py-1.5 w-full"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  onClick={addPeriod}
                  size="sm"
                >
                  + Add Period Slot
                </Button>
              </div>
            </div>

            {formData.periods.length > 0 && (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Period</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Subject</th>
                      <th className="px-3 py-2 text-left">Instructor</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {formData.periods.map((period, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-bold text-indigo-600">
                          P{period.periodNumber}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-500">
                          {period.startTime} - {period.endTime}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {getSubjectName(period.subject)}
                        </td>
                        <td className="px-3 py-2 text-slate-500">
                          {getTeacherName(period.teacher)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removePeriod(index)}
                            className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {errors.periods && (
              <p className="text-xs text-rose-500">{errors.periods}</p>
            )}
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
              {editingTimetable ? 'Save Schedule Changes' : 'Confirm Timetable'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Timetable Day Schedule"
        message="Are you sure you want to delete this class daily timetable? Students and teachers will no longer see this schedule."
        confirmText="Delete Schedule"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Timetable;
