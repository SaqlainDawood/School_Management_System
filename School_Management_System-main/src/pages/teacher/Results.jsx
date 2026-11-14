import React, { useState, useEffect } from 'react';
import {
  FiAward,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';

const getGradeVariant = (grade) => {
  if (!grade) return 'neutral';
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'info';
  if (grade.startsWith('C')) return 'warning';
  return 'danger';
};

const TeacherResults = () => {
  const [results, setResults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ classId: '', examId: '' });

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const [resultsRes, classesRes, examsRes] = await Promise.all([
          api.get('/api/results', { params: filters }),
          api.get('/api/teachers/classes'),
          api.get('/api/exams'),
        ]);
        if (ignore) return;
        setResults(resultsRes.data?.results || []);
        setClasses(classesRes.data?.classes || []);
        setExams(examsRes.data?.exams || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching teacher results data:', err);
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

  if (loading && results.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Results & Gradebook"
        subtitle="Review assessment scores and performance records for students in your cohorts"
        breadcrumbs={[
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Results' },
        ]}
      />

      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap gap-3">
          <div className="w-52">
            <select
              value={filters.classId}
              onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">All Teaching Classes</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-56">
            <select
              value={filters.examId}
              onChange={(e) => setFilters({ ...filters, examId: e.target.value })}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">All Examinations</option>
              {exams.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {(filters.classId || filters.examId) && (
            <button
              onClick={() => setFilters({ classId: '', examId: '' })}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline self-center font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiAward}
              title="No grades on ledger"
              description="No marks recorded matching the selected class and exam filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-4 py-3">Examination</th>
                  <th className="px-4 py-3">Total Score</th>
                  <th className="px-4 py-3 text-center">Calculated Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {results.map((result) => {
                  const initial = result.student?.name?.charAt(0) || 'S';
                  return (
                    <tr
                      key={result._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 flex items-center justify-center font-bold text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {result.student?.name || 'Unknown Student'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Roll: {result.student?.rollNumber || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                        {result.exam?.name || 'Term Exam'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-700 dark:text-slate-300">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {result.obtainedMarks} / {result.totalMarks}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {result.percentage != null ? `${result.percentage.toFixed(1)}%` : '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-center">
                        <StatusBadge variant={getGradeVariant(result.grade)}>
                          Grade {result.grade || '—'}
                        </StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherResults;
