import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import Input from '../../components/forms/Input';
import Button from '../../components/forms/Button';
import { ROLES } from '../../utils/constants';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const role = result.user.role;
      switch (role) {
        case ROLES.SUPER_ADMIN:
          navigate('/superadmin/dashboard');
          break;
        case ROLES.ADMIN:
          navigate('/admin/dashboard');
          break;
        case ROLES.TEACHER:
          navigate('/teacher/dashboard');
          break;
        case ROLES.STUDENT:
          navigate('/student/dashboard');
          break;
        case ROLES.PARENT:
          navigate('/parent/dashboard');
          break;
        case ROLES.COORDINATOR:
          navigate('/coordinator/dashboard');
          break;
        case ROLES.EXAMINATION:
          navigate('/examination/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">
        Welcome Back
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
        Sign in to your account to continue
      </p>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          icon={FiMail}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
          icon={FiLock}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          fullWidth
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;