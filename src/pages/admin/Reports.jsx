import React, { useState } from 'react';
import {
  FiFileText,
  FiDownload,
  FiPieChart,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';

const Reports = () => {
  const [reportType, setReportType] = useState('students');
  const [format, setFormat] = useState('pdf');

  const reportTypes = [
    { value: 'students', label: 'Student Report', icon: FiUsers },
    { value: 'attendance', label: 'Attendance Report', icon: FiBarChart2 },
    { value: 'fees', label: 'Fee Report', icon: FiDollarSign },
    { value: 'results', label: 'Result Report', icon: FiPieChart },
  ];

  const handleGenerate = () => {
    console.log('Generating', reportType, 'report in', format, 'format');
  };

  return (
    <div>
      <DashboardHeader title="Reports" subtitle="Generate and export reports" />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 border border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Select
              label="Report Type"
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={reportTypes.map((r) => ({
                value: r.value,
                label: r.label,
              }))}
              icon={FiFileText}
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setReportType(type.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                reportType === type.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }`}
            >
              <type.icon
                className={`text-2xl mx-auto ${
                  reportType === type.value
                    ? 'text-primary-500'
                    : 'text-gray-400'
                }`}
              />
              <p
                className={`text-sm font-medium mt-2 ${
                  reportType === type.value
                    ? 'text-primary-600'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {type.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;