import React, { useState, useEffect } from 'react';
import {
  FiDollarSign,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiFileText,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';
import { formatDate, formatCurrency } from '../../utils/helpers';

const ParentFees = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchingFees, setFetchingFees] = useState(false);

  useEffect(() => {
    let ignore = false;
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/parents/dashboard');
        if (ignore) return;
        const kids = response.data?.dashboard?.parent?.children || [];
        setChildren(kids);
        if (kids.length > 0) setSelectedChild(kids[0]._id);
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching children:', error);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchChildren();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedChild) return;
    let ignore = false;
    const fetchFees = async () => {
      try {
        setFetchingFees(true);
        const response = await api.get(`/api/parents/child/${selectedChild}/fees`);
        if (ignore) return;
        setFees(response.data?.fees || []);
        setSummary(response.data?.summary || {});
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching fees:', error);
          setFees([]);
          setSummary({});
        }
      } finally {
        if (!ignore) {
          setFetchingFees(false);
        }
      }
    };

    fetchFees();

    return () => {
      ignore = true;
    };
  }, [selectedChild]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Children Fee Statements"
        subtitle="Review invoices, dues, and payment transactions"
        breadcrumbs={[
          { label: 'Parent', href: '/parent/dashboard' },
          { label: 'Fees' },
        ]}
      />

      {children.length === 0 ? (
        <EmptyState
          icon={FiUser}
          title="No Students Associated"
          description="There are currently no students linked to your account."
        />
      ) : (
        <>
          <div className="card p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4">
            <Select
              label="Select Student"
              name="child"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              options={children.map((c) => ({
                value: c._id,
                label: `${c.user?.name || 'Student'} (${c.class?.name || 'Class'})`,
              }))}
              className="w-72"
              icon={FiUser}
            />
          </div>

          {fetchingFees ? (
            <Loader />
          ) : (
            <>
              {/* Financial Summary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Fee"
                  value={formatCurrency(summary.totalAmount || 0)}
                  icon={FiDollarSign}
                  color="primary"
                />
                <StatsCard
                  title="Total Paid"
                  value={formatCurrency(summary.paidAmount || 0)}
                  icon={FiCheckCircle}
                  color="success"
                />
                <StatsCard
                  title="Balance Due"
                  value={formatCurrency(summary.pendingAmount || 0)}
                  icon={FiClock}
                  color="danger"
                />
                <StatsCard
                  title="Invoices Settled"
                  value={summary.pendingFees > 0 ? `${summary.paidFees || 0}/${summary.totalFees || 0} Cleared` : 'All Paid'}
                  icon={FiFileText}
                  color={summary.pendingFees > 0 ? 'warning' : 'success'}
                />
              </div>

              {/* Fees Table */}
              <SectionCard title="Fee Ledger" subtitle={`Financial records for ${children.find((c) => c._id === selectedChild)?.user?.name || 'Selected Student'}`}>
                {fees.length === 0 ? (
                  <EmptyState
                    icon={FiDollarSign}
                    title="No invoices found"
                    description="No fee vouchers or invoices have been posted for this student."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="py-3 px-4">Fee Description</th>
                          <th className="py-3 px-4">Total Amount</th>
                          <th className="py-3 px-4">Due Date</th>
                          <th className="py-3 px-4">Payment Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {fees.map((fee) => (
                          <tr key={fee._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 capitalize">
                              {fee.feeType || 'Tuition Fee'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ParentFees;
