import React, { useState } from 'react';
import {
  FiFileText,
  FiDownload,
  FiPieChart,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiInfo,
  FiCalendar,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';

const Reports = () => {
  const [reportType, setReportType] = useState('students');
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generationNotice, setGenerationNotice] = useState(null);

  const reportTypes = [
    { value: 'students', label: 'Student Demographics & Enrollment', icon: FiUsers },
    { value: 'attendance', label: 'Institutional Attendance Report', icon: FiBarChart2 },
    { value: 'fees', label: 'Financial Collections & Defaulters', icon: FiDollarSign },
    { value: 'results', label: 'Academic Performance & Transcripts', icon: FiPieChart },
  ];

  // NOTE: Backend report generation endpoint is currently not implemented.
  // We provide honest frontend feedback rather than dummy responses or silent console logs.
  const handleGenerate = () => {
    const selected = reportTypes.find((r) => r.value === reportType)?.label || reportType;
    setGenerationNotice(
      `Automated ${format.toUpperCase()} report generation for "${selected}" is scheduled for backend export deployment. Current server API does not expose a streaming report builder.`
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Analytics & Reports"
        subtitle="Configure and compile aggregated institutional data extracts, audits, and report cards"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Reports' },
        ]}
      />

      <div className="card p-6 sm:p-8 space-y-6">
        {generationNotice && (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs flex items-start gap-3">
            <FiInfo className="text-base mt-0.5 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="flex-1">
              <p className="font-semibold">Backend Report Generator Status</p>
              <p className="mt-0.5 leading-relaxed">{generationNotice}</p>
            </div>
            <button
              onClick={() => setGenerationNotice(null)}
              className="text-indigo-500 hover:text-indigo-800 dark:hover:text-white font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="max-w-2xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Analytics Module"
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
              label="Export Payload Format"
              name="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'pdf', label: 'Portable Document (PDF)' },
                { value: 'excel', label: 'Microsoft Excel (.xlsx)' },
                { value: 'csv', label: 'Comma-Separated (.csv)' },
              ]}
              icon={FiDownload}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Reporting Window Start</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field text-xs pl-9 py-2 w-full"
                />
              </div>
            </div>
            <div>
              <label className="label">Reporting Window End</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field text-xs pl-9 py-2 w-full"
                />
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={FiDownload}
            onClick={handleGenerate}
            fullWidth
          >
            Request Report Compilation
          </Button>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Available Institutional Report Categories
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {reportTypes.map((type) => {
              const isSelected = reportType === type.value;
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setReportType(type.value)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="text-base" />
                  </div>
                  <p
                    className={`text-xs font-bold leading-snug ${
                      isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {type.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
