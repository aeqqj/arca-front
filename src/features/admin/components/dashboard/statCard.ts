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
		<article
			class="dashboard-stat-card flex min-w-0 flex-col gap-5 rounded-xs border border-border bg-bg2 p-5 sm:p-6"
		>
			<div class="flex items-center justify-between gap-3">
				<p
					class="truncate text-body-sm font-medium tracking-wide text-fg4"
				>
					${label}
				</p>
				<div
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xs border border-border bg-bg3"
				>
					<i data-lucide="${icon}" class="h-4 w-4 text-fg3"></i>
				</div>
			</div>
			<p
				class="text-3xl font-semibold leading-none tracking-tight text-fg1"
				id="${id}"
			>
				—
			</p>
		</article>
	`;
}
