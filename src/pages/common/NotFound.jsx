import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-bold text-primary-600 dark:text-primary-400"
        >
          404
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <FiHome className="mr-2" /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;