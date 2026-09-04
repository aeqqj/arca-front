import { initIcons } from "../../shared/icons.ts";
import { header, bindHeader } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "./../../shared/components/post.ts";
import { announcements } from "./components/announcements.ts";
import { profile } from "./components/profile.ts";
import { trending } from "./components/trending.ts";
import { getUserPosts } from "../../core/api/endpoints.ts";
import type { PostResponse } from "../../core/api/types.ts";
import { getCurrentUser } from "../../core/auth/session.ts";
import {
	esc,
	nextRenderToken,
	paint,
	loadingShell,
} from "../../core/render.ts";

export async function ProfilePage() {
	const token = nextRenderToken();
	paint(token, loadingShell());

	const user = getCurrentUser();

	let posts: PostResponse[] = [];
	let error = "";
	if (user) {
		try {
			posts = await getUserPosts(user.id);
		} catch (e) {
			error = e instanceof Error ? e.message : "Failed to load posts";
		}
	}

	const recent = error
		? `<div class="w-200 border border-bad/40 bg-bad/10 text-fg2 p-4 rounded-xs text-body-md">${esc(error)}</div>`
		: posts.length > 0
			? posts.map((p) => post(p)).join("")
			: `<div class="text-fg4 text-body-md">No posts yet.</div>`;

	const painted = paint(
		token,
		`
        <div class="h-full flex flex-col">
            ${header(user)}
            <div class="w-full flex items-start flex-1 min-h-0">
                <aside class="h-full overflow-y-auto shrink-0">
                    ${sideBar()}
                </aside>
                <div class="text-fg1 w-full h-full px-12 py-8 flex gap-10 justify-center overflow-y-auto">
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col">
                            ${user ? profile(user, posts) : errorPanelNoUser()}
                            <hr class="text-separator mt-1">
                        </div>
                        <div class="flex flex-col gap-6">
                            <button class="flex items-center gap-1">
                                <p>Recent</p>
                                <i data-lucide="chevron-down" class="w-4 h-4 text-fg3"></i>
                            </button>
                            <div class="flex flex-col gap-6">
                                ${recent}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8 self-start sticky top-0">
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

function errorPanelNoUser(): string {
	return `<div class="text-fg4">No session user found. Sign in again.</div>`;
}
