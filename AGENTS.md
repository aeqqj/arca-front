# arca-front — project instructions

## Read first

- **`PLAN.md`** — the current API-wiring plan, its decisions, and its status
  checkboxes. Update the checkboxes when you land or change parts of it.

## The other half: the arca backend

- Partner API lives at `/home/charles/dev/arca` (Java 21 / Spring Boot, Maven).
- **Never modify anything in that repo from frontend work, and do not plan backend
  changes.** The user owns it and handles it separately (2026-09-05: earlier
  frontend-driven backend edits were all reverted at the user's request).
  The frontend must work against the API exactly as it exists.
- Dev server: port **20255**, JWT bearer auth, Jackson **SNAKE_CASE** JSON.
- A deployed instance runs at **https://arca-backend.dcism.org/** (same app; Swagger at
  `/swagger-ui/index.html`). Its CORS allows `http://localhost:5173` and `https://arca.dcism.org`.
  Local dev currently targets it via `VITE_API_BASE_URL` in `.env` (gitignored); with the
  variable unset, the Vite proxy sends `/api` → `http://localhost:20255` instead.

## Frontend rules that came out of the plan

- Departments are **deprecated** in this UI; `department_id`/`school_id` are fixed
  defaults (`1`) in `src/core/config.ts`. Per the user (2026-09-05) department row 1
  **is** DCISM — permanent by design (table kept for future scalability), so these
  are intentional defaults, not hacks. Missing endpoints/gaps are written up in
  **`BACKEND_PLAN.md`** (hand-off doc; the frontend never edits the backend repo).
- All HTTP goes through `src/core/api/` (`client.ts` / `endpoints.ts`); feature code
  never calls `fetch` directly. Session state: `src/core/auth/session.ts`.
- Pages are async string-template renders guarded by `core/render.ts`
  (`nextRenderToken`/`paint`); keep that shape, no framework or new state lib.
- The "feed" is `GET /api/v1/posts/department/1` (no global list endpoint exists).

## Conventions

- Vite + TS (`verbatimModuleSyntax`: use `import type`; `noUnusedLocals`).
  Prettier: tabs, tabWidth 4. Verify with `pnpm build`.
