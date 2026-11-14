import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiUpload,
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

const getGradeVariant = (grade) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'success';
    case 'B+':
    case 'B':
      return 'info';
    case 'C+':
    case 'C':
      return 'warning';
    default:
      return 'danger';
  }
};

const ExaminationResults = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ examId: '' });

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resultsRes, examsRes] = await Promise.all([
          api.get('/api/results', { params: filters }),
          api.get('/api/exams'),
        ]);
        if (ignore) return;
        setResults(resultsRes.data?.results || []);
        setExams(examsRes.data?.exams || []);
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching results:', error);
          setResults([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [filters]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results Ledger & Publishing"
        subtitle="Review student mark rosters and publish certified transcripts"
        breadcrumbs={[
          { label: 'Examination', href: '/examination/dashboard' },
          { label: 'Results' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={FiUpload}
            onClick={() => toast.info('Bulk mark uploads are enabled during open grading periods')}
          >
            Upload Marks
          </Button>
        }
      />

      <SectionCard title="Student Scores & Transcripts" subtitle="Audit test evaluations">
        <div className="mb-6">
          <Select
            label="Filter by Exam"
            name="exam"
            value={filters.examId}
            onChange={(e) => setFilters({ ...filters, examId: e.target.value })}
            options={[
              { value: '', label: 'All Registered Examinations' },
              ...exams.map((e) => ({ value: e._id, label: e.name })),
            ]}
            className="w-72"
          />
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={FiAward}
            title="No Results Recorded"
            description="No student evaluations have been submitted for this examination."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Marks Obtained</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {results.map((result) => (
                  <tr key={result._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">
                        {result.student?.name || result.student?.user?.name || 'Student'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Roll: {result.student?.rollNumber || '—'}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                      {result.exam?.name || 'Exam'}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {result.obtainedMarks} / {result.totalMarks}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {result.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md bg-${getGradeVariant(result.grade)}-100 text-${getGradeVariant(result.grade)}-700 dark:bg-${getGradeVariant(result.grade)}-950/40 dark:text-${getGradeVariant(result.grade)}-400`}>
                        {result.grade || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={result.isPublished ? 'active' : 'warning'}
                        label={result.isPublished ? 'PUBLISHED' : 'DRAFT'}
                      />
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

export default ExaminationResults;
