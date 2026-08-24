export function sideBar() {
	return `
        <aside class="h-full w-70 px-6 py-6 border-r border-border text-fg5 flex flex-col items-start overflow-y-auto">
            <ol class="text-base flex flex-col gap-4 text-start">
                <li>
                    <button class="hover:text-fg4 transition-colors">
                        Programming 1
                    </button>
                </li>
                <li>
                    <button class="hover:text-fg4 transition-colors">
                        Programming 2
                    </button>
                </li>
            </ol>
        </aside>
    `;
}
