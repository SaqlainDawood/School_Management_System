import React, { useState, useEffect } from 'react';
import { FiAward, FiUser } from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const ParentResults = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) fetchResults();
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/api/parents/dashboard');
      const kids = response.data.dashboard?.parent?.children || [];
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
      const response = await api.get(
        `/api/parents/child/${selectedChild}/results`
      );
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const chartData = results.map((r) => ({
    exam: r.exam?.name || 'Exam',
    percentage: r.percentage,
  }));

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
    <div>
      <DashboardHeader
        title="Children Results"
        subtitle="View your children's academic performance"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <Select
            label="Select Child"
            name="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            options={children.map((c) => ({
              value: c._id,
              label: c.user?.name || 'Child',
            }))}
            className="w-64"
            icon={FiUser}
          />
        </div>

        {chartData.length > 0 && (
          <div className="mb-6">
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

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
                  Percentage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {result.exam?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.exam?.type}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {result.obtainedMarks} / {result.totalMarks}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {result.percentage}%
                  </td>
                  <td className="px-4 py-3">{getGradeBadge(result.grade)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        result.status === 'pass'
                          ? 'badge-success'
                          : 'badge-danger'
                      }`}
                    >
                      {result.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <FiAward className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No results found for this student
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentResults;