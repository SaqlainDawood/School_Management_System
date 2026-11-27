import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiEye, FiUsers, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/modals/Modal';
import StudentForm from '../../components/forms/StudentForm';
import api from '../../utils/api';
import { getStatusLabel, formatAddress } from '../../utils/helpers';
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
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
      setStudents(response.data.students || []);
      setPagination({
        ...pagination,
        total: response.data.total || 0,
        totalPages: response.data.pagination?.totalPages || 1,
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
      const validClasses = (response.data.classes || []).filter(
        (c) => c._id && c._id.length === 24
      );
      setClasses(validClasses);
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
      address: formatAddress(student.address || student.user?.address),
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

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/students/${deleteTargetId}`);
      toast.success('Student deleted successfully');
      setDeleteTargetId(null);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    } finally {
      setDeleteLoading(false);
    }
  };

  const mapStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'graduated': return 'info';
      case 'inactive': return 'neutral';
      case 'suspended': return 'danger';
      case 'transferred': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Directory"
        subtitle="Manage and monitor enrolled students across all institutional cohorts"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Students' },
        ]}
        actions={
          <Button variant="primary" icon={FiUserPlus} onClick={handleAddStudent}>
            Enroll Student
          </Button>
        }
      />

      <div className="card overflow-hidden">
        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by student name, roll number, or email..."
              />
            </div>
            <div className="flex items-center gap-3">
              <select
                name="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="select-field text-xs py-2 w-36"
              >
                <option value="">All Statuses</option>
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
                className="select-field text-xs py-2 w-36"
              >
                <option value="">All Genders</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading && students.length === 0 ? (
          <div className="p-12 flex justify-center">
            <Loader />
          </div>
        ) : students.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiUsers}
              title="No students located"
              description="No student records match your query or have been enrolled yet."
              actionLabel="Add First Student"
              onAction={handleAddStudent}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-4 py-3">ID / Roll No.</th>
                  <th className="px-4 py-3">Class & Section</th>
                  <th className="px-4 py-3">Guardian</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {students.map((student) => {
                  const initial = student.user?.name?.charAt(0) || 'S';
                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-center font-bold text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {student.user?.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {student.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <div className="font-mono">{student.studentId || '—'}</div>
                        <div className="text-[11px] text-slate-400">Roll: {student.rollNumber || '—'}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <span className="font-medium">{student.class?.name || 'Unassigned'}</span>
                        {student.section && (
                          <span className="text-[11px] text-slate-400 block">Sec {student.section}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <div>{student.fatherName || '—'}</div>
                        <div className="text-[11px] text-slate-400">{student.fatherPhone || ''}</div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge
                          status={student.status}
                          variant={mapStatusVariant(student.status)}
                          dot
                        >
                          {getStatusLabel(student.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditStudent(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Student"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(student._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Student"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
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
      </div>

      {/* Edit / Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? 'Update Student Details' : 'Enroll New Student'}
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

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message="Are you sure you wish to delete this student record? This action will remove academic history and cannot be undone."
        confirmText="Delete Record"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Students;
