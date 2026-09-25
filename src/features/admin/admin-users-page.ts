import { initIcons } from "../../shared/icons.ts";
import { adminHeader } from "./components/adminHeader.ts";
import { adminSideBar } from "./components/adminSideBar.ts";
import {
	usersTable,
	bindUserTableSort,
	type User,
	type SortConfig,
} from "./components/usersTable.ts";
import { tableSearchBar } from "./components/tableSearchBar.ts";
import { filters, bindFilters } from "./components/filters.ts";
import { pagination } from "./components/pagination.ts";

const mockUsers: User[] = [
	{
		id: 1,
		first_name: "John",
		last_name: "Doe",
		email: "john@dcism.com",
		role: "ADMIN",
		department: "DCISM",
		course: "BS CS",
		created: "Sep 1, 2026",
	},
	{
		id: 2,
		first_name: "Jane",
		last_name: "Smith",
		email: "jane@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 5, 2026",
	},
	{
		id: 3,
		first_name: "Mike",
		last_name: "Chen",
		email: "mike@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS CS",
		created: "Sep 10, 2026",
	},
	{
		id: 4,
		first_name: "Anna",
		last_name: "Reyes",
		email: "anna@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IM",
		created: "Sep 12, 2026",
	},
	{
		id: 5,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 6,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 7,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 8,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 9,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 10,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 11,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 12,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 13,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 14,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
	{
		id: 15,
		first_name: "Carlos",
		last_name: "Garcia",
		email: "carlos@dcism.com",
		role: "USER",
		department: "DCISM",
		course: "BS IT",
		created: "Sep 15, 2026",
	},
];

let currentSort: SortConfig = { field: "id", direction: "asc" };

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
