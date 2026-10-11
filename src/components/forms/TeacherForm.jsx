import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiBriefcase,
} from 'react-icons/fi';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { GENDER_OPTIONS, TEACHER_STATUS } from '../../utils/constants';

const TeacherForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teacherId: '',
    qualification: '',
    specialization: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    department: '',
    designation: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        teacherId: initialData.teacherId || '',
        qualification: initialData.qualification || '',
        specialization: initialData.specialization || '',
        dateOfBirth: initialData.dateOfBirth || '',
        gender: initialData.gender || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        department: initialData.department || '',
        designation: initialData.designation || '',
        status: initialData.status || 'active',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.teacherId) newErrors.teacherId = 'Teacher ID is required';
    if (!formData.qualification)
      newErrors.qualification = 'Qualification is required';
    if (!formData.specialization)
      newErrors.specialization = 'Specialization is required';
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation)
      newErrors.designation = 'Designation is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submitData = {
      name: formData.name,
      email: formData.email,
      teacherId: formData.teacherId,
      qualification: formData.qualification,
      specialization: formData.specialization,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phone: formData.phone,
      address: formData.address || '',
      department: formData.department,
      designation: formData.designation,
      status: formData.status || 'active',
    };

    onSubmit(submitData);
  };

  const isEditMode = !!initialData?.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter teacher name"
          required
          icon={FiUser}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          icon={FiMail}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Teacher ID"
          name="teacherId"
          value={formData.teacherId}
          onChange={handleChange}
          placeholder="Enter teacher ID"
          required
          icon={FiBriefcase}
          error={errors.teacherId}
        />
        <Input
          label="Qualification"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
          placeholder="Enter qualification"
          required
          error={errors.qualification}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Enter specialization"
          required
          error={errors.specialization}
        />
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          icon={FiCalendar}
          error={errors.dateOfBirth}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={GENDER_OPTIONS}
          placeholder="Select Gender"
          required
          icon={FiUser}
          error={errors.gender}
        />
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
          icon={FiPhone}
          error={errors.phone}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Enter department"
          required
          error={errors.department}
        />
        <Input
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter designation"
          required
          error={errors.designation}
        />
      </div>

      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Enter address (optional)"
      />

      <Select
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange}
        options={TEACHER_STATUS.map((s) => ({
          value: s,
          label: s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' '),
        }))}
      />

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full sm:w-auto"
        >
          {loading
            ? 'Saving...'
            : isEditMode
            ? 'Update Teacher'
            : 'Add Teacher'}
        </Button>
      </div>
    </form>
  );
};

export default TeacherForm;