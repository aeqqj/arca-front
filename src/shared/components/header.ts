import avatarPlaceholder from "/dog.png";

export function header() {
	return `
        <header class="h-16 px-6 py-1 flex items-center justify-between border-b border-border bg-bg1 sticky top-0 z-50">
            <h1 class="text-2xl font-bold text-fg1">arca</h1>
            <div class="w-2xl px-3 py-2.5 flex items-center gap-4 bg-bg5 border-border rounded-xs">
                <i data-lucide="search" class="w-5 h-5 text-fg4"></i> 
                <input class="w-full bg-transparent outline-none text-sm placeholder:opacity-50" placeholder="Search.." />
            </div>
            <div class="flex text-fg2 gap-4">
                <button class="gap-2 flex rounded-2xl justify-between items-center">
                    <i data-lucide="shield" class="w-4 h-4 text-fg3"></i>
                    <p class="font-medium text-sm">Admin</p>
                </button>
                <button class="gap-2 flex rounded-2xl justify-between items-center">
                    <i data-lucide="plus" class="w-4 h-4 text-fg3"></i>
                    <p class="font-medium text-sm">Create</p>
                </button>
                <button> 
                    <img src="${avatarPlaceholder}" class="w-8 h-8 rounded-xs" />
                </button>
            </div>
        </header>
    `;
}
