import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEye,
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
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const ExaminationExams = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', classId: '' });
  const [viewingExam, setViewingExam] = useState(null);

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
                        onClick={() => setViewingExam(exam)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                        title="View Exam Details"
                      >
                        <FiEye className="text-sm" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      <Modal
        isOpen={Boolean(viewingExam)}
        onClose={() => setViewingExam(null)}
        title="Examination Details"
        size="lg"
      >
        {viewingExam && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-sm shrink-0">
                  <FiAward />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {viewingExam.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Code: {viewingExam.code || '—'} • {viewingExam.type?.toUpperCase() || 'EXAM'}
                  </p>
                </div>
              </div>
              <StatusBadge status={viewingExam.status || 'draft'} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Class Cohort</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{viewingExam.class?.name || 'All Classes'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Start Date</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(viewingExam.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">End Date</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{formatDate(viewingExam.endDate)}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Marks</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{viewingExam.totalMarks ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passing Marks</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{viewingExam.passingMarks ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{viewingExam.duration ? `${viewingExam.duration} mins` : '—'}</span>
                </div>
              </div>
            </div>

            {viewingExam.subjects?.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Subjects ({viewingExam.subjects.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {viewingExam.subjects.map((sub, idx) => (
                    <span key={sub._id || idx} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {sub.name || sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setViewingExam(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExaminationExams;
