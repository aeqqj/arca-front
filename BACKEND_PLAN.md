# Backend Work Plan — arca API

**For:** arca backend (`/home/charles/dev/arca`, Spring Boot; deployed at `https://arca-backend.dcism.org`)
**From:** frontend (`arca-front`) — 2026-09-05
**Basis:** read-only audit of backend source + live OpenAPI at `/v3/api-docs`. The frontend never modifies the backend; this document is the request list.

Legend:

- **BLOCKED-IN** — a frontend workaround exists today and is fragile; fixing this deletes the hack.
- **MOCK** — frontend UI is static/placeholder because no endpoint exists.
- All endpoint names assume the existing conventions: JWT bearer auth, Jackson **SNAKE_CASE** on the wire, `/api/v1` prefix.

---

## 🔴 P0 — Security (fix regardless of roadmap)

### 1. BCrypt password hash exposed on user reads — _BLOCKED-IN_

- `entity/User.java`: `password` has no `@JsonIgnore`; `UserController` returns the raw entity on `GET /api/v1/user` (`List<User>`) and `GET /api/v1/user/{userId}` (`User`).
- Impact: any authenticated user can harvest every user's password hash.
- Fix: return a sanitized `UserResponse` DTO (`id, first_name, last_name, email, course, department, bio, profile_picture, roles`) or `@JsonIgnore` the field.

### 2. Post/file author is client-supplied (impersonation)

- `dto/v1/post/PostRequest.userId` is taken from the request body → any signed-in user can create/act on posts as anyone.
- `FileController.uploadV1` takes `@RequestParam("user_id")` → files can be attributed to any user.
- Fix: derive the actor from `@AuthenticationPrincipal` — already done correctly in `VoteController.createOrUpdateVoteV1` — and ignore/reject body user ids.

---

## 🟠 P1 — Endpoints that delete frontend hacks

### 3. `GET /api/v1/posts` — site-wide approved feed

- No global list exists (only `/posts/{id}`, `/posts/user/{id}`, `/posts/department/{id}`, `/posts/pending*`, `/posts/history/{id}`).
- Frontend sources the home feed from `GET /posts/department/1` via a `FEED_DEPARTMENT_ID` constant — breaks if department row 1 disappears.
- Suggested query:
    ```sql
    SELECT * FROM posts WHERE status = 'APPROVED' AND is_latest_version = true
    ORDER BY updated_at DESC
    ```
    Pagination welcome but not required by the current UI.

### 4. Canonical post id — `PostCreateResponse` must expose the row PK — _BLOCKED-IN_

- `PostCreateResponse` = `{user_id, post_id, message}` (logical `post_id` only), but `FileServiceImplementation.uploadFileV1` and `POST /votes` (`VoteRequest.post_id`) look up `postRepository.findById(...)` — the **row PK**.
- The frontend therefore regex-scrapes the row id out of the human-readable `message` string (`/Id\s+(\d+)/`); any rewording silently breaks attachments and votes on just-created posts.
- Fix (pick ONE and document it):
    - **a)** add `@JsonProperty("id") Long id` (row PK) to `PostCreateResponse` — aligns with everything wired today (`PostResponse.id` is the row PK and frontend deep-links use it), **or**
    - **b)** migrate upload/vote/detail lookups to the logical `post_id` everywhere.

### 5. `GET /api/v1/user/me`

- `AuthResponse` carries only `email`; "who am I" is unresolvable from the token alone.
- Frontend workaround: fetch the **entire user list** on sign-in and match emails (`resolveAndCacheUser`) — O(all users), and an open user-list surface until item 1 lands.
- Fix: `GET /api/v1/user/me` from the principal, returning the sanitized `UserResponse`.

### 6. Vault: decide bookmarks or delete the facade — _MOCK (button inert)_

- `Vault.user_id` is `@Column(unique = true)` → exactly **one** saved post per user ever; a second add throws `RuntimeException("Failed to add post to Vault")`.
- `GET /api/v1/vaults/check` declares `@RequestBody` on a **GET** — physically uncallable from browser `fetch` (GET forbids bodies).
- If bookmarks are wanted: drop the unique on `user_id`, add composite unique `(user_id, post_id)`, change check to `GET /vaults/check/{postId}` (or query param).
- If not wanted: delete `/vaults/check` so no one burns a sprint wiring it.

### 7. `FileResponse.download_url` is wrong — _BLOCKED-IN_

- Built value: `/api/files/{id}/download`. Real route: `GET /api/v1/files/download/{id}` (auth-gated).
- Frontend ignores the field and constructs the path from `id`. Fix or drop the field.

---

## 🟡 P2 — "Departments are deprecated" vs the schema

### 8. `posts.department_id` is `nullable=false` while departments aren't a product concept

