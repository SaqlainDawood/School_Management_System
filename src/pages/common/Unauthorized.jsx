import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto"
        >
          <FiAlertTriangle className="text-5xl text-red-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          You don't have permission to access this page.
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

export default Unauthorized;