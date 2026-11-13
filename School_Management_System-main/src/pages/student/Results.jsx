import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiAward,
  FiBarChart2,
  FiTrendingUp,
  FiBook,
  FiDownload,
  FiPrinter,
  FiStar,
  FiFileText,
  FiActivity,
  FiPieChart,
  FiInfo,
  FiEye,
  FiShare2,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate, formatDateTime } from '../../utils/helpers';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/results/student');
      const data = response.data.results || [];
      setResults(data);
      processResultsData(data);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(error.response?.data?.message || 'Failed to load results');
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

  const processResultsData = (data) => {
    if (!data || data.length === 0) {
      setSubjectPerformance([]);
      setSemesterData([]);
      return;
    }

    const subjectMap = {};
    data.forEach((result) => {
      if (result.subjects && result.subjects.length > 0) {
        result.subjects.forEach((sub) => {
          if (!subjectMap[sub.name]) {
            subjectMap[sub.name] = {
              name: sub.name,
              totalMarks: 0,
              obtainedMarks: 0,
              percentages: [],
            };
          }
          subjectMap[sub.name].totalMarks += sub.totalMarks || 100;
          subjectMap[sub.name].obtainedMarks += sub.obtainedMarks || 0;
          const pct =
            sub.totalMarks > 0 ? (sub.obtainedMarks / sub.totalMarks) * 100 : 0;
          subjectMap[sub.name].percentages.push(pct);
        });
      }
    });

    const processedSubjects = Object.values(subjectMap).map((sub) => ({
      name: sub.name,
      averagePercentage:
        sub.percentages.length > 0
          ? sub.percentages.reduce((a, b) => a + b, 0) / sub.percentages.length
          : 0,
      totalMarks: sub.totalMarks,
      obtainedMarks: sub.obtainedMarks,
    }));
    setSubjectPerformance(processedSubjects);
  };

  const totalExams = results.length;
  const passedExams = results.filter((r) => r.status === 'pass').length;
  const failedExams = results.filter((r) => r.status === 'fail').length;
  const passRate = totalExams > 0 ? (passedExams / totalExams) * 100 : 0;
  const averagePercentage =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
      : 0;

  const chartData = results.map((r) => ({
    exam: r.exam?.name || r.examName || 'Exam',
    percentage: Math.round(r.percentage || 0),
  }));

  const subjectChartData = subjectPerformance.map((sub) => ({
    subject: sub.name,
    percentage: Math.round(sub.averagePercentage || 0),
  }));

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#8dd1e1',
  ];

  const getGradeBadge = (grade) => {
    const colors = {
      'A+': 'badge-success',
      A: 'badge-success',
      'B+': 'badge-info',
      B: 'badge-info',
      'C+': 'badge-warning',
      C: 'badge-warning',
      D: 'badge-danger',
      F: 'badge-danger',
    };
    return <span className={`badge ${colors[grade] || 'badge-info'}`}>{grade}</span>;
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Academic Results
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View your academic performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1.5"
          >
            <FiRefreshCw className={`text-xs ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <FiBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {error || 'No results have been published for your account yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <FiTrendingUp className="text-xl opacity-80" />
              </div>
              <p className="text-2xl font-bold mt-2">
                {averagePercentage.toFixed(1)}%
              </p>
              <p className="text-xs opacity-80">Average Score</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <FiAward className="text-xl opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {passedExams}/{totalExams}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">{passRate.toFixed(0)}%</p>
              <p className="text-xs opacity-80">Pass Rate</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <FiBook className="text-xl opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {totalExams}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">{totalExams}</p>
              <p className="text-xs opacity-80">Total Exams</p>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <FiAlertCircle className="text-xl opacity-80" />
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {failedExams}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">{failedExams}</p>
              <p className="text-xs opacity-80">Failed</p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <FiEye className="inline mr-2" /> Overview
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'analytics'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <FiPieChart className="inline mr-2" /> Analytics
            </button>
          </div>

          {/* Overview */}
          {viewMode === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <FiTrendingUp className="text-blue-600" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Performance Trend
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="exam" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 6, fill: 'white' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
                    Recent Results
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Exam
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Marks
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            %
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {results.slice(0, 5).map((result) => (
                          <tr key={result._id}>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-gray-800 dark:text-white">
                                {result.exam?.name || result.examName}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                              {result.obtainedMarks} / {result.totalMarks}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {result.percentage}%
                            </td>
                            <td className="px-4 py-3">
                              {getGradeBadge(result.grade)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics */}
          {viewMode === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {subjectChartData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 px-6 py-3 border-b">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Subject Analysis
                    </h3>
                  </div>
                  <div className="p-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={subjectChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="subject" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#2563EB" radius={[4, 4, 0, 0]}>
                          {subjectChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-3 border-b">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    Performance Distribution
                  </h3>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: 'Excellent (90-100%)',
                            value: results.filter((r) => r.percentage >= 90).length,
                          },
                          {
                            name: 'Good (75-89%)',
                            value: results.filter(
                              (r) => r.percentage >= 75 && r.percentage < 90
                            ).length,
                          },
                          {
                            name: 'Satisfactory (60-74%)',
                            value: results.filter(
                              (r) => r.percentage >= 60 && r.percentage < 75
                            ).length,
                          },
                          {
                            name: 'Needs Improvement',
                            value: results.filter((r) => r.percentage < 60).length,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => toast.info('Print feature coming soon')}
              className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FiPrinter /> Print Results
            </button>
            <button
              onClick={() => toast.info('Download feature coming soon')}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiDownload /> Download
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentResults;