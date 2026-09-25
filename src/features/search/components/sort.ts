type SortValue = string;

const dropdownConfig: Record<string, (value: SortValue) => void> = {
	relevance: (value) => console.log("relevance:", value),
	date: (value) => console.log("date:", value),
};

document.addEventListener("click", (e) => {
	const target = e.target as HTMLElement;

	const trigger = target.closest("[id$='-trigger']");
	if (trigger) {
		const prefix = trigger.id.replace("-trigger", "");
		const menu = document.getElementById(`${prefix}-menu`);

		document.querySelectorAll("[id$='-menu']").forEach((m) => {
			if (m !== menu) {
				m.classList.add("hidden");
				m.classList.remove("flex");
			}
		});

		menu?.classList.toggle("hidden");
		menu?.classList.toggle("flex");
		return;
	}

	const option = target.closest<HTMLButtonElement>("button[data-value]");
	if (option) {
		const menu = option.closest("[id$='-menu']") as HTMLElement | null;
		if (!menu) return;
		const prefix = menu.id.replace("-menu", "");
		const label = document.getElementById(`${prefix}-label`);
		if (label) label.textContent = option.textContent;
		menu.classList.add("hidden");
		menu.classList.remove("flex");
		dropdownConfig[prefix]?.(option.dataset.value ?? "");
		return;
	}

	document.querySelectorAll("[id$='-menu']").forEach((menu) => {
		menu.classList.add("hidden");
		menu.classList.remove("flex");
	});
});

export function relevanceSort(): string {
	return /* HTML */ `
		<div class="relative" id="relevance-dropdown">
			<button
				class="text-fg3 text-body-md font-medium flex items-center gap-2 min-w-28 hover:bg-bg3 px-3 py-1 rounded-xs transition-colors"
				id="relevance-trigger"
			>
				<span id="relevance-label">Relevant</span>
				<i data-lucide="chevron-down" class="w-4 h-4 text-fg3"></i>
			</button>
			<div
				class="absolute hidden flex-col bg-bg2 text-fg3 text-body-md border border-border rounded-xs mt-2 z-10 min-w-28"
				id="relevance-menu"
			>
				<button class="select-button" data-value="relevant">
					Relevant
				</button>
				<button class="select-button" data-value="trending">
					Trending
				</button>
				<button class="select-button" data-value="top">Top</button>
			</div>
		</div>
	`;
}

export function dateSort(): string {
	return /* HTML */ `
		<div class="relative" id="date-dropdown">
			<button
				class="text-fg3 text-body-md font-medium flex items-center gap-2 min-w-28 hover:bg-bg3 px-3 py-1 rounded-xs transition-colors"
				id="date-trigger"
			>
				<span id="date-label">All time</span>
				<i data-lucide="chevron-down" class="w-4 h-4 text-fg3"></i>
			</button>
			<div
				class="absolute hidden flex-col bg-bg2 text-fg3 text-body-md border border-border rounded-xs mt-2 z-10 min-w-28"
				id="date-menu"
			>
				<button class="select-button" data-value="all">All time</button>
				<button class="select-button" data-value="newest">
					Newest
				</button>
				<button class="select-button" data-value="oldest">
					Oldest
				</button>
			</div>
		</div>
	`;
}