- `PostRequest` requires `departmentId` (`@NotNull`); `createPostV1` validates _"Subject does not belong to the department id ..."_.
- Chain today: post → department 1 → school (`school_id nullable=false`). Two magic rows the frontend hardcodes (`DEFAULT_DEPARTMENT_ID=1`, `DEFAULT_SCHOOL_ID=1`).
- Fix (choose one): make `department_id` nullable and skip the subject↔department validation when absent; **or** seed a permanent, protected "General" department + school and name it in the docs.

### 9. Subject-tagged queries — _BLOCKED-IN (client-side filter)_

- `post_tags` join table holds **subject ids**, but `mapToResponse` collapses them to `post_tag` = first subject's **name** (extra tags lost).
- Sidebar course filter currently fetches the whole cached feed and matches `post_tag === name` in the browser via `/?subject=<name>`.
- Fix: expose subject id(s) on `PostResponse` and add `GET /api/v1/posts/subject/{subjectId}`.

---

## 🟢 P3 — Hygiene & product gaps

### 10. Serve uploaded images — _MOCK (placeholder avatars)_

- Profile pictures land in `uploads/profile-pictures/`; `ArcaApplication` has no `ResourceHandler`, and `GET /files/download/{id}` demands an `Authorization` header that `<img src>` cannot send.
- Frontend does blob-URL fetches (works, wasteful at scale) and placeholder `dog.png` art in cards.
- Fix: public `GET /api/v1/files/image/{id}` (inline, non-auth for images is fine for avatars) or a static resource handler.

### 11. OpenAPI `servers.url` is stale

- Spec: `http://localhost:8080`. Reality: local `:20255`, deployed `https://arca-backend.dcism.org`. Generated clients target the wrong host.

### 12. `Post.IsLatestVersion` dual getters — serialization landmine

- `getLatestVersion()` **and** `getIsLatestVersion()` exist; Jackson emits `is_latest_version` today (what the frontend parses), but an IDE rename could silently flip the wire field. Normalize to `isLatestVersion()`.

### 13. Vote "no result" should be `204`, not `200 + empty body`

- `POST /votes` (toggle-clear) and `GET /votes/{id}/my-vote` (no vote) return `200` with empty bodies. Frontend already tolerates this; **do not change the toggle semantics** (same-click deletes, opposite-click flips — the frontend is built on exactly this).

### 14. Sanitize post content server-side

- `content` is raw Lexical HTML, stored as-is and rendered unescaped by the frontend (accepted XSS tradeoff today: own editor + admin approval). Structural fix: Jsoup `Safelist.relaxed()` (+`<img>`) at create/update.

### 15. MOCK features needing product decisions (no endpoint at all)

| Feature                                                        | Current frontend state                | What it needs                                                                        |
| -------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------ |
| Announcements rail                                             | static strings                        | `GET /api/v1/announcements` (public? admin-managed?)                                 |
| Header search                                                  | inert placeholder                     | `GET /api/v1/posts/search?q=`                                                        |
| Save Draft                                                     | no-op button                          | `DRAFT` status + list-own-drafts (note: `createPostV1` hard-sets `PENDING_APPROVAL`) |
| Link embeds (Video/Image cards, hardcoded YT id `4WfSohJ9K5o`) | mock markup                           | a link entity/endpoint, else frontend deletes the block                              |
| Forgot Password                                                | dead link                             | reset flow (email token)                                                             |
| Trending                                                       | derived client-side from feed upvotes | optional `GET /posts/trending` with time-decay                                       |

---

## Questions before implementation (answers change frontend work)

- **Q1 (item 4):** canonical id story — row PK added to create response (a), or logical `post_id` everywhere (b)?
- **Q2 (item 9):** is `post_tag` intended to be single or multi-subject? (Join table says multi; DTO says first-only.)
- **Q3 (item 8):** confirm departments/schools are dead specifically for the post domain.
- **Q4 (item 15):** which MOCK features are actually in-product? The frontend will delete ghosts otherwise.

## What the frontend deletes as each item lands

| Item | Frontend workaround removed (paths relative to `arca-front/src/`)                                             |
| ---- | ------------------------------------------------------------------------------------------------------------- |
| #3   | `getFeed()` department-1 hack + `FEED_DEPARTMENT_ID` (`core/api/endpoints.ts`, `core/config.ts`)              |
| #4   | `parseCreatedPostRowId()` message regex (`core/api/endpoints.ts`)                                             |
| #5   | `resolveAndCacheUser()` email match (`core/auth/session.ts`), `getUsers()` (`endpoints.ts`)                   |
| #6   | bookmark wiring on `fullPost.ts` (currently inert)                                                            |
| #7   | hand-built download paths (`post-page.ts`)                                                                    |
| #8   | `DEFAULT_DEPARTMENT_ID`/`DEFAULT_SCHOOL_ID` + hidden payload fields (`core/config.ts`, `create-post-page.ts`) |
| #9   | client-side `/?subject=` filter (`features/home/home-page.ts`)                                                |
| #10  | blob-URL fetch hack (`features/post/post-page.ts`) + placeholder avatar art                                   |
