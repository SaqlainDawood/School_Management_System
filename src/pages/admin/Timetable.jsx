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
  FiLayers,
  FiCheckCircle,
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
      const response = await api.get('/api/teachers');
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

  const getSubjectName = (subjectId) => {
    if (!subjectId) return 'Unassigned';
    if (typeof subjectId === 'object' && subjectId.name) return subjectId.name;
    const found = subjects.find((s) => s._id === subjectId);
    return found ? found.name : 'Lecture Session';
  };

  const getTeacherName = (teacherId) => {
    if (!teacherId) return 'Unassigned Faculty';
    if (typeof teacherId === 'object') {
      return teacherId.user?.name || teacherId.name || 'Faculty Member';
    }
    const found = teachers.find((t) => t._id === teacherId);
    return found ? found.user?.name || found.name || 'Faculty Member' : 'Faculty Member';
  };

  const handleAddTimetable = () => {
    setEditingTimetable(null);
    setFormData({
      class: selectedClass || (classes[0]?._id || ''),
      section: '',
      day: 'monday',
      academicYear: new Date().getFullYear().toString(),
      semester: 'annual',
      periods: [],
    });
    setPeriodForm({
      periodNumber: 1,
      startTime: periodTimes[0].start,
      endTime: periodTimes[0].end,
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
      class: timetable.class?._id || timetable.class || '',
      section: timetable.section || '',
      day: timetable.day || 'monday',
      academicYear: timetable.academicYear || '',
      semester: timetable.semester || 'annual',
      periods: timetable.periods || [],
    });
    const nextPeriodNum = (timetable.periods?.length || 0) + 1;
    const nextTime = periodTimes.find((p) => p.number === nextPeriodNum) || periodTimes[0];
    setPeriodForm({
      periodNumber: nextPeriodNum,
      startTime: nextTime.start,
      endTime: nextTime.end,
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
    const { name, value } = e.target;
    if (name === 'periodNumber') {
      const num = parseInt(value);
      const timeSlot = periodTimes.find((p) => p.number === num);
      setPeriodForm({
        ...periodForm,
        periodNumber: num,
        startTime: timeSlot ? timeSlot.start : periodForm.startTime,
        endTime: timeSlot ? timeSlot.end : periodForm.endTime,
      });
    } else {
      setPeriodForm({ ...periodForm, [name]: value });
    }
  };

  const addPeriod = () => {
    if (!periodForm.subject) {
      toast.error('Please select a subject for this period');
      return;
    }

    const newPeriod = {
      periodNumber: parseInt(periodForm.periodNumber),
      startTime: periodForm.startTime,
      endTime: periodForm.endTime,
      subject: periodForm.subject,
      teacher: periodForm.teacher || undefined,
      room: periodForm.room || undefined,
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

  // Compute live operational summary metrics from loaded timetables
  const totalPeriodsCount = timetables.reduce((acc, t) => acc + (t.periods?.length || 0), 0);
  const uniqueClassesCount = new Set(timetables.map((t) => t.class?._id || t.class)).size;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
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

      {/* ── Operational Metric Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0 border border-indigo-100 dark:border-indigo-900/40">
            <FiCalendar />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Day Schedules
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {timetables.length}
            </p>
          </div>
        </div>

        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0 border border-purple-100 dark:border-purple-900/40">
            <FiClock />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Lecture Periods
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalPeriodsCount}
            </p>
          </div>
        </div>

        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0 border border-emerald-100 dark:border-emerald-900/40">
            <FiLayers />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Classes Scheduled
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {uniqueClassesCount}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Schedule Workspace ── */}
      <div className="card overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] shadow-sm">
        {/* Class Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm shrink-0">
              <FiFilter />
            </div>
            <div className="w-64">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="select-field text-xs py-2 w-full"
                aria-label="Filter schedule by academic class"
              >
                <option value="">All Academic Classes</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedClass && (
            <button
              onClick={() => setSelectedClass('')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold self-start sm:self-auto"
            >
              Reset to view all class schedules
            </button>
          )}
        </div>

        {/* Timetables Container */}
        {timetables.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={FiCalendar}
              title="No timetable schedules configured"
              description="No weekly class periods have been set up yet for the selected cohort."
              actionLabel="Create Schedule"
              onAction={handleAddTimetable}
            />
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-6">
            {timetables.map((timetable) => (
              <div
                key={timetable._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a263e] overflow-hidden shadow-xs"
              >
                {/* Schedule Day Header */}
                <div className="px-5 py-4 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                      <FiCalendar />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {timetable.class?.name || 'Class'} — {getDayLabel(timetable.day)}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                          {timetable.periods?.length || 0} Periods
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Academic Term: <strong className="text-slate-700 dark:text-slate-300">{timetable.academicYear || 'Current Year'}</strong> • {timetable.semester?.toUpperCase() || 'ANNUAL'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleEditTimetable(timetable)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-xs"
                      title="Edit Schedule"
                    >
                      <FiEdit2 className="text-xs text-indigo-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(timetable._id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-900/50 transition-colors shadow-xs"
                      title="Delete Schedule"
                    >
                      <FiTrash2 className="text-xs" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* ── Full-Width Structured Period Directory ── */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                      <tr>
                        <th className="px-5 py-3 w-32">Slot / Period</th>
                        <th className="px-5 py-3 w-48">Time Range</th>
                        <th className="px-5 py-3">Subject / Course</th>
                        <th className="px-5 py-3">Assigned Faculty</th>
                        <th className="px-5 py-3 w-36">Lecture Room</th>
                        <th className="px-5 py-3 w-28 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {timetable.periods && timetable.periods.length > 0 ? (
                        timetable.periods.map((period) => (
                          <tr
                            key={period.periodNumber}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Slot / Period */}
                            <td className="px-5 py-3.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                                <FiClock className="text-xs" /> Period {period.periodNumber}
                              </span>
                            </td>

                            {/* Timing */}
                            <td className="px-5 py-3.5">
                              <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {period.startTime} – {period.endTime}
                              </span>
                            </td>

                            {/* Subject */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                  <FiBook className="text-xs" />
                                </div>
                                <span className="font-bold text-slate-900 dark:text-white">
                                  {getSubjectName(period.subject)}
                                </span>
                              </div>
                            </td>

                            {/* Faculty */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                <FiUser className="text-slate-400 shrink-0" />
                                <span className="font-medium truncate max-w-[200px]">
                                  {getTeacherName(period.teacher)}
                                </span>
                              </div>
                            </td>

                            {/* Room */}
                            <td className="px-5 py-3.5">
                              {period.room ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                  <FiMapPin className="text-xs text-indigo-500" />
                                  {period.room}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs italic">
                                  Campus Hall
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="px-5 py-3.5 text-right">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <FiCheckCircle className="text-xs" /> Scheduled
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-6 text-center text-slate-400 italic">
                            No periods assigned to this day schedule.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add / Edit Timetable Modal ── */}
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

      {/* ── Confirm Deletion Modal ── */}
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
