# Frontend Visual QA Report — Phase 5

## QA Checklist

### Profile Pages

| Check | common/Profile | teacher/Profile | student/Profile |
|---|---|---|---|
| Banner height compact (no clip) | ✅ h-28 sm:h-36 | ✅ h-28 sm:h-36 | ✅ h-28 sm:h-36 |
| Avatar never covered by banner | ✅ z-20 | ✅ z-20 | ✅ z-20 |
| ObjectId removed from hero | ✅ | ✅ | ✅ (shows studentId) |
| "Enterprise Verified" removed | ✅ | ✅ | ✅ |
| "Active & Verified" removed | ✅ | ✅ | ✅ |
| "Verified Channels" removed | ✅ | ✅ | ✅ |
| Address displays correctly | ✅ formatAddress | ✅ formatAddress | ✅ formatAddress |
| Dark mode compatible | ✅ | ✅ | ✅ |

### Classes Management

| Check | Result |
|---|---|
| Full-width table (not 3-col grid) | ✅ |
| "Clean Del"/"Force Del" labels gone from visible UI | ✅ (moved to ConfirmDialog only) |
| StatusBadge receives `status` prop | ✅ |
| Assign Faculty inline for unassigned | ✅ |
| Count pills for Students/Subjects | ✅ |
| Row hover effect | ✅ |
| Empty state preserved | ✅ |
| All action handlers preserved | ✅ |

### Subjects Management

| Check | Result |
|---|---|
| Full-width table (not card grid) | ✅ |
| Classification badge visible | ✅ |
| Credits shown as pill | ✅ |
| Assigned Classes as tag pills | ✅ |
| Faculty Lead column present | ✅ |
| Filter hides Assigned Classes col | ✅ |
| Group header still shown | ✅ |
| Delete/Edit actions present | ✅ |

### Status Badges (All Pages)

| Check | Result |
|---|---|
| "Unknown" with green dot eliminated | ✅ |
| "Unknown" with red dot eliminated | ✅ |
| Boolean true → "Active" (green) | ✅ |
| Boolean false → "Inactive" (red) | ✅ |
| "active" string → Active (green) | ✅ |
| "archived" → Archived (amber) | ✅ |
| "draft" → Draft (amber) | ✅ |
| "published" → Published (green) | ✅ |
| "not logged" → neutral, no dot | ✅ |

### Address Display

| Location | Before | After |
|---|---|---|
| Student edit modal | [object Object] | Full formatted string |
| Student view card | street only | Full address |
| common/Profile contact card | partial | formatAddress() |
| teacher/Profile contact card | raw object possible | formatAddress() |
| student/Profile residential card | street only | formatAddress() |

### Attendance Page

| Check | Result |
|---|---|
| Select and date input same height | ✅ py-2.5 both |
| NOT LOGGED → neutral badge | ✅ |
| Present/Absent/Late buttons visually active when selected | ✅ |

### Build Verification

| Check | Result |
|---|---|
| `npm run build` exit code | ✅ 0 |
| Modules transformed | ✅ 1155 |
| CSS output | ✅ 88.07 kB |
| JS output | ✅ 1,347.81 kB |
| Protected files modified | ✅ 0 (zero) |
