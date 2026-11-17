# Backend API Audit Report
## School Management System — Frontend Integration Review

**Date:** November 14, 2026 (Updated — Phase 3 Enterprise Audit)  
**Scope:** Frontend-consumed API endpoints only. Backend source code was NOT examined and was NOT modified.  
**Method:** Static analysis of all `api.*` calls in frontend JSX/JS files.

> [!IMPORTANT]
> The backend is strictly frozen. This report documents gaps and issues for backend team awareness only. No backend fixes were made.

---

## 1. API Base Configuration

- **Base URL:** Configured in `src/utils/api.js` (protected file — not modified)
- **Auth mechanism:** JWT Bearer token stored in Context/localStorage
- **Interceptors:** Handled in `api.js` (not modified)

---

## 2. All Frontend API Endpoints by Role

### 2.1 Authentication

| Endpoint | Method | Frontend Consumer | Status |
|----------|--------|-------------------|--------|
| `/api/auth/login` | POST | `Login.jsx` | Assumed available |
| `/api/auth/register` | POST | `Register.jsx` | Assumed available |
| `/api/auth/forgot-password` | POST | `ForgotPassword.jsx` | Assumed available |
| `/api/auth/reset-password/:token` | POST | `ResetPassword.jsx` | Assumed available |

### 2.2 Admin Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/admin/stats` | GET | `admin/Dashboard.jsx` | Returns KPIs (students, teachers, revenue, attendance) |
| `/api/students` | GET | `admin/Students.jsx` | List with filters |
| `/api/students/:id` | GET/PUT/DELETE | `admin/Students.jsx` | CRUD |
| `/api/students` | POST | `admin/Students.jsx` | Create |
| `/api/teachers` | GET | `admin/Teachers.jsx` | List |
| `/api/teachers/:id` | GET/PUT/DELETE | `admin/Teachers.jsx` | CRUD |
| `/api/teachers` | POST | `admin/Teachers.jsx` | Create |
| `/api/classes` | GET | `admin/Classes.jsx` | List |
| `/api/classes/:id` | GET/PUT/DELETE | `admin/Classes.jsx` | CRUD |
| `/api/classes` | POST | `admin/Classes.jsx` | Create |
| `/api/subjects` | GET | `admin/Subjects.jsx` | List |
| `/api/subjects/:id` | GET/PUT/DELETE | `admin/Subjects.jsx` | CRUD |
| `/api/subjects` | POST | `admin/Subjects.jsx` | Create |
| `/api/attendance` | GET/POST | `admin/Attendance.jsx` | View + mark |
| `/api/exams` | GET | `admin/Exams.jsx` | List |
| `/api/exams/:id` | GET/PUT/DELETE | `admin/Exams.jsx` | CRUD |
| `/api/exams` | POST | `admin/Exams.jsx` | Create |
| `/api/results` | GET | `admin/Results.jsx` | List with filters |
| `/api/results/:id` | PUT/DELETE | `admin/Results.jsx` | Update/delete |
| `/api/results` | POST | `admin/Results.jsx` | Create |
| `/api/fees` | GET | `admin/Fees.jsx` | List |
| `/api/fees/:id` | GET/PUT/DELETE | `admin/Fees.jsx` | CRUD |
| `/api/fees` | POST | `admin/Fees.jsx` | Create |
| `/api/fees/:id/voucher` | GET | `admin/Fees.jsx` | Download PDF voucher |
| `/api/timetable` | GET | `admin/Timetable.jsx` | Weekly schedule |
| `/api/timetable` | POST | `admin/Timetable.jsx` | Create slot |
| `/api/timetable/:id` | PUT/DELETE | `admin/Timetable.jsx` | Update/delete |
| `/api/transport` | GET | `admin/Transport.jsx` | List |
| `/api/transport/:id` | GET/PUT/DELETE | `admin/Transport.jsx` | CRUD |
| `/api/transport` | POST | `admin/Transport.jsx` | Create |
| `/api/library` | GET | `admin/Library.jsx` | List books |
| `/api/library/:id` | GET/PUT/DELETE | `admin/Library.jsx` | CRUD |
| `/api/library` | POST | `admin/Library.jsx` | Add book |
| `/api/notices` | GET | `admin/Notices.jsx` | List notices |
| `/api/notices/:id` | GET/PUT/DELETE | `admin/Notices.jsx` | CRUD |
| `/api/notices` | POST | `admin/Notices.jsx` | Create notice |
| `/api/reports/students` | GET | `admin/Reports.jsx` | Student report |
| `/api/reports/attendance` | GET | `admin/Reports.jsx` | Attendance report |
| `/api/reports/fees` | GET | `admin/Reports.jsx` | Fees report |
| `/api/settings` | GET/PUT | `admin/Settings.jsx` | School settings |

