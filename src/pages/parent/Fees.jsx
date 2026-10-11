import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiUser } from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  getStatusLabel,
} from '../../utils/helpers';

const ParentFees = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) fetchFees();
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await api.get('/api/parents/dashboard');
      const kids = response.data.dashboard?.parent?.children || [];
      setChildren(kids);
      if (kids.length > 0) setSelectedChild(kids[0]._id);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await api.get(`/api/parents/child/${selectedChild}/fees`);
      setFees(response.data.fees || []);
      setSummary(response.data.summary || {});
    } catch (error) {
      console.error('Error fetching fees:', error);
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
        title="Children Fees"
        subtitle="View your children's fee status"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <Select
            label="Select Child"
            name="child"
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            options={children.map((c) => ({
              value: c._id,
              label: c.user?.name || 'Child',
            }))}
            className="w-64"
            icon={FiUser}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Fees
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {formatCurrency(summary.totalAmount)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Paid</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(summary.paidAmount)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(summary.pendingAmount)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-xl font-bold text-primary-600">
              {summary.pendingFees > 0
                ? `${summary.paidFees}/${summary.totalFees}`
                : 'All Paid'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Fee Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {fees.map((fee) => (
                <tr key={fee._id}>
                  <td className="px-4 py-3">
                    <span className="capitalize text-gray-700 dark:text-gray-300">
                      {fee.feeType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700 dark:text-gray-300">
                      {formatCurrency(fee.amount)}
                    </div>
                    {fee.remainingAmount > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Remaining: {formatCurrency(fee.remainingAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {formatDate(fee.dueDate)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(fee.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {fees.length === 0 && (
          <div className="text-center py-12">
            <FiDollarSign className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No fee records found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentFees;