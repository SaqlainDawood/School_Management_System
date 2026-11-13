import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
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
    } catch (error) {
      console.error('Error fetching timetables:', error);
      toast.error('Failed to fetch timetables');
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

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
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
      toast.error('Please select a teacher');
      return;
    }

    const existingPeriod = formData.periods.find(
      (p) => p.periodNumber === parseInt(periodForm.periodNumber)
    );
    if (existingPeriod) {
      toast.error(
        `Period ${periodForm.periodNumber} already exists. Please edit it instead.`
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
    toast.success('Period added successfully');
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
        toast.success('Timetable created successfully');
      }
      setShowModal(false);
      fetchTimetables();
    } catch (error) {
      console.error('Error saving timetable:', error);
      toast.error(error.response?.data?.message || 'Failed to save timetable');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timetable?')) {
      try {
        await api.delete(`/api/timetable/${id}`);
        toast.success('Timetable deleted successfully');
        fetchTimetables();
      } catch (error) {
        console.error('Error deleting timetable:', error);
        toast.error('Failed to delete timetable');
      }
    }
  };

  const getDayLabel = (day) =>
    day.charAt(0).toUpperCase() + day.slice(1);

  if (loading && timetables.length === 0) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Timetable Management"
        subtitle="Manage class schedules"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddTimetable}>
            Generate Timetable
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
            className="w-64"
            label="Filter by Class"
          />
        </div>

        <div className="overflow-x-auto">
          {timetables.length === 0 ? (
            <div className="text-center py-12">
              <FiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No timetables found
              </p>
            </div>
          ) : (
            <div className="space-y-6 p-4">
              {timetables.map((timetable) => (
                <div
                  key={timetable._id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {timetable.class?.name} - {getDayLabel(timetable.day)}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {timetable.academicYear}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTimetable(timetable)}
                        className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-yellow-600"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(timetable._id)}
                        className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-red-600"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 dark:bg-gray-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Period</th>
                          <th className="px-3 py-2 text-left">Time</th>
                          <th className="px-3 py-2 text-left">Subject</th>
                          <th className="px-3 py-2 text-left">Teacher</th>
                          <th className="px-3 py-2 text-left">Room</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {timetable.periods.map((period) => (
                          <tr key={period.periodNumber}>
                            <td className="px-3 py-2 font-medium">
                              P{period.periodNumber}
                            </td>
                            <td className="px-3 py-2">
                              {period.startTime} - {period.endTime}
                            </td>
                            <td className="px-3 py-2">
                              {getSubjectName(period.subject)}
                            </td>
                            <td className="px-3 py-2">
                              {getTeacherName(period.teacher)}
                            </td>
                            <td className="px-3 py-2">
                              {period.room || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTimetable ? 'Edit Timetable' : 'Generate Timetable'}
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
              label="Day"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Academic Year"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="e.g., 2026-2027"
              required
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

          {/* Periods Management */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-white">
                Periods
              </h4>
              <span className="text-sm text-gray-500">
                {formData.periods.length} / 8 periods
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period #
                  </label>
                  <select
                    name="periodNumber"
                    value={periodForm.periodNumber}
                    onChange={handlePeriodChange}
                    className="input-field text-sm"
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
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={periodForm.startTime}
                    onChange={handlePeriodChange}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={periodForm.endTime}
                    onChange={handlePeriodChange}
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={periodForm.subject}
                    onChange={handlePeriodChange}
                    className="input-field text-sm"
                  >
                    <option value="">Select</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teacher
                  </label>
                  <select
                    name="teacher"
                    value={periodForm.teacher}
                    onChange={handlePeriodChange}
                    className="input-field text-sm"
                  >
                    <option value="">Select</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.user?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={periodForm.room}
                    onChange={handlePeriodChange}
                    placeholder="Room"
                    className="input-field text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  onClick={addPeriod}
                  className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  + Add Period
                </button>
              </div>
            </div>

            {formData.periods.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Time</th>
                      <th className="px-3 py-2 text-left">Subject</th>
                      <th className="px-3 py-2 text-left">Teacher</th>
                      <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {formData.periods.map((period, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 font-medium">
                          P{period.periodNumber}
                        </td>
                        <td className="px-3 py-2">
                          {period.startTime} - {period.endTime}
                        </td>
                        <td className="px-3 py-2">
                          {getSubjectName(period.subject)}
                        </td>
                        <td className="px-3 py-2">
                          {getTeacherName(period.teacher)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removePeriod(index)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-red-600"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {errors.periods && (
              <p className="text-sm text-red-500 mt-2">{errors.periods}</p>
            )}
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
              {editingTimetable ? 'Update Timetable' : 'Generate Timetable'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;