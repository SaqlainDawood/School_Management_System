# Frontend Status Display Audit Report — Phase 5

## Root Cause Analysis

### The "Unknown" with Green/Red Dot Bug

**Affected files (before fix):**
- `src/pages/admin/Students.jsx`
- `src/pages/admin/Teachers.jsx`
- `src/pages/admin/Classes.jsx`
- `src/pages/admin/Attendance.jsx`
- `src/pages/admin/Exams.jsx`

**Root Cause:**
Developers wrote `<StatusBadge variant={...} dot>{getStatusLabel(...)}</StatusBadge>`.

The original `StatusBadge.jsx` only checked `customLabel` (from `label` prop) and `status` prop — it completely ignored `children`. Thus, `displayLabel` became `'Unknown'`, while `variant` took the `success`/`danger` prop, creating the bizarre "Unknown" with green or red dot defect.

### Fix Applied

`src/components/common/StatusBadge.jsx` — full rewrite:
```jsx
// Now reads children as label source
const displayLabel = children ?? (label ?? (status ? getStatusLabel(status) : 'Unknown'));
```

Accepts:
- `children` — explicit label (highest priority)
- `label` — legacy prop
- `status` — auto-mapped via `getStatusLabel()`
- `variant` — override color (still respected)
- `dot` — indicator dot (still respected)

### Domain Status Mapping

| Status String | Variant | Label |
|---|---|---|
| active | success | Active |
| inactive | danger | Inactive |
| true (boolean) | success | Active |
| false (boolean) | danger | Inactive |
| present | success | Present |
| absent | danger | Absent |
| late | warning | Late |
| excused | info | Excused |
| draft | warning | Draft |
| published | success | Published |
| ongoing | info | Ongoing |
| completed | success | Completed |
| paid | success | Paid |
| unpaid | danger | Unpaid |
| overdue | danger | Overdue |
| archived | warning | Archived |
| not logged | neutral | Not Logged |

### Where Fixed

| Location | Before | After |
|---|---|---|
| `Students.jsx` | `<StatusBadge variant={...} dot>{label}</StatusBadge>` | `<StatusBadge status={student.status} />` |
| `Teachers.jsx` | Same pattern | `<StatusBadge status={teacher.status} />` |
| `Classes.jsx` (table) | Old card pattern | `<StatusBadge status={isArchived ? 'archived' : 'active'} />` |
| `Attendance.jsx` | Children-based call | `<StatusBadge variant={...} dot>{label}</StatusBadge>` (now works since `children` is accepted) |
| `Exams.jsx` (admin) | Children-based call | `<StatusBadge status={exam.status} variant={...}>` |
| `Exams.jsx` (examination) | `<StatusBadge status={exam.status} />` | Already correct — preserved |

