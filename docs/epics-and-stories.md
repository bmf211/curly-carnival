# Epics and Stories (MVP and Post-MVP)

This document breaks down [docs/prd-todo.md](docs/prd-todo.md) into epics and stories.

- Acceptance Criteria: end-user verifiable behaviors.
- Technical Requirements: developer-facing constraints/decisions (architecture, persistence, data contracts).

Codebase context (to inform Technical Requirements):
- Frontend currently performs CRUD via `fetch('/api/tasks...')` (see `packages/frontend/src/App.js` and `packages/frontend/src/TaskList.js`).
- Frontend dev server proxies `/api/*` to `http://localhost:3030` (see `packages/frontend/package.json`).
- Backend exposes `/api/tasks` endpoints and stores tasks in an in-memory SQLite database with snake_case fields like `due_date` (see `packages/backend/src/app.js` for details).

## MVP

### Epic: Update Task Data Model (Due Date, Priority)

#### Story: Add optional dueDate field (YYYY-MM-DD)

Acceptance Criteria:
- A user can create a task without a due date.
- A task with no due date is shown as having no due date.

Technical Requirements:
- Store due dates as an ISO date string in the format `YYYY-MM-DD`.
- Align field naming with the existing API/data model (`due_date` in backend/frontend today) OR implement a single mapping layer to translate between `dueDate` and `due_date`.
- Keep date handling consistent with the existing UI approach that treats `YYYY-MM-DD` as a local date (see `formatDueDate` in `packages/frontend/src/TaskList.js`).

#### Story: Ignore invalid dueDate values

Acceptance Criteria:
- If a task’s due date is invalid/unparseable, the app behaves as if the task has no due date.
- Tasks with invalid/unparseable due dates do not break list rendering or filtering.

Technical Requirements:
- Treat invalid/unparseable due date values as absent when computing filters.
- Ensure any date normalization/parsing helpers never throw on unexpected input (the frontend currently normalizes user input in `packages/frontend/src/TaskForm.js`).

#### Story: Add priority field (P1, P2, P3) with default P3

Acceptance Criteria:
- A user can set a task’s priority to one of `P1`, `P2`, or `P3`.
- If a user does not set a priority, the task is treated as priority `P3`.
- A task cannot be created without a title.

Technical Requirements:
- Persist `priority` as one of the enum values `P1 | P2 | P3`.
- When `priority` is missing, default it to `P3`.
- Because the current backend schema has no `priority` column and MVP requires no backend changes, priority must be stored client-side (e.g., as part of local task persistence) rather than requiring a backend schema update.

#### Story: Persist dueDate and priority in local storage

Acceptance Criteria:
- After a page refresh, tasks retain their due date and priority values.

Technical Requirements:
- Persist tasks locally only (e.g., `localStorage`); no external storage.
- MVP requires no backend changes (no new API endpoints; no server-side persistence changes).
- This repo currently persists tasks in an in-memory backend database; to satisfy the PRD’s MVP constraints, the frontend must be the source of truth for persistence.
- If the frontend is refactored away from `/api/tasks`, leave the backend package unchanged (do not expand it to store new fields like priority for MVP).

### Epic: Task UI for Due Date and Priority

#### Story: Add due date input for creating a task

Acceptance Criteria:
- The create-task UI provides a way to set an optional due date.
- When a due date is set and the task is created, the task displays that due date.

Technical Requirements:
- Save due dates using the `YYYY-MM-DD` format.
- Prefer native date input (`<TextField type="date" ... />`) as already used in `packages/frontend/src/TaskForm.js`.
- Keep existing test hooks stable (e.g., `data-testid="due-date-input"`).

#### Story: Add due date input for editing a task

Acceptance Criteria:
- The edit-task UI provides a way to set, change, or clear the due date.
- Clearing a due date removes it from the task.

Technical Requirements:
- If an invalid/unparseable due date value is encountered, treat it as absent.
- When editing, continue to normalize any stored due date into `YYYY-MM-DD` for the date input (current approach exists in `packages/frontend/src/TaskForm.js`).

