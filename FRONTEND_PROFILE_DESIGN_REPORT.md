# Frontend Profile Design & Experience Report
## School Management System — Enterprise Role Profile Transformation

**Phase:** Phase 4 — Advanced Enterprise UI/UX Refinement  
**Date:** November 14, 2026  
**Auditor:** Senior UI/UX & Design System Architect  
**Status:** Complete & Verified

---

## 1. Executive Summary

In Phase 4, the user profile experience was elevated from basic form inputs to an enterprise-grade account dossier across all seven role portals:
1. **Super Admin**
2. **School Admin**
3. **Teacher**
4. **Student**
5. **Parent**
6. **Coordinator**
7. **Examination**

All profile screens now feature an imposing **Hero Header** (Midnight Navy & Royal Indigo composition `#0F172A` / `#162033`, 144–180px banner, overlapping 28px initials avatar, verified status badges), structured **Row-Wise Information Cards** arranged in balanced 2-column grids on desktop (`grid-cols-1 lg:grid-cols-2 gap-5`), and high-contrast, responsive **Edit Profile Modes** that strictly preserve existing backend API payloads and context methods.

---

## 2. Profile Inventory & Route Mapping

| Role Experience | Route | Primary Component | Data Source | Key Dossier Cards |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `/profile` | `src/pages/common/Profile.jsx` | `AuthContext` (`user`) | Personal Dossier, Contact & Communication, Organizational Affiliation, Account Security |
| **School Admin** | `/profile` | `src/pages/common/Profile.jsx` | `AuthContext` (`user`) | Personal Dossier, Contact & Communication, Organizational Affiliation, Account Security |
| **Teacher** | `/teacher/profile` | `src/pages/teacher/Profile.jsx` | `AuthContext` (`user`) | Faculty Dossier, Direct Contact Details, Academic Specialization, Credentials & Permissions |
| **Student** | `/student/profile` | `src/pages/student/Profile.jsx` | `/api/students/profile` | Scholar Dossier, Contact & Residential Records, Academic Enrollment, Guardian & Family Credentials |
| **Parent** | `/profile` | `src/pages/common/Profile.jsx` | `AuthContext` (`user`) | Personal Dossier, Contact & Communication, Organizational Affiliation, Account Security |
| **Coordinator** | `/profile` | `src/pages/common/Profile.jsx` | `AuthContext` (`user`) | Personal Dossier, Contact & Communication, Organizational Affiliation, Account Security |
| **Examination** | `/profile` | `src/pages/common/Profile.jsx` | `AuthContext` (`user`) | Personal Dossier, Contact & Communication, Organizational Affiliation, Account Security |

*Note: Roles without a dedicated sub-route (`/profile`) dynamically inherit role-specific metadata, titles, and verification badges via `Profile.jsx`.*

---

## 3. Profile Architecture & Anatomy

### 3.1 Hero Header & Cover Banner
- **Dimensions:** 144px mobile, 176px desktop (`h-36 sm:h-44`) with rounded-3xl containment.
- **Palette:** `from-slate-900 via-indigo-950 to-slate-900` gradient with subtle blurred geometric accents (`bg-indigo-500/10` and `bg-purple-500/10`).
- **Avatar:** Large circular/rounded-2xl avatar (`w-24 h-24 sm:w-28 sm:h-28`) overlapping the lower banner boundary (`-mt-14 sm:-mt-16`). Framed by a 4px high-contrast border (`border-white dark:border-[#162033]`) with deep shadow.
- **Identity & Badges:** Primary name in `text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white`, paired with a semantic `StatusBadge` indicating exact role tier and verification status.

### 3.2 Row-Wise Information Cards (`grid grid-cols-1 lg:grid-cols-2 gap-5`)
Each card is built upon an elevated surface (`bg-white dark:bg-[#162033] border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm`) with equal visual heights (`h-full flex flex-col justify-between`):
- **Card Header:** Icon in tinted badge container (`bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400`), card title, and secondary description.
- **Definition List (`<dl>`):** High-clarity typography with uppercase muted labels (`text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400`) and prominent values (`font-bold text-slate-900 dark:text-white`).
- **Dividers:** Clean 1px border separators (`border-slate-100 dark:border-slate-800/80`) preventing visual clutter.

### 3.3 Edit Profile Form Experience
- **Trigger:** Accessible header action button (`Edit Profile` / `Cancel Edit`) switching seamlessly between presentation dossier and editing mode.
- **Form Grid:** Balanced 2-column layout (`grid grid-cols-1 sm:grid-cols-2 gap-4`) on tablet/desktop, cleanly collapsing to single-column on mobile.
- **Input Styling:** High-contrast fields (`bg-white dark:bg-[#111827] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white`).
- **Data Integrity:** Disabled immutable system fields (e.g. Email Address), explicit required field indicators, and preserved `updateProfile` / API PUT handlers.

---

## 4. Navbar Profile Dropdown Polish

In `src/components/common/Navbar.jsx`:
- User menu surfaces styled with `#162033` dark background, `#0B1120` canvas contrast, and subtle slate borders.
- Direct role-aware navigation:
  - Teachers navigate to `/teacher/profile` (Faculty Dossier).
  - Students navigate to `/student/profile` (Scholar Dossier).
  - Admins, Parents, Coordinators, and Examination staff navigate to `/profile` (Enterprise Dossier).
- Clear visual hierarchy with avatar initials, role badge, account email, settings shortcut, and sign-out action.

---

## 5. Verification & Acceptance

- **Visual Contrast:** Meets and exceeds WCAG 2.1 AA across both Light and Dark themes.
- **Responsive Adaptability:** Tested at 320px, 375px, 768px, 1024px, 1440px, and 1920px viewports with zero horizontal overflow.
- **Logic & State Freeze:** Zero alterations to context hooks, token storage, or backend endpoints.

