import React, { useState, useEffect } from 'react';
import {
  FiCalendar,
  FiPlus,
  FiClock,
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
import { formatDate } from '../../utils/helpers';

const DateSheets = () => {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ classId: '' });

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [examsRes, classesRes] = await Promise.all([
          api.get('/api/exams', {
            params: { status: 'published', ...filters },
          }),
          api.get('/api/classes'),
        ]);
        if (ignore) return;
        setExams(examsRes.data?.exams || []);
        setClasses(classesRes.data?.classes || []);
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching date sheets:', error);
          setExams([]);
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
        title="Examination Date Sheets"
        subtitle="Manage testing timetables, period slots, and examination room assignments"
        breadcrumbs={[
          { label: 'Examination', href: '/examination/dashboard' },
          { label: 'Date Sheets' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() => toast.info('Date sheet builder is available during timetable preparation sessions')}
          >
            Create Date Sheet
          </Button>
        }
      />

      <SectionCard title="Published Date Sheets" subtitle="Official student schedule notices">
        <div className="mb-6">
          <Select
            label="Filter by Class"
            name="class"
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
            options={[
              { value: '', label: 'All Classes' },
              ...classes.map((c) => ({ value: c._id, label: c.name })),
            ]}
            className="w-64"
          />
        </div>

        {exams.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            title="No Date Sheets Available"
            description="There are currently no published examination schedules for this criteria."
          />
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="card p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {exam.name}
                      </h3>
                      <StatusBadge status="active" label="PUBLISHED" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Class: <strong className="text-slate-700 dark:text-slate-300">{exam.class?.name || 'All'}</strong> • Semester: <strong className="text-slate-700 dark:text-slate-300">{exam.semester || 'Annual'}</strong>
                    </p>
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Duration: {exam.duration || 60} mins • Passing: {exam.passingMarks || 40} marks
                  </div>
                </div>

                {/* Schedule list */}
                <div className="pt-4 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Paper Schedule & Venues
                  </h4>
                  {(!exam.schedule || exam.schedule.length === 0) ? (
                    <p className="text-xs text-slate-400">
                      Standard timetable: Commencing {formatDate(exam.startDate)}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {exam.schedule.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs"
                        >
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {slot.subject?.name || 'Subject'}
                          </span>
                          <span className="text-slate-500 inline-flex items-center gap-1">
                            <FiClock className="text-slate-400" />
                            {formatDate(slot.date)} ({slot.startTime || '09:00'} - {slot.endTime || '12:00'})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default DateSheets;
