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

let currentSort: UserSortConfig = { field: "id", direction: "asc" };

function sortUsers(users: User[]): User[] {
	return [...users].sort((a, b) => {
		const key = currentSort.field as keyof User;
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

function renderUsers() {
	const sorted = sortUsers(mockUsers);
	const container = document.getElementById("users-table-container");
	if (!container) return;
	container.innerHTML = usersTable(sorted, currentSort);
	initIcons();
	bindUserTableSort(handleSort);
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
	renderUsers();
}

export function AdminUsersPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Users")}
                <div class="p-8 w-full">
                    <div class="flex flex-col gap-3">
                        <div class="flex items-center gap-3">
                            <div class="flex-1">
                                ${tableSearchBar()}
                            </div>
                            ${filters()}
                        </div>
                        <div id="users-table-container">
                            ${usersTable(sortUsers(mockUsers), currentSort)}
                        </div>
                        ${pagination()}
                        <div id="empty-state" class="hidden flex-col items-center justify-center py-16 border border-border bg-bg1 rounded-xs">
                            <p class="text-body-md font-medium text-fg2">No users found</p>
                            <p class="text-body-sm text-fg4">Try adjusting your search or filters.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	initIcons();
	bindUserTableSort(handleSort);
	bindFilters((filter) => {
		console.log("Filter changed:", filter);
	});
}
