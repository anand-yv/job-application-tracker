# Features To Do

Planned or partially built features. Bugs and fixes for existing features live
in [known-issues.md](known-issues.md) — don't duplicate them here.

**Layers** — which parts need changes: **BE** backend code · **DB** schema
(new tables/columns; needs a migration once Flyway exists) · **FE** frontend.

**Priority**
- **P0** — do now (blocking / security)
- **P1** — next up; core to the product
- **P2** — valuable, after P1
- **P3** — nice to have
- **P4** — someday / optional

Track progress in each item's "Status" note. Tick the box only when the
feature is fully done, then move it to [features-done.md](features-done.md).

---

## P1 — Core

- [ ] **Application status history (audit trail)**
  - Layers: DB (new `application_status_history` table: application, old status, new status, changed at, optional note), BE (entity, record a row on create / status PATCH / PUT when status changes; `GET /applications/{id}/history`), FE (timeline on `ApplicationDetail`)
  - Status: not started — `updateStatus` currently overwrites the value with no record

- [ ] **More application filters and search**
  - Layers: BE (wire the commented-out specs in `ApplicationSpecifications` — company, role title, location, salary range — using case-insensitive `like`; add an applied-date range spec; add query params), FE (search box + filter inputs on `Dashboard`)
  - Status: partial — status filter works; other specs are commented out and use exact match

- [ ] **Database migrations (Flyway)**
  - Layers: BE, DB — baseline the current schema, switch `ddl-auto` to `validate`. Prerequisite for every DB change below. See [KI-11](known-issues.md#ki-11)
  - Status: not started

- [ ] **Automated tests**
  - Layers: BE (service unit tests; `@WebMvcTest` for controllers + security; repository tests with Testcontainers), FE (optional: Vitest + React Testing Library)
  - Status: not started — see [KI-24](known-issues.md#ki-24)

## P2 — Valuable

- [ ] **Dashboard statistics** (totals, counts per status, applications per week, response rate)
  - Layers: BE (aggregate endpoint, e.g. `GET /applications/stats` with group-by-status query), FE (stats cards/chart above the list)
  - Status: not started

- [ ] **Follow-up reminders**
  - Layers: DB (`follow_up_reminders`: application, reminder date/time, message, done/sent flag), BE (entity, repository, CRUD under `/applications/{id}/reminders` and `GET /reminders` for upcoming), FE (reminder section on `ApplicationDetail`, upcoming list on `Dashboard`)
  - Status: not started

- [ ] **Show linked applications on a contact**
  - Layers: BE (add application summaries to `ContactResponse` or a `GET /contacts/{id}/applications` endpoint), FE (list on `ContactDetail` with links)
  - Status: not started — linking is only visible from the application side

- [ ] **Refresh tokens**
  - Layers: DB (`refresh_tokens` table: user, token hash, expiry, revoked), BE (`POST /auth/refresh`, issue on login/register, rotate on use), FE (axios interceptor: on 401 → refresh → retry once; store refresh token in an `HttpOnly` cookie)
  - Status: not started — single access token only. Also addresses [KI-19](known-issues.md#ki-19)

- [ ] **Server-side logout**
  - Layers: BE (`POST /auth/logout` revoking the refresh token; optional access-token blocklist), FE (call it from `logout()`)
  - Status: not started — logout only clears `localStorage`; the JWT stays valid until expiry. Simplest after refresh tokens exist; Redis blocklist optional

## P3 — Nice to have

- [ ] **User profile / account page** (view email, change password, delete account)
  - Layers: BE (`PUT /auth/password`, `DELETE /auth/me` with cascade), FE (profile page + menu item — the `TODO` in `Headers.jsx`)
  - Status: not started

- [ ] **Contacts: search, sort, pagination**
  - Layers: BE (`Pageable` + search param on `GET /contacts`), FE (search box, pager on `Contact` page)
  - Status: not started — endpoint returns all contacts, unsorted

- [ ] **Persist dashboard filters/sort/page in the URL**
  - Layers: FE (`useSearchParams` so back-navigation and refresh keep state)
  - Status: not started

- [ ] **Soft delete / archive applications**
  - Layers: DB (`deleted_at` or `archived` column), BE (filter out by default, restore endpoint), FE (archive view / undo)
  - Status: not started — deletes are permanent

- [ ] **Export applications to CSV**
  - Layers: BE (`GET /applications/export` streaming CSV), FE (export button)
  - Status: not started

- [ ] **Toast notifications and polished error UX**
  - Layers: FE (e.g. shadcn `sonner`; replace inline error text and `window.confirm` with toasts / dialogs)
  - Status: not started

- [ ] **Cancel buttons on create forms**
  - Layers: FE (`ApplicationForm`, `ContactForm`)
  - Status: not started

- [ ] **Responsive / mobile layout pass**
  - Layers: FE
  - Status: not started

- [ ] **Google OAuth login**
  - Layers: BE (`spring-boot-starter-oauth2-client` or Google ID-token verification, create/link user with `authProvider = GOOGLE`, block password login for OAuth-only users), DB (make `auth_provider` an enum / non-null), FE ("Sign in with Google" button)
  - Status: scaffolding only — `User.authProvider` field and nullable `password_hash` exist; nothing else

- [ ] **Rate limiting on auth endpoints**
  - Layers: BE (Bucket4j in-memory, or Redis-backed), infra (Redis in `docker-compose.yml` if Redis-backed)
  - Status: not started

## P4 — Someday / optional

- [ ] **Email / push notifications for reminders** (originally planned with Kafka)
  - Layers: BE (scheduler or Kafka producer/consumer, mail sender), DB (`notification_log`), FE (notification preferences), infra (Kafka/SMTP)
  - Status: not started. Depends on follow-up reminders. A `@Scheduled` job + Spring Mail is a simpler first step than Kafka

- [ ] **CSV import from Indeed / Naukri**
  - Layers: BE (multipart upload, parse, validate, bulk insert), DB (optional `external_integrations`), FE (upload, column-mapping, preview/confirm)
  - Status: not started

- [ ] **Browser extension API** (save a job posting from the browser)
  - Layers: BE (token-authenticated quick-create endpoint), separate extension project
  - Status: not started
