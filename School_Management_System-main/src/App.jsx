import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts (Statically loaded for instantaneous shell rendering)
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy-loaded Auth Pages
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

// Lazy-loaded Super Admin Pages
const SuperAdminDashboard = lazy(() => import('./pages/superadmin/Dashboard'));
const Schools = lazy(() => import('./pages/superadmin/Schools'));
const Users = lazy(() => import('./pages/superadmin/Users'));
const Analytics = lazy(() => import('./pages/superadmin/Analytics'));
const SuperAdminSettings = lazy(() => import('./pages/superadmin/Settings'));

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const Students = lazy(() => import('./pages/admin/Students'));
const Teachers = lazy(() => import('./pages/admin/Teachers'));
const Classes = lazy(() => import('./pages/admin/Classes'));
const Subjects = lazy(() => import('./pages/admin/Subjects'));
const AdminAttendance = lazy(() => import('./pages/admin/Attendance'));
const Exams = lazy(() => import('./pages/admin/Exams'));
const Results = lazy(() => import('./pages/admin/Results'));
const Fees = lazy(() => import('./pages/admin/Fees'));
const Timetable = lazy(() => import('./pages/admin/Timetable'));
const Library = lazy(() => import('./pages/admin/Library'));
const Transport = lazy(() => import('./pages/admin/Transport'));
const Notices = lazy(() => import('./pages/admin/Notices'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const AdminSettings = lazy(() => import('./pages/admin/Settings'));

// Lazy-loaded Teacher Pages
const TeacherDashboard = lazy(() => import('./pages/teacher/Dashboard'));
const TeacherAttendance = lazy(() => import('./pages/teacher/Attendance'));
const TeacherAssignments = lazy(() => import('./pages/teacher/Assignments'));
const TeacherResults = lazy(() => import('./pages/teacher/Results'));
const TeacherClasses = lazy(() => import('./pages/teacher/Classes'));
const TeacherProfile = lazy(() => import('./pages/teacher/Profile'));

// Lazy-loaded Student Pages
const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const StudentProfile = lazy(() => import('./pages/student/Profile'));
const StudentAttendance = lazy(() => import('./pages/student/Attendance'));
const StudentResults = lazy(() => import('./pages/student/Results'));
const StudentFees = lazy(() => import('./pages/student/Fees'));
const StudentAssignments = lazy(() => import('./pages/student/Assignments'));
const StudentTimetable = lazy(() => import('./pages/student/Timetable'));

// Lazy-loaded Parent Pages
const ParentDashboard = lazy(() => import('./pages/parent/Dashboard'));
const Children = lazy(() => import('./pages/parent/Children'));
const ParentAttendance = lazy(() => import('./pages/parent/Attendance'));
const ParentResults = lazy(() => import('./pages/parent/Results'));
const ParentFees = lazy(() => import('./pages/parent/Fees'));

// Lazy-loaded Coordinator Pages
const CoordinatorDashboard = lazy(() => import('./pages/coordinator/Dashboard'));
const Departments = lazy(() => import('./pages/coordinator/Departments'));
const CoordinatorAttendance = lazy(() => import('./pages/coordinator/Attendance'));
const CoordinatorReports = lazy(() => import('./pages/coordinator/Reports'));

// Lazy-loaded Examination Pages
const ExaminationDashboard = lazy(() => import('./pages/examination/Dashboard'));
const ExaminationExams = lazy(() => import('./pages/examination/Exams'));
const ExaminationResults = lazy(() => import('./pages/examination/Results'));
const DateSheets = lazy(() => import('./pages/examination/DateSheets'));

// Lazy-loaded Common Pages
const NotFound = lazy(() => import('./pages/common/NotFound'));
const Unauthorized = lazy(() => import('./pages/common/Unauthorized'));
const Profile = lazy(() => import('./pages/common/Profile'));

const PageLoaderFallback = () => (
  <div className="p-6 space-y-6 animate-pulse" aria-busy="true" aria-label="Loading page content">
    <div className="space-y-2">
      <div className="h-7 w-48 bg-slate-200 dark:bg-slate-700/60 rounded-lg" />
      <div className="h-4 w-72 bg-slate-200 dark:bg-slate-700/40 rounded" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-6 h-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
      ))}
    </div>
    <div className="card p-6 h-72 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl" />
  </div>
);

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

      <Suspense fallback={<PageLoaderFallback />}>
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
            <Route path="settings" element={<SuperAdminSettings />} />
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
            <Route path="settings" element={<AdminSettings />} />
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
      </Suspense>
    </>
  );
};

export default App;
