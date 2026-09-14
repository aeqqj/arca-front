import avatarPlaceholder from "/dog.png";

export function adminHeader() {
	return `
        <header class="h-16 w-full px-6 py-1 flex items-center justify-between border-b border-border bg-bg1 sticky top-0 z-50">
            <div></div>
            <button> 
                <img src="${avatarPlaceholder}" class="w-8 h-8 rounded-xs" />
            </button>
        </header>
    `;
}
