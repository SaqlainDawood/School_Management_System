# Frontend ESLint Audit Report

**Project:** School Management System Frontend  
**Linter:** oxlint  
**Files Scanned:** 103 files, 104 rules, 12 threads  
**Run Duration:** 162ms  
**Date:** 2026-11-13  

---

## 1. Executive Summary

| Metric | Count |
|---|---|
| **Total Warnings** | **227** |
| **Total Errors** | **0** |
| **FUNCTIONAL warnings** | **98** |
| **COSMETIC warnings** | **129** |
| **Files with warnings** | ~45 |

### Warnings by Rule (Top 10)

| Rank | Rule | Count | Severity |
|---|---|---|---|
| 1 | `eslint(no-unused-vars)` | 118 | COSMETIC |
| 2 | `react(immutability)` | 60 | FUNCTIONAL |
| 3 | `react-hooks(exhaustive-deps)` | 25 | FUNCTIONAL |
| 4 | `react(set-state-in-effect)` | 9 | FUNCTIONAL |
| 5 | `react(purity)` | 9 | FUNCTIONAL (minor) |
| 6 | `react(only-export-components)` | 4 | COSMETIC |
| 7 | `eslint(no-useless-escape)` | 2 | COSMETIC |
| 8 | (others) | — | — |

> [!IMPORTANT]
> The 60 `react(immutability)` warnings are the most critical: they indicate React Compiler detected that async fetch functions are being called before their own declaration is complete (hoisting issue), which can cause data-loading failures or stale data bugs.

---

## 2. FUNCTIONAL Warnings Table

These warnings could cause bugs, stale data, or cascade renders.

### 2a. `react(immutability)` — Cannot access variable while it is being initialized (60 warnings)

