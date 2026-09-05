# Backend Work Plan — arca API

**For:** arca backend (`/home/charles/dev/arca`, Spring Boot; deployed at `https://arca-backend.dcism.org`)
**From:** frontend (`arca-front`) — drafted 2026-09-05, **full second pass 2026-09-06**
**Basis:** read-only re-audit of backend source (all controllers/services/entities/config) +
live OpenAPI at `https://arca-backend.dcism.org/v3/api-docs`. The frontend never modifies the
backend; this document is the request list.
Items marked **(NEW)** were found or live-verified in the 2026-09-06 pass.

Legend:

- **BLOCKED-IN** — a frontend workaround exists today and is fragile; fixing this deletes the hack.
- **MOCK** — frontend UI is static/placeholder because no usable endpoint exists.
- All endpoint names assume the existing conventions: JWT bearer auth, Jackson **SNAKE_CASE**
  on the wire (re-confirmed: `spring.jackson.property-naming-strategy=SNAKE_CASE`), `/api/v1` prefix.

---

## 🔴 P0 — Security (fix regardless of roadmap)

### 1. BCrypt password hash exposed on user reads — _BLOCKED-IN_

- `entity/User.java` has no `@JsonIgnore` on `password`; `UserController` returns the raw entity
  on `GET /api/v1/user` (`List<User>`) and `GET /api/v1/user/{userId}`.
- **Live-verified 2026-09-06:** the deployed `/v3/api-docs` `User` schema contains
  `password`, `deleted`, `deleted_at` alongside every user's `email` — any ROLE_USER can harvest all hashes.
- Fix: sanitized `UserResponse` DTO (`id, first_name, last_name, email, course, department, bio,
profile_picture, roles`) or `@JsonIgnore` on `password` (+ hide `deleted*`). Also restrict the
  full `GET /user` list to ADMIN (see #8 for why the frontend calls it today).

### 2. Post/file author is client-supplied (impersonation)

- `dto/v1/post/PostRequest.userId` is taken from the body → any signed-in user can create posts as anyone.
- `FileController.uploadFile` takes `@RequestParam("user_id")` → files attributed to any user.
- Fix: derive the actor from `@AuthenticationPrincipal` — already done correctly in
  `VoteController`/`VaultController` — and ignore/reject body/param user ids.

### 3. (NEW) Privilege escalation + account takeover via `PUT /api/v1/user/{userId}`

- `UserController.updateUser` accepts the **raw `User` entity** (including `roles`, `password`,
  `email`) and only force-sets the path id. No ownership check.
  → any authenticated user can PUT `/user/<their own id>` with `{"roles":["ROLE_ADMIN"]}` and
  become admin (bypassing the whole `/admin` promote flow), or PUT **someone else's** id to
  overwrite their name/email/bio/password hash.
- Same hole: `PUT /user/{userId}/profile-picture` accepts any `userId` — anyone can replace
  anyone's avatar.
- Fix: `PATCH /api/v1/user/me` with a narrow DTO (`first_name, last_name, bio, course`) +
  principal-derived id; profile-picture likewise principal-derived. Role changes only via `/admin`.

### 4. (NEW) Authz holes around admin-flavoured endpoints (SecurityConfig only guards `/api/v1/admin/**`)

- `POST /api/v1/posts/{postId}/approve` — publish/reject authority for **every ROLE_USER**.
- `GET /api/v1/posts/pending`, `/posts/pending/department/{id}` — moderation queues visible to any user.
- Write endpoints open to any authenticated user: schools (`POST /schools`, `PUT /schools/edit/{id}`,
  `DELETE /schools/delete/{id}`), departments (`POST/PUT/DELETE /departments/{id}`), subject CRUD.
  `DELETE /api/v1/departments/1` **kills the entire home feed** (the frontend's feed source is
  department row 1 by design — see #7).
- Note: the rule `requestMatchers("/api/v1/department/**")` (singular) matches nothing — dead config.
- Fix: `@PreAuthorize("hasRole('ADMIN')")` (or path rules) on approve/pending and on school/
  department/subject writes; keep their GETs authenticated-user.

### 5. (NEW) `GlobalExceptionHandler` answers 400 for everything

- `@ExceptionHandler(Exception.class)` maps **every** controller-thrown exception — including
  "not found" and state conflicts — to HTTP 400 `{timestamp, error, message, status:400}`.
  Clients cannot distinguish 404/409; retry/logging logic degrades.
- Fix: map not-found → 404, illegal-state → 409, validation → 400; keep the `{message}` key the
  frontend already prefers.

---

## 🟠 P1 — Endpoints that delete frontend hacks or unblock UI

### 6. Canonical post id — `PostCreateResponse` must expose the row PK — _BLOCKED-IN_

- `PostCreateResponse` = `{user_id, post_id, message}` (logical `post_id` only, live-verified),
  but detail/upload/vote/vault lookups use `postRepository.findById(...)` — the **row PK**.
- The frontend regex-scrapes the row id out of the `message` string (`/Id\s+(\d+)/`); any
  rewording silently breaks attachments and votes on just-created posts.
- Fix (pick ONE and document): **a)** add `id` (row PK) to `PostCreateResponse` — aligns with
  `PostResponse.id` and everything wired today — **or b)** migrate lookups to logical `post_id`.

