import { initIcons } from "../../shared/icons.ts";
import { adminHeader } from "./components/adminHeader.ts";
import { adminSideBar } from "./components/adminSideBar.ts";
import { postsTable } from "./components/postsTable.ts";
import { postFullView, type Post } from "./components/postFullView.ts";
import { pagination } from "./components/pagination.ts";

const mockPosts: Post[] = [
	{
		id: 2,
		title: "docker containers are basically just chroot with marketing",
		content:
			"Everyone acts like Docker is revolutionary but it's literally just chroot on steroids. The real innovation is the ecosystem and tooling, not the technology itself.",
		firstName: "Jane",
		lastName: "Smith",
		departmentName: "DCISM",
		postTag: "Software Engineering",
		status: "PENDING_APPROVAL",
		createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
		upvoteCount: 15,
		downvoteCount: 8,
	},
	{
		id: 6,
		title: "How I built a real-time chat app with WebSockets",
		content:
			"Step by step guide to building a real-time chat application using Node.js and WebSockets. Includes handling reconnections, message queuing, and room management.",
		firstName: "Maria",
		lastName: "Santos",
		departmentName: "DCISM",
		postTag: "Web Development",
		status: "PENDING_APPROVAL",
		createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
		upvoteCount: 7,
		downvoteCount: 1,
		hasGithub: true,
	},
	{
		id: 8,
		title: "Linux terminal commands cheat sheet for CS students",
		content:
			"A comprehensive cheat sheet covering file operations, process management, networking, and text processing commands you'll actually use in your courses.",
		firstName: "Lisa",
		lastName: "Tan",
		departmentName: "DCISM",
		postTag: "Operating Systems",
		status: "PENDING_APPROVAL",
		createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
		upvoteCount: 12,
		downvoteCount: 0,
	},
];

let selectedPost: Post | null = null;

function renderPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Posts")}
                <div class="flex-1 overflow-hidden p-8 flex flex-col gap-3">
                    <div class="flex flex-1 min-h-0 gap-4">
                        <div class="w-1/2 min-w-0 flex flex-col gap-3">
                            <div id="posts-table-container" class="flex-1 min-h-0 overflow-y-auto">
                                ${postsTable(mockPosts, selectedPost?.id ?? null)}
                            </div>
                            ${pagination()}
                        </div>
                        <div class="w-1/2 shrink-0 border border-border bg-bg2 rounded-xs overflow-y-auto">
                            ${selectedPost ? postFullView(selectedPost) : `<div class="flex flex-col items-center justify-center h-full text-fg5 gap-3"><i data-lucide="file-text" class="w-10 h-10"></i><p class="text-body-md">Select a post to preview</p></div>`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	initIcons();
	bindRowClicks();
}

function bindRowClicks() {
	document
		.querySelectorAll<HTMLTableRowElement>("[data-post-id]")
		.forEach((row) => {
			row.addEventListener("click", () => {
				const id = Number(row.dataset.postId);
				selectedPost =
					selectedPost?.id === id
						? null
						: (mockPosts.find((p) => p.id === id) ?? null);
				renderPage();
			});
		});
}

export function AdminPostsPage() {
	renderPage();
}
