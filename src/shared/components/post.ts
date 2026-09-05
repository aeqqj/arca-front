import avatarPlaceholder from "/dog.png";
import type { PostResponse, VoteType } from "../../core/api/types.ts";
import { esc, htmlToText, timeAgo } from "../../core/render.ts";

export function post(p: PostResponse, myVote?: VoteType | null) {
	const author =
		[p.first_name, p.last_name].filter(Boolean).join(" ") ||
		`user ${p.user_id}`;
	const preview = htmlToText(p.content);
	const tag = p.post_tag || p.department_name;
	const upvotes = p.upvote_count ?? 0;
	const fileCount = p.files?.length ?? 0;

	return `
        <a href="/post?id=${p.id}" class="w-200 h-fit bg-bg2 border border-border flex flex-col p-6 gap-4 rounded-xs hover:bg-bg3/60 transition-colors cursor-pointer shadow-md">
            <div class="flex gap-4">
                <img src="${avatarPlaceholder}" class="w-12 h-12 rounded-xs mt-1" />
                <div class="w-full flex flex-col">
                    <div class="w-full flex justify-between items-center">
                        <div class="flex text-label-md items-center">
                            <span class="text-fg4">${esc(author)}</span>
                            <p class="text-fg5">&nbsp; • ${esc(timeAgo(p.updated_at ?? p.created_at))}</p>
                        </div>
                        <div class="p-1 hover:bg-bg5/60 transition-colors rounded-xs">
                            <i data-lucide="ellipsis" class="w-4 h-4 text-fg3"></i>
                        </div>
                    </div>
                    <p class="text-fg2 text-title-sm font-medium">
                        ${esc(p.title)}
                    </p>
                </div>
            </div>
            ${preview ? `<p class="text-fg3 text-body-md">${esc(preview)}</p>` : ""}
            ${
				fileCount > 0
					? `<div class="flex items-center gap-2 text-fg5 text-sm">
                                    <i data-lucide="paperclip" class="w-4 h-4"></i>
                                    <p>${fileCount} attachment${fileCount === 1 ? "" : "s"}</p>
                                </div>`
					: ""
			}
            <div class="flex items-center justify-between">
                <div class="flex gap-4">
                    <div class="w-fit h-fit flex gap-6 bg-bg3 text-fg3 px-2.5 py-2 border border-border rounded-xs items-center" data-post-id="${p.id}">
                        <span data-vote="UPVOTE" class="cursor-pointer hover:text-good transition-colors ${myVote === "UPVOTE" ? "text-good" : ""}"><i data-lucide="arrow-up" class="w-5 h-5"></i></span> 
                        <p data-count="up">${upvotes}</p>
                        <span data-vote="DOWNVOTE" class="cursor-pointer hover:text-bad transition-colors ${myVote === "DOWNVOTE" ? "text-bad" : ""}"><i data-lucide="arrow-down" class="w-5 h-5"></i></span> 
                        <p data-count="down">${p.downvote_count ?? 0}</p>
                    </div>
                </div>
                ${
					tag
						? `<div class="w-fit h-fit py-1 px-4 bg-red-100 text-bg2 rounded-xs text-sm">${esc(tag)}</div>`
						: ""
				}
            </div>
        </a>
    `;
}
