import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiUser,
  FiBook,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const ParentResults = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingResults, setFetchingResults] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) fetchResults();
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/parents/dashboard');
      const kids = response.data?.dashboard?.parent?.children || [];
      setChildren(kids);
      if (kids.length > 0) setSelectedChild(kids[0]._id);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setFetchingResults(true);
      const response = await api.get(
        `/api/parents/child/${selectedChild}/results`
      );
      setResults(response.data?.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setFetchingResults(false);
    }
  };

  const chartData = results.map((r) => ({
    exam: r.exam?.name || 'Exam',
    percentage: Math.round(Number(r.percentage) || 0),
  }));

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

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Children Academic Results"
        subtitle="Review report cards and examination score histories"
        breadcrumbs={[
          { label: 'Parent', href: '/parent/dashboard' },
          { label: 'Results' },
        ]}
      />

      {children.length === 0 ? (
        <EmptyState
          icon={FiUser}
          title="No Students Associated"
          description="There are currently no students linked to your account."
        />
      ) : (
        <>
          <div className="card p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4">
            <Select
              label="Select Student"
              name="child"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              options={children.map((c) => ({
                value: c._id,
                label: `${c.user?.name || 'Student'} (${c.class?.name || 'Class'})`,
              }))}
              className="w-72"
              icon={FiUser}
            />
          </div>

          {fetchingResults ? (
            <Loader />
          ) : results.length === 0 ? (
            <EmptyState
              icon={FiAward}
              title="No Results Published"
              description="No official examination results have been published yet for this student."
            />
          ) : (
            <div className="space-y-6">
              {chartData.length > 0 && (
                <SectionCard title="Performance Trend" subtitle="Percentage trajectory across exams">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="exam" stroke="#64748b" />
                        <YAxis stroke="#64748b" domain={[0, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="percentage"
                          stroke="#4F46E5"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#4F46E5' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </SectionCard>
              )}

              <SectionCard title="Grade Ledger" subtitle="Detailed examination mark statements">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                            {result.exam?.name || 'General Exam'}
                            {result.exam?.type && (
                              <span className="block text-xs font-normal text-slate-500">
                                {result.exam.type}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            {result.obtainedMarks} / {result.totalMarks}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            {result.percentage}%
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md bg-${getGradeVariant(result.grade)}-100 text-${getGradeVariant(result.grade)}-700 dark:bg-${getGradeVariant(result.grade)}-950/40 dark:text-${getGradeVariant(result.grade)}-400`}>
                              {result.grade || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge status={result.status === 'pass' ? 'active' : 'inactive'} label={result.status?.toUpperCase() || 'PASS'} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ParentResults;
