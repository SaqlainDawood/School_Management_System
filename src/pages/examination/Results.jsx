import React, { useState, useEffect } from 'react';
import {
  FiAward,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const ExaminationResults = () => {
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ examId: '' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [resultsRes, examsRes] = await Promise.all([
        api.get('/api/results', { params: filters }),
        api.get('/api/exams'),
      ]);
      setResults(resultsRes.data.results);
      setExams(examsRes.data.exams);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return (
      <span className={`badge ${colors[grade] || 'badge-info'}`}>{grade}</span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Result Management"
        subtitle="Publish and manage results"
        actions={
          <Button variant="primary" icon={FiAward}>
            Upload Results
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Select
            name="exam"
            value={filters.examId}
            onChange={(e) => setFilters({ ...filters, examId: e.target.value })}
            options={[
              { value: '', label: 'All Exams' },
              ...exams.map((e) => ({ value: e._id, label: e.name })),
            ]}
            className="w-48"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((result) => (
                <tr key={result._id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {result.student?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.student?.rollNumber}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {result.exam?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {result.obtainedMarks} / {result.totalMarks}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {result.percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4">{getGradeBadge(result.grade)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`badge ${
                        result.isPublished ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {result.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!result.isPublished && (
                        <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-green-600">
                          <FiCheckCircle className="text-sm" title="Publish" />
                        </button>
                      )}
                      <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-600">
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <div className="text-center py-12">
            <FiClock className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No results found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminationResults;