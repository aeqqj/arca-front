import { initIcons } from "../../shared/icons.ts";
import { header, bindHeader } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "../../shared/components/post.ts";
import { trending } from "../../shared/components/trending.ts";
import { announcements } from "./components/announcements.ts";
import { ensureVotesBound } from "../../shared/handlers/voteHandler.ts";
import { getRememberedVote } from "../../core/votes.ts";
import { getFeed, getSubjects } from "../../core/api/endpoints.ts";
import type { PostResponse, SubjectResponse } from "../../core/api/types.ts";
import { getCurrentUser } from "../../core/auth/session.ts";
import {
	esc,
	nextRenderToken,
	paint,
	loadingShell,
} from "../../core/render.ts";

export async function HomePage() {
	const token = nextRenderToken();
	paint(token, loadingShell());

	// Sidebar subjects are cached and shared with the create-post page.
	let posts: PostResponse[] = [];
	let subjects: SubjectResponse[] = [];
	let error = "";
	try {
		posts = await getFeed();
		subjects = await getSubjects();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load posts";
	}

	// Sidebar course links filter the feed client-side via /?subject=<name>
	// (PostResponse only carries the tag name, and no by-subject endpoint
	// exists on the frozen backend).
	const subject = new URLSearchParams(window.location.search).get("subject");
	const visible = subject
		? posts.filter((p) => (p.post_tag ?? "") === subject)
		: posts;

	const feed = error
		? `<div class="w-200 border border-bad/40 bg-bad/10 text-fg2 p-4 rounded-xs text-body-md">${esc(error)}</div>`
		: visible.length > 0
			? visible.map((p) => post(p, getRememberedVote(p.id))).join("")
			: `<div class="w-200 border border-border bg-bg2 p-8 rounded-xs text-center text-fg4">${subject ? `No approved posts tagged “${esc(subject)}” yet.` : "No posts yet."}</div>`;

	const painted = paint(
		token,
		`
        <div class="h-full flex flex-col">
            ${header(getCurrentUser())}
            <div class="w-full flex items-start flex-1 min-h-0">
                <aside class="h-full overflow-y-auto shrink-0">
                    ${sideBar(subjects, subject ?? "")}
                </aside>
                <div class="w-full h-full px-12 py-8 flex gap-10 justify-center overflow-y-auto">
                    <div class="flex flex-col gap-6">
                        ${subject ? `<div class="w-200 flex items-center gap-3 text-body-md text-fg4"><span>Filtered by <span class="text-fg2 font-medium">${esc(subject)}</span></span><a href="/" class="underline hover:text-fg2 transition-colors">clear</a></div>` : ""}
                        ${feed}
                    </div>
                    <div class="flex flex-col gap-8 sticky top-0 self-start">
                        ${announcements()}
                        ${trending(posts)}
                    </div>
                </div>
            </div>
        </div>
    `,
	);
	if (!painted) {
		return;
	}
	initIcons();
	bindHeader();
	ensureVotesBound();
}
