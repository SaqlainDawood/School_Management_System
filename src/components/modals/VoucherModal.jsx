import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiDownload,
  FiPrinter,
  FiUser,
  FiMail,
  FiCalendar,
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
          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: FiCheckCircle,
      },
      pending: {
        label: 'Pending',
        color:
          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: FiClock,
      },
      overdue: {
        label: 'Overdue',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: FiAlertCircle,
      },
      partial: {
        label: 'Partial',
        color:
          'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-7xl max-h-[95vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                    <FiFileText className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                      Fee Voucher
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Invoice #{feeData._id?.slice(-8) || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${statusConfig.color}`}
                  >
                    <StatusIcon className="text-sm" />
                    {statusConfig.label}
                  </span>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiX className="text-xl text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="flex gap-1 px-4 md:px-6 pb-2">
                <button
                  onClick={() => setActiveTab('voucher')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'voucher'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Voucher Preview
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'payment'
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                          <FiBook className="text-3xl text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold">
                            Springfield International School
                          </h1>
                          <p className="text-blue-100 text-sm">
                            Excellence in Education • Since 2005
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                          <p className="text-xs text-blue-200">
                            Academic Session
                          </p>
                          <p className="font-semibold">
                            {feeData.academicYear || '2026-2027'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <FiUser className="text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          Student Information
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Student Name
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {user.name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Student ID
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {student.studentId || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Roll Number
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {student.rollNumber || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Class
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {classData.name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Section
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {student.section || 'A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Contact
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {user.phone || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <FiTrendingUp className="text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          Fee Status
                        </h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="text-center">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.color}`}
                          >
                            <StatusIcon className="text-lg" />
                            {statusConfig.label}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Total
                            </p>
                            <p className="font-bold text-gray-800 dark:text-white">
                              {formatCurrency(totalAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Paid
                            </p>
                            <p className="font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(paidAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Remaining
                            </p>
                            <p className="font-bold text-red-600 dark:text-red-400">
                              {formatCurrency(remainingAmount)}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Due Date
                            </p>
                            <p className="font-bold text-gray-800 dark:text-white text-xs">
                              {formatDate(feeData.dueDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <FiBook className="text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Fee Breakdown
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              #
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Fee Type
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                              1
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white capitalize">
                              {feeData.feeType} Fee
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-gray-800 dark:text-white">
                              {formatCurrency(totalAmount)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                              >
                                <StatusIcon className="text-xs" />
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-blue-50 dark:bg-blue-900/20 border-t-2 border-gray-200 dark:border-gray-600">
                          <tr>
                            <td
                              colSpan="2"
                              className="px-4 py-3 text-sm font-bold text-right text-blue-700 dark:text-blue-400"
                            >
                              Grand Total
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-right text-blue-700 dark:text-blue-400">
                              {formatCurrency(totalAmount)}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <FiCreditCard className="text-green-600 dark:text-green-400" />
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          Payment Information
                        </h3>
                      </div>
                      <div className="p-6 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Payment Method
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white capitalize">
                              {feeData.paymentMethod || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Transaction ID
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white text-xs">
                              {feeData.transactionId || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Payment Date
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {feeData.paymentDate
                                ? formatDate(feeData.paymentDate)
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receipt No.
                            </p>
                            <p className="font-medium text-gray-800 dark:text-white text-xs">
                              {feeData.receiptNumber || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <FiInfo className="text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          Important Instructions
                        </h3>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Please pay before the due date to avoid late fees.
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Keep this voucher safe for future reference.
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Bring this receipt during payment.
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-500 mt-0.5">•</span>
                            Fee once paid is non-refundable.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Signature Area */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <FiShield className="text-amber-600 dark:text-amber-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Authorized Signatures
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="h-12 border-b-2 border-gray-300 dark:border-gray-600 mb-1"></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Account Officer
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="h-12 border-b-2 border-gray-300 dark:border-gray-600 mb-1"></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Cashier
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="h-12 border-b-2 border-gray-300 dark:border-gray-600 mb-1"></div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Principal
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <FiShield className="text-2xl text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                      <FiCreditCard className="text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        Payment History
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {(feeData.paymentHistory || []).length > 0 ? (
                          feeData.paymentHistory.map((payment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {formatCurrency(payment.amount)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {payment.method}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(payment.date)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {payment.transactionId}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                            No payment history available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total Payments
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                        {formatCurrency(paidAmount)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                        {formatCurrency(remainingAmount)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
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
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl p-4 md:p-6 mt-6 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiPrinter /> Print
                </button>
                <button
                  onClick={onDownloadPDF}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <FiDownload /> Download PDF
                </button>
                {feeData.status !== 'paid' && onPay && (
                  <button
                    onClick={() => onPay(feeData)}
                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
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