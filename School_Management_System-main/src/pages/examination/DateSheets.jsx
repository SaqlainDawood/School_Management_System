import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiClock,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';

const DateSheets = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ classId: '' });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [examsRes, classesRes] = await Promise.all([
        api.get('/api/exams', {
          params: { status: 'published', ...filters },
        }),
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

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Date Sheets"
        subtitle="Create and manage exam date sheets"
        actions={
          <Button variant="primary" icon={FiPlus}>
            Create Date Sheet
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Select
            name="class"
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
            options={[
              { value: '', label: 'All Classes' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
            className="w-48"
          />
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {exam.name}
                    </h3>
                    <span className="badge badge-success">{exam.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {exam.class?.name} • {exam.semester}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-600">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Schedule:
                  </p>
                  {exam.schedule?.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <FiClock className="text-gray-400 text-xs" />
                      <span>{slot.subject?.name}</span>
                      <span className="text-gray-400">•</span>
                      <span>{formatDate(slot.date)}</span>
                      <span className="text-gray-400">•</span>
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Details:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Marks: {exam.totalMarks} • Passing:{' '}
                    {exam.passingMarks}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {exam.duration} minutes
                  </p>
                </div>
              </div>
            </div>
          ))}

          {exams.length === 0 && (
            <div className="text-center py-12">
              <FiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                No date sheets available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateSheets;