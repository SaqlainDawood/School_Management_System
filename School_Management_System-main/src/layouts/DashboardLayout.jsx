import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {children || <Outlet />}
    </motion.div>
  );
};

export default DashboardLayout;