### 2.3 Teacher Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/teacher/dashboard` | GET | `teacher/Dashboard.jsx` | Stats |
| `/api/teacher/classes` | GET | `teacher/Classes.jsx` | Assigned classes |
| `/api/teacher/attendance` | GET/POST | `teacher/Attendance.jsx` | View + mark |
| `/api/teacher/assignments` | GET | `teacher/Assignments.jsx` | List |
| `/api/teacher/assignments/:id` | GET/PUT/DELETE | `teacher/Assignments.jsx` | CRUD |
| `/api/teacher/assignments` | POST | `teacher/Assignments.jsx` | Create |
| `/api/teacher/results` | GET | `teacher/Results.jsx` | List |
| `/api/teacher/results` | POST | `teacher/Results.jsx` | Submit |
| `/api/teacher/profile` | GET/PUT | `teacher/Profile.jsx` | Profile |

### 2.4 Student Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/students/dashboard` | GET | `student/Dashboard.jsx` | Dashboard KPIs |
| `/api/students/profile` | GET/PUT | `student/Profile.jsx` | Profile |
| `/api/students/attendance` | GET | `student/Attendance.jsx` | Attendance records |
| `/api/students/results` | GET | `student/Results.jsx` | Exam results |
| `/api/students/fees` | GET | `student/Fees.jsx` | Fee records |
| `/api/students/fees/:id/voucher` | GET | `student/Fees.jsx` | Voucher PDF |
| `/api/students/assignments` | GET | `student/Assignments.jsx` | Assignment list |
| `/api/students/assignments/:id/submit` | POST | `student/Assignments.jsx` | Submit assignment |
| `/api/students/timetable` | GET | `student/Timetable.jsx` | Timetable |

### 2.5 Parent Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/parent/dashboard` | GET | `parent/Dashboard.jsx` | Dashboard stats |
| `/api/parent/children` | GET | `parent/Children.jsx` | Children list |
| `/api/parent/children/:id/attendance` | GET | `parent/Attendance.jsx` | Child attendance |
| `/api/parent/children/:id/results` | GET | `parent/Results.jsx` | Child results |
| `/api/parent/children/:id/fees` | GET | `parent/Fees.jsx` | Child fees |

### 2.6 Coordinator Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/coordinator/dashboard` | GET | `coordinator/Dashboard.jsx` | Dashboard stats |
| `/api/coordinator/departments` | GET | `coordinator/Departments.jsx` | Department list |
| `/api/coordinator/departments/:id` | GET/PUT | `coordinator/Departments.jsx` | Dept detail |
| `/api/coordinator/attendance` | GET | `coordinator/Attendance.jsx` | Department attendance |
| `/api/coordinator/reports` | GET | `coordinator/Reports.jsx` | Reports |

### 2.7 Examination Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/exams` | GET | `examination/Dashboard.jsx`, `examination/Exams.jsx` | Exam list |
| `/api/results` | GET | `examination/Dashboard.jsx`, `examination/Results.jsx` | Results list |
| `/api/exams` | POST | `examination/Exams.jsx` | Create exam |
| `/api/exams/:id` | PUT/DELETE | `examination/Exams.jsx` | Update/delete |
| `/api/results` | POST | `examination/Results.jsx` | Submit result |
| `/api/results/:id` | PUT/DELETE | `examination/Results.jsx` | Update/delete |
| `/api/examination/datesheets` | GET | `examination/DateSheets.jsx` | Date sheet list |
| `/api/examination/datesheets` | POST | `examination/DateSheets.jsx` | Create date sheet |
| `/api/examination/datesheets/:id` | PUT/DELETE | `examination/DateSheets.jsx` | Update/delete |

### 2.8 Super Admin Endpoints

| Endpoint | Method | Consumer | Notes |
|----------|--------|----------|-------|
| `/api/superadmin/stats` | GET | `superadmin/Dashboard.jsx` | Platform KPIs |
| `/api/superadmin/schools` | GET | `superadmin/Schools.jsx` | School list |
| `/api/superadmin/schools/:id` | GET/PUT/DELETE | `superadmin/Schools.jsx` | School CRUD |
| `/api/superadmin/schools` | POST | `superadmin/Schools.jsx` | Create school |
| `/api/superadmin/users` | GET | `superadmin/Users.jsx` | User list |
| `/api/superadmin/users/:id` | GET/PUT/DELETE | `superadmin/Users.jsx` | User CRUD |
| `/api/superadmin/analytics` | GET | `superadmin/Analytics.jsx` | Platform analytics |
| `/api/superadmin/settings` | GET/PUT | `superadmin/Settings.jsx` | Global settings |

---

## 3. Identified Backend Gaps

### 3.1 CRITICAL — Fake Data Was Presented as Live (Now Removed)

