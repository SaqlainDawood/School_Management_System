import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import Schools from './pages/superadmin/Schools';
import Users from './pages/superadmin/Users';
import Analytics from './pages/superadmin/Analytics';
import Settings from './pages/superadmin/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import Teachers from './pages/admin/Teachers';
import Classes from './pages/admin/Classes';
import Subjects from './pages/admin/Subjects';
import AdminAttendance from './pages/admin/Attendance';
import Exams from './pages/admin/Exams';
import Results from './pages/admin/Results';
import Fees from './pages/admin/Fees';
import Timetable from './pages/admin/Timetable';
import Library from './pages/admin/Library';
import Transport from './pages/admin/Transport';
import Notices from './pages/admin/Notices';
import Reports from './pages/admin/Reports';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherAttendance from './pages/teacher/Attendance';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherResults from './pages/teacher/Results';
import TeacherClasses from './pages/teacher/Classes';
import TeacherProfile from './pages/teacher/Profile';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import StudentAttendance from './pages/student/Attendance';
import StudentResults from './pages/student/Results';
import StudentFees from './pages/student/Fees';
import StudentAssignments from './pages/student/Assignments';
import StudentTimetable from './pages/student/Timetable';

// Parent Pages
import ParentDashboard from './pages/parent/Dashboard';
import Children from './pages/parent/Children';
import ParentAttendance from './pages/parent/Attendance';
import ParentResults from './pages/parent/Results';
import ParentFees from './pages/parent/Fees';

// Coordinator Pages
import CoordinatorDashboard from './pages/coordinator/Dashboard';
import Departments from './pages/coordinator/Departments';
import CoordinatorAttendance from './pages/coordinator/Attendance';
import CoordinatorReports from './pages/coordinator/Reports';

// Examination Pages
import ExaminationDashboard from './pages/examination/Dashboard';
import ExaminationExams from './pages/examination/Exams';
import ExaminationResults from './pages/examination/Results';
import DateSheets from './pages/examination/DateSheets';

// Common Pages
import NotFound from './pages/common/NotFound';
import Unauthorized from './pages/common/Unauthorized';
import Profile from './pages/common/Profile';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  const { user } = useAuth();

  const getDefaultRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'superadmin':
        return '/superadmin/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'teacher':
        return '/teacher/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'parent':
        return '/parent/dashboard';
      case 'coordinator':
        return '/coordinator/dashboard';
      case 'examination':
        return '/examination/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* Super Admin Routes */}
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute roles={['superadmin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="schools" element={<Schools />} />
          <Route path="users" element={<Users />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="exams" element={<Exams />} />
          <Route path="results" element={<Results />} />
          <Route path="fees" element={<Fees />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="library" element={<Library />} />
          <Route path="transport" element={<Transport />} />
          <Route path="notices" element={<Notices />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute roles={['teacher']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/teacher/dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="assignments" element={<TeacherAssignments />} />
          <Route path="results" element={<TeacherResults />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={['student']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="timetable" element={<StudentTimetable />} />
        </Route>

        {/* Parent Routes */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute roles={['parent']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/parent/dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="children" element={<Children />} />
          <Route path="attendance" element={<ParentAttendance />} />
          <Route path="results" element={<ParentResults />} />
          <Route path="fees" element={<ParentFees />} />
        </Route>

        {/* Coordinator Routes */}
        <Route
          path="/coordinator"
          element={
            <ProtectedRoute roles={['coordinator']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/coordinator/dashboard" replace />} />
          <Route path="dashboard" element={<CoordinatorDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="attendance" element={<CoordinatorAttendance />} />
          <Route path="reports" element={<CoordinatorReports />} />
        </Route>

        {/* Examination Routes */}
        <Route
          path="/examination"
          element={
            <ProtectedRoute roles={['examination']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/examination/dashboard" replace />} />
          <Route path="dashboard" element={<ExaminationDashboard />} />
          <Route path="exams" element={<ExaminationExams />} />
          <Route path="results" element={<ExaminationResults />} />
          <Route path="datesheets" element={<DateSheets />} />
        </Route>

        {/* Common Routes */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;