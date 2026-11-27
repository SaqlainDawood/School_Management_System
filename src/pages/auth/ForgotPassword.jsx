import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from 'react-icons/fi';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await forgotPassword(email);
    if (result.success) {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        /* ── Success State ── */
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35 }}
          className="text-center py-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6"
          >
            <FiCheckCircle className="text-4xl text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Check your inbox
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              We've sent a password reset link to
            </p>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-6 break-all">
              {email}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-8">
              Didn't receive it? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium underline underline-offset-2"
              >
                try again
              </button>
              .
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <FiArrowLeft className="text-base" />
              Back to Sign In
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        /* ── Form State ── */
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 mb-4">
              <FiSend className="text-white text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Forgot your password?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              No worries — enter your email and we'll send a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              required
              icon={FiMail}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>

            <div className="text-center pt-1">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <FiArrowLeft className="text-sm" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ForgotPassword;