#### Story: Add priority selector for creating a task

Acceptance Criteria:
- The create-task UI provides a way to set priority to `P1`, `P2`, or `P3`.
- If the user does not choose a priority, the task is saved with default `P3`.

Technical Requirements:
- Default persisted priority to `P3` when not set.
- Keep existing test hooks stable (e.g., `data-testid="title-input"`, `data-testid="submit-task"`), and add new test ids only if tests will assert on priority.

#### Story: Add priority selector for editing a task

Acceptance Criteria:
- The edit-task UI provides a way to change priority among `P1`, `P2`, and `P3`.

Technical Requirements:
- Persist updated priority to local-only storage.
- If the rest of CRUD remains backed by `/api/tasks` temporarily, ensure priority is still preserved across refreshes (e.g., via local persistence keyed by task id).

### Epic: Add Date-Based Filters (All / Today / Overdue)

#### Story: Add filter tabs for All, Today, and Overdue

Acceptance Criteria:
- The UI includes filters/tabs for `All`, `Today`, and `Overdue`.
- Only one filter is active at a time.

Technical Requirements:
- Filters are computed from task `dueDate` and `completed` status.
- In the current codebase, tasks use `due_date` (string) and `completed` (0/1) from the backend; filtering logic must account for these shapes unless a frontend-only model refactor is done.

#### Story: Implement Today filter logic

Acceptance Criteria:
- `Today` shows tasks whose due date is today.
- Tasks without a valid `dueDate` are not shown in `Today`.
- Completed tasks are hidden in `Today`.

Technical Requirements:
- Compare a task’s due date against “today” using a consistent local-date basis.
- Use the same local-date parsing approach already present in `packages/frontend/src/TaskList.js` (constructing a `Date(year, monthIndex, day)` from `YYYY-MM-DD`) to avoid timezone offset issues.

#### Story: Implement Overdue filter logic

Acceptance Criteria:
- `Overdue` shows tasks whose due date is before today.
- Tasks without a valid `dueDate` are not shown in `Overdue`.
- Completed tasks are hidden in `Overdue`.

Technical Requirements:
- Treat invalid/unparseable `dueDate` as absent for overdue calculations.
- Define “overdue” using local date comparison (date strictly before today).

#### Story: Apply selected filter to task list

Acceptance Criteria:
- Switching filters updates the visible task list according to the filter rules.
- `All` shows completed tasks.

Technical Requirements:
- When `Today` or `Overdue` is selected, completed tasks are excluded from those views.
- If filtering is implemented client-side (likely in `packages/frontend/src/TaskList.js`), avoid refetching on every filter toggle unless necessary.

## Post-MVP

### Epic: Visual Emphasis for Overdue and Priority

#### Story: Visually highlight overdue tasks

Acceptance Criteria:
- Overdue tasks are visually highlighted (e.g., a red highlight).

Technical Requirements:
- Overdue status is derived from `dueDate` relative to today.
- Keep styling consistent with existing MUI usage in `packages/frontend/src/TaskList.js`.

#### Story: Display priority badges on tasks

Acceptance Criteria:
- Each task displays its priority as a badge/indicator.

Technical Requirements:
- Badge content is derived from persisted `priority`.
- If tasks are still fetched from `/api/tasks`, merge in locally persisted priority before rendering badges.

#### Story: Map priority badge colors for P1, P2, and P3

Acceptance Criteria:
- Priority color mapping:
  - `P1`: red
  - `P2`: orange
  - `P3`: gray

Technical Requirements:
- Use a consistent mapping between `priority` values and badge styling.

### Epic: Default Task Sorting Rules

#### Story: Apply default ordering rules

Acceptance Criteria:
- Default ordering is:
  1) overdue tasks first
  2) then by priority (`P1` → `P3`)
  3) then by due date ascending
  4) then tasks without a due date last

Technical Requirements:
- Apply the ordering rules consistently across all views that display the default task list ordering.
- The backend currently applies a default SQL ordering; if MVP prohibits backend changes, implement this Post-MVP ordering client-side in the frontend list rendering.
