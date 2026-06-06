# TaskFlow — Personal Task Manager

**Exercise 1: Personal Task Manager** for the Studio Graphene Full Stack Developer Programme.

TaskFlow is a clean, dark-themed full-stack task manager built with a Node.js/Express backend and a React frontend. It supports creating, viewing, editing, deleting, and filtering tasks — with persistence to a JSON file so tasks survive server restarts.

---

## Live Demo

> Deploy links go here after deployment (Vercel for frontend, Render for backend).

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | Node.js + Express | Minimal, familiar, fast to set up |
| Storage | JSON file (via `fs`) | Persistent across restarts without a DB dependency |
| Frontend | React (Create React App) | Functional components + hooks as required |
| Styling | Plain CSS with CSS variables | Full control, no extra build tooling needed |
| Testing | Jest + Supertest | Meaningful integration tests on the API layer |
| Fonts | Syne + DM Sans (Google Fonts) | Strong typographic personality |

---

## How to Run Locally

**Prerequisites:** Node.js ≥ 18 installed. That's all.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager

# 2. Install dependencies for both server and client
npm run install:all

# 3. Start the backend (runs on http://localhost:4000)
npm run dev:server

# 4. In a new terminal, start the frontend (runs on http://localhost:3000)
npm run dev:client
```

Open **http://localhost:3000** in your browser. The React app proxies API calls to `:4000` automatically (configured via `"proxy"` in `client/package.json`).

### Run tests

```bash
npm run test:server
```

---

## API Documentation

Base URL: `http://localhost:4000/api`

### `GET /tasks`

Returns all tasks, sorted by creation date (newest first).

**Query params (all optional):**
- `status` — `active` | `completed` (omit for all)
- `search` — filters by title or description substring

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "dueDate": "2025-12-31",
    "completed": false,
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T10:00:00.000Z"
  }
]
```

---

### `GET /tasks/:id`

Returns a single task by ID.

**Response:** `200 OK` — task object, or `404` if not found.

---

### `POST /tasks`

Creates a new task.

**Request body:**
```json
{
  "title": "Buy groceries",       // required
  "description": "Milk, eggs",    // optional
  "dueDate": "2025-12-31"         // optional, ISO date string
}
```

**Response:** `201 Created` — the created task object.  
**Errors:** `400` if `title` is missing or empty.

---

### `PATCH /tasks/:id`

Updates one or more fields on an existing task.

**Request body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated desc",
  "dueDate": "2025-11-01",
  "completed": true
}
```

**Response:** `200 OK` — the updated task object.  
**Errors:** `404` if not found; `400` if title is set to empty.

---

### `DELETE /tasks/:id`

Deletes a task permanently.

**Response:** `204 No Content`  
**Errors:** `404` if not found.

---

### `GET /health`

Health check.

**Response:** `200 OK` — `{ "status": "ok" }`

---

## Project Structure

```
task-manager/
├── package.json            # Root scripts (install:all, dev:server, dev:client)
│
├── server/
│   ├── index.js            # Express app entry point
│   ├── package.json
│   ├── data/
│   │   └── tasks.json      # Auto-created; persists tasks across restarts
│   ├── routes/
│   │   ├── tasks.js        # All CRUD route handlers
│   │   └── tasks.test.js   # Integration tests (Jest + Supertest)
│   └── store/
│       └── taskStore.js    # In-memory + file-persisted data layer
│
└── client/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js         # React entry point
        ├── App.jsx          # Root component: layout, filter state, confirm dialog
        ├── App.css          # All component styles (CSS variables design system)
        ├── index.css        # Global resets and base styles
        ├── api/
        │   └── taskApi.js   # Fetch wrapper for all API calls
        ├── hooks/
        │   └── useTasks.js  # Custom hook: fetch, create, update, delete, toggle
        ├── utils/
        │   └── dateUtils.js # isOverdue, formatDate, todayISO helpers
        └── components/
            ├── TaskForm.jsx       # Collapsible "add task" form
            ├── TaskCard.jsx       # Task row with inline edit form
            └── ConfirmDialog.jsx  # Modal confirmation for deletes
```

---

## Features Implemented

**Must Have (all ✅)**
- Add a task with title (required), optional description and due date
- View all tasks sorted by creation date (newest first)
- Toggle complete / incomplete
- Edit title, description, or due date inline
- Delete with confirmation dialog
- Filter by All / Active / Completed

**Should Have (all ✅)**
- Active vs completed count in the header
- Overdue tasks visually distinguished (amber border + "Overdue" badge)
- Empty state UI with contextual messages

**Bonus (all ✅)**
- Search tasks by title or description
- Persistence to `server/data/tasks.json` (survives restarts)

---

## Next Steps / What I'd Build With More Time

- **Authentication** — JWT-based login so multiple users can each have their own task list
- **Drag-and-drop reordering** — using `@dnd-kit/core` for accessible DnD
- **Due date reminders** — browser notifications via the Web Notifications API
- **Labels / tags** — colour-coded categories on tasks
- **Subtasks** — nested checklist items within a task
- **Proper database** — SQLite (already trivial to swap in, as the store module is the only thing that would change)
- **Optimistic UI updates** — update local state immediately, roll back on server error
- **E2E tests** — Playwright tests for the full user flow

---

## Notes

- AI tools (Claude) were used to assist with code generation. Every line was reviewed and understood before inclusion.
- The `data/tasks.json` file is created automatically on first run; it is git-ignored.
