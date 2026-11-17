// frontend/src/pages/admin/Fees.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  FiPlus,
  FiTrash2,
  FiDollarSign,
  FiClock,
  FiEye,
  FiDownload,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import VoucherModal from '../../components/modals/VoucherModal';
import AddFeeModal from '../../components/modals/AddFeeModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../utils/api';
import {
  formatDate,
  formatCurrency,
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
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedVoucherFee, setSelectedVoucherFee] = useState(null);
  const [filters, setFilters] = useState({ status: '', feeType: '' });
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    } catch (err) {
      console.error('Error fetching fees:', err);
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
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleAddFee = () => {
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
      toast.success('Fee voucher PDF downloaded');
    } catch (err) {
      console.error('Error downloading PDF:', err);
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
      toast.success('Fee voucher issued successfully');
      setShowAddModal(false);
      fetchFees();
    } catch (err) {
      console.error('Error saving fee:', err);
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors
          .map((e) => e.message)
          .join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(err.response?.data?.message || 'Failed to save fee');
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
    } catch (err) {
      console.error('Error processing payment:', err);
      toast.error(err.response?.data?.message || 'Failed to process payment');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/fees/${deleteTargetId}`);
      toast.success('Fee record deleted');
      setDeleteTargetId(null);
      fetchFees();
    } catch (err) {
      console.error('Error deleting fee:', err);
      toast.error('Failed to delete fee');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Derive genuine KPIs strictly from live fees state
  const metrics = useMemo(() => {
    let totalInvoiced = 0;
    let totalCollected = 0;
    let totalPending = 0;

    fees.forEach((f) => {
      const amt = Number(f.amount) || 0;
      const rem = Number(f.remainingAmount) || 0;
      totalInvoiced += amt;
      if (f.status === 'paid') {
        totalCollected += amt;
      } else if (f.status === 'partial') {
        totalCollected += (amt - rem);
        totalPending += rem;
      } else {
        totalPending += amt;
      }
    });

    return { totalInvoiced, totalCollected, totalPending };
  }, [fees]);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'partial': return 'info';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'neutral';
    }
  };

  if (loading && fees.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee & Financial Operations"
        subtitle="Manage student fee structures, invoice generation, voucher receipts, and collections"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Fees' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddFee}>
            Issue Fee Voucher
          </Button>
        }
      />

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FiDollarSign className="text-xl" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Total Invoiced
              </span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(metrics.totalInvoiced)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FiCheckCircle className="text-xl" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Total Realized
              </span>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-0.5">
                {formatCurrency(metrics.totalCollected)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FiAlertCircle className="text-xl" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Outstanding Balance
              </span>
              <p className="text-xl font-extrabold text-amber-700 dark:text-amber-300 mt-0.5">
                {formatCurrency(metrics.totalPending)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap gap-3">
          <div className="w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <div className="w-48">
            <select
              value={filters.feeType}
              onChange={(e) => setFilters({ ...filters, feeType: e.target.value })}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">All Fee Types</option>
              <option value="tuition">Tuition Fee</option>
              <option value="transport">Transport Fee</option>
              <option value="library">Library Fee</option>
              <option value="lab">Laboratory Fee</option>
              <option value="exam">Examination Fee</option>
              <option value="admission">Admission Fee</option>
              <option value="other">Miscellaneous</option>
            </select>
          </div>

          {(filters.status || filters.feeType) && (
            <button
              onClick={() => setFilters({ status: '', feeType: '' })}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline self-center font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Fees Ledger Table */}
        {fees.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FiDollarSign}
              title="No fee records located"
              description="No fee vouchers match your filter criteria or have been issued yet."
              actionLabel="Issue Fee Voucher"
              onAction={handleAddFee}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Student Name</th>
                  <th className="px-4 py-3">Fee Type</th>
                  <th className="px-4 py-3">Amount Invoiced</th>
                  <th className="px-4 py-3">Payment Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                {fees.map((fee) => {
                  const initial = fee.student?.user?.name?.charAt(0) || 'S';
                  return (
                    <tr
                      key={fee._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 flex items-center justify-center font-bold text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {fee.student?.user?.name || 'Unknown Student'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              Roll: {fee.student?.rollNumber || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                          {fee.feeType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {formatCurrency(fee.amount)}
                        </div>
                        {fee.remainingAmount > 0 && (
                          <div className="text-[11px] text-rose-500 font-medium">
                            Bal: {formatCurrency(fee.remainingAmount)}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium">
                          <FiClock className="text-slate-400 text-xs" />
                          {formatDate(fee.dueDate)}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge
                          variant={getStatusVariant(fee.status)}
                          dot
                        >
                          {getStatusLabel(fee.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewVoucher(fee)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="Inspect Voucher"
                          >
                            <FiEye className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(fee)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                            title="Download Official PDF"
                          >
                            <FiDownload className="text-sm" />
                          </button>
                          {fee.status !== 'paid' && (
                            <button
                              onClick={() => handlePayFee(fee)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors font-semibold flex items-center gap-1"
                              title="Record Payment"
                            >
                              <FiDollarSign className="text-sm" />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteTargetId(fee._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                            title="Delete Fee Record"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
        title="Record Fee Payment Receipt"
        size="md"
      >
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">Student:</span>{' '}
              {selectedFee?.student?.user?.name || 'Unknown'}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">Total Amount:</span>{' '}
              {formatCurrency(selectedFee?.amount)}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">Outstanding Balance:</span>{' '}
              <span className="text-rose-600 dark:text-rose-400 font-bold font-mono">
                {formatCurrency(selectedFee?.remainingAmount)}
              </span>
            </p>
          </div>

          <Input
            label="Payment Amount Received"
            name="amount"
            type="number"
            value={paymentData.amount}
            onChange={handlePaymentChange}
            placeholder="e.g. 5000"
            required
            icon={FiDollarSign}
          />

          <Select
            label="Payment Channel"
            name="paymentMethod"
            value={paymentData.paymentMethod}
            onChange={handlePaymentChange}
            options={[
              { value: 'cash', label: 'Cash Receipt' },
              { value: 'bank_transfer', label: 'Direct Bank Wire / Deposit' },
              { value: 'online', label: 'Online Payment Gateway' },
              { value: 'cheque', label: 'Institutional Cheque' },
              { value: 'card', label: 'Credit / Debit Card Terminal' },
            ]}
          />

          <Input
            label="Transaction Identifier / Slip No. (Optional)"
            name="transactionId"
            value={paymentData.transactionId}
            onChange={handlePaymentChange}
            placeholder="e.g. TXN-892348"
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowPayModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
            >
              Confirm Payment Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Fee Invoice"
        message="Are you sure you want to delete this fee voucher? Financial ledger records and receipts associated with this voucher will be affected."
        confirmText="Delete Invoice"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Fees;
