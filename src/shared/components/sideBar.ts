export function sideBar() {
	return `
        <aside class="h-full w-70 px-6 py-6 border-r border-foreground0/20 gap-4 flex flex-col items-start overflow-y-auto">
            <button class="text-4xl font-semibold text-foreground0 hover:text-foreground0/80 transition-colors">
                DCISM
            </button>
            <ol class="font-medium text-base text-foreground0/60 flex flex-col gap-3.5 text-start">
                <li>
                    <button class="hover:text-foreground0 transition-colors">
                        subject name
                    </button>
                </li>
                <li>
                    <button class="hover:text-foreground0 transition-colors">
                        subject name
                    </button>
                </li>
            </ol>
        </aside>
    `;
}
