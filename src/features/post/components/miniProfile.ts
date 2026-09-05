import avatar from "/dog.png";
import cover from "/frieren.png";
import type { User } from "../../../core/api/types.ts";
import { esc } from "../../../core/render.ts";

export function miniProfile(user: User | null) {
	if (!user) {
		return "";
	}
	const name =
		[user.first_name, user.last_name].filter(Boolean).join(" ") ||
		`user ${user.id}`;

	return `
        <div class="w-100 h-fit bg-bg2 flex flex-col border border-border rounded-xs">
            <div class="relative">
                <img src="${cover}" class="h-40 w-full object-cover object-top rounded-xs">
                <img src="${avatar}" class="h-20 rounded-xs absolute -bottom-10 left-6"> 
            </div>
            <div class="p-6 pb-6 pt-4">
                <h4 class="text-fg2 font-medium ml-24 mb-5 cursor-pointer hover:text-fg-link transition-colors">${esc(name)}</h4>
                <div class="flex flex-col gap-4 text-body-md">
                    ${
						user.course
							? `<p class="text-fg4">${esc(user.course)}</p>`
							: ""
					}
                    ${
						user.bio
							? `<p class="text-fg3 whitespace-pre-line">${esc(user.bio)}</p>`
							: `<p class="text-fg5">No bio yet.</p>`
					}
                </div>
            </div>
        </div>
    `;
}
