import React, { useState, useEffect } from 'react';
import { FiClock, FiCalendar, FiBook } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { DAYS_OF_WEEK } from '../../utils/constants';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  const periods = [
    { id: 1, time: '08:00 - 08:45' },
    { id: 2, time: '08:45 - 09:30' },
    { id: 3, time: '09:30 - 10:15' },
    { id: 4, time: '10:30 - 11:15' },
    { id: 5, time: '11:15 - 12:00' },
    { id: 6, time: '12:00 - 12:45' },
    { id: 7, time: '13:30 - 14:15' },
    { id: 8, time: '14:15 - 15:00' },
  ];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/timetable/my-timetable');
      setTimetable(response.data?.timetable || {});
    } catch (error) {
      console.error('Error fetching timetable:', error);
      setTimetable({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const hasSlots = Object.values(timetable || {}).some(
    (daySlots) => Array.isArray(daySlots) && daySlots.length > 0
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule"
        subtitle="Weekly period allocations, classrooms, and subject professors"
        breadcrumbs={[
          { label: 'Student', href: '/student/dashboard' },
          { label: 'Timetable' },
        ]}
      />

      <SectionCard title="Weekly Timetable Grid" subtitle="Regular schedule Monday through Saturday">
        {!hasSlots ? (
          <EmptyState
            icon={FiCalendar}
            title="Timetable Not Published"
            description="Your class schedule has not been finalized or published by administration."
          />
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
                  <th className="py-3.5 px-4 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase w-32">
                    Day / Period
                  </th>
                  {periods.map((period) => (
                    <th
                      key={period.id}
                      className="py-3.5 px-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 border-l border-slate-200/80 dark:border-slate-800"
                    >
                      <div className="font-bold text-slate-900 dark:text-slate-100">P{period.id}</div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">{period.time}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {DAYS_OF_WEEK.slice(0, 6).map((day) => {
                  const daySlots = timetable[day.toLowerCase()] || [];

                  return (
                    <tr key={day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100 bg-slate-50/40 dark:bg-slate-800/20">
                        {day}
                      </td>
                      {periods.map((period) => {
                        const slot = daySlots.find(
                          (p) => p.periodNumber === period.id
                        );

                        return (
                          <td
                            key={period.id}
                            className="py-3 px-2 text-center border-l border-slate-100 dark:border-slate-800/60"
                          >
                            {slot ? (
                              <div className="p-2.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/30 border border-primary-200/50 dark:border-primary-800/40 text-left">
                                <div className="font-bold text-xs text-primary-900 dark:text-primary-200 truncate">
                                  {slot.subject?.name || 'Class Session'}
                                </div>
                                <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                                  {slot.teacher?.user?.name || slot.teacher?.name || 'Assigned'}
                                </div>
                                {slot.room && (
                                  <div className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 mt-1">
                                    Room {slot.room}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default StudentTimetable;
