import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import Modal from '../../components/modals/Modal';
import StudentForm from '../../components/forms/StudentForm';
import api from '../../utils/api';
import { getStatusColor, getStatusLabel } from '../../utils/helpers';
import { STUDENT_STATUS, GENDER_OPTIONS } from '../../utils/constants';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', gender: '' });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
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
    fatherName: '',
    fatherPhone: '',
    fatherOccupation: '',
    fatherCnic: '',
    motherName: '',
    motherPhone: '',
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, [search, filters, pagination.page]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search,
        ...filters,
      };
      const response = await api.get('/api/students', { params });
      setStudents(response.data.students);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes');
      const validClasses = response.data.classes.filter(
        (c) => c._id && c._id.length === 24
      );
      setClasses(validClasses || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPagination({ ...pagination, page: 1 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({
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
      fatherName: '',
      fatherPhone: '',
      fatherOccupation: '',
      fatherCnic: '',
      motherName: '',
      motherPhone: '',
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.user?.name || '',
      email: student.user?.email || '',
      studentId: student.studentId || '',
      rollNumber: student.rollNumber || '',
      class: student.class?._id || '',
      section: student.section || '',
      dateOfBirth: student.dateOfBirth
        ? student.dateOfBirth.split('T')[0]
        : '',
      gender: student.gender || '',
      phone: student.phone || '',
      address: student.address || '',
      status: student.status || 'active',
      fatherName: student.fatherName || '',
      fatherPhone: student.fatherPhone || '',
      fatherOccupation: student.fatherOccupation || '',
      fatherCnic: student.fatherCnic || '',
      motherName: student.motherName || '',
      motherPhone: student.motherPhone || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingStudent) {
        await api.put(`/api/students/${editingStudent._id}`, data);
        toast.success('Student updated successfully');
      } else {
        const response = await api.post('/api/students', data);
        toast.success(
          `Student added successfully! Password: ${
            response.data.temporaryPassword || 'Check email'
          }`
        );
      }
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/api/students/${id}`);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <span className={`badge badge-${color}`}>{label}</span>;
  };

  if (loading && students.length === 0) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Students Management"
        subtitle="Manage all students in your school"
        actions={
          <Button variant="primary" icon={FiUserPlus} onClick={handleAddStudent}>
            Add Student
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by name, ID, or roll number..."
              />
            </div>
            <div className="flex gap-3">
              <select
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field w-40"
              >
                <option value="">All Status</option>
                {STUDENT_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {getStatusLabel(s)}
                  </option>
                ))}
              </select>
              <select
                name="gender"
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="input-field w-40"
              >
                <option value="">All Gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID / Roll
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Father Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {students.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-medium">
                          {student.user?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {student.user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {student.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {student.studentId}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Roll: {student.rollNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {student.class?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {student.fatherName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {student.fatherPhone || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600"
                          title="View"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
                          title="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={pagination.limit}
          totalItems={pagination.total}
          onItemsPerPageChange={(limit) => {
            setPagination({ ...pagination, limit, page: 1 });
          }}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        size="lg"
      >
        <StudentForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
          classes={classes}
        />
      </Modal>
    </div>
  );
};

export default Students;