import avatarPlaceholder from "/dog.png";
import type { PostResponse } from "../../../core/api/types.ts";
import { esc, timeAgo } from "../../../core/render.ts";
import { attachment } from "../../../shared/components/attachment.ts";
import type { VoteType } from "../../../core/api/types.ts";

export function fullPost(p: PostResponse, myVote?: VoteType | null) {
	const author =
		[p.first_name, p.last_name].filter(Boolean).join(" ") ||
		`user ${p.user_id}`;
	const tag = p.post_tag || p.department_name;
	const files = p.files ?? [];

	// Note: p.content is stored Lexical HTML and is rendered as authored
	// (accepted tradeoff — content comes from our own editor + admin approval).

	return `
        <div class="w-fit flex gap-5 items-start">
            <div class="flex flex-col gap-4 sticky top-0 self-start">
                <a href="/" class="w-fit h-fit p-2.5 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-fg3"></i> 
                </a>
                <div class="w-fit h-fit flex flex-col gap-6 bg-bg3 text-fg3 mt-6 px-2.5 py-2 border border-border rounded-xs items-center" data-post-id="${p.id}">
                    <span data-vote="UPVOTE" class="cursor-pointer hover:text-good transition-colors ${myVote === "UPVOTE" ? "text-good" : ""}"><i data-lucide="arrow-up" class="w-5 h-5"></i></span> 
                    <p data-count="up">${p.upvote_count ?? 0}</p>
                    <span data-vote="DOWNVOTE" class="cursor-pointer hover:text-bad transition-colors ${myVote === "DOWNVOTE" ? "text-bad" : ""}"><i data-lucide="arrow-down" class="w-5 h-5"></i></span> 
                    <p data-count="down">${p.downvote_count ?? 0}</p>
                </div>
                <button class="w-fit h-fit p-3 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                    <i data-lucide="square-arrow-out-up-right" class="w-4 h-4 text-fg3"></i> 
                </button>
                <button class="w-fit h-fit p-2.5 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                    <i data-lucide="bookmark" class="w-5 h-5 text-fg3"></i> 
                </button>
            </div>
            <div class="w-4xl flex flex-col gap-4">
                <div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 gap-4 rounded-xs hover:bg-bg3/60 transition-colors shadow-md">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4">
                            <img src="${avatarPlaceholder}" class="w-12 h-12 rounded-xs mt-1" />
                            <div class="w-full flex justify-between items-start">
                                <div class="flex flex-col gap-1">
                                    <span class="text-body-lg text-fg3">${esc(author)}</span>
                                    <p class="text-fg4 text-body-md">${esc(timeAgo(p.updated_at ?? p.created_at))}</p>
                                </div>
                                <div class="p-1 hover:bg-bg5/60 transition-colors rounded-xs">
                                    <i data-lucide="ellipsis" class="w-4 h-4 text-fg3"></i>
                                </div>
                            </div>
                        </div>
                        <p class="text-fg2 text-title-lg font-medium">
                            ${esc(p.title)}
                        </p>
                    </div>
                    ${
						tag
							? `<div class="w-fit h-fit py-0.5 px-3 bg-red-100 text-bg2 rounded-xs text-body-md">${esc(tag)}</div>`
							: ""
					}
					<div class="post-content text-fg3 text-body-lg mt-2">${p.content ?? ""}</div>
                </div>
                ${
					files.length > 0
						? `<div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 rounded-xs hover:bg-bg3/60 transition-colors gap-4">
                                    <h4 class="text-fg3 font-medium">Attachments</h4>
                                    <div class="w-full flex flex-col gap-4">
                                        ${files.map((f) => attachment(f)).join("")}
                                    </div>
                                </div>`
						: ""
				}
            </div>
        </div>
    `;
}
