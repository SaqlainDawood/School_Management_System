import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiBookOpen,
} from 'react-icons/fi';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/api/coordinator/departments');
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Departments"
        subtitle="Manage all departments"
        actions={
          <Button variant="primary" icon={FiPlus}>
            Add Department
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div
            key={dept._id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {dept.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Code: {dept.code}
                </p>
              </div>
              <div className="flex gap-1">
                <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-yellow-600">
                  <FiEdit2 className="text-sm" />
                </button>
                <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiUsers className="text-gray-400" />
                <span>{dept.teachers?.length || 0} Teachers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiBookOpen className="text-gray-400" />
                <span>{dept.subjects?.length || 0} Subjects</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span
                className={`badge ${
                  dept.isActive ? 'badge-success' : 'badge-danger'
                }`}
              >
                {dept.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No departments found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Departments;