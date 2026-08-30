const courses = [
  "Programming 1",
  "Programming 2",
  "Algorithms & Complexities",
  "Data Structures & Algorithms",
  "Discrete Structures I",
  "Discrete Structures II",
  "Discrete Structures III",
  "Digital Logic Design and Digital Computer Circuits",
  "Architecture and Organization with Assembly Language",
  "Networking I",
  "Networking II",
  "Web Development I",
  "Web Development II",
  "Mobile Development",
  "Information Management I",
  "Information Management II",
  "Data Analytics",
  "Technopreneurship",
]

export function sideBar() {
	return `
        <aside class="h-full sticky top-10 w-70 px-6 py-6 border-r border-border text-fg5 bg-bg1 flex flex-col items-start">
            <ol class="text-base flex flex-col gap-4">
                ${courses.map(course => `
                <li>
                    <button class="hover:text-fg4 transition-colors text-start cursor-pointer z-100">
                        ${course}
                    </button>
                </li>
                `).join('')}
            </ol>
        </aside>
    `;
}
