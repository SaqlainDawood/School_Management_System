import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
  color = 'primary',
  subtitle,
}) => {
  const colorClasses = {
    primary:
      'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    secondary:
      'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400',
    success:
      'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning:
      'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg flex-shrink-0 ${colorClasses[color]}`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>

      {trend !== undefined && trend !== null && (
        <div className="flex items-center mt-4">
          <span
            className={`text-sm font-medium flex items-center ${
              trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trendDirection === 'up' ? (
              <FiTrendingUp className="mr-1" />
            ) : (
              <FiTrendingDown className="mr-1" />
            )}
            {trend}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            from last month
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;