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

const PAGE_SIZE = 15;
let currentSort: CourseSortConfig = { field: "id", direction: "asc" };
let currentPage = 1;
let searchQuery = "";
let departmentFilter = "";

function getFilteredAndSortedCourses(): Course[] {
	const query = searchQuery.trim().toLocaleLowerCase();
	const filtered = mockCourses.filter((course) => {
		const searchableText = [
			course.id,
			course.name,
			course.code,
			course.department,
			course.created,
		]
			.join(" ")
			.toLocaleLowerCase();
		return (
			(!query || searchableText.includes(query)) &&
			(!departmentFilter || course.department === departmentFilter)
		);
	});
	return sortCourses(filtered);
}

function sortCourses(courses: Course[]): Course[] {
	return [...courses].sort((a, b) => {
		const key = currentSort.field as keyof Course;
		const valA = a[key];
		const valB = b[key];
		if (currentSort.field === "created") {
			const comparison = Date.parse(a.created) - Date.parse(b.created);
			return currentSort.direction === "asc" ? comparison : -comparison;
		}
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

function getPageData() {
	const filteredCourses = getFilteredAndSortedCourses();
	const totalPages = Math.max(
		1,
		Math.ceil(filteredCourses.length / PAGE_SIZE),
	);
	currentPage = Math.min(currentPage, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;
	return {
		filteredCourses,
		pageCourses: filteredCourses.slice(start, start + PAGE_SIZE),
	};
}

function renderCourses() {
	const { filteredCourses, pageCourses } = getPageData();
	const container = document.getElementById("courses-table-container");
	const paginationContainer = document.getElementById(
		"courses-pagination-container",
	);
	if (!container || !paginationContainer) return;
	container.innerHTML = coursesTable(pageCourses, currentSort);
	paginationContainer.innerHTML = pagination({
		id: "courses-pagination",
		currentPage,
		totalItems: filteredCourses.length,
		pageSize: PAGE_SIZE,
		showPageNumbers: true,
	});
	initIcons(container);
	bindCourseTableSort(handleSort, container);
	paginationContainer
		.querySelectorAll<HTMLButtonElement>("[data-page]")
		.forEach((button) =>
			button.addEventListener("click", () => {
				if (button.disabled) return;
				currentPage = Number(button.dataset.page);
				renderCourses();
			}),
		);
}

function handleSort(field: string) {
	currentSort = {
		field,
		direction:
			currentSort.field === field && currentSort.direction === "asc"
				? "desc"
				: "asc",
	};
	currentPage = 1;
	renderCourses();
}

export function AdminCoursesPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Courses")}
                <div class="flex-1 min-h-0 overflow-y-auto p-8 w-full">
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="flex-1">
                                ${tableSearchBar({ value: searchQuery })}
                            </div>
                            <div class="flex gap-3">
                                ${dropdown("filter-department", departmentFilter, departmentOptions, "All departments")}
                            </div>
                        </div>
                        <div id="courses-table-container" class="admin-table-container"></div>
                        <div id="courses-pagination-container"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
	initIcons();
	document
		.getElementById("table-search")
		?.addEventListener("input", (event) => {
			searchQuery = (event.target as HTMLInputElement).value;
			currentPage = 1;
			renderCourses();
		});
	bindDropdown(
		"filter-department",
		departmentOptions,
		"All departments",
		(value) => {
			departmentFilter = value;
			currentPage = 1;
			renderCourses();
		},
	);
	renderCourses();
}
