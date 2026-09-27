import { tableEmptyRow } from "./tableEmptyRow.ts";

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
	return /* HTML */ `
		<table class="data-table data-table--courses">
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
					<th data-sort="id">ID${sortIndicator("id", sort)}</th>
					<th data-sort="name">
						Course${sortIndicator("name", sort)}
					</th>
					<th data-sort="code">Code${sortIndicator("code", sort)}</th>
					<th data-sort="department">
						Department${sortIndicator("department", sort)}
					</th>
					<th data-sort="created">
						Created${sortIndicator("created", sort)}
					</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				${courses.length === 0
					? tableEmptyRow(6, "No courses found")
					: courses
							.map(
								(course) => `
                <tr>
                    <td class="text-fg4 truncate">${course.id}</td>
                    <td class="text-fg2 truncate">${course.name}</td>
                    <td class="text-fg3 truncate">${course.code}</td>
                    <td class="text-fg3 truncate">${course.department}</td>
                    <td class="text-fg4 truncate">${course.created}</td>
                    <td class="text-right">
                        <button class="data-table-action">
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

export function bindCourseTableSort(
	onSort: (field: string) => void,
	root: ParentNode = document,
) {
	root.querySelectorAll("[data-sort]").forEach((el) => {
		el.addEventListener("click", () => {
			onSort(el.getAttribute("data-sort")!);
		});
	});
}
