# API Endpoints

Base URL (dev): `http://localhost:8080` (frontend reads it from `VITE_API_URL`).

## Auth model

Configured in `config/SecurityConfig.java`:

- Stateless JWT. Send `Authorization: Bearer <token>`.
- `/auth/**` → public. Everything else → authenticated.
- A rule marking `/auth/me` as authenticated exists but is shadowed by the
  earlier `/auth/**` permit — see [KI-04](known-issues.md#ki-04).
- Invalid/expired token → `401` with `ErrorResponse` body
  (`JwtAuthFilter` + `CustomAuthenticationEntryPoint`).
- Ownership: every application/contact lookup is scoped to the current user;
  another user's ID returns `404`.

### Common error body — `ErrorResponse`

| Field | Type |
|---|---|
| `timestamp` | `LocalDateTime` |
| `status` | `int` |
| `reason` | `String` (HTTP reason phrase) |
| `message` | `String` |

Exception → status mapping (`GlobalExceptionHandler`):
`EmailAlreadyExistsException` 400 · `InvalidCredentialsException` 401 ·
`ApplicationNotFoundException` 404 · `ContactNotFoundException` 404 ·
`ContactAlreadyExistsException` 409 · `MethodArgumentNotValidException` 400
(first field error) · `HttpMessageNotReadableException` 400 · anything else 500
(see [KI-07](known-issues.md#ki-07)).

---

## AuthController — `/auth`

| Method | Path | Request | Response | Auth | Description |
|---|---|---|---|---|---|
| POST | `/auth/register` | `AuthRequest` | `200` `AuthResponse` | Public | Create a LOCAL user (BCrypt) and return a JWT. `400` if email exists |
| POST | `/auth/login` | `AuthRequest` | `200` `AuthResponse` | Public | Verify credentials, return a JWT. `401` on bad credentials |
| GET | `/auth/me` | — | `200` `AuthResponse` (`token: null`) | Intended: protected. Actual: public ([KI-04](known-issues.md#ki-04)) | Current user's email and timestamps |

**`AuthRequest`**

| Field | Type | Validation |
|---|---|---|
| `email` | `String` | `@NotBlank` |
| `password` | `String` | `@NotBlank` |

**`AuthResponse`**: `email: String`, `token: String`, `createdAt: LocalDateTime`, `updatedAt: LocalDateTime`

---

## ApplicationController — `/applications`

| Method | Path | Request | Response | Auth | Description |
|---|---|---|---|---|---|
| POST | `/applications` | `JobApplicationRequest` | `201` `JobApplicationResponse` | Protected | Create an application; optionally link contacts via `contactIds` |
| GET | `/applications` | Query params (below) | `200` `Page<JobApplicationSummaryResponse>` | Protected | Paginated list of the user's applications, optional status filter and sort |
| GET | `/applications/{id}` | — | `200` `JobApplicationResponse` | Protected | Get one application (with contacts) |
| PUT | `/applications/{id}` | `JobApplicationRequest` | `200` `JobApplicationResponse` | Protected | Update — non-null fields only ([KI-02](known-issues.md#ki-02)); syncs contact links if `contactIds` is non-null |
| PATCH | `/applications/{id}/status` | `UpdateApplicationStatusRequest` | `200` `JobApplicationResponse` | Protected | Change only the status |
| DELETE | `/applications/{id}` | — | `204` | Protected | Unlink all contacts, then delete the application |

**`GET /applications` query params**

| Param | Type | Default | Notes |
|---|---|---|---|
| `status` | `ApplicationStatus` | none (all) | Exact match |
| `page` | int | `0` | Spring `Pageable` |
| `size` | int | `10` (`@PageableDefault`) | Frontend sends `10` |
| `sort` | `field,asc\|desc` | `createdAt,DESC` | Any entity property is accepted; invalid → 500 ([KI-07](known-issues.md#ki-07)) |

**`JobApplicationRequest`**

| Field | Type | Validation |
|---|---|---|
| `company` | `String` | `@NotBlank` |
| `roleTitle` | `String` | `@NotBlank` |
| `jobId` | `String` | |
| `jobUrl` | `String` | |
| `source` | `String` | |
| `notes` | `String` | |
| `salaryRange` | `String` | |
| `location` | `String` | |
| `status` | `ApplicationStatus` | Optional; defaults to `APPLIED` on create |
| `appliedDate` | `LocalDate` (`yyyy-MM-dd`) | |
| `contactIds` | `List<UUID>` | Must all belong to the user, else `404`. On update: `null` = leave links alone, `[]` = remove all |

**`JobApplicationResponse`**: `id`, `jobId`, `jobUrl`, `company`, `roleTitle`,
`status`, `source`, `notes`, `salaryRange`, `location`, `appliedDate`,
`contacts: List<ContactResponse>`, `createdAt`, `updatedAt`

**`JobApplicationSummaryResponse`**: `id`, `company`, `roleTitle`, `status`, `appliedDate`

**`UpdateApplicationStatusRequest`**

| Field | Type | Validation |
|---|---|---|
| `status` | `ApplicationStatus` | `@NotNull` |

---

## ContactController — `/contacts`

| Method | Path | Request | Response | Auth | Description |
|---|---|---|---|---|---|
| POST | `/contacts` | `ContactRequest` | `201` `ContactResponse` | Protected | Create a contact. `409` if the user already has a contact with that email |
| GET | `/contacts` | — | `200` `List<ContactResponse>` | Protected | All of the user's contacts (unpaginated, unsorted) |
| GET | `/contacts/{id}` | — | `200` `ContactResponse` | Protected | Get one contact |
| PUT | `/contacts/{id}` | `ContactRequest` | `200` `ContactResponse` | Protected | Full overwrite of all fields (nulls clear values). `409` on duplicate email |
| DELETE | `/contacts/{id}` | — | `204` | Protected | Delete the contact; its application links are removed automatically |

**`ContactRequest`**

| Field | Type | Validation |
|---|---|---|
| `name` | `String` | `@NotBlank` |
| `email` | `String` | |
| `phone` | `String` | |
| `company` | `String` | |
| `position` | `String` | |
| `notes` | `String` | |

**`ContactResponse`**: `id`, `name`, `email`, `phone`, `company`, `position`,
`notes`, `createdAt`, `updatedAt` (no linked applications)

---

## TestController — `/test` (debug only)

| Method | Path | Request | Response | Auth | Description |
|---|---|---|---|---|---|
| POST | `/test/generate-token` | `?email=` | `200` raw JWT string | Protected | Mints a valid JWT for **any** email — [KI-01](known-issues.md#ki-01) (Critical) |
| POST | `/test/validate-token` | `?token=` | `200` email string | Protected | Decodes a JWT and returns its subject |

Not called by the frontend. Slated for removal — see [dead-code.md](dead-code.md).
