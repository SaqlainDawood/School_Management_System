import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiHash,
  FiBook,
  FiUsers,
  FiUserCheck,
  FiCreditCard,
  FiBriefcase,
  FiHome,
} from 'react-icons/fi';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { GENDER_OPTIONS, STUDENT_STATUS } from '../../utils/constants';
import { formatAddress } from '../../utils/helpers';

const StudentForm = ({ initialData, onSubmit, onCancel, loading, classes = [] }) => {
  const [formData, setFormData] = useState({
    // Student Personal Info
    name: '',
    email: '',
    studentId: '',
    rollNumber: '',
    class: '',
    section: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    status: 'active',

    // Parent Fields
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    fatherCnic: '',
    motherName: '',
    motherPhone: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        studentId: initialData.studentId || '',
        rollNumber: initialData.rollNumber || '',
        class: initialData.class || '',
        section: initialData.section || '',
        dateOfBirth: initialData.dateOfBirth
          ? initialData.dateOfBirth.split('T')[0]
          : '',
        gender: initialData.gender || '',
        phone: initialData.phone || '',
        address: formatAddress(initialData.address || initialData.user?.address),
        status: initialData.status || 'active',
        fatherName: initialData.fatherName || '',
        fatherPhone: initialData.fatherPhone || '',
        fatherOccupation: initialData.fatherOccupation || '',
        fatherCnic: initialData.fatherCnic || '',
        motherName: initialData.motherName || '',
        motherPhone: initialData.motherPhone || '',
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    // Student Required Fields
    if (!formData.name?.trim()) newErrors.name = 'Student name is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (!formData.studentId?.trim()) newErrors.studentId = 'Student ID is required';
    if (!formData.rollNumber?.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    // Parent Required Fields
    if (!formData.fatherName?.trim()) newErrors.fatherName = 'Father name is required';
    if (!formData.fatherPhone?.trim()) newErrors.fatherPhone = 'Father phone is required';

    // Optional Field Validation
    if (
      formData.fatherCnic &&
      !/^\d{5}-\d{7}-\d{1}$/.test(formData.fatherCnic)
    ) {
      newErrors.fatherCnic = 'Invalid CNIC format. Use: 12345-6789012-3';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (
      formData.fatherPhone &&
      !/^\+?[\d\s-]{10,15}$/.test(formData.fatherPhone)
    ) {
      newErrors.fatherPhone = 'Invalid phone number';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isEditMode = !!initialData?.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 1. Student Personal Information */}
      <div className="rounded-xl p-4 bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 pb-2.5 mb-3.5 border-b border-slate-200 dark:border-slate-800">
          <FiUser className="text-indigo-600 dark:text-indigo-400 text-sm" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Student Personal Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <Input
            label="Student Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g. John Doe"
            required
            icon={FiUser}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="student@example.com"
            required
            icon={FiMail}
          />
          <Input
            label="Student ID"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            error={errors.studentId}
            placeholder="e.g. STU-001"
            required
            icon={FiHash}
          />
          <Input
            label="Roll Number"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            error={errors.rollNumber}
            placeholder="e.g. 01"
            required
            icon={FiHash}
          />
          <Select
            label="Academic Class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            error={errors.class}
            options={classes.map((c) => ({ value: c._id, label: c.name }))}
            placeholder="Select class"
            required
            icon={FiBook}
          />
          <Input
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g. A, B, C"
            icon={FiBook}
          />
          <Input
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            error={errors.dateOfBirth}
            required
            icon={FiCalendar}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            error={errors.gender}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
            required
            icon={FiUser}
          />
          <Input
            label="Direct Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+1 (555) 000-0000"
            icon={FiPhone}
          />
          <Input
            label="Residential Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address, City, State"
            icon={FiHome}
          />
        </div>
      </div>

      {/* 2. Parent / Guardian Information */}
      <div className="rounded-xl p-4 bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 pb-2.5 mb-3.5 border-b border-slate-200 dark:border-slate-800">
          <FiUsers className="text-indigo-600 dark:text-indigo-400 text-sm" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Parent & Guardian Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <Input
            label="Father's Full Name"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            error={errors.fatherName}
            placeholder="Enter father's name"
            required
            icon={FiUserCheck}
          />
          <Input
            label="Father's Phone Number"
            name="fatherPhone"
            type="tel"
            value={formData.fatherPhone}
            onChange={handleChange}
            error={errors.fatherPhone}
            placeholder="+1 (555) 000-0000"
            required
            icon={FiPhone}
          />
          <Input
            label="Father's Occupation"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
            placeholder="e.g. Engineer, Business"
            icon={FiBriefcase}
          />
          <Input
            label="Father's CNIC / ID"
            name="fatherCnic"
            value={formData.fatherCnic}
            onChange={handleChange}
            error={errors.fatherCnic}
            placeholder="12345-6789012-3"
            icon={FiCreditCard}
          />
          <Input
            label="Mother's Full Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Enter mother's name"
            icon={FiUser}
          />
          <Input
            label="Mother's Phone Number"
            name="motherPhone"
            type="tel"
            value={formData.motherPhone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            icon={FiPhone}
          />
        </div>
      </div>

      {/* 3. Enrollment Status */}
      <div className="rounded-xl p-4 bg-slate-50 dark:bg-[#111827]/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 pb-2.5 mb-3.5 border-b border-slate-200 dark:border-slate-800">
          <FiBook className="text-indigo-600 dark:text-indigo-400 text-sm" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Enrollment Status
          </h3>
        </div>

        <div className="max-w-xs">
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={STUDENT_STATUS.map((s) => ({
              value: s,
              label: s.charAt(0).toUpperCase() + s.slice(1),
            }))}
            placeholder="Select status"
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="sticky bottom-0 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 px-5 sm:px-6 py-3.5 bg-white/95 dark:bg-[#162033]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5 z-10 rounded-b-[16px]">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {loading
            ? 'Saving...'
            : isEditMode
            ? 'Update Student'
            : 'Enroll Student'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
