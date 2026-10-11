import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
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
      const [examsRes, classesRes] = await Promise.all([
        api.get('/api/exams', { params: filters }),
        api.get('/api/classes'),
      ]);
      setExams(examsRes.data.exams);
      setClasses(classesRes.data.classes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      draft: 'badge-info',
      published: 'badge-success',
      ongoing: 'badge-warning',
      completed: 'badge-info',
      cancelled: 'badge-danger',
    };
    return (
      <span className={`badge ${colors[status] || 'badge-info'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Exam Management"
        subtitle="Create and manage all exams"
        actions={
          <Button variant="primary" icon={FiPlus}>
            Create Exam
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
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
              className="w-48"
            />
            <Select
              name="status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              options={[
                { value: '', label: 'All Status' },
                { value: 'draft', label: 'Draft' },
                { value: 'published', label: 'Published' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
              ]}
              className="w-48"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Schedule
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
              {exams.map((exam) => (
                <tr key={exam._id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {exam.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {exam.code}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {exam.class?.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-gray-400 text-xs" />
                        {formatDate(exam.startDate)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiClock className="text-gray-400" />
                        {exam.duration} minutes
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(exam.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600">
                        <FiAward className="text-sm" />
                      </button>
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

        {exams.length === 0 && (
          <div className="text-center py-12">
            <FiAward className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No exams found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExaminationExams;