# Features Done

Features that are built end-to-end and working in the current code.
Known bugs in these features are tracked in [known-issues.md](known-issues.md),
not here. When a feature in [features-todo.md](features-todo.md) is finished,
move it into this file.

## Authentication

- [x] Register with email + password (`POST /auth/register`), BCrypt hashing
- [x] Login returning a signed JWT (`POST /auth/login`), configurable expiry
- [x] Get current user (`GET /auth/me`) — used to hydrate `AuthContext` on load
- [x] Stateless JWT filter chain (`JwtAuthFilter`) protecting all non-auth endpoints
- [x] JSON `401` responses for missing/invalid/expired tokens (`CustomAuthenticationEntryPoint`)
- [x] Frontend: Login and Register pages with loading state and error messages
- [x] Frontend: confirm-password check on Register
- [x] Frontend: token stored in `localStorage`, attached automatically by the axios interceptor
- [x] Frontend: auto-logout + redirect to `/login` on a `401`
- [x] Frontend: client-side logout with confirmation dialog
- [x] Frontend: `ProtectedRoute` / `GuestRoute` guards

## Job applications

- [x] Create an application (company, role, job ID, URL, status, source, notes, salary range, location, applied date)
- [x] View a single application with its linked contacts
- [x] Edit an application (edit / save / cancel-and-restore)
- [x] Quick status change from the detail page without entering edit mode (`PATCH /applications/{id}/status`)
- [x] Delete an application (with confirmation; unlinks contacts first)
- [x] List applications for the current user only
- [x] Server-side pagination (`Page<…>` response, 10 per page in the UI, prev/next)
- [x] Filter by status (JPA Specification `hasStatus`)
- [x] Sort by applied date or company, ascending/descending (default: newest created first)
- [x] Lightweight summary DTO for the list endpoint
- [x] Status enum with six values and a dropdown in the UI

## Contacts

- [x] Create a contact (name required; email, phone, company, position, notes optional)
- [x] List all of the user's contacts
- [x] View, edit (save / cancel-and-restore), and delete a contact
- [x] Per-user unique contact email (DB constraint + `409` with a clear message)

## Application ↔ contact linking

- [x] Many-to-many link between applications and contacts (`application_contacts`)
- [x] Link contacts when creating an application (`contactIds`)
- [x] Add/remove linked contacts when editing an application (diff-based sync)
- [x] Ownership check — only the user's own contacts can be linked
- [x] Custom contact multi-select component in the create and detail pages
- [x] Deleting either side cleans up the join rows

## Data ownership & API robustness

- [x] Every application/contact read and write is scoped to the authenticated user (others' IDs → `404`)
- [x] Bean Validation on request DTOs with readable `400` messages
- [x] Consistent JSON error body (`ErrorResponse`) via `GlobalExceptionHandler`
- [x] Malformed JSON → `400`
- [x] CORS configured from `app.cors.allowed-origins`, enforced in the security chain

## Frontend shell & UX

- [x] App header with navigation (dashboard, contacts), avatar menu, theme toggle
- [x] Dark / light mode — persisted, defaults to system preference
- [x] 404 Not Found page for unknown routes
- [x] Loading and error states on every data page
- [x] Confirmation before destructive deletes
- [x] shadcn/ui component set (button, input, label, textarea, select, dialog, dropdown-menu) on Base UI
- [x] Reusable `Dropdown` wrapper used for every select

## Dev setup

- [x] Postgres 16 via `docker-compose.yml` (host port 5433), credentials from `.env`
- [x] Sample configs: `.env.sample`, `frontend/.env.sample`, `backend/.../application-sample.yaml`
- [x] Real config files gitignored (`.env`, `application.yaml`)
