import { initIcons } from "../../shared/icons.ts";
import { header, bindHeader } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "../../shared/components/post.ts";
import { announcements } from "./components/announcements.ts";
import { trending } from "./components/trending.ts";
import { getFeed } from "../../core/api/endpoints.ts";
import type { PostResponse } from "../../core/api/types.ts";
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

	let posts: PostResponse[] = [];
	let error = "";
	try {
		posts = await getFeed();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load posts";
	}

	const feed = error
		? `<div class="w-200 border border-bad/40 bg-bad/10 text-fg2 p-4 rounded-xs text-body-md">${esc(error)}</div>`
		: posts.length > 0
			? posts.map((p) => post(p)).join("")
			: `<div class="w-200 border border-border bg-bg2 p-8 rounded-xs text-center text-fg4">No posts yet.</div>`;

	const painted = paint(
		token,
		`
        <div class="h-full flex flex-col">
            ${header(getCurrentUser())}
            <div class="w-full flex items-start flex-1 min-h-0">
                <aside class="h-full overflow-y-auto shrink-0">
                    ${sideBar()}
                </aside>
                <div class="w-full h-full px-12 py-8 flex gap-10 justify-center overflow-y-auto">
                    <div class="flex flex-col gap-6">
                        ${feed}
                    </div>
                    <div class="flex flex-col gap-8 sticky top-0 self-start">
                        ${announcements()}
                        ${trending()}
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
}
