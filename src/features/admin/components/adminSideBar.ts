export function adminSideBar() {
	return `
        <aside class="h-screen w-70  border-r border-border text-fg5 bg-bg1 flex flex-col">
            <div class="h-16 w-full flex px-6 items-center border-b border-border">
                <h1 href="/" class="font-bold text-fg1 cursor-pointer">arca</h1>
            </div>
            <div class="flex flex-col px-6 py-6 gap-6">
                <div class="flex gap-2 items-center">
                    <i data-lucide="layout-grid" class="w-4.5 h-4.5 text-fg3"></i>
                    <p class="text-base font-normal flex flex-col gap-5 text-fg3">Dashboard</p>
                </div>
                <div class="flex flex-col gap-4">
                    <p class="text-body-md font-medium">Contents</p>
                    <ol class="text-base font-normal flex flex-col gap-6 text-fg3">
                        <li class="flex gap-2 items-center">
                            <i data-lucide="users" class="w-4.5 h-4.5 text-fg3"></i>
                            <p>Users</p>
                        </li>
                        <li class="flex gap-2 items-center">
                            <i data-lucide="square-pen" class="w-4.5 h-4.5 text-fg3"></i>
                            <p>Post</p>
                        </li>
                        <li class="flex gap-2 items-center">
                            <i data-lucide="book-open-text" class="w-4.5 h-4.5 text-fg3"></i>
                            <p>Courses</p>
                        </li>
                    </ol>
                </div>
            </div>
        </aside>
    `;
}
