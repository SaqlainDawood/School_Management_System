import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiBookOpen,
  FiClock,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Loader from '../../components/common/Loader';
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
      setClasses(response.data.classes);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="My Classes"
        subtitle="Classes you are teaching"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {cls.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Code: {cls.code}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiUsers className="text-gray-400" />
                <span>{cls.students?.length || 0} Students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiBookOpen className="text-gray-400" />
                <span>{cls.subjects?.length || 0} Subjects</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiClock className="text-gray-400" />
                <span>
                  {cls.subjects?.reduce(
                    (sum, s) => sum + (s.period?.perWeek || 0),
                    0
                  )}{' '}
                  Periods/Week
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
                View Details →
              </button>
            </div>
          </motion.div>
        ))}

        {classes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No classes assigned yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherClasses;
