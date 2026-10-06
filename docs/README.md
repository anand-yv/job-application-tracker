# Project Docs

Living documentation for the Job Application Tracker (Spring Boot + React).
These files describe the **current code**, not a plan. When code and docs
disagree, the code wins — fix the doc.

| File | What it's for | Update it when… |
|---|---|---|
| [entities.md](entities.md) | Every JPA entity: fields, types, relationships, constraints | You add/rename/remove an entity, field, relationship, or constraint |
| [api-endpoints.md](api-endpoints.md) | Every REST endpoint, grouped by controller, with request/response DTOs and auth | You add/change a controller method, DTO, or security rule |
| [frontend.md](frontend.md) | Routes, reusable components, contexts, API service files | You add/change a route, component, context, or service function |
| [known-issues.md](known-issues.md) | Bugs, security risks, inconsistencies — with severity and fix | You find a new issue, or fix one (delete the entry or mark it fixed) |
| [features-done.md](features-done.md) | Checklist of features that are built and working | A feature from `features-todo.md` is finished — move it here |
| [features-todo.md](features-todo.md) | Planned / partially built features, with layers touched and priority | You plan new work, start something, or reprioritise |
| [dead-code.md](dead-code.md) | Unused code, files, and config that are safe to delete | You find or remove dead code |

## Viewing the docs

`docs/index.html` is a small viewer that renders these markdown files with
navigation, search, and colour-coded badges. Browsers can't load local files
from a double-clicked HTML page, so serve the folder from the project root:

```bash
npx serve docs
# or
python3 -m http.server 8000 --directory docs
```

Then open the URL it prints. The viewer only reads the `.md` files — to change
content (including ticking checkboxes), edit the markdown and refresh.

## Conventions

- Checkboxes (`- [ ]` / `- [x]`) in the features files so progress is easy to tick off.
- Issues in `known-issues.md` have stable IDs (`KI-05`, `KI-06`, …). Link to them
  from other files instead of repeating the description.
- Don't duplicate content between files — link instead.

## Archive

- [archive/ToDo.md](archive/ToDo.md) — the original phase plan. Historical only;
  its checkboxes and schema are out of date. Ideas still worth building were
  carried into [features-todo.md](features-todo.md).
