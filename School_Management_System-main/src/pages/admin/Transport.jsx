import React, { useState, useEffect } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiTruck,
  FiUser,
  FiMapPin,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import api from '../../utils/api';

const Transport = () => {
  const [transports, setTransports] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingTransport, setEditingTransport] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    busNumber: '',
    driverName: '',
    driverPhone: '',
    licenseNumber: '',
    capacity: '',
    route: { start: '', end: '', stops: [] },
    fee: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchTransports();
    fetchStudents();
  }, []);

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/transport');
      setTransports(response.data.transports || []);
    } catch (error) {
      console.error('Error fetching transports:', error);
      toast.error('Failed to fetch transports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get('/api/students', {
        params: { limit: 100 },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddTransport = () => {
    setEditingTransport(null);
    setFormData({
      busNumber: '',
      driverName: '',
      driverPhone: '',
      licenseNumber: '',
      capacity: '',
      route: { start: '', end: '', stops: [] },
      fee: '',
      status: 'active',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditTransport = (transport) => {
    setEditingTransport(transport);
    setFormData({
      busNumber: transport.busNumber || '',
      driverName: transport.driverName || '',
      driverPhone: transport.driverPhone || '',
      licenseNumber: transport.licenseNumber || '',
      capacity: transport.capacity || '',
      route: transport.route || { start: '', end: '', stops: [] },
      fee: transport.fee || '',
      status: transport.status || 'active',
    });
    setErrors({});
    setShowModal(true);
  };

  const handleAssignStudent = (transport) => {
    setSelectedTransport(transport);
    setSelectedStudent('');
    setShowAssignModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('route.')) {
      const routeField = name.split('.')[1];
      setFormData({
        ...formData,
        route: { ...formData.route, [routeField]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.busNumber) newErrors.busNumber = 'Bus number is required';
    if (!formData.driverName) newErrors.driverName = 'Driver name is required';
    if (!formData.driverPhone)
      newErrors.driverPhone = 'Driver phone is required';
    if (!formData.capacity || parseInt(formData.capacity) <= 0)
      newErrors.capacity = 'Capacity must be greater than 0';
    if (!formData.route.start)
      newErrors['route.start'] = 'Route start is required';
    if (!formData.route.end) newErrors['route.end'] = 'Route end is required';
    if (!formData.fee || parseFloat(formData.fee) < 0)
      newErrors.fee = 'Fee must be 0 or greater';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setFormLoading(true);
    try {
      const submitData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        fee: parseFloat(formData.fee),
      };

      if (editingTransport) {
        await api.put(`/api/transport/${editingTransport._id}`, submitData);
        toast.success('Transport updated successfully');
      } else {
        await api.post('/api/transport', submitData);
        toast.success('Transport added successfully');
      }
      setShowModal(false);
      fetchTransports();
    } catch (error) {
      console.error('Error saving transport:', error);
      toast.error(error.response?.data?.message || 'Failed to save transport');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transport?')) {
      try {
        await api.delete(`/api/transport/${id}`);
        toast.success('Transport deleted successfully');
        fetchTransports();
      } catch (error) {
        console.error('Error deleting transport:', error);
        toast.error('Failed to delete transport');
      }
    }
  };

  const handleAssignSubmit = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    setFormLoading(true);
    try {
      await api.post(
        `/api/transport/${selectedTransport._id}/assign-student`,
        { studentId: selectedStudent }
      );
      toast.success('Student assigned to transport successfully');
      setShowAssignModal(false);
      fetchTransports();
    } catch (error) {
      console.error('Error assigning student:', error);
      toast.error(error.response?.data?.message || 'Failed to assign student');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveStudent = async (transportId, studentId) => {
    if (window.confirm('Remove this student from transport?')) {
      try {
        await api.post(`/api/transport/${transportId}/remove-student`, {
          studentId,
        });
        toast.success('Student removed from transport');
        fetchTransports();
      } catch (error) {
        console.error('Error removing student:', error);
        toast.error('Failed to remove student');
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'badge-success',
      inactive: 'badge-danger',
      maintenance: 'badge-warning',
    };
    return (
      <span className={`badge ${colors[status] || 'badge-info'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <Loader />;

  return (
    <div>
      <DashboardHeader
        title="Transport Management"
        subtitle="Manage buses, routes, and drivers"
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddTransport}>
            Add Transport
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transports.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-200 dark:border-gray-700">
            <FiTruck className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No transport records found
            </p>
          </div>
        ) : (
          transports.map((transport) => (
            <div
              key={transport._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-primary-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Bus {transport.busNumber}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Route: {transport.route?.start} → {transport.route?.end}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditTransport(transport)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-yellow-600"
                  >
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(transport._id)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FiUser className="text-gray-400" />
                  <span>Driver: {transport.driverName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FiMapPin className="text-gray-400" />
                  <span>Capacity: {transport.capacity} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FiUsers className="text-gray-400" />
                  <span>
                    Assigned: {transport.students?.length || 0} students
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {getStatusBadge(transport.status)}
                  <button
                    onClick={() => handleAssignStudent(transport)}
                    className="px-3 py-1.5 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center gap-1"
                  >
                    <FiUsers className="text-xs" /> Assign Student
                  </button>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Fee: Rs. {transport.fee}
                </span>
              </div>

              {transport.students && transport.students.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Assigned Students:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {transport.students.map((student) => (
                      <div
                        key={student._id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs"
                      >
                        <span className="text-gray-700 dark:text-gray-300">
                          {student.name || student.user?.name}
                        </span>
                        <button
                          onClick={() =>
                            handleRemoveStudent(transport._id, student._id)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Transport Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTransport ? 'Edit Transport' : 'Add Transport'}
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bus Number"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleChange}
              placeholder="Enter bus number"
              required
              icon={FiTruck}
              error={errors.busNumber}
            />
            <Input
              label="Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Enter driver name"
              required
              icon={FiUser}
              error={errors.driverName}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Driver Phone"
              name="driverPhone"
              type="tel"
              value={formData.driverPhone}
              onChange={handleChange}
              placeholder="Enter driver phone"
              required
              error={errors.driverPhone}
            />
            <Input
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Enter license number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Enter capacity"
              required
              error={errors.capacity}
            />
            <Input
              label="Fee"
              name="fee"
              type="number"
              value={formData.fee}
              onChange={handleChange}
              placeholder="Enter fee amount"
              required
              error={errors.fee}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Route Start"
              name="route.start"
              value={formData.route.start}
              onChange={handleChange}
              placeholder="Starting point"
              required
              icon={FiMapPin}
              error={errors['route.start']}
            />
            <Input
              label="Route End"
              name="route.end"
              value={formData.route.end}
              onChange={handleChange}
              placeholder="Ending point"
              required
              error={errors['route.end']}
            />
          </div>

          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'maintenance', label: 'Maintenance' },
            ]}
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
              className="w-full sm:w-auto"
            >
              {editingTransport ? 'Update Transport' : 'Add Transport'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Student Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Student to Transport"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Bus:</strong> {selectedTransport?.busNumber}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Driver:</strong> {selectedTransport?.driverName}
            </p>
          </div>

          <Select
            label="Select Student"
            name="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={[
              { value: '', label: 'Select a student' },
              ...students.map((s) => ({
                value: s._id,
                label: `${s.user?.name} (${s.rollNumber})`,
              })),
            ]}
            required
          />

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAssignModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={formLoading}
              onClick={handleAssignSubmit}
              className="w-full sm:w-auto"
            >
              Assign Student
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Transport;