### 7. Feed source: keep `GET /posts/department/1` but protect the row; `GET /posts` still welcome

- **Decision update (2026-09-05, user):** department row 1 **is** DCISM — permanent by design.
  The old "make department_id nullable" option is dropped.
- Still wanted: `GET /api/v1/posts` (approved+latest, `ORDER BY updated_at DESC`, pagination ok)
  so the feed stops depending on a magic id; and #4's ADMIN guard so row 1 cannot be DELETEd.

### 8. `GET /api/v1/user/me`

- `AuthResponse` carries only `email`; "who am I" is unresolvable from the token.
- Workaround in place: fetch the **entire user list** on sign-in and match emails
  (`resolveAndCacheUser`) — O(all users), and it keeps the #1 exposure surface hot.
- Fix: `GET /user/me` from the principal, returning the sanitized `UserResponse`.

### 9. (EXPANDED) Vault is unusable as bookmarks — redesign or delete the facade — _MOCK (button inert)_

Source-verified 2026-09-06, four separate breakages:

- `Vault.user_id` is `unique=true` → **one saved post per user ever**; second add throws.
- `GET /vaults/user` serializes raw `Vault` entities with `@JsonIgnore` on `post`/`user` →
  response is just `{id, label}` — **no post content at all**, nothing for a bookmarks UI to render.
- `GET /vaults/{id}` → `getVaultEntryV1` is a stub returning `Optional.empty()` → always 404.
- `GET /vaults/check` declares `@RequestBody` on GET → uncallable from browser fetch.
- If bookmarks are wanted: composite unique `(user_id, post_id)`; return a `VaultResponse` with a
  post summary (`post id, title, author, created_at`); `GET /vaults/check/{postId}`;
  implement (or delete) `GET /vaults/{id}`. If not wanted: delete the controller.

### 10. `FileResponse.download_url` is wrong — _BLOCKED-IN_

- Built value `/api/files/{id}/download`; real route `GET /api/v1/files/download/{id}` (auth-gated).
- Frontend ignores the field and builds the path from `id`. Fix or drop.

### 11. (PROMOTED from P3, NEW urgency) Profile-picture bytes are unreachable over HTTP — _MOCK (avatar art)_

