// frontend/src/components/modals/AddFeeModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiUser,
  FiBook,
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiInfo,
  FiSave,
  FiRefreshCw,
  FiTrendingUp,
} from 'react-icons/fi';
import { formatCurrency } from '../../utils/helpers';

const AddFeeModal = ({
  isOpen,
  onClose,
  onSubmit,
  students,
  classes,
  loading = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    student: '',
    feeType: 'tuition',
    amount: '',
    dueDate: '',
    academicYear: '',
    semester: 'annual',
    remarks: '',
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        student: initialData.student || '',
        feeType: initialData.feeType || 'tuition',
        amount: initialData.amount || '',
        dueDate: initialData.dueDate || '',
        academicYear: initialData.academicYear || '',
        semester: initialData.semester || 'annual',
        remarks: initialData.remarks || '',
      });
      if (initialData.student && students) {
        const student = students.find((s) => s._id === initialData.student);
        setSelectedStudent(student);
      }
    }
  }, [initialData, students]);

  const handleStudentSelect = (studentId) => {
    const student = students?.find((s) => s._id === studentId);
    setSelectedStudent(student);
    setFormData({ ...formData, student: studentId });
    setErrors({ ...errors, student: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.student) newErrors.student = 'Please select a student';
    if (!formData.feeType) newErrors.feeType = 'Fee type is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.academicYear)
      newErrors.academicYear = 'Academic year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('❌ Validation failed:', errors);
      return;
    }

    const submitData = {
      student: formData.student,
      feeType: formData.feeType,
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      academicYear: formData.academicYear,
      semester: formData.semester || 'annual',
      remarks: formData.remarks || '',
    };

    console.log('📤 Submitting fee data:', submitData);
    onSubmit(submitData);
  };

  const handleReset = () => {
    setFormData({
      student: '',
      feeType: 'tuition',
      amount: '',
      dueDate: '',
      academicYear: '',
      semester: 'annual',
      remarks: '',
    });
    setSelectedStudent(null);
    setErrors({});
    setTouched({});
  };

  const totalFee = parseFloat(formData.amount) || 0;
  const grandTotal = totalFee;

  const feeTypes = [
    { value: 'tuition', label: 'Tuition Fee' },
    { value: 'transport', label: 'Transport Fee' },
    { value: 'library', label: 'Library Fee' },
    { value: 'lab', label: 'Lab Fee' },
    { value: 'exam', label: 'Examination Fee' },
    { value: 'admission', label: 'Admission Fee' },
    { value: 'other', label: 'Other Charges' },
  ];

  const semesters = [
    { value: 'annual', label: 'Annual' },
    { value: 'semester1', label: 'Semester 1' },
    { value: 'semester2', label: 'Semester 2' },
  ];

  const isFormValid = () => {
    return (
      formData.student &&
      formData.feeType &&
      formData.amount &&
      formData.dueDate &&
      formData.academicYear
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <FiFileText className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      {initialData ? 'Edit Fee' : 'Add Fee'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {initialData
                        ? 'Update existing fee record'
                        : 'Create a new fee record for student'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="text-xl text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Student Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <FiUser className="text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Student Information
                      </h3>
                    </div>
                    <div className="p-4 md:p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Select Student <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="student"
                          value={formData.student}
                          onChange={(e) => handleStudentSelect(e.target.value)}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none
                            ${
                              errors.student && touched.student
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                            }`}
                        >
                          <option value="">Select a student...</option>
                          {students?.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.user?.name || 'Unknown'} -{' '}
                              {student.rollNumber || 'N/A'} (
                              {student.class?.name || 'No Class'})
                            </option>
                          ))}
                        </select>
                        {errors.student && touched.student && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> {errors.student}
                          </p>
                        )}
                      </div>

                      {selectedStudent && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                              {selectedStudent.user?.name?.charAt(0) || 'S'}
                            </div>
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Name
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {selectedStudent.user?.name || 'Unknown'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Roll Number
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {selectedStudent.rollNumber || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Class
                                </p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {selectedStudent.class?.name || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Fee Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <FiDollarSign className="text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Fee Information
                      </h3>
                    </div>
                    <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Fee Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="feeType"
                          value={formData.feeType}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                        >
                          {feeTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Amount <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                            Rs.
                          </span>
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="0"
                            min="0"
                            className={`w-full pl-12 pr-4 py-2.5 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                              ${
                                errors.amount && touched.amount
                                  ? 'border-red-500 focus:ring-red-500'
                                  : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                              }`}
                          />
                        </div>
                        {errors.amount && touched.amount && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> {errors.amount}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Academic Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="academicYear"
                          value={formData.academicYear}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g., 2026-2027"
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            ${
                              errors.academicYear && touched.academicYear
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                            }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Fee Period
                        </label>
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                        >
                          {semesters.map((sem) => (
                            <option key={sem.value} value={sem.value}>
                              {sem.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Due Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-2.5 rounded-lg border transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            ${
                              errors.dueDate && touched.dueDate
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                            }`}
                        />
                        {errors.dueDate && touched.dueDate && (
                          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                            <FiAlertCircle /> {errors.dueDate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 px-4 md:px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <FiFileText className="text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Notes
                      </h3>
                    </div>
                    <div className="p-4 md:p-6">
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter any additional remarks..."
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-4 space-y-4">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-xl shadow-lg p-6 text-white">
                      <h4 className="text-sm font-medium text-blue-200 mb-4 flex items-center gap-2">
                        <FiTrendingUp /> Fee Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm border-b border-blue-500/30 pb-2">
                          <span className="text-blue-200">Total Fee</span>
                          <span className="font-medium">
                            {formatCurrency(totalFee)}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-blue-500/30">
                          <span>Grand Total</span>
                          <span>{formatCurrency(grandTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                          <span className="text-blue-200">Remaining</span>
                          <span className="font-medium">
                            {formatCurrency(grandTotal)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-blue-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-200">Status</span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/30 text-yellow-300">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        <FiInfo /> Quick Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Student
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {selectedStudent ? '✅ Yes' : '❌ No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Fee Type
                          </span>
                          <span className="font-medium text-gray-800 dark:text-white capitalize">
                            {formData.feeType || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl p-4 md:p-6 flex flex-wrap gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiRefreshCw /> Reset
                </button>
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave /> {initialData ? 'Update Fee' : 'Save Fee'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default AddFeeModal;