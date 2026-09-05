import type { PostResponse } from "../../core/api/types.ts";
import { esc } from "../../core/render.ts";

// No trending endpoint exists; "trending" = most upvoted posts in the feed.
export function trending(posts: PostResponse[]) {
	const top = [...posts]
		.sort((a, b) => (b.upvote_count ?? 0) - (a.upvote_count ?? 0))
		.slice(0, 4);

	return `
        <div class="w-100 h-fit px-6 gap-4 flex flex-col">
            <div class="flex gap-2 items-center">
                <h2 class="text-fg2 text-title-md font-medium">Trending</h2>
            </div>
            <div class="flex flex-col gap-6 text-body-md text-fg3">
                ${
					top.length > 0
						? top
								.map(
									(p) =>
										`<a href="/post?id=${p.id}" class="link">${esc(p.title)}</a>`,
								)
								.join("")
						: `<p class="text-fg5">Nothing trending yet.</p>`
				}
            </div>
        </div>
    `;
}
