import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiCompass } from 'react-icons/fi';
import Button from '../../components/forms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B1120] px-4 py-12">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative inline-block mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
            <FiCompass className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold shadow-md">
            404
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page you requested does not exist or may have been relocated within the platform.
          </p>

          <div className="flex items-center justify-center gap-3 pt-6">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              icon={FiArrowLeft}
            >
              Go Back
            </Button>
            <Link to="/">
              <Button variant="primary" icon={FiHome}>
                Return Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
