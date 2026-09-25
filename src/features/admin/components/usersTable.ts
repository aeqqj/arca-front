import avatarPlaceholder from "/dog.png";

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

export interface SortConfig {
	field: string;
	direction: "asc" | "desc";
}

function sortIndicator(field: string, sort: SortConfig): string {
	if (sort.field === field && sort.direction === "asc") {
		return '<i data-lucide="arrow-up" class="w-3 h-3 ml-1 inline"></i>';
	}
	if (sort.field === field && sort.direction === "desc") {
		return '<i data-lucide="arrow-down" class="w-3 h-3 ml-1 inline"></i>';
	}
	return "";
}

export function usersTable(users: User[], sort: SortConfig) {
	const thClass =
		"cursor-pointer select-none hover:text-fg2 transition-colors";

	return /* HTML */ `
		<table class="data-table w-full table-layout-fixed">
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
					<th class="${thClass}" data-sort="id">
						ID${sortIndicator("id", sort)}
					</th>
					<th class="${thClass}" data-sort="name">
						Name${sortIndicator("name", sort)}
					</th>
					<th class="${thClass}" data-sort="email">
						Email${sortIndicator("email", sort)}
					</th>
					<th class="${thClass}" data-sort="role">
						Role${sortIndicator("role", sort)}
					</th>
					<th class="${thClass}" data-sort="department">
						Department${sortIndicator("department", sort)}
					</th>
					<th class="${thClass}" data-sort="course">
						Course${sortIndicator("course", sort)}
					</th>
					<th class="${thClass}" data-sort="created">
						Created${sortIndicator("created", sort)}
					</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				${users
					.map(
						(user) => `
                <tr class="hover:bg-bg2/90 transition-colors">
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
                        <button class="p-1.5 rounded-xs hover:bg-bg3 transition-colors">
                            <i data-lucide="ellipsis" class="w-4 h-4"></i>
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

export function bindUserTableSort(onSort: (field: string) => void) {
	document.querySelectorAll("[data-sort]").forEach((el) => {
		el.addEventListener("click", () => {
			onSort(el.getAttribute("data-sort")!);
		});
	});
}
