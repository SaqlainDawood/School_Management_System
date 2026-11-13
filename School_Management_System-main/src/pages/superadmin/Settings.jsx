import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

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
    address: user?.address || '',
  });
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
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.put('/api/admin/settings', settings);
      toast.success('Settings updated successfully');
    } catch (error) {
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
      toast.success('Profile updated successfully');
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
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'settings', label: 'System Settings', icon: FiGlobe },
    { id: 'security', label: 'Security', icon: FiLock },
  ];

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account and system settings"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <tab.icon className="text-lg" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
                      {profileData.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {profileData.name || 'User'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.role?.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    icon={FiUser}
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
                    label="Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    icon={FiMapPin}
                  />

                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="submit"
                      variant="primary"
                      icon={FiSave}
                      loading={saving}
                    >
                      Save Profile
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="space-y-4">
                <Input
                  label="School Name"
                  name="schoolName"
                  value={settings.schoolName}
                  onChange={handleSettingChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Academic Year"
                    name="academicYear"
                    value={settings.academicYear}
                    onChange={handleSettingChange}
                  />
                  <Select
                    label="Fee Period"
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
                    label="Grading System"
                    name="gradingSystem"
                    value={settings.gradingSystem}
                    onChange={handleSettingChange}
                    options={[
                      { value: 'percentage', label: 'Percentage' },
                      { value: 'gpa', label: 'GPA' },
                      { value: 'letter', label: 'Letter Grade' },
                    ]}
                  />
                  <Select
                    label="Attendance Type"
                    name="attendanceType"
                    value={settings.attendanceType}
                    onChange={handleSettingChange}
                    options={[
                      { value: 'daily', label: 'Daily' },
                      { value: 'period_wise', label: 'Period Wise' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Language"
                    name="language"
                    value={settings.language}
                    onChange={handleSettingChange}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'ur', label: 'Urdu' },
                    ]}
                  />
                  <Select
                    label="Theme"
                    name="theme"
                    value={settings.theme}
                    onChange={handleSettingChange}
                    options={[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'system', label: 'System' },
                    ]}
                    icon={settings.theme === 'dark' ? FiMoon : FiSun}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="primary"
                    icon={FiSave}
                    loading={saving}
                    onClick={handleSaveSettings}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    icon={FiLock}
                  />
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    icon={FiLock}
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    icon={FiLock}
                    error={errors.confirmPassword}
                  />

                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="submit"
                      variant="primary"
                      icon={FiSave}
                      loading={saving}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;