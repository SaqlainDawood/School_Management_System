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
  FiCheckCircle,
  FiShield,
  FiAlertTriangle,
  FiActivity,
  FiCompass,
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

  useEffect(() => {
    fetchTransports();
    fetchStudents();
  }, []);

  const fetchTransports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/transport');
      setTransports(response.data.transports || []);
    } catch (err) {
      console.error('Error fetching transports:', err);
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
    } catch (err) {
      console.error('Error fetching students:', err);
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
      fetchTransports();
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
      fetchTransports();
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
      fetchTransports();
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
      fetchTransports();
    } catch (err) {
      console.error('Error removing student:', err);
      toast.error('Failed to remove student');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'inactive':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  if (loading && transports.length === 0) return <Loader />;

  // Operational fleet calculations from real data
  const totalFleetCount = transports.length;
  const activeFleetCount = transports.filter((t) => t.status === 'active').length;
  const maintenanceCount = transports.filter((t) => t.status === 'maintenance').length;
  const totalAssignedPassengers = transports.reduce(
    (acc, t) => acc + (t.students?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
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

      {/* ── Fleet Control Center Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0 border border-indigo-100 dark:border-indigo-900/40">
            <FiTruck />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Transit Fleet
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalFleetCount} Vehicles
            </p>
          </div>
        </div>

        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0 border border-emerald-100 dark:border-emerald-900/40">
            <FiCheckCircle />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Operating
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {activeFleetCount} Active
            </p>
          </div>
        </div>

        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0 border border-amber-100 dark:border-amber-900/40">
            <FiAlertTriangle />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              In Maintenance
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {maintenanceCount} Vehicles
            </p>
          </div>
        </div>

        <div className="card p-4.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033] flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0 border border-purple-100 dark:border-purple-900/40">
            <FiUsers />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Assigned Passengers
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
              {totalAssignedPassengers} Students
            </p>
          </div>
        </div>
      </div>

      {/* ── Full-Width Enterprise Transit Directory ── */}
      {transports.length === 0 ? (
        <div className="card p-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162033]">
          <EmptyState
            icon={FiTruck}
            title="No transit fleet registered"
            description="Add buses and designate pickup routes to begin enrolling students into institutional transport."
            actionLabel="Add First Vehicle"
            onAction={handleAddTransport}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {transports.map((transport) => {
            const assignedCount = transport.students?.length || 0;
            const capacity = transport.capacity || 1;
            const pct = Math.min(100, Math.round((assignedCount / capacity) * 100));

            return (
              <div
                key={transport._id}
                className="card border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#162033] rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* ── Main Vehicle Summary Row ── */}
                <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Vehicle Identity & Route */}
                  <div className="flex items-start gap-4 min-w-[280px]">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                      <FiTruck />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          Bus #{transport.busNumber}
                        </h3>
                        <StatusBadge variant={getStatusVariant(transport.status)} dot>
                          {transport.status?.toUpperCase() || 'ACTIVE'}
                        </StatusBadge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                        <FiCompass className="text-indigo-500 text-xs shrink-0" />
                        <span>{transport.route?.start || 'Origin'}</span>
                        <span className="text-slate-300 dark:text-slate-600">→</span>
                        <span>{transport.route?.end || 'Destination'}</span>
                      </p>
                      {transport.licenseNumber && (
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Plate: {transport.licenseNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Center-Left: Driver Details */}
                  <div className="min-w-[180px] space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Assigned Driver
                    </p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FiUser className="text-slate-400 text-xs" />
                      <span>{transport.driverName || 'Unassigned'}</span>
                    </p>
                    {transport.driverPhone && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
                        <FiPhone className="text-slate-400 text-xs" />
                        <span>{transport.driverPhone}</span>
                      </p>
                    )}
                  </div>

                  {/* Center: Transit Fee */}
                  <div className="min-w-[140px] space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Monthly Transit Fee
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
                      <FiDollarSign className="text-emerald-500 text-xs" />
                      <span>Rs. {transport.fee || 0}</span>
                      <span className="text-[11px] font-normal text-slate-400">/ mo</span>
                    </p>
                  </div>

                  {/* Center-Right: Capacity Progress */}
                  <div className="min-w-[180px] lg:w-48 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px] font-semibold">
                        Seat Occupancy
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] font-mono">
                        {assignedCount} / {capacity} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct >= 95
                            ? 'bg-rose-500'
                            : pct >= 75
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FiUsers}
                      onClick={() => handleAssignStudent(transport)}
                      disabled={assignedCount >= capacity}
                    >
                      {assignedCount >= capacity ? 'Full Capacity' : 'Assign Passenger'}
                    </Button>
                    <button
                      onClick={() => handleEditTransport(transport)}
                      className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-xs"
                      title="Edit Route"
                    >
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(transport._id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 shadow-xs"
                      title="Decommission Vehicle"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* ── Assigned Passengers Sub-Panel ── */}
                <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Enrolled Passengers ({assignedCount}):
                    </span>
                    {assignedCount === 0 && (
                      <span className="text-xs text-slate-400 italic">
                        No students assigned to this transit route yet.
                      </span>
                    )}
                  </div>

                  {transport.students && transport.students.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto">
                      {transport.students.map((student) => (
                        <span
                          key={student._id}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                        >
                          <span className="truncate max-w-[120px] font-medium">
                            {student.name || student.user?.name}
                          </span>
                          <button
                            onClick={() => handleRemoveStudent(transport._id, student._id)}
                            className="p-0.5 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                            title="Unassign Passenger"
                          >
                            <FiX className="text-xs" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Vehicle Route Modal ── */}
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
              icon={FiPhone}
              error={errors.driverPhone}
            />
            <Input
              label="Driver License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="Commercial driver license #"
              icon={FiShield}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Vehicle Passenger Capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g. 30"
              required
              icon={FiUsers}
              error={errors.capacity}
            />
            <Input
              label="Monthly Transit Fee (Rs.)"
              name="fee"
              type="number"
              min="0"
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

      {/* ── Assign Student Passenger Modal ── */}
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
              <strong className="text-slate-900 dark:text-white">Designated Route:</strong>{' '}
              {selectedTransport?.route?.start} → {selectedTransport?.route?.end}
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Available Capacity:</strong>{' '}
              {(selectedTransport?.capacity || 0) - (selectedTransport?.students?.length || 0)} / {selectedTransport?.capacity || 0} Seats Remaining
            </p>
          </div>

          <div>
            <label className="label">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="select-field text-xs py-2 w-full"
            >
              <option value="">Select a student to assign...</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name || student.user?.name} — {student.studentId || 'ID Pending'}
                </option>
              ))}
            </select>
          </div>

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
              onClick={handleAssignSubmit}
              loading={formLoading}
              disabled={!selectedStudent}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Confirm Decommission Dialog ── */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Decommission Transport Route"
        message="Are you sure you want to decommission this vehicle route? All assigned students will need to be reallocated to another route."
        confirmText="Decommission Route"
        confirmVariant="danger"
        loading={deleteLoading}
      />
    </div>
  );
};

export default Transport;
