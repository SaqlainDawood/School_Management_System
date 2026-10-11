import React from 'react';
import { motion } from 'framer-motion';

const DashboardHeader = ({ title, subtitle, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
    >
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap gap-3 flex-shrink-0">{actions}</div>
      )}
    </motion.div>
  );
};

export default DashboardHeader;