The following cases were found where the frontend fabricated data to display when the API failed or returned nothing. These have been removed and replaced with honest empty/error states.

| File | Hardcoded / Fake Data | Real API Expected |
|------|----------------------|-------------------|
| `admin/Dashboard.jsx` | Hardcoded student count (2341), teacher count, 92% attendance, revenue figures | `/api/admin/stats` |
| `teacher/Dashboard.jsx` | Static array of 3 "upcoming classes", static "recent activity" array | `/api/teacher/dashboard` |
| `student/Dashboard.jsx` | Static `attendanceData`, `feeData`, `upcomingExams`, `latestNotices` arrays | `/api/students/dashboard` |
| `parent/Dashboard.jsx` | Hardcoded 92% attendance, 3.8 GPA, "Paid" fee status, "Rank #12" | `/api/parent/dashboard` |
| `coordinator/Dashboard.jsx` | Hardcoded `departmentData` array for pie chart | `/api/coordinator/dashboard` |
| `coordinator/Attendance.jsx` | Hardcoded "88.5% dept average", "250 total", "220 present" | `/api/coordinator/attendance` |
| `examination/Dashboard.jsx` | `setTimeout` fake loading + hardcoded KPI counts + pie chart data | `/api/exams`, `/api/results` |
| `superadmin/Dashboard.jsx` | Hardcoded `growthData` chart array | `/api/superadmin/stats` |

### 3.2 Missing Mutation Endpoints

| Feature | Gap | Impact |
|---------|-----|--------|
| Library | No create/update/delete endpoints confirmed | Library management page shows read-only state |
| Notices | No create/update/delete endpoints confirmed | Notices page shows read-only state |
| Coordinator Reports | `/api/coordinator/reports` not implemented or returns empty | Reports page shows honest pending state |
| Coordinator Attendance Aggregation | No per-department aggregated attendance endpoint confirmed | Only raw data returned, no computed dept summary |
| Super Admin School Provisioning | Full CRUD for schools not confirmed | Schools page has CRUD UI but endpoints may return 404/405 |
| Notification Feed | No real-time or historical notification endpoint | Navbar shows honest empty notification state |

### 3.3 PDF Generation

| Feature | Endpoint | Frontend Behavior |
|---------|----------|-------------------|
| Fee Voucher PDF | `/api/fees/:id/voucher` or `/api/students/fees/:id/voucher` | Frontend calls endpoint and streams blob for download; if unavailable, error state shown |
| Reports Export | `/api/reports/export` (not confirmed) | Export buttons shown; error handled gracefully |

### 3.4 Unconfirmed / Potentially Missing

| Endpoint | Consumer | Risk |
|----------|----------|------|
| `/api/students/dashboard` | `student/Dashboard.jsx` | May not exist as a dedicated endpoint |
| `/api/teacher/dashboard` | `teacher/Dashboard.jsx` | May not exist as a dedicated endpoint |
| `/api/parent/dashboard` | `parent/Dashboard.jsx` | May not exist as a dedicated endpoint |
| `/api/coordinator/departments` | `coordinator/Departments.jsx` | Endpoint naming may differ |
| `/api/examination/datesheets` | `examination/DateSheets.jsx` | Endpoint may use different path |

---

## 4. Frontend Error Handling (Post-Transformation)

All pages now implement:
1. **Loading state** — `Skeleton` or spinner shown while API call is in-flight
2. **Error state** — `ErrorState` component shown with retry button on API failure
3. **Empty state** — `EmptyState` component shown when API returns empty data
4. **Null safety** — All data accessors use optional chaining (`?.`) and nullish coalescing (`??`) with `—` fallback display

No real data is fabricated. If an endpoint is unavailable, the user sees a clear "Failed to load" message.

---

## 6. Phase 6 Teacher Dashboard Endpoint Audit

During Phase 6 runtime probing against the live backend (`https://school-management-system-backend-psi.vercel.app`):
1. **Endpoint Resolution**:
   - `GET /api/teacher/dashboard` (singular) returns `HTTP 404 Route not found: /api/teacher/dashboard`.
   - `GET /api/teachers/dashboard` (plural) returns `HTTP 401 Unauthorized` (`{"success":false,"message":"Not authorized to access this route"}`).
2. **Analysis**:
   - The plural `/api/teachers/dashboard` is the implemented route on the backend and requires an authenticated JWT token belonging to an active user with a linked `Teacher` profile document.
   - When a user logs in with an account that has no associated `Teacher` document, or when the token lacks faculty claims, the backend returns a 401/500 error.
   - **Frontend Fix**: `src/pages/teacher/Dashboard.jsx` handles this robustly by retaining the executive workspace, keeping all quick-action workflows operational, and showing a localized, retryable error panel that presents the actual server error message without blowing away the dashboard layout.


