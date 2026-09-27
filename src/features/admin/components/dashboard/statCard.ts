type StatCardType = "users" | "posts" | "pending";

const STAT_CONFIG: Record<
	StatCardType,
	{ icon: string; label: string; id: string }
> = {
	users: { icon: "users", label: "Total Users", id: "stat-users" },
	posts: { icon: "file-text", label: "Total Posts", id: "stat-posts" },
	pending: { icon: "clock", label: "Pending Posts", id: "stat-pending" },
};

export function statCard(type: StatCardType): string {
	const { icon, label, id } = STAT_CONFIG[type];
	return /* HTML */ `
		<div
			class="flex-1 flex flex-col gap-4 p-5 bg-bg2 border border-border rounded-xs"
		>
			<div class="flex items-center gap-2">
				<i data-lucide="${icon}" class="w-4 h-4 text-fg4"></i>
				<p class="text-body-sm text-fg4">${label}</p>
			</div>
			<p class="text-heading-lg text-fg1 font-semibold" id="${id}">—</p>
		</div>
	`;
}
