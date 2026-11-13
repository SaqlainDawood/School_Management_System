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

const StudentForm = ({ initialData, onSubmit, onCancel, loading, classes }) => {
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
        dateOfBirth: initialData.dateOfBirth || '',
        gender: initialData.gender || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
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
    if (!formData.name) newErrors.name = 'Student name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    if (!formData.rollNumber) newErrors.rollNumber = 'Roll number is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    // Parent Required Fields
    if (!formData.fatherName)
      newErrors.fatherName = 'Father name is required';
    if (!formData.fatherPhone)
      newErrors.fatherPhone = 'Father phone is required';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ============================================ */}
      {/* STUDENT PERSONAL INFORMATION */}
      {/* ============================================ */}
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <FiUser className="text-blue-600" />
          Student Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Student Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter student full name"
            required
            icon={FiUser}
          />
          <Input
            label="Email"
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
            placeholder="e.g., STU001"
            required
            icon={FiHash}
          />
          <Input
            label="Roll Number"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            error={errors.rollNumber}
            placeholder="e.g., 01"
            required
            icon={FiHash}
          />
          <Select
            label="Class"
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
            placeholder="e.g., A, B, C"
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
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+92 300 1234567"
            icon={FiPhone}
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Student's address"
            icon={FiHome}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* PARENT / GUARDIAN INFORMATION */}
      {/* ============================================ */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-4 flex items-center gap-2">
          <FiUsers className="text-blue-600" />
          Parent / Guardian Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Father Info */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Father's Information
            </h4>
          </div>
          <Input
            label="Father Name"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            error={errors.fatherName}
            placeholder="Enter father's full name"
            required
            icon={FiUserCheck}
          />
          <Input
            label="Father Phone"
            name="fatherPhone"
            value={formData.fatherPhone}
            onChange={handleChange}
            error={errors.fatherPhone}
            placeholder="+92 300 1234567"
            required
            icon={FiPhone}
          />
          <Input
            label="Father Occupation"
            name="fatherOccupation"
            value={formData.fatherOccupation}
            onChange={handleChange}
            placeholder="e.g., Businessman, Doctor"
            icon={FiBriefcase}
          />
          <Input
            label="Father CNIC"
            name="fatherCnic"
            value={formData.fatherCnic}
            onChange={handleChange}
            error={errors.fatherCnic}
            placeholder="12345-6789012-3"
            icon={FiCreditCard}
          />

          {/* Mother Info */}
          <div className="md:col-span-2 mt-2">
            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
              Mother's Information
            </h4>
          </div>
          <Input
            label="Mother Name"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            placeholder="Enter mother's full name"
            icon={FiUser}
          />
          <Input
            label="Mother Phone"
            name="motherPhone"
            value={formData.motherPhone}
            onChange={handleChange}
            placeholder="+92 300 1234567"
            icon={FiPhone}
          />
        </div>
      </div>

      {/* ============================================ */}
      {/* STATUS */}
      {/* ============================================ */}
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <FiBook className="text-blue-600" />
          Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* ============================================ */}
      {/* FORM ACTIONS */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;