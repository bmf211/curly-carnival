# Cloud Architecture Overview

This monorepo contains a React frontend that calls an Express API. The API stores task data in an in-memory SQLite database.

## System Context Diagram

```mermaid
flowchart LR
  U[User]

  FE[React Frontend\npackages/frontend]
  API[Express API\npackages/backend]
  DB[(In-memory SQLite\nbetter-sqlite3 :memory:)]

  U -->|Uses in browser| FE
  FE -->|HTTP /api/*| API
  API -->|SQL read/write| DB

  FE -.->|Dev proxy\nhttp://localhost:3030| API
```

## Sequence Diagram: User Creates a TODO

```mermaid
sequenceDiagram
  actor User
  participant FE as React Frontend
  participant API as Express API
  participant DB as In-memory SQLite

  User->>FE: Enter title/description/due date
  User->>FE: Click "Add Task"

  alt Title is empty
    FE-->>User: Show validation error ("Title is required")
  else Title is valid
    FE->>API: POST /api/tasks { title, description, due_date }
    API->>DB: INSERT INTO tasks (...)
    DB-->>API: Row inserted (id)
    API-->>FE: 201 Created (task)

    Note over FE: App increments refreshKey
    FE->>API: GET /api/tasks
    API->>DB: SELECT * FROM tasks ORDER BY ...
    DB-->>API: Task rows
    API-->>FE: 200 OK (task list)
    FE-->>User: Updated task list renders
  end
```
