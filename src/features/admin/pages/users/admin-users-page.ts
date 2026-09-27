import { initIcons } from "../../../../shared/icons.ts";
import { adminHeader } from "../../components/layout/adminHeader.ts";
import { adminSideBar } from "../../components/layout/adminSideBar.ts";
import {
	usersTable,
	bindUserTableSort,
	type User,
	type UserSortConfig,
} from "../../components/tables/usersTable.ts";
import { tableSearchBar } from "../../components/controls/tableSearchBar.ts";
import { filters, bindFilters } from "../../components/controls/filters.ts";
import { pagination } from "../../components/controls/pagination.ts";
import { mockUsers } from "./mock-data.ts";

const PAGE_SIZE = 15;
let currentSort: UserSortConfig = { field: "id", direction: "asc" };
let currentPage = 1;
let searchQuery = "";
let roleFilter = "";
let departmentFilter = "";

function getFilteredAndSortedUsers(): User[] {
	const query = searchQuery.trim().toLocaleLowerCase();
	const filtered = mockUsers.filter((user) => {
		const searchableText = [
			user.id,
			user.first_name,
			user.last_name,
			user.email,
			user.role,
			user.department,
			user.course,
			user.created,
		]
			.join(" ")
			.toLocaleLowerCase();
		return (
			(!query || searchableText.includes(query)) &&
			(!roleFilter || user.role === roleFilter) &&
			(!departmentFilter || user.department === departmentFilter)
		);
	});

	return sortUsers(filtered);
}

function sortUsers(users: User[]): User[] {
	return [...users].sort((a, b) => {
		const key = currentSort.field as keyof User;
		const valA = a[key];
		const valB = b[key];
		if (currentSort.field === "name") {
			const comparison = `${a.first_name} ${a.last_name}`.localeCompare(
				`${b.first_name} ${b.last_name}`,
			);
			return currentSort.direction === "asc" ? comparison : -comparison;
		}
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
	const filteredUsers = getFilteredAndSortedUsers();
	const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
	currentPage = Math.min(currentPage, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;
	return {
		filteredUsers,
		pageUsers: filteredUsers.slice(start, start + PAGE_SIZE),
	};
}

function renderUsers() {
	const { filteredUsers, pageUsers } = getPageData();
	const container = document.getElementById("users-table-container");
	const paginationContainer = document.getElementById(
		"users-pagination-container",
	);
	if (!container || !paginationContainer) return;
	container.innerHTML = usersTable(pageUsers, currentSort);
	paginationContainer.innerHTML = pagination({
		id: "users-pagination",
		currentPage,
		totalItems: filteredUsers.length,
		pageSize: PAGE_SIZE,
		showPageNumbers: true,
	});
	initIcons(container);
	bindUserTableSort(handleSort, container);
	bindPagination(paginationContainer);
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
	renderUsers();
}

function bindPagination(container: HTMLElement) {
	container
		.querySelectorAll<HTMLButtonElement>("[data-page]")
		.forEach((button) =>
			button.addEventListener("click", () => {
				if (button.disabled) return;
				currentPage = Number(button.dataset.page);
				renderUsers();
			}),
		);
}

export function AdminUsersPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Users")}
                <div class="flex-1 min-h-0 overflow-y-auto p-8 w-full">
                    <div class="flex flex-col gap-3">
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="flex-1">
                                ${tableSearchBar({ value: searchQuery })}
                            </div>
                            ${filters()}
                        </div>
                        <div id="users-table-container" class="admin-table-container"></div>
                        <div id="users-pagination-container"></div>
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
			renderUsers();
		});
	bindFilters((filter) => {
		if (filter.type === "role") roleFilter = filter.value;
		if (filter.type === "department") departmentFilter = filter.value;
		currentPage = 1;
		renderUsers();
	});
	renderUsers();
}
