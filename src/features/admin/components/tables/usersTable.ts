import avatarPlaceholder from "/dog.png";
import { tableEmptyRow } from "./tableEmptyRow.ts";

export interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	role: string;
	department: string;
	course: string;
	created: string;
}

export interface UserSortConfig {
	field: string;
	direction: "asc" | "desc";
}

function sortIndicator(field: string, sort: UserSortConfig): string {
	if (sort.field === field && sort.direction === "asc") {
		return '<i data-lucide="arrow-up" class="w-3 h-3 ml-1 inline"></i>';
	}
	if (sort.field === field && sort.direction === "desc") {
		return '<i data-lucide="arrow-down" class="w-3 h-3 ml-1 inline"></i>';
	}
	return "";
}

export function usersTable(users: User[], sort: UserSortConfig) {
	return /* HTML */ `
		<table class="data-table data-table--users">
			<colgroup>
				<col class="w-[5%]" />
				<col class="w-[20%]" />
				<col class="w-[22%]" />
				<col class="w-[8%]" />
				<col class="w-[10%]" />
				<col class="w-[10%]" />
				<col class="w-[15%]" />
				<col class="w-[10%]" />
			</colgroup>
			<thead>
				<tr>
					<th data-sort="id">ID${sortIndicator("id", sort)}</th>
					<th data-sort="name">Name${sortIndicator("name", sort)}</th>
					<th data-sort="email">
						Email${sortIndicator("email", sort)}
					</th>
					<th data-sort="role">Role${sortIndicator("role", sort)}</th>
					<th data-sort="department">
						Department${sortIndicator("department", sort)}
					</th>
					<th data-sort="course">
						Course${sortIndicator("course", sort)}
					</th>
					<th data-sort="created">
						Created${sortIndicator("created", sort)}
					</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				${users.length === 0
					? tableEmptyRow(8, "No users found")
					: users
							.map(
								(user) => `
                <tr>
                    <td class="text-fg4 truncate">${user.id}</td>
                    <td>
                        <div class="flex items-center gap-2">
                            <img src="${avatarPlaceholder}" class="w-6 h-6 rounded-xs shrink-0 object-cover" />
                            <span class="truncate text-fg2">${user.first_name} ${user.last_name}</span>
                        </div>
                    </td>
                    <td class="text-fg3 truncate">${user.email}</td>
                    <td class="${user.role === "ADMIN" ? "text-blue-200" : "text-fg4"} truncate">${user.role}</td>
                    <td class="text-fg3 truncate">${user.department}</td>
                    <td class="text-fg3 truncate">${user.course}</td>
                    <td class="text-fg4 truncate">${user.created}</td>
                    <td class="text-right">
                        <button class="data-table-action">
                            <i data-lucide="ellipsis" class="w-3 h-3"></i>
                        </button>
                    </td>
                </tr>
            `,
							)
							.join("")}
			</tbody>
		</table>
	`;
}

export function bindUserTableSort(
	onSort: (field: string) => void,
	root: ParentNode = document,
) {
	root.querySelectorAll("[data-sort]").forEach((el) => {
		el.addEventListener("click", () => {
			onSort(el.getAttribute("data-sort")!);
		});
	});
}
