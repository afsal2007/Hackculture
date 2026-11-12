# Arena Research frontend/backend handoff

All endpoints below are **proposed**; the frontend presently runs in local mock mode (`VITE_USE_MOCK_API=true`). Set it to `false` with `VITE_API_BASE_URL` once the server contract is implemented. Responses should use JSON and errors should be `{ "message": "human-readable explanation", "code": "OPTIONAL_CODE" }` with the appropriate 4xx/5xx status.

## Frontend routes

`/`, `/research/new`, `/research/progress`, `/agents/analysis`, `/reports/combined`, `/reports/brief`, `/research/share` (also `/research/access`), `/settings`, `/workspace`, `/team`, `/organization-settings`, `/general-settings`, `/notification-preferences`, `/notifications`, `/security-settings`, `/invitations`, and all `/auth/*` routes.

## Authentication (public except where noted)

| Method and proposed endpoint | Request body | Response |
| --- | --- | --- |
| `POST /auth/sign-in` | `{email,password}` | `{token,user,workspaces}` |
| `POST /auth/register` | `{accountType,fullName,email,password,organizationName?}` | `{token,user,workspace}` |
| `POST /auth/forgot-password` | `{email}` | `{message}` (always non-enumerating) |
| `POST /auth/reset-password` | `{token,password}` | `{message}` |
| `POST /auth/verify-email` | `{code}` | `{user}` |
| `POST /invitations/accept` | `{code,email}` | `{token?,workspace}` |

The client must only persist an opaque token, never a password. All remaining endpoints require `Authorization: Bearer <token>`.

## Workspace, team, and invitations

| Method and proposed endpoint | Request body / response |
| --- | --- |
| `GET, POST /workspaces` | Create body `{name,type}`; list returns `{workspaces}` |
| `GET, PATCH /workspaces/:workspaceId` | Workspace / update fields |
| `GET /workspaces/:workspaceId/members` | `{members:[{id,name,email,role}]}` |
| `POST /workspaces/:workspaceId/members` | `{email,role}` → invitation |
| `PATCH, DELETE /workspaces/:workspaceId/members/:memberId` | `{role}` / no body |
| `GET /invitations`, `POST /invitations/:id/resend`, `DELETE /invitations/:id` | Invitation list / actions |

Roles are `Owner`, `Admin`, `Researcher`, and `Viewer`; authorization must be enforced server-side, not inferred from the UI.

## Research and analysis

| Method and proposed endpoint | Request body / response |
| --- | --- |
| `GET, POST /research` | Create `{type,subject,website?,purpose,context?,objectives,depth}` → `{research}` |
| `GET /research/:id`, `GET /research/:id/progress` | Research and `{progress,agents,activities,status}` |
| `GET /research/:id/analysis` | `{agents,findings,sources,agreements,conflicts}` |
| `GET, PATCH /research/:id/report` | Report `{title,sections,sources,updatedAt}` |
| `GET /research/:id/brief` | `{title,summary,highlights,questions,recommendations}` |

## Sharing, notifications, profile, and security

| Method and proposed endpoint | Request body / response |
| --- | --- |
| `GET, PUT /research/:id/access` | `{recipients:[memberId],permission:"Viewer"|"Editor",organizationWide}` |
| `GET, PATCH /notifications` | `{notifications}` / preferences payload |
| `GET, PATCH /me` | Current user / editable profile fields |
| `PATCH /me/security/password` | `{currentPassword,newPassword}` → `{message}` |
| `GET, PATCH /organization/settings` | Organization settings |

`403` should include a safe message for role/access failures, `401` should cause token clearing and sign-in redirect, `422` should return field errors as `{message, fields:{field:"message"}}`, and `429` should return a retryable message.

## Deployment

Deploy the Vite `dist/` output and configure SPA history fallback to `index.html`. Provide `VITE_API_BASE_URL` at build time. Never put private keys, model keys, or database credentials in Vite variables because they are bundled into the browser.
