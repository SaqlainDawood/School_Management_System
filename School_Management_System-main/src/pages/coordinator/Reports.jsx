import React, { useState } from 'react';
import {
  FiDownload,
  FiBarChart2,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiFileText,
  FiInfo,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import Button from '../../components/forms/Button';
import Select from '../../components/forms/Select';

const CoordinatorReports = () => {
  const [reportType, setReportType] = useState('attendance');
  const [format, setFormat] = useState('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.info(
        `Backend reporting service is currently preparing the ${reportType.toUpperCase()} compilation pipeline. Export download will be available upon backend update.`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department Academic Reports"
        subtitle="Generate and export curriculum metrics, attendance logs, and evaluation reports"
        breadcrumbs={[
          { label: 'Coordinator', href: '/coordinator/dashboard' },
          { label: 'Reports' },
        ]}
      />

      <SectionCard title="Report Configuration" subtitle="Select report parameters and file export format">
        <div className="max-w-3xl space-y-6">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-sm text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
            <FiInfo className="text-lg text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Backend Report Generator Status</p>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-0.5">
                The streaming server-side document compilation endpoint (/api/reports/generate) is currently pending backend integration. You can preview report filters below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select
              label="Report Category"
              name="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={[
                { value: 'attendance', label: 'Department Attendance Summary' },
                { value: 'department', label: 'Faculty & Curriculum Allocation' },
                { value: 'performance', label: 'Term Academic Evaluation' },
              ]}
              icon={FiBarChart2}
            />
            <Select
              label="Export Format"
              name="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: 'pdf', label: 'Portable Document Format (.pdf)' },
                { value: 'excel', label: 'Microsoft Excel Spreadsheet (.xlsx)' },
                { value: 'csv', label: 'Comma-Separated Values (.csv)' },
              ]}
              icon={FiDownload}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              icon={FiDownload}
              onClick={handleGenerate}
              loading={generating}
            >
              Compile & Export Report
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default CoordinatorReports;
