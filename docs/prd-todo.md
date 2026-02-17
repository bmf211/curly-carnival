# Product Requirements Document (PRD) - Todo App Upgrade (Due Dates, Priorities, Filters)

## 1. Overview

We are upgrading the basic Todo app (currently just `title` and `completed`) to better support planning and urgency by adding optional due dates, simple priority levels, and date-based filters—while keeping the experience lean and teachable.

The MVP must remain simple and require no backend changes; data should remain stored locally.

---

## 2. MVP Scope

- Data model updates (stored locally)
  - Add `dueDate` field
    - Optional
    - Format: ISO `YYYY-MM-DD`
    - Invalid values are ignored (treated as absent)
  - Add `priority` field
    - Enum: `P1 | P2 | P3`
    - Default: `P3`
  - Keep `title` required
- UI/UX updates
  - Provide a way to set/modify `dueDate` per task
  - Provide a way to set/modify `priority` per task
  - Add filter tabs/views:
    - **All**
    - **Today**
    - **Overdue**
  - Completed-task behavior by filter:
    - **All** shows completed tasks
    - **Today** and **Overdue** hide completed tasks (show incomplete only)
- Persistence / architecture constraints
  - No backend changes
  - No external storage; keep storage local-only (e.g., local storage)

---

## 3. Post-MVP Scope

- Visual emphasis
  - Visually highlight overdue tasks (e.g., red highlight)
  - Show priority as visual badges/colors (suggested mapping from requirements meeting):
    - `P1`: red
    - `P2`: orange
    - `P3`: gray
- Sorting rules
  - Default ordering:
    - overdue tasks first
    - then by priority (`P1` → `P3`)
    - then by due date ascending
    - then tasks without a due date last

---

## 4. Out of Scope

- Notifications
- Recurring tasks
- Multi-user support
- Keyboard navigation / special accessibility features (explicitly not required for now)
- External storage (anything beyond local-only storage)
