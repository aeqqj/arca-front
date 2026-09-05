import type { SubjectResponse } from "../../core/api/types.ts";
import { esc } from "../../core/render.ts";

export function sideBar(subjects: SubjectResponse[], activeSubject = "") {
	return `
        <aside class="sticky top-16 h-[calc(100vh-4rem)] w-70 px-6 py-6 border-r border-border text-fg5 bg-bg1 flex flex-col items-start overflow-y-auto">
            <ol class="text-base flex flex-col gap-4">
                ${subjects
					.map((s) => {
						const active = s.name === activeSubject;
						return `
                <li>
                    <a href="/?subject=${encodeURIComponent(s.name)}" class="block hover:text-fg2 transition-colors text-start cursor-pointer ${active ? "text-fg2 font-medium" : ""}">
                        ${esc(s.name)}
                    </a>
                </li>
                `;
					})
					.join("")}
            </ol>
        </aside>
    `;
}