- `PUT /user/{id}/profile-picture` stores `uploads/profile-pictures/...` and returns the relative
  path, but **nothing serves `uploads/`**: no `ResourceHandler`, and `/files/download/{id}` only
  knows DB-registered post files (and demands an `Authorization` header an `<img>` can't send).
- So even after wiring, `user.profile_picture` is a dead string; the frontend stays on `dog.png`
  placeholders and blob-fetch hacks.
- Fix: public `GET /api/v1/user/{id}/profile-picture` (image bytes, inline) — or a static resource
  handler for `uploads/` — and allow `<img>`-safe access (avatars are public by nature).

---

## 🟡 P2 — Data-shape correctness

### 12. Subject-tagged queries — _BLOCKED-IN (client-side filter)_

- `post_tags` join table holds subject **ids**; `mapToResponse` collapses to `post_tag` = first
  subject's **name** (multi-tags lost; input id → output name round-trip is impossible).
- Fix: expose `subjects: [{id, name}]` on `PostResponse` and add `GET /api/v1/posts/subject/{subjectId}`.
- Verified non-issue while here: `GET /api/v1/subject/{subjectId}` **is** correctly registered
  (live spec) — the missing-slash mapping in `SubjectController` works after all.

### 13. `PostResponse` emits BOTH `is_latest_version` and `latest_version` (NEW — live-verified)

- The `IsLatestVersion` field with dual getters (`getLatestVersion()` + `getIsLatestVersion()`)
  shows up in the deployed OpenAPI schema as two properties. The frontend reads
  `is_latest_version`; the duplicate is dead wire weight and an IDE-rename landmine.
- Fix: one getter, one field; keep wire name `is_latest_version`.

### 14. (NEW) Votes are keyed to the version row → new versions silently reset vote counts

- `Vote.post_id` FK → row PK. `PUT /posts/{rowId}` creates a fresh version row; its vote counts
  start at 0 and old votes are orphaned on the superseded row.
- Decide: migrate/inherit votes on approve of version > 1, or key votes by logical `post_id`, or
  document "votes are per-version". The frontend shows counts from `PostResponse` and will keep
  looking like it lost data on every edit.

### 15. (NEW) `DELETE /api/v1/posts/{postId}` is a no-op stub — _MOCK (delete UI absent)_

- `PostServiceImplementation.deletePostV1` returns `""` with a `//softdelete to be implemented`
  marker; the endpoint answers 200 while doing nothing. The frontend cannot ship delete against it.
- Fix: implement soft delete (flag + hide from all read queries — cf. the `User` `@SQLDelete`
  pattern already in use) or remove the route so nobody wires a lie.

### 16. (NEW) File upload validation

- `FileController.uploadFile`: `contentType.equals(...)` NPEs → 400 via #5 when a part omits
  content-type; the MIME is client-declared (trust issue: pair extension/magic-byte check);
  null/empty `files` is caught after binding anyway. Minor but cheap.

### 17. Vote "no result" should be `204`, not `200 + empty body`

- `POST /votes` (toggle-clear) and `GET /votes/{id}/my-vote` (no vote). Frontend already tolerates
  both. **Do not change the toggle semantics** (same-click deletes, opposite-click flips — the
  frontend is built on exactly this).

---

## 🟢 P3 — Hygiene & product gaps

### 18. OpenAPI metadata

- `servers.url` is stale (`http://localhost:8080`; reality `:20255` / `https://arca-backend.dcism.org`).
- **(NEW) springdoc artifact, do not "fix":** generated schemas show implicit fields in camelCase
  while the wire is snake_case (only explicit `@JsonProperty`, e.g. `user_id`, renders snake).
  Wire casing is snake_case — frontend live-verified. Reconfigure springdoc or just note it.

### 19. Sanitize post content server-side

- `content` is raw Lexical HTML, stored as-is, rendered unescaped (accepted tradeoff: own editor +
  admin approval — but see #4: approval is currently open to everyone). Structural fix: Jsoup
  `Safelist.relaxed()` (+`<img>`) at create/update.

### 20. Refresh-token hygiene (minor)

- `/auth/refresh` returns the **same** refresh token (no rotation); expired refresh rows are only
  deleted lazily on use; `logout` deletes all of a user's tokens (fine). Optional: rotate on
  refresh + scheduled purge.

### 21. MOCK features needing product decisions (no endpoint at all)

| Feature                                                         | Current frontend state                   | What it needs                                                                  |
| --------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| Announcements rail (×2 duplicate components)                    | static strings                           | `GET /api/v1/announcements` (admin-managed? public?)                           |
| Header search                                                   | inert placeholder                        | `GET /api/v1/posts/search?q=`                                                  |
| Save Draft                                                      | no-op button                             | `DRAFT` status + list-own-drafts (`createPostV1` hard-sets `PENDING_APPROVAL`) |
| Link embeds (Video/Image blocks, hardcoded YT id `4WfSohJ9K5o`) | mock markup on create page               | a link entity/endpoint, else frontend deletes the block                        |
| Forgot Password                                                 | dead link                                | reset flow (email token)                                                       |
| Trending                                                        | derived client-side from feed upvotes    | optional `GET /posts/trending` with time-decay                                 |
| Edit Profile / profile cover (`frieren.png` banner)             | inert button; no `cover` field on `User` | DTO from #3; `cover_image` field + upload if a banner is actually wanted       |

---

## Questions before implementation (answers change frontend work)

- **Q1 (#6):** canonical id story — row PK in create/update responses (a), or logical `post_id`
  everywhere (b)? Also: `PUT /posts/{rowId}` should return the **new version's row PK** the same way.
- **Q2 (#12):** is `post_tag` intended to be single or multi-subject? (Join table says multi; DTO says first-only.)
- **Q3 (#9):** are bookmarks actually in-product? If yes, vault redesign lands as specified; if no, frontend deletes the button and `vaults` can be pruned.
- **Q4 (#21):** which MOCK features are actually in-product? The frontend will delete ghosts otherwise.
- **Q5 (#14):** per-version vote counts acceptable, or inherit/migrate?

## What the frontend deletes as each item lands

| Item | Frontend workaround removed (paths relative to `arca-front/src/`)                                                            |
| ---- | ---------------------------------------------------------------------------------------------------------------------------- |
| #1   | nothing directly (but gates #8's list-all fallback removal)                                                                  |
| #6   | `parseCreatedPostRowId()` message regex (`core/api/endpoints.ts`)                                                            |
| #7   | `FEED_DEPARTMENT_ID` hack (`core/api/endpoints.ts`, `core/config.ts`)                                                        |
| #8   | `resolveAndCacheUser()` email match (`core/auth/session.ts`), `getUsers()` (`endpoints.ts`)                                  |
| #9   | bookmark wiring decision (`features/post/components/fullPost.ts`, currently inert)                                           |
| #10  | hand-built download paths (`features/post/post-page.ts`)                                                                     |
| #11  | blob-URL avatar hack + `dog.png` placeholders (`shared/components/{post,header}.ts`, `features/post/components/fullPost.ts`) |
| #12  | client-side `/?subject=` filter (`features/home/home-page.ts`)                                                               |
