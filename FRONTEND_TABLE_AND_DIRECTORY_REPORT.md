# Frontend Table & Directory Report — Phase 5

## Classes Management — Full-Width Table

**File:** `src/pages/admin/Classes.jsx`

**Before:**
- 3-column card grid (`md:grid-cols-2 lg:grid-cols-3`)
- Each card had scattered operation buttons: "Clean Del", "Force Del", "Assign Faculty"
- Status badge received `variant` + `children` (worked but inconsistent)

**After:**
- Full-width table with responsive overflow scroll
- Table headers: Class & Code | Assigned Teacher | Students | Subjects | Status | Actions
- **Class & Code cell**: Icon + name (bold) + code (font-mono)
- **Assigned Teacher cell**: Teacher name or inline "Assign Faculty" link
- **Students cell**: Count pill badge (indigo)
- **Subjects cell**: Count pill badge (emerald)
- **Status cell**: `<StatusBadge status={isArchived ? 'archived' : 'active'} />`
- **Actions cell**: View (FiEye), Assign Teacher (FiUserCheck), Edit (FiEdit2), Archive/Delete/Restore
- Row hover highlight

## Subjects Management — Full-Width Table

**File:** `src/pages/admin/Subjects.jsx`

**Before:**
- `SubjectCard` component rendered in 3-column grid
- Each card had truncated title, type badge, credits badge, and optional teacher footer

**After:**
- `SubjectTable` component renders a full-width table
- Table headers: Subject & Code | Classification | Credits | Assigned Classes | Faculty Lead | Actions
- **Subject & Code cell**: Icon + name (bold) + code (font-mono) + description (truncated 1 line)
- **Classification cell**: `<StatusBadge variant={getTypeVariant(subject.type)}>` with type label
- **Credits cell**: Pill badge
- **Assigned Classes cell**: Tag pills per class name, or italic "No class assigned"
- **Faculty Lead cell**: Icon + name(s), or italic "No faculty assigned"
- **Actions cell**: Edit (FiEdit2), Delete (FiTrash2)
- When class filter active: `showClassCol=false` hides Assigned Classes column
- When no filter: grouped by class section header + `SubjectTable` per group

## Design Tokens

Both tables use:
- `border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm bg-white dark:bg-[#162033]`
- `thead`: `bg-slate-50 dark:bg-slate-900/60 border-b text-[11px] font-bold uppercase tracking-wider text-slate-500`
- `tbody`: `divide-y divide-slate-100 dark:divide-slate-800/80`
- Row hover: `hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors`
- Action buttons: `p-1.5 rounded-lg` icon-only with hover color and tooltip via `title`

