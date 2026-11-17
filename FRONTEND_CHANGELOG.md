# EduManage Frontend Changelog

## Phase 5.1 — Profile Layout & Student Dashboard Color Correction

**Branch:** master  
**Baseline Commit:** `8c2ab3f`  
**Build Status:** ✅ EXIT 0 — 1155 modules transformed (14.02s)

### Key Corrections in Phase 5.1

1. **Profile Hero Header Rebuilt (Project-Wide)**:
   - Restructured `src/pages/student/Profile.jsx`, `src/pages/teacher/Profile.jsx`, and `src/pages/common/Profile.jsx` into two distinct document regions.
   - Removed negative margin from identity text containers. Text now flows 100% inside the card body beneath the banner.
   - Only the avatar overlaps the banner boundary (`-mt-10 sm:-mt-12`).

2. **Removed Duplicate Edit Actions**:
   - Removed `actions={<Button>Edit</Button>}` prop from `<PageHeader />` in all 3 profile pages.
   - Single Edit button preserved on the right of the identity section.

3. **Rebuilt Student Dashboard Identity Card (`src/pages/student/Dashboard.jsx`)**:
   - Removed invalid `bg-gradient-to-r from-navy-900 to-navy-800 text-white` classes.
   - Card rebuilt with `.card` surface tokens (`bg-white dark:bg-[#162033] border border-slate-200 dark:border-slate-800`).
   - High-contrast typography: Name in `text-slate-900 dark:text-slate-100`, labels in `text-slate-500 dark:text-slate-400`, metadata in `text-slate-800 dark:text-slate-200`.
   - Accessible avatar badge: `bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400`.

4. **Truthful & Professional Content Hierarchy**:
   - Replaced "Student Academic Dossier" with "Student Profile", "Scholar Dossier" with "Personal Information", "Contact & Residential Records" with "Contact Details", "Academic Enrollment" with "Academic Information", "Guardian & Family Credentials" with "Guardian Information".
   - Removed unsupported claims ("Enrolled Academic Scholar", "Active Scholar", "Verified Records").

---

## Phase 5 — Professional UI/UX Refinement & Display Correction

**Branch:** master  
**Baseline Commit:** `8c2ab3f`  
**Phase Start:** Phase 5  
**Build Status:** ✅ EXIT 0 — 1155 modules transformed

---

## Protected Integration Files — Zero Modifications

| File | Status |
|------|--------|
| `src/utils/api.js` | ✅ Unchanged (verified with `git diff 8c2ab3f`) |
| `src/context/AuthContext.jsx` | ✅ Unchanged |
| `src/components/common/ProtectedRoute.jsx` | ✅ Unchanged |
| `.env` | ✅ Unchanged |

---

## Changed Files Summary

### Utilities & Shared

| File | Change |
|------|--------|
| `src/utils/helpers.js` | Added `formatAddress(addr)` utility; updated `getStatusLabel` with boolean + lowercase handling |
| `src/styles/index.css` | Added `.select-field` Tailwind component layer; added `.sidebar-scroll` custom scrollbar |

### Components

| File | Change |
|------|--------|
| `src/components/common/StatusBadge.jsx` | Full rewrite: accepts `children`, supports boolean status, normalizes strings, maps all domain statuses, `variant` prop preserved, `dot` prop preserved |
| `src/components/common/Sidebar.jsx` | Added `sidebar-scroll` class to remove native scrollbar |
| `src/components/forms/StudentForm.jsx` | Used `formatAddress()` to initialize address field; compact 2-column layout with sticky footer |

### Admin Pages

