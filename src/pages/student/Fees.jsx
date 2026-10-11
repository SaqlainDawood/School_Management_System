import React, { useState, useEffect } from 'react';
import {
  FiDollarSign,
  FiEye,
  FiDownload,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Loader from '../../components/common/Loader';
import VoucherModal from '../../components/modals/VoucherModal';
import api from '../../utils/api';
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
} from '../../utils/helpers';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucherFee, setSelectedVoucherFee] = useState(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/fees/my-fees');
      setFees(response.data.fees || []);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  };

  const handleViewVoucher = (fee) => {
    setSelectedVoucherFee(fee);
    setShowVoucherModal(true);
  };

  const handleDownloadPDF = async (fee) => {
    try {
      const response = await api.get(`/api/fees/${fee._id}/download-pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fee-voucher-${fee._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <span className={`badge badge-${color}`}>{label}</span>;
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="My Fees"
        subtitle="View your fee status and history"
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Fees</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {formatCurrency(summary.totalAmount)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.paidAmount)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.pendingAmount)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {summary.pendingFees > 0
              ? `${summary.paidFees}/${summary.totalFees}`
              : 'All Paid'}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {fees.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    <FiDollarSign className="text-4xl text-gray-300 mx-auto mb-3" />
                    No fee records found
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {fee.feeType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700 dark:text-gray-300">
                        {formatCurrency(fee.amount)}
                      </div>
                      {fee.remainingAmount > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Remaining: {formatCurrency(fee.remainingAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {formatDate(fee.dueDate)}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(fee.status)}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {fee.paymentDate ? formatDate(fee.paymentDate) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewVoucher(fee)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-blue-600"
                          title="View Voucher"
                        >
                          <FiEye className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(fee)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-indigo-600"
                          title="Download PDF"
                        >
                          <FiDownload className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Modal */}
      <VoucherModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        fee={selectedVoucherFee}
        onDownloadPDF={() => handleDownloadPDF(selectedVoucherFee)}
      />
    </div>
  );
};

export default StudentFees;