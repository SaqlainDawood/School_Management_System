import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
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
import TeacherForm from '../../components/forms/TeacherForm';
import api from '../../utils/api';
import { formatDate, getStatusLabel } from '../../utils/helpers';

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
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          search,
        };
        const response = await api.get('/api/teachers', { params });
        if (ignore) return;
        setTeachers(response.data.teachers || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.pagination?.totalPages || 1,
        }));
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching teachers:', error);
          toast.error('Failed to fetch teachers');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchTeachers();

    return () => {
      ignore = true;
    };
  }, [search, pagination.page, pagination.limit, refreshTrigger]);

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
          `Teacher added successfully! Password: ${response.data.temporaryPassword || 'Check email'
          }`
        );
      }
      setShowModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast.error(error.response?.data?.message || 'Failed to save teacher');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/teachers/${deleteTargetId}`);
      toast.success('Teacher record removed successfully');
      setDeleteTargetId(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast.error('Failed to delete teacher');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Directory"
        subtitle="Manage academic teaching staff, departments, and instructional credentials"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Teachers' },
        ]}
        actions={
          <Button variant="primary" icon={FiUserPlus} onClick={handleAddTeacher}>
            Appoint Faculty
          </Button>
        }
      />

      <div className="card overflow-hidden">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="max-w-md">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search faculty by name, ID, or department..."
            />
          </div>
        </div>

        {/* Table Content */}
        {loading && teachers.length === 0 ? (
          <div className="p-12 flex justify-center">
            <Loader />
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiUsers}
              title="No faculty members found"
              description="No teaching staff match your query or have been added yet."
              actionLabel="Add Faculty Member"
              onAction={handleAddTeacher}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Faculty Member</th>
                  <th className="px-4 py-3">Teacher ID</th>
                  <th className="px-4 py-3">Department & Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joining Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {teachers.map((teacher) => {
                  const initial = teacher.user?.name?.charAt(0) || 'T';
                  return (
                    <tr
                      key={teacher._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50 flex items-center justify-center font-bold text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {teacher.user?.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {teacher.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-mono">
                        {teacher.teacherId || '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                        <span className="font-medium">{teacher.department || 'General'}</span>
                        <span className="text-[11px] text-slate-400 block">{teacher.designation || 'Lecturer'}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge
                          status={teacher.status}
                          variant={teacher.status === 'active' ? 'success' : 'secondary'}
                          dot
                        >
                          {getStatusLabel(teacher.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">
                        {teacher.joinDate ? formatDate(teacher.joinDate) : '—'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditTeacher(teacher)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Faculty Record"
                          >
                            <FiEdit2 className="text-sm" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(teacher._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title="Remove Faculty Member"
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
        title={editingTeacher ? 'Update Faculty Details' : 'Register New Faculty Member'}
        size="lg"
      >
        <TeacherForm
          initialData={formData}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty Record"
        message="Are you sure you want to remove this faculty record? Any active class teacher assignments will become unassigned."
        confirmText="Remove Faculty"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Teachers;
