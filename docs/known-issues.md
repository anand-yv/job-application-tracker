# Known Issues

Bugs, security risks, and inconsistencies found by reading the code.
IDs are stable — link to them (`known-issues.md#ki-07`) rather than repeating
the text. When an issue is fixed, delete its entry (git history keeps it).

**Severity scale**
- **Critical** — security hole or data loss; fix before anything else.
- **High** — user-visible bug in a core flow, or likely 500s in normal use.
- **Medium** — correctness/robustness problem that bites under specific conditions.
- **Low** — polish, consistency, minor UX, or hardening.

## Summary

| ID | Severity | Area | Title |
|---|---|---|---|
| [KI-05](#ki-05) | Medium | Backend | `deleteApplication` / reads rely on open-session-in-view, not transactions |
| [KI-06](#ki-06) | Medium | Backend | `jakarta.transaction.Transactional` used instead of Spring's |
| [KI-07](#ki-07) | Medium | Backend | Common bad inputs return 500 instead of 4xx |
| [KI-08](#ki-08) | Medium | Backend | Lombok `@Data` on JPA entities (unstable `equals`/`hashCode`) |
| [KI-09](#ki-09) | Medium | Backend | Emails are case-sensitive → duplicate accounts/contacts |
| [KI-10](#ki-10) | Medium | Backend + frontend | Weak input validation (email format, password policy, lengths) |
| [KI-11](#ki-11) | Medium | Database | No migrations; `ddl-auto: update` is the only schema source |
| [KI-12](#ki-12) | Low | Backend | Inconsistent HTTP status for "already exists" (400 vs 409) |
| [KI-13](#ki-13) | Low | Backend / security | Generic 500 handler leaks exception class names |
| [KI-14](#ki-14) | Low | Backend / security | Account enumeration via register message and login timing |
| [KI-16](#ki-16) | Low | Backend / perf | Eager `@ManyToOne` and lazy-collection loading on link/unlink |
| [KI-17](#ki-17) | Low | Backend | `CurrentUserProvider` throws a bare `RuntimeException` |
| [KI-18](#ki-18) | Low | Config | Timezone only set via Maven plugin; `show-sql: true`; unneeded `allowCredentials` |
| [KI-19](#ki-19) | Low | Frontend / security | JWT in `localStorage`; route guards only check presence |
| [KI-20](#ki-20) | Low | Frontend | `ApplicationDetail` state/UX glitches |
| [KI-21](#ki-21) | Low | Frontend | Text typos and placeholders in the UI |
| [KI-22](#ki-22) | Low | Frontend | `useEffect` dependency warnings and double navigation on logout |
| [KI-23](#ki-23) | Low | Frontend | Inconsistent service function signatures and file names |
| [KI-24](#ki-24) | Low | Tests | Only test is `contextLoads()`, which needs a live database |

---

<a id="ki-05"></a>
## KI-05 — `deleteApplication` / reads rely on open-session-in-view · **Medium**

**Where:** `ApplicationServiceImpl.deleteApplication`, `getApplicationById`

`deleteApplication` modifies contacts (owning side of the many-to-many) and
then deletes, but isn't transactional. `getApplicationById` reads the lazy
`contacts` collection in the mapper outside a transaction. Both only work
because Spring Boot's default `spring.jpa.open-in-view=true` keeps the session
open for the whole request. Disabling OSIV (recommended) would break them with
`LazyInitializationException` or lost unlink updates.

**Fix:** Add `@Transactional` to `deleteApplication` and
`@Transactional(readOnly = true)` to the read methods (`getApplicationById`,
`getAllApplicationsForCurrentUser`, contact reads). Then set
`spring.jpa.open-in-view: false`.

---

<a id="ki-06"></a>
## KI-06 — `jakarta.transaction.Transactional` used instead of Spring's · **Medium**

**Where:** `ApplicationServiceImpl` imports

Spring honours the JTA annotation, but it has no `readOnly`, no isolation or
timeout settings, and uses different rollback attributes (`rollbackOn` instead
of `rollbackFor`). Mixing the two styles gets confusing as more services are added.

**Fix:** Import `org.springframework.transaction.annotation.Transactional`
everywhere.

---

<a id="ki-07"></a>
## KI-07 — Common bad inputs return 500 instead of 4xx · **Medium**

**Where:** `GlobalExceptionHandler`

These fall through to the generic `Exception` handler (500):

| Input | Exception | Should be |
|---|---|---|
| Malformed UUID in path (`/applications/abc`) | `MethodArgumentTypeMismatchException` | 400 |
| Invalid enum in query (`?status=FOO`) | `MethodArgumentTypeMismatchException` | 400 |
| Unknown sort field (`?sort=foo`) | `PropertyReferenceException` | 400 |
| Unique-constraint race (duplicate email) | `DataIntegrityViolationException` | 409 |
| Value longer than a `varchar` column | `DataIntegrityViolationException` | 400 |
| Authenticated but user row missing ([KI-17](#ki-17)) | `RuntimeException` | 401 |

**Fix:** Add `@ExceptionHandler`s for the exceptions above. Optionally
whitelist sortable fields (`createdAt`, `appliedDate`, `company`, `status`)
in the service before querying.

---

<a id="ki-08"></a>
## KI-08 — Lombok `@Data` on JPA entities · **Medium**

**Where:** `User`, `JobApplication`, `Contact`

`@Data` generates `equals`/`hashCode` from all non-excluded fields, including
the generated `id`, timestamps, and the `user` association. Entities are stored
in `HashSet`s (`contacts`, `jobApplications`). In `createApplication`,
`addContact` puts the new `JobApplication` into `contact.jobApplications`
while its `id` is still `null`; after `save()` assigns the id, its hash changes,
so later `remove()` on that set in the same session can silently fail.
`toString` also touches the eager `user` association.

**Fix:** Replace `@Data` with `@Getter @Setter` and implement `equals`/`hashCode`
based on `id` only (with a constant `hashCode`, the standard Hibernate pattern),
or use `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` with `@Include` on `id`.

---

<a id="ki-09"></a>
## KI-09 — Emails are case-sensitive → duplicate accounts/contacts · **Medium**

**Where:** `AuthService.registerUser`, `login`; `ContactServiceImpl`

`Alice@x.com` and `alice@x.com` register as different users, and login is
case-sensitive. Same for the per-user contact email uniqueness. Leading/trailing
spaces are also kept.

**Fix:** Normalise (`trim().toLowerCase(Locale.ROOT)`) emails on register,
login, and contact create/update. Existing rows may need a one-off cleanup.

---

<a id="ki-10"></a>
## KI-10 — Weak input validation · **Medium**

**Where:** DTOs, `Register.jsx`

- No `@Email` on `AuthRequest.email` or `ContactRequest.email`.
- No password rule beyond `@NotBlank` (a 1-char password is accepted).
- No `@Size` limits on most string fields. `notes` (10000) and `jobUrl` (2048) are limited.
- No URL validation on `jobUrl`.
- `Register.jsx` inputs lack `required`; the password-match check is client-only (acceptable, but there's no server-side minimum).

**Fix:** Add `@Email`, `@Size(min = 8)` on password, `@Size(max = …)` matching
column lengths, and `required`/`minLength` on the Register inputs.

---

<a id="ki-11"></a>
## KI-11 — No migrations; `ddl-auto: update` is the only schema source · **Medium**

**Where:** `application.yaml`, `application-sample.yaml`

`update` never drops/alters column types or constraints, so later schema
fixes don't apply to existing databases, and there's no reproducible schema
for a fresh deploy.

**Fix:** Add Flyway, create a baseline migration from the current schema, and
switch to `ddl-auto: validate`. Tracked in [features-todo.md](features-todo.md).

---

<a id="ki-12"></a>
## KI-12 — Inconsistent status for "already exists" · **Low**

`EmailAlreadyExistsException` → 400, `ContactAlreadyExistsException` → 409.

**Fix:** Use 409 Conflict for both.

---

<a id="ki-13"></a>
## KI-13 — Generic 500 handler leaks exception class names · **Low**

`handleGeneric` returns `"Something went wrong : " + ex.getClass().getSimpleName()`,
exposing internals (e.g. `PropertyReferenceException`).

**Fix:** Return a fixed message to the client; keep the detail in logs only.

---

<a id="ki-14"></a>
## KI-14 — Account enumeration · **Low**

- Register returns "Email already exists with that email".
- Login returns immediately when the email is unknown but runs BCrypt when it
  exists, so response time reveals whether an account exists.

**Fix:** For login, run a dummy `passwordEncoder.matches` when the user isn't
found. Accept the register message as a UX trade-off, or add rate limiting
([features-todo.md](features-todo.md)).

---

<a id="ki-16"></a>
## KI-16 — Eager `@ManyToOne` and lazy-collection loading on link/unlink · **Low**

- `JobApplication.user` and `Contact.user` use the default EAGER fetch, so
  every list/page query also loads the user.
- `addContact`/`removeContact` call `contact.getJobApplications()`, which loads
  *all* applications linked to that contact just to add one row.

**Fix:** `@ManyToOne(fetch = FetchType.LAZY, optional = false)`. For linking,
acceptable at current scale; revisit if contacts get many applications.
Also add `nullable = false` to the `user_id` join columns.

---

<a id="ki-17"></a>
## KI-17 — `CurrentUserProvider` throws a bare `RuntimeException` · **Low**

If a valid token belongs to a user that no longer exists, the client gets a 500.

**Fix:** Throw an `AuthenticationException`-style custom exception mapped to 401.

---

<a id="ki-18"></a>
## KI-18 — Config hardening · **Low**

- Timezone (`-Duser.timezone=Asia/Kolkata`) is only set in the Maven plugin's
  `jvmArguments`; a packaged JAR uses the host timezone. `LocalDateTime.now()`
  timestamps will shift. Prefer `Instant`/`OffsetDateTime` or set
  `spring.jpa.properties.hibernate.jdbc.time_zone`.
- `show-sql: true` in the shared config — move to a dev profile.
- CORS `allowCredentials(true)` isn't needed (auth uses a header, not cookies).
- Real DB credentials and JWT secret live in `application.yaml` (gitignored —
  good). Prefer environment variables (`${JWT_SECRET}`) so the file can be shared.

---

<a id="ki-19"></a>
## KI-19 — JWT in `localStorage`; guards only check presence · **Low**

Any XSS can read the token. `ProtectedRoute`/`GuestRoute` treat an expired
token as logged in until the first API call returns 401.

**Fix:** Acceptable for now. Longer term: short-lived access token in memory +
refresh token in an `HttpOnly` cookie ([features-todo.md](features-todo.md)).
Optionally decode `exp` client-side in the guards.

---

<a id="ki-20"></a>
## KI-20 — `ApplicationDetail` state/UX glitches · **Low**

**Where:** `pages/ApplicationDetail.jsx`

- One `actionLoading` flag for save, delete, and status change — while saving,
  the Delete button reads "DELETING...".
- If `GET /contacts` fails, the whole page shows the error instead of the
  application.
- After a status PATCH the response is discarded, so `updatedAt` in state is stale.
- `createdAt`/`updatedAt` are destructured but never shown.

**Fix:** Separate loading flags per action; handle the contacts error locally;
use the PATCH response to update state.

---

<a id="ki-21"></a>
## KI-21 — Text typos and placeholders · **Low**

- Header logo text is the placeholder `"JSJSJ"` (`Headers.jsx`).
- Contacts empty state says "No Contact. Add Application" (`Contact.jsx`).
- Button label "REFERESH" (`Contact.jsx`).
- `toogleTheme` misspelt in `ThemeContext`.
- Mixed casing on buttons ("Refresh" vs "REFERESH", "Create Application" vs "CREATE CONTACT").

---

<a id="ki-22"></a>
## KI-22 — `useEffect` deps warnings and double navigation · **Low**

- `AuthContext`, `ApplicationForm`, and `Contact` call a callback in
  `useEffect(..., [])` without listing it (react-hooks lint warnings).
- `Headers.handleLogout` calls `logout()` (navigates to `/`) and then
  `navigate("/login")`.

**Fix:** Add the callbacks to the dependency arrays (they're already
`useCallback`-wrapped where it matters); drop one of the two navigations.

---

<a id="ki-23"></a>
## KI-23 — Inconsistent service signatures and names · **Low**

`applications.getById({ id })` takes an object; every other function takes a
bare `id`. Files are named `applications.js`, `auth.js`, `contactService.js`.

**Fix:** Use `getById(id)` and a consistent naming scheme (e.g.
`applicationService.js`, `authService.js`, `contactService.js`).

---

<a id="ki-24"></a>
## KI-24 — No meaningful tests · **Low**

The only test, `ApiApplicationTests.contextLoads()`, boots the full context
and needs a running Postgres, so it fails in a clean CI environment. No unit
or integration tests exist for services, security, or controllers.

**Fix:** See the testing item in [features-todo.md](features-todo.md).
Use Testcontainers (or an `@DataJpaTest` slice) so tests run without a local DB.
