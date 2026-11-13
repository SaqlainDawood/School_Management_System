import React from 'react';
import { motion } from 'framer-motion';

const ChartCard = ({
  title,
  icon: Icon,
  children,
  subtitle,
  action,
  className = '',
  height = 'h-[300px]',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 min-w-0">
          {Icon && (
            <Icon className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
            {title}
          </h3>
        </div>
        {(subtitle || action) && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {subtitle && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </span>
            )}
            {action}
          </div>
        )}
      </div>
      <div className={`w-full ${height}`}>{children}</div>
    </motion.div>
  );
};

export default ChartCard;