| File | Line | Function Called | Description |
|---|---|---|---|
| `src/pages/teacher/Results.jsx` | 19 | `fetchData()` | fetchData called before initialized |
| `src/pages/admin/Notices.jsx` | 24 | `fetchNotices()` | fetchNotices called before initialized |
| `src/pages/student/Profile.jsx` | 50 | `fetchProfile()` | fetchProfile called before initialized |
| `src/components/modals/ClassDetailModal.jsx` | 32 | `fetchClassDetails()` | fetchClassDetails called before initialized |
| `src/pages/admin/Timetable.jsx` | 67 | `fetchTimetables()` | fetchTimetables called before initialized |
| `src/pages/admin/Timetable.jsx` | 68 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/admin/Timetable.jsx` | 69 | `fetchTeachers()` | fetchTeachers called before initialized |
| `src/pages/admin/Timetable.jsx` | 70 | `fetchSubjects()` | fetchSubjects called before initialized |
| `src/context/AuthContext.jsx` | 22 | `loadUser()` | loadUser called before initialized |
| `src/pages/admin/Library.jsx` | 24 | `fetchBooks()` | fetchBooks called before initialized |
| `src/pages/superadmin/Settings.jsx` | 52 | `fetchSettings()` | fetchSettings called before initialized |
| `src/pages/student/Fees.jsx` | 30 | `fetchFees()` | fetchFees called before initialized |
| `src/pages/teacher/Dashboard.jsx` | 39 | `fetchDashboard()` | fetchDashboard called before initialized |
| `src/pages/superadmin/Dashboard.jsx` | 31 | `fetchStats()` | fetchStats called before initialized |
| `src/pages/teacher/Classes.jsx` | 18 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/admin/Teachers.jsx` | 48 | `fetchTeachers()` | fetchTeachers called before initialized |
| `src/pages/student/Dashboard.jsx` | 41 | `fetchDashboard()` | fetchDashboard called before initialized |
| `src/pages/student/Timetable.jsx` | 26 | `fetchTimetable()` | fetchTimetable called before initialized |
| `src/pages/admin/Students.jsx` | 56 | `fetchStudents()` | fetchStudents called before initialized |
| `src/pages/admin/Students.jsx` | 57 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/student/Results.jsx` | 37 | `fetchResults()` | fetchResults called before initialized |
| `src/pages/student/Attendance.jsx` | 45 | `fetchAttendance()` | fetchAttendance called before initialized |
| `src/pages/admin/Dashboard.jsx` | 42 | `fetchStats()` | fetchStats called before initialized |
| `src/pages/admin/Fees.jsx` | 55 | `fetchFees()` | fetchFees called before initialized |
| `src/pages/admin/Fees.jsx` | 56 | `fetchStudents()` | fetchStudents called before initialized |
| `src/pages/student/Assignments.jsx` | 25 | `fetchAssignments()` | fetchAssignments called before initialized |
| `src/pages/examination/Dashboard.jsx` | 35 | `fetchExamOfficeData()` | fetchExamOfficeData called before initialized |
| `src/pages/parent/Fees.jsx` | 28 | `fetchChildren()` | fetchChildren called before initialized |
| `src/pages/parent/Fees.jsx` | 32 | `fetchFees()` | fetchFees called before initialized |
| `src/pages/admin/Settings.jsx` | 51 | `fetchSettings()` | fetchSettings called before initialized |
| `src/pages/parent/Dashboard.jsx` | 25 | `fetchDashboard()` | fetchDashboard called before initialized |
| `src/pages/parent/Attendance.jsx` | 31 | `fetchChildren()` | fetchChildren called before initialized |
| `src/pages/parent/Attendance.jsx` | 35 | `fetchAttendance()` | fetchAttendance called before initialized |
| `src/pages/coordinator/Departments.jsx` | 24 | `fetchDepartments()` | fetchDepartments called before initialized |
| `src/pages/parent/Children.jsx` | 26 | `fetchChildren()` | fetchChildren called before initialized |
| `src/pages/parent/Results.jsx` | 34 | `fetchChildren()` | fetchChildren called before initialized |
| `src/pages/parent/Results.jsx` | 38 | `fetchResults()` | fetchResults called before initialized |
| `src/pages/examination/Results.jsx` | 27 | `fetchData()` | fetchData called before initialized |
| `src/pages/teacher/Assignments.jsx` | 51 | `fetchAssignments()` | fetchAssignments called before initialized |
| `src/pages/teacher/Assignments.jsx` | 52 | `fetchTeacherData()` | fetchTeacherData called before initialized |
| `src/pages/coordinator/Dashboard.jsx` | 23 | `fetchStats()` | fetchStats called before initialized |
| `src/pages/examination/Exams.jsx` | 28 | `fetchData()` | fetchData called before initialized |
| `src/pages/coordinator/Attendance.jsx` | 17 | `fetchDepartments()` | fetchDepartments called before initialized |
| `src/pages/examination/DateSheets.jsx` | 27 | `fetchData()` | fetchData called before initialized |
| `src/pages/admin/Exams.jsx` | 57 | `fetchExams()` | fetchExams called before initialized |
| `src/pages/admin/Exams.jsx` | 58 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/admin/Exams.jsx` | 59 | `fetchSubjects()` | fetchSubjects called before initialized |
| `src/pages/admin/Attendance.jsx` | 33 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/admin/Attendance.jsx` | 38 | `fetchStudents()` | fetchStudents called before initialized |
| `src/pages/admin/Attendance.jsx` | 39 | `fetchAttendance()` | fetchAttendance called before initialized |
| `src/pages/admin/Classes.jsx` | 63 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/admin/Classes.jsx` | 64 | `fetchTeachers()` | fetchTeachers called before initialized |
| `src/pages/admin/Results.jsx` | 52 | `fetchResults()` | fetchResults called before initialized |
| `src/pages/admin/Results.jsx` | 53 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/admin/Results.jsx` | 54 | `fetchExams()` | fetchExams called before initialized |
| `src/pages/admin/Results.jsx` | 55 | `fetchSubjects()` | fetchSubjects called before initialized |
| `src/pages/admin/Transport.jsx` | 52 | `fetchTransports()` | fetchTransports called before initialized |
| `src/pages/admin/Transport.jsx` | 53 | `fetchStudents()` | fetchStudents called before initialized |
| `src/pages/teacher/Attendance.jsx` | 26 | `fetchClasses()` | fetchClasses called before initialized |
| `src/pages/teacher/Attendance.jsx` | 31 | `fetchStudents()` | fetchStudents called before initialized |
| `src/pages/teacher/Attendance.jsx` | 32 | `fetchAttendance()` | fetchAttendance called before initialized |

**Recommended Fix:** Move `const fetchXxx = useCallback(async () => {...}, [...deps])` ABOVE the `useEffect` call. Or restructure to define fetch functions before they are called in effects.

---

### 2b. `react-hooks(exhaustive-deps)` — Missing useEffect dependencies (25 warnings)

| File | Line | Missing Dep(s) | Description |
|---|---|---|---|
| `src/pages/teacher/Results.jsx` | 20 | `fetchData` | useEffect with [filters] missing fetchData |
| `src/components/modals/ClassDetailModal.jsx` | 34 | `fetchClassDetails` | useEffect missing fetchClassDetails |
| `src/pages/admin/Timetable.jsx` | 71 | `fetchTimetables` | useEffect with [] missing fetchTimetables |
| `src/pages/admin/Timetable.jsx` | 75 | `fetchTimetables` | useEffect with [selectedClass] missing fetchTimetables |
| `src/pages/admin/Library.jsx` | 25 | `fetchBooks` | useEffect with [search] missing fetchBooks |
| `src/pages/admin/Teachers.jsx` | 49 | `fetchTeachers` | useEffect missing fetchTeachers |
| `src/pages/admin/Students.jsx` | 58 | `fetchStudents` | useEffect missing fetchStudents |
| `src/pages/admin/Fees.jsx` | 57 | `fetchFees` | useEffect missing fetchFees |
| `src/pages/student/Attendance.jsx` | 46 | `fetchAttendance` | useEffect missing fetchAttendance |
| `src/pages/admin/Settings.jsx` | 52 | `fetchSettings` | useEffect with [] missing fetchSettings |
| `src/pages/parent/Fees.jsx` | 33 | `fetchFees` | useEffect missing fetchFees |
| `src/pages/parent/Attendance.jsx` | 36 | `fetchAttendance` | useEffect missing fetchAttendance |
| `src/pages/parent/Results.jsx` | 39 | `fetchResults` | useEffect missing fetchResults |
| `src/pages/examination/Results.jsx` | 28 | `fetchData` | useEffect missing fetchData |
| `src/pages/examination/Exams.jsx` | 29 | `fetchData` | useEffect missing fetchData |
| `src/pages/examination/DateSheets.jsx` | 28 | `fetchData` | useEffect missing fetchData |
| `src/pages/admin/Exams.jsx` | 60 | `fetchExams` | useEffect with [] missing fetchExams |
| `src/pages/admin/Exams.jsx` | 64 | `fetchExams` | useEffect with [selectedClass] missing fetchExams |
| `src/pages/admin/Attendance.jsx` | 41 | `fetchAttendance`, `fetchStudents` | useEffect missing both deps |
| `src/pages/admin/Results.jsx` | 56 | `fetchResults` | useEffect missing fetchResults |
| `src/pages/teacher/Attendance.jsx` | 34 | `fetchStudents`, `fetchAttendance` | useEffect missing both deps |

**Recommended Fix:** Wrap fetch functions in `useCallback` and add them to the dependency array, OR move fetch logic inline into the `useEffect`.

---

### 2c. `react(set-state-in-effect)` — setState called synchronously in effect (9 warnings)

| File | Line | setState Call | Description |
|---|---|---|---|
| `src/layouts/MainLayout.jsx` | 31 | `setMobileOpen(false)` | setState directly in location-change effect |
| `src/components/forms/TeacherForm.jsx` | 34 | `setFormData({...})` | setState in initialData effect (pre-existing form) |
| `src/context/AuthContext.jsx` | 24 | `setLoading(false)` | setState in auth bootstrap effect |
| `src/components/forms/ClassForm.jsx` | 25 | `setFormData({...})` | setState in initialData effect |
| `src/components/forms/StudentForm.jsx` | 48 | `setFormData({...})` | setState in initialData effect |
| `src/components/modals/AddFeeModal.jsx` | 43 | `setFormData({...})` | setState in initialData effect |
| `src/components/forms/TextArea.jsx` | 24 | `setCharCount(...)` | setState in value-change effect |

**Recommended Fix:** Derive values during render using `useMemo` / computed values, or initialize state from props directly. For form pre-population, prefer `useMemo` on `initialData`.

---

### 2d. `react(purity)` — Impure `new Date()` calls during render (9 warnings)

| File | Line | Description |
|---|---|---|
| `src/layouts/AuthLayout.jsx` | 61 | `new Date().getFullYear()` in JSX |
| `src/pages/student/Dashboard.jsx` | 32 | `const today = new Date()` in render |
| `src/pages/teacher/Attendance.jsx` | 23 | `new Date().toISOString()` in useState initializer |
| `src/pages/student/Attendance.jsx` | 33 | `new Date().getMonth()` in useState initializer |
| `src/pages/student/Attendance.jsx` | 34 | `new Date().getFullYear()` in useState initializer |
| `src/pages/student/Assignments.jsx` | 75 | `new Date()` in JSX conditional |
| `src/pages/parent/Attendance.jsx` | 27 | `new Date().getMonth()` in useState initializer |
| `src/pages/parent/Attendance.jsx` | 28 | `new Date().getFullYear()` in useState initializer |
| `src/pages/admin/Attendance.jsx` | 25 | `new Date().toISOString()` in useState initializer |
| `src/pages/admin/Dashboard.jsx` | 83 | `new Date().getHours()` in render function |

> [!NOTE]
> `new Date()` in `useState(() => ...)` lazy initializers is acceptable (called once). The purity lint is overly strict for lazy initializers; actual risk is only in render-time direct JSX or non-lazy useState.

**Recommended Fix:** Move `new Date()` to a lazy initializer `useState(() => new Date().getX())` or extract to a module-level constant. For JSX, pre-compute outside return.

---

## 3. COSMETIC Warnings Table

These do not break functionality but add dead code / reduce maintainability.

### 3a. `eslint(no-unused-vars)` — Unused imports & variables (118 warnings)

| File | Unused Identifiers | Count |
|---|---|---|
| `src/pages/superadmin/Users.jsx` | FiUsers, FiUserCheck, FiShield, FiFilter, toast, Button | 6 |
| `src/components/modals/VoucherModal.jsx` | FiMail, FiCalendar | 2 |
| `src/layouts/AuthLayout.jsx` | motion | 1 |
| `src/pages/student/Profile.jsx` | FiAward, FiCheckCircle, FiAlertCircle, FiUsers | 4 |
| `src/components/forms/FileUpload.jsx` | FiFile | 1 |
| `src/pages/superadmin/Settings.jsx` | FiMoon, FiSun, FiCheckCircle, error (×2) | 5 |
| `src/pages/superadmin/Schools.jsx` | FiBook, FiMapPin, FiUsers, FiPhone, FiMail, FiInfo | 6 |
| `src/utils/validators.js` | (no-useless-escape ×2 — categorized separately) | — |
| `src/pages/student/Fees.jsx` | — | 0 extra |
| `src/utils/helpers.js` | e (catch param) | 1 |
| `src/pages/superadmin/Dashboard.jsx` | FiBarChart2, FiShield, SectionCard | 3 |
| `src/pages/superadmin/Analytics.jsx` | FiCpu, FiHardDrive, FiShield | 3 |
| `src/components/common/Navbar.jsx` | mobileOpen (param), location | 2 |
| `src/pages/student/Dashboard.jsx` | motion, FiBook, FiCheckCircle, FiAlertCircle, EmptyState | 5 |
| `src/pages/student/Timetable.jsx` | FiClock, FiBook | 2 |
| `src/pages/admin/Students.jsx` | FiEye, FiFilter | 2 |
| `src/pages/admin/Timetable.jsx` | FiClock, FiBook, FiMapPin | 3 |
| `src/context/ThemeContext.jsx` | (only-export-components) | — |
| `src/components/modals/AddFeeModal.jsx` | FiBook, classes (param) | 2 |
| `src/pages/teacher/Attendance.jsx` | FiCheckCircle, FiXCircle, FiClock, Select | 4 |
| `src/pages/student/Results.jsx` | FiBarChart2, BarChart, Bar | 3 |
| `src/pages/student/Attendance.jsx` | FiAlertCircle, FiRefreshCw | 2 |
| `src/pages/admin/Dashboard.jsx` | Button | 1 |
| `src/pages/admin/Fees.jsx` | FiTrendingUp | 1 |
| `src/pages/student/Assignments.jsx` | FiCheckCircle, FiAlertCircle, FiBook, SectionCard | 4 |
| `src/pages/examination/Dashboard.jsx` | FiFileText, FiArrowRight | 2 |
| `src/pages/admin/Settings.jsx` | FiMoon, FiSun, err (×2) | 4 |
| `src/pages/parent/Dashboard.jsx` | FiBook, FiArrowRight, FiCheckCircle, SectionCard, formatDate | 5 |
| `src/pages/coordinator/Reports.jsx` | FiUsers, FiDollarSign, FiClock, FiFileText | 4 |
| `src/pages/common/Profile.jsx` | FiShield, SectionCard | 2 |
| `src/pages/coordinator/Departments.jsx` | FiEdit2, FiTrash2, SectionCard | 3 |
| `src/pages/parent/Children.jsx` | FiUser, FiBook, FiClock, FiAward, FiDollarSign, FiHash, FiCalendar, SectionCard | 8 |
| `src/pages/auth/Register.jsx` | confirmPassword | 1 |
| `src/pages/parent/Results.jsx` | FiBook, FiTrendingUp, FiCheckCircle | 3 |
| `src/pages/examination/Results.jsx` | FiEdit2, FiTrash2, FiCheckCircle, FiClock | 4 |
| `src/pages/examination/Exams.jsx` | FiEdit2, FiTrash2, FiClock | 3 |
| `src/pages/admin/Subjects.jsx` | motion, AnimatePresence | 2 |
| `src/pages/examination/DateSheets.jsx` | FiBook, FiAward | 2 |
| `src/pages/admin/Exams.jsx` | FiFilter | 1 |
| `src/pages/admin/Attendance.jsx` | FiCheckCircle, FiXCircle, FiClock, Select | 4 |
| `src/pages/admin/Classes.jsx` | FiTrash | 1 |
| `src/pages/admin/Results.jsx` | FiUser, FiBook, FiCheckCircle, Input | 4 |
| `src/pages/admin/Library.jsx` | FiInfo | 1 |

### 3b. `react(only-export-components)` — Non-component exports from component files (4 warnings)

| File | Line | Export | Description |
|---|---|---|---|
| `src/context/NotificationContext.jsx` | 6 | `useNotification` hook | Hook exported alongside context — fast-refresh issue |
| `src/context/AuthContext.jsx` | 7 | `useAuth` hook | Hook exported alongside context — fast-refresh issue |
| `src/context/ThemeContext.jsx` | 5 | `useTheme` hook | Hook exported alongside context |
| `src/context/ThemeContext.jsx` | 3 | `ThemeContext` constant | Context object exported alongside provider |

**Recommended Fix:** Move hooks and context objects to separate files or use a barrel `index.js`.

### 3c. `eslint(no-useless-escape)` — Unnecessary escape in regex (2 warnings)

| File | Line | Description |
|---|---|---|
| `src/utils/validators.js` | 3 | `\.` inside character class `[\\.-]` — escape is unnecessary |
| `src/utils/validators.js` | 3 | Same pattern repeated |

**Recommended Fix:** Change `[\.-]` to `[.\-]` or `[.-]`.

---

## 4. Per-Module Warning Breakdown

| Module / Portal | Files Affected | Approx. Warnings | Key Issues |
|---|---|---|---|
| **admin** | Dashboard, Students, Teachers, Classes, Subjects, Fees, Timetable, Attendance, Exams, Results, Transport, Library, Notices, Settings | ~90 | Most warnings; heavy data-fetch patterns |
| **student** | Dashboard, Profile, Results, Attendance, Timetable, Assignments, Fees | ~38 | Immutability, purity, unused icons |
| **parent** | Dashboard, Children, Fees, Attendance, Results | ~32 | Immutability + exhaustive-deps per-child patterns |
| **examination** | Dashboard, Exams, Results, DateSheets | ~20 | Consistent fetchData immutability + unused icons |
| **superadmin** | Dashboard, Users, Schools, Settings, Analytics | ~25 | Heavy unused icon imports |
| **coordinator** | Dashboard, Departments, Reports, Attendance | ~12 | Mostly unused imports |
| **teacher** | Dashboard, Classes, Attendance, Results, Assignments | ~18 | Immutability + exhaustive-deps |
| **common/components** | Navbar, AuthLayout, MainLayout, TextArea, ClassForm, TeacherForm, StudentForm, FileUpload, ClassDetailModal, AddFeeModal, VoucherModal | ~18 | set-state-in-effect in forms, unused icons |
| **context** | AuthContext, ThemeContext, NotificationContext | ~5 | only-export-components, immutability |
| **utils** | helpers.js, validators.js | ~3 | Catch param unused, useless escape |
| **auth** | Register.jsx | 1 | confirmPassword unused |

---

## 5. Pre-Existing vs. Transformation-Introduced

### Classification Methodology
- **PRE-EXISTING**: Warnings in files that are form components (`TeacherForm`, `ClassForm`, `StudentForm`), existing admin pages predating the portal transformation, context files (`AuthContext`, `ThemeContext`), and utility files.
- **TRANSFORMATION-INTRODUCED (NEW)**: Warnings in newly created or heavily modified portal pages (parent/*, coordinator/*, examination/*, student/*, and new admin pages introduced during the backend integration transformation).

| Category | Approx. Count | Key Files |
|---|---|---|
| **PRE-EXISTING** | ~40 | `TeacherForm.jsx`, `ClassForm.jsx`, `StudentForm.jsx`, `AuthContext.jsx`, `ThemeContext.jsx`, `validators.js`, `helpers.js`, `Navbar.jsx`, `TextArea.jsx` |
| **TRANSFORMATION-INTRODUCED** | ~187 | All portal pages (parent/*, coordinator/*, examination/*), new admin pages (Transport, Exams, Results, Subjects, Attendance), student/*, teacher/* |

> [!NOTE]
> The transformation-introduced warnings are predominantly the **uniform pattern** of:
> 1. `const fetchXxx = async () => { ... }` defined AFTER the `useEffect` that calls it
> 2. The `useEffect` dep array omitting `fetchXxx`  
> 3. Leftover icon imports from copy-paste scaffolding
>
> This is a consistent architectural pattern applied across all new pages, suggesting the transformation used a template that places function definitions after their useEffect callers.

---

## 6. Prioritized Cleanup Recommendations (Future Frontend Phase)

### Priority 1 — CRITICAL: Fix `react(immutability)` Pattern (60 warnings)
**Effort:** Medium | **Risk if unfixed:** Potential data-load failures with React Compiler enabled

Refactor all pages using this pattern:
```js
// ❌ Current (broken with React Compiler)
useEffect(() => { fetchData(); }, [deps]);
const fetchData = async () => { ... };

