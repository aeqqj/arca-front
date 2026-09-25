import { dropdown, bindDropdown, type DropdownOption } from "./dropdown.ts";

const ROLE_OPTIONS: DropdownOption[] = [
	{ value: "ADMIN", label: "Admin" },
	{ value: "USER", label: "User" },
];

const DEPARTMENT_OPTIONS: DropdownOption[] = [
	{ value: "DCISM", label: "DCISM" },
];

export function filters(): string {
	return /* HTML */ `
		<div class="flex gap-3">
			${dropdown("filter-role", "", ROLE_OPTIONS, "All roles")}
			${dropdown(
				"filter-department",
				"",
				DEPARTMENT_OPTIONS,
				"All departments",
			)}
		</div>
	`;
}

export function bindFilters(
	onChange: (filter: { type: string; value: string }) => void,
) {
	bindDropdown("filter-role", ROLE_OPTIONS, "All roles", (value) =>
		onChange({ type: "role", value }),
	);
	bindDropdown(
		"filter-department",
		DEPARTMENT_OPTIONS,
		"All departments",
		(value) => onChange({ type: "department", value }),
	);
}
