import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiBookOpen,
  FiClock,
  FiLayers,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/teachers/classes');
      setClasses(response.data?.classes || []);
    } catch (err) {
      console.error('Error fetching teacher classes:', err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Assigned Classes"
        subtitle="Rosters and curriculum courses assigned to your teaching load"
        breadcrumbs={[
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'My Classes' },
        ]}
      />

      {classes.length === 0 ? (
        <div className="card p-12">
          <EmptyState
            icon={FiLayers}
            title="No class cohorts assigned"
            description="You have not been designated as a class teacher or course instructor for any active class cohort."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls) => {
            const studentCount = cls.students?.length || 0;
            const subjectCount = cls.subjects?.length || 0;
            const periodCount = cls.subjects?.reduce(
              (sum, s) => sum + (s.period?.perWeek || 0),
              0
            ) || 0;

            return (
              <div
                key={cls._id}
                className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                      <FiLayers />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Code: {cls.code || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiUsers className="text-indigo-500" /> Roster Count:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {studentCount} Students
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiBookOpen className="text-emerald-500" /> Curriculum:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {subjectCount} Subjects
                      </span>
                    </div>
                    {periodCount > 0 && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <FiClock className="text-amber-500" /> Instruction:
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {periodCount} Periods / Wk
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
