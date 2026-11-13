import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiBook,
  FiAward,
  FiEdit2,
  FiSave,
  FiActivity,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2,
  FiUsers,
  FiHash,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate, formatDateTime } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { user, updateProfile } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    motherName: '',
    motherPhone: '',
  });
  const [errors, setErrors] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [missingFields, setMissingFields] = useState([]);

  const recentActivities = [
    { id: 1, icon: FiUser, action: 'Logged In', time: '2 hours ago', color: 'text-blue-500' },
    { id: 2, icon: FiEdit2, action: 'Profile Updated', time: '1 day ago', color: 'text-green-500' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (student) calculateProfileCompletion();
  }, [student]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/students/profile');
      const studentData = response.data.student;
      setStudent(studentData);
      setFormData({
        name: studentData.user?.name || '',
        email: studentData.user?.email || '',
        phone: studentData.user?.phone || '',
        address: studentData.user?.address || '',
        dateOfBirth: studentData.dateOfBirth
          ? studentData.dateOfBirth.split('T')[0]
          : '',
        fatherName: studentData.fatherName || '',
        fatherPhone: studentData.fatherPhone || '',
        fatherOccupation: studentData.fatherOccupation || '',
        motherName: studentData.motherName || '',
        motherPhone: studentData.motherPhone || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!student) return;

    const fields = {
      name: student.user?.name,
      email: student.user?.email,
      phone: student.user?.phone,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      studentId: student.studentId,
      rollNumber: student.rollNumber,
      class: student.class?.name,
      fatherName: student.fatherName,
      fatherPhone: student.fatherPhone,
      motherName: student.motherName,
    };

    const totalFields = Object.keys(fields).length;
    const filledFields = Object.values(fields).filter(
      (v) => v && v !== '' && v !== null && v !== undefined
    ).length;
    setProfileCompletion(Math.round((filledFields / totalFields) * 100));

    const missing = Object.entries(fields)
      .filter(
        ([_, value]) => !value || value === '' || value === null || value === undefined
      )
      .map(([key]) => key);
    setMissingFields(missing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      await api.put(`/api/students/${student._id}`, {
        dateOfBirth: formData.dateOfBirth,
        fatherName: formData.fatherName,
        fatherPhone: formData.fatherPhone,
        fatherOccupation: formData.fatherOccupation,
        motherName: formData.motherName,
        motherPhone: formData.motherPhone,
      });

      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      phone: student.user?.phone || '',
      address: student.user?.address || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      fatherName: student.fatherName || '',
      fatherPhone: student.fatherPhone || '',
      fatherOccupation: student.fatherOccupation || '',
      motherName: student.motherName || '',
      motherPhone: student.motherPhone || '',
    });
    setErrors({});
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Student Profile
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Student</span>
            <span>/</span>
            <span className="text-primary-600 dark:text-primary-400">Profile</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium flex items-center gap-1.5">
            <FiCheckCircle className="text-xs" /> Active
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last Updated: {formatDateTime(new Date())}
          </span>
        </div>
      </div>

      {/* Profile Hero */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 rounded-2xl opacity-90"></div>
        <div className="relative p-6 md:p-8 text-white flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-6xl font-bold">
              {student?.user?.name?.charAt(0) || 'S'}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold">
              {student?.user?.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-1.5">
                <FiHash className="text-xs" /> {student?.studentId}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm flex items-center gap-1.5">
                <FiBook className="text-xs" /> {student?.class?.name || 'No Class'}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                Section {student?.section || 'A'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-white/80">
              <span>Roll: {student?.rollNumber}</span>
              <span>GPA: 3.8</span>
              <span>Session: 2026-2027</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg text-white flex items-center gap-2 transition-all"
            >
              <FiEdit2 /> {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-2xl font-bold">92%</p>
          <p className="text-xs opacity-80">Attendance</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-2xl font-bold">3.8</p>
          <p className="text-xs opacity-80">GPA</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-2xl font-bold">8</p>
          <p className="text-xs opacity-80">Subjects</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-2xl font-bold">✓</p>
          <p className="text-xs opacity-80">Fee Status</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs opacity-80">Assignments</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
          <p className="text-2xl font-bold">5</p>
          <p className="text-xs opacity-80">Notifications</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiUser className="text-blue-600" />
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  Personal Information
                </h3>
              </div>
              {editMode && (
                <span className="text-xs text-blue-600">Editing enabled</span>
              )}
            </div>
            <div className="p-6">
              {editMode ? (
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    icon={FiUser}
                    disabled
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    icon={FiMail}
                    disabled
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    icon={FiPhone}
                    error={errors.phone}
                    required
                  />
                  <Input
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    icon={FiCalendar}
                    error={errors.dateOfBirth}
                    required
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={FiMapPin}
                  />

                  {/* Parent Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="col-span-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Parent Information
                      </h4>
                    </div>
                    <Input
                      label="Father Name"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      placeholder="Enter father's name"
                    />
                    <Input
                      label="Father Phone"
                      name="fatherPhone"
                      value={formData.fatherPhone}
                      onChange={handleChange}
                      icon={FiPhone}
                      placeholder="Enter father's phone"
                    />
                    <Input
                      label="Father Occupation"
                      name="fatherOccupation"
                      value={formData.fatherOccupation}
                      onChange={handleChange}
                      placeholder="Enter occupation"
                    />
                    <Input
                      label="Mother Name"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="Enter mother's name"
                    />
                    <Input
                      label="Mother Phone"
                      name="motherPhone"
                      value={formData.motherPhone}
                      onChange={handleChange}
                      icon={FiPhone}
                      placeholder="Enter mother's phone"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      loading={saving}
                      icon={FiSave}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.user?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Father Name
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.fatherName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Mother Name
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.motherName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Gender
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white capitalize">
                      {student?.gender || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Date of Birth
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {formatDate(student?.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.user?.phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.user?.email || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Address
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.user?.address
                        ? typeof student.user.address === 'string'
                          ? student.user.address
                          : `${student.user.address.street || ''} ${
                              student.user.address.city || ''
                            } ${student.user.address.state || ''}`.trim()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Father Phone
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.fatherPhone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Father Occupation
                    </p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {student?.fatherOccupation || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <FiBook className="text-purple-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Academic Information
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Student ID
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.studentId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Roll Number
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.rollNumber || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Class
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.class?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Section
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.section || 'A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Admission Date
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {formatDate(student?.enrollmentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Academic Session
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    2026-2027
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <FiActivity className="text-green-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <div
                      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}
                    >
                      <activity.icon className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <FiBarChart2 className="text-cyan-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Profile Completion
              </h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
              {missingFields.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                    <FiAlertCircle /> Missing Information
                  </p>
                  <ul className="mt-2 space-y-1">
                    {missingFields.slice(0, 3).map((field, index) => (
                      <li
                        key={index}
                        className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-2"
                      >
                        <FiX className="text-xs" />{' '}
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <FiUsers className="text-amber-600" />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Parent Information
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Father Name
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.fatherName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Father Occupation
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.fatherOccupation || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Father Phone
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.fatherPhone || 'N/A'}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mother Name
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.motherName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mother Phone
                  </p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {student?.motherPhone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;