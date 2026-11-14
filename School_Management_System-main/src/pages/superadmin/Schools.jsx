import React, { useState } from 'react';
import {
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';

const Schools = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const schools = [
    {
      id: 'sch_1',
      name: 'Main Metropolitan Campus',
      code: 'MMC-01',
      city: 'Capital Territory',
      students: 850,
      teachers: 42,
      status: 'active',
    },
    {
      id: 'sch_2',
      name: 'North Valley Academy',
      code: 'NVA-02',
      city: 'Northern Region',
      students: 420,
      teachers: 24,
      status: 'active',
    },
  ];

  const filtered = schools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Tenant School Registry"
        subtitle="Provision and manage school tenant organizations and their domain configurations"
        breadcrumbs={[
          { label: 'Super Admin', href: '/superadmin/dashboard' },
          { label: 'Schools' },
        ]}
        actions={
          <Button
            variant="primary"
            icon={FiPlus}
            onClick={() =>
              toast.info(
                'Tenant provisioning endpoint (/api/superadmin/schools/create) is pending backend deployment.'
              )
            }
          >
            Provision School
          </Button>
        }
      />

      <SectionCard title="Active School Tenants" subtitle="Configured educational branches">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="w-full sm:w-72">
            <Input
              name="search"
              placeholder="Search school by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={FiSearch}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((school) => (
            <div
              key={school.id}
              className="card p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {school.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      Tenant ID: {school.code}
                    </p>
                  </div>
                  <StatusBadge status={school.status} />
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Region</span>
                    <strong className="text-slate-800 dark:text-slate-200">{school.city}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Student Body</span>
                    <strong className="text-slate-800 dark:text-slate-200">{school.students} Students</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Faculty Staff</span>
                    <strong className="text-slate-800 dark:text-slate-200">{school.teachers} Teachers</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => toast.info(`Viewing configuration for ${school.name}`)}
                  className="px-3 py-1.5 rounded-lg text-primary-600 font-semibold hover:bg-primary-50 dark:hover:bg-primary-950/40 transition-colors"
                >
                  Configure Tenant
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default Schools;
