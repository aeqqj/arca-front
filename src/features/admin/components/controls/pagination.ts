export interface PaginationOptions {
	id?: string;
	currentPage?: number;
	totalItems?: number;
	pageSize?: number;
	showPageNumbers?: boolean;
}

export function pagination({
	id = "table",
	currentPage = 1,
	totalItems = 8,
	pageSize = 5,
	showPageNumbers = false,
}: PaginationOptions = {}): string {
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const safePage = Math.min(Math.max(currentPage, 1), totalPages);
	const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
	const end = Math.min(safePage * pageSize, totalItems);

	return /* HTML */ `
		<div class="flex justify-between items-center mt-3" id="${id}">
			<p class="text-body-md text-fg4">
				Showing ${start}–${end} of ${totalItems}
			</p>
			<div class="flex items-center gap-2">
				<button
					type="button"
					class="px-3 py-1.5 bg-bg2 text-body-md text-fg4 rounded-xs hover:text-fg3 hover:bg-bg3/90 border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					data-page="${safePage - 1}"
					${safePage === 1 ? "disabled" : ""}
				>
					Previous
				</button>
				${showPageNumbers
					? Array.from(
							{ length: totalPages },
							(_, index) => index + 1,
						)
							.map(
								(page) => `
									<button
										type="button"
										class="min-w-8 px-2.5 py-1.5 text-body-md rounded-xs border border-border transition-colors ${page === safePage ? "bg-bg3 text-fg1" : "bg-bg2 text-fg4 hover:text-fg3 hover:bg-bg3/90"}"
										data-page="${page}"
										aria-label="Page ${page}"
										${page === safePage ? 'aria-current="page"' : ""}
									>
										${page}
									</button>
								`,
							)
							.join("")
					: ""}
				<button
					type="button"
					class="px-3 py-1.5 bg-bg2 text-body-md text-fg4 rounded-xs hover:text-fg3 hover:bg-bg3/90 border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					data-page="${safePage + 1}"
					${safePage === totalPages ? "disabled" : ""}
				>
					Next
				</button>
			</div>
		</div>
	`;
}
