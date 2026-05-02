export function header() {
	return `
        <header class="h-16 px-6 flex items-center justify-between text-foreground0 border-b border-foreground0/20">
            <h5 class="font-semibold">arca - hallo</h5>
            <div class="h-12 w-3xl mb-0.5 px-6 py-3 flex items-center gap-4 bg-background1 rounded-4xl">
                <i class="ri-search-line text-2xl"></i>
                <input class="w-full bg-transparent outline-none text-sm placeholder:opacity-50" />
            </div>
            <div class="flex gap-6">
                <button class="px-3 py-0.5 gap-2 flex border-2 rounded-2xl justify-between items-center">
                    <i class="ri-shield-line text-2xl"></i>
                    <p class="font-medium">Admin</p>
                </button>
                <button class="px-3 py-0.5 gap-2 flex border-2 rounded-2xl justify-between items-center">
                    <i class="ri-add-circle-line text-2xl"></i>
                    <p class="font-medium">Create</p>
                </button>
                <button>
                    <i class="ri-safe-line text-3xl"></i> 
                </button>
                <button> 
                    <i class="ri-user-line text-3xl"></i>
                </button>
            </div>
        </header>
    `;
}
