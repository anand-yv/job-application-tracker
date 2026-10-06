# Dead Code

Things in the repo that nothing uses. Each entry says whether it's safe to
delete outright or needs a decision first. Remove the entry once it's deleted.

## Backend

| Item | Location | Why it's dead | Action |
|---|---|---|---|
| `ContactLinkRequest` DTO | `dto/ContactLinkRequest.java` | Was used by `PUT /applications/{id}/contacts` (`linkContacts`), removed in commit `a1f790d`. Linking now goes through `JobApplicationRequest.contactIds` | **Safe to delete** |
| `ApplicationRepository.findByUser(User)` | `repository/ApplicationRepository.java` | Replaced by `findAll(Specification, Pageable)`; no callers | **Safe to delete** |
| `TestController` | `controller/TestController.java` | Debug endpoints, not called by the frontend; also a Critical security hole ([KI-01](known-issues.md#ki-01)) | **Delete** (or restrict to `@Profile("dev")`) |
| Commented-out specs `hasCompany`, `hasRoleTitle`, `hasSalaryRange`, `hasLocation` | `repository/ApplicationSpecifications.java` | Never wired up; exact-match only | **Decide:** keep as a starting point for the "More filters" item in [features-todo.md](features-todo.md) (rewrite with `like`), otherwise delete |
| Commented-out `CommandLineRunner testJwt` bean | `JobTrackerApplication.java` | Early manual JWT smoke test that prints to stdout | **Safe to delete** |
| Redundant `if (applicationStatus == null)` check | `ApplicationServiceImpl.updateStatus` | The DTO already has `@NotNull`, and the check runs after the DB lookup | **Safe to delete** |
| Broken comment line `- ====…` | `resources/script.sql` (line 22) | Single dash makes the script fail if run as a whole; the file is only ad-hoc inspection queries | **Fix the line** or delete the file |

## Frontend

| Item | Location | Why it's dead | Action |
|---|---|---|---|
| `card` shadcn component | `src/components/ui/card.jsx` | Never imported | **Safe to delete** (re-add with `npx shadcn add card` when needed) |
| `App.css` | `src/App.css` | Empty and never imported | **Safe to delete** |
| Vite template assets | `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `public/icons.svg` | Not referenced anywhere (only `public/favicon.svg` is used, by `index.html`) | **Safe to delete** |
| Unused destructured `createdAt`, `updatedAt` | `pages/ApplicationDetail.jsx`, `pages/ContactDetail.jsx` | Destructured but never rendered | **Delete**, or display them (see [KI-20](known-issues.md#ki-20)) |
| Vite boilerplate README | `frontend/README.md` | Generic "React + Vite" template text, nothing project-specific | **Replace** with short frontend setup notes, or delete |
| `TO_DO.md` | `frontend/TO_DO.md` | Both items (loading state, label `htmlFor`) are already done | **Safe to delete** |

## Repo root & config

| Item | Location | Why it's dead | Action |
|---|---|---|---|
| `DirectoryStructure.md` | repo root | Original scaffold plan; wrong ports (5432 vs 5433), lists `application-dev.yml` and folders that don't exist. Superseded by these docs | **Delete** or move to `docs/archive/` |
| `DB_NAME` variable | `.env.sample` | `docker-compose.yml` hardcodes `POSTGRES_DB: "jobtracker"` and never reads `DB_NAME` | **Delete the variable**, or use `${DB_NAME}` in compose |

## Dependencies

Every declared dependency is in use:

- **Backend (`pom.xml`):** data-jpa, security, webmvc, validation, postgresql, lombok, jjwt (api/impl/jackson), and the test starters are all used.
- **Frontend (`package.json`):** `shadcn`, `tw-animate-css`, and `@fontsource-variable/geist` are imported from `src/index.css`. `class-variance-authority`, `clsx`, and `tailwind-merge` are used by `components/ui` and `lib/utils.js`. `@base-ui/react` and `lucide-react` are used by the components.

No dependency is currently safe to remove.

## Not dead (kept on purpose)

- `backend/notes.md` and `frontend/NOTES.md` are personal learning notes, not project docs. Keep them, or move them under `docs/notes/` if you want them out of the code folders.
