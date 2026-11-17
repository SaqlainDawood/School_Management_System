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
  FiShield,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { formatAddress } from '../../utils/helpers';

const Settings = () => {
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
      const response = await api.get('/api/admin/settings');
      setSettings(response.data.settings || settings);
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/api/admin/settings', settings);
      toast.success('System configuration saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/auth/update-profile', profileData);
      toast.success('Administrator profile updated');
    } catch (err) {
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
      toast.success('Security password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Administrator Profile', icon: FiUser },
    { id: 'settings', label: 'Institutional Configuration', icon: FiGlobe },
    { id: 'security', label: 'Authentication & Security', icon: FiLock },
  ];

  if (loading) return <Loader />;

  const initial = profileData.name?.charAt(0) || 'A';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Controls & Settings"
        subtitle="Configure institution-wide parameters, user credentials, and security preferences"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Settings' },
        ]}
      />

      <div className="card overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-[#162033]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="text-sm" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-600/20">
                    {initial}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {profileData.name || 'Administrator'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      {user?.role || 'Admin'} Level Access
                    </p>
                  </div>
                </div>

                <Input
                  label="Full Administrative Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  icon={FiUser}
                />
                <Input
                  label="Registered Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  icon={FiMail}
                  disabled
                />
                <Input
                  label="Official Telephone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  icon={FiPhone}
                />
                <Input
                  label="Administrative Campus Office / Address"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  icon={FiMapPin}
                />

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={FiSave}
                    loading={saving}
                  >
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-5">
              <Input
                label="Institution Legal Title"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleSettingChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Active Academic Calendar Year"
                  name="academicYear"
                  value={settings.academicYear}
                  onChange={handleSettingChange}
                />
                <Select
                  label="Academic Term Cycle"
                  name="semester"
                  value={settings.semester}
                  onChange={handleSettingChange}
                  options={[
                    { value: 'Annual', label: 'Annual Standard Cycle' },
                    { value: 'Semester 1', label: 'Fall Semester' },
                    { value: 'Semester 2', label: 'Spring Semester' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Academic Evaluation Standard"
                  name="gradingSystem"
                  value={settings.gradingSystem}
                  onChange={handleSettingChange}
                  options={[
                    { value: 'percentage', label: 'Percentage Scale (%)' },
                    { value: 'gpa', label: '4.0 GPA Standard' },
                    { value: 'letter', label: 'Letter Grade (A+ to F)' },
                  ]}
                />
                <Select
                  label="Roster Attendance Frequency"
                  name="attendanceType"
                  value={settings.attendanceType}
                  onChange={handleSettingChange}
                  options={[
                    { value: 'daily', label: 'Once Daily (Morning Roll)' },
                    { value: 'period_wise', label: 'Per-Period Lecture Tracking' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Platform Locale Language"
                  name="language"
                  value={settings.language}
                  onChange={handleSettingChange}
                  options={[
                    { value: 'en', label: 'English (US/UK)' },
                    { value: 'ur', label: 'Urdu (Institutional)' },
                  ]}
                />
                <Select
                  label="Preferred Interface Theme"
                  name="theme"
                  value={settings.theme}
                  onChange={handleSettingChange}
                  options={[
                    { value: 'light', label: 'Light Mode Default' },
                    { value: 'dark', label: 'Dark Midnight' },
                    { value: 'system', label: 'System Automatic' },
                  ]}
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="primary"
                  icon={FiSave}
                  loading={saving}
                  onClick={handleSaveSettings}
                >
                  Save Institutional Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl space-y-5">
              <form onSubmit={handleChangePassword} className="space-y-4">
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
                  label="New Security Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  icon={FiLock}
                  required
                />
                <Input
                  label="Confirm New Security Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  icon={FiLock}
                  error={errors.confirmPassword}
                  required
                />

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={FiShield}
                    loading={saving}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
