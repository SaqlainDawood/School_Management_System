import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const ExaminationExams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', classId: '' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsRes, classesRes] = await Promise.all([
        api.get('/api/exams', { params: filters }),
        api.get('/api/classes'),
      ]);
      setExams(examsRes.data?.exams || []);
      setClasses(classesRes.data?.classes || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Registry"
        subtitle="Schedule and oversee academic tests, terms, and final assessments"
        breadcrumbs={[
          { label: 'Examination', href: '/examination/dashboard' },
          { label: 'Exams' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => toast.info('Exam creation modal requires School Admin credentials')}
          >
            Create Exam
          </Button>
        }
      />

      <SectionCard title="Registered Examinations" subtitle="Filter and inspect scheduled tests">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select
            name="class"
            value={filters.classId}
            onChange={(e) =>
              setFilters({ ...filters, classId: e.target.value })
            }
            options={[
              { value: '', label: 'All Classes' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
            className="w-56"
          />
          <Select
            name="status"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'completed', label: 'Completed' },
            ]}
            className="w-48"
          />
        </div>

        {exams.length === 0 ? (
          <EmptyState
            icon={FiAward}
            title="No Examinations Found"
            description="No exams match the selected filter parameters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Exam Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {exams.map((exam) => (
                  <tr key={exam._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {exam.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Code: {exam.code || '—'}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {exam.class?.name || 'All Classes'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 font-medium">
                          <FiCalendar className="text-primary-500" />
                          <span>{formatDate(exam.startDate)}</span>
                        </div>
                        <div className="text-slate-400">
                          Duration: {exam.duration || 60} mins
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={exam.status || 'draft'} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toast.info('Exam modification is handled in the Admin portal')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default ExaminationExams;
