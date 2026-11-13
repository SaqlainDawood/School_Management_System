import React, { useState } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiSave,
} from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    qualification: user?.qualification || '',
    specialization: user?.specialization || '',
    department: user?.department || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
  };

  const initial = user?.name?.charAt(0) || 'T';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Dossier & Profile"
        subtitle="Manage your credentials, departmental affiliation, and contact details"
        breadcrumbs={[
          { label: 'Dashboard', path: '/teacher/dashboard' },
          { label: 'Profile' },
        ]}
      />

      <div className="card max-w-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md shadow-indigo-600/20">
            {initial}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {user?.name || 'Faculty Member'}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              FACULTY • {formData.department || 'General Department'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Legal Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            icon={FiUser}
            required
          />
          <Input
            label="Institutional Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={FiMail}
            disabled
          />
          <Input
            label="Direct Contact Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            icon={FiPhone}
          />
          <Input
            label="Residential / Office Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={FiMapPin}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Academic Qualification"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. M.Sc. Mathematics"
              icon={FiBriefcase}
            />
            <Input
              label="Subject Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Applied Statistics"
              icon={FiBriefcase}
            />
          </div>

          <Input
            label="Assigned Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            icon={FiBriefcase}
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
  );
};

export default TeacherProfile;
