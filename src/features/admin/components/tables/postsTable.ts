import type { Post } from "../posts/postTypes.ts";

export type PostSortField =
	| "title"
	| "author"
	| "department"
	| "tag"
	| "created";

export interface PostSortConfig {
	field: PostSortField;
	direction: "asc" | "desc";
}

function formatRelativeTime(dateStr: string): string {
	if (!dateStr) return "—";
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffHr = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHr / 24);

	if (diffMin < 1) return "just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	if (diffHr < 24) return `${diffHr}h ago`;
	if (diffDay < 7) return `${diffDay}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function sortIndicator(field: PostSortField, sort: PostSortConfig): string {
	if (sort.field !== field) return "";
	const icon = sort.direction === "asc" ? "arrow-up" : "arrow-down";
	return `<i data-lucide="${icon}" class="w-3 h-3 ml-1 inline"></i>`;
}

function tableHeader(
	label: string,
	field: PostSortField,
	sort?: PostSortConfig,
	className = "",
): string {
	if (!sort) return `<th class="${className}">${label}</th>`;

	return /* HTML */ `
		<th
			class="cursor-pointer select-none hover:text-fg1 transition-colors ${className}"
			data-post-sort="${field}"
			aria-sort="${sort.field === field
				? sort.direction === "asc"
					? "ascending"
					: "descending"
				: "none"}"
		>
			${label}${sortIndicator(field, sort)}
		</th>
	`;
}

export function postsTable(
	posts: Post[],
	selectedId: number | null,
	sort?: PostSortConfig,
) {
	return /* HTML */ `
		<table class="data-table w-full table-layout-fixed">
			<colgroup>
				<col class="w-[30%]" />
				<col class="w-[18%]" />
				<col class="w-[17%]" />
				<col class="w-[18%]" />
				<col class="w-[17%]" />
			</colgroup>
			<thead>
				<tr>
					${tableHeader("Title", "title", sort)}
					${tableHeader("Author", "author", sort)}
					${tableHeader("Department", "department", sort)}
					${tableHeader("Tag", "tag", sort)}
					${tableHeader("Created", "created", sort, "text-right")}
				</tr>
			</thead>
			<tbody>
				${posts.length === 0
					? '<tr><td colspan="5" class="text-center text-fg5 py-12">No posts found</td></tr>'
					: posts
							.map(
								(post) => `
					<tr class="hover:bg-bg2/90 transition-colors ${selectedId === post.id ? "row-selected" : ""}" data-post-id="${post.id}">
						<td class="text-fg2 truncate">${post.title}</td>
						<td class="text-fg3 truncate">${post.firstName} ${post.lastName}</td>
						<td class="text-fg3 truncate">${post.departmentName}</td>
						<td class="text-fg3 truncate">${post.postTag || "—"}</td>
						<td class="text-right text-fg4 truncate">${formatRelativeTime(post.createdAt)}</td>
					</tr>
				`,
							)
							.join("")}
			</tbody>
		</table>
	`;
}

export function bindPostTableSort(
	onSort: (field: PostSortField) => void,
): void {
	document.querySelectorAll<HTMLElement>("[data-post-sort]").forEach((el) => {
		el.addEventListener("click", () => {
			onSort(el.dataset.postSort as PostSortField);
		});
	});
}
