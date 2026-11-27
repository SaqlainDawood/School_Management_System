import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiTrendingUp,
  FiBook,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiBarChart2,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/api';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/results/student');
      setResults(response.data?.results || []);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.response?.data?.message || 'Failed to load examination results');
      setResults([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults();
  };

  const totalExams = results.length;
  const passedExams = results.filter((r) => r.status === 'pass').length;
  const failedExams = results.filter((r) => r.status === 'fail').length;
  const averagePercentage =
    totalExams > 0
      ? results.reduce((sum, r) => sum + (Number(r.percentage) || 0), 0) / totalExams
      : 0;

  const chartData = results.map((r) => ({
    name: r.exam?.name || r.examName || 'Exam',
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
        title="Academic Results"
        subtitle="Review your published test scores and cumulative evaluation"
        breadcrumbs={[
          { label: 'Student', href: '/student/dashboard' },
          { label: 'Results' },
        ]}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <FiRefreshCw className={`text-base ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        }
      />

      {results.length === 0 ? (
        <EmptyState
          icon={FiAward}
          title="No Published Results"
          description={error || "Your examination results have not been published by the examination office yet."}
        />
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Average Score"
              value={`${averagePercentage.toFixed(1)}%`}
              icon={FiTrendingUp}
              color="primary"
            />
            <StatsCard
              title="Exams Completed"
              value={totalExams}
              icon={FiBook}
              color="secondary"
            />
            <StatsCard
              title="Passed"
              value={passedExams}
              icon={FiCheckCircle}
              color="success"
            />
            <StatsCard
              title="Needs Retake"
              value={failedExams}
              icon={FiAlertCircle}
              color={failedExams > 0 ? 'danger' : 'success'}
            />
          </div>

          {/* Performance Trend Chart */}
          {chartData.length > 0 && (
            <SectionCard title="Performance Trajectory" subtitle="Score trend across published examinations">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#4F46E5"
                      strokeWidth={3}
                      dot={{ r: 5, fill: '#4F46E5' }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          )}

          {/* Detailed Ledger Table */}
          <SectionCard title="Examination Ledger" subtitle="Individual exam breakdowns and marks">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Exam Name</th>
                    <th className="py-3 px-4">Marks Obtained</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Grade</th>
                    <th className="py-3 px-4">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {results.map((result) => (
                    <tr key={result._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {result.exam?.name || result.examName || 'General Exam'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {result.obtainedMarks} / {result.totalMarks}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {result.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md bg-${getGradeVariant(result.grade)}-100 text-${getGradeVariant(result.grade)}-700 dark:bg-${getGradeVariant(result.grade)}-950/40 dark:text-${getGradeVariant(result.grade)}-400`}>
                          {result.grade || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={result.status === 'pass' ? 'active' : 'inactive'} label={result.status?.toUpperCase() || 'EVALUATED'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  );
};

export default StudentResults;
