# PLAN.md — arca-front API wiring

> Status: **implemented, awaiting end-to-end verification** (needs arca backend + MySQL running).
> Drafted 2026-09-05 in a planning session; revised same day to **frontend-only**.
> Update the checkboxes below when parts land or change.
> Backend gaps/workarounds are tracked separately in `BACKEND_PLAN.md` (hand-off doc for the backend team).

## Hard constraints (agreed with the user — do not revisit without asking)

- **NEVER touch the backend at `/home/charles/dev/arca`.** The user owns it and reverted
  everything previously proposed there. All wiring must work against the _existing_ API.
- **Departments are deprecated** in the frontend UI. They still exist in the post schema,
  so the frontend sends fixed defaults: `DEFAULT_DEPARTMENT_ID = 1`, `DEFAULT_SCHOOL_ID = 1`
  (see `src/core/config.ts`, env-overridable). **Per the user (2026-09-05): department row 1
  _is_ DCISM — permanent by design (table kept for future scalability), so these defaults are
  intentional, not hacks to remove.** Backend still needs `GET /posts/subject/{id}` eventually
  (see `BACKEND_PLAN.md` #12), but the department id itself stays.
- Scope = **core flows only**: sign in / sign up / logout, home feed, post detail, profile,
  create post (+ attachments). Votes, bookmarks/vault, announcements, trending, search,
  admin, and the sidebar course list stay **unwired mock UI**.
- No new npm dependencies. Keep the vanilla-TS + innerHTML-template style.
- Dev transport: Vite `server.proxy` `/api` → `http://localhost:20255` (no CORS concerns).
  A deployed backend also exists at **<https://arca-backend.dcism.org/>** — currently in use
  via `VITE_API_BASE_URL` in `.env` (its CORS permits `localhost:5173`).

## API facts (verified against the code, 2026-09-05)

- Spring Boot on port **20255**; Jackson **SNAKE_CASE** on the wire; JWT bearer auth.
- `POST /api/v1/auth/login` `{email,password}` → `{access_token, refresh_token, token_type, email}`.
  Errors: `{error: "..."}` (401/403) or `{error,message,timestamp,status}` (400) — prefer `message`.
- `POST /api/v1/auth/register` takes a `User` (`first_name`/`last_name` (at least one), `email`
  (regex-checked), `password` (≥8, upper, lower, digit)) → `201 {message, email}`.
- `POST /api/v1/auth/refresh` `{refresh_token}` → AuthResponse; `POST /api/v1/auth/logout` `{refresh_token}`.
- Feed source: `GET /api/v1/posts/department/1` (latest APPROVED posts). There is **no** global
  `GET /posts` and none will be added.
- `GET /api/v1/posts/{rowId}` — the path param is the **row PK** (`PostResponse.id`), not `post_id`.
- `GET /api/v1/posts/user/{userId}`, `GET /api/v1/user` (list all — used to find _me_ by email;
  there is no `/me` endpoint), `GET /api/v1/subject` (courses for the "Pick a course" select).
- `POST /api/v1/posts` body `{title (≤30), content (HTML), user_id, department_id, post_tag?}`;
  `post_tag` is a **subject id that must belong to the department sent** — a mismatch returns 400,
  and the post lands in `PENDING_APPROVAL` (invisible in the feed until an admin approves).
- `POST /api/v1/files/upload` multipart: `file` (≤3; jpeg/png/pdf), `user_id`,
  `post_id` = **row PK**. The create response only returns the row PK inside its `message`
  string ("...with Id 42...") → `parseCreatedPostRowId()` in `core/api/endpoints.ts` regexes it out.
- `GET /api/v1/files/download/{id}` requires the Authorization header → fetch as blob,
  never a bare `<img>`/`<a href>` (see post-page.ts).
- Uploaded `FileResponse`: `{id, file_name, file_type, file_size}` (`download_url` is stale junk — ignore).
- **Votes** (`2026-09-05`): `POST /api/v1/votes` `{post_id (row PK), vote_type: "UPVOTE"|"DOWNVOTE"}`
  is a **toggle**: same type again → deletes the vote and returns `200` with an **empty body**;
  other type → flips. `GET /votes/{id}/my-vote` → VoteResponse or empty body. Wire-verified via live OpenAPI.
- **Vault ≠ bookmarks**: `user_id` is UNIQUE on the vault row (one saved post per user),
  duplicate add throws, and `GET /vaults/check` takes a `@RequestBody` on GET — impossible
  from browser fetch. Bookmark buttons deliberately stay inert pending user direction.

## Architecture (agreed)

- **Rendering**: async string templates. Pages paint a loading shell → fetch → repaint →
  bind (`initIcons`, handlers). Components stay `(data) => string`.
- **Stale-render guard**: `nextRenderToken()` / `isCurrentRender()` / `paint()` in `core/render.ts`.
- **Data flow**: fetch-per-page **through a TTL cache** (`core/api/cache.ts`) — subjects/users
  5 min, posts 30 s, with in-flight dedupe and failures never cached. Mutations `invalidate("posts")`;
  any session change (sign in / sign out / forced sign-out) calls `clearCache()` so no
  previous-user data survives. The only other shared state is the session
  (`core/auth/session.ts` + tokens in localStorage via `core/api/client.ts`).
- **Layering**: all HTTP in `core/api/` (`client.ts`, `types.ts`, `endpoints.ts`);
  features never call fetch directly.
- **Auth storage**: `localStorage` keys `arca_access_token`, `arca_refresh_token`,
  `arca_session_user`. One auto-refresh on 401 (single-flight), then replay; refresh failure
  clears the session and redirects to `/auth/signin`.
- **Routing**: post detail at `/post?id=<rowPK>`; router guards redirect unauthenticated →
  signin and signed-in `/auth/*` → `/`; boot double-render fixed (only `main.ts` triggers it).
- Accepted tradeoff: post `content` is Lexical HTML rendered raw in full view.

## Implementation status

- [x] Backend changes — **NONE, by decision** (earlier attempts reverted by the user)
- [x] `vite.config.ts` dev proxy; `src/core/config.ts`; `.env.example`; `.env` gitignored
- [x] Core layer: `core/api/{types,client,endpoints}.ts`, `core/auth/session.ts`, `core/render.ts`
- [x] Router: guards, `navigate()`, `/post` route, `closest()` click delegation, double-render fix
- [x] Pages wired: signin, signup (first/last/email/password), home feed, post detail (+blob
      downloads), profile (user + own posts), create-post (subject select, post, upload), header
      (user name, sign out, conditional Admin)
- [x] `pnpm build` green; proxy smoke-tested (502 without backend = wired)
- [x] TTL cache in `core/api/cache.ts`, wired into all GETs; invalidation on mutations +
      session changes; verified with unit tests (node strip-types) and `pnpm build` green
- [x] §1 static scan follow-up (2026-09-05): sidebar now renders real subjects from
      `GET /subject` and filters the feed client-side via `/?subject=<name>`; trending =
      top-upvoted from the cached feed (duplicated feature copies merged into
      `shared/components/trending.ts`); post-page `miniProfile`/`profileExtra` show the real
      author (`GET /user/{id}`) and their other posts; up/down arrows wired to the vote
      toggle (capture-phase handler in `shared/handlers/voteHandler.ts` + `defaultPrevented`
      guard in the router so voting doesn't navigate)
- [x] Vote "you already voted" state on feed cards: **session-memory, zero extra requests** —
      `src/core/votes.ts` keeps a `Map<postId, VoteType>` updated by every vote cast
      (`rememberVote`) and read when rendering cards (`getRememberedVote`, passed into
      `post()`/`fullPost()`); cleared on sign-in/sign-out/force-sign-out with the rest of the
      session state. Only lost on a hard reload; the post-detail page still fetches
      authoritative `my-vote` from the server.
- [ ] End-to-end with backend + MySQL: signup→signin→create→approve (admin)→feed→detail→download,
      401 refresh-replay, stale-render check, **live vote toggle**
- [ ] Left inert on purpose: Save Draft, search, **bookmark (vault mismatch — see API facts)**,
      ellipsis menus, announcements (no endpoint), create-post Video/Image mock blocks,
      createLinks (no link entity), dog/frieren avatar art, "Forgot Password?"
      — §2 (hide mocks vs keep) and §3 (avatar art) **deliberately deferred by the user
      (2026-09-05): "keep them in mind, we will go back to them later"**. Bookmark/vault
      decision also still open.
