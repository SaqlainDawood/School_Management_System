import React, { useState } from 'react';
import {
  FiDownload,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';

const CoordinatorReports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [format, setFormat] = useState('pdf');

  const handleGenerate = () => {
    console.log('Generating', reportType, 'report in', format, 'format');
  };

  return (
    <div>
      <DashboardHeader
        title="Reports"
        subtitle="Generate and export reports"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Select
              label="Report Type"
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'attendance', label: 'Attendance Report' },
                { value: 'department', label: 'Department Report' },
                { value: 'performance', label: 'Performance Report' },
              ]}
              icon={FiBarChart2}
            />
            <Select
              label="Export Format"
              name="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'csv', label: 'CSV' },
              ]}
              icon={FiDownload}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <input type="date" className="input-field" />
            <input type="date" className="input-field" />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => setReportType('attendance')}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === 'attendance'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <FiClock
                className={`text-2xl mx-auto ${
                  reportType === 'attendance'
                    ? 'text-primary-500'
                    : 'text-gray-400'
                }`}
              />
              <p className="text-sm font-medium mt-2">Attendance</p>
            </button>
            <button
              onClick={() => setReportType('department')}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === 'department'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <FiUsers
                className={`text-2xl mx-auto ${
                  reportType === 'department'
                    ? 'text-primary-500'
                    : 'text-gray-400'
                }`}
              />
              <p className="text-sm font-medium mt-2">Department</p>
            </button>
            <button
              onClick={() => setReportType('performance')}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === 'performance'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <FiDollarSign
                className={`text-2xl mx-auto ${
                  reportType === 'performance'
                    ? 'text-primary-500'
                    : 'text-gray-400'
                }`}
              />
              <p className="text-sm font-medium mt-2">Performance</p>
            </button>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={FiDownload}
            onClick={handleGenerate}
            fullWidth
          >
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorReports;