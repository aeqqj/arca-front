import avatarPlaceholder from "/dog.png";

export function adminHeader(title: string = "Dashboard") {
	return `
        <header class="h-16 w-full px-8 flex items-center justify-between border-b border-border bg-bg1 sticky top-0 z-50 shrink-0">
            <p class="text-fg3 text-body-lg">Admin / ${title}</p>
            <button>
                <img src="${avatarPlaceholder}" class="w-8 h-8 rounded-xs" />
            </button>
        </header>
    `;
}
