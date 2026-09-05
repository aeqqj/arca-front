import type { PostResponse, User } from "../../../core/api/types.ts";
import { esc } from "../../../core/render.ts";

// "More from" — the author's other approved posts (current one excluded).
export function profileExtra(
	user: User | null,
	posts: PostResponse[],
	excludePostId?: number,
) {
	const others = posts.filter((p) => p.id !== excludePostId).slice(0, 3);
	const name =
		user && [user.first_name, user.last_name].filter(Boolean).join(" ")
			? [user.first_name, user.last_name].filter(Boolean).join(" ")
			: user
				? `user ${user.id}`
				: "";

	return `
        <div class="w-100 h-fit bg-bg2 border border-border p-6 gap-4 flex flex-col rounded-xs">
            <div class="flex gap-2 items-center">
                <h2 class="text-fg2 text-title-md font-medium">More from <span class="text-fg-link">${esc(name)}</span></h2>
            </div>
            <div class="flex flex-col gap-6 text-body-md text-fg3">
                ${
					others.length > 0
						? others
								.map(
									(p) =>
										`<a href="/post?id=${p.id}" class="link">${esc(p.title)}</a>`,
								)
								.join("")
						: `<p class="text-fg5">No other posts yet.</p>`
				}
            </div>
        </div>
    `;
}
