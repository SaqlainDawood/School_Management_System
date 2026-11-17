import React, { useState, useEffect } from 'react';
import {
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiMoon,
  FiSun,
  FiLock,
  FiCheckCircle,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SectionCard from '../../components/common/SectionCard';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatAddress } from '../../utils/helpers';

const SuperAdminSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    schoolName: 'School Management System',
    academicYear: '2026-2027',
    semester: 'Annual',
    gradingSystem: 'percentage',
    attendanceType: 'daily',
    language: 'en',
    theme: 'light',
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: formatAddress(user?.address),
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: formatAddress(user.address),
      });
    }
  }, [user]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/settings');
      if (response.data?.settings) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (e) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/api/admin/settings', settings);
      toast.success('System configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/auth/update-profile', profileData);
      toast.success('Profile credentials updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setSaving(true);
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Admin Identity', icon: FiUser },
    { id: 'settings', label: 'System Configuration', icon: FiGlobe },
    { id: 'security', label: 'Access Security', icon: FiLock },
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Admin Settings"
        subtitle="Manage master system configurations, access credentials, and platform parameters"
        breadcrumbs={[
          { label: 'Super Admin', href: '/superadmin/dashboard' },
          { label: 'Settings' },
        ]}
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="text-base" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <SectionCard title="Personal Profile" subtitle="Your master administrative account information">
          <form onSubmit={handleSaveProfile} className="max-w-2xl space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              icon={FiUser}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              icon={FiMail}
              disabled
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleProfileChange}
              icon={FiPhone}
            />
            <Input
              label="Physical Address"
              name="address"
              value={profileData.address}
              onChange={handleProfileChange}
              icon={FiMapPin}
            />
            <div className="pt-2">
              <Button type="submit" variant="primary" icon={FiSave} loading={saving}>
                Save Identity Details
              </Button>
            </div>
          </form>
        </SectionCard>
      )}

      {activeTab === 'settings' && (
        <SectionCard title="Global Platform Settings" subtitle="Default parameters applied across system tenants">
          <div className="max-w-2xl space-y-5">
            <Input
              label="Platform Branding Title"
              name="schoolName"
              value={settings.schoolName}
              onChange={handleSettingChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Active Academic Year"
                name="academicYear"
                value={settings.academicYear}
                onChange={handleSettingChange}
              />
              <Select
                label="Billing Cycle"
                name="semester"
                value={settings.semester}
                onChange={handleSettingChange}
                options={[
                  { value: 'Annual', label: 'Annual' },
                  { value: 'Semester 1', label: 'Semester 1' },
                  { value: 'Semester 2', label: 'Semester 2' },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Grading Scale"
                name="gradingSystem"
                value={settings.gradingSystem}
                onChange={handleSettingChange}
                options={[
                  { value: 'percentage', label: 'Standard Percentage (%)' },
                  { value: 'gpa', label: 'Grade Point Average (4.0 GPA)' },
                  { value: 'letter', label: 'Letter Grade System (A-F)' },
                ]}
              />
              <Select
                label="Attendance Tracking Mode"
                name="attendanceType"
                value={settings.attendanceType}
                onChange={handleSettingChange}
                options={[
                  { value: 'daily', label: 'Daily Roll Call' },
                  { value: 'period_wise', label: 'Period-Wise Roll Call' },
                ]}
              />
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                icon={FiSave}
                loading={saving}
                onClick={handleSaveSettings}
              >
                Save System Parameters
              </Button>
            </div>
          </div>
        </SectionCard>
      )}

      {activeTab === 'security' && (
        <SectionCard title="Security Credentials" subtitle="Manage master administrative password">
          <form onSubmit={handleChangePassword} className="max-w-2xl space-y-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              icon={FiLock}
              required
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              icon={FiLock}
              required
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              icon={FiLock}
              error={errors.confirmPassword}
              required
            />
            <div className="pt-2">
              <Button type="submit" variant="primary" icon={FiSave} loading={saving}>
                Update Password
              </Button>
            </div>
          </form>
        </SectionCard>
      )}
    </div>
  );
};

export default SuperAdminSettings;
