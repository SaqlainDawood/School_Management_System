// frontend/src/pages/admin/Fees.jsx
import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDollarSign,
  FiClock,
  FiEye,
  FiDownload,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import VoucherModal from '../../components/modals/VoucherModal';
import AddFeeModal from '../../components/modals/AddFeeModal';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
} from '../../utils/helpers';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedVoucherFee, setSelectedVoucherFee] = useState(null);
  const [filters, setFilters] = useState({ status: '', feeType: '' });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    transactionId: '',
    remarks: '',
  });

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, [filters]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/fees', { params: filters });
      setFees(response.data.fees || []);
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students', {
        params: { limit: 100 },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddFee = () => {
    setEditingFee(null);
    setShowAddModal(true);
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

  const handlePayFee = (fee) => {
    setSelectedFee(fee);
    setPaymentData({
      amount: fee.remainingAmount || fee.amount || '',
      paymentMethod: 'cash',
      transactionId: '',
      remarks: '',
    });
    setShowPayModal(true);
  };

  const handlePaymentChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      await api.post('/api/fees', data);
      toast.success('Fee created successfully');
      setShowAddModal(false);
      fetchFees();
    } catch (error) {
      console.error('❌ Error saving fee:', error);
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors
          .map((e) => e.message)
          .join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || 'Failed to save fee');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setFormLoading(true);
    try {
      await api.post(`/api/fees/${selectedFee._id}/pay`, {
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        transactionId: paymentData.transactionId || undefined,
        remarks: paymentData.remarks || undefined,
      });
      toast.success('Payment recorded successfully');
      setShowPayModal(false);
      fetchFees();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      try {
        await api.delete(`/api/fees/${id}`);
        toast.success('Fee record deleted successfully');
        fetchFees();
      } catch (error) {
        console.error('Error deleting fee:', error);
        toast.error('Failed to delete fee');
      }
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const label = getStatusLabel(status);
    return <span className={`badge badge-${color}`}>{label}</span>;
  };

  if (loading && fees.length === 0) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Fee Management"
        subtitle="Manage student fees"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddFee}>
            Add Fee
          </Button>
        }
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4">
            <Select
              name="status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              options={[
                { value: '', label: 'All Status' },
                { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'partial', label: 'Partial' },
              ]}
              className="w-48"
              label="Filter by Status"
            />
            <Select
              name="feeType"
              value={filters.feeType}
              onChange={(e) =>
                setFilters({ ...filters, feeType: e.target.value })
              }
              options={[
                { value: '', label: 'All Types' },
                { value: 'tuition', label: 'Tuition' },
                { value: 'transport', label: 'Transport' },
                { value: 'library', label: 'Library' },
                { value: 'lab', label: 'Lab' },
                { value: 'exam', label: 'Exam' },
                { value: 'admission', label: 'Admission' },
                { value: 'other', label: 'Other' },
              ]}
              className="w-48"
              label="Filter by Type"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Student
                </th>
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
                    No fees found
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {fee.student?.user?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {fee.student?.rollNumber || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-sm text-gray-700 dark:text-gray-300">
                        {fee.feeType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatCurrency(fee.amount)}
                      </div>
                      {fee.remainingAmount > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Remaining: {formatCurrency(fee.remainingAmount)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <FiClock className="text-gray-400" />
                        {formatDate(fee.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(fee.status)}</td>
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
                        {fee.status !== 'paid' && (
                          <button
                            onClick={() => handlePayFee(fee)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-green-600"
                            title="Pay Fee"
                          >
                            <FiDollarSign className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(fee._id)}
                          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="text-sm" />
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

      {/* Add Fee Modal */}
      <AddFeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmit}
        students={students}
        loading={formLoading}
      />

      {/* Voucher Modal */}
      <VoucherModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        fee={selectedVoucherFee}
        onDownloadPDF={() => handleDownloadPDF(selectedVoucherFee)}
        onPay={handlePayFee}
      />

      {/* Pay Fee Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        title="Record Payment"
        size="md"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Student:</strong>{' '}
              {selectedFee?.student?.user?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Total Amount:</strong> {formatCurrency(selectedFee?.amount)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Remaining:</strong>{' '}
              {formatCurrency(selectedFee?.remainingAmount)}
            </p>
          </div>

          <Input
            label="Payment Amount"
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handlePaymentChange}
            placeholder="Enter payment amount"
            required
            icon={FiDollarSign}
          />

          <Select
            label="Payment Method"
            name="paymentMethod"
            value={paymentData.paymentMethod}
            onChange={handlePaymentChange}
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'online', label: 'Online' },
              { value: 'cheque', label: 'Cheque' },
              { value: 'card', label: 'Card' },
            ]}
          />

          <Input
            label="Transaction ID (Optional)"
            name="transactionId"
            value={paymentData.transactionId}
            onChange={handlePaymentChange}
            placeholder="Enter transaction ID"
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPayModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              loading={formLoading}
              className="w-full sm:w-auto"
            >
              Record Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;