import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import Button from '../forms/Button';

const ErrorState = ({
  title = 'Unable to load data',
  message = 'An unexpected error occurred while communicating with the server. Please try again.',
  onRetry,
  className = '',
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
        <FiAlertTriangle className="text-2xl" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        {message}
      </p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            icon={FiRefreshCw}
            onClick={onRetry}
          >
            Retry Request
          </Button>
        )}
        {action}
      </div>
    </motion.div>
  );
};

export default ErrorState;

