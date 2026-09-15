export function adminSideBar() {
	const currentPath = window.location.pathname;

	const navItems = [
		{ href: "/admin", icon: "layout-grid", label: "Dashboard" },
		{ href: "/admin/users", icon: "users", label: "Users" },
		{ href: "/admin/posts", icon: "square-pen", label: "Posts" },
		{ href: "/admin/courses", icon: "book-open-text", label: "Courses" },
	];

	return `
        <aside class="h-screen w-70 border-r border-border text-fg5 bg-bg1 flex flex-col shrink-0">
            <div class="h-16 w-full flex px-6 items-center border-b border-border">
                <a href="/" class="font-bold text-fg1 cursor-pointer hover:text-fg2 transition-colors">arca</a>
            </div>
            <div class="flex flex-col px-4 py-6 gap-1">
                ${navItems.map(item => {
                    const isActive = currentPath === item.href;
                    return `
                        <a href="${item.href}" class="flex gap-3 items-center px-3 py-2.5 rounded-xs transition-colors ${isActive ? 'bg-bg3 text-fg1' : 'text-fg4 hover:bg-bg3/50 hover:text-fg2'}">
                            <i data-lucide="${item.icon}" class="w-4.5 h-4.5 ${isActive ? 'text-fg2' : 'text-fg5'}"></i>
                            <span class="text-body-md">${item.label}</span>
                        </a>
                    `;
                }).join('')}
            </div>
        </aside>
    `;
}
