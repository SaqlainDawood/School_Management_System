import React, { useState, useEffect } from 'react';
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
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiHash,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/students/profile');
      const studentData = response.data?.student;
      if (studentData) {
        setStudent(studentData);
        setFormData({
          name: studentData.user?.name || '',
          email: studentData.user?.email || '',
          phone: studentData.user?.phone || '',
          address: typeof studentData.user?.address === 'string'
            ? studentData.user?.address
            : studentData.user?.address?.street || '',
          dateOfBirth: studentData.dateOfBirth
            ? studentData.dateOfBirth.split('T')[0]
            : '',
          fatherName: studentData.fatherName || '',
          fatherPhone: studentData.fatherPhone || '',
          fatherOccupation: studentData.fatherOccupation || '',
          motherName: studentData.motherName || '',
          motherPhone: studentData.motherPhone || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please complete required fields before saving');
      return;
    }

    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        });
      }

      if (student?._id) {
        await api.put(`/api/students/${student._id}`, {
          dateOfBirth: formData.dateOfBirth,
          fatherName: formData.fatherName,
          fatherPhone: formData.fatherPhone,
          fatherOccupation: formData.fatherOccupation,
          motherName: formData.motherName,
          motherPhone: formData.motherPhone,
        });
      }

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
    if (student) {
      setFormData({
        name: student.user?.name || '',
        email: student.user?.email || '',
        phone: student.user?.phone || '',
        address: typeof student.user?.address === 'string'
          ? student.user?.address
          : student.user?.address?.street || '',
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        fatherName: student.fatherName || '',
        fatherPhone: student.fatherPhone || '',
        fatherOccupation: student.fatherOccupation || '',
        motherName: student.motherName || '',
        motherPhone: student.motherPhone || '',
      });
    }
    setErrors({});
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Profile"
        subtitle="View and manage your academic and guardian details"
        breadcrumbs={[
          { label: 'Student', href: '/student/dashboard' },
          { label: 'Profile' },
        ]}
        actions={
          <Button
            variant={editMode ? 'secondary' : 'primary'}
            icon={editMode ? FiX : FiEdit2}
            onClick={() => {
              if (editMode) handleCancel();
              else setEditMode(true);
            }}
          >
            {editMode ? 'Cancel Edit' : 'Edit Information'}
          </Button>
        }
      />

      {/* Hero Header Card */}
      <div className="card p-6 md:p-8 bg-gradient-to-r from-navy-950 via-navy-900 to-indigo-950 text-white rounded-2xl border border-navy-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-primary-600/30 border-2 border-primary-500/40 flex items-center justify-center text-4xl font-bold text-primary-300 shadow-inner">
            {student?.user?.name?.charAt(0) || 'S'}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                {student?.user?.name || user?.name}
              </h2>
              <StatusBadge status="active" label="Enrolled Student" className="self-center md:self-auto" />
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10">
                <FiHash className="text-xs text-primary-400" />
                <span>ID: {student?.studentId || '—'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10">
                <FiBook className="text-xs text-primary-400" />
                <span>Class: {student?.class?.name || 'Assigned'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10">
                <span>Roll: {student?.rollNumber || '—'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10">
                <span>Section: {student?.section || 'A'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Academic Data */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Personal Information"
            subtitle="Contact and basic demographic details"
          >
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
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={FiMail}
                  disabled
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                <Input
                  label="Residential Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  icon={FiMapPin}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Full Name</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.user?.name || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Email</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.user?.email || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Phone</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.user?.phone || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.dateOfBirth ? formatDate(student.dateOfBirth) : '—'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Address</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {typeof student?.user?.address === 'string'
                      ? student?.user?.address
                      : student?.user?.address?.street || 'Not specified'}
                  </p>
                </div>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Guardian / Parent Information"
            subtitle="Emergency contact and family details"
          >
            {editMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Father's Name"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Father's Phone"
                    name="fatherPhone"
                    type="tel"
                    value={formData.fatherPhone}
                    onChange={handleChange}
                  />
                  <Input
                    label="Occupation"
                    name="fatherOccupation"
                    value={formData.fatherOccupation}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Mother's Name"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Mother's Phone"
                    name="motherPhone"
                    type="tel"
                    value={formData.motherPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    icon={FiSave}
                    loading={saving}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Father's Name</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.fatherName || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Father's Phone</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.fatherPhone || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Occupation</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.fatherOccupation || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Mother's Name</span>
                  <p className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                    {student?.motherName || '—'}
                  </p>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column: Academic Summary */}
        <div className="space-y-6">
          <SectionCard title="Academic Summary" subtitle="Registration details">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Student ID</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {student?.studentId || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Class</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {student?.class?.name || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Roll Number</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {student?.rollNumber || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Section</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {student?.section || 'A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Enrollment Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {student?.enrollmentDate ? formatDate(student.enrollmentDate) : '—'}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
