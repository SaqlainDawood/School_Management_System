import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({
  icon: Icon,
  title = 'No data found',
  description = '',
  action,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 ${className}`}
    >
      {Icon && (
        <Icon className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      )}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
      )}
      {action && <div className="flex justify-center">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;