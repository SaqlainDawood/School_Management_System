import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiBookOpen,
  FiClock,
  FiLayers,
  FiEye,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/modals/Modal';
import Button from '../../components/forms/Button';
import api from '../../utils/api';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingClass, setViewingClass] = useState(null);

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

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={FiEye}
                    onClick={() => setViewingClass(cls)}
                    className="w-full justify-center"
                  >
                    View Students & Subjects
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(viewingClass)}
        onClose={() => setViewingClass(null)}
        title={viewingClass ? `${viewingClass.name} — Roster & Subjects` : 'Class Details'}
        size="lg"
      >
        {viewingClass && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Subjects ({viewingClass.subjects?.length || 0})
              </h4>
              {viewingClass.subjects?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {viewingClass.subjects.map((sub, idx) => (
                    <span
                      key={sub._id || sub.subject?._id || idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-900/50"
                    >
                      <FiBookOpen className="text-[11px]" />
                      {sub.subject?.name || sub.name || 'Subject'}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No subjects listed for this cohort.</p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Enrolled Students ({viewingClass.students?.length || 0})
              </h4>
              {viewingClass.students?.length > 0 ? (
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {viewingClass.students.map((st, idx) => (
                    <div key={st._id || idx} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {(st.user?.name || st.name || 'S').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {st.user?.name || st.name || 'Student'}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {st.user?.email || st.email || ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500 shrink-0">
                        Roll: {st.rollNumber || st.studentId || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No students enrolled in this cohort.</p>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setViewingClass(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TeacherClasses;
