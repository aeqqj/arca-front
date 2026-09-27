export interface Course {
	id: number;
	name: string;
	code: string;
	department: string;
	created: string;
}

export interface CourseSortConfig {
	field: string;
	direction: "asc" | "desc";
}

function sortIndicator(field: string, sort: CourseSortConfig): string {
	if (sort.field === field && sort.direction === "asc") {
		return '<i data-lucide="arrow-up" class="w-3 h-3 ml-1 inline"></i>';
	}
	if (sort.field === field && sort.direction === "desc") {
		return '<i data-lucide="arrow-down" class="w-3 h-3 ml-1 inline"></i>';
	}
	return "";
}

export function coursesTable(courses: Course[], sort: CourseSortConfig) {
	const thClass =
		"cursor-pointer select-none hover:text-fg2 transition-colors";

	return /* HTML */ `
		<table class="data-table w-full table-layout-fixed">
			<colgroup>
				<col class="w-[8%]" />
				<col class="w-[32%]" />
				<col class="w-[15%]" />
				<col class="w-[15%]" />
				<col class="w-[20%]" />
				<col class="w-[10%]" />
			</colgroup>
			<thead>
				<tr>
					<th class="${thClass}" data-sort="id">
						ID${sortIndicator("id", sort)}
					</th>
					<th class="${thClass}" data-sort="name">
						Course${sortIndicator("name", sort)}
					</th>
					<th class="${thClass}" data-sort="code">
						Code${sortIndicator("code", sort)}
					</th>
					<th class="${thClass}" data-sort="department">
						Department${sortIndicator("department", sort)}
					</th>
					<th class="${thClass}" data-sort="created">
						Created${sortIndicator("created", sort)}
					</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				${courses
					.map(
						(course) => `
                <tr class="hover:bg-bg2/90 transition-colors">
                    <td class="text-fg4 truncate">${course.id}</td>
                    <td class="text-fg2 truncate">${course.name}</td>
                    <td class="text-fg3 truncate">${course.code}</td>
                    <td class="text-fg3 truncate">${course.department}</td>
                    <td class="text-fg4 truncate">${course.created}</td>
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

export function bindCourseTableSort(onSort: (field: string) => void) {
	document.querySelectorAll("[data-sort]").forEach((el) => {
		el.addEventListener("click", () => {
			onSort(el.getAttribute("data-sort")!);
		});
	});
}
