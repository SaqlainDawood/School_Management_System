import React from 'react';
import { motion } from 'framer-motion';
import {
  FiUserPlus,
  FiBookOpen,
  FiDollarSign,
  FiAward,
  FiClock,
  FiCheckCircle,
} from 'react-icons/fi';

const activities = [
  {
    id: 1,
    type: 'student',
    icon: FiUserPlus,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    message: 'New student enrolled: John Doe',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'assignment',
    icon: FiBookOpen,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    message: 'Assignment submitted: Math Homework',
    time: '4 hours ago',
  },
  {
    id: 3,
    type: 'fee',
    icon: FiDollarSign,
    color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    message: 'Fee payment received: Rs. 5,000',
    time: '6 hours ago',
  },
  {
    id: 4,
    type: 'result',
    icon: FiAward,
    color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
    message: 'Exam results published for Class 10',
    time: '1 day ago',
  },
  {
    id: 5,
    type: 'attendance',
    icon: FiClock,
    color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20',
    message: 'Attendance marked for today',
    time: '1 day ago',
  },
];

const RecentActivity = ({ items = activities, showViewAll = true }) => {
  return (
    <div className="space-y-3">
      {items.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
        >
          <div
            className={`p-2 rounded-lg flex-shrink-0 ${
              activity.color || 'text-gray-600 bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <activity.icon className="text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              {activity.message}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
              <FiClock className="mr-1" /> {activity.time}
            </p>
          </div>
          <div className="flex-shrink-0">
            <FiCheckCircle className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>
      ))}

      {showViewAll && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium flex items-center transition-colors">
            <FiClock className="mr-2" /> View all activities
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;