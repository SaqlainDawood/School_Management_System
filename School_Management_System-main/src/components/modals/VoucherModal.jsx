import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiDownload,
  FiPrinter,
  FiUser,
  FiBook,
  FiDollarSign,
  FiCreditCard,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiFileText,
  FiShield,
  FiTrendingUp,
} from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../utils/helpers';

const VoucherModal = ({ isOpen, onClose, fee, onDownloadPDF, onPay }) => {
  const [activeTab, setActiveTab] = useState('voucher');

  if (!isOpen || !fee) return null;

  const student = fee.student || {};
  const user = student.user || {};
  const classData = student.class || {};
  const feeData = fee;

  const totalAmount = feeData.amount || 0;
  const paidAmount = feeData.paidAmount || 0;
  const remainingAmount = feeData.remainingAmount || totalAmount - paidAmount;

  const getStatusBadge = (status) => {
    const configs = {
      paid: {
        label: 'Paid',
        color:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60',
        icon: FiCheckCircle,
      },
      pending: {
        label: 'Pending',
        color:
          'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60',
        icon: FiClock,
      },
      overdue: {
        label: 'Overdue',
        color:
          'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60',
        icon: FiAlertCircle,
      },
      partial: {
        label: 'Partial',
        color:
          'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60',
        icon: FiInfo,
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusBadge(feeData.status);
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="voucher-dialog-title"
            className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white dark:bg-[#162033] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-[#162033]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 rounded-t-2xl">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
                    <FiFileText className="text-xl" />
                  </div>
                  <div>
                    <h2 id="voucher-dialog-title" className="text-xl font-bold text-slate-900 dark:text-white">
                      Fee Voucher
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Invoice #{feeData._id?.slice(-8) || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${statusConfig.color}`}
                  >
                    <StatusIcon className="text-xs" />
                    {statusConfig.label}
                  </span>
                  <button
                    onClick={onClose}
                    aria-label="Close voucher dialog"
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 px-4 md:px-6 pb-3">
                <button
                  onClick={() => setActiveTab('voucher')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'voucher'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Voucher Preview
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'payment'
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Payment Details
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-8">
              {activeTab === 'voucher' ? (
                <div className="space-y-6">
                  {/* School Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-[#162033] dark:to-slate-950 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-lg">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                          <FiBook className="text-3xl text-indigo-300" />
                        </div>
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Springfield International School
                          </h1>
                          <p className="text-indigo-200 text-sm mt-0.5">
                            Excellence in Education • Since 2005
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                          <p className="text-xs text-indigo-200 font-medium">
                            Academic Session
                          </p>
                          <p className="font-semibold text-white">
                            {feeData.academicYear || '2026-2027'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Info & Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <FiUser className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Student Information
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Student Name
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {user.name || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Student ID
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {student.studentId || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Roll Number
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {student.rollNumber || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Class
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {classData.name || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Section
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {student.section || 'A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Contact
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {user.phone || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <FiTrendingUp className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Fee Status
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="text-center">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold ${statusConfig.color}`}
                          >
                            <StatusIcon className="text-sm" />
                            {statusConfig.label}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-slate-50 dark:bg-[#111827] rounded-lg border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Total
                            </p>
                            <p className="font-bold text-slate-900 dark:text-white mt-1">
                              {formatCurrency(totalAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 dark:bg-[#111827] rounded-lg border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Paid
                            </p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                              {formatCurrency(paidAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 dark:bg-[#111827] rounded-lg border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Remaining
                            </p>
                            <p className="font-bold text-rose-600 dark:text-rose-400 mt-1">
                              {formatCurrency(remainingAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 dark:bg-[#111827] rounded-lg border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Due Date
                            </p>
                            <p className="font-bold text-slate-900 dark:text-white text-xs mt-1">
                              {formatDate(feeData.dueDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                      <FiBook className="text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Fee Breakdown
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50/80 dark:bg-[#111827]/80">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Fee Type
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                              1
                            </td>
                            <td className="px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white capitalize">
                              {feeData.feeType} Fee
                            </td>
                            <td className="px-4 py-3.5 text-sm text-right font-medium text-slate-900 dark:text-white">
                              {formatCurrency(totalAmount)}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}
                              >
                                <StatusIcon className="text-xs" />
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-indigo-50/40 dark:bg-indigo-950/20 border-t-2 border-slate-200 dark:border-slate-800">
                          <tr>
                            <td
                              colSpan="2"
                              className="px-4 py-3.5 text-sm font-bold text-right text-indigo-700 dark:text-indigo-300"
                            >
                              Grand Total
                            </td>
                            <td className="px-4 py-3.5 text-sm font-bold text-right text-indigo-700 dark:text-indigo-300">
                              {formatCurrency(totalAmount)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Payment Info & Instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <FiCreditCard className="text-emerald-600 dark:text-emerald-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Payment Information
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Payment Method
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white capitalize mt-0.5">
                              {feeData.paymentMethod || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Transaction ID
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 truncate">
                              {feeData.transactionId || 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Payment Date
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                              {feeData.paymentDate
                                ? formatDate(feeData.paymentDate)
                                : 'N/A'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-50/60 dark:bg-[#111827]/60 border border-slate-100 dark:border-slate-800/80">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                              Receipt No.
                            </p>
                            <p className="font-semibold text-slate-900 dark:text-white text-xs mt-0.5 truncate">
                              {feeData.receiptNumber || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                        <FiInfo className="text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          Important Instructions
                        </h3>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                          <li className="flex items-start gap-2.5">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            Please pay before the due date to avoid late fees.
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            Keep this voucher safe for future reference.
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            Bring this receipt during payment.
                          </li>
                          <li className="flex items-start gap-2.5">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            Fee once paid is non-refundable.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Signature Area */}
                  <div className="bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                      <FiShield className="text-amber-600 dark:text-amber-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Authorized Signatures
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="h-12 border-b-2 border-slate-300 dark:border-slate-700 mb-2"></div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Account Officer
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="h-12 border-b-2 border-slate-300 dark:border-slate-700 mb-2"></div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Cashier
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="h-12 border-b-2 border-slate-300 dark:border-slate-700 mb-2"></div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            Principal
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-[#111827] rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                            <FiShield className="text-2xl text-slate-400" />
                          </div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                            School Stamp
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Payment Details Tab
                <div className="space-y-6">
                  <div className="bg-white dark:bg-[#162033] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900/60 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                      <FiCreditCard className="text-indigo-600 dark:text-indigo-400" />
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Payment History
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {(feeData.paymentHistory || []).length > 0 ? (
                          feeData.paymentHistory.map((payment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-slate-800"
                            >
                              <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {formatCurrency(payment.amount)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-0.5">
                                  {payment.method}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {formatDate(payment.date)}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {payment.transactionId}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                            No payment history available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-5 border border-indigo-200/80 dark:border-indigo-900/50">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Total Payments
                      </p>
                      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                        {formatCurrency(paidAmount)}
                      </p>
                    </div>
                    <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-200/80 dark:border-amber-900/50">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
                        {formatCurrency(remainingAmount)}
                      </p>
                    </div>
                    <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-5 border border-purple-200/80 dark:border-purple-900/50">
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Payment Status
                      </p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1 capitalize">
                        {feeData.status}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white/95 dark:bg-[#162033]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 rounded-b-2xl p-4 md:p-6 mt-6 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 text-sm font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <FiPrinter /> Print
                </button>
                <button
                  onClick={onDownloadPDF}
                  className="px-4 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                >
                  <FiDownload /> Download PDF
                </button>
                {feeData.status !== 'paid' && onPay && (
                  <button
                    onClick={() => onPay(feeData)}
                    className="px-4 py-2.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FiDollarSign /> Pay Now
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default VoucherModal;
