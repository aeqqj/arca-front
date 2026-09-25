import type { Post } from "./postFullView.ts";

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

export function postsTable(posts: Post[], selectedId: number | null) {
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
					<th>Title</th>
					<th>Author</th>
					<th>Department</th>
					<th>Tag</th>
					<th class="text-right">Created</th>
				</tr>
			</thead>
			<tbody>
				${posts
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
