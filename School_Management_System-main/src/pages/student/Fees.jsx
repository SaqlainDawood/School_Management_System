import React, { useState, useEffect } from 'react';
import {
  FiDollarSign,
  FiEye,
  FiDownload,
  FiFileText,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import VoucherModal from '../../components/modals/VoucherModal';
import api from '../../utils/api';
import { formatDate, formatCurrency } from '../../utils/helpers';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucherFee, setSelectedVoucherFee] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchFees = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/fees/my-fees');
        if (ignore) return;
        setFees(response.data?.fees || []);
        setSummary(response.data?.summary || {});
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching fees:', error);
          toast.error('Failed to load fee ledger');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchFees();

    return () => {
      ignore = true;
    };
  }, []);

  const handleViewVoucher = (fee) => {
    setSelectedVoucherFee(fee);
    setShowVoucherModal(true);
  };

  const handleDownloadPDF = async (fee) => {
    try {
      setDownloadingId(fee._id);
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
    } catch (error) {
      console.error('Error downloading voucher PDF:', error);
      toast.error('Failed to download fee voucher');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tuition & Fee Records"
        subtitle="Manage invoices, fee vouchers, and payment histories"
        breadcrumbs={[
          { label: 'Student', href: '/student/dashboard' },
          { label: 'Fees' },
        ]}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Assessment"
          value={formatCurrency(summary.totalAmount || 0)}
          icon={FiDollarSign}
          color="primary"
          subtitle="Cumulative fees"
        />
        <StatsCard
          title="Amount Paid"
          value={formatCurrency(summary.paidAmount || 0)}
          icon={FiCheckCircle}
          color="success"
          subtitle="Cleared balance"
        />
        <StatsCard
          title="Pending Due"
          value={formatCurrency(summary.pendingAmount || 0)}
          icon={FiClock}
          color="danger"
          subtitle="Outstanding balance"
        />
        <StatsCard
          title="Payment Status"
          value={summary.pendingFees > 0 ? `${summary.paidFees || 0}/${summary.totalFees || 0} Paid` : 'All Cleared'}
          icon={FiFileText}
          color={summary.pendingFees > 0 ? 'warning' : 'success'}
          subtitle="Settlement ratio"
        />
      </div>

      {/* Fees Table */}
      <SectionCard title="Fee Invoices" subtitle="Detailed statement of dues and vouchers">
        {fees.length === 0 ? (
          <EmptyState
            icon={FiDollarSign}
            title="No fee records"
            description="You do not have any pending or historical fee vouchers recorded in the ledger."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Fee Type</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {fees.map((fee) => (
                  <tr key={fee._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 capitalize">
                      {fee.feeType || 'Tuition'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {formatCurrency(fee.amount)}
                      </div>
                      {fee.remainingAmount > 0 && (
                        <div className="text-xs text-rose-600 font-medium">
                          Remaining: {formatCurrency(fee.remainingAmount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {formatDate(fee.dueDate)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={fee.status || 'pending'} />
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {fee.paymentDate ? formatDate(fee.paymentDate) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewVoucher(fee)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 inline-flex items-center gap-1.5 transition-colors"
                          title="View Voucher"
                        >
                          <FiEye />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(fee)}
                          disabled={downloadingId === fee._id}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-600 hover:bg-primary-500 text-white inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
                          title="Download PDF Voucher"
                        >
                          <FiDownload />
                          <span>{downloadingId === fee._id ? 'Downloading...' : 'PDF'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Voucher Modal */}
      {showVoucherModal && (
        <VoucherModal
          isOpen={showVoucherModal}
          onClose={() => setShowVoucherModal(false)}
          fee={selectedVoucherFee}
          onDownloadPDF={() => handleDownloadPDF(selectedVoucherFee)}
        />
      )}
    </div>
  );
};

export default StudentFees;
