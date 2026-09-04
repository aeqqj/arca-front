import avatarPlaceholder from "/dog.png";
import type { User } from "../../core/api/types.ts";
import { displayName, signOut } from "../../core/auth/session.ts";
import { navigate } from "../../core/router/router.ts";

export function header(user: User | null = null): string {
	const isAdmin = user?.roles?.includes("ROLE_ADMIN") ?? false;
	return `
        <header class="h-16 px-6 py-1 flex items-center justify-between border-b border-border bg-bg1 sticky top-0 z-50">
            <a href="/" class="text-2xl font-bold text-fg1 cursor-pointer">arca</a>
            <div class="w-2xl px-3 py-2.5 flex items-center gap-4 bg-bg4 border-border rounded-xs hover:bg-bg5 transition-colors">
                <i data-lucide="search" class="w-5 h-5 text-fg4"></i> 
                <input class="w-full outline-none text-sm text-fg2" placeholder="Search.." />
            </div>
            <div class="flex text-fg2 gap-4 items-center">
                ${
					isAdmin
						? `<button class="gap-2 flex rounded-xs justify-between items-center hover:bg-bg5/60 py-2 px-2.5 transition-colors">
                                    <i data-lucide="shield" class="w-4 h-4 text-fg3"></i>
                                    <p class="font-medium text-sm">Admin</p>
                                </button>`
						: ""
				}
                <a href="/create-post" class="gap-2 flex rounded-xs justify-between items-center hover:bg-bg5/60 py-2 px-2.5 transition-colors">
                    <i data-lucide="plus" class="w-4 h-4 text-fg3"></i>
                    <p class="font-medium text-sm">Create</p>
                </a>
                <button id="sign-out" title="Sign out" class="gap-2 flex rounded-xs items-center hover:bg-bg5/60 py-2 px-2.5 transition-colors">
                    <p class="font-medium text-sm text-fg3">${displayName(user)}</p>
                    <img src="${avatarPlaceholder}" class="w-8 h-8 rounded-xs" />
                </button>
            </div>
        </header>
    `;
}

export function bindHeader(): void {
	document
		.querySelector<HTMLButtonElement>("#sign-out")
		?.addEventListener("click", () => {
			void signOut().then(() => navigate("/auth/signin"));
		});
}
