import React, { useState } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSave,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: typeof user?.address === 'string'
      ? user?.address
      : user?.address?.street || '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (updateProfile) {
        await updateProfile(formData);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile Settings"
        subtitle="Manage your identity credentials and contact information"
        breadcrumbs={[{ label: 'Account' }, { label: 'Profile' }]}
      />

      <div className="max-w-3xl">
        <div className="card p-6 md:p-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {user?.name || 'Authorized User'}
                </h3>
                <StatusBadge status="active" label={user?.role?.toUpperCase() || 'USER'} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Account ID: <strong className="text-slate-700 dark:text-slate-300">{user?._id || user?.id || '—'}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              icon={FiUser}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={FiMail}
              disabled
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              icon={FiPhone}
            />

            <Input
              label="Physical Residential Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              icon={FiMapPin}
            />

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="submit"
                variant="primary"
                icon={FiSave}
                loading={loading}
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
