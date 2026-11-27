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
  FiLock,
  FiHome,
  FiCopy,
  FiChevronDown,
  FiBriefcase,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate, formatAddress } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import {
  HeroAcademicGraphic,
  CapScroll3DIcon,
  Mail3DIcon,
  Campus3DIcon,
  Shield3DIcon,
} from '../../components/common/Profile3DIcons';

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
          name: studentData.user?.name || user?.name || '',
          email: studentData.user?.email || user?.email || '',
          phone: studentData.user?.phone || user?.phone || '',
          address: formatAddress(studentData.user?.address || user?.address),
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
      console.error('Error fetching student profile:', error);
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

      toast.success('Student profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating student profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    if (student) {
      setFormData({
        name: student.user?.name || user?.name || '',
        email: student.user?.email || user?.email || '',
        phone: student.user?.phone || user?.phone || '',
        address: formatAddress(student.user?.address || user?.address),
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

  const handleCopyUID = () => {
    const uid = student?._id || user?._id || '6ae4203ff11e07ef107688a8c';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(uid);
      toast.success('Account UID copied to clipboard!');
    }
  };

  if (loading) return <Loader />;

  const initial = student?.user?.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'S';
  const studentName = student?.user?.name || user?.name || 'Muhammad Subhan';
  const studentEmail = student?.user?.email || user?.email || 'admin@school.com';
  const studentPhone = student?.user?.phone || user?.phone || '';
  const studentAddress = formatAddress(student?.user?.address || user?.address);
  const institutionName = user?.schoolName || student?.schoolName || (typeof user?.school === 'string' ? user.school : 'MNSUAM');
  const programName = student?.class?.name || (typeof student?.class === 'string' ? student.class : null) || 'BS Computer Science';
  const studentUID = student?._id || user?._id || '6ae4203ff11e07ef107688a8c';
  const displayUID = student?.studentId || (studentUID.length > 8 ? studentUID.slice(-6).toUpperCase() : studentUID.toUpperCase());
  const cityLocation = student?.user?.address?.city || 'Mian Channu';

  return (
    <div className="space-y-6">
      {/* ── Top Header Section (Matching Screenshot) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-lg shadow-sm">
            <FiUser />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              User Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage your personal information, institutional credentials, and account settings
            </p>
          </div>
        </div>

        {/* Institutional Pill on Top Right */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-[#162033] border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FiHome className="text-base" />
          </div>
          <div className="text-left leading-tight">
            <span className="block text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {institutionName}
            </span>
            <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
              Student Portal
            </span>
          </div>
          <FiChevronDown className="text-slate-400 text-sm ml-1" />
        </div>
      </div>

      {/* ── Main Hero Banner (Matching Screenshot) ── */}
      <section className="relative rounded-2xl bg-gradient-to-r from-[#030712] via-[#09152B] to-[#0E2856] text-white p-5 sm:p-7 border border-slate-800 shadow-lg overflow-hidden">
        {/* Subtle Ambient Backlights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Double-Ring Avatar with Online Indicator */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center text-3xl sm:text-4xl font-extrabold border-4 border-white/20 shadow-2xl">
                {initial}
              </div>
              <span
                className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"
                title="Online Status: Active"
              />
            </div>

            {/* Name, Verified Badge, Role, and Metadata */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {studentName}
                </h2>
                {/* Meta / Twitter style Verified Blue Badge */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-blue-400 fill-current shrink-0"
                  aria-label="Verified Student Profile"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z" />
                </svg>
              </div>

              {/* Role / Program Pill Badge */}
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/25 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm">
                  🎓 {programName}
                </span>
              </div>

              {/* Meta row with divider pipes */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  🏛 {institutionName}
                </span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center gap-1">
                  📍 {cityLocation}
                </span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-slate-400">
                  UID: {displayUID}
                </span>
              </div>
            </div>
          </div>

          {/* Right: 3D Graduation Cap Graphic & Edit Profile Button */}
          <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
            {/* 3D Mortarboard and Books Graphic */}
            <div className="hidden sm:block">
              <HeroAcademicGraphic className="w-36 h-28 lg:w-44 lg:h-32 drop-shadow-2xl" />
            </div>

            {/* Glassmorphic Edit Button */}
            <button
              onClick={() => {
                if (editMode) handleCancel();
                else setEditMode(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-400/30 backdrop-blur-md shadow-lg transition-all active:scale-95"
            >
              {editMode ? <FiX className="text-base" /> : <FiEdit2 className="text-base" />}
              <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Content View: Row-wise Cards OR Edit Form ── */}
      {editMode ? (
        <div className="card p-5 sm:p-7 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033]">
          <div className="pb-3.5 mb-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Student Information
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update residential contact details and guardian emergency records
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              Modifying Records
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                1. Personal & Contact Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={FiUser}
                  required
                />
                <Input
                  label="Registered Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  icon={FiMail}
                />
                <Input
                  label="Personal Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={FiPhone}
                  error={errors.phone}
                  placeholder="+1 (555) 000-0000"
                  required
                />
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  icon={FiCalendar}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Residential Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    icon={FiMapPin}
                    placeholder="Street Address, City, State, Postal Code"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                2. Guardian & Parent Records
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Father's Full Name"
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
                  label="Father's Occupation"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleChange}
                />
                <Input
                  label="Mother's Full Name"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Mother's Phone"
                    name="motherPhone"
                    type="tel"
                    value={formData.motherPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={FiSave}
                loading={saving}
                onClick={handleSave}
              >
                Save Student Changes
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Four 3D Cards Grid (2x2 Layout Matching Screenshot) ── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Card 1: Personal Information */}
          <div className="card p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
                  <FiUser className="text-base" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Primary identity and role credentials
                  </p>
                </div>
              </div>

              {/* Body: Left 3D Illustration + Right Data Table */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* 3D Illustration */}
                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                  <CapScroll3DIcon className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                </div>

                {/* Data Rows */}
                <dl className="flex-1 w-full space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Full Name
                    </dt>
                    <dd className="font-bold text-slate-900 dark:text-white text-right">
                      {studentName}
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Assigned Role
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        🎓 Student
                      </span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Account Email
                    </dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px] sm:max-w-[210px] flex items-center gap-1.5 justify-end">
                      <FiMail className="text-indigo-500 text-xs shrink-0" />
                      <span>{studentEmail}</span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Account Status
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Details */}
          <div className="card p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                  <FiPhone className="text-base" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Contact Details
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Direct communication channels
                  </p>
                </div>
              </div>

              {/* Body: Left 3D Illustration + Right Data Table */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* 3D Illustration */}
                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                  <Mail3DIcon className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                </div>

                {/* Data Rows */}
                <dl className="flex-1 w-full space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Email Address
                    </dt>
                    <dd className="font-semibold text-slate-900 dark:text-white text-right truncate max-w-[180px] sm:max-w-[210px] flex items-center gap-1.5 justify-end">
                      <FiMail className="text-blue-500 text-xs shrink-0" />
                      <span>{studentEmail}</span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Primary Phone
                    </dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-300 text-right flex items-center gap-1.5 justify-end">
                      <FiPhone className="text-blue-500 text-xs shrink-0" />
                      <span>{studentPhone || 'Not Configured'}</span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Physical Address
                    </dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px] sm:max-w-[210px] flex items-center gap-1.5 justify-end">
                      <FiMapPin className="text-blue-500 text-xs shrink-0" />
                      <span>{studentAddress || 'Not Configured'}</span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Contact Status
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                        Registered Contact
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Card 3: Institutional Details */}
          <div className="card p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50">
                  <FiHome className="text-base" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Institutional Details
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Institutional scope and assigned division
                  </p>
                </div>
              </div>

              {/* Body: Left 3D Illustration + Right Data Table */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* 3D Illustration */}
                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                  <Campus3DIcon className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                </div>

                {/* Data Rows */}
                <dl className="flex-1 w-full space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Assigned Portal
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                        ⭐ Student Portal
                      </span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      School Institution
                    </dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px] sm:max-w-[210px] flex items-center gap-1.5 justify-end">
                      <FiHome className="text-blue-500 text-xs shrink-0" />
                      <span>{institutionName}</span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Department / Division
                    </dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-300 text-right truncate max-w-[180px] sm:max-w-[210px] flex items-center gap-1.5 justify-end">
                      <FiBriefcase className="text-blue-500 text-xs shrink-0" />
                      <span>{programName}</span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Enrollment Date
                    </dt>
                    <dd className="font-medium text-slate-700 dark:text-slate-300 text-right">
                      {student?.enrollmentDate ? formatDate(student.enrollmentDate) : 'Current Session'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Card 4: Account Security */}
          <div className="card p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                  <FiLock className="text-base" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Account Security
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Authentication protocol and credentials status
                  </p>
                </div>
              </div>

              {/* Body: Left 3D Illustration + Right Data Table */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* 3D Illustration */}
                <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center">
                  <Shield3DIcon className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                </div>

                {/* Data Rows */}
                <dl className="flex-1 w-full space-y-2.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Account UID
                    </dt>
                    <dd className="font-mono text-xs text-slate-700 dark:text-slate-300 text-right flex items-center gap-1.5 justify-end">
                      <span className="truncate max-w-[140px] sm:max-w-[190px]">
                        {studentUID}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUID}
                        title="Copy Account UID"
                        className="p-1 hover:text-indigo-600 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      >
                        <FiCopy className="text-xs" />
                      </button>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Auth Mechanism
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        <FiCheckCircle className="text-indigo-500 text-xs shrink-0" />
                        JWT Bearer Auth
                      </span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Security Status
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                        SSL / TLS Protected
                      </span>
                    </dd>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <dt className="text-slate-500 dark:text-slate-400 font-medium">
                      Session Integrity
                    </dt>
                    <dd className="text-right">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                        <FiCheckCircle className="text-emerald-500 shrink-0 text-sm" />
                        Active & Verified
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
