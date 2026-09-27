export interface DropdownOption {
	value: string;
	label: string;
}

export function dropdown(
	id: string,
	value: string,
	options: DropdownOption[],
	placeholder: string,
): string {
	const selected = options.find((o) => o.value === value);

	return /* HTML */ `
		<div class="relative" id="dropdown-${id}">
			<button
				type="button"
				class="flex items-center justify-between gap-2 w-38 px-3 py-2 rounded-xs border border-border bg-bg1 text-body-sm outline-none focus:border-fg4/40 hover:bg-bg2/90 transition-colors"
				data-dropdown-trigger="${id}"
			>
				<span class="${selected ? "text-fg1" : "text-fg-placeholder"}">
					${selected ? selected.label : placeholder}
				</span>
				<i
					data-lucide="chevron-down"
					class="w-4 h-4 text-fg3 transition-transform"
				></i>
			</button>
			<ul
				class="absolute top-full left-0 mt-1 min-w-full w-max border border-border rounded-xs bg-bg1 shadow-md z-10 overflow-hidden py-1 hidden"
				data-dropdown-menu="${id}"
			>
				<li
					class="flex items-center justify-between px-3 py-2 text-body-sm cursor-pointer hover:bg-bg2 text-fg4"
					data-dropdown-value=""
					data-dropdown-id="${id}"
				>
					${placeholder}
				</li>
				${options
					.map(
						(option) => `
                    <li class="flex text-fg2 items-center justify-between px-3 py-2 text-body-sm cursor-pointer hover:bg-bg2"
                        data-dropdown-value="${option.value}" data-dropdown-id="${id}">
                        ${option.label}
                        ${option.value === value ? '<i data-lucide="check" class="w-4 h-4 text-fg1"></i>' : ""}
                    </li>
                `,
					)
					.join("")}
			</ul>
		</div>
	`;
}

export function bindDropdown(
	id: string,
	options: DropdownOption[],
	placeholder: string,
	onChange: (value: string) => void,
) {
	const trigger = document.querySelector<HTMLButtonElement>(
		`[data-dropdown-trigger="${id}"]`,
	);
	const menu = document.querySelector<HTMLUListElement>(
		`[data-dropdown-menu="${id}"]`,
	);

	if (!trigger || !menu) return;

	function updateLabel(selectedValue: string) {
		if (!trigger || !menu) return;
		const label = trigger.querySelector("span")!;
		const option = options.find((o) => o.value === selectedValue);
		label.textContent = option ? option.label : placeholder;
		label.className = option ? "text-fg1" : "text-fg-placeholder";

		menu.querySelectorAll("[data-dropdown-value]").forEach((item) => {
			const existingCheck = item.querySelector("[data-lucide='check']");
			if (existingCheck) existingCheck.remove();
		});

		if (option) {
			const selectedItem = menu.querySelector(
				`[data-dropdown-value="${selectedValue}"]`,
			);
			if (selectedItem) {
				selectedItem.insertAdjacentHTML(
					"beforeend",
					'<i data-lucide="check" class="w-4 h-4 text-fg1"></i>',
				);
			}
		}
	}

	trigger.addEventListener("click", (e) => {
		e.stopPropagation();
		const isOpen = !menu.classList.contains("hidden");

		document
			.querySelectorAll("[data-dropdown-menu]")
			.forEach((m) => m.classList.add("hidden"));
		document
			.querySelectorAll("[data-lucide='chevron-down']")
			.forEach((icon) => {
				(icon as HTMLElement).style.transform = "";
			});

		if (!isOpen) {
			menu.classList.remove("hidden");
			(
				trigger.querySelector(
					"[data-lucide='chevron-down']",
				) as HTMLElement
			).style.transform = "rotate(180deg)";
		}
	});

	menu.querySelectorAll("[data-dropdown-value]").forEach((item) => {
		item.addEventListener("click", () => {
			const selectedValue = (item as HTMLElement).dataset.dropdownValue!;
			onChange(selectedValue);
			updateLabel(selectedValue);
			menu.classList.add("hidden");
			(
				trigger.querySelector(
					"[data-lucide='chevron-down']",
				) as HTMLElement
			).style.transform = "";
		});
	});

	document.addEventListener("mousedown", (e: MouseEvent) => {
		const container = document.getElementById(`dropdown-${id}`);
		if (container && !container.contains(e.target as Node)) {
			menu.classList.add("hidden");
			(
				trigger.querySelector(
					"[data-lucide='chevron-down']",
				) as HTMLElement
			).style.transform = "";
		}
	});
}
