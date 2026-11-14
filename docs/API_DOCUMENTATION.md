# 📚 Research Agent Arena – Backend API Documentation

**Application Developer:** Arun (Backend API Development)  
**System:** AI-Powered Pre-Meeting Research & Agent Benchmarking Platform  
**Architecture:** Node.js, Express.js, MongoDB (Mongoose), Tavily, Bifrost Gateway, Gemini Models  

---

## 1. Overview & System Workflow

The **Research Agent Arena** automates executive and pre-meeting research while benchmarking two AI agents against one another.

### Workflow Sequence

```text
       1. User inputs Subject & Meeting Purpose
                         │
                         ▼
             POST /api/v1/sessions
             POST /api/v1/tasks
                         │
                         ▼
           2. Web Search via Tavily Engine
                         │
                         ▼
           PUT /api/v1/tasks/:id/web-data
                         │
                         ▼
        3. Parallel Agent Briefings via Bifrost & Gemini
           Agent A (Gemini 1.5 Pro)  vs  Agent B (Gemini 1.5 Flash)
                         │
                         ▼
          PUT /api/v1/tasks/:id/agent-results (agentA)
          PUT /api/v1/tasks/:id/agent-results (agentB)
                         │
                         ▼
         4. Evaluation & Benchmarking Engine (Metrics 0-10)
                         │
                         ▼
           PUT /api/v1/tasks/:id/evaluation
                         │
                         ▼
            5. Final Meeting Briefing Export
                         │
                         ▼
           PUT /api/v1/tasks/:id/briefing
```

---

## 2. API Conventions & Standard Response Formatting

All endpoints use `application/json` and return a standardized envelope.

### Success Response Format

```json
{
  "success": true,
  "status": "success",
  "message": "Resource created / operation successful",
  "data": { ... },
  "timestamp": "2026-11-13T16:00:00.000Z"
}
```

### Paginated List Response Format

```json
{
  "success": true,
  "status": "success",
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-11-13T16:00:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "subjectName",
        "message": "subjectName is required",
        "location": "body"
      }
    ]
  },
  "timestamp": "2026-11-13T16:00:00.000Z"
}
```

---

## 3. Database Data Models

### 3.1 `ResearchSession`

Represents a research session / workspace grouping research tasks.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `title` | String | Session title (e.g., "Stripe Partnership Meeting") |
| `description` | String | Optional background description |
| `targetSubject` | String | Company or Person being researched |
| `meetingPurpose`| String | Specific goal (e.g., "Enterprise Partnership") |
| `targetDate` | Date | Scheduled date of meeting |
| `status` | String | `'active'`, `'completed'`, `'archived'` |
| `tags` | Array[String]| Search tags |
| `metadata` | Object | Arbitrary metadata (attendees, links, notes) |
| `createdAt` | Date | Timestamp of creation |
| `updatedAt` | Date | Timestamp of last modification |

### 3.2 `ResearchTask`

Core research entity holding subject details, Tavily web data, both competing AI agent outputs, evaluation metrics, and final briefing.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `sessionId` | ObjectId | Reference to `ResearchSession` |
| `subjectName` | String | Name of company or person |
| `subjectType` | String | `'company'`, `'person'`, `'industry'`, `'other'` |
| `meetingPurpose`| String | Objective of the meeting |
| `status` | String | `'pending'`, `'researching'`, `'generating_briefs'`, `'evaluating'`, `'completed'`, `'failed'` |
| `tavilyData` | Object | `{ query, searchDepth, results: [{ title, url, content, score }], searchedAt }` |
| `agents.agentA` | Object | Briefing from Agent A (Gemini Pro), execution time, token usage |
| `agents.agentB` | Object | Briefing from Agent B (Gemini Flash), execution time, token usage |
| `evaluation` | Object | Benchmark scoring (relevance, depth, accuracy, actionability, clarity), winner (`'agentA'`, `'agentB'`, `'tie'`) |
| `finalBriefing`| Object | `{ chosenAgent, title, content, savedAt }` |

### 3.3 `ResearchHistory`

