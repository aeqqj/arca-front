import { initIcons } from "../../../../shared/icons.ts";
import { adminHeader } from "../../components/layout/adminHeader.ts";
import { adminSideBar } from "../../components/layout/adminSideBar.ts";
import {
	coursesTable,
	bindCourseTableSort,
	type Course,
	type CourseSortConfig,
} from "../../components/tables/coursesTable.ts";
import { tableSearchBar } from "../../components/controls/tableSearchBar.ts";
import { dropdown, bindDropdown } from "../../components/controls/dropdown.ts";
import { pagination } from "../../components/controls/pagination.ts";
import { departmentOptions, mockCourses } from "./mock-data.ts";

let currentSort: CourseSortConfig = { field: "id", direction: "asc" };

function sortCourses(courses: Course[]): Course[] {
	return [...courses].sort((a, b) => {
		const key = currentSort.field as keyof Course;
		const valA = a[key];
		const valB = b[key];

		if (typeof valA === "string" && typeof valB === "string") {
			const cmp = valA.localeCompare(valB);
			return currentSort.direction === "asc" ? cmp : -cmp;
		}

		if (typeof valA === "number" && typeof valB === "number") {
			return currentSort.direction === "asc" ? valA - valB : valB - valA;
		}

		return 0;
	});
}

function renderCourses() {
	const sorted = sortCourses(mockCourses);
	const container = document.getElementById("courses-table-container");
	if (!container) return;
	container.innerHTML = coursesTable(sorted, currentSort);
	initIcons();
	bindCourseTableSort(handleSort);
}

function handleSort(field: string) {
	if (currentSort.field === field) {
		currentSort = {
			field,
			direction: currentSort.direction === "asc" ? "desc" : "asc",
		};
	} else {
		currentSort = { field, direction: "asc" };
	}
	renderCourses();
}

export function AdminCoursesPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Courses")}
                <div class="p-8 w-full">
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="flex-1">
                                ${tableSearchBar()}
                            </div>
                            <div class="flex gap-3">
                                ${dropdown("filter-department", "", departmentOptions, "All departments")}
                            </div>
                        </div>
                        <div id="courses-table-container">
                            ${coursesTable(sortCourses(mockCourses), currentSort)}
                        </div>
                        ${pagination()}
                        <div id="empty-state" class="hidden flex-col items-center justify-center py-16 border border-border bg-bg1 rounded-xs">
                            <p class="text-body-md font-medium text-fg2">No courses found</p>
                            <p class="text-body-sm text-fg4">Try adjusting your search or filters.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	initIcons();
	bindCourseTableSort(handleSort);
	bindDropdown(
		"filter-department",
		departmentOptions,
		"All departments",
		(value) => console.log("Filter changed:", value),
	);
}
