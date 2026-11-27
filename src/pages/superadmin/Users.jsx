import React, { useState } from 'react';
import {
  FiUsers,
  FiSearch,
  FiUserCheck,
  FiShield,
  FiFilter,
  FiEye,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import StatusBadge from '../../components/common/StatusBadge';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Button from '../../components/forms/Button';
import Modal from '../../components/modals/Modal';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [viewingUser, setViewingUser] = useState(null);

  const sampleUsers = [
    {
      id: 'usr_1',
      name: 'System Super Admin',
      email: 'superadmin@school.com',
      role: 'superadmin',
      school: 'Main Campus',
      status: 'active',
    },
    {
      id: 'usr_2',
      name: 'Campus Administrator',
      email: 'admin@school.com',
      role: 'admin',
      school: 'Main Campus',
      status: 'active',
    },
    {
      id: 'usr_3',
      name: 'Academic Coordinator',
      email: 'coordinator@school.com',
      role: 'coordinator',
      school: 'Main Campus',
      status: 'active',
    },
  ];

  const filtered = sampleUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global User Directory"
        subtitle="Audit administrative accounts, role delegations, and security credentials"
        breadcrumbs={[
          { label: 'Super Admin', href: '/superadmin/dashboard' },
          { label: 'Users' },
        ]}
      />

      <SectionCard title="System Accounts" subtitle="Global administrative personnel">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="w-full sm:w-72">
            <Input
              name="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={FiSearch}
            />
          </div>
          <Select
            name="role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: '', label: 'All Roles' },
              { value: 'superadmin', label: 'Super Admin' },
              { value: 'admin', label: 'School Admin' },
              { value: 'coordinator', label: 'Coordinator' },
              { value: 'teacher', label: 'Teacher' },
              { value: 'student', label: 'Student' },
              { value: 'parent', label: 'Parent' },
            ]}
            className="w-48"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Tenant Campus</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {user.school}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setViewingUser(user)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      title="View User Details"
                    >
                      <FiEye className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Modal
        isOpen={Boolean(viewingUser)}
        onClose={() => setViewingUser(null)}
        title="User Account Details"
        size="md"
      >
        {viewingUser && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{viewingUser.name}</h3>
                <p className="text-slate-500">{viewingUser.email}</p>
              </div>
              <StatusBadge status={viewingUser.status} />
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex justify-between"><span className="text-slate-500">User ID</span><span className="font-mono font-semibold text-slate-900 dark:text-white">{viewingUser.id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Role</span><span className="font-semibold uppercase text-slate-900 dark:text-white">{viewingUser.role}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Campus</span><span className="font-semibold text-slate-900 dark:text-white">{viewingUser.school}</span></div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setViewingUser(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
