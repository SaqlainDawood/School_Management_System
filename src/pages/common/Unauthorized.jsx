import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiHome, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/forms/Button';

const Unauthorized = () => {
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
          <div className="w-24 h-24 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
            <FiLock className="w-12 h-12" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-mono text-xs font-bold shadow-md">
            403
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Access Restricted
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
            You do not possess the necessary institutional role permissions to view this resource. Contact your school administrator for privilege elevation.
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

export default Unauthorized;
