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
  FiPhone,
  FiDollarSign,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/forms/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Modal from '../../components/modals/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
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
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    const fetchTransports = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/transport');
        if (ignore) return;
        setTransports(response.data.transports || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching transports:', err);
          toast.error('Failed to fetch transports');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchTransports();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  useEffect(() => {
    let ignore = false;
    const fetchStudents = async () => {
      try {
        const response = await api.get('/api/students', {
          params: { limit: 100 },
        });
        if (ignore) return;
        setStudents(response.data.students || []);
      } catch (err) {
        if (!ignore) {
          console.error('Error fetching students:', err);
        }
      }
    };

    fetchStudents();

    return () => {
      ignore = true;
    };
  }, []);

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
    if (!formData.driverPhone) newErrors.driverPhone = 'Driver phone is required';
    if (!formData.capacity || parseInt(formData.capacity) <= 0)
      newErrors.capacity = 'Capacity must be greater than 0';
    if (!formData.route.start) newErrors['route.start'] = 'Route start is required';
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
      toast.error('Please resolve the required fields');
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
        toast.success('Route details updated successfully');
      } else {
        await api.post('/api/transport', submitData);
        toast.success('Transport route added successfully');
      }
      setShowModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error saving transport:', err);
      toast.error(err.response?.data?.message || 'Failed to save transport');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/api/transport/${deleteTargetId}`);
      toast.success('Transport route decommissioned');
      setDeleteTargetId(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error deleting transport:', err);
      toast.error('Failed to delete transport');
    } finally {
      setDeleteLoading(false);
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
      toast.success('Student assigned to transit route');
      setShowAssignModal(false);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error assigning student:', err);
      toast.error(err.response?.data?.message || 'Failed to assign student');
    } finally {
      setFormLoading(false);
    }
  };

  const handleRemoveStudent = async (transportId, studentId) => {
    try {
      await api.post(`/api/transport/${transportId}/remove-student`, {
        studentId,
      });
      toast.success('Student unassigned from transit route');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error removing student:', err);
      toast.error('Failed to remove student');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'danger';
      default: return 'neutral';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Transit & Routes"
        subtitle="Manage school buses, fleet routes, transport fees, and student passenger rosters"
        breadcrumbs={[
          { label: 'Dashboard', path: '/admin/dashboard' },
          { label: 'Transport' },
        ]}
        actions={
          <Button variant="primary" icon={FiPlus} onClick={handleAddTransport}>
            Add Vehicle Route
          </Button>
        }
      />

      {transports.length === 0 ? (
        <div className="card p-12">
          <EmptyState
            icon={FiTruck}
            title="No transit fleet registered"
            description="Add buses and designate pickup routes to begin enrolling students into institutional transport."
            actionLabel="Add First Vehicle"
            onAction={handleAddTransport}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {transports.map((transport) => {
            const assignedCount = transport.students?.length || 0;
            const capacity = transport.capacity || 1;
            const pct = Math.min(100, Math.round((assignedCount / capacity) * 100));

            return (
              <div
                key={transport._id}
                className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FiTruck className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                          Bus #{transport.busNumber}
                        </h3>
                        <StatusBadge variant={getStatusVariant(transport.status)} dot>
                          {transport.status?.toUpperCase()}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 truncate">
                        <FiMapPin className="text-[11px] text-slate-400 flex-shrink-0" />
                        {transport.route?.start || 'Origin'} → {transport.route?.end || 'Destination'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditTransport(transport)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Bus"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(transport._id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Bus"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiUser className="text-slate-400" /> Driver:
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {transport.driverName}
                      </span>
                    </div>
                    {transport.driverPhone && (
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <FiPhone className="text-slate-400" /> Contact:
                        </span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">
                          {transport.driverPhone}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <FiDollarSign className="text-slate-400" /> Transit Fee:
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        Rs. {transport.fee || 0} / mo
                      </span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px] font-medium">Occupancy</span>
                      <span className="font-semibold text-slate-900 dark:text-white text-[11px]">
                        {assignedCount} / {capacity} Seats ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct >= 95 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Assigned Students Roster Chips */}
                  {transport.students && transport.students.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Assigned Passengers:
                      </p>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {transport.students.map((student) => (
                          <span
                            key={student._id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                          >
                            <span className="truncate max-w-[100px]">
                              {student.name || student.user?.name}
                            </span>
                            <button
                              onClick={() => handleRemoveStudent(transport._id, student._id)}
                              className="text-slate-400 hover:text-rose-500"
                              title="Unassign"
                            >
                              <FiX className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="secondary"
                    icon={FiUsers}
                    onClick={() => handleAssignStudent(transport)}
                    size="sm"
                    fullWidth
                    disabled={assignedCount >= capacity}
                  >
                    {assignedCount >= capacity ? 'Bus at Full Capacity' : 'Assign Student Passenger'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Transport Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTransport ? 'Update Vehicle Details' : 'Register Transit Route'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bus Registration Number"
              name="busNumber"
              value={formData.busNumber}
              onChange={handleChange}
              placeholder="e.g. BUS-01"
              required
              icon={FiTruck}
              error={errors.busNumber}
            />
            <Input
              label="Assigned Driver Name"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Driver full name"
              required
              icon={FiUser}
              error={errors.driverName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Driver Contact Phone"
              name="driverPhone"
              type="tel"
              value={formData.driverPhone}
              onChange={handleChange}
              placeholder="e.g. +92 300 1234567"
              required
              error={errors.driverPhone}
            />
            <Input
              label="Commercial Driver License"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="e.g. DL-893240"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Seating Capacity"
              name="capacity"
              type="number"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 35"
              required
              error={errors.capacity}
            />
            <Input
              label="Monthly Transit Fee"
              name="fee"
              type="number"
              value={formData.fee}
              onChange={handleChange}
              placeholder="e.g. 2500"
              required
              error={errors.fee}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Origin / Route Start"
              name="route.start"
              value={formData.route.start}
              onChange={handleChange}
              placeholder="e.g. Downtown Terminal"
              required
              icon={FiMapPin}
              error={errors['route.start']}
            />
            <Input
              label="Terminus / Route End"
              name="route.end"
              value={formData.route.end}
              onChange={handleChange}
              placeholder="e.g. Main Campus Gate 2"
              required
              error={errors['route.end']}
            />
          </div>

          <Select
            label="Fleet Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Active & Operating' },
              { value: 'inactive', label: 'Out of Service' },
              { value: 'maintenance', label: 'Mechanical Maintenance' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
            >
              {editingTransport ? 'Save Route Changes' : 'Register Vehicle'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Assign Student Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Student Passenger"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
            <p className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Bus:</strong> #{selectedTransport?.busNumber}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Driver:</strong> {selectedTransport?.driverName}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Route:</strong> {selectedTransport?.route?.start} → {selectedTransport?.route?.end}
            </p>
          </div>

          <Select
            label="Candidate Student"
            name="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={[
              { value: '', label: 'Select a student to assign...' },
              ...students.map((s) => ({
                value: s._id,
                label: `${s.user?.name || s.name} (${s.rollNumber || 'No Roll'})`,
              })),
            ]}
            required
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={formLoading}
              onClick={handleAssignSubmit}
            >
              Assign to Bus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Deletion */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Decommission Transport Route"
        message="Are you sure you want to delete this bus route? All assigned student passengers will need to be reassigned to other transit routes."
        confirmText="Delete Route"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Transport;