Audit and event timeline logging every milestone and status transition.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique identifier |
| `sessionId` | ObjectId | Reference to `ResearchSession` |
| `taskId` | ObjectId | Reference to `ResearchTask` (optional) |
| `action` | String | Action type (`SESSION_CREATED`, `TASK_CREATED`, `TAVILY_SEARCH_SAVED`, etc.) |
| `title` | String | Summary title |
| `description` | String | Narrative log |
| `payload` | Object | Event snapshot data |
| `actor` | String | Actor who triggered event |
| `timestamp` | Date | Event occurrence timestamp |

---

## 4. Complete API Endpoint Reference

### 4.1 System & Health

#### `GET /`
Returns API metadata and discovery links.

#### `GET /api/health`
Health check endpoint reporting server status, uptime, and database status.

---

### 4.2 Research Sessions (`/api/v1/sessions`)

#### `POST /api/v1/sessions`
Create a new research session.

**Request Body:**
```json
{
  "title": "Q4 Stripe Strategy Session",
  "description": "Pre-meeting research for executive partnership",
  "targetSubject": "Stripe",
  "meetingPurpose": "Enterprise Payment Gateway Partnership Exploration",
  "targetDate": "2026-12-05T14:30:00Z",
  "tags": ["fintech", "payments"]
}
```

#### `GET /api/v1/sessions`
List sessions with pagination and search (`page`, `limit`, `search`, `status`, `sortBy`, `sortOrder`).

#### `GET /api/v1/sessions/:id`
Get session details with populated tasks.

#### `PUT /api/v1/sessions/:id`
Update session fields.

#### `DELETE /api/v1/sessions/:id`
Delete session and cascade delete all associated tasks and history records.

#### `GET /api/v1/sessions/:id/history`
Retrieve complete chronological timeline of events for the session.

---

### 4.3 Research Tasks & Arena Pipeline (`/api/v1/tasks`)

#### `POST /api/v1/tasks`
Create a research task linked to a session.

#### `GET /api/v1/tasks`
List tasks with optional filters (`sessionId`, `status`, `subjectName`, pagination).

#### `GET /api/v1/tasks/:id`
Get full research task data including web sources, both agent briefings, and evaluation.

#### `PATCH /api/v1/tasks/:id/status`
Update task lifecycle status (`pending`, `researching`, `generating_briefs`, `evaluating`, `completed`, `failed`).

#### `PUT /api/v1/tasks/:id/web-data`
Store Tavily web research results.

#### `PUT /api/v1/tasks/:id/agent-results`
Store briefing generated by Agent A or Agent B.

#### `PUT /api/v1/tasks/:id/evaluation`
Store benchmark evaluation metrics and winner determination.

#### `PUT /api/v1/tasks/:id/briefing`
Save the chosen or synthesized final meeting briefing.

#### `GET /api/v1/tasks/stats/summary`
Get arena benchmarking analytics (win rates, average scores, latency comparisons).

#### `GET /api/v1/tasks/:id/export/markdown`
Export meeting briefing as clean Markdown.

#### `POST /api/v1/tasks/:id/simulate`
Simulate full Tavily + Bifrost + Gemini Pro / Flash pipeline for rapid frontend verification.

---

### 4.4 History Management (`/api/v1/history`)

#### `GET /api/v1/history`
Query activity logs across the platform (supports `sessionId`, `taskId`, `action`, pagination).

#### `POST /api/v1/history`
Manually record an event or strategy note.

#### `GET /api/v1/history/:id`
Get details of a specific history log entry.

#### `DELETE /api/v1/history/:id`
Delete a history log entry.

---

## 5. Postman Testing Guide

1. Open Postman.
2. Click **Import** (or press `Ctrl + O`).
3. Import both files from the `/postman` folder:
   * `Research_Agent_Arena.postman_collection.json`
   * `Research_Agent_Arena.postman_environment.json`
4. Set active environment to **"Research Agent Arena - Local Environment"**.
5. Run the requests sequentially or use Postman Collection Runner.
