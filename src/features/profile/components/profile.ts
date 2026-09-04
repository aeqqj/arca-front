import avatar from "/dog.png";
import cover from "/frieren.png";
import type { PostResponse, User } from "../../../core/api/types.ts";
import { displayName } from "../../../core/auth/session.ts";
import { esc } from "../../../core/render.ts";

export function profile(user: User, posts: PostResponse[]) {
	const upvotesReceived = posts.reduce(
		(sum, p) => sum + (p.upvote_count ?? 0),
		0,
	);
	const headline = user.course ? `${user.course}` : "";

	return `
    <div class="w-200"> 
        <div class="relative">
            <img src="${cover}" class="h-74 w-full object-cover object-top rounded-xs">
            <img src="${avatar}" class="h-40 rounded-xs absolute -bottom-18 left-4"> 
        </div>
        <div class="p-4 flex flex-col gap-2">
            <div class="h-18 w-full flex justify-end">
                <button class="h-fit py-2 px-4 border bg-bg2 border-border text-body-md">Edit Profile</button>
            </div>
            <div class="flex flex-col"> 
                <p class="font-medium text-title-lg">${esc(displayName(user))}</p>
                ${headline ? `<p class="font-medium text-body-lg text-fg5">${esc(headline)}</p>` : ""}
            </div>
            <div class="flex flex-col gap-3">
                ${
					user.bio
						? `<p class="text-fg3 whitespace-pre-line">${esc(user.bio)}</p>`
						: ""
				}
                <div class="flex gap-4 text-fg5 text-body-md">
                    <p>${posts.length} post${posts.length === 1 ? "" : "s"}</p>
                    <p>${upvotesReceived} upvote${upvotesReceived === 1 ? "" : "s"} received</p>
                </div>
            </div>
        </div>
    </div>
    `;
}
