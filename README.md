# Task Manager API

A RESTful API for managing tasks, built with Node.js and Express. Supports full CRUD operations, input validation, filtering, sorting, and priority levels — all backed by an in-memory store.

---

## Project Overview

| Feature | Details |
|---|---|
| Runtime | Node.js >= 18 |
| Framework | Express 4 |
| Storage | In-memory (seeded from `task.json`) |
| Testing | Tap + Supertest |

**Task Schema:**
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "low",
  "createdAt": "2026-03-22T10:00:00.000Z"
}
```

Priority values: `low`, `medium`, `high`

---

## Setup Instructions

**1. Clone the repository**
```bash
git clone <repository-url>
cd task-manager-api-amankushwah555
```

**2. Install dependencies**
```bash
npm install
```

**3. Start the server**
```bash
node app.js
```

The server starts on `http://localhost:3000`.

**4. Run tests**
```bash
npm test
```

---

## API Endpoints

### GET /tasks
Retrieve all tasks, sorted by creation date (ascending).

Supports optional query parameters:
- `completed=true` — return only completed tasks
- `completed=false` — return only pending tasks

**Example:**
```bash
curl http://localhost:3000/tasks
curl http://localhost:3000/tasks?completed=true
curl http://localhost:3000/tasks?completed=false
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Set up environment",
    "description": "Install Node.js, npm, and git",
    "completed": true,
    "priority": "low",
    "createdAt": "2026-03-22T10:00:00.000Z"
  }
]
```

---

### GET /tasks/:id
Retrieve a single task by its ID.

**Example:**
```bash
curl http://localhost:3000/tasks/1
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true,
  "priority": "low",
  "createdAt": "2026-03-22T10:00:00.000Z"
}
```

**Error:** `404 Not Found` if the ID does not exist.

---

### GET /tasks/priority/:level
Retrieve all tasks matching a specific priority level.

Valid levels: `low`, `medium`, `high`

**Example:**
```bash
curl http://localhost:3000/tasks/priority/high
```

**Response:** `200 OK` — array of matching tasks.

**Error:** `400 Bad Request` if the level is not `low`, `medium`, or `high`.

---

### POST /tasks
Create a new task.

**Required fields:**
| Field | Type | Description |
|---|---|---|
| `title` | string | Task title (non-empty) |
| `description` | string | Task description (non-empty) |
| `completed` | boolean | Completion status |

**Optional fields:**
| Field | Type | Default | Description |
|---|---|---|---|
| `priority` | string | `"low"` | One of `low`, `medium`, `high` |

**Example:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task details","completed":false,"priority":"high"}'
```

**Response:** `201 Created`
```json
{
  "id": 16,
  "title": "New Task",
  "description": "Task details",
  "completed": false,
  "priority": "high",
  "createdAt": "2026-03-22T10:05:00.000Z"
}
```

**Errors:**
- `400 Bad Request` — missing/empty `title` or `description`, `completed` is not a boolean, or invalid `priority`

---

### PUT /tasks/:id
Update an existing task by its ID.

**Required fields:** `title`, `description`, `completed` (boolean)

**Optional fields:** `priority` (keeps existing value if omitted)

**Example:**
```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","description":"Updated description","completed":true,"priority":"medium"}'
```

**Response:** `200 OK` — the updated task object.

**Errors:**
- `404 Not Found` — task ID does not exist
- `400 Bad Request` — invalid field values

---

### DELETE /tasks/:id
Delete a task by its ID.

**Example:**
```bash
curl -X DELETE http://localhost:3000/tasks/1
```

**Response:** `200 OK`
```json
{ "message": "Task deleted" }
```

**Error:** `404 Not Found` if the ID does not exist.

---

## Error Response Format

All errors return JSON in this shape:
```json
{ "error": "Descriptive error message" }
```

| Status | Meaning |
|---|---|
| `400` | Invalid input (missing fields, wrong types, bad priority) |
| `404` | Task not found |
