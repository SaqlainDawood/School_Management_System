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
import TeacherForm from '../../components/forms/TeacherForm';
import api from '../../utils/api';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
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

  useEffect(() => {
    fetchTeachers();
  }, [search, pagination.page]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search,
      };
      const response = await api.get('/api/teachers', { params });
      setTeachers(response.data.teachers);
      setPagination({
        ...pagination,
        total: response.data.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  const handleAddTeacher = () => {
    setEditingTeacher(null);
    setFormData({
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
    setShowModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.user?.name || '',
      email: teacher.user?.email || '',
      teacherId: teacher.teacherId || '',
      qualification: teacher.qualification || '',
      specialization: teacher.specialization || '',
      dateOfBirth: teacher.dateOfBirth
        ? teacher.dateOfBirth.split('T')[0]
        : '',
      gender: teacher.gender || '',
      phone: teacher.phone || '',
      address: teacher.address || '',
      department: teacher.department || '',
      designation: teacher.designation || '',
      status: teacher.status || 'active',
    });
    setShowModal(true);
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editingTeacher) {
        await api.put(`/api/teachers/${editingTeacher._id}`, data);
        toast.success('Teacher updated successfully');
      } else {
        const response = await api.post('/api/teachers', data);
        toast.success(
          `Teacher added successfully! Password: ${
            response.data.temporaryPassword || 'Check email'
          }`
        );
      }
      setShowModal(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to save teacher');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete(`/api/teachers/${id}`);
        toast.success('Teacher deleted successfully');
        fetchTeachers();
      } catch (error) {
        console.error('Error deleting teacher:', error);
        toast.error('Failed to delete teacher');
      }
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <span className={`badge badge-${color}`}>{label}</span>;
  };

  if (loading && teachers.length === 0) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Teachers Management"
        subtitle="Manage all teachers in your school"
        actions={
          <Button variant="primary" icon={FiUserPlus} onClick={handleAddTeacher}>
            Add Teacher
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by name, ID, or department..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No teachers found
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <motion.tr
                    key={teacher._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-900/20 flex items-center justify-center text-secondary-600 font-medium">
                          {teacher.user?.name?.charAt(0) || 'T'}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {teacher.user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {teacher.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {teacher.teacherId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {teacher.department}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {teacher.designation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(teacher.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(teacher.joinDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600"
                          title="View"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleEditTeacher(teacher)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
                          title="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher._id)}
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
        title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
        size="lg"
      >
        <TeacherForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Teachers;