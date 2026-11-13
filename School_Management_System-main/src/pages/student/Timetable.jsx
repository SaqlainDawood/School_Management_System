import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Loader from '../../components/common/Loader';
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
      const response = await api.get('/api/timetable/my-timetable');
      setTimetable(response.data.timetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="My Timetable"
        subtitle="View your class schedule"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Day / Time
              </th>
              {periods.map((period) => (
                <th
                  key={period.id}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"
                >
                  <div className="flex flex-col items-center">
                    <span>P{period.id}</span>
                    <span className="text-xs font-normal text-gray-400">
                      {period.time}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {DAYS_OF_WEEK.slice(0, 6).map((day) => (
              <tr
                key={day}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </td>
                {periods.map((period) => {
                  const slot = timetable[day.toLowerCase()]?.find(
                    (p) => p.periodNumber === period.id
                  );
                  return (
                    <td key={period.id} className="px-4 py-3 text-center">
                      {slot ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-700 dark:text-gray-300">
                            {slot.subject?.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {slot.teacher?.user?.name || slot.teacher?.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            Room {slot.room}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTimetable;