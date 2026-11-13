import React, { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiCalendar, FiLayers } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatsCard from '../../components/dashboard/StatsCard';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const CoordinatorAttendance = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/coordinator/departments');
      const depts = response.data?.departments || [];
      setDepartments(depts);
      if (depts.length > 0) {
        setSelectedDept(depts[0]._id);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const activeDept = departments.find((d) => d._id === selectedDept);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Attendance Overview"
        subtitle="Monitor student roll call and faculty presence across academic divisions"
        breadcrumbs={[
          { label: 'Coordinator', href: '/coordinator/dashboard' },
          { label: 'Attendance' },
        ]}
      />

      {departments.length === 0 ? (
        <EmptyState
          icon={FiLayers}
          title="No Departments Configured"
          description="There are no academic departments available to monitor attendance."
        />
      ) : (
        <>
          <div className="card p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4">
            <Select
              label="Select Department"
              name="department"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              options={departments.map((d) => ({ value: d._id, label: d.name }))}
              className="w-72"
              icon={FiLayers}
            />
          </div>

          {/* Department Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <StatsCard
              title="Department Faculty"
              value={activeDept?.teachers?.length || 0}
              icon={FiUsers}
              color="primary"
              subtitle="Registered teachers"
            />
            <StatsCard
              title="Curriculum Subjects"
              value={activeDept?.subjects?.length || 0}
              icon={FiClock}
              color="secondary"
              subtitle="Taught in department"
            />
            <StatsCard
              title="Status"
              value={activeDept?.isActive ? 'Active' : 'Inactive'}
              icon={FiCalendar}
              color={activeDept?.isActive ? 'success' : 'danger'}
              subtitle="Academic status"
            />
          </div>

          <SectionCard
            title="Attendance Aggregation Notice"
            subtitle="Departmental roll call telemetry"
          >
            <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Departmental Daily Aggregation
              </p>
              <p>
                Student attendance is logged directly by class teachers in the teacher portal.
                Cross-department analytics compilation is scheduled during nightly synchronization.
              </p>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default CoordinatorAttendance;
