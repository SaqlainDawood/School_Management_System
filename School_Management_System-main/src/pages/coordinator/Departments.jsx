import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiBookOpen,
  FiLayers,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/forms/Button';
import api from '../../utils/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/coordinator/departments');
      setDepartments(response.data?.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Registry"
        subtitle="Manage academic departments, faculty distribution, and subject allocations"
        breadcrumbs={[
          { label: 'Coordinator', href: '/coordinator/dashboard' },
          { label: 'Departments' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => toast.info('Department creation requires School Admin authorization')}
          >
            Add Department
          </Button>
        }
      />

      {departments.length === 0 ? (
        <EmptyState
          icon={FiLayers}
          title="No Departments Registered"
          description="There are currently no academic departments configured for this school."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="card p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {dept.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      Code: {dept.code || '—'}
                    </p>
                  </div>
                  <StatusBadge status={dept.isActive ? 'active' : 'inactive'} />
                </div>

                <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <FiUsers className="text-primary-500" /> Faculty
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {dept.teachers?.length || 0} Teachers
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <FiBookOpen className="text-indigo-500" /> Curriculum
                    </span>
                    <strong className="text-slate-900 dark:text-slate-100">
                      {dept.subjects?.length || 0} Subjects
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => toast.info('Department editing requires Admin authorization')}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;
