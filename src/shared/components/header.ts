import avatarPlaceholder from "/public/dog.png";

export function header() {
	return `
        <header class="h-16 px-6 flex items-center justify-between border-b border-border">
            <h1 class="text-2xl font-bold text-fg1">arca</h1>
            <div class="h-12 w-2xl mb-0.5 px-5 py-3.5 flex items-center gap-4 bg-bg5 border-border rounded-xs">
                <i data-lucide="search" class="text-fg3"></i> 
                <input class="w-full bg-transparent outline-none text-sm placeholder:opacity-50" />
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
