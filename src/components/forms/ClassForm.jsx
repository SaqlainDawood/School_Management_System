import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import {
  FiBook,
  FiCode,
  FiCalendar,
  FiUsers,
} from 'react-icons/fi';

const ClassForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    academicYear: '',
    capacity: '',
    roomNumber: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        description: initialData.description || '',
        academicYear: initialData.academicYear || '',
        capacity: initialData.capacity || '',
        roomNumber: initialData.roomNumber || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Class name is required';
    if (!formData.code) newErrors.code = 'Class code is required';
    if (!formData.academicYear)
      newErrors.academicYear = 'Academic year is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
  };

  const isEditMode = !!initialData?.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Class Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter class name"
          required
          icon={FiBook}
          error={errors.name}
        />
        <Input
          label="Class Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Enter class code"
          required
          icon={FiCode}
          error={errors.code}
        />
      </div>

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter description (optional)"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Academic Year"
          name="academicYear"
          value={formData.academicYear}
          onChange={handleChange}
          placeholder="e.g., 2026-2027"
          required
          icon={FiCalendar}
          error={errors.academicYear}
        />
        <Input
          label="Capacity"
          name="capacity"
          type="number"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Enter capacity"
          icon={FiUsers}
        />
        <Input
          label="Room Number"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          placeholder="Enter room number"
        />
      </div>

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
            ? 'Update Class'
            : 'Add Class'}
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;