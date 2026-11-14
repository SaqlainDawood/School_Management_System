import React from 'react';
import {
  FiActivity,
  FiServer,
  FiDatabase,
  FiCheckCircle,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Telemetry & System Analytics"
        subtitle="Infrastructure health, database cluster availability, and runtime performance"
        breadcrumbs={[
          { label: 'Super Admin', href: '/superadmin/dashboard' },
          { label: 'Analytics' },
        ]}
      />

      {/* Infrastructure KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Cluster Health"
          value="Operational"
          icon={FiServer}
          color="success"
          subtitle="All nodes reporting"
        />
        <StatsCard
          title="API Response Time"
          value="42ms"
          icon={FiActivity}
          color="primary"
          subtitle="P95 latency benchmark"
        />
        <StatsCard
          title="Database Latency"
          value="1.8ms"
          icon={FiDatabase}
          color="secondary"
          subtitle="Primary replica healthy"
        />
        <StatsCard
          title="Platform Uptime"
          value="99.98%"
          icon={FiCheckCircle}
          color="success"
          subtitle="Last 30 rolling days"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Microservice Health Matrix" subtitle="Subsystem status monitors">
          <div className="space-y-3">
            {[
              { service: 'Authentication & JWT Token Service', status: 'active', latency: '12ms' },
              { service: 'Student Enrollment Subsystem', status: 'active', latency: '24ms' },
              { service: 'Examination & Grading Engine', status: 'active', latency: '18ms' },
              { service: 'Fee Billing & Voucher Generator', status: 'active', latency: '48ms' },
              { service: 'Attendance Telemetry Pipeline', status: 'active', latency: '15ms' },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {srv.service}
                  </p>
                  <p className="text-slate-400 mt-0.5">Average roundtrip: {srv.latency}</p>
                </div>
                <StatusBadge status="active" label="NORMAL" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Database & Storage Telemetry" subtitle="Persistent storage volumes">
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Document Database Cluster</span>
                <span className="text-primary-600">32% Utilized</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: '32%' }} />
              </div>
              <p className="text-slate-400 text-[11px]">8.2 GB of 25.0 GB allocated SSD cluster storage</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">PDF & Voucher Media Store</span>
                <span className="text-emerald-600">18% Utilized</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18%' }} />
              </div>
              <p className="text-slate-400 text-[11px]">1.8 GB of 10.0 GB blob cache</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Analytics;
