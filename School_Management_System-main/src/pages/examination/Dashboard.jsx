import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAward,
  FiClock,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#64748B'];

const ExaminationDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    let ignore = false;
    const fetchExamOfficeData = async () => {
      try {
        setLoading(true);
        const [examsRes, resultsRes] = await Promise.allSettled([
          api.get('/api/exams'),
          api.get('/api/results'),
        ]);

        if (ignore) return;
        if (examsRes.status === 'fulfilled' && examsRes.value.data?.exams) {
          setExams(examsRes.value.data.exams);
        }
        if (resultsRes.status === 'fulfilled' && resultsRes.value.data?.results) {
          setResults(resultsRes.value.data.results);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error loading examination dashboard data:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchExamOfficeData();

    return () => {
      ignore = true;
    };
  }, []);

  const totalExams = exams.length;
  const ongoingExams = exams.filter((e) => e.status === 'ongoing').length;
  const publishedExams = exams.filter((e) => e.status === 'published' || e.status === 'completed').length;
  const publishedResultsCount = results.filter((r) => r.isPublished).length;

  const statusCounts = exams.reduce((acc, exam) => {
    const s = exam.status || 'draft';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Examination Office Dashboard"
        subtitle="Manage testing schedules, grade sheets, date sheets, and result publications"
        breadcrumbs={[{ label: 'Examination' }, { label: 'Dashboard' }]}
        actions={
          <Link to="/examination/exams" className="btn btn-primary inline-flex items-center gap-2">
            <FiAward />
            <span>Manage Exams</span>
          </Link>
        }
      />

      {/* Genuine KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Exams"
          value={totalExams}
          icon={FiAward}
          color="primary"
          subtitle="Registered exams"
        />
        <StatsCard
          title="Ongoing"
          value={ongoingExams}
          icon={FiClock}
          color="warning"
          subtitle="Currently active"
        />
        <StatsCard
          title="Concluded"
          value={publishedExams}
          icon={FiCheckCircle}
          color="success"
          subtitle="Completed sessions"
        />
        <StatsCard
          title="Results Logged"
          value={results.length}
          icon={FiBarChart2}
          color="secondary"
          subtitle={`${publishedResultsCount} published`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Status Distribution */}
        <div className="lg:col-span-1">
          <SectionCard title="Exam Status Distribution" subtitle="Active curriculum breakdown">
            {pieData.length === 0 ? (
              <EmptyState
                icon={FiCalendar}
                title="No Exam Records"
                description="No exams registered in the system."
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Quick Operational Portals */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Examination Operations" subtitle="Core administration workflows">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/examination/exams"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
                  <FiAward />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
                  Exams Management
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure exam dates, classes, duration, and passing criteria.
                </p>
              </Link>

              <Link
                to="/examination/results"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
                  <FiBarChart2 />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
                  Results Ledger
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Review student grade submissions and publish official report cards.
                </p>
              </Link>

              <Link
                to="/examination/date-sheets"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40 transition-all group sm:col-span-2"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl mb-3 group-hover:scale-105 transition-transform">
                  <FiCalendar />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors">
                  Date Sheets & Timetables
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Draft, finalize, and distribute exam date sheets and room seat allocations.
                </p>
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default ExaminationDashboard;