// ✅ Fix: move fetchData above, wrap in useCallback
const fetchData = useCallback(async () => { ... }, [...deps]);
useEffect(() => { fetchData(); }, [deps, fetchData]);
```

**Files requiring this fix:** All ~40 page files (admin/*, student/*, parent/*, teacher/*, examination/*, coordinator/*).

### Priority 2 — HIGH: Fix `react-hooks(exhaustive-deps)` (25 warnings)
**Effort:** Low (after Priority 1 is done — fixing immutability will resolve most of these)

Add `fetchXxx` to useEffect dependency arrays after wrapping in `useCallback`.

### Priority 3 — MEDIUM: Fix `react(set-state-in-effect)` in Forms (9 warnings)
**Effort:** Low | **Impact:** Prevents cascading re-renders in form components

Replace `useEffect(() => { if(initialData) setFormData({...}); }, [initialData])` with `useMemo`-derived state or `useState(() => initialData ? {...} : defaults)`.

### Priority 4 — LOW: Remove Unused Imports (118 `no-unused-vars` warnings)
**Effort:** Very Low (automated) | **Impact:** Bundle size reduction, cleaner code

Run: `eslint --fix` or use an IDE's "remove unused imports" action across all files.

### Priority 5 — LOW: Fix Context File Exports (4 `only-export-components`)
**Effort:** Very Low | **Impact:** Better HMR / Fast Refresh in development

Move `useAuth`, `useTheme`, `useNotification` hooks to separate `hooks/` files.

### Priority 6 — NEGLIGIBLE: Fix Regex Escape & Purity Warnings
- `no-useless-escape` in `validators.js`: one-line fix.
- `react(purity)` for `new Date()`: use lazy initializers `useState(() => ...)` where already in initializer position (most are already acceptable); only JSX-direct uses need memoization.

---

## 7. Files with Most Warnings

| Rank | File | Warning Count |
|---|---|---|
| 1 | `src/pages/admin/Results.jsx` | ~10 |
| 2 | `src/pages/admin/Timetable.jsx` | ~9 |
| 3 | `src/pages/admin/Attendance.jsx` | ~9 |
| 4 | `src/pages/admin/Exams.jsx` | ~9 |
| 5 | `src/pages/parent/Children.jsx` | ~9 |
| 6 | `src/pages/admin/Students.jsx` | ~6 |
| 7 | `src/pages/superadmin/Users.jsx` | ~6 |
| 8 | `src/pages/superadmin/Schools.jsx` | ~6 |
| 9 | `src/pages/student/Assignments.jsx` | ~6 |
| 10 | `src/pages/admin/Subjects.jsx` | ~6 |

---

*Report generated by lint-audit agent | Swarm: School Management System Acceptance Audit*
