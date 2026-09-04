import type { FileResponse } from "../../core/api/types.ts";
import { esc, formatBytes } from "../../core/render.ts";

export function attachment(f: FileResponse) {
	return `
        <a data-file-id="${f.id}" href="#" class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 items-center hover:bg-bg5/80 transition-colors cursor-pointer">
            <div class="w-fit h-fit p-2.5 bg-bg-icon">
                <i data-lucide="file-text" class="w-4 h-4 text-fg-icon"></i> 
            </div>
            <div class="flex flex-col">
                <p class="text-sm text-fg3">${esc(f.file_name)}</p>
                <p class="text-xs text-fg5">${esc(formatBytes(f.file_size))}</p>
            </div>
        </a>
    `;
}
