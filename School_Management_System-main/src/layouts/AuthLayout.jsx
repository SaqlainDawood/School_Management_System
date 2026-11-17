import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBookOpen, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
      {/* ── Left Hero Panel (Desktop) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0F172A] overflow-hidden flex-col justify-between p-12 text-white">
        {/* Subtle background glow accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand / Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <FiBookOpen className="text-white text-xl" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">EduManage</span>
              <span className="block text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">Enterprise SaaS</span>
            </div>
          </div>
        </div>

        {/* Main Hero Copy */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/40 border border-indigo-700/50 text-indigo-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Unified Education Management Platform
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            Intelligent administration for modern academic institutions.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Seamlessly oversee students, teachers, academics, examinations, finances, and operations through an enterprise-grade digital ecosystem.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2">
                <FiUsers className="text-base" />
              </div>
              <h4 className="text-sm font-semibold text-white">Multi-Role Portals</h4>
              <p className="text-xs text-slate-400 mt-1">Dedicated workflows for 7 institutional roles</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-2">
                <FiTrendingUp className="text-base" />
              </div>
              <h4 className="text-sm font-semibold text-white">Academic Performance</h4>
              <p className="text-xs text-slate-400 mt-1">Real-time attendance, results and reporting</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-6">
          <span>&copy; {new Date().getFullYear()} EduManage Enterprise</span>
          <span className="flex items-center gap-1.5">
            <FiShield className="text-emerald-500" /> Secure SSL Encrypted
          </span>
        </div>
      </div>

      {/* ── Right Form Panel (Form Content) ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
              <FiBookOpen className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EduManage</span>
          </div>

          <div className="bg-white dark:bg-[#162033] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
