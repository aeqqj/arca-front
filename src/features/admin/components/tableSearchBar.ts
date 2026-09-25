export function tableSearchBar() {
	return /* HTML */ `
		<div class="relative w-full">
			<i
				data-lucide="search"
				class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg3"
			></i>
			<input
				type="text"
				placeholder="Search..."
				class="w-full pl-9 pr-2 py-2 rounded-xs border border-border bg-bg1 text-sm outline-none text-fg3 focus:border-fg4/40 placeholder:text-fg-placeholder hover:bg-bg2/90 transition-colors"
			/>
		</div>
	`;
}