| File | Change |
|------|--------|
| `src/pages/admin/Students.jsx` | Passes `status={student.status}` directly to `<StatusBadge>`; uses `formatAddress()` in `handleEditStudent` |
| `src/pages/admin/Teachers.jsx` | Passes `status={teacher.status}` directly to `<StatusBadge>` |
| `src/pages/admin/Classes.jsx` | **Grid → Full-width table**: `Class & Code`, `Assigned Teacher`, `Students`, `Subjects`, `Status`, `Actions` columns; inline Assign Faculty link when unassigned; StatusBadge receives correct `status` prop |
| `src/pages/admin/Subjects.jsx` | **Card grid → Full-width table** via `SubjectTable` component: `Subject & Code`, `Classification`, `Credits`, `Assigned Classes`, `Faculty Lead`, `Actions` |
| `src/pages/admin/Attendance.jsx` | Unified date input height (`py-2.5`); fixed StatusBadge call with `dot` prop; recorded state renders visually distinct from button |
| `src/pages/admin/Exams.jsx` | Select dropdown uses `select-field py-2.5`; StatusBadge uses `status={exam.status}` + `dot` |

### Profile Pages

| File | Change |
|------|--------|
| `src/pages/common/Profile.jsx` | Compact banner (`h-28 sm:h-36`); avatar `relative z-20`; removed ObjectId from header; removed "Enterprise Verified Account" claim; role shown in banner badge; card titles renamed to `Personal Information`, `Contact Details`, `Institutional Details`, `Account Security`; uses `formatAddress()` |
| `src/pages/teacher/Profile.jsx` | Compact banner (`h-28 sm:h-36`); avatar `relative z-20`; removed "Certified Faculty Member" badge replaced with role-based text; uses `formatAddress()` |
| `src/pages/student/Profile.jsx` | Compact banner (`h-28 sm:h-36`); avatar `relative z-20`; uses `formatAddress()` for address display and form init |

### Examination Pages

| File | Change |
|------|--------|
| `src/pages/examination/Exams.jsx` | StatusBadge uses `status={exam.status}` correctly |

---

## Bug Fixes

### 1. "Unknown" Status with Green/Red Dot (Project-Wide)
- **Root Cause**: `StatusBadge.jsx` ignored `children` prop, causing `displayLabel = 'Unknown'` while `variant` was set via prop.
- **Fix**: Rewrote `StatusBadge` to accept `children`, Boolean statuses, and all domain status strings.

### 2. `[object Object]` Address in Student Edit Modal
- **Root Cause**: MongoDB `address` field is a structured object `{street, city, state, zipCode}`. Passing it directly to `<input>` rendered the string `[object Object]`.
- **Fix**: Added `formatAddress()` utility in `helpers.js` and applied to all address fields in `Students.jsx`, `StudentForm.jsx`, `Profile.jsx`, `teacher/Profile.jsx`, `student/Profile.jsx`.

### 3. Profile Hero Banner Clipping Avatar
- **Root Cause**: Banner height `h-36 sm:h-44` with avatar `mt-14 sm:mt-16` overlap caused avatar to be obscured by banner.
- **Fix**: Reduced banner to `h-28 sm:h-36`, avatar to `w-20 h-20 sm:w-24 sm:h-24`, added `relative z-20` to avatar and container.

### 4. Unsupported Claims in Profile Headers
- **Fixed**: Removed "Enterprise Verified Account", "Active & Verified", "Verified Channels" labels.
- **Replaced**: With real role name, email, and accurate status badges.

### 5. ObjectIds Displayed in Profile Header
- **Fixed**: Removed `user?._id` from hero subtitle. ID now only appears in Personal Information card where appropriate.

### 6. Classes Grid — Scattered Buttons
- **Fixed**: Replaced 3-column card grid with full-width structured table. "Clean Del", "Force Del", "Assign Faculty" moved to context-appropriate table action cells.

### 7. Subjects Card Grid
- **Fixed**: Replaced `SubjectCard` 3-column grid with `SubjectTable` full-width table layout.

### 8. `.select-field` CSS Missing
- **Fixed**: Added `.select-field` to `@layer components` in `src/styles/index.css`.

---

## Build Verification

```
✓ 1155 modules transformed.
dist/index.html                     0.45 kB │ gzip:   0.29 kB
dist/assets/index-DUMu2OnT.css     88.07 kB │ gzip:  14.47 kB
dist/assets/index-gXR6ijJX.js   1,347.81 kB │ gzip: 348.69 kB
✓ built in 32.17s
```

**Exit Code: 0 — Build successful.**
