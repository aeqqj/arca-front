import { esc, formatBytes } from "../../../core/render.ts";
import { initIcons } from "../../../shared/icons.ts";

// Picked files are held here and only sent after the post is created.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILES = 3;

let pickedFiles: File[] = [];

export function createAttachments() {
	return `
        <div class="w-100 flex flex-col gap-2">
            <div class="w-full flex justify-between items-center">
                <label class="text-fg2 font-medium">Attachments</label>
                <button type="button" id="attachments-add" class="p-2 hover:bg-bg5/60 transition-colors">
                    <i data-lucide="plus" class="w-4.5 h-4.5 text-fg2 pointer-events-none"></i>
                </button>
                <input type="file" id="attachments-input" class="hidden" accept="${ALLOWED_TYPES.join(",")}" multiple>
            </div>
            <div id="attachments-list" class="min-h-40 h-fit bg-bg2 border border-dashed border-border hover:bg-bg3/60 rounded-xs flex flex-col gap-4 relative transition-colors p-6">
                <p id="attachments-empty" class="text-fg5 text-sm m-auto">jpg / png / pdf — up to ${MAX_FILES} files</p>
            </div>
        </div>
    `;
}

function fileCard(f: File, index: number) {
	return `
        <div class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 items-center relative">
            <button type="button" data-remove="${index}" class="group absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-xs bg-bg5 border border-border hover:bg-bg4 transition-colors">
                <i data-lucide="x" class="w-4 h-4 text-fg5 group-hover:text-fg3 pointer-events-none transition-colors"></i>
            </button>
            <div class="w-fit h-fit p-2.5 bg-bg-icon">
                <i data-lucide="file-text" class="w-4 h-4 text-fg-icon"></i>
            </div>
            <div class="flex flex-col min-w-0 flex-1">
                <p class="text-sm text-fg3 truncate">${esc(f.name)}</p>
                <p class="text-xs text-fg5 truncate">${esc(formatBytes(f.size))}</p>
            </div>
        </div>
    `;
}

function renderList() {
	const list = document.querySelector<HTMLDivElement>("#attachments-list");
	if (!list) {
		return;
	}
	list.innerHTML =
		pickedFiles.length === 0
			? `<p id="attachments-empty" class="text-fg5 text-sm m-auto">jpg / png / pdf — up to ${MAX_FILES} files</p>`
			: pickedFiles.map((f, i) => fileCard(f, i)).join("");
	initIcons();
}

export function getSelectedFiles(): File[] {
	return pickedFiles;
}

export function clearSelectedFiles(): void {
	pickedFiles = [];
	const input =
		document.querySelector<HTMLInputElement>("#attachments-input");
	if (input) {
		input.value = "";
	}
	renderList();
}

export function bindCreateAttachments(): void {
	pickedFiles = [];
	const input =
		document.querySelector<HTMLInputElement>("#attachments-input");
	const addBtn =
		document.querySelector<HTMLButtonElement>("#attachments-add");
	const list = document.querySelector<HTMLDivElement>("#attachments-list");

	addBtn?.addEventListener("click", () => input?.click());

	input?.addEventListener("change", () => {
		const incoming = Array.from(input.files ?? []);
		for (const f of incoming) {
			if (pickedFiles.length >= MAX_FILES) {
				break;
			}
			if (!ALLOWED_TYPES.includes(f.type)) {
				continue;
			}
			if (
				!pickedFiles.some((p) => p.name === f.name && p.size === f.size)
			) {
				pickedFiles.push(f);
			}
		}
		if (input) {
			input.value = "";
		}
		renderList();
	});

	// remove is delegated so it survives list re-renders
	list?.addEventListener("click", (e) => {
		const btn = (e.target as Element).closest?.("[data-remove]");
		if (!btn) {
			return;
		}
		const index = Number(btn.getAttribute("data-remove"));
		pickedFiles.splice(index, 1);
		renderList();
	});
}
