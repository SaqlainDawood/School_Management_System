# Visual Review: Profiles & Row-Wise Card Layouts
## Phase 4 — Enterprise UI/UX Refinement Catalog

This directory catalogs the visual verification of all refined role profiles, hero headers, row-wise information cards, and responsive card layouts across the School Management System.

---

### 1. Profile Experiences Verified

| Role Profile | Route | Hero Header | Row-Wise Information Grid | Edit Experience | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `/profile` | 144-180px Midnight Navy banner, verified badge, avatar overlap | 2-col: Personal Dossier \| Contact & Communication \| Organizational Affiliation \| Account Security | Full-width responsive edit modal/form | **PASSED** |
| **School Admin** | `/profile` | Midnight Navy banner, verified badge, avatar overlap | 2-col: Personal Dossier \| Contact & Communication \| Organizational Affiliation \| Account Security | Responsive 2-column edit inputs | **PASSED** |
| **Teacher** | `/teacher/profile` | 144-180px Midnight Navy banner, certified faculty badge, avatar overlap | 2-col: Faculty Dossier \| Direct Contact Details \| Academic Specialization \| Credentials & Permissions | Responsive 2-column edit inputs with qualification/department | **PASSED** |
| **Student** | `/student/profile` | 144-180px Midnight Navy banner, scholar badge, avatar overlap | 2-col: Scholar Dossier \| Contact & Residential Records \| Academic Enrollment \| Guardian & Family Credentials | Two-section 2-column edit inputs with parent contacts | **PASSED** |
| **Parent** | `/profile` | Midnight Navy banner, guardian badge, avatar overlap | 2-col: Personal Dossier \| Contact & Communication \| Organizational Affiliation \| Account Security | Responsive edit modal/form | **PASSED** |
| **Coordinator** | `/profile` | Midnight Navy banner, coordinator badge, avatar overlap | 2-col: Personal Dossier \| Contact & Communication \| Organizational Affiliation \| Account Security | Responsive edit modal/form | **PASSED** |
| **Examination** | `/profile` | Midnight Navy banner, exam controller badge, avatar overlap | 2-col: Personal Dossier \| Contact & Communication \| Organizational Affiliation \| Account Security | Responsive edit modal/form | **PASSED** |

---

### 2. Row-Wise Card Transformations Verified

| Module / Component | Layout Pattern | Equal-Height Alignment | Dark Surface (`#162033`) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard KPI Grid (Admin)** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5` | `h-full flex flex-col justify-between` | Semantic surface + border | **PASSED** |
| **Dashboard KPI Grid (SuperAdmin)** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | `h-full flex flex-col justify-between` | Semantic surface + border | **PASSED** |
| **Dashboard KPI Grid (Teacher)** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | `h-full flex flex-col justify-between` | Semantic surface + border | **PASSED** |
| **Dashboard KPI Grid (Student)** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | `h-full flex flex-col justify-between` | Semantic surface + border | **PASSED** |
| **Dashboard KPI Grid (Coordinator)** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | `h-full flex flex-col justify-between` | Semantic surface + border | **PASSED** |
| **Dashboard KPI Grid (Examination)** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | `h-full flex flex-col justify-between` | Semantic surface + border | **PASSED** |
| **Parent Children Cards** | `grid-cols-1 md:grid-cols-2 gap-6` | `h-full flex flex-col justify-between` | `#162033` border-slate-800 | **PASSED** |
| **Coordinator Department Cards** | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` | `h-full flex flex-col justify-between` | `#162033` border-slate-800 | **PASSED** |
| **Super Admin School Cards** | `grid-cols-1 md:grid-cols-2 gap-5` | `h-full flex flex-col justify-between` | `#162033` border-slate-800 | **PASSED** |
| **Admin Classes Management Cards** | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5` | `h-full flex flex-col justify-between` | `#162033` border-slate-800 | **PASSED** |
| **Admin Subjects Curriculum Cards** | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5` | `h-full flex flex-col justify-between` | `#162033` border-slate-800 | **PASSED** |

